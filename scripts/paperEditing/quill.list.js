document.addEventListener("DOMContentLoaded", function () {
  const bulletListButton = document.getElementById("sizemug_bullet_list--btn");
  const numberListButton = document.getElementById("sizemug_number_list--btn");

  bulletListButton.addEventListener("click", () => handleList("bullet", focusedEditor));
  numberListButton.addEventListener("click", () => handleList("ordered", focusedEditor));
});

function handleList(type, editor) {
  const range = editor?.getSelection();

  if (range) {
    const format = editor?.getFormat(range);
    editor.format("list", format.list === type ? false : type);
  }
}
