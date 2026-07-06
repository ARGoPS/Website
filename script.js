(function() {
    // Intercept clicks on links with data-spa
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-spa]');
        if (!link) return;

        const url = link.getAttribute('href');
        if (!url || url.startsWith('#') || url.startsWith('http')) return;

        e.preventDefault();
        navigateTo(url);
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        navigateTo(window.location.pathname, true);
    });

    function navigateTo(url, isPopState = false) {
        const container = document.getElementById('cw');
        container.style.opacity = '0.5';

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Page not found');
                return response.text();
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newContent = doc.getElementById('cw');

                if (newContent) {
                    container.innerHTML = newContent.innerHTML;
                } else {
                    // Fallback: if no #cw, use the whole body
                    container.innerHTML = doc.body.innerHTML;
                }

                if (!isPopState) {
                    window.history.pushState({}, '', url);
                }

                container.style.opacity = '1';
                // Scroll to top when navigating
                window.scrollTo({ top: 0, behavior: 'smooth' });
            })
            .catch(err => {
                console.error('Navigation failed:', err);
                container.innerHTML = `<p style="padding:40px;text-align:center;color:red;">Failed to load page. <a href="${url}">Refresh to try again</a>.</p>`;
                container.style.opacity = '1';
            });
        }
    })();

// ===== APPLE-STYLE THEME TOGGLE =====
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Optional: Add haptic feedback simulation
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
}

// Load saved theme preference
(function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const theme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }
});