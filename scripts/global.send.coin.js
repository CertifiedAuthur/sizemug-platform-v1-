class SendCoin {
  constructor({ triggerSelector, hideSelector, modalSelector }) {
    this.triggerSelector = document.querySelector(triggerSelector);
    this.hideSelector = document.querySelector(hideSelector);
    this.modalSelector = document.querySelector(modalSelector);
    this.sendCoinSelectionAmount = document.getElementById("sendCoinSelectionAmount");
    this.sendCoinAmount = document.getElementById("sendCoinAmount");
    this.sendCoinAndReaction = document.getElementById("sendCoinAndReaction");
    this.addCoinFooterButton = document.getElementById("addCoinFooterButton");

    this.sendCoinCount = 0;
    this.coinAmounts = 0;
    this.modalInterval = null;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  hideModal() {
    this.modalSelector.classList.add(HIDDEN);
    this.coinAmounts = 0;
    this.sendCoinCount = 0;
    this.sendCoinSelectionAmount.querySelectorAll(".coin-amount").forEach((amount) => {
      amount.classList.remove("active");
    });
  }

  bindEvents() {
    //
    this.triggerSelector?.addEventListener("click", () => {
      this.modalSelector.classList.remove(HIDDEN);
    });

    //
    this.hideSelector?.addEventListener("click", () => {
      this.hideModal();
    });

    // sendCoinModal click
    this.modalSelector?.addEventListener("click", (e) => {
      if (e.target.id === "sendCoinModal") {
        this.hideModal();
      }
    });

    //
    this.sendCoinSelectionAmount?.addEventListener("click", (e) => {
      const button = e.target.closest(".coin-amount");

      if (button) {
        this.coinAmounts = parseInt(button.dataset.amount);

        this.sendCoinSelectionAmount.querySelectorAll(".coin-amount").forEach((amount) => {
          amount.classList.remove("active");
        });
        button.classList.add("active");
      }
    });

    // chat page
    this.sendCoinAmount?.addEventListener("click", (e) => {
      clearTimeout(this.modalInterval);

      if (this.coinAmounts) {
        const messageSender = new ChatMessageSender();

        this.sendCoinCount = this.sendCoinCount + 1;

        messageSender.sendMessage({
          content: this.coinAmounts,
          currentOpenedUser,
          currentChattingInfo,
          taggedData: {},
          liveChatGameInfo: {
            type: "coin",
            amount: this.coinAmounts,
            count: this.sendCoinCount,
          },
        });

        const container = document.querySelector(".send-something-modal-wrapper");
        const sendSomethingModal = document.getElementById("sendSomethingModal");

        container.innerHTML = "";
        Array.from({ length: this.sendCoinCount }).forEach((_, index) => {
          const markup = `
            <div class="item-${index > 1 ? 2 : 1}">
              <img src="./images/chat/icons/big_coin.svg" alt="coin" />
              <span>${this.coinAmounts}</span>
            </div>
          `;

          container.insertAdjacentHTML("beforeend", markup);
        });

        sendSomethingModal.classList.remove(HIDDEN);

        this.modalInterval = setTimeout(() => {
          sendSomethingModal.classList.add(HIDDEN);
        }, 2000);
      }
    });

    // live page
    this.sendCoinAndReaction?.addEventListener("click", (e) => {
      console.log("sendCoinAndReaction");

      // assume each button is an LI with data-reaction
      const btn = e.target.closest("[data-reaction]");
      if (!btn) return;

      if (this.coinAmounts && this.coinAmounts > 20) {
        this.modalSelector.querySelector("footer").classList.add(HIDDEN);
        this.modalSelector.querySelector(".add__coin").classList.remove(HIDDEN);
        return;
      }

      const type = btn.dataset.reaction;
      const streamShow = document.getElementById("streamShow");

      const id = Math.random().toString(36).slice(2);
      const markup = this._template(type, id);
      streamShow.insertAdjacentHTML("beforeend", markup);
      this.modalSelector.classList.add(HIDDEN);

      setTimeout(() => {
        const el = streamShow.querySelector(`.animating_reaction--${id}`);
        if (el) el.remove();
      }, 6000);
    });

    this.addCoinFooterButton?.addEventListener("click", () => {
      const addCoinModalContainer = document.getElementById("addCoinModalContainer");

      this.modalSelector.querySelector(".add__coin").classList.add(HIDDEN);
      this.modalSelector.querySelector("footer").classList.remove(HIDDEN);
      this.modalSelector.classList.add(HIDDEN);

      addCoinModalContainer.classList.remove(HIDDEN);
    });

    const addCoinSelectionAmount = document.getElementById("addCoinSelectionAmount");
    const addCoinPayment = document.getElementById("addCoinPayment");
    const addCoinPaymentDetails = document.getElementById("addCoinPaymentDetails");

    // cancel coin option payment
    const cancelCoinOptionPayment = document.getElementById("cancelCoinOptionPayment");
    cancelCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);
    });

    // back to coin option payment
    const backToCoinOptionPayment = document.getElementById("backToCoinOptionPayment");
    backToCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
    });

    const backToCoinPayment = document.getElementById("backToCoinPayment");
    backToCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      addCoinPayment.classList.remove(HIDDEN);
    });

    // next to coin option payment
    const nextToCoinOptionPayment = document.getElementById("nextToCoinOptionPayment");
    nextToCoinOptionPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      addCoinPayment.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    const nextToCoinPayment = document.getElementById("nextToCoinPayment");

    nextToCoinPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);

      addCoinPaymentDetails.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    // pay final coin payment
    const payFinalCoinPayment = document.getElementById("payFinalCoinPayment");
    payFinalCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);
    });
  }

  _template(reaction, id) {
    return `
      <div class="animating_reaction animating_reaction--${id}">
        <div style="position: relative">
          <div class="description">
            <span>Rafeal Richi</span> sent coins to the broadcast
          </div>
          <div class="reaction_type">
            <img src="./images/${reaction}.svg" alt="${reaction}" />
            <div>
              <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60" alt="avatar" />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

new SendCoin({
  triggerSelector: "#showAddCoin",
  hideSelector: "#sendCoinCancel",
  modalSelector: "#sendCoinModal",
});
