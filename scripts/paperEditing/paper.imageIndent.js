document.addEventListener("DOMContentLoaded", () => {
  const sizemugImageRightIndentBtn = document.getElementById("sizemug_image_right_indent--btn");
  const sizemugImageLeftIndentBtn = document.getElementById("sizemug_image_left_indent--btn");

  sizemugImageRightIndentBtn.addEventListener("click", indentImageRight);
  sizemugImageLeftIndentBtn.addEventListener("click", indentImageLeft);
});

function indentImageRight() {
  const activatedImage = document.querySelector('[data-active-image="activated"]');
  if (!activatedImage) return;

  const selected = this.getAttribute("aria-selected");
  if (selected) {
    activatedImage.style.float = "right";
  } else {
    activatedImage.style.float = "none";
  }
}

function indentImageLeft() {
  const activatedImage = document.querySelector('[data-active-image="activated"]');

  if (!activatedImage) return;

  const selected = this.getAttribute("aria-selected");
  if (selected) {
    activatedImage.style.float = "left";
  } else {
    activatedImage.style.float = "none";
  }
}
