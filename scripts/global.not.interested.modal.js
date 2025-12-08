const notInterestedData = [
  {
    value: "",
    label: "I have no interest on this subject",
  },

  {
    value: "",
    label: "This post is really old  ",
  },

  {
    value: "",
    label: "The author has not engaging content to me",
  },

  {
    value: "",
    label: "This post is very repetitive regarding the same subject",
  },

  {
    value: "",
    label: "I have seen or watched the same post somewhere before",
  },

  {
    value: "something-else",
    label: "Something else",
  },
];

const notInterestedModal = document.getElementById("notInterestedModal");
const interestChangedModal = document.getElementById("interestChangedModal");
const manualCloseNotInterested = document.getElementById("manualCloseNotInterested");
const hideNotInterestsModalButton = document.getElementById("hideNotInterestsModalButton");
const notInterestedItems = document.getElementById("notInterestedItems");
const submitInteretedButton = notInterestedModal.querySelector("footer button");

const showNotInterestedModalBtns = document.querySelectorAll(".show-not-interested-btn");

let notInterestDropdownInterval;

function renderNotInterested() {
  notInterestedItems.innerHTML = "";

  notInterestedData.forEach((int) => {
    const markup = `
        <li role="button" class="${int.value}">
            <span>${int.label}</span>

            <label class="checkbox">
              <input type="checkbox" />
              <span class="checkmark"></span>
            </label>
        </li>
    `;

    notInterestedItems.insertAdjacentHTML("beforeend", markup);
  });
}
renderNotInterested();

notInterestedItems.addEventListener("click", (e) => {
  const list = e.target.closest("li");

  const allListInputs = notInterestedItems.querySelectorAll("input");

  if (list) {
    submitInteretedButton.removeAttribute("disabled");

    allListInputs.forEach((input) => (input.checked = false));
    list.querySelector("input").checked = true;

    if (list.classList.contains("something-else")) {
      showWhyNotInterestedModal();
    }
  }
});

hideNotInterestsModalButton.addEventListener("click", hideInterestSliderDropdown);

function showInterestSliderDropdown() {
  interestChangedModal.classList.add("show");

  notInterestDropdownInterval = setInterval(() => {
    hideInterestSliderDropdown();
  }, 3000);
}

function hideInterestSliderDropdown() {
  clearInterval(notInterestDropdownInterval);
  interestChangedModal.classList.remove("show");
}

function showNotInterestedModal() {
  notInterestedModal.classList.remove(HIDDEN);
}

function hideNotInterestedModal() {
  notInterestedModal.classList.add(HIDDEN);
}

showNotInterestedModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    hideInterestSliderDropdown();
    showNotInterestedModal();
  });
});

notInterestedModal.addEventListener("click", (e) => {
  if (e.target.id === "notInterestedModal") return hideNotInterestedModal();
});
manualCloseNotInterested.addEventListener("click", hideNotInterestedModal);
submitInteretedButton.addEventListener("click", hideNotInterestedModal);

/**
 *
 *
 *
 *
 *
 *
 * Tell us why not interested :)
 *
 *
 *
 *
 *
 */
const whyNotInterestedModal = document.getElementById("whyNotInterestedModal");
const hideWhyNotInterestedModal = document.getElementById("hideWhyNotInterestedModal");

whyNotInterestedModal.addEventListener("click", (e) => {
  if (e.target.id === "whyNotInterestedModal") return hideWhyNotInterestedModalFn();
});

hideWhyNotInterestedModal.addEventListener("click", hideWhyNotInterestedModalFn);

function showWhyNotInterestedModal() {
  whyNotInterestedModal.classList.remove(HIDDEN);
}

function hideWhyNotInterestedModalFn() {
  whyNotInterestedModal.classList.add(HIDDEN);
}
