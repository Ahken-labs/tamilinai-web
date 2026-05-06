// "use client";

// type MetaLine = {
//   text: string;
// };

// type PolicySection = {
//   title: string;
//   content: string;
// };

// const metaLines: MetaLine[] = [
//   { text: "Effective Date: 1st June 2025" },
//   { text: "Last Updated: 1st June 2025" },
//   { text: "Version 1.0" },
//   { text: "www.inai.lk" },
//   { text: "privacy@inai.lk" },
//   { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
// ];

// const policySections: PolicySection[] = [
//   {
//     title: "Introduction & our commitment",
//     content: `Welcome to Inai (“inai.lk”, “we”, “us”, or “our”). Inai is a Tamil matrimony platform operated under Ahken Nexus and built by Ahkenlabs (ahkenlabs.com). Our mission is to connect Sri Lankan Tamil individuals and diaspora communities worldwide to find life partners who share their culture, values, and aspirations.

// We understand that when you use Inai you are sharing some of the most personal information in your life — your identity, family background, physical attributes, relationship goals, and contact details. This Privacy Policy explains exactly what data we collect, why we collect it, who may see it, how we protect it, and what rights you hold over it.

// By registering on inai.lk or any associated mobile application, you confirm that you have read, understood, and agreed to this Privacy Policy. If you do not agree, please do not use the platform.

// This policy applies to all users of inai.lk regardless of country of residence.`,
//   },
//   {
//     title: "1. Data controller & contact",
//     content: `The Data Controller responsible for your personal information is:
// Platform Name: Inai
// Parent Company: Ahken Nexus
// Technology Partner: Ahkenlabs (ahkenlabs.com)
// Website: www.inai.lk
// Privacy Contact Email: privacy@inai.lk
// Grievance Contact Email: grievance@inai.lk

// For all privacy-related queries, data correction requests, or complaints, please contact us at privacy@inai.lk. We aim to respond within 14 business days.`,
//   },
//   {
//     title: "2. Personal data we collect",
//     content: `We collect data in the following categories when you register, build a profile, and use the platform:

// 2.1 Identity & Contact Information
//    • Full name
//    • Date of birth and age
//    • Gender
//    • Mobile number (including WhatsApp number)
//    • Email address
//    • Citizenship / nationality
//    • Country, city, and district of current residence
//    • City of birth

// 2.2 Physical & Health Attributes
//    • Height and weight
//    • Body build
//    • Whether you have any physical disability (Yes / No — voluntary disclosure only)

// 2.3 Educational & Professional Background
//    • Highest educational qualification
//    • Employment status and job title
//    • Industry / job sector
//    • Income range (approximate bracket)

// 2.4 Cultural & Religious Identity
//    • Religion
//    • Caste (voluntary)
//    • Eating habits (vegetarian, non-vegetarian, etc.)
//    • Drinking habits
//    • Smoking habits

// 2.5 Family Background
//    • Father’s occupation
//    • Mother’s occupation
//    • Number of brothers and sisters
//    • Profile created by (self, parent, sibling, guardian)

// 2.6 Partner Preferences
//    • Preferred age range, height, education, religion, caste, location, and other matching criteria you set

// 2.7 Account & Technical Data
// Login credentials (password stored as salted hash — never in plain text)
// Device type, browser, IP address, operating system
// Session activity logs, pages visited, and interactions (interest sent, profiles viewed)
// Payment transaction records for Elite Membership (no raw card details are stored — handled by PCI-DSS payment gateway)

// 2.8 User-Generated Content
// Profile photographs and any additional images you upload
// Messages exchanged on the platform (if messaging is enabled)
// Any feedback or support queries you submit`,
//   },
//   {
//     title: "3. Legal Basis for Processing",
//     content: `We process your data on the following legal grounds:

// Contractual Necessity — to deliver the matrimony matching service you signed up for
// Consent — for sensitive categories such as disability status, caste, religion, body attributes, and family details; you may withdraw consent at any time
// Legitimate Interests — for fraud prevention, platform security, and improving matching algorithms
// Legal Obligation — to comply with laws of Sri Lanka and applicable laws of your country of residence

// Where we rely on consent, you have the right to withdraw it at any time without affecting the lawfulness of prior processing. Some features may become unavailable if you withdraw consent for core profile data.`,
//   },
//   {
//     title: "4. How We Use Your Data",
//     content: `4.1 Core Matching Service
// Display your profile to other registered users of the opposite gender (or your specified preference) after email and mobile verification
// Power compatibility filters and partner preference matching
// Enable you to send and receive expressions of interest

// 4.2 Contact Details — Elite Membership Gate
// Contact information (mobile number, WhatsApp number, and email address) is classified as sensitive contact data. It is NOT visible to other users unless:
// The user viewing your profile holds an active Elite Membership, AND
// You have not opted out of contact-detail visibility in your privacy settings
// This gating mechanism is a core revenue-generating and safety feature of the platform.

// 4.3 Identity Verification
// OTP-based mobile number verification
// Email verification link
// We may request identity documents for optional verified badge features

// 4.4 Communications
// Transactional emails: registration, verification, password reset, membership receipts
// Service notifications: new interests received, profile views, system updates
// Promotional communications (only if you have opted in; you may opt out at any time)

// 4.5 Platform Improvement & Analytics
// Aggregate and anonymised usage analytics to improve features
// A/B testing of user interface improvements
// Fraud detection and abuse prevention

