class WhiteboardApp {
  constructor(options = {}) {
    // DOM nodes / primitives
    this.viewportNode = options.viewportNode;
    this.canvas = options.canvas;
    this.svg = options.svg;
    this.stage = options.stage;

    // small setup defaults
    this.lastPointerDownTimestamp = 0;
    this.lastPointerDownTargetId = null;
    this.doubleClickThreshold = 600; // ms
    this._prevTool = "select";
    this._pendingToolbarPos = false;

    // listener container for cleanup
    this._listeners = {};

    // fallback for HIDDEN constant used in some code paths
    this._HIDDEN = typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";

    // Initialize subsystems in logical groups
    this._initControllers();
    this._initManagers();
    this._initUI();
    this._initEventHandlers();
    this._initCodeBlocks(); // robust init (works without monaco)

    // ensure stage fits viewport
    window.app = this;
  }

  /* -------------------------
   * Minimal controller init
   * ------------------------ */
  _initControllers() {
    // Initialize zoom pan controller
    this.zpc = new ZoomPanController(this.viewportNode, (t) => this.onTransform(t));

    // Initialize zoom buttons handler
    new ZoomButtonsHandler(this.zpc);

    // Set default stroke properties
    this.strokeColor = "#111111";
    this.strokeWidth = 2;
  }

  _applyToolChange(toolName) {
    this.currentTool = toolName;
  }

  /* -------------------------
   * Managers initialization
   * ------------------------ */
  _initManagers() {
    // Layer manager
    this.layerManager = new LayerManager({
      canvas: this.canvas,
      svg: this.svg.node ? this.svg.node() : this.svg, // accept d3 selection or DOM node
      stage: this.stage,
      viewport: this.viewportNode,
    });

    // Tool manager
    this.toolManager = new ToolManager("select");
    this.setTool = (toolName) => {
      this._applyToolChange(toolName);
      this.toolManager.set(toolName);
      const dyn = document.getElementById("dynamicToolBar");
      if (dyn) dyn.classList.add(this._HIDDEN);
    };
    this.getTool = () => this.toolManager.get();

    // Design Grid
    this.svgDefs = this.svg.append("defs");
    this.svgDefs.append("marker").attr("id", "arrowhead").attr("markerWidth", 10).attr("markerHeight", 10).attr("refX", 10).attr("refY", 5).attr("orient", "auto").append("path").attr("d", "M0,0 L10,5 L0,10 z").attr("fill", "#111");
    this.svgGroup = this.svg.append("g").attr("id", "svgGroup");
    this.grid = new GridManager(this.svgDefs, this.svgGroup, 20);

    // Managers that depend on stage & transform

    // INK/PEN MANAGER
    this.ink = new InkManager(
      this.canvas,
      () => this.zpc.getTransform(),
      {
        color: this.strokeColor,
        width: this.strokeWidth,
        smoothing: true,
        pressureSensitive: true,
      },
      this
    );
    this.ink.attach();
    this.ink.setActive(false);

    // TEXT MANAGER
    this.texts = new TextManager(this.stage, () => this.zpc.getTransform(), this);
    // NOTE MANAGER
    this.notes = new NoteManager(this.stage, () => this.zpc.getTransform());
    // SHAPES MANAGER
    this.shapes = new ShapeManager(this.svgGroup, this.grid, this);
    // ARROW MANAGER
    this.arrows = new ArrowManager(this.canvas, () => this.zpc.getTransform(), {}, this);
    this.arrows.attach();
    this.arrows.setActive(false);
    // COMMENT MANAGER
    this.comments = new CommentManager(this.stage, () => this.zpc.getTransform(), this);
    // CARD MANAGER
    this.cards = new CardManager(this.stage, () => this.zpc.getTransform(), this);
    this.cards.attach();
    // DOT VOTE MANAGER
    const dv = new DotVotingManager("dotVotingContainer", { dragHandleSelector: "h3" });
    dv.attach();
    // FLIP CARD MANAGER
    this.flipCards = new FlipCardManager(this.stage, () => this.zpc.getTransform(), this);
    this.flipCards.attach();
    // FRAME MANAGER
    this.frame = new FrameManager(this.stage, () => this.zpc.getTransform(), this);
    this.frame.attach();
    // PEOPLE MANAGER
    this.people = new PeopleManager(this.stage, () => this.zpc.getTransform(), this);
    this.people.attach();
    // EMOJI MANAGER
    this.toolkit = new ToolkitManager(this.stage, () => this.zpc.getTransform(), this);
    this.toolkit.attach();
    // SHAPE TOOLKIT MANAGER
    this.shapeToolkit = new ShapeToolkitManager(this.stage, () => this.zpc.getTransform(), this);
    this.shapeToolkit.attach();
    this.shapeToolkit.init();
    // GRID TABLE Manager
    this.gridTable = new GridTableManager(this.stage, () => this.zpc.getTransform(), this);
    this.gridTable.attach();
    // MIND MAP MANAGER
    this.mindmap = new MindMapManager(this.svg, () => this.zpc.getTransform(), this);
    this.mindmap.attach();

    // HISTORY MANAGER (for undo/redo)
    this.history = new HistoryManager(this);

    // Codeblocks is initialized later in _initCodeBlocks()
    this.codeblocks = null;
  }

