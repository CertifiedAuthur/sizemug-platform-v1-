taskDescriptionContainer.addEventListener("click", function (e) {
  const { currentTaskId } = this.dataset;
  const target = e.target;

  const storedTasks = getLocalStorage();
  const otherTasks = storedTasks.filter((task) => task.id !== +currentTaskId);
  const currentTask = storedTasks.find((task) => task.id === +currentTaskId);

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Description status bar clicked
  const statusBtn = target.closest(".task_description_status--btn");
  if (statusBtn) {
    const { status: statusName } = statusBtn.dataset;
    const allStatusBtn = statusBtn.closest(".task_description_status").querySelectorAll(".task_description_status--btn");
    const taskItemContainer = document.querySelector(`.task_id--${currentTaskId}`);
    const taskStatusEl = taskItemContainer.querySelector(".task_status");

    // Update DOM
    allStatusBtn.forEach((btn) => btn.classList.remove("active"));
    statusBtn.classList.add("active");
    taskStatusEl.className = `task_status task_status--${statusName}`;

    // update localstorage
    setLocalStorage([...otherTasks, { ...currentTask, status: statusName }]);

    //
    if (statusName === "completed") {
      // showFlashMessage("Task completed successfully! 🎉", "", "success", 2000);
      // Create-or-reuse a single canvas/instance
      let canvas = document.getElementById("burstConfettiCanvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "burstConfettiCanvas";
        document.body.appendChild(canvas);
      }

      // If there's an existing instance still running, stop it (to prevent overlap)
      if (canvas._burstInstance && canvas._burstInstance.running) {
        canvas._burstInstance.stop();
      }

      if (!canvas._burstInstance) {
        canvas._burstInstance = new BurstConfetti(canvas);
      }
      const burst = canvas._burstInstance;

      burst.burst({
        count: 180,
        spread: 360,
        speed: { min: 700, max: 1000 },
        gravity: 900,
        decay: 0.98,
        colors: ["#ff8a65", "#ffd54f", "#81c784", "#4fc3f7", "#b39ddb"],
        shape: "rect", // "rect"
        size: { min: 8, max: 14 },
        duration: 4000,
      });

      // Clean up when done by polling, then destroy the instance + remove canvas
      const cleanup = setInterval(() => {
        if (!burst.running) {
          clearInterval(cleanup);
          burst.destroy(); // removes resize listener & clears canvas
          delete canvas._burstInstance;
          canvas.remove();
        }
      }, 150);
    }
    return;
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Description status bar clicked
  if (target.closest("#collaborators_list")) {
    return showCollaboratorsModal();
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Follow Modal
  if (target.closest(".description_add_collaborators")) {
    return document.getElementById("sharedFromModal").classList.remove(HIDDEN);
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Matching Modal
  if (target.closest(".description_task_merge")) {
    return taskApp.handleShowMatchingModal();
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Shared Modal
  if (target.closest(".shared_from--btn")) {
    return showGlobalShareFollowingModal();
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Share Modal
  if (target.closest(".show_share--modal")) {
    return showGlobalShareFollowingModal();
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Add Calender
  if (target.closest(".add_calender")) {
    return handleShowAddCalender2();
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Title event
  const titleEl = target.closest(".task_description_header");
  if (titleEl) {
    const parent = target.closest(".header.task_drag");
    const formContainer = parent.querySelector(".form");
    const editor = parent.querySelector("#description_editor--header");
    const editorInput = parent.querySelector("#editableDiv");
    const moveBtn = parent.querySelector(".move_btn");
    const editBtn = parent.querySelector(".btn_edit_title");

    titleEl.classList.add(HIDDEN); // Hide the title
    formContainer.classList.remove(HIDDEN); // show the editing container
    editorInput.innerHTML = titleEl.innerHTML; // pass the title value around

    // focus editor input
    editorInput.addEventListener("focus", handleEditorInputFocus);
    // blur editor input
    editorInput.addEventListener("blur", (e) => {
      if (!e.relatedTarget || (!e.relatedTarget.closest("#description_editor--header") && !e.relatedTarget.closest(".move_btn") && !e.relatedTarget.closest(".btn_edit_title"))) {
        handleEditorInputBlur();
      }
    });

    // enter keydown
    editorInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        // allow newline
      } else if (e.key === "Enter") {
        e.preventDefault();
        titleEl.classList.remove(HIDDEN); // Show the title
        formContainer.classList.add(HIDDEN); // Hide the editing container
        titleEl.innerHTML = editorInput.innerHTML; // pass the editorInput value around
        editor.classList.add(HIDDEN);
        editBtn.classList.remove("active");
      }
    });

    // Edit button
    editBtn.addEventListener("click", function () {
      if (this.classList.contains("active")) {
        handleEditorInputBlur();
      } else {
        handleEditorInputFocus();
      }
    });

    // outside click
    document.addEventListener("click", function (e) {
      // when click on adding link to title & anywhere else
      if (!e.target.closest(".header.task_drag") && !e.target.closest(".modal_description_header_editor--link")) {
        titleEl.classList.remove(HIDDEN); // Show the title
        formContainer.classList.add(HIDDEN); // Hide the editing container
        titleEl.innerHTML = editorInput.innerHTML; // pass the editorInput value around
        editor.classList.add(HIDDEN);
        editBtn.classList.remove("active");
      }
    });

    // title font size change
    const fontSizeSelect = parent.querySelector("#fontSizeSelect");
    fontSizeSelect.addEventListener("change", function () {
      formatDoc("fontSize", this.value);
    });

    // change text case
    const textCaseBtn = parent.querySelector("#changeTextCase");
    textCaseBtn.addEventListener("click", function () {
      if (this.classList.contains("task-button--active")) {
        this.classList.remove("task-button--active");
        changeTextCase("lowercase");
      } else {
        changeTextCase("uppercase");
        this.classList.add("task-button--active");
      }
    });

    // Add Link
    const linkBtn = parent.querySelector("#description-link");
    const titleAddLinkModal = document.querySelector(".modal_description_header_editor--link");

    linkBtn.addEventListener("click", function () {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      // Save the selected range
      const range = selection.getRangeAt(0);
      window.selectedRange = range;

      // Show the modal
      titleAddLinkModal.classList.remove(HIDDEN);
    });

    editorInput.addEventListener("mouseenter", function () {
      const anchorElements = this.querySelectorAll("a");

      anchorElements.forEach((anchor) => {
        anchor.addEventListener("mouseenter", function () {
          editorInput.setAttribute("contenteditable", "false");
        });

        anchor.addEventListener("mouseleave", function () {
          editorInput.setAttribute("contenteditable", "true");
        });
      });
    });

    // https://www.sizemug.com

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    // title handlers
    // input focus
    function handleEditorInputFocus() {
      editBtn.classList.add("active");
      editor.classList.remove(HIDDEN);
      editorInput.focus();
      handleCursorPosition(editorInput);
    }

    // input blur
    function handleEditorInputBlur() {
      editBtn.classList.remove("active");
      editor.classList.add(HIDDEN);
      editorInput.blur();
    }

    // case change
    function changeTextCase(caseType) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText.length > 0) {
        const caseText = selectedText[caseType === "lowercase" ? "toLowerCase" : "toUpperCase"]();

        // Use a DocumentFragment to insert the modified text
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(caseText));

        // Replace the selected text with the upper case text
        range.deleteContents();
        range.insertNode(fragment);

        // Clear the selection
        selection.removeAllRanges();
      }
    }

    return;
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Description event
  const descriptionEl = target.closest(".task_description_describing");
  if (descriptionEl) {
    const parent = target.closest(".description.task_drag");
    const formContainer = parent.querySelector(".form");
    const editor = parent.querySelector("#description_editor--description");
    const editorInput = parent.querySelector("#editableDiv");
    const moveBtn = parent.querySelector(".move_btn");
    const editBtn = parent.querySelector(".btn_edit_description");

    descriptionEl.classList.add(HIDDEN); // Hide the description
    formContainer.classList.remove(HIDDEN); // show the editing container
    editorInput.innerHTML = descriptionEl.innerHTML; // pass the title value around

    // focus editor input
    editorInput.addEventListener("focus", handleEditorInputFocus);
    // blur editor input
    editorInput.addEventListener("blur", (e) => {
      if (!e.relatedTarget || (!e.relatedTarget.closest("#description_editor--description") && !e.relatedTarget.closest(".move_btn") && !e.relatedTarget.closest(".btn_edit_description"))) {
        handleEditorInputBlur();
      }
    });

    // enter keydown
    editorInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.shiftKey) {
        // allow newline
      } else if (e.key === "Enter") {
        e.preventDefault();
        descriptionEl.classList.remove(HIDDEN); // Show the title
        formContainer.classList.add(HIDDEN); // Hide the editing container
        descriptionEl.innerHTML = editorInput.innerHTML; // pass the editorInput value around
        editor.classList.add(HIDDEN);
        editBtn.classList.remove("active");
      }
    });

    // outside click
    document.addEventListener("click", function (e) {
      // when click on adding link to title & anywhere else
      if (!e.target.closest(".description.task_drag") && !e.target.closest(".modal_description_only_editor--link")) {
        descriptionEl.classList.remove(HIDDEN); // Show the title
        formContainer.classList.add(HIDDEN); // Hide the editing container
        descriptionEl.innerHTML = editorInput.innerHTML; // pass the editorInput value around
        editor.classList.add(HIDDEN);
        editBtn.classList.remove("active");
      }
    });

    // title font size change
    const fontSizeSelect = parent.querySelector("#fontSizeSelect");
    fontSizeSelect.addEventListener("change", function () {
      formatDoc("fontSize", this.value);
    });

    // change text case
    const textCaseBtn = parent.querySelector("#changeTextCase");
    textCaseBtn.addEventListener("click", function () {
      if (this.classList.contains("task-button--active")) {
        this.classList.remove("task-button--active");
        changeTextCase("lowercase");
      } else {
        changeTextCase("uppercase");
        this.classList.add("task-button--active");
      }
    });

    // Add Link
    const linkBtn = parent.querySelector("#description-content-link");
    const descriptionAddLinkModal = document.querySelector(".modal_description_only_editor--link");

    linkBtn.addEventListener("click", function () {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      // Save the selected range
      const range = selection.getRangeAt(0);
      window.selectedRange = range;

      // Show the modal
      descriptionAddLinkModal.classList.remove(HIDDEN);
    });

    editorInput.addEventListener("mouseenter", function () {
      const anchorElements = this.querySelectorAll("a");

      anchorElements.forEach((anchor) => {
        anchor.addEventListener("mouseenter", function () {
          editorInput.setAttribute("contenteditable", "false");
        });

        anchor.addEventListener("mouseleave", function () {
          editorInput.setAttribute("contenteditable", "true");
        });
      });
    });

    // https://www.sizemug.com
    /////////////////////////////////////////////////////
    // title handlers
    // input focus
    function handleEditorInputFocus() {
      editBtn.classList.add("active");
      editor.classList.remove(HIDDEN);
      editorInput.focus();
      handleCursorPosition(editorInput);
    }

    // input blur
    function handleEditorInputBlur() {
      editBtn.classList.remove("active");
      editor.classList.add(HIDDEN);
      editorInput.blur();
    }

    // case change
    function changeTextCase(caseType) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText.length > 0) {
        const caseText = selectedText[caseType === "lowercase" ? "toLowerCase" : "toUpperCase"]();

        // Use a DocumentFragment to insert the modified text
        const fragment = document.createDocumentFragment();
        fragment.appendChild(document.createTextNode(caseText));

        // Replace the selected text with the upper case text
        range.deleteContents();
        range.insertNode(fragment);

        // Clear the selection
        selection.removeAllRanges();
      }
    }

    return;
  }

  // Edit Description Button
  const editDescriptionBtn = target.closest(".btn_edit_description");
  if (editDescriptionBtn) {
    const editorInput = editDescriptionBtn.closest(".form").querySelector(".task_description_editor");
    const editor = editDescriptionBtn.closest(".form").querySelector(".description_editor");

    if (editDescriptionBtn.classList.contains("active")) {
      editDescriptionBtn.classList.remove("active");
      editor.classList.add(HIDDEN);
      editorInput.blur();
    } else {
      editDescriptionBtn.classList.add("active");
      editor.classList.remove(HIDDEN);
      editorInput.focus();
      handleCursorPosition(editorInput);
    }
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // hash tags event
  const hashTagItem = target.closest(".hashtag_item");
  if (hashTagItem) {
    const hashtagContent = hashTagItem.querySelector(".hashtag_content");
    const formContainer = hashTagItem.querySelector(".form");
    const editorInput = hashTagItem.querySelector(".task_description_hashtag_editable");
    const hashTagParent = hashTagItem.closest(".task_hashtags");
    const newTagForm = hashTagParent.querySelector(".new_hashtag");
    const newTagEditorInput = newTagForm.querySelector(".hashtag_new_editable");

    // tag item actions
    // Listen for delete button
    if (target.closest(".trash")) {
      return hashTagItem.remove();
    }

    // Listen add more tags
    if (target.closest(".add_hashtag_item")) {
      handleSubmit(editorInput);
      newTagForm.classList.remove(HIDDEN);
      newTagEditorInput.focus();

      const handleNewTag = function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          console.log(newTagEditorInput);
          addTag(newTagEditorInput, hashTagParent);
          newTagForm.classList.add(HIDDEN);
          // Remove the event listener after it's used
          newTagEditorInput.removeEventListener("keydown", handleNewTag);
        }
      };

      newTagEditorInput.addEventListener("keydown", handleNewTag);

      return;
    }

    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    // Editing content only
    formContainer.classList.remove(HIDDEN); // Show hash tag form
    hashtagContent.classList.add(HIDDEN); // Hide content
    editorInput.innerHTML = hashtagContent.textContent.slice(1); // Pass content around
    editorInput.focus();
    handleCursorPosition(editorInput); // position input cursor on focus

    // Edit tags
    editorInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!editorInput.textContent) return;

        handleSubmit(editorInput);
      }
    });

    function handleSubmit() {
      const plainTextContent = editorInput.textContent.replace(/\s+/g, " ").trim();
      hashtagContent.textContent = `#${plainTextContent}`;
      hashtagContent.classList.remove(HIDDEN); // Hide content
      formContainer.classList.add(HIDDEN); // Hide hash tag form
      editorInput.blur();
    }

    return;
  }

  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////
  // Task Images Item
  const clickedImage = target.closest("#description_image--item");
  const taskDescriptionImagesWrapper = document.getElementById("taskDescriptionImagesWrapper");
  const descriptionImages = taskDescriptionImagesWrapper.querySelectorAll("#description_image");

  if (clickedImage) {
    const addNewTaskImages = document.getElementById("addNewTaskImages");

    // remove active class from all images
    applyAllElements(descriptionImages, "remove", "active");

    addNewTaskImages.classList.add(HIDDEN);

    // add active to the clicked image
    clickedImage.closest(".description_image").classList.add("active");

    return;
  }

  // Trash was clicked
  const taskImageItemTrash = target.closest("#taskImageItemTrash");
  if (taskImageItemTrash) {
    target?.closest(".description_image")?.remove();
    return;
  }

  // Add More Images
  const taskImageItemMore = target.closest("#taskImageItemMore");
  if (taskImageItemMore) {
    const addNewTaskImages = document.getElementById("addNewTaskImages");

    // show upload new task image container
    addNewTaskImages.classList.remove(HIDDEN);
    addNewTaskImages.scrollIntoView({ behavior: "smooth" });

    // remove active class from all images after few milliseconds
    applyAllElements(descriptionImages, "remove", "active");

    // File change
    const addNewTaskImageFile = addNewTaskImages.querySelector("#new_task_image");
    let updatingImages = [];

    addNewTaskImageFile.addEventListener("change", function (e) {
      const files = [...e.target.files];
      handleFileImageUpload(files);
    });
    // Prevent default behavior to allow dropping files
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      document.addEventListener(eventName, preventDefaults, false);
    });

    document.addEventListener("dragover", (e) => {
      const addNewTaskImages = e.target.closest("#addNewTaskImages");

      if (addNewTaskImages) {
        addNewTaskImages.classList.add("drop-active");
      }
    });

    document.addEventListener("dragleave", (e) => {
      const addNewTaskImages = e.target.closest("#addNewTaskImages");

      if (addNewTaskImages) {
        addNewTaskImages.classList.remove("drop-active");
      }
    });

    document.addEventListener("drop", (e) => {
      const addNewTaskImages = e.target.closest("#addNewTaskImages");

      if (addNewTaskImages) {
        const files = [...e.dataTransfer.files];

        addNewTaskImages.classList.remove("drop-active");
        handleFileImageUpload(files);
      }
    });

    function handleFileImageUpload(files) {
      let filesProcessed = 0;

      // then, iterate over each selected files and display it
      for (let i = 0; i <= files.length - 1; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) continue;

        const reader = new FileReader();

        reader.onload = function () {
          const bobURL = URL.createObjectURL(file);
          updatingImages.push(bobURL);
          filesProcessed++;

          if (filesProcessed === files.length) {
            updateTaskImageUploaded(updatingImages);
            addNewTaskImages.classList.add(HIDDEN);
            updatingImages = [];
          }
        };

        reader.readAsDataURL(file);
      }

      // Remove Event Listeners to avoid running event mutiple times
      addNewTaskImageFile.removeEventListener("change", (e) => {
        const files = [...e.target.files];
        handleFileImageUpload(files);
      });

      document.removeEventListener("drop", (e) => {
        const addNewTaskImages = e.target.closest("#addNewTaskImages");
        if (addNewTaskImages) {
          const files = [...e.dataTransfer.files];
          handleFileImageUpload(files);
        }
      });
    }

    return;
  }
});

