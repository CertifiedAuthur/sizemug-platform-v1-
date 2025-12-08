// Close Overlay
const overlays = document.querySelectorAll(".overlay");
overlays.forEach((overlay) => {
  overlay.addEventListener("click", function (e) {
    if (e.target.classList.contains("overlay")) {
      this.classList.add(HIDDEN);
    }
  });
});
