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
        type: "Red_paragraph";
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
        type: "alert";
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
    { text: "contact@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const TermsSections: PolicySection[] = [
    {
        title: "1. Introduction",
        blocks: [
            {
                type: "paragraph",
                text: `Welcome to Inai ("inai.lk", "we", "us", "our", or the "Platform"). Inai is a Tamil matrimony platform dedicated to helping Sri Lankan Tamils and diaspora Tamil communities worldwide find compatible life partners who share their culture, values, and aspirations for the future.
Inai is operated by Ahken Nexus and built and maintained by Ahkenlabs (ahkenlabs.com). The Platform is accessible via the website inai.lk, any associated mobile applications, and all related services and features. These Terms and Conditions ("Terms") are a legally binding contract between you ("User", "you", "your") and Inai. They govern your access to and use of the Platform in its entirety.
 `,
            },
            {
                type: "alert",
                text: `PLEASE READ THESE TERMS CAREFULLY BEFORE REGISTERING. BY CREATING AN ACCOUNT OR USING ANY PART OF INAI, YOU CONFIRM THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO BE BOUND BY THESE TERMS IN FULL. IF YOU DO NOT AGREE, PLEASE DO NOT USE INAI.`,
            },
            {
                type: "paragraph",
                text: `These Terms must be read together with our Privacy Policy, which is incorporated by reference and forms a binding part of this agreement.`
            },
        ],
    },
    {
        title: "2. Definitions",
        blocks: [
            {
                type: "paragraph",
                text: `In these Terms, the following definitions apply:`,
            },
            {
                type: "bullets",
                items: [
                    `"Platform" means the website inai.lk, its subdomains, associated mobile applications, and all features, content, and services made available through them.`,
                    `"User" means any individual who registers for, accesses, or uses the Platform.`,
                    `"Profile" means the personal page created by a User, containing personal details, photographs, and partner preferences.`,
                    `"Interest" means a formal, in-platform expression of matrimonial interest sent by one User to another using the Platform's Interest feature.`,
                    `"Reminder" means a single follow-up Interest notification sent to a User who has not responded to an original Interest within 48 hours.`,
                    `"Match" means a successful two-way connection established when a receiving User accepts an Interest or Reminder sent to them.`,
                    `"Rejection" means a User's explicit refusal of an Interest or Reminder, or the platform-level outcome that removes a User from another User's visible profiles after rejection.`,
                    `"Elite Membership" means the paid subscription tier granting access to Contact Details and other premium features.`,
                    `"Free User" means a registered User who has not subscribed to an Elite Membership.`,
                    `"Contact Details" means a User's WhatsApp number and email address as submitted during profile creation.`,
                    `"Content" means any text, photographs, or other material submitted by a User to the Platform.`,
                    `"Auto-Renewal" means the automatic renewal of an Elite Membership subscription at the end of a billing period, unless cancelled.`,
                    `"One-Time Payment" means a single, non-recurring Elite Membership purchase for a fixed period.`,
                    `"Ahken Nexus" means the parent company that owns and operates Inai.`,
                    `"Ahkenlabs" means the technology partner responsible for designing, building, and maintaining the Platform.`,
                ],
            },
        ],
    },
    {
        title: "3. Eligibility",
        blocks: [
            {
                type: "paragraph",
                text: "We collect data in the following categories when you register, build a profile, and use the platform:",
            },
            {
                type: "bullets",
                items: [
                    "You are at least 18 years of age.",
                    "You are a Tamil individual of Sri Lankan heritage, or a member of the global Tamil diaspora community, genuinely seeking a matrimonial or life partnership.",
                    "You are legally unmarried, or are divorced or widowed, and are eligible to marry under the laws of your country of residence.",
                    "You have full legal capacity to enter into a binding agreement.",
                    "You are not subject to any court order or legal restriction preventing your use of the Platform.",
                    "You have not previously been permanently suspended or banned from Inai.",
                    "By registering, you represent and warrant that all the above conditions are met. Providing false information to gain access constitutes a material breach of these Terms and will result in immediate account termination and may be reported to relevant authorities.",
                ],
            },
            {
                type: "italic",
                text: `Inai is strictly a matrimony platform. Use of the Platform for casual dating, solicitation, or any purpose other than seeking a genuine life partner is prohibited.`,
            },
        ],
    },
    {
        title: "4. How Inai Works",
        blocks: [
            {
                type: "paragraph",
                text: `This section explains the core mechanics of the Inai platform from registration to match. Understanding how the Platform works is essential before you use it.

                `,
            },
            {
                type: "subheading",
                text: "4.1. Step 1 — Create Your Profile",
            },
            {
                type: "paragraph",
                text: `To begin, you create a personal Profile by providing accurate information about yourself. This includes personal details (name, age, gender, location, citizenship), educational and professional background, physical attributes, cultural and religious identity, family background, lifestyle habits, and your partner preferences.
                You must also upload at least one clear, recent photograph of yourself that shows your face. Profile photographs must not include images of other individuals without their consent.
All information you submit must be truthful, accurate, and current. You are solely responsible for the completeness and accuracy of your Profile.
                
`,
            },
            {
                type: "subheading",
                text: "4.1. Step 1 — Create Your Profile",
            },
            {
                type: "paragraph",
                text: `After creating your Profile, you must complete two verification steps before your Profile becomes visible to other Users:
 `,
            },
            {
                type: "bullets",
                items: [
                    "Mobile Number Verification: A one-time password (OTP) is sent to the mobile number you provide. You must enter this OTP to verify ownership of that number.",
                    "Email Address Verification: A verification link is sent to the email address you provide. You must click this link to confirm your email."
                ],
            },
            {
                type: "paragraph",
                text: `Both verifications must be completed. Unverified Profiles are not displayed to other Users and cannot send Interests or use any matching features.
                
                `,
            },
            {
                type: "subheading",
                text: "4.3. Step 3 — Browse & Discover Profiles",
            },
            {
                type: "paragraph",
                text: `Once verified, you can browse Profiles of other verified Users. By default, you will see Profiles of Users of the opposite gender. You can refine who you see by setting and adjusting your Partner Preferences, which may include criteria such as age range, height, education, religion, caste, and location.
                Profiles are shown according to the tiered visibility model described in our Privacy Policy. Some profile details (such as Contact Details) are accessible only to Elite Members.
 
                `,
            },
            {
                type: "subheading",
                text: "4.4. Step 4 — Send an Interest",
            },
            {
                type: "paragraph",
                text: `If you are interested in a User's Profile, you may send them an Interest using the in-platform Interest button. An Interest is a formal, respectful expression of matrimonial interest. It is not a message and does not reveal your Contact Details.
                The receiving User will be notified of your Interest and can choose to Accept, Decline, or take no action. 
`,
            },
            {
                type: "Red_paragraph",
                text: `Important: Sending an Interest does not grant you access to the other User's Contact Details. Contact Details are only accessible to Elite Members after a successful Match.
             
                `,
            },

            {
                type: "subheading",
                text: "4.5. Step 5 — The 48-Hour Reminder Rule",
            },
            {
                type: "paragraph",
                text: `If the receiving User has not responded to your Interest within 48 hours, you may send them one Reminder. A Reminder is a single, polite follow-up notification.
                Rules governing the Reminder feature:
 `,
            },
            {
                type: "bullets",
                items: [
                    "You may send a maximum of one (1) Reminder per Interest sent.",
                    "A Reminder may only be sent after a minimum of 48 hours have passed since the original Interest was sent.",
                    "The Reminder feature is available to Elite Members only. Free Users may send Interests but cannot send Reminders.",
                    'Sending multiple follow-up messages or attempting to contact a User who has not responded through other means is a violation of these Terms.'
                ],
            },
            {
                type: "subheading",
                text: `
                4.6.  Step 6 — Acceptance, Match & Contact`
            },
            {
                type: 'paragraph',
                text: `If the receiving User accepts your Interest or Reminder, a Match is established. A Match means both parties have expressed genuine mutual interest in exploring a matrimonial connection.
                Upon a successful Match:`
            },
            {
                type: "bullets",
                items: [
                    "Both Users are notified of the Match.",
                    "If you are an Elite Member, you will be able to view the matched User's Contact Details (WhatsApp number and email address).",
                    "If you are a Free User at the time of the Match, you must upgrade to Elite Membership to access Contact Details.",
                    "Contact Details are provided solely for the purpose of pursuing a matrimonial relationship. Any other use is strictly prohibited.",
                ],
            },

            {
                type: "subheading",
                text: `
                4.7  Step 7 — Rejection & Profile Visibility`
            },
            {
                type: 'paragraph',
                text: `If a User declines your Interest or Reminder, the following applies:`
            },
            {
                type: "bullets",
                items: [
                    "You will be notified that your Interest was not accepted.",
                    "The declining User's Profile will no longer be visible to you on the Platform.",
                    "You may not send another Interest or attempt to re-contact that User through any Platform feature.",
                    "Attempting to circumvent this restriction — for example, by creating a new account to re-contact a User who has declined your Interest — is a serious violation of these Terms and will result in permanent account suspension.",
                ],
            },
            {
                type: 'paragraph',
                text: `The same rules apply symmetrically: if you decline an Interest sent to you by another User, that User's Profile will no longer appear in your browsing results, and they will be prevented from sending you further Interests.`
            },

        ],
    },
    {
        title: "5. Account Registration & Profile",
        blocks: [
            {
                type: "subheading",
                text: "5.1  Accurate Information"
            },
            {
                type: "paragraph",
                text: `All information you provide during registration and in your Profile must be truthful, accurate, complete, and current. You must update your Profile promptly if any information changes.
                
               `
            },
            {
                type: "subheading",
                text: "5.2  One Account Per Person"
            },
            {
                type: "paragraph",
                text: `Each individual may maintain only one active account at any time. Creating duplicate or multiple accounts — for any reason, including circumventing a suspension or rejection — is a material breach of these Terms.
                
                `
            },
            {
                type: "subheading",
                text: "5.3  Profiles Created by Family Members"
            },
            {
                type: "paragraph",
                text: `Where a Profile is created by a parent, sibling, relative, or guardian on behalf of an eligible individual, the person creating the Profile confirms that: (a) they have the full, informed consent of the individual whose Profile is being created; (b) the individual is aware of and agrees to these Terms; and (c) all information submitted is accurate to the best of their knowledge.
        
                `
            },
            {
                type: "subheading",
                text: "5.4  Account Security"
            },
            {
                type: "paragraph",
                text: `You are responsible for keeping your login credentials confidential. You must not share your username or password with any third party. You must notify us immediately at support@inai.lk if you believe your account has been accessed without your authorisation. Inai is not liable for any loss arising from your failure to maintain account security.       
                
                `
            },
            {
                type: "subheading",
                text: "5.5  Profile Photographs"
            },
            {
                type: "paragraph",
                text: `Profile photographs must: (a) be recent and a true likeness of you; (b) clearly show your face; (c) not include images of other individuals without their explicit consent; and (d) not include offensive, provocative, or inappropriate content. Inai reserves the right to remove photographs that do not meet these standards.                
                `
            },
        ],
    },
    {
        title: "6. Elite Membership & Payments",
        blocks: [
            {
                type: "subheading",
                text: "6.1  What Elite Membership Provides"
            },
            {
                type: "paragraph",
                text: `Elite Membership is Inai's premium subscription tier. Elite Members receive the following benefits in addition to standard free features:`
            },
            {
                type: "bullets",
                items: [
                    `Access to Contact Details (WhatsApp number and email address) of matched Users.`,
                    `The ability to send a Reminder to a User who has not responded to an Interest within 48 hours.`,
                    `Enhanced profile visibility and priority placement in browsing results.`,
                    `Access to advanced search and matching filters.`,
                    `Any additional premium features introduced by Inai from time to time, as announced on the Platform.`
                ],
            },
            {
                type: "subheading",
                text: `
6.3  Payment Options: Auto-Renewal vs One-Time
`
            },
            {
                type: "subheading",
                text: `
6.3.1  Auto-Renewal`
            },
            {
                type: "paragraph",
                text: `If you choose the Auto-Renewal option, your Elite Membership will automatically renew at the end of each billing period (2 months, 3 months, or 6 months, as applicable) for the same duration at the then-current price. The renewal charge will be applied to your saved payment method.
You will receive a reminder notification at least 7 days before each renewal. You may cancel Auto-Renewal at any time before the next renewal date through your account settings. Cancellation takes effect at the end of the current billing period; you will not be refunded for the remaining days of an already-billed period.     
                `
            },
            {
                type: "subheading",
                text: `
                6.3.2  One-Time Payment`
            },
            {
                type: "paragraph",
                text: `If you choose One-Time Payment, you will be charged once for the selected plan duration. Your Elite Membership will be active for that period and will not automatically renew. You will be notified before your membership expires and given the option to renew manually.`
            },
            {
                type: "subheading",
                text: `
                6.4  Payment Processing`
            },
            {
                type: "paragraph",
                text: `All payments are processed by a third-party, PCI-DSS Level 1 compliant payment gateway. Inai does not store your full credit or debit card number, CVV, or PIN. By making a payment, you also agree to the payment gateway's own terms and conditions. Inai retains only your transaction ID, membership tier and duration, amount paid, date of purchase, and billing name for record-keeping purposes.`
            },
            {
                type: "subheading",
                text: `
                6.5  Taxes`
            },
            {
                type: "paragraph",
                text: `All displayed prices are exclusive of applicable taxes unless otherwise stated. You are responsible for any value-added tax, goods and services tax, withholding tax, or other levies applicable to your purchase under the laws of your country of residence.`
            },
            {
                type: "subheading",
                text: `
                6.6  Refund Policy`
            },
            {
                type: "paragraph",
                text: `Inai's refund policy for Elite Membership is as follows:`
            },
            {
                type: "bullets",
                items: [
                    `Full refund: If you have not used any Elite-exclusive feature (i.e., you have not viewed any Contact Details and have not sent any interest or reminder) within 48 hours of purchase, you may request a full refund by emailing support@inai.lk.`,
                    `No refund once features are used: Once you have accessed any Elite-exclusive feature — including viewing any User's Contact Details or sending a Reminder — no refund is available for that billing period, regardless of the remaining duration.`,
                    `Cancellation of Auto-Renewal: Cancelling Auto-Renewal does not entitle you to a refund for the current billing period. Membership remains active until the end of the paid period.`,
                    `Account suspension for breach: If your account is suspended or terminated due to a violation of these Terms, no refund will be issued for any unused portion of a paid Elite Membership.`,
                    `Platform discontinuation: If Inai permanently discontinues the Elite Membership service or ceases operations, a pro-rata refund for any unused paid period will be provided.`
                ],
            },
        ],
    },
    {
        title: "7. Data Collection & Privacy",
        blocks: [
            {
                type: "paragraph",
                text: `When you create a Profile on Inai, you provide us with detailed personal information. This is necessary for the Platform to function and to help you find a compatible partner. The categories of data we collect include:`
            },
            {
                type: "bullets",
                items: [
                    `Identity & contact: name, age, gender, mobile number (including WhatsApp), email address, citizenship, city of residence, and city of birth.`,
                    `Physical attributes: height, weight, body shape, and voluntary disclosure of any disability status.`,
                    `Education & profession: educational qualification, job title, industry/sector, and income range.`,
                    `Cultural & religious identity: religion and caste (both voluntary).`,
                    `Lifestyle: eating habits, drinking habits, and smoking habits.`,
                    `Family background: father's occupation, mother's occupation, number of brothers and sisters, and who created the Profile (self, parent, sibling, or guardian).`,
                    `Partner preferences: your desired criteria for a partner, including age range, location, religion, and other attributes you specify.`,
                    `All data collection and processing is governed in full by our Privacy Policy, available at inai.lk/privacy. The Privacy Policy is incorporated into these Terms by reference. By accepting these Terms, you accept the Privacy Policy.`,
                    `Key privacy commitments relevant to these Terms:`,
                    `Your Contact Details (WhatsApp and email) are never visible to Free Users. They are visible only to Elite Members and only after a successful Match, subject to your privacy settings.`,
                    `Sensitive data (religion, caste, disability status) is processed with your explicit consent. You may withhold this data, though doing so may reduce matching accuracy.`,
                    `Inai does not sell your personal data to any third party.`,
                    `You may request correction or deletion of your data at any time by contacting privacy@inai.lk.`,
                ],
            },
        ],
    },
    {
        title: "8. Acceptable Use Policy",
        blocks: [
            {
                type: "paragraph",
                text: `You agree to use Inai only for its intended purpose: finding a life partner respectfully and honestly. The following conduct is strictly prohibited.`
            },
            {
                type: "subheading",
                text: `
                8.1  Prohibited Profile & Content`
            },
            {
                type: "bullets",
                items: [
                    `Submitting false, misleading, or fraudulent profile information.`,
                    `Using photographs that are not of you, are heavily filtered, or misrepresent your appearance.`,
                    `Uploading photographs of other individuals without their explicit consent.`,
                    `Uploading photographs of minors under any circumstances.`,
                    `Sharing defamatory, obscene, offensive, or discriminatory content.`
                ],
            },
            {
                type: "subheading",
                text: `
                8.2  Prohibited Conduct Towards Other Users`
            },
            {
                type: "bullets",
                items: [
                    `Harassing, threatening, intimidating, or abusing any other User through any channel.`,
                    `Using another User's Contact Details, obtained through the Platform, for commercial solicitation, spamming, scamming, blackmail, or any purpose other than pursuing a matrimonial relationship.`,
                    `Copying, screenshotting, recording, or distributing another User's Profile information outside the Platform.`,
                    `Soliciting money, financial assistance, gifts, or personal favours from other Users.`,
                    `Attempting to contact a User who has declined your Interest, by any method including creating a new account.`,
                    `Engaging in or facilitating any form of fraud, including romance scams.`,
                    `Registering on the Platform while currently married.`
                ],
            },
            {
                type: "subheading",
                text: `
               8.3  Prohibited Commercial & Platform Misuse`
            },
            {
                type: "bullets",
                items: [
                    `Using the Platform to advertise services, sell products, or conduct any commercial activity.`,
                    `Creating accounts on behalf of others without their explicit knowledge and consent.`,
                    `Using automated bots, scripts, or crawlers to interact with the Platform.`,
                    `Attempting to scrape, reverse-engineer, or extract data from the Platform by any means.`,
                    `Attempting to gain unauthorised access to any part of the Platform, its servers, or databases.`,
                    `Introducing malware, viruses, or any harmful code into the Platform.`,
                    `Circumventing any security, verification, or access-control mechanism on the Platform.`,
                    `Inai monitors the Platform for violations of this Policy and will take action including account suspension, permanent banning, removal of content, and referral to law enforcement where appropriate.`
                ],
            },
        ],
    },
    {
        title: "9. User Content & Intellectual Property",
        blocks: [
            {
                type: "subheading",
                text: "9.1  Your Content"
            },
            {
                type: "paragraph",
                text: `You retain ownership of the Content you upload to Inai, including your Profile photographs and personal information. By submitting Content to the Platform, you grant Inai a non-exclusive, royalty-free, worldwide licence to use, store, display, and process that Content solely for the purpose of operating the Platform and providing the services described in these Terms. This licence ends when you delete the Content or close your account, subject to the retention periods in our Privacy Policy.
                
                `
            },
            {
                type: "subheading",
                text: "9.2  Content Standards"
            },
            {
                type: "paragraph",
                text: `All Content you submit must comply with the Acceptable Use Policy in Section 8, must be Content you own or have the right to share, and must not infringe the intellectual property, privacy, or other legal rights of any third party.
                
                `
            },
            {
                type: "subheading",
                text: "9.3  Inai's Intellectual Property"
            },
            {
                type: "paragraph",
                text: `All intellectual property in the Platform itself — including the Inai brand, name, logo, website design, software, matching algorithms, and original written content — is the property of Ahken Nexus or is licensed to it. You may not use, copy, reproduce, modify, or distribute any part of Inai's intellectual property without prior written permission from Ahken Nexus.
                
                `
            },
            {
                type: "subheading",
                text: "9.4  Content Removal"
            },
            {
                type: "paragraph",
                text: `Inai reserves the right to remove any Content that violates these Terms, our community standards, or applicable law, without prior notice. Repeated violations may result in account termination.`
            },
        ],
    },
    {
        title: "10. User Safety & Reporting",
        blocks: [
            {
                type: "subheading",
                text: "10.1  Our Commitment"
            },
            {
                type: "paragraph",
                text: `The safety and wellbeing of our Users is a priority at Inai. We implement identity verification (mobile OTP and email confirmation), a Contact Details gating system, and a post-Match contact model to reduce the risk of unsolicited contact and misuse. Despite these measures, no online platform can guarantee the authenticity of every user or prevent all misuse, and you should always exercise personal caution.
                
                `
            },
            {
                type: "subheading",
                text: "10.2  Your Safety Responsibility"
            },
            {
                type: "paragraph",
                text: `When engaging with other Users, whether on or off the Platform, we strongly encourage you to:`
            },
            {
                type: "bullets",
                items: [
                    `Meet for the first time only in a public place.`,
                    `Inform a trusted family member or friend of your plans before meeting anyone in person.`,
                    `Never share financial information or transfer money to someone you have not met in person and established trust with over time.`,
                    `Trust your instincts. If something feels wrong or too good to be true, proceed with caution and seek advice from family or trusted friends.`,
                ],
            },
            {
                type: "subheading",
                text: `
                10.3  Reporting Abuse or Fraud`
            },
            {
                type: "paragraph",
                text: `If you encounter any User who is behaving inappropriately, misusing data, or conducting any form of fraud or harassment, please report them immediately by:`
            },
            {
                type: "bullets",
                items: [
                    `Using the in-platform "Report" button available on every Profile and Match.`,
                    `Emailing abuse@inai.lk with a clear description of the incident.`
                ],
            },
            {
                type: "paragraph",
                text: `Inai will investigate all reports promptly and take appropriate action, which may include immediate Profile suspension, permanent banning, and referral to law enforcement.
                
                `
            },
            {
                type: "subheading",
                text: "10.4  No Liability for User Conduct"
            },
            {
                type: "paragraph",
                text: `Inai is a platform that facilitates introductions between consenting adults seeking matrimonial partnerships. We are not a party to, and are not responsible for, any interaction, communication, relationship, or event that occurs between Users, whether through the Platform or beyond it. Any decision to engage with, meet, or enter a relationship with another User is made entirely at your own risk.`
            },
        ],
    },
    {
        title: "11. Account Suspension & Termination",
        blocks: [
            {
                type: "subheading",
                text: "11.1  Termination by You"
            },
            {
                type: "paragraph",
                text: `You may delete your account at any time through your account settings or by emailing support@inai.lk. Account deletion removes your Profile from the Platform immediately. Data retention after deletion is governed by our Privacy Policy. Paid Elite Membership fees are subject to the refund policy in Section 6.6.
                
                `
            },
            {
                type: "subheading",
                text: "11.2  Suspension or Termination by Inai"
            },
            {
                type: "paragraph",
                text: `Inai may suspend your account temporarily or terminate it permanently, with or without prior notice, for any of the following reasons:`
            },
            {
                type: "bullets",
                items: [
                    `Breach of any provision of these Terms.`,
                    `Providing false, misleading, or fraudulent information in your Profile or during registration.`,
                    `Attempting to contact a User who has declined your Interest.`,
                    `Creating multiple accounts.`,
                    `Abusive, harassing, or threatening behaviour toward any User or Inai staff.`,
                    `Using the Platform for commercial, non-matrimonial, or fraudulent purposes.`,
                    `Being the subject of credible, substantiated complaints from other Users.`,
                    `A legal obligation requiring us to do so.

`
                ],
            },
            {
                type: "subheading",
                text: "11.3  Consequences of Termination"
            },
            {
                type: "paragraph",
                text: `Upon termination of your account:`
            },

            {
                type: "bullets",
                items: [
                    `Your Profile is immediately deactivated and becomes invisible to all other Users.`,
                    `Any active Elite Membership may be forfeited without refund if termination is due to a breach of these Terms.`,
                    `If your account was terminated for a breach, you may not re-register without prior written approval from Inai.`,
                    `Your data is retained for the periods specified in the Privacy Policy before deletion.`
                ],
            },
        ],
    },
    {
        title: "12. Disclaimers",
        blocks: [
            {
                type: "subheading",
                text: "12.1  No Guarantee of a Match"
            },
            {
                type: "paragraph",
                text: `Inai makes no representation, warranty, or guarantee that use of the Platform will result in a match, relationship, marriage, or any other outcome. Inai is a tool for facilitating introductions. The outcome of any connection made through the Platform is entirely beyond Inai's control and responsibility.
                
                `
            },
            {
                type: "subheading",
                text: "12.2  No Verification of Profile Accuracy"
            },
            {
                type: "paragraph",
                text: `Inai verifies only that a User controls the mobile number and email address associated with their account. We do not independently verify the accuracy of any other Profile information, including name, age, employment, education, marital status, or photographs. Users are responsible for conducting their own due diligence before progressing any relationship.
                
                `
            },
            {
                type: "subheading",
                text: "12.3  Platform Availability"
            },
            {
                type: "paragraph",
                text: `Inai aims to maintain consistent Platform availability but does not guarantee uninterrupted, error-free access. Scheduled maintenance, upgrades, or events beyond our control may result in temporary unavailability. Inai is not liable for any loss arising from periods of unavailability.
                
                `
            },
            {
                type: "subheading",
                text: "12.4  Third-Party Links & Services"
            },
            {
                type: "paragraph",
                text: `The Platform may include links to third-party websites or services. These links are provided for convenience only. Inai has no control over third-party content and accepts no responsibility for it. Accessing third-party sites is entirely at your own risk.`
            },
        ],
    },
    {
        title: "13. Limitation of Liability",
        blocks: [
            {
                type: "paragraph",
                text: `To the fullest extent permitted by applicable law:`
            },
            {
                type: "bullets",
                items: [
                    `Inai's total liability to you for any claim arising out of or in connection with these Terms or your use of the Platform shall not exceed the total fees you paid to Inai in the twelve (12) months immediately preceding the event giving rise to the claim.`,
                    `Inai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profit, loss of data, loss of goodwill, emotional distress, or reputational harm, even if Inai was advised of the possibility of such damages.`,
                    `Inai shall not be liable for any harm arising from your voluntary disclosure of personal information to another User, whether on or off the Platform.`,
                    `Inai shall not be liable for misuse of your data by another User who accessed it legitimately through the Platform's intended features (e.g., an Elite Member viewing your Contact Details after a Match).`,
                    `Inai shall not be liable for any act or omission by a third-party service provider, including payment gateways, SMS providers, email services, or hosting infrastructure.`
                ],
            },
            {
                type: "paragraph",
                text: `Nothing in these Terms excludes or limits liability that cannot be excluded or limited by law, including liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation.`
            },
        ],
    },
    {
        title: "14. Indemnification",
        blocks: [
            {
                type: "paragraph",
                text: `You agree to indemnify, defend, and hold harmless Inai, Ahken Nexus, Ahkenlabs, and their respective officers, directors, employees, agents, and partners from and against all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising from or related to:`
            },
            {
                type: "bullets",
                items: [
                    `Your breach of any provision of these Terms.`,
                    `Your violation of any applicable law, regulation, or third-party right.`,
                    `Any Content you upload or submit to the Platform.`,
                    `Your conduct toward other Users, whether on or off the Platform.`,
                    `Any misrepresentation you make to other Users or to Inai.`
                ],
            },
        ],
    },
    {
        title: "15. Modifications to the Platform & These Terms",
        blocks: [
            {
                type: "subheading",
                text: "15.1  Platform Changes"
            },
            {
                type: "paragraph",
                text: `Inai reserves the right to add, modify, suspend, or discontinue any feature or aspect of the Platform at any time. Where a feature tied to a paid subscription is discontinued, a pro-rata credit or refund will be provided for the affected period.
                
                `
            },
            {
                type: "subheading",
                text: "15.2  Changes to These Terms"
            },
            {
                type: "paragraph",
                text: `Inai may update these Terms at any time to reflect changes in the Platform, our practices, or applicable law. When material changes are made, we will:`
            },
            {
                type: "bullets",
                items: [
                    `Post the updated Terms at inai.lk/terms with a revised "Last Updated" date.`,
                    `Send an email notification to all registered Users at least 14 days before the new Terms take effect.`,
                    `Display a prominent in-app notification the next time you log in.`
                ],
            },
            {
                type: "paragraph",
                text: `Your continued use of the Platform after the effective date of the updated Terms constitutes your acceptance. If you do not agree with any changes, you must stop using the Platform and may delete your account before the effective date.`
            },
        ],
    },
    {
        title: "16. Governing Law & Dispute Resolution",
        blocks: [
            {
                type: "subheading",
                text: "16.1  Governing Law"
            },
            {
                type: "paragraph",
                text: `These Terms are governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka, without regard to its conflict of law provisions.
                
                `
            },
            {
                type: "subheading",
                text: "16.2  Jurisdiction"
            },
            {
                type: "paragraph",
                text: `Any dispute arising out of or in connection with these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Sri Lanka. Users resident in other jurisdictions who hold mandatory statutory rights under their local law retain those rights. These Terms do not seek to exclude any such rights.
                
                `
            },
            {
                type: "subheading",
                text: "16.3  Informal Resolution First"
            },
            {
                type: "paragraph",
                text: `Before commencing any formal legal proceedings, you agree to first contact Inai at legal@inai.lk and attempt to resolve the dispute informally. Inai will respond within 14 business days and will make reasonable efforts to reach a fair resolution.
                
                `
            },
            {
                type: "subheading",
                text: "16.4  EU / UK Users"
            },
            {
                type: "paragraph",
                text: `If you are resident in the European Union or United Kingdom and are dissatisfied with Inai's response to your complaint, you may refer your complaint to an approved Alternative Dispute Resolution (ADR) provider or to the relevant national online dispute resolution platform.`
            },
            {
                type: "bullets",
                items: [
                ],
            },
        ],
    },
    {
        title: "17. General Provisions",
        blocks: [
            {
                type: "subheading",
                text: "17.1  Entire Agreement"
            },
            {
                type: "paragraph",
                text: `These Terms, together with the Privacy Policy, constitute the entire agreement between you and Inai with respect to your use of the Platform. They supersede all prior agreements, representations, or understandings.
                
                `
            },
            {
                type: "subheading",
                text: "17.2  Severability"
            },
            {
                type: "paragraph",
                text: `If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction, that provision will be severed, and the remaining provisions will continue in full force and effect.
                
                `
            },
            {
                type: "subheading",
                text: "17.3  No Waiver"
            },
            {
                type: "paragraph",
                text: `Inai's failure to enforce any right or provision of these Terms on any occasion shall not constitute a waiver of that right or provision.
                
                `
            },
            {
                type: "subheading",
                text: "17.4  Assignment"
            },
            {
                type: "paragraph",
                text: `You may not assign or transfer your rights or obligations under these Terms without Inai's prior written consent. Inai may assign these Terms to a successor entity in the event of a merger, acquisition, or sale of assets, with prior notice to Users.
                
                `
            },
            {
                type: "subheading",
                text: "17.5  Force Majeure"
            },
            {
                type: "paragraph",
                text: `Inai shall not be liable for any failure or delay in performance caused by circumstances beyond our reasonable control, including but not limited to natural disasters, acts of government, internet infrastructure failures, civil unrest, or acts of war.
                
                `
            },
            {
                type: "subheading",
                text: "17.6  Language"
            },
            {
                type: "paragraph",
                text: `These Terms are written in English. In the event of a conflict between the English version and any translation provided for convenience, the English version shall prevail.
                
                `
            },
            {
                type: "subheading",
                text: "17.7  Children's Safety"
            },
            {
                type: "paragraph",
                text: `Inai is strictly for adults aged 18 and above. We do not knowingly collect data from or permit registration by persons under 18. If we discover that a minor has registered, we will immediately suspend the account and delete all associated data. Reports of suspected minor registrations should be sent to privacy@inai.lk.
                
                `
            },
        ],
    },
    {
        title: "18. Contact Information",
        blocks: [
            {
                type: "paragraph",
                text: `For any queries, concerns, or notices relating to these Terms, please use the appropriate contact below:
                
                `
            },
            {
                type: "paragraph",
                text: `General Support: support@inai.lk`
            },
            {
                type: "paragraph",
                text: `Legal & Terms: connect@inai.lk`
            },
            {
                type: "paragraph",
                text: `Privacy & Data: privacy@inai.lk`
            },
            {
                type: "paragraph",
                text: `Abuse & Safety: connect@inai.lk`
            },
            {
                type: "paragraph",
                text: `Billing & Payments: connect@inai.lk`
            },
            {
                type: "paragraph",
                text: `
                Website: www.inai.lk`
            },
            {
                type: "paragraph",
                text: `Parent Company: Ahken Nexus (Pvt) Ltd`
            },
            {
                type: "paragraph",
                text: `Technology Partner: Ahkenlabs (ahkenlabs.com)
                
                `
            },
        ],
    },
];

