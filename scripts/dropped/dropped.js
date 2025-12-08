/**---------------- Tab Handlers ---------------*/
const noteTabSwitch = document.getElementById("noteTabSwitch");
const sharedTabSwitch = document.getElementById("sharedTabSwitch");
const notesSharedPage = document.getElementById("notesSharedPage");
// const notesSharedBtn = document.getElementById("notesSharedBtn");
const noteBody = document.getElementById("noteBody");
const sharedBody = document.getElementById("sharedBody");

noteTabSwitch.addEventListener("click", function () {
  noteTabSwitch.setAttribute("aria-selected", true);
  sharedTabSwitch.removeAttribute("aria-selected");

  notesSharedPage.textContent = "Notes";
  notesSharedBtn.textContent = "Notes";

  noteBody.classList.remove(HIDDEN);
  sharedBody.classList.add(HIDDEN);
});

sharedTabSwitch.addEventListener("click", () => {
  sharedTabSwitch.setAttribute("aria-selected", true);
  noteTabSwitch.removeAttribute("aria-selected");

  notesSharedPage.textContent = "Shared";
  notesSharedBtn.textContent = "Shared";

  noteBody.classList.add(HIDDEN);
  sharedBody.classList.remove(HIDDEN);
});
