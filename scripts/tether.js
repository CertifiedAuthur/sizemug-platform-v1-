const dropdownEvent = document.querySelectorAll(".dropdown_event");
const allDropdownOptions = document.querySelectorAll(".dropdown_with_search");
const popperInst = []; // Array to store Popper instances

dropdownEvent.forEach((btn) => {
  const searchDropdown = btn.closest(".form_item_outline").querySelector(".dropdown_with_search");

  if (!searchDropdown) return;

  // Create a Popper.js instance with the flip modifier
  const popper = createInstance(btn, searchDropdown);

  btn.addEventListener("click", (e) => {
    const form = btn.closest(".form_item_outline");
    const dropdownEl = form.querySelector(".dropdown_with_search");

    // Hide all other dropdowns
    if (!dropdownEl.classList.contains(HIDDEN)) {
      allDropdownOptions.forEach((option) => option.classList.add(HIDDEN));
      dropdownEl.classList.add(HIDDEN);
    } else {
      // Toggle the dropdown visibility
      allDropdownOptions.forEach((option) => option.classList.add(HIDDEN));
      dropdownEl.classList.remove(HIDDEN);
    }

    // Update the Popper.js position (this will also handle flipping if needed)
    popper.update();
  });

  popperInst.push(popper); // Add the Popper instance to the array
});

// Initialize Popper.js instance with the flip modifier
function createInstance(btn, dropdownContent) {
  const popperInstance = Popper.createPopper(btn, dropdownContent, {
    placement: "top-start", // Default placement (bottom-left)
    modifiers: [
      {
        name: "flip", // The flip modifier
        options: {
          fallbackPlacements: ["top-start"], // Flip to these positions if 'bottom-start' is not possible
        },
      },
      {
        name: "preventOverflow", // Prevent the dropdown from overflowing the viewport
        options: {
          boundary: "viewport", // Keep within the viewport
        },
      },
    ],
  });

  return popperInstance; // Return the Popper instance
}
