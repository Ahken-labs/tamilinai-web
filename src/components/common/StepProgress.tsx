type StepProgressProps = {
  currentStep: number; 
  totalSteps?: number;
};

export default function StepProgress({ currentStep, totalSteps = 3 }: StepProgressProps) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-[27px] ${i < currentStep ? "bg-[#B31B38]" : "bg-[#D9D9D9]"}`}
        />
      ))}
    </div>
  );
}
