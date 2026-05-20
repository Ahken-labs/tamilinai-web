export function cmToFtIn(cm: number): string {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${ft} ft ${inches} in`;
}

export function formatHeight(cm: number | null | undefined): string {
  if (!cm) return "";
  return `${cm} cm / ${cmToFtIn(cm)}`;
}
