import { GraphQLValidationError } from '@repo/errors'
import { userIdForRef } from '~/lib/user-ref'
import { VendorRepository } from './repository'
import { getNextSequence } from '../counter'
import { formatEntitySequence } from '../../lib/sequence'
import { TagService } from '../tag/service'
import { BankService } from '../bank/service'
import { AuditLogService } from '../audit-log/service'
import { isValidGstinFormat } from '../tax-compliance/providers/gstin-provider'
import { isValidPanFormat } from '../tax-compliance/providers/pan-provider'

const tagService = new TagService()
const bankService = new BankService()
const auditLogService = new AuditLogService()

type AnyRecord = Record<string, unknown>

export class VendorService {
  private repository: VendorRepository

  constructor() {
    this.repository = new VendorRepository()
  }

  /** Validate GSTIN/PAN format when present (Check Status / lookup happen client-side before save). */
  private validateTaxFields(data: AnyRecord): void {
    const gstin = data.gstin != null ? String(data.gstin).trim() : ''
    if (gstin && !isValidGstinFormat(gstin)) {
      throw new GraphQLValidationError('GSTIN format is invalid. Run "Check Status" to verify before saving.')
    }
    const pan = data.pan != null ? String(data.pan).trim() : ''
    if (pan && !isValidPanFormat(pan)) {
      throw new GraphQLValidationError('PAN format is invalid. Expected 5 letters + 4 digits + 1 letter.')
    }
  }

  /**
   * Resolves `tags` (existing tagId refs) + `createTags` (inline "Create Tag") into the
   * denormalized VendorTag[] subdocument array stored on the vendor.
   */
  private async resolveTags(
    organizationId: string,
    tags: Array<{ tagId: string }> | undefined,
    createTags: Array<{ name: string; color?: string; category?: string }> | undefined,
  ): Promise<Array<{ tagId: string; name: string; color: string; category: string }>> {
    const resolved: Array<{ tagId: string; name: string; color: string; category: string }> = []

    if (tags?.length) {
      const rows = await tagService.findByIds(tags.map((t) => t.tagId))
      for (const row of rows as any[]) {
        resolved.push({
          tagId: String(row._id ?? row.id),
          name: row.name,
          color: row.color ?? '#94a3b8',
          category: row.category ?? '',
        })
      }
    }

    if (createTags?.length) {
      for (const ct of createTags) {
        const created = await tagService.create({ ...ct, organizationId })
        resolved.push({
          tagId: String((created as any)._id ?? (created as any).id),
          name: (created as any).name,
          color: (created as any).color ?? '#94a3b8',
          category: (created as any).category ?? '',
        })
      }
    }

    return resolved
  }

  /**
   * Resolves `bankAccounts[]` input: existing bankId refs pass through; entries carrying `newBank`
   * trigger inline creation of the master Bank record first (Step 6 nested "Create Bank" modal).
   */
  private async resolveBankAccounts(
    organizationId: string,
    vendorName: string,
    bankAccounts:
      | Array<{
          accountNumber: string
          bankId?: string | null
          newBank?: { name: string; bankIdentifierCode?: string; address?: string; phone?: string; email?: string } | null
          currency?: string | null
          accountHolder?: string | null
          sendMoney?: boolean | null
        }>
      | undefined,
  ): Promise<AnyRecord[]> {
    if (!bankAccounts?.length) return []
    const out: AnyRecord[] = []
    for (const ba of bankAccounts) {
      let bankId = ba.bankId ?? null
      let bankName = ''
      if (!bankId && ba.newBank) {
        const created = await bankService.create({ ...ba.newBank, organizationId })
        bankId = String((created as any)._id ?? (created as any).id)
        bankName = (created as any).name
      } else if (bankId) {
        const bank = await bankService.findById(bankId)
        if (bank) bankName = (bank as any).name
      }
      out.push({
        accountNumber: ba.accountNumber,
        bankId,
        bankName,
        currency: ba.currency?.trim() || 'INR',
        accountHolder: ba.accountHolder?.trim() || vendorName,
        sendMoney: !!ba.sendMoney,
      })
    }
    return out
  }

