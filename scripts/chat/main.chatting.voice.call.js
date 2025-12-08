const singleCallModal = document.getElementById("singleCallModal");
const collapseCallModalBtn = document.getElementById("collapseCallModalBtn");
const onCallContainer = document.getElementById("onCallContainer");
const showGroupVoiceCall = document.getElementById("showGroupVoiceCall");
const abortVoiceCallBtns = document.querySelectorAll(".abortVoiceCallBtn");

//
const addParticipantsLists = document.querySelectorAll(".add_participants_lists ul");

addParticipantsLists.forEach((container) => {
  container.addEventListener("click", (e) => {
    const list = e.target.closest("li");

    if (list) {
      const isSelected = list.getAttribute("aria-selected") === "true";

      if (isSelected) {
        list.setAttribute("aria-selected", false);
      } else {
        list.setAttribute("aria-selected", true);
      }
    }
  });
});

// Hide Single Call Modal
collapseCallModalBtn.addEventListener("click", hideSingleCallModal);

showGroupVoiceCall.addEventListener("click", () => {
  document.getElementById("groupCallModal").classList.remove(HIDDEN);
});

abortVoiceCallBtns.forEach((btn) => {
  btn.addEventListener("click", abortVoiceCall);
});

// document.addEventListener("click", (e) => {
//   const startSingleVoiceCall = e.target.closest("#startSingleVoiceCall");

//   if (startSingleVoiceCall) {
//     return showSingleCallModal();
//   }

//   const startSingleVideoCall = e.target.closest("#startSingleVideoCall");
//   if (startSingleVideoCall) {
//     return showVideoSingleCall();
//   }
// });

const startSingleVoiceCalls = document.querySelectorAll(".startSingleVoiceCall");
startSingleVoiceCalls.forEach((button) => {
  button.addEventListener("click", (e) => {
    showSingleCallModal();
  });
});

const startSingleVideoCalls = document.querySelectorAll(".startSingleVideoCall");
startSingleVideoCalls.forEach((button) => {
  button.addEventListener("click", (e) => {
    showVideoSingleCall();
  });
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
function showSingleCallModal() {
  singleCallModal.classList.remove(HIDDEN);
}

function hideSingleCallModal() {
  onCallContainer.classList.remove(HIDDEN);
  singleCallModal.classList.add(HIDDEN);
}

function abortVoiceCall() {
  onCallContainer.classList.add(HIDDEN);
  singleCallModal.classList.add(HIDDEN);
}