// 4.6 Legal & Safety Purposes
// Responding to lawful government or court orders
// Investigating reports of misuse, harassment, or fraudulent profiles
// Enforcing our Terms of Service`,
//   },
//   {
//     title: "5. Data Visibility — Who Sees What",
//     content: `Because Inai involves sharing sensitive personal data between users, we operate a tiered visibility model:

// 5.1 Publicly Visible to All Registered Users
// First name and age
// City of residence (general — not exact address)
// Highest education level
// Job sector
// Religion and caste (unless hidden by user)
// Height
// Profile photographs

// 5.2 Visible to All Registered Users (Opposite Gender / Preference)
// Full name
// Weight and body shape
// Eating, drinking, and smoking habits
// Family details (parents’ occupation, siblings)
// Income range
// Disability status (only if user has chosen to disclose)
// Partner preferences

// 5.3 Visible ONLY to Elite Members
// Mobile / WhatsApp number
// Email address

// 5.4 Never Visible to Other Users
// Password hash
// IP address and device data
// Payment records
// Internal moderation or fraud flags

// You may further control your own visibility through profile privacy settings within your account dashboard.`,
//   },
//   {
//     title: "6. Special Category (Sensitive) Data",
//     content: `The following data fields are classified as sensitive under applicable privacy frameworks and are processed with additional care:

// Physical disability status
// Caste (a category that can attract discrimination)
// Religious beliefs
// Health-related attributes (disability, body shape)
// Family financial indicators (income range, parental occupation)

// We collect these only with your explicit, informed consent. You may choose not to disclose any sensitive category data, and the platform will still function, though matching accuracy may be reduced. You may also request deletion of sensitive category data at any time.`,
//   },
//   {
//     title: "7. Data Sharing & Third Parties",
//     content: `We do not sell, rent, or trade your personal data to any third party for commercial purposes. Data is shared only in the following circumstances:

// 7.1 Registered Platform Users
// As described in Section 5, other registered users will see profile data according to the tiered visibility model. By registering on Inai you acknowledge and consent to this.

// 7.2 Service Providers (Data Processors)
// We engage trusted third-party processors who act under strict data processing agreements. These include:
// Cloud hosting & infrastructure providers (e.g., servers, databases)
// Payment gateway operators (PCI-DSS compliant — raw card data never reaches our servers)
// Email delivery services (transactional emails)
// SMS / OTP gateway providers (for mobile verification)
// Analytics tools (using anonymised or aggregated data only)

// 7.3 Legal & Regulatory Disclosure
// We may disclose data when required by a valid court order, warrant, or request from law enforcement authorities in Sri Lanka or the user’s country of residence. We will notify you of such requests to the extent permitted by law.

// 7.4 Business Transfers
// In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity, who will be bound by terms no less protective than this Privacy Policy. You will be notified prior to any such transfer.

// 7.5 Safety of Others
// We may share data if we have a good-faith belief that disclosure is necessary to prevent imminent harm to a person or to protect the safety of our users and the public.`,
//   },
//   {
//     title: "8. International Data Transfers",
//     content: `Inai serves Sri Lankan Tamils worldwide including diaspora communities in countries such as India, the United Kingdom, Canada, Australia, France, Germany, and the UAE. Your data may be processed in countries other than your country of residence.

// Where data is transferred outside Sri Lanka, we ensure adequate safeguards are in place, including:
// Standard Contractual Clauses (SCCs) approved by the European Commission for transfers involving EU/EEA residents
// UK International Data Transfer Agreements (IDTAs) for UK residents
// Contractual obligations equivalent to GDPR protections for all other international transfers

// Users in the European Union, United Kingdom, and other jurisdictions with specific data protection laws retain all rights afforded to them by their local laws, including those described in Section 11 of this policy.`,
//   },
//   {
//     title: "9. Data Retention",
//     content: `We retain your personal data for the following periods:

// Active account: for the duration of your registration plus a 90-day grace period after account deactivation
// Deleted account: profile data is purged within 30 days of a deletion request; anonymised statistical data may be retained indefinitely
// Payment records: retained for 7 years to meet financial and tax obligations
// Security logs and fraud-prevention records: up to 3 years
// Backup copies: overwritten within 90 days of the original deletion

// You may request deletion of your account and all associated data at any time through the account settings or by emailing privacy@inai.lk.`,
//   },
//   {
//     title: "10. Data Security",
//     content: `We implement industry-standard technical and organisational measures to protect your data:

// 10.1 Technical Safeguards
// All data in transit encrypted via TLS 1.2 or higher (HTTPS enforced sitewide)
// All data at rest encrypted using AES-256
// Passwords stored as salted cryptographic hashes (bcrypt or Argon2)
// Contact details stored in encrypted fields with decryption restricted to Elite Membership validation layer
// Payment processed through PCI-DSS Level 1 certified payment gateways; no raw card data stored
// Two-factor authentication (2FA) available for user accounts
// Regular vulnerability scanning and penetration testing

// 10.2 Organisational Safeguards
// Role-based access control — staff access to user data is limited to what is necessary for their function
// All employees and contractors handling personal data are bound by confidentiality agreements
// Data breach response plan in place

// 10.3 Breach Notification
// In the event of a data breach that poses a risk to your rights and freedoms, we will notify affected users within 72 hours of becoming aware of the breach (or within the timeframe required by applicable law), and will notify relevant regulatory authorities as required.`,
//   },
//   {
//     title: "11. Your Rights",
//     content: `Depending on your country of residence you have the following rights regarding your personal data:
// Right of Access — request a copy of all personal data we hold about you
// Right to Rectification — correct inaccurate or incomplete data
// Right to Erasure (“Right to be Forgotten”) — request deletion of your account and data
// Right to Restrict Processing — ask us to suspend processing in certain circumstances
// Right to Data Portability — receive your data in a machine-readable format
// Right to Object — object to processing based on legitimate interests
// Right to Withdraw Consent — withdraw consent for sensitive data at any time
// Right to Lodge a Complaint — with the relevant data protection authority in your country

