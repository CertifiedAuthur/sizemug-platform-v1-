/**
 * Boost Modal Handler
 */
class BoostModal {
  constructor() {
    this.boostPopover = document.getElementById("boostPopover");
    this.boostOptionsGrid = document.getElementById("boostOptionsGrid");
    this.boostSearchInput = document.querySelector(".boost_search_input input");
    this.goBackBtn = document.getElementById("goBackBtn");
    this.boostConfirmBtn = document.getElementById("boostConfirmBtn");
    this.successGoBackBtn = document.getElementById("successGoBackBtn");
    this.boostAgainBtn = document.getElementById("boostAgainBtn");

    // State elements
    this.boostSelectionState = document.querySelector(".boost_selection_state");
    this.boostConfirmationState = document.querySelector(".boost_confirmation_state");
    this.boostSuccessState = document.querySelector(".boost_success_state");

    // Boost trigger buttons
    this.boostTriggerBtns = document.querySelectorAll(".boost");

    this.selectedBoost = null;
    this.currentState = "selection"; // selection, confirmation, success
    this.currentTriggerBtn = null;
    this.popperInstance = null;
    this.isAnchoredToMenuCloseIcon = false;

    this.boostOptions = [
      {
        id: "firebolt",
        name: "Firebolt Blaze",
        description: "x100 reach and engagement",
        price: 2000,
        icon: "firebolt",
        image: "icons/firebolt-blaze.svg",
      },
      {
        id: "woodbolt",
        name: "Woodbolt Thorn",
        description: "x40 reach and engagement",
        price: 400,
        icon: "woodbolt",
        image: "icons/woodbolt-thorn.svg",
      },
      {
        id: "waterbolt",
        name: "Waterbolt Surge",
        description: "x20 reach and engagement",
        price: 200,
        icon: "waterbolt",
        image: "icons/waterbolt-surge.svg",
      },
      {
        id: "glassbolt",
        name: "Glassbolt Shard",
        description: "x10 reach and engagement",
        price: 20,
        icon: "glassbolt",
        image: "icons/glassbolt-shard.svg",
      },
    ];

    // Mock user coins (in real app, this would come from API)
    this.userCoins = 1500;
    this.backdropEl = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderBoostOptions();
  }

