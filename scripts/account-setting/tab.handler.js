const showMobileTabHandler = document.getElementById("showMobileTabHandler");
const mobileDropdownOptions = document.getElementById("mobileDropdownOptions");
const mobileDropdownOptionsItem = mobileDropdownOptions.querySelectorAll("li");
const desktopTabOptions = document.getElementById("desktopTabOptions");
const desktopTabOptionsItem = desktopTabOptions.querySelectorAll("li");

showMobileTabHandler.addEventListener("click", function () {
  const isExpanded = this.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    this.setAttribute("aria-expanded", false);
  } else {
    this.setAttribute("aria-expanded", true);

    // Hide On Document Clicked :)
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".account_setting_dropdown")) {
        this.setAttribute("aria-expanded", false);
      }
    });
  }
});

// Mobile Dropdown options
mobileDropdownOptions.addEventListener("click", (e) => {
  const list = e.target.closest("li");

  if (list) {
    const { tab, label } = list.dataset;

    // if there is no tab & label
    if (!tab || !label) return;

    const content = showMobileTabHandler.querySelector(".content");

    mobileDropdownOptionsItem.forEach((li) => {
      li.setAttribute("aria-selected", false);
    });
    list.setAttribute("aria-selected", true);

    // content
    content.textContent = label;

    handleAccountSettingsTabs(tab);

    showMobileTabHandler.setAttribute("aria-expanded", false); // Hide Dropdown
  }
});

// Desktop Tab
desktopTabOptions.addEventListener("click", (e) => {
  const list = e.target.closest("li");

  if (list) {
    const { tab } = list.dataset;

    // if there is no tab
    if (!tab) return;

    desktopTabOptionsItem.forEach((list) =>
      list.setAttribute("aria-selected", false)
    );
    list.setAttribute("aria-selected", true);

    handleAccountSettingsTabs(tab);
  }
});

function handleAccountSettingsTabs(tab) {
  const container = document.getElementById(`${tab}--container`);
  const containers = document.querySelectorAll(".tab-panel");

  containers.forEach((container) => container.classList.add(HIDDEN));
  container.classList.remove(HIDDEN);
}
