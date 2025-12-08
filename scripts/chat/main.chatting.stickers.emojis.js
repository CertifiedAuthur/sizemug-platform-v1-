import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

class ChatEmojiManager {
  constructor({ stickerSelector = ".chatSelectStickers", modal = "#emojiPickerModal", pickerContainerSelector = "#emojiPickerContainer" } = {}) {
    this.stickerButtons = document.querySelectorAll(stickerSelector);
    this.pickerContainer = document.querySelector(pickerContainerSelector);
    this.modal = document.querySelector(modal);
    this.modalPopper = null;

    this.handleStickerClick = this.handleStickerClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

    this.init();
  }

  init() {
    this.bindStickerClicks();
    this.bindGlobalClick();
    this.initPickers();
    // this.handleEmojiClick();
  }

  bindStickerClicks() {
    this.stickerButtons.forEach((btn) => {
      btn.addEventListener("click", this.handleStickerClick);
    });
  }

  handleStickerClick(e) {
    const btn = e.currentTarget;
    const position = +btn.dataset.position;

    this.modal.classList.remove("modal");

    if ((currentMaxOpenedChat === 3 && [2, 3].includes(position)) || (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(position))) {
      this.showChattingEmojiModal(btn.closest(".chat_spacer_area").dataset.trackerId, "chatting-grid", btn, false);
      this.modal.classList.add("modal");
      return;
    }

    this.showChattingEmojiModal(btn.closest(".chat_spacer_area").dataset.trackerId, "chatting-grid", btn);
  }

  bindGlobalClick() {
    document.addEventListener("click", this.handleOutsideClick);
  }

  handleOutsideClick(e) {
    if (!e.target.closest(".chat-emoji-wrapper") && !e.target.closest(".show_select_manual_emoji")) {
      this.modal.classList.add(HIDDEN);
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
    const picker = document.createElement("emoji-picker");
    container.appendChild(picker);

    picker.addEventListener("emoji-click", (event) => {
      const openType = container.dataset.open;
      const emoji = event.detail.unicode;
      const input = document.querySelector(".chat-message-input");

      if (openType === "message-reaction") {
        handleMessagePositionedEmojiContainer(emoji);
        return;
      }

      console.log("Emoji clicked:", emoji);
      input.innerHTML += emoji; // Append emoji to the input
      // // Find the ACTIVE chat input
      // const activeChat = document.querySelector(".chat-container.active"); // Add active class to current chat
      // const input = activeChat?.querySelector(".chat-message-input");

      // if (input) {
      //   input.innerHTML += emoji;
      //   container.classList.add(this.HIDDEN); // Hide picker after selection
      // }
    });
  }

  showChattingEmojiModal(trackerId, identifier, referenceBtn, position = true) {
    if (!trackerId || !identifier || !referenceBtn) return;

    // Set attributes
    this.modal.setAttribute("data-tracker-id", trackerId);
    this.modal.setAttribute("data-identifier", identifier);
    this.modal.classList.remove(HIDDEN);

    // Destroy existing modal popper
    if (this.modalPopper) {
      this.modalPopper.destroy();
      this.modalPopper = null;
    }

    if (position) {
      // Create new popper for modal
      this.modalPopper = Popper.createPopper(referenceBtn, this.modal, {
        placement: "bottom-start",
        modifiers: [
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
  }
}

new ChatEmojiManager();
