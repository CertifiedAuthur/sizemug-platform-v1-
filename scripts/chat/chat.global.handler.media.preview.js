const picturePreviewModal = document.getElementById("picturePreviewModal");
const previewImagesList = document.getElementById("previewImagesList");
// const closeSendUserPictureModalBtn = document.getElementById("closeSendUserPictureModalBtn");

const $pictureSpacerPreview = $("#pictureSpacerPreview");

// Function to initialize Slick carousel
function initializePictureUploadSlick() {
  if ($pictureSpacerPreview.hasClass("slick-initialized")) {
    $pictureSpacerPreview.slick("unslick"); // Destroy existing instance
  }

  $pictureSpacerPreview.slick({
    dots: false,
    infinite: false,
    speed: 500,
    fade: true,
    cssEase: "linear",
    arrows: false,
  });
}

function updateSlickLayout() {
  $pictureSpacerPreview.slick("setPosition");
}

// Call on window resize
$(window).on("resize", function () {
  if (!picturePreviewModal.classList.contains(HIDDEN)) {
    // updateSlickLayout();
  }
});

// assume `tuiInstance` is your single ImageEditor instance
function resetEditor(editor) {
  // remove all drawn objects (text, shapes, drawings…)
  editor.clearObjects();
  // wipe out undo/redo history
  editor.clearUndoStack();
  editor.clearRedoStack();
  // if you want to reset flip/rotation/zoom too:
  editor.resetFlip();
  editor.resetZoom();
}

/** Accepting Media (Videos & Images) */
function updateTheEntirePreviewLogic(medias) {
  const pictureSpacerPreview = document.getElementById("pictureSpacerPreview");
  console.log(medias);

  if (medias.length > 1) renderPreviewScroll(medias);

  medias.forEach((media) => {
    let mediaEl;

    if (media.type === "video") {
      mediaEl = document.createElement("video");
      mediaEl.src = media.media;
      mediaEl.autoplay = true;
      mediaEl.loop = true;
      mediaEl.muted = true;
    } else if (media.type === "image") {
      mediaEl = document.createElement("img");
      mediaEl.src = media.media;
      mediaEl.alt = "Media Preview";

      tuiInstance.loadImageFromURL(media.media, "UserImage");
      recomputeCanvasDimension();
    }
  });

  showPicturePreviewModal(); // Show Preview Container
  // initializePictureUploadSlick(); // Invalidate preview Slick Images
  // updateSlickLayout();
}

function renderPreviewScroll(medias) {
  previewImagesList.innerHTML = ""; // clear the container
  previewImagesList.classList.remove(HIDDEN);

  medias.forEach((media, i) => {
    const markup = `
            <div id="preview_image_item--${i}" data-index="${i}" class="preview_image_item ${i === 0 ? "active" : ""}" tabindex="0" role="button">
                  ${media.type === "image" ? `<img src="${media.media}" alt="" />` : `<video  src="${media.media}" />`}
                  <button>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#FF3B30" d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z" /></svg>
                  </button>
                  <span></span>
            </div>
          `;

    previewImagesList.insertAdjacentHTML("beforeend", markup);
  });
}

previewImagesList.addEventListener("click", (e) => {
  const previewImageItem = e.target.closest(".preview_image_item");
  const deleteBtn = e.target.closest("button");

  if (deleteBtn) {
    const { index } = previewImageItem.dataset;
    previewImage.splice(+index, 1);
    console.log(previewImage);
    updateTheEntirePreviewLogic(previewImage);
    return;
  }

  // Item clicked
  if (previewImageItem) {
    const { index } = previewImageItem.dataset;

    updateImageContainerWithIndex(+index);
    return;
  }
});

$pictureSpacerPreview.on("afterChange", function (_, _, currentSlide) {
  updateImageContainerWithIndex(currentSlide);
});

function updateImageContainerWithIndex(index) {
  const previewImageItem = document.querySelector(`#previewImagesList #preview_image_item--${index}`);
  const previewImageItems = document.querySelectorAll(".preview_image_item");

  $pictureSpacerPreview.slick("slickGoTo", +index);
  previewImageItems.forEach((item) => item.classList.remove("active"));
  previewImageItem.classList.add("active");
}

// Add event listener for arrow key navigation when the container shows
document.addEventListener("keydown", (e) => {
  if (!picturePreviewModal.classList.contains(HIDDEN)) {
    if (e.key === "ArrowLeft") {
      // Slide left
      $pictureSpacerPreview.slick("slickPrev");
      showPreviewUploading("prev");
    } else if (e.key === "ArrowRight") {
      // Slide right
      $pictureSpacerPreview.slick("slickNext");
      showPreviewUploading("next");
    }
  }
});

function showPreviewUploading(moveType) {
  const activeIndex = $pictureSpacerPreview.slick("slickCurrentSlide"); // Get the index of the active slide
  const totalItems = $pictureSpacerPreview.slick("getSlick").slideCount;
  const previewImageItems = document.querySelectorAll(".preview_image_item");
  const previewImageItem = document.getElementById(`preview_image_item--${activeIndex}`);

  previewImageItems.forEach((item) => item.classList.remove("active"));

  if (moveType === "next" && activeIndex !== totalItems) {
    previewImageItem.classList.add("active");
  } else if (moveType === "prev") {
    previewImageItem.classList.add("active");
  }

  previewImageItem.scrollIntoView({ behavior: "smooth", block: "center" });
}

// closeSendUserPictureModalBtn.addEventListener("click", () => {
//   hidePicturePreviewModal();
//   $pictureSpacerPreview.slick("unslick"); // Destroy existing instance
// });

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

function showPicturePreviewModal() {
  const sendDocumentImageVideo = document.getElementById("sendDocumentImageVideo");

  picturePreviewModal.classList.remove(HIDDEN);
  sendDocumentImageVideo.setAttribute("data-type", "photo");

  hideEmojiTasksAdditionalButtons();
}

function hidePicturePreviewModal() {
  const sendDocumentImageVideo = document.getElementById("sendDocumentImageVideo");

  picturePreviewModal.classList.add(HIDDEN);
  sendDocumentImageVideo.removeAttribute("data-type");

  showEmojiTasksAdditionalButtons();
  // located in global.variables.js
  shareMedias = [];
}

function hideEmojiTasksAdditionalButtons() {
  const x1hx0egp = document.querySelectorAll(".x1hx0egp");
  x1hx0egp.forEach((button) => button.classList.add(HIDDEN));
}

function showEmojiTasksAdditionalButtons() {
  const x1hx0egp = document.querySelectorAll(".x1hx0egp");
  x1hx0egp.forEach((button) => button.classList.remove(HIDDEN));
}
