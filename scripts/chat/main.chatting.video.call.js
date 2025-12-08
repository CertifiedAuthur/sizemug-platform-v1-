const collapseVideoCallModalBtn = document.getElementById("collapseVideoCallModalBtn");
const videoModalOverlay = document.getElementById("videoModalOverlay");
const collapsedCallSingleModal = document.getElementById("collapsedCallSingleModal");
const enlargeVideoCall = document.getElementById("enlargeVideoCall");
const singleCallToggleCamera = document.getElementById("singleCallToggleCamera");
const groupVideoCallModal = document.getElementById("groupVideoCall");
const abortVideoCallBtns = document.querySelectorAll(".abortVideoCallBtn");

/**
 *
 *
 *
 *
 * Single Video Call Functionality
 *
 *
 *
 *
 *
 */
singleCallToggleCamera.addEventListener("click", function () {
  const isSelected = this.getAttribute("aria-selected") === "true";
  const hideSingleVideoOverlay = document.getElementById("hideSingleVideoOverlay");

  if (isSelected) {
    this.setAttribute("aria-selected", false);
    hideSingleVideoOverlay.classList.add(HIDDEN);
  } else {
    this.setAttribute("aria-selected", true);
    hideSingleVideoOverlay.classList.remove(HIDDEN);
  }
});

collapseVideoCallModalBtn.addEventListener("click", () => {
  hideVideoSingleCall();
  showCollapsedCallSingleModal();
});

enlargeVideoCall.addEventListener("click", () => {
  showVideoSingleCall();
  hideCollapsedCallSingleModal();
});

/**
 *
 *
 *
 *
 * Group Video Call Functionality
 *
 *
 *
 *
 *
 */
const showGroupVideoCall = document.getElementById("showGroupVideoCall");
showGroupVideoCall.addEventListener("click", () => {
  groupVideoCallModal.classList.remove(HIDDEN);
});

abortVideoCallBtns.forEach((btn) => {
  btn.addEventListener("click", abortVideoCall);
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

function abortVideoCall() {
  collapsedCallSingleModal.classList.add(HIDDEN);
  videoModalOverlay.classList.add(HIDDEN);
  groupVideoCallModal.classList.add(HIDDEN);
}

function hideVideoSingleCall() {
  videoModalOverlay.classList.add(HIDDEN);
}

function showVideoSingleCall() {
  videoModalOverlay.classList.remove(HIDDEN);
}

function hideCollapsedCallSingleModal() {
  collapsedCallSingleModal.classList.add(HIDDEN);
}

function showCollapsedCallSingleModal() {
  collapsedCallSingleModal.classList.remove(HIDDEN);
}