  /* -------------------------
   * UI + tool wiring
   * ------------------------ */
  _initUI() {
    // ui manager (if it depends on window.app being set)
    this.ui = new UIManager(this);

    // Tool change reactions — keep a named handler for removal later
    this._listeners.toolChange = (e) => {
      const { tool } = e.detail || {};

      // keep old behavior: piano key side effects
      if (this.zpc && typeof this.zpc.setTool === "function") {
        this.zpc.setTool(tool);
        this.zpc.setPanEnabled(tool === "pan");
      }
      if (this.layerManager && typeof this.layerManager.activateTool === "function") {
        this.layerManager.activateTool(tool);
      }
      if (this.ui && typeof this.ui._setCursorForTool === "function") {
        this.ui._setCursorForTool(tool);
      }

      if (tool === "pen" || tool === "eraser") this.setDrawingMode(true);
      else this.setDrawingMode(false);

      if (tool === "arrow") {
        this.arrows.setActive(true);
        this.setDrawingMode(true);
      } else {
        // if not arrow ensure arrows not in drawing mode
        // this.arrows.setActive(false);
      }

      if (tool === "card") this.setDrawingMode(false);

      if (tool === "flipcard") this.setDrawingMode(false);

      if (tool === "people") this.setDrawingMode(false);

      if (tool === "grid") this.setDrawingMode(false);

      if (tool === "frame") this.setDrawingMode(false);

      if (tool === "grid") this.setDrawingMode(false);

      if (tool === "mind-map") this.setDrawingMode(false);

      if (tool === "select") this.redrawCanvas();
    };

    // register
    this.toolManager.addEventListener("change", this._listeners.toolChange);

    this._initSharedToolbarSystem();
  }

  _initSharedToolbarSystem() {
    const toolbar = document.getElementById("sizemugBoardActionBtnsWrapper");
    if (!toolbar) return;

    // Listen for selection changes from all managers
    window.addEventListener("board-selection-changed", (event) => {
      const { type, id, locked, preferBottom } = event.detail || {};

      if (!type || id == null) {
        // Hide toolbar when nothing is selected
        toolbar.classList.add(this._HIDDEN);
        toolbar.dataset.targetType = "";
        toolbar.dataset.targetId = "";
        toolbar.dataset.preferBottom = "false";
      } else {
        // Update toolbar data and show it
        toolbar.dataset.targetType = type;
        toolbar.dataset.targetId = String(id);
        toolbar.dataset.preferBottom = String(!!preferBottom);

        // Update lock button state
        const lockBtn = toolbar.querySelector('button[data-action="lock"]');
        if (lockBtn) {
          lockBtn.classList.toggle("locked", !!locked);
          lockBtn.setAttribute("aria-pressed", String(!!locked));
        }

        // Position and show the toolbar
        this._scheduleToolbarReposition();
      }
    });
  }

