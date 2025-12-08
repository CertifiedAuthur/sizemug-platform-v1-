/**
 * Comment Gift Modal Handler
 */
class CommentGiftModal {
  constructor() {
    this.giftPopover = document.getElementById("giftPopover");
    this.giftSuccessOverlay = document.querySelector(".gift_success_overlay");
    this.sendGiftBtn = document.getElementById("sendGiftBtn");
    this.giftsGrid = document.getElementById("giftsGrid");
    this.giftSearchInput = document.querySelector(".gift_search_input input");
    this.recipientNameSpan = document.querySelector(".recipient_name");
    this.successRecipientNameSpan = document.querySelector(".success_recipient_name");
    this.recipientAvatar = document.querySelector(".recipient_avatar");
    this.cancelGiftBtn = document.querySelector(".cancel_gift_btn");
    this.sendAgainBtn = document.querySelector(".send_again_btn");
    this.giftTriggerBtns = document.querySelectorAll("#commentInputWithGift");
    this.giftSuccessState = document.querySelector(".gift_success_state");

    this.selectedGift = null;
    this.currentRecipient = null;
    this.currentTriggerBtn = null;
    this.popperInstance = null;

    this.gifts = [
      { id: "bell", image: "./icons/sg-echo-bell.svg", name: "Echo Bell", price: 20 },
      { id: "medal", image: "./icons/sg-victory-medal.svg", name: "Victory Medal", price: 20 },
      { id: "gift-box", image: "./icons/sg-mystery-box.svg", name: "Mystery Box", price: 20 },
      { id: "fire", image: "./icons/sg-blaze-drop.svg", name: "Blaze Drop", price: 20 },
      { id: "shield", image: "./icons/sg-guardian-shield.svg", name: "Guardian Shield", price: 20 },
      { id: "umbrella", image: "./icons/sg-rain-cover-umbrella.svg", name: "Rain Cover", price: 20 },
      { id: "package", image: "./icons/sg-blaze-fire.svg", name: "Blaze Fire", price: 20 },
      { id: "tree", image: "./icons/sg-chrismas-tree.svg", name: "Christmas Tree", price: 20 },
    ];

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderGifts();
  }

