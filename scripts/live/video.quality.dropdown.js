/**
 * Generic Dropdown class using Popper.js to position a shared dropdown menu
 * below any trigger, maintaining width, updating a target text, and supporting animations.
 */
class Dropdown {
  /**
   * @param {string} triggerSelector - selector for all toggles
   * @param {string} menuSelector    - selector for the single menu wrapper
   * @param {string} labelSelector   - selector inside trigger to update text
   * @param {Object} [options]       - optional Popper.js overrides
   */
  constructor(triggerSelector, menuSelector, labelSelector, options = {}) {
    this.triggers = Array.from(document.querySelectorAll(triggerSelector));
    this.wrapper = document.querySelector(menuSelector);
    this.labelSelector = labelSelector;

    if (!this.triggers.length || !this.wrapper) {
      // throw new Error("Triggers or dropdown menu wrapper not found");
      // Do not initialize if either is missing
      return;
    }
    // detect correct container class inside wrapper
    this.container = this.wrapper.querySelector(".sg-video-quality-dropdown-container, .sg-video-latency-dropdown-container, .sg-video-profanity-dropdown-container, .sg-video-visibility-dropdown-container, .sg-audio-quality-dropdown-container, .sg-custom-dropdown-search-container");
    if (!this.container) {
      throw new Error("Dropdown container element not found inside wrapper");
    }

    // Hide initially
    this.wrapper.removeAttribute("data-show");
    this.container.classList.add("modal-anim-out");

    this.activeTrigger = null;
    this._initPopper(options);
    this._bindTriggerEvents();
    this._bindOptionSelect();
  }

  _initPopper(options) {
    const sameWidth = {
      name: "sameWidth",
      enabled: true,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: ({ state }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
      },
      effect: ({ state }) => {
        const refWidth = state.elements.reference.offsetWidth;
        state.elements.popper.style.width = `${refWidth}px`;
      },
    };
    this.popperInstance = Popper.createPopper(this.triggers[0], this.wrapper, {
      placement: "bottom-start",
      modifiers: [sameWidth, { name: "offset", options: { offset: [0, 8] } }],
      ...options,
    });
  }

  _bindTriggerEvents() {
    this._outsideHandler = this._handleOutside.bind(this);
    document.addEventListener("click", this._outsideHandler);
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        this.activeTrigger = trigger;
        this.popperInstance.setOptions((opts) => ({ ...opts, reference: trigger }));
        this.toggle();
      });
    });
  }

  _bindOptionSelect() {
    this.wrapper.querySelectorAll('li[role="option"]').forEach((option) => {
      option.addEventListener("click", (e) => {
        e.stopImmediatePropagation();
        const value = option.textContent.trim();
        const span = this.activeTrigger.querySelector(this.labelSelector);
        if (span) span.textContent = value;
        this.wrapper.querySelectorAll("li").forEach((li) => li.setAttribute("aria-selected", "false"));
        option.setAttribute("aria-selected", "true");
        this.hide();
      });
    });
  }

  show() {
    this.wrapper.setAttribute("data-show", "");
    this.activeTrigger.setAttribute("aria-expanded", "true");
    this.container.classList.remove("modal-anim-out");
    this.container.classList.add("modal-anim-in");
    this.popperInstance.update();
    this.wrapper.classList.remove(HIDDEN);
  }

  hide() {
    this.activeTrigger.setAttribute("aria-expanded", "false");
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");
    const cleanup = () => {
      this.wrapper.removeAttribute("data-show");
      this.wrapper.classList.add(HIDDEN);
      this.container.removeEventListener("animationend", cleanup);
    };
    this.container.addEventListener("animationend", cleanup);
  }

  toggle() {
    if (this.wrapper.hasAttribute("data-show")) this.hide();
    else this.show();
  }

  _handleOutside(event) {
    if (!this.wrapper.hasAttribute("data-show")) return;
    const inTrigger = this.triggers.some((t) => t.contains(event.target));
    if (!inTrigger && !this.wrapper.contains(event.target)) {
      this.hide();
    }
  }

  destroy() {
    this.popperInstance.destroy();
    document.removeEventListener("click", this._outsideHandler);
    this.triggers.forEach((trigger) => trigger.replaceWith(trigger.cloneNode(true)));
  }
}

// Instantiate both dropdowns after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  new Dropdown(".select_stream_quality", "#sgVideoQualityDropdown", "#select_stream_quality");
  new Dropdown(".select_stream_latency", "#sgVideoLatencyDropdown", "#select_stream_latency");
  // new Dropdown(".select_stream_latency", "#sgVideoLatencyDropdown", "#select_stream_latency");
  new Dropdown(".select_stream_profanity", "#sgVideoProfanityDropdown", "#select_stream_profanity");
  new Dropdown(".select_room_profanity", "#sgVideoProfanityDropdown", "#select_room_profanity");
  new Dropdown(".select_stream_visibility", "#sgVideoVisibilityDropdown", "#select_stream_visibility");
  new Dropdown(".select_room_visibility", "#sgVideoVisibilityDropdown", "#select_room_visibility");
  new Dropdown(".select_room_quality", "#sgAudioQualityDropdown", "#select_room_quality");
  new Dropdown(".live_stream_category", "#startLiveStreamCategory", "#live_stream_category");
  new Dropdown(".live_room_category", "#startLiveStreamCategory", "#live_room_category");
  new Dropdown(".select_stream_chat_filter", "#sgStreamingChatFilterDropdown", "#select_stream_chat_filter");
  new Dropdown(".select_stream_select_language", "#sgStreamingLanguageDropdown", "#select_stream_select_language");
});
