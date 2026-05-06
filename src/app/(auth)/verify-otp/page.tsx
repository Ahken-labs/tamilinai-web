import OtpForm from "../../../components/auth/OtpForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; countryCode?: string; email?: string }>;
}) {
  const params = await searchParams;
  return <OtpForm variant="register" searchParams={params} />;
}
