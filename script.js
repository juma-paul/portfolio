import { skills, certifications, projects, blogPosts } from "./data.js";

// =============================
// CONFIGURATION
// =============================

const PROJECTS_PER_PAGE = 3;
let currentPage = 0;
let currentCategory = "all";

// =============================
// DARK MODE
// =============================

const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
}

// =============================
// MOBILE MENU
// =============================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// =============================
// FOOTER YEAR
// =============================

const yearEl = document.getElementById("copyright-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// =============================
// PROJECTS CAROUSEL
// =============================

const projectsContainer = document.getElementById("projects-container");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const filterButtons = document.querySelectorAll(".filter-buttons button");

function getFilteredProjects() {
  if (currentCategory === "all") return projects;
  return projects.filter((p) => p.category === currentCategory);
}

function renderProjects() {
  const filtered = getFilteredProjects();
  const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);

  // Clamp current page
  if (currentPage >= totalPages) currentPage = Math.max(0, totalPages - 1);

  const start = currentPage * PROJECTS_PER_PAGE;
  const pageProjects = filtered.slice(start, start + PROJECTS_PER_PAGE);

  projectsContainer.innerHTML = "";

  if (filtered.length === 0) {
    projectsContainer.innerHTML = '<div class="empty-state">No projects in this category yet.</div>';
    updateCarouselButtons(0, 0);
    return;
  }

  pageProjects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "project-item";
    item.innerHTML = `
      <img src="${project.image}" alt="${project.title}" class="project-image">
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-skills">
          ${project.skills.map(s => `<span>${s}</span>`).join("")}
        </div>
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ""}
          ${project.live ? `<a href="${project.live}" target="_blank">Live</a>` : ""}
        </div>
      </div>
    `;
    projectsContainer.appendChild(item);
  });

  updateCarouselButtons(currentPage, totalPages);
}

function updateCarouselButtons(current, total) {
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current >= total - 1 || total === 0;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    renderProjects();
  }
});

nextBtn.addEventListener("click", () => {
  const filtered = getFilteredProjects();
  const totalPages = Math.ceil(filtered.length / PROJECTS_PER_PAGE);
  if (currentPage < totalPages - 1) {
    currentPage++;
    renderProjects();
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.getAttribute("data-category");
    currentPage = 0;
    renderProjects();
  });
});

// =============================
// SKILLS & CERTIFICATIONS
// =============================

function renderSkills() {
  const container = document.getElementById("skills-container");
  container.innerHTML = skills.map(s => `<span>${s}</span>`).join("");
}

function renderCertifications() {
  const container = document.getElementById("certs-container");
  container.innerHTML = certifications.map(c => `<li>${c}</li>`).join("");
}

// =============================
// BLOG / WRITING
// =============================

function renderBlog() {
  const container = document.getElementById("blog-container");
  container.innerHTML = "";

  if (blogPosts.length === 0) {
    container.innerHTML = '<li class="blog-item"><span>No posts yet.</span></li>';
    return;
  }

  const total = blogPosts.length;
  blogPosts.forEach((post, index) => {
    const item = document.createElement("li");
    item.className = "blog-item";
    // Descending: first item gets highest number
    const num = String(total - index).padStart(2, "0");
    item.style.setProperty("--num", `"${num}"`);
    item.innerHTML = `<a href="${post.url}" target="_blank">${post.title}</a>`;
    container.appendChild(item);
  });
}

// =============================
// INIT
// =============================

renderSkills();
renderCertifications();
renderProjects();
renderBlog();
