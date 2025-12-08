const Inline = Quill.import("blots/inline");
const Block = Quill.import("blots/block");
const BlockEmbed = Quill.import("blots/block/embed");
// const BlockQuote = Quill.import("formats/blockquote");

//////////////////////////////////////////
// Letter Spacing
// Define the LetterSpacing format
class LetterSpacingBlot extends Inline {
  static create(value) {
    const node = super.create();
    if (value) {
      node.style.letterSpacing = typeof value === "string" ? value : `${value}px`;
    }
    return node;
  }

  static formats(domNode) {
    return domNode.style.letterSpacing || undefined;
  }

  format(name, value) {
    if (name === "letterSpacing") {
      if (value) {
        this.domNode.style.letterSpacing = typeof value === "string" ? value : `${value}px`;
      } else {
        this.domNode.style.removeProperty("letter-spacing");
      }
    } else {
      super.format(name, value);
    }
  }
}

LetterSpacingBlot.blotName = "letterSpacing";
LetterSpacingBlot.tagName = "span";
Quill.register(LetterSpacingBlot);

//////////////////////////////////////////
// Outline
class OutlineBlot extends Inline {
  static create(value) {
    let node = super.create();
    if (value) {
      node.style.border = "1px solid " + value; // Add border to outline the text
    }
    return node;
  }

  static formats(node) {
    return node.style.border.split(" ")[2]; // Return the color value for the outline
  }

  format(name, value) {
    if (name === "outline" && value) {
      this.domNode.style.border = "1px solid " + value;
    } else {
      super.format(name, value);
    }
  }
}

OutlineBlot.blotName = "outline";
OutlineBlot.tagName = "span";
Quill.register(OutlineBlot);

//////////////////////////////////////////
// Highlight
class HighlightBlot extends Inline {
  static create(value) {
    const node = super.create();
    node.setAttribute("data-highlight", value);
    node.style.backgroundColor = value;
    return node;
  }

  static formats(node) {
    return node.getAttribute("data-highlight") || "";
  }

  format(name, value) {
    if (name === "highlight") {
      if (value) {
        this.domNode.setAttribute("data-highlight", value);
        this.domNode.style.backgroundColor = value;
      } else {
        this.domNode.removeAttribute("data-highlight");
        this.domNode.style.backgroundColor = "";
      }
    } else {
      super.format(name, value);
    }
  }
}

HighlightBlot.blotName = "highlight";
HighlightBlot.tagName = "span";
Quill.register(HighlightBlot);

//////////////////////////////////////////
// Line Height Blot
class LineHeightBlot extends Block {
  static create(value) {
    let node = super.create();
    if (value) {
      node.style.lineHeight = value; // Apply line-height at the block level
    }
    return node;
  }

  static formats(node) {
    return node.style.lineHeight || null; // Return the applied line-height value
  }

  format(name, value) {
    if (name === "lineHeight" && value) {
      this.domNode.style.lineHeight = value; // Set the line-height
    } else {
      super.format(name, value); // Fallback to other formats
    }
  }
}

LineHeightBlot.blotName = "lineHeight";
LineHeightBlot.tagName = "p";
Quill.register(LineHeightBlot);

//////////////////////////////////////////
// Paragraph Parchment
const Parchment = Quill.import("parchment");

let ParagraphSpacingAttributor = new Parchment.Attributor.Style("paragraphSpacing", "margin-bottom", {
  scope: Parchment.Scope.BLOCK,
  whitelist: ["0em", "0.5em", "1em", "1.5em", "2em", "6em"],
});

Quill.register(ParagraphSpacingAttributor, true);

//////////////////////////////////////////
// Chart Blot
class ChartBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("contenteditable", false);

    // Create a canvas element for Chart.js
    const canvas = document.createElement("canvas");
    node.appendChild(canvas);

    // Store chart config and data
    const chartData = value || { type: "pie", data: { datasets: [] }, options: {} };
    const chart = new Chart(canvas, chartData); // Initialize the chart

    // Resize handling
    canvas.style.width = "100%"; // Ensure chart fits the container
    node.chart = chart; // Save chart instance in the DOM node for resizing later

    return node;
  }

  static value(node) {
    return node?.chart?.config; // Save chart config when blot is serialized
  }

  // Resize the chart when necessary
  resize() {
    if (this.domNode.chart) {
      this.domNode.chart.resize();
    }
  }
}

ChartBlot.blotName = "chart";
ChartBlot.tagName = "div"; // Embed as a div block
Quill.register(ChartBlot);

//////////////////////////////////////////
// Divider Blot
class DividerBlot extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute("class", "custom-hr");
    return node;
  }
}

DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr";

// Register the divider blot
Quill.register(DividerBlot);

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Shapes Blot
class ShapeBlot extends BlockEmbed {
  static #rotation = 0;
  static shapeContainerWrapper;
  static editingContainer = focusedEditor?.container?.querySelector(".ql-editor");
  static bgColorButtonId;

