// Camera and Mic Settings Modal Logic with Popper.js
// Assumes Popper.js v2 is available globally as Popper

class CameraSettingsModal {
  constructor() {
    this.button = document.getElementById("showPlatformCameraSetting");
    this.modal = document.getElementById("cameraSettingModal");
    if (!this.button || !this.modal) return;
    this.container = this.modal.querySelector(".cam_mic_modal_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.labelSpan = this.button.querySelector("span");
    this.init();
  }

  init() {
    this.addEventListeners();
    window.cameraModalInstance = this;
  }

  addEventListeners() {
    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    });
    // Hide modal when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.modal.contains(e.target) && e.target !== this.button) {
        this.hide();
      }
    });
    // Selection logic
    this.container.querySelectorAll("li[role='button']").forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectDevice(li);
      });
    });
  }

  selectDevice(selectedLi) {
    // Remove data-active from all
    this.container.querySelectorAll("li[role='button']").forEach((li) => {
      li.removeAttribute("data-active");
    });
    // Add data-active to selected
    selectedLi.setAttribute("data-active", "");
    // Update label on button
    const label = selectedLi.querySelector("span").textContent;
    if (this.labelSpan) this.labelSpan.textContent = label;
    // Hide modal
    this.hide();
  }

  show() {
    window.closeAllLiveModals && window.closeAllLiveModals();
    this.isVisible = true;
    this.modal.classList.remove("streamer-hidden");
    this.button.classList.add("active");
    this.button.setAttribute("data-activate", "");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(this.button, this.modal, {
      placement: "bottom-start",
      modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
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
        this.modal.classList.add("streamer-hidden");
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

class MicSettingsModal {
  constructor() {
    this.button = document.getElementById("showPlatformMicSetting");
    this.modal = document.getElementById("micSettingModal");
    if (!this.button || !this.modal) return;
    this.container = this.modal.querySelector(".cam_mic_modal_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.labelSpan = this.button.querySelector("span");
    this.init();
  }

  init() {
    this.addEventListeners();
    window.micModalInstance = this;
  }

  addEventListeners() {
    this.button.addEventListener("click", (e) => {
      // e.stopPropagation();
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    });
    // Hide modal when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.modal.contains(e.target) && e.target !== this.button) {
        this.hide();
      }
    });
    // Selection logic
    this.container.querySelectorAll("li[role='button']").forEach((li) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectDevice(li);
      });
    });
  }

  selectDevice(selectedLi) {
    // Remove data-active from all
    this.container.querySelectorAll("li[role='button']").forEach((li) => {
      li.removeAttribute("data-active");
    });
    // Add data-active to selected
    selectedLi.setAttribute("data-active", "");
    // Update label on button
    const label = selectedLi.querySelector("span").textContent;
    if (this.labelSpan) this.labelSpan.textContent = label;
    // Hide modal
    this.hide();
  }

  show() {
    window.closeAllLiveModals && window.closeAllLiveModals();
    this.isVisible = true;
    this.modal.classList.remove("streamer-hidden");
    this.button.classList.add("active");
    this.button.setAttribute("data-activate", "");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(this.button, this.modal, {
      placement: "bottom-start",
      modifiers: [
        { name: "offset", options: { offset: [0, 10] } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
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
        this.modal.classList.add("streamer-hidden");
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

// // Update global close function to include camera and mic modals
// window.closeAllLiveModals = function () {
//   if (window.coinModalInstance) window.coinModalInstance.hide();
//   if (window.bagModalInstance) window.bagModalInstance.hideModal && window.bagModalInstance.hideModal();
//   if (window.boostModalInstance) window.boostModalInstance.hide && window.boostModalInstance.hide();
//   if (window.giftsModalInstance) window.giftsModalInstance.hide();
//   if (window.cameraModalInstance) window.cameraModalInstance.hide();
//   if (window.micModalInstance) window.micModalInstance.hide();
// };

document.addEventListener("DOMContentLoaded", () => {
  new CameraSettingsModal();
  new MicSettingsModal();
  // Hide on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      window.closeAllLiveModals && window.closeAllLiveModals();
    }
  });
});
