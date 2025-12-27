import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

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
  const scrollPos = window.scrollY + 150;
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

// Filter logic
function filterProjects(category) {
  const projectCards = document.querySelectorAll(".projects-card");
  const projectsContainer = document.getElementById("projects-container");
  let visibleCount = 0;

  // Remove any existing empty state message
  const existingEmpty = document.querySelector(".empty-state");
  if (existingEmpty) existingEmpty.remove();

  projectCards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // Show empty state if no projects visible
  if (visibleCount === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <p>No projects in this category yet.</p>
      <p>Check back soon!</p>
    `;
    projectsContainer.appendChild(emptyState);
  }
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

// =============================
// FULL BLOG POST CONTENT
// =============================

const blogContainer = document.getElementById("blog-container");
const fullPost = document.getElementById("full-post");
const backButton = document.getElementById("back-to-blog");
const postContent = document.getElementById("post-content");

// Time estimate for reading the blog post
const calculateReadTime = (content) => {
  const words = content.split(" ").length;
  const readTime = Math.ceil(words / 200);
  return `${readTime} min read`;
};

const showFullPost = (postData) => {
  document.querySelector("main").style.display = "none";
  document.getElementById("home").style.display = "none";
  fullPost.style.display = "block";
  window.scrollTo(0, 0);

  const slug = `${postData.title.toLowerCase().replaceAll(" ", "-")}-${
    postData.date
  }`;
  window.location.hash = `#blog/${slug}`;

  const readTime = calculateReadTime(postData.content);

  postContent.innerHTML = `
    <h1 class="post-title">${postData.title}</h1>
    
    <div class="post-meta">
      <img src="${
        postData.authorImage || "assets/images/default-avatar.jpg"
      }" alt="${postData.author}" class="author-image">
      <div class="author-info">
        <span class="author-name">${postData.author}</span>
        <div class="post-details">
          <time datetime="${postData.date}">${postData.date}</time>
          <span>•</span>
          <span>${readTime}</span>
        </div>
      </div>
    </div>

    <article class="post-body">
      ${postData.content}
    </article>

    <div class="post-tags">
      ${postData.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
    </div>
  `;
};

// =============================
// LOAD BLOG POSTS FROM FIREBASE
// =============================

async function loadBlogPostsFromFirebase() {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, "blog"),
        where("published", "==", true),
        orderBy("createdAt", "desc")
      )
    );
    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const readTime = calculateReadTime(post.content);

      const blogCard = document.createElement("a");
      blogCard.href = "#";
      blogCard.className = "blog-preview";
      blogCard.dataset.postId = doc.id;

      blogCard.innerHTML = `
        <img src="${
          post.coverImage || "assets/images/head-shot.jpg"
        }" alt="cover image">
        <div class="blog-content">
          <h4>${post.title}</h4>
          <div class="blog-meta">
            <span>${post.author} • ${new Date(
        post.createdAt.toDate()
      ).toLocaleDateString()} • ${readTime}</span>
          </div>
          <p>${post.excerpt}</p>
          <div class="blog-tags">
            ${post.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
      `;

      blogContainer.appendChild(blogCard);
    });
  } catch (error) {
    console.error("Error loading blog posts:", error);
  }
}

async function loadFullPost(postId) {
  try {
    const postDoc = await getDoc(doc(db, "blog", postId));
    const post = postDoc.data();

    const postData = {
      title: post.title,
      author: post.author,
      authorImage: post.authorImage || "assets/images/head-shot.jpg",
      date: new Date(post.createdAt.toDate()).toLocaleDateString(),
      content: post.content,
      tags: post.tags,
    };

    showFullPost(postData);
  } catch (error) {
    console.error("Error loading post:", error);
  }
}

// Update blog card click handler
blogContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".blog-preview");
  if (card) {
    e.preventDefault();
    const postId = card.dataset.postId;
    loadFullPost(postId);
  }
});

// Load on page load
loadBlogPostsFromFirebase();

// Back to blog button
backButton.addEventListener("click", () => {
  fullPost.style.display = "none";
  document.querySelector("main").style.display = "block";
  document.getElementById("home").style.display = "flex";

  // Scroll to blog section
  document.getElementById("blog").scrollIntoView({ behavior: "smooth" });
});

// Close full post when a nav link is cliked
document.querySelectorAll("nav ul a").forEach((link) => {
  link.addEventListener("click", () => {
    if (fullPost.style.display === "block") {
      fullPost.style.display = "none";
      document.querySelector("main").style.display = "block";
      document.getElementById("home").style.display = "flex";
    }
  });
});