  static create(value) {
    const node = super.create();
    node.setAttribute("contenteditable", false);
    node.style.display = "block";
    node.style.position = "relative";
    node.style.width = "fit-content";
    node.style.height = "fit-content";
    node.style.margin = "10px";
    node.id = "shape_wrapper";
    node.classList.add("active");

    const shapeWrapper = document.createElement("div");
    shapeWrapper.className = "shape-wrapper";
    shapeWrapper.style.position = "relative";
    shapeWrapper.style.height = "100%";

    // editable container
    const editableElement = document.createElement("div");
    editableElement.className = `shape_editing_container ${value.type}`;
    editableElement.setAttribute("contenteditable", "true");

    // Resize Handlers
    const resizeHandles = [
      { position: "top-left", class: "resize_top_left" },
      { position: "top-right", class: "resize_top_right" },
      { position: "bottom-left", class: "resize_bottom_left" },
      { position: "bottom-right", class: "resize_bottom_right" },
      { position: "top", class: "resize_middle_top" },
      { position: "bottom", class: "resize_middle_bottom" },
      { position: "left", class: "resize_middle_left" },
      { position: "right", class: "resize_middle_right" },
    ];

    resizeHandles.forEach((handle) => {
      const resizeBtn = createElement("div", `resize_btn table_resize ${handle.class}`);
      shapeWrapper.appendChild(resizeBtn);
    });

    // Action Handlers
    const actionsHandler = [
      // { class: "rotate_action", icon: rotateIcon },
      { class: "move_action", icon: moveIcon },
      { class: "delete_action", icon: deleteIcon },
      { class: "bg_color_action", icon: bgColorIcon },
    ];

    const actionBtnWrappper = createElement("div", "action_btn--wrapper");
    actionBtnWrappper.style.bottom = "-30px";
    actionBtnWrappper.style.top = "initial";

    const shapeBgTextColorPickrRandom = Math.random().toString().split(".").at(-1);

    actionsHandler.forEach((handle) => {
      const actionBtn = createElement("button", `action_btn ${handle.class}`);
      actionBtn.innerHTML = handle.icon;

      if (handle.class === "bg_color_action") {
        const shapeBgTextColorPickr = document.createElement("div");
        const random = Math.random().toString().split(".").at(-1);

        shapeBgTextColorPickr.id = `shape_bg_text_color_pickr--${shapeBgTextColorPickrRandom}`;
        shapeBgTextColorPickr.style.position = "absolute";

        this.bgColorButtonId = random;
        actionBtn.id = `shape_bg_color--btn-${random}`;
        actionBtn.style.position = "relative";
        actionBtn.appendChild(shapeBgTextColorPickr);
      }

      actionBtnWrappper.appendChild(actionBtn);
    });

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", value.width || "100");
    svg.setAttribute("height", value.height || "100");
    svg.style.overflow = "visible";

    // Create shape based on type
    const shape = this.createSVGShape(value.type, parseInt(value.width || "100"), parseInt(value.height || "100"));
    svg.appendChild(shape);

    // Mouseenter & Mouseleave Editor
    this.editingContainer.addEventListener("mouseenter", function () {
      const shapeWrappers = this.querySelectorAll("#shape_wrapper");

      shapeWrappers.forEach((container) => {
        container.addEventListener("mouseenter", (e) => {
          this.setAttribute("contenteditable", "false");
        });

        container.addEventListener("mouseleave", (e) => {
          this.setAttribute("contenteditable", "true");
        });
      });
    });

    // Shape outside clicked
    document.addEventListener("click", function (e) {
      const allShapeWrapper = document.querySelectorAll("#shape_wrapper");

      if (!e.target.closest("#shape_wrapper")) {
        allShapeWrapper.forEach(function (shape) {
          const actionBtnWrapper = shape.querySelector(".action_btn--wrapper");
          const resizingButton = shape.querySelectorAll(".resize_btn");

          shape.classList.remove("active");
          actionBtnWrapper.classList.add(HIDDEN);
          resizingButton.forEach((btn) => btn.classList.add(HIDDEN));
        });
      } else {
        allShapeWrapper.forEach(function (shape) {
          const actionBtnWrapper = shape.querySelector(".action_btn--wrapper");
          const resizingButton = shape.querySelectorAll(".resize_btn");

          shape.classList.add("active");
          actionBtnWrapper.classList.remove(HIDDEN);
          resizingButton.forEach((btn) => btn.classList.remove(HIDDEN));
        });
      }
    });

    shapeWrapper.appendChild(svg);
    shapeWrapper.appendChild(editableElement);
    node.appendChild(actionBtnWrappper);
    node.appendChild(shapeWrapper);

    this.shapeContainerWrapper = node;

    // setup action buttons event
    this.setupActionButtonsEvents(actionBtnWrappper);

    // setup resizing features
    this.setupResizingButtons(this.shapeContainerWrapper);

    setTimeout(() => {
      // Create Picker Instance
      this.setupShapeBackgroundColorWithPickr(shapeBgTextColorPickrRandom, editableElement);
    }, 900);

    return node;
  }

