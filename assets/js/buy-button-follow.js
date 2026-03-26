(function() {
    function initBuyButtonFollow(container, options = {}) {
        const button = container.querySelector('.cta');
        if (!button || button.dataset.buyFollow === 'true') return;

        button.dataset.buyFollow = 'true';
        button.style.position = 'absolute';
        button.style.transform = 'translate(-50%, -50%)';
        button.style.left = '-1000px';
        button.style.top = '-1000px';
        button.style.pointerEvents = 'auto';

        const speed = Number(options.speed) || 400; // px per second

        let targetX = -1000;
        let targetY = -1000;
        let currentX = -1000;
        let currentY = -1000;
        let lastTimestamp = null;
        let firstFrame = false;
        let hasMousePosition = false;
        let lastClientX = 0;
        let lastClientY = 0;

        function updateTarget(event) {
            lastClientX = event.clientX;
            lastClientY = event.clientY;
            targetX = event.pageX;
            targetY = event.pageY;
        }

        function updateTargetOnScroll() {
            if (hasMousePosition) {
                targetX = lastClientX + window.pageXOffset;
                targetY = lastClientY + window.pageYOffset;
            }

            if (!firstFrame) {
                currentX = targetX;
                currentY = targetY;
                firstFrame = true;
            }
        }

        function frame(timestamp) {
            if (lastTimestamp === null) lastTimestamp = timestamp;
            const dt = timestamp - lastTimestamp;
            lastTimestamp = timestamp;

            const dx = targetX - currentX;
            const dy = targetY - currentY;
            const distance = Math.hypot(dx, dy);

            if (distance > 0.5) {
                const step = Math.min(speed * (dt / 1000), distance);
                const ratio = step / distance;
                currentX += dx * ratio;
                currentY += dy * ratio;
            } else {
                currentX = targetX;
                currentY = targetY;
            }

            const halfW = button.offsetWidth / 2;
            const halfH = button.offsetHeight / 2;

            const maxX = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - halfW;
            const maxY = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - halfH;

            const minX = halfW;
            const minY = halfH;

            const clampedX = Math.min(Math.max(currentX, minX), maxX);
            const clampedY = Math.min(Math.max(currentY, minY), maxY);

            button.style.left = `${clampedX}px`;
            button.style.top = `${clampedY}px`;

            requestAnimationFrame(frame);
        }

        document.addEventListener('mousemove', updateTarget);
        document.addEventListener('scroll', updateTargetOnScroll, { passive: true });
        requestAnimationFrame(frame);
    }

    function enqueueBuyButtonFollow(container, options = { speed: 450 }) {
        // Keep this API for callers that have explicit control.
        if (typeof initBuyButtonFollow === 'function') {
            initBuyButtonFollow(container, options);
        }
    }

    function autoStart() {
        const targetContainer = document.getElementById('purchase');
        if (targetContainer) {
            enqueueBuyButtonFollow(targetContainer, { speed: 450 });
        }
    }

    // Run on initial load if possible
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        autoStart();
    } else {
        document.addEventListener('DOMContentLoaded', autoStart);
    }

    // Also run after components are dynamically loaded
    document.addEventListener('importComponentsReady', autoStart);

    window.initBuyButtonFollow = initBuyButtonFollow;
    window.enqueueBuyButtonFollow = enqueueBuyButtonFollow;
})();