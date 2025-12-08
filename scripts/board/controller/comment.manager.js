class CommentManager {
  constructor(stage, getTransform, app) {
    this.stage = stage;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // State management
    this.comments = new Map(); // id -> comment object
    this.activeComment = null; // currently editing comment
    this.activeTool = "select"; // Start with select tool like other managers
    this.active = false; // Whether the comment manager is active
    this.nextId = 1;

    // Create container for all comments
    this.container = document.createElement("div");
    this.container.id = "comments-container";
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.pointerEvents = "none"; // Let clicks pass through container
    this.container.style.zIndex = "1000";
    this.stage.appendChild(this.container);

    // Bind methods
    this._onStageClick = this._onStageClick.bind(this);
    this._onAppToolChange = this._onAppToolChange.bind(this);

    // Subscribe to tool changes
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    // Listen for stage clicks when comment tool is active
    this.stage.addEventListener("pointerdown", this._onStageClick);
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    // Set active state based on tool
    this.setActive(tool === "comment");

    // Close any active comment editor when switching away from comment tool
    if (tool !== "comment" && this.activeComment) {
      this._closeActiveEditor();
    }
  }

  setActive(active) {
    this.active = !!active;
  }

  _onStageClick(e) {
    // Only handle clicks when comment tool is active
    if (!this.active || this.activeTool !== "comment") return;

    // Ignore if clicking on an existing comment
    if (e.target.closest(".comment-bubble, .comment-editor")) return;

    // Get world coordinates
    const transform = this.getTransform();
    const worldX = (e.clientX - transform.x) / transform.k;
    const worldY = (e.clientY - transform.y) / transform.k;

    // Close any existing active editor first
    if (this.activeComment) {
      this._closeActiveEditor();
    }

    // Create new comment
    this._createComment(worldX, worldY);

    e.stopPropagation();
    e.preventDefault();
  }

  _createComment(worldX, worldY) {
    const id = `comment-${this.nextId++}`;

    const comment = {
      id,
      worldX,
      worldY,
      text: "",
      author: "You", // Could be dynamic based on user
      timestamp: new Date(),
      resolved: false,
    };

    this.comments.set(id, comment);
    this._createCommentDOM(comment);
    this._showEditor(comment);
  }

  _createCommentDOM(comment) {
    // Create comment wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "comment-wrapper";
    wrapper.dataset.commentId = comment.id;
    wrapper.style.position = "absolute";
    wrapper.style.pointerEvents = "auto";
    wrapper.style.zIndex = "1001";

    // Create comment bubble (the circular avatar-like indicator)
    const bubble = document.createElement("div");
    bubble.className = "comment-bubble";
    bubble.style.cssText = `
      width: 45px;
      height: 45px;
      background: #7c3aed;
      border: 2px solid white;
      border-radius: 30px 30px 30px 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      transition: transform 0.2s ease;
    `;

    // Add comment count or icon
    const image = document.createElement("img");
    image.style.width = "30px";
    image.style.height = "30px";
    image.style.borderRadius = "50%";
    image.src = "https://avatars.githubusercontent.com/u/80651195?v=4";
    image.alt = "Comment Image ALT";

    bubble.appendChild(image);

    // Hover effect
    bubble.addEventListener("mouseenter", () => {
      bubble.style.transform = "scale(1.1)";
    });
    bubble.addEventListener("mouseleave", () => {
      bubble.style.transform = "scale(1)";
    });

    // Click to show/edit comment
    bubble.addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.activeComment && this.activeComment.id === comment.id) {
        this._closeActiveEditor();
      } else {
        this._closeActiveEditor(); // Close any other active editor
        this._showEditor(comment);
      }
    });

    wrapper.appendChild(bubble);
    this.container.appendChild(wrapper);

    // Store DOM reference
    comment.wrapper = wrapper;
    comment.bubble = bubble;

    // Position the comment
    this._updateCommentPosition(comment);
  }

  _showEditor(comment) {
    this.activeComment = comment;

    // Create editor container
    const editor = document.createElement("div");
    editor.className = "comment-editor";
    editor.style.cssText = `
      position: absolute;
      left: 40px;
      top: -8px;
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      padding: 16px;
      z-index: 1002;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create header with avatars (Figma style)
    const header = document.createElement("div");
    header.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    `;

    // Create avatar group (like in your image)
    const avatarGroup = document.createElement("div");
    avatarGroup.style.cssText = `
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, #7c3aed, #3b82f6);
      border-radius: 20px;
      padding: 4px 12px 4px 4px;
      margin-right: auto;
    `;

    // Add placeholder avatar
    const avatar1 = document.createElement("div");
    avatar1.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #64748b;
      margin-right: 8px;
      border: 2px solid white;
    `;

    // Add user images (you can replace with actual user avatars)
    const avatar2 = document.createElement("div");
    avatar2.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #f59e0b;
      margin-right: 8px;
      border: 2px solid white;
    `;

    const avatar3 = document.createElement("div");
    avatar3.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid white;
    `;

    avatarGroup.appendChild(avatar1);
    avatarGroup.appendChild(avatar2);
    avatarGroup.appendChild(avatar3);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.style.cssText = `
      background: none;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      font-size: 18px;
      hover: background-color: #f1f5f9;
    `;
    closeBtn.innerHTML = "×";
    closeBtn.addEventListener("click", () => this._closeActiveEditor());

    header.appendChild(avatarGroup);
    header.appendChild(closeBtn);

    // Create textarea
    const textarea = document.createElement("textarea");
    textarea.style.cssText = `
      width: 100%;
      min-height: 60px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 14px;
      font-family: inherit;
      resize: vertical;
      outline: none;
      margin-bottom: 12px;
    `;
    textarea.placeholder = "Add a comment...";
    textarea.value = comment.text;

    // Focus and select
    setTimeout(() => {
      textarea.focus();
      if (!comment.text) {
        textarea.select();
      }
    }, 100);

    // Create footer with actions
    const footer = document.createElement("div");
    footer.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    // Resolve checkbox
    const resolveContainer = document.createElement("label");
    resolveContainer.style.cssText = `
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 13px;
      color: #64748b;
    `;

    const resolveCheckbox = document.createElement("input");
    resolveCheckbox.type = "checkbox";
    resolveCheckbox.checked = comment.resolved;
    resolveCheckbox.style.marginRight = "6px";

    resolveContainer.appendChild(resolveCheckbox);
    resolveContainer.appendChild(document.createTextNode("Resolved"));

    // Action buttons
    const actions = document.createElement("div");
    actions.style.cssText = `display: flex; gap: 8px;`;

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.style.cssText = `
      background: none;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      color: #dc2626;
    `;
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => this._deleteComment(comment.id));

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.style.cssText = `
      background: #7c3aed;
      border: none;
      border-radius: 6px;
      padding: 6px 16px;
      color: white;
      font-size: 13px;
      cursor: pointer;
      font-weight: 500;
    `;
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => {
      comment.text = textarea.value.trim();
      comment.resolved = resolveCheckbox.checked;
      this._saveComment(comment);
      this._closeActiveEditor();

      // Switch to select tool after saving
      if (this.app && typeof this.app.setTool === "function") {
        this.app.setTool("select");
      }
    });

    actions.appendChild(deleteBtn);
    actions.appendChild(saveBtn);
    footer.appendChild(resolveContainer);
    footer.appendChild(actions);

    // Assemble editor
    editor.appendChild(header);
    editor.appendChild(textarea);
    editor.appendChild(footer);

    // Add to wrapper
    comment.wrapper.appendChild(editor);
    comment.editor = editor;

    // Handle keyboard shortcuts
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this._closeActiveEditor();
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        saveBtn.click();
      }
    });

    // Update bubble appearance
    comment.bubble.style.background = comment.resolved ? "#10b981" : "#7c3aed";
  }

  _closeActiveEditor() {
    if (!this.activeComment) return;

    const editor = this.activeComment.editor;
    if (editor) {
      editor.remove();
      delete this.activeComment.editor;
    }

    this.activeComment = null;
  }

  _saveComment(comment) {
    // Update bubble text/appearance
    if (comment.text.trim()) {
      comment.bubble.style.fontSize = "12px";
    } else {
      comment.bubble.textContent = this.comments.size;
      comment.bubble.style.fontSize = "14px";
    }

    // Update resolved state
    comment.bubble.style.background = comment.resolved ? "#10b981" : "#7c3aed";

    // Dispatch event for other systems
    window.dispatchEvent(
      new CustomEvent("comment-saved", {
        detail: { comment: { ...comment } },
      })
    );
  }

  _deleteComment(commentId) {
    const comment = this.comments.get(commentId);
    if (!comment) return;

    // Remove DOM elements
    if (comment.wrapper) {
      comment.wrapper.remove();
    }

    // Remove from map
    this.comments.delete(commentId);

    // Clear active if this was active
    if (this.activeComment && this.activeComment.id === commentId) {
      this.activeComment = null;
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("comment-deleted", {
        detail: { commentId },
      })
    );
  }

  _updateCommentPosition(comment) {
    if (!comment.wrapper) return;

    const transform = this.getTransform();
    const screenX = comment.worldX * transform.k + transform.x;
    const screenY = comment.worldY * transform.k + transform.y;

    comment.wrapper.style.left = `${screenX}px`;
    comment.wrapper.style.top = `${screenY}px`;
  }

  // Public methods for integration with main app
  refreshScreenPositions() {
    this.comments.forEach((comment) => {
      this._updateCommentPosition(comment);
    });
  }

  // Get all comments (for saving/loading)
  getComments() {
    return Array.from(this.comments.values()).map((comment) => ({
      id: comment.id,
      worldX: comment.worldX,
      worldY: comment.worldY,
      text: comment.text,
      author: comment.author,
      timestamp: comment.timestamp,
      resolved: comment.resolved,
    }));
  }

  // Load comments (for restoring saved state)
  loadComments(commentData) {
    this.comments.clear();
    this.container.innerHTML = "";

    commentData.forEach((data) => {
      const comment = { ...data };
      this.comments.set(comment.id, comment);
      this._createCommentDOM(comment);
    });

    // Update next ID
    if (commentData.length > 0) {
      const maxId = Math.max(...commentData.map((c) => parseInt(c.id.replace("comment-", ""))));
      this.nextId = maxId + 1;
    }
  }

  // Clear all comments
  clear() {
    this.comments.clear();
    this.container.innerHTML = "";
    this.activeComment = null;
    this.nextId = 1;
  }

  // Cleanup
  destroy() {
    if (this._unsubTool) this._unsubTool();
    if (this._onToolChangeHandler) {
      this.app.toolManager.removeEventListener("change", this._onToolChangeHandler);
    }
    this.stage.removeEventListener("pointerdown", this._onStageClick);
    if (this.container) {
      this.container.remove();
    }
  }
}
