import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

class EmojiPickerTrigger {
  /**
   * @param {HTMLElement} triggerEl  – the button (or any element) that opens the picker
   * @param {Object} options
   * @param {Function} options.onEmojiSelect – callback receiving the chosen emoji
   * @param {String} [options.placement='bottom-start'] – popper placement
   */
  constructor(triggerEl, { onEmojiSelect, placement = "bottom-start" } = {}) {
    if (!(triggerEl instanceof HTMLElement)) {
      throw new Error("EmojiPickerTrigger needs a DOM element as trigger");
    }
    this.triggerEl = triggerEl;
    this.onEmojiSelect = onEmojiSelect || (() => {});
    this.placement = placement;

    // create the hidden picker element
    this.picker = document.createElement("emoji-picker");
    this.picker.style.position = "absolute";
    this.picker.style.zIndex = "9999";
    this.picker.hidden = true;
    document.body.appendChild(this.picker);

    // popper instance
    this.popperInstance = null;

    // event listeners
    this._bindEvents();
  }

  _bindEvents() {
    // toggle visibility on trigger click
    this.triggerEl.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // emit when an emoji is selected
    this.picker.addEventListener("emoji-click", (event) => {
      const { emoji } = event.detail;
      this.onEmojiSelect(emoji);
      this.hide();
    });

    // hide if clicking outside
    document.addEventListener("click", (e) => {
      if (!this.picker.contains(e.target) && !this.triggerEl.contains(e.target)) {
        this.hide();
      }
    });
  }

  show() {
    if (this.picker.hidden) {
      this.picker.hidden = false;

      // create or update popper
      if (!this.popperInstance) {
        this.popperInstance = Popper.createPopper(this.triggerEl, this.picker, { placement: this.placement, modifiers: [{ name: "offset", options: { offset: [0, 15] } }] });
      } else {
        this.popperInstance.update();
      }
    }
  }

  hide() {
    if (!this.picker.hidden) {
      this.picker.hidden = true;
    }
  }

  toggle() {
    this.picker.hidden ? this.show() : this.hide();
  }

  destroy() {
    this.hide();
    this.popperInstance?.destroy();
    this.picker.remove();
    // remove listeners if you want to clean up further...
  }
}

window.EmojiPickerTrigger = EmojiPickerTrigger;
