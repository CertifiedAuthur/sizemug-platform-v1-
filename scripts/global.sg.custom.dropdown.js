// /**
//  * Custom Dropdown Component
//  * Usage: new SGCustomDropdown(element, options)
//  */

// class SGCustomDropdown {
//   constructor(element, options = {}) {
//     this.element = document.getElementById(element) ?? document.querySelector(element);
//     this.options = {
//       placeholder: options.placeholder || "Select an option",
//       data: options.data || [],
//       defaultValue: options.defaultValue || null,
//       disabled: options.disabled || false,
//       onChange: options.onChange || null,
//     };

//     this.selectedValue = this.options.defaultValue;
//     this.isOpen = false;

//     this.init();
//   }

//   init() {
//     this.element.classList.add("sg-custom-dropdown");
//     if (this.options.disabled) {
//       this.element.classList.add("disabled");
//     }
//     this.render();
//     this.attachEvents();
//   }

//   render() {
//     const selectedItem = this.options.data.find((item) => item.value === this.selectedValue);
//     const displayText = selectedItem ? selectedItem.label : this.options.placeholder;
//     const isPlaceholder = !selectedItem;

//     this.element.innerHTML = `
//       <div class="sg-dropdown-header">
//         <span class="sg-dropdown-header-text ${isPlaceholder ? "placeholder" : ""}">${displayText}</span>
//         <span class="sg-dropdown-arrow">
//           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m5.84 9.59l5.66 5.66l5.66-5.66l-.71-.7l-4.95 4.95l-4.95-4.95z"/></svg>
//         </span>
//       </div>
//       <div class="sg-dropdown-list">
//         ${this.options.data
//           .map(
//             (item) => `
//           <div class="sg-dropdown-item ${item.value === this.selectedValue ? "selected" : ""}" data-value="${item.value}">
//             ${item.label}
//           </div>
//         `
//           )
//           .join("")}
//       </div>
//     `;

//     this.header = this.element.querySelector(".sg-dropdown-header");
//     this.list = this.element.querySelector(".sg-dropdown-list");
//     this.items = this.element.querySelectorAll(".sg-dropdown-item");
//   }

//   attachEvents() {
//     if (this.options.disabled) return;

//     this.header.addEventListener("click", () => this.toggle());

//     this.items.forEach((item) => {
//       item.addEventListener("click", (e) => {
//         const value = e.target.getAttribute("data-value");
//         this.select(value);
//       });
//     });

//     document.addEventListener("click", (e) => {
//       if (!this.element.contains(e.target)) {
//         this.close();
//       }
//     });
//   }

//   toggle() {
//     this.isOpen ? this.close() : this.open();
//   }

//   open() {
//     this.isOpen = true;
//     this.header.classList.add("active");
//     this.list.classList.add("open");
//   }

//   close() {
//     this.isOpen = false;
//     this.header.classList.remove("active");
//     this.list.classList.remove("open");
//   }

//   select(value) {
//     const oldValue = this.selectedValue;
//     this.selectedValue = value;
//     this.render();
//     this.attachEvents();
//     this.close();

//     if (this.options.onChange && oldValue !== value) {
//       const selectedItem = this.options.data.find((item) => item.value === value);
//       this.options.onChange(value, selectedItem);
//     }
//   }

//   getValue() {
//     return this.selectedValue;
//   }

//   setValue(value) {
//     this.select(value);
//   }

//   setData(data) {
//     this.options.data = data;
//     this.render();
//     this.attachEvents();
//   }

//   disable() {
//     this.options.disabled = true;
//     this.element.classList.add("disabled");
//     this.close();
//   }

//   enable() {
//     this.options.disabled = false;
//     this.element.classList.remove("disabled");
//     this.render();
//     this.attachEvents();
//   }

//   destroy() {
//     this.element.innerHTML = "";
//     this.element.classList.remove("sg-custom-dropdown", "disabled");
//   }
// }

/**
 * Custom Dropdown Component with Icon Support
 * Usage: new SGCustomDropdown(element, options)
 */

class SGCustomDropdown {
  constructor(element, options = {}) {
    this.element = document.getElementById(element) ?? document.querySelector(element);
    this.options = {
      placeholder: options.placeholder || "Select an option",
      data: options.data || [],
      defaultValue: options.defaultValue || null,
      disabled: options.disabled || false,
      onChange: options.onChange || null,
      // Icon options
      icon: options.icon || null, // Permanent icon (string: emoji, svg, or image URL)
      iconType: options.iconType || "text", // 'text' (emoji), 'svg', 'image', 'dynamic'
      showIconInList: options.showIconInList !== false, // Show icons in dropdown list
      iconPosition: options.iconPosition || "left", // 'left' or 'right'
      showItemBadge: options.showItemBadge || false,
    };

    this.selectedValue = this.options.defaultValue;
    this.isOpen = false;

    this.init();
  }

