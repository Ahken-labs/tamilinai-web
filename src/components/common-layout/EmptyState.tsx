import Button from "./Button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  btText: string;
  onAction: () => void;
  className?: string;
}

export default function EmptyState({ icon, title, subtitle, btText, onAction, className = "mx-4" }: EmptyStateProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center max-w-[640px] rounded-[32px] bg-light mx-auto text-center p-4 md:p-6">
        <h2 className="text-[16px] sm:text-[18px] md:text-[20px] text-[#656565]">{title}</h2>
        <div className="mt-4 md:mt-5">{icon}</div>
        <p className="font-poppins text-[16px] mt-1 md:mt-2 text-[#656565]">{subtitle}</p>
        <Button text={btText} onPress={onAction} className="mt-4 md:mt-5" />
      </div>
    </div>
  );
}
