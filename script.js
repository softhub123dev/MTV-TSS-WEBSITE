/* MUTOVU TSS — shared site interactions */
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // Mobile navigation works with both list-based and plain-anchor menus.
    const menuToggle = document.querySelector(".menu-toggle");
    const navigation = document.querySelector("header nav");

    if (menuToggle && navigation) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.addEventListener("click", () => {
            const opened = navigation.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(opened));
            menuToggle.setAttribute("aria-label", opened ? "Close navigation menu" : "Open navigation menu");
        });
        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navigation.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }

    // Automatic footer year.
    document.querySelectorAll(".current-year").forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // Highlight the current page (works with the standard lowercase filenames).
    const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll("header nav a").forEach(link => {
        const target = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
        if (target && target === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    // Search/filter cards on pages that already contain a search input.
    const searchPairs = [
        { input: "#tutorialSearch", cards: ".tutorial-card" },
        { input: "#newsSearch", cards: ".news-card" },
        { input: "#searchNews", cards: ".news-card" }
    ];
    searchPairs.forEach(({ input, cards }) => {
        const field = document.querySelector(input);
        if (!field) return;
        const items = Array.from(document.querySelectorAll(cards));
        if (!items.length) return;

        let status = field.parentElement.querySelector(".search-status");
        if (!status) {
            status = document.createElement("p");
            status.className = "search-status";
            status.setAttribute("aria-live", "polite");
            field.parentElement.appendChild(status);
        }
        const filter = () => {
            const query = field.value.trim().toLowerCase();
            let visible = 0;
            items.forEach(card => {
                const match = card.textContent.toLowerCase().includes(query);
                card.hidden = !match;
                if (match) visible++;
            });
            status.textContent = query ? `${visible} result${visible === 1 ? "" : "s"} found.` : "";
        };
        field.addEventListener("input", filter);
    });

    // Contact form: it can prepare an email only after the school supplies its
    // verified official email address. No message is falsely reported as sent.
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();
            const status = document.getElementById("formMessage");
            const schoolEmail = ""; // Add the school's verified official email here.
            if (!contactForm.reportValidity()) return;
            if (!schoolEmail) {
                if (status) {
                    status.textContent = "The school's official email address has not been added yet. Your message has not been sent. Please use the school's verified contact channel.";
                    status.classList.add("form-notice");
                }
                return;
            }
            const data = new FormData(contactForm);
            const subject = String(data.get("subject") || "Website enquiry");
            const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
            window.location.href = `mailto:${schoolEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }

    // Prevent empty search form submissions from jumping to an unrelated URL.
    document.querySelectorAll("form[data-local-search]").forEach(form => {
        form.addEventListener("submit", event => event.preventDefault());
    });
});
