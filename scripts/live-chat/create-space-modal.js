class CreateSpaceModal {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 3;
    this.spaceData = {
      name: "",
      description: "",
      banner: null,
      theme: "#8B5CF6",
      tags: [],
      accessType: "public",
    };
    this.isVisible = false;
    this.isAnimating = false;
    this.modal = null;
    this.overlay = null;
    this.steps = [];

    this.init();
  }

  init() {
    this.getModalElements();
    this.bindEvents();
    this.bindStepEvents();
    this.showCurrentStep();
  }

  getModalElements() {
    // Use existing HTML structure
    this.overlay = document.getElementById("createSpaceOverlay");
    this.modal = document.getElementById("createSpaceModal");
    this.steps = [document.getElementById("csmStep1"), document.getElementById("csmStep2"), document.getElementById("csmStep3")];

    if (!this.overlay || !this.modal || this.steps.some((step) => !step)) {
      console.error("Create Space Modal: Required HTML elements not found");
      return;
    }

    // Ensure modal starts in the correct state
    this.overlay.classList.remove("csm-visible-4821");
    this.modal.classList.remove("csm-animate-in-4821", "csm-animate-out-4821");

    // Show first step
    this.steps[0].classList.remove("live-chat-hidden");
  }

  bindEvents() {
    // Close modal on overlay click
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.close();
      }
    });
  }

  show() {
    if (this.isVisible || this.isAnimating) return;

    this.isVisible = true;
    this.isAnimating = true;
    this.overlay.classList.add("csm-visible-4821");
    document.body.style.overflow = "hidden";

    // Clean up any existing animation classes
    this.modal.classList.remove("csm-animate-in-4821", "csm-animate-out-4821");

    // Animate modal entrance
    setTimeout(() => {
      this.modal.classList.add("csm-animate-in-4821");
      this.isAnimating = false;
    }, 10);
  }

  close() {
    if (!this.isVisible || this.isAnimating) return;

    this.isAnimating = true;

    // Clean up animation classes and start exit animation
    this.modal.classList.remove("csm-animate-in-4821");
    this.modal.classList.add("csm-animate-out-4821");

    setTimeout(() => {
      this.overlay.classList.remove("csm-visible-4821");
      document.body.style.overflow = "";
      this.isVisible = false;
      this.isAnimating = false;

      // Clean up animation classes after closing
      this.modal.classList.remove("csm-animate-out-4821");

      this.reset();
    }, 300);
  }

  reset() {
    this.currentStep = 1;
    this.spaceData = {
      name: "",
      description: "",
      banner: null,
      theme: "#8B5CF6",
      tags: [],
      accessType: "public",
    };

    // Reset animation state
    this.isAnimating = false;

    // Clean up all animation classes
    this.cleanupAnimations();

    // Reset form values
    const nameInput = document.getElementById("spaceName");
    const descInput = document.getElementById("spaceDescription");
    const bannerPreview = document.getElementById("bannerPreview");

    if (nameInput) nameInput.value = "";
    if (descInput) descInput.value = "";
    if (bannerPreview) {
      bannerPreview.innerHTML = `
        <div class="csm-upload-placeholder-4821">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
      `;
    }

    // Reset theme selection
    this.modal.querySelectorAll(".csm-theme-color-4821").forEach((btn) => {
      btn.classList.toggle("csm-selected-4821", btn.dataset.color === "#8B5CF6");
    });

    // Reset tag selection
    this.modal.querySelectorAll(".chip-button").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Reset access type
    this.modal.querySelectorAll(".csm-access-option-4821").forEach((option) => {
      option.classList.toggle("csm-selected-4821", option.dataset.access === "public");
    });
    this.modal.querySelectorAll(".csm-radio-dot-4821").forEach((dot) => {
      dot.classList.toggle("csm-active-4821", dot.closest(".csm-access-option-4821").dataset.access === "public");
    });

    // Reset footer visibility (in case it was hidden during success state)
    this.modal.querySelectorAll(".csm-footer-4821").forEach((footer) => {
      footer.classList.remove("live-chat-hidden");
    });

    this.showCurrentStep();
  }

  cleanupAnimations() {
    // Remove all animation classes from modal
    this.modal.classList.remove("csm-animate-in-4821", "csm-animate-out-4821");

    // Remove all animation classes from steps
    this.steps.forEach((step) => {
      step.classList.remove("csm-slide-in-4821", "csm-slide-out-4821");
    });
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.animateStepTransition(() => {
        this.currentStep++;
        this.showCurrentStep();
      });
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.animateStepTransition(() => {
        this.currentStep--;
        this.showCurrentStep();
      });
    }
  }

  showCurrentStep() {
    // Hide all steps using live-chat-hidden class
    this.steps.forEach((step, index) => {
      if (index === this.currentStep - 1) {
        step.classList.remove("live-chat-hidden");
      } else {
        step.classList.add("live-chat-hidden");
      }
    });

    // Update progress bars
    const progressFills = this.modal.querySelectorAll(".csm-progress-fill-4821");
    const progressWidth = (this.currentStep / this.totalSteps) * 100;
    progressFills.forEach((fill) => {
      fill.style.width = `${progressWidth}%`;
    });
  }

  animateStepTransition(callback) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const currentStepEl = this.steps[this.currentStep - 1];

    // Start exit animation
    currentStepEl.classList.add("csm-slide-out-4821");

    setTimeout(() => {
      // Execute the callback (change step)
      callback();

      // Get new current step and animate in
      const newStepEl = this.steps[this.currentStep - 1];
      newStepEl.classList.add("csm-slide-in-4821");

      setTimeout(() => {
        // Clean up animations
        currentStepEl.classList.remove("csm-slide-out-4821");
        newStepEl.classList.remove("csm-slide-in-4821");
        this.isAnimating = false;
      }, 300);
    }, 150);
  }

  bindStepEvents() {
    // Handle all click events with delegation
    this.modal.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;

      switch (action) {
        case "close":
          this.close();
          break;
        case "next":
          this.handleNext();
          break;
        case "create":
          this.handleCreate();
          break;
        case "upload-banner":
          document.getElementById("bannerInput").click();
          break;
        case "select-theme":
          this.selectTheme(e.target.dataset.color);
          break;
        case "toggle-tag":
          this.toggleTag(e.target.closest(".chip-button"));
          break;
        case "select-access":
          this.selectAccess(e.target.closest(".csm-access-option-4821").dataset.access);
          break;
      }
    });

    // Handle input changes
    const nameInput = document.getElementById("spaceName");
    const descInput = document.getElementById("spaceDescription");
    const bannerInput = document.getElementById("bannerInput");

    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        this.spaceData.name = e.target.value;
      });
    }

    if (descInput) {
      descInput.addEventListener("input", (e) => {
        this.spaceData.description = e.target.value;
      });
    }

    if (bannerInput) {
      bannerInput.addEventListener("change", (e) => {
        this.handleBannerUpload(e);
      });
    }
  }

  handleNext() {
    if (this.currentStep === 1) {
      if (!this.spaceData.name.trim()) {
        this.showError("Please enter a space name");
        return;
      }
    }
    this.nextStep();
  }

  handleCreate() {
    this.showLoading();

    // Create the space using the spaces manager
    setTimeout(() => {
      try {
        // Get the spaces manager instance
        const spacesManager = window.spacesManager;

        if (spacesManager) {
          // Create the space data in the format expected by spaces manager
          const spaceData = {
            name: this.spaceData.name,
            emoji: "💬", // Default emoji, could be made configurable
            color: this.spaceData.theme,
            threadCount: 0,
            isActive: true,
            isPrivate: this.spaceData.accessType === "private",
            visibility: this.spaceData.accessType,
            description: this.spaceData.description,
            tags: this.spaceData.tags,
            banner: this.spaceData.banner,
          };

          // Add the space
          const newSpace = spacesManager.addSpace(spaceData);
          console.log("Space created successfully:", newSpace);

          this.showSuccess();
          setTimeout(() => {
            this.close();
            // Trigger custom event for space creation
            document.dispatchEvent(
              new CustomEvent("spaceCreated", {
                detail: { ...this.spaceData, id: newSpace.id },
              })
            );
          }, 2000);
        } else {
          console.error("Spaces manager not found");
          this.showError("Failed to create space. Please try again.");
        }
      } catch (error) {
        console.error("Error creating space:", error);
        this.showError("Failed to create space. Please try again.");
      }
    }, 1500);
  }

  selectTheme(color) {
    this.spaceData.theme = color;
    this.modal.querySelectorAll(".csm-theme-color-4821").forEach((btn) => {
      btn.classList.toggle("csm-selected-4821", btn.dataset.color === color);
    });
  }

  toggleTag(element) {
    element.classList.toggle("selected");
  }

  selectAccess(type) {
    this.spaceData.accessType = type;
    this.modal.querySelectorAll(".csm-access-option-4821").forEach((option) => {
      option.classList.toggle("csm-selected-4821", option.dataset.access === type);
    });
    this.modal.querySelectorAll(".csm-radio-dot-4821").forEach((dot) => {
      dot.classList.toggle("csm-active-4821", dot.closest(".csm-access-option-4821").dataset.access === type);
    });
  }

  handleBannerUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.spaceData.banner = e.target.result;
        const preview = this.modal.querySelector("#bannerPreview");
        preview.innerHTML = `<img src="${e.target.result}" alt="Banner preview">`;
      };
      reader.readAsDataURL(file);
    }
  }

  showError(message) {
    // Simple error display - could be enhanced with toast notifications
    alert(message);
  }

  showLoading() {
    const currentStep = this.steps[this.currentStep - 1];
    const footer = currentStep.querySelector(".csm-footer-4821");
    footer.innerHTML = `
            <div class="csm-loading-state-4821">
                <div class="csm-spinner-4821"></div>
                <span>Creating your space...</span>
            </div>
        `;
  }

  showSuccess() {
    const currentStep = this.steps[this.currentStep - 1];
    const body = currentStep.querySelector(".csm-body-4821");
    body.innerHTML = `
            <div class="csm-success-state-4821">
                <div class="csm-success-icon-4821">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#10B981"/>
                        <path d="m9 12 2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <h3>Space Created Successfully!</h3>
                <p>Your space "${this.spaceData.name}" is ready to go.</p>
            </div>
        `;

    const footer = currentStep.querySelector(".csm-footer-4821");
    footer.classList.add("live-chat-hidden");
  }
}

