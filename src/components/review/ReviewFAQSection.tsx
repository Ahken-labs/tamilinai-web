"use client";

import { CONTACT } from "@/src/lib/contact";

interface FAQPoint {
  label: string;
  value: string;
  valueMedium?: boolean;
}

interface FAQItem {
  q: string;
  a: string;
  points?: FAQPoint[];
  note?: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How can I pay for my Inai Elite ad?",
    a: "Currently, we accept payments via direct bank transfer or bank deposit. Simply transfer the amount to the account details provided below and share the receipt with us to activate your Elite Inai ad.",
    points: [
      { label: "Account Name:", value: "Ahken Nexus Pvt Ltd.", valueMedium: true },
      { label: "Account Number:", value: "0148 1100 4426", valueMedium: true },
      { label: "Bank:", value: "Sampath Bank PLC", valueMedium: true },
      { label: "Branch:", value: "Kilinochchi.", valueMedium: true },
    ],
  },
  {
    q: "What should I do after making the transfer?",
    a: "Once you have made the payment, please send a clear photo or screenshot of the receipt to our us. You can send it to:",
    points: [
      { label: "WhatsApp:", value: "+94 77 075 0760" },
      { label: "Email:", value: CONTACT.email },
    ],
    note: "Please include your Inai Profile ID, registered email address, or phone number with your message so we can quickly locate and activate your account.",
  },
  {
    q: "How long does it take to get my Inai Elite ad activated after I pay?",
    a: "Your Elite ad will be activated within 12 hours after we receive and verify your payment receipt. We'll get you upgraded as quickly as possible!",
  },
  {
    q: "Are online credit/debit card payments available?",
    a: "Secure online card payments are coming soon! For now, direct bank transfers keep your payments safe and reliable.",
  },
  {
    q: "Do you provide customer support?",
    a: "Yes, our team is here to help you around the clock. Whether you need help with a payment or have questions about your profile, please reach out to us:",
    points: [
      { label: "WhatsApp:", value: "+94 77 075 0760" },
      { label: "Email:", value: CONTACT.email },
    ],
  },
  {
    q: "I found my partner through Inai.lk. How can I delete my ad profile?",
    a: `Congratulations! You can easily unpublish or delete your ad profile by going to "Account Settings > Close Account". Alternatively, you can contact our support team, and we will assist you in taking your profile down securely.`,
  },
];

export default function ReviewFAQSection() {
  return (
    <section className="bg-[#F2F2F2] py-16 px-4 sm:px-6 font-poppins">
      <div className="max-w-[800px] mx-auto">
        {/* Title */}
        <h2 className="m-0 text-center text-[#000] text-[20px] font-semibold leading-normal">
          Frequently Asked Questions (FAQ)
        </h2>

        {/* FAQ list */}
        <div className="mt-8 border-t border-[#D8D8D8]">
          {FAQS.map((item, idx) => (
            <div key={idx} className="py-5 border-b border-[#D8D8D8]">
              {/* Question */}
              <p className="text-[#222] text-[16px] font-semibold leading-normal">
                {item.q}
              </p>

              {/* Answer */}
              <p className="mt-2 text-[#2C303A] text-[16px] font-normal leading-[150%]">
                {item.a}
              </p>

              {/* Points */}
              {item.points && (
                <div className="ml-1 mt-1 flex flex-col gap-1">
                  {item.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <span className="text-[#2C303A] font-poppins text-[16px] font-normal leading-[140%] w-[157px] shrink-0 flex items-center gap-1">
                        <span className="mr-1">•</span>{pt.label}
                      </span>
                      <span className={`text-[#2C303A] font-poppins text-[16px] leading-[140%] ${pt.valueMedium ? "font-medium" : "font-normal"}`}>
                        {pt.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Note (bold label + text) */}
              {item.note && (
                <p className="m-0 mt-1 text-[#2C303A] text-[16px] font-normal leading-[150%]">
                  <span className="font-medium">Important:</span> {item.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
