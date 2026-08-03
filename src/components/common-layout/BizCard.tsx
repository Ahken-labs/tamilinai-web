import Image from "next/image";

function StarIcon() {
  return (
    <svg width="14.667" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.005 7.26625L10.313 1.85161C10.2155 1.53973 9.77409 1.53973 9.67663 1.85161L7.98456 7.26625C7.94107 7.40541 7.81219 7.50016 7.66639 7.50016H1.80817C1.48988 7.50016 1.35265 7.90364 1.60493 8.0977L6.06053 11.5251C6.17124 11.6102 6.21711 11.7554 6.17545 11.8887L4.45768 17.3856C4.36234 17.6907 4.70949 17.942 4.96958 17.7563L9.80105 14.3052C9.91695 14.2224 10.0726 14.2224 10.1885 14.3052L15.02 17.7563C15.2801 17.942 15.6272 17.6907 15.5319 17.3856L13.8141 11.8887C13.7725 11.7554 13.8183 11.6102 13.9291 11.5251L18.3847 8.0977C18.6369 7.90364 18.4997 7.50016 18.1814 7.50016H12.3232C12.1774 7.50016 12.0485 7.40541 12.005 7.26625Z" fill="#6C6C6C"/>
    </svg>
  );
}

interface BizCardProps {
  title: string;
  location: string;
  rating: number;
  image?: string | null;
  featured?: boolean;
  /** When provided, location moves to its own line and type appears after rating */
  type?: string;
  /** Override outer card width/min-width. Default: w-[156px] */
  className?: string;
  /** Override image container size. Default: w-[156px] h-[156px] */
  imageClassName?: string;
}

export default function BizCard({
  title,
  location,
  rating,
  image = null,
  featured = false,
  type,
  className = "w-[156px] min-w-[156px]",
  imageClassName = "w-[156px] h-[156px]",
}: BizCardProps) {
  return (
    <div className={`flex flex-col font-poppins ${className}`}>
      {/* Image */}
      <div className={`relative rounded-[32px] bg-[#D9D9D9] overflow-hidden shrink-0 ${imageClassName}`}>
        {image && (
          <Image src={image} alt={title} fill className="object-cover" />
        )}
        {featured && (
          <div
            className="absolute border border-white top-4 right-4 h-[26px] px-[10.5px] rounded-full bg-white/80 flex items-center"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.02), 0 2px 6px 0 rgba(0,0,0,0.04), 0 4px 8px 0 rgba(0,0,0,0.10)" }}
          >
            <span className="text-[#222] text-[11px] font-semibold leading-[118%]">Featured</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-[#222] text-[14px] font-medium leading-[150%] line-clamp-2">{title}</p>
        {type && (
          <p className="text-[#656565] text-[14px] font-normal leading-[150%] truncate">{location}</p>
        )}
        <div className="flex items-center">
          <StarIcon />
          <span className="ml-[2.5px] text-[#767676] text-[14px] leading-[150%]">{rating}</span>
          {type
            ? <span className="ml-1 text-[#767676] text-[14px] font-normal leading-[150%] truncate"><span className="font-bold">·</span> {type}</span>
            : <span className="ml-1 text-[#767676] text-[14px] font-normal leading-[150%] truncate"><span className="font-bold">·</span> {location}</span>
          }
        </div>
      </div>
    </div>
  );
}
