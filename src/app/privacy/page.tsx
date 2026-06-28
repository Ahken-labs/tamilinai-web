import Header from "@/src/components/Header";
import PrivacyPolicy from "@/src/components/more/PrivacySection";

export const metadata = {
  title: "Privacy Policy — Inai Tamil Matrimony",
  description: "Read the Privacy Policy for Inai, the Tamil matrimony platform by Ahken Nexus. Learn how we collect, use, and protect your personal data.",
  alternates: { canonical: "https://inai.lk/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F2]">
        <div className="sticky top-[68px] lg:top-[76px] z-10 w-full bg-white/60 backdrop-blur-sm border-t border-[#EEEEEE]">
          <div className="flex items-center justify-center py-2 md:py-3">
            <span className="font-poppins font-semibold font-24 text-dark">Privacy Policy</span>
          </div>
        </div>
        <div className="pb-8 px-auto bg-[#F8F5F2] pt-6 md:pt-8 px-4 max-[370px]:px-2">
          <div className="rounded-[20px] max-w-[920px] bg-white p-4 md:p-6 mx-auto">
            <PrivacyPolicy />
          </div>
        </div>
      </main>
    </>
  );
}
