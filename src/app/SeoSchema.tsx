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
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://inai.lk/#website",
              "url": "https://inai.lk",
              "name": "Inai",
              "publisher": {
                "@id": "https://inai.lk/#organization"
              }
            }
          ]
        }),
      }}
    />
  );
}
