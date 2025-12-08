document.addEventListener("DOMContentLoaded", function () {
  const subsscriptButton = document.getElementById("sizemug_subscript--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  subsscriptButton.addEventListener("click", () => handleTextSubscript(focusedEditor));
});

function handleTextSubscript(editor) {
  const selection = editor?.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);

    if (format.script === "sub") {
      editor.format("script", false);
    } else {
      editor.format("script", "sub");
    }
  } else {
    console.log("No text selected for underline.");
  }
}
