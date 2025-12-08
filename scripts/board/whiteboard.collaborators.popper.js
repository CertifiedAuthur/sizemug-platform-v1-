class CollaboratorsPopper {
  /**
   * @param {HTMLElement} button - The button that triggers the popper.
   * @param {HTMLElement} container - The collaborators container to show/hide.
   */
  constructor(button, container, hideAllDropdowns) {
    this.button = button;
    this.container = container;
    this.popperInstance = null;
    this.hideAllDropdowns = hideAllDropdowns;

    this.boardCollaborators = document.querySelector(".collaborators_panel>ul");

    //
    const showCollaborators = document.querySelector(".show_collaborators");
    if (showCollaborators) {
      this.showCollaboratorsChildren = [...showCollaborators.children];
      this.showCollaboratorsChildren.forEach((btn) => {
        btn.style.border = `2px solid ${getRandomColorValue()}`;
      });
    }

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

    //
    this.renderCollaborators();

    this._onTransitionEnd = null;
  }

  show() {
    // Remove any pending transitionend listeners
    if (this._onTransitionEnd) {
      this.container.removeEventListener("transitionend", this._onTransitionEnd);
      this._onTransitionEnd = null;
    }

    console.log(this._onTransitionEnd);
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

  renderCollaborators() {
    this.boardCollaborators.innerHTML = "";

    collaboratorData.forEach((collab) => {
      const markup = `
        <li>
          <a href="/profile.html">
            <img src="${collab.image}" alt="${collab.name}" />
            <h4>${collab.name}</h4>
            ${collab.verified ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>` : ""}
          </a>
          <button data-state="follow">Follow</button>
        </li>
      `;

      this.boardCollaborators.insertAdjacentHTML("afterbegin", markup);
    });
  }
}

window.CollaboratorsPopper = CollaboratorsPopper;
