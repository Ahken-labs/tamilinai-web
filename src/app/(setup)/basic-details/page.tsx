import SetupGuard from "../../../components/guards/SetupGuard";
import BasicDetailsForm from "../../../components/setup/BasicDetailsForm";

export const metadata = { robots: { index: false, follow: false } };

export default function BasicDetailsPage() {
  return (
    <SetupGuard step="basic-details">
      <BasicDetailsForm />
    </SetupGuard>
  );
}
