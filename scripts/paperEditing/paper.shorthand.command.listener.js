document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", (event) => {
    // Check if it's Command key on Mac or Ctrl key on other OS
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key?.toLowerCase();

    // Find which Quill editor is currently focused
    const focusedEditor = paperEditors.find((editor) => editor.hasFocus());

    if (!focusedEditor) return; // Exit if no editor is focused

    // Undo shorthand (only if a Quill editor is focused)
    if (modifierKey && key === "z") {
      event.preventDefault(); // Prevent default browser behavior
      return focusedEditor.history.undo();
    }

    // Redo shorthand (only if a Quill editor is focused)
    if (modifierKey && key === "y") {
      event.preventDefault(); // Prevent default browser behavior
      return focusedEditor.history.redo();
    }

    // Check for full-screen shortcut (F11 on Windows/Linux or Ctrl+Cmd+F on Mac)
    if ((isMac && modifierKey && key === "f") || key === "f11") {
      event.preventDefault(); // Prevent default full-screen shortcut behavior
      return toggleFullScreen();
    }

    // Cut shorthand (only if a Quill editor is focused)
    if (modifierKey && key === "x") {
      event.preventDefault(); // Prevent default browser behavior

      (async () => {
        return await handleOnCut();
      })();
    }

    // Copy shorthand (only if a Quill editor is focused)
    if (modifierKey && key === "c") {
      event.preventDefault();

      (async () => {
        return await handleOnCopy();
      })();
    }

    // New Paper (Shift + N)
    if (event.shiftKey && key === "n") {
      event.preventDefault();
      return handleAddNewPaper();
    }

    // Text Boldness (only if a Quill editor is focused)
    if (modifierKey && key === "b") {
      event.preventDefault();
      return handleOnBold();
    }

    // Letter Spacing (only if a Quill editor is focused)
    if (modifierKey && key === "g") {
      event.preventDefault();
      return handleLetterSpacing();
    }

    // Italic (only if a Quill editor is focused)
    if (modifierKey && key === "i") {
      event.preventDefault();
      return handleOnItalic();
    }

    // Underline (only if a Quill editor is focused)
    if (modifierKey && key === "u") {
      event.preventDefault();
      return handleTextUnderline();
    }

    // PRINT
    if (modifierKey && key === "p") {
      event.preventDefault();
      return handlePrint();
    }
  });
});
