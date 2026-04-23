import { ReactNode } from "react";

interface CartBoxProps {
  children: ReactNode;
  className?: string;
}

export default function CartBox({ children, className }: CartBoxProps) {
  return (
    <div className={`w-full rounded-[18px] md:rounded-[20px] bg-[#EAEAEA] p-4 md:p-6 ${className ?? ""}`}>
      {children}
    </div>
  );
}
