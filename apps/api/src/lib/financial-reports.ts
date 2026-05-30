export type TrialBalanceRow = {
  accountCode: string
  accountName: string
  accountType: string
  debit: number
  credit: number
}

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}

/** Net balance for normal balance by account type. */
export function netBalance(row: TrialBalanceRow): number {
  const d = Number(row.debit) || 0
  const c = Number(row.credit) || 0
  const type = String(row.accountType ?? '').toLowerCase()
  if (type === 'asset' || type === 'expense') return roundMoney(d - c)
  if (type === 'liability' || type === 'equity' || type === 'revenue') {
    return roundMoney(c - d)
  }
  return roundMoney(d - c)
}

export type FinancialStatementLine = {
  accountCode: string
  accountName: string
  amount: number
}

export type IncomeStatementReport = {
  revenueLines: FinancialStatementLine[]
  totalRevenue: number
  cogsLines: FinancialStatementLine[]
  totalCogs: number
  grossProfit: number
  expenseLines: FinancialStatementLine[]
  totalOperatingExpense: number
  netIncome: number
}

export type BalanceSheetReport = {
  assetLines: FinancialStatementLine[]
  totalAssets: number
  liabilityLines: FinancialStatementLine[]
  totalLiabilities: number
  equityLines: FinancialStatementLine[]
  totalEquity: number
  totalLiabilitiesAndEquity: number
  balanced: boolean
}

function isCogsAccount(name: string, code: string): boolean {
  const n = name.toLowerCase()
  return /cost of goods|cogs|inventory shrinkage/i.test(n) || /^5\d{3}-COGS/i.test(code)
}

function isOperatingExpense(row: TrialBalanceRow): boolean {
  if (String(row.accountType ?? '').toLowerCase() !== 'expense') return false
  return !isCogsAccount(row.accountName, row.accountCode)
}

export function buildIncomeStatementFromTrialBalance(
  rows: TrialBalanceRow[],
): IncomeStatementReport {
  const revenueLines: FinancialStatementLine[] = []
  const cogsLines: FinancialStatementLine[] = []
  const expenseLines: FinancialStatementLine[] = []

  for (const row of rows) {
    const type = String(row.accountType ?? '').toLowerCase()
    const net = netBalance(row)
    if (Math.abs(net) < 0.009) continue

    const line = {
      accountCode: row.accountCode,
      accountName: row.accountName,
      amount: net,
    }

    if (type === 'revenue') revenueLines.push(line)
    else if (type === 'expense') {
      if (isCogsAccount(row.accountName, row.accountCode)) cogsLines.push(line)
      else if (isOperatingExpense(row)) expenseLines.push(line)
    }
  }

  const totalRevenue = roundMoney(revenueLines.reduce((s, l) => s + l.amount, 0))
  const totalCogs = roundMoney(cogsLines.reduce((s, l) => s + l.amount, 0))
  const grossProfit = roundMoney(totalRevenue - totalCogs)
  const totalOperatingExpense = roundMoney(expenseLines.reduce((s, l) => s + l.amount, 0))
  const netIncome = roundMoney(grossProfit - totalOperatingExpense)

  return {
    revenueLines,
    totalRevenue,
    cogsLines,
    totalCogs,
    grossProfit,
    expenseLines,
    totalOperatingExpense,
    netIncome,
  }
}

export function buildBalanceSheetFromTrialBalance(
  rows: TrialBalanceRow[],
): BalanceSheetReport {
  const assetLines: FinancialStatementLine[] = []
  const liabilityLines: FinancialStatementLine[] = []
  const equityLines: FinancialStatementLine[] = []

  for (const row of rows) {
    const type = String(row.accountType ?? '').toLowerCase()
    const net = netBalance(row)
    if (Math.abs(net) < 0.009) continue

    const line = {
      accountCode: row.accountCode,
      accountName: row.accountName,
      amount: net,
    }

    if (type === 'asset') assetLines.push(line)
    else if (type === 'liability') liabilityLines.push(line)
    else if (type === 'equity') equityLines.push(line)
  }

  const totalAssets = roundMoney(assetLines.reduce((s, l) => s + l.amount, 0))
  const totalLiabilities = roundMoney(liabilityLines.reduce((s, l) => s + l.amount, 0))
  const totalEquity = roundMoney(equityLines.reduce((s, l) => s + l.amount, 0))
  const totalLiabilitiesAndEquity = roundMoney(totalLiabilities + totalEquity)

  return {
    assetLines,
    totalAssets,
    liabilityLines,
    totalLiabilities,
    equityLines,
    totalEquity,
    totalLiabilitiesAndEquity,
    balanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.05,
  }
}
