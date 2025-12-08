// // Category Dropdown :)
// class CategoryDropdownManager {
//   constructor() {
//     this.categoryDropdown = document.getElementById("startLiveStreamCategory");
//     this.popperInstance = null;
//     this.isDropdownOpen = false;
//     this.activeSelect = null;

//     this.init();
//   }

//   init() {
//     this.setupCategoryDropdowns();
//   }

//   setupCategoryDropdowns() {
//     if (!this.categoryDropdown) {
//       console.warn("CategoryDropdownManager: Category dropdown not found");
//       return;
//     }

//     // Get all category selects
//     const categorySelects = document.querySelectorAll(".creator_category_select");

//     categorySelects.forEach((select) => {
//       // Add click event to each category select
//       select.addEventListener("click", (e) => {
//         e.preventDefault();
//         this.toggleCategoryDropdown(select);
//       });
//     });

//     // Close dropdown when clicking outside
//     document.addEventListener("click", (e) => {
//       if (!this.activeSelect?.contains(e.target) && !this.categoryDropdown.contains(e.target)) {
//         this.hideCategoryDropdown();
//       }
//     });

//     // Handle category option selection
//     this.setupCategoryOptionHandlers();
//   }

//   createPopperInstance(referenceElement) {
//     if (this.popperInstance) {
//       this.popperInstance.destroy();
//     }

//     this.popperInstance = Popper.createPopper(referenceElement, this.categoryDropdown, {
//       placement: "bottom-start",
//       modifiers: [
//         {
//           name: "offset",
//           options: {
//             offset: [0, 8], // [x, y] offset
//           },
//         },
//         {
//           name: "preventOverflow",
//           options: {
//             padding: 8,
//           },
//         },
//         {
//           name: "flip",
//           options: {
//             fallbackPlacements: ["top-start", "bottom-end", "top-end"],
//           },
//         },
//         {
//           name: "computeStyles",
//           options: {
//             adaptive: true,
//           },
//         },
//         {
//           name: "minWidth",
//           enabled: true,
//           phase: "write",
//           fn({ state }) {
//             const refW = state.rects.reference.width;
//             state.styles.popper.minWidth = `${refW}px`;
//           },
//         },
//         {
//           name: "sameWidth",
//           enabled: true,
//           phase: "beforeWrite",
//           fn({ state }) {
//             const refW = state.rects.reference.width;
//             // force the popper root to exactly the button's width
//             state.styles.popper.width = `${refW}px`;
//           },
//         },
//       ],
//     });
//   }

//   toggleCategoryDropdown(select) {
//     if (this.isDropdownOpen && this.activeSelect === select) {
//       this.hideCategoryDropdown();
//     } else {
//       this.showCategoryDropdown(select);
//     }
//   }

//   showCategoryDropdown(select) {
//     if (this.isDropdownOpen) return;

//     console.log("Open Dropdown :)");

//     this.activeSelect = select;
//     this.isDropdownOpen = true;
//     this.categoryDropdown.classList.remove(HIDDEN);
//     this.categoryDropdown.querySelector(".sg-custom-dropdown-search-container").classList.add("modal-anim-in");

//     // Update ARIA attributes
//     select.setAttribute("aria-expanded", "true");

//     // Create/Update Popper instance with the active select
//     this.createPopperInstance(select);
//     this.popperInstance.update();
//   }

//   hideCategoryDropdown() {
//     if (!this.isDropdownOpen) return;

//     this.isDropdownOpen = false;
//     const container = this.categoryDropdown.querySelector(".sg-custom-dropdown-search-container");

//     container.classList.remove("modal-anim-in");
//     container.classList.add("modal-anim-out");

//     // Update ARIA attributes
//     if (this.activeSelect) {
//       this.activeSelect.setAttribute("aria-expanded", "false");
//     }

//     // Hide after animation
//     setTimeout(() => {
//       this.categoryDropdown.classList.add(HIDDEN);
//       container.classList.remove("modal-anim-out");
//       this.activeSelect = null;
//     }, 220);
//   }

//   setupCategoryOptionHandlers() {
//     const categoryOptions = this.categoryDropdown.querySelectorAll('li[role="option"]');

//     categoryOptions.forEach((option) => {
//       option.addEventListener("click", (e) => {
//         e.preventDefault();
//         this.selectCategory(option);
//       });
//     });
//   }

//   selectCategory(selectedOption) {
//     const categoryText = selectedOption.textContent;
//     const categoryValue = selectedOption.getAttribute("data-category");

//     // Update the display text for the active select
//     if (this.activeSelect) {
//       const displaySpan = this.activeSelect.querySelector("span[id$='-display']");
//       if (displaySpan) {
//         displaySpan.textContent = categoryText;
//       }
//     }

//     // Hide dropdown
//     this.hideCategoryDropdown();

//     // Dispatch custom event for external handling
//     this.dispatchCategorySelectedEvent(categoryValue, categoryText);
//   }

//   dispatchCategorySelectedEvent(category, text) {
//     const event = new CustomEvent("categorySelected", {
//       detail: {
//         category,
//         text,
//         source: this.activeSelect?.id || "unknown",
//         timestamp: Date.now(),
//       },
//       bubbles: true,
//     });

