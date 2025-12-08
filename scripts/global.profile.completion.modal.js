let profileModalCompletionData = {}; // Object to store profile completion data

const profileCompletionModal = document.getElementById("profileCompletionModal");
const profileCompletionMobileCancel = document.getElementById("profileCompletionMobileCancel");
const showProfileCompletionModal = document.querySelectorAll(".show-profile-completion-modal");
const progressBarItems = document.getElementById("progressBarItems");

const firstnameProfileInput = document.getElementById("firstname_profile--input");
const lastnameProfileInput = document.getElementById("lastname_profile--input");
const emailProfileInput = document.getElementById("email_profile--input");
const usernameProfileInput = document.getElementById("username_profile--input");
const websiteLinkProfileInput = document.getElementById("websitelink_profile--input");
const phoneNumberProfileInput = document.getElementById("phonenumber_profile--input");
const locationProfileInput = document.getElementById("location_profile--input");
const completionBio = document.getElementById("completionBio");

// Date Picker
const completedDatePicker = document.getElementById("completedDatePicker");
const dropdownDomElement = document.getElementById("dropdownDomElement");
const formItemBirthdayPicker = document.getElementById("formItemBirthdayPicker");

const educationDOMElement = document.getElementById("educationDOMElement");
const occupationDOMElement = document.getElementById("occupationDOMElement");
const saveProjectCompletionSpinner = document.getElementById("saveProjectCompletionSpinner");

profileCompletionModal.addEventListener("click", (e) => {
  if (e.target.id === "profileCompletionModal") {
    hideProjectCompletionModal();
  }
});

// Show profile completion modal
showProfileCompletionModal.forEach((btn) => {
  btn.addEventListener("click", showProjectCompletionModal);
});
// Show profile completion modal
progressBarItems?.addEventListener("click", (e) => {
  const interests = e.target.closest(".progress_circular_item--interests");

  if (interests) {
    return showInterestsModal();
  }

  const profileProgressItem = e.target.closest(".progress-item");
  if (profileProgressItem) {
    showProjectCompletionModal();
  }
});

profileCompletionMobileCancel.addEventListener("click", () => {
  hideProjectCompletionModal();
});

// Social
document.querySelectorAll(".social-item-holder .progress-item").forEach((button) => {
  button.addEventListener("click", showProjectCompletionModal);
});

// Dropdown outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".form-item-container-dropdown")) {
    document.querySelectorAll(".form-item-container-dropdown").forEach((container) => container.setAttribute("aria-expanded", false));
  }
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
// INPUT CHANGE
function inputAndTextAreaHandler(e, type) {
  if (e.target.value.length > 0) {
    profileModalCompletionData[type] = e.target.value.trim();
  } else {
    delete profileModalCompletionData[type];
  }

  updateProfileCompletionModalProgressBar();
}

// First Name
firstnameProfileInput.addEventListener("input", updateProfileCompletionModalProgressBar);
// Last Name
lastnameProfileInput.addEventListener("input", updateProfileCompletionModalProgressBar);
// Email
emailProfileInput?.addEventListener("input", (e) => {
  profileModalCompletionData = {
    ...profileModalCompletionData,
    email: e.target.value,
  };
});
// Username
usernameProfileInput.addEventListener("input", (e) => {
  profileModalCompletionData = {
    ...profileModalCompletionData,
    username: e.target.value,
  };
});
// Website
websiteLinkProfileInput?.addEventListener("input", (e) => {
  profileModalCompletionData = {
    ...profileModalCompletionData,
    website_link: e.target.value,
  };
});
// Phone number
phoneNumberProfileInput?.addEventListener("input", (e) => {
  profileModalCompletionData = {
    ...profileModalCompletionData,
    phone_number: e.target.value,
  };
});
// Location
locationProfileInput.addEventListener("input", (e) => {
  profileModalCompletionData = {
    ...profileModalCompletionData,
    location: e.target.value,
  };
});

// Bio Textarea Listener
completionBio.addEventListener("input", (e) => {
  inputAndTextAreaHandler(e, "bio");
});

/********** Date Picker **********/
// Date Picker
// Duet setup

const today = getDateHelper(new Date());

