"use client";

import RefundPolicy from "@/src/components/more/RefundPolicySection";

export default function RefundPolicyPage() {

    return (
        <div className="pb-16 font-poppins min-h-screen bg-[#F8F5F2]">
            {/* Sticky sub-header */}
            <div className="sticky top-[74px] z-10 w-full border-t border-[#EEEEEE] bg-white">
                <div className="flex items-center justify-center px-4 py-3">
                    <span className="select-none font-24 font-semibold text-dark">Refund and cancellation policy</span>
                </div>
            </div>

            <div className="mt-8 py-6 rounded-[20px] bg-[#FFF] mx-auto max-w-[800px]">
                <RefundPolicy />

            </div>

        </div>
    );
}
