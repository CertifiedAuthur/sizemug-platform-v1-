class ShareMediaModal {
  constructor() {
    this.modal = document.getElementById("shareMediaModal");
    this.closeBtn = document.getElementById("closeShareModal");
    this.overlay = this.modal?.querySelector(".share-modal-overlay");
    this.content = this.modal?.querySelector(".share-modal-content");

    // Media containers
    this.todayContainer = document.getElementById("todayMedia");
    this.yesterdayContainer = document.getElementById("yesterdayMedia");
    this.lastweekContainer = document.getElementById("lastweekMedia");

    // Time toggles
    this.timeToggles = this.modal?.querySelectorAll(".share-time-toggle");

    // Sample media data (replace with real data)
    this.mediaData = {
      today: ["https://plus.unsplash.com/premium_photo-1760441128908-4753770afdec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1761133135231-2f2fe70907e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://plus.unsplash.com/premium_photo-1760972190929-3974abab84f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1742201473145-28d80d0e6974?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60"],
      yesterday: ["https://plus.unsplash.com/premium_photo-1760441128908-4753770afdec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1761828122700-11b752d69a88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60"],
      lastweek: ["https://images.unsplash.com/photo-1761839257165-44f08ed617c7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1760392441483-f3fe304ddb9a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60", "https://plus.unsplash.com/premium_photo-1760441128908-4753770afdec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1761133135231-2f2fe70907e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://plus.unsplash.com/premium_photo-1760972190929-3974abab84f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1742201473145-28d80d0e6974?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1761828122700-11b752d69a88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60", "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60"],
    };

    this.init();
  }

  init() {
    if (!this.modal) return;

    // Close modal events
    this.closeBtn?.addEventListener("click", () => this.close());
    this.overlay?.addEventListener("click", () => this.close());

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("live-chat-hidden") && e.key === "Escape") {
        this.close();
      }
    });

    // Time toggle events
    this.timeToggles?.forEach((toggle) => {
      toggle.addEventListener("click", () => this.toggleTimeSection(toggle));
    });

    // Populate media grids
    this.populateMediaGrids();
  }

  open() {
    if (!this.modal) return;

    this.modal.classList.remove("live-chat-hidden");
    document.body.style.overflow = "hidden";

    // Refresh media data when opening
    this.populateMediaGrids();
  }

  close() {
    if (!this.modal) return;

    this.modal.classList.add("live-chat-hidden");
    document.body.style.overflow = "";
  }

  toggleTimeSection(toggle) {
    const period = toggle.dataset.period;
    const isActive = toggle.classList.contains("active");
    const mediaGrid = document.getElementById(`${period}Media`);

    if (isActive) {
      // Collapse section
      toggle.classList.remove("active");
      mediaGrid?.classList.add("live-chat-hidden");
    } else {
      // Expand section
      toggle.classList.add("active");
      mediaGrid?.classList.remove("live-chat-hidden");
    }
  }

  populateMediaGrids() {
    // Populate Today
    this.populateGrid("today", this.todayContainer);

    // Populate Yesterday
    this.populateGrid("yesterday", this.yesterdayContainer);

    // Populate Last Week
    this.populateGrid("lastweek", this.lastweekContainer);
  }

  populateGrid(period, container) {
    if (!container) return;

    const mediaItems = this.mediaData[period] || [];

    if (mediaItems.length === 0) {
      container.innerHTML = `
        <div class="share-media-empty">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p>No media shared ${period === "lastweek" ? "last week" : period}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = mediaItems
      .map((src, index) => {
        const isVideo = this.isVideoUrl(src);
        const mediaType = isVideo ? "video" : "img";
        const videoClass = isVideo ? " video" : "";

        return `
        <div class="share-media-item${videoClass}" data-src="${src}" data-index="${index}" data-period="${period}">
          <${mediaType} src="${src}" ${isVideo ? "muted" : ""} loading="lazy" />
        </div>
      `;
      })
      .join("");

    // Add click handlers to media items
    container.querySelectorAll(".share-media-item").forEach((item) => {
      item.addEventListener("click", () => this.openMediaPreview(item));
    });
  }

  isVideoUrl(url) {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  openMediaPreview(mediaItem) {
    const src = mediaItem.dataset.src;
    const period = mediaItem.dataset.period;
    const index = parseInt(mediaItem.dataset.index);

    // Get all media from the same period
    const periodMedia = this.mediaData[period] || [];

    // Close share modal
    this.close();

    // Open media modal if available
    if (window.mediaModal) {
      window.mediaModal.open(periodMedia, index);
    } else {
      // Fallback: open in new tab
      window.open(src, "_blank");
    }
  }

  // Method to add new media (for integration with chat)
  addMedia(src, period = "today") {
    if (!this.mediaData[period]) {
      this.mediaData[period] = [];
    }

    // Add to beginning of array (most recent first)
    this.mediaData[period].unshift(src);

    // Limit to reasonable number of items
    if (this.mediaData[period].length > 50) {
      this.mediaData[period] = this.mediaData[period].slice(0, 50);
    }

    // Refresh the grid if modal is open
    if (!this.modal?.classList.contains("live-chat-hidden")) {
      this.populateGrid(period, document.getElementById(`${period}Media`));
    }
  }

  // Method to clear media for a period
  clearMedia(period) {
    if (this.mediaData[period]) {
      this.mediaData[period] = [];
      this.populateGrid(period, document.getElementById(`${period}Media`));
    }
  }

  // Method to get media count for a period
  getMediaCount(period) {
    return this.mediaData[period]?.length || 0;
  }
}

// Initialize share media modal
const shareMediaModal = new ShareMediaModal();

// Global function to open share modal
window.openShareMediaModal = () => {
  shareMediaModal.open();
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ShareMediaModal;
}
