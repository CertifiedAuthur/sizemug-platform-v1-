const containerCollaboration = document.getElementById("collaboration_collaboration"); // prettier-ignore
let isInteractingWithShape = false;
let selectedShape = null;

containerCollaboration.addEventListener("click", function (event) {
  if (isInteractingWithShape) {
    // Reset the flag and return if interacting with shape
    isInteractingWithShape = false;
    return;
  }

  // Get the bounding rectangle of the container
  const rect = containerCollaboration.getBoundingClientRect();

  // Calculate the click position relative to the container
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Check if the clicked element is a text box
  const clickedElement = document.elementFromPoint(
    event.clientX,
    event.clientY
  );

  // Check if the clicked element is inside the container
  if (clickedElement && containerCollaboration.contains(clickedElement)) {
    if (clickedElement.classList.contains("text-box")) {
      clickedElement.focus();
      return;
    }
  }

  // Create a new text box at the clicked position
  const textBox = document.createElement("div");
  textBox.contentEditable = "true";
  textBox.classList.add("text-box");
  textBox.style.position = "absolute";
  textBox.style.left = `${x}px`;
  textBox.style.top = `${y}px`;

  containerCollaboration.appendChild(textBox);
  textBox.focus();

  // Place the caret at the end for the new text box
  placeCaretAtEnd(textBox);

  // Handle the blur event to remove empty text boxes
  textBox.addEventListener("blur", function () {
    if (textBox.innerText.trim() === "") {
      containerCollaboration.removeChild(textBox);
    }
  });
});

// Helper function to place the caret at the end of the contenteditable element
function placeCaretAtEnd(el) {
  el.focus();
  if (
    typeof window.getSelection !== "undefined" &&
    typeof document.createRange !== "undefined"
  ) {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  } else if (typeof document.body.createTextRange !== "undefined") {
    const textRange = document.body.createTextRange();
    textRange.moveToElementText(el);
    textRange.collapse(false);
    textRange.select();
  }
}

// Function to format the selected text
function formatText(command, value) {
  document.execCommand(command, false, value);
}

// Ensure that the execCommand formatting works correctly
document.addEventListener("selectionchange", function () {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.classList.contains("text-box")) {
    selectedShape = activeElement;
  }
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Shape Logic
const shapeButtons = document.querySelectorAll("button[data-shape]");

shapeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // rmeove active from all shapes
    shapeButtons.forEach((shape) => shape.classList.remove("active--shape"));
    // applying active to the click one
    button.classList.add("active--shape");

    const shapeType = this.getAttribute("data-shape");
    createShape(shapeType);
  });
});