  // setup shape background color with pickr
  static setupShapeBackgroundColorWithPickr(pickrContainerId, editableElement) {
    const clickButton = `shape_bg_color--btn-${this.bgColorButtonId}`;
    const customShapePickr = `shape_custom_pickr--${pickrContainerId}`;

    const shapeBgColorPickrInstance = createPickrInstance(`#${clickButton}`, `#shape_bg_text_color_pickr--${pickrContainerId}`, customShapePickr); // this function is in init file
    const shapeBgColorBtn = document.getElementById(clickButton);
    const pcrApp = document.querySelector(`.${customShapePickr}`);
    pcrApp.id = "sizemug_shape_pikcr_bg_color";

    // Add stopPropagation to prevent closing
    pcrApp.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Show color picker
    shapeBgColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation(); // Add this to prevent event bubbling

      const buttonRect = shapeBgColorBtn.getBoundingClientRect();
      const pickerRoot = shapeBgColorPickrInstance.getRoot().root;

      // Position the picker
      pickerRoot.style.position = "absolute";
      pickerRoot.style.left = `${buttonRect.left}px`;
      pickerRoot.style.top = `${buttonRect.bottom + 5}px`; // Add a small offset

      // Add stopPropagation to the picker root
      pickerRoot.addEventListener("click", (e) => {
        e.stopPropagation();
      });

      // Ensure the picker is within the viewport
      setTimeout(() => {
        const pickerRect = pickerRoot.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (pickerRect.right > viewportWidth) {
          pickerRoot.style.left = `${viewportWidth - pickerRect.width}px`;
        }

        if (pickerRect.bottom > viewportHeight) {
          pickerRoot.style.top = `${buttonRect.top - pickerRect.height - 5}px`;
        }
      }, 0);

      pcrApp.style.display = "flex";
    });

    // Add document click listener to close picker when clicking outside
    document.addEventListener("click", (e) => {
      pcrApp.style.display = "flex";

      if (!pcrApp.contains(e.target) && !shapeBgColorBtn.contains(e.target)) {
        pcrApp.style.display = "none";
      }
    });

    shapeBgColorPickrInstance.on("save", (color) => {
      const colorValue = color.toHEXA().toString();
      editableElement.style.backgroundColor = colorValue;
      pcrApp.style.display = "none";
    });

    this.bgColorButtonId = ""; // clear color id after creation
  }

  static createSVGShape(type, width, height) {
    const shape = document.createElementNS("http://www.w3.org/2000/svg", type === "circle" ? "circle" : "path");

    shape.setAttribute("fill", "white");
    // shape.setAttribute("stroke", "black");
    shape.setAttribute("stroke-width", "2");

    switch (type) {
      case "circle":
        const radius = Math.min(width, height) / 2;
        shape.setAttribute("cx", width / 2);
        shape.setAttribute("cy", height / 2);
        shape.setAttribute("r", radius);
        shape.setAttribute("data-shape-type", "circle");

        break;

      case "triangle": {
        // Remove newlines and ensure no units are included
        const points = `${width / 2},0 ${width},${height} 0,${height}`;
        shape.setAttribute("d", `M ${points} Z`);
        shape.setAttribute("data-shape-type", "triangle");
        break;
      }

      case "rectangle": {
        // Remove newlines and ensure no units are included
        shape.setAttribute("d", `M 0,0 L ${width},0 L ${width},${height} L 0,${height} Z`);
        shape.setAttribute("data-shape-type", "rectangle");

        break;
      }
    }

    return shape;
  }

  static value(node) {
    const svg = node.querySelector("svg");
    return {
      type: this.getShapeType(svg.firstChild),
      width: svg.getAttribute("width"),
      height: svg.getAttribute("height"),
    };
  }

  static getShapeType(shape) {
    if (shape.tagName === "circle") return "circle";

    // For path elements, determine shape by analyzing the path data
    const d = shape.getAttribute("d");
    if (d.includes("Z")) {
      const points = d.split(" ").length;
      return points <= 5 ? "triangle" : "rectangle";
    }
    return "rectangle"; // default
  }

  // Resizing Table
  static setupResizingButtons(tableOuterContainer) {
    const updateSVGDimensions = this.updateSVGDimensions;

    // Select each resizing button
    const resizeButtons = tableOuterContainer.querySelectorAll(".resize_btn");

    resizeButtons.forEach((button) => {
      let edges = {};

      // Determine edges based on button's class
      if (button.classList.contains("resize_top_left")) {
        edges = { top: true, left: true };
      } else if (button.classList.contains("resize_top_right")) {
        edges = { top: true, right: true };
      } else if (button.classList.contains("resize_bottom_left")) {
        edges = { bottom: true, left: true };
      } else if (button.classList.contains("resize_bottom_right")) {
        edges = { bottom: true, right: true };
      } else if (button.classList.contains("resize_middle_top")) {
        edges = { top: true };
      } else if (button.classList.contains("resize_middle_bottom")) {
        edges = { bottom: true };
      } else if (button.classList.contains("resize_middle_left")) {
        edges = { left: true };
      } else if (button.classList.contains("resize_middle_right")) {
        edges = { right: true };
      }

      // Attach Interact.js resizing event to the button
      interact(button).draggable({
        onmove(event) {
          // Calculate new dimensions based on the resize handle's position
          const tableRect = tableOuterContainer.getBoundingClientRect();
          let newWidth = tableRect.width + (edges.right ? event.dx : edges.left ? -event.dx : 0);
          let newHeight = tableRect.height + (edges.bottom ? event.dy : edges.top ? -event.dy : 0);

          // Apply the new dimensions to the table container
          tableOuterContainer.style.width = `${newWidth}px`;
          tableOuterContainer.style.height = `${newHeight}px`;

          // Call SVG update function if necessary
          updateSVGDimensions(tableOuterContainer, { width: newWidth, height: newHeight });
        },
      });
    });
  }

  // Update SVG Dimension
  static updateSVGDimensions(tableOuterContainer, { width, height }) {
    const svg = tableOuterContainer.querySelector(".shape-wrapper>svg");

    if (svg) {
      // Set SVG to be fully responsive
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.display = "block"; // Prevent unwanted margins

      const shape = svg.querySelector("circle, path");
      if (shape) {
        if (shape.tagName.toLowerCase() === "circle") {
          const radius = Math.min(width, height) / 2;
          shape.setAttribute("cx", width / 2);
          shape.setAttribute("cy", height / 2);
          shape.setAttribute("r", radius);
        } else if (shape.tagName.toLowerCase() === "path") {
          const type = shape.getAttribute("data-shape-type") || "rectangle";

          switch (type) {
            case "triangle": {
              // Simple triangle that scales with container
              const path = [
                `M ${width / 2},0`, // Top center
                `L ${width},${height}`, // Bottom right
                `L 0,${height}`, // Bottom left
                "Z", // Close path
              ].join(" ");

              shape.setAttribute("d", path);
              break;
            }
            case "rectangle":
              shape.setAttribute("d", `M 0,0 L ${width},0 L ${width},${height} L 0,${height} Z`);
              break;
          }
        }
      }
    }
  }

  static setupActionButtonsEvents(btnsContainer) {
    // const rotateBtn = btnsContainer.querySelector(".rotate_action");
    const moveBtn = btnsContainer.querySelector(".move_action");
    const deleteBtn = btnsContainer.querySelector(".delete_action");

    // rotateBtn.addEventListener("click", () => this.#rotationHandler(rotateBtn));
    deleteBtn.addEventListener("click", () => this.#deleteHandler(deleteBtn));

    // Register move event on the button
    this.#setupShapeMoving(moveBtn);
  }

  // Function to delete the shape
  static #deleteHandler(deleteBtn) {
    deleteBtn.closest("#shape_wrapper").remove();
  }

  // Function to move the shape
  static #setupShapeMoving(moveBtn) {
    const shapeContainerWrapper = this.shapeContainerWrapper;
    const editingContainer = this.editingContainer;

    // Set up interact.js draggable on moveBtn
    interact(moveBtn).draggable({
      listeners: {
        // Called whenever moveBtn is dragged
        move(event) {
          // Get current position of shapeContainer
          let x = (parseFloat(shapeContainerWrapper.getAttribute("data-x")) || 0) + event.dx;
          let y = (parseFloat(shapeContainerWrapper.getAttribute("data-y")) || 0) + event.dy;

          // Update shapeContainerWrapper's position
          shapeContainerWrapper.style.transform = `translate(${x}px, ${y}px)`;

          // Update data attributes with the new position
          shapeContainerWrapper.setAttribute("data-x", x);
          shapeContainerWrapper.setAttribute("data-y", y);
        },
      },
      inertia: true,
      // Restrict modifier property
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: editingContainer, // Restrict within the current focused bounds
          // endOnly: true,
        }),
      ],
    });
  }
}

