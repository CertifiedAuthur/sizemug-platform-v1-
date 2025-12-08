class GlivSettingModal {
  constructor() {
    this.streamSettingsModal = document.getElementById("streamSettingsModal");
    this.showStreamingSettings = document.getElementById("showStreamingSettings");
    this.allAsideButtons = document.querySelectorAll(".main_settings_container li");
    this.allsettingModalContainers = document.querySelectorAll(".setting_modal_containers");

    this.bindEvents();
  }
  bindEvents() {
    this.streamSettingsModal.addEventListener("click", (e) => {
      if (e.target.id === "streamSettingsModal") {
        return this.streamSettingsModal.classList.add(HIDDEN);
      }
    });

    this.showStreamingSettings.addEventListener("click", () => {
      this.streamSettingsModal.classList.remove(HIDDEN);
    });

    this.allAsideButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const { tab } = btn.dataset;

        if (tab) {
          const container = document.querySelector(`#${tab}SettingModalContainers`);

          this.allAsideButtons.forEach((b) => b.removeAttribute("data-active"));
          this.allsettingModalContainers.forEach((c) => c.classList.add(HIDDEN));

          btn.setAttribute("data-active", "");
          container.classList.remove(HIDDEN);
        }
      });
    });
  }
}

new GlivSettingModal();
