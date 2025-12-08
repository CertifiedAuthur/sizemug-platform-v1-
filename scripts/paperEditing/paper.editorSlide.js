const editorPlaySlides = document.getElementById("editorPlaySlides");
const editorSlidesWrapper = document.getElementById("editorSlidesWrapper");
const slidesCount = document.getElementById("slides_count");

let CURSLIDERINDEX = 0;

function showEditorPlaySlides() {
  editorPlaySlides.classList.remove(HIDDEN); // show slides modal
  goToSlide(0); // show first slide
  toggleFullscreen(editorPlaySlides); // show in full screen mode

  const editorSlideInsert = document.getElementById("editor_slide_insert");
  paperEditors.forEach((editor) => {
    const previewPaper = document.createElement("div");
    previewPaper.className = "editor-slides-container";
    previewPaper.id = "slide";
    previewPaper.innerHTML = editor.container.querySelector(".ql-editor").innerHTML;

    // Append it to the DOM
    editorSlideInsert.appendChild(previewPaper);
  });
}

const goToSlide = function (slide) {
  const slides = editorSlidesWrapper.querySelectorAll("#slide");
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));

  // update slider counts
  slidesCount.textContent = `${slide + 1}/${slides.length}`;
};

document.addEventListener("DOMContentLoaded", () => {
  const sizemugPlaySlideShowBtn = document.getElementById("sizemug_play_slide_show--btn");

  sizemugPlaySlideShowBtn.addEventListener("click", showEditorPlaySlides);

  // Listen for fullscreen change
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      editorPlaySlides.classList.add(HIDDEN); // Hide the modal when fullscreen exits
    }
  });
});

document.addEventListener("keydown", (e) => {
  if (!editorPlaySlides.classList.contains(HIDDEN) && e.key === "ArrowLeft") {
    if (CURSLIDERINDEX > 0) {
      goToSlide(--CURSLIDERINDEX);
    }
  }

  if (!editorPlaySlides.classList.contains(HIDDEN) && e.key === "ArrowRight") {
    const slides = editorSlidesWrapper.querySelectorAll("#slide");

    if (CURSLIDERINDEX < slides.length - 1) {
      goToSlide(++CURSLIDERINDEX);
    }
  }

  if (!editorPlaySlides.classList.contains(HIDDEN) && e.key === "Escape") {
    if (document.fullscreenElement) {
      toggleFullscreen(document.fullscreenElement); // exit fullscreen mode
    } else {
      editorPlaySlides.classList.add(HIDDEN); // hide modal if not in fullscreen
    }
  }
});
