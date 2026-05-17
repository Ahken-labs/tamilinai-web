import CreatePasswordForm from "@/src/components/auth/CreatePasswordForm";
import FlowGuard from "@/src/components/guards/FlowGuard";

export default function CreatePasswordPage() {
  return (
    <FlowGuard requiredKey="inai_temp_token">
      <CreatePasswordForm />
    </FlowGuard>
  );
}