// Custom Date Formatter
function getDateHelper(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // update default date value
  setPickerDefaultDate();

  // Update DOM initial setup
  dropdownDomElement.textContent = today;

  // Custom trigger to show date picker
  formItemBirthdayPicker.addEventListener("click", function () {
    completedDatePicker.show();
  });

  // Listen for date changes
  completedDatePicker.addEventListener("duetChange", function (event) {
    const selectedDate = event.detail.value;
    dropdownDomElement.textContent = selectedDate; // update DOM

    profileModalCompletionData["birthyear"] = selectedDate;

    // Delay class removal to allow Duet to complete its cycle
    setTimeout(function () {
      const dateDialog = document.querySelector('[name="completedDatePicker"]').querySelector(".duet-date__dialog");

      if (dateDialog) {
        dateDialog.classList.remove("is-active");
      }
    }, 100); // Adjust the delay as needed
  });
});

// Takes in date argument in format YYYY-MM-DD
function setPickerDefaultDate(date) {
  if (!date) {
    completedDatePicker.value = today;
  } else {
    completedDatePicker.value;
  }
}

/********** Education/Occupation Select *********/
const formItemContainerDropdown = document.querySelectorAll("#profileCompletionForm .form-item-container-dropdown");

formItemContainerDropdown.forEach((container) => {
  // Handle Enter key to trigger click
  container.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      container.click(); // Manually trigger the click event
    }
  });

  container.addEventListener("click", function (e) {
    const selectOptionItem = e.target.closest(".select-option-item");

    if (selectOptionItem) {
      const formItemContainerDropdown = selectOptionItem.closest(".form-item-container-dropdown");
      const formItemContainerDropdownType = formItemContainerDropdown.getAttribute("data-select-type");
      const dropdownDOMElement = formItemContainerDropdown.querySelector(".dropdown-dom-element");
      const selectOptionItemValue = selectOptionItem.getAttribute("data-value");

      dropdownDOMElement.innerText = selectOptionItemValue; // update DOM select
      profileModalCompletionData[formItemContainerDropdownType] = selectOptionItemValue;
      formItemContainerDropdown.setAttribute("aria-expanded", false); // close dropdown

      updateProfileCompletionModalProgressBar();
      return;
    }

    // User want to search
    if (e.target.closest(".form-item-container-dropdown-search")) return;

    // Show and Hide Dropdown
    const formItemContainerDropdown = e.target.closest(".form-item-container-dropdown");
    if (formItemContainerDropdown) {
      const isExpanded = formItemContainerDropdown.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        formItemContainerDropdown.setAttribute("aria-expanded", false);
      } else {
        formItemContainerDropdown.setAttribute("aria-expanded", true);
      }
    }
  });
});

/***
 *
 *
 *
 *
 *
 *
 *
 *
 */
const completedUniversitiesData = ["Harvard University", "Stanford University", "Massachusetts Institute of Technology (MIT)", "University of Oxford", "California Institute of Technology (Caltech)", "University of Cambridge", "Princeton University", "University of Chicago", "Imperial College London", "University of Toronto", "National University of Singapore (NUS)", "University of Melbourne", "University of Tokyo", "ETH Zurich - Swiss Federal Institute of Technology", "University of California, Berkeley (UC Berkeley)"]; // prettier-ignore
const completedOccupationsData = ["Teacher", "Doctor", "Engineer", "Nurse", "Software Developer", "Accountant", "Lawyer", "Police Officer", "Chef", "Construction Worker", "Electrician", "Mechanic", "Scientist", "Pharmacist", "Graphic Designer", "Architect", "Pilot", "Journalist", "Salesperson", "Dentist"];

const completionEducationOption = document.getElementById("completionEducationOption");
const completionOccupationOption = document.getElementById("completionOccupationOption");

function renderCompletionModalSelectOption(container, data) {
  container.innerHTML = "";

  data.forEach((d) => {
    const markup = `<li class="select-option-item" data-value="${d}" tabindex="0" role="button">${d}</li>`;
    container.insertAdjacentHTML("beforeend", markup);
  });
}

