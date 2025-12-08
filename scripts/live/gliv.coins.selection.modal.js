class CoinsSelectionModal {
  constructor() {
    this.button = document.getElementById("showCoinsModalSelection");
    this.modal = document.querySelector(".stream_send_coins_modal");
    this.container = this.modal.querySelector(".stream_send_coins_modal_container");
    this.popperInstance = null;
    this.isVisible = false;
    this.selectedAmount = 20; // Default selected amount

    this.coinsSelectionGrid = document.getElementById("coinsSelectionGrid");
    this.coinSuccessSentContainer = document.getElementById("coinSuccessSentContainer");
    this.coinFailSentContainer = document.getElementById("coinFailSentContainer");
    this.coinNotEnoughSentContainer = document.getElementById("coinNotEnoughSentContainer");
    this.coinCancelBtn = document.getElementById("coinCancelBtn");
    this.coinSendBtn = document.getElementById("coinSendBtn");

    this.confettiInterval = null;
    this.sendAction = false;

    this.init();
  }

  init() {
    this.addEventListeners();
    this.setupCoinSelection();
    // window.coinModalInstance = this;

    // Send gift
    this.coinSendBtn.addEventListener("click", (e) => {
      e.stopImmediatePropagation();

      if (this.sendAction) {
        this.coinSendBtn.textContent = "Send";
        this.sendAction = false;
        this.coinSuccessSentContainer.classList.add(HIDDEN);
        this.coinFailSentContainer.classList.add(HIDDEN);
        this.coinNotEnoughSentContainer.classList.add(HIDDEN);
        this.coinsSelectionGrid.classList.remove(HIDDEN);

        return;
      }

      clearInterval(this.confettiInterval);

      this.coinSendBtn.textContent = "Send Again";

      const c = document.getElementById("windowConfetti");
      c.style.display = "block";
      const confetti = new RectangleConfetti(c, { count: 500 });
      // fire once:
      confetti.start();
      spawnLiveStreamToast(toastTemplates[0]);
      // auto‑stop after ~5s:
      this.coinsSelectionGrid.classList.add(HIDDEN);
      this.coinSuccessSentContainer.classList.remove(HIDDEN);
      this.confettiInterval = setInterval(() => confetti.stop(), 5000);
      setTimeout(() => (c.style.display = "none"), 5000);
      this.sendAction = true;
    });

    // Cancel
    this.coinCancelBtn.addEventListener("click", () => {
      this.hide();
    });
  }

  addEventListeners() {
    this.button.addEventListener("click", (e) => {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    });

    // Hide modal when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".stream_send_coins_modal") && !e.target.closest("#showCoinsModalSelection") && this.isVisible) {
        this.hide();
      }
    });
  }

  setupCoinSelection() {
    const coinItems = this.modal.querySelectorAll(".coins_grid_item_wrapper");

    coinItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Remove active class from all items
        coinItems.forEach((i) => i.classList.remove("active"));
        // Add active class to clicked item
        item.classList.add("active");
        // Update selected amount
        const amountSpan = item.querySelector("span");
        this.selectedAmount = parseInt(amountSpan.textContent);
      });
    });
  }

  show() {
    // Close other modals first
    // window.closeAllLiveModals && window.closeAllLiveModals();

    this.isVisible = true;
    this.modal.classList.remove(HIDDEN);
    this.button.classList.add("active");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");

    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(this.button, this.modal, {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 10] },
        },
        {
          name: "computeStyles",
          options: { gpuAcceleration: false },
        },
      ],
    });
  }

  hide() {
    this.isVisible = false;
    this.modal.classList.add(HIDDEN);
    this.button.classList.remove("active");
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");

    this.container.addEventListener(
      "animationend",
      () => {
        if (this.modal.classList.contains(HIDDEN)) {
          // Animation completed, modal is hidden
        }
      },
      { once: true }
    );

    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  selectReceiver() {
    // Handle receiver selection logic
    // You can implement a user picker here
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CoinsSelectionModal();
});
