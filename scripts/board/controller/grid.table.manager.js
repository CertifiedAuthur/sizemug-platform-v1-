class GridSelectorManager {
  /**
   * @param {HTMLElement} referenceEl - element to anchor popup to (e.g. toolbar button)
   * @param {(rows:number, cols:number)=>void} onGridSelect
   * @param {Object=} opts - optional settings
   */
  constructor(referenceEl, onGridSelect, opts = {}) {
    this.referenceEl = referenceEl; // anchor element
    this.onGridSelect = onGridSelect;
    this.selectorElement = null;
    this.popper = null;
    this.maxRows = opts.maxRows || 10;
    this.maxCols = opts.maxCols || 10;
    this.currentHoverRows = 0;
    this.currentHoverCols = 0;
    this._initSelector();
    this._bindEvents();
  }

  _initSelector() {
    // Create the popup element (but append to body to avoid clipping)
    this.selectorElement = document.createElement("div");
    this.selectorElement.className = `grid-selector-popup ${HIDDEN}`;
    this.selectorElement.id = "gridSelectorPopup";
    this.selectorElement.style.cssText = `
      position: absolute; /* Popper will manage transforms/placement */
      background: white;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 2147483647; /* very high so it sits on top */
      pointer-events: auto;
      min-width: 100px;
    `;

    // Title
    const title = document.createElement("div");
    title.className = "grid-size-title";
    title.textContent = "Insert Table";
    title.style.cssText = `
      text-align: center; font-size: 12px; color: #000; font-weight:700;
      border-bottom: 1px solid #e5e7eb; padding: 8px 0;
    `;

    // Grid preview container (use CSS grid but don't rely on parent's overflow)
    const gridPreview = document.createElement("div");
    gridPreview.className = "grid-preview";
    gridPreview.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.maxCols}, 24px);
      grid-auto-rows: 24px;
      padding: 8px;
      max-width: ${this.maxCols * 28}px;
    `;

    // Create cells
    for (let row = 0; row < this.maxRows; row++) {
      for (let col = 0; col < this.maxCols; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.style.cssText = `
          width: 20px; height: 20px; border: 1px solid #e5e7eb;
          border-radius: 2px; cursor: pointer; transition: background-color 0.08s;
        `;
        gridPreview.appendChild(cell);
      }
    }

    const label = document.createElement("div");
    label.className = "grid-size-label";
    label.textContent = "0 × 0";
    label.style.cssText = `
      text-align: center; font-size:12px; font-weight:700; color:#8837e9;
      border-top:1px solid #e5e7eb; padding:8px 0;
    `;

    this.selectorElement.appendChild(title);
    this.selectorElement.appendChild(gridPreview);
    this.selectorElement.appendChild(label);

    // IMPORTANT: append to body (escape clipping)
    document.body.appendChild(this.selectorElement);

    // Store refs for later
    this._gridPreview = gridPreview;
    this._label = label;

    // Create Popper instance if we have referenceEl
    if (this.referenceEl) this._createPopper();
  }

  _createPopper() {
    // if already created, destroy first
    if (this.popper) {
      try {
        this.popper.destroy();
      } catch (e) {}
      this.popper = null;
    }

    // Using UMD CDN: window.Popper.createPopper
    const createPopperFn = typeof createPopper !== "undefined" ? createPopper : window.Popper && window.Popper.createPopper ? window.Popper.createPopper : null;

    if (!createPopperFn) {
      console.warn("Popper not found. Include @popperjs/core (import or CDN).");
      return;
    }

    this.popper = createPopperFn(this.referenceEl, this.selectorElement, {
      placement: "bottom",
      modifiers: [
        // lift popup slightly from the button
        { name: "offset", options: { offset: [0, 8] } },

        // keep popup inside viewport
        { name: "preventOverflow", options: { boundary: "viewport", padding: 8 } },

        // allow flipping when there's no space below
        { name: "flip", options: { fallbackPlacements: ["top", "right", "left"] } },

        // Keep transform-origin aligned to where popper is placed
        {
          name: "updateTransformOrigin",
          enabled: true,
          phase: "write",
          fn: ({ state }) => {
            const placement = state.placement || "";
            // When popper is below the reference, origin should be top center.
            // When popper flips above the reference, origin should be bottom center.
            this.selectorElement.style.transformOrigin = placement.startsWith("top") ? "bottom center" : "top center";
          },
        },

        // adaptive compute styles (Popper default is fine)
        { name: "computeStyles", options: { adaptive: true } },
      ],
    });
  }

  _bindEvents() {
    // mouse move over grid preview => highlight cells
    this._gridPreview.addEventListener("mousemove", (e) => {
      const cell = e.target.closest(".grid-cell");
      if (!cell) return;
      const row = parseInt(cell.dataset.row, 10);
      const col = parseInt(cell.dataset.col, 10);
      if (row === this.currentHoverRows && col === this.currentHoverCols) return;
      this.currentHoverRows = row;
      this.currentHoverCols = col;
      this._highlightCells(row, col);
      this._updateLabel(row + 1, col + 1);
    });

    // click selects and hides
    this._gridPreview.addEventListener("click", (e) => {
      const cell = e.target.closest(".grid-cell");
      if (!cell) return;
      const rows = parseInt(cell.dataset.row, 10) + 1;
      const cols = parseInt(cell.dataset.col, 10) + 1;
      this.onGridSelect && this.onGridSelect(rows, cols);
      this.hide();
    });

    // hide when clicking outside
    document.addEventListener(
      "mousedown",
      (this._onDocMouseDown = (e) => {
        if (!this.selectorElement.contains(e.target) && !this.referenceEl.contains(e.target)) {
          this.hide();
        }
      })
    );

    // cleanup on window resize so popper can recompute
    window.addEventListener(
      "resize",
      (this._onWindowResize = () => {
        if (this.popper) this.popper.update();
      })
    );

    window.addEventListener(
      "scroll",
      (this._onWindowScroll = () => {
        if (this.popper) this.popper.update();
      }),
      true
    ); // capture scroll on ancestors

    // Outclick
    document.addEventListener("click", (e) => {
      if (!this.selectorElement.classList.contains(HIDDEN) && !e.target.closest(".grid-selector-popup")) {
        this.hide();
      }
    });

    // ESC KEY
    document.addEventListener("keydown", (e) => {
      if (!this.selectorElement.classList.contains(HIDDEN)) {
        this.hide();
      }
    });
  }

  _highlightCells(rowIdx, colIdx) {
    // highlight 0..rowIdx and 0..colIdx
    const cells = this.selectorElement.querySelectorAll(".grid-cell");
    cells.forEach((c) => {
      const r = parseInt(c.dataset.row, 10);
      const co = parseInt(c.dataset.col, 10);
      // c.style.background = "transparent";

      if (r <= rowIdx && co <= colIdx) {
        c.style.border = "1px solid #8837e9";
      } else {
        c.style.border = "1px solid #e5e7eb";
      }
    });
  }

  _updateLabel(rows, cols) {
    this._label.textContent = `${rows} × ${cols}`;
  }

  // Show popup
  show() {
    this.selectorElement.classList.remove(HIDDEN);
    // ensure popper exists
    if (!this.popper && this.referenceEl) this._createPopper();
    // popper needs update after visible
    if (this.popper) this.popper.update();
  }

  // Hide popup
  hide() {
    this.selectorElement.classList.add(HIDDEN);
  }

  // Change anchor at runtime
  setReference(referenceEl) {
    this.referenceEl = referenceEl;
    if (this.popper) {
      try {
        this.popper.destroy();
      } catch (e) {}
      this.popper = null;
    }
    if (this.referenceEl) this._createPopper();
  }

  destroy() {
    if (this.popper) {
      try {
        this.popper.destroy();
      } catch (e) {}
      this.popper = null;
    }
    this.selectorElement.remove();
    document.removeEventListener("mousedown", this._onDocMouseDown);
    window.removeEventListener("resize", this._onWindowResize);
    window.removeEventListener("scroll", this._onWindowScroll, true);
  }
}

/**
 * GridTableManager
 * Manages grid tables on the whiteboard - similar to CardManager
 * Handles creation, positioning, resizing, editing, and interaction
 */
class GridTableManager {
  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // Fallback for HIDDEN constant
    this._HIDDEN = typeof HIDDEN !== "undefined" ? HIDDEN : HIDDEN;

    // Grid storage and state
    this.counter = 0;
    this.items = new Map(); // id -> { id, wrap, cells, handles }

    // Interaction state
    this._activeDrag = null;
    this._activeResize = null;
    this.currentSelectedGridId = null;
    this.currentEditingCellId = null;

    // Bind the document click handler
    // this._onDocumentClick = this._onDocumentClick.bind(this);
    // document.addEventListener("click", this._onDocumentClick, true);

    // Tool state
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "select";

    // Default grid properties
    this.defaults = {
      cellWidth: 100,
      cellHeight: 60,
      minCellWidth: 60,
      minCellHeight: 40,
      borderColor: "#B4B9C4",
      cellBorderColor: "#B4B9C4",
      backgroundColor: "#8837E910",
      fontSize: 8,
      headerBgColor: "#e8e5ff",
      marginGap: 20,
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

    this._gridEditorEl = document.getElementById("whiteboardEditorWrapperGrid");

    // Initialize Interact.js support
    this._initializeInteract();

    // Listen for stage clicks to clear selections (use capture phase to ensure it fires)
    this.stage.addEventListener("pointerdown", this._onStagePointerDown, true);

    // Initialize Grid Selector and Editor Controls
    this._initGridSelector();
    this._initEditorControls();
  }

  _initEditorControls() {
    // Background color picker
    const bgColorPicker = document.getElementById("colorPickerContainerGridBackground");
    if (bgColorPicker) {
      const colorInput = bgColorPicker.querySelector('input[type="color"]');
      const currentColor = bgColorPicker.querySelector(".current_picker_color");

      if (colorInput && currentColor) {
        // Click handler to open color picker
        bgColorPicker.addEventListener("click", (e) => {
          e.stopPropagation();
          colorInput.click();
        });

        // Change handler for color selection (real-time updates)
        colorInput.addEventListener("input", (e) => {
          const color = e.target.value;
          currentColor.style.background = color;
          if (this.currentSelectedGridId) {
            const item = this.items.get(this.currentSelectedGridId);
            if (item && item.wrap) {
              item.wrap.style.backgroundColor = color + "40"; // Add 10% opacity
            }
          }
        });

        // Final color selection
        colorInput.addEventListener("change", (e) => {
          const color = e.target.value;
          currentColor.style.background = color;
          if (this.currentSelectedGridId) {
            const item = this.items.get(this.currentSelectedGridId);
            if (item && item.wrap) {
              item.wrap.style.backgroundColor = color + "10"; // Add 10% opacity
            }
          }
        });
      }
    }

    // Border color picker
    const borderColorPicker = document.getElementById("colorPickerContainerGridBorderColor");
    if (borderColorPicker) {
      const colorInput = borderColorPicker.querySelector('input[type="color"]');
      const currentColor = borderColorPicker.querySelector(".current_picker_color");

      if (colorInput && currentColor) {
        // Click handler to open color picker
        borderColorPicker.addEventListener("click", (e) => {
          e.stopPropagation();
          colorInput.click();
        });

        // Change handler for color selection (real-time updates)
        colorInput.addEventListener("input", (e) => {
          const color = e.target.value;
          currentColor.style.borderColor = color;
          if (this.currentSelectedGridId) {
            const item = this.items.get(this.currentSelectedGridId);
            if (item && item.cells) {
              item.cells.forEach((cell) => {
                cell.style.borderColor = color;
              });
            }
          }
        });

        // Final color selection
        colorInput.addEventListener("change", (e) => {
          const color = e.target.value;
          currentColor.style.borderColor = color;
          if (this.currentSelectedGridId) {
            const item = this.items.get(this.currentSelectedGridId);
            if (item && item.cells) {
              item.cells.forEach((cell) => {
                cell.style.borderColor = color;
              });
            }
          }
        });
      }
    }

    // Add row button
    const addRowBtn = document.getElementById("addRowToGrid");
    if (addRowBtn) {
      addRowBtn.addEventListener("click", () => {
        if (this.currentSelectedGridId) {
          const item = this.items.get(this.currentSelectedGridId);
          if (item && item.wrap) {
            this._addRowBottom(item.wrap);
          }
        }
      });
    }

    // Remove row button
    const removeRowBtn = document.getElementById("removeRowFromGrid");
    if (removeRowBtn) {
      removeRowBtn.addEventListener("click", () => {
        if (this.currentSelectedGridId) {
          const item = this.items.get(this.currentSelectedGridId);
          if (item && item.wrap) {
            const contents = this._readCellContents(item.wrap);
            if (contents.length > 1) {
              // Don't remove if only one row left
              contents.pop(); // Remove last row
              this._rebuildGridFromContents(item.wrap, contents);
            }
          }
        }
      });
    }

    // Dropdown menu actions
    const dropdownBtn = document.getElementById("dropDownMenuForGridCard");
    if (dropdownBtn) {
      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest("#dropDownMenuForGridCard") && !e.target.closest(".editor_dropdown_menu")) {
          const menu = dropdownBtn.closest(".dropdown_menu_wrapper").querySelector(".editor_dropdown_menu");
          if (menu && !menu.classList.contains("board--hidden")) {
            menu.classList.add("board--hidden");
          }
        }
      });

      // Toggle dropdown on button click
      dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = dropdownBtn.closest(".dropdown_menu_wrapper").querySelector(".editor_dropdown_menu");
        if (menu) {
          menu.classList.toggle("board--hidden");
        }
      });

      // Get the dropdown wrapper (contains both button and menu)
      const dropdownWrapper = dropdownBtn.closest(".dropdown_menu_wrapper");

      // Duplicate action
      const duplicateBtn = dropdownWrapper.querySelector(".duplicateTheFlipCard");
      if (duplicateBtn) {
        duplicateBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.currentSelectedGridId) {
            this.duplicateGrid(this.currentSelectedGridId);
            // Hide the dropdown after action
            const menu = dropdownWrapper.querySelector(".editor_dropdown_menu");
            menu.classList.add("board--hidden");
          }
        });
      }

      // Lock action
      const lockBtn = dropdownWrapper.querySelector(".lockFlipCard");
      if (lockBtn) {
        lockBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.currentSelectedGridId) {
            this.toggleLockById(this.currentSelectedGridId);
            // Hide the dropdown after action
            const menu = dropdownWrapper.querySelector(".editor_dropdown_menu");
            menu.classList.add("board--hidden");
          }
        });
      }

      // Delete action
      const deleteBtn = dropdownWrapper.querySelector(".deleteFlipCard");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (this.currentSelectedGridId) {
            // Hide grid editor toolbar before deleting
            this._hideGridEditorWrapper();
            this.deleteById(this.currentSelectedGridId);
            // Menu will be removed with the grid, no need to hide it
          }
        });
      }
    }
  }

  _initGridSelector() {
    const toolbarBtn = document.getElementById("dynamicToolBar");

    // create the selector anchored to the toolbar button
    const manager = new GridSelectorManager(toolbarBtn, (rows, cols) => {
      try {
        // compute viewport center in client coordinates
        const viewport = this.app && this.app.viewportNode ? this.app.viewportNode : document.getElementById("viewport") || document.body;
        const vpRect = viewport.getBoundingClientRect();
        const centerClientX = vpRect.left + vpRect.width / 2;
        const centerClientY = vpRect.top + vpRect.height / 2;

        // convert client to world using existing transform (inverse of screen = world*k + t)
        const t = this.getTransform();
        const worldCenterX = (centerClientX - t.x) / t.k;
        const worldCenterY = (centerClientY - t.y) / t.k;

        // compute world size of the new table (cols * cellWidth, rows * cellHeight)
        const totalWidthWorld = cols * this.defaults.cellWidth;
        const totalHeightWorld = rows * this.defaults.cellHeight;

        // top-left world coords so the table is centered on viewport center
        const worldLeft = worldCenterX - totalWidthWorld / 2;
        const worldTop = worldCenterY - totalHeightWorld / 2;

        // create the grid and immediately select it
        const newId = this.create(worldLeft, worldTop, rows, cols);
        const newItem = this.items.get(newId);
        if (newItem) {
          // ensure screen transform applied and editor positioned
          this._applyWorldToScreen(newItem.wrap);
          this._selectGrid(newItem.wrap);

          // force editor toolbar reposition (in case layout changed)
          if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
            this._positionGridEditorWrapper(newItem.wrap);
          }
        }

        // hide the selector popup after selection
        if (typeof manager.hide === "function") manager.hide();
      } catch (err) {
        console.error("Failed to create centered grid:", err);
      }
    });

    // show popup when button clicked
    toolbarBtn.addEventListener("click", (e) => {
      manager.show();
    });

    // store the selector if you want to access it later (optional)
    this.gridSelector = manager;
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("GridTableManager: Interact.js library not found. Resize/drag will use fallback handlers.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "grid") {
      this.setActive(true);
      this.drawingEnabled = true;
    } else if (tool === "select") {
      this.setActive(true);
      this.drawingEnabled = false;
    }
  }

  setActive(on) {
    this.active = !!on;
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
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 300);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 200);
    const baseWidth = parseFloat(wrap.dataset.baseWidth || 300);
    const baseHeight = parseFloat(wrap.dataset.baseHeight || 200);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    const scaleX = (worldWidth * t.k) / baseWidth;
    const scaleY = (worldHeight * t.k) / baseHeight;

    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    wrap.style.width = baseWidth + "px";
    wrap.style.height = baseHeight + "px";

    wrap.style.transform = `scale(${scaleX}, ${scaleY})`;
    wrap.style.transformOrigin = "0 0";

    // keep floating text editor aligned if we're editing a cell inside this wrap
    if (this._editingCell && wrap && wrap.contains && wrap.contains(this._editingCell)) {
      this._positionFloatingEditor(this._editingCell);
    }
  }

  _positionGridEditorWrapper(wrap = null) {
    const editor = this._gridEditorEl;
    const viewport = this.app && this.app.viewportNode ? this.app.viewportNode : document.getElementById("viewport");

    if (!editor || !viewport) return;

    const gap = 8;
    let left, top;

    if (wrap) {
      const vpRect = viewport.getBoundingClientRect();
      const vpScrollLeft = viewport.scrollLeft || 0;
      const vpScrollTop = viewport.scrollTop || 0;

      const wrapRect = wrap.getBoundingClientRect();

      const gridLeft = wrapRect.left - vpRect.left + vpScrollLeft;
      const gridTop = wrapRect.top - vpRect.top + vpScrollTop;
      const gridWidth = wrapRect.width;

      left = gridLeft + gridWidth / 2 - editor.offsetWidth / 2;
      const candidateTop = gridTop - editor.offsetHeight - gap;

      const minTop = gap + vpScrollTop;
      const maxLeft = viewport.clientWidth - editor.offsetWidth - gap;

      if (candidateTop >= minTop) {
        top = candidateTop;
      } else {
        top = minTop;
      }

      left = Math.max(gap, Math.min(left, maxLeft));
    } else {
      const vpScrollLeft = viewport.scrollLeft || 0;
      const vpScrollTop = viewport.scrollTop || 0;
      left = viewport.clientWidth / 2 - editor.offsetWidth / 2 + vpScrollLeft;
      top = gap + vpScrollTop;
    }

    editor.style.left = `${Math.round(left)}px`;
    editor.style.top = `${Math.round(top) - 30}px`;

    // also update floating editor if the editing cell is inside the wrapped grid
    if (wrap && this._editingCell && wrap.contains(this._editingCell)) {
      this._positionFloatingEditor(this._editingCell);
    }

    // Update action toolbar position
    if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
      this.app._scheduleToolbarReposition();
    }
  }

  _showGridEditorWrapper(wrap) {
    if (!this._gridEditorEl) return;
    this._gridEditorEl.classList.remove(this._HIDDEN);
    this._positionGridEditorWrapper(wrap);
  }

  _hideGridEditorWrapper() {
    if (this._gridEditorEl) {
      this._gridEditorEl.classList.add(this._HIDDEN);
    }
  }

  _readCellContents(wrap) {
    // returns 2D array [row][col] of text content
    const rows = parseInt(wrap.dataset.rows, 10);
    const cols = parseInt(wrap.dataset.cols, 10);
    const grid = Array.from({ length: rows }, () => Array(cols).fill(""));

    const cells = Array.from(wrap.querySelectorAll(".grid-cell"));
    cells.forEach((c) => {
      const r = parseInt(c.dataset.row, 10);
      const co = parseInt(c.dataset.col, 10);
      if (r >= 0 && r < rows && co >= 0 && co < cols) {
        grid[r][co] = c.textContent || "";
      }
    });
    return grid;
  }

  _rebuildGridFromContents(wrap, contents) {
    // contents: 2D array [rows][cols]
    const rows = contents.length;
    const cols = contents[0] ? contents[0].length : 0;
    const id = parseInt(wrap.dataset.id, 10);

    // update metadata
    wrap.dataset.rows = String(rows);
    wrap.dataset.cols = String(cols);

    const totalWidth = cols * this.defaults.cellWidth;
    const totalHeight = rows * this.defaults.cellHeight;
    wrap.dataset.worldWidth = String(totalWidth);
    wrap.dataset.worldHeight = String(totalHeight);
    // Keep baseWidth consistent with base px layout
    wrap.dataset.baseWidth = String(totalWidth);
    wrap.dataset.baseHeight = String(totalHeight);

    // Remove old container and create new
    const oldContainer = wrap.querySelector(".grid-container");
    if (oldContainer) oldContainer.remove();

    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";
    gridContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    grid-template-rows: repeat(${rows}, 1fr);
    width: 100%;
    height: 100%;
    gap: 0;
  `;

    const newCells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.dataset.row = String(r);
        cell.dataset.col = String(c);
        cell.dataset.cellId = `${id}-${r}-${c}`;
        cell.contentEditable = "false";
        cell.style.cssText = `
        border: 1px solid ${this.defaults.cellBorderColor};
        padding: 4px;
        font-size: ${this.defaults.fontSize}px;
        outline: none;
        overflow: hidden;
        word-break: break-word;
        background: transparent;
        min-height: 100%;
        display: flex;
        align-items: center;
        cursor: text;
      `;
        if (r === 0) {
          cell.style.fontWeight = "600";
        }
        cell.textContent = contents[r] && contents[r][c] ? contents[r][c] : "";
        newCells.push(cell);
        gridContainer.appendChild(cell);
      }
    }

    // attach gridContainer back to wrap
    const handles = wrap.querySelector(".handles");
    const additionHandler = wrap.querySelector(".addition-handler");
    wrap.insertBefore(gridContainer, handles || null);

    // update items map reference
    const item = this.items.get(id);
    if (item) {
      item.gridContainer = gridContainer;
      item.cells = newCells;
    }

    // wire events for new cells
    this._wireGridEvents(wrap, id, newCells);

    // re-initialize interact (so resizable/draggable still works)
    if (this.interactAvailable) {
      try {
        interact(wrap).unset(); // clear old interact state
      } catch (e) {}
      this._initInteractOnGrid(wrap, id);
    }

    // apply transforms and reposition editor
    this._applyWorldToScreen(wrap);
    this._selectGrid(wrap);
    if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
      this._positionGridEditorWrapper(wrap);
    }
  }

  // --- Add row/col operations ---
  _addRowTop(wrap) {
    if (!wrap || wrap.dataset.locked === "true") return;
    const id = parseInt(wrap.dataset.id, 10);
    const old = this._readCellContents(wrap);
    const oldRows = old.length;
    const cols = old[0] ? old[0].length : 0;

    // new contents: insert an empty row at top
    const newContents = [Array(cols).fill("")].concat(old);

    // increase world/base height
    const added = this.defaults.cellHeight;
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 0) + added;
    const baseHeight = parseFloat(wrap.dataset.baseHeight || 0) + added;
    // shift worldTop up so visual top stays in same screen place (we added top row)
    const worldTop = parseFloat(wrap.dataset.worldTop || 0) - added;

    wrap.dataset.worldHeight = String(worldHeight);
    wrap.dataset.baseHeight = String(baseHeight);
    wrap.dataset.worldTop = String(worldTop);

    this._rebuildGridFromContents(wrap, newContents);
  }

  _addRowBottom(wrap) {
    if (!wrap || wrap.dataset.locked === "true") return;
    const old = this._readCellContents(wrap);
    const cols = old[0] ? old[0].length : 0;
    const newContents = old.concat([Array(cols).fill("")]);

    const added = this.defaults.cellHeight;
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 0) + added;
    const baseHeight = parseFloat(wrap.dataset.baseHeight || 0) + added;

    wrap.dataset.worldHeight = String(worldHeight);
    wrap.dataset.baseHeight = String(baseHeight);

    this._rebuildGridFromContents(wrap, newContents);
  }

  _addColLeft(wrap) {
    if (!wrap || wrap.dataset.locked === "true") return;
    const old = this._readCellContents(wrap);
    const rows = old.length;
    const newContents = old.map((row) => [""].concat(row)); // insert empty cell at left

    const added = this.defaults.cellWidth;
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 0) + added;
    const baseWidth = parseFloat(wrap.dataset.baseWidth || 0) + added;
    // shift worldLeft left so visual left stays same (we added a left col)
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0) - added;

    wrap.dataset.worldWidth = String(worldWidth);
    wrap.dataset.baseWidth = String(baseWidth);
    wrap.dataset.worldLeft = String(worldLeft);

    this._rebuildGridFromContents(wrap, newContents);
  }

  _addColRight(wrap) {
    if (!wrap || wrap.dataset.locked === "true") return;
    const old = this._readCellContents(wrap);
    const newContents = old.map((row) => row.concat([""]));

    const added = this.defaults.cellWidth;
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 0) + added;
    const baseWidth = parseFloat(wrap.dataset.baseWidth || 0) + added;

    wrap.dataset.worldWidth = String(worldWidth);
    wrap.dataset.baseWidth = String(baseWidth);

    this._rebuildGridFromContents(wrap, newContents);
  }

  // Editors Managers
  // Ensure we have the floating editor element (no contenteditable inside)
  _ensureFloatingTextEditor() {
    if (this._textEditorEl) return this._textEditorEl;
    this._textEditorEl = document.getElementById("whiteboardGridTextEditorContainer");
    if (!this._textEditorEl) {
      console.warn("Missing #whiteboardGridTextEditorContainer");
      return null;
    }

    // Append to body so it won't be clipped by overflow parents
    if (this._textEditorEl.parentElement !== document.body) {
      try {
        document.body.appendChild(this._textEditorEl);
      } catch (e) {}
    }

    // Prevent it stealing focus by default
    this._textEditorEl.setAttribute("tabindex", "-1");
    this._textEditorEl.style.pointerEvents = "auto";

    // Handle mousedown to prevent blur
    this._textEditorEl.addEventListener("mousedown", (ev) => {
      ev.preventDefault();
    });

    // Initialize color picker
    const colorPicker = this._textEditorEl.querySelector("#grid_color_picker_container");
    if (colorPicker) {
      const colorInput = colorPicker.querySelector('input[type="color"]');
      const currentColor = colorPicker.querySelector(".current_picker_color");

      if (colorInput && currentColor) {
        colorPicker.addEventListener("click", (e) => {
          e.stopPropagation();
          colorInput.click();
        });

        colorInput.addEventListener("input", (e) => {
          const color = e.target.value;
          currentColor.style.background = color;
          this._handleFloatingEditorAction("foreColor", color);
        });
      }
    }

    // Initialize font size dropdown
    const fontSizeSelect = this._textEditorEl.querySelector("#gridFontSizeSelect");
    if (fontSizeSelect) {
      const btn = fontSizeSelect.querySelector(".sg_custom_dropdown_btn");
      const dropdown = fontSizeSelect.querySelector(".sg_custom_dropdown");

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      dropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".sg_custom_dropdown_item");
        if (item) {
          const value = item.dataset.value;
          btn.textContent = item.textContent;
          this._handleFloatingEditorAction("fontSize", value);
          dropdown.classList.remove("show");
        }
      });
    }

    // Initialize format block dropdown
    const formatSelect = this._textEditorEl.querySelector("#gridFormatBlockSelect");
    if (formatSelect) {
      const btn = formatSelect.querySelector(".sg_custom_dropdown_btn");
      const dropdown = formatSelect.querySelector(".sg_custom_dropdown");

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      dropdown.addEventListener("click", (e) => {
        const item = e.target.closest(".sg_custom_dropdown_item");
        if (item) {
          const value = item.dataset.value;
          btn.textContent = item.textContent;
          this._handleFloatingEditorAction("formatBlock", value);
          dropdown.classList.remove("show");
        }
      });
    }

    // Handle formatting buttons
    const actionButtons = this._textEditorEl.querySelectorAll(".whiteboard_editor_action_btn");
    actionButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = btn.classList.contains("bold") ? "bold" : btn.classList.contains("italic") ? "italic" : btn.classList.contains("link") ? "link" : btn.classList.contains("text_transform--btn") ? "capitalize" : null;

        if (action) {
          this._handleFloatingEditorAction(action);
          // Toggle active state for formatting buttons
          if (["bold", "italic"].includes(action)) {
            btn.classList.toggle("active");
          }
        }

        if (this._editingCell) {
          requestAnimationFrame(() => {
            try {
              this._editingCell.focus();
            } catch (e) {}
          });
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      this._textEditorEl.querySelectorAll(".sg_custom_dropdown").forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    });

    return this._textEditorEl;
  }

  // Position the floating editor near the cell but NOT covering it.
  // This avoids blocking the caret while letting the toolbar sit visually over the cell area.
  _positionFloatingEditor(cell) {
    const el = this._ensureFloatingTextEditor();
    if (!el || !cell) return;

    const rect = cell.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Prefer placing above the cell; if not enough space, place below.
    const editorW = el.offsetWidth || 200;
    const editorH = el.offsetHeight || 36;
    const gap = 8;

    let left = rect.left + rect.width / 2 - editorW / 2;
    left = Math.max(gap, Math.min(left, vw - editorW - gap));

    // try above
    let top = rect.top - editorH - gap;
    if (top < gap) {
      // place below
      top = rect.bottom + gap;
    }

    // Use fixed positioning so it's viewport-aligned and won't be clipped
    el.style.position = "fixed";
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(top)}px`;
    // show
    el.classList.remove(this._HIDDEN);
  }

  // Show floating editor for a cell (do NOT change cell.contentEditable)
  _showFloatingEditorForCell(cell) {
    if (!cell) return;
    this._editingCell = cell; // track editing cell
    this._ensureFloatingTextEditor();

    // Hide grid toolbar and plus buttons while editing
    if (this._gridEditorEl) this._gridEditorEl.classList.add(this._HIDDEN);

    // Hide plus buttons (addition handlers) and resize handles while editing
    const wrap = cell.closest(".grid-table-item");
    if (wrap) {
      const additionHandler = wrap.querySelector(".addition-handler");
      if (additionHandler) {
        additionHandler.style.display = "none";
      }

      // Also hide resize handles during editing for cleaner UI
      const handles = wrap.querySelector(".handles");
      if (handles) {
        handles.style.display = "none";
      }
    }

    // position & show floating UI
    this._positionFloatingEditor(cell);

    // if you need to adjust visual state (e.g., show which column is active), do it here
    // but DON'T focus the floating UI — keep focus in the real contenteditable cell
    try {
      cell.focus();
    } catch (e) {}
  }

  // Hide floating editor and restore grid toolbar if grid still selected
  _hideFloatingEditor() {
    if (this._textEditorEl) this._textEditorEl.classList.add(this._HIDDEN);

    // restore toolbar, plus buttons, and resize handles if a grid is selected
    if (this.currentSelectedGridId != null) {
      const item = this.items.get(this.currentSelectedGridId);
      if (item && item.wrap) {
        // Show grid editor toolbar
        this._showGridEditorWrapper(item.wrap);

        // Show plus buttons again
        const additionHandler = item.wrap.querySelector(".addition-handler");
        if (additionHandler && item.wrap.dataset.locked !== "true") {
          additionHandler.style.display = "block";
        }

        // Show resize handles again
        const handles = item.wrap.querySelector(".handles");
        if (handles && item.wrap.dataset.locked !== "true") {
          handles.style.display = "block";
          handles.querySelectorAll(".resize-handle").forEach((h) => {
            h.style.opacity = "1";
            h.style.pointerEvents = "auto";
          });
        }
      }
    }
    this._editingCell = null;
  }

  // Handle toolbar button actions
  _handleFloatingEditorAction(action, value) {
    if (!this._editingCell) return;

    // Save current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    // Focus the cell to ensure commands work
    this._editingCell.focus();

    switch (action) {
      case "bold":
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("bold", false, null);
        break;
      case "italic":
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("italic", false, null);
        break;
      case "link":
        // Use the shared link modal handler
        if (typeof linkModalHandler !== "undefined") {
          const selection = window.getSelection();
          const selectedText = selection.toString().trim();
          const existingLink = this._getSelectedLink();

          if (existingLink) {
            // Edit existing link
            linkModalHandler.edit(existingLink.textContent, existingLink.href, ({ text, url }) => {
              existingLink.href = url;
              if (text !== existingLink.textContent) {
                existingLink.textContent = text;
              }
              this._editingCell.focus();
            });
          } else {
            // Create new link
            linkModalHandler.show({
              text: selectedText,
              onApply: ({ text, url }) => {
                const linkHtml = `<a href="${url}" target="_blank">${text || url}</a>`;
                document.execCommand("insertHTML", false, linkHtml);
                this._editingCell.focus();
              },
            });
          }
        }
        break;
      case "fontSize":
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("fontSize", false, value);
        // Also set direct CSS for better control
        if (selection.rangeCount > 0) {
          const span = document.createElement("span");
          span.style.fontSize = `${value}px`;
          range.surroundContents(span);
        }
        break;
      case "formatBlock":
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("formatBlock", false, value);
        break;
      case "foreColor":
        document.execCommand("styleWithCSS", false, true);
        document.execCommand("foreColor", false, value);
        break;
      case "capitalize":
        if (selection.rangeCount === 0) return;
        const text = range.toString();
        let newText;
        if (text === text.toLowerCase()) {
          newText = text.toUpperCase();
        } else if (text === text.toUpperCase()) {
          newText = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        } else {
          newText = text.toLowerCase();
        }

        const span = document.createElement("span");
        span.textContent = newText;
        range.deleteContents();
        range.insertNode(span);
        break;
    }

    // Restore focus to the cell if not using link modal
    if (action !== "link") {
      this._editingCell.focus();
    }
  }

  // Helper to get the currently selected link element if any
  _getSelectedLink() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    // Check if we're directly in a link
    if (container.nodeType === 1 && container.tagName === "A") {
      return container;
    }

    // Check if we're inside a link
    if (container.nodeType === 3) {
      const parent = container.parentElement;
      if (parent && parent.tagName === "A") {
        return parent;
      }
    }

    // Check if an ancestor is a link
    const closestLink = container.closest && container.closest("a");
    if (closestLink) {
      return closestLink;
    }

    return null;
  }

  // Editors Managers

  _getDimensionsFromWrap(wrap) {
    return {
      rows: parseInt(wrap.dataset.rows, 10),
      cols: parseInt(wrap.dataset.cols, 10),
    };
  }

  create(x, y, rows = 3, cols = 3) {
    const id = ++this.counter;

    // Calculate dimensions
    const totalWidth = cols * this.defaults.cellWidth;
    const totalHeight = rows * this.defaults.cellHeight;

    const wrap = document.createElement("div");
    wrap.className = "grid-table-item";
    wrap.dataset.id = String(id);
    wrap.dataset.rows = String(rows);
    wrap.dataset.cols = String(cols);

    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(totalWidth);
    wrap.dataset.worldHeight = String(totalHeight);
    wrap.dataset.baseWidth = String(totalWidth);
    wrap.dataset.baseHeight = String(totalHeight);
    wrap.dataset.locked = "false";

    wrap.style.boxSizing = "border-box";
    wrap.style.cursor = "move";
    wrap.style.userSelect = "none";
    wrap.style.width = totalWidth + "px";
    wrap.style.height = totalHeight + "px";
    wrap.style.transformOrigin = "0 0";
    wrap.style.touchAction = "none";
    wrap.style.pointerEvents = "auto";
    // wrap.style.border = `2px solid ${this.defaults.borderColor}`;
    wrap.style.borderRadius = "4px";
    wrap.style.overflow = HIDDEN;
    wrap.style.backgroundColor = this.defaults.backgroundColor;

    // Create grid container
    const gridContainer = document.createElement("div");
    gridContainer.className = "grid-container";
    gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${cols}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
            width: 100%;
            height: 100%;
            gap: 0;
          `;

    // Create cells
    const cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = document.createElement("div");
        cell.className = "grid-cell";
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);
        cell.dataset.cellId = `${id}-${row}-${col}`;
        cell.contentEditable = "false";

        cell.style.cssText = `
                border: 1px solid ${this.defaults.cellBorderColor};
                padding: 4px;
                font-size: ${this.defaults.fontSize}px;
                outline: none;
                overflow: hidden;
                word-break: break-word;
                background: transparent;
                min-height: 100%;
                display: flex;
                align-items: center;
                cursor: text;
              `;

        // First row cells have different background (header style)
        if (row === 0) {
          // cell.style.backgroundColor = this.defaults.headerBgColor;
          cell.style.fontWeight = "600";
        }

        cell.textContent = "";

        cells.push(cell);
        gridContainer.appendChild(cell);
      }
    }

    // Create resize handles
    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            display: none;
          `;

    ["nw", "ne", "sw", "se"].forEach((pos) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${pos}`;
      handle.dataset.handle = pos;
      this._positionHandle(handle, pos);
      handle.style.pointerEvents = "auto";

      // Fallback resize start
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
          startWorldWidth: parseFloat(wrap.dataset.worldWidth || totalWidth),
          startWorldHeight: parseFloat(wrap.dataset.worldHeight || totalHeight),
        };

        document.addEventListener("pointermove", this._onDocPointerMove);
        document.addEventListener("pointerup", this._onDocPointerUp);
      });

      handles.appendChild(handle);
    });

    // Create Add more
    const additionHandler = document.createElement("div");
    additionHandler.className = "addition-handler";
    additionHandler.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
            display: none;
          `;

    ["n", "s", "e", "w"].forEach((pos) => {
      const handler = document.createElement("button");
      handler.className = `add-handler add-handler-${pos}`;
      handler.dataset.handler = pos;
      handler.style.pointerEvents = "auto";

      if (pos === "n") {
        handler.style.top = `-${this.defaults.marginGap}px`;
        handler.style.left = "50%";
        handler.style.transform = "translateX(-50%)";
      } else if (pos === "s") {
        handler.style.bottom = `-${this.defaults.marginGap}px`;
        handler.style.left = "50%";
        handler.style.transform = "translateX(-50%)";
      } else if (pos === "e") {
        handler.style.top = "50%";
        handler.style.right = `-${this.defaults.marginGap}px`;
        handler.style.transform = "translateY(-50%)";
      } else if (pos === "w") {
        handler.style.top = "50%";
        handler.style.left = `-${this.defaults.marginGap}px`;
        handler.style.transform = "translateY(-50%)";
      }

      handler.insertAdjacentHTML("afterbegin", `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0"/></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0"/></path></g></svg>`);
      additionHandler.appendChild(handler);

      // attach the click behavior:
      handler.addEventListener("click", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        const wrapEl = wrap;
        if (!wrapEl) return;
        if (wrapEl.dataset.locked === "true") return;

        switch (pos) {
          case "n":
            this._addRowTop(wrapEl);
            break;
          case "s":
            this._addRowBottom(wrapEl);
            break;
          case "e":
            this._addColRight(wrapEl);
            break;
          case "w":
            this._addColLeft(wrapEl);
            break;
        }
      });
    });

    wrap.appendChild(gridContainer);
    wrap.appendChild(handles);
    wrap.appendChild(additionHandler);

    this.stage.appendChild(wrap);
    this.items.set(id, {
      id,
      wrap,
      gridContainer,
      cells,
      handles,
    });

    this._applyWorldToScreen(wrap);
    this._wireGridEvents(wrap, id, cells);
    this._initInteractOnGrid(wrap, id);

    return id;
  }

  _positionHandle(handle, position) {
    handle.style.cssText = `position: absolute; z-index: 10;`;

    switch (position) {
      case "nw":
        handle.style.left = "-5px";
        handle.style.top = "-5px";
        handle.style.cursor = "nw-resize";
        break;
      case "ne":
        handle.style.right = "-5px";
        handle.style.top = "-5px";
        handle.style.cursor = "ne-resize";
        break;
      case "sw":
        handle.style.left = "-5px";
        handle.style.bottom = "-5px";
        handle.style.cursor = "sw-resize";
        break;
      case "se":
        handle.style.right = "-5px";
        handle.style.bottom = "-5px";
        handle.style.cursor = "se-resize";
        break;
    }
  }

  _wireGridEvents(wrap, id, cells) {
    // Selection on click
    wrap.addEventListener("click", (e) => {
      e.stopPropagation();

      if (e.target.closest(".resize-handle")) return;

      // Check if clicking on a cell
      const clickedCell = e.target.closest(".grid-cell");
      if (clickedCell && document.activeElement === clickedCell) {
        return; // Already editing
      }

      this._selectGrid(wrap);
    });

    // Double-click to edit cell
    cells.forEach((cell) => {
      cell.addEventListener("dblclick", (e) => {
        e.stopPropagation();

        if (wrap.dataset.locked === "true") return;

        this._selectGrid(wrap);
        cell.setAttribute("contenteditable", "true");

        // focusing cell will trigger focusin and show floating editor
        try {
          cell.focus();
        } catch (e) {}
      });

      // Single click to edit if already selected
      cell.addEventListener("click", (e) => {
        e.stopPropagation();
        if (wrap.dataset.locked === "true") return;
        if (this.currentSelectedGridId === id) {
          // focus cell -> show floating editor
          try {
            cell.focus();
          } catch (e) {}
        } else {
          this._selectGrid(wrap);
        }
      });

      // Focus handlers
      cell.addEventListener("focusin", () => {
        // When cell gets focus (user starts typing), show floating editor and hide toolbar
        cell.setAttribute("contenteditable", "true");
        this._showFloatingEditorForCell(cell);
      });

      cell.addEventListener("focusout", (e) => {
        // Defer hide to allow toolbar clicks (mousedown prevented blur). Use rAF to avoid race.
        requestAnimationFrame(() => {
          // If focus moved back to this cell, keep editing
          if (document.activeElement === cell) {
            return;
          }

          // If focus moved to the floating editor toolbar, keep it open
          // (but this shouldn't happen since we preventDefault on mousedown)
          if (this._textEditorEl && this._textEditorEl.contains(document.activeElement)) {
            return;
          }

          // Otherwise, hide floating editor and show grid toolbar
          cell.setAttribute("contenteditable", "false");
          this._hideFloatingEditor();
        });
      });

      // Handle Escape key
      cell.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          cell.setAttribute("contenteditable", "false");
          cell.blur();
        }
        // Tab to next cell
        if (e.key === "Tab") {
          e.preventDefault();
          const nextCell = this._getAdjacentCell(cell, e.shiftKey ? -1 : 1);
          if (nextCell) {
            cell.setAttribute("contenteditable", "false");
            nextCell.setAttribute("contenteditable", "true");
            nextCell.focus();
          }
        }
      });
    });
  }

  _getAdjacentCell(currentCell, direction) {
    const row = parseInt(currentCell.dataset.row);
    const col = parseInt(currentCell.dataset.col);
    const item = this.items.get(this.currentSelectedGridId);

    if (!item) return null;

    const rows = parseInt(item.wrap.dataset.rows);
    const cols = parseInt(item.wrap.dataset.cols);

    let newCol = col + direction;
    let newRow = row;

    if (newCol >= cols) {
      newCol = 0;
      newRow++;
    } else if (newCol < 0) {
      newCol = cols - 1;
      newRow--;
    }

    if (newRow < 0 || newRow >= rows) return null;

    return item.cells.find((c) => parseInt(c.dataset.row) === newRow && parseInt(c.dataset.col) === newCol);
  }

  _selectGrid(wrap) {
    this.clearSelection();

    wrap.classList.add("show-handles");

    const handles = wrap.querySelector(".handles");
    if (handles) {
      handles.style.display = "block";
      handles.style.pointerEvents = "none";
      handles.querySelectorAll(".resize-handle").forEach((h) => {
        h.style.opacity = "1";
        h.style.pointerEvents = "auto";
      });
    }

    const additionHandler = wrap.querySelector(".addition-handler");
    if (additionHandler) {
      additionHandler.style.display = "block";
    }

    const id = parseInt(wrap.dataset.id);
    this.currentSelectedGridId = id;
    const locked = wrap.dataset.locked === "true";

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "grid", id, locked, preferBottom: true } }));

    // Only show grid editor if not currently editing a cell
    if (!this._editingCell) {
      this._showGridEditorWrapper(wrap);
    }
  }

  clearSelection() {
    this.currentSelectedGridId = null;
    this.currentEditingCellId = null;

    this._hideGridEditorWrapper();
    this._hideFloatingEditor();

    document.querySelectorAll(".grid-table-item.show-handles").forEach((grid) => {
      grid.classList.remove("show-handles");
      grid.style.boxShadow = "";

      const handles = grid.querySelector(".handles");
      if (handles) {
        handles.style.display = "none";
        handles.style.pointerEvents = "none";
        handles.querySelectorAll(".resize-handle").forEach((h) => {
          h.style.opacity = "0";
          h.style.pointerEvents = "none";
        });
      }

      const additionHandler = grid.querySelector(".addition-handler");
      if (additionHandler) {
        additionHandler.style.display = "none";
      }
    });

    // Blur any editing cells
    document.querySelectorAll(".grid-cell[contenteditable='true']").forEach((cell) => {
      cell.blur();
      cell.setAttribute("contenteditable", "false");
    });

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }

  _initInteractOnGrid(wrap, id) {
    if (!this.interactAvailable) return;

    interact(wrap)
      .draggable({
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectGrid(wrap);
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

            // Update grid editor toolbar position during drag
            if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
              this._positionGridEditorWrapper(wrap);
            }

            // keep floating editor aligned while dragging
            if (this._editingCell && wrap.contains(this._editingCell)) {
              this._positionFloatingEditor(this._editingCell);
            }
          },
          end: (event) => {
            // Update toolbar position after drag ends
            if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
              this._positionGridEditorWrapper(wrap);
            }
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectGrid(wrap);
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

            const rows = parseInt(wrap.dataset.rows);
            const cols = parseInt(wrap.dataset.cols);
            const minWidth = cols * this.defaults.minCellWidth;
            const minHeight = rows * this.defaults.minCellHeight;

            wrap.dataset.worldLeft = String(newWorldLeft);
            wrap.dataset.worldTop = String(newWorldTop);
            wrap.dataset.worldWidth = String(Math.max(minWidth, newWorldWidth));
            wrap.dataset.worldHeight = String(Math.max(minHeight, newWorldHeight));

            this._applyWorldToScreen(wrap);

            // Update grid editor toolbar position during resize
            if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
              this._positionGridEditorWrapper(wrap);
            }

            // keep floating editor aligned while resizing
            if (this._editingCell && wrap.contains(this._editingCell)) {
              this._positionFloatingEditor(this._editingCell);
            }
          },
          end: (event) => {
            // Update toolbar position after resize ends
            if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
              this._positionGridEditorWrapper(wrap);
            }
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 180, height: 120 },
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
      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      const newWorldLeft = startLeftTop.left + dx;
      const newWorldTop = startLeftTop.top + dy;

      wrap.dataset.worldLeft = String(newWorldLeft);
      wrap.dataset.worldTop = String(newWorldTop);

      this._applyWorldToScreen(wrap);

      if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
        this._positionGridEditorWrapper(wrap);
      }
    }

    if (this._activeResize) {
      const { id, handle, startPointerWorld, startWorldLeft, startWorldTop, startWorldWidth, startWorldHeight } = this._activeResize;
      const item = this.items.get(id);
      if (!item) return;
      const { wrap } = item;

      const dx = world.x - startPointerWorld.x;
      const dy = world.y - startPointerWorld.y;
      let newLeft = startWorldLeft;
      let newTop = startWorldTop;
      let newWidth = startWorldWidth;
      let newHeight = startWorldHeight;

      const rows = parseInt(wrap.dataset.rows);
      const cols = parseInt(wrap.dataset.cols);
      const minW = cols * this.defaults.minCellWidth;
      const minH = rows * this.defaults.minCellHeight;

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

      if (this._gridEditorEl && !this._gridEditorEl.classList.contains(this._HIDDEN)) {
        this._positionGridEditorWrapper(wrap);
      }
    }
  }

  _onDocPointerUp(e) {
    this._activeDrag = null;
    this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
  }

  _onStagePointerDown(e) {
    // Clear selection if clicking on stage or any non-grid element
    const clickedGrid = e.target.closest(".grid-table-item");
    const clickedGridSelector = e.target.closest(".grid-selector-popup");
    const clickedGridEditor = e.target.closest("#whiteboardEditorWrapperGrid");
    const clickedTextEditor = e.target.closest("#whiteboardGridTextEditorContainer");
    const clickedToolbar = e.target.closest("#sizemugBoardActionBtnsWrapper");

    // If clicking outside all grid-related UI, hide floating editor and clear selection
    if (!clickedGrid && !clickedGridSelector && !clickedGridEditor && !clickedTextEditor && !clickedToolbar) {
      // Hide floating editor if it's open
      if (this._editingCell) {
        this._editingCell.setAttribute("contenteditable", "false");
        this._editingCell.blur();
        this._hideFloatingEditor();
      }
      // Clear selection
      this.clearSelection();
      return;
    }

    // If clicking on grid but not on text editor or toolbar, handle cell focus changes
    if (clickedGrid && !clickedTextEditor && !clickedToolbar && this._editingCell) {
      // Check if we're clicking on a different cell
      const clickedCell = e.target.closest(".grid-cell");
      if (!clickedCell || clickedCell !== this._editingCell) {
        this._editingCell.setAttribute("contenteditable", "false");
        this._editingCell.blur();
        this._hideFloatingEditor();
      }
    }
  }

  _onPointerDown(e) {
    if (!this.active || !this.drawingEnabled) return;
    if (this.activeTool !== "grid") return;
    if (e.button && e.button !== 0) return;

    if (e.target.closest(".grid-table-item")) return;

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
    // Hide the text editor container during transform
    const textEditorEl = document.getElementById("whiteboardGridTextEditorContainer");
    if (textEditorEl) {
      textEditorEl.classList.add(this._HIDDEN);
    }

    for (const { wrap } of this.items.values()) {
      this._applyWorldToScreen(wrap);
    }

    if (this.currentSelectedGridId !== null) {
      const item = this.items.get(this.currentSelectedGridId);
      if (item) {
        this._positionGridEditorWrapper(item.wrap);
      }
    }

    // Restore text editor if we were editing a cell
    if (this._editingCell) {
      requestAnimationFrame(() => {
        if (textEditorEl && this._editingCell === document.activeElement) {
          textEditorEl.classList.remove(this._HIDDEN);
          this._positionFloatingEditor(this._editingCell);
        }
      });
    }
  }

  updateEditorToolbarPosition() {
    if (!this._gridEditorEl || this._gridEditorEl.classList.contains(this._HIDDEN)) return;

    const wrap = this.currentSelectedGridId != null && this.items.has(this.currentSelectedGridId) ? this.items.get(this.currentSelectedGridId).wrap : null;

    if (wrap) {
      this._positionGridEditorWrapper(wrap);
    }
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;

    // If we're removing the currently selected grid, hide the editor wrapper
    if (this.currentSelectedGridId === id) {
      this._hideGridEditorWrapper();
      this.currentSelectedGridId = null;
    }

    item.wrap.remove();
    this.items.delete(id);
  }

  duplicateGrid(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, cells } = item;

    const currentLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const currentTop = parseFloat(wrap.dataset.worldTop || 0);
    const currentWidth = parseFloat(wrap.dataset.worldWidth || 300);
    const currentHeight = parseFloat(wrap.dataset.worldHeight || 200);
    const rows = parseInt(wrap.dataset.rows);
    const cols = parseInt(wrap.dataset.cols);

    const offsetX = 20;
    const offsetY = 20;
    const newLeft = currentLeft + offsetX;
    const newTop = currentTop + offsetY;

    const newId = this.create(newLeft, newTop, rows, cols);
    const newItem = this.items.get(newId);

    if (!newItem) return null;

    const { wrap: newWrap, cells: newCells } = newItem;

    newWrap.dataset.worldWidth = String(currentWidth);
    newWrap.dataset.worldHeight = String(currentHeight);
    newWrap.dataset.baseWidth = wrap.dataset.baseWidth;
    newWrap.dataset.baseHeight = wrap.dataset.baseHeight;

    // Copy cell contents
    cells.forEach((cell, index) => {
      if (newCells[index]) {
        newCells[index].textContent = cell.textContent;
      }
    });

    this._applyWorldToScreen(newWrap);
    this._selectGrid(newWrap);

    window.dispatchEvent(new CustomEvent("grid-duplicated", { detail: { originalId: id, newId: newId } }));

    return newId;
  }

  lockUnlockGrid(id) {
    const item = this.items.get(id);
    if (!item) return false;

    const { wrap } = item;
    const isCurrentlyLocked = wrap.dataset.locked === "true";
    const newLockedState = !isCurrentlyLocked;

    wrap.dataset.locked = String(newLockedState);

    if (newLockedState) {
      wrap.classList.add("locked");
      wrap.style.cursor = "default";

      const handles = wrap.querySelector(".handles");
      if (handles) {
        handles.style.display = "none";
      }

      const additionHandler = wrap.querySelector(".addition-handler");
      if (additionHandler) {
        additionHandler.style.display = "none";
      }

      if (this.interactAvailable && typeof interact !== "undefined") {
        try {
          interact(wrap).draggable(false).resizable(false);
        } catch (err) {}
      }

      // Disable editing all cells
      const cells = wrap.querySelectorAll(".grid-cell");
      cells.forEach((cell) => {
        cell.style.cursor = "default";
      });

      const lockIndicator = wrap.querySelector(".lock-indicator");
      if (!lockIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "lock-indicator";
        indicator.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="currentColor"/>
                </svg>
              `;
        indicator.style.cssText = `
                position: absolute;
                top: 4px;
                right: 4px;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
              `;
        wrap.appendChild(indicator);
      }
    } else {
      wrap.classList.remove("locked");
      wrap.style.cursor = "move";

      if (this.interactAvailable && typeof interact !== "undefined") {
        this._initInteractOnGrid(wrap, id);
      }

      // Re-enable editing cells
      const cells = wrap.querySelectorAll(".grid-cell");
      cells.forEach((cell) => {
        cell.style.cursor = "text";
      });

      const lockIndicator = wrap.querySelector(".lock-indicator");
      if (lockIndicator) {
        lockIndicator.remove();
      }

      if (this.currentSelectedGridId === id) {
        const handles = wrap.querySelector(".handles");
        if (handles) {
          handles.style.display = "block";
        }
      }
    }

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "grid", id, locked: newLockedState } }));

    return newLockedState;
  }

  toggleLockById(id) {
    return this.lockUnlockGrid(id);
  }

  deleteById(id) {
    this.remove(id);
  }

  getGridScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, cells } = item;

    const cellData = cells.map((cell) => ({
      row: parseInt(cell.dataset.row),
      col: parseInt(cell.dataset.col),
      content: cell.textContent,
    }));

    return {
      id,
      left: parseFloat(wrap.dataset.worldLeft || 0),
      top: parseFloat(wrap.dataset.worldTop || 0),
      width: parseFloat(wrap.dataset.worldWidth),
      height: parseFloat(wrap.dataset.worldHeight),
      baseWidth: parseFloat(wrap.dataset.baseWidth),
      baseHeight: parseFloat(wrap.dataset.baseHeight),
      rows: parseInt(wrap.dataset.rows),
      cols: parseInt(wrap.dataset.cols),
      locked: wrap.dataset.locked === "true",
      cells: cellData,
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left, data.top, data.rows, data.cols);
    const item = this.items.get(id);
    if (!item) return id;

    const { wrap, cells } = item;
    wrap.dataset.worldWidth = String(data.width);
    wrap.dataset.worldHeight = String(data.height);
    wrap.dataset.baseWidth = String(data.baseWidth || data.width);
    wrap.dataset.baseHeight = String(data.baseHeight || data.height);

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
      wrap.style.cursor = "default";
    }

    // Restore cell contents
    if (data.cells && Array.isArray(data.cells)) {
      data.cells.forEach((cellData) => {
        const cell = cells.find((c) => parseInt(c.dataset.row) === cellData.row && parseInt(c.dataset.col) === cellData.col);
        if (cell) {
          cell.textContent = cellData.content || "";
        }
      });
    }

    this._applyWorldToScreen(wrap);
    return id;
  }

  destroy() {
    this.detach();

    // Remove stage listener
    this.stage.removeEventListener("pointerdown", this._onStagePointerDown, true);

    // Remove document click listener
    // document.removeEventListener("click", this._onDocumentClick, true);

    if (this._unsubTool) {
      this._unsubTool();
    }

    if (this._onToolChangeHandler && this.app && this.app.toolManager) {
      this.app.toolManager.removeEventListener("change", this._onToolChangeHandler);
    }

    if (this.gridSelector) {
      this.gridSelector.destroy();
    }

    this.items.forEach((item) => {
      item.wrap.remove();
    });
    this.items.clear();
  }
}
