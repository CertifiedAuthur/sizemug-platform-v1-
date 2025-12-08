// Wait for the DOM to fully load before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get the close button element for the environment changed modal
  const environmentChangedClose = document.getElementById("environmentChangedClose");

  // Add a click event listener to the close button
  environmentChangedClose.addEventListener("click", () => {
    const environmentChangedModal = document.getElementById("environmentChangedModal");

    // If the modal element exists, remove the 'show' class to hide it and clear any timeout
    if (environmentChangedModal) {
      environmentChangedModal.classList.remove("show");
      clearTimeout(environmentTimeout);
    }
  });
});
