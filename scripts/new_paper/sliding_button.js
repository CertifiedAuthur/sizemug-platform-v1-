const switchContainer = document.querySelectorAll(".switch_buttons_wrapper");

switchContainer.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const target = e.target;
    const targetBtn = target.closest("button");
    const btns = btn.querySelectorAll("button");
    const btnSlider = btn.querySelector(".switch_sliding--slider");

    if (targetBtn) {
      const { type } = targetBtn.dataset;

      btns.forEach((btn) => btn.classList.remove("clicked"));
      targetBtn.classList.add("clicked");

      if (type === "favourites") {
        btnSlider.style.transform = "translateX(0%)";
        favouriteItemsContainer.classList.remove(HIDDEN);
        binsItemsContainer.classList.add(HIDDEN);
      } else {
        btnSlider.style.transform = "translateX(100%)";
        favouriteItemsContainer.classList.add(HIDDEN);
        binsItemsContainer.classList.remove(HIDDEN);
      }
    }
  });
});
