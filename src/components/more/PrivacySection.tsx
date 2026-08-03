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
    { text: "Effective Date: 8th August 2025" },
    { text: "Last Updated: 8th August 2025" },
    { text: "Version 1.1" },
    { text: "www.inai.lk" },
    { text: "connect@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const policySections: PolicySection[] = [
    {
        title: "1. WHO WE ARE",
        blocks: [
            {
                type: "paragraph",
                text: `INAI ("INAI", "we", "us", "our") operates the website inai.lk and associated services (the "Platform").
                
                `,
            },
            {
                type: "paragraph",
                text: `Legal entity: Ahken Nexus (Pvt) Ltd
                `,
            },
            {
                type: "paragraph",
                text: `Company registration number: PV 00324108
                `,
            },
            {
                type: "paragraph",
                text: `Registered address: 247/1, Uthayanagar west, Kilinochchi, Sri Lanka
                `,
            },
            {
                type: "paragraph",
                text: `Privacy contact: privacy@inai.lk
                
                `,
            },
            {
                type: "paragraph",
                text: `We are the data controller for personal data processed through the Platform.
                `,
            },
        ],
    },
    {
        title: "2. WHAT INAI IS",
        blocks: [
            {
                type: "paragraph",
                text: `INAI is an advertising and directory platform for the wedding and event industry. We publish:

                `,
            },
            {
                type: "bullets",
                items: [
                    `Business listings — profiles and service listings for wedding vendors, freelancers and event businesses.
                    `,
                    `Personal advertisements  submitted by individuals or their family members.
                    `,
                    `Invitation card design and printing services — customised wedding and event stationery.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                We publish advertisements. We are not a matchmaking service, marriage broker, or introduction agency. We do not select, recommend, screen or vouch for any person or business advertised on the Platform. See our Terms and Conditions for the full position.
                `,
            },
            {
                type: "paragraph",
                text: `
                This does not change our responsibilities under data protection law: we remain a controller of the personal data we hold, and this policy explains how we handle it.
                `,
            },
        ],
    },
    {
        title: "3. THE PERSONAL DATA WE COLLECT",
        blocks: [
            {
                type: "paragraph",
                text: `3.1 Account data (required to register)   
                `,
            },
            {
                type: "bullets",
                items: [
                    ` Name: To identify your account
                    `,
                    `WhatsApp / mobile number: Account verification, service notifications, login
                    `,
                    `Email address: Account recovery, receipts, service notices
                    `,
                    `Gender: Required to categorise and display advertisements
                    `,
                    `Year of birth: To confirm you are 18+ and categorise advertisements
                    `,
                    `City of residence: To display and filter advertisements by location
                    `,
                ],
            },
            {
                type: "paragraph",
                text: `
                3.2 Advertisement data — personal proposals
                `,
            },
            {
                type: "paragraph",
                text: `Provided when you choose to publish a proposal advertisement. Some fields are required to publish; others are optional. Optional fields are shown as optional in the form. Leaving them blank will not prevent your advertisement from being published.
                
                `,
            },
            {
                type: "paragraph",
                text: `3.3 Advertisement data — business and freelancer listings
                `,
            },
            {
                type: "paragraph",
                text: `Business or trading name, contact person, WhatsApp and telephone numbers, business email, business address and service areas, business registration number (where provided), certifications and qualifications, awards and achievements, portfolio images, service descriptions and pricing. Business listing information is published for a commercial purpose and is treated as public.
                
                `,
            },

            {
                type: "paragraph",
                text: `3.4 Transaction data
                `,
            },
            {
                type: "paragraph",
                text: `Order records, listing and boost purchases, invoice history, and card design and print order specifications. We do not store your full card number, CVV, or bank credentials. Card payments are processed by our payment providers. We receive only a transaction reference, the amount, the outcome, and the last four digits of the card.
                
                `,
            },
            {
                type: "paragraph",
                text: `3.5 Technical data
                `,
            },
            {
                type: "paragraph",
                text: `To operate the Platform securely we automatically process:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `IP address — for security, fraud prevention, bot detection, abuse investigation, and to determine your approximate country for currency and field-visibility purposes. Retained in server and security logs for [30–90] days, then deleted. We do not use IP addresses for advertising or profiling, and we do not sell them.
                    `,
                    `Browser type, device type, operating system, and pages viewed — for aggregate analytics and to fix faults.
                    `,
                    `Cookies and similar technologies — see section 10.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `3.6 Data we do not collect
                `,
            },
            {
                type: "paragraph",
                text: `We do not collect precise GPS or device-level location data, and we do not collect persistent device identifiers or device fingerprints.
                `,
            },
        ],
    },
    {
        title: "4. SENSITIVE PERSONAL DATA",
        blocks: [
            {
                type: "paragraph",
                text: `Some information you may choose to provide is sensitive personal data requiring heightened protection:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `Religion
                    `,
                    `Caste or community
                    `,
                    `Disability or health status
                    `,
                    `Dietary habits, where these reveal religious or philosophical belief
                    
                    `
                ],
            },
            {
                type: "paragraph",
                text: `Our rules for this data:
                `,
            },
            {
                type: "bullets",
                items: [
                    `Every sensitive field is optional. You can publish a complete advertisement without any of them.
                    `,
                    `We rely on your explicit, separate consent. You will be asked to tick a specific consent box before any sensitive field is published. This consent is separate from accepting our Terms and Conditions.
                    `,
                    `You control visibility. For each sensitive field you may choose: publicly visible, visible only to logged-in users, or stored but hidden.
                    `,
                    `We never disclose sensitive data to third-party advertisers or data partners in any form that identifies you.
                    `,
                    `You may withdraw consent at any time and we will remove the field from publication. Withdrawal does not affect the lawfulness of processing before withdrawal.
                    `,
                    `Regional restrictions. Where a field is restricted by law in your country, we may disable it. In particular, the caste field is hidden by default for users accessing the Platform from the United Kingdom and the European Economic Area.
                    `
                ],
            },
        ],
    },
    {
        title: "5. ADVERTISEMENTS CREATED ON BEHALF OF ANOTHER PERSON",
        blocks: [
            {
                type: "paragraph",
                text: `Where you create an advertisement for another person — for example a parent creating a proposal for a son or daughter — you must confirm that:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `the person is 18 years of age or older;
                    `,
                    `they have given you permission to publish their information;
                    `,
                    `you will give them a copy of this Privacy Policy.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                We will send a verification message to the WhatsApp number of the person advertised before the advertisement is published. If they do not confirm, we will not publish it.
                `,
            },
            {
                type: "paragraph",
                text: `
                The person advertised has the same rights over their data as any other user and may contact us directly to amend, hide or delete the advertisement, regardless of who created or paid for it. We will always honour a removal request from the person the advertisement is about.
                `,
            },
        ],
    },
    {
        title: "6. WHY WE PROCESS YOUR DATA, AND OUR LEGAL BASIS",
        blocks: [
            {
                type: "bullets",
                items: [
                    `Creating and managing your account: Performance of a contract
                    `,
                    `Publishing your advertisement or listing: Performance of a contract
                    `,
                    `Publishing sensitive fields (religion, caste, disability): Explicit consent
                    `,
                    `Taking payment and issuing receipts: Performance of a contract; legal obligation
                    `,
                    `Sending service messages about your account or order: Performance of a contract
                    `,
                    `Sending marketing messages: Consent (opt-in; withdrawable)
                    `,
                    `Passing your enquiry to a vendor you selected: Consent
                    `,
                    `Fraud prevention, security and abuse investigation: Legitimate interests; legal obligation
                    `,
                    `Aggregate analytics to improve the Platform: Legitimate interests
                    `,
                    `Responding to lawful requests from authorities: Legal obligation
                    `
                ],
            },
        ],
    },
    {
        title: "7. WHO WE SHARE DATA WITH",
        blocks: [
            {
                type: "paragraph",
                text: `We share personal data only in the categories below. We do not sell your personal data.
                
                `,
            },
            {
                type: "paragraph",
                text: `7.1 Publicly, on the Platform. The content of your advertisement or business listing is published on the Platform and is visible to visitors and search engines. Only the fields you have chosen to make visible are published. Do not include information in your advertisement that you are not willing to make public.
                
                `,
            },
            {
                type: "paragraph",
                text: `7.2 Service providers (processors) acting on our instructions. Hosting and cloud infrastructure; payment processors; WhatsApp/SMS and email delivery providers; analytics providers; print production partners for card orders. Each is bound by contract to process data only as instructed and to keep it secure.
                
                `,
            },
            {
                type: "paragraph",
                text: `7.3 Vendors you have chosen to contact. If you submit an enquiry, request a quote, or tick a box asking to be contacted by vendors in a category, we pass the specific information needed to answer that enquiry (typically your name, WhatsApp number, event date, city and requirements) to the vendors concerned. This happens only where you have actively asked for it. We tell you which vendors will receive it before you submit. You can withdraw from this at any time in your account settings.
                
                `,
            },
            {
                type: "paragraph",
                text: `7.4 Legal and safety disclosures. Where required by law, court order or a lawful request from an authority; or where necessary to investigate fraud, scams, threats or serious misuse of the Platform.

                `,
            },
            {
                type: "paragraph",
                text: `7.5 Business transfer. If INAI is sold, merged or restructured, data may transfer to the acquirer, who will remain bound by this policy or give you notice of any change.
                
                `,
            },
            {
                type: "paragraph",
                text: `Note on the original business brief: the original model proposed that INAI "may share all user data with our partners or third-party companies." A blanket clause of that kind would not be a valid basis for disclosure under the Sri Lankan PDPA or the GDPR, and would be particularly problematic for religion, caste and disability data. The structure above achieves the underlying commercial goal — vendor access to interested customers — through consented enquiry routing and aggregate, non-identifying audience reporting. This is a more durable commercial asset than a one-off data sale, and it is defensible to a regulator.
                
                `,
            },
            {
                type: "paragraph",
                text: `7.6 Aggregate and non-identifying reporting. We may share statistics with advertisers and partners — for example, the number of users searching a category in a given district, or age distributions across the Platform. These reports never identify an individual and cannot be reversed to do so.
                `,
            },
        ],
    },
    {
        title: "8. INTERNATIONAL TRANSFERS",
        blocks: [
            {
                type: "paragraph",
                text: `INAI is based in Sri Lanka. Our service providers may be located in other countries, including the United States and within the EEA. Where we transfer personal data outside Sri Lanka or outside the EEA/UK, we rely on appropriate safeguards including standard contractual clauses with our providers.
                `
            },
            {
                type: "paragraph",
                text: `If you use the Platform from outside Sri Lanka, your data will be transferred to and processed in Sri Lanka.
                `
            },
        ],
    },
    {
        title: "9. HOW LONG WE KEEP DATA",
        blocks: [
            {
                type: "bullets",
                items: [
                    `Active account and profile data: While your account is active
                    `,
                    `Data after account deletion: Deleted or anonymised within 30 days
                    `,
                    `Expired advertisements: Removed from public view on expiry; deleted after 3 months unless renewed
                    `,
                    `Transaction and invoice records: 6/7 years — required for tax and accounting law
                    `,
                    `Security and IP logs: 30–90 days
                    `,
                    `Records relating to fraud, scams or serious abuse: Up to 5 years, to prevent repeat offending
                    `,
                    `Marketing consent records: Until withdrawn, plus 2 years as proof of consent
                    `
                ],
            },
        ],
    },
    {
        title: "10. COOKIES",
        blocks: [
            {
                type: "paragraph",
                text: `We use:
                `,
            },
            {
                type: "bullets",
                items: [
                    `Essential cookies — login sessions, security, fraud prevention. These cannot be switched off.
                    `,
                    `Analytics cookies — to understand how the Platform is used, in aggregate. Set only with your consent.
                    `,
                    `Functional cookies — remembering language and currency preference.
                    `,
                ],
            },
            {
                type: "paragraph",
                text: `
                We do not use third-party advertising or cross-site tracking cookies. You can manage your preferences via the cookie banner or your browser settings.`,
            },
        ],
    },
    {
        title: "11. YOUR RIGHTS",
        blocks: [
            {
                type: "paragraph",
                text: `Subject to the conditions and exceptions in applicable law, you have the right to:
                `,
            },
            {
                type: "bullets",
                items: [
                    `Access — obtain a copy of the personal data we hold about you.
                    `,
                    `Rectification — correct inaccurate or incomplete data.
                    `,
                    `Erasure — ask us to delete your data.
                    `,
                    `Withdraw consent — at any time, for anything based on consent.
                    `,
                    `Object — to processing based on legitimate interests, and to direct marketing at any time.
                    `,
                    `Restriction — ask us to pause processing while a dispute is resolved.
                    `,
                    `Portability — receive your data in a structured, machine-readable format.
                    `,
                    `Review of automated decisions — where a decision is made about you solely by automated means.
                    `,
                ],
            },
            {
                type: "paragraph",
                text: `
                How to exercise them: email privacy@inai.lk from the email address on your account, or use the tools in your account settings.
                
                `,
            },
            {
                type: "paragraph",
                text: `Our response time: within 3 working days, and in any event within one month. We may extend this for complex requests and will tell you if we do. We do not charge a fee unless a request is manifestly unfounded or excessive.
                
                `,
            },
            {
                type: "paragraph",
                text: `Complaints. If you are unhappy with our response, contact us first at privacy@inai.lk. You may also complain to the Data Protection Authority of Sri Lanka (dpa.gov.lk). If you are in the EEA or UK, you may complain to your national supervisory authority.
                `,
            },
        ],
    },
    {
        title: "12. SECURITY",
        blocks: [
            {
                type: "paragraph",
                text: `We protect your data using encryption in transit (HTTPS/TLS), encryption of sensitive fields at rest, role-based access controls limiting staff access to what their job requires, access logging, and regular backups.
                
                `,
            },
            {
                type: "paragraph",
                text: `No system is completely secure. If a breach occurs that is likely to result in a risk to your rights, we will notify the Data Protection Authority and, where the risk is high, notify you directly without undue delay.
                `,
            },
        ],
    },
    {
        title: "13. AGE RESTRICTION",
        blocks: [
            {
                type: "paragraph",
                text: `The Platform is for adults aged 18 and over. We do not knowingly collect data from anyone under 18. If we learn that we hold data on a person under 18, we will delete it and remove any associated advertisement immediately. Report concerns to privacy@inai.lk.
                `,
            },
        ],
    },
    {
        title: "14. YOUR SAFETY ON THE PLATFORM",
        blocks: [
            {
                type: "paragraph",
                text: `We publish advertisements; we do not verify the truthfulness of what advertisers say about themselves. Please be careful when sharing personal information with people you meet through the Platform.
                
                `,
            },
            {
                type: "paragraph",
                text: `Never send money to a person you have met through an advertisement. Report suspicious behaviour to support@inai.lk.
                `,
            },
        ],
    },
    {
        title: "15. CHANGES TO THIS POLICY",
        blocks: [
            {
                type: "paragraph",
                text: `We may update this policy. If we make a material change — particularly one affecting how we share data — we will notify you by email or WhatsApp at least 14 days before it takes effect. Where a change requires your consent, we will ask for it separately.
                `,
            },
        ],
    },
    {
        title: "16. CONTACT",
        blocks: [
            {
                type: "paragraph",
                text: `Ahken Nexus (Pvt) Ltd
                `,
            },
            {
                type: "paragraph",
                text: `247/1, Uthayanagar west, Kilinochchi, Sri Lanka
                
                `,
            },
            {
                type: "paragraph",
                text: `Email: privacy@inai.lk
                `,
            },
            {
                type: "paragraph",
                text: `Support: support@inai.lk
                `,
            },
            {
                type: "paragraph",
                text: `WhatsApp: +94 770 750 760
                `,
            },
            {
                type: "paragraph",
                text: `Website: inai.lk
                `,
            },
        ],
    },
];

function renderBlock(block: ContentBlock): ReactNode {
    switch (block.type) {
        case "paragraph":
            return (
                <p className="whitespace-pre-line text-left font-16 font-normal leading-[150%] text-[#767676]">
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
        <div className="flex flex-col justify-center py-4 sm:py-5 md:py-6">
            <h2 className="text-left text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[150%] text-[#767676] pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function PrivacyPolicy() {
    return (
        <div className="font-poppins mx-auto flex max-w-[910px] flex-col bg-white">
            <div className="flex flex-col items-center text-center">
                <div className="text-[16px] sm:text-[17px] md:text-[18px] font-medium leading-[150%] text-dark">
                    INAI.LK
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
            <div className="mt-2 border-t border-[#EAEAEA]" />
            <div className="mt-6">
                <div className="text-center flex-col flex font-16 font-normal leading-[150%] text-secondary3">
                    <span>Inai.lk  |  A product of Ahken Nexus | Built by Ahkenlabs</span>
                    <div className="font-medium"><span className="underline">www.inai.lk</span> |  <span className="underline">privacy@inai.lk</span></div>
                </div>
            </div>
            <div className="border-b border-[#EAEAEA] mt-6" />
        </div>
    );
}