class PeopleManager {
  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // People storage and state
    this.counter = 0;
    this.items = new Map(); // id -> { id, wrap, contentElement, handles }
    this._editingId = null; // Currently editing person ID

    // Interaction state for fallback handlers
    this._activeDrag = null;
    this._activeResize = null;
    this.currentSelectedPersonId = null;

    // Tool state
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "people";
    this.peopleState = "large"; // 'icon', 'small', 'large'

    // Container state
    this.containerVisible = false;

    // Default person properties
    this.defaults = {
      width: 200,
      height: 80,
      backgroundColor: "#ffffff",
      borderColor: "#e1e5e9",
      borderWidth: 2,
      borderRadius: 12,
      padding: 12,
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

    // Listen for stage clicks to show/hide people container
    this.stage.addEventListener("pointerdown", this._onStagePointerDown);

    // Initialize people container
    this._initPeopleContainer();

    // Initialize people editor
    this._initPeopleEditor();
  }

  // Helper method to get the hidden class
  _getHiddenClass() {
    return typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";
  }

  _getActivePerson() {
    const personItem = document.querySelector(`.person-item[data-id="${this.currentSelectedPersonId}"]`);
    if (!personItem) return {};

    const personContainer = personItem.querySelector(".person-item-container");
    const personContent = personItem.querySelector(".person-content");
    const personContentElement = personItem.querySelector(".person-content-element");
    const personContentName = personItem.querySelector(".person-content-name");
    const personContentSpan = personItem.querySelector(".person-content-span");
    const personContentOnline = personItem.querySelector(".online");

    return { personItem, personContainer, personContent, personContentElement, personContentName, personContentSpan, personContentOnline };
  }

  _initPeopleContainer() {
    // Get reference to the existing people container
    this._peopleContainer = document.getElementById("peopleContainer");

    if (this._peopleContainer) {
      // Make sure it's initially hidden
      this._peopleContainer.classList.add(this._getHiddenClass());
      this._peopleContainer.style.position = "absolute";
      this._peopleContainer.style.zIndex = "10001";

      // Make the container draggable by its header
      this._makePeopleContainerDraggable();

      // Initialize drag and drop for people items
      this._initPeopleDragDrop();
    }
  }

