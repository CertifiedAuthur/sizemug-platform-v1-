class FlipCardManager {
  BACK_FLIP_ICON = `<svg width="15" height="15" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 11L10.5 15L14.5 19" stroke="#33363F" stroke-width="2"/><path d="M4.70577 12.75C3.71517 11.8921 3.3184 10.8948 3.577 9.91263C3.8356 8.9305 4.73511 8.01848 6.13604 7.31802C7.53696 6.61756 9.36101 6.1678 11.3253 6.0385C13.2895 5.9092 15.2842 6.10758 17 6.60289C18.7158 7.09819 20.0567 7.86273 20.8149 8.77792C21.5731 9.69312 21.7061 10.7078 21.1933 11.6647C20.6806 12.6215 19.5507 13.467 17.9789 14.0701C16.4071 14.6731 14.4812 15 12.5 15" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>`;
  FRONT_FLIP_ICON = `<svg width="15" height="15" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 11L14.5 15L10.5 19" stroke="#33363F" stroke-width="2"/><path d="M20.2942 12.75C21.2848 11.8921 21.6816 10.8948 21.423 9.91263C21.1644 8.9305 20.2649 8.01848 18.864 7.31802C17.463 6.61756 15.639 6.1678 13.6747 6.0385C11.7105 5.9092 9.71578 6.10758 8 6.60289C6.28422 7.09819 4.94326 7.86273 4.18508 8.77792C3.42691 9.69312 3.29389 10.7078 3.80667 11.6647C4.31944 12.6215 5.44935 13.467 7.02115 14.0701C8.59295 14.6731 10.5188 15 12.5 15" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>`;

  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // Card storage and state
    this.counter = 0;
    this.items = new Map(); // id -> { id, wrap, frontContent, backContent, handles, isFlipped }
    this._editingId = null;

    // Interaction state
    this._activeDrag = null;
    this._activeResize = null;
    this.currentSelectedCardId = null;

    // Tool state
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "flipcard";

    // Default properties (kept in JS for measurements)
    this.defaults = {
      width: 280,
      height: 160,
      backgroundColor: "#ffffff",
      borderColor: "#e1e5e9",
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 14,
      padding: 16,
    };

    // Bind event handlers
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onDocPointerMove = this._onDocPointerMove.bind(this);
    this._onDocPointerUp = this._onDocPointerUp.bind(this);
    this._onStagePointerDown = this._onStagePointerDown.bind(this);

    // Subscribe to tool changes
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    // Get reference to the editor element
    this._editorEl = document.getElementById("whiteboardEditorWrapperFlipCard");
    this._selectedCodeFlipCardId = null;

    this._editorRAF = null;
    this._lastEditorState = null;
    this._selectedCodeFlipCardId = null;

    // Initialize Interact.js support
    this._initializeInteract();

    // Listen for stage clicks
    this.stage.addEventListener("pointerdown", this._onStagePointerDown);

    // Initialize flip card editor
    this._initFlipCardEditor();
  }

  // Helper method to get the hidden class (supports different frameworks)
  _getHiddenClass() {
    return typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";
  }

  _initFlipCardEditor() {
    if (this._editorEl) {
      if (this._editorEl.parentElement !== document.body) {
        document.body.appendChild(this._editorEl);
      }
      // editor positioning handled by CSS in your app (we just make sure it's focusable)
      this._editorEl.style.zIndex = 10001;
      this._editorEl.setAttribute("tabindex", "-1");

      this._editorEl.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        this._keepEditorVisible = true;
        const interactive = e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
      });

      this._editorEl.addEventListener("click", (e) => e.stopPropagation());
      this._editorEl.addEventListener("pointerup", (e) => {
        e.stopPropagation();
        this._keepEditorVisible = false;
      });
    }

    // Bind flip card toolbar events
    this._bindFlipCardToolbarEvents();
  }

  // Method to update editor position during transformations
  updateEditorToolbarPosition() {
    if (!this._editorEl || this._editorEl.classList.contains(this._getHiddenClass())) {
      return;
    }

    const wrap = this._selectedCodeFlipCardId ? this.items.get(this._selectedCodeFlipCardId)?.wrap : null;

    if (wrap) {
      this._positionFlipCardEditor(wrap);
    }
  }

  _positionFlipCardEditor(wrap = null) {
    if (!this._editorEl) return;

    const editor = this._editorEl;
    const gap = 8;

    // If we have a card wrap, compute its screen coords using getTransform() + world coords.
    if (wrap) {
      const t = this.getTransform(); // must return { x, y, k }
      const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
      const worldTop = parseFloat(wrap.dataset.worldTop || 0);
      const worldWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);

      // screen coordinates in page space (same coordinate system you use when positioning cards)
      const screenLeft = worldLeft * t.k + t.x;
      const screenTop = worldTop * t.k + t.y;
      const screenWidth = worldWidth * t.k;

      // center the editor above the card
      let left = screenLeft + screenWidth / 2 - editor.offsetWidth / 2;
      let candidateTop = screenTop - editor.offsetHeight - gap;

      // keep editor on-screen
      const minLeft = gap;
      const maxLeft = Math.max(window.innerWidth - editor.offsetWidth - gap, gap);
      left = Math.round(Math.max(minLeft, Math.min(left, maxLeft)));

      const minTop = gap;
      const top = Math.round(Math.max(minTop, candidateTop));

      editor.style.position = "absolute";
      editor.style.left = `${left}px`;
      editor.style.top = `${top}px`;
      editor.style.zIndex = "1000";
    } else {
      // fallback: put editor centered at top of viewport
      const left = Math.round(window.innerWidth / 2 - editor.offsetWidth / 2);
      const top = gap;
      editor.style.position = "absolute";
      editor.style.left = `${left}px`;
      editor.style.top = `${top}px`;
      editor.style.zIndex = "1000";
    }
  }

  _bindFlipCardToolbarEvents() {
    const flipButton = document.getElementById("flipCardButton");
    const editFrontButton = document.getElementById("editFrontButton");
    const editBackButton = document.getElementById("editBackButton");
    const dropDownMenuForFlipCardBtn = document.getElementById("dropDownMenuForFlipCard");
    const colorPickerContainerFlipCard = this._editorEl?.querySelector("#colorPickerContainerFlipCard");
    const colorPickerContainerFlipCardInput = colorPickerContainerFlipCard?.querySelector("input");

    // Get dropdown menu action buttons
    const duplicateTheFlipCard = document.querySelector(".duplicateTheFlipCard");
    const lockFlipCard = document.querySelector(".lockFlipCard");
    const deleteFlipCard = document.querySelector(".deleteFlipCard");

    // Dropdown menu toggle
    if (dropDownMenuForFlipCardBtn) {
      dropDownMenuForFlipCardBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = dropDownMenuForFlipCardBtn.getAttribute("aria-expanded") === "true";
        dropDownMenuForFlipCardBtn.setAttribute("aria-expanded", String(!expanded));
      });
    }

    // Color picker handling
    if (colorPickerContainerFlipCard && colorPickerContainerFlipCardInput) {
      colorPickerContainerFlipCard.addEventListener("click", (e) => {
        e.stopPropagation();
        colorPickerContainerFlipCardInput.click();
      });

      colorPickerContainerFlipCardInput.addEventListener("input", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          const item = this.items.get(this.currentSelectedCardId);
          if (item) {
            item.wrap.style.backgroundColor = colorPickerContainerFlipCardInput.value;
            // Dispatch color change event
            window.dispatchEvent(
              new CustomEvent("flip-card-color-changed", {
                detail: { id: this.currentSelectedCardId, color: colorPickerContainerFlipCardInput.value },
              })
            );
          }
        }
      });
    }

    // Flip button
    if (flipButton) {
      flipButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          this.flipCard(this.currentSelectedCardId);
        }
      });
    }

    // Edit front button
    if (editFrontButton) {
      editFrontButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          this.editSide(this.currentSelectedCardId, "front");
        }
      });
    }

    // Edit back button
    if (editBackButton) {
      editBackButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          this.editSide(this.currentSelectedCardId, "back");
        }
      });
    }

    // LOCK FUNCTIONALITY
    if (lockFlipCard) {
      lockFlipCard.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          const isLocked = this.toggleLock(lockFlipCard, this.currentSelectedCardId);

          // Update button text and icon based on lock state
          if (isLocked) {
            lockFlipCard.querySelector("span:last-child").textContent = "Unlock";
            lockFlipCard.setAttribute("title", "Unlock flip card");
          } else {
            lockFlipCard.querySelector("span:last-child").textContent = "Lock";
            lockFlipCard.setAttribute("title", "Lock flip card");
          }

          // Close dropdown after action
          if (dropDownMenuForFlipCardBtn) {
            dropDownMenuForFlipCardBtn.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    // DUPLICATE FUNCTIONALITY
    if (duplicateTheFlipCard) {
      duplicateTheFlipCard.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedCardId) {
          const duplicatedId = this.duplicateCard(this.currentSelectedCardId);

          if (duplicatedId) {
            // Select the newly duplicated card
            const duplicatedItem = this.items.get(duplicatedId);
            if (duplicatedItem) {
              this._selectCard(duplicatedItem.wrap);
            }
          }

          // Close dropdown after action
          if (dropDownMenuForFlipCardBtn) {
            dropDownMenuForFlipCardBtn.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    // DELETE FUNCTIONALITY
    if (deleteFlipCard) {
      deleteFlipCard.addEventListener("click", (e) => {
        e.stopPropagation();

        console.log("Delete flip card clicked");
        console.log(this.currentSelectedCardId);
        if (this.currentSelectedCardId) {
          const cardToDelete = this.currentSelectedCardId;

          // Show confirmation dialog
          const confirmed = this._showDeleteConfirmation();

          if (confirmed) {
            // Clear selection first
            this.clearSelection();

            // Remove the card
            this.remove(cardToDelete);
          }

          // Close dropdown after action
          if (dropDownMenuForFlipCardBtn) {
            dropDownMenuForFlipCardBtn.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (dropDownMenuForFlipCardBtn && !dropDownMenuForFlipCardBtn.contains(e.target)) {
        dropDownMenuForFlipCardBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Show delete confirmation dialog
  _showDeleteConfirmation() {
    // You can customize this to use your app's modal system
    return confirm("Are you sure you want to delete this flip card? This action cannot be undone.");
  }

  // Duplicate card functionality
  duplicateCard(id) {
    const item = this.items.get(id);
    if (!item) return null;

    // Serialize the original card
    const originalData = this.serialize(id);
    if (!originalData) return null;

    // Create offset for the duplicate (slightly down and to the right)
    const offset = 20;
    const duplicateData = {
      ...originalData,
      left: originalData.left + offset,
      top: originalData.top + offset,
    };

    // Create the duplicate
    const duplicatedId = this.restoreFromData(duplicateData);

    return duplicatedId;
  }

  // Enhanced toggle lock method
  toggleLock(btn, id) {
    const item = this.items.get(id);
    if (!item) return false;

    const { wrap } = item;
    const wasLocked = wrap.dataset.locked === "true";
    const isLocked = !wasLocked;

    wrap.dataset.locked = String(isLocked);

    if (isLocked) {
      if (btn) btn.classList.add("locked");
      wrap.classList.add("locked");

      // If card is being edited, stop editing
      if (this._editingId === id) {
        const activeContent = this._editingSide === "front" ? item.frontContent : item.backContent;
        if (activeContent) {
          activeContent.blur();
        }
      }

      // Hide handles when locked
      const handles = wrap.querySelector(".handles");
      if (handles) {
        handles.style.pointerEvents = "none";
        handles.querySelectorAll(".resize-handle").forEach((h) => {
          h.style.opacity = "0.3";
          h.style.pointerEvents = "none";
        });
      }
    } else {
      if (btn) btn.classList.remove("locked");
      wrap.classList.remove("locked");

      // Restore handles when unlocked
      if (this.currentSelectedCardId === id) {
        const handles = wrap.querySelector(".handles");
        if (handles) {
          handles.style.pointerEvents = "auto";
          handles.querySelectorAll(".resize-handle").forEach((h) => {
            h.style.opacity = "1";
            h.style.pointerEvents = "auto";
          });
        }
      }
    }

    return isLocked;
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("FlipCardManager: Interact.js library not found. Resize/drag will use fallback handlers.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "flipcard") {
      this.setActive(true);
      this.drawingEnabled = true;
    } else if (tool === "select") {
      this.setActive(true);
      this.drawingEnabled = false;
    } else {
      this.active = true;
      this.drawingEnabled = false;
      this.clearSelection();
    }
  }

  setActive(on) {
    this.active = !!on;
  }

  _generateCardId() {
    return "flipcard-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  _worldPoint(clientX, clientY) {
    const t = this.getTransform();
    return {
      x: (clientX - t.x) / t.k,
      y: (clientY - t.y) / t.k,
    };
  }

  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const t = this.getTransform();
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const worldTop = parseFloat(wrap.dataset.worldTop || 0);
    const worldWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || this.defaults.height);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    const scaleX = (worldWidth * t.k) / this.defaults.width;
    const scaleY = (worldHeight * t.k) / this.defaults.height;

    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";
    wrap.style.width = this.defaults.width + "px";
    wrap.style.height = this.defaults.height + "px";
    wrap.style.transform = `scale(${scaleX}, ${scaleY})`;
    wrap.style.transformOrigin = "0 0";
  }

  create(x, y, frontContent = "Type something", backContent = "Back side content") {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "flip-card-item";
    wrap.dataset.id = String(id);
    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(this.defaults.width);
    wrap.dataset.worldHeight = String(this.defaults.height);
    wrap.dataset.locked = "false";
    wrap.dataset.flipped = "false";

    // Create flip card container
    const flipCardInner = document.createElement("div");
    flipCardInner.className = "flip-card-inner";

    // Create front side
    const frontSide = document.createElement("div");
    frontSide.className = "flip-card-front";
    this._setupCardSide(frontSide, frontContent, true);

    // Create back side
    const backSide = document.createElement("div");
    backSide.className = "flip-card-back";
    this._setupCardSide(backSide, backContent, false);

    // Add flip button to front side
    const flipButton = this._createFlipButton("front");
    frontSide.appendChild(flipButton);

    // Add flip button to back side
    const backFlipButton = this._createFlipButton("back");
    backSide.appendChild(backFlipButton);

    flipCardInner.appendChild(frontSide);
    flipCardInner.appendChild(backSide);

    // Create resize handles
    const handles = this._createResizeHandles(id);

    wrap.appendChild(flipCardInner);
    wrap.appendChild(handles);

    this.stage.appendChild(wrap);

    const frontContentEl = frontSide.querySelector(".flip-card-content");
    const backContentEl = backSide.querySelector(".flip-card-content");

    this.items.set(id, {
      id,
      wrap,
      flipCardInner,
      frontContent: frontContentEl,
      backContent: backContentEl,
      handles,
      isFlipped: false,
    });

    this._applyWorldToScreen(wrap);
    this._wireFlipCardEvents(wrap, id);
    this._initInteractOnCard(wrap, id);

    return id;
  }

  _setupCardSide(sideElement, content, isFront) {
    const contentDiv = document.createElement("div");
    contentDiv.className = "flip-card-content";
    contentDiv.contentEditable = "false";
    contentDiv.innerHTML = content;

    sideElement.appendChild(contentDiv);
  }

  _createFlipButton(side) {
    const flipButton = document.createElement("button");
    flipButton.className = "flip-button";
    flipButton.innerHTML = `
            <span style="margin-right: 4px;">Flip</span>
            ${side === "front" ? this.FRONT_FLIP_ICON : this.BACK_FLIP_ICON}
          `;

    flipButton.addEventListener("click", (e) => {
      e.stopPropagation();
      const wrap = flipButton.closest(".flip-card-item");
      if (!wrap) return;
      const id = parseInt(wrap.dataset.id, 10);
      if (!id) return;
      this.flipCard(id);
    });

    return flipButton;
  }

  _createResizeHandles(id) {
    const handles = document.createElement("div");
    handles.className = "handles";

    ["nw", "ne", "sw", "se"].forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${pos} resize-${pos === "nw" ? "nw" : pos === "ne" ? "ne" : pos === "sw" ? "sw" : "se"}`;
      handle.dataset.handle = pos;

      handle.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        const wrap = this.items.get(id)?.wrap;
        if (!wrap || wrap.dataset.locked === "true") return;

        const t = this.getTransform();
        const startWorld = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

        this._activeResize = {
          id,
          handle: pos,
          startPointerWorld: startWorld,
          startWorldLeft: parseFloat(wrap.dataset.worldLeft || 0),
          startWorldTop: parseFloat(wrap.dataset.worldTop || 0),
          startWorldWidth: parseFloat(wrap.dataset.worldWidth || this.defaults.width),
          startWorldHeight: parseFloat(wrap.dataset.worldHeight || this.defaults.height),
        };

        document.addEventListener("pointermove", this._onDocPointerMove);
        document.addEventListener("pointerup", this._onDocPointerUp);
      });

      handles.appendChild(handle);
    });

    return handles;
  }

  _wireFlipCardEvents(wrap, id) {
    // Handle card selection
    wrap.addEventListener("click", (e) => {
      if (e.target.closest(".resize-handle")) return;
      if (e.target.closest(".flip-button")) {
        e.stopPropagation();
        this.flipCard(id);
        return;
      }

      const item = this.items.get(id);
      if (!item) return;

      const activeContent = item.isFlipped ? item.backContent : item.frontContent;
      if (activeContent && activeContent.isContentEditable && document.activeElement === activeContent) return;

      this._selectCard(wrap);
      e.stopPropagation();
    });

    // Handle double click for editing
    wrap.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (wrap.dataset.locked === "true") return;

      const item = this.items.get(id);
      if (!item) return;

      const side = item.isFlipped ? "back" : "front";
      this.editSide(id, side);
    });

    // Wire up content editing for both sides
    const item = this.items.get(id);
    if (item) {
      this._wireContentEditing(item.frontContent, id, "front");
      this._wireContentEditing(item.backContent, id, "back");
    }
  }

  _wireContentEditing(contentElement, id, side) {
    contentElement.addEventListener("focusin", () => {
      // Don't allow editing if card is locked
      const wrap = this.items.get(id)?.wrap;
      if (wrap && wrap.dataset.locked === "true") {
        contentElement.blur();
        return;
      }

      this._editingId = id;
      this._editingSide = side;
      contentElement.contentEditable = "true";
      if (wrap) wrap.classList.add("editing");
    });

    contentElement.addEventListener("focusout", (e) => {
      contentElement.contentEditable = "false";
      contentElement.style.userSelect = "none";

      if (this._editingId === id) {
        this._editingId = null;
        this._editingSide = null;
        const wrap = this.items.get(id)?.wrap;
        if (wrap) wrap.classList.remove("editing");
      }
    });

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (document.activeElement && document.activeElement === contentElement) {
          document.activeElement.blur();
        }
      }
    };
    contentElement.addEventListener("keydown", handleEscape);
  }

  flipCard(id) {
    const item = this.items.get(id);
    if (!item) return;

    const { wrap } = item;

    // Don't allow flipping if locked
    if (wrap.dataset.locked === "true") return;

    const isFlipped = wrap.dataset.flipped === "true";

    wrap.dataset.flipped = String(!isFlipped);
    item.isFlipped = !isFlipped;

    // Dispatch flip event
    window.dispatchEvent(
      new CustomEvent("flip-card-flipped", {
        detail: { id, isFlipped: !isFlipped },
      })
    );
  }

  editSide(id, side) {
    const item = this.items.get(id);
    if (!item) return;

    const { wrap } = item;
    if (wrap.dataset.locked === "true") return;

    // Ensure we're showing the correct side
    if ((side === "front" && item.isFlipped) || (side === "back" && !item.isFlipped)) {
      this.flipCard(id);
      // Wait for flip animation to complete
      setTimeout(() => this._startEditing(id, side), 300);
    } else {
      this._startEditing(id, side);
    }
  }

  _startEditing(id, side) {
    const item = this.items.get(id);
    if (!item) return;

    const { wrap } = item;
    if (wrap.dataset.locked === "true") return;

    const contentElement = side === "front" ? item.frontContent : item.backContent;

    this._editingId = id;
    this._editingSide = side;

    contentElement.contentEditable = "true";
    contentElement.style.userSelect = "text";
    contentElement.focus();
    this._selectAllText(contentElement);

    wrap.classList.add("editing");
    this._selectCard(wrap);
  }

  _selectAllText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  _selectCard(wrap) {
    this.clearSelection();

    wrap.classList.add("show-handles");
    const handles = wrap.querySelector(".handles");
    const isLocked = wrap.dataset.locked === "true";

    if (handles) {
      handles.style.pointerEvents = isLocked ? "none" : "auto";
      handles.querySelectorAll(".resize-handle").forEach((h) => {
        h.style.opacity = isLocked ? "0.3" : "1";
        h.style.pointerEvents = isLocked ? "none" : "auto";
      });
    }

    const id = parseInt(wrap.dataset.id, 10);
    this.currentSelectedCardId = id;
    this._selectedCodeFlipCardId = id;

    this._showFlipCardEditor(wrap);

    // Update lock button text in the editor
    this._updateLockButtonState(isLocked);

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "flipcard", id, locked: isLocked, preferBottom: true },
      })
    );
  }

  // Update lock button state in the editor
  _updateLockButtonState(isLocked) {
    const lockFlipCard = document.getElementById("lockFlipCard");
    if (lockFlipCard) {
      if (isLocked) {
        lockFlipCard.textContent = "Unlock";
        lockFlipCard.setAttribute("title", "Unlock flip card");
        lockFlipCard.classList.add("locked");
      } else {
        lockFlipCard.textContent = "Lock";
        lockFlipCard.setAttribute("title", "Lock flip card");
        lockFlipCard.classList.remove("locked");
      }
    }
  }

  clearSelection() {
    this.currentSelectedCardId = null;

    this._hideFlipCardEditor();

    document.querySelectorAll(".flip-card-item.show-handles").forEach((card) => {
      card.classList.remove("show-handles");
      const handles = card.querySelector(".handles");
      if (handles) {
        handles.style.display = "none";
        handles.style.pointerEvents = "none";
        handles.querySelectorAll(".resize-handle").forEach((h) => {
          h.style.opacity = "0";
          h.style.pointerEvents = "none";
        });
      }
    });

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }

  _initInteractOnCard(wrap, id) {
    if (!this.interactAvailable) return;

    interact(wrap)
      .draggable({
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectCard(wrap);
          },
          move: (event) => {
            if (wrap.dataset.locked === "true") return false;

            const t = this.getTransform();
            const k = t.k || 1;

            const newWorldLeft = parseFloat(wrap.dataset.worldLeft) + event.dx / k;
            const newWorldTop = parseFloat(wrap.dataset.worldTop) + event.dy / k;

            wrap.dataset.worldLeft = String(newWorldLeft);
            wrap.dataset.worldTop = String(newWorldTop);

            this._applyWorldToScreen(wrap);

            // Update editor position if visible
            this.updateEditorToolbarPosition();
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectCard(wrap);
          },
          move: (event) => {
            if (wrap.dataset.locked === "true") return false;

            const t = this.getTransform();
            const k = t.k || 1;

            let newWorldLeft = parseFloat(wrap.dataset.worldLeft);
            let newWorldTop = parseFloat(wrap.dataset.worldTop);
            let newWorldWidth = parseFloat(wrap.dataset.worldWidth);
            let newWorldHeight = parseFloat(wrap.dataset.worldHeight);

            newWorldWidth += event.deltaRect.width / k;
            newWorldHeight += event.deltaRect.height / k;
            newWorldLeft += event.deltaRect.left / k;
            newWorldTop += event.deltaRect.top / k;

            wrap.dataset.worldLeft = String(newWorldLeft);
            wrap.dataset.worldTop = String(newWorldTop);
            wrap.dataset.worldWidth = String(Math.max(120, newWorldWidth));
            wrap.dataset.worldHeight = String(Math.max(80, newWorldHeight));

            this._applyWorldToScreen(wrap);

            // Update editor position if visible
            this.updateEditorToolbarPosition();
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 120, height: 80 },
          }),
        ],
        inertia: false,
      });
  }

  // Fallback event handlers (similar to CardManager)
  _onDocPointerMove(e) {
    if (!this._activeDrag && !this._activeResize) return;

    const t = this.getTransform();
    const world = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };

    if (this._activeDrag) {
      const { id, startWorld, startLeftTop } = this._activeDrag;
      const item = this.items.get(id);
      if (!item) return;

      const { wrap } = item;

      // Don't allow dragging if locked
      if (wrap.dataset.locked === "true") return;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      wrap.dataset.worldLeft = String(startLeftTop.left + dx);
      wrap.dataset.worldTop = String(startLeftTop.top + dy);

      this._applyWorldToScreen(wrap);
    }

    if (this._activeResize) {
      this._handleResize(world);
    }
  }

  _handleResize(world) {
    const { id, handle, startPointerWorld, startWorldLeft, startWorldTop, startWorldWidth, startWorldHeight } = this._activeResize;
    const item = this.items.get(id);
    if (!item) return;

    const { wrap } = item;

    // Don't allow resizing if locked
    if (wrap.dataset.locked === "true") return;

    const dx = world.x - startPointerWorld.x;
    const dy = world.y - startPointerWorld.y;

    let newLeft = startWorldLeft;
    let newTop = startWorldTop;
    let newWidth = startWorldWidth;
    let newHeight = startWorldHeight;

    const minW = 120;
    const minH = 80;

    switch (handle) {
      case "se":
        newWidth = Math.max(minW, startWorldWidth + dx);
        newHeight = Math.max(minH, startWorldHeight + dy);
        break;
      case "sw":
        newLeft = startWorldLeft + dx;
        newWidth = Math.max(minW, startWorldWidth - dx);
        newHeight = Math.max(minH, startWorldHeight + dy);
        break;
      case "ne":
        newTop = startWorldTop + dy;
        newWidth = Math.max(minW, startWorldWidth + dx);
        newHeight = Math.max(minH, startWorldHeight - dy);
        break;
      case "nw":
        newLeft = startWorldLeft + dx;
        newTop = startWorldTop + dy;
        newWidth = Math.max(minW, startWorldWidth - dx);
        newHeight = Math.max(minH, startWorldHeight - dy);
        break;
    }

    wrap.dataset.worldLeft = String(newLeft);
    wrap.dataset.worldTop = String(newTop);
    wrap.dataset.worldWidth = String(newWidth);
    wrap.dataset.worldHeight = String(newHeight);

    this._applyWorldToScreen(wrap);
  }

  _onDocPointerUp(e) {
    this._activeDrag = null;
    this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
  }

  _onStagePointerDown(e) {
    if (e.target === this.stage) {
      this.clearSelection();
    }
  }

  _onPointerDown(e) {
    if (!this.active || !this.drawingEnabled) return;
    if (this.activeTool !== "flipcard") return;
    if (e.button && e.button !== 0) return;
    if (e.target.closest(".flip-card-item")) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);
    const id = this.create(worldPoint.x - this.defaults.width / 2, worldPoint.y - this.defaults.height / 2);

    if (this.app && this.app.setTool) {
      this.app.setTool("select");
    }

    e.stopPropagation();
    e.preventDefault();
  }

  attach() {
    this.stage.addEventListener("pointerdown", this._onPointerDown);
  }

  detach() {
    this.stage.removeEventListener("pointerdown", this._onPointerDown);
  }

  refreshScreenPositions() {
    for (const { wrap } of this.items.values()) {
      this._applyWorldToScreen(wrap);
    }

    // Update editor position if visible
    this.updateEditorToolbarPosition();
  }

  _showFlipCardEditor(wrap) {
    if (!this._editorEl) return;

    this._editorEl.classList.remove(this._getHiddenClass());
    this._positionFlipCardEditor(wrap);

    // start the follow loop so editor follows zoom/pan/drag live
    this._startEditorFollowLoop();
  }

  _hideFlipCardEditor() {
    if (!this._editorEl) return;

    this._editorEl.classList.add(this._getHiddenClass());
    this._selectedCodeFlipCardId = null;

    // stop the follow loop
    this._stopEditorFollowLoop();
    const dropDown = document.getElementById("dropDownMenuForFlipCard");
    if (dropDown) {
      dropDown.removeAttribute("aria-expanded");
    }
  }

  _startEditorFollowLoop() {
    if (this._editorRAF) return; // already running

    this._lastEditorState = null;

    const tick = () => {
      // If editor hidden or no selected card — stop
      if (!this._editorEl || this._editorEl.classList.contains(this._getHiddenClass()) || !this._selectedCodeFlipCardId) {
        this._stopEditorFollowLoop();
        return;
      }

      const item = this.items.get(this._selectedCodeFlipCardId);
      if (!item) {
        this._stopEditorFollowLoop();
        return;
      }

      // gather current state that affects editor pos
      const t = this.getTransform();
      const state = {
        tx: t.x,
        ty: t.y,
        k: t.k,
        left: parseFloat(item.wrap.dataset.worldLeft || 0),
        top: parseFloat(item.wrap.dataset.worldTop || 0),
        width: parseFloat(item.wrap.dataset.worldWidth || this.defaults.width),
        height: parseFloat(item.wrap.dataset.worldHeight || this.defaults.height),
      };

      // shallow comparison — update only when something changed (cheap)
      const last = this._lastEditorState;
      let changed = true;
      if (last) {
        changed = last.tx !== state.tx || last.ty !== state.ty || last.k !== state.k || last.left !== state.left || last.top !== state.top || last.width !== state.width || last.height !== state.height;
      }

      if (changed) {
        this._positionFlipCardEditor(item.wrap);
        this._lastEditorState = state;
      }

      this._editorRAF = requestAnimationFrame(tick);
    };

    this._editorRAF = requestAnimationFrame(tick);
  }

  _stopEditorFollowLoop() {
    if (this._editorRAF) {
      cancelAnimationFrame(this._editorRAF);
      this._editorRAF = null;
    }
    this._lastEditorState = null;
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;

    // If this card is currently selected, clear the selection first
    if (this.currentSelectedCardId === id) {
      this.clearSelection();
    }

    item.wrap.remove();
    this.items.delete(id);

    if (this._editingId === id) {
      this._editingId = null;
      this._editingSide = null;
    }
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, frontContent, backContent } = item;
    return {
      id,
      left: parseFloat(wrap.dataset.worldLeft || 0),
      top: parseFloat(wrap.dataset.worldTop || 0),
      width: parseFloat(wrap.dataset.worldWidth || this.defaults.width),
      height: parseFloat(wrap.dataset.worldHeight || this.defaults.height),
      frontContent: frontContent.innerHTML,
      backContent: backContent.innerHTML,
      isFlipped: wrap.dataset.flipped === "true",
      locked: wrap.dataset.locked === "true",
      backgroundColor: wrap.style.backgroundColor || this.defaults.backgroundColor,
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left, data.top, data.frontContent, data.backContent);
    const item = this.items.get(id);
    if (!item) return id;

    const { wrap } = item;
    wrap.dataset.worldWidth = String(data.width || this.defaults.width);
    wrap.dataset.worldHeight = String(data.height || this.defaults.height);

    // Apply background color if provided
    if (data.backgroundColor) {
      wrap.style.backgroundColor = data.backgroundColor;
    }

    if (data.isFlipped) {
      this.flipCard(id);
    }

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
    }

    this._applyWorldToScreen(wrap);
    return id;
  }

  isEditing() {
    return this._editingId !== null;
  }

  getEditingInfo() {
    return {
      id: this._editingId,
      side: this._editingSide,
    };
  }

  // Get all flip cards data for bulk operations
  getAllCards() {
    const cards = [];
    for (const id of this.items.keys()) {
      const cardData = this.serialize(id);
      if (cardData) {
        cards.push(cardData);
      }
    }
    return cards;
  }

  // Clear all flip cards
  clearAll() {
    // Clear selection first
    this.clearSelection();

    // Remove all cards
    for (const id of this.items.keys()) {
      this.remove(id);
    }

    // Reset counter
    this.counter = 0;
  }

  // Get card by ID
  getCard(id) {
    return this.items.get(id);
  }

  // Check if card exists
  hasCard(id) {
    return this.items.has(id);
  }

  // Get total number of cards
  getCardCount() {
    return this.items.size;
  }

  // Cleanup method
  destroy() {
    // Clear all cards
    this.clearAll();

    // Remove event listeners
    if (this._onToolChangeHandler) {
      this.app?.toolManager?.removeEventListener("change", this._onToolChangeHandler);
    }

    if (this._unsubTool) {
      this._unsubTool();
    }

    this.stage.removeEventListener("pointerdown", this._onStagePointerDown);
    this.detach();

    // Stop editor follow loop
    this._stopEditorFollowLoop();
  }
}
