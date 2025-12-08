class EmojiPopper {
  /**
   * @param {HTMLElement} button - The button that triggers the popper.
   * @param {HTMLElement} container - The emoji container to show/hide.
   */
  constructor(button, container, hideAllDropdowns) {
    this.button = button;
    this.container = container;
    this.popperInstance = null;
    this.hideAllDropdowns = hideAllDropdowns;
    this._onTransitionEnd = null;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);

    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.hideAllDropdowns) this.hideAllDropdowns();
      this.toggle();
    });

    // Add event listener for the close button
    const closeButton = this.container.querySelector(".hide_notification");
    if (closeButton) {
      closeButton.addEventListener("click", this.handleCloseClick);
    }

    // Add event listeners for emoji items
    this.initEmojiClickHandlers();
  }

  initEmojiClickHandlers() {
    const emojiItems = this.container.querySelectorAll("li[data-emoji-type]");

    emojiItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();

        const emojiType = item.dataset.emojiType;
        const rect = item.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        this.triggerConfetti(emojiType, centerX, centerY);

        // Hide the popper after a short delay
        setTimeout(() => {
          this.hide();
        }, 500);
      });
    });
  }

  triggerConfetti(type, x, y) {
    console.log(`Triggering confetti: ${type} at center of screen`);

    if (!window.confettiManager) {
      console.warn("Confetti manager not available");
      return;
    }

    console.log("Confetti manager found, showing confetti...");

    // Use center of screen instead of click position
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    switch (type) {
      case "wave":
        console.log("Showing wave confetti");
        window.confettiManager.showWaveConfetti(centerX, centerY);
        break;
      case "smile":
        console.log("Showing smile confetti");
        window.confettiManager.showSmileConfetti(centerX, centerY);
        break;
      case "heart":
        console.log("Showing heart confetti");
        window.confettiManager.showHeartConfetti(centerX, centerY);
        break;
      default:
        console.log("Showing default confetti");
        window.confettiManager.showConfetti(centerX, centerY);
    }

    // Add some screen shake effect
    this.addScreenShake();
  }

  addScreenShake() {
    const body = document.body;
    body.style.animation = "confetti-shake 0.5s ease-in-out";

    setTimeout(() => {
      body.style.animation = "";
    }, 500);
  }

  show() {
    console.log("SHOW");
    // Remove any pending transitionend listeners
    if (this._onTransitionEnd) {
      this.container.removeEventListener("transitionend", this._onTransitionEnd);
      this._onTransitionEnd = null;
    }

    console.log(this._onTransitionEnd);
    this.container.classList.remove(POPPER_HIDDEN);
    // Force reflow to ensure the transition triggers
    void this.container.offsetWidth;
    this.container.classList.add("visible");
    requestAnimationFrame(() => {
      this.popperInstance = Popper.createPopper(this.button, this.container, {
        placement: "bottom",
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, 16] },
          },
          {
            name: "preventOverflow",
            options: {
              padding: 8,
              boundary: "viewport",
            },
          },
        ],
      });
    });
  }

  hide() {
    console.log("Emoji Popper hide");
    this.container.classList.remove("visible");
    // Remove any previous transitionend listeners
    if (this._onTransitionEnd) {
      this.container.removeEventListener("transitionend", this._onTransitionEnd);
    }
    this._onTransitionEnd = (e) => {
      if (e.propertyName === "transform" || e.propertyName === "opacity") {
        this.container.classList.add(POPPER_HIDDEN);
        if (this.popperInstance) {
          this.popperInstance.destroy();
          this.popperInstance = null;
        }
        this.container.removeEventListener("transitionend", this._onTransitionEnd);
        this._onTransitionEnd = null;
      }
    };
    this.container.addEventListener("transitionend", this._onTransitionEnd);
  }

  toggle() {
    if (this.container.classList.contains(POPPER_HIDDEN)) {
      this.show();
    } else {
      this.hide();
    }
  }

  handleDocumentClick(e) {
    if (!this.container.contains(e.target) && e.target !== this.button) {
      this.hide();
    }
  }

  handleCloseClick(e) {
    e.stopPropagation();
    this.hide();
  }
}

window.EmojiPopper = EmojiPopper;
