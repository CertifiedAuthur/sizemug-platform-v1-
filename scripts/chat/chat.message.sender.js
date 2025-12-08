class ChatMessageSender {
  constructor() {
    this.USERID = window.USERID; // Assuming USERID is globally available
  }

  /**
   * Sends a message to the appropriate chat type
   * @param {Object} options - Message options
   * @param {string} options.content - Message content
   * @param {string} options.type - Message type (text, photo, video, document)
   * @param {Object} options.currentOpenedUser - Current opened user/group info
   * @param {Object} options.currentChattingInfo - Current chat info
   * @param {Object} options.taggedData - Optional tagged message data
   * @returns {void}
   */
  sendMessage({ content, type = "text", currentOpenedUser, currentChattingInfo, taggedData = null, liveChatGameInfo = {} }) {
    console.log(currentOpenedUser, currentChattingInfo);

    if (!currentOpenedUser || !currentChattingInfo) {
      console.error("Missing required chat information");
      return;
    }

    switch (currentChattingInfo.type) {
      case "chat":
        this.sendToSingleChat(content, type, currentOpenedUser, currentChattingInfo, taggedData);
        break;
      case "group":
        this.sendToGroupChat(content, type, currentOpenedUser, currentChattingInfo);
        break;
      case "lives":
        this.sendToLiveChat(content, currentChattingInfo, liveChatGameInfo);
        break;
      default:
        console.error("Invalid chat type");
    }
  }

  /**
   * Sends message to a single chat
   * @private
   */
  sendToSingleChat(content, type, currentOpenedUser, currentChattingInfo, taggedData) {
    const messageData = {
      sender_id: this.USERID,
      receiver_id: currentOpenedUser.id,
      message_id: Math.random(),
      type: type,
      photos: null,
      message: {
        text: content,
        tagged_message: taggedData,
      },
      timestamp: Date.now(),
      status: "sent",
    };

    // Update chat messages
    chatMessages.map((chat) => {
      if (chat.userId !== currentOpenedUser.id) {
        return chat;
      }
      chat.messages.push(messageData);
      return chat;
    });

    // Update UI
    const messagesItem = chatMessages.find((message) => message.userId === +currentOpenedUser.id);
    const chattingAreaContainer = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"]`);
    const chattingContainerMessage = chattingAreaContainer.querySelector(`.chatting_container_message`);
    const aiSuggestedTextsWrapper = chattingAreaContainer.querySelector(".ai_suggested_texts_wrapper");
    const tagReplyOnMessageInput = chattingAreaContainer.querySelector(".tagReplyOnMessageInput");

    aiSuggestedTextsWrapper?.classList.add(HIDDEN);
    tagReplyOnMessageInput?.classList.add(HIDDEN);
    invalidateChattingMessages(messagesItem, chattingContainerMessage);
  }

  /**
   * Sends message to a group chat
   * @private
   */
  sendToGroupChat(content, type, currentOpenedUser, currentChattingInfo) {
    const messageData = {
      messageId: Math.random(),
      groupId: +currentChattingInfo.id,
      senderId: {
        id: this.USERID,
        image: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        name: "Tunde",
      },
      type: type,
      message: content,
      taggedId: null,
      photos: null,
      document: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: [],
    };

    groupMessages.push(messageData);

    // Update UI
    const groupItemMessages = groupMessages.filter((msg) => msg.groupId === +currentChattingInfo.id);
    const chattingAreaContainer = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"]`);
    const chattingContainerMessage = chattingAreaContainer.querySelector(`.chatting_container_message`);
    const aiSuggestedTextsWrapper = chattingAreaContainer.querySelector(".ai_suggested_texts_wrapper");

    aiSuggestedTextsWrapper?.classList.add(HIDDEN);
    invalidateGroupChattingMessages(groupItemMessages, chattingContainerMessage);
  }

  /**
   * Sends message to a live chat
   * @private
   */
  sendToLiveChat(content, currentChattingInfo, liveChatGameInfo = {}) {
    const messageData = {
      messageId: Math.random(),
      liveId: +currentChattingInfo.id,
      senderId: {
        id: this.USERID,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        name: "Amara",
      },
      type: "lives",
      message: content,
      taggedId: null,
      photos: null,
      document: null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      reactions: [],
      liveChatGameInfo,
    };

    liveMessages.push(messageData);

    // Update UI
    const liveItemMessages = liveMessages.filter((msg) => msg.liveId === +currentChattingInfo.id);
    const chattingAreaContainer = document.querySelector(`.chatting_area_container[data-id="${currentChattingInfo.id}"]`);
    const chattingContainerMessage = chattingAreaContainer.querySelector(`.chatting_container_message`);
    const aiSuggestedTextsWrapper = chattingAreaContainer.querySelector(".ai_suggested_texts_wrapper");

    aiSuggestedTextsWrapper?.classList.add(HIDDEN);
    invalidateGroupChattingMessages(liveItemMessages, chattingContainerMessage);
  }
}

// Export the class
window.ChatMessageSender = ChatMessageSender;
