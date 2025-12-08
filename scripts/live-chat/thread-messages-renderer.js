/* ============================================
   Thread Messages Renderer - Class-based Implementation
   ============================================ */

class ThreadMessagesRenderer {
  constructor() {
    this.messagesContainer = null;
    this.messages = [];
    this.currentThread = null;
    this.init();
  }

  // Initialize the renderer
  init() {
    this.messagesContainer = document.getElementById("threadChatMessages");
    if (!this.messagesContainer) {
      console.warn("Thread messages container not found");
      return;
    }

    this.setupEventListeners();
  }

  // Setup event listeners
  setupEventListeners() {
    // Listen for custom events from ThreadsManager
    document.addEventListener("threadSelected", (e) => {
      this.loadMessages(e.detail.thread);
    });

    // Listen for new message events
    document.addEventListener("newThreadMessage", (e) => {
      this.addMessage(e.detail.message);
    });
  }

  // Load messages for a thread
  loadMessages(thread) {
    this.currentThread = thread;
    this.messages = this.getSampleMessages(thread);
    this.render();
  }

  // Apply space color to messages
  applySpaceColor(color) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const rgb = hexToRgb(color);
    if (rgb) {
      // Set CSS custom properties for space color
      document.documentElement.style.setProperty("--space-color", color);
      document.documentElement.style.setProperty("--space-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
  }

  // Legacy method name for compatibility
  applyThreadColor(color) {
    this.applySpaceColor(color);
    if (!this.messagesContainer) return;

    // Set CSS custom property for the thread color
    this.messagesContainer.style.setProperty("--thread-color", color);

    // Create a lighter version for background (with opacity)
    const rgb = this.hexToRgb(color);
    if (rgb) {
      this.messagesContainer.style.setProperty("--thread-color-light", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      this.messagesContainer.style.setProperty("--thread-color-medium", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
    }
  }

  // Convert hex color to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Get sample messages (replace with API call in production)
  getSampleMessages(thread) {
    return [
      {
        id: 1,
        author: "John Deo",
        role: "Curator",
        avatar: "./icons/Avatar.svg",
        time: "2:40 PM",
        text: "Hey everyone 👋 — just finished the final color grade for my short 'Silent Echo.' It's supposed to feel cold and lonely, but I'm worried it might look too flat.",
        images: ["https://plus.unsplash.com/premium_photo-1760441128908-4753770afdec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://images.unsplash.com/photo-1761133135231-2f2fe70907e7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900", "https://plus.unsplash.com/premium_photo-1760972190929-3974abab84f6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=900"],
        reactions: { react: 0, reply: 0, love: 24000 },
        replies: [],
      },
      {
        id: 2,
        author: "Brooklyn Simmons",
        role: "Member",
        avatar: "./icons/Avatar.svg",
        time: "2:40 PM",
        text: "Hey everyone 👋 — just finished the final color grade for my short 'Silent Echo.' It's supposed to feel cold and lonely, but I'm worried it might look too flat.",
        reactions: { react: 0, reply: 0, love: 0 },
        replies: [],
      },
      {
        id: 3,
        author: "Albert Flores",
        role: "Member",
        avatar: "./icons/Avatar.svg",
        time: "2:40 PM",
        text: "Wow, the tone's great — definitely gives 'isolation in motion' vibes. But I'd bump up contrast slightly between the midtones and shadows. Also, try adding a faint blue tint to the highlights — it'll deepen that cold atmosphere.",
        reactions: { react: 0, reply: 100, love: 0 },
        replies: [
          {
            id: 31,
            author: "John Deo",
            role: "Curator",
            avatar: "./icons/Avatar.svg",
            time: "2:40 PM",
            text: "Agreed. Maybe also add a soft wind sound or distant hum to reinforce the lonely mood. Visuals are already strong 👏",
            replyingTo: "John Deo",
            reactions: { react: 0, reply: 0, love: 0 },
          },
        ],
      },
      {
        id: 4,
        author: "Jacob Jones",
        role: "Member",
        avatar: "./icons/Avatar.svg",
        time: "2:40 PM",
        text: "Good call! I didn't think about ambient sound — I'll test both the color and audio tweaks. Thanks, y'all 🙏",
        reactions: { react: 0, reply: 0, love: 0 },
        replies: [],
      },
      {
        id: 5,
        author: "John Deo",
        role: "Curator",
        avatar: "./icons/Avatar.svg",
        time: "2:40 PM",
        text: "Lina, love this direction. When you're done, post a side-by-side frame comparison",
        reactions: { react: 0, reply: 0, love: 0 },
        replies: [],
      },
    ];
  }

  // Render all messages
  render() {
    if (!this.messagesContainer) {
      console.error("❌ Cannot render: messagesContainer not found");
      return;
    }

    const loadMoreButton = this.createLoadMoreButton();
    const messagesHTML = this.messages.map((msg) => this.createMessageHTML(msg)).join("");

    this.messagesContainer.innerHTML = `
      ${loadMoreButton}
      ${messagesHTML}
    `;

    this.attachMessageListeners();
    this.scrollToBottom();
    this.showThreadAsideContainerInfo();
  }

  showThreadAsideContainerInfo() {
    if (!this.currentThread && window.spacesManager) return;

    const thread = this.currentThread;
    const space = window.spacesManager.getSpace(thread.spaceId);

    const containers = document.querySelectorAll(".live-chat-container .space-thread-aside-container");
    const asideThreadContainer = document.getElementById("asideThreadContainer");

    containers.forEach((container) => container.classList.add(HIDDEN));
    asideThreadContainer.classList.remove(HIDDEN);

    // Update Thread Name
    const asideThreadName = asideThreadContainer.querySelector(".aside-announcement-title");
    if (asideThreadName) {
      asideThreadName.textContent = thread.name;
    }

    // Thread Visibility Icon
    const visibilityIconEl = asideThreadContainer.querySelector(".visibility-icon");
    const visibilityText = asideThreadContainer.querySelector(".visibility-text");
    visibilityIconEl.innerHTML = "";
    visibilityText.innerHTML = "";
    const visibilityIcon = thread?.isPrivate ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M12 21C4.75561 13.08 8.98151 5.7 12 3M12 21C19.2444 13.08 15.0185 5.7 12 3" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    if (space?.isPrivate) {
      visibilityIconEl.innerHTML = visibilityIcon;
      visibilityText.textContent = `Open to ”${space.name} ${space?.emoji}” Only`;
    } else {
      visibilityIconEl.innerHTML = visibilityIcon;
      visibilityText.textContent = "Open to Everyone";
    }

    // Space Members
    const membersList = asideThreadContainer.querySelector(".aside-members-list");
    console.log(membersList);
    if (membersList) {
      membersList.innerHTML = "";

      // Generate random member count between 6 and 20
      const memberCount = Math.floor(Math.random() * (20 - 6 + 1)) + 6;

      // Generate fake members array based on random count with different roles
      const spaceMembers = Array.from({ length: memberCount }, (_, index) => {
        let role;
        let name;
        if (index === 0) {
          role = "curator";
          name = "You";
        } else if (index < 3) {
          role = "contributor";
          name = "Albert Flores";
        } else {
          role = "member";
          name = "Darlene Robertson";
        }

        return {
          id: `member_${index + 1}`,
          name: name,
          role: role,
        };
      });

      spaceMembers.splice(0, 7).forEach((member) => {
        const memberItem = document.createElement("div");
        memberItem.className = "aside-member-item";
        memberItem.setAttribute("data-member-id", member.id);

        memberItem.innerHTML = `
              <div class="aside-member-avatar">
                <img src="./icons/Avatar.svg" alt="${member.name}" />
              </div>
              <h4 class="aside-member-name">${member.name}</h4>
    
              <div class="aside-member-info">
                <p class="aside-member-role ${member.role}">${member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
                <button class="member-options-btn" data-member-id="${member.id}" data-member-name="${member.name}" data-member-role="${member.role}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                </button>
              </div>
            `;

        membersList.appendChild(memberItem);

        // Add event listener to the options button
        const optionsBtn = memberItem.querySelector(".member-options-btn");
        optionsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (window.spacesManager) {
            window.spacesManager.showMemberDropdown(e.target.closest("button"), member);
          }
        });
      });
    }
  }