ShapeBlot.blotName = "shape";
ShapeBlot.tagName = "div";

// Register the custom blot
Quill.register(ShapeBlot);

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// TABLE BLOT
class TableBlot extends BlockEmbed {
  static editingContainer = focusedEditor?.container?.querySelector(".ql-editor");

  static create(value) {
    // Create main wrapper
    const tableOuterContainer = super.create();
    tableOuterContainer.classList.add("insert_outer_wrapper", "table_whole_container");
    tableOuterContainer.setAttribute("data-table-status", "deactivate");

    const tableInnerContainer = createElement("div", "insert_inner_wrapper");

    // Create table structure
    const table = document.createElement("table");
    table.id = "inserted-table";

    for (let i = 0; i < value.rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < value.cols; j++) {
        const cell = row.insertCell();
        const input = document.createElement("input");
        input.type = "text";
        input.className = "table-cell-input";
        cell.appendChild(input);
      }
    }

    // Create resize, rotate, and action buttons
    const actionWrapper = TableBlot.createActionWrapper();
    const resizeHandles = TableBlot.createResizeHandles(tableInnerContainer);
    const quickTableActions = TableBlot.createQuickActions();

    // Append everything to the main wrapper
    tableInnerContainer.appendChild(table);
    tableOuterContainer.appendChild(actionWrapper);
    tableOuterContainer.appendChild(quickTableActions);
    tableOuterContainer.appendChild(resizeHandles);

    // Mouseenter & Mouseleave Editor
    this.editingContainer.addEventListener("mouseenter", function () {
      const insertOuterWrapper = this.querySelectorAll(".insert_outer_wrapper");

      insertOuterWrapper.forEach((container) => {
        container.addEventListener("mouseenter", (e) => {
          this.setAttribute("contenteditable", "false");
        });

        container.addEventListener("mouseleave", (e) => {
          this.setAttribute("contenteditable", "true");
        });
      });
    });

