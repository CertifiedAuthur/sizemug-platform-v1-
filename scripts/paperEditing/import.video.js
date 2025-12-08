const generalContainer = document.getElementById("general_container");
const embedContainer = document.getElementById("embed_container");
const advancedContainer = document.getElementById("advanced_container");
const containerNavigationButtons = document.getElementById("container_nav_btns");
const importVideoTool = document.getElementById("import_video_tool");
const importVideoModal = document.getElementById("import_video_modal");
const mobileHideInsertVideoModalBtn = document.getElementById("mobileHideInsertVideoModalBtn");

mobileHideInsertVideoModalBtn.addEventListener("click", () => {
  importVideoModal.classList.add(HIDDEN);
});

importVideoTool.addEventListener("click", function (e) {
  importVideoModal.classList.remove(HIDDEN);
});

containerNavigationButtons.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  const allButtons = this.querySelectorAll("button");

  if (button) {
    const { type } = button.dataset;
    allButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (type === "general") showGeneralContainer();
    if (type === "embed") showEmbedContainer();
    if (type === "advanced") showAdvancedContainer();
  }
});

function showGeneralContainer() {
  generalContainer.classList.remove(HIDDEN);
  embedContainer.classList.add(HIDDEN);
  advancedContainer.classList.add(HIDDEN);
}

function showEmbedContainer() {
  generalContainer.classList.add(HIDDEN);
  embedContainer.classList.remove(HIDDEN);
  advancedContainer.classList.add(HIDDEN);
}

function showAdvancedContainer() {
  generalContainer.classList.add(HIDDEN);
  embedContainer.classList.add(HIDDEN);
  advancedContainer.classList.remove(HIDDEN);
}
