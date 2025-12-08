const shareModal = document.getElementById("share_board_overlay");
const sharePaperBtn = document.getElementById("share_paper--btn");

sharePaperBtn.addEventListener("click", showShareModal);

document.addEventListener("keydown", (event) => {
  // Check if it's Command key on Mac or Ctrl key on other OS
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modifierKey = isMac ? event.metaKey : event.ctrlKey;

  if (event.shiftKey && modifierKey && event.key === "i") {
    event.preventDefault(); // Prevent default browser behavior

    if (shareModal.classList.contains(HIDDEN)) {
      showShareModal();
    } else {
      hideShareModal();
    }
  }
});

function showShareModal() {
  shareModal.classList.remove(HIDDEN);
}

function hideShareModal() {
  shareModal.classList.add(HIDDEN);
}
