document.addEventListener("DOMContentLoaded", () => {
  const sizemugAddHorizontalLineBtn = document.getElementById("sizemug_add_horizontal_line--btn");
  const lineDocumentElement = document.querySelector(".line_document_element");

  [lineDocumentElement, sizemugAddHorizontalLineBtn].forEach((button) => {
    button.addEventListener("click", () => {
      const range = focusedEditor.getSelection(true);
      // Insert a new line before the divider
      focusedEditor.insertText(range.index, "\n", Quill.sources.USER);
      // Insert the divider
      focusedEditor.insertEmbed(range.index + 1, "divider", true, Quill.sources.USER);
      // Move cursor after the divider
      focusedEditor.setSelection(range.index + 3, Quill.sources.SILENT);

      closeDropdownBar(); // close all dropdown
    });
  });
});
