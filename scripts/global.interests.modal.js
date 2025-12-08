const interestsModal = document.getElementById("interestsModal");

document.addEventListener("DOMContentLoaded", () => {
  const showInterestModalBtns = document.querySelectorAll(".show-interest-modal-btn");
  const cancelInterestModal = document.getElementById("cancelInterestModal");
  const saveInterestsAction = document.getElementById("saveInterestsAction");
  const interestItems = document.getElementById("interestItems");

  function renderInterestsData() {
    sizemugGlobalInterests.forEach((int) => {
      const maekup = `<button data-value="${int.value}" class="interest-item">${int.label}</button>`;
      interestItems.insertAdjacentHTML("beforeend", maekup);
    });
  }
  renderInterestsData();

  // Show
  showInterestModalBtns.forEach((btn) => {
    btn.addEventListener("click", showInterestsModal);
  });

  // Hide
  cancelInterestModal.addEventListener("click", hideInterestsModal);
  interestsModal.addEventListener("click", (e) => {
    if (e.target.id === "interestsModal") return hideInterestsModal();
  });

  // Select Interests
  let selectedInterests = [];
  interestItems.addEventListener("click", (e) => {
    const interestItem = e.target.closest(".interest-item");

    if (interestItem) {
      const value = interestItem.getAttribute("data-value");
      const isActive = interestItem.getAttribute("data-active") === "true";

      if (isActive) {
        interestItem.removeAttribute("data-active");
        selectedInterests = selectedInterests.filter((int) => int !== value);
      } else {
        interestItem.setAttribute("data-active", true);
        selectedInterests = [...selectedInterests, value];
      }
    }
  });

  // Save Interest
  saveInterestsAction.addEventListener("click", () => {
    const user = getDummyUser();

    user.interests = selectedInterests;
    localStorage.setItem(SIZEMUG_USER, JSON.stringify(user));
    hideInterestsModal();
  });
});

function showInterestsModal() {
  interestsModal.classList.remove(HIDDEN);
}

function hideInterestsModal() {
  interestsModal.classList.add(HIDDEN);
}
