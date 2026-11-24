
/* =========================================
   AETHER — MAIN SCRIPT
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // INITIALIZATION
    // =====================================

    const root = document.documentElement;

    root.classList.add("js-enabled");

    console.log(
        "%c AETHER ",
        [
            "background: #6366f1",
            "color: #ffffff",
            "font-weight: bold",
            "padding: 5px 10px",
            "border-radius: 4px"
        ].join(";")
    );

    console.log("AETHER initialized successfully.");


    // =====================================
    // CURRENT YEAR
    // =====================================

    const yearElements = document.querySelectorAll(
        "[data-current-year]"
    );

    if (yearElements.length) {

        const currentYear = new Date().getFullYear();

        yearElements.forEach(element => {

            element.textContent = String(currentYear);

        });

    }


    // =====================================
    // PAGE READY
    // =====================================

    root.classList.add("page-ready");

});
