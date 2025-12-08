document.addEventListener("DOMContentLoaded", () => {
  const templateOverlayShare = document.getElementById("template_overlay--share");
  const hideTemplateOverlayBtn = document.getElementById("hide_template_overlay");
  const showTemplatePreviewBtns = document.querySelectorAll(".template_list_preview--btn");
  const templateOverlay = document.getElementById("template_overlay");

  showTemplatePreviewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      templateOverlay.classList.remove(HIDDEN);
    });
  });

  hideTemplateOverlayBtn.addEventListener("click", () => {
    templateOverlay.classList.add(HIDDEN);
  });

  templateOverlayShare.addEventListener("click", showShareModal);
});
