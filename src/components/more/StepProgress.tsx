type StepProgressProps = {
  currentStep: number;
  totalSteps?: number;
  text?: string[];
  lastStepActiveColor?: string;
};

export default function StepProgress({
  currentStep,
  totalSteps = 3,
  text,
  lastStepActiveColor,
}: StepProgressProps) {
  const steps = text?.length || totalSteps;

  return (
    <div className="flex flex-col"> {/* gap between bar + text */}
      
      {/* Bars */}
      <div className="flex max-[370px]:gap-1.5 gap-4">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={`max-[500px]:h-1 h-2 flex-1 rounded-[27px] ${
              i < currentStep ? "bg-[#B31B38]" : "bg-[#D9D9D9]"
            }`}
          />
        ))}
      </div>

      {/* Labels (only if provided) */}
      {text && (
        <div className="flex max-[370px]:gap-1.5 gap-4 max-[500px]:mt-0.5 mt-1 md:mt-2">
          {text.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className={`select-none font-poppins max-[350px]:text-[11px] text-[12px] sm:text-[13px] md:text-[14px] font-medium leading-[150%] ${
                  i < currentStep ? "text-[#B31B38]" : "text-secondary4"
                }`}
                style={
                  lastStepActiveColor && i === steps - 1 && i < currentStep
                    ? { color: lastStepActiveColor }
                    : undefined
                }
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}