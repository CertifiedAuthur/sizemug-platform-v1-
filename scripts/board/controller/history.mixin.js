/**
 * History Tracking Mixin
 *
 * This mixin provides easy-to-use methods for tracking operations in any manager.
 * It handles create, delete, modify, move, and resize operations with proper state capture.
 *
 * Usage:
 * 1. Add this to your manager constructor:
 *    Object.assign(this, HistoryMixin);
 *    this._initHistoryTracking('managerName');
 *
 * 2. Call tracking methods in your operations:
 *    this._trackCreate(id, data);
 *    this._trackDelete(id, data);
 *    this._trackModify(id, oldState, newState);
 *    this._trackMove(id, oldPosition, newPosition);
 *    this._trackResize(id, oldSize, newSize);
 */

const HistoryMixin = {
  /**
   * Initialize history tracking for this manager
   * @param {string} managerName - Name used in history manager (e.g., 'cards', 'notes', 'shapes')
   */
  _initHistoryTracking(managerName) {
    this._historyManagerName = managerName;
    this._historyEnabled = true;
    this._isHistoryExecuting = false;
  },

  /**
   * Check if we should record history (not during undo/redo)
   */
  _shouldRecordHistory() {
    if (!this._historyEnabled) return false;
    if (this._isHistoryExecuting) return false;

    // Check if history manager is executing
    if (window.app && window.app.history && window.app.history.isExecuting) {
      return false;
    }

    return true;
  },

  /**
   * Temporarily disable history tracking (useful during batch operations)
   */
  _pauseHistory() {
    this._historyEnabled = false;
  },

  /**
   * Re-enable history tracking
   */
  _resumeHistory() {
    this._historyEnabled = true;
  },

  /**
   * Track creation of an item
   * @param {string} id - Item ID
   * @param {object} data - Complete data needed to recreate the item
   */
  _trackCreate(id, data) {
    if (!this._shouldRecordHistory()) return;

    HistoryManager.recordOperation("create", this._historyManagerName, "create", {
      id,
      ...data,
    });
  },

  /**
   * Track deletion of an item
   * @param {string} id - Item ID
   * @param {object} data - Complete data needed to restore the item
   */
  _trackDelete(id, data) {
    if (!this._shouldRecordHistory()) return;

    HistoryManager.recordOperation("delete", this._historyManagerName, "delete", {
      id,
      ...data,
    });
  },

  /**
   * Track modification of an item
   * @param {string} id - Item ID
   * @param {object} oldState - Previous state
   * @param {object} newState - New state
   */
  _trackModify(id, oldState, newState) {
    if (!this._shouldRecordHistory()) return;

    HistoryManager.recordOperation("modify", this._historyManagerName, "modify", {
      id,
      oldState,
      newState,
    });
  },

  /**
   * Track movement of an item
   * @param {string} id - Item ID
   * @param {object} oldPosition - Previous position {x, y}
   * @param {object} newPosition - New position {x, y}
   */
  _trackMove(id, oldPosition, newPosition) {
    if (!this._shouldRecordHistory()) return;

    HistoryManager.recordOperation("move", this._historyManagerName, "move", {
      id,
      oldPosition: { ...oldPosition },
      newPosition: { ...newPosition },
    });
  },

  /**
   * Track resizing of an item
   * @param {string} id - Item ID
   * @param {object} oldSize - Previous size {width, height}
   * @param {object} newSize - New size {width, height}
   */
  _trackResize(id, oldSize, newSize) {
    if (!this._shouldRecordHistory()) return;

    // Resize is a type of modification
    HistoryManager.recordOperation("modify", this._historyManagerName, "resize", {
      id,
      oldState: { size: { ...oldSize } },
      newState: { size: { ...newSize } },
    });
  },

  /**
   * Capture current state of an item for tracking
   * Override this in your manager to capture manager-specific state
   * @param {string} id - Item ID
   * @returns {object} Current state of the item
   */
  _captureItemState(id) {
    const item = this.items ? this.items.get(id) : null;
    if (!item) return null;

    const state = {};

    // Capture position
    if (item.wrap) {
      state.x = parseFloat(item.wrap.style.left) || 0;
      state.y = parseFloat(item.wrap.style.top) || 0;
      state.width = parseFloat(item.wrap.style.width) || item.wrap.offsetWidth;
      state.height = parseFloat(item.wrap.style.height) || item.wrap.offsetHeight;
    }

    // Capture content
    if (item.contentElement) {
      state.content = item.contentElement.textContent || item.contentElement.innerHTML;
    }

    // Capture style
    if (item.wrap) {
      state.style = {
        backgroundColor: item.wrap.style.backgroundColor,
        borderColor: item.wrap.style.borderColor,
        borderWidth: item.wrap.style.borderWidth,
        borderRadius: item.wrap.style.borderRadius,
        fontSize: item.wrap.style.fontSize,
      };
    }

    return state;
  },

  /**
   * Helper to track drag start (captures initial position)
   * Call this at the start of a drag operation
   * @param {string} id - Item ID
   */
  _trackDragStart(id) {
    if (!this._shouldRecordHistory()) return;

    const state = this._captureItemState(id);
    if (state) {
      this._dragStartState = {
        id,
        position: { x: state.x, y: state.y },
      };
    }
  },

  /**
   * Helper to track drag end (records the move operation)
   * Call this at the end of a drag operation
   * @param {string} id - Item ID
   */
  _trackDragEnd(id) {
    if (!this._shouldRecordHistory() || !this._dragStartState) return;

    const state = this._captureItemState(id);
    if (state && this._dragStartState.id === id) {
      const oldPos = this._dragStartState.position;
      const newPos = { x: state.x, y: state.y };

      // Only track if position actually changed
      if (oldPos.x !== newPos.x || oldPos.y !== newPos.y) {
        this._trackMove(id, oldPos, newPos);
      }
    }

    this._dragStartState = null;
  },

  /**
   * Helper to track resize start (captures initial size)
   * Call this at the start of a resize operation
   * @param {string} id - Item ID
   */
  _trackResizeStart(id) {
    if (!this._shouldRecordHistory()) return;

    const state = this._captureItemState(id);
    if (state) {
      this._resizeStartState = {
        id,
        size: { width: state.width, height: state.height },
        position: { x: state.x, y: state.y },
      };
    }
  },

  /**
   * Helper to track resize end (records the resize operation)
   * Call this at the end of a resize operation
   * @param {string} id - Item ID
   */
  _trackResizeEnd(id) {
    if (!this._shouldRecordHistory() || !this._resizeStartState) return;

    const state = this._captureItemState(id);
    if (state && this._resizeStartState.id === id) {
      const oldSize = this._resizeStartState.size;
      const newSize = { width: state.width, height: state.height };
      const oldPos = this._resizeStartState.position;
      const newPos = { x: state.x, y: state.y };

      // Track both size and position changes (resize can move the element)
      const sizeChanged = oldSize.width !== newSize.width || oldSize.height !== newSize.height;
      const posChanged = oldPos.x !== newPos.x || oldPos.y !== newPos.y;

      if (sizeChanged || posChanged) {
        this._trackModify(id, { size: oldSize, position: oldPos }, { size: newSize, position: newPos });
      }
    }

    this._resizeStartState = null;
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = HistoryMixin;
}
