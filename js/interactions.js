
/* =========================================
   AETHER — INTERACTIONS
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // DEVICE CAPABILITY
    // =====================================

    const hasFinePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!hasFinePointer) return;


    // =====================================
    // FEATURE CARDS
    // =====================================

    const cards = document.querySelectorAll(".feature-card");

    if (!cards.length) return;


    // =====================================
    // CARD GLOW INTERACTION
    // =====================================

    cards.forEach(card => {

        card.addEventListener("pointermove", event => {

            if (event.pointerType === "touch") return;

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty(
                "--mouse-x",
                `${x}px`
            );

            card.style.setProperty(
                "--mouse-y",
                `${y}px`
            );

        });


        // =================================
        // RESET GLOW
        // =================================

        card.addEventListener("pointerleave", () => {

            card.style.removeProperty("--mouse-x");
            card.style.removeProperty("--mouse-y");

        });

    });

});
