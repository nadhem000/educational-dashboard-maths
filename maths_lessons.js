/* ============================================================
   maths_lessons.js — Scripts specific to lesson pages
   ============================================================ */
/**
 * Toggle the collapse/expand state of a section.
 */
function toggleSection(bodyId, toggleId) {
    const body = document.getElementById(bodyId);
    const toggle = document.getElementById(toggleId);
    const header = body.closest('.section').querySelector('.section-header');
    if (!body || !toggle) return;
    const isCollapsed = body.classList.contains('collapsed');
    if (isCollapsed) {
        body.classList.remove('collapsed');
        toggle.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
    } else {
        body.classList.add('collapsed');
        toggle.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
    }
}
/**
 * Handles the print selection for a lesson page.
 */
function printSelected() {
    const select = document.getElementById('print-section');
    const value = select.value;
    document.body.classList.remove('print-all', 'print-rules', 'print-exercises', 'print-problems', 'print-solutions');
    if (value === 'all') document.body.classList.add('print-all');
    else if (value === 'rules') document.body.classList.add('print-rules');
    else if (value === 'exercises') document.body.classList.add('print-exercises');
    else if (value === 'problems') document.body.classList.add('print-problems');
    else if (value === 'solutions') document.body.classList.add('print-solutions');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('print-all', 'print-rules', 'print-exercises', 'print-problems', 'print-solutions');
    }, 1000);
}
/* ============================================================
   i18n logic
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    // Expand all sections
    document.querySelectorAll('.section-body').forEach(body => {
        body.classList.remove('collapsed');
    });
    document.querySelectorAll('.section-toggle').forEach(toggle => {
        toggle.classList.add('open');
    });
    document.querySelectorAll('.section-header').forEach(header => {
        header.setAttribute('aria-expanded', 'true');
    });
    // Language handling
    const langSelector = document.getElementById('language-select');
    if (!langSelector) return;
    function applyLanguage(lang) {
        // Apply text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
        // Apply placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang] && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });
        // Update direction and language
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
        // Save preference
        localStorage.setItem('lang', lang);
        // Re-render math (KaTeX) after language change if necessary
        if (window.renderMathInElement) {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    }
    const savedLang = localStorage.getItem('lang') || 'ar';
    langSelector.value = savedLang;
    applyLanguage(savedLang);
    langSelector.addEventListener('change', function () {
        applyLanguage(this.value);
    });
    // Initialize KaTeX auto-render on initial load
    if (window.renderMathInElement) {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
});
/* ============================================================
   JSXGraph Helper
   ============================================================ */
/**
 * Initializes a JSXGraph board.
 * @param {string} divId - The ID of the div container.
 * @param {object} options - Board options (boundingbox, axis, etc.).
 * @returns {object} The board instance.
 */
function initJSXGraph(divId, options = {}) {
    if (typeof JXG === 'undefined') {
        console.warn('JSXGraph not loaded.');
        return null;
    }
    const defaults = {
        boundingbox: [-5, 5, 5, -5],
        axis: true,
        showCopyright: false,
        showNavigation: false
    };
    const board = JXG.JSXGraph.initBoard(divId, {...defaults, ...options});
    return board;
}
/* Theme toggle logic */
(function () {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        htmlElement.setAttribute('data-theme', 'dark');
    }
    function updateIcon(theme) {
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    updateIcon(currentTheme);
    themeToggle.addEventListener('click', function () {
        const newTheme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
})();

/* ============================================================
   PWA support — injected dynamically by this file.
   - Injects <link rel="manifest">
   - Registers the service worker (sw.js)
   - Injects an Install button next to the theme toggle
   - Handles beforeinstallprompt / appinstalled
   Idempotent: safe to run on any page that loads this file.
   ============================================================ */
(function initPWA() {
    'use strict';

    /* --- 1. Inject <link rel="manifest"> if missing --- */
    if (!document.querySelector('link[rel="manifest"]')) {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = '/manifest.json';
        document.head.appendChild(link);
    }

    /* --- 2. Inject PWA button styles once --- */
    if (!document.getElementById('pwa-style')) {
        const style = document.createElement('style');
        style.id = 'pwa-style';
        style.textContent = `
            #pwa-install-btn {
                background: transparent;
                border: 1px solid var(--border);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: background var(--transition), transform var(--transition);
                color: var(--text);
                padding: 0;
            }
            #pwa-install-btn:hover {
                background: var(--hover);
                transform: scale(1.1);
            }
            #pwa-install-btn[hidden] { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    /* --- 3. Register the Service Worker --- */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(reg => console.log('[PWA] SW registered:', reg.scope))
                .catch(err => console.warn('[PWA] SW registration failed:', err));
        });
    }

    /* --- 4. Install button logic --- */
    let deferredPrompt = null;

    function injectInstallButton() {
        if (document.getElementById('pwa-install-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.type = 'button';
        btn.hidden = true;
        btn.setAttribute('aria-label', 'Install App');
        btn.setAttribute('title', 'Install App');
        btn.innerHTML = '<span>⬇️</span>';

        // Prefer the same row as the theme toggle
        const container =
            document.querySelector('.print-controls') ||
            document.querySelector('.top-nav') ||
            document.querySelector('.container');
        if (container) container.appendChild(btn);
    }

    function showButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.hidden = false;
    }
    function hideButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.hidden = true;
    }

    function onInstallClick() {
        if (!deferredPrompt) {
            // Fallback instructions
            const lang = document.documentElement.lang || 'en';
            const msg = lang === 'ar'
                ? 'لتثبيت التطبيق: افتح قائمة المتصفح واختر «إضافة إلى الشاشة الرئيسية».'
                : lang === 'fr'
                    ? 'Pour installer : ouvrez le menu du navigateur et choisissez « Ajouter à l’écran d’accueil ».'
                    : 'To install: open your browser menu and choose “Add to Home screen”.';
            alert(msg);
            return;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            console.log('[PWA] Install choice:', choice.outcome);
            deferredPrompt = null;
            hideButton();
        });
    }

    // Ensure the button exists early so layout is stable
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectInstallButton, { once: true });
    } else {
        injectInstallButton();
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        injectInstallButton();
        showButton();
        const btn = document.getElementById('pwa-install-btn');
        if (btn && !btn.dataset.bound) {
            btn.addEventListener('click', onInstallClick);
            btn.dataset.bound = '1';
        }
    });

    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed');
        hideButton();
        deferredPrompt = null;
    });

    // Hide if already running as installed app
    if (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true) {
        hideButton();
    }
})();