  _makePeopleContainerDraggable() {
    if (!this.interactAvailable || !this._peopleContainer) return;

    const header = this._peopleContainer.querySelector(".people_list_header");
    if (!header) return;

    interact(this._peopleContainer).draggable({
      allowFrom: ".people_list_header h3", // Only drag from the header title
      listeners: {
        move: (event) => {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
      inertia: false,
    });
  }

  _initPeopleDragDrop() {
    if (!this.interactAvailable || !this._peopleContainer) return;

    const peopleItems = this._peopleContainer.querySelectorAll(".person_item");

    peopleItems.forEach((personElement) => {
      interact(personElement).draggable({
        listeners: {
          start: (event) => {
            // Create drag proxy
            this._createDragProxy(event.target, event.clientX, event.clientY);

            // Hide original during drag
            event.target.style.opacity = "0.3";
          },
          move: (event) => {
            // Move the proxy instead of the original element
            if (this._dragProxy) {
              const x = (parseFloat(this._dragProxy.getAttribute("data-drag-x")) || 0) + event.dx;
              const y = (parseFloat(this._dragProxy.getAttribute("data-drag-y")) || 0) + event.dy;

              this._dragProxy.style.transform = `translate(${x}px, ${y}px)`;
              this._dragProxy.setAttribute("data-drag-x", x);
              this._dragProxy.setAttribute("data-drag-y", y);
            }
          },
          end: (event) => {
            const target = event.target;

            if (this._dragProxy) {
              const rect = this._dragProxy.getBoundingClientRect();
              const stageRect = this.stage.getBoundingClientRect();

              // Check if dropped on stage
              if (rect.left >= stageRect.left && rect.right <= stageRect.right && rect.top >= stageRect.top && rect.bottom <= stageRect.bottom) {
                // Convert screen coordinates to world coordinates
                const t = this.getTransform();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const worldX = (centerX - stageRect.left - t.x) / t.k;
                const worldY = (centerY - stageRect.top - t.y) / t.k;

                // Extract person data
                const personData = this._extractPersonData(target);

                const width = this.peopleState === "large" ? this.defaults.width : 80;
                const height = this.peopleState === "large" ? this.defaults.height : 50;

                // Create person on whiteboard
                this.createPersonFromData(worldX - width / 2, worldY - height / 2, personData);
              }

              // Remove drag proxy
              this._removeDragProxy();
            }

            // Restore original element
            target.style.opacity = "";
          },
        },
        inertia: false,
      });
    });
  }

  _createDragProxy(originalElement, startX, startY) {
    // Remove any existing proxy
    this._removeDragProxy();

    // Clone the original element
    this._dragProxy = originalElement.cloneNode(true);
    this._dragProxy.classList.add("drag-proxy");

    // Style the proxy
    this._dragProxy.style.position = "fixed";
    this._dragProxy.style.pointerEvents = "none";
    this._dragProxy.style.zIndex = "10002";
    this._dragProxy.style.opacity = "0.8";
    this._dragProxy.style.transform = "scale(0.9)";
    this._dragProxy.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
    this._dragProxy.style.borderRadius = "8px";

    // Position at cursor
    const rect = originalElement.getBoundingClientRect();
    this._dragProxy.style.left = rect.left + "px";
    this._dragProxy.style.top = rect.top + "px";
    this._dragProxy.style.width = rect.width + "px";
    this._dragProxy.style.height = rect.height + "px";

    // Initialize drag position
    this._dragProxy.setAttribute("data-drag-x", 0);
    this._dragProxy.setAttribute("data-drag-y", 0);

    // Append to body so it's not clipped by container overflow
    document.body.appendChild(this._dragProxy);
  }

  _removeDragProxy() {
    if (this._dragProxy && this._dragProxy.parentNode) {
      this._dragProxy.parentNode.removeChild(this._dragProxy);
    }
    this._dragProxy = null;
  }

  _extractPersonData(personElement) {
    const avatar = personElement.querySelector(".avatar img");
    const name = personElement.querySelector(".person_info h4");
    const email = personElement.querySelector(".person_info span");

    return {
      avatar: avatar?.src || "",
      name: name?.textContent || "Unknown",
      email: email?.textContent || "",
      online: !!personElement.querySelector(".avatar .online"),
    };
  }

  _initPeopleEditor() {
    // Get reference to the editor element (you'll need to create this in your HTML)
    this._peopleEditorEl = document.getElementById("whiteboardEditorWrapperPerson");

    if (this._peopleEditorEl) {
      if (this._peopleEditorEl.parentElement !== document.body) {
        document.body.appendChild(this._peopleEditorEl);
      }
      this._peopleEditorEl.style.zIndex = "10001";
      this._peopleEditorEl.setAttribute("tabindex", "-1");

      this._peopleEditorEl.addEventListener("pointerdown", (e) => {
        e.stopPropagation();
        const interactive = e.target.closest("select, input, button, textarea, label, [contenteditable], [role=button]");
        if (interactive) return;
        e.preventDefault();
      });

      this._peopleEditorEl.addEventListener("click", (e) => e.stopPropagation());
    }

    // Bind toolbar events (you'll need to implement based on your editor HTML)
    this._bindPeopleToolbarEvents();
  }

  _bindPeopleToolbarEvents() {
    this._personSizeSelector = document.getElementById("personSizeSelector");

    if (this._personSizeSelector) {
      this._personSizeSelector.addEventListener("change", (e) => {
        const size = e.target.value;
        const { personItem, personContent, personContentOnline } = this._getActivePerson();
        if (!personItem) return;

        if (size === "icon") {
          this.peopleState = "icon";
          personContent.classList.add(HIDDEN);
          personContentOnline.classList.add(HIDDEN);
        } else if (size === "small") {
          this.peopleState = "small";
          personContentOnline.classList.remove(HIDDEN);
          personContent.classList.add(HIDDEN);
        } else if (size === "large") {
          this.peopleState = "large";
          personContent.classList.remove(HIDDEN);
          personContentOnline.classList.remove(HIDDEN);
        }

        this._applyWorldToScreen(personItem);
        this.updateEditorPosition();
      });
    }
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("PeopleManager: Interact.js library not found. Resize/drag will use fallback handlers.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "people") {
      this.setActive(true);
      this.drawingEnabled = true;
    } else if (tool === "select") {
      this.setActive(true);
      this.drawingEnabled = false;
    } else {
      this.active = true;
      this.drawingEnabled = false;
      this.clearSelection();
      this._hidePeopleContainer();
    }
  }

  setActive(on) {
    this.active = !!on;
  }

  _generatePersonId() {
    return "person-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
  }

  _worldPoint(clientX, clientY) {
    const t = this.getTransform();
    return {
      x: (clientX - t.x) / t.k,
      y: (clientY - t.y) / t.k,
    };
  }

  _showPeopleContainer(x, y) {
    if (!this._peopleContainer) return;

    this._peopleContainer.classList.remove(this._getHiddenClass());
    this._peopleContainer.style.left = x + "px";
    this._peopleContainer.style.top = y + "px";

    // Reset any transform from dragging
    this._peopleContainer.style.transform = "";
    this._peopleContainer.removeAttribute("data-x");
    this._peopleContainer.removeAttribute("data-y");

    this.containerVisible = true;
  }

  _hidePeopleContainer() {
    if (!this._peopleContainer) return;

    this._peopleContainer.classList.add(this._getHiddenClass());
    this.containerVisible = false;
  }

  createPersonFromData(x, y, personData) {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "person-item";
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

    const personContainer = document.createElement("div");
    personContainer.className = "person-item-container";
    personContainer.style.width = "100%";
    personContainer.style.height = "100%";
    personContainer.style.backgroundColor = this.defaults.backgroundColor;
    personContainer.style.border = `${this.defaults.borderWidth}px solid ${this.defaults.borderColor}`;
    personContainer.style.borderRadius = this.defaults.borderRadius + "px";
    personContainer.style.overflow = "hidden";
    personContainer.style.boxSizing = "border-box";
    personContainer.style.display = "flex";
    personContainer.style.alignItems = "center";
    personContainer.style.gap = "12px";
    personContainer.style.padding = this.defaults.padding + "px";

    const contentElement = document.createElement("div");
    contentElement.style.display = "flex";
    contentElement.style.alignItems = "center";
    contentElement.style.gap = "12px";
    contentElement.style.width = "100%";
    contentElement.style.height = "100%";

    // Create avatar
    const avatarContainer = document.createElement("div");
    avatarContainer.style.position = "relative";
    avatarContainer.style.minWidth = "40px";
    avatarContainer.style.maxWidth = "40px";
    avatarContainer.style.width = "40px";
    avatarContainer.style.height = "40px";

    const avatar = document.createElement("img");
    avatar.src = personData.avatar;
    avatar.style.minWidth = "40px";
    avatar.style.maxWidth = "40px";
    avatar.style.width = "40px";
    avatar.style.height = "40px";
    avatar.style.borderRadius = "50%";
    avatar.style.objectFit = "cover";
    avatarContainer.appendChild(avatar);

    if (personData.online) {
      const onlineIndicator = document.createElement("span");
      onlineIndicator.className = "online";
      onlineIndicator.style.width = "10px";
      onlineIndicator.style.height = "10px";
      onlineIndicator.style.borderRadius = "50%";
      onlineIndicator.style.background = "#26f433";
      onlineIndicator.style.position = "absolute";
      onlineIndicator.style.bottom = "-2px";
      onlineIndicator.style.right = "3px";
      onlineIndicator.style.border = "2px solid white";
      avatarContainer.appendChild(onlineIndicator);
    }

    // Create person info
    const personInfo = document.createElement("div");
    personInfo.className = "person-content";
    personInfo.style.flex = "1";
    personInfo.style.minWidth = "0";

    const nameEl = document.createElement("h4");
    nameEl.classList.add("person-content-name");
    nameEl.textContent = personData.name;
    nameEl.style.color = "#1f2937";
    nameEl.style.fontSize = "14px";
    nameEl.style.fontWeight = "600";
    nameEl.style.margin = "0 0 2px 0";
    nameEl.style.overflow = "hidden";
    nameEl.style.textOverflow = "ellipsis";
    nameEl.style.whiteSpace = "nowrap";

    const emailEl = document.createElement("span");
    nameEl.classList.add("person-content-span");
    emailEl.textContent = personData.email;
    emailEl.style.color = "#6b7280";
    emailEl.style.fontSize = "12px";
    emailEl.style.fontWeight = "400";
    emailEl.style.margin = "0";
    emailEl.style.overflow = "hidden";
    emailEl.style.textOverflow = "ellipsis";
    emailEl.style.whiteSpace = "nowrap";
    emailEl.style.display = "block";

    personInfo.appendChild(nameEl);
    personInfo.appendChild(emailEl);

    contentElement.appendChild(avatarContainer);
    contentElement.appendChild(personInfo);

    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.position = "absolute";
    handles.style.top = "0";
    handles.style.left = "0";
    handles.style.width = "100%";
    handles.style.height = "100%";
    handles.style.pointerEvents = "none";
    handles.style.display = "none";

    // Create resize handles
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

    personContainer.appendChild(contentElement);
    wrap.appendChild(personContainer);
    wrap.appendChild(handles);

    this.stage.appendChild(wrap);
    this.items.set(id, {
      id,
      wrap,
      contentElement,
      handles,
      personData,
    });

    this._applyWorldToScreen(wrap);
    this._wirePersonEvents(wrap, id);
    this._initInteractOnPerson(wrap, id);

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

  _wirePersonEvents(wrap, id) {
    // Selection on click
    wrap.addEventListener("click", (e) => {
      if (e.target.closest(".resize-handle")) return;
      this._selectPerson(wrap);
      e.stopPropagation();
    });

    wrap.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (wrap.dataset.locked === "true") return;
      this._showPersonEditor(wrap);
      this._selectPerson(wrap);
    });
  }

  _selectPerson(wrap) {
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
    this.currentSelectedPersonId = id;

    // Dispatch selection event for toolbar
    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: {
          type: "person",
          id: id,
          locked: isLocked,
        },
      })
    );

    this._showPersonEditor(wrap);
  }

  clearSelection() {
    this.currentSelectedPersonId = null;

    this._hidePersonEditor();

    document.querySelectorAll(".person-item.show-handles").forEach((person) => {
      person.classList.remove("show-handles");
      const handles = person.querySelector(".handles");
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

  _showPersonEditor(wrap) {
    if (!this._peopleEditorEl) return;

    this._peopleEditorEl.classList.remove(this._getHiddenClass());
    this._positionPersonEditor(wrap);
  }

  _hidePersonEditor() {
    if (!this._peopleEditorEl) return;

    this._peopleEditorEl.classList.add(this._getHiddenClass());
  }

  _positionPersonEditor(wrap = null) {
    if (!this._peopleEditorEl) return;

    const editor = this._peopleEditorEl;
    const gap = 8;

    const width = this.peopleState === "large" ? this.defaults.width : 80;
    const height = this.peopleState === "large" ? this.defaults.height : 50;

    if (wrap) {
      const t = this.getTransform();
      const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
      const worldTop = parseFloat(wrap.dataset.worldTop || 0);
      const worldWidth = parseFloat(wrap.dataset.worldWidth || width);

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
    }
  }

  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const width = this.peopleState === "large" ? this.defaults.width : 80;
    const height = this.peopleState === "large" ? this.defaults.height : 50;

    const t = this.getTransform();
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const worldTop = parseFloat(wrap.dataset.worldTop || 0);
    const worldWidth = parseFloat(wrap.dataset.worldWidth || width);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || height);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    const scaleX = (worldWidth * t.k) / width;
    const scaleY = (worldHeight * t.k) / height;

    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    wrap.style.width = width + "px";
    wrap.style.height = height + "px";

    wrap.style.transform = `scale(${scaleX}, ${scaleY})`;
    wrap.style.transformOrigin = "0 0";
  }

  _initInteractOnPerson(wrap, id) {
    if (!this.interactAvailable) return;

    interact(wrap)
      .draggable({
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectPerson(wrap);
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
            this.updateEditorPosition();
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectPerson(wrap);
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
            wrap.dataset.worldWidth = String(Math.max(150, newWorldWidth));
            wrap.dataset.worldHeight = String(Math.max(60, newWorldHeight));

            this._applyWorldToScreen(wrap);
            this.updateEditorPosition();
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 150, height: 60 },
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

      if (wrap.dataset.locked === "true") return;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      const newWorldLeft = startLeftTop.left + dx;
      const newWorldTop = startLeftTop.top + dy;

      wrap.dataset.worldLeft = String(newWorldLeft);
      wrap.dataset.worldTop = String(newWorldTop);

      this._applyWorldToScreen(wrap);
      this.updateEditorPosition();
    }

    if (this._activeResize) {
      const { id, handle, startPointerWorld, startWorldLeft, startWorldTop, startWorldWidth, startWorldHeight } = this._activeResize;
      const item = this.items.get(id);
      if (!item) return;

      const { wrap } = item;

      if (wrap.dataset.locked === "true") return;

      const dx = world.x - startPointerWorld.x;
      const dy = world.y - startPointerWorld.y;
      let newLeft = startWorldLeft;
      let newTop = startWorldTop;
      let newWidth = startWorldWidth;
      let newHeight = startWorldHeight;
      const minW = 150;
      const minH = 60;

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
      this.updateEditorPosition();
    }
  }

  _onDocPointerUp(e) {
    this._activeDrag = null;
    this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
  }

  _onStagePointerDown(e) {
    if (e.target === this.stage && this.activeTool === "people" && this.active) {
      // Show people container at click position
      this._showPeopleContainer(e.clientX, e.clientY);

      if (this.app && this.app.setTool) {
        this.app.setTool("select");
      }

      e.stopPropagation();
      e.preventDefault();
    }
  }

  _onPointerDown(e) {
    if (!this.active || !this.drawingEnabled) return;
    if (this.activeTool !== "people") return;
    if (e.button && e.button !== 0) return;

    if (e.target.closest(".person-item")) return;
    if (e.target.closest(".people_container")) return;
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
    this.updateEditorPosition();
  }

  updateEditorPosition() {
    if (!this._peopleEditorEl || this._peopleEditorEl.classList.contains(this._getHiddenClass())) {
      return;
    }

    const wrap = this.currentSelectedPersonId ? this.items.get(this.currentSelectedPersonId)?.wrap : null;

    if (wrap) {
      this._positionPersonEditor(wrap);
    }
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;

    if (this.currentSelectedPersonId === id) {
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

      if (this.currentSelectedPersonId === id) {
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

  getPersonScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, personData } = item;

    return {
      id,
      left: parseFloat(wrap.dataset.worldLeft || 0),
      top: parseFloat(wrap.dataset.worldTop || 0),
      width: parseFloat(wrap.dataset.worldWidth || this.defaults.width),
      height: parseFloat(wrap.dataset.worldHeight || this.defaults.height),
      personData: personData,
      locked: wrap.dataset.locked === "true",
    };
  }

  restoreFromData(data) {
    const id = this.createPersonFromData(data.left, data.top, data.personData);
    const item = this.items.get(id);
    if (!item) return id;

    const { wrap } = item;

    wrap.dataset.worldWidth = String(data.width || this.defaults.width);
    wrap.dataset.worldHeight = String(data.height || this.defaults.height);

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
      wrap.style.cursor = "default";
    }

    this._applyWorldToScreen(wrap);
    return id;
  }

  // Get all people data for bulk operations
  getAllPeople() {
    const people = [];
    for (const id of this.items.keys()) {
      const personData = this.serialize(id);
      if (personData) {
        people.push(personData);
      }
    }
    return people;
  }

  // Clear all people
  clearAll() {
    this.clearSelection();
    for (const id of this.items.keys()) {
      this.remove(id);
    }
    this.counter = 0;
  }

  // Get person by ID
  getPerson(id) {
    return this.items.get(id);
  }

  // Check if person exists
  hasPerson(id) {
    return this.items.has(id);
  }

  // Get total number of people
  getPersonCount() {
    return this.items.size;
  }

  // Cleanup method
  destroy() {
    this.clearAll();

    if (this._onToolChangeHandler) {
      this.app?.toolManager?.removeEventListener("change", this._onToolChangeHandler);
    }

    if (this._unsubTool) {
      this._unsubTool();
    }

    this.stage.removeEventListener("pointerdown", this._onStagePointerDown);
    this.detach();

    if (this._peopleContainer) {
      this._hidePeopleContainer();
    }
  }
}
