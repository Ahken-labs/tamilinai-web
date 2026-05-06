type StepProgressProps = {
  currentStep: number;
  totalSteps?: number;
  text?: string[]; // optional labels
};

export default function StepProgress({
  currentStep,
  totalSteps = 3,
  text,
}: StepProgressProps) {
  const steps = text?.length || totalSteps;

  return (
    <div className="flex flex-col"> {/* gap between bar + text */}
      
      {/* Bars */}
      <div className="flex gap-4">
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-[27px] ${
              i < currentStep ? "bg-[#B31B38]" : "bg-[#D9D9D9]"
            }`}
          />
        ))}
      </div>

      {/* Labels (only if provided) */}
      {text && (
        <div className="flex gap-4 mt-1 md:mt-2">
          {text.map((label, i) => (
            <div key={i} className="flex-1 text-center">
              <span
                className={`select-none font-poppins font-14 font-medium leading-[150%] ${
                  i < currentStep ? "text-[#B31B38]" : "text-secondary4"
                }`}
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