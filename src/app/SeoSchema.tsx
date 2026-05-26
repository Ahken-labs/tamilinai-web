export default function SeoSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://inai.lk/#organization",
              "name": "Inai",
              "url": "https://inai.lk",
              "logo": {
                "@type": "ImageObject",
                "url": "https://inai.lk/icon.png"
              },
              "sameAs": [
                "https://www.facebook.com/inai.lk",
                "https://www.instagram.com/inai.lk"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "support@inai.lk",
                "availableLanguage": ["English", "Tamil"]
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://inai.lk/#website",
              "url": "https://inai.lk",
              "name": "Inai — Tamil Matrimony Sri Lanka",
              "description": "Inai Tamil Matrimony connects Sri Lankan Tamils and the global diaspora to find life partners. Rooted in Tamil values.",
              "publisher": {
                "@id": "https://inai.lk/#organization"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://inai.lk/matches?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "WebPage",
              "@id": "https://inai.lk/#webpage",
              "url": "https://inai.lk",
              "name": "Inai — Tamil Matrimony Sri Lanka",
              "isPartOf": { "@id": "https://inai.lk/#website" },
              "about": { "@id": "https://inai.lk/#organization" },
              "description": "Find your Tamil life partner on Inai. Sri Lanka's trusted Tamil matrimony platform for the local community and global diaspora including UK, Canada, Australia, Germany, Singapore, Malaysia, and India."
            },
            {
              "@type": "FAQPage",
              "@id": "https://inai.lk/#faq",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is Inai free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, creating a profile and browsing matches on Inai is free. Elite membership unlocks additional features like contact details and unlimited messaging."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who can join Inai?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Inai is open to Sri Lankan Tamils and Tamil diaspora worldwide, including UK, Canada, Australia, Germany, Singapore, Malaysia, and India."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is my data safe on Inai?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Your contact details are never shared without your permission. All profiles are manually reviewed for authenticity."
                  }
                }
              ]
            }
          ]
        }),
      }}
    />
  );
}
