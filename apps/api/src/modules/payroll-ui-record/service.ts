import { PayrollUiRecordRepository } from './repository'
import { IPayrollUiRecord } from './model'

const MAX_DATA_BYTES = 400_000

export class PayrollUiRecordService {
  private repository: PayrollUiRecordRepository

  constructor() {
    this.repository = new PayrollUiRecordRepository()
  }

  async create(input: {
    organizationId: string
    category: string
    code?: string | null
    data: string
    userId: string
  }) {
    const parsed = this.parseDataJson(input.data)
    const payload: Partial<IPayrollUiRecord> = {
      organizationId: input.organizationId.trim(),
      category: input.category.trim().toUpperCase(),
      code: input.code?.trim() || undefined,
      data: parsed,
      createdBy: input.userId,
      isDeleted: false,
    }
    return this.repository.create(payload as IPayrollUiRecord)
  }

  async getByOrgAndCategory(organizationId: string, category: string) {
    return this.repository.findByOrgAndCategory(organizationId, category.trim().toUpperCase())
  }

  async getById(id: string) {
    const row = await this.repository.findById(id)
    if (row && row.isDeleted) return null
    return row
  }

  async update(
    id: string,
    input: { organizationId: string; category: string; code?: string | null; data: string },
  ) {
    const existing = await this.repository.findById(id)
    if (!existing || existing.isDeleted) throw new Error('Payroll UI record not found')
    if (existing.organizationId !== input.organizationId.trim()) {
      throw new Error('Organization mismatch')
    }
    if (existing.category !== input.category.trim().toUpperCase()) {
      throw new Error('Category mismatch')
    }
    const parsed = this.parseDataJson(input.data)
    return this.repository.update(id, {
      code: input.code?.trim() || undefined,
      data: parsed,
    } as Partial<IPayrollUiRecord>)
  }

  async delete(id: string) {
    await this.repository.update(id, { isDeleted: true } as Partial<IPayrollUiRecord>)
  }

  private parseDataJson(raw: string): Record<string, unknown> {
    if (raw == null || typeof raw !== 'string') throw new Error('Invalid data payload')
    const t = raw.trim()
    if (t.length > MAX_DATA_BYTES) throw new Error('Payload too large')
    let parsed: unknown
    try {
      parsed = JSON.parse(t)
    } catch {
      throw new Error('data must be valid JSON')
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('data must be a JSON object')
    }
    return parsed as Record<string, unknown>
  }
}
