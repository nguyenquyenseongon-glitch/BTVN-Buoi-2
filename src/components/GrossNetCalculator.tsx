"use client";

import { useState } from "react";
import { grossToNet, netToGross, INS_RATE } from "@/lib/salary";
import { formatVnd, DEFAULTS } from "@/lib/tax";
import "./tncn-tool.css";

const money = (n: number) => (n ? n.toLocaleString("vi-VN") : "");
const digits = (s: string) => parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

type Mode = "g2n" | "n2g";

export function GrossNetCalculator() {
  const [mode, setMode] = useState<Mode>("g2n");
  const [amount, setAmount] = useState<number>(DEFAULTS.month.income);
  const [bhxhBase, setBhxhBase] = useState<number>(DEFAULTS.month.income);
  const [exempt, setExempt] = useState(0);
  const [deps, setDeps] = useState(0);
  const [selfDed, setSelfDed] = useState<number>(DEFAULTS.month.self);
  const [depDed, setDepDed] = useState<number>(DEFAULTS.month.dep);
  const [advOpen, setAdvOpen] = useState(false);

  const opt = { bhxhBase, exempt, selfDed, deps, depDed };
  const r = mode === "g2n" ? grossToNet(amount, opt) : netToGross(amount, opt);

  const amountLabel =
    mode === "g2n" ? "Lương Gross / tháng" : "Lương Net mong muốn / tháng";

  function reset() {
    setAmount(DEFAULTS.month.income);
    setBhxhBase(DEFAULTS.month.income);
    setExempt(0);
    setDeps(0);
    setSelfDed(DEFAULTS.month.self);
    setDepDed(DEFAULTS.month.dep);
  }

  return (
    <div className="tncn-tool">
      <div className="wrap">
        <section className="hero">
          <p className="eyebrow">Lương Gross &amp; Net</p>
          <h1>Đổi lương Gross ↔ Net</h1>
          <p>
            Quy đổi qua lại giữa lương Gross (tổng) và lương Net (thực nhận), tự
            động trừ bảo hiểm bắt buộc và thuế TNCN. Tính theo tháng.
          </p>
        </section>

        <div className="mode-tabs">
          <span className="mt-label">Chiều quy đổi</span>
          <div className="mt-group" role="tablist">
            <button
              type="button"
              className={`mt ${mode === "g2n" ? "on" : ""}`}
              aria-pressed={mode === "g2n"}
              onClick={() => setMode("g2n")}
            >
              Gross → Net
            </button>
            <button
              type="button"
              className={`mt ${mode === "n2g" ? "on" : ""}`}
              aria-pressed={mode === "n2g"}
              onClick={() => setMode("n2g")}
            >
              Net → Gross
            </button>
          </div>
        </div>

        <div className="app">
          {/* FORM */}
          <section className="card" aria-label="Thông tin">
            <div className="card-head">
              <h2>Thông tin của bạn</h2>
              <span className="hint">Đơn vị: đồng/tháng</span>
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
                <label className="lbl" htmlFor="bhxhBase">
                  Lương đóng BHXH
                </label>
                <div className="money-input">
                  <input
                    id="bhxhBase"
                    inputMode="numeric"
                    value={money(bhxhBase)}
                    onChange={(e) => setBhxhBase(digits(e.target.value))}
                  />
                  <span className="unit">đ</span>
                </div>
                <div className="bh-breakdown">
                  <span>
                    BHXH 8%<b className="num">{formatVnd(r.insBreakdown.xh)}</b>
                  </span>
                  <span>
                    BHYT 1,5%<b className="num">{formatVnd(r.insBreakdown.yt)}</b>
                  </span>
                  <span>
                    BHTN 1%<b className="num">{formatVnd(r.insBreakdown.tn)}</b>
                  </span>
                </div>
                <p className="hint" style={{ marginTop: 8 }}>
                  Thường bằng lương Gross — sửa lại nếu công ty đóng BH trên mức
                  lương khác. Cá nhân đóng tổng{" "}
                  <b>{(INS_RATE * 100).toFixed(1).replace(".", ",")}%</b>.
                </p>
              </div>

              <div className="field">
                <label className="lbl" htmlFor="exempt">
                  Phụ cấp miễn thuế / tháng{" "}
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
                  Các khoản phụ cấp được miễn: ăn ca trong mức, điện thoại, công
                  tác phí, phần làm thêm giờ được miễn… Trừ ra trước khi tính
                  thuế (vẫn nằm trong lương nhận về).
                </p>
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
              </div>
            </div>
          </section>

          {/* RESULTS */}
          <section className="card" aria-label="Kết quả">
            <div className="card-head">
              <h2>Kết quả quy đổi</h2>
              <span className="hint">Bảo hiểm + thuế TNCN</span>
            </div>
            <div className="card-body">
              <div className="stat-row">
                <div className="stat hero-stat">
                  <div className="k">
                    {mode === "g2n"
                      ? "Lương Net (thực nhận) / tháng"
                      : "Lương Gross (tổng) / tháng"}
                  </div>
                  <div className="v num">
                    {formatVnd(mode === "g2n" ? r.net : r.gross)}
                  </div>
                </div>
                <div className="stat net">
                  <div className="k">
                    {mode === "g2n"
                      ? "Lương Gross đã nhập"
                      : "Lương Net mong muốn"}
                  </div>
                  <div className="v num">
                    {formatVnd(mode === "g2n" ? r.gross : r.net)}
                  </div>
                </div>
                <div className="stat">
                  <div className="k">Thuế TNCN / tháng</div>
                  <div className="v num">{formatVnd(r.tax)}</div>
                </div>
              </div>

              {/* Lương thực nhận */}
              <div className="tbl-title" style={{ marginTop: 4 }}>
                Lương thực nhận
              </div>
              <div className="breakdown" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                <div className="brk-line">
                  <span className="lab">Lương Gross</span>
                  <span className="val num">{formatVnd(r.gross)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Bảo hiểm bắt buộc (cá nhân đóng)</span>
                  <span className="val num">− {formatVnd(r.ins)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Thuế TNCN</span>
                  <span className="val num">− {formatVnd(r.tax)}</span>
                </div>
                <div className="brk-line total">
                  <span className="lab">= Lương Net (thực nhận)</span>
                  <span className="val num">{formatVnd(r.net)}</span>
                </div>
              </div>

              {/* Cách tính thu nhập tính thuế */}
              <div className="tbl-title" style={{ marginTop: 22 }}>
                Cách tính thu nhập tính thuế
              </div>
              <div className="breakdown" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
                <div className="brk-line">
                  <span className="lab">Lương Gross</span>
                  <span className="val num">{formatVnd(r.gross)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Bảo hiểm bắt buộc</span>
                  <span className="val num">− {formatVnd(r.ins)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Phụ cấp miễn thuế</span>
                  <span className="val num">− {formatVnd(r.exempt)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Giảm trừ bản thân</span>
                  <span className="val num">− {formatVnd(selfDed)}</span>
                </div>
                <div className="brk-line minus">
                  <span className="lab">− Giảm trừ {deps} người phụ thuộc</span>
                  <span className="val num">− {formatVnd(deps * depDed)}</span>
                </div>
                <div className="brk-line total">
                  <span className="lab">= Thu nhập tính thuế</span>
                  <span className="val num">{formatVnd(r.taxable)}</span>
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
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  ↺ Nhập lại
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="disclaimer">
          <b>Lưu ý:</b> Bảo hiểm bắt buộc tính trên <b>lương đóng BHXH</b> bạn
          nhập (tổng cá nhân đóng{" "}
          {(INS_RATE * 100).toFixed(1).replace(".", ",")}%), chưa áp trần đóng
          bảo hiểm. Phụ cấp miễn thuế chỉ giảm phần thu nhập tính thuế (vẫn nằm
          trong lương nhận về). Giảm trừ gia cảnh theo Nghị quyết 110/2025. Kết
          quả mang tính tham khảo.
        </div>
      </div>
    </div>
  );
}
