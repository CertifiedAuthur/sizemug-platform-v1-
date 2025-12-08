let detailInfoStore = {};

function formatDocument(cmd, value = null) {
  if (value) {
    document.execCommand(cmd, false, value);
  } else {
    document.execCommand(cmd);
  }
}

// Form Submission
const bottomPersonalInfo = document.getElementById("bottomPersonalInfo");
bottomPersonalInfo.addEventListener("submit", (e) => {
  e.preventDefault();
});

/******************************* Switch Account Type *******************************/
const switchCurrentUserAccountType = document.getElementById("switchCurrentUserAccountType");
const currentProfile = document.getElementById("currentProfile");
const currentProfileImage = currentProfile.querySelector("img");
const currentProfileContent = currentProfile.querySelector("h5");

// function handleCreatorProfileUpdate() {
//   currentProfile.classList.add("creator-account");
//   currentProfileImage.src = "./images/sizemug.png"; // Creator account image
//   currentProfileContent.textContent = "Creator Account"; // Creator account content

//   localStorage.setItem("user-account-type", "creator-account");

//   switchCurrentUserAccountType.checked = true;
//   document.getElementById("currentProfile").setAttribute("href", "/creator-account-profile.html");
// }

// function handleNormalProfileUpdate() {
//   currentProfile.classList.remove("creator-account");
//   currentProfileImage.src = "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww"; // Personal account
//   currentProfileContent.textContent = "User Account"; // User account content

//   localStorage.setItem("user-account-type", "normal-account");

//   switchCurrentUserAccountType.checked = false;
//   document.getElementById("currentProfile").setAttribute("href", "/account-profile.html");
// }

// function handleOnLoadAccountSettings() {
//   const userAccountType = localStorage.getItem("user-account-type") ?? "normal-account";

//   if (userAccountType === "normal-account") {
//     handleNormalProfileUpdate();
//   } else {
//     handleCreatorProfileUpdate();
//   }
// }
// handleOnLoadAccountSettings();

// switchCurrentUserAccountType.addEventListener("change", function (e) {
//   const accountType = e.target.checked;

//   if (accountType) {
//     handleCreatorProfileUpdate();
//   } else {
//     handleNormalProfileUpdate();
//   }
// });

/*************************************************** Date Picker **********************************************/
/*************************************************** Date Picker **********************************************/
/*************************************************** Date Picker **********************************************/
/*************************************************** Date Picker **********************************************/
// Date Picker
const completedDatePicker = document.getElementById("completedDatePicker");
const dropdownDomElement = document.getElementById("dropdownDomElement");
const formItemBirthdayPicker = document.getElementById("formItemBirthdayPicker");

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

/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
/*************************************************** Gender/Education/Occupation Select ***************************************************/
const formItemContainerDropdown = document.querySelectorAll("#accountDetailForm .form-item-container-dropdown");

formItemContainerDropdown.forEach((container) => {
  container.addEventListener("click", function (e) {
    const selectOptionItem = e.target.closest(".select-option-item");

    if (selectOptionItem) {
      const formItemContainerDropdown = selectOptionItem.closest(".form-item-container-dropdown");
      const formItemContainerDropdownType = formItemContainerDropdown.getAttribute("data-select-type");
      const dropdownDOMElement = formItemContainerDropdown.querySelector(".dropdown-dom-element");
      const selectOptionItemValue = selectOptionItem.getAttribute("data-value");

      dropdownDOMElement.innerText = selectOptionItemValue; // update DOM select
      detailInfoStore[formItemContainerDropdownType] = selectOptionItemValue;
      formItemContainerDropdown.setAttribute("aria-expanded", false); // close dropdown

      return;
    }
  });
});

/*************************************************** New Profile Photo Upload ***************************************************/
/*************************************************** New Profile Photo Upload ***************************************************/
/*************************************************** New Profile Photo Upload ***************************************************/
/*************************************************** New Profile Photo Upload ***************************************************/
/*************************************************** New Profile Photo Upload ***************************************************/
/*************************************************** New Profile Photo Upload ***************************************************/
const profilePhotoLabel = document.getElementById("profilePhotoLabel");
const profileInputFile = document.querySelector('[name="profilePhoto"]');
const profileDropAreaContainer = document.getElementById("profileDropAreaContainer");

profilePhotoLabel.addEventListener("click", () => {
  profileInputFile.click();
});

// Change Images Event
profileInputFile.addEventListener("change", (e) => {
  const file = [...e.target.files][0];

  handleFilesChange(file);
});

// Drag & Drop Event
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  profileDropAreaContainer.addEventListener(eventName, preventDefaults, false);
});

profileDropAreaContainer.addEventListener("dragover", function () {
  this.classList.add("active");
});

profileDropAreaContainer.addEventListener("dragleave", function () {
  this.classList.remove("active");
});

profileDropAreaContainer.addEventListener("drop", drop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function drop(e) {
  const dt = e.dataTransfer;
  const file = [...dt.files][0];

  handleFilesChange(file);
}

// function that handle both drop & drag and select images
function handleFilesChange(file) {
  const readFilesAsBase64 = (file) => {
    if (!file.type.startsWith("image/")) return;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = function () {
        resolve(reader.result); // resolve with the base64 data
      };

      reader.onerror = function () {
        reject(new Error("File reading error"));
      };
    });
  };

  readFilesAsBase64(file).then((base64Images) => {
    document.getElementById("previewProfileDetailPhoto").src = base64Images;
  });
}

/*************************************************** Copy your sizemug URL link ***************************************************/
/*************************************************** Copy your sizemug URL link ***************************************************/
/*************************************************** Copy your sizemug URL link ***************************************************/
/*************************************************** Copy your sizemug URL link ***************************************************/
/*************************************************** Copy your sizemug URL link ***************************************************/
/*************************************************** Copy your sizemug URL link ***************************************************/
const copyUsernameURL = document.getElementById("copyUsernameURL");

copyUsernameURL.addEventListener("click", function () {
  const profileLink = document.getElementById("profile-link"); // Assuming this is an input or has a value
  const textMessage = this.querySelector("span:first-child");

  // Get the value of the profile link
  const inputValue = profileLink.value;

  // Prefix the value with the URL
  const prefixedURL = `https://sizemug.com/${inputValue}`;

  // Copy to clipboard
  navigator.clipboard
    .writeText(prefixedURL)
    .then(() => {
      textMessage.textContent = "Copied";

      setTimeout(() => {
        textMessage.textContent = "Copy link";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy to clipboard:", err);
    });
});
