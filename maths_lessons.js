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