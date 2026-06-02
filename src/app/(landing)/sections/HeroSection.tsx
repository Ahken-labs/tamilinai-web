import Image from "next/image";
import RegisterForm from "@/src/components/auth/RegisterForm";
import HeroOverlay from "./HeroOverlay";
import HeroTrustBar from "./HeroTrustBar";

export default function HeroSection() {
    return (
        <section className="w-full bg-light font-poppins">
            <div className="mx-3 sm:mx-4 md:mx-5 lg:mx-10 xl:mx-[40px]">
                <div className="relative w-full overflow-hidden rounded-[32px] md:rounded-[40px] lg:rounded-[60px]
                h-[513px] md:h-[462px] lg:h-[850px] select-none">
                    {/* Image in server HTML — browser fetches immediately without hydration wait */}
                    <Image
                        src="/images/hero_image.webp"
                        alt="Tamil matrimony couple"
                        fill
                        priority
                        className="object-cover object-[25%_20%] md:object-[30%_100%] lg:object-center md:translate-y-0 translate-y-[-80px]"
                        sizes="(max-width: 1024px) 100vw, 1400px"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(38,2,3,0.9)_0%,rgba(230,39,99,0.3)_50%,#260203_100%)]" />
                    {/* Text, button, desktop form, modal */}
                    <HeroOverlay />
                </div>

                {/* Inline form below image — mobile/tablet only */}
                <div className="lg:hidden mt-4 px-0">
                    <RegisterForm variant="hero" />
                </div>
            </div>

            <HeroTrustBar />
        </section>
    );
}
