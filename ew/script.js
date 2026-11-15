const toastEl = document.getElementById("toast");
let toastTimer;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden");
  });
  mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  }));
}

// Buy / Rent / Off-Plan tabs
let selectedMode = "Buy";
document.querySelectorAll(".search-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    selectedMode = tab.dataset.mode;
    document.querySelectorAll(".search-tab").forEach(item => item.classList.toggle("selected", item === tab));
    showToast(`${selectedMode} properties selected`);
    if (selectedMode === "Off-Plan") {
      showToast("Redirecting to Off-Plan developments catalog...");
      setTimeout(() => {
        const isRoot = !window.location.pathname.includes("/ew/");
        window.location.href = isRoot ? "land-off/index.html" : "../land-off/index.html";
      }, 700);
    }
  });
});

// Demo search: filters the mock property cards by location, type and price band
const propertySearchForm = document.getElementById("propertySearch");
if (propertySearchForm) {
  propertySearchForm.addEventListener("submit", event => {
    event.preventDefault();
    const location = document.getElementById("locationInput") ? document.getElementById("locationInput").value.trim().toLowerCase() : "";
    const type = document.getElementById("typeSelect") ? document.getElementById("typeSelect").value : "";
    const price = document.getElementById("priceSelect") ? document.getElementById("priceSelect").value : "";
    const cards = [...document.querySelectorAll(".property-card")];
    let visible = 0;

    cards.forEach(card => {
      const cardLocation = (card.dataset.location || "").toLowerCase();
      const cardType = card.dataset.type;
      const cardPrice = Number(card.dataset.price);
      const locationMatch = !location || cardLocation.includes(location);
      const typeMatch = !type || cardType === type;
      let priceMatch = true;
      if (price === "Under AED 1M") priceMatch = cardPrice < 1000000;
      if (price === "AED 1M – 3M") priceMatch = cardPrice >= 1000000 && cardPrice <= 3000000;
      if (price === "AED 3M – 6M") priceMatch = cardPrice > 3000000 && cardPrice <= 6000000;
      if (price === "AED 6M+") priceMatch = cardPrice > 6000000;
      const match = locationMatch && typeMatch && priceMatch;
      card.classList.toggle("hidden", !match);
      if (match) visible++;
    });

    const message = document.getElementById("searchMessage");
    if (message) {
      message.classList.remove("hidden");
      message.textContent = visible
        ? `${visible} ${selectedMode.toLowerCase()} ${visible === 1 ? "property" : "properties"} match your search.`
        : "No mock properties match those filters. Try another location or price range.";
    }
    const featuredSection = document.getElementById("featured");
    if (featuredSection) featuredSection.scrollIntoView({ behavior: "smooth" });
  });
}

// Favorite toggles and count
const favoriteButtons = [...document.querySelectorAll(".favorite-button")];
function updateFavoriteCount() {
  const count = favoriteButtons.filter(button => button.classList.contains("is-favorite")).length;
  const badge = document.getElementById("favoriteCount");
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
    badge.classList.toggle("inline-flex", count > 0);
  }
}
favoriteButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const saved = button.classList.toggle("is-favorite");
    button.setAttribute("aria-pressed", String(saved));
    button.textContent = saved ? "♥" : "♡";
    updateFavoriteCount();
    showToast(saved ? "Property added to favorites" : "Property removed from favorites");
  });
});
const favShortcut = document.getElementById("favoritesShortcut");
if (favShortcut) {
  favShortcut.addEventListener("click", () => {
    const saved = favoriteButtons.filter(button => button.classList.contains("is-favorite")).length;
    showToast(saved ? `You have ${saved} saved ${saved === 1 ? "property" : "properties"}` : "You have no saved properties yet");
  });
}

// Horizontal featured properties carousel
const track = document.getElementById("propertyTrack");
const prevSliderBtn = document.getElementById("slidePrev");
const nextSliderBtn = document.getElementById("slideNext");
if (track && prevSliderBtn && nextSliderBtn) {
  prevSliderBtn.addEventListener("click", () => {
    track.scrollBy({ left: -track.clientWidth * .82, behavior: "smooth" });
  });
  nextSliderBtn.addEventListener("click", () => {
    track.scrollBy({ left: track.clientWidth * .82, behavior: "smooth" });
  });
}
