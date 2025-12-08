const createTaskEditor = document.querySelector("#textarea-editor");

// Link Handlers
const linkBtn = document.querySelector("#create_link--btn");
const modalLinkContainer = document.querySelector(".add_link_modal_wrapper");

linkBtn.addEventListener("click", function () {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Save the selected range
  const range = selection.getRangeAt(0);
  window.selectedRange = range;

  // Show the modal
  modalLinkContainer.classList.remove(HIDDEN);
});

const linkOkButton = modalLinkContainer.querySelector("button");

linkOkButton.addEventListener("click", function (event) {
  event.preventDefault();

  const text = modalLinkContainer.querySelector('[name="text"]').value;
  const url = modalLinkContainer.querySelector('[name="url"]').value;

  if (!url || !text) return;

  // Hide the modal
  modalLinkContainer.classList.add(HIDDEN);

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text; // range.toString();

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
});

createTaskEditor.addEventListener("mouseenter", function () {
  const anchorElements = createTaskEditor.querySelectorAll("a");

  anchorElements.forEach((anchor) => {
    anchor.addEventListener("mouseenter", function () {
      createTaskEditor.setAttribute("contenteditable", "false");
      anchor.target = "_blank";
    });

    anchor.addEventListener("mouseleave", function () {
      createTaskEditor.setAttribute("contenteditable", "true");
    });
  });
});

const taskEditorTools = document.querySelector(".task_editor");
const taskEditorHeaderTools = document.querySelector(".description_editor--header");
const taskEditorDecriptionTools = document.querySelector(".description_editor--decription");

const boldEls = document.querySelectorAll(".bold");
const italicEls = document.querySelectorAll(".italic");
const ulEls = document.querySelectorAll(".ul-list");
const olEls = document.querySelectorAll(".ol-list");
const ACTIVE = "task-button--active";

function isActiveEditing(type) {
  return document.queryCommandState(type);
}
