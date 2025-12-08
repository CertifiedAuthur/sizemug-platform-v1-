class HeartSelectionModal {
  constructor() {
    this.button = document.getElementById("showHeartModalSelection");
    this.modal = document.querySelector(".stream_send_heart_modal");
    this.container = this.modal.querySelector(".stream_send_heart_modal_container");
    this.popperInstance = null;
    this.isVisible = false;

    this.emojiMap = {
      wave: "👋🏻",
      smile: "😊",
      heart: "🩷",
      boost: "🔥",
    };

    this.init();
  }

  init() {
    this.addEventListeners();

    this.modal.addEventListener("click", (e) => {
      const list = e.target.closest("li");
      if (!list) return;

      const emojiType = list.dataset.emojiType;
      // Trigger scaling burst animation
      scalingBurstManager.triggerScalingBurst(emojiType);
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
      if (!e.target.closest(".stream_send_heart_modal") && !e.target.closest("#showHeartModalSelection") && this.isVisible) {
        this.hide();
      }
    });
  }

  show() {
    // Close other modals first
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
    console.log("Hi");
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
}

document.addEventListener("DOMContentLoaded", () => {
  new HeartSelectionModal();
});
