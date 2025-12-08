import "https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js";

document.addEventListener("DOMContentLoaded", () => {
  // const reactWithEmoji = document.getElementById("reactWithEmoji");
  const emojiContainer = document.getElementById("emojiContainer");

  new PopperModal({
    triggerSelector: "#reactWithEmoji",
    modalSelector: "#emojiContainer",
    placement: "right-start",
    offset: [0, 12],
  });

  // reactWithEmoji.addEventListener("click", (e) => {
  //   if (!e.target.closest(".emojiContainer")) {
  //     emojiContainer.classList.remove(HIDDEN);
  //   }
  // });

  // document.addEventListener("click", (e) => {
  //   if (!e.target.closest(".react-with-emoji-wrapper")) {
  //     emojiContainer.classList.add(HIDDEN);
  //   }
  // });

  function createPicker() {
    const picker = document.createElement("emoji-picker");
    emojiContainer.appendChild(picker);

    picker.addEventListener("emoji-click", (event) => {
      //       if (focusedEditor) {
      const emoji = event.detail.unicode;
      //       const range = focusedEditor.getSelection(true);
      //       focusedEditor.insertText(range.index, emoji);
      //       focusedEditor.setSelection(range.index + emoji.length);

      emojiContainer.classList.add(HIDDEN);
      //       }
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
