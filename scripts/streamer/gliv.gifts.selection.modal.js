class GiftsSelectionModal {
  constructor() {
    this.button = document.getElementById("showGiftsModalSelection");
    this.modal = document.querySelector(".stream_send_gifts_modal");
    if (!this.button || !this.modal) return;
    this.container = this.modal.querySelector(".stream_send_gifts_modal_container");
    this.isVisible = false;
    this.popperInstance = null;

    //
    this.sendGiftActions = this.modal.querySelectorAll(".gift_main_actions .send_gift");
    this.giftsSelectionGrid = document.getElementById("giftsSelectionGrid");
    this.giftsStatusContainer = document.getElementById("giftsStatusContainer");
    this.giftSuccessSentContainer = document.getElementById("giftSuccessSentContainer");
    this.giftFailSentContainer = document.getElementById("giftFailSentContainer");
    this.giftNotEnoughSentContainer = document.getElementById("giftNotEnoughSentContainer");
    this.giftCancelBtn = document.getElementById("giftCancelBtn");
    this.giftSendBtn = document.getElementById("giftSendBtn");

    this.showAddGift = document.getElementById("showAddGift");

    this.init();
  }

  init() {
    this.addEventListeners();
    let confettiInterval = null;

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

        bagModalInstance.renderGifts(userGifts);
        return;
      }
    });

    // Send gift
    this.sendGiftActions.forEach((action) => {
      action.addEventListener("click", () => {
        clearInterval(confettiInterval);

        const c = document.getElementById("windowConfetti");
        c.style.display = "block";
        const confetti = new RectangleConfetti(c, { count: 500 });
        // fire once:
        confetti.start();
        spawnLiveStreamToast(toastTemplates[1]);
        // auto‑stop after ~5s:
        this.giftsSelectionGrid.classList.add(HIDDEN);
        this.giftsStatusContainer.classList.remove(HIDDEN);
        this.giftSuccessSentContainer.classList.remove(HIDDEN);
        confettiInterval = setInterval(() => confetti.stop(), 5000);
        setTimeout(() => (c.style.display = "none"), 5000);
      });
    });

    // Cancel
    this.giftCancelBtn.addEventListener("click", () => {
      this.hide();
    });

    // Send again
    this.giftSendBtn.addEventListener("click", () => {
      this.giftsStatusContainer.classList.add(HIDDEN);
      this.giftSuccessSentContainer.classList.add(HIDDEN);
      this.giftsSelectionGrid.classList.remove(HIDDEN);
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
      if (!e.target.closest(".stream_send_gifts_modal") && !e.target.closest("#showGiftsModalSelection") && this.isVisible) {
        this.hide();
      }
    });

    //
    this.showAddGift?.addEventListener("click", (e) => {
      e.stopPropagation();

      window.bagModalInstance?.hideModal();
      this.show();
    });
  }

  show() {
    // Close other modals first
    window.closeAllLiveModals && window.closeAllLiveModals();

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
    if (!this.isVisible) return;
    this.isVisible = false;
    this.button.classList.remove("active");
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");
    this.container.addEventListener(
      "animationend",
      () => {
        this.modal.classList.add(HIDDEN);
      },
      { once: true }
    );

    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new GiftsSelectionModal();
});
