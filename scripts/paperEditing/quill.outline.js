document.addEventListener("DOMContentLoaded", function () {
  const outlineButton = document.getElementById("sizemug_outline--btn");

  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;
    });
  });

  outlineButton.addEventListener("click", () => handleOnOutline(focusedEditor));
});

function handleOnOutline(editor) {
  const range = editor?.getSelection();

  if (range) {
    const format = editor?.getFormat(range);

    if (format.outline) {
      // Remove the outline by setting the format to `false`
      editor.format("outline", false);
    } else {
      // Apply the outline with a specific color (e.g., black)
      editor.format("outline", "black");
    }
  }
}
