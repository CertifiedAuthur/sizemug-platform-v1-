class ArrowManager {
  constructor(canvas, getTransform, options = {}, app) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.getTransform = getTransform;
    this.app = app || window.app;

    this.arrows = [];
    this.current = null;
    this.attached = false;
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "arrow";

    // Selection properties
    this.selectedArrow = null;
    this.selectionBox = null;
    this.interactInstance = null;

    this.defaults = {
      color: options.color || "#000000",
      width: options.width || 3,
      lineCap: options.lineCap || "round",
      type: options.type || "straight", // straight or elbow
    };

    this.canvas.style.touchAction = "none";

    // Initialize Interact.js
    this._initializeInteract();

    // Subscribe to tool changes
    if (this.app && this.app.toolManager) {
      if (typeof this.app.toolManager.onChange === "function") {
        this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
      } else {
        this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail.tool);
        this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
      }
    }

    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    // toolbar container with buttons (expects markup discussed below)
    this.arrowManagerContainer = document.getElementById("arrowManagerContainer");
    if (!this.arrowManagerContainer) {
      console.warn("ShapeManager: #arrowManagerContainer not found in DOM");
      return;
    }

    const arrowMultiColorBtn = document.getElementById("arrowMultiColorBtn");
    const arrowColorContainerSelector = document.getElementById("arrowColorContainerSelector");

    // click handler on the toolbar container (delegation)
    this.arrowManagerContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        // Handle thickness changes
        if (button.classList.contains("pen") && button.dataset.thickness) {
          this.setWidth(parseInt(button.dataset.thickness));
          this.updateThicknessUI(button);
        }

        // Handle arrow type changes
        if (button.classList.contains("arrow_type") && button.dataset.type) {
          this.setArrowType(button.dataset.type);
        }

        // Handle color changes
        if (button.classList.contains("arrow_color") && button.dataset.color) {
          this.setColor(button.dataset.color);
          this.updateColorUI(button);
        }
      }
    });

    if (arrowMultiColorBtn && arrowColorContainerSelector) {
      arrowMultiColorBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        arrowColorContainerSelector.click();
      });

      arrowColorContainerSelector.addEventListener("input", (e) => {
        const newColor = e.target.value;
        this.setColor(newColor);
      });
    }
  }

  updateThicknessUI(activeButton) {
    const thicknessButtons = document.querySelectorAll(".arrow_thickness .pen");
    thicknessButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  updateColorUI(activeButton) {
    const colorButtons = document.querySelectorAll(".arrow_color");
    colorButtons.forEach((btn) => btn.classList.remove("active"));
    activeButton.classList.add("active");
  }

  attach() {
    if (this.attached) return;
    this.canvas.addEventListener("pointerdown", this._onPointerDown);
    this.attached = true;
  }

  detach() {
    if (!this.attached) return;
    this.canvas.removeEventListener("pointerdown", this._onPointerDown);
    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);
    this.attached = false;
  }

  setActive(on) {
    this.active = !!on;
    this.drawingEnabled = !!on;

    if (on) {
      this.initializeArrowTool();
    }
  }

  initializeArrowTool() {
    // Set default arrow type to straight
    this.setArrowType("straight");

    // Update UI to reflect current settings
    this.updateArrowUI();
  }

  setArrowType(type) {
    this.defaults.type = type;

    // Update UI buttons
    const arrowTypeButtons = document.querySelectorAll(".arrow_type");
    arrowTypeButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.type === type) {
        btn.classList.add("active");
      }
    });
  }

  updateArrowUI() {
    // Update thickness buttons
    const thicknessButtons = document.querySelectorAll(".arrow_thickness .pen");
    thicknessButtons.forEach((btn) => {
      btn.classList.remove("active");

      if (Number(btn.dataset.thickness) === this.defaults.width) {
        btn.classList.add("active");
      }
    });

    // Update color buttons
    const colorButtons = document.querySelectorAll(".arrow_color");
    colorButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.dataset.color === this.defaults.color) {
        btn.classList.add("active");
      }
    });
  }

  // Handle tool changes from the app
  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "arrow") {
      this.setActive(true);
      this.drawingEnabled = true;
    } else if (tool === "select") {
      this.setActive(true);
      this.drawingEnabled = false;
    } else {
      // Keep arrows visible but disable interaction and drawing
      this.active = true;
      this.drawingEnabled = false;
      this.clearSelection();
    }
  }

  setColor(c) {
    this.defaults.color = c;
  }

  setWidth(w) {
    this.defaults.width = Math.max(0.5, Number(w) || 1);
  }

  _onPointerDown(e) {
    if (!this.active) return;
    if (e.button && e.button !== 0) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);

    // Handle selection tool
    if (this.activeTool === "select") {
      console.log(this.activeTool);

      const clickedArrow = this._getArrowAtPoint(worldPoint.x, worldPoint.y);
      if (clickedArrow) {
        this.selectedArrow = clickedArrow;
        this._createSelectionBox(clickedArrow);
        // this.redrawAll();
        return;
      } else {
        // Clear selection if clicking elsewhere
        this.clearSelection();
        return;
      }
    }

    // Handle arrow drawing
    if (this.activeTool === "arrow" && this.drawingEnabled) {
      this.clearSelection();

      try {
        this.canvas.setPointerCapture(e.pointerId);
      } catch (err) {}

      this.current = {
        id: "arrow-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9),
        points: [worldPoint, worldPoint],
        color: this.defaults.color,
        width: this.defaults.width,
        type: this.defaults.type,
        bounds: null,
      };
      this.arrows.push(this.current);

      document.addEventListener("pointermove", this._onPointerMove);
      document.addEventListener("pointerup", this._onPointerUp);
    }
  }

  _onPointerMove(e) {
    if (!this.current) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);
    this.current.points[1] = worldPoint;
    this.app.redrawCanvas();
  }

  _onPointerUp(e) {
    try {
      this.canvas.releasePointerCapture(e.pointerId);
    } catch (err) {}

    if (this.current) {
      // Calculate bounds for the completed arrow
      this.current.bounds = this._calculateArrowBounds(this.current);
      this.current = null;
    }

    document.removeEventListener("pointermove", this._onPointerMove);
    document.removeEventListener("pointerup", this._onPointerUp);
  }

  _worldPoint(clientX, clientY) {
    const t = this.getTransform();
    return { x: (clientX - t.x) / t.k, y: (clientY - t.y) / t.k };
  }

  drawAll() {
    const ctx = this.ctx;
    // Draw arrows in world space
    for (const arrow of this.arrows) {
      // Ensure bounds are calculated for existing arrows
      if (!arrow.bounds) {
        arrow.bounds = this._calculateArrowBounds(arrow);
      }
      this._drawArrow(arrow);
    }

    // Update selection box position if it exists
    if (this.selectedArrow && this.selectionBox) {
      this._updateSelectionBoxPosition();
    }
  }

  redrawAll() {
    this.app.redrawCanvas();
  }

  _drawArrow(arrow) {
    const ctx = this.ctx;
    const [start, end] = arrow.points;
    const transform = this.getTransform();
    const headlen = 10 / transform.k;

    ctx.save();
    ctx.strokeStyle = arrow.color;
    ctx.lineWidth = arrow.width;
    ctx.lineCap = this.defaults.lineCap;

    if (arrow.type === "straight") {
      this._drawStraightArrow(ctx, start, end, headlen);
    } else if (arrow.type === "elbow") {
      this._drawElbowArrow(ctx, start, end, headlen);
    }

    ctx.restore();
  }

  //
  _drawStraightArrow(ctx, start, end, headlen) {
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  //
  _drawElbowArrow(ctx, start, end, headlen) {
    // Calculate equal horizontal segments - use 50% of total horizontal distance for each
    const totalHorizontalDistance = end.x - start.x;
    const halfHorizontal = totalHorizontalDistance * 0.5;

    // Elbow points with equal horizontal segments
    const firstElbowX = start.x + halfHorizontal;
    const secondElbowX = firstElbowX; // Same X coordinate for both elbow points

    const firstElbowY = start.y;
    const secondElbowY = end.y;

    // Corner radius for both rounded corners
    const cornerRadius = 15;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);

    // First horizontal segment (start to first elbow)
    const corner1StartX = firstElbowX - cornerRadius;
    ctx.lineTo(corner1StartX, start.y);

    // First rounded corner (top)
    const corner1EndY = firstElbowY + (end.y > start.y ? cornerRadius : -cornerRadius);
    ctx.arcTo(firstElbowX, firstElbowY, firstElbowX, corner1EndY, cornerRadius);

    // Vertical segment
    const corner2StartY = secondElbowY - (end.y > start.y ? cornerRadius : -cornerRadius);
    ctx.lineTo(firstElbowX, corner2StartY);

    // Second rounded corner (bottom)
    const corner2EndX = firstElbowX + cornerRadius;
    ctx.arcTo(firstElbowX, secondElbowY, corner2EndX, secondElbowY, cornerRadius);

    // Final horizontal segment (second elbow to end) - this should match the first segment length
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Draw arrowhead pointing horizontally right
    const angle = 0; // Always pointing right
    ctx.beginPath();
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(end.x, end.y);
    ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  }

  clear() {
    this.arrows = [];
    this.clearSelection();
    this.redrawAll();
  }

  // Initialize Interact.js for resize functionality
  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn('Interact.js library not found. Please include it: <script src="https://unpkg.com/interactjs/dist/interact.min.js"></script>');
      return;
    }
    this.interactAvailable = true;
  }

  // Calculate bounding box for an arrow
  _calculateArrowBounds(arrow) {
    if (!arrow.points || arrow.points.length < 2) return null;

    const [start, end] = arrow.points;
    const padding = arrow.width / 2 + 10; // Add padding for arrowhead

    const minX = Math.min(start.x, end.x) - padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const maxY = Math.max(start.y, end.y) + padding;

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  // Find arrow at point
  _getArrowAtPoint(x, y) {
    for (let i = this.arrows.length - 1; i >= 0; i--) {
      const arrow = this.arrows[i];
      if (this._pointInArrowBounds(x, y, arrow) && this._isPointOnArrow(x, y, arrow)) {
        return arrow;
      }
    }
    return null;
  }

  // Check if point is inside arrow bounds
  _pointInArrowBounds(x, y, arrow) {
    const bounds = arrow.bounds || this._calculateArrowBounds(arrow);
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width && y >= bounds.y && y <= bounds.y + bounds.height;
  }

  // Check if point is on arrow line
  _isPointOnArrow(x, y, arrow) {
    const threshold = Math.max(arrow.width / 2 + 5, 10);
    const [start, end] = arrow.points;

    if (arrow.type === "straight") {
      return this._distanceToLineSegment(x, y, start.x, start.y, end.x, end.y) <= threshold;
    } else if (arrow.type === "elbow") {
      const midX = start.x + (end.x - start.x) * 0.7;
      const elbowPoint = { x: midX, y: start.y };

      return this._distanceToLineSegment(x, y, start.x, start.y, elbowPoint.x, elbowPoint.y) <= threshold || this._distanceToLineSegment(x, y, elbowPoint.x, elbowPoint.y, end.x, end.y) <= threshold;
    }
    return false;
  }

  // Calculate distance from point to line segment
  _distanceToLineSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (length * length)));
    const projection = { x: x1 + t * dx, y: y1 + t * dy };

    return Math.sqrt((px - projection.x) ** 2 + (py - projection.y) ** 2);
  }

  // Create selection box
  _createSelectionBox(arrow) {
    if (!arrow.bounds || !this.interactAvailable) return;
    this._removeSelectionBox();

    const bounds = arrow.bounds;
    const transform = this.getTransform();
    const canvasRect = this.canvas.getBoundingClientRect();

    const screenX = bounds.x * transform.k + transform.x;
    const screenY = bounds.y * transform.k + transform.y;
    const screenWidth = bounds.width * transform.k;
    const screenHeight = bounds.height * transform.k;

    const selectionBox = document.createElement("div");
    selectionBox.className = "selection-box";
    selectionBox.style.position = "fixed";
    selectionBox.style.left = canvasRect.left + screenX + "px";
    selectionBox.style.top = canvasRect.top + screenY + "px";
    selectionBox.style.width = screenWidth + "px";
    selectionBox.style.height = screenHeight + "px";
    selectionBox.style.pointerEvents = "auto";
    selectionBox.style.zIndex = "100000";

    // Add resize handles
    const handles = ["nw", "ne", "sw", "se"];
    handles.forEach((handle) => {
      const handleEl = document.createElement("div");
      handleEl.className = `resize-handle resize-${handle}`;
      handleEl.style.position = "absolute";
      handleEl.style.borderRadius = "50%";
      handleEl.style.pointerEvents = "auto";
      handleEl.style.cursor = this._getCursorForHandle(handle);
      this._positionHandle(handleEl, handle);
      selectionBox.appendChild(handleEl);
    });

    document.body.appendChild(selectionBox);
    this.selectionBox = selectionBox;

    this._initializeInteractOnBox(selectionBox, arrow);
    this.selectedArrow = arrow;

    // Broadcast selection event
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "arrow", id: arrow.id, locked: !!arrow.locked } }));
  }

  // Initialize Interact.js on selection box
  _initializeInteractOnBox(element, arrow) {
    if (!this.interactAvailable) return;

    element.style.position = "fixed";

    if (this.interactInstance) {
      try {
        this.interactInstance.unset();
      } catch (err) {}
      this.interactInstance = null;
    }

    if (arrow.locked) {
      element.classList.add("locked");
      return;
    } else {
      element.classList.remove("locked");
    }

    this.interactInstance = interact(element)
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            this._originalBounds = Object.assign({}, arrow.bounds || this._calculateArrowBounds(arrow));
            this._originalPoints = arrow.points.map((p) => ({ x: p.x, y: p.y }));
            this._cachedCanvasRect = this.canvas.getBoundingClientRect();
            this._cachedTransform = this.getTransform() || { x: 0, y: 0, k: 1 };
          },
          move: (event) => {
            if (arrow.locked) return;

            const rect = event.rect || {};
            if (!rect.width || !rect.height) return;

            const canvasRect = this._cachedCanvasRect || this.canvas.getBoundingClientRect();
            const transform = this._cachedTransform || this.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;

            const newWorldLeft = (rect.left - canvasRect.left - transform.x) / k;
            const newWorldTop = (rect.top - canvasRect.top - transform.y) / k;
            const newWorldW = rect.width / k;
            const newWorldH = rect.height / k;

            const ob = this._originalBounds || { x: 0, y: 0, width: 1, height: 1 };
            const scaleX = newWorldW / Math.max(1e-6, ob.width);
            const scaleY = newWorldH / Math.max(1e-6, ob.height);
            const translateX = newWorldLeft - ob.x;
            const translateY = newWorldTop - ob.y;

            this._applyTransformToArrow(arrow, scaleX, scaleY, translateX, translateY);

            element.style.left = `${rect.left}px`;
            element.style.top = `${rect.top}px`;
            element.style.width = `${rect.width}px`;
            element.style.height = `${rect.height}px`;

            this.redrawAll();

            this._updateSelectionBoxPosition();
            // Update toolbar position if app method exists
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
          end: (event) => {
            arrow.bounds = this._calculateArrowBounds(arrow);
            this._originalPoints = null;
            this._originalBounds = null;
            this._cachedCanvasRect = null;
            this._cachedTransform = null;
            this.redrawAll();
          },
        },
      })
      .draggable({
        listeners: {
          move: (event) => {
            if (arrow.locked) return;

            const transform = this.getTransform() || { x: 0, y: 0, k: 1 };
            const k = transform.k || 1;
            const worldDx = event.dx / k;
            const worldDy = event.dy / k;

            for (const p of arrow.points) {
              p.x += worldDx;
              p.y += worldDy;
            }

            arrow.bounds = this._calculateArrowBounds(arrow);

            const left = parseFloat(element.style.left || 0) + event.dx;
            const top = parseFloat(element.style.top || 0) + event.dy;
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;

            this.redrawAll();

            this._updateSelectionBoxPosition();
            // Update toolbar position if app method exists
            if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
              this.app._scheduleToolbarReposition();
            }
          },
        },
      });
  }

  // Apply transformation to arrow
  _applyTransformToArrow(arrow, scaleX, scaleY, translateX, translateY) {
    if (!this._originalPoints || !this._originalBounds) return;

    const ob = this._originalBounds;
    arrow.points = this._originalPoints.map((pt) => {
      const relX = pt.x - ob.x;
      const relY = pt.y - ob.y;
      return {
        x: ob.x + translateX + relX * scaleX,
        y: ob.y + translateY + relY * scaleY,
      };
    });

    arrow.bounds = this._calculateArrowBounds(arrow);
  }

  // Position resize handles
  _positionHandle(handle, position) {
    switch (position) {
      case "nw":
        handle.style.left = "-4px";
        handle.style.top = "-4px";
        break;
      case "ne":
        handle.style.right = "-4px";
        handle.style.top = "-4px";
        break;
      case "sw":
        handle.style.left = "-4px";
        handle.style.bottom = "-4px";
        break;
      case "se":
        handle.style.right = "-4px";
        handle.style.bottom = "-4px";
        break;
    }
  }

  // Get cursor for handle
  _getCursorForHandle(handle) {
    const cursors = {
      nw: "nw-resize",
      ne: "ne-resize",
      sw: "sw-resize",
      se: "se-resize",
    };
    return cursors[handle] || "default";
  }

  // Remove selection box
  _removeSelectionBox() {
    if (this.selectionBox) {
      if (this.interactInstance) {
        try {
          this.interactInstance.unset();
        } catch (err) {}
        this.interactInstance = null;
      }
      this.selectionBox.remove();
      this.selectionBox = null;
      window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    }
  }

  // Clear selection
  clearSelection() {
    this.selectedArrow = null;
    this._removeSelectionBox();
  }

  // Set active tool
  setActiveTool(tool) {
    this.activeTool = tool;
    if (tool !== "select") {
      this.clearSelection();
    }
  }

  // Toggle lock on selected arrow
  toggleLockSelected() {
    if (!this.selectedArrow) return;
    this.selectedArrow.locked = !this.selectedArrow.locked;

    if (this.selectionBox && this.interactInstance) {
      try {
        if (this.selectedArrow.locked) {
          this.interactInstance.unset();
          this.interactInstance = null;
        } else {
          this._initializeInteractOnBox(this.selectionBox, this.selectedArrow);
        }
      } catch (err) {
        console.warn("toggleLockSelected: interact toggle failed", err);
      }
    }

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "arrow", id: this.selectedArrow.id, locked: !!this.selectedArrow.locked } }));
  }

  // Delete selected arrow
  deleteSelected() {
    if (this.selectedArrow) {
      const index = this.arrows.indexOf(this.selectedArrow);
      if (index > -1) {
        const removed = this.arrows.splice(index, 1)[0];
        // clear selection box and selection state
        this.clearSelection();
        // redraw immediately
        this.redrawAll();
        if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
          this.app._scheduleToolbarReposition();
        }

        // notify app / toolbar
        window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
        return true;
      }
    }
    return false;
  }

  // Get selected arrow
  getSelectedArrow() {
    return this.selectedArrow || null;
  }

  // Get selection box screen rect
  getSelectionBoxScreenRect() {
    if (!this.selectionBox) return null;
    return this.selectionBox.getBoundingClientRect();
  }

  // Update selection box position after canvas transforms
  _updateSelectionBoxPosition() {
    if (!this.selectedArrow || !this.selectionBox) return;

    const bounds = this.selectedArrow.bounds;
    const transform = this.getTransform();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Convert world coordinates to screen coordinates
    const screenX = bounds.x * transform.k + transform.x;
    const screenY = bounds.y * transform.k + transform.y;
    const screenWidth = bounds.width * transform.k;
    const screenHeight = bounds.height * transform.k;

    this.selectionBox.style.left = screenX + canvasRect.left + "px";
    this.selectionBox.style.top = screenY + canvasRect.top + "px";
    this.selectionBox.style.width = screenWidth + "px";
    this.selectionBox.style.height = screenHeight + "px";
  }

  // Update selection box position after transforms
  updateSelectionBoxPositionOnTransform() {
    this._updateSelectionBoxPosition && this._updateSelectionBoxPosition();
  }

  /**
   * Delete arrow by id (id can be string like "arrow-123" or numeric)
   */
  deleteById(id) {
    if (id == null) return false;
    // Accept either the arrow object id or index-like
    const idx = this.arrows.findIndex((a) => String(a.id) === String(id));
    if (idx === -1) return false;

    const removed = this.arrows.splice(idx, 1)[0];

    // if it was the selected arrow, clear selection and remove selectionBox
    if (this.selectedArrow && String(this.selectedArrow.id) === String(removed.id)) {
      this.clearSelection();
    } else {
      // ensure any selectionBox referencing stale arrow is removed
      this._removeSelectionBox();
    }

    // redraw canvas so arrow disappears immediately
    this.redrawAll();
    if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
      this.app._scheduleToolbarReposition();
    }
    // notify app / UI that selection changed (toolbar should hide)
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    return true;
  }

  /**
   * Toggle lock state for an arrow by id
   */
  toggleLockById(id) {
    if (id == null) return null;
    const arrow = this.arrows.find((a) => String(a.id) === String(id));
    if (!arrow) return null;

    arrow.locked = !arrow.locked;

    // If this arrow is currently selected, update selection box interactivity
    if (this.selectedArrow && String(this.selectedArrow.id) === String(arrow.id)) {
      if (arrow.locked) {
        // disable interact instance on the selectionBox
        if (this.interactInstance) {
          try {
            this.interactInstance.unset();
          } catch (err) {}
          this.interactInstance = null;
        }
        if (this.selectionBox) this.selectionBox.classList.add("locked");
      } else {
        // re-init interact if selectionBox exists
        if (this.selectionBox) {
          if (typeof this._initializeInteractOnBox === "function") {
            this._initializeInteractOnBox(this.selectionBox, arrow);
          }
          this.selectionBox.classList.remove("locked");
        }
      }
    }

    // notify UI to update lock-button state
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "arrow", id: arrow.id, locked: !!arrow.locked } }));

    // redraw to reflect any visual lock cues
    this.redrawAll();
    if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
      this.app._scheduleToolbarReposition();
    }
    return arrow.locked;
  }
}
