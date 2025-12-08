document.addEventListener("DOMContentLoaded", () => {
  const newFileButton = document.getElementById("sizemug_new_file--btn");
  const newPaperElement = document.querySelectorAll(".new_paper_element");

  [...newPaperElement, newFileButton].forEach((button) => {
    button.addEventListener("click", () => {
      createNewEditor();
      closeDropdownBar(); // close all dropdown
    });
  });
});