    // Shape outside clicked
    document.addEventListener("click", (e) => {
      const allTableContainerWrapper = document.querySelectorAll(".table_whole_container");

      if (!e.target.closest(".table_whole_container")) {
        allTableContainerWrapper.forEach((container) => {
          const optionAction = container.querySelector(".options_action");

          optionAction.classList.remove("active");
          this.toggleTableButtonsHandler(container, "unactive");
        });
      } else if (!e.target.closest(".options_action")) {
        allTableContainerWrapper.forEach((container) => {
          const optionAction = container.querySelector(".options_action");

          optionAction.classList.add("active");
          this.toggleTableButtonsHandler(container, "active");
        });
      }
    });

    // Event listeners for resizing, rotating, edit toggle, action, quick events, focus within table.
    // TableBlot.setupActions(tableOuterContainer);
    TableBlot.setupTableDeletion(tableOuterContainer);
    TableBlot.setupTableRotation(tableOuterContainer);
    TableBlot.setupTableMovement(tableOuterContainer);
    TableBlot.setupToggleEditState(tableOuterContainer);
    TableBlot.setupResizingButtons(tableOuterContainer);
    TableBlot.setupActivateTable(tableOuterContainer);
    TableBlot.setupQuickEvent(tableOuterContainer.querySelector(".quick_btn--wrapper"));
    return tableOuterContainer;
  }

  static value(domNode) {
    // Extract value to store in Delta
    const rows = domNode.querySelectorAll("tr").length;
    const cols = domNode.querySelector("tr") ? domNode.querySelector("tr").cells.length : 0;
    return { rows, cols };
  }

  static createActionWrapper() {
    const actionBtnsWrappper = createElement("div", "action_btn--wrapper");
    const actionsHandler = [
      { class: "rotate_action", icon: rotateIcon },
      { class: "delete_action", icon: deleteIcon },
      { class: "move_action", icon: moveIcon },
      // options actions being last is neccessary here: I am using it when toggling the button state, to keep it from being dissapear
      { class: "options_action", icon: editIcon },
    ];

    actionsHandler.forEach((handle) => {
      const actionBtn = createElement("button", `action_btn ${handle.class} ${handle.class !== "options_action" && HIDDEN}`);
      actionBtn.innerHTML = handle.icon;
      actionBtnsWrappper.appendChild(actionBtn);
    });

    return actionBtnsWrappper;
  }

  // Setup Table Resize Buttons
  static createResizeHandles(tableInnerContainer) {
    const resizeHandles = [
      { position: "top-left", class: "resize_top_left" },
      { position: "top-right", class: "resize_top_right" },
      { position: "bottom-left", class: "resize_bottom_left" },
      { position: "bottom-right", class: "resize_bottom_right" },
      { position: "top", class: "resize_middle_top" },
      { position: "bottom", class: "resize_middle_bottom" },
      { position: "left", class: "resize_middle_left" },
      { position: "right", class: "resize_middle_right" },
    ];

    resizeHandles.forEach((handle) => {
      const resizeBtn = createElement("div", `resize_btn table_resize ${handle.class} ${HIDDEN}`);
      tableInnerContainer.appendChild(resizeBtn);
    });

    return tableInnerContainer;
  }

  // Bottom Table Tools (Quick Action Buttons)
  static createQuickActions() {
    const quickBtnWrappper = createElement("div", `quick_btn--wrapper ${HIDDEN}`);
    const tableOptionsHandler = [
      { class: "no_grid_action", icon: noGridIcon, dataset: "no-grid", tooltip: "No Grid" },
      { class: "col_grid_center_action", icon: colGridCenterIcon, dataset: "col-grid-center", tooltip: "Column Grid Center" },
      { class: "col_grid_left_action", icon: colGridLeftIcon, dataset: "col-grid-left", tooltip: "Column Grid Left" },
      { class: "col_grid_right_action", icon: colGridRightIcon, dataset: "col-grid-right", tooltip: "Column Grid Right" },
      { class: "row_grid_center_action", icon: rowGridCenterIcon, dataset: "row-grid-center", tooltip: "Row Grid Center" },
      { class: "row_grid_top_action", icon: rowGridTopIcon, dataset: "row-grid-top", tooltip: "Row Grid Top" },
      { class: "row_grid_bottom_action", icon: rowGridBottomIcon, dataset: "row-grid-bottom", tooltip: "Row Grid Bottom" },
      { class: "row_grid_right_action", icon: rowGridCenterIcon, dataset: "outline-grid", tooltip: "Outline Grid" },
    ];

    tableOptionsHandler.forEach((handle) => {
      const quickBtn = createElement("button", `quick_table_btn ${handle.class}`);
      quickBtn.innerHTML = handle.icon;
      quickBtn.setAttribute("data-quick-type", handle.dataset);

      const tooltip = createElement("i", "paper_tool--tooltip");
      tooltip.textContent = handle.tooltip;

      quickBtn.style.position = "relative";
      quickBtn.appendChild(tooltip);
      quickBtnWrappper.appendChild(quickBtn);
    });

    return quickBtnWrappper;
  }

  // Delete Table
  static setupTableDeletion(tableOuterContainer) {
    const deleteAction = tableOuterContainer.querySelector(".delete_action");
    deleteAction.addEventListener("click", () => tableOuterContainer.remove());
  }

  // Rotate Table
  static setupTableRotation(tableOuterContainer) {
    const rotateBtn = tableOuterContainer.querySelector(".rotate_action");
    let rotation = 0;

    rotateBtn.addEventListener("click", () => {
      rotation = (rotation + 90) % 360;
      tableOuterContainer.style.transform = `rotate(${rotation}deg)`;

      const rect = tableOuterContainer.getBoundingClientRect();
      const parent = this.editingContainer.getBoundingClientRect();

      // Adjust position if the rotated element exceeds the container
      let x = parseFloat(tableOuterContainer.getAttribute("data-x") || 0);
      let y = parseFloat(tableOuterContainer.getAttribute("data-y") || 0);

      if (rect.right > parent.right) {
        x -= rect.right - parent.right;
      }
      if (rect.bottom > parent.bottom) {
        y -= rect.bottom - parent.bottom;
      }
      tableOuterContainer.style.transform += ` translate(${x}px, ${y}px)`;

      tableOuterContainer.setAttribute("data-x", x);
      tableOuterContainer.setAttribute("data-y", y);

      const resizeButtons = tableOuterContainer.querySelectorAll(".resize_btn");
      const actionWrapper = tableOuterContainer.querySelector(".action_btn--wrapper");

      if (rotation % 180 === 0) {
        resizeButtons.forEach((btn) => (btn.style.transform = "rotate(0deg)"));
        actionWrapper.style.transform = "rotate(0deg)";
      } else {
        resizeButtons.forEach((btn) => (btn.style.transform = "rotate(-90deg)"));
        actionWrapper.style.transform = "rotate(-90deg)";
      }
    });
  }

  // Move Table
  static setupTableMovement(tableOuterContainer) {
    const editingContainer = this.editingContainer;
    const moveBtn = tableOuterContainer.querySelector(".move_action");

    interact(moveBtn).draggable({
      listeners: {
        start(event) {
          // Set data attributes for the initial position
          const target = tableOuterContainer;
          target.setAttribute("data-x", target.getAttribute("data-x") || 0);
          target.setAttribute("data-y", target.getAttribute("data-y") || 0);
        },
        move(event) {
          const target = tableOuterContainer;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          // Limit movement within the container bounds
          const parent = editingContainer.getBoundingClientRect();
          const rect = target.getBoundingClientRect();

          // Calculate the new position constrained within the parent
          const newX = Math.max(0, Math.min(x, parent.width - rect.width));
          const newY = Math.max(0, Math.min(y, parent.height - rect.height));

          // Apply the translation
          target.style.transform = `translate(${newX}px, ${newY}px)`;

          // Update data attributes
          target.setAttribute("data-x", newX);
          target.setAttribute("data-y", newY);
        },
      },
    });
  }

  // Toggle Table Edit State
  static setupToggleEditState(tableOuterContainer) {
    const toggleEditBtn = tableOuterContainer.querySelector(".options_action");

    toggleEditBtn.addEventListener("click", () => {
      const btnState = toggleEditBtn.classList.contains("active");

      if (btnState) {
        toggleEditBtn.classList.remove("active");
        return this.toggleTableButtonsHandler(tableOuterContainer, "unactive");
      } else {
        toggleEditBtn.classList.add("active");
        this.toggleTableButtonsHandler(tableOuterContainer, "active");
      }
    });
  }

  // Toggle table buttons
  static toggleTableButtonsHandler(tableOuterContainer, state = "active") {
    // show/hide all resizing buttons
    const resizeHandles = tableOuterContainer.querySelectorAll(".table_resize");
    resizeHandles.forEach((handle) => handle.classList[state === "active" ? "remove" : "add"](HIDDEN));

    // show/hide top actions buttons
    const actionsBtnsHandles = tableOuterContainer.querySelectorAll(".action_btn--wrapper .action_btn");
    const actionsButtons = Array.from(actionsBtnsHandles).slice(0, -1);
    actionsButtons.forEach((btn) => btn.classList[state === "active" ? "remove" : "add"](HIDDEN));

    // show/hide bottom quick buttons
    const quickBtnsContainer = tableOuterContainer.querySelector(".quick_btn--wrapper");
    quickBtnsContainer.classList[state === "active" ? "remove" : "add"](HIDDEN);
  }

  // Resizing Table
  static setupResizingButtons(tableOuterContainer) {
    // Define minimum width and height values
    const minWidth = 250; // Set your minimum width
    const minHeight = 150; // Set your minimum height

    // Select each resizing button
    const resizeButtons = tableOuterContainer.querySelectorAll(".resize_btn");

    resizeButtons.forEach((button) => {
      let edges = {};

      // Determine edges based on button's class
      if (button.classList.contains("resize_top_left")) {
        edges = { top: true, left: true };
      } else if (button.classList.contains("resize_top_right")) {
        edges = { top: true, right: true };
      } else if (button.classList.contains("resize_bottom_left")) {
        edges = { bottom: true, left: true };
      } else if (button.classList.contains("resize_bottom_right")) {
        edges = { bottom: true, right: true };
      } else if (button.classList.contains("resize_middle_top")) {
        edges = { top: true };
      } else if (button.classList.contains("resize_middle_bottom")) {
        edges = { bottom: true };
      } else if (button.classList.contains("resize_middle_left")) {
        edges = { left: true };
      } else if (button.classList.contains("resize_middle_right")) {
        edges = { right: true };
      }

      // Attach Interact.js resizing event to the button
      interact(button).draggable({
        onmove(event) {
          // Calculate new dimensions based on the resize handle's position
          const tableRect = tableOuterContainer.getBoundingClientRect();
          let newWidth = tableRect.width + (edges.right ? event.dx : edges.left ? -event.dx : 0);
          let newHeight = tableRect.height + (edges.bottom ? event.dy : edges.top ? -event.dy : 0);

          // Enforce minimum width and height
          newWidth = Math.max(newWidth, minWidth);
          newHeight = Math.max(newHeight, minHeight);

          // Apply the new dimensions to the table container
          tableOuterContainer.style.width = `${newWidth}px`;
          tableOuterContainer.style.height = `${newHeight}px`;
        },
      });
    });
  }

  // Focus in / Focus Out of table
  static setupActivateTable(tableOuterContainer) {
    tableOuterContainer.addEventListener("focusin", (e) => {
      tableOuterContainer.setAttribute("data-table-status", "activate");
    });

    tableOuterContainer.addEventListener("focusout", (e) => {
      if (e.relatedTarget?.closest(".navbar_header_tools--wrapper")) return;
      tableOuterContainer.setAttribute("data-table-status", "deactivate");
    });
  }

  // Setup quick events
  static setupQuickEvent(quickButtonsContainer) {
    const quickButtons = quickButtonsContainer.querySelectorAll("button");

    quickButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const { quickType } = btn.dataset;
        updateTableStyle(quickType, quickButtonsContainer.closest(".insert_outer_wrapper"));
      });
    });
  }
}

