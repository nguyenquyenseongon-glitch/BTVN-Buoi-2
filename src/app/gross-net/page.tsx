import type { Metadata } from "next";
import { GrossNetCalculator } from "@/components/GrossNetCalculator";
import { ConsultForm } from "@/components/ConsultForm";

export const metadata: Metadata = {
  title: "Đổi lương Gross ↔ Net",
  description:
    "Công cụ quy đổi lương Gross sang Net và ngược lại: tự động trừ bảo hiểm bắt buộc 10,5% và thuế TNCN theo quy định 2026.",
};

export default function Page() {
  return (
    <>
      <GrossNetCalculator />
      <div className="mx-auto max-w-[760px] px-[22px] pb-20">
        <ConsultForm />
      </div>
    </>
  );
}
