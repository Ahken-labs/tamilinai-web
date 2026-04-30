export default function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-[944px] mx-auto rounded-[32px] bg-white shadow-[0_4px_40px_0_rgba(255,140,60,0.18)] overflow-hidden animate-pulse">
      <div className="flex flex-col min-[840px]:flex-row">
        {/* Photo placeholder */}
        <div className="w-full min-[840px]:w-[220px] min-[840px]:min-w-[220px] h-[240px] md:h-[263px] lg:h-[293.33px] bg-[#E8E8E8] rounded-[16px] m-4 min-[840px]:m-0 min-[840px]:rounded-none" />

        {/* Details */}
        <div className="flex-1 px-5 min-[840px]:px-6 pt-5 pb-5 min-[840px]:pt-6 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-44 rounded-full bg-[#E8E8E8]" />
            <div className="h-5 w-5 rounded-full bg-[#E8E8E8]" />
            <div className="h-5 w-14 rounded-full bg-[#E8E8E8]" />
          </div>

          {/* ID */}
          <div className="mt-2 h-3.5 w-24 rounded-full bg-[#E8E8E8]" />

          {/* Divider */}
          <div className="my-3 md:my-4 h-[1px] bg-[#F0F0F0]" />

          {/* Detail rows — 4 rows × 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-[#E8E8E8] shrink-0" />
                <div className="h-3.5 rounded-full bg-[#E8E8E8]" style={{ width: `${55 + (i % 3) * 20}%` }} />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-5 md:mt-6">
            {[45, 28, 28].map((w, i) => (
              <div
                key={i}
                className="h-10 rounded-full bg-[#E8E8E8]"
                style={{ flex: `0 0 ${w}%`, minWidth: 120 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
