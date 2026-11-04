export default function EliteMemberCardSkeleton() {
  return (
    <div className="shrink-0 w-[288px] h-[184px] max-[500px]:w-[264px] max-[500px]:h-[176px] rounded-[24px] bg-white p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-full bg-[#E8E8E8]" />
        <div className="flex-1">
          <div className="h-4 w-28 rounded-full bg-[#E8E8E8]" />
          <div className="mt-2 h-3 w-16 rounded-full bg-[#E8E8E8]" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3.5 rounded-full bg-[#E8E8E8]" />
        ))}
      </div>
    </div>
  );
}
