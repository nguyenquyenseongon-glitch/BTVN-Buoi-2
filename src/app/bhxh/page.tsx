import type { Metadata } from "next";
import { BhxhCalculator } from "@/components/BhxhCalculator";
import { ConsultForm } from "@/components/ConsultForm";

export const metadata: Metadata = {
  title: "Tính bảo hiểm xã hội (BHXH, BHYT, BHTN)",
  description:
    "Công cụ tính mức đóng bảo hiểm bắt buộc hàng tháng của người lao động và doanh nghiệp theo mức lương đóng BHXH.",
};

export default function Page() {
  return (
    <>
      <BhxhCalculator />
      <div className="mx-auto max-w-[760px] px-[22px] pb-20">
        <ConsultForm />
      </div>
    </>
  );
}
