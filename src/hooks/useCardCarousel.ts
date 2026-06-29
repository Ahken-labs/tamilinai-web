import { useRef, useEffect } from "react";

interface UseCardCarouselOptions {
    cardWidth: number;
    cardGap: number;
    totalCards: number;
    interval?: number;
    resumeDelay?: number;
}

export function useCardCarousel({
    cardWidth,
    cardGap,
    totalCards,
    interval = 3000,
    resumeDelay = 10000,
}: UseCardCarouselOptions) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current) return;
        const el = wrapperRef.current as HTMLDivElement;

        const STEP = cardWidth + cardGap;
        const SET = totalCards * STEP; // width of one full set of cards

        // Start in the middle set so user can scroll left or right infinitely
        el.scrollLeft = SET;

        let autoTimer: ReturnType<typeof setInterval> | null = null;
        let resumeTimer: ReturnType<typeof setTimeout> | null = null;
        let dragging = false;
        let dragStartX = 0;
        let dragStartScroll = 0;

        function onScroll() {
            if (el.scrollLeft < SET * 0.5) {
                el.scrollLeft += SET;
            } else if (el.scrollLeft >= SET * 1.5) {
                el.scrollLeft -= SET;
            }
        }

        function startAuto() {
            if (autoTimer) clearInterval(autoTimer);
            autoTimer = setInterval(() => {
                el.scrollTo({ left: el.scrollLeft + STEP, behavior: "smooth" });
            }, interval);
        }

        function stopAndResumeLater() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
            if (resumeTimer) clearTimeout(resumeTimer);
            resumeTimer = setTimeout(() => startAuto(), resumeDelay);
        }

        function onMouseDown(e: MouseEvent) {
            dragging = true;
            stopAndResumeLater();
            dragStartX = e.clientX;
            dragStartScroll = el.scrollLeft;
            e.preventDefault();
        }
        function onMouseMove(e: MouseEvent) {
            if (!dragging) return;
            el.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
        }
        function onMouseUp() {
            if (!dragging) return;
            dragging = false;
        }

        function onMouseEnter() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }
        function onMouseLeave() {
            if (!dragging) startAuto();
        }

        startAuto();

        el.addEventListener("scroll", onScroll, { passive: true });
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        el.addEventListener("touchstart", stopAndResumeLater, { passive: true });
        el.addEventListener("wheel", stopAndResumeLater, { passive: true });

        return () => {
            if (autoTimer) clearInterval(autoTimer);
            if (resumeTimer) clearTimeout(resumeTimer);
            el.removeEventListener("scroll", onScroll);
            el.removeEventListener("mouseenter", onMouseEnter);
            el.removeEventListener("mouseleave", onMouseLeave);
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            el.removeEventListener("touchstart", stopAndResumeLater);
            el.removeEventListener("wheel", stopAndResumeLater);
        };
    }, [cardWidth, cardGap, totalCards, interval, resumeDelay]);

    return wrapperRef;
}
