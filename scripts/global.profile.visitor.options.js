document.addEventListener("DOMContentLoaded", () => {
  const profileOptions = document.getElementById("profileOptions");

  profileOptions.addEventListener("click", function () {
    const isExpanded = this.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      this.setAttribute("aria-expanded", false);
    } else {
      this.setAttribute("aria-expanded", true);
    }
  });
});
