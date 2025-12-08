// Collapsible Dropdown Handler
class DropdownManager {
  constructor() {
    this.dropdownHeaders = document.querySelectorAll(".dropdown-header");
    this.init();
  }

  init() {
    // Set initial state - all sections open
    this.dropdownHeaders.forEach((header) => {
      const section = header.getAttribute("data-section");
      const content = document.querySelector(`[data-content="${section}"]`);

      // Add click event listener
      header.addEventListener("click", () => this.toggleDropdown(header, content));
    });
  }

  toggleDropdown(header, content) {
    const isCollapsed = content.classList.contains("collapsed");

    if (isCollapsed) {
      this.openDropdown(header, content);
    } else {
      this.closeDropdown(header, content);
    }
  }

  openDropdown(header, content) {
    // Remove collapsed class to trigger animation
    header.classList.remove("collapsed");
    content.classList.remove("collapsed");

    // Animate items if they exist
    const items = content.querySelectorAll(".item");
    this.animateItems(items, "in");
  }

  closeDropdown(header, content) {
    // Add collapsed class to trigger animation
    header.classList.add("collapsed");
    content.classList.add("collapsed");

    // Animate items if they exist
    const items = content.querySelectorAll(".item");
    this.animateItems(items, "out");
  }

  animateItems(items, direction) {
    items.forEach((item, index) => {
      if (direction === "in") {
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";

        setTimeout(() => {
          item.style.transition = "all 0.2s ease";
          item.style.opacity = "1";
          item.style.transform = "scale(1)";
        }, index * 20);
      } else {
        item.style.transition = "all 0.1s ease";
        item.style.opacity = "0";
        item.style.transform = "scale(0.8)";
      }
    });
  }

  // Optional: Close all dropdowns
  closeAll() {
    this.dropdownHeaders.forEach((header) => {
      const section = header.getAttribute("data-section");
      const content = document.querySelector(`[data-content="${section}"]`);
      this.closeDropdown(header, content);
    });
  }

  // Optional: Open all dropdowns
  openAll() {
    this.dropdownHeaders.forEach((header) => {
      const section = header.getAttribute("data-section");
      const content = document.querySelector(`[data-content="${section}"]`);
      this.openDropdown(header, content);
    });
  }
}

// Search Functionality
class SearchHandler {
  constructor() {
    this.searchInput = document.querySelector(".search-input");
    this.init();
  }

  init() {
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
    }
  }

  handleSearch(query) {
    const items = document.querySelectorAll(".item");
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery === "") {
      // Show all items when search is empty
      items.forEach((item) => {
        item.style.display = "flex";
      });
      return;
    }

    // Filter items based on search query
    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (text.includes(lowerQuery)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }
}

// Upload Button Handler
class UploadHandler {
  constructor() {
    this.uploadButton = document.querySelector(".upload-button");
    this.init();
  }

  init() {
    if (this.uploadButton) {
      this.uploadButton.addEventListener("click", () => this.handleUpload());
    }
  }

  handleUpload() {
    // Create file input dynamically
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".svg";
    input.multiple = true;

    input.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        console.log("Files selected:", files);
        this.showUploadFeedback(files.length);
      }
    });

    input.click();
  }

  showUploadFeedback(count) {
    // Add visual feedback
    const uploadButton = this.uploadButton;
    const originalText = uploadButton.textContent;

    uploadButton.textContent = `✓ ${count} file${count > 1 ? "s" : ""} selected`;
    uploadButton.style.background = "linear-gradient(135deg, #10B981 0%, #059669 100%)";

    setTimeout(() => {
      uploadButton.textContent = originalText;
      uploadButton.style.background = "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)";
    }, 2000);
  }
}

// Initialize all components when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const dropdownManager = new DropdownManager();
  const searchHandler = new SearchHandler();
  const uploadHandler = new UploadHandler();

  // Optional: Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Press 'Escape' to close all dropdowns
    if (e.key === "Escape") {
      dropdownManager.closeAll();
    }

    // Press 'Ctrl/Cmd + O' to open all dropdowns
    if ((e.ctrlKey || e.metaKey) && e.key === "o") {
      e.preventDefault();
      dropdownManager.openAll();
    }
  });
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

class ToolkitEmojiManager {
  emojiSections = ["smileys-emotion", "people-body", "animals-nature", "food-drink", "travel-places", "objects", "symbols", "flags"];
  stickerSections = ["happy", "laughing", "love", "party", "thumbs"];
  gifSections = ["excited", "shocked", "dancing", "facepalm", "clapping"];

