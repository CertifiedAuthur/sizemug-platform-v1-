class TextStoryInterface {
  constructor() {
    this.currentPanel = "main";
    this.isTransitioning = false;
    this.textFormatting = {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#ffffff",
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    };

    this.textOnlySelectCustomColor = document.getElementById("textOnlySelectCustomColor");

    this.initializeEventListeners();
    this.updatePreview();
  }

  initializeEventListeners() {
    // Show
    document.querySelectorAll("[data-text-panel-button]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.dataset.textPanelButton;
        if (!panel) new Error(`No panel found for ${btn}`);

        this.switchSidebarPanel(panel);
      });
    });

    // Back
    document.querySelectorAll("[data-text-panel-back]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const panel = btn.dataset.textPanelBack;
        this.switchSidebarPanel(panel, false);
      });
    });

    // Close button - this will hide the text story interface and show story options
    const closeTextStory = document.getElementById("closeTextStoryModal");
    closeTextStory.addEventListener("click", (e) => {
      const container = document.getElementById("text-story-interface");
      const uploadInterface = document.getElementById("upload-interface");

      container.classList.remove("active");
      container.style.opacity = 0;

      uploadInterface.classList.add("active");
      uploadInterface.style.opacity = 1;
    });

    // Text formatting
    this.initializeFormatting();

    // Text input
    const textInput = document.getElementById("story-text-input");
    if (textInput) {
      textInput.addEventListener("input", (e) => {
        this.updatePreview(e.target.value);
      });
    }

    // Font size slider
    const fontSizeSlider = document.getElementById("font-size-slider");
    if (fontSizeSlider) {
      fontSizeSlider.addEventListener("input", (e) => {
        this.textFormatting.fontSize = Number.parseInt(e.target.value);
        this.updatePreview();
      });
    }

    // Settings controls
    this.initializeSettings();

    // Delete and Add to Stories buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this text story?")) {
          this.deleteStory();
        }
      });
    });

    document.querySelectorAll(".add-story-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.addToStories();
      });
    });

    const textStoryCustomColorPicker = document.getElementById("text-story-custom-color-picker");
    const textCanvasStoryColorPicker = document.getElementById("textCanvasStoryColorPicker");
    const storyCanvas = document.getElementById("story-canvas");
    textCanvasStoryColorPicker.addEventListener("click", () => {
      textStoryCustomColorPicker.click();
      console.log("am clickedd");
    });
    textStoryCustomColorPicker?.addEventListener("change", (e) => {
      const customColor = e.target.value;
      storyCanvas.style.background = customColor;
    });
  }

  initializeFormatting() {
    // Format buttons
    document.querySelectorAll(".format-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const format = e.currentTarget.dataset.format;
        this.handleFormatting(format, btn);
      });
    });

    // Font options
    document.querySelectorAll(".font-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        document.querySelectorAll(".font-option").forEach((o) => o.classList.remove("active"));
        e.currentTarget.classList.add("active");

        this.textFormatting.fontFamily = e.currentTarget.dataset.font;
        this.updatePreview();
        this.hideFormatOptions();
      });
    });

    // Color options
    document.querySelectorAll(".color-option").forEach((color) => {
      color.addEventListener("click", (e) => {
        document.querySelectorAll(".color-option").forEach((c) => c.classList.remove("selected"));
        e.currentTarget.classList.add("selected");

        this.textFormatting.color = e.currentTarget.dataset.color;
        this.updatePreview();
        this.hideFormatOptions();
      });
    });

    //
    const textInputColor = this.textOnlySelectCustomColor.querySelector('input[type="color"]');
    this.textOnlySelectCustomColor.addEventListener("click", () => {
      textInputColor.click();
    });
    if (textInputColor) {
      textInputColor.addEventListener("input", (e) => {
        const value = e.currentTarget.value;
        this.textFormatting.color = value;
        // update UI / apply formatting here
        this.updatePreview();
      });
    }

    // Hide format options when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".formatting-section")) {
        this.hideFormatOptions();
      }
    });
  }

  //
  handleFormatting(format, btn) {
    switch (format) {
      case "font-family":
        this.toggleFormatOption("textStoryFontFamilyOptions");
        break;
      case "color":
        this.toggleFormatOption("textStoryColorPicker");
        break;
      case "bold":
        this.textFormatting.bold = !this.textFormatting.bold;
        btn.classList.toggle("active", this.textFormatting.bold);
        this.updatePreview();
        break;
      case "italic":
        this.textFormatting.italic = !this.textFormatting.italic;
        btn.classList.toggle("active", this.textFormatting.italic);
        this.updatePreview();
        break;
      case "underline":
        this.textFormatting.underline = !this.textFormatting.underline;
        btn.classList.toggle("active", this.textFormatting.underline);
        this.updatePreview();
        break;
      case "strikethrough":
        this.textFormatting.strikethrough = !this.textFormatting.strikethrough;
        btn.classList.toggle("active", this.textFormatting.strikethrough);
        this.updatePreview();
        break;
    }
  }

  toggleFormatOption(optionId) {
    // Hide all format options first
    this.hideFormatOptions();

    // Show the requested option
    const option = document.getElementById(optionId);
    if (option) {
      option.classList.remove(HIDDEN);
    }
  }

  hideFormatOptions() {
    const fontOptions = document.getElementById("textStoryFontFamilyOptions");
    const textStoryColorPicker = document.getElementById("textStoryColorPicker");

    if (fontOptions) fontOptions.classList.add(HIDDEN);
    if (textStoryColorPicker) textStoryColorPicker.classList.add(HIDDEN);
  }

  initializeSettings() {
    // Duration options
    document.querySelectorAll(".duration-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        document.querySelectorAll(".duration-option").forEach((o) => o.classList.remove("active"));
        e.currentTarget.classList.add("active");

        const duration = e.currentTarget.dataset.duration;
        console.log("Duration set to:", duration, "hours");
      });
    });

    // Toggle switches
    document.querySelectorAll(".toggle-input").forEach((toggle) => {
      toggle.addEventListener("change", (e) => {
        const setting = e.target.id;
        const value = e.target.checked;
        console.log(`${setting} set to:`, value);
      });
    });

    // Select dropdowns
    document.querySelectorAll(".setting-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const setting = e.target.id;
        const value = e.target.value;
        console.log(`${setting} set to:`, value);
      });
    });

    // Music button
    const musicBtn = document.querySelector(".music-btn");
    if (musicBtn) {
      musicBtn.addEventListener("click", () => {
        console.log("Music selection opened");
        alert("Music selection feature coming soon!");
      });
    }

    // Volume slider
    const volumeSlider = document.querySelector(".volume-slider");
    if (volumeSlider) {
      volumeSlider.addEventListener("input", (e) => {
        const volume = e.target.value;
        console.log("Volume set to:", volume);
      });
    }
  }

  async switchPanel(targetPanel) {
    if (this.isTransitioning || this.currentPanel === targetPanel) return;

    this.isTransitioning = true;

    const currentPanelEl = document.querySelector(`[data-panel="${this.currentPanel}"]`);
    const targetPanelEl = document.querySelector(`[data-panel="${targetPanel}"]`);

    if (!currentPanelEl || !targetPanelEl) {
      this.isTransitioning = false;
      return;
    }

    // Animate out current panel
    await this.animateOut(currentPanelEl);

    // Update current panel
    this.currentPanel = targetPanel;

    // Animate in target panel
    await this.animateIn(targetPanelEl);

    this.isTransitioning = false;
    console.log("Switched to panel:", targetPanel);
  }

  //
  switchSidebarPanel(panel) {
    if (!panel) return;

    const sidebarPanels = document.querySelectorAll(".text-story-contents .sidebar-panel");
    const currentPanel = document.querySelector(`.text-story-contents [data-text-panel="${panel}"]`);

    console.log(sidebarPanels);

    if (!currentPanel) return;

    sidebarPanels.forEach((sidebar) => sidebar.classList.add(HIDDEN));
    currentPanel.classList.remove(HIDDEN);

    return new Promise((resolve) => {
      currentPanel.style.transform = "translateX(100%)";
      currentPanel.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Force reflow
      currentPanel.offsetHeight;

      requestAnimationFrame(() => {
        currentPanel.style.transform = "translateX(0)";
      });

      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  animateOut(panel) {
    return new Promise((resolve) => {
      panel.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      panel.style.transform = "translateX(-100%)";

      setTimeout(() => {
        panel.style.display = "none";
        resolve();
      }, 300);
    });
  }

  animateIn(panel) {
    return new Promise((resolve) => {
      panel.style.display = "block";
      panel.style.transform = "translateX(100%)";
      panel.style.transition = "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

      // Force reflow
      panel.offsetHeight;

      requestAnimationFrame(() => {
        panel.style.transform = "translateX(0)";
      });

      setTimeout(() => {
        resolve();
      }, 300);
    });
  }

  updatePreview(text = null) {
    const previewText = document.getElementById("preview-text");
    const textInput = document.getElementById("story-text-input");

    if (!previewText) return;

    const displayText = text || (textInput ? textInput.value : "") || "Hello guys!😊";

    // Apply formatting
    const styles = {
      fontFamily: this.textFormatting.fontFamily,
      fontSize: `${this.textFormatting.fontSize}px`,
      color: this.textFormatting.color,
      fontWeight: this.textFormatting.bold ? "bold" : "normal",
      fontStyle: this.textFormatting.italic ? "italic" : "normal",
      textDecoration: "",
    };

    // Handle text decorations
    const decorations = [];
    if (this.textFormatting.underline) decorations.push("underline");
    if (this.textFormatting.strikethrough) decorations.push("line-through");
    styles.textDecoration = decorations.join(" ") || "none";

    // Apply styles
    Object.assign(previewText.style, styles);
    previewText.textContent = displayText;
  }

  closeInterface() {
    const container = document.getElementById("text-story-interface");
    const storyOptionsSidebar = document.querySelector(".story-options-sidebar");

    if (container) {
      container.style.display = "none";
    }

    // Show the story options sidebar again
    if (storyOptionsSidebar) {
      storyOptionsSidebar.style.display = "block";
    }

    console.log("Text story interface closed");
  }

  deleteStory() {
    // Reset the text input
    const textInput = document.getElementById("story-text-input");
    if (textInput) {
      textInput.value = "";
    }

    // Reset formatting
    this.textFormatting = {
      fontFamily: "Arial",
      fontSize: 24,
      color: "#ffffff",
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
    };

    // Update preview
    this.updatePreview();

    // Close interface
    this.closeInterface();
  }

  addToStories() {
    const textInput = document.getElementById("story-text-input");
    const text = textInput ? textInput.value.trim() : "";

    if (!text) {
      alert("Please enter some text before adding to stories.");
      return;
    }

    // Here you would typically save the story
    console.log("Adding text story to stories:", {
      text: text,
      formatting: this.textFormatting,
    });

    alert("Text story added successfully!");
    this.closeInterface();
  }

  // Public method to show the interface
  show() {
    const container = document.getElementById("text-story-interface");
    if (container) {
      container.style.display = "flex";
      this.switchPanel("main");
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize if the text story interface exists
  if (document.getElementById("text-story-interface")) {
    new TextStoryInterface();
  }
});
