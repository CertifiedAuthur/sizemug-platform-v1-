// First, register the strike format with Quill (add this with your other Quill configurations)
const Strike = Quill.import("formats/strike");
Quill.register(Strike, true);

document.addEventListener("DOMContentLoaded", function () {
  const strikeThroughButton = document.getElementById("sizemug_strike_through--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor; // Update focusedEditor when editor gains focus
    });
  });

  strikeThroughButton.addEventListener("click", () => {
    if (!focusedEditor) return; // Guard clause if no editor is focused
    handleStrikeThrough(focusedEditor);
  });
});

function handleStrikeThrough(editor) {
  if (!editor) return;

  const selection = editor.getSelection() || { index: 0, length: 0 };
  const format = editor?.getFormat(selection);

  // Toggle strike format
  editor.format("strike", !format.strike, "user");

  // If no text is selected, set cursor position
  if (selection.length === 0) {
    editor.setSelection(selection.index + 1);
  }
}
