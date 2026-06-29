// Logic tính các loại thuế doanh nghiệp: GTGT, TNDN, Thuế nhà thầu.

/* ===== Thuế GTGT (VAT) ===== */
export const VAT_RATES = [0, 5, 8, 10];

export interface VatResult {
  before: number;
  vat: number;
  after: number;
}

export function calcVat(
  amount: number,
  ratePct: number,
  inclusive: boolean,
): VatResult {
  const r = ratePct / 100;
  let before: number;
  let after: number;
  if (inclusive) {
    after = amount;
    before = amount / (1 + r);
  } else {
    before = amount;
    after = amount * (1 + r);
  }
  return { before, vat: after - before, after };
}

/* ===== Thuế TNDN (Corporate Income Tax) ===== */
export interface CitResult {
  taxable: number;
  tax: number;
  profitAfter: number;
}

export function calcCit(
  revenue: number,
  expenses: number,
  ratePct: number,
): CitResult {
  const taxable = Math.max(0, revenue - expenses);
  const tax = (taxable * ratePct) / 100;
  return { taxable, tax, profitAfter: revenue - expenses - tax };
}

/* ===== Thuế nhà thầu (Foreign Contractor Tax) — phương pháp trực tiếp ===== */
export interface FctPreset {
  key: string;
  label: string;
  vat: number; // tỷ lệ % GTGT trên doanh thu
  cit: number; // tỷ lệ % TNDN trên doanh thu
}

// Tỷ lệ % theo Thông tư 103/2014/TT-BTC (phổ biến).
export const FCT_PRESETS: FctPreset[] = [
  { key: "service", label: "Dịch vụ", vat: 5, cit: 5 },
  { key: "rent", label: "Cho thuê máy móc, thiết bị; bảo hiểm", vat: 5, cit: 5 },
  { key: "trade", label: "Thương mại (cung cấp hàng hóa)", vat: 0, cit: 1 },
  {
    key: "construct_nomat",
    label: "Xây dựng, lắp đặt KHÔNG bao thầu NVL",
    vat: 5,
    cit: 2,
  },
  {
    key: "construct_mat",
    label: "Xây dựng, lắp đặt CÓ bao thầu NVL",
    vat: 3,
    cit: 2,
  },
  { key: "production", label: "Sản xuất, vận tải, DV gắn với hàng hóa", vat: 3, cit: 2 },
  { key: "interest", label: "Lãi tiền vay", vat: 0, cit: 5 },
  { key: "royalty", label: "Bản quyền", vat: 0, cit: 10 },
  { key: "custom", label: "Tùy chỉnh (tự nhập tỷ lệ)", vat: 0, cit: 0 },
];

export interface FctResult {
  vat: number;
  cit: number;
  total: number;
}

export function calcFct(
  revenue: number,
  vatPct: number,
  citPct: number,
): FctResult {
  const vat = (revenue * vatPct) / 100;
  const cit = (revenue * citPct) / 100;
  return { vat, cit, total: vat + cit };
}
