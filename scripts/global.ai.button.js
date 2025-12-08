/**
 * AIModal - A Popper.js-powered modal system with step navigation
 *
 * Features:
 * - Positions modal relative to trigger button (no full-screen overlay)
 * - Multi-step navigation system
 * - Responsive (uses Popper on desktop, centers on mobile)
 * - Click-outside-to-close
 * - ESC key to close
 */

// Use the HIDDEN constant from get.hidden.classnames.js or fallback
const HIDDEN_CLASS = typeof HIDDEN !== "undefined" ? HIDDEN : "homepage-hidden";
class AIModal {
  /**
   * @param {Object} opts - Configuration options
   * @param {string} opts.trigger - Selector for trigger button (default: "#showAIModal")
   * @param {string} opts.modal - Selector for modal element (default: ".modal")
   * @param {string} opts.placement - Popper placement (default: "bottom-start")
   * @param {number} opts.mobileBreakpoint - Mobile breakpoint in px (default: 640)
   */
  constructor(opts = {}) {
    this.triggerSelector = opts.trigger || "#showAIModal";
    this.modalSelector = opts.modal || ".modal";
    this.placement = opts.placement || "bottom-start";
    this.mobileBreakpoint = opts.mobileBreakpoint || 640;

    // State
    this.currentStep = 1;
    this.popperInstance = null;
    this.isOpen = false;
    this.isSidebarMode = false;
    this.isFullWidthMode = false;

    // Mimo AI conversation state
    this.conversationHistory = [];

    // Elements (resolved in init)
    this.triggerEl = null;
    this.modalEl = null;

    this.sgWavyLeftHeaderButton = document.getElementById("sgWavyLeftHeaderButton");
    this.sgWavyRightHeaderButton = document.getElementById("sgWavyRightHeaderButton");

    this.sgSwitchWavyChat = document.getElementById("sgSwitchWavyChat");
    this.sgSwitchWavySpeak = document.getElementById("sgSwitchWavySpeak");
    this.sgWavyToneSelector = document.getElementById("sgWavyToneSelector");
    this.sgWavyTextVoiceOptions = document.getElementById("sgWavyTextVoiceOptions");
    this.doneWithMicBtn = document.getElementById("doneWithMicBtn");
    this.backToChattingInterface = document.getElementById("backToChattingInterface");

    this.sgWavyModalInitial = document.getElementById("sgWavyModalInitial");
    this.sgWavyModalChat = document.getElementById("sgWavyModalChat");
    this.sgWavyModalSpeak = document.getElementById("sgWavyModalSpeak");
    this.sgWavyModalHistory = document.getElementById("sgWavyModalHistory");

    this.sgWavyModalContainers = document.querySelectorAll("#modalContent .sg-wavy-modal-container");

    this.sgWavyFullwidthClose = document.getElementById("sgWavyFullwidthClose");
    this.sgWavySidebarOptions = document.querySelector(".sg-wavy-sidebar-options");
    this.sendBtn = document.getElementById("sgWavySendBtn");

    // Bind methods
    this._onTriggerClick = this._onTriggerClick.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onResize = this._onResize.bind(this);

    this.attachEvents();
  }

  /**
   * Initialize the modal - call this after DOM is ready
   */
  init() {
    this.triggerEl = document.querySelector(this.triggerSelector);
    this.modalEl = document.querySelector(this.modalSelector);

    if (!this.triggerEl || !this.modalEl) {
      console.error("AIModal init failed — missing required elements.");
      return;
    }

    // Attach event listeners
    this.triggerEl.addEventListener("click", this._onTriggerClick);
    document.addEventListener("click", this._onDocumentClick);
    document.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("resize", this._onResize);

    this._gotoInterface(1);
  }

