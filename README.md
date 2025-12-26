# Portfolio Website

A modern, responsive portfolio website showcasing my projects, blog posts, and professional experience. Built with vanilla JavaScript and powered by Firebase for dynamic content management.

## 🌐 Live Demo

[View Live Site](https://yourusername.github.io/portfolio)

## ✨ Features

- **Dynamic Projects Showcase** - Filter projects by category (Full Stack, Backend/APIs, Data Science/ML, Tools & CLI)
- **Blog with Rich Content** - Full blog functionality with rich text formatting and code snippets
- **Dark Mode** - Toggle between light and dark themes with persistent preference
- **Responsive Design** - Fully responsive across all devices
- **Real-time Content** - All content dynamically loaded from Firebase
- **Admin Panel** - Secure content management system (admin access only)

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Firebase SDK (Firestore, Storage, Authentication)
- TinyMCE (Rich text editor)
- Devicons (Technology icons)

**Backend:**
- Firebase Firestore (Database)
- Firebase Storage (Image hosting)
- Firebase Authentication (Admin access)
- Firebase Hosting (Admin panel deployment)

**Deployment:**
- GitHub Pages (Frontend)
- Firebase Hosting (Admin panel)
- GitHub Actions (CI/CD)

## 📁 Project Structure
portfolio/ ├── index.html # Main portfolio page ├── script.js # Frontend JavaScript ├── style.css # Styles and responsive design ├── firebase-config.js # Firebase configuration ├── admin/ # Admin panel (private) │ ├── index.html │ ├── admin.js │ └── admin.css └── assets/ # Images and static files

Copied!
## 🚀 Local Development

1. **Clone the repository**
git clone https://github.com/yourusername/portfolio.git cd portfolio

Copied!
2. **Set up Firebase**
- Create a Firebase project at [firebase.google.com](https://firebase.google.com)
- Enable Firestore, Storage, and Authentication
- Copy your Firebase config to `firebase-config.js`

3. **Run locally**
Use any local server, for example:
python -m http.server 8000

Or use Live Server in VS Code
Copied!
4. **View in browser**
http://localhost:8000

Copied!
## 🔒 Security

- Firebase security rules protect database writes
- Authentication required for content management
- API keys are public (standard for client-side Firebase apps)
- Security enforced through Firestore rules, not key hiding

## 📝 Content Management

Content is managed through a secure admin panel with:
- Add/Edit/Delete projects
- Write blog posts with rich text editor
- Upload images to Firebase Storage
- Publish/unpublish blog posts

## 🎨 Features in Detail

**Projects Section:**
- Filterable by technology category
- Direct links to GitHub repos and live demos
- Technology stack badges
- Responsive grid layout

**Blog Section:**
- Rich text content with code highlighting
- Estimated read time calculation
- Tag-based organization
- Cover images and author info

**Dark Mode:**
- System preference detection
- Manual toggle
- Persistent across sessions

## 📄 License

MIT License - feel free to use this code for your own portfolio!

## 🤝 Contributing

This is a personal portfolio, but suggestions and feedback are welcome! Feel free to open an issue.

## 📧 Contact

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

---

Built with ❤️ using vanilla JavaScript and Firebase