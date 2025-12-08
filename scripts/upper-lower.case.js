"use strict";

const changeCaseBtn = document.querySelectorAll("#changeTextCase");

changeCaseBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    if (btn.classList.contains("task-button--active")) {
      btn.classList.remove("task-button--active");
      changeTextCase("lowercase");
    } else {
      changeTextCase("uppercase");
      btn.classList.add("task-button--active");
    }
  })
);

function changeTextCase(caseType) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const selectedText = range.toString();

  if (selectedText.length > 0) {
    const caseText =
      selectedText[caseType === "lowercase" ? "toLowerCase" : "toUpperCase"]();

    // Use a DocumentFragment to insert the modified text
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(caseText));

    // Replace the selected text with the upper case text
    range.deleteContents();
    range.insertNode(fragment);

    // Clear the selection
    selection.removeAllRanges();
  }
}
