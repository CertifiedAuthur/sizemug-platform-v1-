// Description See More
const expandedDescription = document.getElementById("expandedDescription");
expandedDescription?.addEventListener("click", function () {
  const bioContent = document.getElementById("bioContent");
  const isCollapsed = this.getAttribute("aria-expanded") === "true";

  const fullHeight = bioContent.scrollHeight;
  const collapsedHeight = 24; // Match this with CSS

  // Set explicit height before transition
  bioContent.style.height = isCollapsed ? `${collapsedHeight}px` : `${fullHeight}px`;

  // Force a reflow to ensure the initial height is set
  bioContent.offsetHeight;

  if (isCollapsed) {
    // Collapse
    bioContent.style.height = `${collapsedHeight}px`;
    // textElement.classList.add("collapsed");
    this.firstElementChild.textContent = "See more";
    // chevron.classList.remove("up");
    this.setAttribute("aria-expanded", false);
  } else {
    // Expand
    bioContent.style.height = `${fullHeight}px`;
    // textElement.classList.remove("collapsed");
    this.firstElementChild.textContent = "See less";
    // chevron.classList.add("up");
    this.setAttribute("aria-expanded", true);
  }

  // Clean up after transition
  // bioContent.addEventListener("transitionend", function handler() {
  //   if (!bioContent.classList.contains("collapsed")) {
  //     bioContent.style.height = "auto";
  //   }
  //   bioContent.removeEventListener("transitionend", handler);
  // });
});