  // Create load more button
  createLoadMoreButton() {
    return `
      <div class="thread-load-more">
        <button class="thread-load-more-btn" data-action="load-more">
          Load more 89 replies
        </button>
      </div>
    `;
  }

  // Create message HTML
  createMessageHTML(message) {
    const imagesHTML = message.images ? this.createImagesHTML(message.images) : "";
    const repliesHTML = message.replies && message.replies.length > 0 ? this.createRepliesHTML(message.replies) : "";

    return `
      <div class="thread-message-item" data-message-id="${message.id}">
        <div class="thread-message-content">
          <div class="thread-message-header">
            <img src="${message.avatar}" alt="${message.author}" class="thread-message-avatar" />
            <span class="thread-message-author">${message.author}</span>
            <span class="thread-message-role">${message.role}</span>
            <span class="thread-message-time">${message.time}</span>
            ${message.replyingTo ? `<span class="thread-message-replying">Replying to ${message.replyingTo}</span>` : ""}
          </div>
          <p class="thread-message-text">${message.text}</p>
          ${imagesHTML}
          ${this.createActionsHTML(message)}
          ${repliesHTML}
        </div>
      </div>
    `;
  }

  // Create images HTML
  createImagesHTML(images) {
    return `
      <div class="thread-message-images">
        ${images.map((img) => `<div class="thread-message-image"><img src="${img}" alt="" /></div>`).join("")}
      </div>
    `;
  }

