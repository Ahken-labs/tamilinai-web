import { notFound } from "next/navigation";
import type { Metadata } from "next";
import UnderReviewPage from "./UnderReviewPage";
import PublicPortfolioClient from "./PublicPortfolioClient";
import API_BASE_URL from "@/src/lib/api/config";
import BusinessHeader from "@/src/components/BusinessHeader";

interface ServicePhoto {
  id: string;
  r2Key: string;
  url: string;
  displayOrder: number;
}

interface Service {
  id: string;
  title: string;
  price: number;
  description: string;
  displayOrder: number;
  photos: ServicePhoto[];
}

export interface PublicBusiness {
  id: string;
  username: string;
  businessName: string;
  category: string;
  specify?: string;
  bio?: string;
  experience: string;
  qualifications?: string;
  careerHighlight?: string;
  village: string;
  district: string;
  serviceDistricts: string[];
  islandWide: boolean;
  phone: string;
  countryCode: string;
  coverPhotoUrl: string | null;
  logoUrl: string | null;
  avgRating: number | null;
  reviewCount: number;
  services: Service[];
}

async function getBusiness(username: string): Promise<PublicBusiness | { pending: true } | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/public/business/${username}`, { next: { revalidate: 60 } });
    if (res.status === 404) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const data = await getBusiness(username);
  if (!data || "pending" in data) return {};
  return {
    title: `${data.businessName} - ${data.category} on Inai`,
    description: data.bio ?? `${data.businessName} offers ${data.category} services in ${data.district}, Sri Lanka.`,
  };
}

export default async function BusinessPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getBusiness(username);

  if (!data) notFound();
  if ("pending" in data) return <UnderReviewPage />;

  return (
  <main>
    <BusinessHeader />
    <PublicPortfolioClient business={data} />
  </main>
  );
}
