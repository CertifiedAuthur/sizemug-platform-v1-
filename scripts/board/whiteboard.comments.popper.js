class CommentsPopper {
  /**
   * @param {HTMLElement} button - The button that triggers the comments popper.
   * @param {HTMLElement} container - The comments container to show/hide.
   * @param {Function} hideAllDropdowns - callback to hide other sticky dropdowns
   */
  constructor(button, container, hideAllDropdowns) {
    this.button = button;
    this.container = container;
    this.hideAllDropdowns = hideAllDropdowns;

    this.isOpen = false; // ← track state
    this.commentLists = container.querySelector(".comment_lists");
    this.writeReplyContainer = document.querySelector(".write_new_comment");
    this.closeCommentModal = document.getElementById("closeCommentModal");
    this.replyToCommentId = null; // ← track which comment we're replying to

    this.comments = typeof commentsData !== "undefined" ? commentsData : [];
    this.init();

    this.handleAddComment();
  }

  init() {
    const topLevelComments = this.getTopLevelComments();
    this.renderComments(topLevelComments);
    this.button.addEventListener("click", this.handleShowHide.bind(this));
    this.container.addEventListener("click", this.handleContainerClick.bind(this));
    this.closeCommentModal.addEventListener("click", this.handleShowHide.bind(this));
    this.container.addEventListener("click", this.attachReplyListeners.bind(this));
  }

  getTopLevelComments() {
    return this.comments.filter((comment) => !comment.parentCommentId);
  }

  getRepliesForComment(commentId) {
    return this.comments.filter((comment) => comment.parentCommentId === +commentId);
  }

  show() {
    if (!this.isOpen) {
      // first, hide everything else
      this.hideAllDropdowns?.();
      this.button.classList.add("active");
      this.container.classList.remove(HIDDEN);
      this.isOpen = true;
    }
  }

  hide() {
    if (this.isOpen) {
      this.button.classList.remove("active");
      this.container.classList.add(HIDDEN);
      this.isOpen = false;
    }
  }

  handleShowHide() {
    // toggle based purely on our isOpen flag
    this.isOpen ? this.hide() : this.show();
  }

  renderComments(comments) {
    this.commentLists.innerHTML = "";
    comments.forEach((comment) => {
      const repliesCount = this.getRepliesForComment(comment.id).length;

      const markup = `
        <div class="comment_item" data-comment-id="${comment.id}">
                <div>
                         <img src="${comment.photo}" alt="${comment.name}" />
                </div>

                <div>
                        <div class="heading">
                                <a href="/profile.html">${comment.name}</a>
                                ${
                                  Math.random() > 0.5
                                    ? `
                                    <span>
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>
                                    </span>
                                    `
                                    : ""
                                }
                                <span>&bull;</span>
                                <span>${comment.createdAt}</span>
                        </div>
                        <div class="comment_text">${comment.comment}</div>
                        <div class="comment_actions">
                          <span class="reply_link" data-comment-id="${comment.id}">Reply</span>
                          ${repliesCount ? `<span class="replies_toggle" data-comment-id="${comment.id}">${repliesCount} ${repliesCount === 1 ? "reply" : "replies"}</span>` : ""}
                        </div>
                </div>
        </div>
    `;
      this.commentLists.insertAdjacentHTML("beforeend", markup);
    });
  }

  renderReplies(commentId, repliesContainer) {
    const replies = this.getRepliesForComment(commentId);
    repliesContainer.innerHTML = "";

    replies.forEach((reply) => {
      const nestedRepliesCount = this.getRepliesForComment(reply.id).length;

      const markup = `
        <div class="comment_item" data-comment-id="${reply.id}">
                <div>
                         <img src="${reply.photo}" alt="${reply.name}" />
                </div>

                <div>
                        <div class="heading">
                                <a href="/profile.html">${reply.name}</a>
                                ${
                                  Math.random() > 0.5
                                    ? `
                                    <span>
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>
                                    </span>
                                    `
                                    : ""
                                }
                                <span>&bull;</span>
                                <span>${reply.createdAt}</span>
                        </div>
                        <div class="comment_text">${reply.comment}</div>
                        <div class="comment_actions">
                          <span class="reply_link" data-comment-id="${reply.id}">Reply</span>
                          ${nestedRepliesCount ? `<span class="replies_toggle" data-comment-id="${reply.id}">${nestedRepliesCount} ${nestedRepliesCount === 1 ? "reply" : "replies"}</span>` : ""}
                        </div>
                </div>
        </div>
    `;
      repliesContainer.insertAdjacentHTML("beforeend", markup);

      // Recursively render nested replies if they exist
      if (nestedRepliesCount > 0) {
        const nestedRepliesContainer = document.createElement("div");
        nestedRepliesContainer.classList.add("replies", `replies_container--${reply.id}`, HIDDEN);
        repliesContainer.querySelector(".comment_item:last-child").appendChild(nestedRepliesContainer);
      }
    });
  }

  handleContainerClick(e) {
    const target = e.target;
    // Show Comment Replies
    const toggleBtn = target.closest(".replies_toggle");
    if (toggleBtn) {
      const { commentId } = toggleBtn.dataset;
      let repliesContainer = document.querySelector(`.replies_container--${commentId}`);

      // Create container if it doesn't exist
      if (!repliesContainer) {
        repliesContainer = document.createElement("div");
        repliesContainer.classList.add("replies", `replies_container--${commentId}`);
        const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);

        if (commentItem) {
          commentItem.appendChild(repliesContainer);
          this.renderReplies(commentId, repliesContainer);
          this.invalidateToggle(toggleBtn, commentId, "show");
          return;
        }
      }

      if (repliesContainer.classList.contains(HIDDEN)) {
        repliesContainer.classList.remove(HIDDEN);
        this.invalidateToggle(toggleBtn, commentId, "show");
      } else {
        // Hide replies
        repliesContainer.classList.add(HIDDEN);
        this.invalidateToggle(toggleBtn, commentId, "hide");
      }
    }
  }

  invalidateToggle(toggleBtn, commentId, show = "show") {
    const count = this.getRepliesForComment(commentId).length;
    if (show === "show") {
      toggleBtn.textContent = `Hide ${count === 1 ? "reply" : "replies"}`;
    } else {
      toggleBtn.textContent = `${count} ${count === 1 ? "reply" : "replies"}`;
    }
  }

  attachReplyListeners(e) {
    const target = e.target;
    const toggleReply = target.closest(".reply_link");

    if (toggleReply) {
      if (toggleReply.classList.contains("show")) {
        document.querySelectorAll(".reply_link").forEach((link) => link.classList.remove("show"));
        toggleReply.classList.remove("show");
        this.writeReplyContainer.classList.add(HIDDEN);
        this.replyToCommentId = null;
      } else {
        toggleReply.classList.add("show");
        this.writeReplyContainer.classList.remove(HIDDEN);

        const commentId = toggleReply.closest(".comment_item").dataset.commentId;
        this.replyToCommentId = +commentId;
      }
      return;
    }
  }

  findCommentById(id) {
    return this.comments.find((comment) => comment.id === id);
  }

  handleAddComment() {
    const addCommentBtn = document.getElementById("addComment");
    const replyInput = document.querySelector("#reply_wrapper--desktop .reply_area");

    if (!addCommentBtn || !replyInput) return;

    addCommentBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const commentText = replyInput.value.trim();

      if (!commentText) return;

      const newComment = {
        id: Date.now().toString(),
        name: "You",
        photo: "https://images.unsplash.com/photo-1556474835-b0f3ac40d4d1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
        comment: commentText,
        createdAt: "Just now",
        parentCommentId: this.replyToCommentId || null,
      };

      // Add to flat comments array
      this.comments.push(newComment);

      // Re-render top-level comments
      const topLevelComments = this.getTopLevelComments();
      this.renderComments(topLevelComments);

      // Clear input and hide reply container
      replyInput.value = "";
      this.handleAddClass(this.writeReplyContainer);
      this.replyToCommentId = null;
    });
  }

  handleContainClass(element) {
    return element.classList.contains(HIDDEN);
  }

  handleAddClass(element) {
    element.classList.add(HIDDEN);
  }

  handleRemoveClass(element) {
    element.classList.remove(HIDDEN);
  }
}

// Usage:
const showCommentContainer = document.querySelector(".show_comments");
const commentContainer = document.getElementById("whiteboard_comment_container--holding");
if (showCommentContainer && commentContainer) {
  new CommentsPopper(showCommentContainer, commentContainer);
}

window.CommentsPopper = CommentsPopper;