  /* -------------------------
   * Event handlers (pointer + selection)
   * ------------------------ */
  _initEventHandlers() {
    // capture-phase selection handler
    this._listeners.captureSelect = (e) => {
      if (this.getTool() !== "select") return;
      if (this.shapes && this.shapes.editingTextId) return;
      if (e.target && e.target.closest && e.target.closest(".shape_text_editor_overlay")) return;
      if (e.target && e.target.closest && e.target.closest(".toolbar, .ui-panel, input, textarea, .manager_containers")) return;
      if (e.target && e.target.closest && e.target.closest("#dotVotingContainer")) return;

      // In WhiteboardApp's captureSelect handler, improve the selection box check:
      if (e.target && e.target.closest && (e.target.closest(".selection-box") || e.target.closest(".resize-handle"))) {
        // Check if this belongs to any of our managers
        const selectionBox = e.target.closest(".selection-box");
        if (selectionBox) {
          // Let the respective manager handle this interaction
          return;
        }
      }

      const t = this.getTransform();
      const world = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };

      try {
        // If the click target belongs to a mindmap node or plus-button, let MindMapManager handle it.
        if (e.target && e.target.closest && (e.target.closest(".mindmap-node") || e.target.closest(".mindmap-plus-button"))) {
          // Important: do not clear selections / let mindmap handle the event
          return;
        }
      } catch (err) {
        // noop
      }

      // Check managers in reverse priority order for hit testing, to avoid conflicts.

      // PEOPLE
      if (this.people && typeof this.people.hitTest === "function") {
        const personEl = e.target.closest(".person-item");
        if (personEl) return; // let person's own handlers run
      }

      // FRAME
      if (this.frame) {
        const frameEl = e.target.closest(".frame-item");
        if (frameEl) return; // let frame's own handlers run
      }

      // FLIP CARD
      if (this.flipCards) {
        const flipCardEl = e.target.closest(".flip-card-item");
        if (flipCardEl) return; // let flip card's own handlers run
      }

      // GRID TABLE
      if (this.gridTable) {
        const gridTableEl = e.target.closest(".grid-table-item");
        if (gridTableEl) return; // let grid table's own handlers run
      }

      // MIND MAP
      if (this.mindmap) {
        const mindMapEl = e.target.closest(".mindmap-node");
        if (mindMapEl) return; // let mind map's own handlers run
      }

      // Ask managers in priority order. If a manager handles it, return early.
      // 1) Cards
      if (this.cards) {
        const cardEl = e.target.closest(".card-item");
        if (cardEl) return; // let card's own handlers run
      }

      // 2) Codeblocks
      if (this.codeblocks) {
        const cbEl = e.target.closest(".codeblock-item");
        if (cbEl) return; // let codeblock's handlers run
      }

      // 3) Shapes hit test
      if (this.shapes && typeof this.shapes.hitTest === "function") {
        const shapeId = this.shapes.hitTest(world.x, world.y);
        if (shapeId) {
          const now = Date.now();
          if (shapeId === this.shapes.selectedShapeId) {
            this.shapes.startEditingText(shapeId);
            this.lastPointerDownTimestamp = 0;
            this.lastPointerDownTargetId = null;
          } else {
            this.shapes.select(shapeId);
            this.lastPointerDownTimestamp = now;
            this.lastPointerDownTargetId = shapeId;
          }
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }

      // 4) Arrows
      if (this.arrows && typeof this.arrows._getArrowAtPoint === "function") {
        const arrow = this.arrows._getArrowAtPoint(world.x, world.y);
        if (arrow) {
          arrow.bounds = arrow.bounds || this.arrows._calculateArrowBounds(arrow);
          this.arrows.selectedArrow = arrow;
          this.arrows._createSelectionBox(arrow);
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }

      // 5) Ink
      if (this.ink && typeof this.ink._getStrokeAtPoint === "function") {
        const stroke = this.ink._getStrokeAtPoint(world.x, world.y);
        if (stroke) {
          stroke.bounds = stroke.bounds || this.ink._calculateStrokeBounds(stroke);
          this.ink.selectedStroke = stroke;
          this.ink._createSelectionBox(stroke);
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      }

      // 6) nothing hit => clear selections
      this._clearAllSelections();
      this.redrawCanvas();
    };

    // attach capture handler on viewport
    if (this.viewportNode) {
      this.viewportNode.addEventListener("pointerdown", this._listeners.captureSelect, { capture: true });
    }

    // shape creation handler (svg)
    const svgNode = this.svg.node();
    if (svgNode) {
      svgNode.style.touchAction = "none";
      this._listeners.svgPointerDown = (e) => {
        if (!this.shapes) return;
        if (this.zpc.drawingMode) return;
        const activeTool = this.shapes.getActiveTool();
        if (!activeTool || activeTool === "select" || this.currentTool !== "shape") return;

        const t = this.getTransform();
        const start = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };
        const attrs = {
          stroke: this.shapes.getActiveStroke() || this.strokeColor,
          "stroke-width": this.shapes.getActiveStrokeWidth() || this.strokeWidth,
          fill: this.shapes.getActiveFill() || "transparent",
        };
        const created = this.shapes.create(activeTool, start, attrs);
        let tempShapeId = created ? created.id : null;

        const onMove = (ev) => {
          const tt = this.getTransform();
          const p = { x: (ev.clientX - tt.x) / tt.k, y: (ev.clientY - tt.y) / tt.k };
          this.shapes.updateTemp(tempShapeId, p);
        };
        const onUp = (ev) => {
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
          this.shapes.finalize(tempShapeId);
          tempShapeId = null;

          // revert to select
          this.setTool("select");
          this.setDrawingMode(false);
          this.shapes.setActiveShape(null);
          if (this.ui) {
            const pointerBtn = document.getElementById("pointerToolbarButton");
            this.ui._setActive && this.ui._setActive(pointerBtn);
            this.ui._setCursorForTool && this.ui._setCursorForTool("select");
          }
        };

        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);

        e.stopPropagation();
        e.preventDefault();
      };
      svgNode.addEventListener("pointerdown", this._listeners.svgPointerDown);
    }

    // stage pointerdown for text creation (keeps separate from svg)
    if (this.stage) {
      this._listeners.stagePointerDown = (e) => {
        if (this.zpc.drawingMode) return;
        if (this.zpc.tool !== "text") return;
        // if the pointerdown target is outside the stage we still want to ignore it
        if (e.target && e.target.closest && e.target.closest("#dotVotingContainer")) {
          return;
        }

        const t = this.getTransform();
        const world = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };
        const id = this.texts.create(world.x, world.y, "Sizemug");
        // this.texts.startEditing(id);

        // revert to select
        this.setTool("select");
        this.setDrawingMode(false);
        if (this.ui) {
          const pointerBtn = document.getElementById("pointerToolbarButton");
          this.ui._setActive && this.ui._setActive(pointerBtn);
          this.ui._setCursorForTool && this.ui._setCursorForTool("select");
        }

        e.stopPropagation();
        e.preventDefault();
      };

      this.stage.addEventListener("pointerdown", this._listeners.stagePointerDown);
    }

