export default function NotificationSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white px-4 py-3 sm:py-4 md:py-5">
      {/* Avatar circle */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <div className="shrink-0 h-10 w-10 md:h-14 md:w-14 rounded-full bg-[#E8E8E8] animate-pulse" />
        <div className="flex-1 min-w-0">
          <div className="h-[16px] w-3/4 rounded-full bg-[#E8E8E8] animate-pulse" />
          <div className="mt-2 h-[13px] w-2/5 rounded-full bg-[#E8E8E8] animate-pulse" />
        </div>
      </div>
      {/* CTA placeholder */}
      <div className="shrink-0 w-14 h-[14px] rounded-full bg-[#E8E8E8] animate-pulse" />
    </div>
  );
}
