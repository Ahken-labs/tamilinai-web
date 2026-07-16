"use client";

import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/src/context/LangContext";
import { ReviewCard, MobileCarousel, RatingStars, type Review } from "@/src/components/review/ReviewCard";
import Button from "@/src/components/common-layout/Button";
import ReviewsModal, { ReviewSkeleton } from "./ReviewsModal";
import AddReviewModal from "./AddReviewModal";
import GoogleSignInModal from "./GoogleSignInModal";

const REVIEWER_TOKEN_KEY = "inai_reviewer_token";
const REVIEWER_NAME_KEY = "inai_reviewer_name";
const REVIEWER_PICTURE_KEY = "inai_reviewer_picture";
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

function getReviewerSession() {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem(REVIEWER_TOKEN_KEY);
  if (!token) return null;
  return {
    token,
    name: sessionStorage.getItem(REVIEWER_NAME_KEY) ?? "",
    picture: sessionStorage.getItem(REVIEWER_PICTURE_KEY) ?? "",
  };
}

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function toReview(r: { reviewerName: string; reviewerPicture?: string; rating: number; comment?: string | null; createdAt: string }): Review {
  return {
    name: r.reviewerName,
    subtitle: formatReviewDate(r.createdAt),
    rating: r.rating,
    text: r.comment ?? "",
    picture: r.reviewerPicture ?? "",
  };
}

export default function BusinessReviewSection({
  showActions,
  businessName,
  username,
}: {
  showActions: boolean;
  businessName: string;
  username: string;
}) {
  const { t } = useLang();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [existingReview, setExistingReview] = useState<{ rating: number; text: string } | null>(null);
  const [reviewer, setReviewer] = useState<{ token: string; name: string; picture: string } | null>(
    () => getReviewerSession()
  );

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/public/business/${username}/reviews`);
      if (!res.ok) return;
      const data = await res.json();
      const mapped: Review[] = (data.reviews ?? []).map(toReview);
      setReviews(mapped);
      setTotalCount(data.total ?? mapped.length);

      if (mapped.length > 0) {
        const avg = (data.reviews as { rating: number }[]).reduce((s, r) => s + r.rating, 0) / data.reviews.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch {}
    finally { setLoading(false); }
  }, [username]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const openAddReview = async (session?: { token: string; name: string; picture: string }) => {
    const s = session ?? getReviewerSession();
    if (!s) { setSignInOpen(true); return; }
    setReviewer(s);
    setExistingReview(null);
    try {
      const res = await fetch(`${API_BASE}/api/public/business/${username}/reviews/my`, {
        headers: { Authorization: `Bearer ${s.token}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(REVIEWER_TOKEN_KEY);
        sessionStorage.removeItem(REVIEWER_NAME_KEY);
        sessionStorage.removeItem(REVIEWER_PICTURE_KEY);
        setReviewer(null);
        setSignInOpen(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data.review) {
          setExistingReview({ rating: data.review.rating, text: data.review.comment ?? "" });
        }
      }
    } catch (e) {
      console.error("Failed to fetch existing review", e);
    }
    setAddOpen(true);
  };

  const handleSignInSuccess = (token: string, name: string, picture: string) => {
    sessionStorage.setItem(REVIEWER_TOKEN_KEY, token);
    sessionStorage.setItem(REVIEWER_NAME_KEY, name);
    sessionStorage.setItem(REVIEWER_PICTURE_KEY, picture);
    setSignInOpen(false);
    openAddReview({ token, name, picture });
  };

  const handlePost = async (rating: number, text: string) => {
    if (!reviewer) return;
    try {
      await fetch(`${API_BASE}/api/public/business/${username}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${reviewer.token}`,
        },
        body: JSON.stringify({ rating, comment: text }),
      });
    } catch (e) {
      console.error("Failed to post review", e);
    }
    setAddOpen(false);
    fetchReviews();
  };

  if (reviews.length === 0 && !showActions) return null;

  return (
    <section className="bg-white py-12 sm:px-6 font-poppins">
      <div className="px-4">
        <div className="max-w-[1008px] mx-auto flex flex-col items-center bg-white rounded-[24px] py-4 shadow-[0_0_8px_0_rgba(0,0,0,0.12)]">
          <span className="text-[16px] font-semibold leading-[150%] text-[#222]">{t("Reviews")}</span>
          <span className="mt-2 text-[20px] font-semibold leading-[150%] text-[#222]">{averageRating || 0}</span>
          <div className="mt-1">
            <RatingStars rating={averageRating} />
          </div>
        </div>
      </div>

      {loading && (
        <>
          <div className="hidden min-[710px]:grid mt-8 gap-2 justify-center grid-cols-[repeat(2,341px)] min-[1084px]:grid-cols-[repeat(3,341px)]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full min-[710px]:w-[341px] bg-white rounded-[12px] py-5 px-4">
                <ReviewSkeleton />
              </div>
            ))}
          </div>
          <div className="min-[710px]:hidden mt-8 px-4">
            <div className="bg-white rounded-[12px] py-5 px-4">
              <ReviewSkeleton />
            </div>
          </div>
        </>
      )}

      {!loading && reviews.length > 0 && (
        <>
          <div className="hidden min-[710px]:grid mt-8 gap-2 justify-center grid-cols-[repeat(2,341px)] min-[1084px]:grid-cols-[repeat(3,341px)]">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} onShowMore={() => setReviewsOpen(true)} />
            ))}
          </div>

          <div className="hidden min-[600px]:grid min-[710px]:hidden mt-8 gap-2 justify-center grid-cols-[repeat(2,266px)]">
            {reviews.map((review, i) => (
              <ReviewCard key={i} review={review} onShowMore={() => setReviewsOpen(true)} />
            ))}
          </div>

          <div className="min-[600px]:hidden">
            <MobileCarousel reviews={reviews} onShowMore={() => setReviewsOpen(true)} />
          </div>
        </>
      )}

      {showActions && (
        <div className="flex flex-col min-[500px]:flex-row justify-center items-center mt-4 gap-4 mx-auto w-fit">
          <Button text={t("Add_a_review")} className="max-[500px]:px-6 mx-auto" onPress={openAddReview} />
          {reviews.length > 0 && (
            <button
              type="button"
              onClick={() => setReviewsOpen(true)}
              className="mx-auto bg-[#F2F2F2] px-6 py-3 rounded-[31px] cursor-pointer text-[#B31B38] text-[16px] font-medium leading-[150%] font-poppins border-0 transition-colors duration-150 hover:bg-[#E5E5E5] active:scale-[0.98]"
            >
              {t("See_all_reviews")}
            </button>
          )}
        </div>
      )}

      {reviewsOpen && (
        <ReviewsModal
          allReviews={reviews}
          averageRating={averageRating}
          totalCount={totalCount}
          showActions={showActions}
          onClose={() => { setReviewsOpen(false); }}
        />
      )}

      {signInOpen && (
        <GoogleSignInModal
          onClose={() => setSignInOpen(false)}
          onSuccess={handleSignInSuccess}
        />
      )}

      {addOpen && reviewer && (
        <AddReviewModal
          businessName={businessName}
          reviewerName={reviewer.name}
          reviewerPicture={reviewer.picture}
          initialRating={existingReview?.rating}
          initialText={existingReview?.text}
          onClose={() => setAddOpen(false)}
          onPost={handlePost}
        />
      )}
    </section>
  );
}
