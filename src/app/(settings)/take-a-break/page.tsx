"use client";

import StepProgress from "@/src/components/more/StepProgress";

export default function BreakPage() {
  return (
      <main className="min-h-screen bg-[#F8F5F2]">
        {/* Toggle bar */}
        <div className="sticky top-[74px] z-10 w-full bg-white border-t border-[#EEEEEE]">
          <div className="flex justify-center items-center py-3 px-4">
             <StepProgress currentStep={3} />
          </div>
        </div>
        
        </main>
  );
}

