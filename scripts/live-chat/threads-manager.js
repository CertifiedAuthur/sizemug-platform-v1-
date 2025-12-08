/* ============================================
   Threads Manager - Class-based Implementation
   ============================================ */

class ThreadsManager {
  constructor() {
    this.storageKey = "liveChatThreads";
    this.threads = [];
    this.container = null;
    this.boostModalTimeout = null;
    this.init();
  }

  // Initialize the manager
  init() {
    this.loadFromStorage();
    // Find the Recent threads section
    const sections = document.querySelectorAll(".sidebar-section");
    sections.forEach((section) => {
      const title = section.querySelector(".section-title");
      if (title && title.textContent.trim() === "Recent threads") {
        this.container = section;
      }
    });

    if (this.container) {
      // Check if this is first visit
      const hasVisited = this.checkVisitStatus();

      if (!hasVisited) {
        // First visit - show wallet waiting card
        this.showWaitingCard();
      } else {
        // Subsequent visit - show threads
        this.render();
      }

      this.setupEventListeners();
      this.render();
    }
  }

  // Check visit status
  checkVisitStatus() {
    try {
      return localStorage.getItem("liveChatAsideVisibility") === "true";
    } catch (error) {
      return false;
    }
  }

  // Show waiting card for first visit
  showWaitingCard() {
    const waitingCard = this.container?.querySelector(".wallet-waiting-card");
    if (waitingCard) {
      waitingCard.style.display = "flex";

      // Add event listener to "Start a thread" button
      const startBtn = waitingCard.querySelector(".start-thread-btn");
      if (startBtn) {
        startBtn.addEventListener("click", () => this.handleStartThread());
      }
    }
  }

