/**
 * India statutory calculations: PF, ESI, TDS.
 * All thresholds & rates can be overridden per-employee via StatutoryOverrides
 * stored on EmployeeSalaryStructure. Defaults reflect FY 2025-26 new-regime rules.
 */

const DEFAULT_PF_RATE = 12;          // %
const DEFAULT_PF_WAGE_CEILING = 15000;
const ESI_GROSS_CEILING = 21000;
const ESI_EMPLOYEE_RATE = 0.0075;
const ESI_EMPLOYER_RATE = 0.0325;

export interface StatutoryOverrides {
  pfOptIn?: boolean;
  pfRate?: number;
  pfWageCeiling?: number | null;
  esiOptIn?: boolean;
  tdsRegime?: 'NEW' | 'OLD';
  oldRegimeDeductions?: number;
  tdsMonthlyOverride?: number | null;
}

export interface StatutoryInput {
  basic: number;
  grossEarnings: number;
  hasPfAccount: boolean;
  hasEsiAccount: boolean;
  annualizedGross: number;
  alreadyDeductedTdsThisYear?: number;
  overrides?: StatutoryOverrides;
}

export interface StatutoryOutput {
  pfEmployee: number;
  pfEmployer: number;
  esiEmployee: number;
  esiEmployer: number;
  tds: number;
}

function calculatePf(basic: number, hasPfAccount: boolean, overrides?: StatutoryOverrides) {
  if (!hasPfAccount) return { pfEmployee: 0, pfEmployer: 0 };
  if (overrides?.pfOptIn === false) return { pfEmployee: 0, pfEmployer: 0 };
  const rate = ((overrides?.pfRate ?? DEFAULT_PF_RATE) / 100);
  const ceiling = overrides?.pfWageCeiling ?? DEFAULT_PF_WAGE_CEILING;
  const wage = ceiling && ceiling > 0 ? Math.min(basic, ceiling) : basic;
  const pfEmployee = Math.round(wage * rate);
  const pfEmployer = Math.round(wage * rate);
  return { pfEmployee, pfEmployer };
}

function calculateEsi(grossEarnings: number, hasEsiAccount: boolean, overrides?: StatutoryOverrides) {
  if (!hasEsiAccount) return { esiEmployee: 0, esiEmployer: 0 };
  if (overrides?.esiOptIn === false) return { esiEmployee: 0, esiEmployer: 0 };
  if (grossEarnings > ESI_GROSS_CEILING) return { esiEmployee: 0, esiEmployer: 0 };
  return {
    esiEmployee: Math.round(grossEarnings * ESI_EMPLOYEE_RATE),
    esiEmployer: Math.round(grossEarnings * ESI_EMPLOYER_RATE),
  };
}

function newRegimeTax(taxable: number) {
  const slabs: Array<[number, number]> = [
    [400000, 0],
    [800000, 0.05],
    [1200000, 0.10],
    [1600000, 0.15],
    [2000000, 0.20],
    [2400000, 0.25],
    [Infinity, 0.30],
  ];
  let tax = 0, lower = 0;
  for (const [upper, rate] of slabs) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
    if (taxable <= upper) break;
  }
  if (taxable <= 1200000) tax = Math.max(0, tax - 60000); // 87A rebate
  return tax;
}

function oldRegimeTax(taxable: number) {
  const slabs: Array<[number, number]> = [
    [250000, 0],
    [500000, 0.05],
    [1000000, 0.20],
    [Infinity, 0.30],
  ];
  let tax = 0, lower = 0;
  for (const [upper, rate] of slabs) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
    if (taxable <= upper) break;
  }
  if (taxable <= 500000) tax = Math.max(0, tax - 12500); // 87A rebate old regime
  return tax;
}

function calculateTds(annualizedGross: number, alreadyDeducted = 0, overrides?: StatutoryOverrides) {
  if (overrides?.tdsMonthlyOverride != null) return Math.max(0, overrides.tdsMonthlyOverride);
  const regime = overrides?.tdsRegime ?? 'NEW';
  let taxable: number;
  if (regime === 'OLD') {
    taxable = Math.max(0, annualizedGross - 50000 - (overrides?.oldRegimeDeductions ?? 0));
  } else {
    taxable = Math.max(0, annualizedGross - 75000); // standard deduction
  }
  let tax = regime === 'OLD' ? oldRegimeTax(taxable) : newRegimeTax(taxable);
  tax *= 1.04; // 4% health & education cess
  return Math.round(Math.max(0, (tax - alreadyDeducted) / 12));
}

export function calculateStatutory(input: StatutoryInput): StatutoryOutput {
  const { pfEmployee, pfEmployer } = calculatePf(input.basic, input.hasPfAccount, input.overrides);
  const { esiEmployee, esiEmployer } = calculateEsi(input.grossEarnings, input.hasEsiAccount, input.overrides);
  const tds = calculateTds(input.annualizedGross, input.alreadyDeductedTdsThisYear, input.overrides);
  return { pfEmployee, pfEmployer, esiEmployee, esiEmployer, tds };
}
