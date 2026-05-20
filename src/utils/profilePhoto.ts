/**
 * Returns the correct src for a profile image.
 *
 * isOwnProfile=true  → show pending/rejected photos too (user sees their own)
 * isOwnProfile=false → only show approved photos; fall back to gender placeholder
 */
export function getProfilePhotoSrc(
  photoUrl: string | null | undefined,
  photoStatus: string | null | undefined,
  gender: string | null | undefined,
  isOwnProfile = false,
): string {
  if (photoUrl && (isOwnProfile || photoStatus === "approved")) {
    return photoUrl;
  }
  return gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png";
}
