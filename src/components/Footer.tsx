// "use client";

// export default function Footer() {
//   return (
//     <footer
//       style={{
//         background: "linear-gradient(270deg, #35050C 0%, #740234 100%)",
//         fontFamily: "'Poppins', sans-serif",
//       }}
//     >
//       {/* ── Top section ── */}
//       <div
//         style={{
//           maxWidth: 1200,
//           margin: "0 auto",
//           paddingLeft: 24,
//           paddingRight: 24,
//           paddingTop: 40,
//           paddingBottom: 0,
//         }}
//       >
//         <div className="footer-cols">

//           {/* ── Col 1: Nav links ── */}
//           <div className="footer-col">
//             <a href="#" className="footer-nav-link footer-heading">Home</a>
//             <a href="#" className="footer-nav-link" style={{ marginBottom: 8 }}>About Us</a>
//             <a href="#" className="footer-nav-link">Join Now</a>
//           </div>

//           {/* ── Col 2: Legal links ── */}
//           <div className="footer-col">
//             <a href="#" className="footer-nav-link footer-heading">Terms &amp; Conditions</a>
//             <a href="#" className="footer-nav-link" style={{ marginBottom: 8 }}>Privacy Policy</a>
//             <a href="#" className="footer-nav-link">Blog</a>
//           </div>

//           {/* ── Col 3: Description ── */}
//           <div className="footer-col footer-desc-col">
//             <p className="footer-desc">
//               Tamilinai Matrimony, a proud initiative by Ahken Labs based in Eelam&apos;s heart,
//               Kilinochchi, is Sri Lanka&apos;s most trusted matrimonial platform exclusively built
//               for the global Eelam Tamil community. We blend cutting-edge privacy design with deep
//               cultural roots to provide 100% ID-verified marriage proposals, seamlessly connecting
//               Jaffna, Vanni, Trincomalee, Batticaloa, the center province and the worldwide Tamil
//               diaspora.
//             </p>
//           </div>
//         </div>

//         {/* ── Divider ── */}
//         <div
//           style={{
//             marginTop: 20,
//             borderTop: "1px solid #FFFFFF",
//             paddingTop: 16,
//             paddingBottom: 16,
//           }}
//         >
//           <div className="footer-bottom">

//             {/* Left */}
//             <div className="footer-bottom-left">
//               <span className="footer-bottom-text">© 2026 Ahken nexus</span>
//               <span className="footer-bottom-dot">·</span>
//               <a href="#" className="footer-bottom-link">Privacy</a>
//               <span className="footer-bottom-dot">·</span>
//               <a href="#" className="footer-bottom-link">Terms</a>
//               <span className="footer-bottom-dot">·</span>
//               <a href="#" className="footer-bottom-link">Your Privacy Choices</a>
//               {/* Privacy choices icon */}
//               <svg
//                 width="26"
//                 height="12"
//                 viewBox="0 0 26 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 style={{ marginLeft: 4, flexShrink: 0, verticalAlign: "middle" }}
//               >
//                 <rect width="26" height="12" rx="2" fill="#FFFFFF" fillOpacity="0.15" />
//                 <rect x="1" y="1" width="10" height="10" rx="1.5" fill="#0066CC" />
//                 <path d="M3.5 6L5.5 8.5L8 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
//                 <path d="M14 6H24" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
//                 <circle cx="19" cy="6" r="2.5" fill="#FFFFFF" fillOpacity="0.3" stroke="#FFFFFF" strokeWidth="0.8" />
//               </svg>
//             </div>

//             {/* Right */}
//             <div className="footer-bottom-right">
//               {/* Globe */}
//               <div className="footer-locale">
//                 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1.2" />
//                   <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="white" strokeWidth="1.2" />
//                   <line x1="1.5" y1="6" x2="14.5" y2="6" stroke="white" strokeWidth="1.2" />
//                   <line x1="1.5" y1="10" x2="14.5" y2="10" stroke="white" strokeWidth="1.2" />
//                 </svg>
//                 <span className="footer-bottom-text" style={{ marginLeft: 5 }}>English (UK)</span>
//               </div>
//               <span className="footer-bottom-dot">·</span>
//               <span className="footer-bottom-text">LKR</span>
//               <span className="footer-bottom-dot">·</span>

