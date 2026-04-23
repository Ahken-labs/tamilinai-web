import OtpForm from "../../../components/form/OtpForm";

export default function Page({
  searchParams,
}: {
  searchParams: { phone?: string; countryCode?: string; email?: string };
}) {
  return <OtpForm variant="register" searchParams={searchParams} />;
}