"use client";

import { useState } from "react";
import {
  calcTax,
  formatVnd,
  formatRange,
  DEFAULTS,
  type Period,
  type BhMode,
} from "@/lib/tax";
import "./tncn-tool.css";

/** Định dạng số khi hiển thị trong ô nhập (1.234.567), rỗng nếu bằng 0. */
const money = (n: number) => (n ? n.toLocaleString("vi-VN") : "");
/** Lấy chữ số từ chuỗi người dùng gõ. */
const digits = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

export function TaxTNCNCalculator() {
  const [period, setPeriod] = useState<Period>("month");
  const [income, setIncome] = useState<number>(DEFAULTS.month.income);
  const [exempt, setExempt] = useState(0);
  const [bhMode, setBhMode] = useState<BhMode>("auto");
  const [bhBase, setBhBase] = useState<number>(DEFAULTS.month.income);
  const [bhManual, setBhManual] = useState(0);
  const [deps, setDeps] = useState(0);
  const [selfDed, setSelfDed] = useState<number>(DEFAULTS.month.self);
  const [depDed, setDepDed] = useState<number>(DEFAULTS.month.dep);
  const [advOpen, setAdvOpen] = useState(false);

  const per = period === "year" ? "năm" : "tháng";

  function changePeriod(p: Period) {
    if (p === period) return;
    setPeriod(p);
    const d = DEFAULTS[p];
    setIncome(d.income);
    setBhBase(d.income);
    setSelfDed(d.self);
    setDepDed(d.dep);
  }

  function reset() {
    setExempt(0);
    setDeps(0);
    setBhManual(0);
    setBhMode("auto");
    const d = DEFAULTS[period];
    setIncome(d.income);
    setBhBase(d.income);
    setSelfDed(d.self);
    setDepDed(d.dep);
  }

  const { ins, insBreakdown, totalDep, taxable, tax, net, eff, rows } = calcTax({
    period,
    income,
    exempt,
    deps,
    selfDed,
    depDed,
    bhMode,
    bhBase,
    bhManual,
  });

  return (
    <div className="tncn-tool">
      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Thuế thu nhập cá nhân</p>
          <h1>Tính thuế TNCN từ tiền lương, tiền công</h1>
          <p>
            Nhập thu nhập và thông tin giảm trừ — công cụ tự tính thuế theo biểu
            lũy tiến và chỉ rõ số thuế ở từng bậc. Dành cho cá nhân cư trú.
          </p>
        </section>

        <div className="legal">
          <span aria-hidden="true">📌</span>
          <div>
            Áp dụng quy định <b>mới nhất từ 01/01/2026</b>: giảm trừ bản thân{" "}
            <b>15,5 triệu/tháng</b>, mỗi người phụ thuộc <b>6,2 triệu/tháng</b>{" "}
            (Nghị quyết 110/2025/UBTVQH15), biểu thuế lũy tiến <b>5 bậc</b>. Bạn
            có thể tự sửa mức giảm trừ ở mục “Tùy chỉnh”.
          </div>
        </div>

        <div className="mode-tabs">
          <span className="mt-label">Kỳ tính thuế</span>
          <div className="mt-group" role="tablist">
            <button
              type="button"
              className={`mt ${period === "month" ? "on" : ""}`}
              aria-pressed={period === "month"}
              onClick={() => changePeriod("month")}
            >
              Theo tháng
            </button>
            <button
              type="button"
              className={`mt ${period === "year" ? "on" : ""}`}
              aria-pressed={period === "year"}
              onClick={() => changePeriod("year")}
            >
              Theo năm
            </button>
          </div>
        </div>

        <div className="app">
          {/* ============ FORM ============ */}
          <section className="card" aria-label="Thông tin tính thuế">
            <div className="card-head">
              <h2>Thông tin của bạn</h2>
              <span className="hint">Đơn vị: đồng/{per}</span>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="lbl" htmlFor="income">
                  Tổng thu nhập / {per}
                </label>
                <div className="money-input">
                  <input
                    id="income"
                    inputMode="numeric"
                    value={money(income)}
                    onChange={(e) => setIncome(digits(e.target.value))}
                  />
                  <span className="unit">đ</span>
                </div>
              </div>

              <div className="field">
                <label className="lbl" htmlFor="exempt">
                  Thu nhập miễn thuế / {per}{" "}
                  <span className="opt">(nếu có)</span>
                </label>
                <div className="money-input">
                  <input
                    id="exempt"
                    inputMode="numeric"
                    value={money(exempt)}
                    onChange={(e) => setExempt(digits(e.target.value))}
                  />
                  <span className="unit">đ</span>
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Các khoản được miễn: phần phụ trội tiền làm thêm giờ/ban đêm,
                  ăn ca trong mức, phụ cấp điện thoại, công tác phí… Sẽ được trừ
                  ra trước khi tính thuế.
                </p>
              </div>

              <div className="field">
                <label className="lbl">
                  Bảo hiểm bắt buộc (BHXH, BHYT, BHTN)
                </label>
                <div className="seg" role="tablist">
                  <button
                    type="button"
                    className={bhMode === "auto" ? "on" : ""}
                    onClick={() => setBhMode("auto")}
                  >
                    Theo lương đóng BH
                  </button>
                  <button
                    type="button"
                    className={bhMode === "manual" ? "on" : ""}
                    onClick={() => setBhMode("manual")}
                  >
                    Nhập số tiền
                  </button>
                </div>

                {bhMode === "auto" ? (
                  <div style={{ marginTop: 12 }}>
                    <label className="sublbl" htmlFor="bhBase">
                      Mức lương đóng BHXH
                    </label>
                    <div className="money-input">
                      <input
                        id="bhBase"
                        inputMode="numeric"
                        value={money(bhBase)}
                        onChange={(e) => setBhBase(digits(e.target.value))}
                      />
                      <span className="unit">đ</span>
                    </div>
                    <div className="bh-breakdown">
                      <span>
                        BHXH 8%
                        <b className="num">{formatVnd(insBreakdown.xh)}</b>
                      </span>
                      <span>
                        BHYT 1,5%
                        <b className="num">{formatVnd(insBreakdown.yt)}</b>
                      </span>
                      <span>
                        BHTN 1%
                        <b className="num">{formatVnd(insBreakdown.tn)}</b>
                      </span>
                    </div>
                    <p className="hint" style={{ marginTop: 8 }}>
                      Mặc định bằng thu nhập — sửa lại nếu công ty đóng BH trên
                      mức lương khác. Cá nhân đóng tổng <b>10,5%</b>.
                    </p>
                  </div>
                ) : (
                  <div className="money-input" style={{ marginTop: 10 }}>
                    <input
                      inputMode="numeric"
                      value={money(bhManual)}
                      onChange={(e) => setBhManual(digits(e.target.value))}
                    />
                    <span className="unit">đ</span>
                  </div>
                )}
              </div>

              <div className="field">
                <label className="lbl">Số người phụ thuộc</label>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Giảm"
                    onClick={() => setDeps(Math.max(0, deps - 1))}
                  >
                    −
                  </button>
                  <input
                    className="num"
                    inputMode="numeric"
                    aria-label="Số người phụ thuộc"
                    value={String(deps)}
                    onChange={(e) => setDeps(digits(e.target.value))}
                  />
                  <button
                    type="button"
                    aria-label="Tăng"
                    onClick={() => setDeps(deps + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                className={`adv-toggle ${advOpen ? "open" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setAdvOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setAdvOpen((v) => !v);
                  }
                }}
              >
                <span className="chev">▸</span> Tùy chỉnh mức giảm trừ
              </div>
              <div className={`adv ${advOpen ? "show" : ""}`}>
                <div className="two">
                  <div className="field" style={{ margin: 0 }}>
                    <label className="lbl" htmlFor="selfDed">
                      Giảm trừ bản thân
                    </label>
                    <div className="money-input">
                      <input
                        id="selfDed"
                        inputMode="numeric"
                        value={money(selfDed)}
                        onChange={(e) => setSelfDed(digits(e.target.value))}
                      />
                      <span className="unit">đ</span>
                    </div>
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label className="lbl" htmlFor="depDed">
                      Giảm trừ / người PT
                    </label>
                    <div className="money-input">
                      <input
                        id="depDed"
                        inputMode="numeric"
                        value={money(depDed)}
                        onChange={(e) => setDepDed(digits(e.target.value))}
                      />
                      <span className="unit">đ</span>
                    </div>
                  </div>
                </div>
                <p className="hint" style={{ marginTop: 10 }}>
                  Mặc định theo Nghị quyết 110/2025, tự đổi theo kỳ (tháng/năm).
                  Sửa lại nếu cần tính cho trường hợp khác.
                </p>
              </div>
            </div>
          </section>

          {/* ============ RESULTS ============ */}
          <section className="card" aria-label="Kết quả">
            <div className="card-head">
              <h2>Kết quả tính thuế</h2>
              <span className="hint">
                Thuế suất hiệu dụng: {eff.toFixed(1).replace(".", ",")}%
              </span>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <div className="stat hero-stat">
                  <div className="k">Thuế TNCN phải nộp / {per}</div>
                  <div className="v num">{formatVnd(tax)}</div>
                  <div className="sub">
                    {period === "year"
                      ? "Bình quân/tháng: " + formatVnd(tax / 12)
                      : "Cả năm: " + formatVnd(tax * 12)}
                  </div>
                </div>
                <div className="stat net">
                  <div className="k">Lương thực nhận (Net)</div>
                  <div className="v num">{formatVnd(net)}</div>
                </div>
                <div className="stat">
                  <div className="k">Thu nhập tính thuế</div>
                  <div className="v num">{formatVnd(taxable)}</div>
                </div>
              </div>

              <div className="breakdown">
                <div className="brk-line">
                  <span className="lab">Tổng thu nhập</span>
                  <span className="val num">{formatVnd(income)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Thu nhập miễn thuế</span>
                  <span className="val num">− {formatVnd(exempt)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Bảo hiểm bắt buộc (cá nhân đóng)</span>
                  <span className="val num">− {formatVnd(ins)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Giảm trừ bản thân</span>
                  <span className="val num">− {formatVnd(selfDed)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Giảm trừ {deps} người phụ thuộc</span>
                  <span className="val num">− {formatVnd(totalDep)}</span>
                </div>
                <div className="brk-line total">
                  <span className="lab">= Thu nhập tính thuế</span>
                  <span className="val num">{formatVnd(taxable)}</span>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <div className="tbl-title">
                  Chi tiết thuế theo từng bậc (biểu 5 bậc 2026)
                </div>
                <div className="tbl-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Bậc — Thu nhập tính thuế/{per}</th>
                        <th>Thuế suất</th>
                        <th>Tiền thuế</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr
                          key={r.index}
                          className={`${r.span <= 0 ? "zero" : ""} ${
                            r.active && r.span > 0 ? "active" : ""
                          }`}
                        >
                          <td>
                            Bậc {r.index + 1} · {formatRange(r.floor, r.ceil)}
                          </td>
                          <td>
                            <span className="rate-pill">{r.rate * 100}%</span>
                          </td>
                          <td>{formatVnd(r.tax)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Tổng thuế TNCN</td>
                        <td></td>
                        <td>{formatVnd(tax)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
                  🖨️ In / Lưu PDF
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={reset}
                >
                  ↺ Nhập lại
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="disclaimer">
          <b>Lưu ý:</b> Công cụ tính cho <b>cá nhân cư trú</b> có thu nhập từ{" "}
          <b>tiền lương, tiền công</b>. Kết quả mang tính tham khảo, chưa bao gồm
          các khoản thu nhập miễn thuế đặc thù hay trần đóng bảo hiểm bắt buộc.
          Vui lòng đối chiếu quy định hiện hành khi quyết toán.
          <br />
          Căn cứ: Nghị quyết 110/2025/UBTVQH15 (giảm trừ gia cảnh) &amp; biểu
          thuế lũy tiến từng phần 5 bậc áp dụng từ kỳ tính thuế 2026.
        </div>
      </div>
    </div>
  );
}
