class StorySidebar {
  constructor() {
    this.currentView = "stories"; // 'stories', 'settings', 'setting-detail'
    this.activeSettingCategory = "";

    // Settings state - will be managed through data attributes
    this.settings = {};

    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSettingsFromDataAttributes();
  }

  bindEvents() {
    // Settings button
    document.getElementById("settingsBtn")?.addEventListener("click", () => {
      this.showSettings();
    });

    // Back buttons
    document.getElementById("backToStories")?.addEventListener("click", () => {
      this.showStories();
    });

    document.getElementById("backToSettings")?.addEventListener("click", () => {
      this.showSettings();
    });

    // Setting options
    document.querySelectorAll(".setting-option").forEach((option) => {
      option.addEventListener("click", () => {
        const settingType = option.dataset.setting;
        const title = option.dataset.title;
        this.showSettingDetail(settingType, title);
      });
    });

    // Bind setting controls
    this.bindSettingControls();
  }

  bindSettingControls() {
    // Toggle switches
    document
      .querySelectorAll(".toggle-switch[data-setting-key]")
      .forEach((toggle) => {
        toggle.addEventListener("click", () => {
          const key = toggle.dataset.settingKey;
          const currentValue = toggle.classList.contains("active");
          const newValue = !currentValue;

          this.updateSetting(key, newValue);
          toggle.classList.toggle("active", newValue);
        });
      });

    // Select dropdowns
    document
      .querySelectorAll(".setting-select[data-setting-key]")
      .forEach((select) => {
        select.addEventListener("change", (e) => {
          const key = select.dataset.settingKey;
          this.updateSetting(key, e.target.value);
        });
      });
  }

  loadSettingsFromDataAttributes() {
    // Load default values from data attributes
    document.querySelectorAll("[data-setting-key]").forEach((element) => {
      const key = element.dataset.settingKey;
      const defaultValue = element.dataset.default;

      if (defaultValue !== undefined) {
        this.setNestedSetting(key, this.parseValue(defaultValue));
      }
    });
  }

  parseValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (!isNaN(value) && value !== "") return Number(value);
    return value;
  }

  setNestedSetting(path, value) {
    const keys = path.split(".");
    let current = this.settings;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
  }

  updateSetting(path, value) {
    this.setNestedSetting(path, value);
    console.log("Settings updated:", this.settings);

    // You can add localStorage or API calls here
    // localStorage.setItem('storySettings', JSON.stringify(this.settings));
  }

  showStories() {
    document.getElementById("storyView")?.classList.remove(HIDDEN);
    document.getElementById("settingsView")?.classList.add(HIDDEN);
    document.getElementById("settingDetailView")?.classList.add(HIDDEN);
    this.currentView = "stories";
  }

  showSettings() {
    document.getElementById("storyView")?.classList.add(HIDDEN);
    document.getElementById("settingsView")?.classList.remove(HIDDEN);
    document.getElementById("settingDetailView")?.classList.add(HIDDEN);
    this.currentView = "settings";
  }

  showSettingDetail(settingType, title) {
    document.getElementById("settingsView")?.classList.add(HIDDEN);
    document.getElementById("settingDetailView")?.classList.remove(HIDDEN);
    this.activeSettingCategory = settingType;
    this.currentView = "setting-detail";

    // Update title
    const titleElement = document.getElementById("settingDetailTitle");
    if (titleElement) {
      titleElement.textContent = title || "Setting";
    }

    // Show the correct setting panel
    this.showSettingPanel(settingType);
  }

  showSettingPanel(settingType) {
    // Hide all panels
    document.querySelectorAll(".setting-content-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    // Show the selected panel
    const targetPanel = document.querySelector(
      `[data-setting-panel="${settingType}"]`
    );
    if (targetPanel) {
      targetPanel.classList.add("active");
    }
  }

  filterStories(type, query) {
    const selector =
      type === "all" ? "#allStoriesList .story-item" : ".my-story-item";
    const items = document.querySelectorAll(selector);

    items.forEach((item) => {
      const nameElement = item.querySelector("h4, .my-story-name");
      const name = nameElement ? nameElement.textContent.toLowerCase() : "";
      const matches = name.includes(query.toLowerCase());

      item.style.display = matches ? "flex" : "none";
    });
  }

  // Method to get current settings (useful for API calls)
  getSettings() {
    return this.settings;
  }

  // Method to load settings from external source
  loadSettings(settingsData) {
    this.settings = settingsData;
    this.applySettingsToUI();
  }

  applySettingsToUI() {
    // Apply settings to UI elements
    document.querySelectorAll("[data-setting-key]").forEach((element) => {
      const key = element.dataset.settingKey;
      const value = this.getNestedSetting(key);

      if (element.classList.contains("toggle-switch")) {
        element.classList.toggle("active", value);
      } else if (element.tagName === "SELECT") {
        element.value = value;
      }
    });
  }

  getNestedSetting(path) {
    const keys = path.split(".");
    let current = this.settings;

    for (const key of keys) {
      if (current && current.hasOwnProperty(key)) {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return current;
  }
}

// Initialize the sidebar when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new StorySidebar();
});