  TENOR_KEY = "AIzaSyDafY_In1u-AtYUT-dNsDFE0W9FSzuUzz0";

  constructor() {
    this.stickers = [];
    this.gifs = [];
    this.emojiData = null; // Will hold OpenMoji data
    this.init();
  }

  _generateToolkitMarkup(type, data, contentType = "emoji") {
    return `
    <div class="dropdown-section">
      <button class="dropdown-header">
        <span class="section-title">${type}</span>
        <!-- prettier-ignore -->
        <svg class="chevron" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 15L12 9L18 15" stroke="#33363F" stroke-width="2"/></svg>
      </button>

      <div class="dropdown-content">
        <div class="items-grid">
         ${data
           .map((d) => {
             if (contentType === "emoji") {
               // OpenMoji format
               const url = `https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/${d.hexcode}.svg`;
               return `<div class="item" data-element="${url}" data-alt="${d.annotation}"><img src="${url}" alt="${d.annotation}" /></div>`;
             } else {
               // Tenor GIF/Sticker format
               const gifFmt = d.media_formats?.gif;
               if (!gifFmt) return "";

               const thumbUrl = gifFmt.max_200w?.url || gifFmt.preview_gif?.url || gifFmt.url || null;
               if (!thumbUrl) return "";

               return `<div class="item" data-element="${thumbUrl}" data-alt="${d.title}"><img src="${thumbUrl}" alt="" /></div>`;
             }
           })
           .join("")}
        </div>
      </div>
    </div>
    `;
  }

  async init() {
    // Load OpenMoji data
    await this.loadOpenMojiData();

    // Render toolkits
    this.renderEmojiToolkit();
    this.renderStickerToolkit();
    this.renderGifToolkit();
    this._renderRecentEmoji();
  }

  //
  _renderRecentEmoji() {
    const recentEmojis = localStorage.getItem("recentEmojis");
    if (recentEmojis) {
      console.log(recentEmojis);
    }
  }

  async loadOpenMojiData() {
    try {
      const res = await fetch("https://cdn.jsdelivr.net/npm/openmoji@14.0.0/data/openmoji.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const allEmojis = await res.json();

      // Store all emoji data
      this.emojiData = allEmojis;
    } catch (error) {
      console.error("Failed to load OpenMoji data:", error);
      this.emojiData = [];
    }
  }

  renderEmojiToolkit() {
    if (!this.emojiData || this.emojiData.length === 0) {
      console.warn("No emoji data available");
      return;
    }

    // Group mapping from our section names to OpenMoji groups
    const groupMapping = {
      "smileys-emotion": ["smileys-emotion"],
      "people-body": ["people-body"],
      "animals-nature": ["animals-nature"],
      "food-drink": ["food-drink"],
      "travel-places": ["travel-places"],
      objects: ["objects"],
      symbols: ["symbols"],
      flags: ["flags"],
    };

    this.emojiSections.forEach((sectionName) => {
      const openMojiGroups = groupMapping[sectionName] || [sectionName];

      // Filter emojis by group
      const sectionEmojis = this.emojiData.filter((emoji) => openMojiGroups.includes(emoji.group)).slice(0, 48); // Limit to 50 per section for performance

      if (sectionEmojis.length > 0) {
        const section = this._generateToolkitMarkup(sectionName, sectionEmojis, "emoji");
        document.getElementById("emojiMediaContainer").insertAdjacentHTML("beforeend", section);
      }
    });
  }

  async renderStickerToolkit() {
    const limit = 25;

    try {
      const results = await Promise.all(
        this.stickerSections.map(async (cat) => {
          const response = await fetch(`https://tenor.googleapis.com/v2/search` + `?key=${this.TENOR_KEY}` + `&q=${encodeURIComponent(cat)}` + `&limit=${limit}`);
          const data = await response.json();
          return { category: cat, stickers: data.results };
        })
      );

      results.forEach(({ category, stickers }) => {
        const section = this._generateToolkitMarkup(category, stickers, "sticker");
        document.getElementById("stickerMediaContainer").insertAdjacentHTML("beforeend", section);
      });
    } catch (error) {
      console.error("Failed to load stickers:", error);
    }
  }

  async renderGifToolkit() {
    const limit = 25;

    try {
      const results = await Promise.all(
        this.gifSections.map(async (cat) => {
          const response = await fetch(`https://tenor.googleapis.com/v2/search` + `?key=${this.TENOR_KEY}` + `&q=${encodeURIComponent(cat)}` + `&limit=${limit}`);
          const data = await response.json();
          return { category: cat, gifs: data.results };
        })
      );

      results.forEach(({ category, gifs }) => {
        const section = this._generateToolkitMarkup(category, gifs, "gif");
        document.getElementById("gifMediaContainer").insertAdjacentHTML("beforeend", section);
      });
    } catch (error) {
      console.error("Failed to load GIFs:", error);
    }
  }
}

window.toolkitEmojiManager = new ToolkitEmojiManager();

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
class ToolkitManager {
  constructor(stage, getTransform, app) {
    this.stage = stage;
    this.getTransform = getTransform;
    this.app = app || window.app;

    this.items = new Map();
    this.counter = 1;

    this._eventListener();

    // Bound handlers
    this._onPointerDown = this._onPointerDown.bind(this);
  }

