
/* =========================================
   AETHER — NAVIGATION SYSTEM
   VERSION 2.0
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (!menuToggle || !navMenu) return;

    const desktopBreakpoint = 768;

    // =====================================
    // MENU STATE
    // =====================================

    const setMenuState = (isOpen) => {

        navMenu.classList.toggle("open", isOpen);
        menuToggle.classList.toggle("active", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    };


    // =====================================
    // TOGGLE MENU
    // =====================================

    menuToggle.addEventListener("click", (event) => {

        event.stopPropagation();

        const isOpen = navMenu.classList.contains("open");

        setMenuState(!isOpen);

    });


    // =====================================
    // CLOSE AFTER NAVIGATION
    // =====================================

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            setMenuState(false);

        });

    });


    // =====================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =====================================

    document.addEventListener("click", (event) => {

        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {

            setMenuState(false);

        }

    });


    // =====================================
    // CLOSE WITH ESCAPE
    // =====================================

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {

            if (navMenu.classList.contains("open")) {

                setMenuState(false);
                menuToggle.focus();

            }

        }

    });


    // =====================================
    // RESET ON DESKTOP
    // =====================================

    window.addEventListener("resize", () => {

        if (window.innerWidth > desktopBreakpoint) {

            setMenuState(false);

        }

    });


    // =====================================
    // INITIAL STATE
    // =====================================

    setMenuState(false);

});
