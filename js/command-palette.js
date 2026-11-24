
/* =========================================
   AETHER — COMMAND PALETTE
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // PAGE DATABASE
    // =====================================

    const pages = [
        {
            name: "Home",
            url: "index.html",
            keywords: "home beranda main"
        },
        {
            name: "About",
            url: "about.html",
            keywords: "about profile profil concept"
        },
        {
            name: "Explore",
            url: "explore.html",
            keywords: "explore discovery discover technology"
        },
        {
            name: "Projects",
            url: "projects.html",
            keywords: "projects portfolio work karya experiments"
        },
        {
            name: "Insights",
            url: "insights.html",
            keywords: "insights articles blog journal thoughts"
        },
        {
            name: "Contact",
            url: "contact.html",
            keywords: "contact email message kontak"
        }
    ];


    // =====================================
    // CREATE PALETTE
    // =====================================

    const palette = document.createElement("div");

    palette.className = "command-palette";
    palette.setAttribute("aria-hidden", "true");

    palette.innerHTML = `
        <div class="command-backdrop"></div>

        <div
            class="command-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-title"
            aria-describedby="command-help"
        >

            <div class="command-search">

                <span aria-hidden="true">⌕</span>

                <label
                    id="command-title"
                    class="sr-only"
                    for="command-input"
                >
                    Search AETHER pages
                </label>

                <input
                    id="command-input"
                    type="text"
                    placeholder="Search pages..."
                    autocomplete="off"
                    aria-label="Search pages"
                    aria-controls="command-results"
                    aria-autocomplete="list"
                >

                <kbd>ESC</kbd>

            </div>

            <div
                class="command-results"
                id="command-results"
                role="listbox"
                aria-label="Available pages"
            ></div>

            <div
                class="command-footer"
                id="command-help"
            >
                <span>↑ ↓ Navigate</span>
                <span>↵ Open</span>
                <span>ESC Close</span>
            </div>

        </div>
    `;

    document.body.appendChild(palette);


    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const input = palette.querySelector("#command-input");
    const results = palette.querySelector(".command-results");
    const backdrop = palette.querySelector(".command-backdrop");
    const dialog = palette.querySelector(".command-box");

    let selectedIndex = 0;
    let filteredPages = [...pages];
    let lastFocusedElement = null;


    // =====================================
    // PAGE URL HELPER
    // =====================================

    const getPageUrl = page => {

        return new URL(
            page.url,
            document.baseURI
        ).href;

    };


    // =====================================
    // RENDER RESULTS
    // =====================================

    function renderResults() {

        const query = input.value
            .toLowerCase()
            .trim();

        filteredPages = pages.filter(page => {

            const searchableText = (
                `${page.name} ${page.keywords}`
            ).toLowerCase();

            return searchableText.includes(query);

        });

        selectedIndex = 0;

        results.replaceChildren();

        if (!filteredPages.length) {

            const emptyMessage = document.createElement("p");

            emptyMessage.className = "command-empty";
            emptyMessage.textContent = "No results found.";

            results.appendChild(emptyMessage);

            input.removeAttribute("aria-activedescendant");

            return;

        }

        const fragment = document.createDocumentFragment();

        filteredPages.forEach((page, index) => {

            const item = document.createElement("a");

            item.className = "command-item";
            item.href = getPageUrl(page);
            item.textContent = page.name;

            item.id = `command-option-${index}`;

            item.setAttribute("role", "option");
            item.setAttribute("aria-selected", "false");
            item.setAttribute("tabindex", "-1");

            fragment.appendChild(item);

        });

        results.appendChild(fragment);

        updateSelection();

    }


    // =====================================
    // UPDATE SELECTION
    // =====================================

    function updateSelection() {

        const items = results.querySelectorAll(".command-item");

        items.forEach((item, index) => {

            const isSelected = index === selectedIndex;

            item.classList.toggle("selected", isSelected);

            item.setAttribute(
                "aria-selected",
                String(isSelected)
            );

        });

        const selectedItem = items[selectedIndex];

        if (selectedItem) {

            input.setAttribute(
                "aria-activedescendant",
                selectedItem.id
            );

            selectedItem.scrollIntoView({
                block: "nearest"
            });

        } else {

            input.removeAttribute("aria-activedescendant");

        }

    }


    // =====================================
    // NAVIGATE TO PAGE
    // =====================================

    function navigateToPage(page) {

        if (!page) return;

        const destination = getPageUrl(page);

        const currentPage = new URL(window.location.href);
        const targetPage = new URL(destination);

        if (targetPage.href === currentPage.href) {

            closePalette();

            return;

        }

        // Use the actual link so page-transition.js
        // can handle the navigation animation.

        const selectedItem = results.querySelector(
            `#command-option-${selectedIndex}`
        );

        if (selectedItem) {
            selectedItem.click();
        }

    }


    // =====================================
    // OPEN PALETTE
    // =====================================

    function openPalette() {

        if (palette.classList.contains("active")) return;

        lastFocusedElement = document.activeElement;

        palette.classList.add("active");
        palette.setAttribute("aria-hidden", "false");

        input.value = "";

        renderResults();

        requestAnimationFrame(() => {

            input.focus();

        });

    }


    // =====================================
    // CLOSE PALETTE
    // =====================================

    function closePalette() {

        if (!palette.classList.contains("active")) return;

        palette.classList.remove("active");
        palette.setAttribute("aria-hidden", "true");

        input.value = "";

        if (
            lastFocusedElement &&
            typeof lastFocusedElement.focus === "function" &&
            document.contains(lastFocusedElement)
        ) {

            lastFocusedElement.focus();

        }

        lastFocusedElement = null;

    }


    // =====================================
    // KEYBOARD SHORTCUT
    // =====================================

    document.addEventListener("keydown", event => {

        const isShortcut =
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k";

        if (isShortcut) {

            event.preventDefault();

            if (palette.classList.contains("active")) {
                closePalette();
            } else {
                openPalette();
            }

            return;

        }

        if (!palette.classList.contains("active")) return;


        // Close with Escape
        if (event.key === "Escape") {

            event.preventDefault();

            closePalette();

            return;

        }


        // Keep keyboard focus inside the dialog
        if (event.key === "Tab") {

            event.preventDefault();

            input.focus();

            return;

        }


        // Navigate down
        if (event.key === "ArrowDown") {

            event.preventDefault();

            if (!filteredPages.length) return;

            selectedIndex = (
                selectedIndex + 1
            ) % filteredPages.length;

            updateSelection();

            return;

        }


        // Navigate up
        if (event.key === "ArrowUp") {

            event.preventDefault();

            if (!filteredPages.length) return;

            selectedIndex = (
                selectedIndex - 1 + filteredPages.length
            ) % filteredPages.length;

            updateSelection();

            return;

        }


        // Open selected page
        if (event.key === "Enter") {

            event.preventDefault();

            navigateToPage(
                filteredPages[selectedIndex]
            );

        }

    });


    // =====================================
    // SEARCH INPUT
    // =====================================

    input.addEventListener("input", renderResults);


    // =====================================
    // BACKDROP CLICK
    // =====================================

    backdrop.addEventListener("click", closePalette);


    // =====================================
    // INITIAL RENDER
    // =====================================

    renderResults();

});
