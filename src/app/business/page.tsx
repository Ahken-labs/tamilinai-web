import type { Metadata } from "next";
import BusinessPage from "./sections/BusinessPage";

export const metadata: Metadata = {
  title: "Wedding Vendors & Services - Inai",
  description: "Browse wedding vendors, photographers, makeup artists, and more across Sri Lanka on Inai.",
};

export default function BusinessListingPage() {
  return <BusinessPage />;
}
