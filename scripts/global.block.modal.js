// Select all buttons that trigger the block modal
const showBlockModalBtns = document.querySelectorAll(".show_block_modal");
// Get the block modal container element
const blockModal = document.getElementById("blockModal");

/**
 * Add click event listeners to all "show block modal" buttons.
 * When clicked, the modal is displayed by calling the `showBlockModal` function.
 */
showBlockModalBtns.forEach((btn) => {
  btn.addEventListener("click", showBlockModal);
});

/**
 * Add a click event listener to the block modal container.
 * The modal is hidden if:
 * - The clicked element is a descendant of an element with the class "hide_block_modal".
 * - The clicked element is the modal container itself (indicated by its ID).
 */
blockModal.addEventListener("click", function (e) {
  if (e.target.closest(".hide_block_modal") || e.target.id === "blockModal") {
    hideBlockModal();
  }
});

/**
 * Displays the block modal by removing the "HIDDEN" class.
 * Assumes the "HIDDEN" class controls the visibility of the modal.
 */
function showBlockModal() {
  blockModal.classList.remove(HIDDEN);
}

/**
 * Hides the block modal by adding the "HIDDEN" class.
 * Ensures the modal is no longer visible.
 */
function hideBlockModal() {
  blockModal.classList.add(HIDDEN);
}
