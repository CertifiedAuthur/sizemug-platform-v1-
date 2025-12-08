document.querySelectorAll(".overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target.classList.contains("overlay")) {
      overlay.classList.add(HIDDEN);
    }
  });
});
