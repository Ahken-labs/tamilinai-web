"use client";
import dynamic from "next/dynamic";

const EliteUpgradeBody = dynamic(() => import("@/src/components/elite/EliteUpgradeBody"), { ssr: false });

export default function EliteUpgradePage() {
    return <EliteUpgradeBody />;
}
