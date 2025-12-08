document.addEventListener("DOMContentLoaded", function () {
  const centerAlignmentButton = document.getElementById("sizemug_align_center--btn");
  const justifyAlignmentButton = document.getElementById("sizemug_justify--btn");
  const leftAlignmentButton = document.getElementById("sizemug_left_alignment--btn");
  const rightAlignmentButton = document.getElementById("sizemug_right_alignment--btn");

  centerAlignmentButton.addEventListener("click", () => handleAlignment("center", focusedEditor));
  justifyAlignmentButton.addEventListener("click", () => handleAlignment("justify", focusedEditor));
  leftAlignmentButton.addEventListener("click", () => handleAlignment("left", focusedEditor));
  rightAlignmentButton.addEventListener("click", () => handleAlignment("right", focusedEditor));
});

function handleAlignment(alignment, editor) {
  const range = editor?.getSelection();

  if (range) {
    const currentFormat = editor?.getFormat(range);

    if (alignment === "left") {
      editor.format("align", false);
    } else {
      editor.format("align", currentFormat.align === alignment ? false : alignment);
    }
  }
}
