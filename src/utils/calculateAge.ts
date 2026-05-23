export function calculateAge(dateOfBirth?: string): number | null {
  if (!dateOfBirth) return null;
  const born = new Date(dateOfBirth);
  if (isNaN(born.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  if (
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate())
  ) age--;
  return age;
}
