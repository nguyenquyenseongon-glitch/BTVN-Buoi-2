import type { Metadata } from "next";
import { TaxTNCNCalculator } from "@/components/TaxTNCNCalculator";
import { ConsultForm } from "@/components/ConsultForm";

export const metadata: Metadata = {
  title: "Tính thuế TNCN 2026",
  description:
    "Công cụ tính thuế thu nhập cá nhân 2026: giảm trừ gia cảnh 15,5 triệu, biểu thuế lũy tiến 5 bậc, có thu nhập miễn thuế và bảo hiểm bắt buộc.",
};

export default function Page() {
  return (
    <>
      <TaxTNCNCalculator />
      <div className="mx-auto max-w-[760px] px-[22px] pb-20">
        <ConsultForm />
      </div>
    </>
  );
}
