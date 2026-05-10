"use client";

import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa6";

import Button from "@/src/components/common-layout/Button";
import {
    CheckmarkIcon,
    ChevronRightIcon,
    NotificationIcon,
    SendInterestMsgIcon,
    ShortlistedIcon,
} from "@/src/assets/Icons";
import { CgClose } from "react-icons/cg";
import { RiArrowGoBackLine } from "react-icons/ri";

type StatusType = "sent" | "received" | "declined";

type MatchInterestCardProps = {
    profileName: string;
    myName?: string;
    status: StatusType;
    isElite: boolean;
    isAccepted: boolean;
    sendCount?: number;
    receivedCount?: number;
};

const DEFAULT_INTEREST =
    "Vanakkam {name}, I really liked your profile. If you feel we are a good match, I would love to connect.";

const FOLLOW_UP =
    "I'm still hoping to connect. Please let me know if you are interested.";

const ACCEPT_REPLY = "Vanakkam! I have accepted your interest. Let's connect!";

const ELITE_CONGRATS =
    "Congratulations! You are both a mutual match. Don't keep her waiting - make the first move and start your beautiful journey together.";

const NON_ELITE_CONGRATS =
    "Congratulations! You are both a mutual match. Don't keep her waiting - make the first move and start your beautiful journey together.";