  // Load threads from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.threads = JSON.parse(stored);
      } else {
        // Initialize with empty threads array
        this.threads = [];
      }
    } catch (error) {
      console.error("Error loading threads:", error);
      this.threads = [];
    }
  }

  // Save threads to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.threads));
    } catch (error) {
      console.error("Error saving threads:", error);
    }
  }

  // Generate unique ID
  generateId() {
    return `thread_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Format view count
  formatViews(views) {
    if (typeof views === "string") return views;
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(0)}k`;
    return views.toString();
  }

  // Create thread item HTML
  createThreadItem(thread) {
    // const unreadBadge = thread.hasUnread ? `<span class="thread-unread-badge">${thread.unreadCount > 99 ? "+99" : thread.unreadCount}</span>` : "";

    return `
      <div class="thread-item" data-thread-id="${thread.id}">
        <div class="thread-info">
          <span class="thread-hash">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="#7D8FAA" stroke-dasharray="20" stroke-dashoffset="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 9h17"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"/></path><path d="M3 15h17"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="20;0"/></path><path d="M10 3l-2 18"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="20;0"/></path><path d="M16 3l-2 18"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="20;0"/></path></g></svg>
          </span>
          <div class="thread-details">
            <span class="thread-name">${thread.name}</span>
            <span class="thread-space">${thread.spaceName} ${thread.spaceEmoji}</span>
          </div>
        </div>
        <div class="thread-stats">
          <div class="thread-views">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7304 8.33088C14.2673 8.86785 15.1379 8.86785 15.6749 8.33088C16.2119 7.79391 16.2119 6.92331 15.6749 6.38633C15.1379 5.84936 14.2673 5.84936 13.7304 6.38633C13.1934 6.92331 13.1934 7.79391 13.7304 8.33088Z" fill="url(#paint0_linear_2256_203348)"/><path d="M10.0031 12.0592L5.46582 16.5965M13.2443 13.6796L13.4241 15.6569C13.5133 16.6389 13.07 17.5933 12.2623 18.1588L10.3275 19.5132L10.1654 15.7861M8.38287 8.81821L6.40562 8.63843C5.92322 8.59458 5.43779 8.67892 4.99845 8.88292C4.55912 9.08692 4.18146 9.40335 3.90369 9.80019L2.54932 11.735L6.27637 11.8971M10.6513 6.54962C13.2441 3.95695 17.2952 2.49853 19.4018 2.66067C19.5638 4.76717 18.1054 8.81837 15.5127 11.4111C12.9199 14.0037 10.0031 15.9483 8.38265 16.5965L5.46582 13.6797C6.11402 12.0592 8.05861 9.14242 10.6513 6.54962Z" stroke="url(#paint1_linear_2256_203348)" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="paint0_linear_2256_203348" x1="13.1178" y1="6.99887" x2="16.1513" y2="7.85446" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"/><stop offset="1" stop-color="#FFAE00"/></linearGradient><linearGradient id="paint1_linear_2256_203348" x1="2.54932" y1="16.3932" x2="19.414" y2="6.94901" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"/><stop offset="1" stop-color="#FFAE00"/></linearGradient></defs></svg>
            <span class="thread-views-count">x${thread.views}</span>
          </div>
          <span class="thread-unread-badge">${thread?.unreadCount > 99 ? "+99" : `+${Math.floor(Math.random() * 100 + 1)}`}</span>
        </div>
      </div>
    `;
  }

  // Render threads
  render() {
    if (!this.container) return;

    // Remove the wallet waiting card if it exists
    const waitingCard = this.container.querySelector(".wallet-waiting-card");
    if (waitingCard) {
      waitingCard.remove();
    }

    // Find or create threads list container
    let threadsList = this.container.querySelector(".threads-list");

    if (!threadsList) {
      threadsList = document.createElement("div");
      threadsList.className = "threads-list";
      this.container.appendChild(threadsList);
    }

    // Render all threads
    if (this.threads.length === 0) {
      threadsList.innerHTML = this.createEmptyState();
    } else {
      threadsList.innerHTML = this.threads.map((thread) => this.createThreadItem(thread)).join("");
    }

    // Attach event listeners
    this.attachThreadListeners();
  }

  // Create empty state HTML
  createEmptyState() {
    return `
      <div class="threads-empty-state">
        <h4 class="threads-empty-title">No recent threads</h4>
        <p class="threads-empty-desc">Threads you participate in will show up here</p>
        <button class="start-thread-btn">Start a thread</button>
      </div>
    `;
  }

  // Setup event listeners
  setupEventListeners() {
    const seeAllBtn = this.container?.querySelector(".see-all-btn");
    const recentThreadModal = document.getElementById("recentThreadModal");
    const showRecentThreadBtn = document.getElementById("showRecentThreadBtn");
    const closeRecentThreadModal = document.getElementById("closeRecentThreadModal");
    const showAllThreadMembersBtns = document.querySelectorAll(".show-all-thread-members");
    const threadMembersModal = document.getElementById("threadMembersModal");
    const closeThreadMembersModal = document.getElementById("closeThreadMembersModal");

    showAllThreadMembersBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        threadMembersModal.classList.remove(HIDDEN);
      });
    });

    if (threadMembersModal && closeThreadMembersModal) {
      closeThreadMembersModal.addEventListener("click", () => {
        threadMembersModal.classList.add(HIDDEN);
      });

      threadMembersModal.addEventListener("click", (e) => {
        if (e.target === threadMembersModal) {
          threadMembersModal.classList.add(HIDDEN);
        }
      });
    }

    if (seeAllBtn) {
      seeAllBtn.addEventListener("click", () => this.handleSeeAll());
    }

    if (showRecentThreadBtn) {
      showRecentThreadBtn.addEventListener("click", () => {
        recentThreadModal.classList.remove(HIDDEN);
      });
    }

    if (recentThreadModal) {
      recentThreadModal.addEventListener("click", (e) => {
        if (e.target === recentThreadModal) {
          recentThreadModal.classList.add(HIDDEN);
        }
      });
    }

    if (closeRecentThreadModal) {
      closeRecentThreadModal.addEventListener("click", () => {
        recentThreadModal.classList.add(HIDDEN);
      });
    }

    // Thread chat input listeners
    this.setupThreadChatListeners();
  }

  // Setup thread chat listeners
  setupThreadChatListeners() {
    const messageInput = document.getElementById("threadMessageInput");
    const boostBtn = document.getElementById("boostThreadBtn");
    const viewSpaceBtn = document.getElementById("viewSpaceBtn");
    const imageUploadBtn = document.getElementById("imageUploadBtn");
    const imageUploadInput = document.getElementById("imageUploadInput");
    const voiceNoteBtn = document.getElementById("voiceNoteBtn");
    const asideViewBtn = document.getElementById("asideViewBtn");

    function showAsideSpaceContainer() {
      document.querySelectorAll(".space-thread-aside-container").forEach((container) => container.classList.add(HIDDEN));
      document.getElementById("asideSpaceContainer").classList.remove(HIDDEN);
    }

    if (messageInput) {
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage(messageInput.value);
          messageInput.value = "";
        }
      });
    }

    if (boostBtn) {
      boostBtn.addEventListener("click", () => {
        this.showBoostModal();
      });
    }

    if (viewSpaceBtn) {
      viewSpaceBtn.addEventListener("click", showAsideSpaceContainer);
    }

    if (asideViewBtn) {
      asideViewBtn.addEventListener("click", showAsideSpaceContainer);
    }

    if (imageUploadBtn) {
      imageUploadBtn.addEventListener("click", () => {
        imageUploadInput?.click();
      });
    }

    if (imageUploadInput) {
      imageUploadInput.addEventListener("change", (e) => {
        this.handleImageUpload(e);
      });
    }

    if (voiceNoteBtn) {
      voiceNoteBtn.addEventListener("click", () => {
        this.handleVoiceNote();
      });
    }

    // Boost modal listeners
    this.setupBoostModalListeners();
  }

  // Setup boost modal listeners
  setupBoostModalListeners() {
    const boostOptions = document.querySelectorAll(".boost-option");

    // Close popper when clicking outside
    document.addEventListener("click", (e) => {
      const popper = document.getElementById("boostPopper");
      if (!popper || popper.style.display === "none") return;

      // Check if the click target is inside the popper or boost button
      const isInsidePopper = e.target.closest("#boostPopper");
      const isInsideBoostBtn = e.target.closest("#boostThreadBtn");

      if (!isInsidePopper && !isInsideBoostBtn) {
        // this.hideBoostModal();
      }
    });

    boostOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const boost = option.dataset.boost;
        const cost = option.dataset.cost;

        // Trigger confetti animation in threadChatView
        this.triggerBoostConfetti();

        // Add boost notification to chat
        this.addBoostNotificationToChat(boost, cost);

        this.confirmBoost(boost, cost);
      });
    });
  }

  // Send message
  sendMessage(text) {
    if (!text || !text.trim()) return;

    // Send message through the renderer
    if (window.threadMessagesRenderer) {
      window.threadMessagesRenderer.addMessage(text);
    }

    this.showNotification("Message sent!", "success");
    // Here you would typically send the message to your backend
  }

  // Show boost modal (popper)
  showBoostModal() {
    const popper = document.getElementById("boostPopper");
    if (!popper) return;

    // Clear any existing timeout
    if (this.boostModalTimeout) {
      clearTimeout(this.boostModalTimeout);
      this.boostModalTimeout = null;
    }

    // Reset modal to default state
    this.resetBoostModal();

    // Update thread name
    const threadNameEl = document.querySelector(".boost-thread-name");
    const threadChatTitle = document.getElementById("threadChatTitle");
    if (threadNameEl && threadChatTitle) {
      threadNameEl.textContent = threadChatTitle.textContent;
    }

    popper.style.display = "block";
  }

  // Reset boost modal to default state
  resetBoostModal() {
    const popper = document.getElementById("boostPopper");
    if (!popper) return;

    const body = popper.querySelector(".boost-popper-body");
    if (!body) return;

    // Get the original default content (save it if not already saved)
    if (!this.defaultBoostModalContent) {
      this.defaultBoostModalContent = body.innerHTML;
    } else {
      // Restore default content
      body.innerHTML = this.defaultBoostModalContent;
      // Re-attach event listeners for boost options (they get removed when we set innerHTML)
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        const boostOptions = body.querySelectorAll(".boost-option");
        boostOptions.forEach((option) => {
          option.addEventListener("click", () => {
            const boost = option.dataset.boost;
            const cost = option.dataset.cost;

            // Trigger confetti animation in threadChatView
            this.triggerBoostConfetti();

            // Add boost notification to chat
            this.addBoostNotificationToChat(boost, cost);

            this.confirmBoost(boost, cost);
          });
        });
      }, 0);
    }
  }

  // Hide boost modal (popper)
  hideBoostModal() {
    const popper = document.getElementById("boostPopper");
    if (popper) {
      popper.style.display = "none";
    }
    // Clear any pending timeout
    if (this.boostModalTimeout) {
      clearTimeout(this.boostModalTimeout);
      this.boostModalTimeout = null;
    }
  }

  // Add boost notification to chat
  addBoostNotificationToChat(boost, cost) {
    const chatMessages = document.getElementById("threadChatMessages");
    if (!chatMessages) return;

    // Check if the last element is a boost-notification-container
    const lastElement = chatMessages.lastElementChild;
    const isLastElementBoostNotification = lastElement && lastElement.classList.contains("boost-notification-container");

    let boostNotification = null;
    let boostScroll = null;

    if (isLastElementBoostNotification) {
      // Use existing container
      boostNotification = lastElement;
      // Find or create boost-notification-scroll inside
      boostScroll = boostNotification.querySelector(".boost-notification-scroll");
      if (!boostScroll) {
        boostScroll = document.createElement("div");
        boostScroll.className = "boost-notification-scroll";
        boostNotification.appendChild(boostScroll);
      }
    } else {
      // Create a new boost notification container
      boostNotification = document.createElement("div");
      boostNotification.className = "boost-notification-container";
      boostScroll = document.createElement("div");
      boostScroll.className = "boost-notification-scroll";
      boostNotification.appendChild(boostScroll);
      chatMessages.appendChild(boostNotification);
    }

    // Create and append new boost notification item
    const boostItem = document.createElement("div");
    boostItem.className = "boost-notification-item";
    boostItem.innerHTML = `
      <img src="./icons/Avatar.svg" alt="Sarah" class="boost-avatar" />
      <span class="boost-name">Sarah Boosted</span>
      <span class="boost-amount">x${boost}</span>
    `;
    boostScroll.appendChild(boostItem);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Confirm boost
  confirmBoost(boost, cost) {
    const popper = document.getElementById("boostPopper");
    if (!popper) return;

    const body = popper.querySelector(".boost-popper-body");
    if (!body) return;

    // Show "Your boost is on its way" message
    body.innerHTML = `
      <div class="boost-confirmation-content">
        <div class="boost-rocket-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39.9431 24.2353C41.5052 25.7974 44.0378 25.7974 45.5999 24.2353C47.162 22.6732 47.162 20.1405 45.5999 18.5784C44.0378 17.0163 41.5052 17.0163 39.9431 18.5784C38.381 20.1405 38.381 22.6732 39.9431 24.2353Z" fill="url(#paint0_linear_2630_216157)"/><path d="M29.0997 35.08L15.9004 48.2794M38.5287 39.7939L39.0517 45.5459C39.3113 48.4026 38.0217 51.1792 35.672 52.8242L30.0433 56.7642L29.572 45.9219M24.3863 25.6516L18.6343 25.1286C17.231 25.001 15.8188 25.2463 14.5408 25.8398C13.2627 26.4333 12.1641 27.3538 11.356 28.5082L7.41602 34.1369L18.2583 34.6082M30.9854 19.052C38.5281 11.5097 50.3131 7.26703 56.4414 7.7387C56.9127 13.8667 52.6701 25.652 45.1277 33.1944C37.5851 40.7367 29.0997 46.3937 24.3857 48.2794L15.9004 39.794C17.7861 35.08 23.4431 26.5947 30.9854 19.052Z" stroke="url(#paint1_linear_2630_216157)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="paint0_linear_2630_216157" x1="38.1611" y1="20.3603" x2="46.9858" y2="22.8494" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"/><stop offset="1" stop-color="#FFAE00"/></linearGradient><linearGradient id="paint1_linear_2630_216157" x1="7.41602" y1="47.6879" x2="56.477" y2="20.2139" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"/><stop offset="1" stop-color="#FFAE00"/></linearGradient></defs></svg>
        </div>
        <h2 class="boost-confirmation-title">Your Boost is on its WAY!</h2>
      </div>
    `;

    // Auto-close after 3 seconds
    this.boostModalTimeout = setTimeout(() => {
      this.hideBoostModal();
      this.showNotification(`Thread boosted x${boost}!`, "success");
      this.boostModalTimeout = null;
    }, 3000);
  }

  // Trigger boost confetti animation
  triggerBoostConfetti() {
    const threadChatView = document.getElementById("threadChatView");
    if (!threadChatView) return;

    // this.hideBoostModal();

    // Create a canvas element specifically for the threadChatView confetti
    let canvas = document.getElementById("threadBoostConfetti");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "threadBoostConfetti";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "none";
      canvas.style.zIndex = "1000000000";
      canvas.style.background = "transparent";

      // Make sure threadChatView has relative positioning
      if (getComputedStyle(threadChatView).position === "static") {
        threadChatView.style.position = "relative";
      }

      threadChatView.appendChild(canvas);
    }

    // Get the dimensions of the threadChatView
    const rect = threadChatView.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create and start rectangle confetti
    try {
      const confetti = new RectangleConfetti(canvas, {
        count: 150,
        colors: ["#FFC107", "#FF3D00", "#4CAF50", "#2196F3", "#9C27B0", "#FFEB3B", "#FF6B35", "#4ECDC4"],
      });

      confetti.start();

      // Stop confetti after 4 seconds and remove canvas
      setTimeout(() => {
        confetti.stop();
        setTimeout(() => {
          canvas.parentNode.removeChild(canvas);
        }, 1000);
      }, 4000);
    } catch (error) {
      console.warn("RectangleConfetti not available:", error);
      // Fallback: remove canvas if confetti fails
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  // Handle image upload
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.showNotification("Image size must be less than 5MB", "error");
        return;
      }
      this.showNotification(`Image "${file.name}" ready to upload`, "success");
      // Here you would typically upload the image to your backend
    }
  }

  // Handle voice note
  handleVoiceNote() {
    this.showNotification("Voice note recording coming soon!", "info");
    // Here you would implement voice recording functionality
  }

  // Attach listeners to thread items
  attachThreadListeners() {
    const threadItems = this.container?.querySelectorAll(".thread-item");

    threadItems?.forEach((item) => {
      const threadId = item.dataset.threadId;

      item.addEventListener("click", () => {
        this.handleThreadClick(threadId);
      });
    });

    // Start thread button in empty state
    const startThreadBtn = this.container?.querySelector(".start-thread-btn");
    if (startThreadBtn) {
      startThreadBtn.addEventListener("click", () => this.handleStartThread());
    }
  }

  // Handle thread click
  handleThreadClick(threadId) {
    const thread = this.threads.find((t) => t.id === threadId);

    console.log(thread);

    if (thread) {
      this.proceedToThreadDirectly(threadId);

      // Check if this is the first time opening a thread from this space
      const spaceId = thread.spaceId || thread.spaceName;
      if (window.spacesManager && !window.spacesManager.hasVisitedSpace(spaceId)) {
        // Show warning modal for first-time thread access
        const spaceName = thread.spaceName + " " + (thread.spaceEmoji || "");
        window.spacesManager.showThreadWarningModal(spaceName, spaceId, threadId);
        return;
      }
    }
  }

  // Proceed to thread directly (for returning visitors or after warning acceptance)
  proceedToThreadDirectly(threadId) {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      // Mark as read
      thread.hasUnread = false;
      thread.unreadCount = 0;
      this.saveToStorage();
      this.render();

      // Highlight the parent space and apply its color
      this.highlightParentSpace(thread.spaceId || thread.spaceName);

      // Show thread chat view
      this.showThreadChatView(thread);
    }
  }

  // Highlight parent space by ID or name (fallback)
  highlightParentSpace(spaceIdOrName) {
    if (window.spacesManager) {
      let space;

      // First try to find by ID
      if (spaceIdOrName && spaceIdOrName.startsWith("space_")) {
        space = window.spacesManager.spaces.find((s) => s.id === spaceIdOrName);
      }

      // Fallback to finding by name
      if (!space) {
        space = window.spacesManager.spaces.find((s) => s.name === spaceIdOrName);
      }

      if (space) {
        window.spacesManager.highlightSpace(space.id);

        // Apply space color to messages
        if (window.threadMessagesRenderer && space.color) {
          window.threadMessagesRenderer.applySpaceColor(space.color);
        }
      }
    }
  }

  // Show thread chat view
  showThreadChatView(thread) {
    const emptyState = document.getElementById("emptyState");
    const threadChatView = document.getElementById("threadChatView");
    const aside = document.querySelector(".live-chat-aside");

    if (emptyState && threadChatView) {
      // Hide empty state
      emptyState.classList.add(HIDDEN);

      // Show thread chat view
      threadChatView.classList.remove(HIDDEN);

      // Show aside if it exists
      if (aside && window.asideVisibilityManager) {
        window.asideVisibilityManager.showAside();
        // Save this thread as the last viewed
        window.asideVisibilityManager.saveLastThread(thread);
      }

      // Update thread info in header
      this.updateThreadHeader(thread);

      // Update aside space info
      this.updateAsideSpaceInfo(thread);

      // Load thread messages
      this.loadThreadMessages(thread);
    }
  }

  // Update thread header
  updateThreadHeader(thread) {
    const titleEl = document.getElementById("threadChatTitle");
    const spaceEl = document.getElementById("threadChatSpace");
    const viewCountEl = document.getElementById("threadViewCount");

    if (titleEl) titleEl.textContent = thread.name;
    if (spaceEl) spaceEl.textContent = `${thread.spaceName} ${thread.spaceEmoji}`;
    if (viewCountEl) viewCountEl.textContent = thread.views;
  }

  // Update aside space info
  updateAsideSpaceInfo(thread) {
    const spaceNameEl = document.querySelector(".aside-thread-space-name");
    const spaceDotEl = document.querySelector(".aside-thread-space-dot");

    if (spaceNameEl && thread.spaceName) {
      spaceNameEl.textContent = `${thread.spaceName} ${thread.spaceEmoji || ""}`;
    }

    // Update space dot color if space has a color
    if (spaceDotEl && window.spacesManager) {
      let space;

      // Find the space by ID or name
      if (thread.spaceId && thread.spaceId.startsWith("space_")) {
        space = window.spacesManager.spaces.find((s) => s.id === thread.spaceId);
      }

      if (!space) {
        space = window.spacesManager.spaces.find((s) => s.name === thread.spaceName);
      }

      if (space && space.color) {
        spaceDotEl.style.backgroundColor = space.color;
      }
    }
  }

  // Load thread messages
  loadThreadMessages(thread) {
    // Use ThreadMessagesRenderer to handle message display
    if (window.threadMessagesRenderer) {
      window.threadMessagesRenderer.loadMessages(thread);
    } else {
      // Fallback if renderer not loaded yet
      document.addEventListener("DOMContentLoaded", () => {
        if (window.threadMessagesRenderer) {
          window.threadMessagesRenderer.loadMessages(thread);
        }
      });
    }
  }

  // Handle see all
  handleSeeAll() {
    this.showNotification("Showing all threads", "info");
  }

  // Handle start thread
  handleStartThread() {
    const name = prompt("Enter thread name:");
    if (!name || !name.trim()) return;

    const spaceName = prompt("Enter space name (optional):") || "General";
    const spaceEmoji = prompt("Enter space emoji (optional):") || "💬";

    const newThread = {
      id: this.generateId(),
      name: name.trim(),
      spaceName: spaceName.trim(),
      spaceEmoji: spaceEmoji,
      views: "0",
      unreadCount: 0,
      hasUnread: false,
    };

    this.threads.unshift(newThread);
    this.saveToStorage();
    this.render();

    this.showNotification(`Thread "${name}" created successfully!`, "success");
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
  addThread(threadData) {
    const newThread = {
      id: threadData.id || this.generateId(),
      name: threadData.name || threadData.title || "Untitled Thread",
      spaceId: threadData.spaceId || null,
      spaceName: threadData.spaceName || "General",
      spaceEmoji: threadData.spaceEmoji || "💬",
      views: threadData.views || "0",
      unreadCount: threadData.unreadCount || 0,
      hasUnread: threadData.hasUnread || false,
      createdAt: threadData.createdAt || new Date().toISOString(),
      author: threadData.author || null,
      ...threadData,
    };

    // Add to the beginning of the list (most recent first)
    this.threads.unshift(newThread);
    this.saveToStorage();
    this.render();

    console.log("Thread added to localStorage with spaceId:", newThread);
    return newThread;
  }

  removeThread(threadId) {
    this.threads = this.threads.filter((t) => t.id !== threadId);
    this.saveToStorage();
    this.render();
  }

  updateThread(threadId, updates) {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      Object.assign(thread, updates);
      this.saveToStorage();
      this.render();
    }
  }

  getThread(threadId) {
    return this.threads.find((t) => t.id === threadId);
  }

  getAllThreads() {
    return [...this.threads];
  }

  clearAllThreads() {
    if (confirm("Are you sure you want to clear all threads?")) {
      this.threads = [];
      this.saveToStorage();
      this.render();
    }
  }

  markAsRead(threadId) {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      thread.hasUnread = false;
      thread.unreadCount = 0;
      this.saveToStorage();
      this.render();
    }
  }

  markAsUnread(threadId, count = 1) {
    const thread = this.threads.find((t) => t.id === threadId);
    if (thread) {
      thread.hasUnread = true;
      thread.unreadCount = count;
      this.saveToStorage();
      this.render();
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.threadsManager = new ThreadsManager();
  });
} else {
  window.threadsManager = new ThreadsManager();
}

