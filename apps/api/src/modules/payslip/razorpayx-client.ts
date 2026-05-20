/**
 * RazorpayX payout client (NOT WIRED).
 *
 * This module is intentionally left in place but is NOT exported from index.ts
 * and the `disburseViaRazorpayX` mutation is commented out in schema.graphql.
 * When you are ready to use RazorpayX:
 *   1. Set env: RAZORPAYX_KEY_ID, RAZORPAYX_KEY_SECRET, RAZORPAYX_ACCOUNT_NUMBER
 *   2. Uncomment the export in `./index.ts` and the mutation in `./schema.graphql`
 *   3. Add the resolver in `./resolvers.ts`
 *   4. Wire the webhook route in your express server for /webhooks/razorpayx
 *
 * Docs: https://razorpay.com/docs/api/x/
 */

// import axios from 'axios';
// import { Payslip } from './model';
// import { EmployeeMaster } from '../employee-master/model';
//
// const RAZORPAYX_BASE = 'https://api.razorpay.com/v1';
//
// function authHeader() {
//   const key = process.env.RAZORPAYX_KEY_ID;
//   const secret = process.env.RAZORPAYX_KEY_SECRET;
//   if (!key || !secret) throw new Error('RazorpayX credentials missing');
//   const token = Buffer.from(`${key}:${secret}`).toString('base64');
//   return { Authorization: `Basic ${token}` };
// }
//
// async function createContact(emp: any) {
//   const { data } = await axios.post(`${RAZORPAYX_BASE}/contacts`, {
//     name: `${emp.firstName} ${emp.lastName}`.trim(),
//     email: emp.workEmail,
//     contact: emp.phone,
//     type: 'employee',
//     reference_id: emp.employeeCode,
//   }, { headers: authHeader() });
//   return data.id;
// }
//
// async function createFundAccount(contactId: string, bank: any) {
//   const { data } = await axios.post(`${RAZORPAYX_BASE}/fund_accounts`, {
//     contact_id: contactId,
//     account_type: 'bank_account',
//     bank_account: {
//       name: bank.accountHolderName ?? '',
//       ifsc: bank.ifscCode,
//       account_number: bank.accountNumber,
//     },
//   }, { headers: authHeader() });
//   return data.id;
// }
//
// async function createPayout(fundAccountId: string, amountInPaise: number, reference: string) {
//   const { data } = await axios.post(`${RAZORPAYX_BASE}/payouts`, {
//     account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER,
//     fund_account_id: fundAccountId,
//     amount: amountInPaise,
//     currency: 'INR',
//     mode: 'IMPS',
//     purpose: 'salary',
//     queue_if_low_balance: true,
//     reference_id: reference,
//   }, { headers: authHeader() });
//   return data;
// }
//
// export async function disburseRunViaRazorpayX(payrollRunId: string) {
//   const payslips = await Payslip.find({ payrollRunId, isDeleted: false }).exec();
//   const results: Array<{ payslipId: string; payoutId?: string; error?: string }> = [];
//   for (const p of payslips) {
//     if (p.netPay <= 0) continue;
//     try {
//       const emp: any = await EmployeeMaster.findById(p.employeeId).exec();
//       const contactId = await createContact(emp);
//       const fundId = await createFundAccount(contactId, emp.bankDetails);
//       const payout = await createPayout(fundId, Math.round(p.netPay * 100), `payslip:${p._id}`);
//       p.payoutId = payout.id;
//       p.payoutStatus = payout.status;
//       p.status = 'DISBURSED';
//       await p.save();
//       results.push({ payslipId: String(p._id), payoutId: payout.id });
//     } catch (err: any) {
//       results.push({ payslipId: String(p._id), error: err.message });
//     }
//   }
//   return results;
// }

export const RAZORPAYX_DISABLED = true;
