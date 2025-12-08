class ColorPicker {
  constructor(element, useColorButtonHandler) {
    this.picker = element;
    this.preview = element.querySelector(".color-preview");
    this.hueSlider = element.querySelector(".hue-slider");
    this.opacitySlider = element.querySelector(".opacity-slider");
    this.hexInput = element.querySelector(".hex-input");
    this.opacityInput = element.querySelector(".opacity-input");
    this.formatToggle = element.querySelector("#changeToRGB");
    this.colorInputGroup = this.formatToggle.querySelector("#toggleText");
    this.colorToggleText = element.querySelector("#toggleColorText");
    this.useColorButton = element.querySelector("#colorPickerUseColor--btn");
    this.recentColors = [];
    this.maxRecentColors = 6;
    this.currentFormat = "hex"; // 'hex' or 'rgb'

    this.currentHue = 0;
    this.currentSaturation = 100;
    this.currentLightness = 50;
    this.currentOpacity = 100;

    // Store the provided handler
    this.useColorButtonHandler = useColorButtonHandler;

    this.initializeEvents();
    this.updateColor();

    this.useColorButton?.addEventListener("click", this.useColorButtonHandler);

    this.picker.addEventListener("click", (e) => {
      if (e.target === this.picker) {
        this.picker.classList.add(HIDDEN);
      }
    });
  }

  getSelectedColor() {
    if (this.currentFormat === "hex") {
      const rgb = this.hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
      return `#${this.rgbToHex(rgb.r, rgb.g, rgb.b)}`;
    } else {
      const rgb = this.hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
      return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    }
  }

  toggleFormat() {
    this.currentFormat = this.currentFormat === "hex" ? "rgb" : "hex";
    this.colorInputGroup.textContent = this.currentFormat.toUpperCase();
    this.colorToggleText.textContent = this.currentFormat === "hex" ? "#" : "rgb";

    // Update input value to match new format
    if (this.currentFormat === "rgb") {
      const hex = this.hexInput.value.replace("#", "");
      const rgb = this.hexToRgb(hex);
      this.hexInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    } else {
      const rgbValues = this.hexInput.value.split(",").map((val) => parseInt(val.trim()));
      if (rgbValues.length === 3) {
        const hex = this.rgbToHex(rgbValues[0], rgbValues[1], rgbValues[2]);
        this.hexInput.value = `${hex}`;
      }
    }
  }

  initializeEvents() {
    // Add format toggle event
    this.formatToggle.addEventListener("click", () => this.toggleFormat());
    this.hueSlider.addEventListener("input", () => {
      this.currentHue = parseInt(this.hueSlider.value);
      this.updateColor();
    });

    this.opacitySlider.addEventListener("input", () => {
      this.currentOpacity = parseInt(this.opacitySlider.value);
      this.updateColor();
    });

    this.hexInput.addEventListener("change", () => {
      if (this.currentFormat === "hex") {
        const hex = this.hexInput.value.replace("#", "");
        if (this.isValidHex(hex)) {
          const rgb = this.hexToRgb(hex);
          const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
          this.currentHue = hsl.h;
          this.currentSaturation = hsl.s;
          this.currentLightness = hsl.l;
          this.hueSlider.value = this.currentHue;
          this.updateColor();
        }
      } else {
        // Handle RGB input
        const rgbValues = this.hexInput.value.split(",").map((val) => parseInt(val.trim()));
        if (rgbValues.length === 3 && rgbValues.every((val) => !isNaN(val) && val >= 0 && val <= 255)) {
          const hsl = this.rgbToHsl(rgbValues[0], rgbValues[1], rgbValues[2]);
          this.currentHue = hsl.h;
          this.currentSaturation = hsl.s;
          this.currentLightness = hsl.l;
          this.hueSlider.value = this.currentHue;
          this.updateColor();
        }
      }
    });

    this.opacityInput.addEventListener("change", () => {
      let opacity = parseInt(this.opacityInput.value);
      opacity = Math.min(100, Math.max(0, opacity));
      this.currentOpacity = opacity;
      this.opacitySlider.value = opacity;
      this.updateColor();
    });

    this.preview.addEventListener("mousedown", (e) => {
      const updateSelector = (e) => {
        const rect = this.preview.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        this.currentSaturation = x * 100;
        this.currentLightness = (1 - y) * 100;
        this.updateColor();
      };

      // update once on mousedown
      updateSelector(e);

      // track moves
      const onMouseMove = (e) => {
        e.preventDefault();
        updateSelector(e);

        // 🔥 dispatch a custom event here
        const color = this.getSelectedColor();
        this.picker.dispatchEvent(new CustomEvent("colormove", { detail: { color } }));
      };
      document.addEventListener("mousemove", onMouseMove);

      // when they release, stop tracking AND fire your event
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // 🔥 dispatch a custom event here
        const color = this.getSelectedColor();
        this.picker.dispatchEvent(new CustomEvent("colorchange", { detail: { color } }));
      };
      document.addEventListener("mouseup", onMouseUp);
    });

    // Handle recent colors
    const colorItems = this.picker.querySelectorAll(".color-item");
    colorItems.forEach((item) => {
      item.addEventListener("click", () => {
        const color = item.style.backgroundColor;
        const rgb = this.parseRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        this.currentHue = hsl.h;
        this.currentSaturation = hsl.s;
        this.currentLightness = hsl.l;
        this.hueSlider.value = this.currentHue;
        this.updateColor();
      });
    });
  }

  updateColor() {
    // Create the base HSL color
    const color = `hsla(${this.currentHue}, ${this.currentSaturation}%, ${this.currentLightness}%, ${this.currentOpacity / 100})`;

    // Create saturation and lightness gradients
    this.preview.style.background = `
                  linear-gradient(to bottom, 
                      rgba(0,0,0,0) 0%,
                      rgba(0,0,0,1) 100%
                  ),
                  linear-gradient(to right,
                      rgba(255,255,255,1) 0%,
                      hsla(${this.currentHue}, 100%, 50%, 1) 100%
                  )
              `;

    // Update the selector dot position
    const xPos = this.currentSaturation + "%";
    const yPos = 100 - this.currentLightness + "%";
    this.preview.style.setProperty("--x-pos", xPos);
    this.preview.style.setProperty("--y-pos", yPos);

    // Position the selector dot
    const dot = this.preview.querySelector(".selector-dot") || document.createElement("div");
    dot.className = "selector-dot";
    dot.style.left = xPos;
    dot.style.top = yPos;
    if (!this.preview.contains(dot)) {
      this.preview.appendChild(dot);
    }

    // Update color input based on format
    const rgb = this.hslToRgb(this.currentHue, this.currentSaturation, this.currentLightness);
    let hex; // Define the hex variable
    if (this.currentFormat === "hex") {
      hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
      this.hexInput.value = `${hex}`;
    } else {
      this.hexInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    }

    // Update opacity input
    this.opacityInput.value = this.currentOpacity;

    // Add to recent colors only if hex is available
    if (hex) {
      this.addRecentColor(`#${hex}`);
    }
  }

  addRecentColor(color) {
    if (!this.recentColors.includes(color)) {
      this.recentColors.unshift(color);
      if (this.recentColors.length > this.maxRecentColors) {
        this.recentColors.pop();
      }
      this.updateRecentColors();
    }
  }

  updateRecentColors() {
    const colorList = this.picker.querySelector(".color-picker-list");
    colorList.innerHTML = "";
    this.recentColors.forEach((color) => {
      const button = document.createElement("button");
      button.className = "color-item";
      button.style.backgroundColor = color;
      button.addEventListener("click", () => {
        // Convert RGB color to current format
        const rgb = this.parseRgb(color);
        if (this.currentFormat === "hex") {
          const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
          this.hexInput.value = `#${hex}`;
        } else {
          this.hexInput.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        }
        this.hexInput.dispatchEvent(new Event("change"));
      });
      colorList.appendChild(button);
    });
  }

  // Utility functions for color conversion
  isValidHex(hex) {
    return /^[0-9A-F]{6}$/i.test(hex);
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  rgbToHex(r, g, b) {
    return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  }

  parseRgb(rgb) {
    const matches = rgb.match(/\d+/g);
    return {
      r: parseInt(matches[0]),
      g: parseInt(matches[1]),
      b: parseInt(matches[2]),
    };
  }

  rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }
}