    // keydown: escape to cancel things that need cancelling
    this._listeners.keydown = (e) => {
      if (e.key === "Escape") {
        if (this.notes && this.notes.placementMode) this.notes.disablePlacementMode();
      }
    };
    document.addEventListener("keydown", this._listeners.keydown, false);

    // selection toolbar click actions (wired via DOM)
    const toolbar = document.getElementById("sizemugBoardActionBtnsWrapper");
    if (toolbar) {
      this._listeners.toolbarClick = (ev) => {
        const btn = ev.target.closest("button");
        if (!btn) return;
        const action = btn.dataset.action;
        const targetType = toolbar.dataset.targetType;
        const targetIdRaw = toolbar.dataset.targetId;
        const targetId = targetIdRaw != null && targetIdRaw !== "" ? (isNaN(Number(targetIdRaw)) ? targetIdRaw : Number(targetIdRaw)) : null;

        if (action === "delete") {
          this._handleDelete(targetType, targetId, toolbar);
        } else if (action === "lock") {
          this._handleLock(targetType, targetId, btn);
        } else if (action === "comment") {
          this._handleComment(targetType, targetId);
        }
      };
      toolbar.addEventListener("click", this._listeners.toolbarClick);
    }
  }

  /* -------------------------
   * Codeblocks init (resilient)
   * ------------------------ */
  _initCodeBlocks() {
    // If CodeBlockManager is available, initialize it.
    // The CodeBlockManager you already patched supports a lightweight editor without Monaco.
    if (typeof CodeBlockManager !== "undefined" && !this.codeblocks) {
      this.codeblocks = new CodeBlockManager(this.stage, () => this.zpc.getTransform(), this, document.body);
      if (typeof this.codeblocks.attach === "function") {
        this.codeblocks.attach();
      }
      return;
    }

    // otherwise, attempt a delayed init (if module loads later)
    const tryInit = () => {
      if (typeof CodeBlockManager !== "undefined" && !this.codeblocks) {
        this.codeblocks = new CodeBlockManager(this.stage, () => this.zpc.getTransform(), this, document.body);
        if (typeof this.codeblocks.attach === "function") this.codeblocks.attach();
        return true;
      }
      return false;
    };

    // give a couple of passes to tryInit (non-blocking)
    if (!tryInit()) {
      setTimeout(() => tryInit(), 500);
      setTimeout(() => tryInit(), 1500);
    }
  }

  /* -------------------------
   * Helpers: selection toolbar actions
   * ------------------------ */
  _handleDelete(type, id, toolbar) {
    if (!type) return;

    if (type === "text") {
      this.texts.remove(Number(id));
    } else if (type === "ink") {
      // Use the InkManager's deleteSelected method which handles the currently selected stroke
      if (this.ink) {
        this.ink.deleteSelected();
      }
    } else if (type === "arrow") {
      if (id != null && typeof this.arrows.deleteById === "function") {
        this.arrows.deleteById(id);
      } else if (typeof this.arrows.deleteSelected === "function") {
        this.arrows.deleteSelected();
      }
    } else if (type === "shape") {
      this.shapes.deleteShapeById(id);
    } else if (type === "flipcard") {
      this.flipCards.remove(Number(id));
    } else if (type === "frame") {
      this.frame.remove(Number(id));
    } else if (type === "codeblock") {
      this.codeblocks && this.codeblocks.remove(Number(id));
    } else if (type === "note") {
      this.notes.remove(Number(id));
    } else if (type === "person") {
      this.people.remove(Number(id));
    } else if (type === "toolkit") {
      this.toolkit.deleteById(Number(id));
    } else if (type === "grid") {
      this.gridTable.remove(Number(id));
    } else if (type === "mindmap") {
      this.mindmap.remove(Number(id));
    } else if (type === "shape") {
      this.shapeToolkit.deleteById(Number(id));
    }

    if (toolbar) toolbar.classList.add(this._HIDDEN);
  }

  _handleLock(type, id, btn) {
    if (!type) return;

    if (type === "text") {
      const item = this.texts.items.get(Number(id));
      if (item) {
        const isLocked = item.wrap.dataset.locked !== "true";
        item.wrap.dataset.locked = String(isLocked);
        if (isLocked) item.wrap.classList.add("locked");
        else item.wrap.classList.remove("locked");
        window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked: isLocked } }));
      }
    } else if (type === "ink") {
      // Won't receive id
      const locked = this.ink.toggleLockSelected();
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id, locked: !!locked } }));
    } else if (type === "arrow") {
      if (id != null && typeof this.arrows.toggleLockById === "function") {
        const locked = this.arrows.toggleLockById(id);
        window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "arrow", id, locked: !!locked } }));
      } else if (typeof this.arrows.toggleLockSelected === "function") {
        this.arrows.toggleLockSelected();
      }
    } else if (type === "shape") {
      const locked = this.shapes.toggleLockShape(id);
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id, locked: !!locked } }));
    } else if (type === "flipcard") {
      const locked = this.flipCards.toggleLock(btn, Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "frame") {
      const locked = this.frame.toggleLock(btn, Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "codeblock") {
      const locked = this.codeblocks.toggleLock(btn, Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "person") {
      const locked = this.people.toggleLock(btn, Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "note") {
      const item = this.notes.items.get(Number(id));
      if (item && item.wrap) {
        const isLocked = item.wrap.dataset.locked !== "true";
        item.wrap.dataset.locked = String(isLocked);
        if (isLocked) item.wrap.classList.add("locked");
        else item.wrap.classList.remove("locked");

        // Notify everyone so the toolbar updates lock state
        window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "note", id: Number(id), locked: isLocked } }));
      }
    } else if (type === "toolkit") {
      const locked = this.toolkit.toggleLockById(Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "grid") {
      const locked = this.gridTable.lockUnlockGrid(Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "mindmap") {
      const locked = this.mindmap.toggleLockById(Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    } else if (type === "shape") {
      const locked = this.shapeToolkit.toggleLockById(Number(id));
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type, id: Number(id), locked } }));
    }
  }

  _handleComment(type, id) {
    if (!type || !this.comments) return;

    // Get the position of the selected item
    let worldX, worldY;

    if (type === "text") {
      const item = this.texts.items.get(Number(id));
      if (item && item.wrap) {
        const rect = item.wrap.getBoundingClientRect();
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "note") {
      const item = this.notes.items.get(Number(id));
      if (item && item.wrap) {
        const rect = item.wrap.getBoundingClientRect();
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "card") {
      const item = this.cards.items.get(Number(id));
      if (item && item.wrap) {
        const rect = item.wrap.getBoundingClientRect();
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "flipcard" && this.flipCards && typeof this.flipCards.getCardScreenRect === "function") {
      const rect = this.flipCards.getCardScreenRect(Number(id));
      if (rect) {
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "codeblock" && this.codeblocks && typeof this.codeblocks.getCardScreenRect === "function") {
      const rect = this.codeblocks.getCardScreenRect(Number(id));
      if (rect) {
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "shape" && this.shapes && typeof this.shapes.getShapeScreenRect === "function") {
      const rect = this.shapes.getShapeScreenRect(id);
      if (rect) {
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    } else if (type === "grid" && this.gridTable && typeof this.gridTable.getGridScreenRect === "function") {
      const rect = this.gridTable.getGridScreenRect(Number(id));
      if (rect) {
        const transform = this.getTransform();
        worldX = (rect.right - transform.x) / transform.k + 20;
        worldY = (rect.top - transform.y) / transform.k;
      }
    }

    // Create comment at the calculated position
    if (worldX != null && worldY != null) {
      this.comments._createComment(worldX, worldY);

      // Store reference to the item being commented on
      const commentId = `comment-${this.comments.nextId - 1}`;
      const comment = this.comments.comments.get(commentId);
      if (comment) {
        comment.attachedTo = { type, id };
      }
    }
  }

  /* -------------------------
   * Utility: clear selections across managers
   * ------------------------ */
  _clearAllSelections() {
    // Shapes/arrows/ink/cards/codeblocks already handled here
    if (this.shapes && this.shapes.clearSelection) this.shapes.clearSelection();
    if (this.arrows && this.arrows.clearSelection) this.arrows.clearSelection();
    if (this.ink && this.ink.clearSelection) this.ink.clearSelection();
    if (this.cards && this.cards.clearSelection) this.cards.clearSelection();
    if (this.codeblocks && this.codeblocks.clearSelection) this.codeblocks.clearSelection();
    if (this.flipCards && this.flipCards.clearSelection) this.flipCards.clearSelection();
    if (this.frame && this.frame.clearSelection) this.frame.clearSelection();
    if (this.people && this.people.clearSelection) this.people.clearSelection();
    if (this.toolkit && this.toolkit.clearSelection) this.toolkit.clearSelection();
    if (this.gridTable && this.gridTable.clearSelection) this.gridTable.clearSelection();
    if (this.mindmap && this.mindmap.clearSelection) this.mindmap.clearSelection();
    if (this.shapeToolkit && this.shapeToolkit.clearSelection) this.shapeToolkit.clearSelection();

    // TEXTS: ensure any editing or selection state is cleared.
    // Prefer to call manager methods when available; fallback to DOM cleanup.
    try {
      if (this.texts) {
        // If TextManager exposes a public end/cancel method, prefer that.
        if (typeof this.texts._endEditing === "function") {
          // End editing if any
          this.texts._endEditing();
        }
        // Also remove any lingering selection classes on text items so UI matches toolbar hidden.
        document.querySelectorAll(".text-item.show-handles").forEach((el) => {
          el.classList.remove("show-handles");
        });
        // Hide editor toolbar (the floating editor)
        const editorToolbar = document.getElementById("whiteboardTextEditorContainer");
        if (editorToolbar) {
          editorToolbar.classList.add(this._HIDDEN);
        }
      }
    } catch (err) {
      // swallow errors here so clearing selections doesn't break other flows
      console.warn("Error while clearing text selections:", err);
    }

    // Reset last pointer meta
    this.lastPointerDownTimestamp = 0;
    this.lastPointerDownTargetId = null;

    // Fire any app-level redraw / state update as before
    this.redrawCanvas();
  }

  _getEditorElementForType(targetType) {
    if (targetType === "text") {
      return document.getElementById("whiteboardTextEditorContainer");
    } else if (targetType === "card") {
      return document.getElementById("whiteboardEditorWrapperCard");
    } else if (targetType === "flipcard") {
      return document.getElementById("whiteboardEditorWrapperFlipCard");
    } else if (targetType === "codeblock") {
      return document.getElementById("whiteboardEditorCodeBlock");
    } else if (targetType === "mindmap") {
      return document.getElementById("whiteboardEditorWrapperMindMap");
    }
    return null;
  }

  /* -------------------------
   * Toolbar positioning (kept largely intact)
   * ------------------------ */
  _positionSelectionToolbar() {
    const toolbar = document.getElementById("sizemugBoardActionBtnsWrapper");
    if (!toolbar) return;

    // Ensure toolbar is attached to body once (avoid transform-ancestor issues)
    if (toolbar.parentElement !== document.body) {
      document.body.appendChild(toolbar);
      toolbar.style.position = "fixed";
    }

    const targetType = toolbar.dataset.targetType;
    const targetIdRaw = toolbar.dataset.targetId != null && toolbar.dataset.targetId !== "" ? toolbar.dataset.targetId : null;
    const targetId = targetIdRaw != null ? (isNaN(Number(targetIdRaw)) ? targetIdRaw : Number(targetIdRaw)) : null;
    let preferBottom = toolbar.dataset.preferBottom === "true";

    if (!targetType || targetId == null) {
      toolbar.classList.add(this._HIDDEN);
      toolbar.__lastKnownRect = null;
      return;
    }

    // Try to fetch a screen rect from a few sources (most reliable first)
    let rect = null;

    const tryGetRect = () => {
      try {
        if (targetType === "ink" && this.ink && typeof this.ink.getSelectionBoxScreenRect === "function") {
          rect = this.ink.getSelectionBoxScreenRect();
        } else if (targetType === "arrow" && this.arrows && typeof this.arrows.getSelectionBoxScreenRect === "function") {
          rect = this.arrows.getSelectionBoxScreenRect();
        } else if (targetType === "text" && this.texts) {
          const item = this.texts.items.get(targetId);
          if (item && item.wrap) rect = item.wrap.getBoundingClientRect();
        } else if (targetType === "note" && this.notes) {
          const noteItem = this.notes.items.get(targetId);
          if (noteItem && noteItem.wrap) rect = noteItem.wrap.getBoundingClientRect();
        } else if (targetType === "shape" && this.shapes && typeof this.shapes.getShapeScreenRect === "function") {
          rect = this.shapes.getShapeScreenRect(targetId);
        } else if (targetType === "flipcard" && this.flipCards && typeof this.flipCards.getCardScreenRect === "function") {
          rect = this.flipCards.getCardScreenRect(targetId);
        } else if (targetType === "frame" && this.frame && typeof this.frame.getCardScreenRect === "function") {
          rect = this.frame.getCardScreenRect(targetId);
        } else if (targetType === "codeblock" && this.codeblocks && typeof this.codeblocks.getCardScreenRect === "function") {
          rect = this.codeblocks.getCardScreenRect(targetId);
        } else if (targetType === "toolkit" && this.toolkit && typeof this.toolkit.getCardScreenRect === "function") {
          rect = this.toolkit.getCardScreenRect(targetId);
        } else if (targetType === "grid" && this.gridTable && typeof this.gridTable.getGridScreenRect === "function") {
          rect = this.gridTable.getGridScreenRect(targetId);
        } else if (targetType === "mindmap" && this.mindmap && typeof this.mindmap.getSelectionBoxScreenRect === "function") {
          rect = this.mindmap.getSelectionBoxScreenRect();
        }
      } catch (err) {
        // swallow — we'll fallback to previous rect
        rect = null;
      }
    };

    tryGetRect();

    // If we didn't get a rect, fall back to last known rect (transient case during drag/resize).
    if (!rect && toolbar.__lastKnownRect) {
      rect = toolbar.__lastKnownRect;
    }

    // If still no rect — hide only if there's no last known rect (selection likely gone)
    if (!rect) {
      toolbar.classList.add(this._HIDDEN);
      return;
    }

    // store last known rect for transient fallback
    toolbar.__lastKnownRect = rect;

    try {
      const editorEl = this._getEditorElementForType(targetType);
      if (editorEl && editorEl.style && !editorEl.classList.contains(this._HIDDEN)) {
        preferBottom = true;
      }
    } catch (err) {
      /* ignore */
    }

    const margin = 8;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Ensure we can measure toolbar size even when it's currently hidden:
    const wasHidden = toolbar.classList.contains(this._HIDDEN);
    if (wasHidden) {
      toolbar.classList.remove(this._HIDDEN);
      toolbar.style.visibility = "hidden";
    }

    const tbRect = toolbar.getBoundingClientRect();
    const tbW = Math.max(0, tbRect.width || toolbar.offsetWidth || 0);
    const tbH = Math.max(0, tbRect.height || toolbar.offsetHeight || 0);

    // Compute position and clamp to viewport
    let left = rect.left + rect.width / 2 - tbW / 2;
    left = Math.min(Math.max(6, left), Math.max(6, viewportWidth - tbW - 6));

    // Add extra offset for grid tables (5rem = 80px typically)
    const gridOffset = targetType === "grid" ? 30 : 0;

    let top;
    if (!preferBottom) {
      const candidateTop = rect.top - tbH - margin - gridOffset;
      if (candidateTop >= 6) top = candidateTop;
      else top = Math.min(Math.max(6, rect.top + rect.height + margin + gridOffset), viewportHeight - tbH - 6);
    } else {
      const candidateTop = rect.top + rect.height + margin + gridOffset;
      if (candidateTop + tbH <= viewportHeight - 6) top = candidateTop;
      else top = Math.max(6, rect.top - tbH - margin - gridOffset);
    }

    toolbar.style.position = "fixed";
    toolbar.style.left = `${Math.round(left)}px`;
    toolbar.style.top = `${Math.round(top)}px`;

    // Restore visibility if we temporarily hid it
    if (wasHidden) {
      toolbar.style.visibility = "";
      toolbar.classList.remove(this._HIDDEN);
    } else {
      toolbar.classList.remove(this._HIDDEN);
    }
  }

  /* -------------------------
   * Transform update handler
   * ------------------------ */
  onTransform(t) {
    // apply transform to svgGroup only (we don't transform stage DOM)
    this.svgGroup.attr("transform", `translate(${t.x},${t.y}) scale(${t.k})`);
    this.redrawCanvas();

    // Update dependent managers/screen positions
    this.ink && typeof this.ink.onTransformChange === "function" && this.ink.onTransformChange();
    this.arrows && typeof this.arrows.updateSelectionBoxPositionOnTransform === "function" && this.arrows.updateSelectionBoxPositionOnTransform();
    this.texts && typeof this.texts.refreshScreenPositions === "function" && this.texts.refreshScreenPositions();
    this.notes && typeof this.notes.refreshScreenPositions === "function" && this.notes.refreshScreenPositions();
    this.shapes && typeof this.shapes.updateSelectionBoxPositionOnTransform === "function" && this.shapes.updateSelectionBoxPositionOnTransform();
    this.shapes && typeof this.shapes.updateTextEditorPositionOnTransform === "function" && this.shapes.updateTextEditorPositionOnTransform();
    this.comments && typeof this.comments.refreshScreenPositions === "function" && this.comments.refreshScreenPositions();
    this.cards && typeof this.cards.refreshScreenPositions === "function" && this.cards.refreshScreenPositions();
    this.codeblocks && typeof this.codeblocks.refreshScreenPositions === "function" && this.codeblocks.refreshScreenPositions();
    this.flipCards && typeof this.flipCards.refreshScreenPositions === "function" && this.flipCards.refreshScreenPositions();
    this.frame && typeof this.frame.refreshScreenPositions === "function" && this.frame.refreshScreenPositions();
    this.people && typeof this.people.refreshScreenPositions === "function" && this.people.refreshScreenPositions();
    this.toolkit && typeof this.toolkit.refreshScreenPositions === "function" && this.toolkit.refreshScreenPositions();
    this.shapeToolkit && typeof this.shapeToolkit.refreshScreenPositions === "function" && this.shapeToolkit.refreshScreenPositions();
    this.gridTable && typeof this.gridTable.refreshScreenPositions === "function" && this.gridTable.refreshScreenPositions();
    this.mindmap && typeof this.mindmap.refreshScreenPositions === "function" && this.mindmap.refreshScreenPositions();

    // reposition shared toolbar
    if (typeof this._scheduleToolbarReposition === "function") this._scheduleToolbarReposition();

    // reposition text editor toolbar if open
    if (this.texts && typeof this.texts.updateEditorToolbarPosition === "function") this.texts.updateEditorToolbarPosition();

    // reposition mind map toolbar if node is selected
    if (this.mindmap && typeof this.mindmap.updateToolbarPosition === "function") this.mindmap.updateToolbarPosition();
  }

  _scheduleToolbarReposition() {
    requestAnimationFrame(() => {
      this._positionSelectionToolbar();
    });
  }

  /* -------------------------
   * Helpers: canvas redraw and transform
   * ------------------------ */
  redrawCanvas() {
    const t = this.zpc.getTransform();
    const ctx = this.canvas.getContext("2d");

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();

    ctx.setTransform(t.k, 0, 0, t.k, t.x, t.y);

    if (this.ink) this.ink.drawAll();
    if (this.arrows) this.arrows.drawAll();
  }

  setStrokeColor(color) {
    this.strokeColor = color;
    if (this.ink) this.ink.setColor(color);
  }

  setStrokeWidth(w) {
    this.strokeWidth = w;
    if (this.ink) this.ink.setWidth(w);
  }

  setStrokeOptions(opts = {}) {
    if (!this.ink) return;
    const { lineCap, lineDash, smoothing, pressureSensitive } = opts;
    if (lineCap !== undefined) this.ink.setLineCap(lineCap);
    if (lineDash !== undefined) this.ink.setLineDash(lineDash);
    if (smoothing !== undefined) this.ink.setSmoothing(smoothing);
    if (pressureSensitive !== undefined) this.ink.setPressureSensitive(pressureSensitive);
  }

  setDrawingMode(on) {
    if (this.zpc && typeof this.zpc.setDrawingMode === "function") this.zpc.setDrawingMode(!!on);
    if (this.ink && typeof this.ink.setActive === "function") this.ink.setActive(!!on);
    if (this.zpc && typeof this.zpc.setPanEnabled === "function") this.zpc.setPanEnabled(!on && this.currentTool === "pan");
  }

  getTransform() {
    return this.zpc.getTransform();
  }

  /* -------------------------
   * Destroy / cleanup
   * ------------------------ */
  destroy() {
    // remove all manager resources if they expose destroy/detach
    [this.ink, this.arrows, this.shapes, this.texts, this.notes, this.comments, this.cards, this.flipCards, this.frame, this.codeblocks, this.emojis, this.gridTable, this.mindmap, this.history].forEach((m) => {
      if (m && typeof m.destroy === "function") m.destroy();
      if (m && typeof m.detach === "function") m.detach();
    });

    // remove listeners registered earlier
    if (this.viewportNode && this._listeners.captureSelect) this.viewportNode.removeEventListener("pointerdown", this._listeners.captureSelect, { capture: true });
    if (this.svg && this.svg.node && this.svg.node() && this._listeners.svgPointerDown) this.svg.node().removeEventListener("pointerdown", this._listeners.svgPointerDown);
    if (this.stage && this._listeners.stagePointerDown) this.stage.removeEventListener("pointerdown", this._listeners.stagePointerDown);
    if (this.toolManager && this._listeners.toolChange) this.toolManager.removeEventListener("change", this._listeners.toolChange);
    if (this._listeners.toolbarClick) {
      const toolbar = document.getElementById("sizemugBoardActionBtnsWrapper");
      if (toolbar) toolbar.removeEventListener("click", this._listeners.toolbarClick);
    }
    if (this._listeners.keydown) document.removeEventListener("keydown", this._listeners.keydown, false);

    // cancel scheduled rAFs if any
    if (this._editorRAF) cancelAnimationFrame(this._editorRAF);
    this._editorRAF = null;
  }
}

/* -------------------------
 * Boot function (unchanged except tidy)
 * ------------------------ */
(function boot() {
  const viewportNode = document.getElementById("viewport");
  const canvas = document.getElementById("ink");
  const svg = d3.select("#shapes");
  const stage = document.getElementById("stage");

  function fit() {
    canvas.width = viewportNode.clientWidth;
    canvas.height = viewportNode.clientHeight;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    svg.attr("width", canvas.width).attr("height", canvas.height);
    stage.style.width = canvas.width + "px";
    stage.style.height = canvas.height + "px";
  }
  fit();
  window.addEventListener("resize", fit);

  //
  // document.addEventListener("contextmenu", (e) => {
  //   e.preventDefault();
  // });

  const app = new WhiteboardApp({ viewportNode, canvas, svg, stage });
  window.app = app;
})();