  // Create actions HTML
  createActionsHTML(message) {
    const loveActive = message.reactions.love > 0 ? "active" : "";

    return `
      <div class="thread-message-actions">
        <button class="thread-message-action-btn" data-action="react" data-message-id="${message.id}">
          <span>React</span>
        </button>
        <button class="thread-message-action-btn" data-action="reply" data-message-id="${message.id}">
          <span>Reply</span>
          ${message.reactions.reply > 0 ? `<span class="action-count">${message.reactions.reply}</span>` : ""}
        </button>
        <button class="thread-message-action-btn ${loveActive}" data-action="love" data-message-id="${message.id}">
          ${this.createLoveIcon(loveActive)}
          <span class="action-count">${this.formatNumber(message.reactions.love)}</span>
        </button>
      </div>
    `;
  }

  // Create love icon SVG
  createLoveIcon(isActive) {
    const fill = isActive ? "currentColor" : "none";
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.99995C10.2006 3.90293 7.19377 3.25486 4.93923 5.1751C2.68468 7.09534 2.36727 10.3059 4.13778 12.577C5.60984 14.4652 10.0648 18.4477 11.5249 19.7367C11.6882 19.8809 11.7699 19.953 11.8652 19.9813C11.9483 20.006 12.0393 20.006 12.1225 19.9813C12.2178 19.953 12.2994 19.8809 12.4628 19.7367C13.9229 18.4477 18.3778 14.4652 19.8499 12.577C21.6204 10.3059 21.3417 7.07514 19.0484 5.1751C16.7551 3.27506 13.7994 3.90293 12 5.99995Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  // Create replies HTML
  createRepliesHTML(replies) {
    return `
      <div class="thread-message-replies">
        ${replies.map((reply) => this.createReplyHTML(reply)).join("")}
      </div>
    `;
  }

  // Create reply HTML
  createReplyHTML(reply) {
    return `
      <div class="thread-message-reply" data-message-id="${reply.id}">
        <div class="thread-message-reply-line"></div>
        <img src="${reply.avatar}" alt="${reply.author}" class="thread-message-avatar" />
        <div class="thread-message-content">
          <div class="thread-message-header">
            <span class="thread-message-author">${reply.author}</span>
            <span class="thread-message-role">${reply.role}</span>
            <span class="thread-message-time">${reply.time}</span>
            ${reply.replyingTo ? `<span class="thread-message-replying">Replying to ${reply.replyingTo}</span>` : ""}
          </div>
          <p class="thread-message-text">${reply.text}</p>
          ${this.createActionsHTML(reply)}
        </div>
      </div>
    `;
  }

  // Attach message listeners
  attachMessageListeners() {
    if (!this.messagesContainer) return;

    // Load more button
    const loadMoreBtn = this.messagesContainer.querySelector('[data-action="load-more"]');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => this.handleLoadMore());
    }

