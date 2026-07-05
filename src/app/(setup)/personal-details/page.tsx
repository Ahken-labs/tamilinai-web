import SetupGuard from "../../../components/guards/SetupGuard";
import PersonalDetailsForm from "../../../components/setup/PersonalDetailsForm";

export const metadata = { robots: { index: false, follow: false } };

export default function PersonalDetailsPage() {
  return (
    <SetupGuard step="personal-details">
      <PersonalDetailsForm />
    </SetupGuard>
  );
}
