class CardManager {
  constructor(stageNode, getTransform, app) {
    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;

    // fallback for HIDDEN constant
    this._HIDDEN = typeof HIDDEN !== "undefined" ? HIDDEN : "hidden";

    // Card storage and state
    this.counter = 0;
    this.items = new Map(); // id -> { id, wrap, contentElement, handles }

    // Interaction state for fallback handlers
    this._activeDrag = null;
    this._activeResize = null;
    this.currentSelectedCardId = null;

    // Tool state
    this.active = false;
    this.drawingEnabled = false;
    this.activeTool = "card";

    // Default card properties
    this.defaults = {
      width: 280,
      height: 160,
      backgroundColor: "#ffffff",
      borderColor: "#e1e5e9",
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 14,
      padding: 16,
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

    this._cardEditorEl = document.getElementById("whiteboardEditorWrapperCard");

    // Initialize Interact.js support
    this._initializeInteract();

    // Listen for stage clicks to clear selections
    this.stage.addEventListener("pointerdown", this._onStagePointerDown);

    // Bind UI events for card toolbar (if exists)
    this._bindCardToolbarEvents();

    //
    this._initCardToolbarEditor();

    // Initialize dot voting drag and drop
    this._initDotVotingDragDrop();
  }

  _initDotVotingDragDrop() {
    // Initialize drag listeners for dot items
    this._setupDotDragListeners();
  }

  _setupDotDragListeners() {
    const dotContainer = document.getElementById("dotVotingContainer");
    if (!dotContainer) return;

    const dots = dotContainer.querySelectorAll(".dot");

    dots.forEach((dot) => {
      // HTML5 drag events
      dot.setAttribute("draggable", "true");
      dot.addEventListener("dragstart", (e) => {
        const dotColor = this._getDotColor(dot);

        // Store dot data for transfer
        try {
          e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({
              type: "dot-vote",
              color: dotColor,
              sourceElement: dot.className,
            })
          );
        } catch (err) {
          // Some browsers restrict setData during dragstart in certain contexts
        }

        // Set drag image (optional - makes drag more visible)
        const dragImage = dot.cloneNode(true);
        dragImage.style.transform = "scale(1.2)";
        dragImage.style.position = "absolute";
        dragImage.style.top = "-9999px";
        document.body.appendChild(dragImage);
        try {
          e.dataTransfer.setDragImage(dragImage, 12, 12);
        } catch (err) {
          // ignore if browser disallows
        }

        // Clean up drag image after drag starts
        setTimeout(() => {
          if (document.body.contains(dragImage)) {
            document.body.removeChild(dragImage);
          }
        }, 0);

        // Add visual feedback
        dot.style.opacity = "0.5";
      });

      dot.addEventListener("dragend", (e) => {
        // Reset visual feedback
        dot.style.opacity = "1";
      });
    });
  }

  _getDotColor(dotElement) {
    // Extract color from dot classes
    const classList = Array.from(dotElement.classList);
    const colorClasses = classList.filter((cls) => cls !== "dot");
    return colorClasses[0] || "gray";
  }

  _getColorValue(colorName) {
    const colorMap = {
      red: "#ef4444",
      blue: "#3b82f6",
      green: "#22c55e",
      yellow: "#eab308",
      purple: "#a855f7",
      orange: "#f97316",
      teal: "#14b8a6",
      pink: "#ec4899",
      lime: "#84cc16",
      navy: "#1e40af",
      cyan: "#06b6d4",
      gray: "#6b7280",
    };
    return colorMap[colorName] || "#6b7280";
  }

  /* =========================
     NEW: vote-counter helpers
     ========================= */

  // Create or increment the color counter for the card wrap
  _incrementCardDotCounter(cardWrap, dotColor) {
    if (!cardWrap) return;

    let counterContainer = cardWrap.querySelector(".card-vote-counters");
    if (!counterContainer) {
      counterContainer = document.createElement("div");
      counterContainer.className = "card-vote-counters";

      const cardContainer = cardWrap.querySelector(".card-item-container-nest");
      if (cardContainer) {
        cardContainer.appendChild(counterContainer);
      } else {
        // fallback to bottom-card-contents
        const bottom = cardWrap.querySelector(".bottom-card-contents");
        if (bottom) bottom.appendChild(counterContainer);
      }
    }

    let colorCounter = counterContainer.querySelector(`.counter-${dotColor}`);
    if (!colorCounter) {
      colorCounter = document.createElement("span");
      colorCounter.className = `counter-${dotColor}`;
      colorCounter.style.display = "flex";
      colorCounter.style.alignItems = "center";
      colorCounter.style.gap = "6px";

      const colorDot = document.createElement("span");
      colorDot.style.width = "8px";
      colorDot.style.height = "8px";
      colorDot.style.borderRadius = "50%";
      colorDot.style.backgroundColor = this._getColorValue(dotColor);

      const countText = document.createElement("span");
      countText.className = "count-text";
      countText.textContent = "0";

      colorCounter.appendChild(colorDot);
      colorCounter.appendChild(countText);
      counterContainer.appendChild(colorCounter);
    }

    const countText = colorCounter.querySelector(".count-text");
    const currentCount = parseInt(countText.textContent, 10) || 0;
    countText.textContent = String(currentCount + 1);
  }

