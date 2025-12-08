import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

class LiveChatEmojiManager {
  constructor({ emojiSelector = "#emojiPickerBtn", modal = "#liveChatEmojiPickerModal", pickerContainerSelector = "#liveChatEmojiPickerContainer" } = {}) {
    this.emojiButton = document.querySelector(emojiSelector);
    this.pickerContainer = document.querySelector(pickerContainerSelector);
    this.modal = document.querySelector(modal);
    this.modalPopper = null;
    this.messageInput = document.getElementById("threadMessageInput");

    console.log("LiveChatEmojiManager initialized", {
      emojiButton: this.emojiButton,
      pickerContainer: this.pickerContainer,
      modal: this.modal,
      messageInput: this.messageInput,
    });

    this.handleEmojiClick = this.handleEmojiClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.init();
  }

  init() {
    this.bindEmojiClick();
    this.bindGlobalClick();
    this.initPickers();
  }

  bindEmojiClick() {
    if (this.emojiButton) {
      this.emojiButton.addEventListener("click", this.handleEmojiClick);
    }
  }

  handleEmojiClick(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("Emoji button clicked, showing modal");
    this.showEmojiModal(this.emojiButton);
  }

  bindGlobalClick() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  handleOutsideClick(e) {
    if (!e.target.closest(".live-chat-emoji-wrapper") && !e.target.closest("#emojiPickerBtn")) {
      if (this.modal) {
        this.modal.classList.add("live-chat-hidden");
      }
    }
  }

  initPickers() {
    const setup = () => this.createPicker(this.pickerContainer);

    if (customElements.get("emoji-picker")) {
      setup();
    } else {
      customElements.whenDefined("emoji-picker").then(setup);
    }
  }

  createPicker(container) {
    if (!container) return;

    const picker = document.createElement("emoji-picker");
    container.appendChild(picker);

    picker.addEventListener("emoji-click", (event) => {
      const emoji = event.detail.unicode;

      console.log("Emoji clicked:", emoji);

      if (this.messageInput) {
        // Get current cursor position
        const cursorPos = this.messageInput.selectionStart || this.messageInput.value.length;
        const currentValue = this.messageInput.value;

        // Insert emoji at cursor position
        const newValue = currentValue.slice(0, cursorPos) + emoji + currentValue.slice(cursorPos);
        this.messageInput.value = newValue;

        // Set cursor position after the emoji
        const newCursorPos = cursorPos + emoji.length;
        this.messageInput.setSelectionRange(newCursorPos, newCursorPos);

        // Focus back to input
        this.messageInput.focus();
      }

      // Hide picker after selection
      if (this.modal) {
        this.modal.classList.add("live-chat-hidden");
      }
    });
  }

  showEmojiModal(referenceBtn) {
    if (!this.modal || !referenceBtn) {
      console.log("Modal or reference button not found", { modal: this.modal, referenceBtn });
      return;
    }

    console.log("Showing emoji modal");
    this.modal.classList.remove("live-chat-hidden");

    // Destroy existing modal popper
    if (this.modalPopper) {
      this.modalPopper.destroy();
      this.modalPopper = null;
    }

    // Create new popper for modal positioning
    if (window.Popper) {
      console.log("Creating popper for positioning");
      this.modalPopper = Popper.createPopper(referenceBtn, this.modal, {
        placement: "top-end",
        modifiers: [
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    } else {
      console.log("Popper.js not available");
    }
  }
}

// Initialize emoji manager when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.liveChatEmojiManager = new LiveChatEmojiManager();
});

// Make it globally available
window.LiveChatEmojiManager = LiveChatEmojiManager;
