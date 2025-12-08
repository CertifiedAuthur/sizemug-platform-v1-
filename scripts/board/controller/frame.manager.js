class FrameManager {
  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // Frame storage and state
    this.counter = 0;
    this.items = new Map(); // id -> { id, wrap, contentElement, handles }
    this._editingId = null; // Currently editing frame ID

    // Interaction state for fallback handlers
    this._activeDrag = null;
    this._activeResize = null;
    this.currentSelectedFrameId = null;

    // Tool state
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "frame";

    // Default frame properties
    this.defaults = {
      width: 300,
      height: 200,
      backgroundColor: "#ffffff",
      borderColor: "#e1e5e9",
      borderWidth: 2,
      borderRadius: 8,
      padding: 0,
    };

    // Bind event handlers
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onDocPointerMove = this._onDocPointerMove.bind(this);
    this._onDocPointerUp = this._onDocPointerUp.bind(this);
    this._onStagePointerDown = this._onStagePointerDown.bind(this);

    // Subscribe to tool changes from the app
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    // Initialize Interact.js support
    this._initializeInteract();

    // Listen for stage clicks to clear selections
    this.stage.addEventListener("pointerdown", this._onStagePointerDown);

    // Initialize frame toolbar editor
    this._initFrameToolbarEditor();
  }

  // Helper method to get the hidden class (supports different frameworks)
  _getHiddenClass() {
    return typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";
  }

  _getActiveFrame() {
    const frameItem = document.querySelector(`.frame-item[data-id="${this.currentSelectedFrameId}"]`);
    if (!frameItem) return {};

    const frameItemContainer = frameItem.querySelector(".frame-item-container");
    const frameItemContainerNest = frameItem.querySelector(".frame-item-container-nest");
    const frameContent = frameItem.querySelector(".frame-content");
    const frameContentImage = frameItem.querySelector(".frame-content-image");

    return {
      frameItem,
      frameItemContainer,
      frameItemContainerNest,
      frameContent,
      frameContentImage,
    };
  }

  _initFrameToolbarEditor() {
    // Get reference to the editor element
    this._frameEditorEl = document.getElementById("whiteboardEditorWrapperFrameCard");

    if (this._frameEditorEl) {
      if (this._frameEditorEl.parentElement !== document.body) {
        document.body.appendChild(this._frameEditorEl);
      }
      this._frameEditorEl.style.zIndex = "10001";
      this._frameEditorEl.setAttribute("tabindex", "-1");

      this._frameEditorEl.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        this._keepEditorVisible = true;
        const interactive = e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
      });

      this._frameEditorEl.addEventListener("click", (e) => e.stopPropagation());
      this._frameEditorEl.addEventListener("pointerup", (e) => {
        e.stopPropagation();
        this._keepEditorVisible = false;
      });
    }

    // Bind all toolbar events
    this._bindFrameToolbarEvents();
  }

  _bindFrameToolbarEvents() {
    // Color picker
    const colorPickerContainerFrameCard = document.getElementById("colorPickerContainerFrameCard");
    const colorInput = colorPickerContainerFrameCard?.querySelector("input[type='color']");

    if (colorPickerContainerFrameCard && colorInput) {
      colorPickerContainerFrameCard.addEventListener("click", (e) => {
        e.stopPropagation();
        colorInput.click();
      });

      colorInput.addEventListener("input", (e) => {
        e.stopPropagation();
        this._setFrameBackgroundColor(e.target.value);

        // Update the color indicator
        const colorIndicator = colorPickerContainerFrameCard.querySelector(".current_picker_color");
        if (colorIndicator) {
          colorIndicator.style.background = e.target.value;
        }
      });
    }

    // Border toggle
    const makeFrameHasBorder = document.getElementById("makeFrameHasBorder");
    const frameBorderColor = document.getElementById("frameBorderColor");
    const frameBorderColorInput = frameBorderColor.querySelector("input");

    if (makeFrameHasBorder) {
      makeFrameHasBorder.addEventListener("click", (e) => {
        e.stopPropagation();
        this._toggleFrameBorder();
        this.updateEditorToolbarPosition();
      });
    }

    // Border & Border color picker
    if (frameBorderColorInput && frameBorderColor) {
      frameBorderColor.addEventListener("click", (e) => {
        e.stopPropagation();
        frameBorderColorInput.click();
      });

      frameBorderColorInput.addEventListener("input", (e) => {
        e.stopPropagation();
        const { frameItemContainer } = this._getActiveFrame();
        frameItemContainer.style.border = `${this.defaults.borderWidth}px solid ${e.target.value}`;
      });
    }

    // Rounded corners
    const makeFrameRounded = document.getElementById("makeFrameRounded");
    if (makeFrameRounded) {
      makeFrameRounded.addEventListener("click", (e) => {
        e.stopPropagation();
        this._toggleFrameRounded();
      });
    }

    // Image upload
    const uploadImageToFrame = document.getElementById("uploadImageToFrame");
    if (uploadImageToFrame) {
      uploadImageToFrame.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openImageUpload();
      });
    }

    // Dropdown menu
    const dropDownMenuForFrameCard = document.getElementById("dropDownMenuForFrameCard");
    if (dropDownMenuForFrameCard) {
      dropDownMenuForFrameCard.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = dropDownMenuForFrameCard.getAttribute("aria-expanded") === "true";
        dropDownMenuForFrameCard.setAttribute("aria-expanded", String(!expanded));
      });
    }

    // Dropdown actions
    const duplicateButton = document.querySelector(".duplicateTheFlipCard");
    const lockButton = document.querySelector(".lockFlipCard");
    const deleteButton = document.querySelector(".deleteFlipCard");

    if (duplicateButton) {
      duplicateButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedFrameId) {
          const duplicatedId = this.duplicateFrame(this.currentSelectedFrameId);

          if (duplicatedId) {
            const duplicatedItem = this.items.get(duplicatedId);
            if (duplicatedItem) {
              this._selectFrame(duplicatedItem.wrap);
            }
          }

          if (dropDownMenuForFrameCard) {
            dropDownMenuForFrameCard.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    if (lockButton) {
      lockButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedFrameId) {
          const isLocked = this.toggleLock(lockButton, this.currentSelectedFrameId);

          // Update button text
          if (isLocked) {
            lockButton.querySelector("span:last-child").textContent = "Unlock";
            lockButton.setAttribute("title", "Unlock frame");
          } else {
            lockButton.querySelector("span:last-child").textContent = "Lock";
            lockButton.setAttribute("title", "Lock frame");
          }

          if (dropDownMenuForFrameCard) {
            dropDownMenuForFrameCard.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.currentSelectedFrameId) {
          const frameToDelete = this.currentSelectedFrameId;

          const confirmed = this._showDeleteConfirmation();

          if (confirmed) {
            this.clearSelection();
            this.remove(frameToDelete);
          }

          if (dropDownMenuForFrameCard) {
            dropDownMenuForFrameCard.setAttribute("aria-expanded", "false");
          }
        }
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (dropDownMenuForFrameCard && !dropDownMenuForFrameCard.contains(e.target)) {
        dropDownMenuForFrameCard.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Show delete confirmation dialog
  _showDeleteConfirmation() {
    return confirm("Are you sure you want to delete this frame? This action cannot be undone.");
  }

  // Duplicate frame functionality
  duplicateFrame(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const originalData = this.serialize(id);
    if (!originalData) return null;

    const offset = 20;
    const duplicateData = {
      ...originalData,
      left: originalData.left + offset,
      top: originalData.top + offset,
    };

    const duplicatedId = this.restoreFromData(duplicateData);
    return duplicatedId;
  }

  // Set frame background color
  _setFrameBackgroundColor(color) {
    const { frameItemContainer } = this._getActiveFrame();
    if (frameItemContainer) {
      frameItemContainer.style.backgroundColor = color;
    }
  }

  // Toggle frame border
  _toggleFrameBorder() {
    const { frameItemContainer } = this._getActiveFrame();
    if (!frameItemContainer) return;

    const currentBorder = frameItemContainer.style.border;
    const hasBorder = currentBorder && currentBorder !== "none";

    if (hasBorder) {
      frameItemContainer.style.border = "none";
      document.getElementById("frameBorderColor").classList.add(HIDDEN);
    } else {
      frameItemContainer.style.border = `${this.defaults.borderWidth}px solid ${this.defaults.borderColor}`;
      document.getElementById("frameBorderColor").classList.remove(HIDDEN);
    }
  }

  // Toggle frame rounded corners
  _toggleFrameRounded() {
    const { frameItemContainer } = this._getActiveFrame();
    if (!frameItemContainer) return;

    const currentRadius = frameItemContainer.style.borderRadius;
    const isRounded = currentRadius && currentRadius !== "0px";

    if (isRounded) {
      frameItemContainer.style.borderRadius = "0px";
    } else {
      frameItemContainer.style.borderRadius = this.defaults.borderRadius + "px";
    }
  }

  // Image upload functionality
  _openImageUpload(replace = false) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";

    input.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        this._handleImageUpload(file, replace);
      }
      document.body.removeChild(input);
    });

    document.body.appendChild(input);
    input.click();
  }

  _handleImageUpload(file, replace = false) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const { frameContent } = this._getActiveFrame();
      if (!frameContent) return;

      const img = document.createElement("img");
      img.src = e.target.result;
      img.className = "frame-content-image";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.display = "block";

      if (replace) {
        const existingImg = frameContent.querySelector(".frame-content-image");
        if (existingImg) {
          frameContent.removeChild(existingImg);
        }
      }

      frameContent.appendChild(img);
    };
    reader.readAsDataURL(file);
  }

  _removeFrameContent() {
    const { frameContent } = this._getActiveFrame();
    if (!frameContent) return;

    frameContent.innerHTML = "";
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("FrameManager: Interact.js library not found. Resize/drag will use fallback handlers.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "frame") {
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

  _generateFrameId() {
    return "frame-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
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

    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    wrap.style.width = this.defaults.width + "px";
    wrap.style.height = this.defaults.height + "px";

    wrap.style.transform = `scale(${scaleX}, ${scaleY})`;
    wrap.style.transformOrigin = "0 0";
  }

  _positionFrameEditorWrapper(wrap = null) {
    if (!this._frameEditorEl) return;

    const editor = this._frameEditorEl;
    const gap = 8;

    if (wrap) {
      const t = this.getTransform();
      const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
      const worldTop = parseFloat(wrap.dataset.worldTop || 0);
      const worldWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);

      const screenLeft = worldLeft * t.k + t.x;
      const screenTop = worldTop * t.k + t.y;
      const screenWidth = worldWidth * t.k;

      let left = screenLeft + screenWidth / 2 - editor.offsetWidth / 2;
      let candidateTop = screenTop - editor.offsetHeight - gap;

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
      const left = Math.round(window.innerWidth / 2 - editor.offsetWidth / 2);
      const top = gap;
      editor.style.position = "absolute";
      editor.style.left = `${left}px`;
      editor.style.top = `${top}px`;
      editor.style.zIndex = "1000";
    }
  }

  updateEditorToolbarPosition() {
    if (!this._frameEditorEl || this._frameEditorEl.classList.contains(this._getHiddenClass())) {
      return;
    }

    const wrap = this.currentSelectedFrameId ? this.items.get(this.currentSelectedFrameId)?.wrap : null;

    if (wrap) {
      this._positionFrameEditorWrapper(wrap);
    }
  }

  _showFrameEditorWrapper(wrap) {
    if (!this._frameEditorEl) return;

    this._frameEditorEl.classList.remove(this._getHiddenClass());
    this._positionFrameEditorWrapper(wrap);

    // Update lock button state
    const lockButton = document.querySelector(".lockFlipCard");
    if (lockButton && wrap) {
      const isLocked = wrap.dataset.locked === "true";
      if (isLocked) {
        lockButton.querySelector("span:last-child").textContent = "Unlock";
        lockButton.setAttribute("title", "Unlock frame");
        lockButton.classList.add("locked");
      } else {
        lockButton.querySelector("span:last-child").textContent = "Lock";
        lockButton.setAttribute("title", "Lock frame");
        lockButton.classList.remove("locked");
      }
    }
  }

  _hideFrameEditorWrapper() {
    if (!this._frameEditorEl) return;

    this._frameEditorEl.classList.add(this._getHiddenClass());

    const dropDown = document.getElementById("dropDownMenuForFrameCard");
    if (dropDown) {
      dropDown.removeAttribute("aria-expanded");
    }
  }

  create(x, y, content = null) {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "frame-item";
    wrap.dataset.id = String(id);

    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(this.defaults.width);
    wrap.dataset.worldHeight = String(this.defaults.height);
    wrap.dataset.locked = "false";

    wrap.style.boxSizing = "border-box";
    wrap.style.cursor = "move";
    wrap.style.userSelect = "none";
    wrap.style.width = this.defaults.width + "px";
    wrap.style.height = this.defaults.height + "px";
    wrap.style.transformOrigin = "0 0";
    wrap.style.touchAction = "none";
    wrap.style.pointerEvents = "auto";
    wrap.style.padding = "5px";

    const frameContainer = document.createElement("div");
    frameContainer.className = "frame-item-container";
    frameContainer.style.width = "100%";
    frameContainer.style.height = "100%";
    frameContainer.style.backgroundColor = this.defaults.backgroundColor;
    frameContainer.style.overflow = "hidden";
    frameContainer.style.boxSizing = "border-box";

    const frameContainerNest = document.createElement("div");
    frameContainerNest.className = "frame-item-container-nest";
    frameContainerNest.style.display = "flex";
    frameContainerNest.style.flexDirection = "column";
    frameContainerNest.style.width = "100%";
    frameContainerNest.style.height = "100%";
    frameContainerNest.style.boxSizing = "border-box";

    const contentElement = document.createElement("div");
    contentElement.className = "frame-content";
    contentElement.style.width = "100%";
    contentElement.style.height = "100%";
    contentElement.style.display = "flex";
    contentElement.style.alignItems = "center";
    contentElement.style.justifyContent = "center";
    contentElement.style.overflow = "hidden";
    contentElement.style.position = "relative";

    if (content) {
      if (typeof content === "string" && content.startsWith("data:image")) {
        const img = document.createElement("img");
        img.src = content;
        img.className = "frame-content-image";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.display = "block";
        contentElement.appendChild(img);
      } else {
        contentElement.innerHTML = content;
      }
    }

    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.position = "absolute";
    handles.style.top = "0";
    handles.style.left = "0";
    handles.style.width = "100%";
    handles.style.height = "100%";
    handles.style.pointerEvents = "none";
    handles.style.display = "none";

    ["nw", "ne", "sw", "se"].forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${pos}`;
      handle.dataset.handle = pos;
      this._positionHandle(handle, pos);
      handle.style.pointerEvents = "auto";

      handle.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (wrap.dataset.locked === "true") return;

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

    frameContainerNest.appendChild(contentElement);
    frameContainer.appendChild(frameContainerNest);
    wrap.appendChild(frameContainer);
    wrap.appendChild(handles);

    this.stage.appendChild(wrap);
    this.items.set(id, {
      id,
      wrap,
      contentElement,
      handles,
    });

    this._applyWorldToScreen(wrap);
    this._wireFrameEvents(wrap, id);
    this._initInteractOnFrame(wrap, id);

    return id;
  }

  _positionHandle(handle, position) {
    switch (position) {
      case "nw":
        handle.style.left = "-4px";
        handle.style.top = "-4px";
        handle.style.cursor = "nw-resize";
        break;
      case "ne":
        handle.style.right = "-4px";
        handle.style.top = "-4px";
        handle.style.cursor = "ne-resize";
        break;
      case "sw":
        handle.style.left = "-4px";
        handle.style.bottom = "-4px";
        handle.style.cursor = "sw-resize";
        break;
      case "se":
        handle.style.right = "-4px";
        handle.style.bottom = "-4px";
        handle.style.cursor = "se-resize";
        break;
    }
  }

  _wireFrameEvents(wrap, id) {
    // Selection on click
    wrap.addEventListener("click", (e) => {
      if (e.target.closest(".resize-handle")) return;
      this._selectFrame(wrap);
      e.stopPropagation();
    });

    wrap.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (wrap.dataset.locked === "true") return;
      this._showFrameEditorWrapper(wrap);
      this._selectFrame(wrap);
    });
  }

  _selectFrame(wrap) {
    this.clearSelection();

    wrap.classList.add("show-handles");
    const handles = wrap.querySelector(".handles");
    const isLocked = wrap.dataset.locked === "true";

    if (handles) {
      handles.style.display = "block";
      handles.style.pointerEvents = isLocked ? "none" : "auto";
      handles.querySelectorAll(".resize-handle").forEach((h) => {
        h.style.opacity = isLocked ? "0.3" : "1";
        h.style.pointerEvents = isLocked ? "none" : "auto";
      });
    }

    const id = parseInt(wrap.dataset.id);
    this.currentSelectedFrameId = id;

    this._showFrameEditorWrapper(wrap);
  }

  clearSelection() {
    this.currentSelectedFrameId = null;

    this._hideFrameEditorWrapper();

    document.querySelectorAll(".frame-item.show-handles").forEach((frame) => {
      frame.classList.remove("show-handles");
      const handles = frame.querySelector(".handles");
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

  _initInteractOnFrame(wrap, id) {
    if (!this.interactAvailable) return;

    interact(wrap)
      .draggable({
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectFrame(wrap);
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
            this._selectFrame(wrap);
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
            wrap.dataset.worldWidth = String(Math.max(100, newWorldWidth));
            wrap.dataset.worldHeight = String(Math.max(100, newWorldHeight));

            this._applyWorldToScreen(wrap);
            this.updateEditorToolbarPosition();
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 100, height: 100 },
          }),
        ],
        inertia: false,
      });
  }

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

      const newWorldLeft = startLeftTop.left + dx;
      const newWorldTop = startLeftTop.top + dy;

      wrap.dataset.worldLeft = String(newWorldLeft);
      wrap.dataset.worldTop = String(newWorldTop);

      this._applyWorldToScreen(wrap);
      this.updateEditorToolbarPosition();
    }

    if (this._activeResize) {
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
      const minW = 100;
      const minH = 100;

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
      this.updateEditorToolbarPosition();
    }
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
    if (this.activeTool !== "frame") return;
    if (e.button && e.button !== 0) return;

    if (e.target.closest(".frame-item")) return;

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
    this.updateEditorToolbarPosition();
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;

    // If this frame is currently selected, clear the selection first
    if (this.currentSelectedFrameId === id) {
      this.clearSelection();
    }

    item.wrap.remove();
    this.items.delete(id);

    if (this._editingId === id) {
      this._editingId = null;
    }
  }

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
      wrap.style.cursor = "default";

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
      wrap.style.cursor = "move";

      // Restore handles when unlocked
      if (this.currentSelectedFrameId === id) {
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

  getFrameScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, contentElement } = item;
    const frameContainer = wrap.querySelector(".frame-item-container");

    return {
      id,
      left: parseFloat(wrap.dataset.worldLeft || 0),
      top: parseFloat(wrap.dataset.worldTop || 0),
      width: parseFloat(wrap.dataset.worldWidth || this.defaults.width),
      height: parseFloat(wrap.dataset.worldHeight || this.defaults.height),
      content: contentElement.innerHTML,
      backgroundColor: frameContainer?.style.backgroundColor || this.defaults.backgroundColor,
      borderColor: frameContainer?.style.borderColor || this.defaults.borderColor,
      borderWidth: parseFloat(frameContainer?.style.borderWidth) || this.defaults.borderWidth,
      borderRadius: parseFloat(frameContainer?.style.borderRadius) || this.defaults.borderRadius,
      border: frameContainer?.style.border || "none",
      locked: wrap.dataset.locked === "true",
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left, data.top, data.content);
    const item = this.items.get(id);
    if (!item) return id;

    const { wrap } = item;
    const frameContainer = wrap.querySelector(".frame-item-container");

    wrap.dataset.worldWidth = String(data.width || this.defaults.width);
    wrap.dataset.worldHeight = String(data.height || this.defaults.height);

    if (frameContainer) {
      if (data.backgroundColor) {
        frameContainer.style.backgroundColor = data.backgroundColor;
      }
      if (data.borderColor) {
        frameContainer.style.borderColor = data.borderColor;
      }
      if (data.borderWidth) {
        frameContainer.style.borderWidth = data.borderWidth + "px";
      }
      if (data.borderRadius) {
        frameContainer.style.borderRadius = data.borderRadius + "px";
      }
      if (data.border && data.border !== "none") {
        frameContainer.style.border = data.border;
      }
    }

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
      wrap.style.cursor = "default";
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
    };
  }

  // Get all frames data for bulk operations
  getAllFrames() {
    const frames = [];
    for (const id of this.items.keys()) {
      const frameData = this.serialize(id);
      if (frameData) {
        frames.push(frameData);
      }
    }
    return frames;
  }

  // Clear all frames
  clearAll() {
    // Clear selection first
    this.clearSelection();

    // Remove all frames
    for (const id of this.items.keys()) {
      this.remove(id);
    }

    // Reset counter
    this.counter = 0;
  }

  // Get frame by ID
  getFrame(id) {
    return this.items.get(id);
  }

  // Check if frame exists
  hasFrame(id) {
    return this.items.has(id);
  }

  // Get total number of frames
  getFrameCount() {
    return this.items.size;
  }

  // Cleanup method
  destroy() {
    // Clear all frames
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
  }
}
