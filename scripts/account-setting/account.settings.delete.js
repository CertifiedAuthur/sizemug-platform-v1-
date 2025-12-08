/*************************************************** Delete Select ***************************************************/
/*************************************************** Delete Select ***************************************************/
/*************************************************** Delete Select ***************************************************/
/*************************************************** Delete Select ***************************************************/
/*************************************************** Delete Select ***************************************************/
/*************************************************** Delete Select ***************************************************/
const accountDeleteContainerDropdown = document.querySelector("#accountDeleteForm .form-item-container-dropdown");

accountDeleteContainerDropdown.addEventListener("click", function (e) {
  const selectOptionItem = e.target.closest(".select-option-item");

  if (selectOptionItem) {
    // const accountDeleteContainerDropdownType = accountDeleteContainerDropdown.getAttribute("data-select-type");
    const dropdownDOMElement = accountDeleteContainerDropdown.querySelector(".dropdown-dom-element");
    const selectOptionItemValue = selectOptionItem.textContent;

    dropdownDOMElement.innerText = selectOptionItemValue; // update DOM select
    accountDeleteContainerDropdown.setAttribute("aria-expanded", false); // close dropdown
    return;
  }
});

const somethingElseOption = document.querySelector("#deleteAccountOptions li.something-else");
const whatOnYourMindModal = document.getElementById("whatOnYourMindModal");
const hideWhatOnMindModal = document.getElementById("hideWhatOnMindModal");

somethingElseOption.addEventListener("click", () => {
  whatOnYourMindModal.classList.remove(HIDDEN);
});

whatOnYourMindModal.addEventListener("click", (e) => {
  if (e.target.id === "whatOnYourMindModal") return whatOnYourMindModal.classList.add(HIDDEN);
});

hideWhatOnMindModal.addEventListener("click", () => {
  whatOnYourMindModal.classList.add(HIDDEN);
});
