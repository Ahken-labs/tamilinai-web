import OtpForm from "@/src/components/form/OtpForm";

export default function Page({
  searchParams,
}: {
  searchParams: { phone?: string; countryCode?: string; email?: string };
}) {
  return <OtpForm variant="reset" searchParams={searchParams} />;
}