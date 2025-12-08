class AudioHostOptions {
  constructor() {
    this.dropdown = document.getElementById("audioHostOptions");
    if (!this.dropdown) return;
    this.container = this.dropdown.querySelector(".streaming_options_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.activeBtn = null;
    this.init();
  }

  init() {
    this.attachToButtons();
    this.attachListEvents();
    this.addGlobalListeners();
  }

  attachToButtons() {
    const buttons = document.querySelectorAll(".room-host-item .profile_circle_container button");
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.show(e.target);
      });
    });
  }

  attachListEvents() {
    this.container.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        this.hide();
      }
    });
  }

  addGlobalListeners() {
    document.addEventListener("click", (e) => {
      if (e.target.closest(".streaming_options")) {
        this.hide();
      }
    });
  }

  show(triggerBtn) {
    this.activeBtn = triggerBtn;
    this.isVisible = true;
    this.dropdown.classList.remove("streamer-hidden");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(triggerBtn, this.dropdown, {
      placement: "bottom-start",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
      ],
    });
  }

  hide() {
    this.isVisible = false;
    this.dropdown.classList.add("streamer-hidden");
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

new AudioHostOptions();