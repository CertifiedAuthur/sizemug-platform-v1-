const messageInputs = document.querySelectorAll(".chat-message-input");
const sendNewMessageEvent = document.querySelectorAll(".send_new_message_event");

const sendDocumentImageVideo = document.getElementById("sendDocumentImageVideo");

messageInputs.forEach((messageInput) => {
  messageInput.addEventListener("input", function (event) {
    const footer = event.target.closest("footer");
    const content = this.textContent.trim(); // Remove extra spaces

    messageInput.setAttribute("role", "textbox");
    messageInput.setAttribute("aria-multiline", "true");

    const aiSuggestionTextsWrapper = footer.querySelector(".ai_suggested_texts_wrapper");
    const sendNewMessage = footer.querySelector(".send_new_message_event");

    //
    findUserChatInteractingWith(messageInput);

    if (content.length > 0) {
      aiSuggestionTextsWrapper.classList.remove(HIDDEN);
      sendNewMessage.setAttribute("aria-label", "text");
    } else {
      aiSuggestionTextsWrapper.classList.add(HIDDEN);
      sendNewMessage.setAttribute("aria-label", "Voice message");
    }
  });

  messageInput.addEventListener("focus", (event) => {
    findUserChatInteractingWith(messageInput);
  });

  // Handle keydown event for Enter key
  messageInput.addEventListener("keydown", (event) => {
    // Listen for send event
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent adding a new line
      const content = messageInput.innerHTML;

      sendMessage(content); // Send Message
      messageInput.innerHTML = ""; // Clear the input
    }
  });

  function findUserChatInteractingWith(input) {
    const chattingAreaContainer = input.closest(".chatting_area_container");

    const { id, type } = chattingAreaContainer.dataset;

    if (type === "chat") {
      currentOpenedUser = chatItems.find((chat) => chat.id === +id);
    } else if (type === "group") {
      currentOpenedUser = groupChatItems.find((group) => group.id === +id);
    } else if (type === "lives") {
      currentOpenedUser = liveChatList.find((live) => live.id === +id);
    }

    currentChattingInfo = { id, type };
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
 */
let firstTimeUserMessageData = [];

// Send text messages
sendNewMessageEvent.forEach((sendNewMessage) => {
  sendNewMessage.addEventListener("click", function () {
    // const chatPrimaryFooter = e.target.closest(".chat_primary_footer");

    const footer = sendNewMessage.closest("footer");
    const chattingSpacerFooterItems = footer.closest(".chat_spacer_area").querySelectorAll(".chattingSpacerFooter>div");

    // For voice recording
    const label = this.getAttribute("aria-label");
    if (label === "Voice message") {
      const voiceRecordingFooter = footer.querySelector(".voiceRecordingFooter");

      chattingSpacerFooterItems.forEach((item) => item.classList.add(HIDDEN));
      voiceRecordingFooter.classList.remove(HIDDEN);

      // For text sending
    } else if (label === "text") {
      const { type } = this.dataset;
      const messageInput = footer.querySelector(".chat-message-input");

      const content = messageInput.innerHTML;

      messageInput.innerHTML = "";

      if (!type && content.trim() !== "") {
        // Purify the input
        const cleanInput = DOMPurify.sanitize(content);
        const formattedMessage = convertLinksToAnchors(cleanInput);

        // For new user who sent request message
        const firstTimeOnChat = this.getAttribute("data-user-type") === "new";
        if (firstTimeOnChat) {
          const message = {
            sender_id: USERID,
            receiver_id: 45678907987645,
            message_id: Math.random(),
            type: "text",
            phtotos: null,
            message: {
              text: formattedMessage,
            },
            timestamp: 871639172390,
            status: "sent",
          };

          firstTimeUserMessageData.push(message);

          handleSendMessageAsRequest({ messages: firstTimeUserMessageData });

          messageInput.innerHTML = "";
          aiSuggestionTextsWrapper.classList.add(HIDDEN);

          const markup = `
          <div class="first_timer_user_info">
            <div class="passing_message">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#677080" fill-rule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-.75-12v7h1.5v-7zM12 9a1 1 0 1 0 0-2a1 1 0 0 0 0 2"/></svg>
              </div>
              <div>Your message has been sent as a request to Pena Only 4 message is allowed in total until user accepts your request. Stay connected and enjoy Sizemug Live.</div>
            </div>
          </div>
        `;
          chattingContainerMessage.insertAdjacentHTML("beforeend", markup);
          return;
        }

        sendMessage(formattedMessage);
      }
    }
  });
});

// Documents/Images/Videos
sendDocumentImageVideo.addEventListener("click", function () {
  const { type } = this.dataset;
  const content = messageInput.innerHTML;

  // Purify the input
  const cleanInput = DOMPurify.sanitize(content);

  if (type === "photo") {
    sendPhotoToChat(cleanInput);
  } else if (type === "video") {
    sendVideoToChat(cleanInput);
  } else if (type === "document") {
    sendDocumentToChat(cleanInput);
  }
});

// Function to send the message
function sendMessage(content) {
  const taggedData = !taggedObjectInfo
    ? null
    : {
        text: taggedObjectInfo.message.text,
        userId: taggedObjectInfo.sender_id,
        taggedMessageId: taggedObjectInfo.message_id,
      };

  if (currentOpenedUser && currentChattingInfo) {
    const messageSender = new ChatMessageSender();
    messageSender.sendMessage({
      content,
      type: "text",
      currentOpenedUser,
      currentChattingInfo,
      taggedData,
    });
  }
}

// Function to send photo to chat
function sendPhotoToChat(content) {
  if (currentOpenedUser && currentChattingInfo) {
    // Chat Single User
    if (currentChattingInfo.type === "chat") {
      chatMessages.map((chat) => {
        if (chat.userId !== currentOpenedUser.id) {
          return chat;
        } else {
          chat.messages.push({
            sender_id: USERID,
            receiver_id: 8192709189,
            message_id: Math.random(),
            type: "photo",
            message: {
              text: content,
            },
            photos: previewImage,
            timestamp: "1670001001",
            status: "sent",
          });

          return chat;
        }
      });

      const messagesItem = chatMessages.find((message) => message.userId === +currentOpenedUser.id);
      const chattingContainerMessage = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"] .chatting_container_message`);

      invalidateChattingMessages(messagesItem, chattingContainerMessage);

      // Hide image preview Modal
      hidePicturePreviewModal();
    }
  }
}

// Function to send video to chat
function sendVideoToChat(content) {
  if (currentOpenedUser && currentChattingInfo) {
    // Chat Single User
    if (currentChattingInfo.type === "chat") {
      chatMessages.map((chat) => {
        if (chat.userId !== currentOpenedUser.id) {
          return chat;
        } else {
          chat.messages.push({
            sender_id: USERID,
            receiver_id: 8192709189,
            message_id: Math.random(),
            type: "video",
            message: {
              text: content,
              // tagged_message: taggedData,
            },
            photos: null,
            videoURL: previewVideoBlobURL,
            timestamp: "1670001001",
            status: "sent",
          });

          return chat;
        }
      });
      // messageInput.innerHTML = ""; // Clear the input

      const messagesItem = chatMessages.find((message) => message.userId === +currentOpenedUser.id);
      const chattingContainerMessage = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"] .chatting_container_message`);

      invalidateChattingMessages(messagesItem, chattingContainerMessage);

      // Hide image preview Modal
      hideVideoPreviewModal();
    }
  }
}

// Function to send document to chat
function sendDocumentToChat(content) {
  if (currentOpenedUser && currentChattingInfo) {
    // Chat Single User
    if (currentChattingInfo.type === "chat") {
      chatMessages.map((chat) => {
        if (chat.userId !== currentOpenedUser.id) {
          return chat;
        } else {
          chat.messages.push({
            sender_id: USERID,
            receiver_id: 8192709189,
            message_id: Math.random(),
            type: "document",
            message: {
              text: content,
              // tagged_message: taggedData,
            },
            photos: null,
            videoURL: null,
            document: previewDocumentInfo,
            timestamp: "1670001001",
            status: "sent",
          });

          return chat;
        }
      });
      // messageInput.innerHTML = ""; // Clear the input

      const messagesItem = chatMessages.find((message) => message.userId === +currentOpenedUser.id);
      const chattingContainerMessage = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"] .chatting_container_message`);

      invalidateChattingMessages(messagesItem, chattingContainerMessage);

      // Hide image preview Modal
      hideDocumentPreviewModal();
    }
  }
}

// Function that handles first time user sending message to followed user :)
function handleSendMessageAsRequest(messagesItem) {
  invalidateChattingMessages(messagesItem);
}