TableBlot.blotName = "table";
TableBlot.tagName = "div";
Quill.register(TableBlot);

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Arrow Blot
class ArrowBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute("contenteditable", false);
    node.style.display = "block";
    node.style.position = "relative";
    node.style.width = "fit-content";
    node.style.height = "fit-content";
    node.style.margin = "10px";
    node.id = "arrow_main_container_wrapper";

    const arrowMainContainer = createElement("div", "arrow_main_container");
    arrowMainContainer.style.position = "relative";

    // Create the SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "152px";
    svg.style.height = "auto";
    svg.style.left = "0px";
    svg.style.padding = "10px";

    // Create the polygon for the arrow
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", "0,0 100,50 0,100 20,50");
    polygon.setAttribute("fill", "black");
    polygon.setAttribute("stroke", "black");
    polygon.setAttribute("stroke-width", "1");

    // Append polygon to SVG and SVG to node
    svg.appendChild(polygon);
    arrowMainContainer.appendChild(svg);
    node.appendChild(arrowMainContainer);

    // click within
    document.addEventListener("click", (e) => {
      if (e.target.closest(".arrow_main_container")) {
        this.showArrowButtons(arrowMainContainer, true);
      } else {
        this.showArrowButtons(arrowMainContainer);
      }
    });

    ArrowBlot.createResizeHandles(arrowMainContainer);
    ArrowBlot.showArrowButtons(arrowMainContainer);
    ArrowBlot.setupResizingButtons(arrowMainContainer);

    return node;
  }

  // Toggle arrow buttons
  static showArrowButtons(arrowContainer, state = false) {
    // show/hide buttons
    const resizeBtns = arrowContainer.querySelectorAll(".resize_btn");
    resizeBtns.forEach((btn) => btn.classList[!state ? "add" : "remove"](HIDDEN));

    if (state) {
      arrowContainer.classList.add("active");
    } else {
      arrowContainer.classList.remove("active");
    }
  }

  // Setup Table Resize Buttons
  static createResizeHandles(arrowContainer) {
    const resizeHandles = [
      { position: "top-left", class: "resize_top_left" },
      { position: "top-right", class: "resize_top_right" },
      { position: "bottom-left", class: "resize_bottom_left" },
      { position: "bottom-right", class: "resize_bottom_right" },
      { position: "top", class: "resize_middle_top" },
      { position: "bottom", class: "resize_middle_bottom" },
      { position: "left", class: "resize_middle_left" },
      { position: "right", class: "resize_middle_right" },
    ];

    resizeHandles.forEach((handle) => {
      const resizeBtn = createElement("div", `resize_btn table_resize ${handle.class} ${HIDDEN}`);
      arrowContainer.appendChild(resizeBtn);
    });

    return arrowContainer;
  }

  // Resizing Table
  static setupResizingButtons(arrowMainContainerWrapper) {
    const updateArrowDimensions = this.updateArrowDimensions;

    // Select each resizing button
    const resizeButtons = arrowMainContainerWrapper.querySelectorAll(".resize_btn");

    resizeButtons.forEach((button) => {
      let edges = {};

      // Determine edges based on button's class
      if (button.classList.contains("resize_top_left")) {
        edges = { top: true, left: true };
      } else if (button.classList.contains("resize_top_right")) {
        edges = { top: true, right: true };
      } else if (button.classList.contains("resize_bottom_left")) {
        edges = { bottom: true, left: true };
      } else if (button.classList.contains("resize_bottom_right")) {
        edges = { bottom: true, right: true };
      } else if (button.classList.contains("resize_middle_top")) {
        edges = { top: true };
      } else if (button.classList.contains("resize_middle_bottom")) {
        edges = { bottom: true };
      } else if (button.classList.contains("resize_middle_left")) {
        edges = { left: true };
      } else if (button.classList.contains("resize_middle_right")) {
        edges = { right: true };
      }

      // Attach Interact.js resizing event to the button
      interact(button).draggable({
        onmove(event) {
          // Calculate new dimensions based on the resize handle's position
          const arrowRect = arrowMainContainerWrapper.getBoundingClientRect();
          let newWidth = arrowRect.width + (edges.right ? event.dx : edges.left ? -event.dx : 0);
          let newHeight = arrowRect.height + (edges.bottom ? event.dy : edges.top ? -event.dy : 0);

          // Apply the new dimensions to the table container
          arrowMainContainerWrapper.style.width = `${newWidth}px`;
          arrowMainContainerWrapper.style.height = `${newHeight}px`;

          // Call SVG update function if necessary
          updateArrowDimensions(arrowMainContainerWrapper, { width: newWidth, height: newHeight });
        },
      });
    });
  }

  // Update Arrow Dimensions
  static updateArrowDimensions(arrowMainContainerWrapper, { width, height }) {
    // Find the SVG inside the arrow container
    const svg = arrowMainContainerWrapper.querySelector(".arrow_main_container>svg");

    if (svg) {
      // Update only the SVG dimensions
      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;

      // Keep the original viewBox to maintain the polygon's shape
      svg.setAttribute("viewBox", "0 0 100 100");
    }
  }
}