  ensureBackdrop() {
    if (this.backdropEl && document.body.contains(this.backdropEl)) return;

    const el = document.createElement("div");
    el.className = "boost_popover_backdrop";

    // Clicking anywhere on the backdrop closes the popover.
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.closePopover();
    });

    document.body.appendChild(el);
    this.backdropEl = el;
  }

  showBackdrop() {
    this.ensureBackdrop();
    this.backdropEl?.classList.add("active");
  }

  hideBackdrop() {
    this.backdropEl?.classList.remove("active");
  }
  bindEvents() {
    this.boostPopover.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close when clicking anywhere outside the popover.
    // (Backdrop covers the page, but this is a safe fallback if stacking changes.)
    document.addEventListener("click", (e) => {
      if (!this.boostPopover) return;
      if (!this.boostPopover.classList.contains("active")) return;

      // Ignore clicks on the popover itself
      if (e.target && this.boostPopover.contains(e.target)) return;

      // Ignore clicks on Boost triggers (they open/reposition instead)
      if (e.target && e.target.closest && e.target.closest(".boost")) return;

      this.closePopover();
    });

    // Explicit close button inside the popover
    this.boostPopover?.querySelectorAll(".close_boost_modal").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closePopover();
      });
    });

    // Use event delegation for dynamically created boost buttons
    document.addEventListener("click", (e) => {
      const boostBtn = e.target.closest(".boost");
      if (boostBtn) {
        e.stopPropagation();
        // Anchor the popover beside the exact Boost element that was clicked.
        // Use a Popper "virtual element" so positioning remains stable even if the
        // clicked element disappears (e.g., an options menu closes).
        const anchorRect = boostBtn.getBoundingClientRect();
        this.currentTriggerBtn = {
          getBoundingClientRect: () => anchorRect,
          contextElement: boostBtn,
        };
        this.isAnchoredToMenuCloseIcon = false;
        // Never close the popover by re-clicking Boost; just open/reposition it.
        this.openPopover();
        return;
      }
    });

    // Go back button
    if (this.goBackBtn) {
      this.goBackBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showSelectionState();
      });
    }

    // Boost confirm button
    if (this.boostConfirmBtn) {
      this.boostConfirmBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.confirmBoost();
      });
    }

    // Success go back button
    if (this.successGoBackBtn) {
      this.successGoBackBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closePopover();
      });
    }

    // Boost again button
    if (this.boostAgainBtn) {
      this.boostAgainBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showSelectionState();
      });
    }

    // Search functionality
    if (this.boostSearchInput) {
      this.boostSearchInput.addEventListener("input", (e) => {
        this.filterBoostOptions(e.target.value);
      });

      this.boostSearchInput.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Note: do not close on Escape; only explicit close button should close.
  }

  togglePopover() {
    // Kept for backwards compatibility; do not use for closing.
    this.openPopover();
  }

  openPopover() {
    if (this.boostPopover) {
      // Show the full-screen backdrop (covers navbar). Backdrop does not close the popover.
      this.showBackdrop();
      this.boostPopover.classList.add("active");
      this.showSelectionState();

      // Popper needs the popover to be visible to correctly measure and position
      // the arrow/tail against the trigger (e.g., the menu close X).
      this.positionPopover();
      requestAnimationFrame(() => {
        this.popperInstance?.update();
      });

      // Focus search input
      setTimeout(() => {
        if (this.boostSearchInput) {
          this.boostSearchInput.focus();
        }
      }, 100);
    }
  }

  closePopover() {
    if (this.boostPopover) {
      this.boostPopover.classList.remove("active");
      this.resetPopover();
    }

    // Hide backdrop only when popover is closed.
    this.hideBackdrop();

    // Destroy Popper instance
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  positionPopover() {
    if (!this.currentTriggerBtn || !this.boostPopover) return;

    this.boostPopover.classList.toggle("boost_anchor_x", !!this.isAnchoredToMenuCloseIcon);

    // Keep the popover beside the clicked Boost, but bias it to display upward
    // by using "*-end" placements (so the popover's bottom aligns to the trigger).
    const currentPage = (window.location?.pathname || "").split("/").pop();
    const openOnRightPages = new Set(["dashboard.html", "explore.html", "not-found.html", "challenges.html"]);
    const preferredPlacement = openOnRightPages.has(currentPage) ? "right-end" : "left-end";
    const fallbackPlacements = openOnRightPages.has(currentPage)
      ? ["right-start", "left-end", "left-start"]
      : ["left-start", "right-end", "right-start"];

    // Destroy existing popper instance if it exists
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    // Create new Popper instance
    this.popperInstance = Popper.createPopper(this.currentTriggerBtn, this.boostPopover, {
      strategy: "fixed",
      placement: preferredPlacement,
      modifiers: [
        {
          name: "eventListeners",
          options: {
            scroll: false,
            resize: false,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 8],
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
            fallbackPlacements,
          },
        },
        {
          name: "arrow",
          options: {
            element: ".boost_popover_arrow",
          },
        },
      ],
    });
  }

  resetPopover() {
    this.selectedBoost = null;
    this.currentState = "selection";
    this.showSelectionState();

    // Reset search
    if (this.boostSearchInput) {
      this.boostSearchInput.value = "";
      this.filterBoostOptions("");
    }
  }

  showSelectionState() {
    this.currentState = "selection";
    this.boostSelectionState.style.display = "block";
    this.boostConfirmationState.style.display = "none";
    this.boostSuccessState.style.display = "none";
  }

  showConfirmationState() {
    this.currentState = "confirmation";
    this.boostSelectionState.style.display = "none";
    this.boostConfirmationState.style.display = "block";
    this.boostSuccessState.style.display = "none";

    // Update confirmation content
    if (this.selectedBoost) {
      const nameElement = document.querySelector(".selected_boost_name");
      const descriptionElement = document.querySelector(".selected_boost_description");
      const priceElement = document.querySelector(".boost_confirm_btn .boost_price");
      const previewCard = document.querySelector(".boost_confirmation_state .boost_preview_card");

      if (nameElement) nameElement.textContent = this.selectedBoost.name;
      if (descriptionElement) descriptionElement.textContent = this.selectedBoost.description;
      if (priceElement) priceElement.textContent = this.selectedBoost.price;
      if (previewCard) {
        previewCard.style.background = this.selectedBoost.gradient;
      }
    }
  }

  showSuccessState() {
    this.currentState = "success";
    this.boostSelectionState.style.display = "none";
    this.boostConfirmationState.style.display = "none";
    this.boostSuccessState.style.display = "block";

    // Update success content
    if (this.selectedBoost) {
      const nameElement = document.querySelector(".boosted_item_name");
      const descriptionElement = document.querySelector(".boosted_item_description");
      const priceElement = document.querySelector(".boost_again_btn .boost_price");
      const previewCard = document.querySelector(".boost_success_preview .boost_preview_card");

      if (nameElement) nameElement.textContent = this.selectedBoost.name;
      if (descriptionElement) descriptionElement.textContent = this.selectedBoost.description;
      if (priceElement) priceElement.textContent = this.selectedBoost.price;
      if (previewCard) {
        previewCard.style.background = this.selectedBoost.gradient;
      }
    }

    // Trigger confetti
    this.triggerConfetti();
  }

  renderBoostOptions() {
    if (!this.boostOptionsGrid) return;

    this.boostOptionsGrid.innerHTML = this.boostOptions
      .map((option) => {
        const canAfford = this.userCoins >= option.price;
        const actionButton = canAfford ? `<button class="boost_btn" data-boost-id="${option.id}">Boost</button>` : `<button class="add_coins_btn">Add Coins</button>`;

        return `
          <div class="boost_option_item ${!canAfford ? "insufficient_coins" : ""}" data-boost-id="${option.id}">
            <div class="boost_option_icon ${option.icon}">
              <img src="${option.image}" alt="${option.name}" />
            </div>
            <div class="boost_option_content">
              <div class="boost_option_title">
                <h3 class="boost_option_name">${option.name}</h3>
                <div class="boost_option_price">
                  <img src="icons/sg-coin.svg" alt="SG Coin" />
                  ${option.price.toLocaleString()}
                </div>
              </div>
              <p class="boost_option_description">${option.description}</p>
            </div>
            <div class="boost_option_action">
              ${actionButton}
            </div>
          </div>
        `;
      })
      .join("");

    // Bind click events
    this.boostOptionsGrid.querySelectorAll(".boost_btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const boostId = btn.dataset.boostId;
        this.selectBoost(boostId);
      });
    });

    // Bind add coins events
    this.boostOptionsGrid.querySelectorAll(".add_coins_btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // In real app, this would open a coins purchase modal
        alert("Add coins functionality would be implemented here");
      });
    });
  }

  selectBoost(boostId) {
    const boost = this.boostOptions.find((option) => option.id === boostId);
    if (boost && this.userCoins >= boost.price) {
      this.selectedBoost = boost;
      this.showConfirmationState();
    }
  }

  async confirmBoost() {
    if (!this.selectedBoost) return;

    // Show loading state
    this.boostConfirmBtn.disabled = true;
    this.boostConfirmBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
        <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Boosting...
      </div>
    `;

    // Simulate API call
    setTimeout(() => {
      // Deduct coins
      this.userCoins -= this.selectedBoost.price;

      // Reset button
      this.boostConfirmBtn.disabled = false;
      this.boostConfirmBtn.innerHTML = `
        Boost <img src="icons/sg-coin.svg" alt="SG Coin" /> <span class="boost_price">${this.selectedBoost.price}</span>
      `;

      // Show success state
      this.showSuccessState();
    }, 1500);
  }

  filterBoostOptions(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    this.boostOptionsGrid?.querySelectorAll(".boost_option_item").forEach((item) => {
      const boostName = item.querySelector(".boost_option_name").textContent.toLowerCase();
      const boostDescription = item.querySelector(".boost_option_description").textContent.toLowerCase();

      if (boostName.includes(term) || boostDescription.includes(term) || term === "") {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  triggerConfetti() {
    // Create a full-screen canvas for confetti
    const canvas = document.createElement("canvas");
    canvas.id = "boostSuccessConfetti";
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

    // Initialize confetti with boost colors
    const boostColors = [
      "#FF5722", // Primary boost color
      "#FF7043", // Light boost color
      "#E64A19", // Dark boost color
      "#f59e0b", // Gold
      "#10b981", // Green
      "#3b82f6", // Blue
      "#ef4444", // Red
      "#f97316", // Orange
    ];

    // Create confetti instance
    if (window.RectangleConfetti) {
      const confettiInstance = new window.RectangleConfetti(canvas, {
        count: 120,
        colors: boostColors,
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

  // Public API methods
  getUserCoins() {
    return this.userCoins;
  }

  addCoins(amount) {
    this.userCoins += amount;
    this.renderBoostOptions(); // Re-render to update available options
  }

  getSelectedBoost() {
    return this.selectedBoost;
  }
}

// Add CSS animations for spinner
const boostModalStyle = document.createElement("style");
boostModalStyle.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(boostModalStyle);

// Initialize boost modal when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.boostModal = new BoostModal();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = BoostModal;
}
