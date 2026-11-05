"use client";

import AuthGuard from "@/src/components/guards/AuthGuard";
import EliteUpgradeBody from "@/src/components/elite/EliteUpgradeBody";

export default function SetupUpgradePage() {
    return (
        <AuthGuard>
            <EliteUpgradeBody />
        </AuthGuard>
    );
}
