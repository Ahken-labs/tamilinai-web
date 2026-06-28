import Header from "@/src/components/Header";
import RefundPolicy from "@/src/components/more/RefundPolicySection";

export const metadata = {
  title: "Refund & Return Policy — Inai Tamil Matrimony",
  description: "Read the Refund and Cancellation Policy for Inai Elite Membership. Understand your refund eligibility, cancellation windows, and how to request a refund.",
  alternates: { canonical: "https://inai.lk/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F2]">
        <div className="sticky top-[68px] lg:top-[76px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE]">
          <div className="flex items-center justify-center py-2 md:py-3">
            <span className="font-poppins font-semibold font-24 text-dark">Refund &amp; Return Policy</span>
          </div>
        </div>
        <div className="pb-8 px-auto bg-[#F8F5F2] pt-6 md:pt-8 px-4 max-[370px]:px-2">
          <div className="rounded-[20px] max-w-[920px] bg-white p-4 md:p-6 mx-auto">
            <RefundPolicy />
          </div>
        </div>
      </main>
    </>
  );
}
