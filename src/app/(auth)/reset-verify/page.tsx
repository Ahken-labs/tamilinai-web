import OtpForm from "@/src/components/form/OtpForm";
import { Suspense } from "react";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpForm variant="reset" />
    </Suspense>
  );
}