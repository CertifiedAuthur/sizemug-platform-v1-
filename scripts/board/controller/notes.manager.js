/**
 * stageNode: DOM node for stage (world-space container)
 * getTransform: function -> {x,y,k} used to convert client <-> world coordinates
 */
class NoteManager {
  constructor(stageNode, getTransform) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.counter = 0;
    this.items = new Map();
    this._editingId = null;
    this.noteColor = null;

    // interaction state
    this._activeDrag = null;
    this._activeResize = null;

    this.placementMode = false;
    this.previewElement = null;
    this.pendingNoteColor = null;

    // track wrap currently showing action buttons
    this._activeWrap = null;

    // Instance-bound handlers (arrow functions -> no need to .bind())
    this._onDocPointerMove = (ev) => this._handleDocPointerMove(ev);
    this._onDocPointerUp = (ev) => this._handleDocPointerUp(ev);
    this._onStageMoveForPreview = (ev) => this._handleStageMoveForPreview(ev);
    this._onStageClickForPlacement = (ev) => this._handleStageClickForPlacement(ev);
    this._onStagePointerDown = (ev) => this._handleStagePointerDown(ev);

    // helper for external callers
    this.updateEditorToolbarPosition = this.updateEditorToolbarPosition.bind(this);
    this.refreshScreenPositions = this.refreshScreenPositions.bind(this);

    this.stage.addEventListener("pointerdown", this._onStagePointerDown);
    this.bindNoteEditingEvent();

