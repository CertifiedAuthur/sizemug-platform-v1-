document.addEventListener("DOMContentLoaded", function () {
  // Messages data array
  const messages = [
    {
      id: 1,
      username: "Maude Hall",
      initials: "MH",
      avatarColor: "#F8D7DA",
      time: "14 min",
      text: "That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.",
      likes: 2,
      isLiked: false,
      isPartial: false,
    },
    {
      id: 2,
      username: "James Parker",
      initials: "JP",
      avatarColor: "#FFF3CD",
      time: "22 min",
      text: "The design is visually appealing and easy to navigate. Kudos to everyone involved!",
      likes: 5,
      isLiked: false,
      isPartial: false,
    },
    {
      id: 3,
      username: "Sofia Martinez",
      initials: "SM",
      avatarColor: "#D1E7DD",
      time: "10 min",
      text: "I love the way you organized the information. It makes it very user-friendly!",
      likes: 3,
      isLiked: false,
      isPartial: false,
    },
    {
      id: 4,
      username: "Liam Chen",
      initials: "LC",
      avatarColor: "#CFF4FC",
      time: "5 min",
      text: "",
      likes: 0,
      isLiked: false,
      isPartial: true,
    },
  ];

  // DOM Elements
  const openMessageModalBtn = document.getElementById("openMessageModalBtn");
  const messageModalOverlay = document.getElementById("messageModalOverlay");
  const messageCloseBtn = document.getElementById("messageCloseBtn");
  const messageContent = document.getElementById("messageContent");
  const messageInput = document.querySelector(".message-input");

  let popperInstance = null;

  // Initialize Popper
  function createPopper() {
    if (popperInstance) {
      popperInstance.destroy();
    }

    popperInstance = Popper.createPopper(openMessageModalBtn, messageModalOverlay, {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 20],
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "right", "left"],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: document.body,
            padding: 10,
          },
        },
      ],
    });
  }

  function updatePopperPosition() {
    if (popperInstance) {
      popperInstance.update();
    }
  }

  function closeModal() {
    messageModalOverlay.style.display = "none";
    openMessageModalBtn.classList.remove("edit_tool--active");

    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  }

  // Render messages
  function renderMessages() {
    messageContent.innerHTML = "";

    messages.forEach((message) => {
      const messageElement = document.createElement("div");
      messageElement.className = `message-item ${message.isPartial ? "message-item-partial" : ""}`;
      messageElement.dataset.id = message.id;

      // For partial messages (like the last one that's cut off)
      if (message.isPartial) {
        messageElement.innerHTML = `
                <div class="message-avatar" style="background-color: ${message.avatarColor};">
                  <span>${message.initials}</span>
                </div>
                <div class="message-body message-body-partial">
                  <div class="message-user-info">
                    <span class="message-username">${message.username}</span>
                    <span class="message-time">${message.time}</span>
                  </div>
                </div>
              `;
      } else {
        messageElement.innerHTML = `
                <div class="message-avatar" style="background-color: ${message.avatarColor};">
                  <span>${message.initials}</span>
                </div>
                <div class="message-body">
                  <div class="message-user-info">
                    <span class="message-username">${message.username}</span>
                    <span class="message-time">${message.time}</span>
                  </div>
                  <p class="message-text">${message.text}</p>
                  <div class="message-actions">
                    <div class="message-likes">
                      <span>${message.likes} Likes</span>
                    </div>
                    <button class="message-reply-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 17 4 12 9 7"></polyline>
                        <path d="M20 18v-2a4 4 0 0 0-4-4H4"></path>
                      </svg>
                      Reply
                    </button>
                    <button class="message-like-btn ${message.isLiked ? "active" : ""}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              `;
      }

      messageContent.appendChild(messageElement);
    });

    // Add event listeners after rendering
    addEventListeners();
  }

  // Add event listeners to dynamically created elements
  function addEventListeners() {
    // Like functionality
    document.querySelectorAll(".message-like-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const messageItem = this.closest(".message-item");
        const messageId = parseInt(messageItem.dataset.id);
        const message = messages.find((m) => m.id === messageId);

        if (message) {
          // Toggle like status
          message.isLiked = !message.isLiked;

          // Update likes count
          if (message.isLiked) {
            message.likes++;
          } else {
            message.likes--;
          }

          // Update UI
          this.classList.toggle("active");
          const likesElement = messageItem.querySelector(".message-likes span");
          likesElement.textContent = `${message.likes} Likes`;
        }
      });
    });

    // Reply functionality
    document.querySelectorAll(".message-reply-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const username = this.closest(".message-item").querySelector(".message-username").textContent;
        messageInput.value = `@${username} `;
        messageInput.focus();
      });
    });
  }

  // Open modal
  openMessageModalBtn.addEventListener("click", function () {
    messageModalOverlay.style.display = "flex";
    createPopper();

    renderMessages(); // Render messages when opening the modal

    // Update position after display
    setTimeout(() => {
      updatePopperPosition();
    }, 10);
  });

  // Close modal
  messageCloseBtn.addEventListener("click", closeModal);
  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (!messageModalOverlay.contains(e.target) && !e.target.closest("#openMessageModalBtn")) {
      closeModal();
    }
  };

  // Add the event listener
  document.addEventListener("click", handleOutsideClick);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // Handle comment submission
  messageInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter" && this.value.trim()) {
      // Create a new message object
      const newMessage = {
        id: messages.length + 1,
        username: "Current User", // You would typically get this from the logged-in user
        initials: "CU",
        avatarColor: "#E7F5FF",
        time: "Just now",
        text: this.value,
        likes: 0,
        isLiked: false,
        isPartial: false,
      };

      // Add to messages array
      messages.unshift(newMessage); // Add to the beginning

      // Re-render messages
      renderMessages();

      // Clear the input
      this.value = "";
    }
  });
});
