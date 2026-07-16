"use client";

import { GoogleReviewTag, TrustpilotReviewTag, InaiReviewTag } from "./ReviewTag";
import { ReviewCard, MobileCarousel, RatingStars, type Review } from "./ReviewCard";

const AVERAGE_RATING = 4.5;

const DUMMY_REVIEWS: Review[] = [
  {
    name: "Anushiya",
    subtitle: "London",
    rating: 5,
    text: "Living abroad, I wanted someone who understands our culture but also my life here. Took some time but the matchmaker actually understood",
  },
  {
    name: "Dushyanth",
    subtitle: "Colombo",
    rating: 5,
    text: "The blur feature is what made me trust this. My pictures stay safe, not floating around like on other sites. Genuine profiles, no time wasters",
  },
  {
    name: "Priyaveni",
    subtitle: "Switzerland",
    rating: 5,
    text: "We were nervous about putting our daughter's profile online. The verified badges and the photo protection made my wife finally agree. Found a",
  },
  {
    name: "Pravenan",
    subtitle: "Jaffna",
    rating: 5,
    text: "I created the profile for my son. The support team helped me at every step over WhatsApp. Respectful, patient with an older person like me. We are",
  },
  {
    name: "Tharaka",
    subtitle: "Batticaloa",
    rating: 5,
    text: "Honestly, I just joined to try it out and didn't expect much. But the matches were actually really good, not just random people. As a woman, I felt",
  },
  {
    name: "Vinoth",
    subtitle: "Nanuoya",
    rating: 5,
    text: "Got engaged last month! 🙏 We started talking through the platform, then our families met, and everything just flowed naturally. Highly",
  },
];

export default function ReviewSection({ showActions = true }: { showActions?: boolean }) {
  return (
    <section className="bg-white py-10 sm:py-12 md:py-14 lg:py-16 sm:px-6 font-poppins">
      <h2 className="m-0 text-center text-[#000] text-[20px] font-semibold font-poppins">
        Ratings and reviews
      </h2>

      <div className="flex flex-wrap justify-center mt-4 max-[500px]:gap-3 gap-4 max-[450px]:mx-0 mx-4">
        <GoogleReviewTag gray />
        <TrustpilotReviewTag gray />
        <InaiReviewTag gray />
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="text-[20px] font-semibold leading-[150%] text-[#222]">{AVERAGE_RATING}</span>
        <div className="mt-1">
          <RatingStars rating={AVERAGE_RATING} />
        </div>
      </div>

      {/* ≥710px: 2 cols 341px, ≥1084px: 3 cols 341px */}
      <div className="hidden min-[710px]:grid mt-8 gap-2 justify-center grid-cols-[repeat(2,341px)] min-[1084px]:grid-cols-[repeat(3,341px)]">
        {DUMMY_REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>

      {/* 600px–709px: 2 cols 266px grid */}
      <div className="hidden min-[600px]:grid min-[710px]:hidden mt-8 gap-2 justify-center grid-cols-[repeat(2,266px)]">
        {DUMMY_REVIEWS.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>

      {/* <600px: carousel */}
      <div className="min-[600px]:hidden">
        <MobileCarousel reviews={DUMMY_REVIEWS} />
      </div>

      {showActions && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            type="button"
            className="bg-[#F0F0F0] px-6 py-3 rounded-[43px] cursor-pointer text-[#222] text-[16px] font-medium leading-[150%] font-poppins border-0 transition-colors duration-150 hover:bg-[#E5E5E5] active:scale-[0.98]"
          >
            See all reviews
          </button>
        </div>
      )}
    </section>
  );
}
