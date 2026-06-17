"use client";

import { GoogleReviewTag, TrustpilotReviewTag, InaiReviewTag } from "./ReviewTag";

function ReviewStarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.4123 8.71931L12.3818 2.22173C12.2648 1.84748 11.7352 1.84748 11.6182 2.22173L9.58772 8.71931C9.53553 8.8863 9.38088 9 9.20592 9H2.17605C1.79411 9 1.62943 9.48418 1.93216 9.71705L7.27888 13.8299C7.41174 13.9321 7.46678 14.1063 7.41679 14.2663L5.35546 20.8625C5.24106 21.2286 5.65763 21.5303 5.96975 21.3073L11.7675 17.1661C11.9066 17.0667 12.0934 17.0667 12.2325 17.1661L18.0302 21.3073C18.3424 21.5303 18.7589 21.2286 18.6445 20.8625L16.5832 14.2663C16.5332 14.1063 16.5883 13.9321 16.7211 13.8299L22.0678 9.71705C22.3706 9.48418 22.2059 9 21.824 9H14.7941C14.6191 9 14.4645 8.8863 14.4123 8.71931Z"
        fill="#FFBF43"
        stroke="#FFBF43"
        strokeWidth="1.2"
      />
    </svg>
  );
}

interface Review {
  name: string;
  country: string;
  rating: number;
  text: string;
}

const DUMMY_REVIEWS: Review[] = [
  {
    name: "Anushiya",
    country: "London",
    rating: 5,
    text: "Living abroad, I wanted someone who understands our culture but also my life here. Took some time but the matchmaker actually understood",
  },
  {
    name: "Dushyanth",
    country: "Colombo",
    rating: 5,
    text: "The blur feature is what made me trust this. My pictures stay safe, not floating around like on other sites. Genuine profiles, no time wasters",
  },
  {
    name: "Priyaveni",
    country: "Switzerland",
    rating: 5,
    text: "We were nervous about putting our daughter's profile online. The verified badges and the photo protection made my wife finally agree. Found a",
  },
  {
    name: "Pravenan",
    country: "Jaffna",
    rating: 5,
    text: "I created the profile for my son. The support team helped me at every step over WhatsApp. Respectful, patient with an older person like me. We are",
  },
  {
    name: "Tharaka",
    country: "Batticaloa",
    rating: 5,
    text: "Honestly, I just joined to try it out and didn't expect much. But the matches were actually really good, not just random people. As a woman, I felt",
  },
  {
    name: "Vinoth",
    country: "Nanuoya",
    rating: 5,
    text: "Got engaged last month! 🙏 We started talking through the platform, then our families met, and everything just flowed naturally. Highly",
  },
];

function ReviewCard({ review }: { review: Review }) {
  const CHAR_LIMIT = 220;
  const displayText = review.text.slice(0, CHAR_LIMIT).trimEnd() + "…";

  return (
    <div className="w-[341px] bg-white rounded-[12px] py-5 px-4 font-poppins">
      {/* Profile row */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-[110px] bg-[#F2F2F2] shrink-0 flex items-center justify-center">
          <span className="text-[#656565] text-[15.4px] font-semibold leading-[150%]">
            {review.name.charAt(0)}
          </span>
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[#242424] text-[16px] font-medium leading-[150%] overflow-hidden text-ellipsis whitespace-nowrap">
            {review.name}
          </span>
          <span className="text-[#58585B] text-[14px] font-normal leading-[125%]">
            {review.country}
          </span>
        </div>
      </div>

      {/* Stars */}
      <div className="flex items-center mt-6 gap-1">
        {Array.from({ length: review.rating }).map((_, i) => (
          <ReviewStarIcon key={i} />
        ))}
      </div>

      {/* Review text */}
      <div className="mt-4">
        <p className="m-0 text-[#343434] text-[16px] font-normal leading-[150%]">
          {displayText}
        </p>
        <button
          type="button"
          onClick={() => {}}
          className="mt-[2px] bg-transparent border-0 p-0 cursor-pointer text-[#343434] text-[16px] font-medium leading-[150%] underline decoration-solid underline-offset-auto"
        >
          Show more
        </button>
      </div>
    </div>
  );
}

export default function ReviewSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 font-poppins">
      {/* Title */}
      <h2 className="m-0 text-center text-[#000] text-[20px] font-semibold font-poppins">
        Ratings and reviews
      </h2>

      {/* Review tags */}
      <div className="flex flex-wrap justify-center mt-6 gap-4">
        <GoogleReviewTag gray/>
        <TrustpilotReviewTag gray/>
        <InaiReviewTag gray/>
      </div>

      {/* Review cards */}
      <div className="flex flex-wrap justify-center mt-8 gap-2">
        {DUMMY_REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>

      {/* See all reviews button */}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          className="bg-[#F0F0F0] px-6 py-3 rounded-[43px] cursor-pointer text-[#222] text-[16px] font-medium leading-[150%] font-poppins border-0 transition-colors duration-150 hover:bg-[#E5E5E5] active:scale-[0.98]"
        >
          See all reviews
        </button>
      </div>
    </section>
  );
}
