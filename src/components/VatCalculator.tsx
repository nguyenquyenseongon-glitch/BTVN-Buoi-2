"use client";

import { useState } from "react";
import { formatVnd } from "@/lib/tax";
import "./tncn-tool.css";

const money = (n: number) => (n ? n.toLocaleString("vi-VN") : "");
const digits = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

const RATES = [0, 5, 8, 10];
type Mode = "exclusive" | "inclusive";

export function VatCalculator() {
  const [mode, setMode] = useState<Mode>("exclusive");
  const [amount, setAmount] = useState<number>(10_000_000);
  const [rate, setRate] = useState<number>(10);

  const rr = rate / 100;
  let before: number;
  let after: number;
  if (mode === "exclusive") {
    before = amount;
    after = amount * (1 + rr);
  } else {
    after = amount;
    before = amount / (1 + rr);
  }
  const vat = after - before;

  const amountLabel =
    mode === "exclusive"
      ? "Giá CHƯA có thuế (chưa gồm GTGT)"
      : "Giá ĐÃ có thuế (đã gồm GTGT)";

  return (
    <div className="tncn-tool">
      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Thuế giá trị gia tăng</p>
          <h1>Tính thuế GTGT (VAT)</h1>
          <p>
            Tách hoặc cộng thuế GTGT theo thuế suất. Hỗ trợ cả giá đã gồm thuế và
            chưa gồm thuế.
          </p>
        </section>

        <div className="mode-tabs">
          <span className="mt-label">Số tiền đang nhập là</span>
          <div className="mt-group" role="tablist">
            <button
              type="button"
              className={`mt ${mode === "exclusive" ? "on" : ""}`}
              aria-pressed={mode === "exclusive"}
              onClick={() => setMode("exclusive")}
            >
              Giá chưa thuế
            </button>
            <button
              type="button"
              className={`mt ${mode === "inclusive" ? "on" : ""}`}
              aria-pressed={mode === "inclusive"}
              onClick={() => setMode("inclusive")}
            >
              Giá đã có thuế
            </button>
          </div>
        </div>

        <div className="app">
          {/* FORM */}
          <section className="card" aria-label="Thông tin">
            <div className="card-head">
              <h2>Thông tin</h2>
              <span className="hint">Đơn vị: đồng</span>
            </div>
            <div className="card-body">
              <div className="field">
                <label className="lbl" htmlFor="amount">
                  {amountLabel}
                </label>
                <div className="money-input">
                  <input
                    id="amount"
                    inputMode="numeric"
                    value={money(amount)}
                    onChange={(e) => setAmount(digits(e.target.value))}
                  />
                  <span className="unit">đ</span>
                </div>
              </div>

              <div className="field">
                <label className="lbl">Thuế suất GTGT</label>
                <div className="seg" role="tablist">
                  {RATES.map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      className={rate === rt ? "on" : ""}
                      onClick={() => setRate(rt)}
                    >
                      {rt}%
                    </button>
                  ))}
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Mức phổ biến: 10% (chung), 8% (được giảm theo chính sách), 5%
                  (hàng hóa/dịch vụ thiết yếu), 0% (xuất khẩu).
                </p>
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section className="card" aria-label="Kết quả">
            <div className="card-head">
              <h2>Kết quả</h2>
              <span className="hint">Thuế suất {rate}%</span>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <div className="stat hero-stat">
                  <div className="k">Tiền thuế GTGT ({rate}%)</div>
                  <div className="v num">{formatVnd(vat)}</div>
                </div>
                <div className="stat net">
                  <div className="k">Giá chưa thuế</div>
                  <div className="v num">{formatVnd(before)}</div>
                </div>
                <div className="stat">
                  <div className="k">Giá đã có thuế</div>
                  <div className="v num">{formatVnd(after)}</div>
                </div>
              </div>

              <div className="breakdown">
                <div className="brk-line">
                  <span className="lab">Giá chưa thuế</span>
                  <span className="val num">{formatVnd(before)}</span>
                </div>
                <div className="brk-line">
                  <span className="lab">+ Thuế GTGT ({rate}%)</span>
                  <span className="val num">{formatVnd(vat)}</span>
                </div>
                <div className="brk-line total">
                  <span className="lab">= Giá đã có thuế</span>
                  <span className="val num">{formatVnd(after)}</span>
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
              </div>
            </div>
          </section>
        </div>

        <div className="disclaimer">
          <b>Lưu ý:</b> Công cụ tính nhanh thuế GTGT theo thuế suất bạn chọn. Mức
          thuế suất áp dụng cho từng loại hàng hóa/dịch vụ theo quy định hiện
          hành — vui lòng đối chiếu khi xuất hóa đơn. Kết quả mang tính tham
          khảo.
        </div>
      </div>
    </div>
  );
}
