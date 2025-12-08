document.addEventListener("DOMContentLoaded", function () {
  const undoButton = document.getElementById("sizemug_undo--btn");
  const redoButton = document.getElementById("sizemug_redo--btn");

  // Initially, reference the first editor as the active editor (or change it later dynamically)
  let activeEditor = paperEditors[0];

  // Function to set the active editor
  function setActiveEditor(editor) {
    activeEditor = editor;

    // Update undo/redo button states for the active editor
    updateUndoRedoButtons();
  }

  // Undo/redo button functionality
  undoButton.addEventListener("click", function () {
    activeEditor.history.undo();
  });

  redoButton.addEventListener("click", function () {
    activeEditor.history.redo();
  });

  // Update button states based on undo/redo history
  function updateUndoRedoButtons() {
    undoButton.disabled = !activeEditor.history.stack.undo.length;
    redoButton.disabled = !activeEditor.history.stack.redo.length;
  }

  // Listen for text changes in all editors
  paperEditors.forEach((editor) => {
    editor.on("text-change", function () {
      if (editor === activeEditor) {
        updateUndoRedoButtons();
      }
    });

    // Optionally: Add focus listener to update the active editor when it gains focus
    editor.container.addEventListener("focus", function () {
      setActiveEditor(editor);
    });
  });

  // Initial state of buttons
  updateUndoRedoButtons();
});
