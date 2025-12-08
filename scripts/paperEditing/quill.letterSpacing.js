// Initialize Quill with the letterSpacing format
const letterSpacingConfig = {
  default: "0px",
  options: ["0px", "1px", "2px", "3px", "4px", "5px", "10px", "15px", "20px"],
};

// Add this to your Quill initialization for each editor
paperEditors.forEach((editor) => {
  // Ensure the format is registered
  editor.getModule("toolbar");
});

document.addEventListener("DOMContentLoaded", function () {
  const letterSpacingButton = document.getElementById("sizemug_letter_spacing--btn");
  let focusedEditor = null;
  let isLetterSpacingActive = false;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor;

      // Update button state based on current format
      const format = editor?.getFormat();
      isLetterSpacingActive = !!format.letterSpacing;
    });

    // Listen for selection changes
    editor.on("selection-change", function (range) {
      if (range && editor === focusedEditor) {
        const format = editor?.getFormat(range);
        isLetterSpacingActive = !!format.letterSpacing;
      }
    });
  });

  letterSpacingButton.addEventListener("click", () => {
    if (!focusedEditor) return;

    const selection = focusedEditor.getSelection();
    if (!selection) return;

    const currentFormat = focusedEditor?.getFormat(selection);
    isLetterSpacingActive = !currentFormat.letterSpacing;

    handleLetterSpacing(focusedEditor, isLetterSpacingActive);
  });
});

function handleLetterSpacing(editor, isActive) {
  if (!editor) return;

  const selection = editor.getSelection();
  if (!selection) {
    editor.setSelection(0, editor.getLength());
  }

  try {
    if (isActive) {
      editor.format("letterSpacing", "10px");
    } else {
      editor.format("letterSpacing", false);
    }
  } catch (error) {
    console.error("Error applying letter spacing:", error);
  }

  // Restore original selection if none existed
  if (!selection) {
    editor.setSelection(null);
  }
}
