import { RefObject, useEffect } from "react";

export function useDragScroll(ref: RefObject<HTMLDivElement | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let dragging = false;
        let startX = 0;
        let startScroll = 0;

        function onMouseDown(e: MouseEvent) {
            dragging = true;
            startX = e.clientX;
            startScroll = el!.scrollLeft;
            e.preventDefault();
        }

        function onMouseMove(e: MouseEvent) {
            if (!dragging) return;
            el!.scrollLeft = startScroll - (e.clientX - startX);
        }

        function onMouseUp() {
            if (!dragging) return;
            dragging = false;
        }

        el.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            el.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [ref]);
}
