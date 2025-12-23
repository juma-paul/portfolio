import { db, storage, auth } from "../firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

//========================
// Cache DOM elements
//========================

const loginSection = document.getElementById("login-section");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const logoutBtn = document.getElementById("logout-btn");

// Navigation
const navBtns = document.querySelectorAll(".nav-btn");
const projectsSection = document.getElementById("projects-section");
const blogSection = document.getElementById("blog-section");

//========================
// Login handler
//========================

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    loginError.textContent = "";
  } catch (error) {
    loginError.textContent = "Invalid email or password";
  }
});

//========================
// Check auth state
//========================

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    loginSection.style.display = "none";
    dashboard.style.display = "block";
  } else {
    // User is logged out
    loginSection.style.display = "flex";
    dashboard.style.display = "none";
  }
});

//========================
// Logout handler
//========================

logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

//========================
// Navigation between sections
//========================

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    navBtns.forEach((b) => b.classList.remove("active"));
    // Add active to clicked button
    btn.classList.add("active");

    // Show/hide sections
    const section = btn.dataset.section;
    if (section === "projects") {
      projectsSection.style.display = "block";
      blogSection.style.display = "none";
    } else {
      projectsSection.style.display = "none";
      blogSection.style.display = "block";
    }
  });
});

//========================
// Project form elements
//========================

const addProjectBtn = document.getElementById("add-project-btn");
const projectFormContainer = document.getElementById("project-form-container");
const projectForm = document.getElementById("project-form");
const cancelProjectBtn = document.getElementById("cancel-project-btn");
const projectsList = document.getElementById("projects-list");

// Show add project form
addProjectBtn.addEventListener("click", () => {
  projectFormContainer.style.display = "block";
  document.getElementById("project-form-title").textContent = "Add New Project";
  projectForm.reset();
});

// Cancel project form
cancelProjectBtn.addEventListener("click", () => {
  projectFormContainer.style.display = "none";
  projectForm.reset();
});

//================================
// Handle project form submission
//================================

projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    // Get form values
    const title = document.getElementById("project-title").value;
    const description = document.getElementById("project-description").value;
    const github = document.getElementById("project-github").value;
    const live = document.getElementById("project-live").value;
    const skills = document
      .getElementById("project-skills")
      .value.split(",")
      .map((s) => s.trim());
    const category = document.getElementById("project-category").value;
    const imageFile = document.getElementById("project-image").files[0];

    // Upload image if provided
    let imageUrl = "";
    if (imageFile) {
      const imageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Check if editing or creating
    const editId = projectForm.dataset.editId;

    if (editId) {
      // UPDATE existing project
      const updateData = {
        title,
        description,
        github,
        live,
        skills,
        category,
      };

      // Only update image if new one uploaded
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      await updateDoc(doc(db, "projects", editId), updateData);
      delete projectForm.dataset.editId;
      alert("Project updated!");
    } else {
      // CREATE new project
      await addDoc(collection(db, "projects"), {
        title,
        description,
        github,
        live,
        image: imageUrl,
        skills,
        category,
        createdAt: new Date(),
      });
      alert("Project added successfully!");
    }

    projectFormContainer.style.display = "none";
    projectForm.reset();
    loadProjects();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Load and display projects
async function loadProjects() {
  projectsList.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    projectsList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const project = doc.data();
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p><strong>Category:</strong> ${project.category}</p>
        <button onclick="editProject('${doc.id}')">Edit</button>
        <button onclick="deleteProject('${doc.id}')">Delete</button>
     `;

      projectsList.appendChild(projectCard);
    });
  } catch (error) {
    projectsList.innerHTML = "<p>Error loading projects</p>";
  }
}

// Edit project
window.editProject = async (projectId) => {
  try {
    // Get project data
    const projectDoc = await getDoc(doc(db, "projects", projectId));
    const project = projectDoc.data();

    // Fill form with existing data
    document.getElementById("project-title").value = project.title;
    document.getElementById("project-description").value = project.description;
    document.getElementById("project-github").value = project.github || "";
    document.getElementById("project-live").value = project.live || "";
    document.getElementById("project-skills").value = project.skills.join(", ");
    document.getElementById("project-category").value = project.category;

    // Show form
    projectFormContainer.style.display = "block";
    document.getElementById("project-form-title").textContent = "Edit Project";

    // Store project ID for update
    projectForm.dataset.editId = projectId;
  } catch (error) {
    alert("Error loading project: " + error.message);
  }
};

// Delete project
window.deleteProject = async (projectId) => {
  if (confirm("Are you sure you want to delete this project?")) {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      alert("Project deleted!");
      loadProjects();
    } catch (error) {
      alert("Error deleting project: " + error.message);
    }
  }
};

// Load projects on page load
loadProjects();

//============================================
// Blog form elements
//============================================

const addBlogBtn = document.getElementById("add-blog-btn");
const blogFormContainer = document.getElementById("blog-form-container");
const blogForm = document.getElementById("blog-form");
const cancelBlogBtn = document.getElementById("cancel-blog-btn");
const blogList = document.getElementById("blog-list");

// Show add blog form
addBlogBtn.addEventListener("click", () => {
  blogFormContainer.style.display = "block";
  document.getElementById("blog-form-title").textContent = "Add New Blog Post";
  blogForm.reset();
});

// Cancel blog form
cancelBlogBtn.addEventListener("click", () => {
  blogFormContainer.style.display = "none";
  blogForm.reset();
});

// Handle blog form submission
blogForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const title = document.getElementById("blog-title").value;
    const excerpt = document.getElementById("blog-excerpt").value;
    const content = tinymce.get("editor-container").getContent();
    const tags = document
      .getElementById("blog-tags")
      .value.split(",")
      .map((t) => t.trim());
    const published = document.getElementById("blog-published").checked;
    const imageFile = document.getElementById("blog-image").files[0];

    // Upload cover image if provided
    let imageUrl = "";
    if (imageFile) {
      const imageRef = ref(storage, `blog/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Check if editing or creating
    const editId = blogForm.dataset.editId;

    if (editId) {
      // UPDATE existing post
      const updateData = {
        title,
        excerpt,
        content,
        tags,
        published,
        author: "Juma Paul",
      };

      if (imageUrl) {
        updateData.coverImage = imageUrl;
      }

      await updateDoc(doc(db, "blog", editId), updateData);
      delete blogForm.dataset.editId;
      alert("Blog post updated!");
    } else {
      // CREATE new post
      await addDoc(collection(db, "blog"), {
        title,
        excerpt,
        content,
        coverImage: imageUrl,
        tags,
        published,
        author: "Juma Paul",
        createdAt: new Date(),
      });
      alert("Blog post added successfully!");
    }

    blogFormContainer.style.display = "none";
    blogForm.reset();
    tinymce.get("editor-container").setContent("");
    loadBlogPosts();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Load and display blog posts
async function loadBlogPosts() {
  blogList.innerHTML = "<p>Loading...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "blog"));
    blogList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postCard = document.createElement("div");
      postCard.className = "blog-card";
      postCard.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <p><strong>Status:</strong> ${
          post.published ? "Published" : "Draft"
        }</p>
        <button onclick="editBlogPost('${doc.id}')">Edit</button>
        <button onclick="deleteBlogPost('${doc.id}')">Delete</button>
      `;
      blogList.appendChild(postCard);
    });
  } catch (error) {
    blogList.innerHTML = "<p>Error loading blog posts</p>";
  }
}

// Edit blog post
window.editBlogPost = async (postId) => {
  try {
    const postDoc = await getDoc(doc(db, "blog", postId));
    const post = postDoc.data();

    // Fill form
    document.getElementById("blog-title").value = post.title;
    document.getElementById("blog-excerpt").value = post.excerpt;
    tinymce.get("editor-container").setContent(post.content);
    document.getElementById("blog-tags").value = post.tags.join(", ");
    document.getElementById("blog-published").checked = post.published;

    // Show form
    blogFormContainer.style.display = "block";
    document.getElementById("blog-form-title").textContent = "Edit Blog Post";
    blogForm.dataset.editId = postId;
  } catch (error) {
    alert("Error loading blog post: " + error.message);
  }
};

// Delete blog post
window.deleteBlogPost = async (postId) => {
  if (confirm("Are you sure you want to delete this blog post?")) {
    try {
      await deleteDoc(doc(db, "blog", postId));
      alert("Blog post deleted!");
      loadBlogPosts();
    } catch (error) {
      alert("Error deleting blog post: " + error.message);
    }
  }
};

// Load blog posts on page load
loadBlogPosts();