  _addEmojiHasRecent(emoji) {
    const recentEmojis = localStorage.getItem("recentEmojis");
    if (recentEmojis) {
      const recentEmojisArray = JSON.parse(recentEmojis);
      recentEmojisArray.push(emoji);
      localStorage.setItem("recentEmojis", JSON.stringify(recentEmojisArray));
    }
  }

  _eventListener() {
    const emojiMediaContainer = document.getElementById("emojiMediaContainer");

    if (emojiMediaContainer) {
      emojiMediaContainer.addEventListener("click", (e) => {
        const item = e.target.closest(".item");
        if (item) {
          const emojiUrl = item.dataset.element;
          const emojiAlt = item.dataset.alt;
          const canvasRect = this.app.canvas.getBoundingClientRect();
          const cx = canvasRect.left + canvasRect.width / 2;
          const cy = canvasRect.top + canvasRect.height / 2;

          // All emojis are now image URLs
          this.addEmojiAtScreen(cx, cy, { type: "img", src: emojiUrl, size: 84 });

          // Add to recent emojis
          this._addEmojiHasRecent({ key: "emoji", value: emojiUrl, alt: emojiAlt });
        }
      });
    }
  }

  attach() {
    if (this.stage) {
      this.stage.addEventListener("pointerdown", this._onPointerDown);
    }
  }

  detach() {
    if (this.stage) {
      this.stage.removeEventListener("pointerdown", this._onPointerDown);
    }
    // Cleanup DOM elements
    for (const item of this.items.values()) {
      if (item.wrap && item.wrap.remove) item.wrap.remove();
    }
    this.items.clear();
  }

  _onPointerDown(e) {
    // Will be handled by element click events
  }

  addEmojiAtWorld(x, y, opts = {}) {
    const id = "emoji-" + Date.now() + "-" + this.counter++;
    const size = opts.size || 64;
    const isImg = (opts.type === "img" || opts.src) && opts.src;

    // Create wrapper (like card-item)
    const wrap = document.createElement("div");
    wrap.className = "emoji-item whiteboard-content-item";
    wrap.dataset.id = id;
    wrap.dataset.worldLeft = String(x || 0);
    wrap.dataset.worldTop = String(y || 0);
    wrap.dataset.worldWidth = String(size);
    wrap.dataset.worldHeight = String(size);
    wrap.dataset.locked = "false";

    wrap.style.position = "absolute";
    wrap.style.boxSizing = "border-box";
    wrap.style.userSelect = "none";
    wrap.style.transformOrigin = "0 0";
    wrap.style.touchAction = "none";
    wrap.style.pointerEvents = "auto";
    wrap.style.cursor = "grab";
    // Background, border, and border-radius will be set by _applyWorldToScreen

    // Create container
    const container = document.createElement("div");
    container.className = "emoji-item-container";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";
    container.style.overflow = "hidden";
    container.style.boxSizing = "border-box";

    // Create content
    let content;
    if (isImg) {
      content = document.createElement("img");
      content.src = opts.src;
      content.alt = opts.alt || "emoji";
      content.style.width = "100%";
      content.style.height = "100%";
      content.style.objectFit = "contain";
      content.style.pointerEvents = "none";
      content.style.display = "block";
      content.className = "emoji-content emoji-image";
    } else {
      content = document.createElement("div");
      content.className = "emoji-content emoji-text";
      content.textContent = opts.text || "😀";
      content.style.fontSize = size + "px";
      content.style.lineHeight = "1";
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.style.justifyContent = "center";
      content.style.width = "100%";
      content.style.height = "100%";
      content.style.pointerEvents = "none";
    }

    container.appendChild(content);

    // Create handles
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

      if (pos.includes("n")) handle.style.top = "-4px";
      if (pos.includes("s")) handle.style.bottom = "-4px";
      if (pos.includes("w")) handle.style.left = "-4px";
      if (pos.includes("e")) handle.style.right = "-4px";

      handle.style.cursor = pos + "-resize";
      handle.style.pointerEvents = "auto";
      handle.style.opacity = "1";

      handles.appendChild(handle);
    });

