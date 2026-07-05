import OtpForm from "../../../components/auth/OtpForm";
import FlowGuard from "../../../components/guards/FlowGuard";

export const metadata = { robots: { index: false, follow: false } };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; countryCode?: string; email?: string }>;
}) {
  const params = await searchParams;
  return (
    <FlowGuard requiredKey="inai_reset_identifier">
      <OtpForm variant="reset" searchParams={params} />
    </FlowGuard>
  );
}
