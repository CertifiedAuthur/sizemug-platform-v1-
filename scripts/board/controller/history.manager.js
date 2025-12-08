class HistoryManager {
  constructor(app) {
    this.app = app;
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = 50;
    this.isExecuting = false; // prevent recording during undo/redo

    // Track which managers support undo/redo
    this.supportedManagers = ["texts", "shapes", "ink", "arrows", "notes", "cards", "codeblocks", "flipCards", "frame", "people", "toolkit", "shapeToolkit", "gridTable", "mindmap"];

    this._initEventListeners();
    this._bindButtons();
    this._updateButtonStates(); // Set initial disabled state
  }

  _initEventListeners() {
    // Listen for operations that should be recorded
    window.addEventListener("history-record", (event) => {
      if (!this.isExecuting) {
        this.record(event.detail);
      }
    });
  }

  _bindButtons() {
    const undoBtn = document.getElementById("undoToolbar");
    const redoBtn = document.getElementById("redoToolbar");

    // Detect platform for correct keyboard shortcut display
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const undoShortcut = isMac ? "⌘Z" : "Ctrl+Z";
    const redoShortcut = isMac ? "⌘⇧Z" : "Ctrl+Shift+Z";

    if (undoBtn) {
      undoBtn.addEventListener("click", () => this.undo());
      undoBtn.setAttribute("data-tippy-content", `Undo (${undoShortcut})`);
    }

    if (redoBtn) {
      redoBtn.addEventListener("click", () => this.redo());
      redoBtn.setAttribute("data-tippy-content", `Redo (${redoShortcut})`);
    }

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") {
        e.preventDefault();
        this.undo();
      } else if ((e.ctrlKey || e.metaKey) && ((e.shiftKey && e.key === "Z") || e.key === "y")) {
        e.preventDefault();
        this.redo();
      }
    });
  }

  record(operation) {
    if (this.isExecuting) return;

    // Remove any history after current index (when recording new operation after undo)
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }

    // Add new operation
    this.history.push({
      ...operation,
      timestamp: Date.now(),
    });

    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }

    this._updateButtonStates();
  }

  undo() {
    if (!this.canUndo()) return;

    this.isExecuting = true;
    const operation = this.history[this.currentIndex];

    try {
      this._executeOperation(operation, "undo");
      this.currentIndex--;
      this._updateButtonStates();
    } catch (error) {
      console.error("Undo failed:", error);
    } finally {
      this.isExecuting = false;
    }
  }

  redo() {
    if (!this.canRedo()) return;

    this.isExecuting = true;
    this.currentIndex++;
    const operation = this.history[this.currentIndex];

    try {
      this._executeOperation(operation, "redo");
      this._updateButtonStates();
    } catch (error) {
      console.error("Redo failed:", error);
      this.currentIndex--; // rollback on error
    } finally {
      this.isExecuting = false;
    }
  }

  _executeOperation(operation, direction) {
    const { type, manager, action, data } = operation;
    const managerInstance = this.app[manager];

    if (!managerInstance) {
      console.warn(`Manager ${manager} not found`);
      return;
    }

    switch (type) {
      case "create":
        if (direction === "undo") {
          this._deleteItem(managerInstance, manager, data.id);
        } else {
          this._createItem(managerInstance, manager, data);
        }
        break;

      case "delete":
        if (direction === "undo") {
          this._createItem(managerInstance, manager, data);
        } else {
          this._deleteItem(managerInstance, manager, data.id);
        }
        break;

      case "modify":
        if (direction === "undo") {
          this._modifyItem(managerInstance, manager, data.id, data.oldState);
        } else {
          this._modifyItem(managerInstance, manager, data.id, data.newState);
        }
        break;

      case "move":
        if (direction === "undo") {
          this._moveItem(managerInstance, manager, data.id, data.oldPosition);
        } else {
          this._moveItem(managerInstance, manager, data.id, data.newPosition);
        }
        break;

      case "resize":
        if (direction === "undo") {
          this._resizeItem(managerInstance, manager, data.id, data.oldState);
        } else {
          this._resizeItem(managerInstance, manager, data.id, data.newState);
        }
        break;
    }

    // Refresh the display
    this._refreshDisplay();
  }

  _createItem(manager, managerName, data) {
    switch (managerName) {
      case "texts":
        if (manager.create) {
          const id = manager.create(data.x, data.y, data.text);
          if (data.style) {
            const item = manager.items.get(id);
            if (item) {
              Object.assign(item.wrap.style, data.style);
            }
          }
        }
        break;

      case "shapes":
        if (manager.createFromData) {
          manager.createFromData(data);
        } else if (manager.create) {
          // Recreate shape using original create method
          const start = { x: data.startBox.x, y: data.startBox.y };
          const result = manager.create(data.type, start, data.attrs);
          if (result && data.startBox.x2 !== data.startBox.x) {
            // Update to final size if it was resized
            const end = { x: data.startBox.x2, y: data.startBox.y2 };
            manager.updateTemp(result.id, end);
            manager.finalize(result.id);
          }
        }
        break;

      case "ink":
        if (manager.addStroke) {
          manager.addStroke(data);
        }
        break;

      case "arrows":
        if (manager.createFromData) {
          manager.createFromData(data);
        }
        break;

      case "notes":
        if (manager.create) {
          manager.create(data.x, data.y, data.content);
        }
        break;

      case "cards":
      case "flipCards":
      case "frame":
      case "people":
      case "toolkit":
      case "shapeToolkit":
      case "gridTable":
        if (manager.createFromData) {
          manager.createFromData(data);
        } else if (manager.create) {
          manager.create(data.x, data.y, data);
        }
        break;

      case "mindmap":
        if (manager.createFromData) {
          manager.createFromData(data);
        } else if (manager.createNode) {
          manager.createNode(data.x, data.y, data.text, data.parentId);
        }
        break;
    }
  }

  _deleteItem(manager, managerName, id) {
    switch (managerName) {
      case "texts":
      case "notes":
      case "cards":
      case "flipCards":
      case "frame":
      case "people":
        if (manager.remove) {
          manager.remove(id);
        }
        break;

      case "shapes":
        if (manager.deleteShapeById) {
          manager.deleteShapeById(id);
        }
        break;

      case "ink":
        if (manager.deleteStrokeById) {
          manager.deleteStrokeById(id);
        }
        break;

      case "arrows":
        if (manager.deleteById) {
          manager.deleteById(id);
        }
        break;

      case "toolkit":
      case "shapeToolkit":
      case "gridTable":
        if (manager.deleteById) {
          manager.deleteById(id);
        }
        break;

      case "mindmap":
        if (manager.remove) {
          manager.remove(id);
        }
        break;
    }
  }

  _modifyItem(manager, managerName, id, state) {
    const item = this._getItem(manager, managerName, id);
    if (!item) return;

    // Apply the state based on manager type
    switch (managerName) {
      case "texts":
        if (state.text !== undefined && item.textNode) {
          item.textNode.textContent = state.text;
        }
        if (state.style && item.wrap) {
          Object.assign(item.wrap.style, state.style);
        }
        break;

      case "shapes":
        if (state.attrs && item.element) {
          Object.entries(state.attrs).forEach(([key, value]) => {
            item.element.attr(key, value);
          });
        }
        break;

      case "ink":
        if (state.points) {
          item.points = [...state.points];
        }
        if (state.style) {
          Object.assign(item, state.style);
        }
        break;
    }
  }

  _moveItem(manager, managerName, id, position) {
    const item = this._getItem(manager, managerName, id);
    if (!item) return;

    switch (managerName) {
      case "texts":
      case "notes":
      case "cards":
      case "flipCards":
      case "frame":
      case "people":
      case "toolkit":
      case "shapeToolkit":
        if (item.wrap) {
          item.wrap.style.left = position.x + "px";
          item.wrap.style.top = position.y + "px";

          // Update world coordinates if they exist
          if (item.wrap.dataset.worldLeft !== undefined) {
            item.wrap.dataset.worldLeft = position.x;
            item.wrap.dataset.worldTop = position.y;
          }
        }
        break;

      case "shapes":
        if (item.element && manager.moveShape) {
          manager.moveShape(id, position.x, position.y);
        }
        break;

      case "mindmap":
        if (item.element) {
          item.x = position.x;
          item.y = position.y;
          if (manager.updateNodePosition) {
            manager.updateNodePosition(id);
          }
        }
        break;
    }
  }

  _resizeItem(manager, managerName, id, state) {
    const item = this._getItem(manager, managerName, id);
    if (!item) return;

    // Apply size changes
    if (state.size && item.wrap) {
      item.wrap.style.width = state.size.width + "px";
      item.wrap.style.height = state.size.height + "px";

      // Update world dimensions if they exist
      if (item.wrap.dataset.worldWidth !== undefined) {
        item.wrap.dataset.worldWidth = state.size.width;
        item.wrap.dataset.worldHeight = state.size.height;
      }
    }

    // Apply position changes (resize can move elements)
    if (state.position && item.wrap) {
      item.wrap.style.left = state.position.x + "px";
      item.wrap.style.top = state.position.y + "px";

      // Update world coordinates if they exist
      if (item.wrap.dataset.worldLeft !== undefined) {
        item.wrap.dataset.worldLeft = state.position.x;
        item.wrap.dataset.worldTop = state.position.y;
      }
    }

    // Handle shape-specific resizing
    if (managerName === "shapes" && item.element) {
      if (state.size && manager.resizeShape) {
        manager.resizeShape(id, state.size.width, state.size.height);
      }
    }
  }

  _getItem(manager, managerName, id) {
    if (manager.items && manager.items.get) {
      return manager.items.get(id);
    }
    if (manager.shapes && manager.shapes.get) {
      return manager.shapes.get(id);
    }
    if (manager.strokes && Array.isArray(manager.strokes)) {
      return manager.strokes.find((stroke) => stroke.id === id);
    }
    return null;
  }

  _refreshDisplay() {
    // Redraw canvas-based elements
    if (this.app.redrawCanvas) {
      this.app.redrawCanvas();
    }

    // Clear any selections
    if (this.app._clearAllSelections) {
      this.app._clearAllSelections();
    }
  }

  _updateButtonStates() {
    const undoBtn = document.getElementById("undoToolbar");
    const redoBtn = document.getElementById("redoToolbar");

    if (undoBtn) {
      undoBtn.disabled = !this.canUndo();
      undoBtn.style.opacity = this.canUndo() ? "1" : "0.3";
      undoBtn.style.cursor = this.canUndo() ? "pointer" : "not-allowed";
      // undoBtn.style.pointerEvents = this.canUndo() ? "auto" : "none";
    }

    if (redoBtn) {
      redoBtn.disabled = !this.canRedo();
      redoBtn.style.opacity = this.canRedo() ? "1" : "0.3";
      redoBtn.style.cursor = this.canRedo() ? "pointer" : "not-allowed";
      // redoBtn.style.pointerEvents = this.canRedo() ? "auto" : "none";
    }
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
    this._updateButtonStates();
  }

  destroy() {
    // Remove event listeners
    const undoBtn = document.getElementById("undoToolbar");
    const redoBtn = document.getElementById("redoToolbar");

    if (undoBtn) {
      undoBtn.removeEventListener("click", () => this.undo());
    }

    if (redoBtn) {
      redoBtn.removeEventListener("click", () => this.redo());
    }

    // Clear history
    this.clear();
  }

  // Helper method for managers to record operations
  static recordOperation(type, manager, action, data) {
    window.dispatchEvent(
      new CustomEvent("history-record", {
        detail: { type, manager, action, data },
      })
    );
  }
}
