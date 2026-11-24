
/* =========================================
   AETHER — CUSTOM CURSOR SYSTEM
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // DEVICE & MOTION CHECK
    // =====================================

    const hasFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!hasFinePointer || prefersReducedMotion) return;


    // =====================================
    // CREATE CURSOR ELEMENTS
    // =====================================

    const cursor = document.createElement("div");
    const cursorDot = document.createElement("div");

    cursor.className = "custom-cursor";
    cursorDot.className = "cursor-dot";

    cursor.setAttribute("aria-hidden", "true");
    cursorDot.setAttribute("aria-hidden", "true");

    document.body.append(cursor, cursorDot);

    // Enable custom cursor only after creation
    document.body.classList.add("has-custom-cursor");


    // =====================================
    // CURSOR STATE
    // =====================================

    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    let animationFrame = null;
    let isPointerActive = false;


    // =====================================
    // CURSOR MOVEMENT
    // =====================================

    const animateCursor = () => {

        const easing = 0.18;

        cursorX += (mouseX - cursorX) * easing;
        cursorY += (mouseY - cursorY) * easing;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        const distance = Math.hypot(
            mouseX - cursorX,
            mouseY - cursorY
        );

        if (distance > 0.5 && isPointerActive) {

            animationFrame = requestAnimationFrame(animateCursor);

        } else {

            cursorX = mouseX;
            cursorY = mouseY;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            animationFrame = null;

        }

    };


    const startCursorAnimation = () => {

        if (animationFrame !== null) return;

        animationFrame = requestAnimationFrame(animateCursor);

    };


    const stopCursorAnimation = () => {

        if (animationFrame === null) return;

        cancelAnimationFrame(animationFrame);

        animationFrame = null;

    };


    // =====================================
    // POINTER TRACKING
    // =====================================

    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        isPointerActive = true;

        cursor.classList.add("cursor-visible");
        cursorDot.classList.add("cursor-visible");

        startCursorAnimation();

    });


    // =====================================
    // POINTER LEAVE
    // =====================================

    document.addEventListener("mouseleave", () => {

        isPointerActive = false;

        cursor.classList.remove(
            "cursor-visible",
            "cursor-hover"
        );

        cursorDot.classList.remove("cursor-visible");

        stopCursorAnimation();

    });


    // =====================================
    // HOVER EFFECT
    // =====================================

    const interactiveSelector = [
        "a",
        "button",
        ".feature-card",
        "input",
        "textarea",
        "select",
        "[role='button']",
        "[data-cursor-hover]"
    ].join(",");


    document.addEventListener("mouseover", event => {

        if (!(event.target instanceof Element)) return;

        if (event.target.closest(interactiveSelector)) {
            cursor.classList.add("cursor-hover");
        }

    });


    document.addEventListener("mouseout", event => {

        if (!(event.target instanceof Element)) return;

        const currentElement = event.target.closest(
            interactiveSelector
        );

        const nextElement = event.relatedTarget instanceof Element
            ? event.relatedTarget.closest(interactiveSelector)
            : null;

        if (currentElement && !nextElement) {
            cursor.classList.remove("cursor-hover");
        }

    });


    // =====================================
    // MAGNETIC EFFECT
    // =====================================

    const magneticElements = document.querySelectorAll(
        ".magnetic, .btn-primary, .btn-secondary"
    );

    magneticElements.forEach(element => {

        element.addEventListener("mousemove", event => {

            const rect = element.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            element.style.setProperty(
                "--magnetic-x",
                `${x * 0.12}px`
            );

            element.style.setProperty(
                "--magnetic-y",
                `${y * 0.12}px`
            );

        });


        element.addEventListener("mouseleave", () => {

            element.style.removeProperty("--magnetic-x");
            element.style.removeProperty("--magnetic-y");

        });

    });


    // =====================================
    // WINDOW BLUR
    // =====================================

    window.addEventListener("blur", () => {

        isPointerActive = false;

        cursor.classList.remove(
            "cursor-visible",
            "cursor-hover"
        );

        cursorDot.classList.remove("cursor-visible");

        stopCursorAnimation();

    });


    // =====================================
    // WINDOW FOCUS
    // =====================================

    window.addEventListener("focus", () => {

        isPointerActive = false;

        cursor.classList.remove(
            "cursor-visible",
            "cursor-hover"
        );

        cursorDot.classList.remove("cursor-visible");

    });

});
