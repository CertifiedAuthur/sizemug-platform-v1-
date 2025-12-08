document.addEventListener("DOMContentLoaded", function () {
  const paragraphSpacingButton = document.getElementById("sizemug_paragraph_spacing--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  paragraphSpacingButton.addEventListener("click", () => handleParagraphSpacing(focusedEditor));
});

function handleParagraphSpacing(editor) {
  const range = editor.getSelection();

  if (range) {
    const format = editor?.getFormat(range);
    const currentSpacing = format.paragraphSpacing;

    let newSpacing;
    switch (currentSpacing) {
      case undefined:
      case "0em":
        newSpacing = "0.5em";
        break;
      case "0.5em":
        newSpacing = "1em";
        break;
      case "1em":
        newSpacing = "1.5em";
        break;
      case "1.5em":
        newSpacing = "2em";
        break;
      case "2em":
        newSpacing = "6em";
        break;
      case "6em":
        newSpacing = false; // Removes the spacing
        break;
      default:
        newSpacing = "0.5em"; // Start over if we encounter an unexpected value
    }

    editor.format("paragraphSpacing", newSpacing);
  } else {
    console.log("No text selected");
  }
}
