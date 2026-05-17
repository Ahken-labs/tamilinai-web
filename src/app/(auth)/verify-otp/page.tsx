import OtpForm from "../../../components/auth/OtpForm";
import FlowGuard from "../../../components/guards/FlowGuard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; countryCode?: string; email?: string }>;
}) {
  const params = await searchParams;
  return (
    <FlowGuard requiredKey="inai_reg_key">
      <OtpForm variant="register" searchParams={params} />
    </FlowGuard>
  );
}
