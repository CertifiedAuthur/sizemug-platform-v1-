// progress.js
document.addEventListener('DOMContentLoaded', () => {
    // Select the progress bar element
    const progressEl = document.querySelector('.progress-bar .progress');

    // Initialize variables for scroll position and throttling
    let lastKnownScrollY = 0;
    let ticking = false;

    /**
     * Calculates and updates the width of the progress bar based on scroll position.
     * Uses requestAnimationFrame for smooth and efficient updates.
     */
    const updateProgress = () => {
        // Get the current scroll position from the top of the document
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate the total scrollable height of the document
        // This is the total height minus the viewport height
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Calculate the percentage of the page scrolled
        // Guard against division by zero if the document isn't scrollable
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Update the width of the progress bar element
        progressEl.style.width = pct + '%';

        // Reset the ticking flag to allow the next animation frame
        ticking = false;
    };

    // Listen for scroll events on the window
    window.addEventListener('scroll', () => {
        // Update the last known scroll position
        lastKnownScrollY = window.pageYOffset;

        // If not already scheduled, request an animation frame to update progress
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true; // Set flag to true to prevent multiple requests
        }
    });
});