function createShape(shapeType) {
  const shapeWrapper = document.createElement("div");
  shapeWrapper.classList.add("shape-wrapper");

  const shape = document.createElement("div");
  shape.classList.add("shape", shapeType);

  // Center the shape within the container
  const rect = containerCollaboration.getBoundingClientRect();
  shapeWrapper.style.left = `${rect.width / 2 - 50}px`;
  shapeWrapper.style.top = `${rect.height / 2 - 50}px`;

  // Add the main editable container
  const editableDiv = document.createElement("div");
  editableDiv.classList.add("editable-shape");
  shape.appendChild(editableDiv);

  // Add cancel button for deleting the shape
  const cancelButton = document.createElement("button");
  cancelButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="gray" d="m8.4 16.308l3.6-3.6l3.6 3.6l.708-.708l-3.6-3.6l3.6-3.6l-.708-.708l-3.6 3.6l-3.6-3.6l-.708.708l3.6 3.6l-3.6 3.6zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709"/></svg>`;
  cancelButton.classList.add("cancel-button", "hidden-page");

  cancelButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent triggering shape focus
    containerCollaboration.removeChild(shapeWrapper);
    selectedShape = null;
    isInteractingWithShape = false;
  });

  shapeWrapper.appendChild(cancelButton);
  shapeWrapper.appendChild(shape);
  containerCollaboration.appendChild(shapeWrapper);

  // Function to create a new editable area
  function createEditableArea(x, y) {
    const newEditableDiv = document.createElement("div");
    newEditableDiv.classList.add("editable-area");
    newEditableDiv.contentEditable = true;
    newEditableDiv.style.position = "absolute";
    newEditableDiv.style.left = `${x}px`;
    newEditableDiv.style.top = `${y}px`;

    // Prevent dragging/resizing when interacting with the new editable area
    newEditableDiv.addEventListener("mousedown", function (event) {
      event.stopPropagation();
    });

    editableDiv.appendChild(newEditableDiv);
    newEditableDiv.focus(); // Automatically focus on the new editable area
  }

  // Add click listener to create a new editable area on click
  editableDiv.addEventListener("click", function (event) {
    if (event.target.classList.contains("editable-area")) {
      event.target.focus();
    } else {
      const rect = editableDiv.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createEditableArea(x, y);
    }
  });

  interact(shapeWrapper)
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: "parent",
          endOnly: true,
        }),
      ],
      listeners: {
        start(event) {
          isInteractingWithShape = true;
        },
        move: dragMoveListener,
        end(event) {
          isInteractingWithShape = false;
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        start(event) {
          isInteractingWithShape = true;
        },
        move(event) {
          const target = event.target;
          const x = parseFloat(target.getAttribute("data-x")) || 0;
          const y = parseFloat(target.getAttribute("data-y")) || 0;

          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          target.style.transform = "translate(" + x + "px," + y + "px)";
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);

          // Update the size of the shape within the wrapper
          const shape = target.querySelector(".shape");
          shape.style.width = "100%";
          shape.style.height = "100%";
        },
        end(event) {
          isInteractingWithShape = false;
        },
      },
      modifiers: [
        interact.modifiers.restrictEdges({
          outer: "parent",
        }),
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        }),
      ],
      inertia: true,
    });

  shape.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent creating text box on shape click
    const btn = event.target.closest(".shape-wrapper").querySelector('.cancel-button') // prettier-ignore

    if (selectedShape) {
      selectedShape.classList.remove("focused");
      btn.classList.add("hidden-page");
    }
    selectedShape = shape;
    shape.classList.add("focused");
    btn.classList.remove("hidden-page");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".shape-wrapper")) {
      const shapeWrappers = document.querySelectorAll(".shape-wrapper");
      shapeWrappers.forEach((shapeWrapper) => {
        const shape = shapeWrapper.querySelector(".shape");
        const cancelBtn = shapeWrapper.querySelector(".cancel-button");

        shape.classList.remove("focused");
        cancelBtn.classList.add("hidden-page");
      });
    }
  });

  // Prevent dragging/resizing when interacting with editable div
  editableDiv.addEventListener("mousedown", function (event) {
    event.stopPropagation();
  });
}

function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = "translate(" + x + "px, " + y + "px)";
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

/////////////////////////
///// Connect Arrow /////
/////////////////////////
const arrowConnectBtn = document.querySelector('[data-tool="arrow"]');

arrowConnectBtn.addEventListener("click", function () {
  const allTools = document.querySelectorAll(".collaboration_tool");
  const arrowWrapper = document.createElement("div");
  const stickEl = document.createElement("div");
  const arrowEl = document.createElement("div");
  const cancelButton = document.createElement("button"); // Create the cancel button

  arrowWrapper.classList.add("arrow_wrapper");
  allTools.forEach((tool) => tool.classList.add(PAGEHIDDEN));

  stickEl.className = "stick";
  arrowEl.className = "arrow";
  cancelButton.className = "cancel_button"; // Add a class for the cancel button

  cancelButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ffff" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>`; // Set the text content of the cancel button

  arrowWrapper.appendChild(stickEl);
  arrowWrapper.appendChild(arrowEl);
  arrowWrapper.appendChild(cancelButton); // Append the cancel button to arrowWrapper

  containerCollaboration.appendChild(arrowWrapper);

  // Initial styling
  const initialWidth = 300;
  const initialHeight = 50;
  arrowWrapper.style.width = `${initialWidth}px`;
  arrowWrapper.style.minWidth = "150px";
  arrowWrapper.style.height = `${initialHeight}px`;

  stickEl.style.height = "5px";
  stickEl.style.marginTop = `${(initialHeight - 5) / 2}px`;

  arrowEl.style.borderLeftWidth = `${(initialWidth * 10) / 100}px`;
  arrowEl.style.borderTopWidth = `${initialHeight / 2}px`;
  arrowEl.style.borderBottomWidth = `${initialHeight / 2}px`;

  // Add the cancel button className
  cancelButton.classList.add("arrow_cancel");

  // Add event listener to cancel button to remove the arrowWrapper
  cancelButton.addEventListener("click", function () {
    arrowWrapper.remove();
  });

  // Set the initial position to the middle of the container
  const containerRect = containerCollaboration.getBoundingClientRect();
  arrowWrapper.style.position = "absolute";
  arrowWrapper.style.left = `${(containerRect.width - initialWidth) / 2}px`;
  arrowWrapper.style.top = `${(containerRect.height - initialHeight) / 2}px`;

  // Variables to track rotation
  let isRotating = false;
  let initialAngle = 0;

  // Variables to track translation
  let initialTranslation = { x: 0, y: 0 };

  // Function to calculate angle
  function calculateAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  }

  // Add event listener for mousedown on arrowEl to start rotation
  arrowEl.addEventListener("mousedown", function (event) {
    event.stopPropagation();
    isRotating = true;
    const rect = arrowWrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    initialAngle = calculateAngle(
      centerX,
      centerY,
      event.clientX,
      event.clientY
    );

    // Store the initial translation
    const transform = window.getComputedStyle(arrowWrapper).transform;
    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      initialTranslation = { x: matrix.m41, y: matrix.m42 };
    }

    function rotate(event) {
      if (!isRotating) return;
      const currentAngle = calculateAngle(
        centerX,
        centerY,
        event.clientX,
        event.clientY
      );
      const rotation = currentAngle - initialAngle;

      // Combine translation with rotation
      arrowWrapper.style.transform = `translate(${initialTranslation.x}px, ${initialTranslation.y}px) rotate(${rotation}deg)`;
    }

    function stopRotation() {
      isRotating = false;
      document.removeEventListener("mousemove", rotate);
      document.removeEventListener("mouseup", stopRotation);
    }

    document.addEventListener("mousemove", rotate);
    document.addEventListener("mouseup", stopRotation, { once: true });
  });

  // Interact.js interactions for dragging, resizing using stickEl
  interact(arrowWrapper)
    .draggable({
      listeners: {
        start(event) {
          const transform = window.getComputedStyle(arrowWrapper).transform;
          if (transform !== "none") {
            const matrix = new DOMMatrix(transform);
            arrowWrapper.setAttribute("data-x", matrix.m41);
            arrowWrapper.setAttribute("data-y", matrix.m42);
          } else {
            arrowWrapper.setAttribute("data-x", 0);
            arrowWrapper.setAttribute("data-y", 0);
          }
        },
        move(event) {
          const target = arrowWrapper;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

          target.style.transform = `translate(${x}px, ${y}px)`;

          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        start(event) {
          // Hide custom cursor
        },
        move(event) {
          const target = event.target;
          let { x, y } = { ...target.dataset };
          x = parseFloat(x) || 0;
          y = parseFloat(y) || 0;

          const { width, height } = event.rect;

          target.style.width = `${width}px`;
          target.style.height = `${height}px`;

          // Update data attributes
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
        end(event) {
          // Show custom cursor
        },
      },
      modifiers: [
        interact.modifiers.aspectRatio({ ratio: "preserve" }),
        interact.modifiers.restrictSize({
          min: { width: 50, height: 50 },
        }),
      ],
    });
});

/////////////////////////
/////////////////////////
// Change shape background color
const shapeColorCircle = document.querySelectorAll("button[data-color]");
shapeColorCircle.forEach((circle) =>
  circle.addEventListener("click", function () {
    const { color } = this.dataset;

    if (selectedShape) {
      selectedShape.style.backgroundColor = color;
    }
  })
);

// Color Pallete Color Change
const shapeColorPallete = document.querySelector(".multi-color #colorPicker");

shapeColorPallete.addEventListener("input", function () {
  if (selectedShape) {
    selectedShape.style.backgroundColor = this.value;
  }
});
