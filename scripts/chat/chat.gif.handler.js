class GifHandler {
  constructor() {
    this.gifModal = document.getElementById("gifModal");
    this.gifModalOpenBtn = document.querySelectorAll(".chat-git-footer-button");
    this.gifModalContainer = document.getElementById("gifModalContainer");
    this.popperInstance = null;
    this.gifItems = document.querySelectorAll(".gif-item");

    this.init();
  }

  init() {
    this.gifModalOpenBtn.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const position = btn.dataset.position;

        // Show the modal
        this.gifModal.classList.remove(HIDDEN);

        if (
          (currentMaxOpenedChat === 3 && [2, 3].includes(+position)) ||
          (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(+position))
        ) {
          this.gifModal.classList.add("modal");
          return;
        }

        this.gifModal.classList.remove("modal");

        // If an existing Popper instance exists, destroy it
        if (this.popperInstance) {
          this.popperInstance.destroy();
        }

        // Create a new Popper instance, positioning modal relative to the clicked button
        this.popperInstance = Popper.createPopper(btn, this.gifModal, {
          placement: "bottom-start",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 15], // 8px spacing from the button
              },
            },
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
              },
            },
          ],
        });
      });
    });

    // Hide the modal when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.gifModalContainer.contains(e.target) &&
        ![...this.gifModalOpenBtn].some((btn) => btn.contains(e.target))
      ) {
        this.hideModal();
      }
    });

    this.gifItems.forEach((gifItem) => {
      gifItem.addEventListener("click", (e) => {
        const gifImg = gifItem.querySelector("img");
        const gifUrl = gifImg.getAttribute("src");
        const chatInput = document.querySelector(".chat-message-input");
        const chattingContainerMessage = document.querySelector(
          ".chatting_container_message"
        );
        console.log("am giffffff");

        // Insert the GIF URL into the chat input

        if (gifUrl) {
          chattingContainerMessage.innerHTML += `<img src="${gifUrl}" alt="GIF" style="width: 15rem; height: 15rem;"/>`;
        }
        // Hide the modal after selecting a GIF
        this.hideModal();
      });
    });
    this.gifModal.addEventListener("click", (e) => {
      // Prevent click events from propagating to the document
      e.stopPropagation();
    });
    this.gifModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideModal();
      }
    });
    this.gifModalContainer.addEventListener("click", (e) => {
      // Prevent click events from propagating to the document
      e.stopPropagation();
    });
  }

  hideModal() {
    this.gifModal.classList.remove("modal");
    this.gifModal.classList.add(HIDDEN);
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

// Initialize
new GifHandler();
