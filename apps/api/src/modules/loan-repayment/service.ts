import { LoanRepaymentRepository } from './repository'
import { ILoanRepayment } from './model'

export class LoanRepaymentService {
  private repository: LoanRepaymentRepository

  constructor() {
    this.repository = new LoanRepaymentRepository()
  }

  async create(data: Partial<ILoanRepayment>, userId: string) {
    const docNumber = await this.generateDocNumber(data.organizationId!)
    const payload = this.normalizeInput({ ...data, docNumber, createdBy: userId })
    return this.repository.create(payload as ILoanRepayment)
  }

  async getAll(organizationId: string) {
    return this.repository.findByOrganization(organizationId)
  }

  async getById(id: string) {
    const row = await this.repository.findById(id)
    if (row && (row as ILoanRepayment).isDeleted) return null
    return row
  }

  async update(id: string, data: Partial<ILoanRepayment>) {
    const payload = this.normalizeInput(data)
    return this.repository.update(id, payload)
  }

  async delete(id: string) {
    await this.repository.update(id, { isDeleted: true } as Partial<ILoanRepayment>)
  }

  private normalizeInput(data: Partial<ILoanRepayment>): Partial<ILoanRepayment> {
    const out: Partial<ILoanRepayment> = { ...data }
    if (out.title !== undefined) out.title = (out.title as string)?.trim() || undefined
    if (out.remarks !== undefined) out.remarks = (out.remarks as string)?.trim() || undefined
    if (out.employeeNo !== undefined) {
      out.employeeNo = (out.employeeNo as string)?.trim() || undefined
    }
    if (out.employeeName !== undefined) {
      out.employeeName = (out.employeeName as string)?.trim() || undefined
    }
    if (out.loanReference !== undefined) {
      out.loanReference = (out.loanReference as string)?.trim() || undefined
    }
    for (const key of ['payPeriodStart', 'payPeriodEnd', 'docDate'] as const) {
      const v = out[key]
      if (v === undefined || v === null) continue
      if (typeof v === 'string' && v === '') continue
      if (v instanceof Date) continue
      if (typeof v === 'string') {
        const d = new Date(v)
        if (!Number.isNaN(d.getTime())) (out as any)[key] = d
      }
    }
    if (out.repaymentAmount !== undefined && out.repaymentAmount !== null) {
      const n = typeof out.repaymentAmount === 'number'
        ? out.repaymentAmount
        : parseFloat(String(out.repaymentAmount))
      out.repaymentAmount = Number.isNaN(n) ? 0 : n
    }
    return out
  }

  private async generateDocNumber(organizationId: string): Promise<string> {
    const count = await this.repository.count({ organizationId } as any)
    return `LOAN_REPAY-${`${organizationId}`.slice(-4)}-${String(count + 1).padStart(6, '0')}`
  }
}
