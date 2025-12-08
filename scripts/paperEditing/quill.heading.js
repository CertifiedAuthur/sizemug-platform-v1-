document.addEventListener("DOMContentLoaded", function () {
  const sizemugHeadingButton = document.getElementById("sizemug_heading--btn");
  const sizemugHeadingOptions = sizemugHeadingButton.querySelector(".sizemug_heading_options");

  // let focusedEditor = null;

  // paperEditors.forEach((editor) => {
  //   editor.container.addEventListener("focusin", function () {
  //     focusedEditor = editor;
  //   });
  // });

  sizemugHeadingButton.addEventListener("click", () => {
    if (sizemugHeadingOptions.getAttribute("aria-expanded") === "false") {
      sizemugHeadingOptions.classList.remove(HIDDEN);
      sizemugHeadingOptions.setAttribute("aria-expanded", true);
    } else {
      sizemugHeadingOptions.classList.add(HIDDEN);
      sizemugHeadingOptions.setAttribute("aria-expanded", false);
    }
  });

  // Outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#sizemug_heading--btn")) {
      sizemugHeadingOptions.classList.add(HIDDEN);
      sizemugHeadingOptions.setAttribute("aria-expanded", false);
    }
  });

  sizemugHeadingOptions.addEventListener("click", (e) => {
    const target = e.target;

    if (target.tagName.toLowerCase() === "span") {
      const { heading } = target.dataset;
      handleTextHeading(Number(heading), focusedEditor);
    }
  });
});

function handleTextHeading(heading, editor) {
  if (!editor) {
    console.log("No editor is focused.");
    return;
  }

  const selection = editor.getSelection();
  if (selection) {
    if (selection.length === 0) {
      // Apply heading format to the current line if no text is selected
      editor.formatLine(selection.index, 1, "header", heading);
    } else {
      // Apply heading format to the selected text
      editor.format("header", heading);
    }
  } else {
    console.log("No text selected for applying heading.");
  }
}