  // Set a color count directly (used when duplicating/restoring)
  _setCardDotCount(cardWrap, dotColor, count = 0) {
    if (!cardWrap) return;
    let counterContainer = cardWrap.querySelector(".card-vote-counters");
    if (!counterContainer) {
      counterContainer = document.createElement("div");
      counterContainer.className = "card-vote-counters";
      const cardContainer = cardWrap.querySelector(".card-item-container-nest");
      if (cardContainer) cardContainer.appendChild(counterContainer);
      else {
        const bottom = cardWrap.querySelector(".bottom-card-contents");
        if (bottom) bottom.appendChild(counterContainer);
      }
    }

    let colorCounter = counterContainer.querySelector(`.counter-${dotColor}`);
    if (!colorCounter) {
      colorCounter = document.createElement("span");
      colorCounter.className = `counter-${dotColor}`;
      colorCounter.style.display = "flex";
      colorCounter.style.alignItems = "center";
      colorCounter.style.gap = "3px";

      const colorDot = document.createElement("span");
      colorDot.style.width = "14px";
      colorDot.style.height = "14px";
      colorDot.style.borderRadius = "50%";
      colorDot.style.backgroundColor = this._getColorValue(dotColor);

      const countText = document.createElement("span");
      countText.className = "count-text";
      countText.textContent = String(count);

      colorCounter.appendChild(colorDot);
      colorCounter.appendChild(countText);
      counterContainer.appendChild(colorCounter);
    } else {
      const countText = colorCounter.querySelector(".count-text");
      countText.textContent = String(count);
    }
  }

  // getCardDots now returns a mapping object { color: count, ... }
  getCardDots(cardId) {
    const item = this.items.get(cardId);
    if (!item) return {};

    const counterContainer = item.wrap.querySelector(".card-vote-counters");
    if (!counterContainer) return {};

    const result = {};
    Array.from(counterContainer.children).forEach((child) => {
      const cls = Array.from(child.classList).find((c) => c.startsWith("counter-"));
      if (!cls) return;
      const color = cls.replace("counter-", "");
      const countText = child.querySelector(".count-text");
      const count = parseInt(countText ? countText.textContent : "0", 10) || 0;
      result[color] = count;
    });

    return result;
  }

