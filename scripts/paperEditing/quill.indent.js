document.addEventListener("DOMContentLoaded", function () {
  const leftIndentButton = document.getElementById("sizemug_left_indent--btn");
  const rightIndentButton = document.getElementById("sizemug_right_indent--btn");

  // let focusedEditor = null;

  // paperEditors.forEach((editor) => {
  //   editor.container.addEventListener("focusin", function () {
  //     focusedEditor = editor;
  //   });
  // });

  leftIndentButton.addEventListener("click", () => handleIndent("outdent", focusedEditor));
  rightIndentButton.addEventListener("click", () => handleIndent("indent", focusedEditor));
});

function handleIndent(action, editor) {
  const range = editor?.getSelection();

  if (range) {
    if (action === "indent") {
      editor.format("indent", "+1");
    } else if (action === "outdent") {
      editor.format("indent", "-1");
    }
  }
}