//     if (this.activeSelect) {
//       this.activeSelect.dispatchEvent(event);
//     }
//   }

//   // Public methods for external control
//   getSelectedCategory(selectId = null) {
//     const targetSelect = selectId ? document.getElementById(selectId) : this.activeSelect;
//     if (!targetSelect) return "Choose a category...";

//     const displaySpan = targetSelect.querySelector("span[id$='-display']");
//     return displaySpan ? displaySpan.textContent : "Choose a category...";
//   }

//   setSelectedCategory(category, selectId = null) {
//     const targetSelect = selectId ? document.getElementById(selectId) : this.activeSelect;
//     if (!targetSelect) return;

//     const option = this.categoryDropdown.querySelector(`li[data-category="${category}"]`);
//     if (option) {
//       this.selectCategory(option);
//     }
//   }

//   // Cleanup method
//   destroy() {
//     if (this.popperInstance) {
//       this.popperInstance.destroy();
//       this.popperInstance = null;
//     }
//   }
// }

// // Initialize when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   if (document.querySelector(".creator_studio_aside_container")) {
//     window.categoryDropdownManager = new CategoryDropdownManager();

//     // Listen for category selection events from both forms
//     document.addEventListener("categorySelected", (e) => {
//       console.log("Category selected:", e.detail);
//       // You can handle different forms based on e.detail.source
//       if (e.detail.source.includes("room")) {
//         console.log("Room category selected:", e.detail.category);
//       } else {
//         console.log("Stream category selected:", e.detail.category);
//       }
//     });
//   }
// });

// // Export for module systems
// if (typeof module !== "undefined" && module.exports) {
//   module.exports = CategoryDropdownManager;
// }

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
/*
  SGThumbnailUploader: Framework-agnostic uploader customized for .creator_thumbnail_container
  Usage: new SGThumbnailUploader(containerSelectorOrElement, options)
*/
class SGThumbnailUploader {
  constructor(root, options = {}) {
    this.root = typeof root === "string" ? document.querySelector(root) : root;
    if (!this.root) throw new Error("SGThumbnailUploader: root not found");

    const defaults = { maxSize: 5 * 1024 * 1024, allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml"], onChange: null };
    this.opts = { ...defaults, ...options };

    // Elements
    this.beforeEl = this.root.querySelector(".creator_thumbnail_container--before");
    this.afterEl = this.root.querySelector(".creator_thumbnail_container--after");
    this.fileInput = this.root.querySelector('input[type="file"]');
    this.changeBtn = this.afterEl.querySelector(".creator_thumbnail_container--change");
    this.deleteBtn = this.afterEl.querySelector(".creator_thumbnail_container--trash");
    this.previewImg = this.afterEl.querySelector("img");

    this.currentFile = null;
    this._bindEvents();
    this._updateUI();
  }

  _bindEvents() {
    // click on beforeEl triggers upload
    this.beforeEl.addEventListener("click", (e) => {
      // e.preventDefault();
      // e.stopPropagation();
      this.fileInput.click();
    });

    // explicit upload button inside beforeEl
    const uploadBtn = this.beforeEl.querySelector("button[aria-label]");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        this.fileInput.click();
      });
    }

    // file selection
    this.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      this._handleFile(file);
    });

    // change button
    if (this.changeBtn) {
      this.changeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.fileInput.click();
      });
    }

    // delete button
    if (this.deleteBtn) {
      this.deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clear();
      });
    }
  }

  _handleFile(file) {
    if (!file) return;
    if (!this.opts.allowedTypes.includes(file.type)) {
      alert("Invalid type");
      this.fileInput.value = "";
      return;
    }
    if (file.size > this.opts.maxSize) {
      alert("File too large");
      this.fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.currentFile = file;
      this.previewImg.src = reader.result;
      this.previewImg.alt = file.name;
      this._updateUI();
      this._emitChange();
    };
    reader.readAsDataURL(file);
  }

  _updateUI() {
    if (this.currentFile) {
      this.beforeEl.classList.add("live--hidden");
      this.afterEl.classList.remove("live--hidden");
      this.afterEl.setAttribute("aria-hidden", "false");
    } else {
      this.beforeEl.classList.remove("live--hidden");
      this.afterEl.classList.add("live--hidden");
      this.afterEl.setAttribute("aria-hidden", "true");
    }
  }

  _emitChange() {
    const evt = new CustomEvent("thumbnailChange", { detail: { file: this.currentFile, hasThumbnail: !!this.currentFile }, bubbles: true });
    this.root.dispatchEvent(evt);
    if (typeof this.opts.onChange === "function") this.opts.onChange(this.currentFile);
  }

  // Public
  getFile() {
    return this.currentFile;
  }
  clear() {
    this.currentFile = null;
    this.fileInput.value = "";
    this._updateUI();
    this._emitChange();
  }
  reset() {
    this.clear();
  }
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".creator_thumbnail_container").forEach((el) => new SGThumbnailUploader(el));
});
