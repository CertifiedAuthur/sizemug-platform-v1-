class SharedMediaHandler {
  constructor() {
    this.mediaItems = [];
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupClickHandlers());
    } else {
      this.setupClickHandlers();
    }
  }

  setupClickHandlers() {
    const asideMediaGrid = document.querySelector(".aside-media-grid");
    if (!asideMediaGrid) return;

    // Collect all media URLs from the grid
    this.collectMediaItems();

    // Add click handlers using event delegation
    asideMediaGrid.addEventListener("click", (e) => {
      const clickedItem = e.target.closest(".aside-media-item");
      if (!clickedItem) return;

      const img = clickedItem.querySelector("img");
      if (!img || !img.src) return;

      // Open share media modal instead of individual preview
      if (window.openShareMediaModal) {
        window.openShareMediaModal();
      }

      e.preventDefault();
      e.stopPropagation();
    });

    // Handle "See all" link to open share media modal
    const sharedSeeAll = document.querySelector(".aside-section #sharedAsideSeeAll");
    if (sharedSeeAll) {
      sharedSeeAll.addEventListener("click", (e) => {
        e.preventDefault();
        if (window.openShareMediaModal) {
          window.openShareMediaModal();
        }
      });
    }

    // Add hover effects
    this.addHoverEffects();
  }

  collectMediaItems() {
    const mediaElements = document.querySelectorAll(".aside-media-item img");
    this.mediaItems = Array.from(mediaElements)
      .map((img) => img.src)
      .filter((src) => src && src.trim() !== "");
  }

  addHoverEffects() {
    const style = document.createElement("style");
    style.textContent = `
      .aside-media-item {
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .aside-media-item:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
      
      .aside-media-item img {
        transition: opacity 0.2s ease;
      }
      
      .aside-media-item:hover img {
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
  }

  // Method to refresh media items (useful if media is dynamically updated)
  refresh() {
    this.collectMediaItems();
  }

  // Method to add new media item
  addMediaItem(src) {
    if (src && !this.mediaItems.includes(src)) {
      this.mediaItems.push(src);
    }
  }

  // Method to get all media items
  getMediaItems() {
    return [...this.mediaItems];
  }
}

// Initialize shared media handler
const sharedMediaHandler = new SharedMediaHandler();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = SharedMediaHandler;
}
