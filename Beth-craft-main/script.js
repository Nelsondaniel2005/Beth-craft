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
   CURRENT YEAR & SCROLL REVEAL
========================================= */
document.querySelectorAll(".copyright").forEach(element => {
    element.innerHTML = element.innerHTML.replace("2026", new Date().getFullYear());
});

const revealElements = document.querySelectorAll(
    ".section-heading, .about-grid, .collection-card, .service-card, .review-card, .contact-box"
);
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
   DYNAMIC CMS IMAGE LOADER & LIGHTBOX
========================================= */

// 1. Figure out which page we are on
const path = window.location.pathname;
let collectionFolder = "";

if (path.includes("bags.html")) collectionFolder = "bags";
else if (path.includes("attire.html")) collectionFolder = "attire";
else if (path.includes("accessories.html")) collectionFolder = "accessories";
else if (path.includes("cloth.html")) collectionFolder = "cloth";
else if (path.includes("others.html")) collectionFolder = "others";

// 2. Setup the Lightbox (using event delegation so it works with new images)
let lightbox, viewerImage, closeBtn, prevBtn, nextBtn;
let currentImageIndex = 0;
let currentGalleryImages = [];

function initLightbox() {
    if (document.querySelector(".bc-lightbox")) return; // Already exists

    lightbox = document.createElement("div");
    lightbox.className = "bc-lightbox";
    lightbox.innerHTML = `
        <button class="bc-lightbox-close" aria-label="Close">&times;</button>
        <button class="bc-lightbox-prev" aria-label="Previous">&#10094;</button>
        <img class="bc-lightbox-image" src="" alt="Beth Craft">
        <button class="bc-lightbox-next" aria-label="Next">&#10095;</button>
    `;
    document.body.appendChild(lightbox);

    viewerImage = lightbox.querySelector(".bc-lightbox-image");
    closeBtn = lightbox.querySelector(".bc-lightbox-close");
    prevBtn = lightbox.querySelector(".bc-lightbox-prev");
    nextBtn = lightbox.querySelector(".bc-lightbox-next");

    function updateGalleryList() {
        currentGalleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
    }

    function showImage(index) {
        if (index < 0) index = currentGalleryImages.length - 1;
        if (index >= currentGalleryImages.length) index = 0;
        currentImageIndex = index;
        viewerImage.src = currentGalleryImages[currentImageIndex].src;
        viewerImage.alt = currentGalleryImages[currentImageIndex].alt;
    }

    window.openViewer = function(index) {
        updateGalleryList();
        showImage(index);
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    function closeViewer() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeViewer);
    nextBtn.addEventListener("click", () => showImage(currentImageIndex + 1));
    prevBtn.addEventListener("click", () => showImage(currentImageIndex - 1));

    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeViewer();
    });

    document.addEventListener("keydown", (event) => {
        if (!lightbox.classList.contains("active")) return;
        if (event.key === "Escape") closeViewer();
        if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
        if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
    });

    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
        const distance = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(distance) > 50) {
            distance < 0 ? showImage(currentImageIndex + 1) : showImage(currentImageIndex - 1);
        }
    }, { passive: true });
}

// Global click listener for gallery images
document.addEventListener("click", (e) => {
    if (e.target.closest(".gallery-item img")) {
        const allImages = Array.from(document.querySelectorAll(".gallery-item img"));
        const clickedImage = e.target.closest("img");
        const index = allImages.indexOf(clickedImage);
        if (window.openViewer && index !== -1) {
            window.openViewer(index);
        }
    }
});

// 3. Fetch new images from GitHub CMS and add to page
async function loadCMSImages() {
    if (!collectionFolder) return;

    const repo = "Nelsondaniel2005/Beth-craft";
    const folderPath = `Beth-craft-main/images/${collectionFolder}`;
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${folderPath}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) return; // Folder might be empty or have no .md files

        const files = await response.json();
        const mdFiles = files.filter(file => file.name.endsWith(".md"));
        
        const galleryGrid = document.querySelector(".gallery-grid");
        if (!galleryGrid) return;

        for (const file of mdFiles) {
            const fileRes = await fetch(file.download_url);
            const text = await fileRes.text();

            // Extract image path and title from the markdown file
            const imageMatch = text.match(/image:\s*(.*)/);
            const titleMatch = text.match(/title:\s*(.*)/);
            
            if (imageMatch) {
                let imageSrc = imageMatch[1].trim().replace(/['"]/g, ""); // Remove quotes
                let title = titleMatch ? titleMatch[1].trim().replace(/['"]/g, "") : "Beth Craft Design";
                
                // Create new gallery item
                const div = document.createElement("div");
                div.className = "gallery-item";
                div.innerHTML = `<img src="${imageSrc}" alt="${title}" loading="lazy">`;
                galleryGrid.appendChild(div);
            }
        }
    } catch (error) {
        console.error("Error loading dynamic images:", error);
    }
}

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
    initLightbox();
    if (collectionFolder) {
        loadCMSImages();
    }
    console.log("Beth Craft website loaded successfully ✨");
});