//               {/* Social icons */}
//               <div className="footer-socials">
//                 {/* Facebook */}
//                 <a href="#" aria-label="Facebook" className="footer-social-icon">
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M12 1.5H10C8.067 1.5 6.5 3.067 6.5 5V6.5H4.5V9H6.5V14.5H9V9H11L11.5 6.5H9V5C9 4.724 9.224 4.5 9.5 4.5H12V1.5Z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
//                   </svg>
//                 </a>
//                 {/* WhatsApp */}
//                 <a href="#" aria-label="WhatsApp" className="footer-social-icon">
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8C1.5 9.19 1.83 10.31 2.4 11.27L1.5 14.5L4.83 13.62C5.76 14.14 6.84 14.5 8 14.5C11.59 14.5 14.5 11.59 14.5 8C14.5 4.41 11.59 1.5 8 1.5Z" stroke="white" strokeWidth="1.2" />
//                     <path d="M5.5 6C5.5 6 5.5 7.5 7 9C8.5 10.5 10 10.5 10 10.5L10.5 9.5L9 8.5L8.5 9L7 7.5L7.5 7L6.5 5.5L5.5 6Z" stroke="white" strokeWidth="1" strokeLinejoin="round" fill="none" />
//                   </svg>
//                 </a>
//                 {/* X / Twitter */}
//                 <a href="#" aria-label="X" className="footer-social-icon">
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2.5 2.5L13.5 13.5M13.5 2.5L2.5 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
//                   </svg>
//                 </a>
//                 {/* Instagram */}
//                 <a href="#" aria-label="Instagram" className="footer-social-icon">
//                   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.2" />
//                     <circle cx="8" cy="8" r="2.8" stroke="white" strokeWidth="1.2" />
//                     <circle cx="11.2" cy="4.8" r="0.7" fill="white" />
//                   </svg>
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Scoped styles ── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');

//         .footer-cols {
//           display: flex;
//           gap: 48px;
//           align-items: flex-start;
//           flex-wrap: wrap;
//         }

//         .footer-col {
//           display: flex;
//           flex-direction: column;
//         }

//         .footer-desc-col {
//           flex: 1;
//           min-width: 240px;
//           max-width: 420px;
//         }

//         /* Nav link style matches spec exactly */
//         .footer-nav-link {
//           font-family: 'Poppins', sans-serif;
//           font-weight: 400;
//           font-size: 18px;
//           line-height: 200%;
//           letter-spacing: 0%;
//           color: #FFFFFF;
//           text-decoration: none;
//           display: block;
//           transition: opacity 0.15s;
//         }
//         .footer-nav-link:hover {
//           opacity: 0.75;
//         }
//         /* First item is the "heading" — no extra bottom margin */
//         .footer-heading {
//           /* just the natural line-height spacing above the rest */
//         }

//         .footer-desc {
//           font-family: 'Poppins', sans-serif;
//           font-weight: 300;
//           font-size: 13px;
//           line-height: 180%;
//           color: rgba(255,255,255,0.75);
//           margin: 0;
//         }

//         /* Bottom bar */
//         .footer-bottom {
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           flex-wrap: wrap;
//           gap: 12px;
//           min-height: 32px;
//         }

//         .footer-bottom-left {
//           display: flex;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 6px;
//         }

//         .footer-bottom-right {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .footer-locale {
//           display: flex;
//           align-items: center;
//         }

//         .footer-bottom-text {
//           font-family: 'Poppins', sans-serif;
//           font-size: 12px;
//           font-weight: 400;
//           color: rgba(255,255,255,0.8);
//         }

//         .footer-bottom-link {
//           font-family: 'Poppins', sans-serif;
//           font-size: 12px;
//           font-weight: 400;
//           color: rgba(255,255,255,0.8);
//           text-decoration: none;
//           transition: color 0.15s;
//         }
//         .footer-bottom-link:hover {
//           color: #fff;
//         }

