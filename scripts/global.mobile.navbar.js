// see less and see more
document.querySelector(".suggestion_popup button").addEventListener("click", function () {
  const list = document.querySelector(".suggestion_popup ul");
  const isExpanded = list.classList.toggle("expanded");
  this.textContent = isExpanded ? "See less..." : "See more...";
});

// Trigger Tablet Nav
const triggerTabletNav = document.getElementById("triggerTabletNav");
const tabletNavModal = document.getElementById("tabletNavModal");

triggerTabletNav.addEventListener("click", () => {
  tabletNavModal.classList.toggle(HIDDEN);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#tabletNavModal") && !e.target.closest("#triggerTabletNav")) {
    tabletNavModal.classList.add(HIDDEN);
  }
});
