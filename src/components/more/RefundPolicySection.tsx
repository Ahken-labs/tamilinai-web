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
    { text: "Applies to: Elite Basic  |  Elite Pro  |  Elite Max" },
    { text: "Effective Date: 1st June 2025" },
    { text: "Last Updated: 1st June 2025" },
    { text: "Version 1.0" },
    { text: "www.inai.lk" },
    { text: "support@inai.lk" },
    { text: "A product of Ahken Nexus | Built by Ahkenlabs (ahkenlabs.com)" },
];

const RefundPolicySections: PolicySection[] = [
    {
        title: "1. Overview",
        blocks: [
            {
                type: "paragraph",
                text: `Inai offers three tiers of Elite Membership — Elite Basic, Elite Pro, and Elite Max — each designed to give you a richer, more connected experience on your matrimonial journey. This Cancellation Policy sets out clearly and fairly what happens when you choose to cancel your subscription, including your eligibility for a refund, the steps to request a cancellation, and how we process it.
                This policy applies to all Elite Membership purchases made through inai.lk, whether you have chosen an Auto-Renewal plan or a One-Time Payment plan.
`,
            },
            {
                type: "alert",
                text: `We want every member of the Inai community to feel confident about their subscription. If you have any questions before cancelling, please reach out to us at support@inai.lk — we are always happy to help.`,
            },
            {
                type: "paragraph",
                text: `This Cancellation Policy must be read alongside the Inai Terms & Conditions (inai.lk/terms) and the Privacy Policy (inai.lk/privacy), which together govern your use of the Platform.`
            },
        ],
    },
    {
        title: "2. Elite Membership Tiers at a Glance",
        blocks: [
            {
                type: "paragraph",
                text: `Inai's Elite Membership is available in three tiers. Each tier shares the same core premium features but differs in billing period, support level, profile visibility priority, and importantly — the cancellation refund window available to you.
                `,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: "Core Features Across All Tiers:",
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "paragraph",
                text: `All Elite tiers include optional auto-renewal, the ability to make one-time payments, access to view contact details, and the ability to send reminders.`,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "paragraph",
                text: `Tier-Specific Details & Refund Windows:`,
            },
            {
                type: "subheading",
                text: `
                Elite Basic`,
            },
            {
                type: "bullets",
                items: [
                    `Billing Period: 2 months`,
                    `Profile Boost & Priority Listing: Basic`,
                    `Advanced Match Filters: Standard`,
                    `Dedicated Support: Email`,
                    `Cancellation Window (no-use refund): 24 hours`
                ],
            },
            {
                type: "subheading",
                text: `
                Elite Pro`,
            },
            {
                type: "bullets",
                items: [
                    `Billing Period: 3 months`,
                    `Profile Boost & Priority Listing: Priority`,
                    `Advanced Match Filters: Advanced`,
                    `Dedicated Support: Priority Email`,
                    `Cancellation Window (no-use refund): 24 hours`,
                ],
            },
            {
                type: "subheading",
                text: `
                Elite Max`,
            },
            {
                type: "bullets",
                items: [
                    `Billing Period: 6 months`,
                    `Profile Boost & Priority Listing: Featured`,
                    `Advanced Match Filters: Full Suite`,
                    `Dedicated Support: Priority + Chat`,
                    `Cancellation Window (no-use refund): 36 hours`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "italic",
                text: `Pricing for each tier and billing period is displayed at inai.lk/membership at the time of purchase. All prices are in Sri Lankan Rupees (LKR) unless otherwise stated.`,
            },
        ],
    },
    {
        title: "3. Understanding Your Plan Type",
        blocks: [
            {
                type: "subheading",
                text: `3.1  Auto-Renewal Plans`,
            },
            {
                type: "paragraph",
                text: `When you choose Auto-Renewal at the time of purchase, your Elite Membership will automatically renew at the end of each billing period (2, 3, or 6 months depending on your tier and selection) for the same duration at the then-current price.
                Key things to know about Auto-Renewal:
`,
            },
            {
                type: "bullets",
                items: [
                    `You will receive an email reminder 7 days before your plan renews, confirming the renewal date and amount.`,
                    `To prevent a renewal charge, you must cancel Auto-Renewal at least 24 hours before the next billing date.`,
                    `Cancelling Auto-Renewal does not immediately end your current membership period. Your Elite access continues until the end of the period you have already paid for.`,
                    `You will not receive a refund for a billing period that has already been charged, unless you meet the no-use refund criteria described in Section 4.`
                ],
            },
            {
                type: "paragraph",
                text: `Cancelling Auto-Renewal is not the same as cancelling your membership. It simply means your plan will not renew after the current period ends. You keep full Elite access until your current period expires.`
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `3.2  One-Time Payment Plans`,
            },
            {
                type: "paragraph",
                text: `If you choose a One-Time Payment, you are charged a single, non-recurring fee for the selected plan duration. Your Elite Membership is active for that period only. There is no automatic renewal.
Key things to know about One-Time Payment:
`
            },
            {
                type: "bullets",
                items: [
                    `You will receive a notification before your membership expires, with an option to manually renew.`,
                    `Cancellation of a One-Time Payment plan means requesting that your membership ends before the period you paid for has elapsed. Refund eligibility is subject to Section 4.`
                ],
            },
        ],
    },
    {
        title: "4. Refund Eligibility",
        blocks: [
            {
                type: "paragraph",
                text: `Whether you are eligible for a refund when you cancel depends on two factors: (a) which tier you are on, and (b) whether you have used any Elite-exclusive features since your most recent payment.`,
            },
            {
                type: "subheading",
                text: `
                4.1. The No-Use Refund Window`,
            },
            {
                type: "paragraph",
                text: `Each tier provides a refund window from the moment of purchase during which you may cancel and receive a full refund — provided you have not used any Elite-exclusive features during that window.
                Elite-exclusive features for this purpose are defined as:`,
            },
            {
                type: "bullets",
                items: [
                    `Viewing the WhatsApp number or email address of any matched User ("Contact Details").`,
                    `Sending a Reminder to a User who has not responded to your Interest within 24 hours.`,
                    `Any other feature clearly labelled as Elite-only within the Platform.`
                ],
            },
            {
                type: "paragraph",
                text: `Refund windows by tier:`,
            },
            {
                type: "bullets",
                items: [
                    `Elite Basic: 24 hours from the time of purchase.`,
                    `Elite Pro: 24 hours from the time of purchase.`,
                    `Elite Max: 36 hours from the time of purchase.`
                ],
            },
            {
                type: "alert",
                text: `The refund window starts from the exact timestamp of your successful payment confirmation, not from the date of purchase. For example, if you purchased Elite Max at 2:22 AM on a Monday, your 24 hours window closes at 2:22 AM the following Tuesday.`,
            },
            {
                type: "subheading",
                text: `4.2  Full Refund Conditions`,
            },
            {
                type: "paragraph",
                text: `You are entitled to a full refund if ALL of the following conditions are met:
                Elite-exclusive features for this purpose are defined as:`,
            },
            {
                type: "bullets",
                items: [
                    `You submit your cancellation request within the refund window for your tier (24 hours for Basic, 24 hours for Pro, 36 hours for Max).`,
                    `You have not viewed any User's Contact Details (WhatsApp or email) since your most recent payment.`,
                    `You have not sent any Reminder since your most recent payment.`,
                    `Your account is in good standing (not suspended, under investigation, or subject to a breach of Terms).`
                ],
            },
            {
                type: "space",
                text: ``,
            },
            {
                type: "subheading",
                text: `4.3  No Refund Scenarios`,
            },
            {
                type: "paragraph",
                text: `No refund will be issued in any of the following circumstances:`,
            },
            {
                type: "bullets",
                items: [
                    `You cancel after the refund window for your tier has closed, regardless of whether or not you have used Elite features.`,
                    `You have viewed any Contact Details or sent any Reminder since your most recent payment, even if you cancel within the refund window.`,
                    `You cancel an Auto-Renewal plan for the current billing period that has already been charged (cancellation takes effect from the next renewal date onward).`,
                    `Your account has been suspended or terminated due to a violation of Inai's Terms & Conditions.`,
                    `You request a refund citing dissatisfaction with matches or outcomes, change of mind after feature use, or having found a partner through the Platform.`,
                    `The cancellation request is submitted by someone other than the registered account holder.`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `4.4  Pro-Rata Refund — Platform Discontinuation`,
            },
            {
                type: "paragraph",
                text: `In the exceptional circumstance that Inai permanently discontinues the Elite Membership service or ceases operations entirely, all active Elite members across all tiers will receive a pro-rata refund for the unused portion of their current paid period. This refund will be processed automatically to the original payment method without requiring a request.`,
            },

        ],
    },
    {
        title: "5. How to Cancel Your Subscription",
        blocks: [
            {
                type: "paragraph",
                text: `Cancellation requests can be submitted through either of the following channels. Both are available to all `,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `5.1  Self-Service via Account Settings (Recommended)`,
            },
            {
                type: "paragraph",
                text: `The fastest way to cancel is through your account directly:`,
            },
            {
                type: "bullets",
                items: [
                    `1.	Log in to your Inai account at inai.lk.`,
                    `2.	Navigate to Account Settings → Subscription & Billing.`,
                    `3.	Click "Cancel Subscription" or "Turn Off Auto-Renewal" as appropriate.`,
                    `4.	Confirm your cancellation when prompted. You will receive a confirmation email within a few minutes.`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "italic",
                text: `Keep your confirmation email as proof of the cancellation request timestamp, which is relevant to refund window eligibility.`,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `5.2  Email Request`,
            },
            {
                type: "paragraph",
                text: `If you are unable to cancel through account settings, you may submit a written request to billing@inai.lk with the subject line: "Cancellation Request — [Your Registered Email Address]".
                Your email must include:`,
            },
            {
                type: "bullets",
                items: [
                    `Your full name as registered on Inai.`,
                    `Your registered email address and mobile number.`,
                    `Your Elite tier (Basic, Pro, or Max).`,
                    `The reason for cancellation (optional but helpful).`,
                    `Whether you are requesting a refund and, if so, a brief statement that you have not used any Elite-exclusive features.`
                ],
            },
             {
                type: "paragraph",
                text: `We will acknowledge your request within the timeframes listed in Section 6 and will confirm whether your cancellation and any refund have been approved.`,
            },
            {
                type: "alert_black",
                text: `To protect your account security, Inai may ask you to verify your identity before processing a cancellation or refund request. This is to ensure no one can cancel your subscription without your knowledge.`,
            },
        ],
    },
    {
        title: "6. Processing Times by Tier",
        blocks: [
            {
                type: "subheading",
                text: `6.1  What Elite Membership Provides`,
            },
            {
                type: "paragraph",
                text: `Inai is committed to processing cancellation and refund requests promptly. Elite Pro and Elite Max members receive expedited service in recognition of their higher-tier commitment. The details below set out our service-level commitments.`,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `Elite Basic`,
            },
            {
                type: "bullets",
                items: [
                    `Request Acknowledged: Within 48 hours`,
                    `Eligibility Review Completed: Within 2 business days`,
                    `Refund Processed: 5–7 business days`,
                    `Support Channel for Queries: Email only`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
             {
                type: "subheading",
                text: `Elite Pro`,
            },
            {
                type: "bullets",
                items: [
                    `Request Acknowledged: Within 24 hours`,
                    `Eligibility Review Completed: Within 1 business day`,
                    `Refund Processed: 3–5 business days`,
                    `Support Channel for Queries: Priority email`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `Elite Max`,
            },
            {
                type: "bullets",
                items: [
                    `Request Acknowledged: Within 12 hours`,
                    `Eligibility Review Completed: 1 business day`,
                    `Refund Processed: 1–3 business days`,
                    `Support Channel for Queries: Priority email + WhatsApp`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `Refund Method:`,
            },

            {
                type: "paragraph",
                text: `All refunds are returned to the original payment method used at the time of purchase. Inai does not issue refunds via bank transfer, cash, or any method other than the original payment channel.
                Processing times refer to business days (Monday to Friday, excluding Sri Lankan public holidays). While we strive to meet these timelines, high-demand periods may result in slightly longer processing times. We will always communicate any delays.`,
            },
        ],
    },
    {
        title: "7. What Happens After You Cancel",
        blocks: [
            {
                type: "subheading",
                text: `7.1  If Auto-Renewal is Cancelled (No Refund)`,
            },
            {
                type: "paragraph",
                text: `If you cancel Auto-Renewal outside the refund window, or after having used Elite features:`,
            },
            {
                type: "bullets",
                items: [
                    `Your Elite Membership remains fully active until the last day of your current paid billing period.`,
                    `You retain access to all Elite features (including Contact Details and Reminders) until your period ends.`,
                    `On the day after your period ends, your account automatically reverts to Free User status.`,
                    `As a Free User, you can still browse Profiles and send Interests, but you will no longer be able to view Contact Details or send Reminders until you purchase a new plan.`,
                    `Your Profile, Matches, and account history are fully preserved.`
                ],
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `7.2  If a Refund is Approved`,
            },
            {
                type: "paragraph",
                text: `If your cancellation qualifies for a full refund:`,
            },
            {
                type: "bullets",
                items: [
                    `Your Elite Membership is deactivated immediately upon approval of your refund request.`,
                    `Your account reverts to Free User status from that point forward.`,
                    `The refund is processed to your original payment method within the timeframes in Section.`,
                    `Any Matches made during the short period of Elite access (before cancellation) remain visible in your account.`
                ],
            },
            
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `7.3  Account Data After Cancellation`,
            },
            {
                type: "paragraph",
                text: `Cancellation of your Elite Membership does not delete your Inai account or your Profile. Your data remains in your account in accordance with our Privacy Policy. If you wish to delete your account entirely, that is a separate action available through Account Settings or by emailing support@inai.lk.`,
            },
        ],
    },
    {
        title: "8. Tier Changes — Upgrades & Downgrades",
        blocks: [
            {
                type: "subheading",
                text: `8.1  Upgrading Your Tier`,
            },
            {
                type: "paragraph",
                text: `You may upgrade from Elite Basic to Elite Pro, or from Elite Pro to Elite Max, at any time during your active membership period. Upgrade pricing is calculated on a pro-rata basis: you will be charged only for the remaining days of your current period at the higher-tier rate, adjusted for what you have already paid.
                Your new tier benefits take effect immediately upon payment of the upgrade fee. The cancellation and refund terms of your new tier apply from the moment of upgrade.`,
            },
            {
                type: "space",
                text: ``,
            },
            {
                type: "subheading",
                text: `8.2  Downgrading Your Tier`,
            },
            {
                type: "paragraph",
                text: `You may request a downgrade from your current tier to a lower tier. Downgrades take effect at the end of your current billing period; you will continue to enjoy your current tier's benefits until that date.
                No partial refund is issued for the difference in tier pricing when you downgrade, as you continue to access the higher-tier features until the period ends.`,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `8.3  Switching from Auto-Renewal to One-Time Payment`,
            },
            {
                type: "paragraph",
                text: `You may switch from Auto-Renewal to One-Time Payment (or vice versa) by contacting Support@inai.lk at least 5 business days before your next renewal date. The change will take effect from your next billing cycle.`,
            },
        ],
    },
    {
        title: "9. Billing Disputes & Escalation",
        blocks: [
            {
                type: "paragraph",
                text: `If you believe a charge has been made to your payment method in error, or if you are dissatisfied with a cancellation or refund decision, please follow the steps below:`,
            },
            {
                type: "space",
                text: ` `,
            },
            {
                type: "subheading",
                text: `Step 1 — Contact Inai First`,
            },
            {
                type: "paragraph",
                text: `Email Support@inai.lk or WhatsApp us with full details of the disputed charge or decision, including your registered email, the transaction date and amount, and your reason for the dispute. We aim to resolve all billing queries within 5 business days.`,
            },
            {
                type: "space",
                text: ` `,
            },

            {
                type: "subheading",
                text: `Step 2 — Escalation`,
            },
            {
                type: "paragraph",
                text: `If you are not satisfied with our response within 10 business days, you may escalate your complaint to projectahken@gmail.com. A senior member of our team will review your case and respond within 7 business days.`,
            },
            {
                type: "space",
                text: ` `,
            },

            {
                type: "subheading",
                text: `Step 3 — Payment Dispute via Your Bank`,
            },
            {
                type: "paragraph",
                text: `If you are still unsatisfied after exhausting the above steps, you have the right to raise a dispute directly with your bank or card issuer (a "chargeback"). We ask that you allow Inai a reasonable opportunity to resolve the matter first, as chargebacks can cause delays and complications for both parties. Inai will cooperate fully with any legitimate bank dispute process.`,
            },
            {
                type: "alert_black",
                text: `Raising a chargeback without first attempting resolution with Inai may result in temporary account suspension pending investigation, in line with our Terms & Conditions.`,
            },
        ],
    },
    {
        title: "10. Changes to This Policy",
        blocks: [
            {
                type: "paragraph",
                text: `Inai reserves the right to update this Cancellation Policy from time to time. When material changes are made, we will:`,
            },
            {
                type: "bullets",
                items: [
                    `Post the updated policy at inai.lk/cancellation-policy with a revised "Last Updated" date.`,
                    `Send an email notification to all active Elite Members at least 14 days before the updated policy takes effect.`,
                    `Display an in-app notification on your next login.`
                ],
            },
            {
                type: "paragraph",
                text: `Changes will not affect any cancellation request submitted before the updated policy's effective date. Your continued use of an Elite Membership after the effective date constitutes acceptance of the updated policy.`,
            },
        ],
    },
    {
        title: "11. Contact Information",
        blocks: [
            {
                type: "subheading",
                text: ``,
            },
            {
                type: "paragraph",
                text: `For any queries, concerns, or notices relating to these Terms, please use the appropriate contact below:
                
                General Support: support@inai.lk
                Legal & Terms: connect@inai.lk
                Privacy & Data: privacy@inai.lk
                Abuse & Safety: connect@inai.lk
                Billing & Payments: connect@inai.lk
                
                Website: www.inai.lk
                Parent Company: Ahken Nexus (Pvt) Ltd
                Technology Partner: Ahkenlabs (ahkenlabs.com)`,
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
        <div className="flex flex-col justify-center border-b border-[#EAEAEA] py-4 sm:py-5 md:py-6">
            <h2 className="text-left font-18 font-medium leading-[150%] text-dark pb-1.5">
                {title}
            </h2>

            <div>{blocks.map((block, index) => <div key={index}>{renderBlock(block)}</div>)}</div>
        </div>
    );
}

export default function RefundPolicy() {
    return (
        <div className="font-poppins mx-auto flex max-w-[910px] flex-col bg-white px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
                <div className="font-18 font-medium leading-[150%] text-dark">
                    INAI.LK
                </div>
                <div className="mt-1.5 font-16 font-normal leading-[150%] text-secondary3">
                    ELITE SUBSCRIPTION - CANCELLATION POLICY
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

            <div className="mt-4 md:mt-5">
                <div className="text-center flex-col flex font-16 font-normal leading-[150%] text-secondary3">
                    <span>By using Inai, you agree to these Terms.</span>
                    <span>We are honoured to be part of your journey.</span>
                    <span>— The Inai Team —</span>
                </div>
            </div>

            <div className="border-b border-[#EAEAEA] mt-5 md:mt-6" />

            <div className="mt-4 md:mt-5">
                <div className="text-center flex-col flex font-16 font-normal leading-[150%] text-secondary3">
                    <span>Inai.lk  |  A product of Ahken Nexus  |  Built by Ahkenlabs</span>
                    <span className="underline font-medium">www.inai.lk  |  privacy@inai.lk</span>
                </div>
            </div>
        </div>
    );
}