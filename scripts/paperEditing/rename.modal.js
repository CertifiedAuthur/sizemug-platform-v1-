/**
 * Keyboard shortcut to show modal is implemented
 */
const renameModal = document.getElementById("rename_modal");
const renameFilenameInput = document.getElementById("rename_filename--input");
const renameModalCounter = document.querySelector(".rename_modal .counter");
const paperTitle = document.getElementById("paper_title");

let filenameValue;
const MAXFILENAMELENGTH = 20;

document.addEventListener("DOMContentLoaded", () => {
  const editFilenameBtn = document.getElementById("edit_filename--btn");
  const cancelRenameModalBtn = document.getElementById("cancel_rename_modal");
  const saveRenameBtn = document.getElementById("save_file_rename");
  const renameDocumentElements = document.querySelectorAll(".rename_document_element");

  renameModalCounter.textContent = MAXFILENAMELENGTH;
  updateFilenameInputChange(renameFilenameInput.value);

  // Show Modal
  [...renameDocumentElements, editFilenameBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showRenameModal();
      closeDropdownBar(); // close all dropdown
    });
  });

  // Hide Modal
  cancelRenameModalBtn.addEventListener("click", hideRenameModal);

  // Input filename value change
  renameFilenameInput.addEventListener("input", function (e) {
    const value = this.value.trim();
    updateFilenameInputChange(value);
  });

  // Save filename
  saveRenameBtn.addEventListener("click", () => {
    if (filenameValue && filenameValue.length <= 20) {
      handleSaveFileRename(filenameValue);
    } else {
      console.log("Filename can't be empty 😡");
    }
  });

  document.addEventListener("keydown", (event) => {
    // Check if it's Command key on Mac or Ctrl key on other OS
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifierKey = isMac ? event.metaKey : event.ctrlKey;

    if (modifierKey && event.key === "e") {
      event.preventDefault(); // Prevent default browser behavior

      if (renameModal.classList.contains(HIDDEN)) {
        showRenameModal();
      } else {
        hideRenameModal();
      }
    }
  });
});

// Show Edit Modal
function showRenameModal() {
  renameModal.classList.remove(HIDDEN);
}

// Hid Edit Modal
function hideRenameModal() {
  renameModal.classList.add(HIDDEN);
}

// Function to update rename modal input and counts
function updateFilenameInputChange(inputValue) {
  if (inputValue.length <= MAXFILENAMELENGTH) {
    renameModalCounter.textContent = Math.abs(inputValue.length - MAXFILENAMELENGTH); // show remaining length
    filenameValue = inputValue;
  } else {
    // Block further typing by trimming the input to the max length
    renameFilenameInput.value = inputValue.substring(0, MAXFILENAMELENGTH);
  }
}

// Save Filename Rename
function handleSaveFileRename(filenameValue) {
  document.title = `${filenameValue} | Sizemug Paper Editing`;
  renameFilenameInput.value = filenameValue;
  paperTitle.textContent = filenameValue;
  paperTitle.title = filenameValue;

  hideRenameModal();
}
