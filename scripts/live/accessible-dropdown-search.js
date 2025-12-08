/**
 * Accessible Dropdown Search Component
 * Provides full keyboard navigation, ARIA support, and screen reader compatibility
 */
class AccessibleDropdownSearch {
  constructor() {
    this.dropdown = document.querySelector(".sg-custom-dropdown-search");
    this.container = this.dropdown?.querySelector(".sg-custom-dropdown-search-container");
    this.input = this.dropdown?.querySelector("#category-search-input");
    this.listbox = this.dropdown?.querySelector("#category-listbox");
    this.options = this.dropdown?.querySelectorAll('li[role="option"]');

    this.isOpen = false;
    this.selectedIndex = -1;
    this.filteredOptions = Array.from(this.options);

    this.init();
  }

  init() {
    if (!this.dropdown || !this.input || !this.listbox) {
      console.warn("AccessibleDropdownSearch: Required elements not found");
      return;
    }

    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
    // Input focus events
    this.input.addEventListener("focus", () => this.openDropdown());
    this.input.addEventListener("blur", (e) => {
      // Delay to allow for option clicks
      setTimeout(() => {
        if (!this.dropdown.contains(document.activeElement)) {
          this.closeDropdown();
        }
      }, 150);
    });

    // Input change events
    this.input.addEventListener("input", (e) => this.filterOptions(e.target.value));
    this.input.addEventListener("keydown", (e) => this.handleInputKeydown(e));

    // Option click events
    this.options.forEach((option, index) => {
      option.addEventListener("click", () => this.selectOption(index));
      option.addEventListener("mouseenter", () => this.highlightOption(index));
    });

    // Click outside to close
    document.addEventListener("click", (e) => {
      if (!this.dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }

  setupKeyboardNavigation() {
    // Prevent form submission on Enter
    this.input.closest("form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  handleInputKeydown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.navigateOptions(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.navigateOptions(-1);
        break;
      case "Enter":
        e.preventDefault();
        if (this.selectedIndex >= 0) {
          this.selectOption(this.selectedIndex);
        }
        break;
      case "Escape":
        e.preventDefault();
        this.closeDropdown();
        this.input.blur();
        break;
      case "Home":
        e.preventDefault();
        this.selectFirstOption();
        break;
      case "End":
        e.preventDefault();
        this.selectLastOption();
        break;
    }
  }

  navigateOptions(direction) {
    if (!this.isOpen) {
      this.openDropdown();
    }

    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions.length === 0) return;

    if (this.selectedIndex < 0) {
      this.selectedIndex = direction > 0 ? 0 : visibleOptions.length - 1;
    } else {
      this.selectedIndex += direction;
      if (this.selectedIndex >= visibleOptions.length) {
        this.selectedIndex = 0;
      } else if (this.selectedIndex < 0) {
        this.selectedIndex = visibleOptions.length - 1;
      }
    }

    this.highlightOption(this.selectedIndex);
    this.updateAriaActiveDescendant();
  }

  selectFirstOption() {
    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions.length > 0) {
      this.selectedIndex = 0;
      this.highlightOption(0);
      this.updateAriaActiveDescendant();
    }
  }

  selectLastOption() {
    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions.length > 0) {
      this.selectedIndex = visibleOptions.length - 1;
      this.highlightOption(this.selectedIndex);
      this.updateAriaActiveDescendant();
    }
  }

  highlightOption(index) {
    // Remove previous highlights
    this.options.forEach((option) => {
      option.setAttribute("aria-selected", "false");
      option.classList.remove("highlighted");
    });

    // Highlight current option
    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions[index]) {
      visibleOptions[index].setAttribute("aria-selected", "true");
      visibleOptions[index].classList.add("highlighted");
      this.selectedIndex = index;
    }
  }

  selectOption(index) {
    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions[index]) {
      const option = visibleOptions[index];
      const category = option.getAttribute("data-category");
      const text = option.textContent;

      // Update input value
      this.input.value = text;

      // Update ARIA attributes
      this.dropdown.setAttribute("aria-expanded", "false");
      this.input.setAttribute("aria-activedescendant", "");

      // Trigger custom event
      this.dispatchSelectionEvent(category, text);

      // Close dropdown
      this.closeDropdown();

      // Dispatch change event for form compatibility
      this.input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  filterOptions(searchTerm) {
    const term = searchTerm.toLowerCase();

    this.options.forEach((option, index) => {
      const text = option.textContent.toLowerCase();
      const isVisible = text.includes(term);

      option.style.display = isVisible ? "block" : "none";
      option.setAttribute("aria-hidden", !isVisible);
    });

    // Reset selection
    this.selectedIndex = -1;
    this.updateAriaActiveDescendant();

    // Update filtered options
    this.filteredOptions = this.getVisibleOptions();
  }

  getVisibleOptions() {
    return Array.from(this.options).filter((option) => option.style.display !== "none" && !option.getAttribute("aria-hidden"));
  }

  openDropdown() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.dropdown.classList.remove("live--hidden");
    this.container.classList.add("modal-anim-in");
    this.dropdown.setAttribute("aria-expanded", "true");

    // Focus first option if available
    const visibleOptions = this.getVisibleOptions();
    if (visibleOptions.length > 0) {
      this.selectedIndex = 0;
      this.highlightOption(0);
      this.updateAriaActiveDescendant();
    }
  }

  closeDropdown() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");

    setTimeout(() => {
      this.dropdown.classList.add("live--hidden");
      this.container.classList.remove("modal-anim-out");
    }, 220);

    this.dropdown.setAttribute("aria-expanded", "false");
    this.input.setAttribute("aria-activedescendant", "");

    // Clear highlights
    this.options.forEach((option) => {
      option.setAttribute("aria-selected", "false");
      option.classList.remove("highlighted");
    });

    this.selectedIndex = -1;
  }

  updateAriaActiveDescendant() {
    const visibleOptions = this.getVisibleOptions();
    if (this.selectedIndex >= 0 && visibleOptions[this.selectedIndex]) {
      const activeOption = visibleOptions[this.selectedIndex];
      this.input.setAttribute("aria-activedescendant", activeOption.id);
    } else {
      this.input.setAttribute("aria-activedescendant", "");
    }
  }

  dispatchSelectionEvent(category, text) {
    const event = new CustomEvent("categorySelected", {
      detail: {
        category,
        text,
        timestamp: Date.now(),
      },
      bubbles: true,
    });
    this.dropdown.dispatchEvent(event);
  }

  // Public methods for external control
  getSelectedCategory() {
    return this.input.value;
  }

  setSelectedCategory(category) {
    const option = Array.from(this.options).find((opt) => opt.getAttribute("data-category") === category);
    if (option) {
      this.input.value = option.textContent;
    }
  }

  reset() {
    this.input.value = "";
    this.filterOptions("");
    this.closeDropdown();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".sg-custom-dropdown-search")) {
    window.accessibleDropdownSearch = new AccessibleDropdownSearch();
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = AccessibleDropdownSearch;
}
