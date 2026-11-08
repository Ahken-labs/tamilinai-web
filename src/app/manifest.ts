import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Inai - Sri Lankan Tamil Matrimony",
    short_name: "Inai",
    description: "Find your life partner on Inai — Tamil matrimony for Sri Lanka and the global diaspora.",
    start_url: "/matches",
    scope: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#BA0453",
    icons: [
      { src: "/icons/app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
