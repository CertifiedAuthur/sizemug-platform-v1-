"use strict";

// Share Modal
const shareInviteBtn = document.querySelector(".invite_component #invite_button");
const shareEmailInput = document.querySelector(".invite_component input");
const inviteSentMessage = document.getElementById("invite_sent--message");
const inviteComponentForm = document.getElementById("invite_component--form");

shareInviteBtn?.addEventListener("click", function () {
  if (shareEmailInput.value) {
    inviteComponentForm.classList.add(HIDDEN);
    inviteSentMessage.classList.remove(HIDDEN);
    return;
  }

  this.disabled = true; // disable button
  shareEmailInput.classList.remove(HIDDEN); // show input
});

shareEmailInput.addEventListener("input", function () {
  if (this.value.length >= 1) {
    shareInviteBtn.disabled = false; // undisabled the button
  } else {
    shareInviteBtn.disabled = true; // disabled the button
  }
});

const hideInviteMessage = document.getElementById("hide_invite--message");

hideInviteMessage.addEventListener("click", function () {
  shareEmailInput.value = ""; //clear previous content
  inviteComponentForm.classList.remove(HIDDEN);
  inviteSentMessage.classList.add(HIDDEN);
});
