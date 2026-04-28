type FormRowProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
  align?: "start" | "center";
};

export default function FormRow({label, required, children, error, className = "", align = "start", }: FormRowProps) {
  const isCenter = align === "center";

  return (
    <div className={`${className}`}>
      <div className={`flex ${isCenter ? "items-center" : "items-start"}`} >
        <div
          className={`w-[100px] sm:w-[120px] md:w-[140px] lg:w-[180px] mr-5 shrink-0 ${
            isCenter ? "pt-0" : "pt-2"
          }`}
        >
          <span className="font-16 font-medium text-dark leading-[150%]">
            {label}
            {required && <span className="text-[#B31B38] ml-0.5">*</span>}
          </span>
        </div>

        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {error && (
        <div className="ml-[calc(100px+1.25rem)] sm:ml-[calc(120px+1.25rem)] md:ml-[calc(140px+1.25rem)] lg:ml-[calc(180px+1.25rem)]">
          <p className="mt-1.5 md:mt-2 text-[10px] md:text-[12px] text-[#B31B38]">{error}</p>
        </div>
      )}
    </div>
  );
}