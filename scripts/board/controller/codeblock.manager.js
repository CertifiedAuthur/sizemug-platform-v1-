class CodeBlockManager {
  // Add default snippets for each language
  static DEFAULT_SNIPPETS = {
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
    }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a sample HTML document</p>
</body>
</html>`,

    css: `:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
}`,

    javascript: `// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  button.style.padding = '10px 20px';
  button.style.backgroundColor = '#3498db';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => {
    alert('Button clicked!');
  });

  document.body.appendChild(button);
});`,

    python: `def greet(name):
    \"\"\"Print a greeting message\"\"\"
    print(f"Hello, {name}!")

    # Example usage
if __name__ == "__main__":
    user_name = input("Enter your name: ")
    greet(user_name)

    # List comprehension example
    numbers = [1, 2, 3, 4, 5]
    squares = [x**2 for x in numbers]
    print(f"Squares: {squares}")`,

    java: `public class HelloWorld {
    public static void main(String[] args) {
        // Print greeting
        System.out.println("Hello, World!");

        // Create and use a simple object
        Person person = new Person("Alice", 30);
        System.out.println(person.greet());

        // Array example
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        System.out.println("Sum: " + sum);
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String greet() {
        return "Hello, my name is " + name + " and I am " + age + " years old.";
    }
}`,

    csharp: `using System;
using System.Collections.Generic;

namespace CodeBlockExample
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");

            // Create and use a person object
            Person person = new Person("Alice", 30);
            Console.WriteLine(person.Greet());

            // List example
            List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
            int sum = 0;
            foreach (int num in numbers)
            {
                sum += num;
            }
            Console.WriteLine($"Sum: {sum}");
        }
    }

    public class Person
    {
        public string Name { get; }
        public int Age { get; }

        public Person(string name, int age)
        {
            Name = name;
            Age = age;
        }

        public string Greet() => $"Hello, my name is {Name} and I am {Age} years old.";
    }
}`,

    php: `<?php
// Define a simple class
class Person {
    private $name;
    private $age;

    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }

    public function greet() {
        return "Hello, my name is {$this->name} and I am {$this->age} years old.";
    }
}

// Main execution
echo "<h1>Hello World</h1>";
echo "<p>This is a PHP example</p>";

// Create and use a person object
$person = new Person("Alice", 30);
echo "<p>" . $person->greet() . "</p>";

// Array example
$numbers = [1, 2, 3, 4, 5];
$sum = array_sum($numbers);
echo "<p>Sum: $sum</p>";
?>`,

    // Fallback for unknown languages
    default: `// Start coding here