  async createVendor(data: AnyRecord, userId: string) {
    const {
      createdBy: _c,
      updatedBy: _u,
      tags,
      createTags,
      bankAccounts,
      ...rest
    } = data as AnyRecord & {
      tags?: Array<{ tagId: string }>
      createTags?: Array<{ name: string; color?: string; category?: string }>
      bankAccounts?: any[]
    }

    this.validateTaxFields(rest)

    const organizationId = String(rest.organizationId)
    const name = String(rest.name ?? '').trim()
    if (!name) throw new GraphQLValidationError('Vendor name is required')

    // Gap 11 — duplicate detection: block if same GSTIN, PAN, or name already exists.
    const gstin = rest.gstin ? String(rest.gstin).trim().toUpperCase() : ''
    const pan = rest.pan ? String(rest.pan).trim().toUpperCase() : ''
    if (gstin) {
      const existing = await this.repository.findOne({ gstin: gstin.toUpperCase(), organizationId, deletedAt: null })
      if (existing) {
        throw new GraphQLValidationError(
          `A vendor with GSTIN "${gstin}" already exists (${(existing as any).name} / ${(existing as any).seqNo ?? ''}). Please review before creating a duplicate.`,
        )
      }
    }
    if (pan) {
      const existing = await this.repository.findOne({ pan: pan.toUpperCase(), organizationId, deletedAt: null })
      if (existing) {
        throw new GraphQLValidationError(
          `A vendor with PAN "${pan}" already exists (${(existing as any).name} / ${(existing as any).seqNo ?? ''}). Please review before creating a duplicate.`,
        )
      }
    }
    // Soft duplicate-name warning (don't block — different branches of same group may share a name).
    const sameName = await this.repository.findOne({ name, organizationId, deletedAt: null })
    if (sameName) {
      // Only throw if it's an exact match — let the user confirm via the UI. Backend just blocks.
      throw new GraphQLValidationError(
        `A vendor named "${name}" already exists (${(sameName as any).seqNo ?? ''}). If this is intentional, use a distinguishing name.`,
      )
    }

    const seq = await getNextSequence({ type: 'Vendor', organizationId })
    const seqNo = formatEntitySequence('V', organizationId, seq)
    const uid = userIdForRef(userId)

    const resolvedTags = await this.resolveTags(organizationId, tags, createTags)
    const resolvedBankAccounts = await this.resolveBankAccounts(organizationId, name, bankAccounts)

    const payload: AnyRecord = {
      ...rest,
      name,
      seqNo,
      tags: resolvedTags,
      bankAccounts: resolvedBankAccounts,
      orgApprovalStatus: 'draft',
      status: 'inactive',
    }
    if (uid) {
      payload.createdBy = uid
      payload.updatedBy = uid
    }
    const created = await this.repository.create(payload)

    // Activity log entry: "Contact created" — surfaced in the chatter/timeline panel on the vendor record.
    try {
      await auditLogService.create({
        userId: uid,
        action: 'CREATE',
        entityType: 'VENDOR',
        entityId: (created as any)._id,
        newValues: { name, seqNo },
      })
    } catch {
      // Activity log is best-effort; never block vendor creation on it.
    }

    return created
  }

  async getVendorById(id: string) {
    return this.repository.findById(id)
  }

  async getAllVendors(filter: any = {}, page = 1, limit = 100) {
    const result = await this.repository.findPaginated(
      { ...filter, deletedAt: null },
      page,
      limit,
      { createdAt: -1 }
    )
    return result.data
  }

  async updateVendor(id: string, data: AnyRecord, userId: string) {
    const existing = await this.repository.findById(id)
    if (!existing || (existing as any).deletedAt) throw new GraphQLValidationError('Vendor not found')
    const ap = String((existing as any).orgApprovalStatus ?? 'approved')
    if (ap === 'submitted') throw new GraphQLValidationError('Vendor is pending approval and cannot be edited')

    const {
      createdBy: _c,
      updatedBy: _u,
      status: incomingStatus,
      orgApprovalStatus: _oa,
      tags,
      createTags,
      bankAccounts,
      ...rest
    } = data as AnyRecord & {
      status?: string
      tags?: Array<{ tagId: string }>
      createTags?: Array<{ name: string; color?: string; category?: string }>
      bankAccounts?: any[]
    }

    this.validateTaxFields(rest)

    const organizationId = String((existing as any).organizationId)
    const uid = userIdForRef(userId)
    const payload: AnyRecord = { ...rest }

    if (tags != null || createTags != null) {
      payload.tags = await this.resolveTags(organizationId, tags, createTags)
    }
    if (bankAccounts != null) {
      const name = String(rest.name ?? (existing as any).name ?? '')
      payload.bankAccounts = await this.resolveBankAccounts(organizationId, name, bankAccounts)
    }

    if (uid) payload.updatedBy = uid
    if (ap === 'approved' && incomingStatus != null && String(incomingStatus).trim() !== '') {
      const newStatus = String(incomingStatus).trim()
      // Gap 13 — prevent deactivating a vendor that has open (non-terminal) POs.
      if (newStatus === 'inactive') {
        const { PurchaseOrder } = await import('../purchase-order/model')
        const openPOs = await PurchaseOrder.countDocuments({
          vendorId: id,
          deletedAt: null,
          status: { $nin: ['billed', 'cancelled', 'rejected', 'locked'] },
        })
        if (openPOs > 0) {
          throw new GraphQLValidationError(
            `Cannot deactivate this vendor — ${openPOs} open Purchase Order(s) are still active. Complete or cancel them first.`,
          )
        }
      }
      payload.status = newStatus
    }
    return this.repository.update(id, payload)
  }

