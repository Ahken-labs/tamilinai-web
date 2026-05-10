import { useMemo, useState } from "react";
import { getDaysInMonth } from "../utils/dateUtils";
import { MONTHS, YEARS } from "../constants/profiles";
import { filterItems } from "../utils/formUtils";

type DOBOpen = { year: boolean; month: boolean; day: boolean };
const CLOSED: DOBOpen = { year: false, month: false, day: false };

export function useDOBState(initial?: { year?: string; month?: string; day?: string }) {
  const [birthYear, setBirthYear] = useState(initial?.year ?? "");
  const [birthMonth, setBirthMonth] = useState(initial?.month ?? "");
  const [birthDay, setBirthDay] = useState(initial?.day ?? "");
  const [dobOpen, setDobOpen] = useState<DOBOpen>(CLOSED);

  const maxDays = useMemo(
    () => getDaysInMonth(birthMonth, birthYear),
    [birthMonth, birthYear]
  );
  const validDays = useMemo(
    () => Array.from({ length: maxDays }, (_, i) => String(i + 1)),
    [maxDays]
  );

  const filtYears = useMemo(() => filterItems(YEARS, birthYear), [birthYear]);
  const filtMonths = useMemo(() => filterItems(MONTHS, birthMonth), [birthMonth]);
  const filtDays = useMemo(() => filterItems(validDays, birthDay), [validDays, birthDay]);

  const setDobFieldOpen = (field: keyof DOBOpen) => (val: boolean) =>
    setDobOpen({ ...CLOSED, [field]: val });

  function setMonth(m: string) {
    setBirthMonth(m);
    if (birthDay && parseInt(birthDay, 10) > getDaysInMonth(m, birthYear))
      setBirthDay("");
  }

  function setYear(y: string) {
    setBirthYear(y);
    if (birthDay && birthMonth && parseInt(birthDay, 10) > getDaysInMonth(birthMonth, y))
      setBirthDay("");
  }

  return {
    birthYear, birthMonth, birthDay,
    setBirthDay, setMonth, setYear,
    filtYears, filtMonths, filtDays,
    dobOpen, setDobFieldOpen,
  };
}
