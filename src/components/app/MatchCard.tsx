import type { UserProfile } from "../../types/user";

interface MatchCardProps {
  profile: UserProfile;
  matchedAt?: string;
  className?: string;
}

// TODO: implement full MatchCard with mutual interest indicator, quick actions
export default function MatchCard({ profile, className }: MatchCardProps) {
  return (
    <div className={`rounded-2xl bg-white border border-[#E4D8C4] p-4 flex items-center gap-4 ${className ?? ""}`}>
      <div className="w-14 h-14 rounded-full bg-[#F5F5F5] shrink-0" />
      <div>
        <p className="font-poppins font-semibold text-[#222222]">{profile.name}</p>
        <p className="font-poppins text-sm text-[#888888]">Mutual match</p>
      </div>
    </div>
  );
}
