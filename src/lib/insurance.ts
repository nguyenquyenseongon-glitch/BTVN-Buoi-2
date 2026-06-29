// Tỷ lệ đóng bảo hiểm bắt buộc — người lao động (NLĐ) và doanh nghiệp (DN).

/** Người lao động đóng: BHXH 8% + BHYT 1,5% + BHTN 1% = 10,5%. */
export const EMP = { bhxh: 0.08, bhyt: 0.015, bhtn: 0.01 };
/** Doanh nghiệp đóng: BHXH 17,5% + BHYT 3% + BHTN 1% = 21,5%. */
export const COM = { bhxh: 0.175, bhyt: 0.03, bhtn: 0.01 };

export interface InsuranceResult {
  base: number;
  employee: { bhxh: number; bhyt: number; bhtn: number };
  company: { bhxh: number; bhyt: number; bhtn: number };
  empTotal: number;
  comTotal: number;
  grandTotal: number;
}

export function calcInsurance(base: number): InsuranceResult {
  const employee = {
    bhxh: base * EMP.bhxh,
    bhyt: base * EMP.bhyt,
    bhtn: base * EMP.bhtn,
  };
  const company = {
    bhxh: base * COM.bhxh,
    bhyt: base * COM.bhyt,
    bhtn: base * COM.bhtn,
  };
  const empTotal = employee.bhxh + employee.bhyt + employee.bhtn;
  const comTotal = company.bhxh + company.bhyt + company.bhtn;
  return {
    base,
    employee,
    company,
    empTotal,
    comTotal,
    grandTotal: empTotal + comTotal,
  };
}

/** "8%", "17,5%" — định dạng phần trăm kiểu Việt. */
export const pct = (x: number) =>
  (x * 100).toString().replace(".", ",") + "%";