renderCompletionModalSelectOption(completionEducationOption, completedUniversitiesData);
renderCompletionModalSelectOption(completionOccupationOption, completedOccupationsData);

/************************* Save Profile Completion Changes ************************/
function delayCompletionSave(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

saveProjectCompletionSpinner.addEventListener("click", async function () {
  const projectCompletionSpinner = this.querySelector(".projectCompletionLoader");

  // Show the spinner
  projectCompletionSpinner.classList.remove(HIDDEN);

  try {
    // Wait for 2 seconds (simulate processing or API call)
    await delayCompletionSave(3000);

    // Hide the spinner
    projectCompletionSpinner.classList.add(HIDDEN);

    // store in LS
    localStorage.setItem(SIZEMUG_USER, JSON.stringify(profileModalCompletionData));

    // update profile view
    updateAccountProfile();

    // hide modal
    hideProjectCompletionModal();
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
/*************************************************/
function showProjectCompletionModal() {
  const emailProfileInput = document.getElementById("email_profile--input");
  const usernameProfileInput = document.getElementById("username_profile--input");
  const websiteLinkProfileInput = document.getElementById("websitelink_profile--input");
  const phoneNumberProfileInput = document.getElementById("phonenumber_profile--input");
  const locationProfileInput = document.getElementById("location_profile--input");

  const user = getDummyUser();

  // User Name
  if (user?.fullName) {
    const [firstName, ...lastName] = user.fullName.split(" ");
    firstnameProfileInput.value = firstName;
    lastnameProfileInput.value = lastName.join(" "); // considering example of name like this (Musa A. Abdulkabir)
  }

  if (user?.birthyear) {
    dropdownDomElement.innerText = user.birthyear;
  }

  if (user?.education) {
    educationDOMElement.innerText = user.education;
  }

  if (user?.occupation) {
    occupationDOMElement.innerText = user.occupation;
  }

  if (user?.bio) {
    completionBio.value = user.bio;
  }

  if (emailProfileInput && user?.email) {
    emailProfileInput.value = user.email;
  }

  if (user?.username) {
    usernameProfileInput.value = user.username;
  }

  if (websiteLinkProfileInput && user?.website_link) {
    websiteLinkProfileInput.value = user.website_link;
  }

  if (phoneNumberProfileInput && user?.phone_number) {
    phoneNumberProfileInput.value = user.phone_number;
  }

  if (user?.location) {
    locationProfileInput.value = user.location;
  }

  profileModalCompletionData = user;
  updateProfileCompletionModalProgressBar();
  profileCompletionModal.classList.remove(HIDDEN);
}

function hideProjectCompletionModal() {
  profileCompletionModal.classList.add(HIDDEN);
}

// Function to update the profile completion modal progress bar
function updateProfileCompletionModalProgressBar() {
  const modalProgressBarTrail = document.getElementById("modalProgressBarTrail"); // Progress bar trail element
  const modalProgressBarValue = document.getElementById("modalProgressBarValue"); // Progress bar value element
  const firstnameProfileInput = document.getElementById("firstname_profile--input"); // First name input element
  const lastnameProfileInput = document.getElementById("lastname_profile--input"); // Last name input element

  // Update profile completion data with full name
  profileModalCompletionData = {
    ...profileModalCompletionData,
    fullName: `${firstnameProfileInput.value.trim()} ${lastnameProfileInput.value.trim()}`.trim(),
  };

  // Filter out the birthyear field and count the filled fields
  const user = getDummyUser();

  let percentage;

  // Calculate the completion percentage
  if (location.pathname === "/creator-account-profile.html") {
    // (-1) minus birthyear prop
    percentage = Math.round((Object.keys(user).filter((prop) => prop !== "birthyear").length / profileDetails.length) * 100);
  } else {
    // (-3) minus website_link/email/phone_number prop
    percentage = Math.round((Object.keys(user).filter((prop) => prop !== "birthyear" && prop !== "website_link" && prop !== "email" && prop !== "phone_number").length / (profileDetails.length - 3)) * 100);
  }

  // Update the progress bar width and value
  modalProgressBarTrail.style.width = `${percentage}%`;
  modalProgressBarValue.innerText = `${percentage}%`;
}
