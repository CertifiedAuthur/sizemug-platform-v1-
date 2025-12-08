document.addEventListener("DOMContentLoaded", function () {
  const pasteButton = document.getElementById("sizemug_paste--btn");
  let focusedEditor = null;

  paperEditors.forEach((editor) => {
    editor.container.addEventListener("focusin", function () {
      focusedEditor = editor; // Update focusedEditor when editor gains focus
    });
  });

  // Paste button click handler
  pasteButton.addEventListener("click", async function () {
    if (focusedEditor) {
      await handleOnPaste(focusedEditor);
    } else {
      console.log("No editor is focused.");
    }
  });

  // Handle Cmd + V (or Ctrl + V on Windows) for paste
  document.addEventListener("keydown", async function (event) {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key?.toLowerCase();

    if (modifierKey && key === "v") {
      event.preventDefault();

      if (focusedEditor) {
        await handleOnPaste(focusedEditor);
      } else {
        console.log("No editor is focused.");
      }
    }
  });
});

// Handle paste logic for the focused editor
async function handleOnPaste(editor) {
  try {
    const text = await navigator.clipboard.readText();
    const range = editor.getSelection();

    if (range) {
      editor.insertText(range.index, text);
    } else {
      editor.insertText(editor.getLength(), text);
    }
  } catch (err) {
    console.error("Failed to read clipboard contents: ", err);
  }
}
