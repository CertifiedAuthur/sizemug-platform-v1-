const sizemugExperienceModal = document.getElementById("sizemugExperienceModal");
const sizemugExperience1 = document.querySelector(".sizemug_experience--1");
const sizemugExperience2 = document.querySelector(".sizemug_experience--2");
const navigateExpButton = document.getElementById("navigateExpButton");
const closeExperienceModal = document.getElementById("close_experience_modal");

document.addEventListener("DOMContentLoaded", () => {
  let sizemugRate;

  checkAndShowModal();

  // close exprience modal
  closeExperienceModal.addEventListener("click", hideExperienceModal);

  const experienceCounts = document.getElementById("experienceCounts");
  const allCounts = experienceCounts.querySelectorAll("span");
  const allEmojis = document.querySelectorAll("#ratings_emojis span");
  const ratingLess5 = document.getElementById("ratingLess5");
  const ratingEqual5 = document.getElementById("ratingEqual5");
  const ratingGreater6 = document.getElementById("ratingGreater6");

  experienceCounts.addEventListener("click", (e) => {
    const countItem = e.target.closest("span");

    if (countItem) {
      const { count } = countItem.dataset;

      allCounts.forEach((count) => count.classList.remove("selected"));
      allEmojis.forEach((emoji) => emoji.classList.remove("active"));

      sizemugRate = count;
      navigateExpButton.removeAttribute("disabled");

      if (+count < 5) {
        countItem.classList.add("selected");
        ratingLess5.classList.add("active");
        return;
      }

      if (+count === 5) {
        countItem.classList.add("selected");
        ratingEqual5.classList.add("active");
        return;
      }

      if (+count > 5) {
        countItem.classList.add("selected");
        ratingGreater6.classList.add("active");
        return;
      }
    }
  });

  // Navigate
  navigateExpButton.addEventListener("click", function () {
    const { step } = this.dataset;

    if (step === "1") {
      sizemugExperience1.classList.add(HIDDEN);
      sizemugExperience2.classList.remove(HIDDEN);
      this.textContent = "Submit";
      this.setAttribute("data-step", "2");
    } else {
      hideExperienceModal();
    }
  });
});

// Function to check and display the modal after 5 hours
function checkAndShowModal() {
  const storedTime = localStorage.getItem("sizemugFeedbackModalRemovalTime");
  const currentTime = Date.now();

  // 5 hours in milliseconds
  const fiveHours = 5 * 60 * 60 * 1000;

  if (storedTime) {
    const elapsed = currentTime - parseInt(storedTime, 10);

    // If 5 hours have passed, show the modal
    if (elapsed >= fiveHours) {
      showExperienceModal();

      // Remove the stored time as it’s no longer needed
      localStorage.removeItem("sizemugFeedbackModalRemovalTime");
    }
  } else {
    // If no stored time, this might be the first visit, so set it up now
    removeFeedbackModalAndSetTime(sizemugExperienceModal);
  }
}

// Function to remove modal and store the removal time
function removeFeedbackModalAndSetTime(sizemugExperienceModal) {
  // Remove modal from the DOM
  showExperienceModal();

  // Store the current time in localStorage
  localStorage.setItem("sizemugFeedbackModalRemovalTime", Date.now().toString());

  // Set a timeout to re-show the modal after 5 hours if the user is still on the page
  setTimeout(() => {
    showExperienceModal();

    // Remove the stored time since the modal is shown again
    localStorage.removeItem("sizemugFeedbackModalRemovalTime");
  }, 5 * 60 * 60 * 1000); // 5 hours in milliseconds
}

function showExperienceModal() {
  sizemugExperienceModal.classList.remove(HIDDEN);
}

function hideExperienceModal() {
  sizemugExperience1.classList.remove(HIDDEN);
  sizemugExperience2.classList.add(HIDDEN);

  sizemugExperienceModal.classList.add(HIDDEN);
  navigateExpButton.setAttribute("data-step", "2");
}
