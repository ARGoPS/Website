(function applyThemeImmediately() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
})();

function executeScripts(container) {
    const scripts = container.querySelectorAll("script");

    scripts.forEach(oldScript => {
        const newScript = document.createElement("script");

        // Copy attributes
        [...oldScript.attributes].forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
        });

        newScript.textContent = oldScript.textContent;

        oldScript.replaceWith(newScript); // ✅ key difference
    });
}

(function() {
    // Intercept clicks on links with data-spa
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-spa]');
        if (!link) return;

        const url = link.getAttribute('href');
        if (!url || url.startsWith('#') || link.target === "_blank") return;

        e.preventDefault();
        navigateTo(url);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        navigateTo(window.location.pathname, true);
    });

function navigateTo(url, isPopState = false) {
    const container = document.getElementById('cw');
    if (!container) return;

    container.style.opacity = '0.5';

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('Page not found');
            return res.text();
        })
        .then(html => {
            console.log("Loaded HTML:", html);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const newContent = doc.getElementById('cw');

            if (!newContent) {
                console.error("No #cw found in loaded page", url);
                return;
            }

            container.innerHTML = newContent.innerHTML;

            executeScripts(container); // 🔥 critical

            if (!isPopState) {
                history.pushState({}, '', url);
            }

            container.style.opacity = '1';

            reinitializePage();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(err => console.error('Navigation failed:', err));
}
    })();

// ===== APPLE-STYLE THEME TOGGLE =====
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    }
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }
});

// ===== PAGE LOAD ANIMATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in class to main content
    const mainContent = document.getElementById('cw');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.8s ease';
        setTimeout(() => {
            mainContent.style.opacity = '1';
        }, 100);
    }
    
    // Add stagger animation to cards
    document.querySelectorAll('.fade-in-stagger').forEach(container => {
        container.classList.add('fade-in-stagger');
    });
});

document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    reinitializePage();
});

function initHeader() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Ensure it's visible on load
    nav.style.opacity = "1";
    nav.style.transform = "translateY(0)";
}

window.addEventListener("scroll", handleScroll);
window.addEventListener("load", handleScroll); // ← IMPORTANT

function handleScroll() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    if (window.scrollY > 50) {
        nav.classList.add("nav-visible");
    } else {
        nav.classList.remove("nav-visible");
    }
}

function runAnimations() {
    const mainContent = document.getElementById('cw');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transition = 'opacity 0.5s ease';
        requestAnimationFrame(() => {
            mainContent.style.opacity = '1';
        });
    }

    document.querySelectorAll('.fade-in-stagger').forEach(container => {
        container.classList.remove('fade-in-stagger');
        void container.offsetWidth; // restart animation
        container.classList.add('fade-in-stagger');
    });
}

function reinitializePage() {
    applySavedTheme();
    initHeader();

    requestAnimationFrame(() => {
        handleScroll();
        runAnimations();

        if (typeof initButtons === "function") initButtons();
        if (typeof initCards === "function") initCards();
        if (typeof initAnythingElse === "function") initAnythingElse();
    });
}