import { PayrollManagement } from '../payroll-management/model';
import { EmployeeMaster } from '../employee-master/model';
import { EmployeeSalaryStructure } from '../employee-salary-structure/model';
import { PayrollUiRecord } from '../payroll-ui-record/model';
import { Attendance } from '../attendance/model';
import { LeaveApplication, LeaveType } from '../leave/model';
import { Payslip, IPayslip, IPayslipLine } from './model';
import { calculateStatutory } from './statutory';
import { logger } from '../../lib/logger';

type PayComponentDef = {
  shortCode: string;
  componentCode: string;
  name: string;
  kind: 'EARNING' | 'DEDUCTION' | 'STATUTORY';
  basis: 'FIXED_AMOUNT' | 'PERCENT_BASIC' | 'PERCENT_GROSS';
  value: number;
  taxable: boolean;
  active: boolean;
};

function daysInPeriod(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.floor(ms / 86400000) + 1;
}

async function loadPayComponentDefs(organizationId: string): Promise<Map<string, PayComponentDef>> {
  const records = await PayrollUiRecord.find({
    organizationId,
    category: 'PAY_COMPONENT',
    isDeleted: false,
  }).exec();
  const map = new Map<string, PayComponentDef>();
  for (const rec of records) {
    try {
      const raw = typeof rec.data === 'string' ? JSON.parse(rec.data) : rec.data;
      const code = String(raw?.shortCode ?? rec.code ?? '').toUpperCase();
      if (!code) continue;
      const def: PayComponentDef = {
        shortCode: code,
        componentCode: String(raw?.componentCode ?? ''),
        name: String(raw?.name ?? code),
        kind: ['EARNING', 'DEDUCTION', 'STATUTORY'].includes(raw?.kind) ? raw.kind : 'EARNING',
        basis: ['FIXED_AMOUNT', 'PERCENT_BASIC', 'PERCENT_GROSS'].includes(raw?.basis) ? raw.basis : 'FIXED_AMOUNT',
        value: typeof raw?.value === 'number' ? raw.value : 0,
        taxable: Boolean(raw?.taxable ?? true),
        active: Boolean(raw?.active ?? true),
      };
      if (def.active) map.set(String(rec._id), def);
    } catch (e) {
      logger.warn(`Failed to parse pay component ${rec._id}`, e);
    }
  }
  return map;
}

async function countWorkingDays(periodStart: Date, periodEnd: Date): Promise<number> {
  let count = 0;
  const d = new Date(periodStart);
  while (d <= periodEnd) {
    const dow = d.getDay();
    if (dow !== 0) count += 1; // skip Sundays only by default
    d.setDate(d.getDate() + 1);
  }
  return count;
}

async function getPaidLeaveTypeIds(organizationId: string) {
  const paidTypes = await LeaveType.find({ organizationId, paid: true, deletedAt: null }).select('_id').exec();
  return paidTypes.map((t) => String(t._id));
}

async function countLopDays(
  userId: string,
  organizationId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  if (!userId) return 0;
  const paidTypeIds = await getPaidLeaveTypeIds(organizationId);
  const apps = await LeaveApplication.find({
    userId,
    organizationId,
    status: 'approved',
    startDate: { $lte: periodEnd },
    endDate: { $gte: periodStart },
    deletedAt: null,
    leaveTypeId: { $nin: paidTypeIds },
  }).exec();
  let total = 0;
  for (const a of apps) {
    const from = a.startDate > periodStart ? a.startDate : periodStart;
    const to = a.endDate < periodEnd ? a.endDate : periodEnd;
    const days = Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86400000) + 1);
    total += days;
  }
  return total;
}

