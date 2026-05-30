export default function ProfileCardSkeleton() {
  return (
    <div className="w-full max-w-[944px] p-2 md:p-4 mx-auto rounded-[24px] md:rounded-[32px] bg-white animate-pulse mb-4 md:mb-6">

      {/* Top row: image + name/id/tags */}
      <div className="flex flex-row items-center min-[600px]:items-start">
        {/* Photo */}
        <div className="relative shrink-0 w-[80px] h-[106.665px] min-[600px]:w-[155.76px] min-[600px]:h-[207.68px] min-[840px]:w-[220px] min-[840px]:h-[293.33px] rounded-[16px] bg-[#E8E8E8]" />

        {/* Name / ID / Tags + detail rows (600px+) */}
        <div className="flex-1 ml-3 min-[840px]:ml-5 lg:ml-8 min-w-0">
          {/* Name */}
          <div className="h-5 w-36 rounded-full bg-[#E8E8E8]" />
          {/* ID */}
          <div className="mt-2 h-3.5 w-24 rounded-full bg-[#E8E8E8]" />
          {/* Tags — mobile */}
          <div className="flex gap-2 mt-2 min-[840px]:hidden">
            <div className="h-6 w-16 rounded-full bg-[#E8E8E8]" />
          </div>

          {/* Detail rows — 600px+ in right column */}
          <div className="hidden min-[600px]:block">
            <div className="mt-3 mb-4 h-[1px] bg-[#F0F0F0]" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:gap-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-[#E8E8E8] shrink-0" />
                  <div className="h-3.5 rounded-full bg-[#E8E8E8]" style={{ width: `${55 + (i % 3) * 20}%` }} />
                </div>
              ))}
            </div>
            {/* Desktop buttons */}
            <div className="hidden min-[840px]:flex gap-3 mt-5 md:mt-6">
              {[1, 1, 1].map((_, i) => (
                <div key={i} className="flex-1 h-10 rounded-full bg-[#E8E8E8]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Below 840px: buttons at bottom. Detail rows only below 600px. */}
      <div className="min-[840px]:hidden mt-3">
        {/* Detail rows — only below 600px */}
        <div className="min-[600px]:hidden">
          <div className="mb-3 h-[1px] bg-[#F0F0F0]" />
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-[#E8E8E8] shrink-0" />
                <div className="h-3.5 rounded-full bg-[#E8E8E8]" style={{ width: `${55 + (i % 3) * 20}%` }} />
              </div>
            ))}
          </div>
        </div>
        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          <div className="flex-1 h-10 rounded-full bg-[#E8E8E8]" />
          <div className="w-12 h-10 rounded-full bg-[#E8E8E8]" />
          <div className="w-12 h-10 rounded-full bg-[#E8E8E8]" />
        </div>
      </div>

    </div>
  );
}
