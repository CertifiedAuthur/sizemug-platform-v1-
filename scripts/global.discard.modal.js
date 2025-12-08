/**
 *
 *
 *
 * Following Share Modal
 *
 *
 */

const showDiscardModalBtns = document.querySelectorAll(".show-discard-modal-btn");
const discardModal = document.getElementById("discardModal");
const discardModalManualCancel = document.getElementById("discardModalManualCancel");

// Show Modal
showDiscardModalBtns.forEach((btn) => {
  btn.addEventListener("click", showGlobalDiscardModal);
});

// Hide Modal
discardModal.addEventListener("click", (e) => {
  if (e.target.id === "discardModal") {
    hideGlobalDiscardModal();
  }
});
discardModalManualCancel.addEventListener("click", hideGlobalDiscardModal);

function showGlobalDiscardModal() {
  // discardModal.dataset.type = "";
  // discardModal.dataset.value = "";
  discardModal.classList.remove(HIDDEN);
}

function hideGlobalDiscardModal() {
  discardModal.classList.add(HIDDEN);
}

/**
 *
 *
 *
 *
 * Discard Action
 *
 *
 *
 */

const discardActionBtn = document.getElementById("discardActionBtn");

discardActionBtn.addEventListener("click", function () {
  const { type, taskId } = discardModal.dataset;

  // Delete a task action
  if (type === "task") {
    const savedTasks = getLocalStorage(); // get localstorage data
    const results = savedTasks.filter((task) => task.id !== +taskId);

    setLocalStorage(results); // update localstorage
    taskListApp.renderUserTasks(); // update DOM with the newly created task
    hideGlobalDiscardModal(); // Hide discard modal
    return;
  }
});
