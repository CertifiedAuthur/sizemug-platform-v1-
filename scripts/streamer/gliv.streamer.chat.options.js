class ChatHostOptionsDropdown {
  constructor() {
    this.dropdown = document.getElementById("chatHostOptions");
    if (!this.dropdown) return;
    this.container = this.dropdown.querySelector(".streaming_options_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.activeBtn = null;
    this.submenu = null;
    this.submenuVisible = false;
    this.kickFromStreamLi = null;
    this.muteInChatOptionLi = null;
    this.chevron = null;
    this.init();
  }

  init() {
    this.attachToButtons();
    this.addGlobalListeners();
    window.chatHostOptionsDropdownInstance = this;
  }

  attachToButtons() {
    document.querySelectorAll(".live_options").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.isVisible && this.activeBtn === btn) {
          this.hide();
        } else {
          this.show(btn);
        }
      });
    });

    // Attach submenu logic after DOMContentLoaded
    this.attachMuteSubmenu();
  }

  attachMuteSubmenu() {
    // Find the `mute_title` option
    this.kickFromStreamLi = this.container.querySelector("#kickFromStream .mute_title");
    this.muteInChatOptionLi = this.container.querySelector("#muteInChatOption .mute_title");

    if (!this.kickFromStreamLi && !this.muteInChatOptionLi) return;
    this.kickFromStreamSubmenu = this.container.querySelector("#kickFromStream .mute_submenu");
    this.muteInChatOptionSubmenu = this.container.querySelector("#muteInChatOption .mute_submenu");

    const hideKickDropdown = () => {
      this.kickFromStreamSubmenu.classList.add(HIDDEN);
      this.kickFromStreamLi.classList.remove("expanded");
    };
    const hideMuteDropdown = () => {
      this.muteInChatOptionSubmenu.classList.add(HIDDEN);
      this.muteInChatOptionLi.classList.remove("expanded");
    };
    const showKickDropdown = () => {
      this.kickFromStreamSubmenu.classList.remove(HIDDEN);
      this.kickFromStreamLi.classList.add("expanded");
    };
    const showMuteDropdown = () => {
      this.muteInChatOptionSubmenu.classList.remove(HIDDEN);
      this.muteInChatOptionLi.classList.add("expanded");
    };

    //
    this.kickFromStreamLi.addEventListener("click", () => {
      hideMuteDropdown();
      if (this.kickFromStreamSubmenu.classList.contains(HIDDEN)) {
        showKickDropdown();
      } else {
        hideKickDropdown();
      }
    });

    //
    this.muteInChatOptionLi.addEventListener("click", () => {
      hideKickDropdown();
      if (this.muteInChatOptionSubmenu.classList.contains(HIDDEN)) {
        showMuteDropdown();
      } else {
        hideMuteDropdown();
      }
    });
  }

  showSubmenu() {
    this.kickFromStreamSubmenu.classList.remove(HIDDEN);
    this.muteInChatOptionSubmenu.classList.remove(HIDDEN);
    this.submenuVisible = true;
    this.chevron.classList.add("expanded");
    // Update popper position to prevent jump
    if (this.popperInstance) this.popperInstance.update();
  }

  hideSubmenu() {
    if (!this.submenuVisible) return;
    this.kickFromStreamSubmenu.classList.add(HIDDEN);
    this.muteInChatOptionSubmenu.classList.add(HIDDEN);
    this.submenuVisible = false;
    if (this.chevron) this.chevron.classList.remove("expanded");
    // Update popper position to prevent jump
    if (this.popperInstance) this.popperInstance.update();
  }

  addGlobalListeners() {
    // Hide on outside click
    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.dropdown.contains(e.target) && (!this.activeBtn || !this.activeBtn.contains(e.target))) {
        this.hideSubmenu();
        this.hide();
      } else if (this.submenuVisible && this.submenu && !this.submenu.contains(e.target) && (!this.kickFromStreamLi || !this.kickFromStreamLi.contains(e.target)) && (!this.muteInChatOptionLi || !this.muteInChatOptionLi.contains(e.target))) {
        this.hideSubmenu();
      }
    });
    // Hide on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hideSubmenu();
        this.hide();
      }
    });
  }

  show(triggerBtn) {
    window.closeAllLiveModals && window.closeAllLiveModals();
    this.isVisible = true;
    this.activeBtn = triggerBtn;
    this.dropdown.classList.remove(HIDDEN);
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
    this.hideSubmenu(); // Always hide submenu when opening
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
        this.dropdown.classList.add(HIDDEN);
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
    this.hideSubmenu();
  }
}

// Update global close function to include chat host options dropdown
window.closeAllLiveModals = function () {
  // if (window.cameraModalInstance) window.cameraModalInstance.hide();
  // if (window.micModalInstance) window.micModalInstance.hide();
  // if (window.streamingOptionsDropdownInstance) window.streamingOptionsDropdownInstance.hide();
  // if (window.chatHostOptionsDropdownInstance) window.chatHostOptionsDropdownInstance.hide();
};

// Initialize chat host options dropdown after `displayLiveChatMessages()`
document.addEventListener("DOMContentLoaded", () => {
  // window.chatHostOptionsDropdownInstance = new ChatHostOptionsDropdown();
});