/**
 *
 *
 *
 *
 *
 *
 */
// Outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest("#description_image")) {
    const descriptionImages = document.querySelectorAll("#description_image");

    // remove active class from all images
    applyAllElements(descriptionImages, "remove", "active");
  }
});

/**
 *
 *
 *
 *
 * @param {*} updatingImages
 *
 *
 */
function updateTaskImageUploaded(updatingImages) {
  // Get the last element
  const lastElement = document.getElementById("taskDescriptionImages").lastElementChild;

  updatingImages.forEach((image, i) => {
    const markup = `
            <div class="description_image description_drag_image" id="description_image" data-dropimage="${i + 1}">
              <img src="${image}" alt="" id="description_image--item"/>

              <div class="options">
                <button class="trash" id="taskImageItemTrash">
                  <img src="icons/trash.svg" alt="" />
                </button>
                <button class="addMore" id="taskImageItemMore">
                  <img src="icons/add.svg" alt="" />
                </button>
              </div>
            </div>
    `;

    // Insert HTML before the end of last element
    lastElement.insertAdjacentHTML("beforebegin", markup);
  });
}

function applyAllElements(elements, method = "add", className = HIDDEN) {
  elements.forEach((el) => el.classList[method](className));
}

// New HashTag
function addTag(editable, parentEl) {
  const plainTextContent = editable.textContent.replace(/\s+/g, " ").trim();
  const markup = `
                  <li title="Hash Tag" class="hashtag_item hashtag_item--${10}">
                    <div class="hashtag_content">#${plainTextContent}</div>

                    <div class="form homepage-hidden">
                      <div class="task_description_hashtag_editable" contenteditable="true"></div>

                      <div class="options">
                        <button class="move_btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="m12 3l.625-.78l-.625-.5l-.625.5zm-1 6a1 1 0 1 0 2 0zm5.625-3.58l-4-3.2l-1.25 1.56l4 3.2zm-5.25-3.2l-4 3.2l1.25 1.56l4-3.2zM11 3v6h2V3zm10 9l.78.625l.5-.625l-.5-.625zm-6-1a1 1 0 1 0 0 2zm3.58 5.625l3.2-4l-1.56-1.25l-3.2 4zm3.2-5.25l-3.2-4l-1.56 1.25l3.2 4zM21 11h-6v2h6zm-9 10l.625.78l-.625.5l-.625-.5zm-1-6a1 1 0 1 1 2 0zm5.625 3.58l-4 3.2l-1.25-1.56l4-3.2zm-5.25 3.2l-4-3.2l1.25-1.56l4 3.2zM11 21v-6h2v6zm-8-9l-.78.625l-.5-.625l.5-.625zm6-1a1 1 0 1 1 0 2zm-3.58 5.625l-3.2-4l1.56-1.25l3.2 4zm-3.2-5.25l3.2-4l1.56 1.25l-3.2 4zM3 11h6v2H3z"/></svg>
                        </button>
                        <button class="trash">
                          <img src="icons/trash.svg" alt="" />
                        </button>
                        <button class="add_hashtag add_hashtag_item">
                          <img src="icons/add.svg" alt="" />
                        </button>
                      </div>
                    </div>
                  </li>
          `;

  parentEl.querySelector("ul").insertAdjacentHTML("beforeend", markup);
  editable.innerHTML = "";
}