  bindEvents() {
    // Gift trigger buttons
    this.giftTriggerBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentTriggerBtn = btn;
        this.toggleGiftPopover();
      });
    });

    // Send gift button
    if (this.sendGiftBtn) {
      this.sendGiftBtn.addEventListener("click", () => {
        this.sendGift();
      });
    }

    // Cancel and send again buttons
    if (this.cancelGiftBtn) {
      this.cancelGiftBtn.addEventListener("click", () => {
        this.closeGiftPopover();
      });
    }

    if (this.sendAgainBtn) {
      this.sendAgainBtn.addEventListener("click", () => {
        this.resetToSelectionMode();
      });
    }

    // Close popover when clicking outside
    document.addEventListener("click", (e) => {
      if (this.giftPopover && this.giftPopover.classList.contains("active")) {
        if (!this.giftPopover.contains(e.target) && !this.currentTriggerBtn?.contains(e.target)) {
          this.closeGiftPopover();
        }
      }
    });

    if (this.giftSuccessOverlay) {
      this.giftSuccessOverlay.addEventListener("click", (e) => {
        if (e.target === this.giftSuccessOverlay) {
          this.closeSuccessModal();
        }
      });
    }

    // Search functionality
    if (this.giftSearchInput) {
      this.giftSearchInput.addEventListener("input", (e) => {
        this.filterGifts(e.target.value);
      });
    }

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.giftSuccessOverlay?.classList.contains("active")) {
          this.closeSuccessModal();
        } else if (this.giftPopover?.classList.contains("active")) {
          this.closeGiftPopover();
        }
      }
    });
  }

  toggleGiftPopover() {
    if (this.giftPopover.classList.contains("active")) {
      this.closeGiftPopover();
    } else {
      this.openGiftPopover();
    }
  }

  openGiftPopover(recipientName = "Olivia Rhye", recipientAvatar = "https://media.istockphoto.com/id/2145257619/photo/pensive-woman-hand-on-chin-looking-up.webp?a=1&b=1&s=612x612&w=0&k=20&c=0zqfgA0ukfthPkL6bhUUv3yQJS04b3bvx7oe36CeNTY=") {
    this.currentRecipient = { name: recipientName, avatar: recipientAvatar };

    // Update recipient info
    if (this.recipientNameSpan) {
      this.recipientNameSpan.textContent = recipientName;
    }
    if (this.successRecipientNameSpan) {
      this.successRecipientNameSpan.textContent = recipientName;
    }
    if (this.recipientAvatar) {
      this.recipientAvatar.src = recipientAvatar;
    }

    // Position and show popover
    this.positionPopover();
    if (this.giftPopover) {
      this.giftPopover.classList.remove("success-mode");
      this.giftPopover.classList.add("active");
    }

    // Reset selection
    this.selectedGift = null;
    this.updateSendButton();
    this.clearGiftSelection();

    // Focus search input
    setTimeout(() => {
      if (this.giftSearchInput) {
        this.giftSearchInput.focus();
      }
    }, 100);
  }

  positionPopover() {
    if (!this.currentTriggerBtn || !this.giftPopover) return;

    // Destroy existing popper instance if it exists
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    // Create new Popper instance
    this.popperInstance = Popper.createPopper(this.currentTriggerBtn, this.giftPopover, {
      placement: "top-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 16],
          },
        },
        {
          name: "preventOverflow",
          options: {
            padding: 8,
            boundary: "viewport",
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top-start", "bottom-end", "bottom-start"],
          },
        },
        {
          name: "arrow",
          options: {
            element: ".gift_popover_arrow",
          },
        },
      ],
    });
  }

  closeGiftPopover() {
    if (this.giftPopover) {
      this.giftPopover.classList.remove("active", "success-mode");
    }

    // Destroy Popper instance
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    // Reset search
    if (this.giftSearchInput) {
      this.giftSearchInput.value = "";
      this.filterGifts("");
    }

    // Reset selection state
    this.selectedGift = null;
    this.clearGiftSelection();
  }

  closeSuccessModal() {
    if (this.giftSuccessOverlay) {
      this.giftSuccessOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  resetToSelectionMode() {
    if (this.giftPopover) {
      this.giftPopover.classList.remove("success-mode");
    }

    // Reset selection state
    this.selectedGift = null;
    this.clearGiftSelection();

    // Focus search input
    setTimeout(() => {
      if (this.giftSearchInput) {
        this.giftSearchInput.focus();
      }
    }, 100);
  }

  triggerConfetti() {
    // Create a full-screen canvas for confetti
    const canvas = document.createElement("canvas");
    canvas.id = "giftSuccessConfetti";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Add canvas to body
    document.body.appendChild(canvas);

    // Initialize confetti with celebration colors (same as folder manager)
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
    if (window.RectangleConfetti) {
      const confettiInstance = new window.RectangleConfetti(canvas, {
        count: 100,
        colors: celebrationColors,
      });

      // Start the animation
      confettiInstance.start();

      // Stop confetti and remove canvas after 4 seconds
      setTimeout(() => {
        confettiInstance.stop();
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }, 4000);
    } else {
      console.warn("RectangleConfetti class not available");
      // Remove canvas if confetti failed to initialize
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  renderGifts() {
    if (!this.giftsGrid) return;

    this.giftsGrid.innerHTML = this.gifts
      .map(
        (gift) => `
        <div class="gift_item" data-gift-id="${gift.id}" data-price="${gift.price}">
          <div class="gift_selection_circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 12l5 5L20 7"/></svg>
          </div>
          <div class="gift_emoji">
            <img src="${gift.image}" alt="${gift.name}" />
          </div>
          <div class="gift_name">${gift.name}</div>
          <div class="gift_price"><img src="icons/sg-coin.svg" alt="SG Coin" /> ${gift.price}</div>
        </div>
      `
      )
      .join("");

    // Bind click events
    this.giftsGrid.querySelectorAll(".gift_item").forEach((item) => {
      item.addEventListener("click", () => {
        this.selectGift(item);
      });
    });
  }

  selectGift(giftElement) {
    // Clear previous selection
    this.clearGiftSelection();

    // Select new gift
    giftElement.classList.add("selected");

    const giftId = giftElement.dataset.giftId;
    const giftPrice = giftElement.dataset.price;

    this.selectedGift = {
      id: giftId,
      price: parseInt(giftPrice),
      element: giftElement,
    };

    this.updateSendButton();
  }

  clearGiftSelection() {
    this.giftsGrid?.querySelectorAll(".gift_item").forEach((item) => {
      item.classList.remove("selected");
    });
    this.selectedGift = null;
    this.updateSendButton();
  }

  updateSendButton() {
    if (!this.sendGiftBtn) return;

    const sendButtonContainer = this.sendGiftBtn.closest(".gift_popover_actions");

    if (this.selectedGift) {
      this.sendGiftBtn.disabled = false;
      this.sendGiftBtn.textContent = `Send Gift (💰 ${this.selectedGift.price})`;
      if (sendButtonContainer) {
        sendButtonContainer.classList.add("active");
      }
    } else {
      this.sendGiftBtn.disabled = true;
      this.sendGiftBtn.textContent = "Send Gift";
      if (sendButtonContainer) {
        sendButtonContainer.classList.remove("active");
      }
    }
  }

  async sendGift() {
    if (!this.selectedGift || !this.currentRecipient) return;

    // Show loading state
    this.sendGiftBtn.disabled = true;
    this.sendGiftBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Sending...
      </div>
    `;

    // Simulate API call
    setTimeout(() => {
      this.showSuccessModal();
    }, 1500);
  }

  showSuccessModal() {
    // Switch to success state within the popover
    if (this.giftPopover) {
      this.giftPopover.classList.add("success-mode");
    }

    // Reset send button for next use
    this.sendGiftBtn.disabled = false;
    this.sendGiftBtn.textContent = "Send Gift";

    // Trigger confetti animation
    this.triggerConfetti();
  }

  filterGifts(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    this.giftsGrid?.querySelectorAll(".gift_item").forEach((item) => {
      const giftName = item.querySelector(".gift_name").textContent.toLowerCase();

      if (giftName.includes(term) || term === "") {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Public API methods
  openGiftModalForUser(userName, userAvatar) {
    this.openGiftModal(userName, userAvatar);
  }

  getSelectedGift() {
    return this.selectedGift;
  }

  getCurrentRecipient() {
    return this.currentRecipient;
  }
}

// Add CSS animations for spinner
const commentModalGiftStyle = document.createElement("style");
commentModalGiftStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(commentModalGiftStyle);

// Initialize gift modal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.commentGiftModal = new CommentGiftModal();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = CommentGiftModal;
}
