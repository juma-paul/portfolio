// =============================
// NAVIGATION ACTIVE HIGHLIGHT
// =============================

// Cache elements
const sections = [...document.querySelectorAll("section")];
const navLinks = [...document.querySelectorAll("nav ul a")];

// Compute section offsets
function getSectionOffsets() {
  return sections.map((sec) => ({
    id: sec.id,
    offset: sec.offsetTop,
  }));
}

let sectionOffsets = getSectionOffsets();

// Recompute on resize (important for responsive layouts)
window.addEventListener("resize", () => {
  sectionOffsets = getSectionOffsets();
});

// Highlight nav link based on scroll position
function highlightNav() {
  const scrollPos = window.scrollY + 150; // header buffer
  let currentSection = sections[0].id;

  for (let i = 0; i < sectionOffsets.length; i++) {
    if (scrollPos >= sectionOffsets[i].offset) {
      currentSection = sectionOffsets[i].id;
    }
  }

  navLinks.forEach((link) => link.classList.remove("active"));

  const activeLink = document.querySelector(
    `nav ul a[href="#${currentSection}"]`
  );
  if (activeLink) activeLink.classList.add("active");
}

// Smooth sync with browser paint cycle
window.addEventListener("scroll", () => {
  window.requestAnimationFrame(highlightNav);
});

// Initial highlight
highlightNav();

// =============================
// PROJECT FILTER BUTTONS
// =============================

const filterButtons = document.querySelectorAll(".filter-buttons button");
const projectCards = document.querySelectorAll(".projects-card");

// Filter logic
function filterProjects(category) {
  projectCards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    card.style.display =
      category === "all" || cardCategory === category ? "block" : "none";
  });
}

// Button click handling
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const category = button.getAttribute("data-category");
    filterProjects(category);
  });
});

// Default: Activate "All"
const allButton = document.querySelector(
  '.filter-buttons button[data-category="all"]'
);
if (allButton) {
  allButton.classList.add("active");
  filterProjects("all");
}

// =============================
// AUTO YEAR IN FOOTER
// =============================

const yearEl = document.getElementById("copyright-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =============================
// DARK MODE TOGGLE
// =============================

const themeToogle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Check for saved theme preference
const currentTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", currentTheme);
themeToogle.textContent = currentTheme === "dark" ? "☀️" : "🌙";

// Toggle theme on button click
themeToogle.addEventListener("click", () => {
  const newTheme =
    html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  themeToogle.textContent = newTheme === "dark" ? "☀️" : "🌙";
});

// =============================
// MOBILE MENU TOGGLE
// =============================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close menu when clicking nav links
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});
