document.addEventListener("DOMContentLoaded", () => {
  const sizemugForwardBtn = document.getElementById("sizemug_forward--btn");
  const followingModal = document.getElementById("following_modal");
  const forwardDocumentElements = document.querySelectorAll(".forward_document_element");

  [...forwardDocumentElements, sizemugForwardBtn].forEach((button) => {
    button.addEventListener("click", () => {
      followingModal.classList.remove(HIDDEN);
      closeDropdownBar(); // close all dropdown
    });
  });
});
