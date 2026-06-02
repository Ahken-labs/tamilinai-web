"use client";

import { useState } from "react";
import EliteUpgradePopup from "../common-layout/EliteUpgradePopup";
import ProtectedPhoto from "../common-layout/ProtectedPhoto";
import { FaWhatsapp } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import Button from "@/src/components/common-layout/Button";
import {
    CheckmarkIcon,
    ChevronRightIcon,
    NotificationIcon,
    SendInterestMsgIcon,
    ShortlistedIcon,
    ShortlistRemoveIcon,
} from "@/src/assets/Icons";
import { CgClose } from "react-icons/cg";
import { RiArrowGoBackLine } from "react-icons/ri";
import { readMeCache } from "@/src/components/AppHeader";
import { sendInterest, respondToInterest, unblockSender } from "@/src/lib/api/interests";
import { shortlistProfile, unshortlistProfile } from "@/src/lib/api/profiles";
import { ApiError } from "@/src/lib/api/client";

type StatusType = "sent" | "received" | "declined";

type MatchInterestCardProps = {
    profileId: string;
    profileName: string;
    gender?: string;
    profilePhoto?: string | null;
    status: StatusType;
    isElite: boolean;
    isAccepted: boolean;
    sendCount?: number;
    receivedCount?: number;
    isShortlisted?: boolean;
    lastSentAt?: string | null;
    isReminderDue?: boolean;
    declinedByMe?: boolean;
    phone?: string;
    onAction?: () => void;
};

const DEFAULT_INTEREST =
    "Vanakkam {name}, I really liked your profile. If you feel we are a good match, I would love to connect.";

const FOLLOW_UP =
    "I'm still hoping to connect. Please let me know if you are interested.";

const ACCEPT_REPLY = "Vanakkam! I have accepted your interest. Let's connect!";


