const userMessageItems = document.getElementById("user_message_items");

const notifyMessage = [
  {
    timestamp: "Just Now",
    type: "text",
    content: "Hello, I'm having trouble using a feature on...",
    status: "unread",
    online: false,
  },
  {
    timestamp: "Just Now",
    type: "text",
    content: "Hi there, I accidentally purchased the wron...",
    status: "unread",
    online: true,
  },
  {
    sender: "Robert Fox",
    timestamp: "Just Now",
    type: "text",
    content: "You: 🧊 Lately, I've been feeling a bit down, an...",
    status: "read",
    online: true,
  },
  {
    timestamp: "1 min ago",
    type: "text",
    content: "🙏💕 Grateful for the support and understandi...",
    status: "read",
    online: true,
  },
  {
    timestamp: "2 min ago",
    type: "text",
    content: "You: 🧊 Lately, I've been feeling a bit down, an...",
    status: "read",
    online: false,
  },
  {
    sender: "Wade Warren",
    timestamp: "4 days ago",
    type: "text",
    content: "🤣📚 Reading opens up new worlds. I'm curren...",
    status: "read",
    online: true,
  },
  {
    timestamp: "2 min ago",
    type: "image",
    content: "Sent you an image",
    status: "read",
    online: false,
  },
  {
    timestamp: "2 min ago",
    type: "video",
    content: "Sent you a video",
    status: "read",
    online: false,
  },
  {
    timestamp: "2 min ago",
    type: "task",
    content: "Shared a task with you",
    status: "read",
    online: true,
  },
  {
    timestamp: "2 min ago",
    type: "document",
    content: "Document name",
    status: "read",
    online: true,
  },
  {
    timestamp: "Just Now",
    type: "call",
    callType: "video",
    content: "Missed video call",
    status: "missed",
    online: false,
  },
  {
    timestamp: "Just Now",
    type: "call",
    callType: "video",
    content: "Incoming video call",
    status: "incoming",
    online: true,
  },
  {
    timestamp: "Just Now",
    type: "call",
    callType: "voice",
    content: "Missed voice call",
    status: "missed",
    online: false,
  },
  {
    timestamp: "Just Now",
    type: "call",
    callType: "voice",
    content: "Incoming voice call",
    status: "incoming",
    online: true,
  },
];

async function getUserMessages() {
  const response = await fetch(`https://randomuser.me/api/?results=20`);
  const data = await response.json();

  // Helper function to return a random number in a range
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return data.results.slice(0, notifyMessage.length).map((user, i) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.medium,
      ...notifyMessage[i],
    };
  });
}

