class StreamingOptionsDropdown {
  constructor() {
    this.dropdown = document.getElementById("streamingOptions");
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
    window.streamingOptionsDropdownInstance = this;
  }

  attachToButtons() {
    document.querySelectorAll(".co_host_options").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // e.stopPropagation();
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

// // Update global close function to include streaming options dropdown
// window.closeAllLiveModals = function () {
//   if (window.coinModalInstance) window.coinModalInstance.hide();
//   if (window.bagModalInstance) window.bagModalInstance.hideModal && window.bagModalInstance.hideModal();
//   if (window.boostModalInstance) window.boostModalInstance.hide && window.boostModalInstance.hide();
//   if (window.giftsModalInstance) window.giftsModalInstance.hide();
//   if (window.cameraModalInstance) window.cameraModalInstance.hide();
//   if (window.micModalInstance) window.micModalInstance.hide();
//   if (window.streamingOptionsDropdownInstance) window.streamingOptionsDropdownInstance.hide();
// };

document.addEventListener("DOMContentLoaded", () => {
  new StreamingOptionsDropdown();
});
