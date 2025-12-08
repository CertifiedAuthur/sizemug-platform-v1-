document.addEventListener("DOMContentLoaded", () => {
  const sizemugSaveBtn = document.getElementById("sizemug_save--btn");
  const saveDocumentElements = document.querySelectorAll(".save_document_element");

  [...saveDocumentElements, sizemugSaveBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showFlashMessage("File saved successfully :)");
      closeDropdownBar(); // close all dropdown
    });
  });
});
