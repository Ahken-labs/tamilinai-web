"use client";

import { EliteCrownIcon, EliteProIcon, EliteVIPIcon, ViewedIcon } from "@/src/assets/Icons";

const BASE = "inline-flex items-center gap-1 px-2 py-[2.5px] rounded-full font-poppins font-medium leading-none text-[14px] sm:text-[15px] md:text-[16px]";

interface TagProps {
  className?: string;
}

// Elite basic 
export function EliteBasicTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#FFDED3", color: "#725E4C" }}>
      <EliteCrownIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#725E4C" />
      Elite basic
    </span>
  );
}


// Elite pro 
export function EliteProTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#FFDED3", color: "#B31B38" }}>
      <EliteProIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#B31B38" />
      Elite pro
    </span>
  );
}


// Elite VIP 
export function EliteMaxTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} ${className}`} style={{ background: "#222222", color: "#FFDED3" }}>
      <EliteVIPIcon className="max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0" fill="#FFDED3" />
      Elite VIP
    </span>
  );
}


const LARGE = "inline-flex items-center gap-1 py-2 pl-[14px] pr-[16px] rounded-[41px] font-poppins font-medium leading-none text-[14px] sm:text-[15px] md:text-[16px]";
const ICON = "max-[500px]:w-4 w-4.5 md:w-5 max-[500px]:h-4 h-4.5 md:h-5 shrink-0";

// Appheader
export function EliteUpgradeTag({ className = "" }: TagProps) {
  return (
    <span className={`shine-sweep inline-flex items-center gap-1.5 py-2 pl-[14px] pr-[16px] rounded-[41px] bg-[#B31B38] font-poppins text-[14px] font-semibold leading-none text-white ${className}`}>
      <EliteVIPIcon className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 shrink-0" fill="#FFFFFF" />
      Get Elite
    </span>
  );
}

// Appheader
export function EliteBasicLargeTag({ className = "" }: TagProps) {
  return (
    <span className={`${LARGE} ${className}`} style={{ background: "linear-gradient(269deg, #FFE0C2 44.21%, #FFF2D9 98.97%)", color: "#725E4C" }}>
      <EliteCrownIcon className={ICON} fill="#725E4C" />
      Elite basic
    </span>
  );
}

// Appheader
export function EliteProLargeTag({ className = "" }: TagProps) {
  return (
    <span className={`${LARGE} ${className}`} style={{ background: "#FFDED3", color: "#B31B38" }}>
      <EliteProIcon className={ICON} fill="#B31B38" />
      Elite pro
    </span>
  );
}

// Appheader
export function EliteVIPLargeTag({ className = "" }: TagProps) {
  return (
    <span className={`${LARGE} ${className}`} style={{ background: "#222222", color: "#FFDED3" }}>
      <EliteVIPIcon className={ICON} fill="#FFDED3" />
      Elite VIP
    </span>
  );
}


// New
export function NewTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} px-3 bg-[#D5ECFF] text-[#5D5D5D] ${className}`}>
      New
    </span>
  );
}


// Viewed 
export function ViewedTag({ className = "" }: TagProps) {
  return (
    <span className={`${BASE} px-3 bg-[#EDEDED] text-[#222222] ${className}`}>
      <ViewedIcon  />
      Viewed
    </span>
  );
}
