/**
 * Create Thread Modal Manager
 * Handles thread creation functionality with space attachment
 */

class CreateThreadModal {
  constructor() {
    this.overlay = document.getElementById("createThreadOverlay");
    this.modal = document.getElementById("createThreadModal");
    this.spaceSelectionOverlay = document.getElementById("spaceSelectionOverlay");
    this.yourSpaceSelectionOverlay = document.getElementById("yourSpaceSelectionOverlay");
    this.selectedSpaceData = null;
    this.uploadedMedia = [];

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSpaces();
  }

  bindEvents() {
    // Main modal events
    const closeBtn = this.modal.querySelector(".ctm-close-btn-4822");
    const cancelBtn = this.modal.querySelector('[data-action="cancel"]');
    const createBtn = this.modal.querySelector('[data-action="create"]');
    const showAllSpacesBtn = document.getElementById("showAllSpacesBtn");

    closeBtn?.addEventListener("click", () => this.close());
    cancelBtn?.addEventListener("click", () => this.close());
    createBtn?.addEventListener("click", () => this.createThread());

    // Close on overlay click
    this.overlay?.addEventListener("click", (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Space selection events
    const spaceSelector = document.getElementById("selectedSpace");
    const changeSpaceBtn = document.getElementById("changeSpaceBtn");

    spaceSelector?.addEventListener("click", () => this.openSpaceSelection());
    changeSpaceBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openSpaceSelection();
    });

    //
    showAllSpacesBtn.addEventListener("click", () => {
      this.renderYourSpaceList();
      this.yourSpaceSelectionOverlay?.classList.add("ctm-visible-4822");
    });

    // Space selection modal events
    const spaceModalClose = document.getElementById("spaceModalClose");
    spaceModalClose?.addEventListener("click", () => this.closeSpaceSelection());

    const yourSpaceModalClose = document.getElementById("yourSpaceModalClose");
    yourSpaceModalClose?.addEventListener("click", () => this.closeYourSpaceSelection());

    this.spaceSelectionOverlay?.addEventListener("click", (e) => {
      if (e.target === this.spaceSelectionOverlay) this.closeSpaceSelection();
    });

    this.yourSpaceSelectionOverlay?.addEventListener("click", (e) => {
      if (e.target === this.yourSpaceSelectionOverlay) this.closeYourSpaceSelection();
    });

    // Search functionality
    const spaceSearchInput = document.getElementById("spaceSearchInput");
    spaceSearchInput?.addEventListener("input", (e) => this.filterSpaces(e.target.value));

    // Media upload events
    this.bindMediaUploadEvents();

    // Form validation
    this.bindFormValidation();

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Only handle shortcuts when modal is open
      if (!this.overlay?.classList.contains("ctm-visible-4822")) return;

      switch (e.key) {
        case "Escape":
          if (this.spaceSelectionOverlay?.classList.contains("ctm-visible-4822")) {
            this.closeSpaceSelection();
          } else {
            this.close();
          }
          break;

        case "Enter":
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd + Enter to create thread
            e.preventDefault();
            const createBtn = document.getElementById("createThreadBtn");
            if (createBtn && !createBtn.disabled) {
              this.createThread();
            }
          }
          break;

        case "s":
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd + S to open space selection
            e.preventDefault();
            this.openSpaceSelection();
          }
          break;
      }
    });
  }

  bindMediaUploadEvents() {
    const uploadArea = document.getElementById("uploadArea");
    const addMediaBtn = document.getElementById("addMediaBtn");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = true;
    fileInput.accept = "image/*,video/*";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // Click to upload - only bind to the button, not the upload area
    addMediaBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput.click();
    });

    // File input change
    fileInput.addEventListener("change", (e) => {
      this.handleFileUpload(e.target.files);
      // Reset the input so the same file can be selected again
      e.target.value = "";
    });

    // Drag and drop
    uploadArea?.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadArea.classList.add("ctm-drag-over-4822");
    });

    uploadArea?.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("ctm-drag-over-4822");
    });

    uploadArea?.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadArea.classList.remove("ctm-drag-over-4822");
      this.handleFileUpload(e.dataTransfer.files);
    });
  }

  bindFormValidation() {
    const titleInput = document.getElementById("threadTitle");
    const createBtn = document.getElementById("createThreadBtn");

    const validateForm = () => {
      const hasTitle = titleInput?.value.trim().length > 0;
      const hasSpace = this.selectedSpaceData !== null;

      if (createBtn) {
        createBtn.disabled = !hasTitle || !hasSpace;
      }
    };

    titleInput?.addEventListener("input", validateForm);

    // Initial validation
    validateForm();
  }

  handleFileUpload(files) {
    const mediaPreview = document.getElementById("mediaPreview");
    const uploadArea = document.getElementById("uploadArea");

    // Add loading state to upload area
    uploadArea.classList.add("ctm-uploading-4822");

    let loadingCount = 0;
    const totalFiles = Array.from(files).filter((file) => file.type.startsWith("image/") || file.type.startsWith("video/")).length;

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        // Create loading placeholder immediately
        const loadingId = Date.now() + Math.random() + index;
        const loadingItem = {
          id: loadingId,
          file: file,
          url: null,
          type: file.type.startsWith("image/") ? "image" : "video",
          isLoading: true,
          fileName: file.name,
          fileSize: this.formatFileSize(file.size),
        };

        this.uploadedMedia.push(loadingItem);
        this.renderMediaPreview();

        // Start file reading
        const reader = new FileReader();

        reader.onload = (e) => {
          // Find and update the loading item
          const itemIndex = this.uploadedMedia.findIndex((item) => item.id === loadingId);
          if (itemIndex !== -1) {
            this.uploadedMedia[itemIndex] = {
              ...this.uploadedMedia[itemIndex],
              url: e.target.result,
              isLoading: false,
            };
            this.renderMediaPreview();
          }

          // Check if all files are loaded
          loadingCount++;
          if (loadingCount === totalFiles) {
            uploadArea.classList.remove("ctm-uploading-4822");
          }
        };

        reader.onerror = () => {
          // Remove failed upload
          this.uploadedMedia = this.uploadedMedia.filter((item) => item.id !== loadingId);
          this.renderMediaPreview();
          this.showError(`Failed to upload ${file.name}`);

          // Check if all files are processed
          loadingCount++;
          if (loadingCount === totalFiles) {
            uploadArea.classList.remove("ctm-uploading-4822");
          }
        };

        // Simulate network delay for better UX (remove in production)
        setTimeout(() => {
          reader.readAsDataURL(file);
        }, 300 + index * 200); // Stagger uploads
      }
    });

    // Remove loading state if no valid files
    if (totalFiles === 0) {
      uploadArea.classList.remove("ctm-uploading-4822");
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  renderMediaPreview() {
    const mediaPreview = document.getElementById("mediaPreview");
    const uploadArea = document.getElementById("uploadArea");

    if (this.uploadedMedia.length > 0) {
      mediaPreview.classList.add("ctm-has-media-4822");
      uploadArea.style.display = "none";

      mediaPreview.innerHTML = this.uploadedMedia
        .map((media) => {
          if (media.isLoading) {
            // Loading state
            return `
              <div class="ctm-media-item-4822 ctm-media-loading-4822" data-id="${media.id}">
                <div class="ctm-media-loading-content-4822">
                  <div class="ctm-loading-spinner-4822">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  </div>
                  <div class="ctm-loading-info-4822">
                    <span class="ctm-loading-filename-4822">${media.fileName}</span>
                    <span class="ctm-loading-filesize-4822">${media.fileSize}</span>
                  </div>
                </div>
                <button class="ctm-media-remove-4822" onclick="createThreadModal.removeMedia('${media.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            `;
          } else {
            // Loaded state
            return `
              <div class="ctm-media-item-4822 ctm-media-loaded-4822" data-id="${media.id}">
                ${media.type === "image" ? `<img src="${media.url}" alt="Preview" loading="lazy" />` : `<video src="${media.url}" muted preload="metadata"></video>`}
                <div class="ctm-media-overlay-4822">
                  <span class="ctm-media-type-4822">${media.type.toUpperCase()}</span>
                </div>
                <button class="ctm-media-remove-4822" onclick="createThreadModal.removeMedia('${media.id}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            `;
          }
        })
        .join("");
    } else {
      mediaPreview.classList.remove("ctm-has-media-4822");
      uploadArea.style.display = "block";
    }
  }

  removeMedia(mediaId) {
    this.uploadedMedia = this.uploadedMedia.filter((media) => media.id !== mediaId);
    this.renderMediaPreview();
  }

  loadSpaces() {
    // Get spaces from the existing spaces manager
    if (window.spacesManager && window.spacesManager.spaces) {
      this.spaces = window.spacesManager.spaces;
      console.log(`Loaded ${this.spaces.length} spaces from spaces manager`);
    } else {
      // Fallback if spaces manager is not available
      this.spaces = [];
      console.warn("Spaces manager not available, using empty spaces array");
    }
  }

  open(spaceId = null) {
    // Refresh spaces from spaces manager
    this.loadSpaces();

    // If a specific space is provided, pre-select it
    if (spaceId) {
      const space = this.spaces.find((s) => s.id === spaceId);
      if (space) {
        console.log(`Pre-selecting space: ${space.name} (ID: ${spaceId})`);
        this.selectSpace(space);
      } else {
        console.warn(`Space with ID ${spaceId} not found`);
        // Reset to placeholder if space not found
        this.selectedSpaceData = null;
        this.updateSelectedSpaceUI();
      }
    } else {
      // Reset space selection if no specific space provided
      console.log("Opening thread modal without pre-selected space");
      this.selectedSpaceData = null;
      this.updateSelectedSpaceUI();
    }

    // Show the modal
    this.overlay?.classList.add("ctm-visible-4822");
    this.modal?.classList.add("ctm-animate-in-4822");

    // Focus on title input after animation, but only if space is selected
    setTimeout(() => {
      if (this.selectedSpaceData) {
        const titleInput = document.getElementById("threadTitle");
        titleInput?.focus();
      } else {
        // If no space selected, focus on space selector to encourage selection
        const spaceSelector = document.getElementById("selectedSpace");
        spaceSelector?.focus();
      }
    }, 300);
  }

  close() {
    this.modal?.classList.add("ctm-animate-out-4822");

    setTimeout(() => {
      this.overlay?.classList.remove("ctm-visible-4822");
      this.modal?.classList.remove("ctm-animate-in-4822", "ctm-animate-out-4822");
      this.resetForm();
    }, 300);
  }

  openSpaceSelection() {
    this.renderSpaceList();
    this.spaceSelectionOverlay?.classList.add("ctm-visible-4822");
  }

  closeSpaceSelection() {
    this.spaceSelectionOverlay?.classList.remove("ctm-visible-4822");
  }

  closeYourSpaceSelection() {
    this.yourSpaceSelectionOverlay?.classList.remove("ctm-visible-4822");
  }

  renderSpaceList(filteredSpaces = null) {
    const spaceList = document.getElementById("spaceList");
    const spacesToRender = filteredSpaces || this.spaces;

    if (!spaceList) return;

    spaceList.innerHTML = spacesToRender.map((space) => this.createSpaceOptionCard(space)).join("");

    // Add event listeners to space cards
    this.bindSpaceCardEvents();
  }

  renderYourSpaceList() {
    const yourSpaceList = document.getElementById("yourSpaceList");
    const spacesToRender = this.spaces;

    if (!yourSpaceList) return;

    yourSpaceList.innerHTML = spacesToRender.map((space) => this.createSpaceOptionCard(space)).join("");

    // Add event listeners to space cards
    this.bindSpaceCardEvents();
  }

  bindSpaceCardEvents() {
    const spaceCards = document.querySelectorAll(".ctm-space-card-4822");
    spaceCards.forEach((card) => {
      const spaceId = card.dataset.spaceId;
      const space = this.spaces.find((s) => s.id === spaceId);

      if (space) {
        card.addEventListener("click", () => {
          this.selectSpace(space);
        });
      }
    });
  }

  // Create space option card using the same design as spaces manager
  createSpaceOptionCard(space) {
    const visibilityIcon = space.visibility === "private" ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M12 21C4.75561 13.08 8.98151 5.7 12 3M12 21C19.2444 13.08 15.0185 5.7 12 3" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    return `
      <div class="ctm-space-card-4822" data-space-id="${space.id}">
        <div class="ctm-space-card-header-4822">
          <div class="ctm-space-info-4822">
            <span class="ctm-space-color-dot-4822" style="background-color: ${space.color}"></span>
            <h4 class="ctm-space-name-4822">${space.name} ${space.emoji}</h4>
          </div>
        </div>
        
        <div class="ctm-space-card-body-4822">
          <span class="ctm-thread-count-4822" style="color: #01c74a">${space.threadCount} threads</span>
        </div>
        
        <div class="ctm-space-card-footer-4822">
          <div class="ctm-space-activity-4822">
            <span class="ctm-activity-icon-4822" style="color: ${space.color}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9996 3L5.06859 12.6934C4.72703 13.1109 4.55625 13.3196 4.55471 13.4956C4.55336 13.6486 4.62218 13.7939 4.74148 13.8897C4.87867 14 5.14837 14 5.68776 14H11.9996L10.9996 21L18.9305 11.3066C19.2721 10.8891 19.4429 10.6804 19.4444 10.5044C19.4458 10.3514 19.377 10.2061 19.2577 10.1103C19.1205 10 18.8508 10 18.3114 10H11.9996L12.9996 3Z" stroke="${space.color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="ctm-activity-time-4822">${this.formatTimeAgo(space.lastActivity)}</span>
          </div>
          <span class="ctm-visibility-icon-4822">${visibilityIcon}</span>
        </div>
      </div>
    `;
  }

  // Format time ago helper (same as spaces manager)
  formatTimeAgo(timestamp) {
    if (!timestamp) return "Just now";

    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  }

  filterSpaces(query) {
    if (!query.trim()) {
      this.renderSpaceList();
      return;
    }

    const filtered = this.spaces.filter((space) => {
      const nameMatch = space.name.toLowerCase().includes(query.toLowerCase());
      const descriptionMatch = space.description && space.description.toLowerCase().includes(query.toLowerCase());
      const emojiMatch = space.emoji && space.emoji.includes(query);

      return nameMatch || descriptionMatch || emojiMatch;
    });

    this.renderSpaceList(filtered);

    // Show no results message if needed
    const spaceList = document.getElementById("spaceList");
    if (filtered.length === 0 && spaceList) {
      spaceList.innerHTML = `
        <div class="ctm-no-spaces-4822">
          <p>No spaces found matching "${query}"</p>
          <button class="ctm-clear-search-4822" onclick="document.getElementById('spaceSearchInput').value = ''; createThreadModal.filterSpaces('');">Clear search</button>
        </div>
      `;
    }
  }

  selectSpace(space) {
    this.selectedSpaceData = space;
    console.log(`Selected space: ${space.name} (${space.id})`);
    this.updateSelectedSpaceUI();
    this.closeSpaceSelection();

    // Trigger form validation
    const event = new Event("input");
    document.getElementById("threadTitle")?.dispatchEvent(event);

    // Show success feedback
    this.showSpaceSelectionFeedback(space);

    // Show info message for auto-selection
    this.showInfo(`Space "${space.name}" selected for thread creation`);
  }

  removeSelectedSpace() {
    console.log("Removing selected space");

    // Clear the selected space data
    this.selectedSpaceData = null;

    // Update the UI to show placeholder state
    this.updateSelectedSpaceUI();

    // Trigger form validation to disable create button
    const event = new Event("input");
    document.getElementById("threadTitle")?.dispatchEvent(event);

    // Show feedback
    this.showInfo("Space selection cleared. Please select a space to continue.");

    // Focus on the space selector to encourage selection
    setTimeout(() => {
      const spaceSelector = document.getElementById("selectedSpace");
      spaceSelector?.focus();
    }, 100);
  }

  showSpaceSelectionFeedback(space) {
    // Add a subtle animation or feedback to show space was selected
    const selectedSpaceElement = document.getElementById("selectedSpace");
    if (selectedSpaceElement) {
      selectedSpaceElement.style.transform = "scale(1.02)";
      selectedSpaceElement.style.transition = "transform 0.2s ease";

      setTimeout(() => {
        selectedSpaceElement.style.transform = "scale(1)";
      }, 200);
    }
  }

  updateSelectedSpaceUI() {
    const selectedSpace = document.getElementById("selectedSpace");
    if (!selectedSpace) return;

    if (!this.selectedSpaceData) {
      // Show placeholder when no space is selected
      selectedSpace.innerHTML = `<button class="ctm-change-space-btn-4822" id="changeSpaceBtn">Select</button>`;
    } else {
      // Show selected space info
      selectedSpace.innerHTML = `
        <div class="ctm-selected-space-wrapper-4822">
          <button class="ctm-change-space-cancel-4822 remove-selected-space">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </button>
          <div class="ctm-selected-space-info-4822">
            <div class="ctm-space-details-4822">
              <span class="ctm-space-color-dot-4822" style="background-color: ${this.selectedSpaceData.color}"></span>
              <h4>${this.selectedSpaceData.name} ${this.selectedSpaceData.emoji || ""}</h4>
            </div>
            <div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 21C22.5 21 24 21 24 19.5C24 18 22.5 13.5 16.5 13.5C10.5 13.5 9 18 9 19.5C9 21 10.5 21 10.5 21H22.5ZM10.533 19.5C10.5219 19.4985 10.5109 19.4965 10.5 19.494C10.5015 19.098 10.7505 17.949 11.64 16.914C12.468 15.9435 13.923 15 16.5 15C19.0755 15 20.5305 15.945 21.36 16.914C22.2495 17.949 22.497 19.0995 22.5 19.494L22.488 19.497C22.481 19.4982 22.474 19.4992 22.467 19.5H10.533ZM16.5 10.5C17.2956 10.5 18.0587 10.1839 18.6213 9.62132C19.1839 9.05871 19.5 8.29565 19.5 7.5C19.5 6.70435 19.1839 5.94129 18.6213 5.37868C18.0587 4.81607 17.2956 4.5 16.5 4.5C15.7044 4.5 14.9413 4.81607 14.3787 5.37868C13.8161 5.94129 13.5 6.70435 13.5 7.5C13.5 8.29565 13.8161 9.05871 14.3787 9.62132C14.9413 10.1839 15.7044 10.5 16.5 10.5ZM21 7.5C21 8.09095 20.8836 8.67611 20.6575 9.22208C20.4313 9.76804 20.0998 10.2641 19.682 10.682C19.2641 11.0998 18.768 11.4313 18.2221 11.6575C17.6761 11.8836 17.0909 12 16.5 12C15.9091 12 15.3239 11.8836 14.7779 11.6575C14.232 11.4313 13.7359 11.0998 13.318 10.682C12.9002 10.2641 12.5687 9.76804 12.3425 9.22208C12.1164 8.67611 12 8.09095 12 7.5C12 6.30653 12.4741 5.16193 13.318 4.31802C14.1619 3.47411 15.3065 3 16.5 3C17.6935 3 18.8381 3.47411 19.682 4.31802C20.5259 5.16193 21 6.30653 21 7.5ZM10.404 13.92C9.80397 13.7311 9.18545 13.6069 8.559 13.5495C8.207 13.516 7.85359 13.4995 7.5 13.5C1.5 13.5 0 18 0 19.5C0 20.5005 0.4995 21 1.5 21H7.824C7.60163 20.5317 7.49074 20.0183 7.5 19.5C7.5 17.985 8.0655 16.437 9.135 15.144C9.4995 14.703 9.924 14.2905 10.404 13.92ZM7.38 15C6.49223 16.3339 6.01266 17.8977 6 19.5H1.5C1.5 19.11 1.746 17.955 2.64 16.914C3.4575 15.96 4.878 15.03 7.38 15.0015V15ZM2.25 8.25C2.25 7.05653 2.72411 5.91193 3.56802 5.06802C4.41193 4.22411 5.55653 3.75 6.75 3.75C7.94347 3.75 9.08807 4.22411 9.93198 5.06802C10.7759 5.91193 11.25 7.05653 11.25 8.25C11.25 9.44347 10.7759 10.5881 9.93198 11.432C9.08807 12.2759 7.94347 12.75 6.75 12.75C5.55653 12.75 4.41193 12.2759 3.56802 11.432C2.72411 10.5881 2.25 9.44347 2.25 8.25ZM6.75 5.25C5.95435 5.25 5.19129 5.56607 4.62868 6.12868C4.06607 6.69129 3.75 7.45435 3.75 8.25C3.75 9.04565 4.06607 9.80871 4.62868 10.3713C5.19129 10.9339 5.95435 11.25 6.75 11.25C7.54565 11.25 8.30871 10.9339 8.87132 10.3713C9.43393 9.80871 9.75 9.04565 9.75 8.25C9.75 7.45435 9.43393 6.69129 8.87132 6.12868C8.30871 5.56607 7.54565 5.25 6.75 5.25Z" fill="#7D8FAA"></path></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L8.54545 8.54545M8.54545 8.54545L4 14H11.0455L10 22L15.4546 15.4546M8.54545 8.54545L15.4546 15.4546M20 20L15.4546 15.4546M10.5909 6.09091L14 2L13.1332 8.63317M14.5 10H20L17.5 13" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          </div>
        </div>
        <button class="ctm-change-space-btn-4822" id="changeSpaceBtn">Change</button>
      `;

      // Remove placeholder styling when space is selected
      selectedSpace.style.border = "";
      selectedSpace.style.opacity = "";
    }

    // Re-bind the change button event
    const changeBtn = selectedSpace.querySelector("#changeSpaceBtn");
    changeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.openSpaceSelection();
    });

    // Re-bind the remove selected space button event
    const removeBtn = selectedSpace.querySelector(".remove-selected-space");
    removeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.removeSelectedSpace();
    });

    // Re-bind the main selector click event
    selectedSpace.addEventListener("click", () => {
      if (!this.selectedSpaceData) {
        this.openSpaceSelection();
      }
    });
  }

  async createThread() {
    const titleInput = document.getElementById("threadTitle");
    const descriptionInput = document.getElementById("threadDescription");
    const privacyInput = document.getElementById("threadPrivacy");

    if (!this.selectedSpaceData) {
      this.showError("Please select a space for your thread.");
      return;
    }

    if (!titleInput?.value.trim()) {
      this.showError("Please enter a thread title.");
      return;
    }

    const threadData = {
      id: "thread-" + Date.now(),
      title: titleInput.value.trim(),
      description: descriptionInput?.value.trim() || "",
      spaceId: this.selectedSpaceData.id,
      spaceName: this.selectedSpaceData.name,
      isPrivate: privacyInput?.checked || false,
      media: this.uploadedMedia,
      createdAt: new Date().toISOString(),
      author: {
        id: "user-1",
        name: "Current User",
        avatar: "./icons/Avatar.svg",
      },
    };

    try {
      // Show loading state
      const createBtn = document.getElementById("createThreadBtn");
      const originalText = createBtn?.textContent;
      if (createBtn) {
        createBtn.disabled = true;
        createBtn.textContent = "Creating...";
      }

      // Simulate API call
      await this.simulateThreadCreation(threadData);

      // Add thread to the space
      this.attachThreadToSpace(threadData);

      // Show success message
      this.showSuccess("Thread created successfully!");

      // Close modal
      this.close();

      // Navigate to the newly created thread
      this.navigateToThread(threadData.id);
    } catch (error) {
      console.error("Error creating thread:", error);
      this.showError("Failed to create thread. Please try again.");
    } finally {
      // Reset button state
      const createBtn = document.getElementById("createThreadBtn");
      if (createBtn) {
        createBtn.disabled = false;
        createBtn.textContent = originalText;
      }
    }
  }

  async simulateThreadCreation(threadData) {
    // Simulate API delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  attachThreadToSpace(threadData) {
    // Add thread to threads manager and store in localStorage
    if (window.threadsManager) {
      const threadForStorage = {
        id: threadData.id,
        name: threadData.title,
        spaceId: threadData.spaceId,
        spaceName: threadData.spaceName,
        spaceEmoji: this.getSpaceEmoji(threadData.spaceId),
        views: "0",
        unreadCount: 0,
        hasUnread: false,
        createdAt: threadData.createdAt,
        author: threadData.author,
        isPrivate: threadData.isPrivate,
        media: threadData.media,
        description: threadData.description,
      };

      window.threadsManager.addThread(threadForStorage);
      console.log("Thread added to threads manager and stored in localStorage:", threadForStorage);
    }

    // Dispatch custom event for other components to listen to
    const event = new CustomEvent("threadCreated", { detail: threadData });
    document.dispatchEvent(event);
    console.log("Thread attached to space:", threadData);
  }

  getSpaceEmoji(spaceId) {
    if (window.spacesManager) {
      const space = window.spacesManager.getSpace(spaceId);
      return space?.emoji || "💬";
    }
    return "💬";
  }

  navigateToThread(threadId) {
    // Wait a moment for the thread to be added to the threads manager
    setTimeout(() => {
      if (window.threadsManager) {
        window.threadsManager.handleThreadClick(threadId);
        this.showInfo("Opening your new thread...");
      }
    }, 500);
  }

  showSuccess(message) {
    // Use flashMessage if available, otherwise console log
    if (typeof flashMessage === "function") {
      flashMessage(message, "success");
    } else {
      console.log("Success:", message);
    }
  }

  showError(message) {
    // Use flashMessage if available, otherwise console error
    if (typeof flashMessage === "function") {
      flashMessage(message, "error");
    } else {
      console.error("Error:", message);
    }
  }

  showInfo(message) {
    // Use flashMessage if available, otherwise console log
    if (typeof flashMessage === "function") {
      flashMessage(message, "info");
    } else {
      console.log("Info:", message);
    }
  }

  resetForm() {
    // Reset all form fields
    const titleInput = document.getElementById("threadTitle");
    const descriptionInput = document.getElementById("threadDescription");
    const privacyInput = document.getElementById("threadPrivacy");
    const spaceSearchInput = document.getElementById("spaceSearchInput");

    if (titleInput) titleInput.value = "";
    if (descriptionInput) descriptionInput.value = "";
    if (privacyInput) privacyInput.checked = true;
    if (spaceSearchInput) spaceSearchInput.value = "";

    // Reset selected space
    this.selectedSpaceData = null;
    const selectedSpace = document.getElementById("selectedSpace");
    if (selectedSpace) {
      selectedSpace.innerHTML = `
        <div class="ctm-space-placeholder-4822">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>Select</span>
        </div>
        <button class="ctm-change-space-btn-4822" id="changeSpaceBtn">Change</button>
      `;
    }

    // Reset media
    this.uploadedMedia = [];
    this.renderMediaPreview();

    // Reset form validation
    const createBtn = document.getElementById("createThreadBtn");
    if (createBtn) createBtn.disabled = true;
  }
}

// Initialize the modal when DOM is loaded
function initializeCreateThreadModal() {
  try {
    window.createThreadModal = new CreateThreadModal();
    console.log("Create Thread Modal initialized successfully");
  } catch (error) {
    console.error("Error initializing Create Thread Modal:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCreateThreadModal);
} else {
  initializeCreateThreadModal();
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = CreateThreadModal;
}
