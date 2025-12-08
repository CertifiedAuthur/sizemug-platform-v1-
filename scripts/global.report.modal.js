// Select all buttons that trigger the report modal
const showReportModalBtns = document.querySelectorAll(".show-report-modal-btn");
// Get the report modal container element
const reportContainerModal = document.getElementById("reportContainerModal");
const blockContainerModal = document.getElementById("blockModal");
const blockImmediateEvent = document.getElementById("blockImmediateEvent");

/**
 * Show the report modal when any of the trigger buttons is clicked.
 * Adds a click event listener to each button in the NodeList.
 */
showReportModalBtns.forEach((btn) => {
  btn.addEventListener("click", showGlobalReportModal);
});

/**
 * Hide the report modal when the modal container itself is clicked.
 * Ensures the modal only closes if the click is directly on the container (not its children).
 */
reportContainerModal.addEventListener("click", (e) => {
  if (e.target.id === "reportContainerModal") {
    hideGlobalReportModal();
  }
});
/**
 * Hide the block modal when the modal container itself is clicked.
 * Ensures the modal only closes if the click is directly on the container (not its children).
 */
blockContainerModal?.addEventListener("click", (e) => {
  if (e.target.id === "blockContainerModal") {
    hideBlockModal();
  }
});

// Immediate Block
blockImmediateEvent?.addEventListener("click", () => {
  showFlashMessage("User has be successfully blocked 👋🏻", "", "success", 2000);
  hideBlockModal();
});

// function to show the block modal :)

function showBlockModal() {
  blockContainerModal.classList.remove(HIDDEN);
}
// close block modal

function hideBlockModal() {
  blockContainerModal.classList.add(HIDDEN);
}
/**
 * Function to show the report modal.
 * Removes the "HIDDEN" class to make the modal visible.
 */
function showGlobalReportModal() {
  reportContainerModal.classList.remove(HIDDEN);
}

/**
 * Function to hide the report modal.
 * Adds the "HIDDEN" class to make the modal invisible.
 */
function hideGlobalReportModal() {
  reportContainerModal.classList.add(HIDDEN);
}

// Get elements related to report entry and selection
const mainReportEntryContainer = document.getElementById("mainReportEntryContainer");
const mainReportEntryPurpose = document.getElementById("mainReportEntryPurpose");
// Select all cancel buttons in the selected report sections
const selectedReportCancels = document.querySelectorAll(".selectedReportCancel");

/**
 * Handles click events on the main report entry purpose list.
 * Determines which report item was clicked and displays the corresponding container.
 */
mainReportEntryPurpose.addEventListener("click", (e) => {
  // Find the closest list item to the clicked target
  const clickedReportItem = e.target.closest("li");

  // If a valid report item was clicked, handle the selection
  if (clickedReportItem) {
    const { reportType } = clickedReportItem.dataset; // Get the report type from the dataset
    const reportItemContainer = document.getElementById(`${reportType}Container`);

    // Hide the main report entry container
    mainReportEntryContainer.classList.add(HIDDEN);
    // Show the container corresponding to the selected report type
    reportItemContainer.classList.remove(HIDDEN);
  }
});

/**
 * Adds event listeners to all cancel buttons in selected report sections.
 * Clicking the cancel button hides the current section and returns to the main container.
 */
selectedReportCancels.forEach((btn) => btn.addEventListener("click", hideAllSelectedContainers));

/**
 * Hides all selected report containers and shows the main report entry container.
 * Ensures no report sections are visible except the default main container.
 */
function hideAllSelectedContainers() {
  const selectedReportItems = document.querySelectorAll(".selected_report_item");

  // Add the "HIDDEN" class to all selected report containers
  selectedReportItems.forEach((container) => container.classList.add(HIDDEN));

  // Show the main report entry container
  mainReportEntryContainer.classList.remove(HIDDEN);
}