/* ============================================
   Aside Visibility Manager
   ============================================ */

class AsideVisibilityManager {
  constructor() {
    this.storageKey = "liveChatAsideVisibility";
    this.lastThreadKey = "liveChatLastThread";
    this.aside = null;
    this.emptyState = null;
    this.threadChatView = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.aside = document.getElementById("asideThreadContainer");
    this.emptyState = document.getElementById("emptyState");
    this.threadChatView = document.getElementById("threadChatView");
    this.threadWarningModal = document.getElementById("threadWarningModal");

    if (this.aside) this.aside.classList.add(HIDDEN);
    if (this.emptyState) this.emptyState.classList.remove(HIDDEN);
    if (this.threadChatView) this.threadChatView.classList.add(HIDDEN);
    if (this.threadWarningModal) this.threadWarningModal.classList.add(HIDDEN);
  }

  checkVisitStatus() {
    try {
      return localStorage.getItem(this.storageKey) === "true";
    } catch (error) {
      console.error("Error checking visit status:", error);
      return false;
    }
  }

  markAsVisited() {
    try {
      localStorage.setItem(this.storageKey, "true");
    } catch (error) {
      console.error("Error marking as visited:", error);
    }
  }

  // Save last viewed thread
  saveLastThread(thread) {
    try {
      localStorage.setItem(this.lastThreadKey, JSON.stringify(thread));
    } catch (error) {
      console.error("Error saving last thread:", error);
    }
  }

