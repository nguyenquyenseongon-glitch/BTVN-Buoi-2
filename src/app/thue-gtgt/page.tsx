import type { Metadata } from "next";
import { VatCalculator } from "@/components/VatCalculator";
import { ConsultForm } from "@/components/ConsultForm";

export const metadata: Metadata = {
  title: "Tính thuế GTGT (VAT)",
  description:
    "Công cụ tính thuế giá trị gia tăng theo thuế suất 0%, 5%, 8%, 10%. Hỗ trợ tách thuế từ giá đã gồm và cộng thuế vào giá chưa gồm.",
};

export default function Page() {
  return (
    <>
      <VatCalculator />
      <div className="mx-auto max-w-[760px] px-[22px] pb-20">
        <ConsultForm />
      </div>
    </>
  );
}
