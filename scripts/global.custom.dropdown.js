document.addEventListener("DOMContentLoaded", () => {
  const formItemContainerDropdown = document.querySelectorAll(".form-item-container-dropdown");

  formItemContainerDropdown.forEach((dropdown) => {
    dropdown.addEventListener("click", () => {
      const isExpanded = dropdown.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        dropdown.setAttribute("aria-expanded", false);
      } else {
        formItemContainerDropdown.forEach((dropdown) => dropdown.setAttribute("aria-expanded", false));
        dropdown.setAttribute("aria-expanded", true);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".form-item-container-dropdown")) {
      formItemContainerDropdown.forEach((dropdown) => dropdown.setAttribute("aria-expanded", false));
    }
  });
});
