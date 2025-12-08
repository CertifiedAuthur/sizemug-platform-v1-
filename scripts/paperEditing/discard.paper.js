const discardBtn = document.getElementById("delete--btn");

// Show
discardBtn.addEventListener("click", showGlobalDiscardModal);

// // Hide
// hideDiscard.addEventListener("click", hideDiscardModal);

// document.addEventListener("keydown", (event) => {
//   // Check if it's Command key on Mac or Ctrl key on other OS
//   const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
//   const modifierKey = isMac ? event.metaKey : event.ctrlKey;

//   if (event.shiftKey && modifierKey && event.key === "d") {
//     event.preventDefault(); // Prevent default browser behavior

//     if (discardModal.classList.contains(HIDDEN)) {
//       showDiscardModal();
//     } else {
//       hideDiscardModal();
//     }
//   }
// });

// function showDiscardModal() {
//   discardModal.classList.remove(HIDDEN);
// }

// function hideDiscardModal() {
//   discardModal.classList.add(HIDDEN);
// }
