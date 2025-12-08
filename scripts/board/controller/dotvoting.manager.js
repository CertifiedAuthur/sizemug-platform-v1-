class DotVotingManager {
  /**
   * @param {HTMLElement|string} elOrId - container element or its id
   * @param {Object} opts - options:
   *   - dragHandleSelector: selector inside container used to start dragging (default 'h3')
   *   - fixedOnScreen: true => position: fixed (default true)
   *   - zIndex: CSS z-index for container while dragging (default 9999)
   */
  constructor(elOrId, opts = {}) {
    this.el = typeof elOrId === "string" ? document.getElementById(elOrId) : elOrId;
    if (!this.el) throw new Error("DotVotingManager: container element not found");

    this.opts = Object.assign(
      {
        dragHandleSelector: "h3",
        fixedOnScreen: true,
        zIndex: 9999,
      },
      opts
    );

    // ensure dataset defaults
    const rect = this.el.getBoundingClientRect();
    if (!this.el.dataset.worldLeft) this.el.dataset.worldLeft = "0";
    if (!this.el.dataset.worldTop) this.el.dataset.worldTop = "0";
    if (!this.el.dataset.worldWidth) this.el.dataset.worldWidth = String(Math.round(rect.width || 320));
    if (!this.el.dataset.worldHeight) this.el.dataset.worldHeight = String(Math.round(rect.height || 180));

    // internal state
    this._attached = false;
    this._activePointerDrag = null;
    this._listeners = []; // track added DOM listeners for removal
    this._interactable = null;
    this._prevZ = undefined;
    this._downHandler = null; // interact 'down' handler reference

    // base styles for fixed-on-screen
    if (this.opts.fixedOnScreen) {
      this.el.style.position = "fixed";
      this.el.style.transformOrigin = "0 0";
      this.el.style.userSelect = "none";
      this.el.style.touchAction = this.el.style.touchAction || "none";
      this.el.setAttribute("tabindex", this.el.getAttribute("tabindex") || "0");
      this.el.setAttribute("aria-label", this.el.getAttribute("aria-label") || "Dot voting container");
    }

    // bind public methods for convenience if needed externally
    this.attach = this.attach.bind(this);
    this.detach = this.detach.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  attach() {
    if (this._attached) return;
    this._attached = true;

    // pick handle (fall back to whole container)
    const handle = this.el.querySelector(this.opts.dragHandleSelector) || this.el;

    // make handle reliably draggable on touch
    handle.style.touchAction = handle.style.touchAction || "none";
    handle.style.userSelect = handle.style.userSelect || "none";

    // Try interact.js path first
    if (typeof interact !== "undefined") {
      try {
        // create interactable that only allows dragging from the handle selector
        this._interactable = interact(this.el).draggable({
          allowFrom: this.opts.dragHandleSelector,
          listeners: {
            start: (ev) => this._onDragStart(ev),
            move: (ev) => this._onDragMove(ev),
            end: (ev) => this._onDragEnd(ev),
          },
          inertia: false,
        });

        // Use the interactable 'down' event to manage selection logic (no container pointerdown)
        this._downHandler = (ev) => {
          // ev is an InteractEvent. Stop propagation so global capture-phase selection doesn't run.
          try {
            ev.stopPropagation();
          } catch (err) {}
          this.el.classList.add("selected");
        };
        this._interactable.on("down", this._downHandler);

        // Position according to dataset
        this.update();
        return;
      } catch (err) {
        // if interact setup fails, fall back to pointer handlers
        console.warn("DotVotingManager: interact.js path failed, falling back to pointer handlers", err);
        this._interactable = null;
      }
    }

    // FALLBACK pointer-based drag if interact isn't available
    const onPointerDown = (ev) => {
      if (ev.button && ev.button !== 0) return;
      ev.preventDefault();
      ev.stopPropagation();

      // Try to capture pointer so we keep receiving moves
      try {
        if (typeof ev.target.setPointerCapture === "function") ev.target.setPointerCapture(ev.pointerId);
      } catch (err) {}

      this._activePointerDrag = {
        startPointer: { x: ev.clientX, y: ev.clientY },
        startPos: { left: Number(this.el.dataset.worldLeft || 0), top: Number(this.el.dataset.worldTop || 0) },
      };
      this._prevZ = this.el.style.zIndex;
      this.el.style.zIndex = String(this.opts.zIndex);
      this.el.classList.add("dragging");

      const onMove = (e) => {
        if (!this._activePointerDrag) return;
        const dx = e.clientX - this._activePointerDrag.startPointer.x;
        const dy = e.clientY - this._activePointerDrag.startPointer.y;
        const newLeft = Math.round(this._activePointerDrag.startPos.left + dx);
        const newTop = Math.round(this._activePointerDrag.startPos.top + dy);
        this.el.dataset.worldLeft = String(newLeft);
        this.el.dataset.worldTop = String(newTop);
        this.update();
      };

      const onUp = (e) => {
        try {
          if (typeof ev.target.releasePointerCapture === "function") ev.target.releasePointerCapture(ev.pointerId);
        } catch (err) {}
        this._activePointerDrag = null;
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        this.el.classList.remove("dragging");
        if (this._prevZ !== undefined) this.el.style.zIndex = this._prevZ;
      };

      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerup", onUp, { passive: true });

      // store so detach() cleans them up if needed
      this._listeners.push({ node: document, type: "pointermove", fn: onMove });
      this._listeners.push({ node: document, type: "pointerup", fn: onUp });
    };

    handle.addEventListener("pointerdown", onPointerDown);
    this._listeners.push({ node: handle, type: "pointerdown", fn: onPointerDown });

    // clicking the container marks selection and dispatches toolbar selection event
    const onContainerPointerDown = (ev) => {
      ev.stopPropagation();
      this.el.classList.add("selected");
    };
    this.el.addEventListener("pointerdown", onContainerPointerDown);
    this._listeners.push({ node: this.el, type: "pointerdown", fn: onContainerPointerDown });

    // initial positioning
    this.update();
  }

  detach() {
    if (!this._attached) return;
    this._attached = false;

    // remove DOM listeners we added
    for (const l of this._listeners) {
      try {
        l.node.removeEventListener(l.type, l.fn);
      } catch (err) {}
    }
    this._listeners.length = 0;

    // remove interact handlers if present
    if (this._interactable) {
      try {
        if (this._downHandler) this._interactable.off("down", this._downHandler);
      } catch (err) {}
      try {
        if (typeof this._interactable.unset === "function") this._interactable.unset();
      } catch (err) {}
      this._interactable = null;
      this._downHandler = null;
    }

    this._activePointerDrag = null;
  }

  destroy() {
    this.detach();
    // do not remove DOM element here
  }

  // INTERACT handlers (if interact.js is present)
  _onDragStart(ev) {
    const clientX = ev.clientX != null ? ev.clientX : ev?.srcEvent?.clientX || 0;
    const clientY = ev.clientY != null ? ev.clientY : ev?.srcEvent?.clientY || 0;
    this._dragStart = { left: Number(this.el.dataset.worldLeft || 0), top: Number(this.el.dataset.worldTop || 0) };
    this._pointerStart = { x: clientX, y: clientY };
    this._prevZ = this.el.style.zIndex;
    this.el.style.zIndex = String(this.opts.zIndex);
    this.el.classList.add("dragging");
  }

  _onDragMove(ev) {
    const clientX = ev.clientX != null ? ev.clientX : ev?.srcEvent?.clientX || 0;
    const clientY = ev.clientY != null ? ev.clientY : ev?.srcEvent?.clientY || 0;
    const dx = clientX - this._pointerStart.x;
    const dy = clientY - this._pointerStart.y;
    const newLeft = Math.round(this._dragStart.left + dx);
    const newTop = Math.round(this._dragStart.top + dy);
    this.el.dataset.worldLeft = String(newLeft);
    this.el.dataset.worldTop = String(newTop);
    this.update();
  }

  _onDragEnd(ev) {
    this.el.classList.remove("dragging");
    if (this._prevZ !== undefined) this.el.style.zIndex = this._prevZ;
  }

  /**
   * Update element CSS for current position.
   * Uses dataset.worldLeft/worldTop as pixel coordinates (fixed on screen).
   */
  update() {
    const left = Number(this.el.dataset.worldLeft || 0);
    const top = Number(this.el.dataset.worldTop || 0);

    // clamp to viewport bounds
    const vpW = window.innerWidth || document.documentElement.clientWidth;
    const vpH = window.innerHeight || document.documentElement.clientHeight;
    const elW = Number(this.el.dataset.worldWidth || this.el.offsetWidth || 0);
    const elH = Number(this.el.dataset.worldHeight || this.el.offsetHeight || 0);

    const maxLeft = Math.max(0, vpW - elW);
    const maxTop = Math.max(0, vpH - elH);

    const clampedLeft = Math.min(Math.max(0, left), maxLeft);
    const clampedTop = Math.min(Math.max(0, top), maxTop);

    this.el.style.left = `${Math.round(clampedLeft)}px`;
    this.el.style.top = `${Math.round(clampedTop)}px`;
  }

  serialize() {
    return {
      left: Number(this.el.dataset.worldLeft || 0),
      top: Number(this.el.dataset.worldTop || 0),
      width: Number(this.el.dataset.worldWidth || this.el.offsetWidth),
      height: Number(this.el.dataset.worldHeight || this.el.offsetHeight),
    };
  }

  restoreFromData(data = {}) {
    if (data.left != null) this.el.dataset.worldLeft = String(data.left);
    if (data.top != null) this.el.dataset.worldTop = String(data.top);
    if (data.width != null) this.el.dataset.worldWidth = String(data.width);
    if (data.height != null) this.el.dataset.worldHeight = String(data.height);
    this.update();
  }
}
