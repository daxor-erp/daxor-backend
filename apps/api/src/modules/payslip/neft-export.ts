import { Payslip } from './model';
import { EmployeeMaster } from '../employee-master/model';

/**
 * Generate a CSV string in HDFC NEFT Bulk format:
 * BeneficiaryName,AccountNumber,IFSC,Amount,Remark
 * Most Indian banks accept this layout for bulk payment upload.
 */
export async function exportPayrollRunAsNeftCsv(payrollRunId: string): Promise<string> {
  const payslips = await Payslip.find({ payrollRunId, isDeleted: false }).exec();
  const rows: string[] = ['BeneficiaryName,AccountNumber,IFSC,Amount,Remark'];

  for (const p of payslips) {
    if (p.netPay <= 0) continue;
    const emp = await EmployeeMaster.findById(p.employeeId).exec();
    const bank = (emp as any)?.bankDetails;
    if (!bank?.accountNumber || !bank?.ifscCode) continue;
    const name = String(p.employeeName).replace(/,/g, ' ');
    const remark = `SAL-${p.payPeriodEnd.toISOString().slice(0, 7)}`;
    rows.push([name, bank.accountNumber, bank.ifscCode, p.netPay.toFixed(2), remark].join(','));
  }

  return rows.join('\n');
}
