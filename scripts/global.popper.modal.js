class PopperModal {
  /**
   * @param {Object} options
   * @param {string} options.triggerSelector — CSS selector for the element that opens the modal
   * @param {string} options.modalSelector   — CSS selector for the modal container
   * @param {string} [options.referenceSelector=null] — CSS selector for the reference element
   * @param {string} [options.placement='bottom'] — Popper placement (top, right, bottom, left, etc)
   * @param {[number,number]} [options.offset=[0,8]] — [skidding, distance] offset in px
   */
  constructor({ triggerSelector, modalSelector, referenceSelector = null, placement = "bottom", offset = [0, 8] }) {
    this.triggerEl = document.querySelector(triggerSelector);
    this.modalEl = document.querySelector(modalSelector);
    // if you passed a referenceSelector, use that; otherwise fall back to triggerEl
    this.referenceEl = referenceSelector ? document.querySelector(referenceSelector) : this.triggerEl;
    this.placement = placement;
    this.offset = offset;
    this.popperInstance = null;

    if (!this.triggerEl || !this.modalEl || !this.referenceEl) {
      throw new Error(`PopperModal: couldn’t find one of: trigger (${triggerSelector}), ` + `modal (${modalSelector}), reference (${referenceSelector})`);
    }

    // hide modal initially
    this.modalEl.style.display = "none";

    // open/close logic
    this.triggerEl.addEventListener("click", (e) => {
      // e.stopPropagation();
      this.toggle();
    });
    document.addEventListener("click", (e) => {
      if (this.modalEl.style.display === "block" && !this.modalEl.contains(e.target) && !this.triggerEl.contains(e.target)) this.hide();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hide();
    });
  }

  _createPopper() {
    const create = window.Popper?.createPopper ?? window.createPopper;
    this.popperInstance = create(this.referenceEl, this.modalEl, {
      placement: this.placement,
      modifiers: [
        { name: "offset", options: { offset: this.offset } },
        { name: "preventOverflow", options: { boundary: "viewport" } },
      ],
    });
  }

  show() {
    this.triggerEl.classList.add("active");

    if (!this.popperInstance) {
      this._createPopper();
    }
    this.modalEl.style.display = "block";
    // update position if already created
    this.popperInstance.update();
  }

  hide() {
    this.triggerEl.classList.remove("active");
    this.modalEl.style.display = "none";
  }

  toggle() {
    if (this.modalEl.style.display === "block") {
      this.hide();
    } else {
      this.show();
    }
  }

  destroy() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
    this.modalEl.style.display = "";
    this.triggerEl.removeEventListener("click", this.toggle);
  }
}
