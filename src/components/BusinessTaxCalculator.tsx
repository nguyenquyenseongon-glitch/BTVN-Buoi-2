"use client";

import { useState } from "react";
import {
  calcVat,
  calcCit,
  calcFct,
  VAT_RATES,
  FCT_PRESETS,
} from "@/lib/business-tax";
import { formatVnd } from "@/lib/tax";
import "./tncn-tool.css";

const money = (n: number) => (n ? n.toLocaleString("vi-VN") : "");
const digits = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

type TaxType = "gtgt" | "tndn" | "nhathau";

const TYPES: { key: TaxType; label: string }[] = [
  { key: "gtgt", label: "Thuế GTGT" },
  { key: "tndn", label: "Thuế TNDN" },
  { key: "nhathau", label: "Thuế nhà thầu" },
];

export function BusinessTaxCalculator() {
  const [taxType, setTaxType] = useState<TaxType>("gtgt");

  // GTGT
  const [vatInclusive, setVatInclusive] = useState(false);
  const [vatAmount, setVatAmount] = useState<number>(10_000_000);
  const [vatRate, setVatRate] = useState<number>(10);

  // TNDN
  const [revenue, setRevenue] = useState<number>(1_000_000_000);
  const [expenses, setExpenses] = useState<number>(700_000_000);
  const [citRate, setCitRate] = useState<number>(20);

  // Thuế nhà thầu
  const [fctRevenue, setFctRevenue] = useState<number>(1_000_000_000);
  const [fctPreset, setFctPreset] = useState<string>("service");
  const [fctVat, setFctVat] = useState<number>(5);
  const [fctCit, setFctCit] = useState<number>(5);

  function applyPreset(key: string) {
    setFctPreset(key);
    const p = FCT_PRESETS.find((x) => x.key === key);
    if (p && key !== "custom") {
      setFctVat(p.vat);
      setFctCit(p.cit);
    }
  }

  const vat = calcVat(vatAmount, vatRate, vatInclusive);
  const cit = calcCit(revenue, expenses, citRate);
  const fct = calcFct(fctRevenue, fctVat, fctCit);

  return (
    <div className="tncn-tool">
      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Thuế doanh nghiệp</p>
          <h1>Tính các loại thuế doanh nghiệp</h1>
          <p>
            Chọn loại thuế cần tính — Thuế GTGT, Thuế TNDN, hoặc Thuế nhà thầu —
            rồi nhập số liệu để công cụ tính nhanh cho bạn.
          </p>
        </section>

        <div className="mode-tabs">
          <span className="mt-label">Loại thuế</span>
          <div className="mt-group" role="tablist">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`mt ${taxType === t.key ? "on" : ""}`}
                aria-pressed={taxType === t.key}
                onClick={() => setTaxType(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ============ THUẾ GTGT ============ */}
        {taxType === "gtgt" && (
          <div className="app">
            <section className="card" aria-label="Thông tin GTGT">
              <div className="card-head">
                <h2>Thuế GTGT (VAT)</h2>
                <span className="hint">Đơn vị: đồng</span>
              </div>
              <div className="card-body">
                <div className="field">
                  <label className="lbl">Số tiền đang nhập là</label>
                  <div className="seg" role="tablist">
                    <button
                      type="button"
                      className={!vatInclusive ? "on" : ""}
                      onClick={() => setVatInclusive(false)}
                    >
                      Giá chưa thuế
                    </button>
                    <button
                      type="button"
                      className={vatInclusive ? "on" : ""}
                      onClick={() => setVatInclusive(true)}
                    >
                      Giá đã có thuế
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="vatAmount">
                    {vatInclusive
                      ? "Giá ĐÃ có thuế (đã gồm GTGT)"
                      : "Giá CHƯA có thuế (chưa gồm GTGT)"}
                  </label>
                  <div className="money-input">
                    <input
                      id="vatAmount"
                      inputMode="numeric"
                      value={money(vatAmount)}
                      onChange={(e) => setVatAmount(digits(e.target.value))}
                    />
                    <span className="unit">đ</span>
                  </div>
                </div>
                <div className="field">
                  <label className="lbl">Thuế suất GTGT</label>
                  <div className="seg" role="tablist">
                    {VAT_RATES.map((rt) => (
                      <button
                        key={rt}
                        type="button"
                        className={vatRate === rt ? "on" : ""}
                        onClick={() => setVatRate(rt)}
                      >
                        {rt}%
                      </button>
                    ))}
                  </div>
                  <p className="hint" style={{ marginTop: 8 }}>
                    10% (chung), 8% (được giảm theo chính sách), 5% (thiết yếu),
                    0% (xuất khẩu).
                  </p>
                </div>
              </div>
            </section>

            <section className="card" aria-label="Kết quả GTGT">
              <div className="card-head">
                <h2>Kết quả</h2>
                <span className="hint">Thuế suất {vatRate}%</span>
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <div className="stat hero-stat">
                    <div className="k">Tiền thuế GTGT ({vatRate}%)</div>
                    <div className="v num">{formatVnd(vat.vat)}</div>
                  </div>
                  <div className="stat net">
                    <div className="k">Giá chưa thuế</div>
                    <div className="v num">{formatVnd(vat.before)}</div>
                  </div>
                  <div className="stat">
                    <div className="k">Giá đã có thuế</div>
                    <div className="v num">{formatVnd(vat.after)}</div>
                  </div>
                </div>
                <div className="breakdown">
                  <div className="brk-line">
                    <span className="lab">Giá chưa thuế</span>
                    <span className="val num">{formatVnd(vat.before)}</span>
                  </div>
                  <div className="brk-line">
                    <span className="lab">+ Thuế GTGT ({vatRate}%)</span>
                    <span className="val num">{formatVnd(vat.vat)}</span>
                  </div>
                  <div className="brk-line total">
                    <span className="lab">= Giá đã có thuế</span>
                    <span className="val num">{formatVnd(vat.after)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============ THUẾ TNDN ============ */}
        {taxType === "tndn" && (
          <div className="app">
            <section className="card" aria-label="Thông tin TNDN">
              <div className="card-head">
                <h2>Thuế TNDN</h2>
                <span className="hint">Đơn vị: đồng</span>
              </div>
              <div className="card-body">
                <div className="field">
                  <label className="lbl" htmlFor="revenue">
                    Doanh thu tính thuế (trong kỳ)
                  </label>
                  <div className="money-input">
                    <input
                      id="revenue"
                      inputMode="numeric"
                      value={money(revenue)}
                      onChange={(e) => setRevenue(digits(e.target.value))}
                    />
                    <span className="unit">đ</span>
                  </div>
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="expenses">
                    Chi phí được trừ
                  </label>
                  <div className="money-input">
                    <input
                      id="expenses"
                      inputMode="numeric"
                      value={money(expenses)}
                      onChange={(e) => setExpenses(digits(e.target.value))}
                    />
                    <span className="unit">đ</span>
                  </div>
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="citRate">
                    Thuế suất TNDN
                  </label>
                  <div className="money-input">
                    <input
                      id="citRate"
                      inputMode="numeric"
                      value={String(citRate)}
                      onChange={(e) => setCitRate(digits(e.target.value))}
                    />
                    <span className="unit">%</span>
                  </div>
                  <p className="hint" style={{ marginTop: 8 }}>
                    Phổ biến <b>20%</b>. Doanh nghiệp nhỏ có thể áp <b>15%</b>{" "}
                    hoặc <b>17%</b> theo doanh thu — chọn đúng mức của bạn.
                  </p>
                </div>
              </div>
            </section>

            <section className="card" aria-label="Kết quả TNDN">
              <div className="card-head">
                <h2>Kết quả</h2>
                <span className="hint">Thuế suất {citRate}%</span>
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <div className="stat hero-stat">
                    <div className="k">Thuế TNDN phải nộp</div>
                    <div className="v num">{formatVnd(cit.tax)}</div>
                  </div>
                  <div className="stat net">
                    <div className="k">Thu nhập tính thuế</div>
                    <div className="v num">{formatVnd(cit.taxable)}</div>
                  </div>
                  <div className="stat">
                    <div className="k">Lợi nhuận sau thuế</div>
                    <div className="v num">{formatVnd(cit.profitAfter)}</div>
                  </div>
                </div>
                <div className="breakdown">
                  <div className="brk-line">
                    <span className="lab">Doanh thu</span>
                    <span className="val num">{formatVnd(revenue)}</span>
                  </div>
                  <div className="brk-line minus">
                    <span className="lab">− Chi phí được trừ</span>
                    <span className="val num">− {formatVnd(expenses)}</span>
                  </div>
                  <div className="brk-line total">
                    <span className="lab">= Thu nhập tính thuế</span>
                    <span className="val num">{formatVnd(cit.taxable)}</span>
                  </div>
                  <div className="brk-line minus">
                    <span className="lab">− Thuế TNDN ({citRate}%)</span>
                    <span className="val num">− {formatVnd(cit.tax)}</span>
                  </div>
                  <div className="brk-line total">
                    <span className="lab">= Lợi nhuận sau thuế</span>
                    <span className="val num">{formatVnd(cit.profitAfter)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============ THUẾ NHÀ THẦU ============ */}
        {taxType === "nhathau" && (
          <div className="app">
            <section className="card" aria-label="Thông tin thuế nhà thầu">
              <div className="card-head">
                <h2>Thuế nhà thầu</h2>
                <span className="hint">Phương pháp trực tiếp</span>
              </div>
              <div className="card-body">
                <div className="field">
                  <label className="lbl" htmlFor="fctRevenue">
                    Doanh thu tính thuế
                  </label>
                  <div className="money-input">
                    <input
                      id="fctRevenue"
                      inputMode="numeric"
                      value={money(fctRevenue)}
                      onChange={(e) => setFctRevenue(digits(e.target.value))}
                    />
                    <span className="unit">đ</span>
                  </div>
                </div>
                <div className="field">
                  <label className="lbl" htmlFor="fctPreset">
                    Loại hoạt động
                  </label>
                  <select
                    id="fctPreset"
                    className="select-input"
                    value={fctPreset}
                    onChange={(e) => applyPreset(e.target.value)}
                  >
                    {FCT_PRESETS.map((p) => (
                      <option key={p.key} value={p.key}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="adv">
                  <div className="two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="field" style={{ margin: 0 }}>
                      <label className="lbl" htmlFor="fctVat">
                        Tỷ lệ GTGT
                      </label>
                      <div className="money-input">
                        <input
                          id="fctVat"
                          inputMode="numeric"
                          value={String(fctVat)}
                          onChange={(e) => {
                            setFctVat(digits(e.target.value));
                            setFctPreset("custom");
                          }}
                        />
                        <span className="unit">%</span>
                      </div>
                    </div>
                    <div className="field" style={{ margin: 0 }}>
                      <label className="lbl" htmlFor="fctCit">
                        Tỷ lệ TNDN
                      </label>
                      <div className="money-input">
                        <input
                          id="fctCit"
                          inputMode="numeric"
                          value={String(fctCit)}
                          onChange={(e) => {
                            setFctCit(digits(e.target.value));
                            setFctPreset("custom");
                          }}
                        />
                        <span className="unit">%</span>
                      </div>
                    </div>
                  </div>
                  <p className="hint" style={{ marginTop: 10 }}>
                    Chọn loại hoạt động để tự điền tỷ lệ theo Thông tư
                    103/2014/TT-BTC, hoặc sửa tay nếu cần.
                  </p>
                </div>
              </div>
            </section>

            <section className="card" aria-label="Kết quả thuế nhà thầu">
              <div className="card-head">
                <h2>Kết quả</h2>
                <span className="hint">
                  GTGT {fctVat}% + TNDN {fctCit}%
                </span>
              </div>
              <div className="card-body">
                <div className="stat-row">
                  <div className="stat hero-stat">
                    <div className="k">Tổng thuế nhà thầu phải nộp</div>
                    <div className="v num">{formatVnd(fct.total)}</div>
                  </div>
                  <div className="stat net">
                    <div className="k">Phần GTGT ({fctVat}%)</div>
                    <div className="v num">{formatVnd(fct.vat)}</div>
                  </div>
                  <div className="stat">
                    <div className="k">Phần TNDN ({fctCit}%)</div>
                    <div className="v num">{formatVnd(fct.cit)}</div>
                  </div>
                </div>
                <div className="breakdown">
                  <div className="brk-line">
                    <span className="lab">Doanh thu tính thuế</span>
                    <span className="val num">{formatVnd(fctRevenue)}</span>
                  </div>
                  <div className="brk-line">
                    <span className="lab">+ Thuế GTGT ({fctVat}%)</span>
                    <span className="val num">{formatVnd(fct.vat)}</span>
                  </div>
                  <div className="brk-line">
                    <span className="lab">+ Thuế TNDN ({fctCit}%)</span>
                    <span className="val num">{formatVnd(fct.cit)}</span>
                  </div>
                  <div className="brk-line total">
                    <span className="lab">= Tổng thuế nhà thầu</span>
                    <span className="val num">{formatVnd(fct.total)}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="actions" style={{ padding: "0 0 8px" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.print()}
          >
            🖨️ In / Lưu PDF
          </button>
        </div>

        <div className="disclaimer">
          <b>Lưu ý:</b> Công cụ tính nhanh mang tính tham khảo.{" "}
          <b>Thuế nhà thầu</b> có nhiều trường hợp, tỷ lệ phụ thuộc loại hoạt
          động và điều khoản hợp đồng (giá đã gồm hay chưa gồm thuế) — hãy đối
          chiếu Thông tư 103/2014/TT-BTC. <b>Thuế TNDN</b> giả định thu nhập tính
          thuế = doanh thu − chi phí được trừ (chưa gồm điều chỉnh, ưu đãi, lỗ
          kết chuyển). Vui lòng đối chiếu quy định hiện hành khi quyết toán.
        </div>
      </div>
    </div>
  );
}
