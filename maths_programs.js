/* ============================================================
   maths_programs.js — Scripts specific to the index/programs page
   (maths_y7.html)
   ============================================================ */

/**
 * Toggle the expansion/collapse of a module's lesson list.
 * @param {string} moduleId - The ID of the lesson list element.
 */
function toggleModule(moduleId) {
    const list = document.getElementById(moduleId);
    const toggleIcon = document.getElementById(
        moduleId === 'algebraModule' ? 'algebraToggle' : 'geometryToggle'
    );
    const header = list.closest('.module-card').querySelector('.module-header');

    if (!list || !toggleIcon) return;

    const isExpanded = list.classList.contains('expanded');

    if (isExpanded) {
        list.classList.remove('expanded');
        toggleIcon.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
    } else {
        list.classList.add('expanded');
        toggleIcon.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
    }
}

/**
 * Handles the print selection for the index page.
 */
function printSelected() {
    const select = document.getElementById('print-section');
    const value = select.value;
    document.body.classList.remove('print-all', 'print-algebra', 'print-geometry');
    if (value === 'all') document.body.classList.add('print-all');
    else if (value === 'algebra') document.body.classList.add('print-algebra');
    else if (value === 'geometry') document.body.classList.add('print-geometry');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('print-all', 'print-algebra', 'print-geometry');
    }, 1000);
}

/* ============================================================
   i18n logic – reads the global `translations` object
   which is defined in the HTML file.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
    // Ensure modules start expanded and ARIA set
    const algebraList = document.getElementById('algebraModule');
    const geometryList = document.getElementById('geometryModule');
    if (algebraList) algebraList.classList.add('expanded');
    if (geometryList) geometryList.classList.add('expanded');
    const algebraToggle = document.getElementById('algebraToggle');
    const geometryToggle = document.getElementById('geometryToggle');
    if (algebraToggle) algebraToggle.classList.add('open');
    if (geometryToggle) geometryToggle.classList.add('open');
    document.querySelectorAll('.module-header').forEach(header => {
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
    }

    const savedLang = localStorage.getItem('lang') || 'ar';
    langSelector.value = savedLang;
    applyLanguage(savedLang);

    langSelector.addEventListener('change', function () {
        applyLanguage(this.value);
    });
});

/* Theme toggle logic (unchanged) */
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