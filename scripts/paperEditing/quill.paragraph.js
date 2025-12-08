document.addEventListener("DOMContentLoaded", function () {
  const paragraphButton = document.getElementById("sizemug_paragraph--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  paragraphButton.addEventListener("click", () => handleParagraph(focusedEditor));
});

function handleParagraph(editor) {
  const range = editor.getSelection();

  if (range) {
    // Get the current format of the selected text
    const currentFormat = editor?.getFormat(range);

    // Remove block-level formats
    editor.removeFormat(range.index, range.length);

    // If the text was in a list, we need to remove the list format
    if (currentFormat.list) {
      editor.format("list", false);
    }

    // Ensure any inline formats are preserved
    if (currentFormat.bold) editor.format("bold", true);
    if (currentFormat.italic) editor.format("italic", true);
    if (currentFormat.underline) editor.format("underline", true);
  } else {
    console.log("No text selected");
  }
}
