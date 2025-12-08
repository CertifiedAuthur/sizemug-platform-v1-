document.addEventListener("DOMContentLoaded", function () {
  const importMediaBtn = document.getElementById("import_media--tools");
  const importMediaModal = document.getElementById("import_media_modal");
  const imageDocumentElement = document.querySelector(".image_document_element");
  const mobileHideInsertImageModalBtn = document.getElementById("mobileHideInsertImageModalBtn");

  mobileHideInsertImageModalBtn.addEventListener("click", () => {
    importMediaModal.classList.add(HIDDEN);
  });

  [imageDocumentElement, importMediaBtn].forEach((button) => {
    button.addEventListener("click", () => {
      importMediaModal.classList.remove(HIDDEN);
      closeDropdownBar(); // close all dropdown
    });
  });

  // Select & Upload Image
  const importMediaInput = document.getElementById("import_media--input");
  const importMediaLists = document.getElementById("import_media_lists");
  let mediaImages = [];

  importMediaInput.addEventListener("change", (e) => {
    const files = [...e.target.files];

    let filesProcessed = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image")) continue;

      const reader = new FileReader();
      reader.onload = function (e) {
        const url = e.target.result;
        mediaImages.push(url);
        filesProcessed++;

        // Once all files are processed, update the DOM
        if (filesProcessed === files.length) {
          // update DOM
          renderImportedMedias();
        }
      };
      reader.readAsDataURL(file);
    }
  });

  function renderImportedMedias() {
    importMediaLists.innerHTML = "";

    mediaImages.forEach((media, i) => {
      const markup = `
             <div class="media image" data-positionIndex="${i}">
              <img src="${media}" alt="" />

              <button id="image_upload--${i}">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7L7 17M7 7l10 10" /></svg>
              </button>
            </div>
    `;

      importMediaLists.insertAdjacentHTML("beforeend", markup);

      // Delete event
      const removeImageBtn = document.getElementById(`image_upload--${i}`);
      removeImageBtn.addEventListener("click", (e) => {
        e.target.closest(".media")?.remove();
        mediaImages.splice(i, 1); // remove the image from mediaImages array
      });
    });
  }

  // Upload the image
  const saveUploadImagesBtn = document.getElementById("save_upload_images");
  saveUploadImagesBtn.addEventListener("click", uploadImages);

  function uploadImages() {
    importMediaModal.classList.add(HIDDEN);
    mediaImages.forEach(createImageContainer);
    mediaImages = []; // Clear the array after uploading
  }

  function createImageContainer(imageUrl) {
    const selection = focusedEditor.getSelection();
    const index = selection ? selection.index : focusedEditor.getLength(); // Insert at end if no selection

    // embed image
    focusedEditor.insertEmbed(index, "custom-image", { url: imageUrl });

    // Insert a new line to ensure the next text starts in a new paragraph
    focusedEditor.insertText(index + 1, "\n");
    focusedEditor.setSelection(index + 2); // Move cursor after the new line
  }

  // Click on Image to focus
  document.addEventListener("click", (e) => {
    const imageOuterWrapper = e.target.closest(".image_frame_outer");

    if (imageOuterWrapper) return focusImageOutWrapper(imageOuterWrapper);
    if (!imageOuterWrapper && !e.target.closest("#navbar_header_tools--wrapper")) return unfocusImageOutWrapper();
  });
});

function focusImageOutWrapper(imageOuterWrapper) {
  imageOuterWrapper.setAttribute("data-active-image", "activated");

  const allResizeBtn = imageOuterWrapper.querySelectorAll(".resize_btn");
  allResizeBtn.forEach((btn) => btn.classList.remove(HIDDEN));

  const actionBtnWrapper = imageOuterWrapper.querySelector(".action_btn--wrapper");
  actionBtnWrapper.classList.remove(HIDDEN);
}

function unfocusImageOutWrapper() {
  const imageFrameOuter = document.querySelectorAll(".image_frame_outer");
  imageFrameOuter.forEach((frame) => frame.setAttribute("data-active-image", "deactivated"));

  const allResizeBtn = document.querySelectorAll(".image_frame_outer .resize_btn");
  allResizeBtn.forEach((btn) => btn.classList.add(HIDDEN));

  const actionBtnWrapper = document.querySelectorAll(".image_frame_outer .action_btn--wrapper");
  actionBtnWrapper.forEach((wrapper) => wrapper.classList.add(HIDDEN));
}
