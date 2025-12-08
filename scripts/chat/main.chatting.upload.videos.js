const videoPreviewElement = document.getElementById("videoPreviewElement");
const changeVideoState = document.getElementById("changeVideoState");
const videoPreviewModal = document.getElementById("videoPreviewModal");
const closeSendUserVideoModalBtn = document.getElementById("closeSendUserVideoModalBtn");

function togglePreviewVideoState() {
  const { mode } = this.dataset || "idle";

  if (mode === "idle" || mode === "pause") {
    videoPreviewElement.play();
    this.dataset.mode = "play";
  } else if (mode === "play") {
    videoPreviewElement.pause();
    this.dataset.mode = "pause";
  }

  videoPreviewElement.addEventListener("ended", () => {
    videoPreviewElement.currentTime = 0;
    this.dataset.mode = "idle";
  });
}

changeVideoState.addEventListener("click", togglePreviewVideoState);
// Listen for space (play/pause video)
document.addEventListener("keydown", (e) => {
  if (e.key === "Backspace" && !videoPreviewModal.classList.contains(HIDDEN)) return togglePreviewVideoState();
});

closeSendUserVideoModalBtn.addEventListener("click", hideVideoPreviewModal);

function hideVideoPreviewModal() {
  videoPreviewModal.classList.add(HIDDEN);
  sendDocumentImageVideo.removeAttribute("data-type");
  showEmojiTasksAdditionalButtons();
}
