class CoinModal {
  constructor() {
    this.triggerBtn = document.querySelector(".sg_live_wallet_coin_balance");
    this.overlay = document.querySelector(".live_coin_modal_overlay");
    this.modal = this.overlay.querySelector(".live_coin_modal");
    this.popper = null;
    this.isVisible = false;
    this.justOpened = false;
    this.init();
  }

  init() {
    this.setupPopper();
    this.addEventListeners();
    // window.coinModalInstance = this;
  }

  setupPopper() {
    this.popper = new PopperModal({
      triggerSelector: ".sg_live_wallet_coin_balance",
      modalSelector: ".live_coin_modal_overlay",
    });
    this.overlay.classList.add(HIDDEN);
  }

  addEventListeners() {
    this.triggerBtn.addEventListener("click", (e) => {
      if (this.isVisible) {
        this.hideModal();
      } else {
        this.showModal();
      }
    });

    document.addEventListener("click", (e) => {
      // if (this.isVisible && !this.overlay.contains(e.target) && !this.triggerBtn.contains(e.target)) {
      if (!e.target.closest(".sg_live_wallet_coin_balance") && !e.target.closest(".live_coin_modal_overlay") && this.isVisible) {
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
  }

  showModal() {
    // window.closeAllLiveModals && window.closeAllLiveModals();
    if (this.isVisible) return;
    this.isVisible = true;
    this.justOpened = true;
    setTimeout(() => {
      this.justOpened = false;
    }, 100);
    this.overlay.classList.remove(HIDDEN);
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
        if (!this.isVisible) this.overlay.classList.add(HIDDEN);
      },
      { once: true }
    );
  }
}

new CoinModal();
// new GlivBagModal();
