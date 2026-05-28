type FormRowProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
  align?: "start" | "center";
  leftWidth?:string;
};

export default function FormRow({label, required, children, error, className = "", align = "start", leftWidth="w-[120px] sm:w-[120px] md:w-[140px] lg:w-[180px]"}: FormRowProps) {
  const isCenter = align === "center";

  return (
    <div className={`${className}`}>
      <div className={`flex flex-col min-[500px]:flex-row ${isCenter ? "min-[500px]:items-center" : "min-[500px]:items-start"}`}>
        <div
          className={`max-[499px]:w-full ${leftWidth} max-[499px]:mr-0 mr-5 shrink-0 mb-2 min-[500px]:mb-0 ${
            isCenter ? "pt-0" : "min-[500px]:pt-2"
          }`}
        >
          <span className="text-[16px] font-medium text-dark leading-[150%]">
            {label}
            {required && <span className="text-[#B31B38] ml-0.5">*</span>}
          </span>
        </div>

        <div className="flex-1 min-w-0">{children}</div>
      </div>

      {error && (
        <div className="min-[500px]:ml-[calc(100px+1.25rem)] sm:ml-[calc(120px+1.25rem)] md:ml-[calc(140px+1.25rem)] lg:ml-[calc(180px+1.25rem)]">
          <p className="mt-1.5 md:mt-2 text-[14px] text-[#B31B38]">{error}</p>
        </div>
      )}
    </div>
  );
}
