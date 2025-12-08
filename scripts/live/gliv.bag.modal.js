/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

const userGifts = [
  {
    id: 1,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-1.png",
    amount: 20,
  },

  {
    id: 2,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-2.png",
    amount: 20,
  },

  {
    id: 3,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-3.png",
    amount: 20,
  },

  {
    id: 4,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-4.png",
    amount: 20,
  },

  {
    id: 5,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-5.png",
    amount: 20,
  },

  {
    id: 6,
    name: "Gift Hurray Cup",
    image: "./images/lives/bag-6.png",
    amount: 20,
  },
];

class GlivBagModal {
  constructor() {
    this.triggerBtn = document.querySelector(".sg_live_wallet_gift");
    this.overlay = document.querySelector(".gift_modal_overlay");
    this.modal = this.overlay.querySelector(".gift-modal");
    this.popper = null;
    this.isVisible = false;
    this.justOpened = false; // Prevent immediate close after open

    // this.addMoreGiftsBtn = document.getElementById("addMoreGifts");
    this.emptyGiftContainer = document.getElementById("emptyGiftContainer");
    this.gridGiftContainer = document.getElementById("gridGiftContainer");
    this.showAddGiftModal = document.querySelectorAll(".show_add_gift_modal");
    this.streamSendGiftsModal = document.querySelector(".stream_send_gifts_modal");
    this.giftsSelectionGrid = document.getElementById("giftsSelectionGrid");
    this.sendGiftActions = this.streamSendGiftsModal.querySelectorAll(".gift_main_actions .send_gift");

    this.giftsStatusContainer = document.getElementById("giftsStatusContainer");
    this.giftSuccessSentContainer = document.getElementById("giftSuccessSentContainer");
    this.giftFailSentContainer = document.getElementById("giftFailSentContainer");
    this.giftNotEnoughSentContainer = document.getElementById("giftNotEnoughSentContainer");
    this.giftCancelBtn = document.getElementById("giftCancelBtn");
    this.giftSendBtn = document.getElementById("giftSendBtn");

    this.confettiInterval = null;

    this.init();
  }

  init() {
    this.renderGifts(userGifts);
    this.setupPopper();
    this.addEventListeners();
    window.bagModalInstance = this;
  }

  setupPopper() {
    this.popper = new PopperModal({
      triggerSelector: ".sg_live_wallet_gift",
      modalSelector: ".gift_modal_overlay",
    });
    this.overlay.style.display = "none";
  }

  addEventListeners() {
    this.triggerBtn.addEventListener("click", (e) => {
      // Prevent double open/close
      if (this.isVisible) return;
      this.showModal();
    });

    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.overlay.contains(e.target) && !this.triggerBtn.contains(e.target)) {
        if (this.justOpened) {
          this.justOpened = false;
          return;
        }
        this.hideModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (this.isVisible && e.key === "Escape") {
        this.hideModal();
      }
    });

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.hideModal();
      }
    });

    this.showAddGiftModal.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.streamSendGiftsModal.classList.remove(HIDDEN);
      });
    });

    this.streamSendGiftsModal.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target === this.streamSendGiftsModal) {
        this.streamSendGiftsModal.classList.add(HIDDEN);
      }
    });

    // Live Only Page Buy Gift Event :)
    this.giftsSelectionGrid.addEventListener("click", (e) => {
      const addMoreBags = e.target.closest(".add_more_bags");

      if (addMoreBags) {
        const giftsSelectionItem = addMoreBags.closest(".gifts_selection_item");
        const { bagItem } = giftsSelectionItem.dataset;

        // For stream Host page that doesn't yet have bag modal :)
        if (!userGifts) return;

        userGifts.push({
          id: userGifts.length + 1,
          name: bagItem.split("/").at(-1).split(".")[0].split("-").join(" "),
          image: bagItem,
          amount: 70,
        });

        this.renderGifts(userGifts);

        this._addBagConfetti();

        this.emptyGiftContainer.classList.add(HIDDEN);
        this.gridGiftContainer.classList.remove(HIDDEN);
        return;
      }
    });

    // Send gift
    // this.sendGiftActions.forEach((action) => {
    //   action.addEventListener("click", () => {});
    // });

    // Cancel Gift
    this.giftCancelBtn.addEventListener("click", () => {
      this.streamSendGiftsModal.classList.add(HIDDEN);
    });

    // Send Gift Again
    this.giftSendBtn.addEventListener("click", () => {
      this.giftsStatusContainer.classList.add(HIDDEN);
      this.giftSuccessSentContainer.classList.add(HIDDEN);
      this.giftsSelectionGrid.classList.remove(HIDDEN);
    });
  }

  _addBagConfetti() {
    clearInterval(this.confettiInterval);

    const c = document.getElementById("windowConfetti");
    c.style.display = "block";
    const confetti = new RectangleConfetti(c, { count: 500 });
    // fire once:
    confetti.start();
    // auto‑stop after ~5s:
    this.giftsSelectionGrid.classList.add(HIDDEN);
    this.giftsStatusContainer.classList.remove(HIDDEN);
    this.giftSuccessSentContainer.classList.remove(HIDDEN);
    this.confettiInterval = setInterval(() => confetti.stop(), 5000);
    setTimeout(() => (c.style.display = "none"), 5000);
  }

  showModal() {
    if (this.isVisible) return;
    this.isVisible = true;
    this.justOpened = true;
    setTimeout(() => {
      this.justOpened = false;
    }, 100); // Prevent immediate close
    this.overlay.style.display = "block";
    this.modal.classList.add("modal-anim-in");
    this.modal.classList.remove("modal-anim-out");
    if (this.popper && this.popper.popperInstance) {
      this.popper.popperInstance.update();
    } else if (this.popper && this.popper._createPopper) {
      this.popper._createPopper();
    }
  }

  hideModal() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.modal.classList.remove("modal-anim-in");
    this.modal.classList.add("modal-anim-out");
    this.modal.addEventListener(
      "animationend",
      () => {
        if (!this.isVisible) this.overlay.style.display = "none";
      },
      { once: true }
    );
  }

  renderGifts(bags) {
    const gridGiftContainer = document.querySelector("#gridGiftContainer");

    gridGiftContainer.innerHTML = "";
    bags.forEach((gift, index) => {
      const giftItem = document.createElement("div");
      giftItem.classList.add("gift-item");
      giftItem.setAttribute("role", "button");
      giftItem.setAttribute("tabindex", index);
      giftItem.innerHTML = `
        <div class="gift_item_coin">
          <img src="./icons/sg-coin.svg" alt="Sizemug Custom Coin" />
          <span>${gift.amount}</span>
        </div>
        <div class="gift-item__content">
          <img src="${gift.image}" alt="${gift.name}" />
          <h4>${gift.name}</h4>
          <span>${gift.amount}</span>
        </div>
      `;
      gridGiftContainer.appendChild(giftItem);
    });
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  window.bagModalInstance = new GlivBagModal();
});
