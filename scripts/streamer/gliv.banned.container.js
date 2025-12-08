class BannedOptionsDropdown {
  constructor() {
    this.dropdown = document.getElementById("bannedOptions");
    this.showBannedUsers = document.getElementById("showBannedUsers");
    this.bannedBack = document.getElementById("bannedBack");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.asideBannedSlider = document.getElementById("asideBannedSlider");

    if (!this.dropdown) return;
    this.container = this.dropdown.querySelector(".streaming_options_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.activeBtn = null;
    this.init();
  }

  init() {
    this.attachToButtons();
    this.addGlobalListeners();

    //
    this.showBannedUsers.addEventListener("click", () => {
      console.log("Show Banner Container :)");
      this.asideChatSlider.classList.add(HIDDEN);
      this.asideBannedSlider.classList.remove(HIDDEN);
    });

    //
    this.bannedBack.addEventListener("click", () => {
      this.asideBannedSlider.classList.add(HIDDEN);
      this.asideChatSlider.classList.remove(HIDDEN);
    });

    //
    window.bannedOptionsDropdownInstance = this;
  }

  attachToButtons() {
    document.querySelectorAll(".banned_options").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.isVisible && this.activeBtn === btn) {
          this.hide();
        } else {
          this.show(btn);
        }
      });
    });
  }

  addGlobalListeners() {
    // Hide on outside click
    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.dropdown.contains(e.target) && (!this.activeBtn || !this.activeBtn.contains(e.target))) {
        this.hide();
      }
    });
    // Hide on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hide();
      }
    });
  }

  show(triggerBtn) {
    window.closeAllLiveModals && window.closeAllLiveModals();
    this.isVisible = true;
    this.activeBtn = triggerBtn;
    this.dropdown.classList.remove("streamer-hidden");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(triggerBtn, this.dropdown, {
      placement: "bottom-end",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
      ],
    });
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.activeBtn = null;
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");
    this.container.addEventListener(
      "animationend",
      () => {
        this.dropdown.classList.add("streamer-hidden");
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

// Patch global closeAllLiveModals to include banned options dropdown
(function () {
  const prevCloseAllLiveModals = window.closeAllLiveModals;
  window.closeAllLiveModals = function () {
    if (prevCloseAllLiveModals) prevCloseAllLiveModals();
    if (window.bannedOptionsDropdownInstance) window.bannedOptionsDropdownInstance.hide();
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  new BannedOptionsDropdown();
});
