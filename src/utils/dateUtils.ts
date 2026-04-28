const MONTH_INDEX: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
};

const DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// When year is unknown (empty/NaN) we return the max possible days for that month.
export function getDaysInMonth(month: string, year: string): number {
  const monthIdx = MONTH_INDEX[month];
  if (monthIdx === undefined) return 31;
  if (monthIdx === 1) {
    const yearNum = parseInt(year, 10);
    return isNaN(yearNum) || isLeapYear(yearNum) ? 29 : 28;
  }
  return DAYS_PER_MONTH[monthIdx];
}

// Returns an error string, or null when the date is valid and the person is 18+.
export function validateDOB(year: string, month: string, day: string): string | null {
  if (!year || !month || !day) return "*Date of birth is required";

  const monthIdx = MONTH_INDEX[month];
  const yearNum = parseInt(year, 10);
  const dayNum = parseInt(day, 10);

  if (isNaN(yearNum) || monthIdx === undefined || isNaN(dayNum)) {
    return "*Enter a valid date";
  }

  const maxDays = getDaysInMonth(month, year);
  if (dayNum < 1 || dayNum > maxDays) {
    return `*${month} ${yearNum} only has ${maxDays} days`;
  }

  const today = new Date();
  const dob = new Date(yearNum, monthIdx, dayNum);
  const cutoff = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  if (dob > cutoff) {
    return "*You must be at least 18 years old";
  }

  return null;
}
