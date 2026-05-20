export default function UserProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#F8F5F2] animate-pulse pb-10">
      {/* Back bar */}
      <div className="sticky top-[74px] z-30 w-full border-t border-[#EEEEEE] bg-white">
        <div className="flex px-4 lg:px-10 py-3">
          <div className="h-9 w-24 rounded-[40px] bg-[#E8E8E8]" />
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex justify-center px-4 md:px-10">
        <div className="flex w-full max-w-[1160px] flex-col items-center min-[520px]:items-start min-[520px]:flex-row gap-5 sm:gap-7 lg:gap-10">

          {/* Photo column */}
          <div className="shrink-0">
            <div className="h-[133px] sm:h-[160px] md:h-[213px] lg:h-[266px] w-[100px] sm:w-[120px] md:w-[160px] lg:w-[200px] rounded-[16px] bg-[#E8E8E8]" />
          </div>

          {/* Detail column */}
          <div className="flex-1 min-w-0 w-full">
            {/* Name + badge */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="h-5 w-36 rounded-full bg-[#E8E8E8]" />
                <div className="h-5 w-5 rounded-full bg-[#E8E8E8]" />
              </div>
              <div className="h-6 w-16 rounded-full bg-[#E8E8E8]" />
            </div>

            {/* Display ID */}
            <div className="mt-1 h-4 w-20 rounded-full bg-[#E8E8E8]" />

            {/* Quick rows */}
            <div className="mt-4 sm:mt-6 flex flex-col gap-3">
              {[120, 160, 100, 140].map((w, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-[#E8E8E8] shrink-0" />
                    <div className="h-4 rounded-full bg-[#E8E8E8]" style={{ width: w }} />
                  </div>
                  {i < 2 && <div className="h-4 w-28 rounded-full bg-[#E8E8E8]" />}
                </div>
              ))}
            </div>

            {/* Interest card placeholder */}
            <div className="mt-6 md:mt-8 h-[120px] rounded-[16px] bg-[#E8E8E8]" />

            {/* Section cards */}
            <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
              {[2, 4, 3, 3, 2, 2, 2].map((rows, si) => (
                <div key={si} className="rounded-[16px] bg-white p-4 md:p-5">
                  {/* Section title */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-4 w-4 md:h-5 md:w-5 rounded bg-[#E8E8E8] shrink-0" />
                    <div className="h-5 w-32 rounded-full bg-[#E8E8E8]" />
                  </div>
                  <div className="mt-3 md:mt-4 h-[1px] bg-[#F0F0F0]" />
                  <div className="mt-3 md:mt-4 grid grid-cols-1 min-[700px]:grid-cols-2 gap-3">
                    {Array.from({ length: rows }).map((_, ri) => (
                      <div key={ri} className="grid grid-cols-2 gap-4 items-center">
                        <div className="h-3.5 w-full rounded-full bg-[#E8E8E8]" />
                        <div className="h-3.5 rounded-full bg-[#E8E8E8]" style={{ width: `${60 + (ri % 2) * 25}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
