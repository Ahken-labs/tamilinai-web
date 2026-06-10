import Link from "next/link";
import Header from "@/src/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        className="min-h-screen font-poppins flex flex-col items-center justify-center px-5 text-center"
        style={{ background: "linear-gradient(180deg, #FFF7F0 0%, #FFEBEB 100%)" }}
      >
        <p className="text-[16px] md:text-[18px] font-medium text-[#B31B38] tracking-widest uppercase">
          404
        </p>
        <h1 className="mt-2 text-[28px] md:text-[36px] font-bold text-[#222222] leading-[150%]">
          Page not found
        </h1>
        <p className="mt-3 text-[15px] md:text-[16px] text-[#656565] leading-[160%] max-w-[380px]">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center px-6 py-3 rounded-[40px] bg-[#B31B38] text-white font-medium text-[15px] md:text-[16px] hover:bg-[#8E162D] transition-colors"
        >
          Go back home
        </Link>
      </main>
    </>
  );
}
