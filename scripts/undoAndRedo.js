// // 2) Keep track of states
// let canvasStates = []; // Array of JSON-strings of canvas
// let currentStateIndex = -1; // Points to the current state
// let isUndoRedoAction = false; // Flag to prevent storing state while undoing/redoing

// // 3) Save the current state of the canvas
// function saveCanvasState() {
//   if (isUndoRedoAction) return; // Don't save state during undo/redo

//   // If we are not at the end of the stack, remove everything after current index
//   // (So that once you undo and then add a new object, you branch off and can’t redo the old future)
//   if (currentStateIndex < canvasStates.length - 1) {
//     canvasStates = canvasStates.slice(0, currentStateIndex + 1);
//   }

//   // Add the new state to the stack
//   const jsonData = JSON.stringify(canvas.toJSON());
//   canvasStates.push(jsonData);
//   currentStateIndex = canvasStates.length - 1;
// }

// // 4) Undo function
// function undoHandler() {
//   if (currentStateIndex > 0) {
//     isUndoRedoAction = true;
//     currentStateIndex--;
//     const prevState = canvasStates[currentStateIndex];
//     canvas.loadFromJSON(prevState, () => {
//       canvas.renderAll();
//       isUndoRedoAction = false;
//     });
//   }
// }

// // 5) Redo function
// function redoHandler() {
//   if (currentStateIndex < canvasStates.length - 1) {
//     isUndoRedoAction = true;
//     currentStateIndex++;
//     const nextState = canvasStates[currentStateIndex];
//     canvas.loadFromJSON(nextState, () => {
//       canvas.renderAll();
//       isUndoRedoAction = false;
//     });
//   }
// }

// // 6) Listen for changes and save state
// canvas.on("object:added", saveCanvasState);
// canvas.on("object:modified", saveCanvasState);
// canvas.on("object:removed", saveCanvasState);

// // 7) Initial blank state (optional)
// saveCanvasState();

// document.getElementById("undoToolbar").addEventListener("click", undoHandler);
// document.getElementById("redoToolbar").addEventListener("click", redoHandler);

let canvasStates = []; // Array of JSON-strings of canvas
let currentStateIndex = -1; // Points to the current state
let isUndoRedoAction = false; // Flag to prevent storing state while undoing/redoing

// Update the toolbar buttons based on the current state
function updateToolbar() {
  const undoButton = document.getElementById("undoToolbar");
  const redoButton = document.getElementById("redoToolbar");

  // Disable undo if there are no previous states
  undoButton.disabled = currentStateIndex <= 0;

  // Disable redo if we're at the latest state
  redoButton.disabled = currentStateIndex >= canvasStates.length - 1;
}

// 3) Save the current state of the canvas
function saveCanvasState() {
  if (isUndoRedoAction) return; // Don't save state during undo/redo

  // If we are not at the end of the stack, remove everything after current index
  if (currentStateIndex < canvasStates.length - 1) {
    canvasStates = canvasStates.slice(0, currentStateIndex + 1);
  }

  // Add the new state to the stack
  const jsonData = JSON.stringify(canvas.toJSON());
  canvasStates.push(jsonData);
  currentStateIndex = canvasStates.length - 1;

  updateToolbar(); // Update the button states after saving a new state
}

// 4) Undo function
function undoHandler() {
  if (currentStateIndex > 0) {
    isUndoRedoAction = true;
    currentStateIndex--;
    const prevState = canvasStates[currentStateIndex];
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      isUndoRedoAction = false;
      updateToolbar(); // Update toolbar after undo
    });
  }
}

// 5) Redo function
function redoHandler() {
  if (currentStateIndex < canvasStates.length - 1) {
    isUndoRedoAction = true;
    currentStateIndex++;
    const nextState = canvasStates[currentStateIndex];
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
      isUndoRedoAction = false;
      updateToolbar(); // Update toolbar after redo
    });
  }
}

// 6) Listen for changes and save state
canvas.on("object:added", saveCanvasState);
canvas.on("object:modified", saveCanvasState);
canvas.on("object:removed", saveCanvasState);

// 7) Initial blank state (optional)
saveCanvasState();

// Hook up the toolbar buttons
document.getElementById("undoToolbar").addEventListener("click", undoHandler);
document.getElementById("redoToolbar").addEventListener("click", redoHandler);