    // Initialize history tracking
    Object.assign(this, HistoryMixin);
    this._initHistoryTracking("notes");
  }

  updateEditorToolbarPosition() {
    if (this._editingId == null) return;
    const item = this.items.get(this._editingId);
    if (!item) return;
    this._positionToolbarForWrap(item.wrap);
  }

  /**
   * Apply world coordinates to screen coordinates for note elements
   * Uses CSS transform scale to maintain exact visual consistency like Miro
   */
  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const content = wrap.querySelector(".note-content");
    const t = this.getTransform ? this.getTransform() : { x: 0, y: 0, k: 1 };

    // Get world coordinates and dimensions
    const worldLeft = Number(wrap.dataset.worldLeft ?? parseFloat(wrap.style.left || 0)) || 0;
    const worldTop = Number(wrap.dataset.worldTop ?? parseFloat(wrap.style.top || 0)) || 0;
    const worldWidth = Number(wrap.dataset.worldWidth ?? parseFloat(wrap.style.width || wrap.offsetWidth)) || 200;
    const worldHeight = Number(wrap.dataset.worldHeight ?? parseFloat(wrap.style.height || wrap.offsetHeight)) || 200;
    const worldFont = Number(wrap.dataset.worldFont ?? (content ? parseFloat(getComputedStyle(content).fontSize) : 14)) || 14;

    // Convert to screen coordinates for positioning
    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    // Calculate scale factors
    const baseWidth = 200; // Default base width
    const baseHeight = 200; // Default base height
    const baseFontSize = 14; // Default base font size

    const widthScale = worldWidth / baseWidth;
    const heightScale = worldHeight / baseHeight;
    const zoomScale = t.k;

    // Use average of width and height scale for proportional scaling
    const sizeScale = Math.sqrt(widthScale * heightScale); // Geometric mean for balanced scaling
    const totalScale = sizeScale * zoomScale;

    // Apply positioning
    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    // Set base dimensions (unscaled)
    wrap.style.width = baseWidth + "px";
    wrap.style.height = baseHeight + "px";

    // Apply scale transform - this maintains layout perfectly
    wrap.style.transform = `scale(${totalScale})`;
    wrap.style.transformOrigin = "0 0"; // Scale from top-left corner

    // Set base font size (will be scaled by transform)
    if (content) {
      content.style.fontSize = worldFont + "px";

      // Prevent text reflow by maintaining consistent text behavior
      content.style.wordBreak = "break-word";
      content.style.overflowWrap = "break-word";
      content.style.whiteSpace = "pre-wrap"; // Preserve line breaks
    }
  }

  _applyAllWorldToScreen() {
    for (const { wrap } of this.items.values()) {
      this._applyWorldToScreen(wrap);
    }
  }

  // --------------------------
  // Preview / placement mode
  // --------------------------
  enablePlacementMode(color = null) {
    this.placementMode = true;
    this.pendingNoteColor = color || this.noteColor || "#ffffff";
    if (!this.previewElement) this.previewElement = this._createPreviewElement();
    this.previewElement.style.backgroundColor = this.pendingNoteColor;
    this.previewElement.style.display = "none";
    this.stage.addEventListener("pointermove", this._onStageMoveForPreview);
    this.stage.addEventListener("click", this._onStageClickForPlacement);
  }

  disablePlacementMode() {
    this.placementMode = false;
    if (this.previewElement) this.previewElement.style.display = "none";
    this.stage.removeEventListener("pointermove", this._onStageMoveForPreview);
    this.stage.removeEventListener("click", this._onStageClickForPlacement);

    if (window.app) {
      window.app.setTool && window.app.setTool("select");
      window.app.setDrawingMode && window.app.setDrawingMode(false);
      if (window.app.ui) {
        const pointerBtn = document.getElementById("pointerToolbarButton");
        window.app.ui._setActive && window.app.ui._setActive(pointerBtn);
        window.app.ui._setCursorForTool && window.app.ui._setCursorForTool("select");
      }
    }
  }

  _createPreviewElement() {
    const preview = document.createElement("div");
    preview.className = "note-preview";
    preview.style.cssText = `
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 8px;
      opacity: 0.4;
      pointer-events: none;
      z-index: 999999;
      display: none;
      transition: opacity 0.12s linear;
      box-shadow: 0 6px 20px rgba(0,0,0,0.08);
      transform-origin: 0 0;
    `;
    const inner = document.createElement("div");
    inner.style.cssText = `
      width: 100%;
      height: 100%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 13px;
      color: rgba(0,0,0,0.6);
      user-select: none;
    `;
    inner.textContent = "Click to place note";
    preview.appendChild(inner);
    this.stage.appendChild(preview);
    return preview;
  }

  _handleStageMoveForPreview(ev) {
    if (!this.placementMode || !this.previewElement) return;
    this.previewElement.style.display = "block";

    if (ev.target !== this.stage && ev.target.closest && ev.target.closest(".note-item, #note_editor_wrapper, #noteActionBtnsWrapper")) {
      this.previewElement.style.opacity = "0";
      return;
    }
    this.previewElement.style.opacity = "0.4";

    const t = this.getTransform();
    const worldX = (ev.clientX - t.x) / t.k;
    const worldY = (ev.clientY - t.y) / t.k;
    const w = parseFloat(this.previewElement.style.width) || 200;
    const h = parseFloat(this.previewElement.style.height) || 200;

    // convert to screen so preview follows view (stage is not CSS-transformed)
    const screenX = worldX * t.k + t.x - w / 2;
    const screenY = worldY * t.k + t.y - h / 2;

    this.previewElement.style.left = `${Math.round(screenX)}px`;
    this.previewElement.style.top = `${Math.round(screenY)}px`;
  }

  _handleStageClickForPlacement(ev) {
    if (!this.placementMode) return;
    if (ev.target !== this.stage && ev.target.closest && ev.target.closest(".note-item, #note_editor_wrapper, #noteActionBtnsWrapper")) return;
    ev.stopPropagation();
    ev.preventDefault();
    const t = this.getTransform();
    const worldX = (ev.clientX - t.x) / t.k;
    const worldY = (ev.clientY - t.y) / t.k;
    const id = this.create(worldX - 100, worldY - 100, "Type...", this.pendingNoteColor);
    this.startEditing(id);
    this.disablePlacementMode();
  }

  togglePlacementMode(color = null) {
    if (this.placementMode) this.disablePlacementMode();
    else this.enablePlacementMode(color);
  }

  /**
   * Create method
   */
  create(x, y, text = "", color = "#ffffff") {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "note-item whiteboard-content-item";
    wrap.dataset.id = String(id);
    wrap.dataset.noteColor = color;

    const defaultW = 200;
    const defaultH = 200;
    const defaultFont = 14;

    // Store world coordinates
    wrap.dataset.worldLeft = String(Number(x || 0));
    wrap.dataset.worldTop = String(Number(y || 0));
    wrap.dataset.worldWidth = String(defaultW);
    wrap.dataset.worldHeight = String(defaultH);
    wrap.dataset.worldFont = String(defaultFont);

    // Base styling for transform scaling
    wrap.style.position = "absolute";
    wrap.style.width = defaultW + "px";
    wrap.style.height = defaultH + "px";
    wrap.style.backgroundColor = color;
    wrap.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
    wrap.style.borderRadius = "8px";
    wrap.style.boxSizing = "border-box";
    wrap.style.transformOrigin = "0 0";

    // Create content with fixed base styling
    const content = document.createElement("div");
    content.className = "note-content";
    content.contentEditable = "false";
    content.style.cssText = `
    width: 100%;
    height: 100%;
    padding: 12px;
    box-sizing: border-box;
    outline: none;
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: ${defaultFont}px;
    line-height: 1.4;
    color: rgba(0,0,0,0.85);
    overflow: auto;
    scrollbar-width: none;
    word-break: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
  `;

    // Set content with placeholder handling
    if (text && text.trim()) {
      content.innerHTML = text;
      content.dataset.placeholder = "false";
    } else {
      content.innerHTML = '<span style="color: rgba(0,0,0,0.35);">Type...</span>';
      content.dataset.placeholder = "true";
    }

    // Create resize handles
    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.position = "absolute";
    handles.style.top = "0";
    handles.style.left = "0";
    handles.style.width = "100%";
    handles.style.height = "100%";

    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const h = document.createElement("div");
      h.className = `resize-handle ${pos}`;
      h.dataset.handle = pos;

      // Position handles
      handles.appendChild(h);
    });

    wrap.appendChild(content);
    wrap.appendChild(handles);
    this.stage.appendChild(wrap);

    this.items.set(id, { id, wrap, content, handles });

    // Wire events
    this._wireWrapEvents(wrap, id);

    // Apply initial transform-based positioning
    this._applyWorldToScreen(wrap);

    // Initialize interact if present
    this._initInteractOnWrap(wrap, id);

    return id;
  }

  createAtCenter(text = "", color = "#ffffff") {
    const vp = this.stage.parentElement.getBoundingClientRect();
    const centerScreen = { x: vp.width / 2, y: vp.height / 2 };
    const t = this.getTransform();
    const world = { x: (centerScreen.x - t.x) / t.k, y: (centerScreen.y - t.y) / t.k };
    return this.create(world.x - 100, world.y - 100, text, color);
  }

  /**
   * Updated event wiring for transform-based scaling
   */
  _wireWrapEvents(wrap, id) {
    const content = wrap.querySelector(".note-content");
    let resizeObserver;

    const startObserving = () => {
      if (resizeObserver) resizeObserver.disconnect();
      resizeObserver = new ResizeObserver(() => {
        this._repositionToolbarsForWrap(wrap);
      });
      resizeObserver.observe(wrap);
      content.addEventListener("input", this._onNoteInput);
    };

    const stopObserving = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      content.removeEventListener("input", this._onNoteInput);
    };

    this._onNoteInput = () => {
      this._repositionToolbarsForWrap(wrap);
    };

    // Selection and drag start
    wrap.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".resize-handle")) return;
      if (content.isContentEditable && document.activeElement === content) return;

      if (wrap.dataset.locked === "true") {
        ev.stopPropagation();
        this._selectNote(wrap);
        return;
      }

      ev.stopPropagation();
      ev.preventDefault();
      this._selectNote(wrap);
      this._startDrag(ev, wrap, id);
    });

    // Double click to edit
    wrap.addEventListener("dblclick", (ev) => {
      ev.stopPropagation();
      if (wrap.dataset.locked === "true") return;
      this.startEditing(id);
    });

    // Editing events
    content.addEventListener("focusin", () => {
      wrap.classList.add("editing", "show-handles");
      content.contentEditable = "true";
      this._editingId = id;

      if (content.dataset.placeholder === "true") {
        content.innerHTML = "";
        content.dataset.placeholder = "false";
      }

      this._repositionToolbarsForWrap(wrap);
      startObserving();
    });

    content.addEventListener("focusout", (e) => {
      this._handleFocusOut(e, wrap, content, id, stopObserving);
    });

    // Manual resize handles fallback
    const handles = wrap.querySelectorAll(".resize-handle");
    handles.forEach((h) => {
      h.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (wrap.dataset.locked === "true") return;
        this._startResize(ev, wrap, id, h.dataset.handle);
      });
    });
  }

  /**
   * Select note and show handles
   */
  _selectNote(wrap) {
    // Show handles for this element
    wrap.classList.add("show-handles");
    this._showActionButtonsForWrap(wrap, true);
  }

  /**
   * Start manual drag operation
   */
  _startDrag(ev, wrap, id) {
    const t = this.getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    const startLeft = Number(wrap.dataset.worldLeft || parseFloat(wrap.style.left || 0)) || 0;
    const startTop = Number(wrap.dataset.worldTop || parseFloat(wrap.style.top || 0)) || 0;

    this._activeDrag = {
      id,
      startWorld: world,
      startLeftTop: { left: startLeft, top: startTop },
    };

    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
  }

  /**
   * Start manual resize operation
   */
  _startResize(ev, wrap, id, handle) {
    const t = this.getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    const initialWidth = Number(wrap.dataset.worldWidth || parseFloat(wrap.style.width || 200)) || 200;
    const initialHeight = Number(wrap.dataset.worldHeight || parseFloat(wrap.style.height || 200)) || 200;

    this._activeResize = {
      id,
      handle,
      startWorld: world,
      startSize: { w: initialWidth, h: initialHeight },
    };

    this._selectNote(wrap);
    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
  }

  /**
   * Handle focus out events
   */
  _handleFocusOut(e, wrap, content, id, stopObserving) {
    const toolbar = document.getElementById("note_editor_wrapper");
    const actionButtons = document.getElementById("noteActionBtnsWrapper");
    const movedTo = e.relatedTarget || document.activeElement;

    if ((toolbar && movedTo && toolbar.contains(movedTo)) || (actionButtons && movedTo && actionButtons.contains(movedTo))) {
      return;
    }

    setTimeout(() => {
      const active = document.activeElement;
      if ((toolbar && active && toolbar.contains(active)) || (actionButtons && active && actionButtons.contains(active))) {
        return;
      }

      content.contentEditable = "false";
      wrap.classList.remove("editing", "show-handles");

      if (!content.innerHTML.trim()) {
        content.innerHTML = '<span style="color: rgba(0,0,0,0.35);">Type...</span>';
        content.dataset.placeholder = "true";
      }

      if (this._editingId === id) this._editingId = null;

      if (toolbar) toolbar.classList.add("board--hidden");
      if (actionButtons) actionButtons.classList.add("board--hidden");

      stopObserving();
    }, 100);
  }

  startEditing(id) {
    const item = this.items.get(id);
    if (!item) return;
    const { wrap, content } = item;
    if (wrap.dataset.locked === "true") return;

    wrap.classList.add("editing", "show-handles");
    content.contentEditable = "true";
    content.focus();
    this._editingId = id;

    const range = document.createRange();
    range.selectNodeContents(content);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    this._positionToolbarForWrap(wrap);
    this._showActionButtonsForWrap(wrap, true);
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;
    item.wrap.remove();
    this.items.delete(id);
    if (this._editingId === id) this._editingId = null;
    this._hideActionButtons();
  }

  // --------------------------
  // fallback doc pointer handlers (drag/resize without interact)
  // --------------------------
  _handleDocPointerMove(ev) {
    const t = this.getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    if (this._activeResize) {
      const { id, handle, startWorld, startSize } = this._activeResize;
      const item = this.items.get(id);
      if (!item) return;
      const { wrap } = item;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      let newW = startSize.w;
      let newH = startSize.h;
      let newLeft = Number(wrap.dataset.worldLeft || 0);
      let newTop = Number(wrap.dataset.worldTop || 0);

      if (handle === "br") {
        newW = Math.max(80, startSize.w + dx);
        newH = Math.max(80, startSize.h + dy);
      } else if (handle === "bl") {
        newW = Math.max(80, startSize.w - dx);
        newH = Math.max(80, startSize.h + dy);
        newLeft = newLeft + (startSize.w - newW);
      } else if (handle === "tr") {
        newW = Math.max(80, startSize.w + dx);
        newH = Math.max(80, startSize.h - dy);
        newTop = newTop + (startSize.h - newH);
      } else if (handle === "tl") {
        newW = Math.max(80, startSize.w - dx);
        newH = Math.max(80, startSize.h - dy);
        newLeft = newLeft + (startSize.w - newW);
        newTop = newTop + (startSize.h - newH);
      }

      wrap.dataset.worldLeft = String(newLeft);
      wrap.dataset.worldTop = String(newTop);
      wrap.dataset.worldWidth = String(newW);
      wrap.dataset.worldHeight = String(newH);

      this._applyWorldToScreen(wrap);

      // update local toolbars
      this._repositionToolbarsForWrap(wrap);

      // Also notify app to reposition the shared selection toolbar (important!)
      if (window.app && typeof window.app._scheduleToolbarReposition === "function") {
        window.app._scheduleToolbarReposition();
      }

      return;
    }

    if (this._activeDrag) {
      const { id, startWorld, startLeftTop } = this._activeDrag;
      const item = this.items.get(id);
      if (!item) return;
      const { wrap } = item;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      wrap.dataset.worldLeft = String(startLeftTop.left + dx);
      wrap.dataset.worldTop = String(startLeftTop.top + dy);

      this._applyWorldToScreen(wrap);
      this._positionToolbarForWrap(wrap);
      this._positionActionButtonsForWrap(wrap);

      // notify app too (keeps shared toolbar in sync)
      if (window.app && typeof window.app._scheduleToolbarReposition === "function") {
        window.app._scheduleToolbarReposition();
      }
    }
  }

  _handleDocPointerUp() {
    this._activeDrag = null;
    this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);

    // local UI cleanup
    if (!document.querySelector(".note-item.show-handles")) {
      this._hideActionButtons();
    }

    // ensure shared toolbar is repositioned after the interaction completes
    if (window.app && typeof window.app._scheduleToolbarReposition === "function") {
      window.app._scheduleToolbarReposition();
    }
  }

  // --------------------------
  // Interact.js wiring (if present)
  // --------------------------
  /*** Updated Interact.js initialization for transform scaling ***/
  _initInteractOnWrap(wrap, id) {
    if (typeof interact === "undefined") return;

    const startState = {};

    // Draggable with transform-aware calculations
    interact(wrap).draggable({
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;
          this._selectNote(wrap);
          startState.worldLeft = Number(wrap.dataset.worldLeft || 0);
          startState.worldTop = Number(wrap.dataset.worldTop || 0);
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;

          const t = this.getTransform();
          const k = t.k || 1;

          // Convert screen delta to world delta
          const worldDx = (evt.dx || 0) / k;
          const worldDy = (evt.dy || 0) / k;

          const newWorldLeft = (Number(wrap.dataset.worldLeft) || 0) + worldDx;
          const newWorldTop = (Number(wrap.dataset.worldTop) || 0) + worldDy;

          wrap.dataset.worldLeft = String(newWorldLeft);
          wrap.dataset.worldTop = String(newWorldTop);

          this._applyWorldToScreen(wrap);
          this._positionToolbarForWrap(wrap);
          this._positionActionButtonsForWrap(wrap);

          if (window.app && window.app._scheduleToolbarReposition) {
            window.app._scheduleToolbarReposition();
          }
        },
      },
      inertia: false,
    });

    // Resizable with transform scaling
    interact(wrap).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;
          this._selectNote(wrap);

          startState.screenRect = wrap.getBoundingClientRect();
          startState.worldLeft = Number(wrap.dataset.worldLeft || 0);
          startState.worldTop = Number(wrap.dataset.worldTop || 0);
          startState.worldWidth = Number(wrap.dataset.worldWidth || 200);
          startState.worldHeight = Number(wrap.dataset.worldHeight || 200);
          startState.worldFont = Number(wrap.dataset.worldFont || 14);
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;

          const rect = evt.rect;
          if (!rect) return;

          const t = this.getTransform();
          const k = t.k || 1;

          // Calculate world deltas
          const screenDeltaLeft = rect.left - (startState.screenRect ? startState.screenRect.left : rect.left);
          const screenDeltaTop = rect.top - (startState.screenRect ? startState.screenRect.top : rect.top);
          const worldDeltaLeft = screenDeltaLeft / k;
          const worldDeltaTop = screenDeltaTop / k;

          const newWorldLeft = (startState.worldLeft || 0) + worldDeltaLeft;
          const newWorldTop = (startState.worldTop || 0) + worldDeltaTop;
          const newWorldWidth = rect.width / k;
          const newWorldHeight = rect.height / k;

          // Update world coordinates
          wrap.dataset.worldLeft = String(newWorldLeft);
          wrap.dataset.worldTop = String(newWorldTop);
          wrap.dataset.worldWidth = String(newWorldWidth);
          wrap.dataset.worldHeight = String(newWorldHeight);

          // Scale font proportionally with average size change
          const avgStartSize = Math.sqrt(startState.worldWidth * startState.worldHeight);
          const avgNewSize = Math.sqrt(newWorldWidth * newWorldHeight);
          const scale = avgStartSize > 0 ? avgNewSize / avgStartSize : 1;
          const newWorldFont = Math.max(8, Math.round((startState.worldFont || 14) * scale));
          wrap.dataset.worldFont = String(newWorldFont);

          // Apply transform-based visual update
          this._applyWorldToScreen(wrap);
          this._positionToolbarForWrap(wrap);
          this._positionActionButtonsForWrap(wrap);

          if (window.app && window.app._scheduleToolbarReposition) {
            window.app._scheduleToolbarReposition();
          }
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 80, height: 80 },
        }),
      ],
      inertia: false,
    });
  }

  // --------------------------
  // UI wiring (toolbar, colors, actions)
  // --------------------------
  getActiveEditingNote() {
    const wrap = document.querySelector(".note-item.show-handles");
    const content = wrap?.querySelector(".note-content");
    if (!wrap || !content) return null;
    return { wrap, content };
  }

  bindNoteEditingEvent() {
    const toolbar = document.getElementById("note_editor_wrapper");
    const colorPicker = document.getElementById("note_color_picker_container");
    const colorPickerInput = colorPicker?.querySelector("input");
    const noteToolsWrapper = document.getElementById("noteActionBtnsWrapper");
    const noteToggleCapitalize = document.getElementById("noteToggleCapitalize");
    const noteManagerContainer = document.getElementById("noteManagerContainer");
    const noteColorPickerInput = document.getElementById("note_color_picker_color");
    const noteFontSizeSelect = document.getElementById("noteFontSizeSelect");
    const noteFormatBlockSelect = document.getElementById("noteFormatBlockSelect");
    const noteAddLink = document.getElementById("noteAddLink");

    // editor toolbar should be in body to avoid clipping
    if (toolbar && toolbar.parentElement !== document.body) {
      document.body.appendChild(toolbar);
      toolbar.style.position = "fixed";
      toolbar.style.transform = "translateX(-50%)";
      toolbar.style.zIndex = "1000000";
      toolbar.addEventListener("pointerdown", (e) => {
        const interactive = e.target.closest && e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
      });
      toolbar.addEventListener("click", (e) => e.stopPropagation());
    }

    if (noteManagerContainer) {
      noteManagerContainer.addEventListener("click", (e) => {
        const button = e.target.closest && e.target.closest("button");
        if (!button) return;
        if (button.classList.contains("board-color-pallete-btn")) {
          noteColorPickerInput?.click();
          return;
        }

        const { color } = button.dataset || {};
        if (color) {
          this.noteColor = color;
          if (this.placementMode) {
            this.pendingNoteColor = color;
            if (this.previewElement) this.previewElement.style.backgroundColor = color;
          }
        }

        noteManagerContainer.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      });
    }

    if (noteColorPickerInput) {
      noteColorPickerInput.addEventListener("input", (e) => {
        const color = e.target.value;

        this.noteColor = color;
        this.pendingNoteColor = color;
        if (this.previewElement) this.previewElement.style.backgroundColor = color;
      });
    }

    if (colorPicker && colorPickerInput) {
      colorPicker.addEventListener("click", () => colorPickerInput.click());
      colorPickerInput.addEventListener("change", (e) => {
        const { content } = this.getActiveEditingNote();
        if (content) {
          content.style.color = e.target.value;
        }
      });
    }

    const boldBtn = document.getElementById("noteToggleBold");
    const italicBtn = document.getElementById("noteToggleItalic");
    if (boldBtn)
      boldBtn.addEventListener("click", () => {
        const { content } = this.getActiveEditingNote();
        if (content) {
          content.classList.toggle("bold");
        }
      });
    if (italicBtn)
      italicBtn.addEventListener("click", () => {
        const { content } = this.getActiveEditingNote();
        if (content) {
          content.classList.toggle("italic");
        }
      });

    if (noteToggleCapitalize) {
      noteToggleCapitalize.addEventListener("click", () => {
        const active = this.getActiveEditingNote();
        if (!active) return;
        const { wrap, content } = active;
        const isNowActive = noteToggleCapitalize.classList.toggle("active");
        noteToggleCapitalize.setAttribute("aria-pressed", String(isNowActive));
        content.style.textTransform = isNowActive ? "uppercase" : "none";
        wrap.dataset.textTransform = content.style.textTransform;
      });
    }

    if (noteToolsWrapper) {
      noteToolsWrapper.addEventListener("pointerdown", (e) => {
        const interactive = e.target.closest && e.target.closest("button, input, select, textarea");
        if (interactive) return;
        e.preventDefault();
      });

      noteToolsWrapper.addEventListener("click", (e) => {
        const btn = e.target.closest && e.target.closest("button[data-action]");
        if (!btn) return;
        const action = btn.dataset.action;
        const active = this.getActiveEditingNote();
        if (!active) return;
        const id = Number(active.wrap.dataset.id);

        switch (action) {
          case "delete":
            this.remove(id);
            this._hideActionButtons();
            break;
          case "lock": {
            const isLocked = btn.classList.toggle("locked");
            btn.setAttribute("aria-pressed", String(isLocked));
            active.wrap.dataset.locked = String(isLocked);
            if (isLocked) active.wrap.classList.add("locked");
            else active.wrap.classList.remove("locked");
            window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "note", id, locked: isLocked, preferBottom: true } }));
            break;
          }
          case "color":
            colorPickerInput && colorPickerInput.click();
            break;
          default:
            break;
        }
      });
    }

    // Setup custom dropdown for font size
    if (noteFontSizeSelect) {
      setTimeout(() => {
        const dropdown = noteFontSizeSelect._customDropdown;
        if (dropdown) {
          dropdown.onChange = (value, text) => {
            const active = this.getActiveEditingNote();
            if (!active) return;
            const { content, wrap } = active;

            const num = parseFloat(value);
            if (Number.isNaN(num)) return;
            const newFontPxWorld = Math.max(8, Math.round(num));
            wrap.dataset.worldFont = String(newFontPxWorld);
            this._applyWorldToScreen(wrap);
            this._repositionToolbarsForWrap(wrap);
          };
        }
      }, 100);
    }

    // Setup custom dropdown for format
    if (noteFormatBlockSelect) {
      setTimeout(() => {
        const dropdown = noteFormatBlockSelect._customDropdown;
        if (dropdown) {
          dropdown.onChange = (value, text) => {
            const active = this.getActiveEditingNote();
            if (!active) return;
            const { content, wrap } = active;

            let size;
            let weight;

            if (value === "h1") {
              size = 24;
              weight = 900;
            } else if (value === "h2") {
              size = 20;
              weight = 800;
            } else if (value === "h3") {
              size = 18;
              weight = 700;
            } else if (value === "h4") {
              size = 16;
              weight = 600;
            } else if (value === "h5") {
              size = 14;
              weight = 500;
            } else if (value === "h6") {
              size = 12;
              weight = 400;
            } else if (value === "p") {
              size = 14;
              weight = 400;
            }

            if (size && weight) {
              wrap.dataset.worldFont = String(size);
              content.style.fontWeight = weight;
              wrap.dataset.fontWeight = weight;
              this._applyWorldToScreen(wrap);
              this._repositionToolbarsForWrap(wrap);
            }
          };
        }
      }, 100);
    }

    // Link button handler
    if (noteAddLink) {
      noteAddLink.addEventListener("click", () => {
        const active = this.getActiveEditingNote();
        if (!active) return;
        const { content } = active;

        // Get selected text if any
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // Show link modal
        if (typeof linkModalHandler !== "undefined") {
          linkModalHandler.show({
            text: selectedText,
            url: "",
            onApply: (data) => {
              this._insertLink(content, data.text, data.url);
            },
            context: active,
          });
        }
      });
    }
  }

  /**
   * Insert a link into the note content
   */
  _insertLink(content, text, url) {
    if (!content) return;

    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    // Create link element
    const link = document.createElement("a");
    link.href = url;
    link.textContent = text;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.color = "#0066cc";
    link.style.textDecoration = "underline";

    if (range && content.contains(range.commonAncestorContainer)) {
      // Replace selection with link
      range.deleteContents();
      range.insertNode(link);

      // Move cursor after link
      range.setStartAfter(link);
      range.setEndAfter(link);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Append link at the end
      content.appendChild(document.createTextNode(" "));
      content.appendChild(link);
      content.appendChild(document.createTextNode(" "));
    }

    // Trigger input event to update
    content.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Show shared action toolbar via app; preferBottom tells the app to place it below the note.
  _showActionButtonsForWrap(wrap, preferBottom = true) {
    if (!wrap) return;
    const id = Number(wrap.dataset.id);
    const locked = wrap.dataset.locked === "true";
    this._activeWrap = wrap;
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "note", id, locked, preferBottom: !!preferBottom } }));
    // also position local fallback wrapper (if you use noteActionBtnsWrapper)
    this._positionActionButtonsForWrap(wrap);
  }

  _hideActionButtons() {
    this._activeWrap = null;
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    const local = document.getElementById("noteActionBtnsWrapper");
    if (local) local.classList.add("hidden");
  }

  _repositionToolbarsForWrap(wrap) {
    if (!wrap) return;
    this._positionToolbarForWrap(wrap);
    this._positionActionButtonsForWrap(wrap);
  }

  _positionToolbarForWrap(wrap) {
    const toolbar = document.getElementById("note_editor_wrapper");
    const viewport = document.getElementById("viewport");
    if (!toolbar || !viewport || !wrap) return;

    // It's better to keep the toolbar inside the viewport for positioning context
    if (toolbar.parentElement !== viewport) {
      viewport.appendChild(toolbar);
      toolbar.style.position = "absolute"; // Use absolute to position relative to viewport
      toolbar.style.zIndex = "1000000";
    }

    const wrapRect = wrap.getBoundingClientRect();
    const vpRect = viewport.getBoundingClientRect();

    // Position above the note
    const top = wrapRect.top - vpRect.top - toolbar.offsetHeight - 10; // 10px gap
    const left = wrapRect.left - vpRect.left + wrapRect.width / 2 - toolbar.offsetWidth / 2;

    toolbar.style.left = `${left}px`;
    toolbar.style.top = `${top}px`;
    toolbar.classList.remove("board--hidden");
  }

  _positionActionButtonsForWrap(wrap) {
    const wrapper = document.getElementById("noteActionBtnsWrapper");
    const viewport = document.getElementById("viewport");
    if (!wrapper || !viewport || !wrap) return;

    if (wrapper.parentElement !== viewport) {
      viewport.appendChild(wrapper);
      wrapper.style.position = "absolute";
      wrapper.style.zIndex = "1000001";
    }

    const wrapRect = wrap.getBoundingClientRect();
    const vpRect = viewport.getBoundingClientRect();

    // Position below the note
    const top = wrapRect.bottom - vpRect.top + 10; // 10px gap
    const left = wrapRect.left - vpRect.left + wrapRect.width / 2 - wrapper.offsetWidth / 2;

    wrapper.style.left = `${left}px`;
    wrapper.style.top = `${top}px`;
    wrapper.classList.remove("board--hidden");
  }

  // --------------------------
  // serialization / restore
  // --------------------------
  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;
    const { wrap, content } = item;
    return {
      id,
      left: Number(wrap.dataset.worldLeft ?? parseFloat(wrap.style.left || 0)),
      top: Number(wrap.dataset.worldTop ?? parseFloat(wrap.style.top || 0)),
      width: Number(wrap.dataset.worldWidth ?? parseFloat(wrap.style.width || 200)),
      height: Number(wrap.dataset.worldHeight ?? parseFloat(wrap.style.height || 200)),
      color: wrap.dataset.noteColor || wrap.style.backgroundColor,
      content: content.dataset.placeholder === "true" ? "" : content.innerHTML,
      locked: wrap.dataset.locked === "true",
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left || 0, data.top || 0, data.content || "", data.color || "#ffffff");
    const item = this.items.get(id);
    if (!item) return id;
    const { wrap } = item;
    wrap.dataset.worldLeft = String(data.left || 0);
    wrap.dataset.worldTop = String(data.top || 0);
    wrap.dataset.worldWidth = String(data.width || wrap.dataset.worldWidth);
    wrap.dataset.worldHeight = String(data.height || wrap.dataset.worldHeight);
    wrap.dataset.worldFont = String(data.font || parseFloat(wrap.dataset.worldFont || 14));
    this._applyWorldToScreen(wrap);
    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
    }
    return id;
  }

  isEditing() {
    return this._editingId != null;
  }

  // Called by app when transform changes
  refreshScreenPositions() {
    // reposition editor toolbar if editing
    if (this._editingId != null) {
      const item = this.items.get(this._editingId);
      if (item && item.wrap) {
        this._positionToolbarForWrap(item.wrap);
        this._activeWrap = item.wrap;
      }
    }

    // reposition action toolbar (app will do shared toolbar but fallback local wrapper too)
    const activeNote = this._activeWrap || document.querySelector(".note-item.show-handles");
    if (activeNote) {
      this._positionActionButtonsForWrap(activeNote);
    }

    // update visual coords for all notes (important when zoom/pan changes)
    this._applyAllWorldToScreen();
  }

  _handleStagePointerDown(ev) {
    if (ev.target.closest(".note-item, #note_editor_wrapper, #noteActionBtnsWrapper")) {
      return;
    }
    const selected = document.querySelector(".note-item.show-handles");
    if (selected && !selected.classList.contains("editing")) {
      selected.classList.remove("show-handles");
      this._hideActionButtons();
    }
  }
}