export default function MatchInterestCard({
    profileId,
    profileName,
    gender,
    profilePhoto,
    status,
    isElite,
    isAccepted,
    sendCount = 0,
    receivedCount = 1,
    isShortlisted: initialShortlisted = false,
    lastSentAt,
    isReminderDue = false,
    declinedByMe = false,
    phone,
    onAction,
}: MatchInterestCardProps) {
    const isMale = gender === "male";
    const she = isMale ? "He" : "She";
    const her = isMale ? "his" : "her";
    const theirPhoto = profilePhoto ?? (isMale ? "/images/no_photo_male.png" : "/images/no_photo.png");
    const me = readMeCache();
    const myPhoto = me?.profile?.photoUrl ?? (me?.gender === "male" ? "/images/no_photo_male.png" : "/images/no_photo.png");
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [showLimitPopup, setShowLimitPopup] = useState(false);
    const [mutualAccepted, setMutualAccepted] = useState(false);
    const [changeMindMode, setChangeMindMode] = useState(false);
    const [shortlisted, setShortlisted] = useState(initialShortlisted);
    const [shortlistPending, setShortlistPending] = useState(false);

    async function handleShortlist() {
        if (shortlistPending) return;
        const next = !shortlisted;
        setShortlisted(next);
        setShortlistPending(true);
        try {
            if (next) await shortlistProfile(profileId);
            else await unshortlistProfile(profileId);
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) {
                onAction?.(); // already in desired state — sync parent
                return;
            }
            setShortlisted(!next); // revert on real error
            onAction?.();          // sync parent so its cache reflects correct state
        } finally {
            setShortlistPending(false);
        }
    }

    async function act(fn: () => Promise<{ message?: string } | unknown>) {
        if (pending) return;
        setPending(true);
        try {
            const res = await fn() as { message?: string } | undefined;
            if (res && typeof res === 'object' && 'message' in res && String(res.message).includes('Mutual')) {
                setMutualAccepted(true);
            }
            setChangeMindMode(false);
            onAction?.();
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) onAction?.();
            else if (err instanceof ApiError && err.status === 403 && !isElite) setShowLimitPopup(true);
        } finally {
            setPending(false);
        }
    }
    const interestText = DEFAULT_INTEREST.replace("{name}", profileName);
    const myName = me?.name ?? "";
    const incomingText = DEFAULT_INTEREST.replace("{name}", myName);

    if (status === "declined" && !changeMindMode) {
        if (!declinedByMe) {
            // They declined my interest — permanent dead end, no path to re-send
            return (
                <CardShell>
                    <p className="font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                        {profileName} has chosen to explore other matches.
                    </p>
                    <div className="mt-5">
                        <Button text="Explore more profiles" onPress={() => router.push("/matches")} />
                    </div>
                </CardShell>
            );
        }

        return (
            <CardShell>
                <p className="font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
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
                    <Button text="Explore more profiles" className="flex-1 !px-4" onPress={() => router.push("/matches")} />
                    <Button
                        text="Change mind"
                        onPress={() => {
                            setChangeMindMode(true);
                            // Immediately unblock so their profile reappears in our browse — idempotent
                            unblockSender(profileId).catch(() => {});
                        }}
                        iconLeft={<RiArrowGoBackLine className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />}
                        className="!px-4 flex-1 !bg-[#FFF] border border-[#B31B38] !text-[#B31B38] hover:!bg-gray-50 active:!bg-gray-100"
                    />
                </div>
            </CardShell>
        );
    }

    if ((status === "sent" && !isAccepted) || changeMindMode) {
        // When in changeMindMode from a declined state, isReminderDue from backend is always false
        // (backend only computes it for pending rows). Derive it from lastSentAt directly.
        const effectiveIsReminderDue = isReminderDue || (
            changeMindMode && status === "declined" && !!lastSentAt &&
            // eslint-disable-next-line react-hooks/purity
            Date.now() - new Date(lastSentAt).getTime() >= 3 * 24 * 60 * 60 * 1000
        );

        if (sendCount === 0) {
            return (
                <>
                    <CardShell>
                        <div className="flex flex-col gap-0 min-[500px]:flex-row min-[500px]:justify-between w-full">
                            <span className="text-[14px] md:text-[16px] text-dark leading-[150%]">
                                🎉 This profile matches your preferences.
                            </span>
                            <a href="#partner-preferences" className="flex items-center">
                                <span className="text-[14px] md:text-[16px] text-dark">More details</span>
                                <ChevronRightIcon className="h-4 w-4" />
                            </a>
                        </div>
                        <div
                            className="max-[370px]:mt-2 max-[500px]:mt-4 mt-6 flex max-[370px]:gap-2 gap-3 flex-row
                      max-[470px]:flex-col
                      min-[520px]:flex-col
                      min-[650px]:flex-row
                      min-[767px]:flex-col
                      min-[815px]:flex-row
                      md:mt-[25px] md:gap-4"
                        >
                            <Button className="!px-4 !font-medium w-full"
                                text={pending ? "Sending..." : "Send Interest"}
                                onPress={() => act(() => sendInterest(profileId))}
                                iconLeft={<SendInterestMsgIcon className="h-5 w-5" />}
                            />
                            <Button
                                onPress={handleShortlist}
                                className="!px-4 !font-medium w-full !text-[#B31B38] border border-[#B31B38] !bg-[#FFE9E2] hover:!bg-[#FFE4E9] active:!bg-[#FFD6DE]"
                                text={shortlisted ? "Remove" : "Add to shortlist"}
                                iconLeft={shortlisted
                                    ? <ShortlistRemoveIcon className="h-5 w-5" />
                                    : <ShortlistedIcon className="h-5 w-5" />
                                }
                            />
                        </div>
                    </CardShell>
                    {showLimitPopup && <EliteUpgradePopup trigger="daily_limit" onClose={() => setShowLimitPopup(false)} />}
                </>
            );
        }

        if (sendCount === 1 && !effectiveIsReminderDue) {
            // First interest sent, 3-day wait not yet over — show countdown
            const reminderAt = lastSentAt ? new Date(new Date(lastSentAt).getTime() + 3 * 24 * 60 * 60 * 1000) : null;
            const countdownText = reminderAt ? formatCountdown(reminderAt) : null;
            return (
                <CardShell>
                    <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                    <div className="max-[500px]:mt-2 mt-3 md:mt-4">
                        <MessageRow
                            side="outgoing"
                            avatarSrc={myPhoto}
                            bubbles={[interestText]}
                        />
                    </div>
                    <div className="max-[500px]:mt-3 mt-5 text-center font-poppins text-[14px] md:text-[16px] font-medium leading-[150%] text-dark">
                        Interest sent · Awaiting response.
                    </div>
                    {countdownText && (
                        <div className="max-[500px]:mt-0 mt-1 text-center font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-primary">
                            You can send a reminder in {countdownText}.
                        </div>
                    )}
                </CardShell>
            );
        }

        if (sendCount === 1 && effectiveIsReminderDue) {
            // 3 days passed — show Send reminder button
            return (
                <CardShell>
                    <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                    <div className="max-[500px]:mt-2 mt-4">
                        <MessageRow
                            side="outgoing"
                            avatarSrc={myPhoto}
                            bubbles={[interestText]}
                        />
                    </div>
                    <div className="max-[500px]:mt-3 mt-5 text-center font-poppins text-[14px] md:text-[16px] font-medium leading-[150%] text-dark">
                        Interest sent · Awaiting response.
                    </div>
                    <div className="max-[500px]:mt-2 mt-3 flex justify-center">
                        <Button
                            text={pending ? "Sending..." : "Send reminder"}
                            onPress={() => act(() => sendInterest(profileId))}
                            iconLeft={<NotificationIcon className="h-4 w-4 md:h-5 md:w-5" />}
                            className="!px-4 !font-medium"
                        />
                    </div>
                </CardShell>
            );
        }

        // sendCount >= 2 — reminder already sent, no more actions
        return (
            <CardShell>
                <SectionTitle title={`You sent a priority interest to ${profileName}`} />
                <div className="max-[500px]:mt-2 mt-4 flex flex-col gap-4">
                    <MessageRow
                        side="outgoing"
                        avatarSrc={myPhoto}
                        bubbles={[interestText, FOLLOW_UP]}
                    />
                </div>
                <div className="max-[500px]:mt-3 mt-5 text-center font-poppins text-[14px] md:text-[16px] font-medium leading-[150%] text-dark">
                    Reminder sent · Awaiting response.
                </div>
            </CardShell>
        );
    }

    if (mutualAccepted || (status === "sent" && isAccepted)) {
        return (
            <CardShell>
                <SectionTitle title={`🎉 ${profileName} has accepted your interest!`} />

                <div className="max-[500px]:mt-2 mt-4 flex flex-col max-[500px]:gap-2 gap-4">
                    <MessageRow
                        side="outgoing"
                        avatarSrc={myPhoto}
                        bubbles={sendCount >= 2 ? [interestText, FOLLOW_UP] : [interestText]}
                    />

                    <MessageRow
                        side="incoming"
                        avatarSrc={theirPhoto}
                        bubbles={[ACCEPT_REPLY]}
                    />
                </div>

                <div className="max-[500px]:mt-5 mt-9 flex justify-center">
                    <PartyIcon />
                </div>

                {isElite ? (
                    <>
                        <div className="max-[500px]:mt-2 mt-3 md:mt-4 text-center font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                            Congratulations! You are both a mutual match. Don&apos;t keep {her} waiting - make the first move and start your beautiful journey together.
                        </div>

                        <div className="max-[500px]:mt-2 mt-4 flex justify-center">
                            <Button
                                text="Chat on WhatsApp"
                                iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
                                className="md:!px-6 !px-4 !font-medium"
                                onPress={() => {
                                    if (!phone) return;
                                    window.open(`https://wa.me/${phone.replace(/\D/g, "")}`, "_blank");
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="max-[500px]:mt-2 mt-4 text-center font-poppins text-[14px] md:text-[16px] font-medium leading-[150%] text-primary">
                            {she} accepted! Upgrade to Elite to see {her} contact.
                        </div>

                        <div className="max-[500px]:mt-2 mt-4 flex justify-center">
                            <Button
                                text="Upgrade & connect now"
                                className="!px-4 !font-medium"
                                onPress={() => router.push("/elite-upgrade")}
                            />
                        </div>

                        <div className="max-[500px]:mt-2 mt-6 text-center font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                            Congratulations! You are both a mutual match. Don&apos;t keep {her} waiting - make the first move and start your beautiful journey together.
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

                <div className="max-[500px]:mt-2 mt-4">
                    <MessageRow
                        side="incoming"
                        avatarSrc={theirPhoto}
                        bubbles={
                            receivedCount >= 2
                                ? [incomingText, FOLLOW_UP]
                                : [incomingText]
                        }
                    />
                </div>

                <div className="max-[500px]:mt-3 mt-5 flex gap-4 max-[520px]:flex-col">
                    <Button
                        text={pending ? "Loading..." : "Accept"}
                        onPress={() => act(() => respondToInterest(profileId, "accept"))}
                        iconLeft={<CheckmarkIcon className="w-4 sm:w-4.5 md:w-5 lg:w-6 h-4 sm:h-4.5 md:h-5 lg:h-6" />}
                        className="!px-4 flex-1"
                    />
                    <Button
                        text={pending ? "Loading..." : "Decline"}
                        onPress={() => act(() => respondToInterest(profileId, "decline"))}
                        iconLeft={<CgClose className="w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5" />}
                        className="!px-4 flex-1 !bg-[#FFF] border border-[#B31B38] !text-[#B31B38] hover:!bg-gray-50 active:!bg-gray-100"
                    />
                </div>
            </CardShell>
        );
    }

    return (
        <CardShell>
            <SectionTitle title={`🎉 It's a mutual match!`} red/>

            <div className="max-[500px]:mt-2 mt-4 flex flex-col max-[500px]:gap-2 gap-4">
                <MessageRow
                    side="incoming"
                    avatarSrc={theirPhoto}
                    bubbles={receivedCount >= 2 ? [incomingText, FOLLOW_UP] : [incomingText]}
                />

                <MessageRow
                    side="outgoing"
                    avatarSrc={myPhoto}
                    bubbles={[ACCEPT_REPLY]}
                />
            </div>

            <div className="max-[500px]:mt-5 mt-9 flex justify-center">
                <PartyIcon />
            </div>

            {isElite ? (
                <>
                    <div className="max-[500px]:mt-2 mt-4 text-center font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                        Congratulations! You are both a mutual match. Don&apos;t keep {her} waiting - send the first message and start your beautiful journey together.
                    </div>

                    <div className="max-[500px]:mt-2 mt-4 flex justify-center">
                        <Button
                            text="Chat on WhatsApp"
                            iconLeft={<FaWhatsapp className="h-4 w-4 md:h-5 md:w-5" />}
                            className="md:!px-6 !px-4 !font-medium"
                        />
                    </div>
                </>
            ) : (
                <>
                    <div className="mt-3 md:mt-4 text-center font-poppins text-[14px] md:text-[16px] font-medium leading-[150%] text-primary">
                        You accepted! Upgrade to Elite to see {her} contact.
                    </div>

                    <div className="mt-3 md:mt-4 flex justify-center">
                        <Button text="Upgrade & connect now" className="!px-4 !font-medium" onPress={() => router.push("/elite-upgrade")} />
                    </div>

                    <div className="mt-5 md:mt-7 text-center font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                        Congratulations! You are both a mutual match. Don&apos;t keep {her} waiting - make the first move and start your beautiful journey together.
                    </div>
                </>
            )}
        </CardShell>
    );
}

function CardShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-[16px] bg-[#FFE9E2] max-[500px]:p-3 p-4 md:p-5">
            {children}
        </div>
    );
}

function SectionTitle({ title, red }: { title: string; red?: boolean }) {
    return (
        <div className={`font-poppins text-[16px] sm:text-[18px] md:text-[20px] font-bold leading-[150%] ${red ? "text-[#B31B38]" : "text-dark"}`}>
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
            className={`flex w-full flex-1 items-center justify-left bg-white px-2 sm:px-3 py-3 sm:py-4 md:py-5 ${radiusClass}`}
        >
            <p className="font-poppins text-[14px] md:text-[16px] font-normal leading-[150%] text-dark">
                {text}
            </p>
        </div>
    );
}

function Avatar({ src }: { src: string }) {
    return (
        <div className="shrink-0 relative h-8 sm:h-10 md:h-12 lg:h-14 w-8 sm:w-10 md:w-12 lg:w-14 rounded-full overflow-hidden bg-[#D9D9D9]">
            <ProtectedPhoto
                src={src}
                alt="profile"
                width={64}
                height={64}
                className="w-full h-full object-cover"
                watermark=""
            />
        </div>
    );
}

function formatCountdown(until: Date): string {
    const msLeft = until.getTime() - Date.now();
    if (msLeft <= 0) return "0 hours";
    const totalHours = Math.floor(msLeft / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    if (days > 0) return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
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