// Add link to Description
const formDescriptionApplyBtn = document.getElementById("apply_description_link");
formDescriptionApplyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const textEl = modalDescriptionLink.querySelector('[name="text"]');
  const urlEl = modalDescriptionLink.querySelector('[name="url"]');

  if (!urlEl.value || !textEl.value) return;

  // Hide the modal
  modalDescriptionLink.classList.add(HIDDEN);

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = urlEl.value;
  link.textContent = textEl.value;
  link.target = "_blank";

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
});

// Add title to link
const formApplyBtn = document.getElementById("apply_title_link");
formApplyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const textEl = modalDescriptionHeaderLinkContainer.querySelector('[name="text"]');
  const urlEl = modalDescriptionHeaderLinkContainer.querySelector('[name="url"]');

  if (!urlEl.value || !textEl.value) return;

  // Hide the modal
  modalDescriptionHeaderLinkContainer.classList.add(HIDDEN);

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = urlEl.value;
  link.textContent = textEl.value;
  link.target = "_blank";

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
});

//  Move input cursor to the front
function handleCursorPosition(element) {
  const range = document.createRange();
  const selection = window.getSelection();

  // Clear any existing selection
  selection.removeAllRanges();

  // Set the cursor at the end of the input
  range.selectNodeContents(element);
  range.collapse(false); // false means collapse to the end
  selection.addRange(range);
  element.focus(); // focus the editable element to be ready to edit
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// Matching Modal
const sharedFromModal = document.querySelector(".shared-from-overlay");
const cancelSharedFromModal = document.querySelector(".cancel-shared-from");

function handleSharedFrom(status = "show") {
  if (status === "show") {
    sharedFromModal.classList.remove(HIDDEN);
  } else if (status === "hide") {
    sharedFromModal.classList.add(HIDDEN);
  }
}

// hide shared from container
cancelSharedFromModal.addEventListener("click", () => {
  handleSharedFrom("hide");
});

///////////////////////////////
/////// Add to Calender ///////
///////////////////////////////
const addToCalenderBtn = document.querySelectorAll(".add_calender");
const removeToCalenderBtn = document.querySelector(".add-calender-cancel");
const addToCalenderModal = document.querySelector(".add-calender-modal");

function handleShowAddCalender2(status = "show") {
  if (status === "show") {
    addToCalenderModal.classList.remove(HIDDEN);
  } else if (status === "hide") {
    addToCalenderModal.classList.add(HIDDEN);
  }
}

// hide add calender
removeToCalenderBtn.addEventListener("click", () => {
  handleShowAddCalender2("hide");
});

////////////////////////////////
//////// Discard Button ////////
////////////////////////////////
const descDiscardBtn = document.getElementById("discard_btn");

descDiscardBtn.addEventListener("click", () => {
  showGlobalDiscardModal();
});
