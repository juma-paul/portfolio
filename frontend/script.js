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
const currentTheme = localStorage.getItem("theme") || "dark";
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

const testPost = {
  title: "Test Blog Post",
  author: "Your Name",
  authorImage: "assets/images/head-shot.jpg",
  date: "2024-12-23",
  content: `<p>This is test content with <strong>bold text</strong> and multiple paragraphs.</p><p>Second paragraph here! </p> <p>
  We plan to wrap up 2025 with some important quality of life updates! League
  placement badges, lesson bookmarks, and major improvements to the Training
  Grounds are just a few of the highlights. Thanks for learning with us, we’re
  gearing up the platform for a ton of new courses in 2026. Enthusiastically,
  Lane Patch notes 🔗 1. League Placement Badges 🔗 When you place in the top 1,
  2, or 3 of your league when it ends, you’ll now get a permanent badge on your
  profile to acknowledge your achievement. Don’t worry, you’ll get an in-app
  notification when you get one so you won’t miss it! 2. Lesson Bookmarks 🔗
  There’s now a bookmark icon at the bottom of every lesson page. bootdev
  bookmark icon You can see all your bookmarks from your bookmarks page, which
  is linked under the dropdown menu on your profile picture. The Training
  Grounds auto-generated challenges also take bookmarks into account,
  automatically giving you more challenges similar to bookmarked lessons. 3. Big
  Training Grounds Improvements 🔗 We’ve solved a lot of the challenge
  generation hiccups over the last few weeks, with challenges that fail to
  generate down by 40%! We’ve also started sending notifications whenever a new
  challenge has been automatically (and successfully) generated for you in the
  background. Most of the time you should be able to immediately hop into a
  fully personalized challenge without having to wait at all! We’ve also made a
  massive improvement to the “Boots interview” challenge and lesson types. He
  now responds much faster and is a more sane judge of your response. Finally,
  we’re in the process of big updates to the “challenge search” feature in the
  Training Grounds. It now allows for much more granular top-level searching. We
  actually did a big infrastructure migration to make this happen, and now we
  can fine tune the performance even more and faster as we go. 4. Course Page
  Updates 🔗 The all courses page has been updated with a few new features: You
  can now filter the courses by “course” vs “guided project” using the little
  pills at the top of the page. New and updated courses are now highlighted with
  “New” and “Updated” labels and the newest and most recently updated courses
  are now at the top of the list by default. 5. Miscellaneous Improvements 🔗
  Added operating system-specific headings to lesson pages - e.g., if you’re on
  Linux, the Windows and macOS sections will be collapsed by default Boots now
  uses GPT 5.1 and Gemini 3 Pro alongside Claude Sonnet 4.5 (We only use the
  state of the art models) The “solution file” viewer for locally-completed
  lessons now allows you to easily copy solution code with a clipboard icon
  We’ve added a pretty transition animation to the leaderboard’s live-streamed
  lesson completions and the boss menu live stream Removed the tooltip hover
  delay when tooltips are already opened (feels much snappier) What Is Yet to
  Come 🔗 A cloud infrastructure (AWS) course A new logging and telemetry course
  A web security in TypeScript course A data visualization course in Power BI A
  data manipulation course in Python, Pandas, and NumPy Improvements to
  spellbook search
</p>`,
  tags: ["Test", "JavaScript", "Firebase"],
};

// Listen for clicks on blog cards
blogContainer.addEventListener("click", (e) => {
  const card = e.target.closest(".blog-preview");
  if (card) {
    e.preventDefault();
    showFullPost(testPost);
  }
});

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
