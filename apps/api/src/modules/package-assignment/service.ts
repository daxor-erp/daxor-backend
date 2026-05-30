import { GraphQLValidationError } from '@repo/errors'
import { OrganizationRepository } from '../organization/repository'
import { PackageRepository } from '../package/repository'
import { PackageAssignmentRepository } from './repository'

export interface PackageEnabledModuleInput {
	moduleKey: string
	submoduleKey: string
}

export class PackageAssignmentService {
	private repository: PackageAssignmentRepository
	private packageRepository: PackageRepository
	private organizationRepository: OrganizationRepository

	constructor() {
		this.repository = new PackageAssignmentRepository()
		this.packageRepository = new PackageRepository()
		this.organizationRepository = new OrganizationRepository()
	}

	private normalizeModules(modules: PackageEnabledModuleInput[]): PackageEnabledModuleInput[] {
		const seen = new Set<string>()
		const out: PackageEnabledModuleInput[] = []
		for (const row of modules) {
			const moduleKey = String(row.moduleKey ?? '').trim()
			const submoduleKey = String(row.submoduleKey ?? '').trim()
			if (!moduleKey || !submoduleKey) continue
			const key = `${moduleKey}::${submoduleKey}`
			if (seen.has(key)) continue
			seen.add(key)
			out.push({ moduleKey, submoduleKey })
		}
		return out
	}

	async getAssignment(packageId: string, organizationId: string): Promise<any | null> {
		return this.repository.findByPackageAndOrg(packageId, organizationId)
	}

	async listAssignmentsForPackage(packageId: string): Promise<any[]> {
		return this.repository.listByPackage(packageId)
	}

	async getEnabledModulesForOrganization(organizationId: string): Promise<PackageEnabledModuleInput[] | null> {
		if (!organizationId) return null
		const org = await this.organizationRepository.findById(organizationId)
		if (!org || org.deletedAt || !org.packageId) return null

		const assignment = await this.repository.findByPackageAndOrg(String(org.packageId), organizationId)
		if (!assignment?.enabledModules?.length) return null
		return this.normalizeModules(assignment.enabledModules)
	}

	async setAssignment(
		packageId: string,
		organizationId: string,
		enabledModules: PackageEnabledModuleInput[],
		userId?: string,
	): Promise<any> {
		const pkg = await this.packageRepository.findById(packageId)
		if (!pkg || pkg.deletedAt) throw new GraphQLValidationError('Package not found')

		const org = await this.organizationRepository.findById(organizationId)
		if (!org || org.deletedAt) throw new GraphQLValidationError('Organization not found')

		const normalized = this.normalizeModules(enabledModules)
		if (!normalized.length) {
			throw new GraphQLValidationError('Select at least one module for this package assignment')
		}

		const existing = await this.repository.findByPackageAndOrg(packageId, organizationId)
		let assignment
		if (existing) {
			assignment = await this.repository.update(String(existing._id), {
				enabledModules: normalized,
				updatedBy: userId,
			} as any)
		} else {
			assignment = await this.repository.create({
				packageId,
				organizationId,
				enabledModules: normalized,
				updatedBy: userId,
			})
		}

		await this.organizationRepository.update(organizationId, {
			packageId,
			updatedAt: new Date(),
		} as any)

		return assignment
	}

	async deleteAssignment(packageId: string, organizationId: string): Promise<boolean> {
		const existing = await this.repository.findByPackageAndOrg(packageId, organizationId)
		if (!existing) throw new GraphQLValidationError('Assignment not found')

		await this.repository.delete(String(existing._id))

		const org = await this.organizationRepository.findById(organizationId)
		if (org && !org.deletedAt && org.packageId != null && String(org.packageId) === String(packageId)) {
			await this.organizationRepository.update(organizationId, {
				packageId: null,
				updatedAt: new Date(),
			} as any)
		}

		return true
	}
}