// Load projects from Firebase
async function loadProjectsFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsContainer = document.getElementById("projects-container");
    projectsContainer.innerHTML = ""; // Clear placeholders

    querySnapshot.forEach((doc) => {
      const project = doc.data();

      const projectCard = document.createElement("div");
      projectCard.className = "projects-card";
      projectCard.setAttribute("data-category", project.category);

      projectCard.innerHTML = `
        <img src="${project.image}" alt="${project.title}">
        <h4>${project.title}</h4>
        <ul class="project-skills">
          ${project.skills.map((skill) => `<li>${skill}</li>`).join("")}
        </ul>
        <p>${project.description}</p>
        <div class="project-links">
          ${
            project.github
              ? `
            <a href="${project.github}" target="_blank">
              <svg class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M237.9 461.4C237.9 463.4 235.6 465 232.7 465C229.4 465.3 227.1 463.7 227.1 461.4C227.1 459.4 229.4 457.8 232.3 457.8C235.3 457.5 237.9 459.1 237.9 461.4zM206.8 456.9C206.1 458.9 208.1 461.2 211.1 461.8C213.7 462.8 216.7 461.8 217.3 459.8C217.9 457.8 216 455.5 213 454.6C210.4 453.9 207.5 454.9 206.8 456.9zM251 455.2C248.1 455.9 246.1 457.8 246.4 460.1C246.7 462.1 249.3 463.4 252.3 462.7C255.2 462 257.2 460.1 256.9 458.1C256.6 456.2 253.9 454.9 251 455.2zM316.8 72C178.1 72 72 177.3 72 316C72 426.9 141.8 521.8 241.5 555.2C254.3 557.5 258.8 549.6 258.8 543.1C258.8 536.9 258.5 502.7 258.5 481.7C258.5 481.7 188.5 496.7 173.8 451.9C173.8 451.9 162.4 422.8 146 415.3C146 415.3 123.1 399.6 147.6 399.9C147.6 399.9 172.5 401.9 186.2 425.7C208.1 464.3 244.8 453.2 259.1 446.6C261.4 430.6 267.9 419.5 275.1 412.9C219.2 406.7 162.8 398.6 162.8 302.4C162.8 274.9 170.4 261.1 186.4 243.5C183.8 237 175.3 210.2 189 175.6C209.9 169.1 258 202.6 258 202.6C278 197 299.5 194.1 320.8 194.1C342.1 194.1 363.6 197 383.6 202.6C383.6 202.6 431.7 169 452.6 175.6C466.3 210.3 457.8 237 455.2 243.5C471.2 261.2 481 275 481 302.4C481 398.9 422.1 406.6 366.2 412.9C375.4 420.8 383.2 435.8 383.2 459.3C383.2 493 382.9 534.7 382.9 542.9C382.9 549.4 387.5 557.3 400.2 555C500.2 521.8 568 426.9 568 316C568 177.3 455.5 72 316.8 72zM169.2 416.9C167.9 417.9 168.2 420.2 169.9 422.1C171.5 423.7 173.8 424.4 175.1 423.1C176.4 422.1 176.1 419.8 174.4 417.9C172.8 416.3 170.5 415.6 169.2 416.9zM158.4 408.8C157.7 410.1 158.7 411.7 160.7 412.7C162.3 413.7 164.3 413.4 165 412C165.7 410.7 164.7 409.1 162.7 408.1C160.7 407.5 159.1 407.8 158.4 408.8zM190.8 444.4C189.2 445.7 189.8 448.7 192.1 450.6C194.4 452.9 197.3 453.2 198.6 451.6C199.9 450.3 199.3 447.3 197.3 445.4C195.1 443.1 192.1 442.8 190.8 444.4zM179.4 429.7C177.8 430.7 177.8 433.3 179.4 435.6C181 437.9 183.7 438.9 185 437.9C186.6 436.6 186.6 434 185 431.7C183.6 429.4 181 428.4 179.4 429.7z"/>
              </svg>
              <span>GitHub</span>
            </a>
          `
              : ""
          }
          ${
            project.live
              ? `
            <a href="${project.live}" target="_blank">
              <svg class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M451.5 160C434.9 160 418.8 164.5 404.7 172.7C388.9 156.7 370.5 143.3 350.2 133.2C378.4 109.2 414.3 96 451.5 96C537.9 96 608 166 608 252.5C608 294 591.5 333.8 562.2 363.1L491.1 434.2C461.8 463.5 422 480 380.5 480C294.1 480 224 410 224 323.5C224 322 224 320.5 224.1 319C224.6 301.3 239.3 287.4 257 287.9C274.7 288.4 288.6 303.1 288.1 320.8C288.1 321.7 288.1 322.6 288.1 323.4C288.1 374.5 329.5 415.9 380.6 415.9C405.1 415.9 428.6 406.2 446 388.8L517.1 317.7C534.4 300.4 544.2 276.8 544.2 252.3C544.2 201.2 502.8 159.8 451.7 159.8zM307.2 237.3C305.3 236.5 303.4 235.4 301.7 234.2C289.1 227.7 274.7 224 259.6 224C235.1 224 211.6 233.7 194.2 251.1L123.1 322.2C105.8 339.5 96 363.1 96 387.6C96 438.7 137.4 480.1 188.5 480.1C205 480.1 221.1 475.7 235.2 467.5C251 483.5 269.4 496.9 289.8 507C261.6 530.9 225.8 544.2 188.5 544.2C102.1 544.2 32 474.2 32 387.7C32 346.2 48.5 306.4 77.8 277.1L148.9 206C178.2 176.7 218 160.2 259.5 160.2C346.1 160.2 416 230.8 416 317.1C416 318.4 416 319.7 416 321C415.6 338.7 400.9 352.6 383.2 352.2C365.5 351.8 351.6 337.1 352 319.4C352 318.6 352 317.9 352 317.1C352 283.4 334 253.8 307.2 237.5z"/>
              </svg>
              <span>Live Demo</span>
            </a>
          `
              : ""
          }
        </div>
      `;

      projectsContainer.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
  }
}

// Call on page load
loadProjectsFromFirebase();

document
  .querySelector(".send-email form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const response = await fetch(this.action, {
      method: "POST",
      body: new FormData(this),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      alert("Message sent successfully!");
      this.reset();
    }
  });
