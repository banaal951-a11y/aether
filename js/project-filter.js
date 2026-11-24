
/* =========================================
   AETHER — PROJECT FILTER SYSTEM
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const filterContainer = document.getElementById("project-filters");

    if (!filterContainer) return;

    const projectCards = document.querySelectorAll(".feature-card");

    if (!projectCards.length) return;


    // =====================================
    // COLLECT PROJECT DATA
    // =====================================

    const projects = Array.from(projectCards)
        .map(card => {

            const openButton = card.querySelector(".project-open");

            if (!openButton) return null;

            const category = (
                card.dataset.category ||
                openButton.dataset.category ||
                ""
            ).trim();

            if (!category) return null;

            return {
                card,
                category
            };

        })
        .filter(Boolean);

    if (!projects.length) {
        filterContainer.replaceChildren();
        return;
    }


    // =====================================
    // GENERATE UNIQUE CATEGORIES
    // =====================================

    const uniqueCategories = [
        ...new Set(
            projects.map(project => project.category)
        )
    ];

    const categories = [
        {
            label: "All Projects",
            value: "all"
        },
        ...uniqueCategories.map(category => ({
            label: category,
            value: category
        }))
    ];


    // =====================================
    // FILTER CONTAINER SETUP
    // =====================================

    filterContainer.setAttribute("role", "group");
    filterContainer.setAttribute("aria-label", "Filter projects");

    filterContainer.replaceChildren();

    const fragment = document.createDocumentFragment();


    // =====================================
    // FILTER FUNCTION
    // =====================================

    const applyFilter = selectedFilter => {

        projects.forEach(project => {

            const shouldShow =
                selectedFilter === "all" ||
                project.category === selectedFilter;

            project.card.hidden = !shouldShow;

        });

    };


    // =====================================
    // CREATE FILTER BUTTONS
    // =====================================

    categories.forEach((category, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "filter-btn";

        button.textContent = category.label;
        button.dataset.filter = category.value;

        const isDefault = index === 0;

        button.classList.toggle("active", isDefault);

        button.setAttribute(
            "aria-pressed",
            String(isDefault)
        );


        // =================================
        // FILTER EVENT
        // =================================

        button.addEventListener("click", () => {

            const selectedFilter = button.dataset.filter;

            // Update active state
            filterContainer
                .querySelectorAll(".filter-btn")
                .forEach(filterButton => {

                    const isActive = filterButton === button;

                    filterButton.classList.toggle(
                        "active",
                        isActive
                    );

                    filterButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );

                });

            // Apply selected filter
            applyFilter(selectedFilter);

        });

        fragment.appendChild(button);

    });


    // =====================================
    // RENDER FILTER BUTTONS
    // =====================================

    filterContainer.appendChild(fragment);


    // =====================================
    // INITIAL STATE
    // =====================================

    applyFilter("all");

});
