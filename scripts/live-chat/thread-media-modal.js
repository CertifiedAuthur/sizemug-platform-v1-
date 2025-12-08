class MediaModal {
  constructor() {
    this.modal = document.getElementById("mediaModal");
    this.closeBtn = document.getElementById("closeMediaModal");
    this.downloadBtn = document.getElementById("downloadCurrentPreviewMedia");
    this.prevBtn = document.getElementById("mediaPrevBtn");
    this.nextBtn = document.getElementById("mediaNextBtn");
    this.imageDisplay = document.getElementById("mediaDisplayImage");
    this.videoDisplay = document.getElementById("mediaDisplayVideo");
    this.currentIndexEl = document.getElementById("mediaCurrentIndex");
    this.totalCountEl = document.getElementById("mediaTotalCount");

    this.mediaItems = [];
    this.currentIndex = 0;

    // Dummy media URLs for testing
    this.previewMedias = ["https://plus.unsplash.com/premium_photo-1760441128908-4753770afdec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1761133135231-2f2fe70907e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://plus.unsplash.com/premium_photo-1760972190929-3974abab84f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1742201473145-28d80d0e6974?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw5fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1761828122700-11b752d69a88?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1759400333614-6d27a2666266?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1761839257165-44f08ed617c7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1760392441483-f3fe304ddb9a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=900"];

    this.init();
  }

  init() {
    // Close modal events
    this.closeBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal || e.target.classList.contains("media-modal-overlay")) {
        this.close();
      }
    });

    // Navigation events
    this.prevBtn.addEventListener("click", () => this.showPrevious());
    this.nextBtn.addEventListener("click", () => this.showNext());

    // Download event
    this.downloadBtn.addEventListener("click", () => this.downloadCurrentMedia());

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (!this.modal.classList.contains("live-chat-hidden")) {
        switch (e.key) {
          case "Escape":
            this.close();
            break;
          case "ArrowLeft":
            this.showPrevious();
            break;
          case "ArrowRight":
            this.showNext();
            break;
        }
      }
    });

    // Touch/swipe events for mobile
    let startX = 0;
    let endX = 0;

    this.modal.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this.modal.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        // Minimum swipe distance
        if (diff > 0) {
          this.showNext(); // Swipe left - next
        } else {
          this.showPrevious(); // Swipe right - previous
        }
      }
    });
  }

  open(mediaItems, startIndex = 0) {
    this.mediaItems = mediaItems;
    this.currentIndex = startIndex;
    this.updateDisplay();
    this.modal.classList.remove("live-chat-hidden");
    document.body.style.overflow = "hidden";
  }

  close() {
    this.modal.classList.add("live-chat-hidden");
    document.body.style.overflow = "";
    this.videoDisplay.pause();
  }

  showPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateDisplay();
    }
  }

  showNext() {
    if (this.currentIndex < this.mediaItems.length - 1) {
      this.currentIndex++;
      this.updateDisplay();
    }
  }

  updateDisplay() {
    const currentItem = this.mediaItems[this.currentIndex];

    // Hide both displays first
    this.imageDisplay.style.display = "none";
    this.videoDisplay.style.display = "none";
    this.videoDisplay.pause();

    // Handle both object format and simple URL strings
    let src, type;
    if (typeof currentItem === "string") {
      src = currentItem;
      type = this.getMediaType(src);
    } else {
      src = currentItem.src;
      type = currentItem.type;
    }

    // Show appropriate display
    if (type === "image") {
      this.imageDisplay.src = src;
      this.imageDisplay.style.display = "block";
    } else if (type === "video") {
      this.videoDisplay.src = src;
      this.videoDisplay.style.display = "block";
    }

    // Update counter
    this.currentIndexEl.textContent = this.currentIndex + 1;
    this.totalCountEl.textContent = this.mediaItems.length;

    // Update navigation buttons
    this.prevBtn.style.opacity = this.currentIndex === 0 ? "0.5" : "1";
    this.nextBtn.style.opacity = this.currentIndex === this.mediaItems.length - 1 ? "0.5" : "1";
  }

  // Helper method to determine media type from URL
  getMediaType(url) {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    const urlLower = url.toLowerCase();

    if (videoExtensions.some((ext) => urlLower.includes(ext))) {
      return "video";
    }

    // Default to image for most cases, including Unsplash URLs
    return "image";
  }

  // Method to open modal with dummy media for testing
  openWithDummyMedia() {
    this.open(this.previewMedias, 0);
  }

  // Method to download the currently displayed media
  async downloadCurrentMedia() {
    const currentItem = this.mediaItems[this.currentIndex];

    // Get the source URL
    let src;
    if (typeof currentItem === "string") {
      src = currentItem;
    } else {
      src = currentItem.src;
    }

    if (!src) return;

    try {
      // Fetch the image/video data
      const response = await fetch(src);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename from URL or use default
      const urlParts = src.split("/");
      const filename = urlParts[urlParts.length - 1].split("?")[0] || `media-${this.currentIndex + 1}`;
      const extension = this.getMediaType(src) === "image" ? ".jpg" : ".mp4";

      link.download = filename.includes(".") ? filename : filename + extension;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(src, "_blank");
    }
  }

  // Method to collect media from a thread message
  static collectMediaFromMessage(messageElement) {
    const mediaItems = [];
    const images = messageElement.querySelectorAll("img[src]");
    const videos = messageElement.querySelectorAll("video[src], video source");

    images.forEach((img) => {
      if (img.src && !img.src.includes("avatar") && !img.src.includes("icon")) {
        mediaItems.push({
          type: "image",
          src: img.src,
          element: img,
        });
      }
    });

    videos.forEach((video) => {
      const src = video.src || (video.tagName === "SOURCE" ? video.src : "");
      if (src) {
        mediaItems.push({
          type: "video",
          src: src,
          element: video,
        });
      }
    });

    return mediaItems;
  }
}

// Initialize media modal
const mediaModal = new MediaModal();

// Make it globally available
window.mediaModal = mediaModal;

// Global function to test the modal with dummy media
window.testMediaModal = () => {
  mediaModal.openWithDummyMedia();
};

// Function to setup media click handlers for thread messages
function setupMediaClickHandlers() {
  const threadMessages = document.getElementById("threadChatMessages");
  if (!threadMessages) return;

  // Use event delegation to handle dynamically added content
  threadMessages.addEventListener("click", (e) => {
    const clickedElement = e.target;

    // Check if clicked element is an image or video
    if (clickedElement.tagName === "IMG" || clickedElement.tagName === "VIDEO") {
      // Skip if it's an avatar or icon
      if (clickedElement.src && (clickedElement.src.includes("avatar") || clickedElement.src.includes("icon") || clickedElement.classList.contains("avatar") || clickedElement.classList.contains("icon"))) {
        return;
      }

      // Find the position of clicked image in previewMedias array
      const clickedSrc = clickedElement.src;
      const indexInPreviewArray = mediaModal.previewMedias.findIndex((url) => url === clickedSrc);

      if (indexInPreviewArray !== -1) {
        // Open modal with all preview media, starting at the clicked image position
        mediaModal.open(mediaModal.previewMedias, indexInPreviewArray);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });
}

// Setup handlers when DOM is ready
document.addEventListener("DOMContentLoaded", setupMediaClickHandlers);

// Also setup handlers if DOM is already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupMediaClickHandlers);
} else {
  setupMediaClickHandlers();
}