    wrap.appendChild(container);
    wrap.appendChild(handles);

    // Create item object
    const item = {
      id,
      wrap,
      container,
      content,
      handles,
      world: { x: x || 0, y: y || 0 },
      size: size,
      locked: false,
      isImg,
    };

    this.items.set(id, item);
    this.stage.appendChild(wrap);

    this._setupEventHandlers(wrap, item);
    this._initInteract(wrap, item);
    this._applyWorldToScreen(wrap);

    // Record creation for undo/redo
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("create", "toolkit", "create", {
        id,
        x: x || 0,
        y: y || 0,
        size,
        isImg: isImg,
        src: opts.src,
        text: opts.text,
        alt: opts.alt,
      });
    }

    return id;
  }

  _setupEventHandlers(wrap, item) {
    wrap.addEventListener("click", (ev) => {
      ev.stopPropagation();
      this.selectItem(item.id);
    });

    wrap.addEventListener("pointerdown", (ev) => {
      if (ev.target.closest(".resize-handle")) return;

      // ev.stopPropagation();

      if (item.locked) {
        this.selectItem(item.id);
        return;
      }

      this.selectItem(item.id);
    });
  }

  _initInteract(wrap, item) {
    if (typeof interact === "undefined") {
      console.warn("Interact.js not found");
      return;
    }

    const startState = {};

    interact(wrap)
      .draggable({
        listeners: {
          start: () => {
            if (item.locked) return false;
            this.selectItem(item.id);
            startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
            startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);
          },
          move: (ev) => {
            if (item.locked) return;
            const t = this.getTransform();
            const dx = ev.dx / (t.k || 1);
            const dy = ev.dy / (t.k || 1);

            item.world.x += dx;
            item.world.y += dy;
            wrap.dataset.worldLeft = String(item.world.x);
            wrap.dataset.worldTop = String(item.world.y);

            this._applyWorldToScreen(wrap);

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
            this._showActionButtonsForWrap(wrap);
          },
          end: () => {
            // Record move operation for undo/redo
            if (typeof HistoryManager !== "undefined" && !item.locked) {
              const newWorldLeft = parseFloat(wrap.dataset.worldLeft || 0);
              const newWorldTop = parseFloat(wrap.dataset.worldTop || 0);

              // Only record if position actually changed
              if (startState.worldLeft !== newWorldLeft || startState.worldTop !== newWorldTop) {
                HistoryManager.recordOperation("modify", "toolkit", "move", {
                  id: item.id,
                  oldX: startState.worldLeft,
                  oldY: startState.worldTop,
                  newX: newWorldLeft,
                  newY: newWorldTop,
                });
              }
            }

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          },
        },
        inertia: false,
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          start: () => {
            if (item.locked) return false;
            this.selectItem(item.id);
            startState.worldWidth = parseFloat(wrap.dataset.worldWidth || item.size);
            startState.worldHeight = parseFloat(wrap.dataset.worldHeight || item.size);
            startState.worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
            startState.worldTop = parseFloat(wrap.dataset.worldTop || 0);
          },
          move: (ev) => {
            if (item.locked) return;

            const rect = ev.rect;
            if (!rect) return;

            const t = this.getTransform();
            const k = t.k || 1;
            const stageRect = this.stage.getBoundingClientRect();

            // Convert to world space
            const newWorldLeft = (rect.left - stageRect.left - t.x) / k;
            const newWorldTop = (rect.top - stageRect.top - t.y) / k;
            const newWorldWidth = rect.width / k;
            const newWorldHeight = rect.height / k;

            // Keep square aspect ratio
            const avgSize = (newWorldWidth + newWorldHeight) / 2;

            item.world.x = newWorldLeft + avgSize / 2;
            item.world.y = newWorldTop + avgSize / 2;
            item.size = avgSize;

            wrap.dataset.worldLeft = String(newWorldLeft);
            wrap.dataset.worldTop = String(newWorldTop);
            wrap.dataset.worldWidth = String(avgSize);
            wrap.dataset.worldHeight = String(avgSize);

            // Update content size for text emojis
            if (!item.isImg) {
              item.content.style.fontSize = Math.round(avgSize) + "px";
            }

            this._applyWorldToScreen(wrap);

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
            this._showActionButtonsForWrap(wrap);
          },
          end: () => {
            // Record resize operation for undo/redo
            if (typeof HistoryManager !== "undefined" && !item.locked) {
              const newWorldWidth = parseFloat(wrap.dataset.worldWidth || 0);
              const newWorldHeight = parseFloat(wrap.dataset.worldHeight || 0);
              const newWorldLeft = parseFloat(wrap.dataset.worldLeft || 0);
              const newWorldTop = parseFloat(wrap.dataset.worldTop || 0);

              // Only record if size actually changed
              if (startState.worldWidth !== newWorldWidth || startState.worldHeight !== newWorldHeight || startState.worldLeft !== newWorldLeft || startState.worldTop !== newWorldTop) {
                HistoryManager.recordOperation("modify", "toolkit", "resize", {
                  id: item.id,
                  oldWidth: startState.worldWidth,
                  oldHeight: startState.worldHeight,
                  oldLeft: startState.worldLeft,
                  oldTop: startState.worldTop,
                  newWidth: newWorldWidth,
                  newHeight: newWorldHeight,
                  newLeft: newWorldLeft,
                  newTop: newWorldTop,
                });
              }
            }

            if (this.app && this.app._scheduleToolbarReposition) {
              this.app._scheduleToolbarReposition();
            }
          },
        },
        modifiers: [interact.modifiers.restrictSize({ min: { width: 16, height: 16 } }), interact.modifiers.aspectRatio({ ratio: 1 })],
        inertia: false,
      });
  }

  _applyWorldToScreen(wrap) {
    if (!wrap) return;

    const t = this.getTransform();
    const worldLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const worldTop = parseFloat(wrap.dataset.worldTop || 0);
    const worldWidth = parseFloat(wrap.dataset.worldWidth || 64);
    const worldHeight = parseFloat(wrap.dataset.worldHeight || 64);

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;
    const screenWidth = Math.max(1, Math.round(worldWidth * t.k));
    const screenHeight = Math.max(1, Math.round(worldHeight * t.k));

    // Apply geometry to wrapper
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";
    wrap.style.width = screenWidth + "px";
    wrap.style.height = screenHeight + "px";
    wrap.style.transform = `scale(1, 1)`;

    // Make UI chrome (padding, border-radius, border-width) scale with size
    const container = wrap.querySelector(".emoji-item-container");
    const content = wrap.querySelector(".emoji-content");

    if (container) {
      // padding is a fraction of the smaller side
      const smallSide = Math.min(screenWidth, screenHeight);
      // Choose padding as 8% of small side, clamped between 0 and 12px
      const padding = Math.max(0, Math.min(12, Math.round(smallSide * 0.08)));
      container.style.padding = padding + "px";
      container.style.boxSizing = "border-box";

      // Border radius as fraction of size (clamped)
      const br = Math.max(2, Math.min(12, Math.round(smallSide * 0.12)));
      wrap.style.borderRadius = br + "px";

      // Border width subtle (clamped)
      const bw = Math.max(0.5, Math.min(2, smallSide * 0.02));
      wrap.style.border = `${bw}px solid rgba(0,0,0,0.08)`;

      // Adjust background opacity based on zoom level to prevent visual issues
      const t = this.getTransform();
      const zoomFactor = t.k || 1;
      const backgroundOpacity = Math.max(0.7, Math.min(0.95, 0.9 + (zoomFactor - 1) * 0.05));
      wrap.style.background = `rgba(255, 255, 255, ${backgroundOpacity})`;
    }

    if (content) {
      // If it's an image, ensure object-fit stays contained and it fills
      if (content.tagName && content.tagName.toLowerCase() === "img") {
        // ensure there's always some visible image area
        // width/height already set by CSS to 100% — just make sure padding didn't kill it
        content.style.width = "100%";
        content.style.height = "100%";
        content.style.objectFit = "contain";
        content.style.display = "block";
      } else {
        // text emoji -> scale font by available inner width/height
        const innerWidth = Math.max(1, screenWidth - (container ? parseInt(container.style.padding || 0) * 2 : 0));
        const innerHeight = Math.max(1, screenHeight - (container ? parseInt(container.style.padding || 0) * 2 : 0));
        // Font size is min(innerWidth, innerHeight), clamp to a sensible range
        const fontSize = Math.max(8, Math.min(256, Math.round(Math.min(innerWidth, innerHeight))));
        content.style.fontSize = fontSize + "px";
        content.style.lineHeight = "1";
        content.style.display = "flex";
        content.style.alignItems = "center";
        content.style.justifyContent = "center";
      }
    }

    // Optional: set min screen size so item is still clickable when very zoomed out
    const MIN_SCREEN_SIZE = 12; // px — tune to taste
    if (screenWidth < MIN_SCREEN_SIZE) {
      wrap.style.width = MIN_SCREEN_SIZE + "px";
    }
    if (screenHeight < MIN_SCREEN_SIZE) {
      wrap.style.height = MIN_SCREEN_SIZE + "px";
    }
  }

  refreshScreenPositions() {
    for (const item of this.items.values()) {
      this._applyWorldToScreen(item.wrap);
    }
  }

  addEmojiAtScreen(clientX, clientY, opts = {}) {
    const t = this.getTransform();
    const world = { x: (clientX - t.x) / t.k, y: (clientY - t.y) / t.k };
    return this.addEmojiAtWorld(world.x, world.y, opts);
  }

  selectItem(id) {
    // Clear all selections
    this.items.forEach((it) => {
      if (it.wrap.classList) it.wrap.classList.remove("show-handles");
      if (it.handles) it.handles.style.display = "none";
    });

    const item = this.items.get(id);
    if (!item) return;

    item.wrap.classList.add("show-handles");
    item.handles.style.display = "block";

    this._showActionButtonsForWrap(item.wrap);
  }

  clearSelection() {
    this.items.forEach((it) => {
      if (it.wrap.classList) it.wrap.classList.remove("show-handles");
      if (it.handles) it.handles.style.display = "none";
    });
    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }

  _showActionButtonsForWrap(wrap) {
    if (!wrap) return;

    const id = wrap.dataset.id;
    const locked = wrap.dataset.locked === "true";

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "toolkit", id, locked },
      })
    );
  }

  deleteById(id) {
    const item = this.items.get(id);
    if (!item) return false;

    // Record deletion for undo/redo before removing
    if (typeof HistoryManager !== "undefined") {
      HistoryManager.recordOperation("delete", "toolkit", "delete", {
        id,
        x: item.world.x,
        y: item.world.y,
        size: item.size,
        isImg: item.isImg,
        src: item.src,
        text: item.text,
        locked: item.locked,
      });
    }

    if (item.wrap && item.wrap.remove) item.wrap.remove();
    this.items.delete(id);

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
    return true;
  }

  toggleLockById(id) {
    const item = this.items.get(id);
    if (!item) return null;

    item.locked = !item.locked;
    item.wrap.dataset.locked = String(item.locked);

    if (item.locked) {
      item.wrap.classList.add("locked");
    } else {
      item.wrap.classList.remove("locked");
    }

    window.dispatchEvent(
      new CustomEvent("board-selection-changed", {
        detail: { type: "toolkit", id: item.id, locked: item.locked },
      })
    );

    return item.locked;
  }

  getCardScreenRect(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return item.wrap.getBoundingClientRect();
  }

  clear() {
    this.items.forEach((it) => it.wrap.remove());
    this.items.clear();
    this.clearSelection();
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;

    return {
      id: item.id,
      x: item.world.x,
      y: item.world.y,
      size: item.size,
      isImg: item.isImg,
      text: item.text,
      src: item.src,
      locked: item.locked,
    };
  }

  restoreFromData(data) {
    const opts = {
      size: data.size,
      type: data.isImg ? "img" : "text",
      src: data.src,
      text: data.text,
    };

    const id = this.addEmojiAtWorld(data.x, data.y, opts);
    const item = this.items.get(id);

    if (item && data.locked) {
      item.locked = true;
      item.wrap.dataset.locked = "true";
      item.wrap.classList.add("locked");
    }

    return id;
  }

  // Method for history manager to create from data
  createFromData(data) {
    return this.restoreFromData(data);
  }
}
