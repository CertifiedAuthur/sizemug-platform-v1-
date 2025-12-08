/**
 * Folder Manager - Handles folder creation, management, and localStorage integration
 */
class FolderManager {
  constructor() {
    this.folders = this.loadFolders();
    this.selectedCategory = "sport";
    this.selectedInterests = [];
    this.confettiInstance = null;
    this.availableInterests = ["Exams", "Examination", "Study", "Research", "Learning", "Teaching", "School", "University", "Football", "Basketball", "Tennis", "Swimming", "Running", "Cycling", "Fitness", "Yoga", "Movies", "Music", "Games", "Books", "Art", "Photography", "Dancing", "Theater", "Cooking", "Recipes", "Restaurants", "Nutrition", "Baking", "Healthy Eating", "Entrepreneurship", "Marketing", "Finance", "Leadership", "Networking", "Innovation", "Fashion Design", "Style", "Trends", "Shopping", "Beauty", "Accessories", "Programming", "AI", "Web Development", "Mobile Apps", "Gadgets", "Innovation", "Meditation", "Wellness", "Mental Health", "Exercise", "Diet", "Healthcare", "Biology", "Chemistry", "Physics", "Research", "Innovation", "Discovery", "Adventure", "Culture", "Languages", "Backpacking", "Photography", "Food", "Concerts", "Instruments", "Singing", "Composition", "Bands", "Festivals", "Video Games", "Board Games", "Esports", "Streaming", "Reviews", "Community"];

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderFolders();
    this.setupInterestsSearch();
  }

