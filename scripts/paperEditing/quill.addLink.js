const addLinkModal = document.getElementById("modal_editor--link");
const paperAddLinkText = document.querySelector(".paper_add_link--text");

document.addEventListener("DOMContentLoaded", () => {
  const openAddLink = document.getElementById("sizemug_add_link--btn");
  const paperAddLink = document.getElementById("paper_add_link");
  const paperAddLinkUrl = document.querySelector(".paper_add_link--url");
  const linkDocumentElement = document.querySelector(".link_document_element");
  const mobileHideLinkModalBtn = document.getElementById("mobileHideLinkModalBtn");

  [linkDocumentElement, openAddLink].forEach((button) => {
    button.addEventListener("click", () => {
      openAddLinkModal();
      closeDropdownBar(); // close all dropdown
    });
  });

  // button to close link modal on mobile
  mobileHideLinkModalBtn.addEventListener("click", () => {
    addLinkModal.classList.add(HIDDEN);
  });

  paperAddLink.addEventListener("click", addLinkToEditor);

  let range = null;

  function addLinkToEditor() {
    const text = paperAddLinkText.value;
    const url = paperAddLinkUrl.value;

    // If there is no text or url
    if (!text || !url) return;

    if (range) {
      // If there was a selection, delete it first
      focusedEditor.deleteText(range.index, range.length);

      // Insert the new link
      focusedEditor.insertText(range.index, text, "link", url);
    } else {
      // If no selection, insert at current cursor position
      const currentRange = focusedEditor.getSelection(true);
      focusedEditor.insertText(currentRange.index, text, "link", url);
    }

    // Clear the form and hide the modal
    paperAddLinkText.value = "";
    paperAddLinkUrl.value = "";
    addLinkModal.classList.add(HIDDEN);

    // Focus back on the editor
    focusedEditor.focus();
  }

  document.querySelector(".ql-editor").addEventListener("mousemove", function (e) {
    const allLinks = this.querySelectorAll("a");

    allLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        this.setAttribute("contenteditable", "false");
      });

      link.addEventListener("mouseleave", () => {
        this.setAttribute("contenteditable", "true");
      });
    });
  });
});

function openAddLinkModal() {
  const selected = focusedEditor.getSelection();

  // if (selected && !selected.length) return;

  range = selected;

  // If text is selected, populate the text field with selection
  const text = focusedEditor.getText(selected.index, selected.length);
  paperAddLinkText.value = text;

  addLinkModal.classList.remove(HIDDEN);
}
