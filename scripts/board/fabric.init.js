"use strict";

// Initialize the Fabric.js canvas
const canvas = new fabric.Canvas("canvas", {
  hoverCursor: "none",
  defaultCursor: "none",
});

canvas.setWidth(window.innerWidth);
canvas.setHeight(window.innerHeight);

// Also update the underlying canvas elements:
canvas.upperCanvasEl.style.cursor = "none";
canvas.lowerCanvasEl.style.cursor = "none";

// Disable the rotation control by creating an empty control
fabric.Object.prototype.controls.mtr = new fabric.Control({
  visible: false, // Set to false to hide the control
  render: function () {}, // Empty render function
});

function renderCustomControl(ctx, left, top, styleOverride, fabricObject) {
  const size = fabricObject.cornerSize || 10; // Default to 10 if not set
  const halfSize = size / 2;
  ctx.beginPath();
  ctx.arc(left, top, halfSize, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#8837E9"; // Custom border color
  ctx.fillStyle = "white"; // Custom background color
  ctx.stroke();
  ctx.fill();
}

// Customize the appearance of the control borders
fabric.Object.prototype.borderColor = "#8837E9"; // Set the border color (e.g., blue)
fabric.Object.prototype.borderOpacityWhenMoving = 0.9; // Set opacity when moving the object
fabric.Object.prototype.cornerColor = "#8837E9"; // Set corner color (optional)

fabric.Object.prototype.controls.br = new fabric.Control({
  x: 0.5,
  y: 0.5,
  cursorStyle: "se-resize",
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.bl = new fabric.Control({
  x: -0.5,
  y: 0.5,
  cursorStyle: "sw-resize",
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.tr = new fabric.Control({
  x: 0.5,
  y: -0.5,
  cursorStyle: "ne-resize",
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.tl = new fabric.Control({
  x: -0.5,
  y: -0.5,
  cursorStyle: "nw-resize",
  actionHandler: fabric.controlsUtils.scalingEqually,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

// Define custom controls for edges (e.g., middle-top)
fabric.Object.prototype.controls.ml = new fabric.Control({
  x: -0.5,
  y: 0,
  cursorStyle: "w-resize",
  actionHandler: fabric.controlsUtils.scalingX,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.mt = new fabric.Control({
  x: 0,
  y: -0.5,
  cursorStyle: "n-resize",
  actionHandler: fabric.controlsUtils.scalingY,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.mr = new fabric.Control({
  x: 0.5,
  y: 0,
  cursorStyle: "e-resize",
  actionHandler: fabric.controlsUtils.scalingX,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

fabric.Object.prototype.controls.mb = new fabric.Control({
  x: 0,
  y: 0.5,
  cursorStyle: "s-resize",
  actionHandler: fabric.controlsUtils.scalingY,
  actionName: "scale",
  render: renderCustomControl,
  cornerSize: 10,
  padding: 2,
});

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Modify fabric.Object prototype to include comments
fabric.Object.prototype.toObject = (function (toObject) {
  return function () {
    return fabric.util.object.extend(toObject.call(this), {
      comments: this.comments || [],
    });
  };
})(fabric.Object.prototype.toObject);

/**
 *
 *
 *
 *
 *
 *
 *
 * Functions
 *
 *
 *
 *
 *
 *
 */

// Add these variables at the top with other canvas variables
let commentUI = document.getElementById("comment-ui");
let commentInput = document.getElementById("comment-input");
let saveCommentBtn = document.getElementById("save-comment");
let closeCommentBtn = document.getElementById("close-comment");
let existingCommentsDiv = document.getElementById("existing-comments");
let currentCommentedObject = null;
let currentSelectedTextElement;

// Function to add shape actions
function addDrawedActions(shape) {
  // Create a container for the action buttons
  const actionsContainer = document.createElement("div");
  actionsContainer.className = "pen-actions";
  actionsContainer.style.display = "none";

  // Create the lock button
  const lockButton = document.createElement("button");
  lockButton.className = "lock";
  lockButton.innerHTML = lockSvg;

  // Create the comment button
  const commentButton = document.createElement("button");
  commentButton.className = "comment";
  commentButton.innerHTML = commentSvg;

  // Create the delete button
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete";
  deleteButton.innerHTML = deleteSvg;

  // Append all buttons to the container
  actionsContainer.appendChild(lockButton);
  actionsContainer.appendChild(commentButton);
  actionsContainer.appendChild(deleteButton);

  // Add the container to the document
  document.body.appendChild(actionsContainer);

  // Position the actionsContainer relative to the shape
  updateShapeActionsPosition(shape, actionsContainer);

  // Show the actionsContainer when the shape is selected
  shape.on("selected", () => {
    actionsContainer.style.display = "flex";
    updateShapeActionsPosition(shape, actionsContainer);

    canvas.getObjects().forEach((obj) => {
      // obj.selectable = false;
      obj.evented = true;
    });
  });

  // // Hide the actionsContainer when the shape is deselected
  shape.on("deselected", () => {
    actionsContainer.style.display = "none";
  });

  // Add event listeners for shape movements and resizing to update button positions
  shape.on("moving", () => updateShapeActionsPosition(shape, actionsContainer));
  shape.on("scaling", () => updateShapeActionsPosition(shape, actionsContainer));
  shape.on("resizing", () => updateShapeActionsPosition(shape, actionsContainer));

  ////// Handlers
  // Handle delete button click
  deleteButton.addEventListener("click", () => {
    canvas.remove(shape); // Remove the shape from the canvas
    document.body.removeChild(actionsContainer); // Remove the action buttons
  });

  // Handle lock button click
  lockButton.addEventListener("click", () => {
    const isLocked = shape.lockMovementX && shape.lockMovementY && shape.lockScalingX && shape.lockScalingY;

    if (isLocked) {
      shape.set({
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
      });

      lockButton.style.background = "white";
      lockButton.innerHTML = lockSvg;
    } else {
      shape.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });

      lockButton.style.background = "blue";
      lockButton.innerHTML = unlockSvg;
    }

    // Re-render the canvas to apply the changes
    canvas.renderAll();
  });

  // comment button click
  handleBoardModeComment(commentButton);
}

// Function to update shape actions position
function updateShapeActionsPosition(shape, actionsContainer) {
  const padding = 10;
  const boundingRect = shape.getBoundingRect();
  actionsContainer.style.left = `${boundingRect.left + boundingRect.width / 2 - actionsContainer.offsetWidth / 2}px`;
  actionsContainer.style.top = `${boundingRect.top - actionsContainer.offsetHeight - padding}px`;
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// function handleBoardModeComment(commentButton) {
//   commentButton.addEventListener("click", function () {
//     // Check BOTH possible selections
//     const fabricObject = canvas.getActiveObject();
//     const textElement = currentSelectedTextElement;

//     // Show error if nothing selected
//     if (!fabricObject && !textElement) {
//       alert("Please select something to comment on");
//       return;
//     }

//     console.log(textElement);

//     // Set current target (works for both types)
//     currentCommentedObject = fabricObject || textElement;

//     console.log(currentCommentedObject);
//     // Initialize comments array if it doesn't exist
//     if (!currentCommentedObject?.comments) {
//       currentCommentedObject.comments = [];
//     }

//     // Position comment UI near the object
//     const objectCoords = currentCommentedObject.getBoundingRect();
//     const canvasOffset = getCanvasOffset();
//     // commentUI.style.left = `${objectCoords.left + 20}px`;
//     // commentUI.style.top = `${objectCoords.top + 20}px`;
//     commentUI.style.left = `${canvasOffset.left + objectCoords.left + 20}px`;
//     commentUI.style.top = `${canvasOffset.top + objectCoords.top + 20}px`;

//     // Show existing comments
//     existingCommentsDiv.innerHTML = currentCommentedObject.comments.map((comment) => createCommentHTML(comment)).join("");

//     commentUI.style.display = "block";
//     commentInput.focus();
//   });
// }

function handleBoardModeComment(commentButton) {
  commentButton.addEventListener("click", function () {
    const fabricObject = canvas.getActiveObject();
    const textElement = currentSelectedTextElement;

    if (!fabricObject && !textElement) {
      alert("Please select something to comment on");
      return;
    }

    currentCommentedObject = fabricObject || textElement;

    // Initialize comments differently for each type
    if (currentCommentedObject === textElement) {
      // Handle DOM text elements
      if (!currentCommentedObject.dataset.comments) {
        currentCommentedObject.dataset.comments = JSON.stringify([]);
      }
    } else {
      // Handle Fabric objects
      if (!currentCommentedObject.comments) {
        currentCommentedObject.comments = [];
      }
    }

    // Get position differently based on type
    let elementRect;
    const canvasOffset = getCanvasOffset();

    if (currentCommentedObject instanceof fabric.Object) {
      // Fabric object coordinates
      elementRect = currentCommentedObject.getBoundingRect();
    } else {
      // DOM element coordinates
      const domRect = currentCommentedObject.getBoundingClientRect();
      elementRect = {
        left: domRect.left - canvasOffset.left,
        top: domRect.top - canvasOffset.top,
        width: domRect.width,
        height: domRect.height,
      };
    }

    // Position comment UI
    commentUI.style.left = `${canvasOffset.left + elementRect.left + 20}px`;
    commentUI.style.top = `${canvasOffset.top + elementRect.top + 20}px`;

    // Get comments differently based on type
    const comments = currentCommentedObject instanceof fabric.Object ? currentCommentedObject.comments : JSON.parse(currentCommentedObject.dataset.comments || "[]");

    existingCommentsDiv.innerHTML = comments.map(createCommentHTML).join("");
    commentUI.style.display = "block";
    commentInput.focus();
  });
}

// Save comment handler
function createCommentHTML(comment) {
  return `
    <li class="comment-item">
      <div class="comment_head">
        <img src="https://plus.unsplash.com/premium_photo-1661866803933-17fc0cf78150?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwcHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
        <h5>Olivia Desmond</h5>
      </div>
      <p>${comment}</p>
      <button>Reply</button>
    </li>
  `;
}

// In comment button click handler:
function getCanvasOffset() {
  const canvasEl = canvas.upperCanvasEl;
  return {
    left: canvasEl.getBoundingClientRect().left + window.scrollX,
    top: canvasEl.getBoundingClientRect().top + window.scrollY,
  };
}

saveCommentBtn.addEventListener("click", function () {
  const comment = commentInput.value.trim();
  if (comment && currentCommentedObject) {
    if (!currentCommentedObject.comments) {
      currentCommentedObject.comments = [];
    }

    // currentCommentedObject.comments.push(comment);
    // Handle Fabric objects
    if (currentCommentedObject.comments) {
      currentCommentedObject.comments.push(comment);
    }
    // Handle Text elements
    else {
      const comments = JSON.parse(currentCommentedObject.dataset.comments);
      comments.push(comment);
      currentCommentedObject.dataset.comments = JSON.stringify(comments);
    }

    commentInput.value = "";

    // Update existing comments display
    existingCommentsDiv.innerHTML = currentCommentedObject.comments.map((comment) => createCommentHTML(comment)).join("");

    // Optional: fire event to trigger save if needed
    canvas.fire("object:modified", { target: currentCommentedObject });
  }
});

// Close comment UI
closeCommentBtn.addEventListener("click", function () {
  commentUI.style.display = "none";
  currentCommentedObject = null;
});

// Handle canvas selection updates
canvas.on("selection:created", function (e) {
  commentUI.style.display = "none";
  currentCommentedObject = null;
});

canvas.on("selection:updated", function (e) {
  commentUI.style.display = "none";
  currentCommentedObject = null;
});