// To exercise any of these rights, email privacy@inai.lk with the subject line “Privacy Rights Request” along with your registered email address. We will respond within 14 business days. We may ask you to verify your identity before processing your request.`,
//   },
//   {
//     title: "12. Children’s Privacy",
//     content: `Inai is strictly a service for adults. You must be at least 18 years of age to register and use this platform. We do not knowingly collect personal data from persons under 18 years of age. If we become aware that a minor has registered, we will immediately suspend and delete that account and all associated data. If you believe a minor has registered on our platform, please report it immediately to privacy@inai.lk.`,
//   },
//   {
//     title: "13. User Responsibilities & Misuse Prevention",
//     content: `By using Inai, you agree to the following:

// You will provide accurate, truthful, and up-to-date information in your profile
// You will use contact details and other member data obtained through the platform solely for the purpose of exploring a matrimonial relationship
// You will not use any data obtained from Inai for commercial solicitation, spamming, harassment, stalking, blackmail, fraud, or any illegal purpose
// You will not copy, screenshot, or otherwise reproduce another member’s profile information for distribution outside the platform
// You will not share your account credentials with any third party
// Violation of these responsibilities may result in immediate account suspension, reporting to law enforcement, and civil or criminal legal action. Inai reserves the right to report misuse of members’ data to appropriate authorities.`,
//   },
//   {
//     title: "14. Limitation of Platform Liability",
//     content: `While Inai implements rigorous security and verification measures, we cannot guarantee that every user on the platform is who they claim to be, or that data will never be misused by another user. Inai’s liability is limited to actions within our direct control as a platform operator.
// We are not liable for:
// Misuse of your data by another user who obtained it through the platform in accordance with its intended use (e.g., an Elite Member contacting you)
// Consequences arising from you voluntarily sharing additional personal information outside the platform directly with another user
// Third-party websites linked from our platform
// If you experience any misuse or harassment, please report it immediately to abuse@inai.lk and, if necessary, to local law enforcement.`,
//   },
//   {
//     title: "15. Cookies & Tracking Technologies",
//     content: `We use cookies and similar technologies to:
// Maintain your login session
// Remember your preferences
// Analyse aggregate platform usage
// Prevent fraud and enhance security

// We do not use third-party advertising cookies. You may control cookie preferences through your browser settings. Disabling certain cookies may impact platform functionality.`,
//   },
//   {
//     title: "16. Elite Membership & Payments",
//     content: `Payment for Elite Membership is processed by a PCI-DSS compliant third-party payment gateway. Inai does not store full credit/debit card numbers or CVV codes. We retain only:
// Transaction ID
// Membership tier and duration purchased
// Amount paid and date of transaction
// Billing name (as provided to the payment gateway)

// Membership is personal and non-transferable. Refund eligibility is governed by our Terms of Service.`,
//   },
//   {
//     title: "17. Changes to This Privacy Policy",
//     content: `We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform features. When we make material changes, we will:
// Post the updated policy on inai.lk/privacy with a revised “Last Updated” date
// Send an email notification to all registered users
// Display an in-app notification upon your next login

// Your continued use of the platform after the effective date of the updated policy constitutes your acceptance. If you do not agree with the changes, you may delete your account before the effective date.`,
//   },
//   {
//     title: "18. Governing Law & Jurisdiction",
//     content: `This Privacy Policy is governed by and interpreted in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.

// For users resident in specific jurisdictions with mandatory data protection laws (including but not limited to EU GDPR, UK GDPR, Canadian PIPEDA, and Australian Privacy Act 1988), the protections afforded by those laws are additionally available to you to the extent they exceed the protections described in this policy.`,
//   },
//   {
//     title: "19. Additional Information for EU / UK Residents (GDPR / UK GDPR)",
//     content: `If you are resident in the European Economic Area or the United Kingdom, the following additional provisions apply:
// The legal bases for processing your data are as described in Section 3 above
// You have the right to lodge a complaint with your local supervisory authority (e.g., the ICO in the UK, or your national DPA in the EU)
// Where we transfer your data outside the EEA or UK, we rely on Standard Contractual Clauses or equivalent safeguards
// We do not carry out automated decision-making that produces legal or similarly significant effects on you without human oversight`,
//   },
//   {
//     title: "20. Grievance Redressal",
//     content: `If you have any complaint or grievance regarding the collection, storage, use, or sharing of your personal data, you may contact our Grievance Officer:
// Email: grievance@inai.lk
// Response time: We aim to resolve all grievances within 30 calendar days.

// If you are not satisfied with our response, you may escalate to the relevant data protection authority in your country of residence.`,
//   },
// ];

// function PolicySectionBlock({ title, content }: PolicySection) {
//   return (
//     <div className="flex flex-col justify-center border-b border-[#EAEAEA] py-4 sm:py-5 md:py-6">
//       <h2 className="text-left font-18 font-medium leading-[150%] text-dark">
//         {title}
//       </h2>
//       <p className="whitespace-pre-line text-left font-16 font-normal leading-[150%] text-secondary3 pt-1.5">
//         {content}
//       </p>
//     </div>
//   );
// }

