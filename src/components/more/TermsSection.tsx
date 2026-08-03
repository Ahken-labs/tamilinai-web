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
    { text: "Effective Date: 8th August 2025" },
    { text: "Last Updated: 8th August 2025" },
    { text: "Version 1.1" },
    { text: "www.inai.lk" },
    { text: "connect@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const TermsSections: PolicySection[] = [
    {
        title: "1. AGREEMENT",
        blocks: [
            {
                type: "paragraph",
                text: `These Terms govern your use of inai.lk and all related services (the "Platform"), operated by Ahken Nexus (Pvt) Ltd, registered in Sri Lanka under number PV 00324108, registered office 247/1, Uthayanagar west, Kilinochchi, Sri Lanka ("INAI", "we", "us").
 
                `,
            },
            {
                type: "paragraph",
                text: `By creating an account, publishing an advertisement, or placing an order you agree to these Terms. If you do not agree, do not use the Platform.`
            },
        ],
    },
    {
        title: "2. WHAT INAI IS — AND WHAT IT IS NOT",
        blocks: [
            {
                type: "paragraph",
                text: `INAI is an advertising and directory platform for the wedding and event industry. We provide the technical means for users to create, publish and promote advertisements, and we sell customised invitation card design and printing.
                
                `,
            },
            {
                type: "paragraph",
                text: `INAI is not:
                `,
            },
            {
                type: "bullets",
                items: [
                    `a matrimonial agency, marriage bureau, matchmaking service, or introduction agency;`,
                    `a broker, agent or intermediary between any two users;`,
                    `a party to any agreement formed between a user and a vendor, or between two individuals.`,
                ],
            },
        ],
    },
    {
        title: "3. ELIGIBILITY",
        blocks: [
            {
                type: "paragraph",
                text: `You must be at least 18 years old and legally able to enter contracts. By using the Platform you confirm you meet these conditions and that all information you provide is true and your own (or lawfully provided on behalf of another — see clause 5).
                
                `
            },
            {
                type: "paragraph",
                text: `We may refuse, suspend or remove any account at our discretion where these Terms are breached.
                `
            },
        ],
    },
    {
        title: "4. ACCOUNTS",
        blocks: [
            {
                type: "paragraph",
                text: `You are responsible for keeping your login credentials secure and for all activity under your account. Notify us immediately at support@inai.lk if you suspect unauthorised access. One person or business may hold one account unless we agree otherwise in writing.
                `,
            },
        ],
    },
    {
        title: "5. ADVERTISEMENTS PUBLISHED ON BEHALF OF ANOTHER PERSON",
        blocks: [
            {
                type: "paragraph",
                text: `If you publish a proposal advertisement about someone else, you warrant that: 
               `
            },
            {
                type: "bullets",
                items: [
                    `the person is 18 or over;`,
                    `you have their permission to publish the information;`,
                    `you have given them our Privacy Policy;`,
                    `the information is accurate.`,
                ],
            },
            {
                type: "paragraph",
                text: `
                We will send a verification request to that person's WhatsApp number before publication. If the person the advertisement is about asks us to amend or remove it, we will do so — regardless of who created or paid for it, and without refund.`
            },
    
        ],
    },
    {
        title: "6. YOUR CONTENT",
        blocks: [
            {
                type: "paragraph",
                text: `6.1 Ownership. You keep ownership of everything you upload.
                
                `
            },
            {
                type: "paragraph",
                text: `6.2 Licence to us. You grant INAI a worldwide, non-exclusive, royalty-free licence to host, store, reproduce, adapt (for formatting and resizing only), publish and display your content on the Platform and in our own promotion of the Platform, for as long as your content is published and for a reasonable period afterwards in archives and caches. This licence ends when your content is removed, except for copies retained in backups or as required by law.
                
                `
            },
            {
                type: "paragraph",
                text: `6.3 Your warranties. You warrant that you own or have permission to use all content you upload, including photographs, logos and portfolio images, and that it does not infringe anyone's rights.
                
                `
            },
            {
                type: "paragraph",
                text: `6.4 Accuracy. You are solely responsible for the truth of your content. Publishing false information about qualifications, income, marital status, age or business credentials is a serious breach of these Terms. 
                `
            },
        ],
    },
    {
        title: "7. PROHIBITED CONTENT AND CONDUCT",
        blocks: [
            {
                type: "paragraph",
                text: `You must not publish or do any of the following:
                
                `
            },
            {
                type: "bullets",
                items: [
                    `Impersonation — using another person's identity, photographs or business name.
                    `,
                    `False credentials — fabricated qualifications, certifications, awards or registrations.
                    `,
                    `Content involving minors — any advertisement concerning a person under 18. This will be removed immediately and reported to the authorities where required.
                    `,
                    `Dowry demands. Any advertisement that requests, offers, demands or negotiates dowry, bride price, or a payment or property transfer as a condition is strictly prohibited and will be removed without refund. This applies regardless of where you are located. (This clause protects both users and INAI given the platform's international Tamil audience.)
                    `,
                    `Fraud and financial solicitation — asking other users for money, loans, gifts, cryptocurrency, gift cards or investment; any advance-fee, romance or visa-related scam.
                    `,
                    `Immigration fraud — offering or seeking a convenience for visa, residency or citizenship purposes.
                    `,
                    `Harassment and hate — abuse, threats, stalking, sexual harassment, or content inciting hatred or violence on grounds of caste, religion, ethnicity, disability, gender or sexual orientation.
                    `,
                    `Discriminatory abuse — while users may state a preference in their own advertisement, content that demeans or attacks any caste, religion or community is prohibited.
                    `,
                    `Adult or explicit content, or content unsuitable for a general audience.
                    `,
                    `Scraping, bulk extraction, or automated harvesting of user data or contact details from the Platform. This includes copying listings for a competing directory.
                    `,
                    `Circumvention — attempting to bypass paywalls, contact-reveal charges, or usage limits.
                    `,
                    `Off-platform solicitation by vendors to avoid platform fees on leads generated through INAI.
                    `,
                    `Malware, security testing, or interference with the Platform's operation.
                    `,
                    `Unlawful content of any kind under Sri Lankan law or the law of your own country.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `    
                Enforcement. We may remove content, suspend or terminate accounts, retain fees paid, and report matters to law enforcement. No refund is due where content is removed or an account terminated for breach of this clause.`
            },
        ],
    },
    {
        title: "8. MODERATION",
        blocks: [
            {
                type: "paragraph",
                text: `We review advertisements before publication where practical, but review is not a guarantee of accuracy or legality. We may reject, edit, reclassify or remove any advertisement at our discretion, including where it breaches these Terms, is misleading, is of poor quality, or is duplicated.
                
                `
            },
            {
                type: "paragraph",
                text: `You are charged only when your advertisement is published. Your payment method is authorised at checkout and charged at the moment of publication. If your advertisement is not published — whether because you withdraw it, or because we decline it — the authorisation is released and no charge is made to your card.

                `
            },
            {
                type: "paragraph",
                text: `If we decline an advertisement for a reason other than a breach of clause 7, we will work with you to amend it so that it can be published. Once published, all fees are non-refundable — see the Refund and Cancellation Policy in full.
                `
            },
        ],
    },
    {
        title: "9. PAID SERVICES AND PAYMENT",
        blocks: [
            {
                type: "paragraph",
                text: `9.1 Services. Paid services include business listing plans, listing boosts and featured placement, proposal advertisement publication and contact reveal, promoted proposal placement, and invitation card design and printing.

                `
            },
            {
                type: "paragraph",
                text: `9.2 Prices. Prices are displayed at the point of purchase, in LKR for Sri Lankan customers and in the applicable currency for international customers. Prices may differ by region. Prices are inclusive of applicable taxes unless stated otherwise.
                
                `
            },
            {
                type: "paragraph",
                text: `9.3 Payment. Processed by our third-party providers. You warrant that you are authorised to use the payment method.
                
                `
            },
            {
                type: "paragraph",
                text: `9.4 Auto-renewal. Subscription plans renew automatically at the end of each period unless cancelled at least [48 hours] beforehand in your account settings. We will email you [7] days before each renewal. Cancelling stops future charges; it does not refund the current period.
                
                `
            },
            {
                type: "paragraph",
                text: `9.5 Failed payment. If a payment fails, we may suspend your listing until it is resolved.
                
                `
            },
            {
                type: "paragraph",
                text: `9.6 Chargebacks. If you raise a chargeback without first contacting us, we may suspend your account pending resolution and recover any resulting fees.
                `
            },
        ],
    },
    {
        title: "10. INVITATION CARD DESIGN AND PRINTING",
        blocks: [
            {
                type: "paragraph",
                text: `10.1 Design slot. Booking a design slot secures designer time. The design fee is non-refundable once design work begins and is credited in full against your final print order.
  
                `
            },
            {
                type: "paragraph",
                text: `10.2 Revisions. Your booking includes 3 rounds of revisions. Further revisions are charged at 500LKR.
                
                `
            },
            {
                type: "paragraph",
                text: `10.3 Proof approval. You must approve a final digital proof in writing before printing. You are responsible for checking all names, dates, times, venues, spelling and language on the proof. Once approved, we print exactly what was approved. We are not liable for errors present in an approved proof, and reprints due to such errors are chargeable in full.  
                
                `
            },
            {
                type: "paragraph",
                text: `10.4 Quantities and pricing. The final price depends on design complexity, card stock, finish, quantity and delivery. Your quotation is valid for [14] days.
  
                `
            },
            {
                type: "paragraph",
                text: `10.5 Bespoke goods. Printed cards are made to your personal specification and are not returnable or refundable once printing has begun, except where defective. This reflects the customised nature of the goods.  
                
                `
            },
            {
                type: "paragraph",
                text: `10.6 Defects. Report printing defects, damage or quantity shortfalls within [7] days of delivery, with photographs. Verified defects will be reprinted free or refunded at our option.
  
                `
            },
            {
                type: "paragraph",
                text: `10.7 Delivery. Delivery dates are estimates. We are not liable for delays caused by couriers, customs, or events outside our control. Order well ahead of your event. For time-critical orders, confirm the schedule with us in writing before booking.
  
                `
            },
            {
                type: "paragraph",
                text: `10.8 Colour. Printed colours may vary slightly from screen display. This is inherent to printing and is not a defect.   
                `
            },
        ],
    },
    {
        title: "11. NO LIABILITY FOR DEALINGS BETWEEN USERS",
        blocks: [
            {
                type: "paragraph",
                text: `Any contract, arrangement, relationship, marriage or dispute between users, or between a user and a vendor, is entirely between those parties. INAI is not a party to it.
                
                `
            },
            {
                type: "paragraph",
                text: `We are not liable for: the conduct, honesty, character, identity, marital status, health, criminal history, immigration status, solvency or qualifications of any user or vendor; the quality, timeliness or safety of services booked through a vendor found on the Platform; any loss, fraud, deception, emotional distress, physical harm, or financial loss arising from contact made through the Platform; or the outcome of any relationship.
                
                `
            },
            {
                type: "paragraph",
                text: `Meet safely. Meet in public places, tell someone where you are going, verify identity independently, and never send money to someone you have met through the Platform.
                `
            },
        ],
    },
    {
        title: "12. VENDOR OBLIGATIONS",
        blocks: [
            {
                type: "paragraph",
                text: `If you list a business or freelance service, you additionally warrant that:
                
                `
            },
            {
                type: "bullets",
                items: [
                    `you hold all licences, registrations and insurance required for your trade;
                    `,
                    ` your portfolio images are of your own work, or you have permission to display them;
                    `,
                    `your pricing and availability information is accurate and kept current;
                    `,
                    `you will respond to enquiries received through the Platform within 3 working days;
                    `,
                    `you will honour quoted prices for the stated validity period;
                    `,
                    `you will handle any customer personal data you receive lawfully, use it only to respond to that enquiry, and not add it to marketing lists without consent.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                Repeated complaints, non-response to leads, or misuse of customer data may result in removal without refund.
                `
            },
        ],
    },
    {
        title: "13. INTELLECTUAL PROPERTY",
        blocks: [
            {
                type: "paragraph",
                text: `The Platform, its design, software, database, INAI branding and all content we create are owned by INAI or our licensors. You may not copy, reproduce, reverse-engineer, or create derivative works from it. You may not extract or reuse any substantial part of our database.
                
                `
            },
            {
                type: "paragraph",
                text: `Infringement claims. If you believe content on the Platform infringes your rights, email support@inai.lk with details of the work, the URL, and a statement of your ownership. We will investigate and remove infringing content.
                `
            },
        ],
    },
    {
        title: "14. AVAILABILITY",
        blocks: [
            {
                type: "paragraph",
                text: `We aim to keep the Platform available but do not guarantee uninterrupted service. We may suspend access for maintenance, upgrades, or for reasons outside our control. We do not offer service credits for downtime. Where a paid listing is unavailable for a continuous period exceeding [72 hours] due to our fault, we will extend the listing period by the affected duration.
                `
            },
        ],
    },
    {
        title: "15. LIMITATION OF LIABILITY",
        blocks: [
            {
                type: "paragraph",
                text: `Nothing in these Terms excludes liability for death or personal injury caused by our negligence, for fraud, or for any liability that cannot lawfully be excluded. 
                
                `
            },
            {
                type: "paragraph",
                text: `Subject to that:
                `
            },
            {
                type: "bullets",
                items: [
                    `The Platform is provided "as is" without warranties of any kind, express or implied.
                    `,
                    `We are not liable for indirect, consequential, special or punitive loss; loss of profit, business, goodwill, opportunity or data; or emotional distress.
                    `,
                    `Our total aggregate liability to you for all claims in any 12-month period is limited to the total amount you paid to INAI in the 12 months before the claim arose, or LKR [10,000], whichever is greater.
                    `
                ],
            },
        ],
    },
    {
        title: "16. INDEMNITY",
        blocks: [
            {
                type: "paragraph",
                text: `You agree to indemnify INAI against claims, losses, damages and reasonable legal costs arising from your content, your breach of these Terms, or your dealings with another user or vendor.  
                `
            },
        ],
    },
    {
        title: "17. SUSPENSION AND TERMINATION",
        blocks: [
            {
                type: "paragraph",
                text: `By you: delete your account at any time from your settings. Deletion does not entitle you to a refund of fees paid.
                
                `
            },
            {
                type: "paragraph",
                text: `By us: we may suspend or terminate your account with notice, or immediately without notice for a serious breach of clause 7, for fraud, or where required by law. Where termination is for breach, no refund is due.
                
                `
            },
            {
                type: "paragraph",
                text: `On termination: your right to use the Platform ends; your advertisements are removed; clauses 6.2 (residual licence), 11, 13, 15, 16, 18 and 19 survive.
                `
            },
        ],
    },
    {
        title: "18. COMPLAINTS AND DISPUTES",
        blocks: [
            {
                type: "paragraph",
                text: `Step 1. Contact support@inai.lk. We aim to acknowledge within [2] working days and resolve within [14] working days.
                `
            },
            {
                type: "paragraph",
                text: `Step 2. If unresolved, escalate to support@inai.lk for review by a senior member of our team.
                `
            },
            {
                type: "paragraph",
                text: `Step 3. If still unresolved, the dispute may be referred to [mediation / arbitration in Colombo / the courts of Sri Lanka].
                `
            },
        ],
    },
    {
        title: "19. GENERAL",
        blocks: [
            {
                type: "paragraph",
                text: `19.1 Governing law. These Terms are governed by the laws of Sri Lanka. The courts of Sri Lanka have exclusive jurisdiction, save that if you are a consumer resident in another country, you retain any right to bring proceedings in the courts of your own country where the law of that country gives you that right, and you retain the benefit of any mandatory consumer protection provisions of that country's law.
                
                `
            },
            {
                type: "paragraph",
                text: `19.2 Changes. We may amend these Terms. Material changes will be notified at least [14] days in advance by email or WhatsApp. Continued use after the effective date is acceptance. If you do not accept a change, stop using the Platform and contact us.
                
                `
            },
            {
                type: "paragraph",
                text: `19.3 Severability. If any provision is held unenforceable, the rest remains in force.
                
                `
            },

            {
                type: "paragraph",
                text: `19.4 No waiver. Failure to enforce a provision is not a waiver of it.
  
                `
            },
            {
                type: "paragraph",
                text: `19.5 Assignment. You may not assign these Terms. We may assign them in connection with a merger, acquisition or restructuring.
                
                `
            },
            {
                type: "paragraph",
                text: `19.6 Entire agreement. These Terms, together with the Privacy Policy and the Refund and Cancellation Policy, form the entire agreement between us.
                
                `
            },
            {
                type: "paragraph",
                text: `19.7 Force majeure. We are not liable for failure to perform caused by events beyond our reasonable control, including natural disasters, power or internet failure, civil unrest, epidemic, or governmental action.
                
                `
            },
            {
                type: "paragraph",
                text: `19.8 Language. These Terms are published in English and Tamil. In the event of any conflict, the English version prevails.
                `
            },
        ],
    },
    {
        title: "20. CONTACT",
        blocks: [
            {
                type: "paragraph",
                text: `Ahken Nexus (Pvt) Ltd,
                `
            },
            {
                type: "paragraph",
                text: `247/1, Uthayanagar west, Kilinochchi, Sri Lanka
                `
            },
            {
                type: "paragraph",
                text: `
                Email: support@inai.lk`
            },
            {
                type: "paragraph",
                text: `WhatsApp: +94 770 750 760`
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
        case "Red_paragraph":
            return (
                <p className="whitespace-pre-line text-left font-16 font-normal leading-[150%] text-[#B31B38]">
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
                <div className="whitespace-pre-line font-medium text-left font-16 leading-[150%] text-secondary3 ">
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
        case "alert":
            return (
                <div className="p-3 md:p-4 bg-[#F2F2F2] my-1 md:my-1.5 rounded-[8px] whitespace-pre-line uppercase text-left font-16 leading-[150%] text-[#B31B38] ">
                    {block.text}
                </div>
            );
    }
}

function TermsSectionBlock({ title, blocks }: PolicySection) {
    return (
        <div className="flex flex-col justify-center py-4 sm:py-5 md:py-6">
            <h2 className="text-left text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[150%] text-[#767676] pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function Terms() {
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
                {TermsSections.map((section) => (
                    <TermsSectionBlock
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