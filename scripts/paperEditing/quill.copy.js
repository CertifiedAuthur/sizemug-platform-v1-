document.addEventListener("DOMContentLoaded", function () {
  const copyButton = document.getElementById("sizemug_copy--btn");
  // let focusedEditor = null;

  // paperEditors.forEach((editor) => {
  //   editor.container.addEventListener("focusin", function () {
  //     focusedEditor = editor; // Update focusedEditor when editor gains focus
  //   });
  // });

  copyButton.addEventListener("click", async function () {
    await handleOnCopy(focusedEditor);
  });

  // Handle Cmd + C (or Ctrl + C on Windows) for copy
  document.addEventListener("keydown", async function (event) {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;
    const key = event.key?.toLowerCase();

    if (modifierKey && key === "c") {
      event.preventDefault();

      if (focusedEditor) {
        await handleOnCopy(focusedEditor);
      } else {
        console.log("No editor is focused.");
      }
    }
  });
});

async function handleOnCopy(editor) {
  try {
    const range = editor?.getSelection();

    if (range) {
      const selectedText = editor.getText(range.index, range.length);
      await navigator.clipboard.writeText(selectedText);
    }
  } catch (err) {
    console.error("Could not copy text: ", err);
  }
}
