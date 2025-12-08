// hide all quick actions
function hideAllQuickMessageActions() {
  const allMesssageQuickActionContainer = document.querySelectorAll(".chat_message_quick_action");

  allMesssageQuickActionContainer.forEach((quick) => {
    quick.classList.add(HIDDEN);
    quick.querySelector("ul").setAttribute("aria-expanded", false);
  });
}

// handle tag reply
// function showTagReplyOnMessageInput(taggedInfo) {
//   const tagReplyOnMessageInput = document.getElementById("tagReplyOnMessageInput");
//   const taggedSliderUsername = document.getElementById("taggedSliderUsername");
//   const taggedSliderContent = document.getElementById("taggedSliderContent");

//   taggedObjectInfo = taggedInfo;
//   tagReplyOnMessageInput.classList.remove(HIDDEN);
//   taggedSliderUsername.textContent = taggedInfo.sender_id === USERID ? "You" : currentOpenedUser.name;
//   taggedSliderContent.textContent = taggedInfo.message.text;
// }

// Outside click event
document.addEventListener("click", (e) => {
  if (!e.target.closest(".chat_message_quick_action")) {
    hideAllQuickMessageActions();
  }
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
 *
 *
 *
 *
 *
 * DOUBLE CLICK EVENT
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

// DBClick event
chatItemsContainerWrapper.addEventListener("dblclick", (e) => {
  const chatMessageItemContainer = e.target.closest(".chat_message_item_container");

  if (chatMessageItemContainer) {
    const messageIn = chatMessageItemContainer.closest(".message_in");
    const messsageQuickActionContainer = messageIn.querySelector(".chat_message_quick_action");

    hideAllQuickMessageActions();
    messsageQuickActionContainer.classList.remove(HIDDEN);
    messsageQuickActionContainer.focus();
  }
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
 * CLICK EVENT
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
 *
 *
 *
 *
 */
const selectionDeleteCountContainer = document.getElementById("selectionDeleteCountContainer");
// const selectionForwardCountContainer = document.getElementById("selectionForwardCountContainer");
const chatPrimaryFooter = document.getElementById("chatPrimaryFooter");
const cancelDeleteMessages = document.getElementById("cancelDeleteMessages");

let chatSelectedType = "delete";
let chatSelectedCount = 0;

function updateSelectedCount(container) {
  const selectedCountItemEl = container.querySelector(".selected_count_item");
  selectedCountItemEl.textContent = chatSelectedCount;
}

function handleSelectChatItem(state = "show") {
  const selectChatItemButtons = document.getElementById(`chatSpacerGridItem--${currentFocusedGridItem}`).querySelectorAll(".select_chat_item_button");

  if (state === "hide") {
    selectChatItemButtons.forEach((item) => {
      item.setAttribute("aria-selected", false);
      item.classList.add(HIDDEN);
    });
  } else {
    selectChatItemButtons.forEach((item) => {
      item.setAttribute("aria-selected", false);
      item.classList.remove(HIDDEN);
    });
  }

  // reset selected count
  chatSelectedCount = 0;
}

function hideAllFooterElements(chatSpacerArea) {
  const chattingSpacerFooterItems = chatSpacerArea.querySelectorAll(".chattingSpacerFooter>div");
  chattingSpacerFooterItems.forEach((container) => container.classList.add(HIDDEN));
}

// Click event
chatItemsContainerWrapper.addEventListener("click", (e) => {
  function hideTheDropdown() {
    e.target.closest("ul").setAttribute("aria-expanded", false);
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Options Button
  const chatMessageItemOptions = e.target.closest("#chatMessageItemOptions");
  if (chatMessageItemOptions) {
    const chatSpacerArea = chatMessageItemOptions.closest(".chat_spacer_area");
    const container = chatMessageItemOptions.closest(".chat_message_item_options_wrapper");

    const dropdown = container.querySelector("ul");

    if (dropdown) {
      dropdown.setAttribute("aria-expanded", true);

      currentFocusedGridItem = chatSpacerArea.dataset.trackerId;

      // Dropdown
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".chat_message_item_options_wrapper")) {
          dropdown.setAttribute("aria-expanded", false);
        }
      });
    }

    return;
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Dropdown Options
  const chatMessageItemOptionsWrapper = e.target.closest(".chat_message_item_options_wrapper");
  if (chatMessageItemOptionsWrapper) {
    const forwardContainer = document.getElementById("forwardContainer");
    const chattingAreaContainer = chatMessageItemOptionsWrapper.closest(".chatting_area_container");

    const { id, type } = chattingAreaContainer.dataset;

    if (type === "chat") {
      currentOpenedUser = chatItems.find((item) => item.id === +id);
    } else if (type === "group") {
      currentOpenedUser = groupChatItems.find((item) => item.id === +id);
    } else {
      currentOpenedUser = liveChatList.find((item) => item.id === +id);
    }

    console.log(currentOpenedUser);

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Forward Button
    const selectToForwardButton = e.target.closest(".selectToForwardButton");
    if (selectToForwardButton) {
      const chatSpacerArea = selectToForwardButton.closest(".chat_spacer_area");

      // Hide all quick actions
      hideAllQuickMessageActions();

      // Show chat item checkbox
      handleSelectChatItem();

      hideAllFooterElements(chatSpacerArea);
      chatSpacerArea.querySelector(".selectionForwardCountContainer").classList.remove(HIDDEN);

      hideAllChatSectionContainers();
      forwardContainer.classList.remove(HIDDEN);
      chatSelectedType = "forward";

      hideTheDropdown();
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Reply Button on Dropdown
    const replyToButton = e.target.closest(".replyTo");
    if (replyToButton) {
      const messageIn = replyToButton.closest(".message_in");
      const chatSpacerArea = replyToButton.closest(".chat_spacer_area");
      const { messageId } = messageIn.dataset;

      handleReplyToMessage(messageId, chatSpacerArea);
      hideTheDropdown();
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Copy Button
    const copyMessageTextButton = e.target.closest(".copyMessageText");
    if (copyMessageTextButton) {
      const messageIn = copyMessageTextButton.closest(".message_in");
      const { messageId } = messageIn.dataset;

      const messages = chatMessages.find((message) => message.userId === currentOpenedUser?.id);
      const messageObject = messages.messages.find((msg) => msg.message_id === +messageId);

      hideTheDropdown();
      copyToClipboard(messageObject.message.text);
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Save Button
    const saveMessageTextButton = e.target.closest(".save");
    if (saveMessageTextButton) {
      if (saveMessageTextButton.classList.contains("active")) {
        saveMessageTextButton.classList.remove("active");
      } else {
        saveMessageTextButton.classList.add("active");
      }
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Star Button
    const starMessageTextButton = e.target.closest(".star");
    if (starMessageTextButton) {
      const { messageId } = starMessageTextButton.closest(".chat_message_item_container_first_wrapper").dataset;
      const { id: userId } = chattingAreaContainer.dataset;

      if (starMessageTextButton.classList.contains("active")) {
        starMessageTextButton.classList.remove("active");

        starredMessages = starredMessages.filter((star) => star.userId !== +userId);
        console.log(starredMessages);
      } else {
        starMessageTextButton.classList.add("active");

        starredMessages.push({
          id: Number(`${Math.random()}`.split(".").at(-1)),
          userId: +userId,
          messageId: +messageId,
        });

        console.log(starredMessages);
      }
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Report Button
    const reportButton = e.target.closest(".reportMessage");
    if (reportButton) {
      showGlobalReportModal();
      return;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    //////////////////////
    // Select To Delete Button
    const selectToDeleteButton = e.target.closest(".selectToDeleteButton");
    if (selectToDeleteButton) {
      // Hide all quick actions
      hideAllQuickMessageActions();
      // Show chat item checkbox
      handleSelectChatItem();

      chattingSpacerFooterItems.forEach((container) => container.classList.add(HIDDEN));
      selectionDeleteCountContainer.classList.remove(HIDDEN);
      chatSelectedType = "delete";

      return;
    }

    return;
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Select Message Item
  const selectChatItemButton = e.target.closest(".select_chat_item_button");
  if (selectChatItemButton) {
    const isSelected = selectChatItemButton.getAttribute("aria-selected") === "true";
    const chatSpacerArea = selectChatItemButton.closest(".chat_spacer_area");
    const selectedCountItemContainerEl = chatSelectedType === "delete" ? selectionDeleteCountContainer : chatSpacerArea.querySelector(".selectionForwardCountContainer");

    if (isSelected) {
      selectChatItemButton.setAttribute("aria-selected", false);
      chatSelectedCount -= 1;
    } else {
      const chattingAreaContainer = chatSpacerArea.querySelector(".chatting_area_container");

      selectChatItemButton.setAttribute("aria-selected", true);
      chatSelectedCount += 1;

      const { messageId } = selectChatItemButton.closest(".chat_message_item_container_first_wrapper").dataset;

      const { id } = chattingAreaContainer.dataset;
      const messages = chatMessages.find((message) => message.userId === +id);
      console.log(messages);
      const messageObject = messages.messages.find((msg) => msg.message_id === +messageId);

      forwardingData.push(messageObject);
    }

    updateSelectedCount(selectedCountItemContainerEl);
    return;
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Reply Button
  const tagForReplyButton = e.target.closest("#tagForReplyButton");
  if (tagForReplyButton) {
    const messageIn = tagForReplyButton.closest(".message_in");
    const { messageId } = messageIn.dataset;

    console.log(currentOpenedChatContainer);

    handleReplyToMessage(messageId, currentOpenedChatContainer);
    return;
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Play video
  const playVideoButton = e.target.closest(".change_video_state");
  if (playVideoButton) {
    const { mode } = playVideoButton.dataset || "idle";
    const video = playVideoButton.closest(".chat_video_message_container").querySelector("video");

    if (mode === "idle" || mode === "pause") {
      video.play();
      playVideoButton.dataset.mode = "play";
    } else if (mode === "play") {
      video.pause();
      playVideoButton.dataset.mode = "pause";
    }

    video.addEventListener("ended", () => {
      video.currentTime = 0;
      playVideoButton.dataset.mode = "idle";
    });

    return;
  }

  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  //////////////////////
  // Call Voice
  const chatMessageCall = e.target.closest(".chat_message_call");
  if (chatMessageCall) {
    showSingleCallModal();
    return;
  }
});

function handleReplyToMessage(messageId, chatSpacerArea) {
  console.log(currentOpenedUser);

  // if (currentOpenedUser) {
  const messages = chatMessages.find((message) => message.userId === currentOpenedUser?.id);
  const messageObject = messages.messages.find((msg) => msg.message_id === +messageId);

  taggedObjectInfo = messageObject;

  console.log(taggedObjectInfo);

  const tagReplyOnMessageInput = chatSpacerArea.querySelector(".tagReplyOnMessageInput");
  const taggedSliderUsername = chatSpacerArea.querySelector(".taggedSliderUsername");
  const taggedSliderContent = chatSpacerArea.querySelector(".taggedSliderContent");

  // taggedObjectInfo = taggedInfo;
  tagReplyOnMessageInput.classList.remove(HIDDEN);
  taggedSliderUsername.textContent = messageObject.sender_id === USERID ? "You" : currentOpenedUser.name;
  taggedSliderContent.textContent = messageObject.message.text;
  // }
}

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => console.error("Failed to copy text: ", err));
}

/**
 *
 *
 *
 *
 *
 * Cancel delete chat messages
 *
 *
 *
 *
 *
 */
cancelDeleteMessages.addEventListener("click", handleCancelDeleteMessage);
function handleCancelDeleteMessage() {
  // Hide chat item checkbox
  handleSelectChatItem("hide");

  chattingSpacerFooterItems.forEach((container) => container.classList.add(HIDDEN));
  chatPrimaryFooter.classList.remove(HIDDEN);
  chatSelectedType = null;
}

// Initialize the tooltip for the remaining interests
tippy("#liveChatInterestTooltipMore", {
  content: document.getElementById("interest-tooltip-markup"), // Correct ID
  allowHTML: true, // Enable HTML content inside the tooltip
  placement: "right", // Position of the tooltip
  interactive: true, // Allow interaction with the content
  animation: "fade", // Smooth fade effect
  arrow: true, // Show arrow
  theme: "custom", // Use a custom theme
  trigger: "click", // Show tooltip on click
});

// Cancel Forward
const cancelForwardMessagesBtns = document.querySelectorAll(".cancelForwardMessages");

cancelForwardMessagesBtns.forEach((button) => {
  button.addEventListener("click", () => {
    chatSelectedType = null;
    // Footer Forward Container
    button.closest(".selectionForwardCountContainer").classList.add(HIDDEN);

    button.closest("footer").querySelector(".chat_primary_footer").classList.remove(HIDDEN);

    // Hide Aside Forward Container
    forwardContainer.classList.add(HIDDEN);

    // Show Chat aside container
    showInboxContainer();

    // Hide chat item checkbox
    handleSelectChatItem("hide");

    // clear forwarding data
    forwardingData = [];
  });
});
