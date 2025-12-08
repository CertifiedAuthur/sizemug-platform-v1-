class ShapeToolkitManager {
  constructor(stage, getTransform, app) {
    this.stage = stage;
    this.getTransform = getTransform;
    this.app = app || window.app;

    this.items = new Map();
    this.counter = 1;
    this.recentItems = this._loadRecentItems();

    this._initEventListeners();

    // Bound handlers
    this._onPointerDown = this._onPointerDown.bind(this);
  }

  _initEventListeners() {
    // Handle clicks on shape items
    const searchContent = document.querySelector(".search_content_container");
    if (searchContent) {
      searchContent.addEventListener("click", (e) => {
        const item = e.target.closest(".item");

        if (item && item.querySelector("img")) {
          const imgElement = item.querySelector("img");
          const src = imgElement.src;
          const alt = imgElement.alt || item.title || "Shape";

          // Add to canvas at center
          const canvasRect = this.stage.getBoundingClientRect();
          const centerX = canvasRect.left + canvasRect.width / 2;
          const centerY = canvasRect.top + canvasRect.height / 2;

          this.addShapeAtScreen(centerX, centerY, { src, alt });

          // Add to recent items
          this._addToRecent({ src, alt });
        }
      });
    }

    // Handle upload button - only if it's in the shapes context
    const uploadButton = document.querySelector(".upload-button");
    if (uploadButton) {
      // Check if we're in the shapes/toolkit context
      uploadButton.addEventListener("click", (e) => {
        // Only handle if the search content container is visible (shapes toolkit is open)
        const searchContainer = document.querySelector(".search_content_container");
        if (searchContainer && !searchContainer.classList.contains("board--hidden")) {
          e.preventDefault();
          e.stopPropagation();
          this._handleUpload();
        }
      });
    }
  }

  _handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".svg";
    input.multiple = true;

    input.addEventListener("change", (e) => {
      const files = e.target.files;
      Array.from(files).forEach((file) => {
        if (file.type === "image/svg+xml") {
          this._processSVGFile(file);
        }
      });
    });

    input.click();
  }

  _processSVGFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const svgContent = e.target.result;

      // Create a blob URL for the SVG
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      // Add to uploaded section
      this._addToUploaded({ src: url, alt: file.name, content: svgContent });

      // Add to canvas
      const canvasRect = this.stage.getBoundingClientRect();
      const centerX = canvasRect.left + canvasRect.width / 2;
      const centerY = canvasRect.top + canvasRect.height / 2;

      this.addShapeAtScreen(centerX, centerY, { src: url, alt: file.name });
    };
    reader.readAsText(file);
  }

  _addToRecent(item) {
    // Remove if already exists
    this.recentItems = this.recentItems.filter((recent) => recent.src !== item.src);

    // Add to beginning
    this.recentItems.unshift(item);

    // Keep only last 10 items
    this.recentItems = this.recentItems.slice(0, 10);

    // Save to localStorage
    localStorage.setItem("recentShapes", JSON.stringify(this.recentItems));

    // Update UI
    this._updateRecentUI();
  }

  _addToUploaded(item) {
    let uploadedItems = JSON.parse(localStorage.getItem("uploadedShapes") || "[]");

    // Add new item
    uploadedItems.unshift(item);

    // Keep only last 20 items
    uploadedItems = uploadedItems.slice(0, 20);

    // Save to localStorage
    localStorage.setItem("uploadedShapes", JSON.stringify(uploadedItems));

    // Update UI
    this._updateUploadedUI();
  }

  _loadRecentItems() {
    return JSON.parse(localStorage.getItem("recentShapes") || "[]");
  }

  _updateRecentUI() {
    const recentContent = document.querySelector('[data-content="recently-used"] .items-grid');
    if (recentContent && this.recentItems.length > 0) {
      recentContent.innerHTML = this.recentItems
        .map(
          (item) =>
            `<div class="item" title="${item.alt}">
          <img src="${item.src}" alt="${item.alt}" />
        </div>`
        )
        .join("");
    }
  }

  _updateUploadedUI() {
    const uploadedItems = JSON.parse(localStorage.getItem("uploadedShapes") || "[]");
    const uploadedContent = document.querySelector('[data-content="uploaded"]');

    if (uploadedContent) {
      if (uploadedItems.length > 0) {
        uploadedContent.innerHTML = `
          <div class="items-grid">
            ${uploadedItems
              .map(
                (item) =>
                  `<div class="item" title="${item.alt}">
                <img src="${item.src}" alt="${item.alt}" />
              </div>`
              )
              .join("")}
          </div>
        `;
      } else {
        uploadedContent.innerHTML = `
          <div class="empty-state">
            <p>SVG shapes you upload will be saved here</p>
          </div>
        `;
      }
    }
  }

  attach() {
    if (this.stage) {
      this.stage.addEventListener("pointerdown", this._onPointerDown);
    }
  }

  detach() {
    if (this.stage) {
      this.stage.removeEventListener("pointerdown", this._onPointerDown);
    }
    // Cleanup DOM elements
    for (const item of this.items.values()) {
      if (item.wrap && item.wrap.remove) item.wrap.remove();
    }
    this.items.clear();
  }

  _onPointerDown(e) {
    // Will be handled by element click events
  }

  addShapeAtWorld(x, y, opts = {}) {
    const id = "shape-" + Date.now() + "-" + this.counter++;
    const size = opts.size || 100;

    // Create wrapper
    const wrap = document.createElement("div");
    wrap.className = "shape-item whiteboard-content-item";
    wrap.dataset.id = id;
    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(size);
    wrap.dataset.worldHeight = String(size);
    wrap.dataset.locked = "false";

    wrap.style.position = "absolute";
    wrap.style.boxSizing = "border-box";
    wrap.style.userSelect = "none";
    wrap.style.transformOrigin = "0 0";
    wrap.style.touchAction = "none";
    wrap.style.pointerEvents = "auto";
    wrap.style.cursor = "grab";
    // Background, border, and border-radius will be set by _applyWorldToScreen

    // Create container
    const container = document.createElement("div");
    container.className = "shape-item-container";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.overflow = "hidden";
    container.style.boxSizing = "border-box";
    // Padding will be set by _applyWorldToScreen

    // Create content (image)
    const content = document.createElement("img");
    content.src = opts.src;
    content.alt = opts.alt || "shape";
    content.style.width = "100%";
    content.style.height = "100%";
    content.style.objectFit = "contain";
    content.style.pointerEvents = "none";
    content.style.display = "block";
    content.className = "shape-content";

    container.appendChild(content);

    // Create handles
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
      handle.style.position = "absolute";
      handle.style.pointerEvents = "auto";

      if (pos.includes("n")) handle.style.top = "-4px";
      if (pos.includes("s")) handle.style.bottom = "-4px";
      if (pos.includes("w")) handle.style.left = "-4px";
      if (pos.includes("e")) handle.style.right = "-4px";

      handle.style.cursor = pos + "-resize";

      handles.appendChild(handle);
    });

    wrap.appendChild(container);
    wrap.appendChild(handles);

    // Create item object
    const item = {
      id,
      wrap,
      container,
      content,
      handles,
      world: { x: x || 0, y: y || 0 },
      size: size,
      locked: false,
      src: opts.src,
      alt: opts.alt,
    };

    this.items.set(id, item);
    this.stage.appendChild(wrap);

    this._setupEventHandlers(wrap, item);
    this._initInteract(wrap, item);
    this._applyWorldToScreen(wrap);

    // Record creation for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("create", "shapeToolkit", "create", {
        id,
        x: x || 0,
        y: y || 0,
        size,
        src: opts.src,
        alt: opts.alt,
      });
    }

    return id;
  }

  _setupEventHandlers(wrap, item) {
    wrap.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.selectItem(item.id);
    });

    wrap.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".resize-handle")) return;

      if (item.locked) {
        this.selectItem(item.id);
        return;
      }

      this.selectItem(item.id);
    });
  }

  _initInteract(wrap, item) {
    if (typeof interact === "undefined") {
      console.warn("Interact.js not found");
      return;
    }

    const startState = {};

    interact(wrap)
      .draggable({
        listeners: {
          start: () => {
            if (item.locked) return false;
            this.selectItem(item.id);
            startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
            startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);
          },
          move: (ev) => {
            if (item.locked) return;
            const t = this.getTransform();
            const dx = ev.dx / (t.k || 1);
            const dy = ev.dy / (t.k || 1);

            item.world.x += dx;
            item.world.y += dy;
            wrap.dataset.worldLeft = String(item.world.x);
            wrap.dataset.worldTop = String(item.world.y);

            this._applyWorldToScreen(wrap);

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
            this._showActionButtonsForWrap(wrap);
          },
          end: () => {
            // Record move operation for undo/redo
            if (typeof HistoryManager !== "undefined" && !item.locked) {
              const newWorldLeft = parseFloat(wrap.dataset.worldLeft || 0);
              const newWorldTop = parseFloat(wrap.dataset.worldTop || 0);

              // Only record if position actually changed
              if (startState.worldLeft !== newWorldLeft || startState.worldTop !== newWorldTop) {
                HistoryManager.recordOperation("modify", "shapeToolkit", "move", {
                  id: item.id,
                  oldX: startState.worldLeft,
                  oldY: startState.worldTop,
                  newX: newWorldLeft,
                  newY: newWorldTop,
                });
              }
            }

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: () => {
            if (item.locked) return false;
            this.selectItem(item.id);
            startState.worldWidth = parseFloat(wrap.dataset.worldWidth || item.size);
            startState.worldHeight = parseFloat(wrap.dataset.worldHeight || item.size);
            startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
            startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);
          },
          move: (ev) => {
            if (item.locked) return;

            const rect = ev.rect;
            if (!rect) return;

            const t = this.getTransform();
            const k = t.k || 1;
            const stageRect = this.stage.getBoundingClientRect();

            // Convert to world space
            const newWorldLeft = (rect.left - stageRect.left - t.x) / k;
            const newWorldTop = (rect.top - stageRect.top - t.y) / k;
            const newWorldWidth = rect.width / k;
            const newWorldHeight = rect.height / k;

            item.world.x = newWorldLeft + newWorldWidth / 2;
            item.world.y = newWorldTop + newWorldHeight / 2;
            item.size = Math.max(newWorldWidth, newWorldHeight);

            wrap.dataset.worldLeft = String(newWorldLeft);
            wrap.dataset.worldTop = String(newWorldTop);
            wrap.dataset.worldWidth = String(newWorldWidth);
            wrap.dataset.worldHeight = String(newWorldHeight);

            this._applyWorldToScreen(wrap);

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
            this._showActionButtonsForWrap(wrap);
          },
          end: () => {
            // Record resize operation for undo/redo
            if (typeof HistoryManager !== "undefined" && !item.locked) {
              const newWorldWidth = parseFloat(wrap.dataset.worldWidth || 0);
              const newWorldHeight = parseFloat(wrap.dataset.worldHeight || 0);
              const newWorldLeft = parseFloat(wrap.dataset.worldLeft || 0);
              const newWorldTop = parseFloat(wrap.dataset.worldTop || 0);

              // Only record if size actually changed
              if (startState.worldWidth !== newWorldWidth || startState.worldHeight !== newWorldHeight || startState.worldLeft !== newWorldLeft || startState.worldTop !== newWorldTop) {
                HistoryManager.recordOperation("modify", "shapeToolkit", "resize", {
                  id: item.id,
                  oldWidth: startState.worldWidth,
                  oldHeight: startState.worldHeight,
                  oldLeft: startState.worldLeft,
                  oldTop: startState.worldTop,
                  newWidth: newWorldWidth,
                  newHeight: newWorldHeight,
                  newLeft: newWorldLeft,
                  newTop: newWorldTop,
                });
              }
            }

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          },
        },
        modifiers: [interact.modifiers.restrictSize({ min: { width: 16, height: 16 } })],
        inertia: false,
      });
  }

  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const t = this.getTransform();
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const worldTop = parseFloat(wrap.dataset.worldTop || 0);
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 100);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 100);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;
    const screenWidth = Math.max(1, Math.round(worldWidth * t.k));
    const screenHeight = Math.max(1, Math.round(worldHeight * t.k));

    // Apply geometry to wrapper
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";
    wrap.style.width = screenWidth + "px";
    wrap.style.height = screenHeight + "px";

    // Scale UI elements appropriately based on zoom level
    const container = wrap.querySelector(".shape-item-container");
    if (container) {
      const smallSide = Math.min(screenWidth, screenHeight);
      const zoomFactor = t.k || 1;

      // Scale padding with zoom level, but keep it reasonable
      const basePadding = Math.max(2, Math.min(12, Math.round(smallSide * 0.08)));
      const scaledPadding = Math.max(1, Math.round(basePadding * Math.min(zoomFactor, 1)));
      container.style.padding = scaledPadding + "px";

      // Scale border radius with zoom level
      const baseBorderRadius = Math.max(2, Math.min(12, Math.round(smallSide * 0.12)));
      const scaledBorderRadius = Math.max(1, Math.round(baseBorderRadius * Math.min(zoomFactor, 1)));
      wrap.style.borderRadius = scaledBorderRadius + "px";

      // Scale border width with zoom level
      const baseBorderWidth = Math.max(0.5, Math.min(2, smallSide * 0.02));
      const scaledBorderWidth = Math.max(0.5, baseBorderWidth * Math.min(zoomFactor, 1));
      wrap.style.border = `${scaledBorderWidth}px solid rgba(0,0,0,0.08)`;

      // Adjust background opacity based on zoom level to prevent visual issues
      const backgroundOpacity = Math.max(0.7, Math.min(0.95, 0.9 + (zoomFactor - 1) * 0.05));
      wrap.style.background = `rgba(255, 255, 255, ${backgroundOpacity})`;
    }

    // Ensure minimum clickable size
    const MIN_SCREEN_SIZE = 12;
    if (screenWidth < MIN_SCREEN_SIZE) {
      wrap.style.width = MIN_SCREEN_SIZE + "px";
    }
    if (screenHeight < MIN_SCREEN_SIZE) {
      wrap.style.height = MIN_SCREEN_SIZE + "px";
    }
  }

  refreshScreenPositions() {
    for (const item of this.items.values()) {
      this._applyWorldToScreen(item.wrap);
    }
  }

  addShapeAtScreen(clientX, clientY, opts = {}) {
    const t = this.getTransform();
    const world = {
      x: (clientX - t.x) / t.k,
      y: (clientY - t.y) / t.k,
    };
    return this.addShapeAtWorld(world.x, world.y, opts);
  }

  selectItem(id) {
    // Clear all selections
    this.items.forEach((it) => {
      if (it.wrap.classList) it.wrap.classList.remove("show-handles");
      if (it.handles) it.handles.style.display = "none";
    });

    const item = this.items.get(id);
    if (!item) return;

    item.wrap.classList.add("show-handles");
    item.handles.style.display = "block";

    this._showActionButtonsForWrap(item.wrap);
  }

  clearSelection() {
    this.items.forEach((it) => {
      if (it.wrap.classList) it.wrap.classList.remove("show-handles");
      if (it.handles) it.handles.style.display = "none";
    });
    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: null },
      })
    );
  }

  _showActionButtonsForWrap(wrap) {
    if (!wrap) return;

    const id = wrap.dataset.id;
    const locked = wrap.dataset.locked === "true";

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "shape", id, locked },
      })
    );
  }

  deleteById(id) {
    const item = this.items.get(id);
    if (!item) return false;

    // Record deletion for undo/redo before removing
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("delete", "shapeToolkit", "delete", {
        id,
        x: item.world.x,
        y: item.world.y,
        size: item.size,
        src: item.src,
        alt: item.alt,
        locked: item.locked,
      });
    }

    if (item.wrap && item.wrap.remove) item.wrap.remove();
    this.items.delete(id);

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: null },
      })
    );
    return true;
  }

  toggleLockById(id) {
    const item = this.items.get(id);
    if (!item) return null;

    item.locked = !item.locked;
    item.wrap.dataset.locked = String(item.locked);

    if (item.locked) {
      item.wrap.classList.add("locked");
    } else {
      item.wrap.classList.remove("locked");
    }

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "shape", id: item.id, locked: item.locked },
      })
    );

    return item.locked;
  }

  getShapeScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  clear() {
    this.items.forEach((it) => it.wrap.remove());
    this.items.clear();
    this.clearSelection();
  }

  // Initialize recent items UI on load
  init() {
    this._updateRecentUI();
    this._updateUploadedUI();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    return {
      id: item.id,
      x: item.world.x,
      y: item.world.y,
      size: item.size,
      src: item.src,
      alt: item.alt,
      locked: item.locked,
    };
  }

  restoreFromData(data) {
    const opts = {
      size: data.size,
      src: data.src,
      alt: data.alt,
    };

    const id = this.addShapeAtWorld(data.x, data.y, opts);
    const item = this.items.get(id);

    if (item && data.locked) {
      item.locked = true;
      item.wrap.dataset.locked = "true";
      item.wrap.classList.add("locked");
    }

    return id;
  }

  // Method for history manager to create from data
  createFromData(data) {
    return this.restoreFromData(data);
  }
}
