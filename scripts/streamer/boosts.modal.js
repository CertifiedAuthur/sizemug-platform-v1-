class BoostsModal {
  constructor() {
    this.button = document.getElementById("boostModalContainer");
    this.modal = document.getElementById("boostsModal");
    this.container = this.modal.querySelector(".boosts_modal_container");
    this.popperInstance = null;
    this.isVisible = false;

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
      if (!e.target.closest("#boostsModal") && !e.target.closest("#boostModalContainer") && this.isVisible) {
        this.hide();
      }
    });

    // Add to global modal management
    window.boostModalInstance = this;
  }

  show() {
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
    console.log("Close :)");
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
  new BoostsModal();
});
