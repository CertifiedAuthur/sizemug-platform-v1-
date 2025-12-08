document.addEventListener("DOMContentLoaded", function () {
  const lineHeightButton = document.getElementById("sizemug_line_height--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  lineHeightButton.addEventListener("click", () => handleLineHeight(focusedEditor));
});

function handleLineHeight(editor) {
  const range = editor.getSelection();

  if (range) {
    const format = editor?.getFormat(range);

    if (format.lineHeight) editor.format("lineHeight", false);
    else editor.format("lineHeight", "2.0");
  }
}