  attachEvents() {
    //
    this.sgWavyLeftHeaderButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const current = this.sgWavyLeftHeaderButton.getAttribute("data-current");

      if (current === "chat" || current === "speak" || current === "history") {
        this._gotoInterface(1);
        return;
      }

      const isExpanded = this.sgWavyLeftHeaderButton.getAttribute("aria-expanded") === "true";
      this.sgWavyLeftHeaderButton.setAttribute("aria-expanded", !isExpanded);
    });

    //
    this.sgWavyRightHeaderButton.addEventListener("click", (e) => {
      const current = this.sgWavyLeftHeaderButton.getAttribute("data-current");

      if (current === "initial") {
        this._gotoInterface(4);
        return;
      }

      this.openShareModal();

      // if (current === "trash") {
      //   // clear chat history
      //   return;
      // }

      // Open Sticky Sidebar Wavy Modal :)
    });

    //
    this.sgSwitchWavyChat.addEventListener("click", () => {
      this._gotoInterface(2);
    });

    //
    this.sgSwitchWavySpeak.addEventListener("click", () => {
      this._gotoInterface(3);
    });

    this.doneWithMicBtn.addEventListener("click", () => {
      this._gotoInterface(1);
    });

    this.backToChattingInterface.addEventListener("click", () => {
      this._gotoInterface(2, true);
    });

    this.sgWavyTextVoiceOptions.addEventListener("click", (e) => {
      e.stopPropagation();

      const listItem = e.target.closest("li");
      if (listItem) {
        const text = listItem.textContent.trim();

        // Check if "Fix as sidebar" option was clicked
        if (text.includes("Fix as sidebar") || text.includes("sidebar") || text.includes("Back to widget")) {
          this.toggleSidebarMode(listItem);
          this.sgWavyLeftHeaderButton.removeAttribute("aria-expanded", "false");
        }

        // Check if "Set to full width" option was clicked
        if (text.includes("Set to full width") || text.includes("Exit full width")) {
          this.toggleFullWidthMode(listItem);
          this.sgWavyLeftHeaderButton.removeAttribute("aria-expanded", "false");
        }

        // Check if "Set as widget" option was clicked
        if (text.includes("Set as widget") || text.includes("widget")) {
          this.toggleWidgetMode(listItem);
          this.sgWavyLeftHeaderButton.removeAttribute("aria-expanded", "false");
        }
      }
    });

    // Close button for full-width mode
    if (this.sgWavyFullwidthClose) {
      this.sgWavyFullwidthClose.addEventListener("click", () => {
        if (this.isFullWidthMode) {
          this.toggleFullWidthMode();
        }
      });
    }

    // Share button
    const shareBtn = document.querySelector(".sg-wavy-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        this.openShareModal();
      });
    }

    // Share modal close
    const shareClose = document.getElementById("sgWavyShareClose");
    const shareOverlay = document.getElementById("sgWavyShareModalOverlay");
    if (shareClose) {
      shareClose.addEventListener("click", (e) => {
        e.stopPropagation();

        this.closeShareModal();
      });
    }
    if (shareOverlay) {
      shareOverlay.addEventListener("click", (e) => {
        e.stopPropagation();

        if (e.target === shareOverlay) {
          this.closeShareModal();
        }
      });
    }

    // Copy link button
    const copyBtn = document.getElementById("sgWavyCopyBtn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const linkInput = document.getElementById("sgWavyShareLink");
        if (linkInput) {
          linkInput.select();
          navigator.clipboard.writeText(linkInput.value);
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Copied!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 2000);
        }
      });
    }

    // Send to recent contacts
    document.querySelectorAll(".sg-wavy-share-send-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const originalHTML = btn.innerHTML;
        btn.classList.add("sent");
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        setTimeout(() => {
          btn.classList.remove("sent");
          btn.innerHTML = originalHTML;
        }, 2000);
      });
    });

    // Sidebar options menu (same functionality as header options)
    if (this.sgWavySidebarOptions) {
      this.sgWavySidebarOptions.addEventListener("click", (e) => {
        e.stopPropagation();

        const listItem = e.target.closest("li");
        if (listItem) {
          const text = listItem.textContent.trim();

          // Check if "Fix as sidebar" option was clicked
          if (text.includes("Fix as sidebar") || text.includes("sidebar") || text.includes("Back to widget")) {
            this.toggleSidebarMode(listItem);
          }

          // Check if "Set to full width" option was clicked
          if (text.includes("Set to full width") || text.includes("Exit full width")) {
            this.toggleFullWidthMode(listItem);
          }

          // Check if "Set as widget" option was clicked
          if (text.includes("Set as widget") || text.includes("widget")) {
            this.toggleWidgetMode(listItem);
          }
        }
      });
    }

    // Auto-expanding textarea
    this.setupExpandingTextarea();

    // Close options menu when clicking outside
    document.addEventListener("click", (e) => {
      const isExpanded = this.sgWavyLeftHeaderButton.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        const isClickInsideButton = this.sgWavyLeftHeaderButton.contains(e.target);
        const isClickInsideOptions = this.sgWavyTextVoiceOptions.contains(e.target);

        if (!isClickInsideButton && !isClickInsideOptions) {
          this.sgWavyLeftHeaderButton.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  /**
   * Setup auto-expanding textarea
   */
  setupExpandingTextarea() {
    const textarea = document.getElementById("sgWavyTextarea");
    const container = document.getElementById("sgWavyTextareaContainer");
    const suggestions = container?.querySelector(".sg-wavy-textarea-suggestions");

    if (!textarea || !container) return;

    // Auto-resize textarea as user types
    textarea.addEventListener("input", () => {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";

      // Add expanded class when user starts typing
      if (textarea.value.trim().length > 0) {
        container.classList.add("expanded");
        suggestions.classList.remove(HIDDEN_CLASS);
      } else {
        container.classList.remove("expanded");
        textarea.style.height = "auto";
        suggestions.classList.add(HIDDEN_CLASS);
      }
    });

    // Handle focus
    textarea.addEventListener("focus", () => {
      if (textarea.value.trim().length > 0) {
        container.classList.add("expanded");
      }
    });

    // Handle blur (optional - remove expanded class when empty and unfocused)
    textarea.addEventListener("blur", () => {
      if (textarea.value.trim().length === 0) {
        container.classList.remove("expanded");
        suggestions.classList.add(HIDDEN_CLASS);
        textarea.style.height = "auto";
      }
    });

    // Handle Enter key to submit
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.handleMessageSubmit();
      }
    });

    // Handle send button click
    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => {
        this.handleMessageSubmit();
      });
    }
  }

  /**
   * Handle message submission
   */
  async handleMessageSubmit() {
    const textarea = document.getElementById("sgWavyTextarea");
    const container = document.getElementById("sgWavyTextareaContainer");
    const suggestions = container.querySelector(".sg-wavy-textarea-suggestions");
    const chatHeader = document.querySelector("#sgWavyModalChat .sg-wavy-chat-header");
    const chatMessages = document.getElementById("sgWavyChatMessages");

    if (!textarea || !chatMessages) return;

    const message = textarea.value.trim();
    if (!message) return;

    // Hide the header (gradient orb and question)
    if (chatHeader) {
      chatHeader.style.display = "none";
    }

    // Add user message
    this.addChatMessage(message, "user");

    // Clear textarea
    textarea.value = "";
    textarea.style.height = "auto";
    container.classList.remove("expanded");
    suggestions.classList.add(HIDDEN_CLASS);

    // Add AI thinking message
    setTimeout(() => {
      this.addChatMessage("Thinking...", "ai", true);
    }, 300);

    // Send message to Mimo AI
    await this.chatWithMimo(message);
  }

  /**
   * Add chat message to the conversation
   */
  addChatMessage(text, sender = "user", isThinking = false) {
    const chatMessages = document.getElementById("sgWavyChatMessages");
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `sg-wavy-chat-message ${sender}`;
    messageDiv.setAttribute("data-message-text", text);

    // Avatar
    const avatar = document.createElement("div");
    avatar.className = `sg-wavy-chat-avatar ${sender}`;

    if (sender === "user") {
      const avatarEl = document.createElement("img");
      avatarEl.src = "https://github.com/AIEraDev.png";
      avatar.appendChild(avatarEl);
    } else {
      avatar.innerHTML = '<div class="gradient-orb sm" style="width: 100%; height: 100%;"></div>';
    }

    // Message content
    const content = document.createElement("div");
    content.className = "sg-wavy-chat-message-content";

    const bubble = document.createElement("div");
    bubble.className = `sg-wavy-chat-bubble ${isThinking ? "thinking" : ""}`;

    if (isThinking) {
      bubble.innerHTML = `
        <span>Thinking</span>
        <div class="sg-wavy-thinking-dots">
          <div class="sg-wavy-thinking-dot"></div>
          <div class="sg-wavy-thinking-dot"></div>
          <div class="sg-wavy-thinking-dot"></div>
        </div>
      `;
      bubble.setAttribute("data-thinking", "true");
    } else {
      bubble.textContent = text;
    }

    content.appendChild(bubble);

    // Add action buttons (copy and edit for both user and AI messages)
    if (!isThinking) {
      const actions = document.createElement("div");
      actions.className = "sg-wavy-chat-actions";

      // Copy button
      const copyBtn = document.createElement("button");
      copyBtn.className = "sg-wavy-chat-action-btn";
      copyBtn.title = "Copy";
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7C14 6.06812 14 5.60218 13.8478 5.23463C13.6448 4.74458 13.2554 4.35523 12.7654 4.15224C12.3978 4 11.9319 4 11 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V11C4 11.9319 4 12.3978 4.15224 12.7654C4.35523 13.2554 4.74458 13.6448 5.23463 13.8478C5.60218 14 6.06812 14 7 14" stroke="#667085" stroke-width="1.5"/><rect x="10" y="10" width="10" height="10" rx="2" stroke="#667085" stroke-width="1.5"/></svg>`;

      // Copy functionality
      copyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        copyBtn.classList.add("copied");
        setTimeout(() => {
          copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7C14 6.06812 14 5.60218 13.8478 5.23463C13.6448 4.74458 13.2554 4.35523 12.7654 4.15224C12.3978 4 11.9319 4 11 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V11C4 11.9319 4 12.3978 4.15224 12.7654C4.35523 13.2554 4.74458 13.6448 5.23463 13.8478C5.60218 14 6.06812 14 7 14" stroke="#667085" stroke-width="1.5"/><rect x="10" y="10" width="10" height="10" rx="2" stroke="#667085" stroke-width="1.5"/></svg>`;
          copyBtn.classList.remove("copied");
        }, 2000);
      });

      actions.appendChild(copyBtn);

      // Edit button (only for user messages)
      if (sender === "user") {
        const editBtn = document.createElement("button");
        editBtn.className = "sg-wavy-chat-action-btn";
        editBtn.title = "Edit";
        editBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 5.66406C15.437 5.66406 15.7822 5.85079 16.0674 6.06836C16.3351 6.27268 16.6261 6.56559 16.9443 6.88379L17.1162 7.05566C17.4344 7.37386 17.7273 7.66487 17.9316 7.93262C18.1492 8.21777 18.3359 8.56297 18.3359 9C18.3359 9.43702 18.1492 9.78223 17.9316 10.0674C17.7273 10.3351 17.4344 10.6261 17.1162 10.9443L9.92188 18.1387C9.75541 18.3051 9.57789 18.4914 9.35059 18.6201C9.12333 18.7487 8.87283 18.8052 8.64453 18.8623L6.02637 19.5156L6.02344 19.5176L5.99023 19.5254C5.83421 19.5644 5.63429 19.617 5.46289 19.6338C5.28218 19.6515 4.92581 19.6524 4.63672 19.3633C4.34762 19.0742 4.34853 18.7178 4.36621 18.5371C4.38298 18.3657 4.4356 18.1658 4.47461 18.0098L5.1377 15.3555C5.19477 15.1272 5.25131 14.8767 5.37988 14.6494C5.50858 14.4221 5.69486 14.2446 5.86133 14.0781L13.0557 6.88379C13.3739 6.56559 13.6649 6.27268 13.9326 6.06836C14.2178 5.85079 14.563 5.66406 15 5.66406Z" stroke="#667085" stroke-width="1.5"/><path d="M12.5 7.5L15.5 5.5L18.5 8.5L16.5 11.5L12.5 7.5Z" fill="#667085"/></svg>`;

        // Edit functionality
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.editMessage(messageDiv, bubble, text, actions);
        });

        actions.appendChild(editBtn);
      }

      // AI response buttons (retry, like, dislike)
      if (sender === "ai") {
        // Retry button
        const retryBtn = document.createElement("button");
        retryBtn.className = "sg-wavy-chat-action-btn";
        retryBtn.title = "Retry";
        retryBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10C21 10 18.995 7.26822 17.3662 5.63824C15.7373 4.00827 13.4864 3 11 3C6.02944 3 2 7.02944 2 12C2 16.9706 6.02944 21 11 21C15.1031 21 18.5649 18.2543 19.6482 14.5M21 10V4M21 10H15" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        retryBtn.addEventListener("click", async (e) => {
          e.stopPropagation();

          // Get the last user message from conversation history
          const lastUserMessage = this.conversationHistory
            .slice()
            .reverse()
            .find((entry) => entry.role === "user");

          if (lastUserMessage) {
            // Remove current AI message
            messageDiv.remove();

            // Remove the last AI response from conversation history
            if (this.conversationHistory.length > 0 && this.conversationHistory[this.conversationHistory.length - 1].role === "assistant") {
              this.conversationHistory.pop();
            }

            // Add thinking message
            this.addChatMessage("Thinking...", "ai", true);

            // Retry with Mimo AI
            await this.chatWithMimo(lastUserMessage.content);
          }
        });

        actions.appendChild(retryBtn);

        // Like button
        const likeBtn = document.createElement("button");
        likeBtn.className = "sg-wavy-chat-action-btn";
        likeBtn.title = "Like";
        likeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14C13.4477 9 13 8.55228 13 8V4.46584C13 3.10399 11.896 2 10.5342 2C10.2093 2 9.91498 2.1913 9.78306 2.48812L7.26394 8.40614C7.09746 8.76727 6.74355 9 6.35013 9H4C2.89543 9 2 9.89543 2 11V13Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        likeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isLiked = likeBtn.classList.contains("liked");

          if (isLiked) {
            likeBtn.classList.remove("liked");
            likeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14C13.4477 9 13 8.55228 13 8V4.46584C13 3.10399 11.896 2 10.5342 2C10.2093 2 9.91498 2.1913 9.78306 2.48812L7.26394 8.40614C7.09746 8.76727 6.74355 9 6.35013 9H4C2.89543 9 2 9.89543 2 11V13Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          } else {
            likeBtn.classList.add("liked");
            likeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14C13.4477 9 13 8.55228 13 8V4.46584C13 3.10399 11.896 2 10.5342 2C10.2093 2 9.91498 2.1913 9.78306 2.48812L7.26394 8.40614C7.09746 8.76727 6.74355 9 6.35013 9H4C2.89543 9 2 9.89543 2 11V13Z" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#10b981"/></svg>`;
            // Remove dislike if it was active
            const dislikeBtn = actions.querySelector(".sg-wavy-chat-action-btn.disliked");
            if (dislikeBtn) {
              dislikeBtn.classList.remove("disliked");
              dislikeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83379 3.08025 4.60862 4.54377L3.53172 11.5438C3.25207 13.3611 4.65823 15 6.49685 15H10C10.5523 15 11 15.4477 11 16V19.5342C11 20.896 12.104 22 13.4658 22C13.7907 22 14.085 21.8087 14.2169 21.5119L16.7361 15.5939C16.9025 15.2327 17.2564 15 17.6499 15H20C21.1046 15 22 14.1046 22 13V11Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            }
          }
        });

        actions.appendChild(likeBtn);

        // Dislike button
        const dislikeBtn = document.createElement("button");
        dislikeBtn.className = "sg-wavy-chat-action-btn";
        dislikeBtn.title = "Dislike";
        dislikeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83379 3.08025 4.60862 4.54377L3.53172 11.5438C3.25207 13.3611 4.65823 15 6.49685 15H10C10.5523 15 11 15.4477 11 16V19.5342C11 20.896 12.104 22 13.4658 22C13.7907 22 14.085 21.8087 14.2169 21.5119L16.7361 15.5939C16.9025 15.2327 17.2564 15 17.6499 15H20C21.1046 15 22 14.1046 22 13V11Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

        dislikeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isDisliked = dislikeBtn.classList.contains("disliked");

          if (isDisliked) {
            dislikeBtn.classList.remove("disliked");
            dislikeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83379 3.08025 4.60862 4.54377L3.53172 11.5438C3.25207 13.3611 4.65823 15 6.49685 15H10C10.5523 15 11 15.4477 11 16V19.5342C11 20.896 12.104 22 13.4658 22C13.7907 22 14.085 21.8087 14.2169 21.5119L16.7361 15.5939C16.9025 15.2327 17.2564 15 17.6499 15H20C21.1046 15 22 14.1046 22 13V11Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
          } else {
            dislikeBtn.classList.add("disliked");
            dislikeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 2V13M22 11V4C22 2.89543 21.1046 2 20 2H7.57377C6.09297 2 4.83379 3.08025 4.60862 4.54377L3.53172 11.5438C3.25207 13.3611 4.65823 15 6.49685 15H10C10.5523 15 11 15.4477 11 16V19.5342C11 20.896 12.104 22 13.4658 22C13.7907 22 14.085 21.8087 14.2169 21.5119L16.7361 15.5939C16.9025 15.2327 17.2564 15 17.6499 15H20C21.1046 15 22 14.1046 22 13V11Z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="#ef4444"/></svg>`;
            // Remove like if it was active
            const likeBtn = actions.querySelector(".sg-wavy-chat-action-btn.liked");
            if (likeBtn) {
              likeBtn.classList.remove("liked");
              likeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 22V11M2 13V20C2 21.1046 2.89543 22 4 22H16.4262C17.907 22 19.1662 20.9197 19.3914 19.4562L20.4683 12.4562C20.7479 10.6389 19.3418 9 17.5032 9H14C13.4477 9 13 8.55228 13 8V4.46584C13 3.10399 11.896 2 10.5342 2C10.2093 2 9.91498 2.1913 9.78306 2.48812L7.26394 8.40614C7.09746 8.76727 6.74355 9 6.35013 9H4C2.89543 9 2 9.89543 2 11V13Z" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            }
          }
        });

        actions.appendChild(dislikeBtn);
      }

      content.appendChild(actions);
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  /**
   * Edit message functionality
   */
  editMessage(messageDiv, bubble, originalText, actions) {
    // Hide actions during edit
    actions.style.display = "none";

    // Create edit container
    const editContainer = document.createElement("div");
    editContainer.className = "sg-wavy-edit-container";

    const textarea = document.createElement("textarea");
    textarea.className = "sg-wavy-edit-textarea";
    textarea.value = originalText;

    const editActions = document.createElement("div");
    editActions.className = "sg-wavy-edit-actions";

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.className = "sg-wavy-edit-btn sg-wavy-edit-save";
    saveBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const newText = textarea.value.trim();
      if (newText && newText !== originalText) {
        bubble.textContent = newText;
        messageDiv.setAttribute("data-message-text", newText);
      }
      editContainer.remove();
      bubble.style.display = "block";
      actions.style.display = "flex";
    });

    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "sg-wavy-edit-btn sg-wavy-edit-cancel";
    cancelBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    cancelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editContainer.remove();
      bubble.style.display = "block";
      actions.style.display = "flex";
    });

    editActions.appendChild(saveBtn);
    editActions.appendChild(cancelBtn);
    editContainer.appendChild(textarea);
    editContainer.appendChild(editActions);

    // Hide bubble and insert edit container
    bubble.style.display = "none";
    bubble.parentNode.insertBefore(editContainer, bubble);

    // Focus and select text
    textarea.focus();
    textarea.select();

    // Auto-resize on load (height and width)
    textarea.style.height = "auto";
    // textarea.style.height = textarea.scrollHeight + "px";
  }

  /**
   * Remove thinking message
   */
  removeThinkingMessage() {
    const chatMessages = document.getElementById("sgWavyChatMessages");
    if (!chatMessages) return;

    const thinkingBubble = chatMessages.querySelector('[data-thinking="true"]');
    if (thinkingBubble) {
      const messageDiv = thinkingBubble.closest(".sg-wavy-chat-message");
      if (messageDiv) {
        messageDiv.remove();
      }
    }
  }

  /**
   * Open share modal
   */
  openShareModal() {
    const shareOverlay = document.getElementById("sgWavyShareModalOverlay");
    if (shareOverlay) {
      shareOverlay.classList.add("active");
    }
  }

  /**
   * Close share modal
   */
  closeShareModal() {
    const shareOverlay = document.getElementById("sgWavyShareModalOverlay");
    if (shareOverlay) {
      shareOverlay.classList.remove("active");
    }
  }

  /**
   * Chat with Mimo AI - integrated from mimo.js
   */
  async chatWithMimo(userMessage) {
    if (!userMessage) return;

    // Initialize conversation history if not exists
    if (!this.conversationHistory) {
      this.conversationHistory = [];
    }

    const userEntry = {
      role: "user",
      content: userMessage,
    };
    this.conversationHistory.push(userEntry);

    // Keep only last 10 messages for context
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }

    try {
      const response = await fetch("https://nzlhfstwceedylsbyyyq.supabase.co/functions/v1/smooth-function", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: this.conversationHistory,
          webSearch: false, // Can be made configurable later
        }),
      });

      const data = await response.json();

      // Remove thinking message
      this.removeThinkingMessage();

      if (response.ok && data.reply) {
        // Add bot response to conversation history
        const botEntry = {
          role: "assistant",
          content: data.reply,
        };
        this.conversationHistory.push(botEntry);

        // Add AI response message
        this.addChatMessage(data.reply, "ai");
      } else if (data.error) {
        // Handle API error
        this.addChatMessage(`Sorry, I encountered an error: ${data.error}`, "ai");
      } else {
        // Handle unknown error
        this.addChatMessage("Sorry, I encountered an unknown error. Please try again.", "ai");
      }
    } catch (error) {
      console.error("Mimo AI fetch error:", error);

      // Remove thinking message
      this.removeThinkingMessage();

      // Add error message
      this.addChatMessage("Sorry, I'm having trouble connecting right now. Please check your internet connection and try again.", "ai");
    }
  }

  /**
   * Clear conversation history
   */
  clearConversationHistory() {
    this.conversationHistory = [];

    // Also clear the chat messages UI
    const chatMessages = document.getElementById("sgWavyChatMessages");
    if (chatMessages) {
      chatMessages.innerHTML = "";
    }

    // Show the chat header again
    const chatHeader = document.querySelector("#sgWavyModalChat .sg-wavy-chat-header");
    if (chatHeader) {
      chatHeader.style.display = "flex";
    }
  }

  //
  _gotoInterface(pageNumber, micEvent = false) {
    const isColloquial = window.colloquialToggle.getColloquialState();

    //
    if (isColloquial) {
      this.sgWavyToneSelector.setAttribute("data-title", "colloquial");
      this.sgWavyToneSelector.querySelector("span").textContent = "Colloquial Tone";
    } else {
      this.sgWavyToneSelector.setAttribute("data-title", "normal");
      this.sgWavyToneSelector.querySelector("span").textContent = "Normal Tone";
    }

    //
    if (micEvent) {
      this.sendBtn.setAttribute("data-wavy-stop", true);
    } else {
      this.sendBtn.removeAttribute("data-wavy-stop");
    }

    if (pageNumber === 1) {
      this.sgWavyModalContainers.forEach((container) => container.classList.add(HIDDEN_CLASS));
      this.sgWavyModalInitial.classList.remove(HIDDEN_CLASS);
      this.sgWavyLeftHeaderButton.setAttribute("data-current", "initial");
      this.sgWavyRightHeaderButton.setAttribute("data-current", "initial");
    } else if (pageNumber === 2) {
      this.sgWavyModalContainers.forEach((container) => container.classList.add(HIDDEN_CLASS));
      this.sgWavyModalChat.classList.remove(HIDDEN_CLASS);
      this.sgWavyLeftHeaderButton.setAttribute("data-current", "chat");
      this.sgWavyRightHeaderButton.setAttribute("data-current", "chat");

      // Initialize with welcome message if no conversation exists
      if (this.conversationHistory.length === 0) {
        const chatMessages = document.getElementById("sgWavyChatMessages");
        if (chatMessages && chatMessages.children.length === 0) {
          this.addChatMessage("Hello! I'm Wavy AI 👋 How can I help you today?", "ai");
        }
      }
    } else if (pageNumber === 3) {
      this.sgWavyModalContainers.forEach((container) => container.classList.add(HIDDEN_CLASS));
      this.sgWavyModalSpeak.classList.remove(HIDDEN_CLASS);
      this.sgWavyLeftHeaderButton.setAttribute("data-current", "chat");
      this.sgWavyRightHeaderButton.setAttribute("data-current", "chat");
    } else if (pageNumber === 4) {
      this.sgWavyModalContainers.forEach((container) => container.classList.add(HIDDEN_CLASS));
      this.sgWavyModalHistory.classList.remove(HIDDEN_CLASS);
      this.sgWavyLeftHeaderButton.setAttribute("data-current", "chat");
      this.sgWavyRightHeaderButton.setAttribute("data-current", "chat");

      this.sgWavyToneSelector.setAttribute("data-title", "history");
      this.sgWavyToneSelector.querySelector("span").textContent = "History";
    }
  }

  /**
   * Handle trigger button click
   */
  _onTriggerClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isOpen) this.close();
    else this.open();
  }

  /**
   * Handle document clicks (close on click outside)
   */
  _onDocumentClick(e) {
    // Don't close if in sidebar mode or full-width mode
    if (this.isSidebarMode || this.isFullWidthMode) return;

    if (this.isOpen && !this.modalEl.contains(e.target) && e.target !== this.triggerEl) {
      this.close();
    }
  }

  /**
   * Handle keyboard events (ESC to close)
   */
  _onKeyDown(e) {
    if (e.key === "Escape" && this.isOpen) this.close();
  }

  /**
   * Handle window resize - update Popper position
   */
  _onResize() {
    if (!this.isOpen) return;
    if (this.popperInstance) this.popperInstance.update();
  }

  /**
   * Open the modal
   */
  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.modalEl.classList.add("active");

    this._gotoInterface(1);

    // RESET
    document.querySelectorAll(".colloquial-content-toggle").forEach((content) => (content.textContent = "Colloquial Tone"));
    document.querySelectorAll(".ai_modal .gradient-orb").forEach((orb) => orb.classList.remove("orb-red"));
    document.getElementById("switch-to-colloqual-sidebar").checked = true;
    document.getElementById("switch-to-colloqual").checked = true;

    // Create Popper instance (only on desktop)
    this._createPopper();
  }

  /**
   * Close the modal
   */
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.modalEl.classList.remove("active");

    // Clean up Popper
    this._destroyPopper();
  }

  /**
   * Toggle sidebar mode
   */
  toggleSidebarMode(listItem) {
    // Exit full-width mode if active
    if (this.isFullWidthMode) {
      this.modalEl.classList.remove("fullwidth-mode");
      this.isFullWidthMode = false;
      this._removeBackdrop();
      // Update modal text in both menus
      this._updateMenuText("modal", "Set to full width");
    }

    this.isSidebarMode = !this.isSidebarMode;

    if (this.isSidebarMode) {
      // Switch to sidebar mode
      this.modalEl.classList.add("sidebar-mode");
      this._destroyPopper(); // Destroy Popper when in sidebar mode

      // Ensure modal is open when switching to sidebar
      if (!this.isOpen) {
        this.open();
      }

      // Update text in both menus
      this._updateMenuText("sidebar", "Back to widget");
    } else {
      // Switch back to widget mode
      this.modalEl.classList.remove("sidebar-mode");
      // Update text in both menus
      this._updateMenuText("sidebar", "Fix as sidebar");

      // Wait for CSS transition to complete before recreating Popper
      if (this.isOpen) {
        setTimeout(() => {
          this._createPopper(); // Recreate Popper when switching back
          // Force an immediate update after creation
          if (this.popperInstance) {
            this.popperInstance.update();
          }
        }, 450); // Slightly longer than the 0.4s CSS transition
      }
    }
  }

  /**
   * Update menu text in both header and sidebar options
   */
  _updateMenuText(menuType, text) {
    // Update in header menu
    const headerMenuItem = this.sgWavyTextVoiceOptions?.querySelector(`li.${menuType}`);
    if (headerMenuItem) {
      const span = headerMenuItem.querySelector("span");
      if (span) span.textContent = text;
    }

    // Update in sidebar menu
    const sidebarMenuItem = this.sgWavySidebarOptions?.querySelector(`li.${menuType}`);
    if (sidebarMenuItem) {
      const span = sidebarMenuItem.querySelector("span");
      if (span) span.textContent = text;
    }
  }

  /**
   * Toggle widget mode (small modal)
   */
  toggleWidgetMode(listItem) {
    // Exit sidebar mode if active
    if (this.isSidebarMode) {
      this.modalEl.classList.remove("sidebar-mode");
      this.isSidebarMode = false;
      this._updateMenuText("sidebar", "Fix as sidebar");
    }

    // Exit full-width mode if active
    if (this.isFullWidthMode) {
      this.modalEl.classList.remove("fullwidth-mode");
      this.isFullWidthMode = false;
      this._removeBackdrop();
      this._updateMenuText("modal", "Set to full width");
    }

    // Switch to widget mode (default modal behavior)
    this._updateMenuText("widget", "Set as widget");

    // Recreate Popper for widget mode
    if (this.isOpen) {
      setTimeout(() => {
        this._createPopper();
        if (this.popperInstance) {
          this.popperInstance.update();
        }
      }, 100);
    }
  }

  /**
   * Toggle full-width mode (now called modal mode)
   */
  toggleFullWidthMode(listItem) {
    // Exit sidebar mode if active
    if (this.isSidebarMode) {
      this.modalEl.classList.remove("sidebar-mode");
      this.isSidebarMode = false;
      // Update sidebar text in both menus
      this._updateMenuText("sidebar", "Fix as sidebar");
    }

    this.isFullWidthMode = !this.isFullWidthMode;

    if (this.isFullWidthMode) {
      // Switch to full-width mode
      this.modalEl.classList.add("fullwidth-mode");
      this._destroyPopper(); // Destroy Popper when in full-width mode
      this._addBackdrop();
      // Update text in both menus
      this._updateMenuText("modal", "Exit full width");
    } else {
      // Switch back to widget mode
      this.modalEl.classList.remove("fullwidth-mode");
      this._removeBackdrop();
      // Update text in both menus
      this._updateMenuText("modal", "Set to full width");

      // Wait for CSS transition to complete before recreating Popper
      if (this.isOpen) {
        setTimeout(() => {
          this._createPopper(); // Recreate Popper when switching back
          // Force an immediate update after creation
          if (this.popperInstance) {
            this.popperInstance.update();
          }
        }, 450); // Slightly longer than the 0.4s CSS transition
      }
    }
  }

  /**
   * Add backdrop for full-width mode
   */
  _addBackdrop() {
    let backdrop = document.getElementById("sgWavyFullwidthBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "sgWavyFullwidthBackdrop";
      backdrop.className = "sg-wavy-fullwidth-backdrop";
      backdrop.addEventListener("click", () => {
        if (this.isFullWidthMode) {
          this.toggleFullWidthMode();
        }
      });
      document.body.appendChild(backdrop);
    }
    setTimeout(() => backdrop.classList.add("active"), 10);
  }

  /**
   * Remove backdrop
   */
  _removeBackdrop() {
    const backdrop = document.getElementById("sgWavyFullwidthBackdrop");
    if (backdrop) {
      backdrop.classList.remove("active");
      setTimeout(() => backdrop.remove(), 300);
    }
  }

  /**
   * Destroy modal and remove all event listeners
   */
  destroy() {
    this.triggerEl.removeEventListener("click", this._onTriggerClick);
    document.removeEventListener("click", this._onDocumentClick);
    document.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("resize", this._onResize);
    this._destroyPopper();
  }

  /**
   * Create Popper instance to position modal
   */
  _createPopper() {
    // Don't create Popper if in sidebar mode or full-width mode
    if (this.isSidebarMode || this.isFullWidthMode) return;

    const contentArea = this.modalEl.querySelector("#modalContent");
    if (!contentArea) return;

    // Destroy existing instance
    if (this.popperInstance) this.popperInstance.destroy();

    // Create new Popper instance
    this.popperInstance = Popper.createPopper(this.triggerEl, this.modalEl, {
      placement: "bottom",
      modifiers: [
        { name: "offset", options: { offset: [0, 12] } },
        { name: "preventOverflow", options: { padding: 16 } },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "bottom-start", "bottom-end"], // Updated fallbacks
          },
        },
        { name: "eventListeners", options: { scroll: true, resize: true } },
      ],
    });
  }
  /**
   * Destroy Popper instance
   */
  _destroyPopper() {
    if (this.popperInstance) {
      try {
        this.popperInstance.destroy();
      } catch (err) {
        console.error("Error destroying Popper:", err);
      }
      this.popperInstance = null;
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Check if Popper.js is loaded
  if (typeof Popper === "undefined" && typeof window.Popper === "undefined") {
    console.error("Popper.js not found. Include CDN: https://cdn.jsdelivr.net/npm/@popperjs/core@2");
    return;
  }

  // Create global modal instance
  window.aiModal = new AIModal({
    trigger: "#showAIModal",
    modal: "#aiModal",
    placement: "bottom-start",
    mobileBreakpoint: 640,
  });

  // Initialize modal
  window.aiModal.init();

  // Sanity check
  if (!document.querySelector("#showAIModal")) {
    console.warn("#showAIModal not found — modal cannot anchor without trigger element.");
  }
});