  init() {
    this.element.classList.add("sg-custom-dropdown");
    if (this.options.disabled) {
      this.element.classList.add("disabled");
    }
    this.render();
    this.attachEvents();
  }

  /**
   * Render icon HTML based on type and source
   */
  renderIcon(iconData, iconType = this.options.iconType) {
    if (!iconData) return "";

    const iconClass = `sg-dropdown-icon sg-dropdown-icon-${this.options.iconPosition}`;

    switch (iconType) {
      case "text":
      case "emoji":
        return `<span class="${iconClass}">${iconData}</span>`;

      case "svg":
        return `<span class="${iconClass}">${iconData}</span>`;

      case "image":
        return `<img src="${iconData}" alt="icon" class="${iconClass} sg-dropdown-icon-image" />`;

      case "dynamic":
        // For dynamic icons, iconData comes from the data item
        if (typeof iconData === "object") {
          return this.renderIcon(iconData.icon, iconData.type || "text");
        }
        return `<span class="${iconClass}">${iconData}</span>`;

      default:
        return `<span class="${iconClass}">${iconData}</span>`;
    }
  }

  /**
   * Get the icon to display (either permanent or dynamic)
   */
  getDisplayIcon(item = null) {
    // If iconType is 'dynamic', use the item's icon
    if (this.options.iconType === "dynamic" && item && item.icon) {
      return this.renderIcon(item.icon, item.iconType || "text");
    }

    // Otherwise, use the permanent icon
    if (this.options.icon) {
      return this.renderIcon(this.options.icon);
    }

    return "";
  }

  render() {
    const selectedItem = this.options.data.find((item) => item.value === this.selectedValue);
    const displayText = selectedItem ? selectedItem.label : this.options.placeholder;
    const isPlaceholder = !selectedItem;
    const displayIcon = this.getDisplayIcon(selectedItem);

    // Build header content based on icon position
    let headerContent = "";
    if (this.options.iconPosition === "left") {
      headerContent = `
        ${displayIcon}
        <span class="sg-dropdown-header-text ${isPlaceholder ? "placeholder" : ""}">${displayText}</span>
      `;
    } else {
      headerContent = `
        <span class="sg-dropdown-header-text ${isPlaceholder ? "placeholder" : ""}">${displayText}</span>
        ${displayIcon}
      `;
    }

    this.element.innerHTML = `
      <div class="sg-dropdown-header">
        ${headerContent}
        <span class="sg-dropdown-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m5.84 9.59l5.66 5.66l5.66-5.66l-.71-.7l-4.95 4.95l-4.95-4.95z"/></svg>
        </span>
      </div>
      <div class="sg-dropdown-list">
        ${this.options.data
          .map((item) => {
            const itemIcon = this.options.showIconInList ? (this.options.iconType === "dynamic" && item.icon ? this.renderIcon(item.icon, item.iconType || "text") : this.getDisplayIcon(item)) : "";

            return `
              <div class="sg-dropdown-item flex ${item.value === this.selectedValue ? "selected" : ""}" data-value="${item.value}">
                ${this.options.showItemBadge && this.options.iconPosition === "left" ? itemIcon : ""}
                <span class="sg-dropdown-item-text" style="padding-left: 10px">${item.label}</span>
                ${this.options.iconPosition === "right" ? itemIcon : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    this.header = this.element.querySelector(".sg-dropdown-header");
    this.list = this.element.querySelector(".sg-dropdown-list");
    this.items = this.element.querySelectorAll(".sg-dropdown-item");
  }

  attachEvents() {
    if (this.options.disabled) return;

    this.header.addEventListener("click", () => this.toggle());

    this.items.forEach((item) => {
      item.addEventListener("click", (e) => {
        const value = e.currentTarget.getAttribute("data-value");
        this.select(value);
      });
    });

    document.addEventListener("click", (e) => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.header.classList.add("active");
    this.list.classList.add("open");
  }

  close() {
    this.isOpen = false;
    this.header.classList.remove("active");
    this.list.classList.remove("open");
  }

  select(value) {
    const oldValue = this.selectedValue;
    this.selectedValue = value;
    this.render();
    this.attachEvents();
    this.close();

    if (this.options.onChange && oldValue !== value) {
      const selectedItem = this.options.data.find((item) => item.value === value);
      this.options.onChange(value, selectedItem);
    }
  }

  getValue() {
    return this.selectedValue;
  }

  setValue(value) {
    this.select(value);
  }

  setData(data) {
    this.options.data = data;
    this.render();
    this.attachEvents();
  }

  disable() {
    this.options.disabled = true;
    this.element.classList.add("disabled");
    this.close();
  }

  enable() {
    this.options.disabled = false;
    this.element.classList.remove("disabled");
    this.render();
    this.attachEvents();
  }

  destroy() {
    this.element.innerHTML = "";
    this.element.classList.remove("sg-custom-dropdown", "disabled");
  }
}