console.log("Hello World");`,
  };

  constructor(stageNode, getTransform, app, parent) {
    if (!stageNode) throw new Error("CodeBlockManager requires stageNode.");
    if (!getTransform || typeof getTransform !== "function") throw new Error("CodeBlockManager requires getTransform function.");

    this.stage = stageNode;
    this.getTransform = getTransform;
    this.app = app || window.app;
    this.parent = parent || document.body;

    // state
    this.counter = 0;
    this.items = new Map(); // id -> item
    this._editingId = null;

    // defaults
    this.defaults = {
      width: 480,
      height: 300,
      bg: "#ffffff",
      border: "#e1e5e9",
      radius: 8,
      titleFontSize: 13,
      minWidth: 120,
      minHeight: 80,
    };

    // interaction state
    this._activeDrag = null;
    this._activeResize = null;

    // bindings
    this._onDocPointerMove = this._onDocPointerMove.bind(this);
    this._onDocPointerUp = this._onDocPointerUp.bind(this);

    // ensure stage pointerdown clears selection if clicked on stage (optional)
    this._onStagePointerDown = (ev) => {
      if (!ev.target.closest || !this.stage.contains(ev.target) || ev.target === this.stage) {
        this._clearSelection();
      }
    };
    this.stage.addEventListener("pointerdown", this._onStagePointerDown);

    // Get reference to the editor element
    this._editorEl = document.getElementById("whiteboardEditorCodeBlock");
    this._selectedCodeBlockId = null;

    // Initialize editor functionality
    this._initCodeBlockEditor();
  }

  _initCodeBlockEditor() {
    if (!this._editorEl) return;

    // Language selector
    const languageSelect = this._editorEl.querySelector("#codeblockLanguage");
    if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
        if (this._selectedCodeBlockId) {
          this.setLanguage(this._selectedCodeBlockId, e.target.value);
        }
      });
    }

    // Line numbers toggle
    const numbersBtn = this._editorEl.querySelector("#numberedListCodeBlock");
    if (numbersBtn) {
      numbersBtn.addEventListener("click", (e) => {
        const isActive = numbersBtn.classList.toggle("active");
        this.toggleLineNumbers(isActive);
      });
    }

    // Theme toggle
    const themeBtn = this._editorEl.querySelector("#codeBlockTheme");
    if (themeBtn) {
      themeBtn.addEventListener("click", (e) => {
        const isActive = themeBtn.classList.toggle("active");
        this.toggleTheme(isActive ? "dark" : "light");
      });
    }

    // Dropdown menu
    const dropdownBtn = this._editorEl.querySelector("#dropDownMenuForCodeBlock");
    if (dropdownBtn) {
      dropdownBtn.addEventListener("click", (e) => {
        const isExpanded = dropdownBtn.getAttribute("aria-expanded") === "true";
        dropdownBtn.setAttribute("aria-expanded", !isExpanded);
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest("#dropDownMenuForCodeBlock") && !e.target.closest(".editor_dropdown_menu")) {
          dropdownBtn.removeAttribute("aria-expanded");
        }
      });
    }

    // Dropdown actions
    const duplicateBtn = this._editorEl.querySelector('[data-action="duplicate"]');
    if (duplicateBtn) {
      duplicateBtn.addEventListener("click", (e) => {
        if (this._selectedCodeBlockId) {
          this._duplicateCodeBlock(this._selectedCodeBlockId);
        }
      });
    }

    const deleteBtn = this._editorEl.querySelector('[data-action="delete"]');
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        if (this._selectedCodeBlockId) {
          this.remove(this._selectedCodeBlockId);
          this._hideCodeBlockEditor();
        }
      });
    }

    // Close dropdown and hide editor when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#whiteboardEditorCodeBlock") && !e.target.closest(".codeblock-item")) {
        this._hideCodeBlockEditor();
      }
    });
  }

  /* --------------------------- internal helpers -------------------------- */
  _generateId() {
    this.counter += 1;
    return this.counter;
  }

  _shortPreview(code) {
    if (!code) return "";
    const lines = code.trim().split(/\r?\n/).slice(0, 3);
    return lines.join(" ").slice(0, 240);
  }

  _clearSelection() {
    this.stage.querySelectorAll(".codeblock-item.show-handles").forEach((el) => {
      el.classList.remove("show-handles");
      const hs = el.querySelectorAll(".resize-handle");
      hs.forEach((h) => {
        h.style.display = "none";
      });
    });

    this._selectedCodeBlockId = null;

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: null } }));
  }

  _selectItemWrap(wrap) {
    // Clear previous selections
    this.stage.querySelectorAll(".codeblock-item.show-handles").forEach((el) => {
      el.classList.remove("show-handles");
      const hs = el.querySelectorAll(".resize-handle");
      hs.forEach((h) => {
        h.style.display = "none";
      });
    });

    // Select current item
    wrap.classList.add("show-handles");
    const handles = wrap.querySelectorAll(".resize-handle");
    handles.forEach((h) => {
      h.style.display = "block";
      h.style.pointerEvents = "auto";
    });

    const id = parseInt(wrap.dataset.id, 10);
    const locked = wrap.dataset.locked === "true";

    // Store selected ID and show editor
    this._selectedCodeBlockId = id;
    this._showCodeBlockEditor(wrap);

    // Update editor UI based on current codeblock
    this._updateEditorUI(id);

    window.dispatchEvent(new CustomEvent("board-selection-changed", { detail: { type: "codeblock", id, locked } }));
  }

  _updateEditorUI(id) {
    const item = this.items.get(id);
    if (!item || !this._editorEl) return;

    // Update language selector
    const languageSelect = this._editorEl.querySelector("#codeblockLanguage");
    if (languageSelect && item.language) {
      languageSelect.value = item.language;
    }

    console.log("UPDATE UI ");

    // Update other UI elements as needed based on item state
  }

  _showCodeBlockEditor(wrap) {
    if (!this._editorEl) return;

    this._editorEl.classList.remove(this._getHiddenClass());
    this._positionCodeBlockEditor(wrap);
  }

  _hideCodeBlockEditor() {
    if (!this._editorEl) return;

    this._editorEl.classList.add(this._getHiddenClass());
    this._selectedCodeBlockId = null;

    // Close any open dropdowns
    const dropdownBtn = this._editorEl.querySelector("#dropDownMenuForCodeBlock");
    if (dropdownBtn) {
      dropdownBtn.removeAttribute("aria-expanded");
    }
  }

  _positionCodeBlockEditor(wrap = null) {
    if (!this._editorEl) return;

    const editor = this._editorEl;
    const viewport = this.app?.viewportNode || document.getElementById("viewport");

    if (!viewport) return;

    const gap = 8;
    let left, top;

    if (wrap) {
      const vpRect = viewport.getBoundingClientRect();
      const vpScrollLeft = viewport.scrollLeft || 0;
      const vpScrollTop = viewport.scrollTop || 0;

      const wrapRect = wrap.getBoundingClientRect();

      const codeBlockLeft = wrapRect.left - vpRect.left + vpScrollLeft;
      const codeBlockTop = wrapRect.top - vpRect.top + vpScrollTop;
      const codeBlockWidth = wrapRect.width;

      // Position editor at the top center of the codeblock
      left = codeBlockLeft + codeBlockWidth / 2 - editor.offsetWidth / 2;
      const candidateTop = codeBlockTop - editor.offsetHeight - gap;

      const minTop = gap + vpScrollTop;
      const maxLeft = viewport.clientWidth - editor.offsetWidth - gap;

      // If there's space above, place it there, otherwise place it at the top of viewport
      if (candidateTop >= minTop) {
        top = candidateTop;
      } else {
        top = minTop;
      }

      // Keep editor within viewport bounds
      left = Math.max(gap, Math.min(left, maxLeft));
    } else {
      // Fallback position - center at top of viewport
      const vpScrollLeft = viewport.scrollLeft || 0;
      const vpScrollTop = viewport.scrollTop || 0;
      left = viewport.clientWidth / 2 - editor.offsetWidth / 2 + vpScrollLeft;
      top = gap + vpScrollTop;
    }

    editor.style.position = "absolute";
    editor.style.left = `${Math.round(left)}px`;
    editor.style.top = `${Math.round(top)}px`;
    editor.style.zIndex = "1000";
  }

  // Method to update editor position during transformations
  updateEditorToolbarPosition() {
    if (!this._editorEl || this._editorEl.classList.contains(this._getHiddenClass())) {
      return;
    }

    const wrap = this._selectedCodeBlockId ? this.items.get(this._selectedCodeBlockId)?.wrap : null;

    if (wrap) {
      this._positionCodeBlockEditor(wrap);
    }
  }

  attach() {
    if (!this.app) return;
    this._attached = true;

    this._onAppToolChange = (tool) => {
      this._toolIsCodeblock = tool === "codeblock";
    };

    if (this.app.toolManager && typeof this.app.toolManager.onChange === "function") {
      this._unsubTool = this.app.toolManager.onChange(({ tool }) => this._onAppToolChange(tool));
    } else if (this.app.toolManager) {
      this._onToolChangeHandler = (e) => this._onAppToolChange(e.detail && e.detail.tool);
      this.app.toolManager.addEventListener("change", this._onToolChangeHandler);
    }

    this._onStagePointerDownForCreate = (e) => {
      if (!this._toolIsCodeblock) return;
      if (e.target.closest && e.target.closest(".toolbar, .ui-panel, input, textarea, .manager_containers")) return;

      const t = this.getTransform();
      const world = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };

      const id = this.create(world.x, world.y, {
        label: "Code Block",
        code: "", // start empty
        language: "html",
        width: this.defaults.width,
        height: this.defaults.height,
      });

      // Immediately enter editing on the same face inside stage
      this.startEditing(id);

      if (this.app && this.app.setTool) {
        this.app.setTool("select");
      }

      e.stopPropagation();
      e.preventDefault();
    };

    this.stage && this.stage.addEventListener("pointerdown", this._onStagePointerDownForCreate);
  }

  detach() {
    if (!this._attached) return;
    this._attached = false;
    if (this._unsubTool) {
      try {
        this._unsubTool();
      } catch (e) {}
      this._unsubTool = null;
    }
    if (this._onToolChangeHandler && this.app && this.app.toolManager) {
      this.app.toolManager.removeEventListener("change", this._onToolChangeHandler);
      this._onToolChangeHandler = null;
    }
    if (this._onStagePointerDownForCreate && this.stage) {
      this.stage.removeEventListener("pointerdown", this._onStagePointerDownForCreate);
    }
  }

  getCardScreenRect(id) {
    const item = this.items.get(Number(id));
    if (!item) return null;
    this._applyWorldToScreen(item);
    return item.wrap.getBoundingClientRect();
  }

  // Override clearSelection to hide editor
  clearSelection() {
    this._clearSelection();
    this._hideCodeBlockEditor();
  }

  toggleLock(btn, id) {
    const item = this.items.get(Number(id));
    if (!item) return false;
    const isLocked = item.wrap.dataset.locked === "true";
    const now = !isLocked;
    item.wrap.dataset.locked = String(now);
    if (now) item.wrap.classList.add("locked");
    else item.wrap.classList.remove("locked");
    return now;
  }

  /* --------------------------- TRANSFORM & LAYOUT -------------------------- */

  _applyWorldToScreen(itemOrWrap) {
    let item = null;
    if (!itemOrWrap) return;
    if (itemOrWrap.wrap) item = itemOrWrap;
    else {
      const wrap = itemOrWrap;
      const id = parseInt(wrap.dataset.id, 10);
      item = this.items.get(id);
      if (!item) return;
    }

    const wrap = item.wrap;
    if (!wrap) return;

    const t = this.getTransform ? this.getTransform() : { x: 0, y: 0, k: 1 };

    const worldLeft = Number(wrap.dataset.worldLeft ?? 0) || 0;
    const worldTop = Number(wrap.dataset.worldTop ?? 0) || 0;
    const worldWidth = Number(wrap.dataset.worldWidth ?? this.defaults.width) || this.defaults.width;
    const worldHeight = Number(wrap.dataset.worldHeight ?? this.defaults.height) || this.defaults.height;

    const screenLeft = worldLeft * t.k + t.x;
    const screenTop = worldTop * t.k + t.y;

    const baseWidth = this.defaults.width;
    const baseHeight = this.defaults.height;

    const widthScale = worldWidth / baseWidth;
    const heightScale = worldHeight / baseHeight;
    const zoomScale = t.k;

    const sizeScale = Math.sqrt(widthScale * heightScale);
    const totalScale = sizeScale * zoomScale;

    wrap.style.position = "absolute";
    wrap.style.left = Math.round(screenLeft) + "px";
    wrap.style.top = Math.round(screenTop) + "px";

    wrap.style.width = baseWidth + "px";
    wrap.style.height = baseHeight + "px";

    wrap.style.transform = `scale(${totalScale})`;
    wrap.style.transformOrigin = "0 0";

    const titleEl = wrap.querySelector(".codeblock-title");
    if (titleEl) titleEl.style.fontSize = this.defaults.titleFontSize * sizeScale + "px";

    // Apply same scaled font to preview/editor area so both faces match visually
    const codePre = wrap.querySelector(".codeblock-preview-pre");
    const editable = wrap.querySelector(".codeblock-editor-input");
    const baseFont = 13;
    const baseLineHeight = 20;
    const scaledFontPx = baseFont * sizeScale;
    if (codePre) {
      codePre.style.fontSize = scaledFontPx + "px";
      codePre.style.lineHeight = baseLineHeight * sizeScale + "px";
    }
    if (editable) {
      editable.style.fontSize = scaledFontPx + "px";
      editable.style.lineHeight = baseLineHeight * sizeScale + "px";
      // keep caret visible and at same size
      editable.style.caretColor = "#000";
    }

    // Also scale gutter numbers
    const gutter = wrap.querySelector(".codeblock-editor-gutter");
    if (gutter) gutter.style.fontSize = 12 * sizeScale + "px";
  }

  _applyAllWorldToScreen() {
    for (const item of this.items.values()) this._applyWorldToScreen(item);
  }

  // Override the existing refreshScreenPositions to include editor positioning
  refreshScreenPositions() {
    this._applyAllWorldToScreen();
    if (this._editingId) this._updateEditorPositionFor(this._editingId);

    // Update editor position if visible
    this.updateEditorToolbarPosition();
  }

  // Add duplicate functionality
  _duplicateCodeBlock(id) {
    const item = this.items.get(id);
    if (!item) return null;

    const { wrap } = item;

    // Get current position and add offset
    const currentLeft = parseFloat(wrap.dataset.worldLeft || 0);
    const currentTop = parseFloat(wrap.dataset.worldTop || 0);
    const currentWidth = parseFloat(wrap.dataset.worldWidth || this.defaults.width);
    const currentHeight = parseFloat(wrap.dataset.worldHeight || this.defaults.height);

    const offsetX = 20;
    const offsetY = 20;

    // Create duplicate
    const newId = this.create(currentLeft + offsetX, currentTop + offsetY, {
      width: currentWidth,
      height: currentHeight,
      code: item.code,
      language: item.language,
      label: item.titleEl?.textContent || "Code Block",
    });

    // Select the new duplicate
    const newItem = this.items.get(newId);
    if (newItem) {
      this._selectItemWrap(newItem.wrap);
    }

    return newId;
  }

  // Helper method to get the hidden class (supports different frameworks)
  _getHiddenClass() {
    return typeof HIDDEN !== "undefined" ? HIDDEN : "board--hidden";
  }

  /* --------------------------- create / DOM ------------------------------ */

  create(worldLeft, worldTop, opts) {
    opts = opts || {};
    const id = this._generateId();
    const width = opts.width || this.defaults.width;
    const height = opts.height || this.defaults.height;
    const label = opts.label || "Code Block";
    const code = opts.code || "";
    const language = (opts.language || "plaintext").toLowerCase();

    // wrapper
    const wrap = document.createElement("div");
    wrap.className = "codeblock-item";
    wrap.dataset.id = String(id);
    wrap.dataset.worldLeft = String(worldLeft || 0);
    wrap.dataset.worldTop = String(worldTop || 0);
    wrap.dataset.worldWidth = String(width);
    wrap.dataset.worldHeight = String(height);
    wrap.style.position = "absolute";
    wrap.style.transformOrigin = "0 0";
    wrap.style.boxSizing = "border-box";
    wrap.style.width = this.defaults.width + "px";
    wrap.style.height = this.defaults.height + "px";
    wrap.style.pointerEvents = "auto";
    wrap.style.userSelect = "none";
    wrap.style.cursor = "move";
    wrap.style.borderRadius = this.defaults.radius + "px";
    wrap.style.background = this.defaults.bg;
    wrap.style.boxShadow = "0 6px 18px rgba(10,14,20,0.06)";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.gap = "6px";

    // title + header area (this will also be the drag handle)
    const header = document.createElement("div");
    header.className = "codeblock-header";
    Object.assign(header.style, {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 10px",
      background: "#f3f4f6",
      borderBottom: "1px solid #e6e9ef",
      cursor: "grab",
      userSelect: "none",
    });

    const titleEl = document.createElement("div");
    titleEl.className = "codeblock-title";
    titleEl.textContent = label;
    titleEl.style.fontSize = this.defaults.titleFontSize + "px";
    titleEl.style.fontWeight = 600;
    titleEl.style.whiteSpace = "nowrap";
    titleEl.style.overflow = "hidden";
    titleEl.style.textOverflow = "ellipsis";

    const headerControls = document.createElement("div");
    headerControls.style.display = "flex";
    headerControls.style.alignItems = "center";
    headerControls.style.gap = "6px";

    // done/edit toggle button
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.style.padding = "6px 8px";
    editBtn.style.cursor = "pointer";

    headerControls.appendChild(editBtn);

    header.appendChild(titleEl);
    header.appendChild(headerControls);

    // code area container (gutter + code)
    const codeContainer = document.createElement("div");
    codeContainer.className = "codeblock-code-container";
    Object.assign(codeContainer.style, {
      display: "flex",
      flex: "1",
      overflow: "hidden",
      alignItems: "stretch",
      minHeight: "80px",
    });

    // gutter
    const gutter = document.createElement("div");
    gutter.className = "codeblock-editor-gutter";
    Object.assign(gutter.style, {
      width: "48px",
      padding: "8px",
      textAlign: "right",
      userSelect: "none",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
      fontSize: "12px",
      color: "#8b95a1",
      borderRight: "1px solid #eef2f6",
      overflowY: "auto",
      boxSizing: "border-box",
    });

    // code panel (highlighted pre + editable overlay)
    const codePanel = document.createElement("div");
    codePanel.className = "codeblock-codepanel";
    Object.assign(codePanel.style, {
      position: "relative",
      flex: "1",
      padding: "8px",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', monospace",
      fontSize: "13px",
      lineHeight: "20px",
      overflow: "auto",
      boxSizing: "border-box",
      whiteSpace: "pre-wrap",
    });

    // highlighted pre (preview & same tokens as editor)
    const pre = document.createElement("pre");
    pre.className = "codeblock-preview-pre";
    pre.style.margin = "0";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.wordBreak = "break-word";
    pre.style.pointerEvents = "none"; // so clicks fall through to editable when editing
    pre.style.minHeight = "48px";

    // editable overlay (contenteditable)
    const editable = document.createElement("div");
    editable.className = "codeblock-editor-input";
    editable.contentEditable = "true";
    editable.spellcheck = false;
    Object.assign(editable.style, {
      position: "absolute",
      left: "8px",
      top: "8px",
      right: "8px",
      bottom: "8px",
      overflow: "auto",
      whiteSpace: "pre-wrap",
      outline: "none",
      caretColor: "#000",
      background: "transparent",
      color: "transparent", // hide underlying raw text; we show highlighted tokens in pre
    });

    // Assemble DOM
    codePanel.appendChild(pre);
    codePanel.appendChild(editable);

    codeContainer.appendChild(gutter);
    codeContainer.appendChild(codePanel);

    // create resize handles container
    const handles = document.createElement("div");
    handles.className = "handles";
    handles.style.position = "absolute";
    handles.style.inset = "0";
    handles.style.pointerEvents = "none";

    ["nw", "ne", "sw", "se"].forEach((pos) => {
      const h = document.createElement("div");
      h.className = "resize-handle resize-" + pos;
      h.dataset.handle = pos;
      Object.assign(h.style, {
        pointerEvents: "auto",
        display: "none",
      });
      switch (pos) {
        case "nw":
          h.style.left = "-6px";
          h.style.top = "-6px";
          h.style.cursor = "nw-resize";
          break;
        case "ne":
          h.style.right = "-6px";
          h.style.top = "-6px";
          h.style.cursor = "ne-resize";
          break;
        case "sw":
          h.style.left = "-6px";
          h.style.bottom = "-6px";
          h.style.cursor = "sw-resize";
          break;
        case "se":
          h.style.right = "-6px";
          h.style.bottom = "-6px";
          h.style.cursor = "se-resize";
          break;
      }

      // pointerdown for resize
      h.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        if (wrap.dataset.locked === "true") return;
        this._selectItemWrap(wrap);
        this._startResize(ev, wrap, id, pos);
      });

      handles.appendChild(h);
    });

    // Put everything in wrap
    wrap.appendChild(header);
    wrap.appendChild(codeContainer);
    wrap.appendChild(handles);

    // append to stage
    this.stage.appendChild(wrap);

    // Wire header drag & edit button behavior
    header.addEventListener("pointerdown", (e) => {
      // header pointerdown initiates drag (even during editing)
      if (wrap.dataset.locked === "true") {
        this._selectItemWrap(wrap);
        e.stopPropagation();
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      this._selectItemWrap(wrap);
      this._startDrag(e, wrap, id);
    });

    // Wire wrap doubleclick to start editing
    wrap.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (wrap.dataset.locked === "true") return;
      this.startEditing(id);
    });

    // wire edit button
    editBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const isEditing = !!item && item.editing;
      if (isEditing) this.stopEditing();
      else this.startEditing(id);
    });

    // store item
    const item = {
      id,
      wrap,
      header,
      titleEl,
      langSelect: "html",
      editBtn,
      previewPre: pre,
      editable,
      gutter,
      handles,
      world: { left: worldLeft || 0, top: worldTop || 0, width: width, height: height },
      code,
      language,
      editing: false,
      // placeholder for listeners to remove on stopEditing
      _listeners: null,
    };

    this.items.set(id, item);

    // initialize content (full highlighted code, not short)
    const initialCode = code && code.trim() ? code : CodeBlockManager.DEFAULT_SNIPPETS[language] || CodeBlockManager.DEFAULT_SNIPPETS.default;
    item.code = initialCode;
    pre.innerHTML = this._simpleHighlight(initialCode, language);
    editable.innerText = initialCode;
    this._updateGutterNumbersForItem(item);

    // Apply transform-based positioning & interact.js if available
    this._applyWorldToScreen(item);
    this._initInteractOnWrap(wrap, id);

    return id;
  }

  _wireWrapEvents(wrap, id) {
    // NOTE: events are wired per-create to ensure header handles drag and dblclick
    // This function kept for parity but not used in new create() path
  }

  _startDrag(ev, wrap, id) {
    const t = this.getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    const startLeft = Number(wrap.dataset.worldLeft || 0);
    const startTop = Number(wrap.dataset.worldTop || 0);

    this._activeDrag = {
      id,
      startWorld: world,
      startLeftTop: { left: startLeft, top: startTop },
    };

    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
  }

  _startResize(ev, wrap, id, handle) {
    const t = this.getTransform();
    const world = { x: (ev.clientX - t.x) / t.k, y: (ev.clientY - t.y) / t.k };

    const initialWidth = Number(wrap.dataset.worldWidth || this.defaults.width);
    const initialHeight = Number(wrap.dataset.worldHeight || this.defaults.height);

    this._activeResize = {
      id,
      handle,
      startWorld: world,
      startSize: { w: initialWidth, h: initialHeight },
    };

    this._selectItemWrap(wrap);
    document.addEventListener("pointermove", this._onDocPointerMove);
    document.addEventListener("pointerup", this._onDocPointerUp);
  }

  // Make sure editor updates position during drag operations
  _onDocPointerMove(e) {
    const t = this.getTransform();
    const world = { x: (e.clientX - t.x) / t.k, y: (e.clientY - t.y) / t.k };

    if (this._activeResize) {
      const { id, handle, startWorld, startSize } = this._activeResize;
      const item = this.items.get(id);
      if (!item) return;
      const wrap = item.wrap;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      let newW = startSize.w;
      let newH = startSize.h;
      let newLeft = Number(wrap.dataset.worldLeft || 0);
      let newTop = Number(wrap.dataset.worldTop || 0);

      const minW = this.defaults.minWidth;
      const minH = this.defaults.minHeight;

      if (handle === "se") {
        newW = Math.max(minW, startSize.w + dx);
        newH = Math.max(minH, startSize.h + dy);
      } else if (handle === "sw") {
        newW = Math.max(minW, startSize.w - dx);
        newH = Math.max(minH, startSize.h + dy);
        newLeft = newLeft + (startSize.w - newW);
      } else if (handle === "ne") {
        newW = Math.max(minW, startSize.w + dx);
        newH = Math.max(minH, startSize.h - dy);
        newTop = newTop + (startSize.h - newH);
      } else if (handle === "nw") {
        newW = Math.max(minW, startSize.w - dx);
        newH = Math.max(minH, startSize.h - dy);
        newLeft = newLeft + (startSize.w - newW);
        newTop = newTop + (startSize.h - newH);
      }

      wrap.dataset.worldLeft = String(newLeft);
      wrap.dataset.worldTop = String(newTop);
      wrap.dataset.worldWidth = String(newW);
      wrap.dataset.worldHeight = String(newH);

      this._applyWorldToScreen(item);

      // Update editor position during resize
      if (id === this._selectedCodeBlockId) {
        this._positionCodeBlockEditor(wrap);
      }

      // Update action toolbar position during resize
      if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
        this.app._scheduleToolbarReposition();
      }

      if (item.editing) this._updateEditorPositionFor(id);
      return;
    }

    if (this._activeDrag) {
      const { id, startWorld, startLeftTop } = this._activeDrag;
      const item = this.items.get(id);
      if (!item) return;
      const wrap = item.wrap;

      const dx = world.x - startWorld.x;
      const dy = world.y - startWorld.y;

      wrap.dataset.worldLeft = String(startLeftTop.left + dx);
      wrap.dataset.worldTop = String(startLeftTop.top + dy);

      this._applyWorldToScreen(item);

      // Update editor position during drag
      if (id === this._selectedCodeBlockId) {
        this._positionCodeBlockEditor(wrap);
      }

      // Update action toolbar position during drag
      if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
        this.app._scheduleToolbarReposition();
      }

      if (item.editing) this._updateEditorPositionFor(id);
    }
  }

  _onDocPointerUp() {
    this._activeDrag = null;
    this._activeResize = null;
    document.removeEventListener("pointermove", this._onDocPointerMove);
    document.removeEventListener("pointerup", this._onDocPointerUp);
  }

  _initInteractOnWrap(wrap, id) {
    if (typeof interact === "undefined") return;

    const startState = {};

    interact(wrap).draggable({
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;
          this._selectItemWrap(wrap);
          startState.worldLeft = Number(wrap.dataset.worldLeft || 0);
          startState.worldTop = Number(wrap.dataset.worldTop || 0);
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;
          const t = this.getTransform();
          const k = t.k || 1;
          const worldDx = (evt.dx || 0) / k;
          const worldDy = (evt.dy || 0) / k;

          const newWorldLeft = (Number(wrap.dataset.worldLeft) || 0) + worldDx;
          const newWorldTop = (Number(wrap.dataset.worldTop) || 0) + worldDy;

          wrap.dataset.worldLeft = String(newWorldLeft);
          wrap.dataset.worldTop = String(newWorldTop);

          const item = this.items.get(id);
          if (item) {
            this._applyWorldToScreen(item);
            if (item.editing) this._updateEditorPositionFor(id);
          }

          this._applyWorldToScreen(wrap);

          if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
            this.app._scheduleToolbarReposition();
          }
        },
      },
      inertia: false,
    });

    interact(wrap).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        start: (evt) => {
          if (wrap.dataset.locked === "true") return;
          this._selectItemWrap(wrap);

          startState.screenRect = wrap.getBoundingClientRect();
          startState.worldLeft = Number(wrap.dataset.worldLeft || 0);
          startState.worldTop = Number(wrap.dataset.worldTop || 0);
          startState.worldWidth = Number(wrap.dataset.worldWidth || this.defaults.width);
          startState.worldHeight = Number(wrap.dataset.worldHeight || this.defaults.height);
        },
        move: (evt) => {
          if (wrap.dataset.locked === "true") return;

          const rect = evt.rect;
          if (!rect) return;

          const t = this.getTransform();
          const k = t.k || 1;

          const screenDeltaLeft = rect.left - (startState.screenRect ? startState.screenRect.left : rect.left);
          const screenDeltaTop = rect.top - (startState.screenRect ? startState.screenRect.top : rect.top);
          const worldDeltaLeft = screenDeltaLeft / k;
          const worldDeltaTop = screenDeltaTop / k;

          const newWorldLeft = (startState.worldLeft || 0) + worldDeltaLeft;
          const newWorldTop = (startState.worldTop || 0) + worldDeltaTop;
          const newWorldWidth = rect.width / k;
          const newWorldHeight = rect.height / k;

          wrap.dataset.worldLeft = String(newWorldLeft);
          wrap.dataset.worldTop = String(newWorldTop);
          wrap.dataset.worldWidth = String(newWorldWidth);
          wrap.dataset.worldHeight = String(newWorldHeight);

          const item = this.items.get(id);
          if (item) {
            this._applyWorldToScreen(item);
            if (item.editing) this._updateEditorPositionFor(id);
          }

          if (this.app && typeof this.app._scheduleToolbarReposition === "function") {
            this.app._scheduleToolbarReposition();
          }
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: this.defaults.minWidth, height: this.defaults.minHeight },
        }),
      ],
      inertia: false,
    });
  }

  /* ---------------------- single-face editor handling ----------------------- */

  /**
   * Start editing the item in-place (single face inside stage).
   * Header is drag-handle; gutter/handles remain usable while editing.
   */
  startEditing(id) {
    const item = this.items.get(id);
    if (!item) return;

    // If another is open, close it
    if (this._editingId && this._editingId !== id) {
      this.stopEditing();
    }

    // Ensure preview text exists and the editable contains full code
    const initialCode = (item.code || "").trim() || CodeBlockManager.DEFAULT_SNIPPETS[item.language] || CodeBlockManager.DEFAULT_SNIPPETS.default;
    item.code = initialCode;
    item.previewPre.innerHTML = this._simpleHighlight(initialCode, item.language || "html");
    item.editable.innerText = initialCode;
    this._updateGutterNumbersForItem(item);

    // Make editable visually active & focus caret
    item.wrap.classList.add("editing");
    item.editing = true;
    this._editingId = id;

    // Show gutter & handles when editing
    item.gutter.style.display = "block";
    item.handles && Array.from(item.handles || item.wrap.querySelectorAll(".resize-handle")).forEach((h) => (h.style.display = "block"));

    // Attach listeners (per-item)
    const onInput = () => {
      const code = item.editable.innerText.replace(/\u00A0/g, " ");
      item.previewPre.innerHTML = this._simpleHighlight(code, item.language || "html");
      item.code = code;
      this._updateGutterNumbersForItem(item);
    };

    const onKeyDown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, "  ");
        onInput();
      }
      if (e.key === "Escape") {
        // finish editing on Esc (optional)
        this.stopEditing();
      }
    };

    // Keep reference to listeners so we can remove them later
    item._listeners = { onInput, onKeyDown };

    item.editable.addEventListener("input", onInput);
    item.editable.addEventListener("keydown", onKeyDown);

    // Focus caret at end
    this._placeCaretAtEnd(item.editable);

    // Make sure layout/scale is correct so editing face visually matches preview
    this._applyWorldToScreen(item);
  }

  _updateEditorPositionFor(id) {
    // Because editing face is inside wrap, the only thing to keep in sync is
    // the scaled font sizes which _applyWorldToScreen already does. This method
    // kept for parity with previous overlay approach.
    const item = this.items.get(id);
    if (!item) return;
    this._applyWorldToScreen(item);
  }

  _placeCaretAtEnd(el) {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  stopEditing() {
    // Stop editing current item
    const id = this._editingId;
    if (!id) return;
    const item = this.items.get(id);
    if (!item) return;

    // Persist code & update preview (full highlighted)
    const code = item.editable.innerText.replace(/\u00A0/g, " ");
    item.code = code;
    item.previewPre.innerHTML = this._simpleHighlight(code, item.language || "html");

    // Remove editing state and listeners
    if (item._listeners) {
      item.editable.removeEventListener("input", item._listeners.onInput);
      item.editable.removeEventListener("keydown", item._listeners.onKeyDown);
      item._listeners = null;
    }

    item.wrap.classList.remove("editing");
    item.editing = false;
    this._editingId = null;

    // Hide gutter if you prefer to hide when not editing
    // item.gutter.style.display = "none";
    // Keep handles hidden until selected
    item.wrap.querySelectorAll(".resize-handle").forEach((h) => (h.style.display = "none"));
  }

  toggleLineNumbers(on) {
    for (const item of this.items.values()) {
      item.gutter.style.display = on ? "block" : "none";
    }
    this._editorLineNumbersOn = !!on;
  }

  toggleTheme(themeName) {
    // minimal; just swap colors for all items
    const dark = themeName && themeName.toLowerCase && themeName.toLowerCase() === "dark";
    for (const item of this.items.values()) {
      const pre = item.previewPre;
      const editable = item.editable;
      const gutter = item.gutter;
      if (dark) {
        if (pre) {
          pre.style.color = "#e6eef6";
          pre.style.background = "#071018";
        }
        if (editable) editable.style.caretColor = "#fff";
        if (gutter) {
          gutter.style.background = "#071018";
          gutter.style.color = "#9aa3ad";
        }
      } else {
        if (pre) {
          pre.style.color = "#0b1220";
          pre.style.background = "transparent";
        }
        if (editable) editable.style.caretColor = "#000";
        if (gutter) {
          gutter.style.background = "transparent";
          gutter.style.color = "#8b95a1";
        }
      }
    }
  }

  /* ---------------------- helpers for single-face ---------------------- */

  _updateGutterNumbersForItem(item) {
    const gutter = item.gutter;
    if (!gutter) return;
    const lines = (item.editable ? item.editable.innerText : item.code || "").split(/\n/).length;
    let out = "";
    for (let i = 1; i <= lines; i++) out += i + "\n";
    gutter.textContent = out.trim();
  }

  /* ---------------------- minimal syntax highlighter ---------------------- */

  _escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  _simpleHighlight(code, language) {
    language = (language || "plaintext").toLowerCase();
    const esc = (s) => this._escapeHtml(s);

    if (language === "html" || language === "xml") {
      let c = esc(code);
      c = c.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="token comment">$1</span>');
      c = c.replace(/(&lt;\/?)([a-zA-Z0-9\-:]+)([^&gt;]*?)(&gt;)/g, (m, open, tag, rest, close) => {
        const attrs = (rest || "").replace(/([a-zA-Z\-:]+)(=(".*?"|'.*?'|[^\s"'>=]+))?/g, (m2, name, val) => {
          if (val) return ' <span class="token attr">' + name + '</span><span class="token punct">=</span><span class="token string">' + esc(String(val).replace(/^=/, "")) + "</span>";
          return ' <span class="token attr">' + name + "</span>";
        });
        return '<span class="token punct">' + open + '</span><span class="token tag">' + tag + "</span>" + attrs + '<span class="token punct">' + close + "</span>";
      });
      c = c.replace(/(\b\d+\b)/g, '<span class="token number">$1</span>');
      return c;
    }

    if (language === "css") {
      let c = esc(code);
      c = c.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="token comment">$1</span>');
      c = c.replace(/([^\{\}\n]+)\s*\{/g, (m, sel) => '<span class="token tag">' + esc(sel.trim()) + "</span> { ");
      c = c.replace(/([a-zA-Z-]+)\s*:/g, '<span class="token attr">$1</span>:');
      c = c.replace(/(:\s*)(#[0-9a-fA-F]+|\d+px|\d+%|".*?"|'.*?')/g, '$1<span class="token string">$2</span>');
      return c;
    }

    if (["javascript", "js", "jsx", "typescript", "ts"].includes(language)) {
      let c = esc(code);
      c = c.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="token comment">$1</span>');
      c = c.replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="token string">$1</span>');
      c = c.replace(/\b(const|let|var|function|return|if|else|for|while|class|new|try|catch|throw|import|from)\b/g, '<span class="token keyword">$1</span>');
      c = c.replace(/(\b\d+\b)/g, '<span class="token number">$1</span>');
      c = c.replace(/([{}()\[\];,\.])/g, '<span class="token punct">$1</span>');
      return c;
    }

    return esc(code);
  }

  /* ----------------------- utility operations --------------------------- */

  setLanguage(id, lang) {
    const item = this.items.get(id);
    if (!item) return;
    item.language = lang;
    item.langSelect && (item.langSelect.value = lang);
    const codeText = item.code || "";
    item.previewPre.innerHTML = this._simpleHighlight(codeText, lang);
  }

  remove(id) {
    const item = this.items.get(id);
    if (!item) return;
    if (item.editing) this.stopEditing();
    if (item.wrap && item.wrap.parentNode) item.wrap.parentNode.removeChild(item.wrap);
    this.items.delete(id);
  }

  serialize(id) {
    const item = this.items.get(id);
    if (!item) return null;
    return {
      id: item.id,
      left: parseFloat(item.wrap.dataset.worldLeft || item.world.left || 0),
      top: parseFloat(item.wrap.dataset.worldTop || item.world.top || 0),
      width: parseFloat(item.wrap.dataset.worldWidth || item.world.width || this.defaults.width),
      height: parseFloat(item.wrap.dataset.worldHeight || item.world.height || this.defaults.height),
      code: item.code,
      language: item.language || "plaintext",
    };
  }

  restoreFromData(data) {
    return this.create(data.left, data.top, {
      width: data.width,
      height: data.height,
      code: data.code,
      language: data.language,
      label: data.label || "Code Block",
    });
  }

  destroy() {
    // stop active editing
    this.stopEditing();
    for (const id of Array.from(this.items.keys())) this.remove(id);
    this.stage.removeEventListener("pointerdown", this._onStagePointerDown);
    this.detach();
  }
}