// export default function PrivacyPolicy() {
//   return (
//         <div className="font-poppins mx-auto flex max-w-[910px] flex-col bg-white px-4 md:px-6">
//           <div className="flex flex-col items-center text-center">
//             <div className="font-18 font-medium leading-[150%] text-dark">
//               INAI.LK
//             </div>
//             <div className="mt-1.5 font-16 font-normal leading-[150%] text-secondary3">
//               Tamil Matrimony — Connecting Hearts Worldwide
//             </div>

//             <div className="mt-1.5 flex w-full flex-col items-center text-center font-16 font-normal leading-[150%] text-secondary3">
//               {metaLines.map((item) => (
//                 <div key={item.text}>{item.text}</div>
//               ))}
//             </div>
//           </div>

//           <div className="mt-4 sm:mt-5 md:mt-6 h-px w-full bg-[#EAEAEA]" />

//           <div className="flex flex-col">
//             {policySections.map((section) => (
//               <PolicySectionBlock
//                 key={section.title}
//                 title={section.title}
//                 content={section.content}
//               />
//             ))}
//           </div>

//           <div className="py-4 sm:py-5 md:py-6 border-b border-[#EAEAEA]">
//             <h2 className="text-left font-18 font-medium leading-[150%] text-dark">
//               Acknowledgement
//             </h2>
//             <p className="mt-1.5 text-left font-16 font-normal leading-[150%] text-secondary3">
//               By using Inai, you acknowledge that you have read this Privacy Policy in full, understand its contents, and agree to be bound by its terms.
//             </p>

//             <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col gap-0 text-left font-16 font-normal leading-[150%] text-secondary3">
//               <div className="font-semibold italic">Thank you for trusting Inai with your most personal journey.</div>
//               <div className="italic">Every heart deserves a safe space to search.</div>
//               <div>— The Inai Team —</div>
//             </div>
//           </div>

//           <div className="mt-4 md:mt-5">
//             <div className="text-center font-16 font-normal leading-[150%] text-secondary3">
//                 Inai.lk  |  A product of Ahken Nexus  |  Built by Ahkenlabs</div>
//             <div className="text-center font-16 font-semibold leading-[150%] text-secondary3">
//                 www.inai.lk  |  privacy@inai.lk
//             </div>

//           </div>
//         </div>
//   );
// }



"use client";

import type { ReactNode } from "react";

type MetaLine = {
    text: string;
};

type ContentBlock =
    | {
        type: "paragraph";
        text: string;
    }
    | {
        type: "italic";
        text: string;
    }
    | {
        type: "subheading";
        text: string;
    }
    | {
        type: "bullets";
        items: string[];
    };

type PolicySection = {
    title: string;
    blocks: ContentBlock[];
};

