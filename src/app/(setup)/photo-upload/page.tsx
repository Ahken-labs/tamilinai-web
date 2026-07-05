import SetupGuard from "../../../components/guards/SetupGuard";
import PhotoUploadForm from "../../../components/setup/PhotoUploadForm";

export const metadata = { robots: { index: false, follow: false } };

export default function PhotoUploadPage() {
  return (
    <SetupGuard step="photo-upload">
      <PhotoUploadForm />
    </SetupGuard>
  );
}
