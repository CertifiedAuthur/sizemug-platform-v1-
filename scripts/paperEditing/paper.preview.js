document.addEventListener("DOMContentLoaded", () => {
  const sizemugPreviewBtn = document.getElementById("sizemug_preview--btn");
  const previewOverlay = document.getElementById("preview-overlay");
  const hidePreviewOverlayBtn = document.getElementById("hide_paper_preview");
  const previewDocumentElement = document.querySelector(".preview_document_element");

  [previewDocumentElement, sizemugPreviewBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showPreviewOverlay();
      closeDropdownBar(); // close all dropdown
    });
  });
  hidePreviewOverlayBtn.addEventListener("click", hidePreviewOverlay);

  function showPreviewOverlay() {
    const previewPapers = document.getElementById("overlay_paper_lists");
    previewPapers.innerHTML = "";

    paperEditors.forEach((editor, index) => {
      const previewPaper = document.createElement("div");
      previewPaper.className = "paper_item";
      previewPaper.innerHTML = editor.container.querySelector(".ql-editor").innerHTML;

      // Append it to the DOM
      previewPapers.appendChild(previewPaper);

      previewPaper.addEventListener("click", () => {
        editor.container.scrollIntoView({ behavior: "smooth", block: "start" });
        hidePreviewOverlay();
      });
    });

    previewOverlay.classList.remove(HIDDEN);
  }

  function hidePreviewOverlay() {
    previewOverlay.classList.add(HIDDEN);
  }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Description Expanded
const seeAllDesc = document.getElementById("see_all_desc");
const templateDescriptionContent = document.getElementById("template_description_content");

seeAllDesc.addEventListener("click", () => {
  templateDescriptionContent.classList.toggle("expanded");
});
