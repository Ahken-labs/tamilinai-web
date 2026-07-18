"use client";
import dynamic from "next/dynamic";
import AuthGuard from "@/src/components/guards/AuthGuard";

const EliteUpgradeBody = dynamic(() => import("@/src/components/elite/EliteUpgradeBody"), { ssr: false });

export default function SetupUpgradePage() {
    return (
        <AuthGuard>
            <EliteUpgradeBody />
        </AuthGuard>
    );
}
