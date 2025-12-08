document.addEventListener("DOMContentLoaded", function () {
  const superscriptButton = document.getElementById("sizemug_superscript--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  superscriptButton.addEventListener("click", () => handleTextSuperscript(focusedEditor));
});

function handleTextSuperscript(editor) {
  const selection = editor?.getSelection();

  if (selection) {
    const format = editor?.getFormat(selection);

    if (format.script === "super") {
      editor.format("script", false);
    } else {
      editor.format("script", "super");
    }
  } else {
    console.log("No text selected for underline.");
  }
}
