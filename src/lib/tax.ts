// Logic tính thuế TNCN 2026 — tách riêng để tái sử dụng (UI, API, test).
// Biểu thuế lũy tiến 5 bậc + bảo hiểm bắt buộc, áp dụng từ kỳ tính thuế 2026.

export type Period = "month" | "year";
export type BhMode = "auto" | "manual";

/** Biểu thuế lũy tiến từng phần (ngưỡng theo THÁNG, đồng). */
export const BRACKETS = [
  { floor: 0, ceil: 10_000_000, rate: 0.05 },
  { floor: 10_000_000, ceil: 30_000_000, rate: 0.1 },
  { floor: 30_000_000, ceil: 60_000_000, rate: 0.2 },
  { floor: 60_000_000, ceil: 100_000_000, rate: 0.3 },
  { floor: 100_000_000, ceil: Infinity, rate: 0.35 },
] as const;

/** Tỷ lệ bảo hiểm bắt buộc cá nhân đóng. */
export const R_BHXH = 0.08; // BHXH 8%
export const R_BHYT = 0.015; // BHYT 1,5%
export const R_BHTN = 0.01; // BHTN 1%

/** Mức mặc định theo Nghị quyết 110/2025/UBTVQH15. */
export const DEFAULTS = {
  month: { income: 30_000_000, self: 15_500_000, dep: 6_200_000 },
  year: { income: 360_000_000, self: 186_000_000, dep: 74_400_000 },
} as const;

export interface TaxInput {
  period: Period;
  income: number;
  exempt: number;
  deps: number;
  selfDed: number;
  depDed: number;
  bhMode: BhMode;
  bhBase: number;
  bhManual: number;
}

export interface BracketRow {
  index: number;
  floor: number;
  ceil: number;
  rate: number;
  span: number;
  tax: number;
  active: boolean;
}

export interface TaxResult {
  months: number;
  ins: number;
  insBreakdown: { xh: number; yt: number; tn: number };
  totalDep: number;
  taxable: number;
  tax: number;
  net: number;
  eff: number;
  rows: BracketRow[];
}

/** Tính thuế TNCN từ thông tin đầu vào. Phép tính giống hệt bản web tĩnh gốc. */
export function calcTax(input: TaxInput): TaxResult {
  const m = input.period === "year" ? 12 : 1;

  let ins: number;
  let insBreakdown = { xh: 0, yt: 0, tn: 0 };
  if (input.bhMode === "auto") {
    const xh = input.bhBase * R_BHXH;
    const yt = input.bhBase * R_BHYT;
    const tn = input.bhBase * R_BHTN;
    insBreakdown = { xh, yt, tn };
    ins = xh + yt + tn;
  } else {
    ins = input.bhManual;
  }

  const totalDep = input.deps * input.depDed;
  const taxable = Math.max(
    0,
    input.income - input.exempt - ins - input.selfDed - totalDep,
  );

  let tax = 0;
  const rows: BracketRow[] = BRACKETS.map((b, i) => {
    const floor = b.floor * m;
    const ceil = b.ceil === Infinity ? Infinity : b.ceil * m;
    const span = Math.max(0, Math.min(taxable, ceil) - floor);
    const t = span * b.rate;
    tax += t;
    return {
      index: i,
      floor,
      ceil,
      rate: b.rate,
      span,
      tax: t,
      active: taxable > floor && taxable > 0,
    };
  });

  const net = input.income - ins - tax;
  const eff = input.income > 0 ? (tax / input.income) * 100 : 0;

  return { months: m, ins, insBreakdown, totalDep, taxable, tax, net, eff, rows };
}

/** Định dạng tiền VND: 1.234.567 đ */
export const formatVnd = (n: number) =>
  Math.round(n).toLocaleString("vi-VN") + " đ";

/** Nhãn khoảng thu nhập của 1 bậc: "10–30 tr" hoặc "Trên 100 tr". */
export const formatRange = (floor: number, ceil: number) =>
  ceil === Infinity ? `Trên ${floor / 1e6} tr` : `${floor / 1e6}–${ceil / 1e6} tr`;
