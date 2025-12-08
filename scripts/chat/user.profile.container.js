const userProfileBack = document.getElementById("userProfileBack");
const userProfileQrcode = document.getElementById("userProfileQrcode");
const userProfileScheduledTasks = document.getElementById(
  "userProfileScheduledTasks"
);
const userProfileSharedMedia = document.getElementById(
  "userProfileSharedMedia"
);
const deleteChat = document.getElementById("deleteChat");
const hideDeleteChatModal = document.getElementById("hideDeleteChatModal");
const deleteChatModal = document.getElementById("deleteChatModal");

userProfileBack.addEventListener("click", showInboxContainer);
userProfileQrcode.addEventListener("click", showQRcodeModal);
userProfileScheduledTasks.addEventListener("click", () => {
  const chatTasksListsContainer = document.getElementById(
    "chatTasksListsContainer"
  );

  chatTasksListsContainer.classList.remove(HIDDEN);
});

userProfileSharedMedia.addEventListener("click", () => {
  showUserInfoPopup(); // Show add new task modal
});

function showInboxContainer() {
  const indexTabContainer = document.getElementById("inboxesTabContainer");

  hideAllChatSectionContainers();
  indexTabContainer.focus();
  indexTabContainer.classList.remove(HIDDEN);
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Show delete chat modal
deleteChat.addEventListener("click", () => {
  const deleteChatModal = document.getElementById("deleteChatModal");
  deleteChatModal.classList.remove(HIDDEN);
});

// Hide delete chat modal
hideDeleteChatModal.addEventListener("click", () => {
  deleteChatModal.classList.add(HIDDEN);
});

// Close delete chat modal
deleteChatModal.addEventListener(
  "click",
  (e) => {
    if (e.target.id === "deleteChatModal") {
      deleteChatModal.classList.add(HIDDEN);
    }
  } /* Delete chat */
);
