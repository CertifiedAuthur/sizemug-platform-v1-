const mainTaskLists = document.querySelectorAll(".main_tasks_list");
let shareMedias = [];
let forwardingData = [];
let forwardSelectedUsers = [];
let starredMessages = [];

let openChats = []; // Array to track open chats
let currentMaxOpenedChat = 1;
const maxChatContainers = 4; // Maximum number of chats

let currentFocusedGridItem = 1;

let currentOpenedUser;
let currentChattingInfo;

let currentOpenedChatContainer;
let storedPreviewMediaData = [];

const chatItemsGridContainerWrapper = document.getElementById("chatItemsContainerWrapper");
document.addEventListener("click", (e) => {
  const chatSpacerArea = e.target.closest(".chat_spacer_area");
  if (chatSpacerArea) {
    const { trackerId } = chatSpacerArea.dataset;
    currentFocusedGridItem = trackerId;
  }
});

/////////
/////////
/////////
/////////
/////////
// 1
const chatSpacerGridItem1 = document.getElementById("chatSpacerGridItem--1");
chatSpacerGridItem1?.addEventListener("click", function () {
  const chattingAreaContainer = this.querySelector(".chatting_area_container");

  const { id, type } = chattingAreaContainer.dataset;

  if (type === "chat") {
    currentOpenedUser = chatItems.find((item) => item.id === +id);
  } else if (type === "group") {
    currentOpenedUser = groupChatItems.find((item) => item.id === +id);
  } else {
    currentOpenedUser = liveChatList.find((item) => item.id === +id);
  }
});

/////////
/////////
/////////
/////////
/////////
// 1
const chatSpacerGridItem2 = document.getElementById("chatSpacerGridItem--2");
chatSpacerGridItem2?.addEventListener("click", function () {
  const chattingAreaContainer = this.querySelector(".chatting_area_container");

  const { id, type } = chattingAreaContainer.dataset;

  if (type === "chat") {
    currentOpenedUser = chatItems.find((item) => item.id === +id);
  } else if (type === "group") {
    currentOpenedUser = groupChatItems.find((item) => item.id === +id);
  } else {
    currentOpenedUser = liveChatList.find((item) => item.id === +id);
  }

  console.log(currentOpenedUser);
});

/////////
/////////
/////////
/////////
/////////
// 1
const chatSpacerGridItem3 = document.getElementById("chatSpacerGridItem--3");
chatSpacerGridItem3?.addEventListener("click", function () {
  const chattingAreaContainer = this.querySelector(".chatting_area_container");

  const { id, type } = chattingAreaContainer.dataset;

  if (type === "chat") {
    currentOpenedUser = chatItems.find((item) => item.id === +id);
  } else if (type === "group") {
    currentOpenedUser = groupChatItems.find((item) => item.id === +id);
  } else {
    currentOpenedUser = liveChatList.find((item) => item.id === +id);
  }

  console.log(currentOpenedUser);
});

/////////
/////////
/////////
/////////
/////////
// 1
const chatSpacerGridItem4 = document.getElementById("chatSpacerGridItem--4");
chatSpacerGridItem4?.addEventListener("click", function () {
  const chattingAreaContainer = this.querySelector(".chatting_area_container");

  const { id, type } = chattingAreaContainer.dataset;

  if (type === "chat") {
    currentOpenedUser = chatItems.find((item) => item.id === +id);
  } else if (type === "group") {
    currentOpenedUser = groupChatItems.find((item) => item.id === +id);
  } else {
    currentOpenedUser = liveChatList.find((item) => item.id === +id);
  }

  console.log(currentOpenedUser);
});

/**
 * Converts URLs in a given text to HTML anchor elements.
 *
 * @param {string} text - The text containing URLs to be converted.
 * @returns {string} - The text with URLs converted to anchor elements.
 */
function convertLinksToAnchors(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
}
