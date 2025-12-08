const emojiPickerEmojiContainer = document.getElementById("emojiPickerEmojiContainer");

emojiPickerEmojiContainer?.addEventListener("click", (e) => {
  if (e.target.id === "emojiPickerEmojiContainer") return hideEmojiContainer();
});

function hideEmojiContainer() {
  emojiPickerEmojiContainer.classList.add(HIDDEN);
}

function showEmojiContainer() {
  emojiPickerEmojiContainer.classList.remove(HIDDEN);
}
