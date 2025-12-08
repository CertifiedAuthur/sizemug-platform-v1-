// Show User Collaborators
/**
 * @param {string} status = show or hide
 */
const collaboratorsModal = document.getElementById("collaboratorsOverlay");
const hideCollaboratorsModalBtn = document.getElementById("cancelUsersOnTask");

function showCollaboratorsModal(status = "show") {
  if (status === "show") {
    collaboratorsModal.classList.remove(HIDDEN);
  } else if (status === "hide") {
    collaboratorsModal.classList.add(HIDDEN);
  }
}

hideCollaboratorsModalBtn.addEventListener("click", () => {
  showCollaboratorsModal("hide");
});

collaboratorsModal.addEventListener("click", (e) => {
  if (e.target.id === "collaboratorsOverlay") showCollaboratorsModal("hide");
});
