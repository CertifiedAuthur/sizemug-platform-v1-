document.addEventListener("DOMContentLoaded", function () {
  const boldButton = document.getElementById("sizemug_bold--btn");

  boldButton.addEventListener("click", () => handleOnBold(focusedEditor));
});

function handleOnBold(editor) {
  const selection = editor?.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);
    editor.format("bold", !format.bold);
  } else {
    console.log("No text selected for bold.");
  }
}
