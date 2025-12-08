const expandedFollowingContainer = document.getElementById("expandedFollowingContainer");
const followingMainContainerRow1 = document.getElementById("followingMainContainerRow1");
// const followingMainContainerRow2 = document.getElementById("followingMainContainerRow2");

expandedFollowingContainer.addEventListener("click", function () {
  const isExpanded = this.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    this.setAttribute("aria-expanded", false);
    followingMainContainerRow1.classList.remove(HIDDEN);
  } else {
    this.setAttribute("aria-expanded", true);
    followingMainContainerRow1.classList.add(HIDDEN);
  }
});