  bindEvents() {
    // Modal triggers
    const createFolderBtn = document.getElementById("createFolderBtn");
    const cancelFolderBtn = document.getElementById("cancelFolderBtn");
    const createFolderSubmitBtn = document.getElementById("createFolderSubmitBtn");
    const startNewChatBtn = document.getElementById("startNewChatBtn");

    // Modal overlays
    const folderModalOverlay = document.getElementById("folderModalOverlay");
    const folderSuccessOverlay = document.getElementById("folderSuccessOverlay");

    if (createFolderBtn) {
      createFolderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.openModal();
      });
    }

    if (cancelFolderBtn) {
      cancelFolderBtn.addEventListener("click", () => this.closeModal());
    }

    if (createFolderSubmitBtn) {
      createFolderSubmitBtn.addEventListener("click", () => this.createFolder());
    }

    if (startNewChatBtn) {
      startNewChatBtn.addEventListener("click", () => this.closeSuccessModal());
    }

    // Close modal when clicking overlay
    if (folderModalOverlay) {
      folderModalOverlay.addEventListener("click", (e) => {
        if (e.target === folderModalOverlay) {
          this.closeModal();
        }
      });
    }

    if (folderSuccessOverlay) {
      folderSuccessOverlay.addEventListener("click", (e) => {
        if (e.target === folderSuccessOverlay) {
          this.closeSuccessModal();
        }
      });
    }

    // Category selection
    const categoryGrid = document.getElementById("categoryGrid");
    if (categoryGrid) {
      categoryGrid.addEventListener("click", (e) => {
        const categoryBtn = e.target.closest(".category-btn");
        if (categoryBtn) {
          this.selectCategory(categoryBtn);
        }
      });
    }

    // ESC key to close modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeModal();
        this.closeSuccessModal();
      }
    });

    // Folder name input validation
    const folderNameInput = document.getElementById("folderNameInput");
    if (folderNameInput) {
      folderNameInput.addEventListener("input", () => this.validateForm());
    }
  }

  setupInterestsSearch() {
    const interestsSearch = document.getElementById("interestsSearch");
    const interestsSuggestions = document.getElementById("interestsSuggestions");

    if (!interestsSearch || !interestsSuggestions) return;

    // Initially hide suggestions
    interestsSuggestions.style.display = "none";

    interestsSearch.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.showInterestSuggestions(query);
    });

    interestsSearch.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const query = e.target.value.trim();
        if (query && !this.selectedInterests.includes(query)) {
          this.addInterest(query);
          e.target.value = "";
          this.showInterestSuggestions("");
        }
      }
    });
  }

  showInterestSuggestions(query) {
    const interestsSuggestions = document.getElementById("interestsSuggestions");
    if (!interestsSuggestions) return;

    // Only show suggestions if there's a query
    if (!query) {
      interestsSuggestions.style.display = "none";
      interestsSuggestions.innerHTML = "";
      return;
    }

    const suggestions = this.availableInterests.filter((interest) => interest.toLowerCase().includes(query) && !this.selectedInterests.includes(interest));

    if (suggestions.length === 0) {
      interestsSuggestions.style.display = "none";
      interestsSuggestions.innerHTML = "";
      return;
    }

    // Show suggestions with the "Suggestions:" label format
    interestsSuggestions.style.display = "block";
    interestsSuggestions.innerHTML = `
      <div class="suggestions-container">
        <span class="suggestions-label">Suggestions:</span>
        <div class="suggestions-list">
          ${suggestions
            .slice(0, 6) // Limit to 6 suggestions
            .map(
              (interest) => `
            <button class="suggestion-tag" data-interest="${interest}">
              ${interest}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33333V12.6667M3.33333 8H12.6667" stroke="#8837e9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    // Bind click events to suggestions
    interestsSuggestions.querySelectorAll(".suggestion-tag").forEach((suggestion) => {
      suggestion.addEventListener("click", (e) => {
        e.preventDefault();
        const interest = suggestion.dataset.interest;
        this.addInterest(interest);

        // Clear the search input and hide suggestions
        const interestsSearch = document.getElementById("interestsSearch");
        if (interestsSearch) {
          interestsSearch.value = "";
        }
        this.showInterestSuggestions("");
      });
    });
  }

  addInterest(interest) {
    if (!this.selectedInterests.includes(interest)) {
      this.selectedInterests.push(interest);
      this.renderSelectedInterests();
      this.validateForm();
    }
  }

  removeInterest(interest) {
    this.selectedInterests = this.selectedInterests.filter((i) => i !== interest);
    this.renderSelectedInterests();
    this.showInterestSuggestions("");
    this.validateForm();
  }

  renderSelectedInterests() {
    const selectedInterests = document.getElementById("selectedInterests");
    if (!selectedInterests) return;

    selectedInterests.innerHTML = this.selectedInterests
      .map(
        (interest) => `
        <span class="selected-interest">
          ${interest}
          <button class="remove-interest" data-interest="${interest}">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>
      `
      )
      .join("");

    // Bind remove events
    selectedInterests.querySelectorAll(".remove-interest").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const interest = btn.dataset.interest;
        this.removeInterest(interest);
      });
    });
  }

  selectCategory(categoryBtn) {
    // Remove active class from all buttons
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to selected button
    categoryBtn.classList.add("active");
    this.selectedCategory = categoryBtn.dataset.category;
  }

  validateForm() {
    const folderNameInput = document.getElementById("folderNameInput");
    const createFolderSubmitBtn = document.getElementById("createFolderSubmitBtn");

    if (!folderNameInput || !createFolderSubmitBtn) return;

    const isValid = folderNameInput.value.trim().length > 0;
    createFolderSubmitBtn.disabled = !isValid;
  }

  openModal() {
    const folderModalOverlay = document.getElementById("folderModalOverlay");
    if (folderModalOverlay) {
      folderModalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus on folder name input
      setTimeout(() => {
        const folderNameInput = document.getElementById("folderNameInput");
        if (folderNameInput) {
          folderNameInput.focus();
        }
      }, 300);
    }
  }

  closeModal() {
    const folderModalOverlay = document.getElementById("folderModalOverlay");
    if (folderModalOverlay) {
      folderModalOverlay.classList.remove("active");
      document.body.style.overflow = "";
      this.resetForm();
    }
  }

  closeSuccessModal() {
    const folderSuccessOverlay = document.getElementById("folderSuccessOverlay");
    if (folderSuccessOverlay) {
      folderSuccessOverlay.classList.remove("active");
      document.body.style.overflow = "";

      // Stop confetti animation
      this.stopSuccessConfetti();
    }
  }

  resetForm() {
    // Reset form fields
    const folderNameInput = document.getElementById("folderNameInput");
    const interestsSearch = document.getElementById("interestsSearch");
    const interestsSuggestions = document.getElementById("interestsSuggestions");

    if (folderNameInput) folderNameInput.value = "";
    if (interestsSearch) interestsSearch.value = "";

    // Hide suggestions
    if (interestsSuggestions) {
      interestsSuggestions.style.display = "none";
      interestsSuggestions.innerHTML = "";
    }

    // Reset selected interests
    this.selectedInterests = [];
    this.renderSelectedInterests();

    // Reset category to first one
    this.selectedCategory = "sport";
    document.querySelectorAll(".category-btn").forEach((btn, index) => {
      btn.classList.toggle("active", index === 0);
    });

    this.validateForm();
  }

  createFolder() {
    const folderNameInput = document.getElementById("folderNameInput");
    if (!folderNameInput || !folderNameInput.value.trim()) return;

    const folder = {
      id: Date.now().toString(),
      name: folderNameInput.value.trim(),
      category: this.selectedCategory,
      interests: [...this.selectedInterests],
      createdAt: new Date().toISOString(),
      items: [],
    };

    this.folders.push(folder);
    this.saveFolders();
    this.renderFolders();

    // Close create modal and show success modal
    this.closeModal();
    setTimeout(() => {
      const folderSuccessOverlay = document.getElementById("folderSuccessOverlay");
      if (folderSuccessOverlay) {
        folderSuccessOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Start confetti animation
        this.startSuccessConfetti();
      }
    }, 200);
  }

  renderFolders() {
    const folderListContainer = document.getElementById("folderListContainer");
    if (!folderListContainer) return;

    if (this.folders.length === 0) {
      folderListContainer.innerHTML = "";
      return;
    }

    folderListContainer.innerHTML = this.folders.map((folder) => this.renderFolderItem(folder)).join("");

    // Bind folder click events
    folderListContainer.querySelectorAll(".folder-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const folderId = item.dataset.folderId;
        this.toggleFolder(folderId);
      });
    });
  }

  renderFolderItem(folder) {
    const categoryIcons = {
      sport: "⚽",
      education: "📚",
      entertainment: "🎬",
      food: "🍕",
      business: "💼",
      fashion: "👗",
      technology: "💻",
      health: "🏥",
      science: "🔬",
      travel: "✈️",
      music: "🎵",
      gaming: "🎮",
    };

    const icon = categoryIcons[folder.category] || "📁";
    const itemCount = folder.items ? folder.items.length : 0;

    return `
      <div class="folder-item" data-folder-id="${folder.id}">
        <div class="folder-info">
          <div class="folder-name">${folder.name}</div>
        </div>
        <div class="folder-expand">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 12L10 8L6 4" stroke="#667085" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
      </div>
      <div class="folder-contents" id="folder-contents-${folder.id}">
        ${this.renderFolderContents(folder)}
      </div>
    `;
  }

  renderFolderContents(folder) {
    if (!folder.items || folder.items.length === 0) {
      return `
        <div class="folder-content-item" style="color: #98a2b3; font-style: italic;">
          No items yet. Start a new chat to add content.
        </div>
      `;
    }

    return folder.items
      .map(
        (item) => `
        <div class="folder-content-item">
          ${item.type === "chat" ? "💬" : "📝"} ${item.title}
        </div>
      `
      )
      .join("");
  }

  toggleFolder(folderId) {
    const folderItem = document.querySelector(`[data-folder-id="${folderId}"]`);
    const folderContents = document.getElementById(`folder-contents-${folderId}`);

    if (folderItem && folderContents) {
      const isExpanded = folderItem.classList.contains("expanded");

      // Close all other folders
      document.querySelectorAll(".folder-item").forEach((item) => {
        item.classList.remove("expanded");
      });
      document.querySelectorAll(".folder-contents").forEach((content) => {
        content.style.display = "none";
      });

      // Toggle current folder
      if (!isExpanded) {
        folderItem.classList.add("expanded");
        folderContents.style.display = "block";
      }
    }
  }

  loadFolders() {
    try {
      const stored = localStorage.getItem("sizemug_folders");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading folders:", error);
      return [];
    }
  }

  saveFolders() {
    try {
      localStorage.setItem("sizemug_folders", JSON.stringify(this.folders));
    } catch (error) {
      console.error("Error saving folders:", error);
    }
  }

  // Public API methods
  addItemToFolder(folderId, item) {
    const folder = this.folders.find((f) => f.id === folderId);
    if (folder) {
      if (!folder.items) folder.items = [];
      folder.items.push({
        id: Date.now().toString(),
        ...item,
        addedAt: new Date().toISOString(),
      });
      this.saveFolders();
      this.renderFolders();
    }
  }

  getFolders() {
    return this.folders;
  }

  getFolder(folderId) {
    return this.folders.find((f) => f.id === folderId);
  }

  deleteFolder(folderId) {
    this.folders = this.folders.filter((f) => f.id !== folderId);
    this.saveFolders();
    this.renderFolders();
  }

  // Confetti animation methods
  startSuccessConfetti() {
    const canvas = document.getElementById("folderSuccessConfetti");
    if (!canvas) return;

    // Set canvas size to match the modal
    const modal = canvas.closest(".folder-success-modal");
    if (modal) {
      const rect = modal.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Initialize confetti with celebration colors
    const celebrationColors = [
      "#8837e9", // Primary purple
      "#7c3aed", // Darker purple
      "#a855f7", // Light purple
      "#f59e0b", // Gold
      "#10b981", // Green
      "#3b82f6", // Blue
      "#ef4444", // Red
      "#f97316", // Orange
    ];

    // Create confetti instance
    if (this.confettiInstance) {
      this.confettiInstance.stop();
    }

    this.confettiInstance = new window.RectangleConfetti(canvas, {
      count: 80,
      colors: celebrationColors,
    });

    // Start the animation
    this.confettiInstance.start();

    // Stop confetti after 4 seconds
    setTimeout(() => {
      if (this.confettiInstance) {
        this.confettiInstance.stop();
      }
    }, 4000);
  }

  stopSuccessConfetti() {
    if (this.confettiInstance) {
      this.confettiInstance.stop();
      this.confettiInstance = null;
    }
  }
}

// Initialize folder manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.folderManager = new FolderManager();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = FolderManager;
}
