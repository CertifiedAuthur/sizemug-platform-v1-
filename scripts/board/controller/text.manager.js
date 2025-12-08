class TextManager {
  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.counter = 0;
    this.items = new Map();
    this._editingId = null;

    this.app = app;

    // bound handlers used by pointer listeners (fallback)
    this._onDocPointerMove = this._onDocPointerMove.bind(this);
    this._onDocPointerUp = this._onDocPointerUp.bind(this);

    // state for ongoing interactions (fallback)
    this._activeDrag = null; // { id, startWorld, startLeftTop }
    this._activeResize = null; // reserved when using manual handlers

    // allow safe calls from outside
    this.updateEditorToolbarPosition = this.updateEditorToolbarPosition.bind(this);

    // wire up UI
    this.bindTextEditingEvent();
  }

  /* -----------------------
     Utilities: world <-> screen
     ----------------------- */
  _getTransform() {
    const t = this.getTransform && this.getTransform();
    return t || { x: 0, y: 0, k: 1 };
  }

  _measureTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  _worldToScreen(worldX, worldY) {
    const t = this._getTransform();
    return {
      left: worldX * t.k + t.x,
      top: worldY * t.k + t.y,
    };
  }

  /**
   * Apply world coordinates to screen coordinates for text elements
   * Uses CSS transform scale to maintain exact visual consistency like Miro
   */
  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const t = this._getTransform();
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const worldTop = parseFloat(wrap.dataset.worldTop || 0);
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 220); // default width
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 100); // default height
    const worldFont = parseFloat(wrap.dataset.worldFont || 16);

    // Convert to screen coordinates for positioning
    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    // Calculate scale factors for both size and zoom
    const baseWidth = 220; // Default base width
    const baseHeight = 100; // Default base height
    const baseFont = 16; // Default base font size

    // Scale for both user resizing and zoom level
    const widthScale = worldWidth / baseWidth;
    const heightScale = worldHeight / baseHeight;
    const zoomScale = t.k;
    const totalScaleX = widthScale * zoomScale;
    const totalScaleY = heightScale * zoomScale;

    // Apply positioning
    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    // Apply actual dimensions scaled by zoom (no transform distortion)
    const actualWidth = worldWidth * zoomScale;
    wrap.style.maxWidth = actualWidth + "px";
    wrap.style.width = "fit-content"; // Shrink to fit content
    wrap.style.minWidth = "50px"; // Minimum width for very small content
    wrap.style.height = "auto"; // Let height adapt to content naturally
    wrap.style.minHeight = "30px"; // Minimum height for empty/small content

    // No transform - use actual pixel dimensions for natural text rendering
    wrap.style.transform = "none";

    // Set actual font size scaled by zoom
    const content = wrap.querySelector(".content");
    if (content) {
      // Apply actual font size for natural text rendering
      const actualFontSize = worldFont * zoomScale;
      content.style.fontSize = actualFontSize + "px";

      // Prevent any text reflow or wrapping changes
      content.style.whiteSpace = "pre-wrap"; // Preserve intentional line breaks
      content.style.wordBreak = "break-word";
      content.style.overflowWrap = "break-word";
      content.style.width = "100%";
      content.style.height = "auto"; // Let content height flow naturally
      content.style.boxSizing = "border-box";
    }
  }

  refreshScreenPositions() {
    for (const { wrap } of this.items.values()) {
      this._applyWorldToScreen(wrap);
    }
    // reposition editor toolbar if editing or selected
    if (this._editingId != null) {
      const it = this.items.get(this._editingId);
      if (it && it.wrap) this._positionToolbarForWrap(it.wrap);
    } else {
      // if nothing editing, try to keep toolbar for selected item
      const selectedWrap = document.querySelector(".text-item.show-handles");
      if (selectedWrap) this._positionToolbarForWrap(selectedWrap);
    }
  }

  getActiveEditingText() {
    const wrap = document.querySelector(`.text-item.show-handles`);
    if (!wrap) return { wrap: null, content: null };
    const content = wrap.querySelector(".content");
    return { wrap, content };
  }

  /* -----------------------
     UI bindings (font, toggle, color)
     ----------------------- */
  bindTextEditingEvent() {
    const textFontSizeSelect = document.getElementById("textFontSizeSelect");
    const textFormatBlockSelect = document.getElementById("textFormatBlockSelect");
    const textToggleCapitalize = document.getElementById("textToggleCapitalize");
    const textToggleBold = document.getElementById("textToggleBold");
    const textToggleItalic = document.getElementById("textToggleItalic");
    const colorPickerContainer = document.getElementById("color_picker_container");
    const toolbar = document.getElementById("whiteboardTextEditorContainer");

    // defensive
    if (!colorPickerContainer) console.warn("color_picker_container not found");
    const colorPickerContainerInput = colorPickerContainer ? colorPickerContainer.querySelector("input") : null;
    if (!colorPickerContainerInput) console.warn("color_picker_container input missing");

    // move toolbar to body (avoid clipping)
    if (toolbar && toolbar.parentElement !== document.body) {
      document.body.appendChild(toolbar);
      toolbar.style.position = "fixed";
      toolbar.style.zIndex = "100";
      toolbar.style.transform = "translateX(-50%)";

      toolbar.addEventListener("pointerdown", (e) => {
        const interactive = e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
      });
      toolbar.addEventListener("click", (e) => e.stopPropagation());
    }

    if (colorPickerContainer && colorPickerContainerInput) {
      colorPickerContainer.addEventListener("click", () => colorPickerContainerInput.click());
      colorPickerContainerInput.addEventListener("input", (e) => {
        const { content } = this.getActiveEditingText();
        if (!content) return;
        content.style.color = e.target.value;
      });
    }

    // Setup custom dropdown for font size
    if (textFontSizeSelect) {
      // Wait for dropdown to be initialized
      setTimeout(() => {
        const dropdown = textFontSizeSelect._customDropdown;
        if (dropdown) {
          dropdown.onChange = (value, text) => {
            const { content, wrap } = this.getActiveEditingText();
            if (!content || !wrap) return;
            const num = parseFloat(value);
            if (Number.isNaN(num)) return;
            const newFontPxWorld = Math.max(8, Math.round(num));
            wrap.dataset.worldFont = String(newFontPxWorld);
            this._applyWorldToScreen(wrap);
            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          };
        }
      }, 100);
    } else {
      console.warn("textFontSizeSelect not found in DOM — check your HTML id.");
    }

    // Setup custom dropdown for format
    if (textFormatBlockSelect) {
      // Wait for dropdown to be initialized
      setTimeout(() => {
        const dropdown = textFormatBlockSelect._customDropdown;
        if (dropdown) {
          dropdown.onChange = (value, text) => {
            const { content, wrap } = this.getActiveEditingText();
            if (!content || !wrap) return;

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
              size = 16;
              weight = 400;
            }

            const num = parseFloat(size);
            if (Number.isNaN(num)) return;
            const newFontPxWorld = Math.max(8, Math.round(num));
            wrap.dataset.worldFont = String(newFontPxWorld);
            content.style.fontWeight = weight;
            wrap.dataset.fontWeight = weight;
            this._applyWorldToScreen(wrap);
            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          };
        }
      }, 100);
    } else {
      console.warn("textFormatBlockSelect not found in DOM — check your HTML id.");
    }

    if (textToggleCapitalize) {
      textToggleCapitalize.addEventListener("click", () => {
        const { wrap, content } = this.getActiveEditingText();
        if (!wrap || !content) return;
        const isNowActive = textToggleCapitalize.classList.toggle("active");
        textToggleCapitalize.setAttribute("aria-pressed", String(isNowActive));
        content.style.textTransform = isNowActive ? "uppercase" : "none";
        wrap.dataset.textTransform = content.style.textTransform;

        if (this.app && this.app._scheduleToolbarReposition) {
          this.app._scheduleToolbarReposition();
        }
      });
    }

    if (textToggleBold) {
      textToggleBold.addEventListener("click", () => {
        const { wrap, content } = this.getActiveEditingText();
        if (!wrap || !content) return;
        const isNowActive = textToggleBold.classList.toggle("active");
        textToggleBold.setAttribute("aria-pressed", String(isNowActive));
        content.style.fontWeight = isNowActive ? "bold" : "normal";
        wrap.dataset.fontWeight = content.style.fontWeight;

        if (this.app && this.app._scheduleToolbarReposition) {
          this.app._scheduleToolbarReposition();
        }
      });
    }

    if (textToggleItalic) {
      textToggleItalic.addEventListener("click", () => {
        const { wrap, content } = this.getActiveEditingText();
        if (!wrap || !content) return;
        const isNowActive = textToggleItalic.classList.toggle("active");
        textToggleItalic.setAttribute("aria-pressed", String(isNowActive));
        content.style.fontStyle = isNowActive ? "italic" : "normal";
        wrap.dataset.fontStyle = content.style.fontStyle;

        if (this.app && this.app._scheduleToolbarReposition) {
          this.app._scheduleToolbarReposition();
        }
      });
    }

    // Link button handler
    const linkButton = toolbar?.querySelector(".whiteboard_editor_action_btn.link");
    if (linkButton) {
      linkButton.addEventListener("click", () => {
        const { wrap, content } = this.getActiveEditingText();
        if (!wrap || !content) return;

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
            context: { wrap, content },
          });
        }
      });
    }

    // toolbar pointer interaction guard
    this._editorToolbarInteracting = false;
    if (toolbar) {
      toolbar.addEventListener("pointerdown", (ev) => {
        const interactive = ev.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) {
          this._editorToolbarInteracting = true;
          const clear = () => {
            this._editorToolbarInteracting = false;
            document.removeEventListener("pointerup", clear);
          };
          document.addEventListener("pointerup", clear);
        }
      });
    }
  }

  /**
   * Insert a link into the content
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

  /*** Create method updated for transform-based scaling ***/
  create(x, y, html = "Sizemug") {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "text-item whiteboard-content-item";
    wrap.dataset.id = id;

    const defaultWidth = 220;
    const defaultHeight = 100;
    const defaultFont = 16;

    // Store canonical world coordinates
    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(defaultWidth);
    wrap.dataset.worldHeight = String(defaultHeight);
    wrap.dataset.worldFont = String(defaultFont);
    wrap.dataset.autoResize = "true";

    // Base styling for natural text rendering
    wrap.style.position = "absolute";
    wrap.style.boxSizing = "border-box";
    wrap.style.transformOrigin = "0 0";
    wrap.style.maxWidth = defaultWidth + "px";
    wrap.style.width = "fit-content";
    wrap.style.minWidth = "50px";
    wrap.style.height = "auto";
    wrap.style.minHeight = "30px";

    // Content element with fixed base styling
    const content = document.createElement("div");
    content.className = "content";
    content.contentEditable = "false";
    content.innerHTML = html;
    content.style.fontSize = defaultFont + "px";
    content.style.lineHeight = "1.2";
    content.style.minHeight = "1em";
    content.style.outline = "none";
    content.style.whiteSpace = "pre-wrap";
    content.style.wordBreak = "break-word";
    content.style.overflowWrap = "break-word";
    content.style.width = "100%";
    content.style.height = "auto";
    content.style.boxSizing = "border-box";
    content.style.padding = "8px";

    // Visual handles
    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.position = "absolute";
    handles.style.top = "0";
    handles.style.left = "0";
    handles.style.width = "100%";
    handles.style.height = "100%";
    handles.style.pointerEvents = "none";
    handles.style.display = "none";

    // Create only corner handles
    ["tl", "tr", "bl", "br"].forEach((pos) => {
      const h = document.createElement("div");
      h.className = "resize-handle " + pos;
      h.dataset.handle = pos;

      handles.appendChild(h);
    });

    wrap.appendChild(content);
    wrap.appendChild(handles);

    // Add to DOM and internal map
    this.stage.appendChild(wrap);
    this.items.set(id, { id, wrap, content, handles });

    // Apply initial transform-based positioning
    this._applyWorldToScreen(wrap);

    // Event handlers
    this._setupTextEventHandlers(wrap, id, content, handles);

    // Initialize Interact.js if available
    this._initInteractOnWrap(wrap, id);

    // Record creation for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("create", "texts", "create", {
        id,
        x,
        y,
        text: html,
        style: {
          width: defaultWidth + "px",
          fontSize: defaultFont + "px",
        },
      });
    }

    return id;
  }

  /**
   * Select text element and show handles
   *
   * Important change: selection now *also* shows the editor toolbar.
   * Editing (double-click/startEditing) is still a separate state that hides handles+global toolbar.
   */
  _selectText(wrap) {
    if (!wrap) return;

    // Mark this one selected
    wrap.classList.add("show-handles");

    // NEW: show editor toolbar on selection (user requested)
    this._showEditorToolbar(wrap);

    // If not editing, show global action toolbar (delete/lock/comment) so user can act on selection
    if (!wrap.classList.contains("editing")) {
      this._showActionButtonsForWrap(wrap);
    } else {
      // if it's editing, ensure action buttons hidden
      // this._hideActionButtons();
    }
  }

  /**
   * Setup event handlers for text element
   */
  _setupTextEventHandlers(wrap, id, content, handles) {
    // Selection and drag start
    wrap.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".resize-handle")) return;
      if (content.isContentEditable && document.activeElement === content) return;

      if (wrap.dataset.locked === "true") {
        ev.stopPropagation();
        this._selectText(wrap);
        return;
      }

      ev.stopPropagation();
      ev.preventDefault();

      // select the item (this now also shows editor toolbar)
      this._selectText(wrap);

      // begin dragging
      this._startDrag(ev, wrap, id);
    });

    // Double click to edit (enter editing mode)
    wrap.addEventListener("dblclick", (ev) => {
      ev.stopPropagation();
      if (wrap.dataset.locked === "true") return;
      this.startEditing(id);
    });

    // Handle auto-resize during editing
    content.addEventListener("input", () => {
      if (wrap.dataset.autoResize === "true") {
        // Reapply transform-based positioning
        this._applyWorldToScreen(wrap);

        // Update toolbar positions
        this._positionToolbarForWrap(wrap);
        if (this.app && this.app._scheduleToolbarReposition) {
          this.app._scheduleToolbarReposition();
        }
      }
    });

    // Keep focusout to finalize editing when content loses focus, but do NOT use focus events to show/hide editor toolbar.
    content.addEventListener("focusout", (e) => {
      // Only finalize editing if this content was editing
      if (!wrap.classList.contains("editing")) return;
      // Defer to let toolbar interactions register
      setTimeout(() => {
        if (this._editorToolbarInteracting) return;
        // finalize editing mode -> returns to selection state (editor still visible because item is selected)
        this._endEditing(wrap);
      }, 0);
    });
  }

  /**
   * Start manual drag operation
   */
  _startDrag(ev, wrap, id) {
    const t = this._getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    const startLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const startTop = parseFloat(wrap.dataset.worldTop || 0);

    this._activeDrag = {
      id,
      startWorld: world,
      startLeftTop: { left: startLeft, top: startTop },
    };

    // hide editor toolbar while dragging
    this._hideEditorToolbar();

    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
  }

  /**
   * Updated Interact.js initialization for transform scaling
   */
  _initInteractOnWrap(wrap, id) {
    if (typeof interact === "undefined") {
      console.warn("Interact.js not found — text resize/drag will use simple pointer handlers.");
      return;
    }

    const startState = {};

    // Resizable with transform scaling - configure FIRST for priority
    interact(wrap).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      margin: 12, // 12px margin from edge to detect resize (larger for easier grabbing)
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;

          // END any active editing session before resizing
          if (this._editingId != null) {
            this._endEditing(this._editingId);
          }

          this._selectText(wrap);

          // Get current actual rendered width (important for fit-content)
          const currentRect = wrap.getBoundingClientRect();
          const t = this._getTransform();
          const currentWorldWidth = currentRect.width / t.k;

          // Update worldWidth to match current actual width before resizing
          wrap.dataset.worldWidth = String(currentWorldWidth);

          // Lock the width to actual pixels during resize
          wrap.style.width = currentRect.width + "px";
          wrap.style.maxWidth = "none";

          startState.worldWidth = currentWorldWidth;
          startState.worldHeight = parseFloat(wrap.dataset.worldHeight || 100);
          startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
          startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);
          startState.worldFont = parseFloat(wrap.dataset.worldFont || 16);

          // hide editor while resizing
          this._hideEditorToolbar();
          this._positionToolbarForWrap(wrap);
          this._showActionButtonsForWrap(wrap);
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;

          const rect = evt.rect;
          const edges = evt.edges;
          if (!rect) return;

          const t = this._getTransform();
          const k = t.k || 1;
          const stageRect = this.stage.getBoundingClientRect();

          // Calculate new dimensions in world coordinates
          const newWorldWidth = rect.width / k;
          const newWorldHeight = rect.height / k;

          // Only update position if resizing from left or top edges
          // When resizing from right or bottom, position stays the same
          if (edges.left) {
            const newWorldLeft = (rect.left - stageRect.left - t.x) / k;
            wrap.dataset.worldLeft = String(newWorldLeft);
          }

          if (edges.top) {
            const newWorldTop = (rect.top - stageRect.top - t.y) / k;
            wrap.dataset.worldTop = String(newWorldTop);
          }

          // Always update dimensions
          wrap.dataset.worldWidth = String(newWorldWidth);
          wrap.dataset.worldHeight = String(newWorldHeight);

          // Scale font proportionally with width change
          const scale = startState.worldWidth > 0 ? newWorldWidth / startState.worldWidth : 1;
          const newWorldFont = Math.max(8, Math.round((startState.worldFont || 16) * scale));
          wrap.dataset.worldFont = String(newWorldFont);

          // Apply transform-based visual update
          this._applyWorldToScreen(wrap);
          this._positionToolbarForWrap(wrap);
          this._showActionButtonsForWrap(wrap);
        },
        end: () => {
          // restore editor toolbar after resize
          this._showEditorToolbar(wrap);
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 90, height: 30 },
        }),
      ],
      inertia: false,
    });

    // Draggable - configured AFTER resizable so edges take priority
    interact(wrap).draggable({
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;

          // END any active editing session before dragging
          if (this._editingId != null) {
            this._endEditing(this._editingId);
          }
          wrap.dataset.autoResize = "false";

          // ensure selection state after drag start
          this._selectText(wrap);

          startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
          startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);

          // hide editor while dragging
          this._hideEditorToolbar();
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;

          const t = this._getTransform();

          // Convert screen delta to world delta, accounting for current scale
          const worldDx = (evt.dx || 0) / t.k;
          const worldDy = (evt.dy || 0) / t.k;

          const newWorldLeft = parseFloat(wrap.dataset.worldLeft || 0) + worldDx;
          const newWorldTop = parseFloat(wrap.dataset.worldTop || 0) + worldDy;

          wrap.dataset.worldLeft = String(newWorldLeft);
          wrap.dataset.worldTop = String(newWorldTop);

          this._applyWorldToScreen(wrap);
          this._positionToolbarForWrap(wrap);
          this._showActionButtonsForWrap(wrap);
        },
        end: () => {
          if (this._activeDrag && this._activeDrag.id === id) {
            this._activeDrag = null;
          }
          // restore editor toolbar after drag (wrap is selected)
          this._showEditorToolbar(wrap);
        },
      },
      inertia: false,
    });
  }

  /*** Handle finishing editing explicitly (can be called by focusout or programmatically) ***/
  _endEditing(wrapOrId) {
    let wrap = null;
    if (!wrapOrId) {
      if (this._editingId != null) {
        const it = this.items.get(this._editingId);
        if (it) wrap = it.wrap;
      }
    } else if (typeof wrapOrId === "number" || typeof wrapOrId === "string") {
      const it = this.items.get(Number(wrapOrId));
      if (it) wrap = it.wrap;
    } else if (wrapOrId && wrapOrId.nodeType === Node.ELEMENT_NODE) {
      wrap = wrapOrId;
    }

    if (!wrap) return;

    const content = wrap.querySelector(".content");
    if (content) {
      content.contentEditable = "false";
      try {
        content.blur();
      } catch (err) {}
      content.style.border = "2px solid transparent";
    }

    // remove editing flag
    wrap.classList.remove("editing");
    if (this._editingId != null) {
      const maybe = Number(wrap.dataset.id);
      if (maybe === this._editingId) this._editingId = null;
    }

    // After ending editing, return to selection mode: ensure wrap is selected, handles visible and action toolbar shown.
    wrap.classList.add("show-handles");
    this._applyWorldToScreen(wrap);
    this._selectText(wrap);
  }

  /**
   * Show editor toolbar (used for both selection and editing)
   */
  _showEditorToolbar(wrap) {
    const toolbarEl = document.getElementById("whiteboardTextEditorContainer");
    if (toolbarEl) {
      try {
        toolbarEl.classList.remove(HIDDEN);
      } catch (err) {}
      this._positionToolbarForWrap(wrap);
    }
  }

  /**
   * Hide editor toolbar (does not alter selection state)
   */
  _hideEditorToolbar() {
    const toolbarEl = document.getElementById("whiteboardTextEditorContainer");
    if (toolbarEl) {
      try {
        toolbarEl.classList.add(HIDDEN);
      } catch (err) {}
    }
  }

  /* -----------------------
     Convenience / editing
     ----------------------- */
  startEditing(id) {
    const item = this.items.get(id);
    if (!item) return;
    const { wrap, content } = item;
    if (wrap.dataset.locked === "true") return;

    // mark editing state
    wrap.classList.add("editing");
    wrap.classList.add("show-handles"); // keep show-handles semantic but handles will be hidden while editing
    content.contentEditable = "true";
    content.focus();
    this._editingId = id;

    // caret to end
    const range = document.createRange();
    range.selectNodeContents(content);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    // ensure editor toolbar visible
    this._showEditorToolbar(wrap);
  }

  isEditing() {
    return this._editingId != null;
  }

  /* -----------------------
     Fallback pointer handlers (if interact not present)
     ----------------------- */
  _onDocPointerMove(ev) {
    const t = this._getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    if (this._activeDrag) {
      const { id, startWorld, startLeftTop } = this._activeDrag;
      const item = this.items.get(id);
      if (!item) return;
      const { wrap } = item;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      const newWorldLeft = startLeftTop.left + dx;
      const newWorldTop = startLeftTop.top + dy;

      wrap.dataset.worldLeft = String(newWorldLeft);
      wrap.dataset.worldTop = String(newWorldTop);

      this._applyWorldToScreen(wrap);

      // keep toolbar following
      if (window.app && typeof window.app._scheduleToolbarReposition === "function") {
        window.app._scheduleToolbarReposition();
      }
    }
  }

  _onDocPointerUp(ev) {
    if (this._activeDrag) this._activeDrag = null;
    if (this._activeResize) this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);

    // restore editor toolbar for selected item (if any)
    const sel = document.querySelector(".text-item.show-handles");
    if (sel) this._showEditorToolbar(sel);
    else this._hideEditorToolbar();
  }

  updateEditorToolbarPosition() {
    // keep toolbar positioned for current editing or selected item
    if (this._editingId != null) {
      const item = this.items.get(this._editingId);
      if (!item) return;
      this._positionToolbarForWrap(item.wrap);
      return;
    }
    const selectedWrap = document.querySelector(".text-item.show-handles");
    if (selectedWrap) this._positionToolbarForWrap(selectedWrap);
  }

  _positionToolbarForWrap(wrap) {
    const toolbar = document.getElementById("whiteboardTextEditorContainer");
    const viewport = document.getElementById("viewport");
    if (!toolbar || !viewport || !wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    const vpRect = viewport.getBoundingClientRect();
    const gap = 10;
    const centerXClient = wrapRect.left + wrapRect.width / 2;
    let topClient = wrapRect.top - (toolbar.offsetHeight || 40) - gap;
    if (topClient < 6) topClient = wrapRect.bottom + gap;

    // If toolbar is a child of body use fixed client coords,
    // otherwise position it absolute inside the viewport using viewport-relative coords
    if (toolbar.parentElement === document.body) {
      toolbar.style.position = "fixed";
      toolbar.style.left = Math.round(centerXClient) + "px";
      toolbar.style.top = Math.round(topClient) + "px";
      toolbar.style.transform = "translateX(-50%)";
      toolbar.style.zIndex = "100";
    } else {
      // positioned inside viewport: compute relative coords
      toolbar.style.position = "absolute";
      toolbar.style.left = Math.round(centerXClient - vpRect.left) + "px";
      toolbar.style.top = Math.round(topClient - vpRect.top) + "px";
      toolbar.style.transform = "translateX(-50%)";
      toolbar.style.zIndex = "100";
    }
  }

  /* -----------------------
     Removal / serialization
     ----------------------- */
  remove(id) {
    const it = this.items.get(id);
    if (!it) return;

    // Record deletion for undo/redo before removing
    if (typeof HistoryManager !== "undefined") {
      const worldLeft = parseFloat(it.wrap.dataset.worldLeft) || 0;
      const worldTop = parseFloat(it.wrap.dataset.worldTop) || 0;
      const text = it.content.innerHTML;
      const fontSize = it.content.style.fontSize;
      const width = it.wrap.style.width;

      HistoryManager.recordOperation("delete", "texts", "remove", {
        id,
        x: worldLeft,
        y: worldTop,
        text,
        style: {
          width,
          fontSize,
        },
      });
    }

    it.wrap.remove();
    this.items.delete(id);

    if (this._editingId === id) this._editingId = null;
    if (!document.querySelector(".text-item.show-handles")) {
      // this._hideActionButtons();
      this._hideEditorToolbar();
    }
  }

  serialize(id) {
    const it = this.items.get(id);
    if (!it) return null;
    return {
      id,
      left: parseFloat(it.wrap.dataset.worldLeft || 0),
      top: parseFloat(it.wrap.dataset.worldTop || 0),
      width: parseFloat(it.wrap.dataset.worldWidth || it.wrap.offsetWidth),
      height: parseFloat(it.wrap.dataset.worldHeight || 100),
      font: parseFloat(it.wrap.dataset.worldFont || 16),
      html: it.content.innerHTML,
      locked: it.wrap.dataset.locked === "true",
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left, data.top, data.html);
    const item = this.items.get(id);
    if (!item) return id;
    const { wrap, content } = item;

    wrap.dataset.worldWidth = data.width || wrap.dataset.worldWidth;
    wrap.dataset.worldHeight = data.height || wrap.dataset.worldHeight;
    wrap.dataset.worldFont = data.font || wrap.dataset.worldFont;

    // recalc screen representation
    this._applyWorldToScreen(wrap);

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
    }
    return id;
  }

  /* -----------------------
     Selection toolbar event
     ----------------------- */
  _showActionButtonsForWrap(wrap) {
    if (!wrap) return;
    // If the wrap is editing, hide the selection toolbar (global actions)
    if (wrap.classList.contains("editing")) {
      // this._hideActionButtons();
      return;
    }

    const id = Number(wrap.dataset.id);
    const locked = wrap.dataset.locked === "true";

    // Decide whether action toolbar should prefer bottom while editing (not used while editing)
    let preferBottom = false;
    const preferAttr = "bottom" || wrap.dataset.toolbarPrefer; // optional: "top"|"bottom"|"auto"
    if (preferAttr === "bottom") preferBottom = true;
    else if (preferAttr === "top") preferBottom = false;
    else preferBottom = wrap.classList.contains("editing"); // default: prefer bottom while editing

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "text", id, locked, preferBottom },
      })
    );
  }

  _hideActionButtons() {
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }
}