function renderUserMessages(msgs) {
  msgs.forEach((msg) => {
    const fileIcon =
      msg.type === "image"
        ? `<img src="/images/chat/icons/image-icon.svg"/>`
        : msg.type === "video"
        ? `<img src="/images/chat/icons/video-icon.svg"/>`
        : msg.type === "document"
        ? `<img src="/images/chat/icons/document-icon.svg"/>`
        : msg.type === "task"
        ? `<img src="/images/chat/icons/task-icon.svg"/>`
        : "";

    const html = `
           <a class="top-message-item ${
             msg.newMessage ? "new-message" : ""
           }" href="#">
                  <div class="sender__avatar">
                    <img src="${msg.avatar}" alt="${msg.name}" />
                    <span class="online_status ${
                      !msg.online ? "offline" : "active"
                    }"></span>
                  </div>
                  <div class="notify-sender-message">
                    <div class="sender__name__time">
                      <div class="sender__name">${msg.name}</div>
                      <span class="dot__separator">&bull;</span>
                      <div class="send__time">${msg.timestamp}</div>
                    </div>
                    <p class="message__slug">${fileIcon} <span>${
      msg.content
    }</span></p>
                  </div>
                  <div class="message__indicator">
                  ${
                    msg.type === "call" &&
                    msg.callType === "video" &&
                    msg.status === "missed"
                      ? `
                      <svg width="18" height="18" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5H15C16.1 6.5 17 7.4 17 8.5V16.5C17 17.6 16.1 18.5 15 18.5H4C2.9 18.5 2 17.6 2 16.5V8.5C2 7.4 2.9 6.5 4 6.5Z" fill="#FF3B30"></path><path d="M22 18L17 15V10L22 7V18Z" fill="#FF3B30"></path></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="#FF3B30" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 6L6 18m0 0V9m0 9h9"/></svg>
                      `
                      : msg.type === "call" &&
                        msg.callType === "video" &&
                        msg.status === "incoming"
                      ? `
                      <svg width="18" height="18" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5H15C16.1 6.5 17 7.4 17 8.5V16.5C17 17.6 16.1 18.5 15 18.5H4C2.9 18.5 2 17.6 2 16.5V8.5C2 7.4 2.9 6.5 4 6.5Z" fill="#12b76a"></path><path d="M22 18L17 15V10L22 7V18Z" fill="#12b76a"></path></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="#12b76a" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 6L6 18m0 0V9m0 9h9"/></svg>
                      `
                      : msg.type === "call" &&
                        msg.callType === "voice" &&
                        msg.status === "missed"
                      ? `
                      <svg width="14" height="14" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.67962 2.63617L4.60868 0.707107C4.99921 0.316582 5.63237 0.316583 6.0229 0.707108L9.66131 4.34552C10.0518 4.73605 10.0518 5.36921 9.66131 5.75974L7.21113 8.20992C6.8336 8.58745 6.74 9.16422 6.97878 9.64177C8.3591 12.4024 10.5976 14.6409 13.3582 16.0212C13.8358 16.26 14.4125 16.1664 14.7901 15.7889L17.2403 13.3387C17.6308 12.9482 18.264 12.9482 18.6545 13.3387L22.2929 16.9771C22.6834 17.3676 22.6834 18.0008 22.2929 18.3913L20.3638 20.3204C18.2525 22.4317 14.9099 22.6693 12.5212 20.8777L9.20752 18.3925C7.46399 17.0848 5.91517 15.536 4.60752 13.7925L2.12226 10.4788C0.330722 8.09009 0.568272 4.74752 2.67962 2.63617Z" fill="#FF3B30"></path></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="#FF3B30" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 6L6 18m0 0V9m0 9h9"/></svg>
                      `
                      : msg.type === "call" &&
                        msg.callType === "voice" &&
                        msg.status === "incoming"
                      ? `
                      <svg width="14" height="14" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.67962 2.63617L4.60868 0.707107C4.99921 0.316582 5.63237 0.316583 6.0229 0.707108L9.66131 4.34552C10.0518 4.73605 10.0518 5.36921 9.66131 5.75974L7.21113 8.20992C6.8336 8.58745 6.74 9.16422 6.97878 9.64177C8.3591 12.4024 10.5976 14.6409 13.3582 16.0212C13.8358 16.26 14.4125 16.1664 14.7901 15.7889L17.2403 13.3387C17.6308 12.9482 18.264 12.9482 18.6545 13.3387L22.2929 16.9771C22.6834 17.3676 22.6834 18.0008 22.2929 18.3913L20.3638 20.3204C18.2525 22.4317 14.9099 22.6693 12.5212 20.8777L9.20752 18.3925C7.46399 17.0848 5.91517 15.536 4.60752 13.7925L2.12226 10.4788C0.330722 8.09009 0.568272 4.74752 2.67962 2.63617Z" fill="#12b76a"></path></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="#12b76a" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18 6L6 18m0 0V9m0 9h9"/></svg>
                      `
                      : ""
                  }
                  ${msg.status === "unread" ? `<span class="red"></span>` : ""}
                  </div>
                </a>
  `;

    userMessageItems.insertAdjacentHTML("beforeend", html);
  });
}
