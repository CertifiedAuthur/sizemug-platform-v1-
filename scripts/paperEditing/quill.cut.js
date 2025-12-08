document.addEventListener("DOMContentLoaded", function () {
  const cutButton = document.getElementById("sizemug_cut--btn");
  // let focusedEditor = null; // Variable to store the currently focused editor

  // // Set up event listeners for each editor to detect focus
  // paperEditors.forEach((editor) => {
  //   editor.container.addEventListener("focusin", function () {
  //     focusedEditor = editor; // Update focusedEditor when editor gains focus
  //   });
  // });

  // Cut button click handler
  cutButton.addEventListener("click", async function () {
    if (focusedEditor) {
      await handleOnCut(focusedEditor);
    } else {
      console.log("No editor is focused.");
    }
  });

  // Handle Cmd + X (or Ctrl + X on Windows) for cut
  document.addEventListener("keydown", async function (event) {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key?.toLowerCase();

    if (modifierKey && key === "x") {
      event.preventDefault(); // Prevent default cut behavior
      if (focusedEditor) {
        await handleOnCut(focusedEditor);
      } else {
        console.log("No editor is focused.");
      }
    }
  });
});

// Handle cut logic for the focused editor
async function handleOnCut(editor) {
  try {
    const range = editor?.getSelection(); // Get the current selection
    if (range && range.length > 0) {
      const selectedText = editor.getText(range.index, range.length); // Get the selected text
      await navigator.clipboard.writeText(selectedText); // Copy the selected text to clipboard
      editor.deleteText(range.index, range.length); // Delete the selected text from the editor
    }
  } catch (err) {
    console.error("Could not cut text: ", err);
  }
}
