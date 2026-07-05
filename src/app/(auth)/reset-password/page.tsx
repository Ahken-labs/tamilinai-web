import CreatePasswordForm from "@/src/components/auth/CreatePasswordForm";
import FlowGuard from "@/src/components/guards/FlowGuard";

export const metadata = { robots: { index: false, follow: false } };

export default function ResetPasswordPage() {
  return (
    <FlowGuard requiredKey="inai_temp_token">
      <CreatePasswordForm variant="reset" />
    </FlowGuard>
  );
}
