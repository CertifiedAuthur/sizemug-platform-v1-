document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("storyListContainer");
  const btnLeft = document.getElementById("scrollStoryLeft");
  const btnRight = document.getElementById("scrollStoryRight");
  const SCROLL_STEP = 200; // px per click

  function updateScrollButtons() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Hide Left if at or before start
    btnLeft.style.display = scrollLeft > 0 ? "flex" : "none";

    // Hide Right if at or past end
    btnRight.style.display = scrollLeft < maxScroll ? "flex" : "none";
  }

  btnLeft.addEventListener("click", () => {
    container.scrollBy({ left: -SCROLL_STEP, behavior: "smooth" });
  });

  btnRight.addEventListener("click", () => {
    container.scrollBy({ left: SCROLL_STEP, behavior: "smooth" });
  });

  container.addEventListener("scroll", updateScrollButtons);

  // Initial state
  updateScrollButtons();
});
