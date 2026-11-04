export default function PlanCardSkeleton() {
  return (
    <div className="max-[400px]:px-3 max-[500px]:px-4 px-5 pt-8 pb-6 flex-1 flex flex-col rounded-[20px] bg-white animate-pulse">
      <div className="h-5 w-24 rounded bg-[#EAEAEA]" />
      <div className="mt-5 h-7 w-32 rounded bg-[#EAEAEA]" />
      <div className="mt-2 h-4 w-20 rounded bg-[#EAEAEA]" />
      <div className="mt-5 h-4 w-16 rounded bg-[#EAEAEA]" />
      <div className="mt-2 h-4 w-40 rounded bg-[#EAEAEA]" />
      <div className="mt-8 h-11 w-full rounded-full bg-[#EAEAEA]" />
      <div className="mt-5 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-[#EAEAEA]" />
        ))}
      </div>
    </div>
  );
}
