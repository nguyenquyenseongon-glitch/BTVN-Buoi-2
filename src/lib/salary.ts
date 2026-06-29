// Đổi lương Gross ↔ Net (theo tháng), dùng lại biểu thuế + tỷ lệ bảo hiểm ở tax.ts.

import { BRACKETS, R_BHXH, R_BHYT, R_BHTN } from "./tax";

/** Tổng tỷ lệ bảo hiểm bắt buộc người lao động đóng = 10,5%. */
export const INS_RATE = R_BHXH + R_BHYT + R_BHTN;

export interface SalaryInput {
  /** Mức lương dùng để đóng BHXH (có thể khác lương Gross). */
  bhxhBase: number;
  /** Phụ cấp được miễn thuế (ăn ca, điện thoại, công tác phí…). */
  exempt: number;
  selfDed: number;
  deps: number;
  depDed: number;
}

export interface SalaryResult {
  gross: number;
  ins: number;
  insBreakdown: { xh: number; yt: number; tn: number };
  exempt: number;
  totalDed: number;
  taxable: number;
  tax: number;
  net: number;
}

function progressiveTax(taxable: number): number {
  let tax = 0;
  for (const b of BRACKETS) {
    const ceil = b.ceil === Infinity ? Infinity : b.ceil;
    const span = Math.max(0, Math.min(taxable, ceil) - b.floor);
    tax += span * b.rate;
  }
  return tax;
}

/** Tính từ lương Gross ra Net. Bảo hiểm tính trên "lương đóng BHXH". */
export function grossToNet(gross: number, opt: SalaryInput): SalaryResult {
  const xh = opt.bhxhBase * R_BHXH;
  const yt = opt.bhxhBase * R_BHYT;
  const tn = opt.bhxhBase * R_BHTN;
  const ins = xh + yt + tn;
  const totalDed = opt.selfDed + opt.deps * opt.depDed;
  const taxable = Math.max(0, gross - ins - opt.exempt - totalDed);
  const tax = progressiveTax(taxable);
  const net = gross - ins - tax;
  return {
    gross,
    ins,
    insBreakdown: { xh, yt, tn },
    exempt: opt.exempt,
    totalDed,
    taxable,
    tax,
    net,
  };
}

/**
 * Tính ngược từ Net mong muốn ra Gross.
 * Bảo hiểm cố định (theo lương đóng BHXH) nên Net tăng đơn điệu theo Gross
 * → tìm bằng chia đôi (binary search).
 */
export function netToGross(targetNet: number, opt: SalaryInput): SalaryResult {
  if (targetNet <= 0) return grossToNet(0, opt);
  let lo = targetNet;
  let hi = targetNet * 2 + 20_000_000;
  while (grossToNet(hi, opt).net < targetNet) hi *= 2;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (grossToNet(mid, opt).net < targetNet) lo = mid;
    else hi = mid;
  }
  return grossToNet(Math.round(hi), opt);
}