function renderBlock(block: ContentBlock): ReactNode {
    switch (block.type) {
        case "paragraph":
            return (
                <p className="whitespace-pre-line text-left text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    {block.text}
                </p>
            );
        case "Red_paragraph":
            return (
                <p className="whitespace-pre-line text-left text-[14px] md:text-[16px] font-normal leading-[150%] text-[#B31B38]">
                    {block.text}
                </p>
            );
        case "italic":
            return (
                <p className="whitespace-pre-line italic text-left text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    {block.text}
                </p>
            );
        case "subheading":
            return (
                <div className="whitespace-pre-line font-medium text-left text-[14px] md:text-[16px] leading-[150%] text-secondary3 ">
                    {block.text}
                </div>
            );

        case "bullets":
            return (
                <ul className="list-disc pl-5 text-left text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3 space-y-0">
                    {block.items.map((item, index) => (
                        <li key={`${item}-${index}`} className="whitespace-pre-line">
                            {item}
                        </li>
                    ))}
                </ul>
            );
        case "alert":
            return (
                <div className="p-3 md:p-4 bg-[#F2F2F2] my-1 md:my-1.5 rounded-[8px] whitespace-pre-line uppercase text-left text-[14px] md:text-[16px] leading-[150%] text-[#B31B38] ">
                    {block.text}
                </div>
            );
    }
}

