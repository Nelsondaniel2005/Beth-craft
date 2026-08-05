/* =========================================
   BETH CRAFT — VERSION 1
   Main JavaScript
========================================= */


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuBtn.textContent = "✕";
        } else {
            menuBtn.textContent = "☰";
        }
    });


    /* Close menu when a normal link is clicked */

    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navLinks.classList.remove("active");
            menuBtn.textContent = "☰";

        });

    });

}


/* =========================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", (event) => {

    if (!menuBtn || !navLinks) return;

    const clickedInsideNav =
        navLinks.contains(event.target);

    const clickedMenuButton =
        menuBtn.contains(event.target);

    if (
        !clickedInsideNav &&
        !clickedMenuButton &&
        navLinks.classList.contains("active")
    ) {

        navLinks.classList.remove("active");
        menuBtn.textContent = "☰";

    }

});


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-grid, .collection-card, .service-card, .review-card, .contact-box"
);

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(element => {

        element.classList.add("reveal");

        observer.observe(element);

    });

}


/* =========================================
   COLLECTION DROPDOWN
   MOBILE SUPPORT
========================================= */

const dropdownBtn =
    document.querySelector(".dropdown-btn");

const dropdown =
    document.querySelector(".dropdown");

if (dropdownBtn && dropdown) {

    dropdownBtn.addEventListener("click", (event) => {

        /*
         Prevent the button from doing anything
         unexpected on mobile.
        */

        if (window.innerWidth <= 700) {

            event.preventDefault();

            dropdown.classList.toggle("open");

        }

    });

}


/* =========================================
   CURRENT YEAR
========================================= */

const yearElements =
    document.querySelectorAll(".copyright");

yearElements.forEach(element => {

    element.innerHTML =
        element.innerHTML.replace(
            "2026",
            new Date().getFullYear()
        );

});


/* =========================================
   SMOOTH INTERNAL LINKS
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");

        if (
            targetId &&
            targetId !== "#"
        ) {

            const target =
                document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    });

});


/* =========================================
   CONSOLE MESSAGE
========================================= */

console.log(
    "Beth Craft website loaded successfully ✨"
);