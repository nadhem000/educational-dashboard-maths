# 📐 Educational Dashboard – Mathematics

A trilingual (Arabic, English, French) web application for mathematics lessons, covering Years 5 through 9 of basic education.  
It includes structured lesson indexes, printable sections, dark/light theme, and is being converted into a **Progressive Web App (PWA)** for offline access and installability.

---

## 🚀 Features

- **Trilingual support** – Arabic (RTL), English (LTR), French (LTR)
- **Lesson indexes** for Years 5, 6, 7, 8, 9
- **Collapsible modules** and lesson groups
- **Print selection** – print all, or specific periods/modules
- **Dark / Light theme** toggle with local storage persistence
- **Responsive design** for mobile and desktop
- **PWA-ready** – service worker, manifest, and install button (in progress)
- **Hosted on Netlify** with continuous deployment from GitHub

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **PWA:** Service Worker, Web App Manifest
- **Deployment:** Netlify (netlify.toml, build settings)
- **Version Control:** GitHub
- **Optional math rendering:** KaTeX, JSXGraph (planned/integrated in lesson pages)

---

## 📁 Project Structure (simplified)

```
/
├── index.html                 # Home page – year selection
├── maths_y5.html              # Year 5 index
├── maths_y6.html              # Year 6 index
├── maths_y7.html              # Year 7 index
├── maths_y8.html              # Year 8 index (planned)
├── maths_y9.html              # Year 9 index (planned)
├── maths_shared.css           # Shared styles
├── maths_programs.css         # Index page styles
├── maths_lessons.css          # Lesson page styles
├── maths_programs.js          # Index page scripts (i18n, theme, toggles)
├── maths_lessons.js           # Lesson page scripts (i18n, sections, JSXGraph)
├── assets/
│   └── icons/                 # PWA icons (152x152, 192x192, 512x512)
├── readme.md
├── netlify.toml               # (to be added)
├── sw.js                      # (to be added)
├── manifest.json              # (to be added)
└── ... (lesson pages)
```

---

## 🌐 Deployment on Netlify

1. Push this repository to GitHub.
2. Connect the repo to Netlify.
3. Netlify will use the `netlify.toml` configuration (provided separately) to set headers, redirects, and build settings.
4. The site will be automatically deployed on every push to the main branch.

---

## 📱 PWA Configuration

The following files are being added to enable PWA features:

- `manifest.json` – app metadata, icons, theme colors
- `sw.js` – service worker for caching and offline support
- Install button – a UI element to prompt the user to install the app

Once complete, the app will be installable on mobile and desktop, and will work offline for cached pages.

---

## 🧑‍💻 Author

**Majri Zied**  
- Hosting: GitHub, Netlify, Supabase  
- Version: 0.0.2  
- © 2025 All rights reserved

---

## 📄 License

This project is for educational purposes. Please contact the author for usage rights.