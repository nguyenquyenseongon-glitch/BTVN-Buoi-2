"use client";

import { useState } from "react";
import { calcInsurance, EMP, COM, pct } from "@/lib/insurance";
import { formatVnd, DEFAULTS } from "@/lib/tax";
import "./tncn-tool.css";

const money = (n: number) => (n ? n.toLocaleString("vi-VN") : "");
const digits = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

export function BhxhCalculator() {
  const [base, setBase] = useState<number>(DEFAULTS.month.income);
  const r = calcInsurance(base);

  return (
    <div className="tncn-tool">
      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Bảo hiểm bắt buộc</p>
          <h1>Tính mức đóng BHXH, BHYT, BHTN</h1>
          <p>
            Nhập mức lương đóng bảo hiểm — công cụ tính số tiền người lao động và
            doanh nghiệp phải đóng mỗi tháng.
          </p>
        </section>

        <div className="app">
          {/* FORM */}
          <section className="card" aria-label="Thông tin">
            <div className="card-head">
              <h2>Mức lương đóng bảo hiểm</h2>
              <span className="hint">Đơn vị: đồng/tháng</span>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="lbl" htmlFor="base">
                  Mức lương đóng BHXH / tháng
                </label>
                <div className="money-input">
                  <input
                    id="base"
                    inputMode="numeric"
                    value={money(base)}
                    onChange={(e) => setBase(digits(e.target.value))}
                  />
                  <span className="unit">đ</span>
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Là mức lương ghi trên hợp đồng dùng để đóng bảo hiểm. Tổng tỷ
                  lệ đóng cả 2 bên là <b>32%</b> (người lao động 10,5% + doanh
                  nghiệp 21,5%).
                </p>
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section className="card" aria-label="Kết quả">
            <div className="card-head">
              <h2>Số tiền đóng / tháng</h2>
              <span className="hint">Tổng 2 bên: 32%</span>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <div className="stat hero-stat">
                  <div className="k">Tổng đóng cả 2 bên / tháng</div>
                  <div className="v num">{formatVnd(r.grandTotal)}</div>
                  <div className="sub">Người lao động + Doanh nghiệp</div>
                </div>
                <div className="stat net">
                  <div className="k">Người lao động (10,5%)</div>
                  <div className="v num">{formatVnd(r.empTotal)}</div>
                </div>
                <div className="stat">
                  <div className="k">Doanh nghiệp (21,5%)</div>
                  <div className="v num">{formatVnd(r.comTotal)}</div>
                </div>
              </div>

              <div className="tbl-scroll" style={{ marginTop: 8 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Khoản</th>
                      <th>Người lao động</th>
                      <th>Doanh nghiệp</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>BHXH</td>
                      <td>
                        {pct(EMP.bhxh)} · {formatVnd(r.employee.bhxh)}
                      </td>
                      <td>
                        {pct(COM.bhxh)} · {formatVnd(r.company.bhxh)}
                      </td>
                    </tr>
                    <tr>
                      <td>BHYT</td>
                      <td>
                        {pct(EMP.bhyt)} · {formatVnd(r.employee.bhyt)}
                      </td>
                      <td>
                        {pct(COM.bhyt)} · {formatVnd(r.company.bhyt)}
                      </td>
                    </tr>
                    <tr>
                      <td>BHTN</td>
                      <td>
                        {pct(EMP.bhtn)} · {formatVnd(r.employee.bhtn)}
                      </td>
                      <td>
                        {pct(COM.bhtn)} · {formatVnd(r.company.bhtn)}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Tổng cộng</td>
                      <td>{formatVnd(r.empTotal)}</td>
                      <td>{formatVnd(r.comTotal)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  🖨️ In / Lưu PDF
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="disclaimer">
          <b>Lưu ý:</b> Tỷ lệ áp dụng phổ biến hiện hành: NLĐ 10,5% (BHXH 8% +
          BHYT 1,5% + BHTN 1%), DN 21,5% (BHXH 17,5% + BHYT 3% + BHTN 1%). Công
          cụ chưa áp <b>trần đóng bảo hiểm</b> (BHXH/BHYT tối đa 20 lần lương cơ
          sở; BHTN tối đa 20 lần lương tối thiểu vùng). Kết quả mang tính tham
          khảo.
        </div>
      </div>
    </div>
  );
}
