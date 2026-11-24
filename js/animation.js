
/* =========================================
   AETHER — ANIMATION SYSTEM
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // SETTINGS
    // =====================================

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const supportsIntersectionObserver =
        "IntersectionObserver" in window;


    // =====================================
    // SCROLL REVEAL
    // =====================================

    const revealElements = document.querySelectorAll(
        [
            ".intro-section",
            ".feature-section",
            ".statement-section",
            ".cta-section",
            ".feature-card",
            ".content-section"
        ].join(",")
    );

    if (
        prefersReducedMotion ||
        !supportsIntersectionObserver
    ) {

        revealElements.forEach(element => {
            element.classList.remove("reveal");
            element.classList.add("active");
        });

    } else if (revealElements.length) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("active");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    }


    // =====================================
    // COUNTER ANIMATION
    // =====================================

    const counters = document.querySelectorAll("[data-counter]");

    const animateCounter = counter => {

        if (counter.dataset.animated === "true") return;

        const target = Number(counter.dataset.counter);

        if (!Number.isFinite(target)) return;

        counter.dataset.animated = "true";

        if (prefersReducedMotion) {

            counter.textContent = target.toLocaleString();

            return;

        }

        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = currentTime => {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            const easedProgress = 1 - Math.pow(
                1 - progress,
                3
            );

            const currentValue = target * easedProgress;

            counter.textContent = Math.floor(
                currentValue
            ).toLocaleString();

            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target.toLocaleString();

            }

        };

        requestAnimationFrame(updateCounter);

    };


    // =====================================
    // COUNTER OBSERVER
    // =====================================

    if (
        supportsIntersectionObserver &&
        !prefersReducedMotion
    ) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(counter => {
            animateCounter(counter);
        });

    }

});