export default function MatchInterestCard({
    profileName,
    myName = "username",
    status,
    isElite,
    isAccepted,
    sendCount = 0,
    receivedCount = 1,
}: MatchInterestCardProps) {
    const interestText = DEFAULT_INTEREST.replace("{name}", profileName);
    const incomingText = DEFAULT_INTEREST.replace("{name}", myName);

    if (status === "declined") {
        return (
            <CardShell>
                <p className="font-poppins font-16 font-normal leading-[150%] text-dark">
                    You have respectfully passed on {profileName}&apos;s profile. We will keep this private.
                </p>

                <div className="mt-5 flex gap-4 
                max-[800px]:flex-col 
                max-[767px]:flex-row 
                max-[682px]:flex-col 
                max-[639px]:flex-row 
                max-[633px]:flex-col 
                max-[520px]:flex-row 
                max-[513px]:flex-col">
                    <Button text="Explore more profiles" className="flex-1" />
                    <Button
                        text="Change mind"
                        iconLeft={<RiArrowGoBackLine className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />}
                        className="flex-1 !bg-[#FFF] border border-[#B31B38] !text-[#B31B38] hover:!bg-gray-50 active:!bg-gray-100"
                    />
                </div>
            </CardShell>
        );
    }

    if (status === "sent" && !isAccepted) {
        if (sendCount === 0) {
            return (
                <CardShell>
                    <div className="flex w-full justify-between gap-3">
                        <span className="font-16 text-dark leading-[150%]">
                            🎉 This profile matches your preferences.
                        </span>
                        <div className="flex items-center">
                            <span className="font-16 text-dark">More details</span>
                            <ChevronRightIcon className="h-3 w-3 md:h-4 md:w-4" />
                        </div>
                    </div>
                    <div
                        className="mt-[20px] flex gap-3 flex-row 
                  max-[470px]:flex-col
                  min-[520px]:flex-col
                  min-[650px]:flex-row
                  min-[767px]:flex-col
                  min-[815px]:flex-row
                  md:mt-[25px] md:gap-4"
                    >
                        <Button className="!font-medium w-full"
                            text="Send Interest" iconLeft={<SendInterestMsgIcon className="h-4 w-4 md:h-5 md:w-5" />}
                        />
                        <Button className="!font-medium w-full !text-[#B31B38] border border-[#B31B38] !bg-[#FFE9E2] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                            text="Add to shortlist" iconLeft={<ShortlistedIcon className="h-4 w-4 md:h-5 md:w-5" />}
                        />
                    </div>
                </CardShell>
            );
        }

        if (sendCount === 1) {
            return (
                <CardShell>
                    <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                    <div className="mt-3 md:mt-4">
                        <MessageRow
                            side="outgoing"
                            avatarSrc="/images/no_photo.png"
                            bubbles={[interestText]}
                        />
                    </div>

                    <div className="mt-5 text-center font-poppins font-16 font-medium leading-[150%] text-dark">
                        Interest sent · Awaiting response.
                    </div>
                    <div className="mt-1 text-center font-poppins font-16 font-normal leading-[150%] text-primary">
                        You can send a reminder in 1 day, 23 hours.
                    </div>
                </CardShell>
            );
        }

        if (sendCount === 2) {
            return (
                <CardShell>
                    <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                    <div className="mt-4">
                        <MessageRow
                            side="outgoing"
                            avatarSrc="/images/no_photo.png"
                            bubbles={[interestText]}
                        />
                    </div>

                    <div className="mt-5 text-center font-poppins font-16 font-medium leading-[150%] text-dark">
                        Interest sent · Awaiting response.
                    </div>

                    <div className="mt-3 flex justify-center">
                        <Button
                            text="Send reminder"
                            iconLeft={<NotificationIcon className="h-4 w-4 md:h-5 md:w-5" />}
                            className="!font-medium"
                        />
                    </div>
                </CardShell>
            );
        }

        return (
            <CardShell>
                <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                <div className="mt-4 flex flex-col gap-4">
                    <MessageRow
                        side="outgoing"
                        avatarSrc="/images/no_photo.png"
                        bubbles={[interestText, FOLLOW_UP]}
                    />
                </div>

                <div className="mt-5 text-center font-poppins font-16 font-medium leading-[150%] text-dark">
                    Reminder sent · Awaiting response.
                </div>
            </CardShell>
        );
    }

    if (status === "sent" && isAccepted) {
        return (
            <CardShell>
                <SectionTitle title={`🎉 ${profileName} has accepted your interest!`} />

                <div className="mt-4 flex flex-col gap-4">
                    <MessageRow
                        side="outgoing"
                        avatarSrc="/images/no_photo.png"
                        bubbles={sendCount >= 2 ? [interestText, FOLLOW_UP] : [interestText]}
                    />

                    <MessageRow
                        side="incoming"
                        avatarSrc="/images/no_photo.png"
                        bubbles={[ACCEPT_REPLY]}
                    />
                </div>

                <div className="mt-9 flex justify-center">
                    <PartyIcon />
                </div>

                {isElite ? (
                    <>
                        <div className="mt-3 md:mt-4 text-center font-poppins font-16 font-normal leading-[150%] text-dark">
                            {ELITE_CONGRATS}
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button
                                text="Chat on WhatsApp"
                                iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
                                className="!font-medium"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mt-4 text-center font-poppins font-16 font-medium leading-[150%] text-primary">
                            She accepted! Upgrade to Elite to see her contact.
                        </div>

                        <div className="mt-4 flex justify-center">
                            <Button
                                text="Upgrade & connect now"
                                className="!font-medium"
                            />
                        </div>

                        <div className="mt-7 text-center font-poppins font-16 font-normal leading-[150%] text-dark">
                            {NON_ELITE_CONGRATS}
                        </div>
                    </>
                )}
            </CardShell>
        );
    }

    if (status === "received" && !isAccepted) {
        return (
            <CardShell>
                <SectionTitle title={`✨ ${profileName} is interested in you!`} />

                <div className="mt-4">
                    <MessageRow
                        side="incoming"
                        avatarSrc="/images/no_photo.png"
                        bubbles={
                            receivedCount >= 2
                                ? [incomingText, FOLLOW_UP]
                                : [incomingText]
                        }
                    />
                </div>

                <div className="mt-5 flex gap-4 max-[520px]:flex-col">
                    <Button text="Accept" iconLeft={<CheckmarkIcon className="w-4 sm:w-4.5 md:w-5 lg:w-6 h-4 sm:h-4.5 md:h-5 lg:h-6" />} className="flex-1" />
                    <Button
                        text="Decline"
                        iconLeft={<CgClose className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />}
                        className="flex-1 !bg-[#FFF] border border-[#B31B38] !text-[#B31B38] hover:!bg-gray-50 active:!bg-gray-100"
                    />
                </div>
            </CardShell>
        );
    }

    return (
        <CardShell>
            <SectionTitle title={`✨ ${profileName} is interested in you!`} />

            <div className="mt-4 flex flex-col gap-4">
                <MessageRow
                    side="incoming"
                    avatarSrc="/images/no_photo.png"
                    bubbles={receivedCount >= 2 ? [incomingText, FOLLOW_UP] : [incomingText]}
                />

                <MessageRow
                    side="outgoing"
                    avatarSrc="/images/no_photo.png"
                    bubbles={[ACCEPT_REPLY]}
                />
            </div>

            <div className="mt-9 flex justify-center">
                <PartyIcon />
            </div>

            {isElite ? (
                <>
                    <div className="mt-4 text-center font-poppins font-16 font-normal leading-[150%] text-dark">
                        Congratulations! You are both a mutual match. Don&apos;t keep her waiting - send the first message and start your beautiful journey together.
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Button
                            text="Chat on WhatsApp"
                            iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
                            className="!font-medium"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="mt-3 md:mt-4 text-center font-poppins font-16 font-medium leading-[150%] text-primary">
                        You accepted! Upgrade to Elite to see her contact.
                    </div>

                    <div className="mt-3 md:mt-4 flex justify-center">
                        <Button text="Upgrade & connect now" className="!font-medium" />
                    </div>

                    <div className="mt-5 md:mt-7 text-center font-poppins font-16 font-normal leading-[150%] text-dark">
                        Congratulations! You are both a mutual match. Don&apos;t keep her waiting - make the first message and start your beautiful journey together.
                    </div>
                </>
            )}
        </CardShell>
    );
}

function CardShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-[16px] bg-[#FFE9E2] p-4 md:p-5">
            {children}
        </div>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <div className="font-poppins font-20 font-bold leading-[150%] text-dark">
            {title}
        </div>
    );
}

function MessageRow({
    side,
    bubbles,
    avatarSrc,
}: {
    side: "incoming" | "outgoing";
    bubbles: string[];
    avatarSrc: string;
}) {
    const isIncoming = side === "incoming";

    return (
        <div className={`flex items-start gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 ${isIncoming ? "flex-row" : "flex-row"}`}>
            {isIncoming && <Avatar src={avatarSrc} />}
            <div className="flex-1 flex flex-col gap-1">
                {bubbles.map((text, index) => (
                    <MessageBubble
                        key={`${text}-${index}`}
                        text={text}
                        radiusClass={
                            index === 0
                                ? isIncoming
                                    ? "rounded-[0_20px_20px_20px]"
                                    : "rounded-[20px_0_20px_20px]"
                                : "rounded-[0_0_20px_20px]"
                        }
                    />
                ))}
            </div>
            {!isIncoming && <Avatar src={avatarSrc} />}
        </div>
    );
}

function MessageBubble({
    text,
    radiusClass,
}: {
    text: string;
    radiusClass: string;
}) {
    return (
        <div
            className={`flex w-full flex-1 items-center justify-center bg-white px-2 sm:px-3 py-3 sm:py-4 md:py-5 ${radiusClass}`}
        >
            <p className="font-poppins font-16 font-normal leading-[150%] text-dark">
                {text}
            </p>
        </div>
    );
}

function Avatar({ src }: { src: string }) {
    return (
        <div className="shrink-0">
            <Image
                src={src}
                alt="profile"
                width={56}
                height={56}
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-8 sm:w-10 md:w-12 lg:w-14 rounded-full object-cover bg-[#D9D9D9]"
                priority={false}
            />
        </div>
    );
}

function PartyIcon({ className = "h-14 md:h-18 w-14 md:w-18" }: { className?: string }) {
    return (
        <span
            className={`${className} inline-flex select-none items-center justify-center text-[52px] leading-none`}
            aria-label="party"
            role="img"
        >
            🎉
        </span>
    );
}