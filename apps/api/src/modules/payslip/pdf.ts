import puppeteer from 'puppeteer';
import { Payslip, IPayslip } from './model';
import { formatMoney } from '../../lib/format-money';

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c,
  );
}

export function renderPayslipHtml(p: IPayslip, currency: string = 'INR'): string {
  const money = (n: number) => formatMoney(n, currency);
  const period = `${p.payPeriodStart.toISOString().slice(0, 10)} → ${p.payPeriodEnd.toISOString().slice(0, 10)}`;
  const earningsRows = p.earnings.map(
    (e) => `<tr><td>${escapeHtml(e.name)}</td><td class="r">${money(e.amount)}</td></tr>`,
  ).join('');
  const deductionsRows = p.deductions.map(
    (d) => `<tr><td>${escapeHtml(d.name)}</td><td class="r">${money(d.amount)}</td></tr>`,
  ).join('');

  return `<!doctype html>
<html><head><meta charset="utf-8"/><title>Payslip ${escapeHtml(p.employeeCode)}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .muted { color: #666; font-size: 12px; }
  table { width: 100%; border-collapse: collapse; margin-top: 12px; }
  th, td { border-bottom: 1px solid #eee; padding: 6px 8px; font-size: 13px; text-align: left; }
  th { background: #f6f6f8; }
  .r { text-align: right; font-variant-numeric: tabular-nums; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 16px; }
  .total { font-weight: 600; }
  .summary { margin-top: 16px; padding: 12px; background: #f6f6f8; border-radius: 8px; }
  .net { font-size: 16px; font-weight: 700; }
</style></head>
<body>
  <h1>Payslip — ${escapeHtml(p.employeeName)}</h1>
  <div class="muted">Code: ${escapeHtml(p.employeeCode)} · Period: ${period}</div>
  <div class="muted">Working days: ${p.workingDays} · Paid days: ${p.paidDays} · LOP: ${p.lopDays}</div>
  <div class="grid">
    <div>
      <table><thead><tr><th>Earning</th><th class="r">Amount</th></tr></thead>
      <tbody>${earningsRows || '<tr><td colspan="2" class="muted">—</td></tr>'}
        <tr class="total"><td>Gross</td><td class="r">${money(p.grossEarnings)}</td></tr>
      </tbody></table>
    </div>
    <div>
      <table><thead><tr><th>Deduction</th><th class="r">Amount</th></tr></thead>
      <tbody>${deductionsRows || '<tr><td colspan="2" class="muted">—</td></tr>'}
        <tr class="total"><td>Total</td><td class="r">${money(p.totalDeductions)}</td></tr>
      </tbody></table>
    </div>
  </div>
  <div class="summary">Net pay: <span class="net">${money(p.netPay)}</span></div>
</body></html>`;
}

export async function generatePayslipPdf(payslipId: string): Promise<Buffer> {
  const p = await Payslip.findById(payslipId).exec();
  if (!p) throw new Error('Payslip not found');
  const html = renderPayslipHtml(p);
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '16mm', left: '12mm', right: '12mm' } });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