  /** Step 6 nested "Create Bank Account" modal — appends a bank account to an existing vendor. */
  async addBankAccount(vendorId: string, input: AnyRecord, userId: string) {
    const existing = await this.repository.findById(vendorId)
    if (!existing || (existing as any).deletedAt) throw new GraphQLValidationError('Vendor not found')
    const organizationId = String((existing as any).organizationId)
    const name = String((existing as any).name ?? '')
    const [resolved] = await this.resolveBankAccounts(organizationId, name, [input as any])
    const current = Array.isArray((existing as any).bankAccounts) ? (existing as any).bankAccounts : []
    const uid = userIdForRef(userId)
    return this.repository.update(vendorId, {
      bankAccounts: [...current, resolved],
      ...(uid ? { updatedBy: uid } : {}),
    })
  }

  async removeBankAccount(vendorId: string, bankAccountId: string, userId: string) {
    const existing = await this.repository.findById(vendorId)
    if (!existing || (existing as any).deletedAt) throw new GraphQLValidationError('Vendor not found')
    const current = Array.isArray((existing as any).bankAccounts) ? (existing as any).bankAccounts : []
    const filtered = current.filter((ba: any) => String(ba._id ?? ba.id) !== String(bankAccountId))
    const uid = userIdForRef(userId)
    return this.repository.update(vendorId, {
      bankAccounts: filtered,
      ...(uid ? { updatedBy: uid } : {}),
    })
  }

	async submitForOrgApproval(id: string, userId: string) {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
		const ap = String((row as any).orgApprovalStatus ?? 'approved')
		if (ap !== 'draft' && ap !== 'approval_declined') {
			throw new GraphQLValidationError('Only draft or declined vendors can be sent for approval')
		}
		const uid = userIdForRef(userId)
		const payload: Record<string, unknown> = { orgApprovalStatus: 'submitted' }
		if (uid) payload.updatedBy = uid
		return this.repository.update(id, payload)
	}

	/**
	 * Roll back vendor lifecycle if approval queue enqueue fails after transitioning to submitted.
	 */
	async revertSubmissionAfterEnqueueFailure(id: string, userId: string) {
		const row = await this.repository.findById(id)
		if (!row || row.deletedAt) return row
		if (String((row as any).orgApprovalStatus ?? '') !== 'submitted') return row
		const uid = userIdForRef(userId)
		const payload: Record<string, unknown> = { orgApprovalStatus: 'draft' }
		if (uid) payload.updatedBy = uid
		return this.repository.update(id, payload)
	}

  async approveFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
    if (String((row as any).orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only vendors pending approval can be approved')
    }
    // Gap 10 — segregation of duties: the person who submitted cannot also approve.
    if (String((row as any).updatedBy ?? '') === String(userId) || String((row as any).createdBy ?? '') === String(userId)) {
      throw new GraphQLValidationError(
        'You cannot approve a vendor you submitted. A different approver must review this record.',
      )
    }
    const uid = userIdForRef(userId)
    const updated = await this.repository.update(id, {
      orgApprovalStatus: 'approved',
      status: 'active',
      ...(uid ? { updatedBy: uid } : {}),
    })
    try {
      await auditLogService.create({
        userId: uid,
        action: 'APPROVE',
        entityType: 'VENDOR',
        entityId: id,
      })
    } catch {
      // best-effort
    }
    return updated
  }

  async declineFromApprovalQueue(id: string, userId: string) {
    const row = await this.repository.findById(id)
    if (!row || row.deletedAt) throw new GraphQLValidationError('Vendor not found')
    if (String((row as any).orgApprovalStatus ?? 'approved') !== 'submitted') {
      throw new GraphQLValidationError('Only vendors pending approval can be declined')
    }
    const uid = userIdForRef(userId)
    const updated = await this.repository.update(id, {
      orgApprovalStatus: 'approval_declined',
      status: 'inactive',
      ...(uid ? { updatedBy: uid } : {}),
    })
    try {
      await auditLogService.create({
        userId: uid,
        action: 'DECLINE',
        entityType: 'VENDOR',
        entityId: id,
      })
    } catch {
      // best-effort
    }
    return updated
  }

  async deleteVendor(id: string, userId: string) {
    const uid = userIdForRef(userId)
    const payload: Record<string, unknown> = { deletedAt: new Date() }
    if (uid) payload.deletedBy = uid
    return this.repository.update(id, payload)
  }
}
