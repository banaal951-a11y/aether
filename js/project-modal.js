
/* =========================================
   AETHER — PROJECT MODAL SYSTEM
   VERSION 2.0
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const modal = document.getElementById("project-modal");

    if (!modal) return;

    const openButtons = document.querySelectorAll(".project-open");

    const closeButton = modal.querySelector(".modal-close");

    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalCategory = document.getElementById("modal-category");
    const modalDescription = document.getElementById("modal-description");

    // Validate required elements
    if (
        !closeButton ||
        !modalImage ||
        !modalTitle ||
        !modalCategory ||
        !modalDescription
    ) {
        console.error("AETHER: Project modal elements are incomplete.");
        return;
    }

    // Browser compatibility
    if (typeof modal.showModal !== "function") {
        console.error("AETHER: HTML Dialog API is not supported.");
        return;
    }

    let lastFocusedElement = null;


    // =====================================
    // OPEN MODAL
    // =====================================

    const openModal = (button) => {

        if (modal.open) return;

        const title = button.dataset.title || "Untitled Project";
        const category = button.dataset.category || "PROJECT";
        const description = button.dataset.description || "No description available.";
        const image = button.dataset.image || "";

        lastFocusedElement = button;

        // Update modal content
        modalTitle.textContent = title;
        modalCategory.textContent = category;
        modalDescription.textContent = description;

        // Reset image before loading another project
        modalImage.removeAttribute("src");
        modalImage.alt = `${title} project preview`;

        if (image) {

            modalImage.src = image;

            modalImage.onerror = () => {
                modalImage.removeAttribute("src");
                modalImage.alt = `${title} preview unavailable`;
            };

        } else {

            modalImage.removeAttribute("src");

        }

        // Display modal
        modal.showModal();

    };


    // =====================================
    // CLOSE MODAL
    // =====================================

    const closeModal = () => {

        if (modal.open) {

            modal.close();

        }

    };


    // =====================================
    // OPEN BUTTON EVENTS
    // =====================================

    openButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            openModal(button);

        });

    });


    // =====================================
    // CLOSE BUTTON EVENT
    // =====================================

    closeButton.addEventListener("click", closeModal);


    // =====================================
    // CLICK OUTSIDE MODAL
    // =====================================

    modal.addEventListener("click", event => {

        if (event.target === modal) {

            closeModal();

        }

    });


    // =====================================
    // RESTORE FOCUS
    // =====================================

    modal.addEventListener("close", () => {

        if (
            lastFocusedElement &&
            document.contains(lastFocusedElement)
        ) {

            lastFocusedElement.focus();

        }

        lastFocusedElement = null;

    });


    // =====================================
    // ESCAPE KEY
    // =====================================

    modal.addEventListener("cancel", () => {

        // Native dialog handles Escape automatically.
        // This listener is intentionally kept for future extensions.

    });

});
