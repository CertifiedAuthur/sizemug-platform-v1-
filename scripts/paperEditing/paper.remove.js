document.addEventListener("DOMContentLoaded", () => {
  const sizemugRemoveBtn = document.getElementById("sizemug_remove--btn");
  const removeDocumentElements = document.querySelectorAll(".remove_document_element");

  [...removeDocumentElements, sizemugRemoveBtn].forEach((button) => {
    button.addEventListener("click", () => {
      handleEmptyEditors();
      closeDropdownBar(); // close all dropdown
    });
  });
});

function handleEmptyEditors() {
  focusedEditor.deleteText(0, focusedEditor.getLength());
}