async function countAttendanceAbsents(
  userId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<number> {
  if (!userId) return 0;
  return Attendance.countDocuments({
    userId,
    status: 'absent',
    date: { $gte: periodStart, $lte: periodEnd },
    deletedAt: null,
  }).exec();
}

export async function computePayrollRun(payrollRunId: string, userId: string): Promise<IPayslip[]> {
  const run = await PayrollManagement.findById(payrollRunId).exec();
  if (!run) throw new Error('Payroll run not found');
  if (!run.payPeriodStart || !run.payPeriodEnd) {
    throw new Error('Payroll run is missing payPeriodStart/payPeriodEnd');
  }

  const organizationId = String(run.organizationId);
  const start = new Date(run.payPeriodStart);
  const end = new Date(run.payPeriodEnd);
  const totalDays = daysInPeriod(start, end);
  const workingDays = await countWorkingDays(start, end);

  const componentDefs = await loadPayComponentDefs(organizationId);

  const employees = await EmployeeMaster.find({
    organizationId,
    status: 'ACTIVE',
    deletedAt: null,
  }).exec();

  await Payslip.deleteMany({ payrollRunId, isDeleted: false }).exec();

  const created: IPayslip[] = [];

  for (const emp of employees) {
    const empId = String(emp._id);
    const structure = await EmployeeSalaryStructure.findOne({
      employeeId: empId,
      isDeleted: false,
      status: 'ACTIVE',
      effectiveFrom: { $lte: end },
      $or: [{ effectiveTo: null }, { effectiveTo: { $gte: start } }],
    }).sort({ effectiveFrom: -1 }).exec();

    const basicMonthly = structure?.basicMonthly || emp.basicSalary || 0;

    const lopFromLeave = emp.userId
      ? await countLopDays(String(emp.userId), organizationId, start, end)
      : 0;
    const absentDays = emp.userId
      ? await countAttendanceAbsents(String(emp.userId), start, end)
      : 0;
    const lopDays = Math.min(workingDays, lopFromLeave + absentDays);
    const paidDays = Math.max(0, workingDays - lopDays);
    const prorationFactor = workingDays > 0 ? paidDays / workingDays : 1;

    const earnings: IPayslipLine[] = [];
    const deductions: IPayslipLine[] = [];

    let grossEarnings = 0;

    if (structure && structure.components?.length) {
      for (const sc of structure.components) {
        const def = componentDefs.get(sc.payComponentId);
        if (!def || !def.active) continue;
        let amount = 0;
        if (def.basis === 'FIXED_AMOUNT') amount = sc.amount || def.value;
        else if (def.basis === 'PERCENT_BASIC') amount = basicMonthly * ((sc.amount || def.value) / 100);
        else if (def.basis === 'PERCENT_GROSS') amount = grossEarnings * ((sc.amount || def.value) / 100);
        amount = Math.round(amount * prorationFactor);
        if (def.kind === 'EARNING') {
          earnings.push({ code: def.shortCode, name: def.name, type: 'EARNING', amount });
          grossEarnings += amount;
        } else {
          deductions.push({ code: def.shortCode, name: def.name, type: 'DEDUCTION', amount });
        }
      }
    } else {
      const basic = Math.round(basicMonthly * prorationFactor);
      earnings.push({ code: 'BASIC', name: 'Basic Salary', type: 'EARNING', amount: basic });
      grossEarnings = basic;
    }

    const annualizedGross = grossEarnings * 12;
    const { pfEmployee, pfEmployer, esiEmployee, esiEmployer, tds } = calculateStatutory({
      basic: Math.round(basicMonthly * prorationFactor),
      grossEarnings,
      hasPfAccount: Boolean(emp.uanNumber),
      hasEsiAccount: Boolean(emp.esiNumber),
      annualizedGross,
      overrides: (structure as any)?.statutory,
    });

    if (pfEmployee) deductions.push({ code: 'PF', name: 'Provident Fund', type: 'DEDUCTION', amount: pfEmployee });
    if (esiEmployee) deductions.push({ code: 'ESI', name: 'ESI', type: 'DEDUCTION', amount: esiEmployee });
    if (tds) deductions.push({ code: 'TDS', name: 'TDS', type: 'DEDUCTION', amount: tds });

    const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
    const netPay = grossEarnings - totalDeductions;

    const payslip = await Payslip.create({
      organizationId,
      payrollRunId,
      employeeId: empId,
      employeeCode: emp.employeeCode,
      employeeName: `${emp.firstName ?? ''} ${emp.lastName ?? ''}`.trim(),
      payPeriodStart: start,
      payPeriodEnd: end,
      workingDays,
      paidDays,
      lopDays,
      earnings,
      deductions,
      grossEarnings,
      totalDeductions,
      pfEmployee,
      pfEmployer,
      esiEmployee,
      esiEmployer,
      tds,
      netPay,
      status: 'COMPUTED',
      createdBy: userId,
      isDeleted: false,
    });
    created.push(payslip);
  }

  await PayrollManagement.findByIdAndUpdate(payrollRunId, { status: 'COMPUTED' }).exec();
  return created;
}
