/**
 * Reusable Link Modal Handler
 * Can be used by text, note, card, and other components
 */

class LinkModalHandler {
  constructor() {
    this.modal = document.getElementById("modalEditorLink");
    this.textInput = this.modal?.querySelector(".paper_add_link--text");
    this.urlInput = this.modal?.querySelector(".paper_add_link--url");
    this.applyButton = this.modal?.querySelector("#paper_add_link");
    this.closeButton = this.modal?.querySelector("#mobileHideLinkModalBtn");

    this.currentCallback = null;
    this.currentContext = null;

    this._init();
  }

  _init() {
    if (!this.modal) {
      console.warn("Link modal not found");
      return;
    }

    // Close button
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => {
        this.hide();
      });
    }

    // Apply button
    if (this.applyButton) {
      this.applyButton.addEventListener("click", () => {
        this._handleApply();
      });
    }

    // Close on overlay click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // Handle Enter key in inputs
    if (this.textInput) {
      this.textInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.urlInput?.focus();
        }
      });
    }

    if (this.urlInput) {
      this.urlInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this._handleApply();
        }
      });
    }
  }

  /**
   * Show the link modal
   * @param {Object} options - Configuration options
   * @param {string} options.text - Initial text value
   * @param {string} options.url - Initial URL value
   * @param {Function} options.onApply - Callback when link is applied
   * @param {any} options.context - Context to pass to callback
   */
  show(options = {}) {
    if (!this.modal) return;

    // Set initial values
    if (this.textInput) {
      this.textInput.value = options.text || "";
    }
    if (this.urlInput) {
      this.urlInput.value = options.url || "";
    }

    // Store callback and context
    this.currentCallback = options.onApply || null;
    this.currentContext = options.context || null;

    // Show modal
    this.modal.classList.remove("board--hidden");

    // Focus first input
    setTimeout(() => {
      if (this.textInput) {
        this.textInput.focus();
        this.textInput.select();
      }
    }, 100);
  }

  hide() {
    if (!this.modal) return;

    this.modal.classList.add("board--hidden");

    // Clear inputs
    if (this.textInput) this.textInput.value = "";
    if (this.urlInput) this.urlInput.value = "";

    // Clear callback
    this.currentCallback = null;
    this.currentContext = null;
  }

  _handleApply() {
    const text = this.textInput?.value.trim() || "";
    const url = this.urlInput?.value.trim() || "";

    // Validate
    if (!url) {
      alert("Please enter a URL");
      this.urlInput?.focus();
      return;
    }

    // Ensure URL has protocol
    let finalUrl = url;
    if (!url.match(/^https?:\/\//i)) {
      finalUrl = "https://" + url;
    }

    // Call callback if provided
    if (this.currentCallback) {
      this.currentCallback({
        text: text || finalUrl,
        url: finalUrl,
        context: this.currentContext,
      });
    }

    // Hide modal
    this.hide();
  }

  /**
   * Update an existing link
   * @param {string} text - Current link text
   * @param {string} url - Current link URL
   * @param {Function} onApply - Callback when updated
   * @param {any} context - Context to pass to callback
   */
  edit(text, url, onApply, context) {
    this.show({
      text,
      url,
      onApply,
      context,
    });
  }
}

// Create global instance
const linkModalHandler = new LinkModalHandler();

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = LinkModalHandler;
}
