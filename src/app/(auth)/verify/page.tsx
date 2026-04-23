import { Suspense } from "react";
import OtpForm from "../../../components/form/OtpForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpForm variant="register" />
    </Suspense>
  );
}