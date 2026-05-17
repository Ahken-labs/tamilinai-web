import SetupGuard from "../../../components/guards/SetupGuard";
import BasicDetailsForm from "../../../components/setup/BasicDetailsForm";

export default function BasicDetailsPage() {
  return (
    <SetupGuard step="basic-details">
      <BasicDetailsForm />
    </SetupGuard>
  );
}
