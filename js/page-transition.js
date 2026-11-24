
/* =========================================
   AETHER — PAGE TRANSITION SYSTEM
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // SETTINGS
    // =====================================

    const TRANSITION_DURATION = 450;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;


    // =====================================
    // CREATE OVERLAY
    // =====================================

    const overlay = document.createElement("div");

    overlay.className = "page-transition";
    overlay.setAttribute("aria-hidden", "true");

    document.body.appendChild(overlay);


    // =====================================
    // TRANSITION STATE
    // =====================================

    let isTransitioning = false;
    let transitionTimer = null;


    // =====================================
    // ENTRANCE ANIMATION
    // =====================================

    requestAnimationFrame(() => {

        overlay.classList.add("is-visible");

        requestAnimationFrame(() => {

            window.setTimeout(() => {

                overlay.classList.remove("is-visible");

            }, 100);

        });

    });


    // =====================================
    // LINK VALIDATION
    // =====================================

    const shouldIgnoreLink = (link, url) => {

        const href = link.getAttribute("href") || "";

        const isExternal =
            url.origin !== window.location.origin;

        const isSpecialLink =
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            link.hasAttribute("data-no-transition") ||
            link.relList.contains("external") ||
            /^(mailto:|tel:|javascript:|data:|blob:)/i.test(href);

        const isSamePage =
            url.pathname === window.location.pathname &&
            url.search === window.location.search;

        const isHashNavigation =
            isSamePage &&
            url.hash !== "";

        const isCurrentPage =
            isSamePage &&
            url.hash === window.location.hash;

        return (
            isExternal ||
            isSpecialLink ||
            isHashNavigation ||
            isCurrentPage
        );

    };


    // =====================================
    // EXIT ANIMATION
    // =====================================

    document.addEventListener("click", event => {

        // Only handle ordinary left-clicks
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) return;

        // Ensure the target is an HTML element
        if (!(event.target instanceof Element)) return;

        const link = event.target.closest("a[href]");

        if (!link) return;

        // Ignore links opening another browsing context
        if (link.target && link.target !== "_self") return;

        let url;

        try {

            url = new URL(
                link.getAttribute("href"),
                window.location.href
            );

        } catch {

            return;

        }

        if (shouldIgnoreLink(link, url)) return;

        // Prevent repeated navigation
        if (isTransitioning) {
            event.preventDefault();
            return;
        }

        event.preventDefault();

        isTransitioning = true;

        overlay.classList.add("is-visible");

        transitionTimer = window.setTimeout(() => {

            window.location.assign(url.href);

        }, TRANSITION_DURATION);

    });


    // =====================================
    // BROWSER BACK / FORWARD
    // =====================================

    window.addEventListener("pageshow", () => {

        isTransitioning = false;

        if (transitionTimer !== null) {

            window.clearTimeout(transitionTimer);

            transitionTimer = null;

        }

        overlay.classList.remove("is-visible");

    });


    // =====================================
    // PAGE HIDE CLEANUP
    // =====================================

    window.addEventListener("pagehide", () => {

        if (transitionTimer !== null) {

            window.clearTimeout(transitionTimer);

            transitionTimer = null;

        }

    });

});
