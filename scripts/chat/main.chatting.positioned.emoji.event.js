/**
 *
 *
 *
 * MOUSE OVER EVENT FOR POSTIONED EMOJI DISPLAY :)
 *
 *
 *
 */

function handleShowMessageItemEmoji(parentContainer) {
  const chatContainers = parentContainer.querySelectorAll(".chat_message_item_container");

  chatContainers.forEach((container) => {
    container.addEventListener("mouseenter", () => {
      const chatEmojiContainer = container.querySelector(".chat_emoji_container");
      if (chatEmojiContainer) {
        chatEmojiContainer.classList.remove(HIDDEN);
      }
    });

    container.addEventListener("mouseleave", () => {
      const chatEmojiContainer = container.querySelector(".chat_emoji_container");
      if (chatEmojiContainer) {
        chatEmojiContainer.classList.add(HIDDEN);
      }
    });
  });
}