  /* =========================
     Drop listeners (NO dot elements)
     ========================= */
  _addDropListenersToCard(cardWrap) {
    // Prevent default to allow drop
    cardWrap.addEventListener("dragover", (e) => {
      e.preventDefault();
      try {
        e.dataTransfer.dropEffect = "copy";
      } catch (err) {}
      cardWrap.style.boxShadow = "0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.3)";
    });

    cardWrap.addEventListener("dragleave", (e) => {
      // Only remove feedback if truly leaving the card
      if (!cardWrap.contains(e.relatedTarget)) {
        cardWrap.style.boxShadow = "";
      }
    });

    cardWrap.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      cardWrap.style.boxShadow = "";

      try {
        const raw = e.dataTransfer.getData("text/plain");
        const data = raw ? JSON.parse(raw) : null;

        if (data && data.type === "dot-vote" && data.color) {
          // increment the counter only
          this._incrementCardDotCounter(cardWrap, data.color);

          // subtle scale animation
          const prevTransform = cardWrap.style.transform || "";
          cardWrap.style.transform = prevTransform + " scale(1.02)";
          setTimeout(() => {
            cardWrap.style.transform = (cardWrap.style.transform || "").replace(" scale(1.02)", "");
          }, 150);

          // dispatch event
          window.dispatchEvent(
            new CustomEvent("card-dot-added", {
              detail: {
                cardId: parseInt(cardWrap.dataset.id),
                dotColor: data.color,
              },
            })
          );
        }
      } catch (error) {
        console.warn("Invalid drag data:", error);
      }
    });
  }

  //
  _createPeopleIntoCard() {
    const peopleCard = document.createElement("div");
    peopleCard.classList.add("card-item-people");

    const peopleCardImage = document.createElement("img");
    peopleCardImage.src = "https://github.com/AIEraDev.png";
    peopleCardImage.style.width = "20px";
    peopleCardImage.style.height = "20px";
    peopleCardImage.style.borderRadius = "50%";
    peopleCardImage.style.marginRight = "8px";

    const peopleSpan = document.createElement("span");
    peopleSpan.textContent = "Abdulkabir Musa";

    peopleCard.appendChild(peopleCardImage);
    peopleCard.appendChild(peopleSpan);
    return peopleCard;
  }

  //
  _createLinkIntoCard(link) {
    const peopleLinkCard = document.createElement("div");
    peopleLinkCard.classList.add("card-item-link");

    const peopleSpan = document.createElement("span");
    peopleSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="#000000" d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"/></svg>`;

    const peopleLink = document.createElement("a");
    const fullLinkPath = `https://${link}`;

    peopleLink.textContent = fullLinkPath;
    peopleLink.href = fullLinkPath;
    peopleLink.target = "_blank";
    peopleLink.setAttribute("title", fullLinkPath);

    peopleLinkCard.appendChild(peopleSpan);
    peopleLinkCard.appendChild(peopleLink);
    return peopleLinkCard;
  }

  //
  _createCalenderIntoCard() {
    const calenderCard = document.createElement("div");
    calenderCard.classList.add("card-item-calender");

    const peopleIcon = document.createElement("span");
    peopleIcon.innerHTML = `<svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.50008 18.3337H17.5001C17.7211 18.3337 17.9331 18.2459 18.0893 18.0896C18.2456 17.9333 18.3334 17.7213 18.3334 17.5003V5.00032C18.3334 4.77931 18.2456 4.56735 18.0893 4.41107C17.9331 4.25479 17.7211 4.16699 17.5001 4.16699H14.1667V2.50033C14.1667 2.27931 14.0789 2.06735 13.9227 1.91107C13.7664 1.75479 13.5544 1.66699 13.3334 1.66699C13.1124 1.66699 12.9004 1.75479 12.7442 1.91107C12.5879 2.06735 12.5001 2.27931 12.5001 2.50033V4.16699H7.50008V2.50033C7.50008 2.27931 7.41228 2.06735 7.256 1.91107C7.09972 1.75479 6.88776 1.66699 6.66675 1.66699C6.44573 1.66699 6.23377 1.75479 6.07749 1.91107C5.92121 2.06735 5.83341 2.27931 5.83341 2.50033V4.16699H2.50008C2.27907 4.16699 2.06711 4.25479 1.91083 4.41107C1.75455 4.56735 1.66675 4.77931 1.66675 5.00032V17.5003C1.66675 17.7213 1.75455 17.9333 1.91083 18.0896C2.06711 18.2459 2.27907 18.3337 2.50008 18.3337ZM3.33341 5.83366H16.6667V8.33366H3.33341V5.83366ZM3.33341 10.0003H16.6667V16.667H3.33341V10.0003Z" fill="black"/></svg>`;

    const calenderEL = document.createElement("span");

    const date = new Date();
    const structuredDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    calenderEL.textContent = `Updated: ${structuredDate}`;
    calenderEL.setAttribute("title", "Today's Calender");

    calenderCard.appendChild(peopleIcon);
    calenderCard.appendChild(calenderEL);
    return calenderCard;
  }

  _getActiveCard() {
    const cardItem = document.querySelector(`.card-item[data-id="${this.currentSelectedCardId}"]`);
    if (!cardItem) return {};

    const cardItemContainer = cardItem.querySelector(".card-item-container");
    const cardItemContainerNest = cardItem.querySelector(".card-item-container-nest");
    const cardTitle = cardItem.querySelector(".card-title");
    const cardContent = cardItem.querySelector(".card-content");
    const bottomCardContents = cardItem.querySelector(".bottom-card-contents");
    const cardItemPeople = cardItem.querySelector(".card-item-people");
    const cardItemLink = cardItem.querySelector(".card-item-link");
    const cardItemCalender = cardItem.querySelector(".card-item-calender");

    return {
      cardItem,
      cardItemContainer,
      cardItemContainerNest,
      cardContent,
      bottomCardContents,
      cardItemPeople,
      cardItemLink,
      cardTitle,
      cardItemCalender,
    };
  }

  _initCardToolbarEditor() {
    const addPeopleToCard = document.getElementById("addPeopleToCard");
    const addLinkToCard = document.getElementById("addLinkToCard");
    const addCheckBoxToCard = document.getElementById("addCheckBoxToCard");
    const addCalenderToCard = document.getElementById("addCalenderToCard");
    const dropDownMenuForCard = document.getElementById("dropDownMenuForCard");
    const colorPickerContainerCard = document.getElementById("colorPickerContainerCard");
    const colorPickerContainerCardInput = colorPickerContainerCard ? colorPickerContainerCard.querySelector("input") : null;
    const addCardLink = document.getElementById("addCardLink");
    const addCardLinkInput = document.getElementById("addCardLinkInput");

    // Card Color
    if (colorPickerContainerCard && colorPickerContainerCardInput) {
      colorPickerContainerCard.addEventListener("click", () => {
        colorPickerContainerCardInput.click();
      });

      colorPickerContainerCardInput.addEventListener("input", (e) => {
        const { cardItemContainer } = this._getActiveCard();
        if (cardItemContainer) cardItemContainer.style.backgroundColor = e.target.value;
      });
    }

    // Card People
    if (addPeopleToCard) {
      addPeopleToCard.addEventListener("click", (e) => {
        const { bottomCardContents, cardItemPeople } = this._getActiveCard();
        if (!bottomCardContents) return;

        if (!cardItemPeople) {
          const content = this._createPeopleIntoCard();
          bottomCardContents.appendChild(content);
          addPeopleToCard.classList.add("active");
        } else {
          cardItemPeople.remove();
          addPeopleToCard.classList.remove("active");
        }
      });
    }

    // Card Link
    if (addLinkToCard && addCardLink) {
      addLinkToCard.addEventListener("click", (e) => {
        const isExpanded = addLinkToCard.getAttribute("aria-expanded") === "true";
        const { bottomCardContents, cardItemLink } = this._getActiveCard();

        if (bottomCardContents && cardItemLink) {
          cardItemLink.remove();
          addLinkToCard.classList.remove("active");
        } else {
          addLinkToCard.setAttribute("aria-expanded", !isExpanded);
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          addLinkToCard.removeAttribute("aria-expanded");
        }
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest(".card_editor_link_container_wrapper") && e.target !== addLinkToCard) {
          addLinkToCard.removeAttribute("aria-expanded");
        }
      });

      addCardLink.addEventListener("click", (e) => {
        e.preventDefault();

        const { bottomCardContents, cardItemLink } = this._getActiveCard();
        const addCardLinkInputValue = addCardLinkInput ? addCardLinkInput.value : "";

        if (!bottomCardContents || !addCardLinkInputValue) return;

        if (!cardItemLink) {
          const content = this._createLinkIntoCard(addCardLinkInputValue);
          bottomCardContents.appendChild(content);
          addLinkToCard.removeAttribute("aria-expanded");
          addLinkToCard.classList.add("active");
        }
      });
    }

    // Mark has completed :)
    if (addCheckBoxToCard) {
      addCheckBoxToCard.addEventListener("click", () => {
        const { cardTitle } = this._getActiveCard();
        if (!cardTitle) return;
        const checkboxSpan = cardTitle.querySelector("span");
        if (!checkboxSpan) return;

        checkboxSpan.classList.remove(this._HIDDEN);

        if (addCheckBoxToCard.classList.contains("active")) {
          addCheckBoxToCard.classList.remove("active");
          checkboxSpan.classList.add(this._HIDDEN);
        } else {
          addCheckBoxToCard.classList.add("active");
          checkboxSpan.classList.remove(this._HIDDEN);
        }
      });
    }

    // Add calender for the card
    if (addCalenderToCard) {
      addCalenderToCard.addEventListener("click", () => {
        const { bottomCardContents, cardItemCalender } = this._getActiveCard();
        if (!bottomCardContents) return;

        if (!cardItemCalender) {
          const content = this._createCalenderIntoCard();
          bottomCardContents.appendChild(content);
          addCalenderToCard.classList.add("active");
        } else {
          cardItemCalender.remove();
          addCalenderToCard.classList.remove("active");
        }
      });
    }

    // Card Editor Dropdown
    if (dropDownMenuForCard) {
      dropDownMenuForCard.addEventListener("click", () => {
        const isExpanded = dropDownMenuForCard.getAttribute("aria-expanded") === "true";
        dropDownMenuForCard.setAttribute("aria-expanded", !isExpanded);
      });
    }

    // Delete Card
    if (this._cardEditorEl) {
      const deleteBtn = this._cardEditorEl.querySelector(".deleteCard");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          this.remove(this.currentSelectedCardId);
          this._hideCardEditorWrapper();
        });
      }

      // Lock Card
      const lockBtnEl = this._cardEditorEl.querySelector(".lockCard");
      if (lockBtnEl) {
        lockBtnEl.addEventListener("click", (e) => {
          if (this.currentSelectedCardId !== null) {
            const isLocked = this.lockUnlockCard(this.currentSelectedCardId);
            const lockBtn = e.target.closest(".lockCard");
            if (isLocked) {
              lockBtn.classList.add("locked");
              lockBtn.title = "Unlock Card";
            } else {
              lockBtn.classList.remove("locked");
              lockBtn.title = "Lock Card";
            }
            if (isLocked) {
              this._hideCardEditorWrapper();
            }
          }
        });
      }

      // Duplicate Card
      const dupBtn = this._cardEditorEl.querySelector(".duplicateCard");
      if (dupBtn) {
        dupBtn.addEventListener("click", (e) => {
          if (this.currentSelectedCardId !== null) {
            const newId = this.duplicateCard(this.currentSelectedCardId);
            if (newId) {
              console.log(`Card duplicated. Original: ${this.currentSelectedCardId}, New: ${newId}`);
            }
          }
        });
      }
    }
  }

  _initializeInteract() {
    if (typeof interact === "undefined") {
      console.warn("CardManager: Interact.js library not found. Resize/drag will use fallback handlers.");
      this.interactAvailable = false;
      return;
    }
    this.interactAvailable = true;
  }

  _onAppToolChange(tool) {
    this.activeTool = tool;

    if (tool === "card") {
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

  _generateCardId() {
    return "card-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
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
    const worldWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || this.defaults.height);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    const scaleX = (worldWidth * t.k) / this.defaults.width;
    const scaleY = (worldHeight * t.k) / this.defaults.height;

    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    wrap.style.width = this.defaults.width + "px";
    wrap.style.height = this.defaults.height + "px";

    wrap.style.transform = `scale(${scaleX}, ${scaleY})`;
    wrap.style.transformOrigin = "0 0";

    const contentElement = wrap.querySelector(".card-content");
    if (contentElement) {
      contentElement.style.wordBreak = "break-word";
      contentElement.style.overflowWrap = "break-word";
    }
  }

  _positionCardEditorWrapper(wrap = null) {
    const editor = this._cardEditorEl;
    const viewport = this.app && this.app.viewportNode ? this.app.viewportNode : document.getElementById("viewport");

    if (!editor || !viewport) return;

    const gap = 8;
    let left, top;

    if (wrap) {
      const vpRect = viewport.getBoundingClientRect();
      const vpScrollLeft = viewport.scrollLeft || 0;
      const vpScrollTop = viewport.scrollTop || 0;

      const wrapRect = wrap.getBoundingClientRect();

      const cardLeft = wrapRect.left - vpRect.left + vpScrollLeft;
      const cardTop = wrapRect.top - vpRect.top + vpScrollTop;
      const cardWidth = wrapRect.width;

      left = cardLeft + cardWidth / 2 - editor.offsetWidth / 2;
      const candidateTop = cardTop - editor.offsetHeight - gap;

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
    editor.style.top = `${Math.round(top)}px`;
  }

  updateEditorToolbarPosition() {
    if (!this._cardEditorEl || this._cardEditorEl.classList.contains(this._HIDDEN)) return;

    const wrap = this.currentSelectedCardId != null && this.items.has(this.currentSelectedCardId) ? this.items.get(this.currentSelectedCardId).wrap : null;

    if (wrap) {
      this._positionCardEditorWrapper(wrap);
    } else {
      const sel = this.currentSelectedCardId != null ? this.items.get(this.currentSelectedCardId) : null;
      if (sel && sel.wrap) this._positionCardEditorWrapper(sel.wrap);
    }
  }

  _showCardEditorWrapper(wrap) {
    if (!this._cardEditorEl) return;

    this._cardEditorEl.classList.remove(this._HIDDEN);

    this._positionCardEditorWrapper(wrap);

    this._keepEditorVisible = true;
  }

  _hideCardEditorWrapper() {
    if (this._cardEditorEl) {
      this._cardEditorEl.classList.add(this._HIDDEN);
      const dd = this._cardEditorEl.querySelector("#dropDownMenuForCard");
      if (dd) dd.removeAttribute("aria-expanded");
    }
  }

  create(x, y, title = "Title", content = "Type something") {
    const id = ++this.counter;

    const wrap = document.createElement("div");
    wrap.className = "card-item";
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

    const cardContainer = document.createElement("div");
    cardContainer.className = "card-item-container";
    cardContainer.style.width = "100%";
    cardContainer.style.height = "100%";
    cardContainer.style.overflow = "hidden";

    const cardContainerNest = document.createElement("div");
    cardContainerNest.className = "card-item-container-nest";
    cardContainerNest.style.display = "flex";
    cardContainerNest.style.flexDirection = "column";
    cardContainerNest.style.width = "100%";
    cardContainerNest.style.height = "100%";
    cardContainerNest.style.boxSizing = "border-box";

    const contentElementHeader = document.createElement("div");
    contentElementHeader.classList.add("card-title");

    const contentHeaderCheck = document.createElement("span");
    contentHeaderCheck.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><path fill="#ffffff" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>`;
    contentHeaderCheck.classList.add("content-header-check");
    contentHeaderCheck.classList.add(this._HIDDEN);

    const contentElementH1 = document.createElement("h1");
    contentElementH1.contentEditable = "false";
    contentElementH1.innerHTML = title;

    const contentElement = document.createElement("div");
    contentElement.className = "card-content";
    contentElement.innerHTML = content;
    contentElement.style.fontSize = this.defaults.fontSize + "px";
    contentElement.style.margin = "0";
    contentElement.style.padding = "0";
    contentElement.style.lineHeight = "1.4";
    contentElement.style.color = "#333";
    contentElement.style.outline = "none";
    contentElement.style.flex = "1";
    contentElement.style.overflow = "hidden";
    contentElement.style.wordBreak = "break-word";
    contentElement.style.overflowWrap = "break-word";
    contentElement.style.userSelect = "none";

    const bottomCardElement = document.createElement("div");
    bottomCardElement.className = "bottom-card-contents";

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
      this._positionHandle(handle, pos);
      handle.style.pointerEvents = "auto";

      // fallback resize start
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

    contentElementHeader.appendChild(contentHeaderCheck);
    contentElementHeader.appendChild(contentElementH1);
    cardContainerNest.appendChild(contentElementHeader);

    cardContainerNest.appendChild(contentElement);
    cardContainerNest.appendChild(bottomCardElement);
    cardContainer.appendChild(cardContainerNest);
    wrap.appendChild(cardContainer);
    wrap.appendChild(handles);

    // ADD DROP LISTENERS TO THE CARD WRAP (counters-only)
    this._addDropListenersToCard(wrap);

    this.stage.appendChild(wrap);
    this.items.set(id, {
      id,
      wrap,
      contentElementH1,
      contentElement,
      handles,
    });

    this._applyWorldToScreen(wrap);
    this._wireCardEvents(wrap, id);
    this._initInteractOnCard(wrap, id);

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

  //
  _wireCardEvents(wrap, id) {
    const contentElement = wrap.querySelector(".card-content");

    // selection on click
    wrap.addEventListener("click", (e) => {
      e.stopPropagation();
      if (e.target.closest(".resize-handle")) return;
      if (contentElement.isContentEditable && document.activeElement === contentElement) return;

      const contentHeaderCheck = e.target.closest(".content-header-check");
      if (contentHeaderCheck) {
        const { cardTitle } = this._getActiveCard();
        if (!cardTitle) return;
        const h1 = cardTitle.querySelector("h1");
        if (contentHeaderCheck.classList.contains("active")) {
          contentHeaderCheck.classList.remove("active");
          if (h1) h1.style.textDecoration = "none";
        } else {
          contentHeaderCheck.classList.add("active");
          if (h1) h1.style.textDecoration = "line-through";
        }
        return;
      }

      this._selectCard(wrap);

      if (this._cardEditorEl && this.currentSelectedCardId === id) {
        this._positionCardEditorWrapper(wrap);
      }
    });

    // dblclick
    wrap.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (wrap.dataset.locked === "true") return;

      const cardContent = e.target.closest(".card-content");

      this._selectCard(wrap);

      if (this._cardEditorEl && this.currentSelectedCardId === id) {
        this._positionCardEditorWrapper(wrap);
      }

      if (cardContent) {
        this.startEditing(id, "content");
        return;
      }

      this.startEditing(id, "title");
    });

    // focusin
    contentElement.addEventListener("focusin", () => {
      contentElement.contentEditable = "true";
      wrap.classList.add("editing");
    });

    // focusout
    contentElement.addEventListener("focusout", (e) => {
      contentElement.contentEditable = "false";
      contentElement.style.userSelect = "none";

      wrap.classList.remove("editing");

      // if focus moved to the editor itself we keep editor visible
      // otherwise if editor shouldn't be kept visible we hide it
      if (!e.relatedTarget?.closest || !e.relatedTarget?.closest("#whiteboardEditorWrapperCard")) {
        if (!this._keepEditorVisible) this._hideCardEditorWrapper();
      }
    });

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (document.activeElement && document.activeElement === contentElement) {
          document.activeElement.blur();
        }
      }
    };
    contentElement.addEventListener("keydown", handleEscape);
  }

  _selectCard(wrap) {
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

    const id = parseInt(wrap.dataset.id);
    this.currentSelectedCardId = id;
    const locked = wrap.dataset.locked === "true";

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "card", id, locked, preferBottom: true } }));

    this._showCardEditorWrapper(wrap);
  }

  // type = 'title' | 'content'
  startEditing(id, type = "title") {
    const item = this.items.get(id);
    if (!item) return;

    const { wrap, contentElement, contentElementH1 } = item;
    if (wrap.dataset.locked === "true") return;

    let element = type === "title" ? contentElementH1 : contentElement;

    element.contentEditable = "true";
    element.style.userSelect = "text";

    element.focus();
    this._selectAllText(element);

    wrap.classList.add("editing");
  }

  _selectAllText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // Update the clearSelection method to not interfere with dot voting
  clearSelection() {
    this.currentSelectedCardId = null;

    this._hideCardEditorWrapper();

    document.querySelectorAll(".card-item.show-handles").forEach((card) => {
      card.classList.remove("show-handles");

      // Reset any drag-over styling but preserve dot voting elements
      card.style.boxShadow = "";

      const handles = card.querySelector(".handles");
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

  _initInteractOnCard(wrap, id) {
    if (!this.interactAvailable) return;

    interact(wrap)
      .draggable({
        listeners: {
          start: (event) => {
            if (wrap.dataset.locked === "true") return false;
            this._selectCard(wrap);
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

            if (this._cardEditorEl && !this._cardEditorEl.classList.contains(this._HIDDEN) && this.currentSelectedCardId === id) {
              this._positionCardEditorWrapper(wrap);
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
            this._selectCard(wrap);
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
            wrap.dataset.worldWidth = String(Math.max(120, newWorldWidth));
            wrap.dataset.worldHeight = String(Math.max(80, newWorldHeight));

            this._applyWorldToScreen(wrap);

            if (this._cardEditorEl && !this._cardEditorEl.classList.contains(this._HIDDEN) && this.currentSelectedCardId === id) {
              this._positionCardEditorWrapper(wrap);
            }
          },
        },
        modifiers: [
          interact.modifiers.restrictSize({
            min: { width: 120, height: 80 },
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

      if (this._cardEditorEl && !this._cardEditorEl.classList.contains(this._HIDDEN) && this.currentSelectedCardId === id) {
        this._positionCardEditorWrapper(wrap);
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
      const minW = 120;
      const minH = 80;

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

      if (this._cardEditorEl && !this._cardEditorEl.classList.contains(this._HIDDEN) && this.currentSelectedCardId === id) {
        this._positionCardEditorWrapper(wrap);
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
    if (e.target === this.stage) {
      this.clearSelection();
    }
  }

  _onPointerDown(e) {
    if (!this.active || !this.drawingEnabled) return;
    if (this.activeTool !== "card") return;
    if (e.button && e.button !== 0) return;

    if (e.target.closest(".card-item")) return;

    const worldPoint = this._worldPoint(e.clientX, e.clientY);

    const id = this.create(worldPoint.x - this.defaults.width / 2, worldPoint.y - this.defaults.height / 2);

    if (this.app && this.app.setTool) {
      this.app.setTool("select");
    }

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
    for (const { wrap } of this.items.values()) {
      this._applyWorldToScreen(wrap);
      this._positionCardEditorWrapper(wrap);
    }
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;

    item.wrap.remove();
    this.items.delete(id);
  }

  // Lock/unlock card
  lockUnlockCard(id) {
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

      if (this.interactAvailable && typeof interact !== "undefined") {
        try {
          interact(wrap).draggable(false).resizable(false);
        } catch (err) {}
      }

      const lockIndicator = wrap.querySelector(".lock-indicator");
      if (!lockIndicator) {
        const indicator = document.createElement("div");
        indicator.className = "lock-indicator";
        indicator.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="currentColor"/>
        </svg>
      `;
        indicator.style.position = "absolute";
        indicator.style.top = "4px";
        indicator.style.right = "4px";
        indicator.style.background = "rgba(0, 0, 0, 0.6)";
        indicator.style.color = "white";
        indicator.style.borderRadius = "50%";
        indicator.style.width = "20px";
        indicator.style.height = "20px";
        indicator.style.display = "flex";
        indicator.style.alignItems = "center";
        indicator.style.justifyContent = "center";
        indicator.style.fontSize = "10px";
        indicator.style.zIndex = "10";
        wrap.appendChild(indicator);
      }
    } else {
      wrap.classList.remove("locked");
      wrap.style.cursor = "move";

      if (this.interactAvailable && typeof interact !== "undefined") {
        this._initInteractOnCard(wrap, id);
      }

      const lockIndicator = wrap.querySelector(".lock-indicator");
      if (lockIndicator) {
        lockIndicator.remove();
      }

      if (this.currentSelectedCardId === id) {
        const handles = wrap.querySelector(".handles");
        if (handles) {
          handles.style.display = "block";
        }
      }
    }

    window.dispatchEvent(
      new CustomEvent("card-lock-changed", {
        detail: { id, locked: newLockedState },
      })
    );

    return newLockedState;
  }

  // Duplicate card (also copy vote counters)
  duplicateCard(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, contentElement } = item;

    const currentLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const currentTop = parseFloat(wrap.dataset.worldTop || 0);
    const currentWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);
    const currentHeight = parseFloat(wrap.dataset.worldHeight || this.defaults.height);

    const titleElement = wrap.querySelector(".card-title h1");
    const title = titleElement ? titleElement.innerHTML : "Title";
    const content = contentElement ? contentElement.innerHTML : "Type something";

    const offsetX = 20;
    const offsetY = 20;
    const newLeft = currentLeft + offsetX;
    const newTop = currentTop + offsetY;

    const newId = this.create(newLeft, newTop, title, content);
    const newItem = this.items.get(newId);

    if (!newItem) return null;

    const { wrap: newWrap } = newItem;

    newWrap.dataset.worldWidth = String(currentWidth);
    newWrap.dataset.worldHeight = String(currentHeight);

    const cardContainer = wrap.querySelector(".card-item-container");
    const newCardContainer = newWrap.querySelector(".card-item-container");

    if (cardContainer && newCardContainer) {
      const computedStyle = window.getComputedStyle(cardContainer);
      newCardContainer.style.backgroundColor = computedStyle.backgroundColor;
    }

    const bottomContents = wrap.querySelector(".bottom-card-contents");
    const newBottomContents = newWrap.querySelector(".bottom-card-contents");

    if (bottomContents && newBottomContents) {
      const peopleElement = bottomContents.querySelector(".card-item-people");
      if (peopleElement) {
        const newPeople = this._createPeopleIntoCard();
        newBottomContents.appendChild(newPeople);
      }

      const linkElement = bottomContents.querySelector(".card-item-link");
      if (linkElement) {
        const linkAnchor = linkElement.querySelector("a");
        if (linkAnchor) {
          const linkHref = linkAnchor.href;
          const linkText = linkHref.replace("https://", "");
          const newLink = this._createLinkIntoCard(linkText);
          newBottomContents.appendChild(newLink);
        }
      }

      const calendarElement = bottomContents.querySelector(".card-item-calender");
      if (calendarElement) {
        const newCalendar = this._createCalenderIntoCard();
        newBottomContents.appendChild(newCalendar);
      }
    }

    // Copy completion status
    const checkElement = wrap.querySelector(".content-header-check");
    const newCheckElement = newWrap.querySelector(".content-header-check");
    const titleH1 = wrap.querySelector(".card-title h1");
    const newTitleH1 = newWrap.querySelector(".card-title h1");

    if (checkElement && newCheckElement && checkElement.classList.contains("active")) {
      newCheckElement.classList.add("active");
      newCheckElement.classList.remove(this._HIDDEN);
      if (titleH1 && newTitleH1) {
        newTitleH1.style.textDecoration = "line-through";
      }
    }

    // copy vote counters
    const sourceCounter = wrap.querySelector(".card-vote-counters");
    if (sourceCounter) {
      const colorBlocks = Array.from(sourceCounter.children);
      colorBlocks.forEach((colorBlock) => {
        const cls = Array.from(colorBlock.classList).find((c) => c.startsWith("counter-"));
        if (!cls) return;
        const color = cls.replace("counter-", "");
        const countText = colorBlock.querySelector(".count-text");
        const count = parseInt(countText ? countText.textContent : "0", 10) || 0;
        this._setCardDotCount(newWrap, color, count);
      });
    }

    this._applyWorldToScreen(newWrap);
    this._selectCard(newWrap);

    window.dispatchEvent(
      new CustomEvent("card-duplicated", {
        detail: { originalId: id, newId: newId },
      })
    );

    return newId;
  }

  getCardScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap, contentElement } = item;
    return {
      id,
      left: parseFloat(wrap.dataset.worldLeft || 0),
      top: parseFloat(wrap.dataset.worldTop || 0),
      width: parseFloat(wrap.dataset.worldWidth || this.defaults.width),
      height: parseFloat(wrap.dataset.worldHeight || this.defaults.height),
      fontSize: parseFloat(wrap.dataset.worldFont || this.defaults.fontSize),
      content: contentElement.innerHTML,
      backgroundColor: wrap.style.backgroundColor || this.defaults.backgroundColor,
      locked: wrap.dataset.locked === "true",
      votes: this.getCardDots(id), // include vote counters
    };
  }

  restoreFromData(data) {
    const id = this.create(data.left, data.top);
    const item = this.items.get(id);
    if (!item) return id;

    const { wrap } = item;
    wrap.dataset.worldWidth = String(data.width || this.defaults.width);
    wrap.dataset.worldHeight = String(data.height || this.defaults.height);
    wrap.dataset.worldFont = String(data.fontSize || this.defaults.fontSize);

    if (data.backgroundColor) {
      wrap.style.backgroundColor = data.backgroundColor;
    }

    if (data.locked) {
      wrap.dataset.locked = "true";
      wrap.classList.add("locked");
      wrap.style.cursor = "default";
    }

    // restore votes if present
    if (data.votes && typeof data.votes === "object") {
      for (const [color, count] of Object.entries(data.votes)) {
        const c = parseInt(count, 10) || 0;
        if (c > 0) this._setCardDotCount(wrap, color, c);
      }
    }

    this._applyWorldToScreen(wrap);
    return id;
  }

  _bindCardToolbarEvents() {
    const cardToolbar = document.getElementById("cardManagerContainer");
    if (!cardToolbar) return;

    cardToolbar.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      if (button.dataset.color) {
        this._setSelectedCardColor(button.dataset.color);
        cardToolbar.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
      }
    });
  }

  _setSelectedCardColor(color) {
    const selectedCard = document.querySelector(".card-item.show-handles");
    if (selectedCard) {
      selectedCard.style.backgroundColor = color;
    }
  }

  getEditingInfo() {
    return {
      id: this.currentSelectedCardId,
    };
  }
}
