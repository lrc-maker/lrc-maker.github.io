export default (() => {
    const duration = 468;
    const getNow = performance || Date;
    const ease = (k) => {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    };
    const rafID = {
        current: 0,
    };
    const cancelScroll = () => {
        cancelAnimationFrame(rafID.current);
        cleanEventListener();
    };
    const listenerOptions = {
        passive: true,
        once: true,
    };
    const atachEventListener = () => {
        window.addEventListener("wheel", cancelScroll, listenerOptions);
        window.addEventListener("touchmove", cancelScroll, listenerOptions);
    };
    const cleanEventListener = () => {
        window.removeEventListener("wheel", cancelScroll);
        window.removeEventListener("touchmove", cancelScroll);
    };
    const step = (context) => {
        const time = getNow.now();
        const { startTime, startX, startY, stopY } = context;
        const elapsed = (time - startTime) / duration;
        if (elapsed >= 1) {
            context.method(startX, stopY);
            cleanEventListener();
            return;
        }
        const value = ease(elapsed);
        const currentY = startY + (stopY - startY) * value;
        context.method(startX, currentY);
        if (currentY !== stopY) {
            rafID.current = requestAnimationFrame(() => step(context));
        }
    };
    const scrollingElement = document.scrollingElement || document.documentElement;
    Element.prototype.scrollIntoView = function () {
        const { top, bottom } = this.getBoundingClientRect();
        const center = (top + bottom) / 2;
        const viewportHeight = window.visualViewport ? window.visualViewport.height : innerHeight;
        const startX = scrollingElement.scrollLeft;
        const startY = scrollingElement.scrollTop;
        const stopY = startY + center - viewportHeight / 2;
        cancelAnimationFrame(rafID.current);
        atachEventListener();
        step({
            method: (x, y) => window.scroll(x, y),
            startTime: getNow.now(),
            startX,
            startY,
            stopY,
        });
    };
})();
//# sourceMappingURL=smooth-scroll.js.map