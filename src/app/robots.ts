import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/matches',
          '/interested',
          '/notifications',
          '/account-settings',
          '/invoice',
          '/cancel-subscription',
          '/elite-upgrade',
          '/my-profile',
          '/verify-otp',
          '/create-password',
          '/reset-password',
          '/reset-otp',
          '/setup',
        ],
      },
    ],
    sitemap: 'https://inai.lk/sitemap.xml',
  };
}