const metaLines: MetaLine[] = [
    { text: "Effective Date: 1st June 2025" },
    { text: "Last Updated: 1st June 2025" },
    { text: "Version 1.0" },
    { text: "www.inai.lk" },
    { text: "privacy@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const policySections: PolicySection[] = [
    {
        title: "Introduction & our commitment",
        blocks: [
            {
                type: "paragraph",
                text: `Welcome to Inai (“inai.lk”, “we”, “us”, or “our”). Inai is a Tamil matrimony platform operated under Ahken Nexus and built by Ahkenlabs (ahkenlabs.com). Our mission is to connect Sri Lankan Tamil individuals and diaspora communities worldwide to find life partners who share their culture, values, and aspirations.
We understand that when you use Inai you are sharing some of the most personal information in your life — your identity, family background, physical attributes, relationship goals, and contact details. This Privacy Policy explains exactly what data we collect, why we collect it, who may see it, how we protect it, and what rights you hold over it.
By registering on inai.lk or any associated mobile application, you confirm that you have read, understood, and agreed to this Privacy Policy. If you do not agree, please do not use the platform.
This policy applies to all users of inai.lk regardless of country of residence.`,
            },
        ],
    },
    {
        title: "1. Data controller & contact",
        blocks: [
            {
                type: "paragraph",
                text: `The Data Controller responsible for your personal information is:
Platform Name: Inai
Parent Company: Ahken Nexus
Technology Partner: Ahkenlabs (ahkenlabs.com)
Website: www.inai.lk
Privacy Contact Email: privacy@inai.lk
Grievance Contact Email: grievance@inai.lk
For all privacy-related queries, data correction requests, or complaints, please contact us at privacy@inai.lk. We aim to respond within 14 business days.
`,
            },
        ],
    },
    {
        title: "2. Personal data we collect",
        blocks: [
            {
                type: "paragraph",
                text: "We collect data in the following categories when you register, build a profile, and use the platform:",
            },
            {
                type: "subheading",
                text: `
                2.1 Identity & Contact Information`,
            },
            {
                type: "bullets",
                items: [
                    "Full name",
                    "Date of birth and age",
                    "Gender",
                    "Mobile number (including WhatsApp number)",
                    "Email address",
                    "Citizenship / nationality",
                    "Country, city, and district of current residence",
                    "City of birth",
                ],
            },
            {
                type: "subheading",
                text: "2.2 Physical & Health Attributes",
            },
            {
                type: "bullets",
                items: [
                    "Height and weight",
                    "Body build",
                    "Whether you have any physical disability (Yes / No — voluntary disclosure only)",
                ],
            },
            {
                type: "subheading",
                text: "2.3 Educational & Professional Background",
            },
            {
                type: "bullets",
                items: [
                    "Highest educational qualification",
                    "Employment status and job title",
                    "Industry / job sector",
                    "Income range (approximate bracket)",
                ],
            },
            {
                type: "subheading",
                text: "2.4 Cultural & Religious Identity",
            },
            {
                type: "bullets",
                items: [
                    "Religion",
                    "Caste (voluntary)",
                    "Eating habits (vegetarian, non-vegetarian, etc.)",
                    "Drinking habits",
                    "Smoking habits",
                ],
            },
            {
                type: "subheading",
                text: "2.5 Family Background",
            },
            {
                type: "bullets",
                items: [
                    "Father’s occupation",
                    "Mother’s occupation",
                    "Number of brothers and sisters",
                    "Profile created by (self, parent, sibling, guardian)",
                ],
            },
            {
                type: "subheading",
                text: "2.6 Partner Preferences",
            },
            {
                type: "bullets",
                items: [
                    "Preferred age range, height, education, religion, caste, location, and other matching criteria you set",
                ],
            },
            {
                type: "subheading",
                text: "2.7 Account & Technical Data",
            },
            {
                type: "bullets",
                items: [
                    "Login credentials (password stored as salted hash — never in plain text)",
                    "Device type, browser, IP address, operating system",
                    "Session activity logs, pages visited, and interactions (interest sent, profiles viewed)",
                    "Payment transaction records for Elite Membership (no raw card details are stored — handled by PCI-DSS payment gateway)",
                ],
            },
            {
                type: "subheading",
                text: "2.8 User-Generated Content",
            },
            {
                type: "bullets",
                items: [
                    "Profile photographs and any additional images you upload",
                    "Messages exchanged on the platform (if messaging is enabled)",
                    "Any feedback or support queries you submit",
                ],
            },
        ],
    },
    {
        title: "3. Legal Basis for Processing",
        blocks: [
            {
                type: "paragraph",
                text: `We process your data on the following legal grounds:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    "Contractual Necessity — to deliver the matrimony matching service you signed up for",
                    "Consent — for sensitive categories such as disability status, caste, religion, body attributes, and family details; you may withdraw consent at any time",
                    "Legitimate Interests — for fraud prevention, platform security, and improving matching algorithms",
                    `Legal Obligation — to comply with laws of Sri Lanka and applicable laws of your country of residence`,
                ],
            },
            {
                type: "paragraph",
                text: `
                Where we rely on consent, you have the right to withdraw it at any time without affecting the lawfulness of prior processing. Some features may become unavailable if you withdraw consent for core profile data.`,
            },
        ],
    },
    {
        title: "4. How We Use Your Data",
        blocks: [
            {
                type: "paragraph",
                text: "4.1 Core Matching Service",
            },
            {
                type: "bullets",
                items: [
                    "Display your profile to other registered users of the opposite gender (or your specified preference) after email and mobile verification",
                    "Power compatibility filters and partner preference matching",
                    "Enable you to send and receive expressions of interest",
                ],
            },
            {
                type: "subheading",
                text: "4.2 Contact Details — Elite Membership Gate",
            },
            {
                type: "paragraph",
                text: `Contact information (mobile number, WhatsApp number, and email address) is classified as sensitive contact data. It is NOT visible to other users unless:`,
            },
            {
                type: "bullets",
                items: [
                    "The user viewing your profile holds an active Elite Membership, AND",
                    "You have not opted out of contact-detail visibility in your privacy settings",
                ],
            },
            {
                type: "paragraph",
                text: `This gating mechanism is a core revenue-generating and safety feature of the platform.`,
            },
            {
                type: "subheading",
                text: "4.3 Identity Verification",
            },
            {
                type: "bullets",
                items: [
                    "OTP-based mobile number verification",
                    "Email verification link",
                    "We may request identity documents for optional verified badge features",
                ],
            },
            {
                type: "subheading",
                text: "4.4 Communications",
            },
            {
                type: "bullets",
                items: [
                    "Transactional emails: registration, verification, password reset, membership receipts",
                    "Service notifications: new interests received, profile views, system updates",
                    "Promotional communications (only if you have opted in; you may opt out at any time)",
                ],
            },
            {
                type: "subheading",
                text: "4.5 Platform Improvement & Analytics",
            },
            {
                type: "bullets",
                items: [
                    "Aggregate and anonymised usage analytics to improve features",
                    "A/B testing of user interface improvements",
                    "Fraud detection and abuse prevention",
                ],
            },
            {
                type: "subheading",
                text: "4.6 Legal & Safety Purposes",
            },
            {
                type: "bullets",
                items: [
                    "Responding to lawful government or court orders",
                    "Investigating reports of misuse, harassment, or fraudulent profiles",
                    "Enforcing our Terms of Service",
                ],
            },
        ],
    },
    {
        title: "5. Data Visibility — Who Sees What",
        blocks: [
            {
                type: "paragraph",
                text: `Because Inai involves sharing sensitive personal data between users, we operate a tiered visibility model:
                
                `,
            },
            {
                type: "subheading",
                text: "5.1 Publicly Visible to All Registered Users",
            },
            {
                type: "bullets",
                items: [
                    "First name and age",
                    "City of residence (general — not exact address)",
                    "Highest education level",
                    "Job sector",
                    "Religion and caste (unless hidden by user)",
                    "Height",
                    "Profile photographs",
                ],
            },
            {
                type: "subheading",
                text: "5.2 Visible to All Registered Users (Opposite Gender / Preference)",
            },
            {
                type: "bullets",
                items: [
                    "Full name",
                    "Weight and body shape",
                    "Eating, drinking, and smoking habits",
                    "Family details (parents’ occupation, siblings)",
                    "Income range",
                    "Disability status (only if user has chosen to disclose)",
                    "Partner preferences",
                ],
            },
            {
                type: "subheading",
                text: "5.3 Visible ONLY to Elite Members",
            },
            {
                type: "bullets",
                items: [
                    "Mobile / WhatsApp number",
                    "Email address",
                ],
            },
            {
                type: "subheading",
                text: "5.4 Never Visible to Other Users",
            },
            {
                type: "bullets",
                items: [
                    "Password hash",
                    "IP address and device data",
                    "Payment records",
                    `Internal moderation or fraud flags`,
                ],
            },
            {
                type: "italic",
                text: `
                You may further control your own visibility through profile privacy settings within your account dashboard.`,
            },
        ],
    },
    {
        title: "6. Special Category (Sensitive) Data",
        blocks: [
            {
                type: "paragraph",
                text: `The following data fields are classified as sensitive under applicable privacy frameworks and are processed with additional care:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    "Physical disability status",
                    "Caste (a category that can attract discrimination)",
                    "Religious beliefs",
                    "Health-related attributes (disability, body shape)",
                    "Family financial indicators (income range, parental occupation)",
                ],
            },
            {
                type: "paragraph",
                text: "We collect these only with your explicit, informed consent. You may choose not to disclose any sensitive category data, and the platform will still function, though matching accuracy may be reduced. You may also request deletion of sensitive category data at any time.",
            },
        ],
    },
    {
        title: "7. Data Sharing & Third Parties",
        blocks: [
            {
                type: "paragraph",
                text: `We do not sell, rent, or trade your personal data to any third party for commercial purposes. Data is shared only in the following circumstances:
                
                `,
            },
            {
                type: "subheading",
                text: "7.1 Registered Platform Users",
            },
            {
                type: "paragraph",
                text: "As described in Section 5, other registered users will see profile data according to the tiered visibility model. By registering on Inai you acknowledge and consent to this.",
            },
            {
                type: "subheading",
                text: "7.2 Service Providers (Data Processors)",
            },
            {
                type: "paragraph",
                text: "We engage trusted third-party processors who act under strict data processing agreements. These include:",
            },
            {
                type: "bullets",
                items: [
                    "Cloud hosting & infrastructure providers (e.g., servers, databases)",
                    "Payment gateway operators (PCI-DSS compliant — raw card data never reaches our servers)",
                    "Email delivery services (transactional emails)",
                    "SMS / OTP gateway providers (for mobile verification)",
                    "Analytics tools (using anonymised or aggregated data only)",
                ],
            },
            {
                type: "subheading",
                text: "7.3 Legal & Regulatory Disclosure",
            },
            {
                type: "paragraph",
                text: "We may disclose data when required by a valid court order, warrant, or request from law enforcement authorities in Sri Lanka or the user’s country of residence. We will notify you of such requests to the extent permitted by law.",
            },
            {
                type: "subheading",
                text: "7.4 Business Transfers",
            },
            {
                type: "paragraph",
                text: "In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity, who will be bound by terms no less protective than this Privacy Policy. You will be notified prior to any such transfer.",
            },
            {
                type: "subheading",
                text: "7.5 Safety of Others",
            },
            {
                type: "paragraph",
                text: "We may share data if we have a good-faith belief that disclosure is necessary to prevent imminent harm to a person or to protect the safety of our users and the public.",
            },
        ],
    },
    {
        title: "8. International Data Transfers",
        blocks: [
            {
                type: "paragraph",
                text: "Inai serves Sri Lankan Tamils worldwide including diaspora communities in countries such as India, the United Kingdom, Canada, Australia, France, Germany, and the UAE. Your data may be processed in countries other than your country of residence.",
            },
            {
                type: "paragraph",
                text: `
                Where data is transferred outside Sri Lanka, we ensure adequate safeguards are in place, including:`,
            },
            {
                type: "bullets",
                items: [
                    "Standard Contractual Clauses (SCCs) approved by the European Commission for transfers involving EU/EEA residents",
                    "UK International Data Transfer Agreements (IDTAs) for UK residents",
                    "Contractual obligations equivalent to GDPR protections for all other international transfers",
                ],
            },
            {
                type: "paragraph",
                text: `
                Users in the European Union, United Kingdom, and other jurisdictions with specific data protection laws retain all rights afforded to them by their local laws, including those described in Section 11 of this policy.`,
            },
        ],
    },
    {
        title: "9. Data Retention",
        blocks: [
            {
                type: "paragraph",
                text: `We retain your personal data for the following periods:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    "Active account: for the duration of your registration plus a 90-day grace period after account deactivation",
                    "Deleted account: profile data is purged within 30 days of a deletion request; anonymised statistical data may be retained indefinitely",
                    "Payment records: retained for 7 years to meet financial and tax obligations",
                    "Security logs and fraud-prevention records: up to 3 years",
                    "Backup copies: overwritten within 90 days of the original deletion",
                ],
            },
            {
                type: "paragraph",
                text: `
                You may request deletion of your account and all associated data at any time through the account settings or by emailing ${"privacy@inai.lk."}`,
            },
        ],
    },
    {
        title: "10. Data Security",
        blocks: [
            {
                type: "paragraph",
                text: `We implement industry-standard technical and organisational measures to protect your data
                
                `,
            },
            {
                type: "subheading",
                text: "10.1 Technical Safeguards",
            },
            {
                type: "bullets",
                items: [
                    "All data in transit encrypted via TLS 1.2 or higher (HTTPS enforced sitewide)",
                    "All data at rest encrypted using AES-256",
                    "Passwords stored as salted cryptographic hashes (bcrypt or Argon2)",
                    "Contact details stored in encrypted fields with decryption restricted to Elite Membership validation layer",
                    "Payment processed through PCI-DSS Level 1 certified payment gateways; no raw card data stored",
                    "Two-factor authentication (2FA) available for user accounts",
                    "Regular vulnerability scanning and penetration testing",
                ],
            },
            {
                type: "subheading",
                text: "10.2 Organisational Safeguards",
            },
            {
                type: "bullets",
                items: [
                    "Role-based access control — staff access to user data is limited to what is necessary for their function",
                    "All employees and contractors handling personal data are bound by confidentiality agreements",
                    "Data breach response plan in place",
                ],
            },
            {
                type: "subheading",
                text: "10.3 Breach Notification",
            },
            {
                type: "paragraph",
                text: `In the event of a data breach that poses a risk to your rights and freedoms, we will notify affected users within 72 hours of becoming aware of the breach (or within the timeframe required by applicable law), and will notify relevant regulatory authorities as required.`,
            },
        ],
    },
    {
        title: "11. Your Rights",
        blocks: [
            {
                type: "paragraph",
                text: `Depending on your country of residence you have the following rights regarding your personal data:`,
            },
            {
                type: "bullets",
                items: [
                    "Right of Access — request a copy of all personal data we hold about you",
                    "Right to Rectification — correct inaccurate or incomplete data",
                    "Right to Erasure (“Right to be Forgotten”) — request deletion of your account and data",
                    "Right to Restrict Processing — ask us to suspend processing in certain circumstances",
                    "Right to Data Portability — receive your data in a machine-readable format",
                    "Right to Object — object to processing based on legitimate interests",
                    "Right to Withdraw Consent — withdraw consent for sensitive data at any time",
                    "Right to Lodge a Complaint — with the relevant data protection authority in your country",
                ],
            },
            {
                type: "paragraph",
                text: `To exercise any of these rights, email privacy@inai.lk with the subject line “Privacy Rights Request” along with your registered email address. We will respond within 14 business days. We may ask you to verify your identity before processing your request.`,
            },
        ],
    },
    {
        title: "12. Children’s Privacy",
        blocks: [
            {
                type: "paragraph",
                text: `Inai is strictly a service for adults. You must be at least 18 years of age to register and use this platform. We do not knowingly collect personal data from persons under 18 years of age. If we become aware that a minor has registered, we will immediately suspend and delete that account and all associated data. If you believe a minor has registered on our platform, please report it immediately to privacy@inai.lk.`,
            },
        ],
    },
    {
        title: "13. User Responsibilities & Misuse Prevention",
        blocks: [
            {
                type: "paragraph",
                text: `By using Inai, you agree to the following:

                `,
            },
            {
                type: "bullets",
                items: [
                    "You will provide accurate, truthful, and up-to-date information in your profile",
                    "You will use contact details and other member data obtained through the platform solely for the purpose of exploring a matrimonial relationship",
                    "You will not use any data obtained from Inai for commercial solicitation, spamming, harassment, stalking, blackmail, fraud, or any illegal purpose",
                    "You will not copy, screenshot, or otherwise reproduce another member’s profile information for distribution outside the platform",
                    "You will not share your account credentials with any third party",
                ],
            },
            {
                type: "paragraph",
                text: `Violation of these responsibilities may result in immediate account suspension, reporting to law enforcement, and civil or criminal legal action. Inai reserves the right to report misuse of members’ data to appropriate authorities.`,
            },
        ],
    },
    {
        title: "14. Limitation of Platform Liability",
        blocks: [
            {
                type: "paragraph",
                text: `While Inai implements rigorous security and verification measures, we cannot guarantee that every user on the platform is who they claim to be, or that data will never be misused by another user. Inai’s liability is limited to actions within our direct control as a platform operator.`,
            },
            {
                type: "paragraph",
                text: "We are not liable for:",
            },
            {
                type: "bullets",
                items: [
                    "Misuse of your data by another user who obtained it through the platform in accordance with its intended use (e.g., an Elite Member contacting you)",
                    "Consequences arising from you voluntarily sharing additional personal information outside the platform directly with another user",
                    "Third-party websites linked from our platform",
                ],
            },
            {
                type: "paragraph",
                text: `If you experience any misuse or harassment, please report it immediately to abuse@inai.lk and, if necessary, to local law enforcement.`,
            },
        ],
    },
    {
        title: "15. Cookies & Tracking Technologies",
        blocks: [
            {
                type: "paragraph",
                text: "We use cookies and similar technologies to:",
            },
            {
                type: "bullets",
                items: [
                    "Maintain your login session",
                    "Remember your preferences",
                    "Analyse aggregate platform usage",
                    "Prevent fraud and enhance security",
                ],
            },
            {
                type: "paragraph",
                text: "We do not use third-party advertising cookies. You may control cookie preferences through your browser settings. Disabling certain cookies may impact platform functionality.",
            },
        ],
    },
    {
        title: "16. Elite Membership & Payments",
        blocks: [
            {
                type: "paragraph",
                text: "Payment for Elite Membership is processed by a PCI-DSS compliant third-party payment gateway. Inai does not store full credit/debit card numbers or CVV codes. We retain only:",
            },
            {
                type: "bullets",
                items: [
                    "Transaction ID",
                    "Membership tier and duration purchased",
                    "Amount paid and date of transaction",
                    "Billing name (as provided to the payment gateway)",
                ],
            },
            {
                type: "paragraph",
                text: "Membership is personal and non-transferable. Refund eligibility is governed by our Terms of Service.",
            },
        ],
    },
    {
        title: "17. Changes to This Privacy Policy",
        blocks: [
            {
                type: "paragraph",
                text: "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or platform features. When we make material changes, we will:",
            },
            {
                type: "bullets",
                items: [
                    "Post the updated policy on inai.lk/privacy with a revised “Last Updated” date",
                    "Send an email notification to all registered users",
                    "Display an in-app notification upon your next login",
                ],
            },
            {
                type: "paragraph",
                text: `Your continued use of the platform after the effective date of the updated policy constitutes your acceptance. If you do not agree with the changes, you may delete your account before the effective date.`,
            },
        ],
    },
    {
        title: "18. Governing Law & Jurisdiction",
        blocks: [
            {
                type: "paragraph",
                text: `This Privacy Policy is governed by and interpreted in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
For users resident in specific jurisdictions with mandatory data protection laws (including but not limited to EU GDPR, UK GDPR, Canadian PIPEDA, and Australian Privacy Act 1988), the protections afforded by those laws are additionally available to you to the extent they exceed the protections described in this policy.`,
            },
        ],
    },
    {
        title: "19. Additional Information for EU / UK Residents (GDPR / UK GDPR)",
        blocks: [
            {
                type: "paragraph",
                text: "If you are resident in the European Economic Area or the United Kingdom, the following additional provisions apply:",
            },
            {
                type: "bullets",
                items: [
                    "The legal bases for processing your data are as described in Section 3 above",
                    "You have the right to lodge a complaint with your local supervisory authority (e.g., the ICO in the UK, or your national DPA in the EU)",
                    "Where we transfer your data outside the EEA or UK, we rely on Standard Contractual Clauses or equivalent safeguards",
                    "We do not carry out automated decision-making that produces legal or similarly significant effects on you without human oversight",
                ],
            },
        ],
    },
    {
        title: "20. Grievance Redressal",
        blocks: [
            {
                type: "paragraph",
                text: "If you have any complaint or grievance regarding the collection, storage, use, or sharing of your personal data, you may contact our Grievance Officer:",
            },
            {
                type: "bullets",
                items: [
                    "Email: grievance@inai.lk",
                    "Response time: We aim to resolve all grievances within 30 calendar days.",
                ],
            },
            {
                type: "paragraph",
                text: "If you are not satisfied with our response, you may escalate to the relevant data protection authority in your country of residence.",
            },
        ],
    },
];

function renderBlock(block: ContentBlock): ReactNode {
    switch (block.type) {
        case "paragraph":
            return (
                <p className="whitespace-pre-line text-left font-16 font-normal leading-[150%] text-secondary3">
                    {block.text}
                </p>
            );
        case "italic":
            return (
                <p className="whitespace-pre-line italic text-left font-16 font-normal leading-[150%] text-secondary3">
                    {block.text}
                </p>
            );
        case "subheading":
            return (
                <div className="whitespace-pre-line text-left font-16 leading-[150%] text-secondary3 ">
                    {block.text}
                </div>
            );

        case "bullets":
            return (
                <ul className="list-disc pl-5 text-left font-16 font-normal leading-[150%] text-secondary3 space-y-0">
                    {block.items.map((item, index) => (
                        <li key={`${item}-${index}`} className="whitespace-pre-line">
                            {item}
                        </li>
                    ))}
                </ul>
            );
    }
}

function PolicySectionBlock({ title, blocks }: PolicySection) {
    return (
        <div className="flex flex-col justify-center border-b border-[#EAEAEA] py-4 sm:py-5 md:py-6">
            <h2 className="text-left font-18 font-medium leading-[150%] text-dark pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function PrivacyPolicy() {
    return (
        <div className="font-poppins mx-auto flex max-w-[910px] flex-col bg-white px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
                <div className="font-18 font-medium leading-[150%] text-dark">
                    INAI.LK
                </div>
                <div className="mt-1.5 font-16 font-normal leading-[150%] text-secondary3">
                    Tamil Matrimony — Connecting Hearts Worldwide
                </div>

                <div className="mt-1.5 flex w-full flex-col items-center text-center font-16 font-normal leading-[150%] text-secondary3">
                    {metaLines.map((item) => (
                        <div key={item.text}>{item.text}</div>
                    ))}
                </div>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 h-px w-full bg-[#EAEAEA]" />

            <div className="flex flex-col">
                {policySections.map((section) => (
                    <PolicySectionBlock
                        key={section.title}
                        title={section.title}
                        blocks={section.blocks}
                    />
                ))}
            </div>

            <div className="py-4 sm:py-5 md:py-6 border-b border-[#EAEAEA]">
                <h2 className="text-left font-18 font-medium leading-[150%] text-dark">
                    Acknowledgement
                </h2>
                <p className="mt-1.5 text-left font-16 font-normal leading-[150%] text-secondary3">
                    By using Inai, you acknowledge that you have read this Privacy Policy in
                    full, understand its contents, and agree to be bound by its terms.
                </p>

                <div className="mt-4 sm:mt-5 md:mt-6 flex flex-col gap-0 text-left font-16 font-normal leading-[150%] text-secondary3">
                    <div className="font-semibold italic">
                        Thank you for trusting Inai with your most personal journey.
                    </div>
                    <div className="italic">Every heart deserves a safe space to search.</div>
                    <div>— The Inai Team —</div>
                </div>
            </div>

            <div className="mt-4 md:mt-5">
                <div className="text-center font-16 font-normal leading-[150%] text-secondary3">
                    Inai.lk | A product of Ahken Nexus | Built by Ahkenlabs
                </div>
                <div className="text-center font-16 font-semibold leading-[150%] text-secondary3">
                    www.inai.lk | privacy@inai.lk
                </div>
            </div>
        </div>
    );
}