//         .footer-bottom-dot {
//           font-size: 12px;
//           color: rgba(255,255,255,0.4);
//           line-height: 1;
//         }

//         .footer-socials {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .footer-social-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           opacity: 0.85;
//           transition: opacity 0.15s;
//         }
//         .footer-social-icon:hover {
//           opacity: 1;
//         }

//         /* ── Tablet ── */
//         @media (max-width: 900px) {
//           .footer-cols {
//             gap: 32px;
//           }
//           .footer-desc-col {
//             max-width: 100%;
//           }
//         }

//         /* ── Mobile ── */
//         @media (max-width: 600px) {
//           .footer-cols {
//             flex-direction: column;
//             gap: 24px;
//           }

//           .footer-desc-col {
//             min-width: unset;
//           }

//           .footer-nav-link {
//             font-size: 16px;
//           }

//           .footer-bottom {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 12px;
//           }

//           .footer-bottom-left,
//           .footer-bottom-right {
//             flex-wrap: wrap;
//           }
//         }
//       `}</style>
//     </footer>
//   );
// }









"use client";

import Image from "next/image";
import { FaFacebookF, FaWhatsapp, FaTwitter, FaInstagram } from "react-icons/fa";

const WHATSAPP_NUMBER = "+94762360948";

export default function Footer() {
  return (
    <footer className="w-full bg-[linear-gradient(270deg,#35050C_0%,#740234_100%)] text-white font-poppins">

      {/* ── TOP ── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-6">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* LEFT SIDE (NAVS) */}
          <div className="flex gap-16">

            {/* Nav */}
            <div className="flex flex-col gap-2 text-[18px] leading-[200%]">
              <a href="#hero" className="hover:opacity-70">Home</a>
              <a href="#about" className="hover:opacity-70">About Us</a>
              <a href="#join" className="hover:opacity-70">Join Now</a>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-2 text-[18px] leading-[200%]">
              <a href="#" className="hover:opacity-70">Terms & Conditions</a>
              <a href="#" className="hover:opacity-70">Privacy Policy</a>
              <a href="#" className="hover:opacity-70">Blog</a>
            </div>

          </div>

          {/* RIGHT SIDE (PARAGRAPH) */}
          <div className="max-w-[420px] text-[16px] leading-[150%] text-white/90">
            Tamilinai Matrimony, a proud initiative by Ahken Labs based in Eelam's heart,
            Kilinochchi, is Sri Lanka’s most trusted matrimonial platform exclusively built
            for the global Eelam Tamil community. We blend cutting-edge privacy design with
            deep cultural roots to provide 100% ID-verified marriage proposals, seamlessly
            connecting Jaffna, Vanni, Trincomalee, Batticaloa, the center province and the
            worldwide Tamil diaspora.
          </div>

        </div>

        {/* ── DIVIDER ── */}
        <div className="mt-8 border-t border-white/30 pt-4 flex flex-col md:flex-row justify-between gap-4">

          {/* LEFT */}
          <div className="flex flex-wrap items-center gap-2 text-[14px] text-white/80">

            <span>© 2026 Ahken nexus</span>
            <span>·</span>

            <a href="#" className="hover:text-white">Privacy</a>
            <span>·</span>

            <a href="#" className="hover:text-white">Terms</a>
            <span>·</span>

            <a href="#" className="hover:text-white flex items-center gap-2">
              Your Privacy Choices
              <Image
                src="/icons/privacy_icon.png"
                alt="privacy"
                width={26}
                height={12}
              />
            </a>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">

            {/* Socials */}
            <a href="https://facebook.com" target="_blank" className="hover:opacity-80">
              <FaFacebookF size={16} />
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace("+", "")}`}
              target="_blank"
              className="hover:opacity-80"
            >
              <FaWhatsapp size={16} />
            </a>

            <a href="https://twitter.com" target="_blank" className="hover:opacity-80">
              <FaTwitter size={16} />
            </a>

            <a href="https://instagram.com" target="_blank" className="hover:opacity-80">
              <FaInstagram size={16} />
            </a>

          </div>
        </div>
      </div>
    </footer>
  );
}