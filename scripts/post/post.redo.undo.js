// Attach Undo and Redo buttons
const undoButton = document.getElementById("undo");
const redoButton = document.getElementById("redo");

// Undo function for the focused input
function undo() {
  if (focusedInput && historyMap[focusedInput].length > 0) {
    const currentHistory = historyMap[focusedInput].pop();
    undoStackMap[focusedInput].push(currentHistory);
    const previousValue = historyMap[focusedInput].length > 0 ? historyMap[focusedInput][historyMap[focusedInput].length - 1] : "";
    document.querySelector(`[data-postText="${focusedInput}"]`).innerHTML = previousValue;
  }
}

// Redo function for the focused input
function redo() {
  if (focusedInput && undoStackMap[focusedInput].length > 0) {
    const redoValue = undoStackMap[focusedInput].pop();
    historyMap[focusedInput].push(redoValue);
    document.querySelector(`[data-postText="${focusedInput}"]`).innerHTML = redoValue;
  }
}

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
