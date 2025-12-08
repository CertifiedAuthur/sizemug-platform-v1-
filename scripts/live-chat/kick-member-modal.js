/**
 * Kick Member Modal - Specific Implementation
 * Handles removing members from spaces
 */

class KickMemberModal {
  constructor() {
    this.overlay = null;
    this.modal = null;
    this.isVisible = false;
    this.isAnimating = false;
    this.currentData = null;

    this.init();
  }

  init() {
    this.getModalElements();
    this.bindEvents();
    this.setupGlobalListeners();
  }

  getModalElements() {
    // Get references to existing HTML elements
    this.overlay = document.getElementById("kickMemberOverlay");
    this.modal = this.overlay?.querySelector(".kick-member-modal");

    if (!this.overlay || !this.modal) {
      console.error("Kick Member Modal: Required HTML elements not found");
      return;
    }
  }

  bindEvents() {
    // Close on overlay click
    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });

    // Cancel button
    const cancelBtn = document.getElementById("kickMemberCancel");
    cancelBtn.addEventListener("click", () => this.close());

    // Confirm button
    const confirmBtn = document.getElementById("kickMemberConfirm");
    confirmBtn.addEventListener("click", () => this.handleConfirm());
  }

  setupGlobalListeners() {
    // Listen for trigger elements
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-kick-member]");
      if (trigger) {
        e.preventDefault();

        const memberData = {
          memberId: trigger.dataset.memberId,
          memberName: trigger.dataset.memberName,
          memberAvatar: trigger.dataset.memberAvatar,
          spaceId: trigger.dataset.spaceId,
          spaceName: trigger.dataset.spaceName,
        };

        this.open(memberData);
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible) {
        this.close();
      }
    });
  }

  open(memberData = {}) {
    if (this.isVisible || this.isAnimating) return;

    this.currentData = memberData;
    this.updateModalContent(memberData);

    this.isVisible = true;
    this.isAnimating = true;

    // Show modal
    this.overlay.classList.remove("kick-member-hidden");

    setTimeout(() => {
      this.overlay.classList.add("visible");
      this.isAnimating = false;
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  updateModalContent(memberData) {
    // Update member name
    const memberNameEl = document.getElementById("kickMemberName");
    if (memberNameEl) {
      memberNameEl.textContent = memberData.memberName || "Unknown Member";
    }

    // Update space name
    const spaceNameEl = document.getElementById("kickSpaceName");
    if (spaceNameEl) {
      spaceNameEl.textContent = memberData.spaceName || "Unknown Space";
    }

    // Update avatar
    // const avatarEl = document.getElementById("kickMemberAvatar");
    // if (avatarEl && memberData.memberAvatar) {
    //   avatarEl.innerHTML = `<img src="${memberData.memberAvatar}" alt="${memberData.memberName}" />`;
    // } else if (avatarEl) {
    //   // Reset to placeholder
    //   avatarEl.innerHTML = `
    //     <div class="kick-member-avatar-placeholder">
    //       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //         <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    //       </svg>
    //     </div>
    //   `;
    // }
  }

  close() {
    if (!this.isVisible || this.isAnimating) return;

    this.isAnimating = true;
    this.overlay.classList.remove("visible");

    setTimeout(() => {
      this.overlay.classList.add("kick-member-hidden");
      this.isVisible = false;
      this.isAnimating = false;
      this.currentData = null;
      document.body.style.overflow = "";
    }, 300);
  }

  handleConfirm() {
    const confirmBtn = document.getElementById("kickMemberConfirm");

    // Add loading state
    confirmBtn.classList.add("loading");
    confirmBtn.disabled = true;
    confirmBtn.textContent = "";

    // Simulate API call
    setTimeout(() => {
      this.executeKick();
    }, 1500);
  }

  executeKick() {
    console.log("Kicking member:", this.currentData);

    // Dispatch custom event for other components to listen to
    const event = new CustomEvent("memberKicked", {
      detail: {
        memberId: this.currentData.memberId,
        memberName: this.currentData.memberName,
        spaceId: this.currentData.spaceId,
        spaceName: this.currentData.spaceName,
      },
    });
    document.dispatchEvent(event);

    // Show success message
    this.showNotification(`${this.currentData.memberName || "Member"} has been removed from ${this.currentData.spaceName || "the space"}`, "success");

    // Close modal
    this.close();

    // Reset button state
    setTimeout(() => {
      const confirmBtn = document.getElementById("kickMemberConfirm");
      if (confirmBtn) {
        confirmBtn.classList.remove("loading");
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Remove";
      }
    }, 500);
  }

  showNotification(message, type = "info") {
    // Use existing notification system if available
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API methods
  openModal(memberData) {
    this.open(memberData);
  }

  closeModal() {
    this.close();
  }

  isModalVisible() {
    return this.isVisible;
  }
}

// Initialize the modal
let kickMemberModal;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    kickMemberModal = new KickMemberModal();
    window.kickMemberModal = kickMemberModal;
  });
} else {
  kickMemberModal = new KickMemberModal();
  window.kickMemberModal = kickMemberModal;
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = KickMemberModal;
}
