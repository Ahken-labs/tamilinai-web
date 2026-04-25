import OtpForm from "../../../components/form/OtpForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string; countryCode?: string; email?: string }>;
}) {
  const params = await searchParams;
  return <OtpForm variant="register" searchParams={params} />;
}
