const menuDropdownBar = document.querySelectorAll(".toolbar_direct--btn > ul");
const toolsNavbar = document.getElementById("tools_navbar");
const mobileToolbarOption = document.querySelector("#mobile_toolbar_option--btn~ul");

document.addEventListener("DOMContentLoaded", function () {
  const allToolbarDirectBtn = document.querySelectorAll(".tools_navbar--header .toolbar_direct--btn");

  // Tooltip setup
  tippy(".navbar_header_tools .column_holder button", {
    placement: "bottom",
    zIndex: 999999999,
  });

  allToolbarDirectBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const btn = e.target.closest(".toolbar_direct--btn");

      // Open Dropdown && check prevent the dropdown being opened when the list items are clicked
      if (btn && !e.target.closest("ul")) {
        const lists = btn.querySelector("ul");
        closeDropdownBar();

        if (lists) {
          if (lists.ariaExpanded === "false") {
            lists.ariaExpanded = true;
          }

          toolsNavbar.classList.add("tools-navbar-expanded");
          toolsNavbar.classList.remove("tools-navbar-collapsed");
        }

        return;
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".toolbar_direct--btn") && !e.target.closest("#sizemug_add_date--btn")) {
      closeDropdownBar();
    }
  });
});

// Becareful with this function, it is used in almost all paper.**** files
function closeDropdownBar() {
  menuDropdownBar.forEach((bar) => {
    bar.ariaExpanded = false;
  });

  toolsNavbar.classList.remove("tools-navbar-expanded");
  toolsNavbar.classList.add("tools-navbar-collapsed");
  mobileToolbarOption.classList.add(HIDDEN);
}
