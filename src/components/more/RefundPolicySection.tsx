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
        type: "alert_black";
        text: string;
    }
    | {
        type: "space";
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
    { text: "support@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const RefundPolicySections: PolicySection[] = [
    {
        title: "1. ALL PAYMENTS ARE NON-REFUNDABLE",
        blocks: [
            {
                type: "paragraph",
                text: `INAI sells advertising publication. Once your advertisement, listing, boost or featured placement is published, the service has been delivered in full and the payment is non-refundable.
                
                `,
            },
            {
                type: "paragraph",
                text: `This applies without exception to advertisements, business listings, service listings, boosts, featured placement, contact reveals and unlocks, and subscription periods already begun.
                `,
            },
        ],
    },
    {
        title: "2. YOU ARE ONLY CHARGED WHEN YOUR SERVICE GOES LIVE",
        blocks: [
            {
                type: "paragraph",
                text: `We do not take payment for an advertisement that has not been published.
                
                `,
            },
            {
                type: "paragraph",
                text: `When you check out, your payment method is authorised but not charged. The payment is taken at the moment your advertisement or listing is published. If your submission is not published — because you withdraw it before publication, or because we decline to publish it — the authorisation is released and no charge is made to your card.
                
                `,
            },
            {
                type: "paragraph",
                text: `You will therefore never be charged for a service you did not receive. Authorisation holds are typically released by your bank within [3–7] working days.
                `,
            },
        ],
    },
    {
        title: "3. WHAT NON-REFUNDABLE MEANS",
        blocks: [
            {
                type: "paragraph",
                text: `Once published, no refund is available in any of the following circumstances. This list is illustrative, not exhaustive.\
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `You change your mind about the advertisement.
                    `,
                    `You find or book a vendor elsewhere.
                    `,
                    `You delete your advertisement, listing or account before the paid period ends.
                    `,
                    `You receive fewer enquiries, views, replies or bookings than you hoped.
                    `,
                    `You receive no response at all.
                    `,
                    `You decide not to renew.
                    `,
                    `You are dissatisfied with the quality of enquiries received.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                INAI sells publication, not results. The response an advertisement receives depends on your content, photographs, pricing, category, location, timing and factors entirely outside our control. We do not guarantee any number of views, enquiries, leads, bookings or outcomes, and no such guarantee is implied by any part of the Platform. This is set out in clause 2 of our Terms and Conditions.
                
                `,
            },
            {
                type: "paragraph",
                text: `
                Removal for breach. If your content is removed or your account terminated for breach of clause 7 of the Terms — false information, prohibited content, fraud, impersonation, harassment, scraping, or content concerning a minor — no refund is due and we may retain all fees paid.
                
               `,
            },
            {
                type: "paragraph",
                text: `
                Removal at the request of the person advertised. If the person an advertisement is about asks us to remove it, we will remove it and no refund is due to the person who paid. Obtaining that person's consent before publishing is the advertiser's responsibility.
                `,
            },
        ],
    },
    {
        title: "4. SUBSCRIPTIONS",
        blocks: [
            {
                type: "paragraph",
                text: `You may cancel at any time in your account settings, at least [48 hours] before the next renewal date.
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `Cancellation stops all future charges.
                    `,
                    `The current billing period is not refunded. Your listing stays active until the period ends.
                    `,
                    `If you are charged after a valid and timely cancellation, that is a billing error under section 7 and will be corrected in full.
                    `
                ],
            },
        ],
    },
    {
        title: "5. INVITATION CARD DESIGN AND PRINTING",
        blocks: [
            {
                type: "paragraph",
                text: `5.1 Design slot fee — non-refundable, but never lost. The design fee pays for reserved designer time and creative work. Once design work has begun it is non-refundable. However:
                `,
            },
            {
                type: "bullets",
                items: [
                    `The fee is credited in full against your print order; and
                    `,
                    `If you decide not to proceed to print, the fee remains as credit on your account for [6] months and can be used on any future order.
                    `,
                ],
            },
            {
                type: "paragraph",
                text: `
                5.2 Printed cards are bespoke goods. Cards are printed to your personal specification — your names, your date, your design — and cannot be resold or reused. Once you approve the final digital proof and printing begins, the order cannot be cancelled or refunded.
                
                `,
            },
            {
                type: "paragraph",
                text: `5.3 Proof approval is your responsibility. Errors in names, dates, times, venues, spelling, translation or grammar that were present in the proof you approved are not our responsibility, and reprints for such errors are charged in full. Please check your proof carefully, and have someone else check it too.
                
                `,
            },
            {
                type: "paragraph",
                text: `5.4 Defective or incorrect orders. We will reprint free of charge, or refund, where:
                `,
            },
            {
                type: "bullets",
                items: [
                    `the cards differ materially from the approved proof;
                    `,
                    `print quality is defective — misprints, smudging, misalignment, or the wrong card stock;
                    `,
                    `the cards arrive damaged; or
                    `,
                    `the quantity delivered is short.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                Report within [7] days of delivery with clear photographs to support@inai.lk. We may ask you to return the affected cards at our expense. This reflects your statutory rights in respect of faulty goods, which cannot be excluded.
                
                `,
            },
            {
                type: "paragraph",
                text: `5.5 Delivery. Delivery dates are estimates. We are not liable for delays caused by couriers, customs, weather, strikes or other events outside our control. Where a confirmed delivery date is missed through our fault and the cards are no longer usable for your event, you may cancel for a full refund.
                
                `,
            },
            {
                type: "paragraph",
                text: `5.6 Quantities. Once printing has begun, quantities cannot be reduced.
                `,
            },
        ],
    },
    {
        title: "6. STATUTORY RIGHTS — CUSTOMERS IN THE EU AND UK",
        blocks: [
            {
                type: "paragraph",
                text: `Consumers resident in the EU or UK normally have a 14-day right to withdraw from a distance contract.
                
                `,
            },
            {
                type: "paragraph",
                text: `For digital services — advertisements, listings, boosts, contact reveals — that right is lost once performance has begun, provided the consumer expressly requested immediate performance and acknowledged the loss of the withdrawal right.
                
                `,
            },
            {
                type: "paragraph",
                text: `For printed cards: goods made to a consumer's specification are already exempt from the withdrawal right under EU and UK law. Section 5.2 stands on its own.
                
                `,
            },
            {
                type: "paragraph",
                text: `Nothing in this policy affects your statutory rights in respect of goods or services that are faulty, not as described, or not delivered.
                `,
            },
        ],
    },
    {
        title: "7. BILLING ERRORS",
        blocks: [
            {
                type: "paragraph",
                text: `Billing errors are corrections, not refunds, and are always put right. Contact [billing@yourdomain] with your transaction reference if you have been:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `charged more than once for the same service;
                    `,
                    `charged the wrong amount;
                    `,
                    `charged for something you did not order;
                    `,
                    `charged after a valid and timely subscription cancellation.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                Verified errors are corrected in full within [7] working days.
                `,
            },
        ],
    },
    {
        title: "8. IF WE FAIL TO DELIVER",
        blocks: [
            {
                type: "paragraph",
                text: `You will be made whole where we take payment but:

                `,
            },
            {
                type: "bullets",
                items: [
                    `fail to publish your advertisement or listing;
                    `,
                    `fail to run a paid boost or featured placement for the period purchased; or
                    `,
                    `permanently discontinue a service you paid for in advance.
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                Our remedy is, at your choice, to run the service for the period purchased or to refund the undelivered portion. Where a service is discontinued mid-term, we refund the unused portion pro rata.
                `,
            },
        ],
    },
    {
        title: "9. HOW TO RAISE A BILLING ISSUE",
        blocks: [
            {
                type: "paragraph",
                text: `Email support@inai.lk with:
                
                `,
            },
            {
                type: "bullets",
                items: [
                    `Your account email or WhatsApp number
                    `,
                    `The transaction reference or invoice number
                    `,
                    `The date of purchase
                    `,
                    `What you are requesting and why
                    `,
                    `Photographs, if the issue concerns printed cards
                    `
                ],
            },
            {
                type: "paragraph",
                text: `
                Timeline: acknowledgement within [2] working days; decision within [7] working days; any approved payment issued to the original payment method within [7–14] working days. Your bank may take additional time. Payments are made in the original currency; we are not responsible for exchange-rate movements or bank fees.
                `,
            },
        ],
    },
    {
        title: "10. CHARGEBACKS",
        blocks: [
            {
                type: "paragraph",
                text: `Please contact us before raising a chargeback with your bank. Genuine billing errors and delivery failures are resolved faster directly, and a chargeback creates fees and administrative work for both of us.
                
                `,
            },
            {
                type: "paragraph",
                text: `If you raise a chargeback without contacting us first, we may suspend your account and remove your listings pending resolution, and we will submit our records to your bank — including the publication log, timestamp and screenshot of your live advertisement, your emailed receipt, and your acceptance of these terms.
                
                `,
            },
            {
                type: "paragraph",
                text: `Where a chargeback is decided in our favour, we may recover the associated bank fees from you before reinstating your account.
                `,
            },
        ],
    },
    {
        title: "11. FRAUD AND ABUSE",
        blocks: [
            {
                type: "paragraph",
                text: `We may decline a claim and terminate the account where we identify a pattern of repeated or fraudulent billing claims, or fraudulent payment activity. We reserve the right to report payment fraud to law enforcement and to our payment providers.
                `,
            },
        ],
    },
    {
        title: "12. CHANGES",
        blocks: [
            {
                type: "paragraph",
                text: `We may update this policy. The version in force at the time of your purchase applies to that purchase. Material changes will be notified at least [14] days in advance.
                `,
            },
        ],
    },
    {
        title: "13. CONTACT",
        blocks: [
            {
                type: "paragraph",
                text: `Ahken Nexus (Pvt) Ltd.
                `,
            },
            {
                type: "paragraph",
                text: `247/1, Uthayanagar west, Kilinochchi, Sri Lanka
                
                `,
            },
            {
                type: "paragraph",
                text: `Support@inai.lk
                `,
            },
            {
                type: "paragraph",
                text: `WhatsApp: 0770 750 760
                `,
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
        case "space":
            return (
                <div className="mt-2 whitespace-pre-line font-medium text-left font-16 leading-[150%] text-secondary3 ">
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
                <div className="p-3 md:p-4 bg-[#F2F2F2] my-1 md:my-1.5 rounded-[8px] whitespace-pre-line text-left font-16 leading-[150%] text-[#B31B38] ">
                    {block.text}
                </div>
            );
        case "alert_black":
            return (
                <div className="p-3 md:p-4 bg-[#F2F2F2] my-1 md:my-1.5 rounded-[8px] whitespace-pre-line text-left font-16 leading-[150%] text-[#656565] ">
                    {block.text}
                </div>
            );
    }
}

function RefundPolicySectionBlock({ title, blocks }: PolicySection) {
    return (
        <div className="flex flex-col justify-center py-4 sm:py-5 md:py-6">
            <h2 className="text-left text-[16px] sm:text-[17px] md:text-[18px] font-semibold leading-[150%] text-[#767676] pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function RefundPolicy() {
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
                {RefundPolicySections.map((section) => (
                    <RefundPolicySectionBlock
                        key={section.title}
                        title={section.title}
                        blocks={section.blocks}
                    />
                ))}
            </div>
        </div>
    );
}