function TermsSectionBlock({ title, blocks }: PolicySection) {
    return (
        <div className="flex flex-col justify-center border-b border-[#EAEAEA] py-4 sm:py-5 md:py-6">
            <h2 className="text-left text-[16px] md:text-[18px] font-medium leading-[150%] text-dark pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function Terms() {
    return (
        <div className="font-poppins mx-auto flex max-w-[910px] flex-col bg-white px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
                <div className="text-[16px] md:text-[18px] font-medium leading-[150%] text-dark">
                    INAI.LK
                </div>
                <div className="mt-1.5 text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    Tamil Matrimony — Connecting Hearts Worldwide
                </div>

                <div className="mt-1.5 flex w-full flex-col items-center text-center text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    {metaLines.map((item) => (
                        <div key={item.text}>{item.text}</div>
                    ))}
                </div>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6 h-px w-full bg-[#EAEAEA]" />

            <div className="flex flex-col">
                {TermsSections.map((section) => (
                    <TermsSectionBlock
                        key={section.title}
                        title={section.title}
                        blocks={section.blocks}
                    />
                ))}
            </div>

            <div className="mt-4 md:mt-5">
                <div className="text-center flex-col flex text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    <span>By using Inai, you agree to these Terms.</span>
                    <span>We are honoured to be part of your journey.</span>
                    <span>— The Inai Team —</span>
                </div>
            </div>

            <div className="border-b border-[#EAEAEA] mt-5 md:mt-6" />

            <div className="mt-4 md:mt-5">
                <div className="text-center flex-col flex text-[14px] md:text-[16px] font-normal leading-[150%] text-secondary3">
                    <span>Inai.lk  |  A product of Ahken Nexus  |  Built by Ahkenlabs</span>
                    <span className="underline font-medium">www.inai.lk  |  privacy@inai.lk</span>
                </div>
            </div>
            <div className="border-b border-[#EAEAEA] mt-5 md:mt-6" />
        </div>
    );
}