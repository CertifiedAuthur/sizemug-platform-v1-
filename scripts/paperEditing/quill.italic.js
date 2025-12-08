document.addEventListener("DOMContentLoaded", function () {
  const italicButton = document.getElementById("sizemug_italic--btn");

  italicButton.addEventListener("click", () => handleOnItalic(focusedEditor));
});

function handleOnItalic(editor) {
  const selection = editor.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);
    editor.format("italic", !format.italic);
  } else {
    console.log("No text selected for italic.");
  }
}
