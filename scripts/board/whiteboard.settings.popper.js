class SettingsPopper {
  /**
   * @param {HTMLElement} button - The button that triggers the popper.
   * @param {HTMLElement} container - The settings container to show/hide.
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
  }

  show() {
    // Remove any pending transitionend listeners
    if (this._onTransitionEnd) {
      this.container.removeEventListener("transitionend", this._onTransitionEnd);
      this._onTransitionEnd = null;
    }
    this.container.classList.remove(POPPER_HIDDEN);
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
    this.container.classList.remove("visible");
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

window.SettingsPopper = SettingsPopper;
