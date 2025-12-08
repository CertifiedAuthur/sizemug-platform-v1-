import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

document.addEventListener("DOMContentLoaded", function () {
  const pickerContainer = document.getElementById("picker-container");
  const emojiPickerBtn = document.getElementById("sizemug_emoji--btn");
  const emojiDocumentElement = document.querySelector(".emoji_document_element");

  // Show emoji container
  [emojiPickerBtn, emojiDocumentElement].forEach((button) => {
    button.onclick = () => {
      pickerContainer.classList.remove(HIDDEN);
      closeDropdownBar(); // close all dropdown
    };
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".sizemug_emoji--wrapper") && !e.target.closest(".emoji_document_element")) {
      pickerContainer.classList.add(HIDDEN);
    }
  });

  function createPicker() {
    const picker = document.createElement("emoji-picker");
    pickerContainer.appendChild(picker);

    picker.addEventListener("emoji-click", (event) => {
      if (focusedEditor) {
        const emoji = event.detail.unicode;
        const range = focusedEditor.getSelection(true);
        focusedEditor.insertText(range.index, emoji);
        focusedEditor.setSelection(range.index + emoji.length);

        pickerContainer.classList.add(HIDDEN);
      }
    });
  }

  if (customElements.get("emoji-picker")) {
    createPicker();
  } else {
    customElements.whenDefined("emoji-picker").then(() => {
      createPicker();
    });
  }
});
