"use strict";
const COLLABORATIONHIDDEN = "collaboration-hidden";

const collaborationOnboard = document.getElementById("collaboration_onboarding--welcome");
const collaborationContinue = document.getElementById("collaboration--continue");

function showOnboarding() {
  const visitCollab = JSON.parse(localStorage.getItem("sizemug_collaboration") ?? "false");

  if (visitCollab) {
    collaborationOnboard.classList.add(COLLABORATIONHIDDEN); // show onboard overlay
  } else {
    collaborationOnboard.classList.remove(COLLABORATIONHIDDEN); // hidden onboard overlay
  }
}

showOnboarding();

collaborationContinue.addEventListener("click", function () {
  localStorage.setItem("sizemug_collaboration", "true"); // update localstorage
  collaborationOnboard.classList.add(COLLABORATIONHIDDEN); // hidden onboard overlay
});
