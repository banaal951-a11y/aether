
/* =========================================
   AETHER — CONTACT FORM SYSTEM
   VERSION 2.1
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENT REFERENCES
    // =====================================

    const form = document.getElementById("contact-form");

    if (!form) return;

    const submitButton = document.getElementById("submit-button");
    const buttonText = submitButton?.querySelector(".button-text");
    const status = document.getElementById("form-status");

    if (!submitButton || !buttonText || !status) {

        console.error(
            "AETHER: Contact form elements are incomplete."
        );

        return;

    }

    let isSubmitting = false;


    // =====================================
    // STATUS HELPER
    // =====================================

    const showStatus = (message, type = "") => {

        status.textContent = message;
        status.className = "form-status";

        if (type) {
            status.classList.add(type);
        }

        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");

    };


    // =====================================
    // ENDPOINT VALIDATION
    // =====================================

    const isValidEndpoint = () => {

        try {

            const endpoint = new URL(form.action);

            return (
                endpoint.protocol === "https:" &&
                endpoint.hostname === "formspree.io" &&
                endpoint.pathname.startsWith("/f/") &&
                endpoint.pathname.length > 3
            );

        } catch {

            return false;

        }

    };


    // =====================================
    // FORM SUBMISSION
    // =====================================

    form.addEventListener("submit", async event => {

        event.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) return;

        // Native browser validation
        if (!form.reportValidity()) return;

        // Validate Formspree endpoint
        if (!isValidEndpoint()) {

            showStatus(
                "The contact form is not configured correctly.",
                "error"
            );

            return;

        }

        // Honeypot protection
        const honeypot = form.querySelector('[name="_gotcha"]');

        if (honeypot && honeypot.value.trim() !== "") {
            return;
        }

        const originalText = buttonText.textContent;

        isSubmitting = true;

        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");

        buttonText.textContent = "Sending...";

        showStatus();


        // =================================
        // SEND DATA
        // =================================

        try {

            const response = await fetch(form.action, {

                method: "POST",

                body: new FormData(form),

                headers: {
                    Accept: "application/json"
                }

            });


            // =============================
            // PARSE RESPONSE
            // =============================

            const contentType = (
                response.headers.get("content-type") || ""
            );

            let result = {};

            if (contentType.includes("application/json")) {

                result = await response.json();

            }


            // =============================
            // HANDLE ERRORS
            // =============================

            if (!response.ok) {

                const errorMessage = Array.isArray(result.errors)
                    ? result.errors
                        .map(error => error.message)
                        .filter(Boolean)
                        .join(" ")
                    : "";

                throw new Error(
                    errorMessage ||
                    `Unable to send your message. Server returned ${response.status}.`
                );

            }


            // =============================
            // SUCCESS
            // =============================

            showStatus(
                "Message sent successfully! We'll get back to you soon.",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error(
                "AETHER Contact Form:",
                error
            );

            showStatus(
                error.message ||
                "Something went wrong. Please try again later.",
                "error"
            );

        } finally {

            // =============================
            // RESTORE BUTTON
            // =============================

            isSubmitting = false;

            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");

            buttonText.textContent = originalText;

        }

    });

});
