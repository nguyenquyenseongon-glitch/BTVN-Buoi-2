import type { Metadata } from "next";
import { BusinessTaxCalculator } from "@/components/BusinessTaxCalculator";
import { ConsultForm } from "@/components/ConsultForm";

export const metadata: Metadata = {
  title: "Tính thuế doanh nghiệp (GTGT, TNDN, Nhà thầu)",
  description:
    "Công cụ tính nhanh thuế doanh nghiệp: thuế GTGT, thuế thu nhập doanh nghiệp (TNDN) và thuế nhà thầu theo quy định hiện hành.",
};

export default function Page() {
  return (
    <>
      <BusinessTaxCalculator />
      <div className="mx-auto max-w-[760px] px-[22px] pb-20">
        <ConsultForm />
      </div>
    </>
  );
}
