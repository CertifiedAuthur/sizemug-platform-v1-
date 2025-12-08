document.addEventListener("DOMContentLoaded", () => {
  // Function to mark a message as opened
  function markMessageAsOpened(messageElement) {
    messageElement.classList.remove("message-unopened");
    messageElement.classList.add("message-opened");
  }

  // Example: Attach click event to the message item
  const messageItems = document.querySelectorAll(".notification_message");

  messageItems.forEach((messageItem) => {
    messageItem.addEventListener("click", () => {
      if (messageItem.classList.contains("message-unopened")) {
        markMessageAsOpened(messageItem);
      }
    });
  });

  // Example: Attach click event to the sender item
  const senderItems = document.querySelectorAll(".notification_sender");

  senderItems.forEach((senderItem) => {
    senderItem.addEventListener("click", () => {
      if (senderItem.classList.contains("message-unopened")) {
        markMessageAsOpened(senderItem);
      }
    });
  });
});
