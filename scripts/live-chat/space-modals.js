/**
 * Space Management Modals - Unified System
 * Handles: Close Space, Leave Space, Delete Space, Kick Member
 */

class SpaceModalsManager {
  constructor() {
    this.modals = {
      closeSpace: null,
      leaveSpace: null,
      deleteSpace: null,
      kickMember: null,
    };

    this.currentModal = null;
    this.currentData = null;

    this.init();
  }

  init() {
    this.createModals();
    this.bindEvents();
    this.setupGlobalListeners();
  }

  createModals() {
    // Create Close Space Modal
    this.modals.closeSpace = this.createModal("closeSpace", {
      title: "Close Space",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      description: "will pause all activity.",
      content: "Members can still view threads but can't post, reply, or add new threads until it's reopened.",
      buttonText: "Close",
      buttonClass: "space-modal-btn-danger",
    });

    // Create Leave Space Modal
    this.modals.leaveSpace = this.createModal("leaveSpace", {
      title: "Leave Space",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      description: "?",
      content: "You'll lose access to its threads and future updates. You can rejoin anytime if it's public.",
      buttonText: "Leave",
      buttonClass: "space-modal-btn-warning",
    });

    // Create Delete Space Modal
    this.modals.deleteSpace = this.createModal("deleteSpace", {
      title: "Delete Space",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      description: "will permanently remove all threads, messages, and media connected to it.",
      content: "This action can't be undone.",
      buttonText: "Delete",
      buttonClass: "space-modal-btn-danger",
      isDangerous: true,
    });

    // Create Kick Member Modal
    this.modals.kickMember = this.createModal("kickMember", {
      title: "Kick Member from Space",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 11l-5-5M17 11l5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      description: "from",
      content: "They'll lose access to all threads and can't rejoin unless invited again.",
      buttonText: "Remove",
      buttonClass: "space-modal-btn-warning",
      showMemberInfo: true,
    });

    // Append modals to body
    Object.values(this.modals).forEach((modal) => {
      document.body.appendChild(modal);
    });
  }

  createModal(type, config) {
    const modal = document.createElement("div");
    modal.className = "space-modal-overlay space-modal-hidden";
    modal.id = `${type}Modal`;

    modal.innerHTML = `
      <div class="space-modal">
        <div class="space-modal-header">
          <div class="space-modal-icon ${type.replace(/([A-Z])/g, "-$1").toLowerCase()}">
            ${config.icon}
          </div>
          <div class="space-modal-content">
            <h3 class="space-modal-title">${config.title}</h3>
            <p class="space-modal-subtitle">
              ${type === "closeSpace" ? "Closing" : type === "leaveSpace" ? "Are you sure you want to leave" : type === "deleteSpace" ? "Deleting" : "You're about to remove"}
              <span class="space-name-placeholder"></span>
              ${config.description}
            </p>
          </div>
        </div>
        
        <div class="space-modal-body">
          ${config.showMemberInfo ? '<div class="member-info-placeholder"></div>' : ""}
          
          <p class="space-modal-description">${config.content}</p>
          
          ${config.isDangerous ? '<div class="space-modal-danger"><p class="space-modal-danger-text">This action can\'t be undone.</p></div>' : '<div class="space-modal-warning"><p class="space-modal-warning-text">This action can be reversed later.</p></div>'}
        </div>
        
        <div class="space-modal-footer">
          <button class="space-modal-btn space-modal-btn-secondary" data-action="cancel">Cancel</button>
          <button class="space-modal-btn ${config.buttonClass}" data-action="confirm">${config.buttonText}</button>
        </div>
      </div>
    `;

    return modal;
  }

  bindEvents() {
    // Bind events for each modal
    Object.entries(this.modals).forEach(([type, modal]) => {
      // Close on overlay click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.close();
        }
      });

      // Cancel button
      const cancelBtn = modal.querySelector('[data-action="cancel"]');
      cancelBtn.addEventListener("click", () => this.close());

