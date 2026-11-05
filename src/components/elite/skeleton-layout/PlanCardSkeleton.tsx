// Only the country-dependent parts of a plan card; the name, badge and button are always real

export function PlanPriceSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mt-4 sm:mt-4.5 md:mt-5 h-7 w-32 rounded-full bg-[#E8E8E8]" />
      <div className="mt-1.5 sm:mt-2 h-4 w-20 rounded-full bg-[#E8E8E8]" />
      <div className="mt-6 sm:mt-7 md:mt-8 min-h-[73px]">
        <div className="h-4 w-16 rounded-full bg-[#E8E8E8]" />
        <div className="mt-2 h-4 w-44 max-w-full rounded-full bg-[#E8E8E8]" />
        <div className="mt-2 h-4 w-24 rounded-full bg-[#E8E8E8]" />
      </div>
    </div>
  );
}

export function PlanFeaturesSkeleton({ rows }: { rows: number }) {
  return (
    <div className="mt-5 flex flex-1 flex-col gap-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="h-5 w-5 shrink-0 rounded-full bg-[#E8E8E8]" />
          <div className="flex-1">
            <div className="h-3.5 w-full rounded-full bg-[#E8E8E8]" />
            <div className="mt-1.5 h-3.5 w-2/3 rounded-full bg-[#E8E8E8]" />
          </div>
        </div>
      ))}
    </div>
  );
}
