/**
 * Initializes dropdown menus with Popper.js for positioning and handles
 * toggling visibility and closing when clicking outside.
 *
 * @file /Users/macbookair/Desktop/sizemug/scripts/global.dropdown.menu.js
 * @requires https://unpkg.com/@popperjs/core@2
 */

document.querySelectorAll(".form-item-container").forEach(function (dropdown) {
  const button = dropdown.querySelector(".form-dropdown-head-wrapper");
  const menu = dropdown.querySelector(".form-item-container-dropdown-container");
  const formItemContainers = document.querySelectorAll(".form-item-container");

  // Initialize Popper.js
  const popperInstance = Popper.createPopper(button, menu, {
    placement: "bottom-start", // Positioning
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 4], // Adjust for spacing
        },
      },
    ],
  });

  // Toggle dropdown visibility
  button?.addEventListener("click", () => {
    const isExpanded = dropdown.getAttribute("aria-expanded") === "true";

    formItemContainers.forEach((formItem) => {
      formItem?.setAttribute("aria-expanded", false);
    });

    dropdown.setAttribute("aria-expanded", !isExpanded);
    popperInstance.update(); // Recalculate position
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".form-item-container")) {
      formItemContainers.forEach((formItem) => {
        formItem.setAttribute("aria-expanded", false);
      });
    }
  });
});
