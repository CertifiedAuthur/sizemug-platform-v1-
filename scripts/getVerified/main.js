const startVerificationBtns = document.querySelectorAll(".startVerification");
const getVerifiedModal = document.getElementById("getVerifiedModal");

startVerificationBtns.forEach((btn) => {
  btn.addEventListener("click", showApplyVerification);
});

function showApplyVerification() {
  getVerifiedModal.classList.remove(HIDDEN);
}

function hideApplyVerification() {
  getVerifiedModal.classList.add(HIDDEN);
}
