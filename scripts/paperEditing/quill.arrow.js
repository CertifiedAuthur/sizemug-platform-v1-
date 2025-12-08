document.addEventListener("DOMContentLoaded", () => {
  const sizemugArrowBtn = document.getElementById("sizemug_arrow--btn");
  const arrowDocumentElement = document.querySelector(".arrow_document_element");

  [arrowDocumentElement, sizemugArrowBtn].forEach((button) => {
    button.addEventListener("click", () => {
      handleAddArrow();
      closeDropdownBar(); // close all dropdown
    });
  });
});

function handleAddArrow() {
  const range = focusedEditor.getSelection(true);
  focusedEditor.insertEmbed(range?.index, "arrow", true, "user");
}
