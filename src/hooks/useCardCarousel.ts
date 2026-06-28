import { useRef, useEffect } from "react";

interface UseCardCarouselOptions {
    cardWidth: number;   // px width of one card
    cardGap: number;     // px gap between cards
    totalCards: number;  // number of real cards (duplicates handled internally)
    interval?: number;   // ms between auto-advances (default 3000)
}

export function useCardCarousel({
    cardWidth,
    cardGap,
    totalCards,
    interval = 3000,
}: UseCardCarouselOptions) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const paused = useRef(false);
    const dragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);
    const currentIndex = useRef(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const CARD_WIDTH = cardWidth + cardGap;
        const TOTAL = totalCards;

        function advance() {
            if (paused.current || !el) return;
            currentIndex.current += 1;
            el.scrollTo({ left: currentIndex.current * CARD_WIDTH, behavior: "smooth" });

            if (currentIndex.current >= TOTAL) {
                setTimeout(() => {
                    currentIndex.current = currentIndex.current - TOTAL;
                    el.scrollTo({ left: currentIndex.current * CARD_WIDTH, behavior: "instant" });
                }, 500);
            }
        }

        intervalRef.current = setInterval(advance, interval);

        function onMouseDown(e: MouseEvent) {
            const node = wrapperRef.current;
            if (!node) return;
            dragging.current = true;
            paused.current = true;
            dragStartX.current = e.clientX;
            dragStartScroll.current = node.scrollLeft;
            node.style.cursor = "grabbing";
            e.preventDefault();
        }

        function onMouseMove(e: MouseEvent) {
            const node = wrapperRef.current;
            if (!dragging.current || !node) return;
            node.scrollLeft = dragStartScroll.current - (e.clientX - dragStartX.current);
        }

        function onMouseUp() {
            const node = wrapperRef.current;
            if (!dragging.current) return;
            dragging.current = false;
            paused.current = false;
            if (node) {
                node.style.cursor = "";
                const nearest = Math.round(node.scrollLeft / CARD_WIDTH);
                currentIndex.current = nearest % TOTAL;
                node.scrollTo({ left: nearest * CARD_WIDTH, behavior: "smooth" });
            }
        }

        const pause = () => { if (!dragging.current) paused.current = true; };
        const resume = () => { if (!dragging.current) paused.current = false; };

        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        el.addEventListener("mouseenter", pause);
        el.addEventListener("mouseleave", resume);
        el.addEventListener("touchstart", pause, { passive: true });
        el.addEventListener("touchend", resume);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            el.removeEventListener("mouseenter", pause);
            el.removeEventListener("mouseleave", resume);
            el.removeEventListener("touchstart", pause);
            el.removeEventListener("touchend", resume);
        };
    }, [cardWidth, cardGap, totalCards, interval]);

    return wrapperRef;
}
