async function loadInclude(id, file) {
    const placeholder = document.getElementById(id);
    if (!placeholder) return;
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        placeholder.innerHTML = await response.text();
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadInclude('nav-placeholder', 'nav.html'),
        loadInclude('footer-placeholder', 'footer.html')
    ]);

    // Re‑initialize any nav‑dependent code (theme, active link, etc.)
    if (typeof applySavedTheme === 'function') applySavedTheme();
    if (typeof initHeader === 'function') initHeader();

    // Show the page now that everything is loaded
    document.body.classList.add('loaded');
});