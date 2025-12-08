/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
const formItemGoalsContainerDropdown = document.querySelectorAll(
  "#accountGoalsForm .form-item-container-dropdown"
);

formItemGoalsContainerDropdown.forEach((container) => {
  // Handle Enter key to trigger click
  container.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      container.click(); // Manually trigger the click event
    }
  });

  container.addEventListener("click", function (e) {
    const selectOptionItem = e.target.closest(".select-option-item");

    if (selectOptionItem) {
      const formItemContainerDropdown = selectOptionItem.closest(
        ".form-item-container-dropdown"
      );
      const formItemContainerDropdownType =
        formItemContainerDropdown.getAttribute("data-select-type");
      const dropdownDOMElement = formItemContainerDropdown.querySelector(
        ".dropdown-dom-element"
      );
      const selectOptionItemValue = selectOptionItem.getAttribute("data-value");

      dropdownDOMElement.innerText = selectOptionItem.innerText; // update DOM select
      detailInfoStore[formItemContainerDropdownType] = selectOptionItemValue;
      formItemContainerDropdown.setAttribute("aria-expanded", false); // close dropdown

      return;
    }
  });
});