// Register Arrow blot with a name
ArrowBlot.blotName = "arrow";
ArrowBlot.tagName = "div";
Quill.register(ArrowBlot);

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Image Upload Blot
class ImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.style.width = "345px";
    node.style.height = "200px";

    const imageFrameInner = createElement("div", "image_frame_inner");

    // Set the image source
    const img = document.createElement("img");
    img.src = value.url;
    img.classList.add("media_image--item");
    imageFrameInner.appendChild(img);

    // Create action buttons (rotate, delete) and append to the node
    const actionWrapper = document.createElement("div");
    actionWrapper.classList.add("action_btn--wrapper");
    const rotateBtn = ImageBlot.createActionButton("rotate_action", rotateIcon);
    const deleteBtn = ImageBlot.createActionButton("delete_action", deleteIcon);
    actionWrapper.appendChild(rotateBtn);
    actionWrapper.appendChild(deleteBtn);

    node.appendChild(imageFrameInner);
    node.appendChild(actionWrapper);

    // Set up resizing, rotation, and deletion functionality
    ImageBlot.addResizeHandles(imageFrameInner);
    ImageBlot.setupInteractResizing(node);
    ImageBlot.setupRotationAndDeletion(node);

    return node;
  }

  static value(node) {
    return {
      url: node.querySelector("img").src,
    };
  }

  static createActionButton(className, iconSVG) {
    const button = document.createElement("button");
    button.classList.add("action_btn", className);
    button.innerHTML = iconSVG;
    return button;
  }

  static addResizeHandles(container) {
    const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
    positions.forEach((pos) => {
      const handle = document.createElement("div");
      handle.classList.add("resize_btn", `resize_${pos.replace("-", "_")}`);
      container.appendChild(handle);
    });
  }

  static setupInteractResizing(container) {
    const minWidth = 250;
    const minHeight = 100;

    const resizeButtons = container.querySelectorAll(".resize_btn");

    resizeButtons.forEach((button) => {
      const edges = ImageBlot.getEdges(button);

      interact(button).draggable({
        onmove(event) {
          const tableRect = container.getBoundingClientRect();
          let newWidth = tableRect.width + (edges.right ? event.dx : edges.left ? -event.dx : 0);
          let newHeight = tableRect.height + (edges.bottom ? event.dy : edges.top ? -event.dy : 0);

          newWidth = Math.max(newWidth, minWidth);
          newHeight = Math.max(newHeight, minHeight);

          container.style.width = `${newWidth}px`;
          container.style.height = `${newHeight}px`;
        },
      });
    });
  }

  static getEdges(button) {
    if (button.classList.contains("resize_top_left")) return { top: true, left: true };
    if (button.classList.contains("resize_top_right")) return { top: true, right: true };
    if (button.classList.contains("resize_bottom_left")) return { bottom: true, left: true };
    if (button.classList.contains("resize_bottom_right")) return { bottom: true, right: true };
    return {};
  }

  static setupRotationAndDeletion(container) {
    let rotation = 0;
    const rotateBtn = container.querySelector(".rotate_action");
    const deleteBtn = container.querySelector(".delete_action");

    rotateBtn.addEventListener("click", () => {
      rotation = (rotation + 90) % 360;
      container.style.transform = `rotate(${rotation}deg)`;
    });

    deleteBtn.addEventListener("click", () => {
      container.remove();
    });
  }
}

ImageBlot.blotName = "custom-image";
ImageBlot.tagName = "div";
ImageBlot.className = "image_frame_outer";
Quill.register(ImageBlot);

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Citation Blot
class CitationBlot extends Inline {
  static create(value) {
    let node = super.create();
    node.setAttribute("data-citation", value.reference);
    node.setAttribute("data-year", value.year);
    node.classList.add("citation");
    return node;
  }

  static formats(node) {
    return {
      reference: node.getAttribute("data-citation"),
      year: node.getAttribute("data-year"),
    };
  }
}

CitationBlot.blotName = "citation";
CitationBlot.tagName = "span";
Quill.register(CitationBlot);
