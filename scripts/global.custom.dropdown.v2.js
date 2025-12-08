/**
 * Custom Dropdown Handler v2
 * Handles dropdown show/close separately from value changes
 */

class CustomDropdown {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.button = containerElement.querySelector(".sg_custom_dropdown_btn");
    this.dropdown = containerElement.querySelector(".sg_custom_dropdown");
    this.items = containerElement.querySelectorAll(".sg_custom_dropdown_item");

    this.isOpen = false;
    this.selectedValue = null;
    this.selectedText = null;

    // Callbacks
    this.onOpen = options.onOpen || null;
    this.onClose = options.onClose || null;
    this.onChange = options.onChange || null;

    this._init();
  }

  _init() {
    // Toggle dropdown on button click
    this.button.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Handle item selection
    this.items.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = item.dataset.value;
        const text = item.textContent;
        this.selectValue(value, text);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.container.contains(e.target) && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.dropdown.style.display = "block";

    // Trigger animation
    requestAnimationFrame(() => {
      this.dropdown.style.opacity = "1";
      this.dropdown.style.transform = "translateY(0)";
      this.dropdown.style.pointerEvents = "auto";
    });

    this.container.classList.add("open");

    if (this.onOpen) {
      this.onOpen(this);
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.dropdown.style.opacity = "0";
    this.dropdown.style.transform = "translateY(-10px)";
    this.dropdown.style.pointerEvents = "none";

    setTimeout(() => {
      if (!this.isOpen) {
        this.dropdown.style.display = "none";
      }
    }, 300);

    this.container.classList.remove("open");

    if (this.onClose) {
      this.onClose(this);
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  selectValue(value, text) {
    const oldValue = this.selectedValue;
    this.selectedValue = value;
    this.selectedText = text || value;

    // Update button text
    this.button.textContent = this.selectedText;

    // Update active state on items
    this.items.forEach((item) => {
      if (item.dataset.value === value) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Close dropdown after selection
    this.close();

    // Trigger change callback only if value actually changed
    if (this.onChange && oldValue !== value) {
      this.onChange(value, text, this);
    }
  }

  getValue() {
    return this.selectedValue;
  }

  getText() {
    return this.selectedText;
  }

  setValue(value) {
    const item = Array.from(this.items).find((i) => i.dataset.value === value);
    if (item) {
      this.selectValue(value, item.textContent);
    }
  }
}

// Initialize all dropdowns on page
function initCustomDropdowns() {
  const dropdowns = new Map();

  document.querySelectorAll(".sg_custom_dropdown_container").forEach((container) => {
    const id = container.id;
    const dropdown = new CustomDropdown(container);

    // Store instance on container for easy access
    container._customDropdown = dropdown;

    if (id) {
      dropdowns.set(id, dropdown);
    }
  });

  return dropdowns;
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCustomDropdowns);
} else {
  initCustomDropdowns();
}
