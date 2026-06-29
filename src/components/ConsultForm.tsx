"use client";

import { useState } from "react";

const TOPICS = [
  "Tư vấn thuế TNCN",
  "Kế toán doanh nghiệp",
  "Quyết toán thuế",
  "Hóa đơn - kê khai",
  "Khác",
];

const inputCls =
  "w-full rounded-[10px] border border-[#DCE1EB] bg-[#F4F6FC] px-3.5 py-3 text-[15px] text-[#1E2330] outline-none transition focus:border-[#3E63DD] focus:bg-white focus:ring-[3px] focus:ring-[#E7ECFC]";
const labelCls = "mb-1.5 block text-[13px] font-semibold text-[#1E2330]";

export function ConsultForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, topic, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Có lỗi xảy ra.");
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-[14px] border border-[#0FA8A2]/40 bg-[#0FA8A2]/5 p-8 text-center">
        <div className="text-3xl" aria-hidden="true">
          ✅
        </div>
        <h3 className="mt-2 text-[18px] font-bold text-[#1E2330]">
          Đã gửi thành công!
        </h3>
        <p className="mt-1 text-[14px] text-[#5E6675]">
          Cảm ơn bạn. Kế toán SEONGON sẽ liên hệ tư vấn trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-[#DCE1EB] bg-white p-6 shadow-[0_14px_40px_-22px_rgba(30,35,48,0.5)] sm:p-8">
      <h3 className="text-[20px] font-extrabold tracking-tight text-[#1E2330]">
        Cần tư vấn thuế &amp; kế toán?
      </h3>
      <p className="mt-1.5 text-[14px] text-[#5E6675]">
        Để lại thông tin, đội ngũ Kế toán SEONGON sẽ liên hệ tư vấn miễn phí.
      </p>

      <form
        onSubmit={submit}
        className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2"
      >
        <div>
          <label className={labelCls} htmlFor="cf-name">
            Họ và tên *
          </label>
          <input
            id="cf-name"
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-phone">
            Số điện thoại *
          </label>
          <input
            id="cf-phone"
            className={inputCls}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="09xx xxx xxx"
            required
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-email">
            Email (không bắt buộc)
          </label>
          <input
            id="cf-email"
            className={inputCls}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@cong-ty.vn"
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="cf-topic">
            Nhu cầu
          </label>
          <select
            id="cf-topic"
            className={inputCls}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="cf-note">
            Lời nhắn (không bắt buộc)
          </label>
          <textarea
            id="cf-note"
            className={inputCls}
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Mô tả ngắn nhu cầu của bạn…"
          />
        </div>

        {status === "error" && (
          <p className="text-[13px] font-medium text-[#E5186B] sm:col-span-2">
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#3E63DD] px-6 py-3 text-[14px] font-bold text-white transition hover:bg-[#2C49B8] disabled:opacity-60"
          >
            {status === "sending" ? "Đang gửi…" : "Gửi thông tin"}
          </button>
        </div>
      </form>
    </div>
  );
}