    // Action buttons
    const actionButtons = this.messagesContainer.querySelectorAll(".thread-message-action-btn");
    actionButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        const action = btn.dataset.action;
        const messageId = btn.dataset.messageId;
        this.handleAction(action, messageId, btn, e);
      });
    });
  }

  // Handle load more
  handleLoadMore() {
    this.showNotification("Loading more messages...", "info");
    // In production, fetch more messages from API
  }

  // Handle action (react, reply, love)
  handleAction(action, messageId, buttonElement, event) {
    const message = this.findMessage(messageId);
    if (!message) return;

    switch (action) {
      case "react":
        this.handleReact(message, buttonElement, event);
        break;
      case "reply":
        this.handleReply(message);
        break;
      case "love":
        this.handleLove(message);
        break;
    }
  }

  // Find message by ID
  findMessage(messageId) {
    for (const msg of this.messages) {
      if (msg.id == messageId) return msg;
      if (msg.replies) {
        const reply = msg.replies.find((r) => r.id == messageId);
        if (reply) return reply;
      }
    }
    return null;
  }

  // Handle react
  handleReact(message, buttonElement, event) {
    // Find the react button that was clicked
    const reactButton = buttonElement || document.querySelector(`[data-action="react"][data-message-id="${message.id}"]`);
    if (reactButton) {
      this.showReactionModal(reactButton, message);
    }
  }

  // Handle reply
  handleReply(message) {
    const input = document.getElementById("threadMessageInput");
    if (input) {
      input.focus();
      input.placeholder = `Replying to ${message.author}...`;
      input.dataset.replyTo = message.id;
    }
  }

  // Handle love
  handleLove(message) {
    message.reactions.love = message.reactions.love > 0 ? 0 : 1;
    this.render();
    this.showNotification(message.reactions.love > 0 ? "Loved! ❤️" : "Love removed", "success");
  }

  // Add new message
  addMessage(message) {
    const newMessage = {
      id: Date.now(),
      author: "You",
      role: "Member",
      avatar: "./icons/Avatar.svg",
      time: this.getCurrentTime(),
      text: message,
      reactions: { react: 0, reply: 0, love: 0 },
      replies: [],
    };

    this.messages.push(newMessage);
    this.render();
  }

  // Get current time
  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }

  // Format number
  formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  }

  // Scroll to bottom
  scrollToBottom() {
    if (this.messagesContainer) {
      setTimeout(() => {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }, 100);
    }
  }

  // Show notification
  showNotification(message, type = "info") {
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API methods
  clearMessages() {
    this.messages = [];
    this.render();
  }

  getMessages() {
    return [...this.messages];
  }

  updateMessage(messageId, updates) {
    const message = this.findMessage(messageId);
    if (message) {
      Object.assign(message, updates);
      this.render();
    }
  }

  deleteMessage(messageId) {
    this.messages = this.messages.filter((m) => m.id != messageId);
    this.render();
  }

  // Show reaction modal positioned relative to button
  showReactionModal(buttonElement, message) {
    const modal = document.getElementById("reactionModal");
    if (!modal) return;

    // Only cleanup if modal is currently visible
    const isModalVisible = modal.classList.contains("show");
    if (isModalVisible) {
      // Destroy existing Popper instance without hiding the modal
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = null;
      }

      // Reset modal styles to ensure clean state
      modal.style.position = "";
      modal.style.top = "";
      modal.style.left = "";
      modal.style.transform = "";
    }

    // Set flag to prevent immediate closing
    this.reactionModalJustOpened = true;

    // Position modal relative to button using Popper.js if available
    if (typeof Popper !== "undefined") {
      this.popperInstance = Popper.createPopper(buttonElement, modal, {
        placement: "top",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
              padding: 16,
              altBoundary: true,
            },
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["bottom", "top-start", "top-end", "bottom-start", "bottom-end"],
            },
          },
          {
            name: "shift",
            options: {
              padding: 16,
            },
          },
        ],
      });
    } else {
      // Fallback positioning with viewport bounds checking
      const buttonRect = buttonElement.getBoundingClientRect();
      const modalWidth = 200; // Approximate modal width
      const modalHeight = 60; // Approximate modal height
      const padding = 8;

      // Calculate initial position
      let top = buttonRect.top - modalHeight - padding;
      let left = buttonRect.left;

      // Ensure modal stays within viewport horizontally
      if (left + modalWidth > window.innerWidth) {
        left = window.innerWidth - modalWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }

      // Ensure modal stays within viewport vertically
      if (top < padding) {
        // If no space above, show below the button
        top = buttonRect.bottom + padding;
      }

      modal.style.position = "fixed";
      modal.style.top = `${top}px`;
      modal.style.left = `${left}px`;
    }

    // Show modal with animation
    modal.style.display = "block";
    requestAnimationFrame(() => {
      modal.classList.add("show");
    });

    // Setup reaction button listeners
    this.setupReactionListeners(message);

    // Create bound function for click outside handler
    this.boundClickOutsideHandler = this.handleReactionClickOutside.bind(this);

    // Add click outside listener with proper delay and flag reset
    setTimeout(() => {
      this.reactionModalJustOpened = false;
      document.addEventListener("click", this.boundClickOutsideHandler);
    }, 200);
  }

  // Hide reaction modal
  hideReactionModal() {
    const modal = document.getElementById("reactionModal");

    // Destroy Popper instance first to prevent positioning conflicts
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    if (modal) {
      modal.classList.remove("show");

      // Reset all positioning styles immediately to prevent conflicts
      modal.style.position = "";
      modal.style.top = "";
      modal.style.left = "";
      modal.style.transform = "";

      setTimeout(() => {
        modal.style.display = "none";
      }, 150);

      // Remove the specific bound event listener
      if (this.boundClickOutsideHandler) {
        document.removeEventListener("click", this.boundClickOutsideHandler);
        this.boundClickOutsideHandler = null;
      }
    }

    // Reset flag
    this.reactionModalJustOpened = false;
  }

  // Setup reaction button listeners
  setupReactionListeners(message) {
    const modal = document.getElementById("reactionModal");
    const reactionBtns = modal.querySelectorAll(".reaction-btn");

    reactionBtns.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const reaction = newBtn.dataset.reaction;
        this.handleReactionSelect(message, reaction);
      });
    });
  }

  // Handle reaction selection
  handleReactionSelect(message, reaction) {
    console.log(`Adding ${reaction} reaction to message ${message.id}`);

    // Update message reactions in memory
    if (!message.reactions[reaction]) {
      message.reactions[reaction] = 0;
    }
    message.reactions[reaction]++;

    // Update the DOM directly instead of full re-render
    this.updateReactionInDOM(message, reaction);

    // Hide modal
    this.hideReactionModal();

    // Show feedback
    this.showNotification(`Added ${reaction} reaction!`, "success");
  }

  // Update specific reaction count in DOM
  updateReactionInDOM(message, reaction) {
    // Find the message element
    const messageElement = document.querySelector(`[data-message-id="${message.id}"]`);
    if (!messageElement) return;

    // Find the message actions container
    const actionsContainer = messageElement.querySelector(".thread-message-actions");
    if (!actionsContainer) return;

    // Check if reaction button already exists
    let reactionButton = actionsContainer.querySelector(`[data-action="${reaction}"]`);

    if (reactionButton) {
      // Update existing reaction button
      const countElement = reactionButton.querySelector(".action-count");
      if (countElement) {
        countElement.textContent = this.formatNumber(message.reactions[reaction]);
        reactionButton.classList.add("active");
      }
    } else {
      // Create new reaction button if it doesn't exist
      this.addNewReactionButton(actionsContainer, message, reaction);
    }
  }

  // Add new reaction button to the actions container
  addNewReactionButton(actionsContainer, message, reaction) {
    const reactionButton = document.createElement("button");
    reactionButton.className = `thread-message-action-btn active`;
    reactionButton.setAttribute("data-action", reaction);
    reactionButton.setAttribute("data-message-id", message.id);

    // Get reaction icon and color based on type
    const reactionConfig = this.getReactionConfig(reaction);

    reactionButton.innerHTML = `
      ${reactionConfig.icon}
      <span class="action-count">${this.formatNumber(message.reactions[reaction])}</span>
    `;

    // Insert before the existing love button or at the end
    const loveButton = actionsContainer.querySelector('[data-action="love"]');
    if (loveButton) {
      actionsContainer.insertBefore(reactionButton, loveButton);
    } else {
      actionsContainer.appendChild(reactionButton);
    }

    // Add click listener for the new button
    reactionButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.handleAction(reaction, message.id, reactionButton, e);
    });
  }

  // Get reaction configuration (icon and styling)
  getReactionConfig(reaction) {
    const configs = {
      like: {
        icon: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.83366 18.3346V9.16797M1.66699 10.8346V16.668C1.66699 17.5885 2.41318 18.3346 3.33366 18.3346H14.5222C15.7562 18.3346 16.8055 17.4344 16.9932 16.2148L17.8906 10.3815C18.1236 8.86705 16.9518 7.5013 15.4197 7.5013H12.5003C12.0401 7.5013 11.667 7.1282 11.667 6.66797V3.72283C11.667 2.58796 10.747 1.66797 9.61216 1.66797C9.34141 1.66797 9.09616 1.82739 8.98624 2.07474L6.05361 8.67305C5.91986 8.97405 5.62142 9.16797 5.2921 9.16797H3.33366C2.41318 9.16797 1.66699 9.91413 1.66699 10.8346Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        color: "#4285F4",
      },
      dislike: {
        icon: `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1666 1.66797V10.8346M18.3333 8.16797V4.33463C18.3333 3.40121 18.3333 2.9345 18.1516 2.57799C17.9918 2.26438 17.7368 2.00941 17.4232 1.84963C17.0667 1.66797 16.6 1.66797 15.6666 1.66797H6.76489C5.54699 1.66797 4.93804 1.66797 4.4462 1.89083C4.01271 2.08725 3.6443 2.40332 3.38425 2.8019C3.08919 3.25413 2.9966 3.856 2.8114 5.05973L2.3755 7.89307C2.13125 9.48072 2.00912 10.2746 2.24472 10.8922C2.4515 11.4344 2.84042 11.8877 3.34482 12.1746C3.91949 12.5013 4.72266 12.5013 6.329 12.5013H6.99988C7.4666 12.5013 7.69995 12.5013 7.8782 12.5921C8.03501 12.6721 8.1625 12.7995 8.24239 12.9563C8.33325 13.1345 8.33325 13.3679 8.33325 13.8346V16.2798C8.33325 17.4146 9.25317 18.3346 10.3881 18.3346C10.6588 18.3346 10.9041 18.1752 11.014 17.9279L13.8147 11.6265C13.942 11.3398 14.0057 11.1966 14.1063 11.0915C14.1953 10.9986 14.3047 10.9276 14.4257 10.884C14.5626 10.8346 14.7194 10.8346 15.033 10.8346H15.6666C16.6 10.8346 17.0667 10.8346 17.4232 10.653C17.7368 10.4932 17.9918 10.2382 18.1516 9.92463C18.3333 9.56813 18.3333 9.10138 18.3333 8.16797Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        color: "#EA4335",
      },
      star: {
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        color: "#FBBC04",
      },
      love: {
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.99995C10.2006 3.90293 7.19377 3.25486 4.93923 5.1751C2.68468 7.09534 2.36727 10.3059 4.13778 12.577C5.60984 14.4652 10.0648 18.4477 11.5249 19.7367C11.6882 19.8809 11.7699 19.953 11.8652 19.9813C11.9483 20.006 12.0393 20.006 12.1225 19.9813C12.2178 19.953 12.2994 19.8809 12.4628 19.7367C13.9229 18.4477 18.3778 14.4652 19.8499 12.577C21.6204 10.3059 21.3417 7.07514 19.0484 5.1751C16.7551 3.27506 13.7994 3.90293 12 5.99995Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        color: "#EA4335",
      },
    };

    return configs[reaction] || configs.love;
  }

  // Handle click outside reaction modal
  handleReactionClickOutside(event) {
    // Don't close if modal just opened
    if (this.reactionModalJustOpened) {
      return;
    }

    const modal = document.getElementById("reactionModal");
    const isReactButton = event.target.closest('[data-action="react"]');

    // Don't close if clicking on a react button or inside the modal
    if (modal && !modal.contains(event.target) && !isReactButton) {
      this.hideReactionModal();
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.threadMessagesRenderer = new ThreadMessagesRenderer();
  });
} else {
  window.threadMessagesRenderer = new ThreadMessagesRenderer();
}