  // Load last viewed thread
  loadLastThread() {
    try {
      const lastThread = localStorage.getItem(this.lastThreadKey);
      if (lastThread && window.threadsManager) {
        const thread = JSON.parse(lastThread);
        // Update the UI with the last thread
        window.threadsManager.updateThreadHeader(thread);
        window.threadsManager.loadThreadMessages(thread);
      }
    } catch (error) {
      console.error("Error loading last thread:", error);
    }
  }

  // Public API to manually show/hide aside
  showAside() {
    if (this.aside) {
      this.aside.classList.remove(HIDDEN);
    }
  }

  hideAside() {
    if (this.aside) {
      this.aside.classList.add(HIDDEN);
    }
  }

  toggleAside() {
    if (this.aside) {
      const isVisible = !this.aside.classList.contains(HIDDEN);
      this.aside.classList[isVisible ? "add" : "remove"](HIDDEN);
    }
  }

  // Show thread chat view
  showThreadChat() {
    if (this.emptyState) this.emptyState.classList.add(HIDDEN);
    if (this.threadChatView) this.threadChatView.classList.remove(HIDDEN);
  }

  // Show empty state
  showEmptyState() {
    if (this.emptyState) this.emptyState.classList.remove(HIDDEN);
    if (this.threadChatView) this.threadChatView.classList.add(HIDDEN);
  }

  resetVisitStatus() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.lastThreadKey);
      if (this.aside) this.aside.classList.add(HIDDEN);
      if (this.emptyState) this.emptyState.classList.remove(HIDDEN);
      if (this.threadChatView) this.threadChatView.classList.add(HIDDEN);
    } catch (error) {
      console.error("Error resetting visit status:", error);
    }
  }
}

// Initialize the aside visibility manager
window.asideVisibilityManager = new AsideVisibilityManager();