// Export for use
window.CreateSpaceModal = CreateSpaceModal;

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const createSpaceModal = new CreateSpaceModal();
  window.createSpaceModal = createSpaceModal;

  // Use event delegation to handle both static and dynamic create space buttons
  document.addEventListener("click", (e) => {
    // Check if clicked element or its parent has the create space action
    const target = e.target.closest('[data-action="create-space"]') || e.target.closest(".create-btn") || e.target.closest(".new-space-btn") || e.target.closest(".new-space-icon") || e.target.closest(".new-space-card");

    if (target) {
      e.preventDefault();
      console.log("Create space button clicked:", target.className);
      createSpaceModal.show();
    }
  });

  // Listen for space creation events
  document.addEventListener("spaceCreated", (e) => {
    const spaceData = e.detail;
    console.log("New space created:", spaceData);

    // Show a temporary success message
    showSuccessNotification(`Space "${spaceData.name}" created successfully!`);
  });

  // Add keyboard shortcut (Ctrl/Cmd + Shift + S) to open create space modal
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "S") {
      e.preventDefault();
      createSpaceModal.show();
    }
  });
});

// Success notification utility function
function showSuccessNotification(message) {
  const successMsg = document.createElement("div");
  successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10001;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  successMsg.textContent = message;

  // Add animation keyframes if not already present
  if (!document.querySelector("#success-animation-styles")) {
    const style = document.createElement("style");
    style.id = "success-animation-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(successMsg);

  // Remove after 4 seconds
  setTimeout(() => {
    successMsg.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (successMsg.parentNode) {
        successMsg.parentNode.removeChild(successMsg);
      }
    }, 300);
  }, 4000);
}