      // Confirm button
      const confirmBtn = modal.querySelector('[data-action="confirm"]');
      confirmBtn.addEventListener("click", () => this.handleConfirm(type));
    });
  }

  setupGlobalListeners() {
    // Listen for trigger elements
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-space-action]");
      if (trigger) {
        e.preventDefault();
        const action = trigger.dataset.spaceAction;
        const spaceId = trigger.dataset.spaceId;
        const spaceName = trigger.dataset.spaceName;
        const memberId = trigger.dataset.memberId;
        const memberName = trigger.dataset.memberName;
        const memberAvatar = trigger.dataset.memberAvatar;

        this.open(action, {
          spaceId,
          spaceName,
          memberId,
          memberName,
          memberAvatar,
        });
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.currentModal) {
        this.close();
      }
    });
  }

  open(modalType, data = {}) {
    if (this.currentModal) {
      this.close();
    }

    const modal = this.modals[modalType];
    if (!modal) {
      console.error(`Modal type "${modalType}" not found`);
      return;
    }

    this.currentModal = modalType;
    this.currentData = data;

    // Update modal content with data
    this.updateModalContent(modal, modalType, data);

    // Show modal
    modal.classList.remove("space-modal-hidden");
    setTimeout(() => {
      modal.classList.add("visible");
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  updateModalContent(modal, modalType, data) {
    // Update space name
    const spaceNamePlaceholder = modal.querySelector(".space-name-placeholder");
    if (spaceNamePlaceholder && data.spaceName) {
      spaceNamePlaceholder.textContent = data.spaceName;
      spaceNamePlaceholder.className = "space-name-highlight";
    }

    // Update member info for kick member modal
    if (modalType === "kickMember" && data.memberId) {
      const memberInfoPlaceholder = modal.querySelector(".member-info-placeholder");
      if (memberInfoPlaceholder) {
        memberInfoPlaceholder.innerHTML = `
          <div class="member-info-display">
            <div class="member-avatar">
              ${
                data.memberAvatar
                  ? `<img src="${data.memberAvatar}" alt="${data.memberName}" />`
                  : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#7d8faa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`
              }
            </div>
            <div class="member-details">
              <p class="member-name">${data.memberName || "Unknown Member"}</p>
              <p class="member-role">Member</p>
            </div>
          </div>
        `;
      }
    }
  }

  close() {
    if (!this.currentModal) return;

    const modal = this.modals[this.currentModal];
    modal.classList.remove("visible");

    setTimeout(() => {
      modal.classList.add("space-modal-hidden");
      this.currentModal = null;
      this.currentData = null;
      document.body.style.overflow = "";
    }, 300);
  }

  handleConfirm(modalType) {
    const confirmBtn = this.modals[modalType].querySelector('[data-action="confirm"]');

    // Add loading state
    confirmBtn.classList.add("loading");
    confirmBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.executeAction(modalType, this.currentData);
    }, 1000);
  }

  executeAction(modalType, data) {
    console.log(`Executing ${modalType} action:`, data);

    // Dispatch custom events for other components to listen to
    const event = new CustomEvent(`space${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`, {
      detail: { modalType, data },
    });
    document.dispatchEvent(event);

    // Show success message
    this.showNotification(this.getSuccessMessage(modalType, data), "success");

    // Close modal
    this.close();
  }

  getSuccessMessage(modalType, data) {
    const spaceName = data.spaceName || "Space";
    const memberName = data.memberName || "Member";

    switch (modalType) {
      case "closeSpace":
        return `${spaceName} has been closed`;
      case "leaveSpace":
        return `You have left ${spaceName}`;
      case "deleteSpace":
        return `${spaceName} has been deleted`;
      case "kickMember":
        return `${memberName} has been removed from ${spaceName}`;
      default:
        return "Action completed successfully";
    }
  }

  showNotification(message, type = "info") {
    // Use existing notification system if available
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
}

// Initialize the modal system
let spaceModalsManager;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    spaceModalsManager = new SpaceModalsManager();
    window.spaceModalsManager = spaceModalsManager;
  });
} else {
  spaceModalsManager = new SpaceModalsManager();
  window.spaceModalsManager = spaceModalsManager;
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = SpaceModalsManager;
}
