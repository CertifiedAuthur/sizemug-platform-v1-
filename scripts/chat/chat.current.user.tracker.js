/**
 * A class to track the currently active chat layout based on user interaction.
 * It listens for focus events on input fields and click events on chat containers.
 */
class ChatCurrentUserTracker {
  /**
   * @param {HTMLElement[]} chatContainers - An array of HTML elements, where each element is the main container for a chat layout.
   */
  constructor(chatContainers) {
    // Store the chat container elements
    this.chatContainers = chatContainers;

    console.log(this.chatContainers);

    this.currentOpenedUser = null;
    this.currentChattingInfo = null;

    // Bind event handlers to the class instance
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this); // Added focusout handler

    // Set up event listeners for all chat containers
    this.setupListeners();
  }

  /**
   * Sets up the necessary event listeners on all provided chat containers.
   */
  setupListeners() {
    this.chatContainers.forEach((container) => {
      // Add click listener to the entire container
      container.addEventListener("click", this.handleClick);

      // Find input fields within the container and add focus listeners
      // Using focusin/focusout as they bubble
      const inputFields = container.querySelectorAll("input.chat-message-input");
      inputFields.forEach((input) => {
        input.addEventListener("focusin", this.handleFocusIn);
        input.addEventListener("focusout", this.handleFocusOut); // Listen for focusout
      });

      // Add a data attribute to easily identify the container associated with an event
      //       container.dataset.chatId = container.id || `chat-${Math.random().toString(36).substr(2, 9)}`; // Assign a unique ID if none exists
    });
  }

  /**
   * Handles the focusin event on an input field.
   * @param {FocusEvent} event - The focusin event object.
   */
  handleFocusIn(event) {
    // Find the closest chat container ancestor of the focused element
    const chatContainer = event.target.closest(".chatting_area_container");

    if (chatContainer) {
      this.setActiveChat(chatContainer);
    }
  }

  /**
   * Handles the focusout event on an input field.
   * This is useful if you want to potentially clear the active state
   * when the user leaves the input field, although often you keep
   * the chat active until another one is explicitly selected or focused.
   * For this class, we primarily rely on focusin/click to set active.
   * You might extend this if needed for specific UI behaviors.
   * @param {FocusEvent} event - The focusout event object.
   */
  handleFocusOut(event) {
    // Optional: Add logic here if you need to react when an input loses focus.
    // For now, we keep the active chat set by focusin/click.
    // console.log('Input lost focus in chat:', event.target.closest('[data-chat-id]').dataset.chatId);
  }

  /**
   * Handles the click event on a chat container.
   * @param {MouseEvent} event - The click event object.
   */
  handleClick(event) {
    // Find the closest chat container ancestor of the clicked element
    const chatContainer = event.target.closest(".chatting_area_container");
    if (chatContainer) {
      // Prevent setting active if the click was inside an input field that already handled focusin
      // This avoids redundant calls and potential issues if focusin/click fire very closely
      if (!event.target.matches("input.chat-message-input")) {
        this.setActiveChat(chatContainer);
      }
    }
  }

  /**
   * Sets the provided chat container as the active one.
   * You can add logic here to visually highlight the active chat.
   * @param {HTMLElement} chatElement - The chat container element to set as active.
   */
  setActiveChat(chatElement) {
    if (this.currentOpenedUser?.id === chatElement.dataset.id) {
      // If it's already the active chat, do nothing
      return;
    }

    const { id, type } = chatElement.dataset;

    if (type === "chat") {
      this.currentOpenedUser = chatItems.find((chat) => chat.id === +id);
    } else if (type === "group") {
      this.currentOpenedUser = groupChatItems.find((group) => group.id === +id);
    } else if (type === "lives") {
      this.currentOpenedUser = liveChatList.find((live) => live.id === +id);
    }

    console.log("Active chat changed to:", currentOpenedUser); // Log the active chat ID
    // Make it global within this class later ):
    this.currentOpenedUser = currentOpenedUser;
    this.currentChattingInfo = { id, type };

    // return { currentOpenedUser, currentChattingInfo };
  }

  /**
   * Gets the currently active chat container element.
   * @returns {HTMLElement|null} The active chat container element, or null if none is active.
   */
  getActiveChat() {
    return { currentOpenedUser: this.currentOpenedUser, currentChattingInfo: this.currentChattingInfo };
  }

  /**
   * Cleans up event listeners when the tracker is no longer needed.
   */
  destroy() {
    this.chatContainers.forEach((container) => {
      container.removeEventListener("click", this.handleClick);
      const inputFields = container.querySelectorAll('input[type="text"], textarea');
      inputFields.forEach((input) => {
        input.removeEventListener("focusin", this.handleFocusIn);
        input.removeEventListener("focusout", this.handleFocusOut);
      });
    });
  }
}

// Example Usage (assuming you have HTML elements with class 'chat-container')

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Get all elements that represent a chat layout container
  const chatContainers = document.querySelectorAll(".chatting_area_container");

  if (chatContainers.length > 0) {
    // Create an instance of the ChatCurrentUserTracker
    const tracker = new ChatCurrentUserTracker(chatContainers);
  } else {
    console.warn("No elements with class 'chat-container' found. ChatCurrentUserTracker not initialized.");
  }
});
