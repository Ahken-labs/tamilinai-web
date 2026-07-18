"use client";
import dynamic from "next/dynamic";
import AuthGuard from "@/src/components/guards/AuthGuard";

const CheckoutContent = dynamic(
    () => import("@/src/app/(app)/elite-upgrade/checkout/page").then((m) => ({ default: m.CheckoutContent })),
    { ssr: false }
);

export default function SetupCheckoutPage() {
    return (
        <AuthGuard>
            <CheckoutContent />
        </AuthGuard>
    );
}
