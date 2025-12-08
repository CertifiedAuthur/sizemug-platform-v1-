document.addEventListener("DOMContentLoaded", () => {
  const headerMoreCollaborators = document.getElementById("header_more_collaborators");
  const stickyCollaboratorsModal = document.getElementById("sticky_collaborators");
  const closeModalBtn = document.querySelector("#sticky_collaborators header button");

  headerMoreCollaborators.addEventListener("click", function () {
    stickyCollaboratorsModal.classList.toggle(HIDDEN);
  });

  closeModalBtn.addEventListener("click", () => {
    stickyCollaboratorsModal.classList.add(HIDDEN);
  });
});
