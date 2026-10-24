/* =========================================
   MOBILE NAVIGATION
========================================= */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
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
    const clickedInsideNav = navLinks.contains(event.target);
    const clickedMenuButton = menuBtn.contains(event.target);
    if (!clickedInsideNav && !clickedMenuButton && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuBtn.textContent = "☰";
    }
});

/* =========================================
   SCROLL REVEAL
========================================= */
const revealElements = document.querySelectorAll(".section-heading, .about-grid, .collection-card, .service-card, .review-card, .contact-box");
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(element => {
        element.classList.add("reveal");
        observer.observe(element);
    });
}

/* =========================================
   COLLECTION DROPDOWN
========================================= */
const dropdownBtn = document.querySelector(".dropdown-btn");
const dropdown = document.querySelector(".dropdown");

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
const yearElements = document.querySelectorAll(".copyright");
yearElements.forEach(element => {
    element.innerHTML = element.innerHTML.replace("2026", new Date().getFullYear());
});

/* =========================================
   SMOOTH INTERNAL LINKS
========================================= */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (targetId && targetId !== "#") {
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    });
});

/* =========================================
   IMAGE FULLSCREEN VIEWER (LIGHTBOX)
========================================= */
// We wrap this in a function so we can call it after the CMS loads new images
function setupLightbox() {
    const galleryImages = document.querySelectorAll(".gallery-item img");
    if (galleryImages.length === 0) return;

    // Only create the lightbox once
    if (!document.querySelector('.bc-lightbox')) {
        const lightbox = document.createElement("div");
        lightbox.className = "bc-lightbox";
        lightbox.innerHTML = `
            <button class="bc-lightbox-close" aria-label="Close">&times;</button>
            <button class="bc-lightbox-prev" aria-label="Previous">&#10094;</button>
            <img class="bc-lightbox-image" src="" alt="Beth Craft">
            <button class="bc-lightbox-next" aria-label="Next">&#10095;</button>
        `;
        document.body.appendChild(lightbox);

        const viewerImage = lightbox.querySelector(".bc-lightbox-image");
        const closeBtn = lightbox.querySelector(".bc-lightbox-close");
        const prevBtn = lightbox.querySelector(".bc-lightbox-prev");
        const nextBtn = lightbox.querySelector(".bc-lightbox-next");
        let currentImage = 0;

        function showImage(index) {
            if (index < 0) index = galleryImages.length - 1;
            if (index >= galleryImages.length) index = 0;
            currentImage = index;
            viewerImage.src = galleryImages[currentImage].src;
            viewerImage.alt = galleryImages[currentImage].alt;
        }

        function openViewer(index) {
            showImage(index);
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        }

        function closeViewer() {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
        }

        function nextImage() { showImage(currentImage + 1); }
        function previousImage() { showImage(currentImage - 1); }

        closeBtn.addEventListener("click", closeViewer);
        nextBtn.addEventListener("click", nextImage);
        prevBtn.addEventListener("click", previousImage);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeViewer();
        });

        document.addEventListener("keydown", (event) => {
            if (!lightbox.classList.contains("active")) return;
            if (event.key === "Escape") closeViewer();
            if (event.key === "ArrowRight") nextImage();
            if (event.key === "ArrowLeft") previousImage();
        });

        let touchStartX = 0;
        lightbox.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener("touchend", (event) => {
            const touchEndX = event.changedTouches[0].screenX;
            const distance = touchEndX - touchStartX;
            if (Math.abs(distance) < 50) return;
            if (distance < 0) nextImage();
            else previousImage();
        }, { passive: true });
    }

    // Add click listeners to the images
    galleryImages.forEach((image, index) => {
        // Prevent adding multiple listeners if function is called again
        image.replaceWith(image.cloneNode(true)); 
    });

    // Re-select after cloning to attach fresh listeners
    document.querySelectorAll(".gallery-item img").forEach((image, index) => {
        image.addEventListener("click", () => {
            const lightbox = document.querySelector(".bc-lightbox");
            const viewerImage = lightbox.querySelector(".bc-lightbox-image");
            viewerImage.src = image.src;
            viewerImage.alt = image.alt;
            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
            
            // Set currentImage index
            const allImages = Array.from(document.querySelectorAll(".gallery-item img"));
            currentImage = allImages.indexOf(image);
        });
    });
}

// Initialize lightbox for hardcoded images
setupLightbox();


/* =========================================
   DYNAMIC CMS GALLERY LOADER
========================================= */
async function loadDynamicGallery(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch(`./data/${category}.json`);
        
        // If the file doesn't exist yet, keep the hardcoded images
        if (!response.ok) return; 

        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            container.innerHTML = '';
            
            data.items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                // The image path from CMS starts with /images/uploads/
                const imgPath = item.image.startsWith('/') ? item.image : `/${item.image}`;
                div.innerHTML = `<img src="${imgPath}" alt="Handcrafted ${category} by Beth Craft" loading="lazy">`;
                container.appendChild(div);
            });

            // Re-run the lightbox setup to attach listeners to the NEW images
            setupLightbox();
        }
    } catch (error) {
        console.log(`No dynamic data found for ${category} yet.`);
    }
}

// Run the loader when the page finishes loading
document.addEventListener("DOMContentLoaded", () => {
    loadDynamicGallery("bags", "bags-gallery");
});

console.log("Beth Craft website loaded successfully ✨");