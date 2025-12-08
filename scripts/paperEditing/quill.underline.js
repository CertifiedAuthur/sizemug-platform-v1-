document.addEventListener("DOMContentLoaded", function () {
  const underlineButton = document.getElementById("sizemug_underline--btn");

  underlineButton.addEventListener("click", () => handleTextUnderline(focusedEditor));
});

function handleTextUnderline(editor) {
  const selection = editor.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);
    editor.format("underline", !format.underline);
  } else {
    console.log("No text selected for underline.");
  }
}
