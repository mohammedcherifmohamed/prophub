// Enova Property Details Interactivity
document.addEventListener("DOMContentLoaded", () => {
  // Toast helper
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  // Mobile navigation
  const menuButton = document.getElementById("menuButton");
  const mobileNav = document.getElementById("mobileNav");
  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      mobileNav.classList.toggle("hidden");
    });
  }

  // Gallery Photos list
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=90",
      caption: "Photo 1 of 41 — Villa Mio Architectural Facade & Infinity Pool"
    },
    {
      src: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1500&q=85",
      caption: "Photo 2 of 41 — Master Bedroom Suite with Panoramic Mountain Views"
    },
    {
      src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1500&q=85",
      caption: "Photo 3 of 41 — Designer Kitchen & Handcrafted Natural Stone Island"
    },
    {
      src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1500&q=85",
      caption: "Photo 4 of 41 — Sunlit Living Lounge & High Ceilings"
    },
    {
      src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1500&q=85",
      caption: "Photo 5 of 41 — Sunset Terrace & Outdoor Entertaining Pavilion"
    }
  ];

  let currentGalleryIndex = 0;
  const heroImage = document.getElementById("heroImage");
  const prevBtn = document.getElementById("previousImage");
  const nextBtn = document.getElementById("nextImage");
  const photoCount = document.getElementById("photoCount");

  function updateGallery(index) {
    currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
    if (heroImage) {
      heroImage.style.opacity = "0.7";
      setTimeout(() => {
        heroImage.src = galleryImages[currentGalleryIndex].src;
        heroImage.style.opacity = "1";
      }, 150);
    }
    if (photoCount) photoCount.textContent = currentGalleryIndex + 1;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => updateGallery(currentGalleryIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateGallery(currentGalleryIndex + 1));

  // Gallery tool buttons (3D Tour, Floor Plan, Street View, Map)
  document.querySelectorAll(".gallery-tool, .media-tile").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const tool = btn.dataset.tool || btn.textContent.trim();
      if (tool.includes("photos") || tool.includes("All photos")) {
        openLightbox(0);
      } else {
        showToast(`Launching ${tool} interactive viewer...`);
      }
    });
  });

  // Lightbox functionality
  const lightbox = document.getElementById("lightbox");
  const closeLightbox = document.getElementById("closeLightbox");
  const lightboxImg = document.getElementById("lightboxImage");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxCaption = document.getElementById("lightboxCaption");

  function openLightbox(index = 0) {
    if (!lightbox) return;
    currentGalleryIndex = index;
    updateLightbox();
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.body.style.overflow = "hidden";
  }

  function closeLightboxModal() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function updateLightbox() {
    if (!lightboxImg || !lightboxCaption) return;
    const item = galleryImages[currentGalleryIndex];
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
  }

  if (heroImage) heroImage.addEventListener("click", () => openLightbox(currentGalleryIndex));

  document.querySelectorAll("[data-gallery-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.galleryIndex, 10);
      openLightbox(isNaN(idx) ? 0 : idx);
    });
  });

  if (closeLightbox) closeLightbox.addEventListener("click", closeLightboxModal);
  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightbox();
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener("click", (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
      updateLightbox();
    });
  }
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightboxModal();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (lightbox && !lightbox.classList.contains("hidden")) {
      if (e.key === "Escape") closeLightboxModal();
      if (e.key === "ArrowLeft" && lightboxPrev) lightboxPrev.click();
      if (e.key === "ArrowRight" && lightboxNext) lightboxNext.click();
    }
  });

  // Save / Bookmark button
  const saveButton = document.getElementById("saveButton");
  const saveIcon = document.getElementById("saveIcon");
  const saveLabel = document.getElementById("saveLabel");
  let isSaved = false;

  if (saveButton) {
    saveButton.addEventListener("click", () => {
      isSaved = !isSaved;
      if (saveIcon) saveIcon.textContent = isSaved ? "♥" : "♡";
      if (saveLabel) saveLabel.textContent = isSaved ? "Saved" : "Save";
      saveButton.classList.toggle("bg-[#B8925A]", isSaved);
      saveButton.classList.toggle("text-white", isSaved);
      showToast(isSaved ? "Villa Mio added to your private collection" : "Villa Mio removed from your collection");
    });
  }

  // Share button
  const shareButton = document.getElementById("shareButton");
  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Villa Mio — Luxury Benahavis Estate",
            text: "Explore this exceptional modern villa in El Madroñal, Benahavis on Enova.",
            url: window.location.href
          });
          return;
        } catch (err) {
          // fallback to clipboard
        }
      }
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Property link copied to clipboard!");
      } catch (err) {
        showToast("Sharing Villa Mio details...");
      }
    });
  }

  // Read More toggle for description
  const readMoreBtn = document.getElementById("readMoreButton");
  const descEl = document.getElementById("description");
  const chevron = document.getElementById("readMoreChevron");
  let isExpanded = false;

  if (readMoreBtn && descEl) {
    const extraContent = document.createElement("div");
    extraContent.id = "extraDescription";
    extraContent.className = "space-y-3 pt-3 hidden";
    extraContent.innerHTML = `
      <p>The ground floor is characterized by an expansive open-plan reception room with double-height ceilings, a minimalist fireplace, and floor-to-ceiling glass pocket doors that frame uninterrupted vistas of the Mediterranean coastline.</p>
      <p>The bespoke chef's kitchen features custom dark oak cabinetry, imported Calacatta marble surfaces, and integrated Gaggenau appliances with a discrete prep kitchen and temperature-controlled wine room.</p>
      <p>Amenities include a 15-meter heated infinity pool, private wellness spa with sauna and steam rooms, fully equipped fitness studio, underground garage for 4 vehicles, and 24-hour gated security patrol.</p>
    `;
    descEl.appendChild(extraContent);

    readMoreBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      extraContent.classList.toggle("hidden", !isExpanded);
      readMoreBtn.childNodes[0].textContent = isExpanded ? "Read Less " : "Read More ";
      if (chevron) chevron.style.transform = isExpanded ? "rotate(180deg)" : "rotate(0deg)";
    });
  }

  // Contact Form
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending inquiry...";
      }

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.textContent = "Inquiry sent to Fernanda Collet! Our Private Client team will contact you shortly.";
          formFeedback.classList.remove("hidden");
          formFeedback.className = "rounded-lg bg-[#FAF9F6] border border-[#B8925A] p-3 text-sm text-[#1C2B4A] font-semibold";
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Message Sent ✓";
        }
        showToast("Your inquiry has been successfully sent to the agent.");
      }, 700);
    });
  }
});
