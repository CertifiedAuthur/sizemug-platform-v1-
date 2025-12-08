class CollaborationSendCoin {
  constructor({ hideSelector, modalSelector }) {
    this.hideSelector = document.querySelector(hideSelector);
    this.modalSelector = document.querySelector(modalSelector);
    this.sendCoinSelectionAmount = document.getElementById(
      "sendCoinSelectionAmount"
    );
    this.sendCoinAmount = document.getElementById("sendCoinAmount");

    this.coinAmounts = 0;
    this.modalInterval = null;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  hideModal() {
    this.modalSelector.classList.add("xo-hidden");
    this.coinAmounts = 0;
    this.sendCoinSelectionAmount
      .querySelectorAll(".coin-amount")
      .forEach((amount) => {
        amount.classList.remove("active");
      });
  }

  bindEvents() {
    // Hide modal events
    this.hideSelector.addEventListener("click", () => {
      this.hideModal();
    });

    this.modalSelector.addEventListener("click", (e) => {
      if (e.target.id === "sendCoinModal") {
        this.hideModal();
      }
    });

    // Coin amount selection
    this.sendCoinSelectionAmount.addEventListener("click", (e) => {
      const button = e.target.closest(".coin-amount");
      if (button) {
        this.coinAmounts = parseInt(button.dataset.amount);
        this.sendCoinSelectionAmount
          .querySelectorAll(".coin-amount")
          .forEach((amount) => {
            amount.classList.remove("active");
          });
        button.classList.add("active");
      }
    });

    // Send coin functionality
    this.sendCoinAmount.addEventListener("click", (e) => {
      clearTimeout(this.modalInterval);

      if (this.coinAmounts) {
        this.showConfirmationAnimation();
        this.hideModal();
      }
    });
  }

  showConfirmationAnimation() {
    const container = document.querySelector(".send-something-modal-wrapper");
    const sendSomethingModal = document.getElementById("sendSomethingModal");

    container.innerHTML = `
     <div class="fire-animation" ">
    <div class="fire-animation-text">
    <span class="collab-coin">Annette Black sent coins to the Collaboration</span>
    </div>
      <div class="item-1">
     <img class="coin" src="./icons//icon_coin_back.svg" alt="coin" />
      <img class="user-coin" src="./students/student--1.avif" />
       
      </div>
      </div>
    `;

    sendSomethingModal.classList.remove("xo-hidden");

    this.modalInterval = setTimeout(() => {
      sendSomethingModal.classList.add("xo-hidden");
    }, 3000);
  }
}

// Initialize for collaboration page
new CollaborationSendCoin({
  hideSelector: "#sendCoinCancel",
  modalSelector: "#sendCoinModal",
});
