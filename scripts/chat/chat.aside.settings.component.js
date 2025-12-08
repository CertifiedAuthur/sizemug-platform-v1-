const settingBackToSender = document.getElementById("settingBackToSender");

settingBackToSender.addEventListener("click", () => {
  hideAllChatSectionContainers();
  showInboxContainer();
});

// Language Control
const showSelectChatLanguage = document.getElementById(
  "showSelectChatLanguage"
);
const languageBackToSender = document.getElementById("languageBackToSender");

showSelectChatLanguage.addEventListener("click", () => {
  hideAllChatSectionContainers();
  document.getElementById("selectLanguageContainer").classList.remove(HIDDEN);
});

languageBackToSender.addEventListener("click", () => {
  hideAllChatSectionContainers();
  showSettingsAsideContainer();
});

// Control Story Room
const showStoryControlRoom = document.getElementById("showStoryControlRoom");
const storyControlRoomBack = document.getElementById("storyControlRoomBack");
const storyControlOnlyFollowers = document.getElementById(
  "storyControlOnlyFollowers"
);
const hideYourStoryFrom = document.getElementById("hideYourStoryFrom");

showStoryControlRoom.addEventListener("click", () => {
  hideAllChatSectionContainers();
  document.getElementById("storyControlRoomContainer").classList.remove(HIDDEN);
});

storyControlRoomBack.addEventListener("click", () => {
  hideAllChatSectionContainers();
  showSettingsAsideContainer();
});

storyControlOnlyFollowers.addEventListener("click", function () {
  const button = this.querySelector("button");

  if (button.getAttribute("aria-selected") === "true") {
    button.setAttribute("aria-selected", false);
  } else {
    button.setAttribute("aria-selected", true);
  }
});

hideYourStoryFrom.addEventListener("click", () => {
  hideAllChatSectionContainers();
  document
    .getElementById("hideWhoCanViewStoryContainer")
    .classList.remove(HIDDEN);
});

// Hide Story From Display
const hidStoryFromBackToMyStory = document.getElementById(
  "hidStoryFromBackToMyStory"
);
const completedRemovingFromStoryViewers = document.getElementById(
  "completedRemovingFromStoryViewers"
);

[completedRemovingFromStoryViewers, hidStoryFromBackToMyStory].forEach(
  (button) => {
    button.addEventListener("click", () => {
      hideAllChatSectionContainers();
      document
        .getElementById("storyControlRoomContainer")
        .classList.remove(HIDDEN);
    });
  }
);

// Blocked Users
const showBlockedUsers = document.getElementById("showBlockedUsers");
const blockBackManage = document.getElementById("blockBackManage");

showBlockedUsers.addEventListener("click", () => {
  hideAllChatSectionContainers();
  document.getElementById("blockAsideContainer").classList.remove(HIDDEN);
});

blockBackManage.addEventListener("click", () => {
  hideAllChatSectionContainers();
  showSettingsAsideContainer();
});
