/* =========================================
   BETH CRAFT — MAIN JAVASCRIPT
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


    const navItems = navLinks.querySelectorAll("a");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            navLinks.classList.remove("active");
            menuBtn.textContent = "☰";

        });

    });

}


/* =========================================
   CLOSE MOBILE MENU OUTSIDE
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
   SCROLL REVEAL
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
========================================= */

const dropdownBtn =
    document.querySelector(".dropdown-btn");

const dropdown =
    document.querySelector(".dropdown");

if (dropdownBtn && dropdown) {

    dropdownBtn.addEventListener("click", (event) => {

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
   IMAGE FULLSCREEN VIEWER (LIGHTBOX)
========================================= */

const galleryImages =
    document.querySelectorAll(".gallery-item img");

if (galleryImages.length > 0) {

    const lightbox =
        document.createElement("div");

    lightbox.className = "bc-lightbox";

    lightbox.innerHTML = `
        <button class="bc-lightbox-close" aria-label="Close">&times;</button>

        <button class="bc-lightbox-prev" aria-label="Previous">&#10094;</button>

        <img class="bc-lightbox-image" src="" alt="Beth Craft">

        <button class="bc-lightbox-next" aria-label="Next">&#10095;</button>
    `;

    document.body.appendChild(lightbox);


    const viewerImage =
        lightbox.querySelector(".bc-lightbox-image");

    const closeBtn =
        lightbox.querySelector(".bc-lightbox-close");

    const prevBtn =
        lightbox.querySelector(".bc-lightbox-prev");

    const nextBtn =
        lightbox.querySelector(".bc-lightbox-next");


    let currentImage = 0;


    /* SHOW IMAGE */

    function showImage(index) {

        if (index < 0) {
            index = galleryImages.length - 1;
        }

        if (index >= galleryImages.length) {
            index = 0;
        }

        currentImage = index;

        viewerImage.src =
            galleryImages[currentImage].src;

        viewerImage.alt =
            galleryImages[currentImage].alt;
    }


    /* OPEN */

    function openViewer(index) {

        showImage(index);

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";
    }


    /* CLOSE */

    function closeViewer() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";
    }


    /* NEXT */

    function nextImage() {

        showImage(currentImage + 1);
    }


    /* PREVIOUS */

    function previousImage() {

        showImage(currentImage - 1);
    }


    /* CLICK IMAGE */

    galleryImages.forEach((image, index) => {

        image.addEventListener("click", () => {

            openViewer(index);

        });

    });


    /* BUTTONS */

    closeBtn.addEventListener(
        "click",
        closeViewer
    );

    nextBtn.addEventListener(
        "click",
        nextImage
    );

    prevBtn.addEventListener(
        "click",
        previousImage
    );


    /* CLICK DARK BACKGROUND TO CLOSE */

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            closeViewer();

        }

    });


    /* =====================================
       KEYBOARD CONTROLS
    ===================================== */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("active")) {
            return;
        }

        if (event.key === "Escape") {
            closeViewer();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    });


    /* =====================================
       PHONE SWIPE
    ===================================== */

    let touchStartX = 0;

    lightbox.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        { passive: true }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            const touchEndX =
                event.changedTouches[0].screenX;

            const distance =
                touchEndX - touchStartX;


            if (Math.abs(distance) < 50) {
                return;
            }


            if (distance < 0) {

                nextImage();

            } else {

                previousImage();

            }

        },
        { passive: true }
    );

}


/* =========================================
   CONSOLE
========================================= */

console.log(
    "Beth Craft website loaded successfully ✨"
);