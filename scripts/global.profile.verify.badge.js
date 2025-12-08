const verifiedBadgeEl = document.getElementById("verifiedBadge");

verifiedBadgeEl.addEventListener("click", handleVerifiedBadgeToggle);
// Tab index event listening
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleVerifiedBadgeToggle();
  }
});

function handleVerifiedBadgeToggle() {
  const getVerifiedContainer = document.getElementById("getVerifiedContainer");
  const isVerified = getVerifiedContainer?.getAttribute("data-verified") === "true";

  if (getVerifiedContainer) {
    if (isVerified) {
      getVerifiedContainer.setAttribute("data-verified", false);
    } else {
      getVerifiedContainer.setAttribute("data-verified", true);
    }
  }
}
