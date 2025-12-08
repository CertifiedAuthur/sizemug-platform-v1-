// DOM elements for the 'Send Note' modal and its content area
const sendNoteModal = document.getElementById("sendNoteModal");
const sendNoteContentArea = document.getElementById("sendNoteContentArea");
const closeSendNoteModal = document.getElementById("closeSendNoteModal");
const cancelSendModal = document.getElementById("cancelSendModal");

// Event listener to hide the modal when clicking outside its content
sendNoteModal.addEventListener("click", (e) => {
  if (e.target.id === "sendNoteModal") hideSendNoteModal();
});

[closeSendNoteModal, cancelSendModal].forEach((button) => {
  button.addEventListener("click", hideSendNoteModal);
});

// Function to display the 'Send Note' modal
function showSendNoteModal() {
  sendNoteModal.classList.remove(HIDDEN); // Removes the HIDDEN class to make the modal visible
}

// Function to hide the 'Send Note' modal
function hideSendNoteModal() {
  sendNoteModal.classList.add(HIDDEN); // Adds the HIDDEN class to hide the modal
}

// DOM element for the toolbar with note-related tools
const sendNoteTools = document.getElementById("sendNoteTools");

// Event listener to handle toolbar button interactions
sendNoteTools.addEventListener("click", (e) => {
  const button = e.target.closest("button"); // Finds the closest button element

  if (button) {
    if (button.id === "noteBold" || button.id === "noteItalic") return;

    const { container } = button.dataset; // Retrieves the associated container from the button's data attributes
    const isExpanded = button.getAttribute("aria-expanded") === "true"; // Checks if the button is expanded
    const containerEl = document.getElementById(`noteOption${container}`); // Finds the corresponding container element
    const noteOptionContainers = document.querySelectorAll("#noteOptionContainers>div");
    const allButtons = sendNoteTools.querySelectorAll("button");

    if (isExpanded) {
      containerEl?.classList.add(HIDDEN); // Hides the container if it's currently expanded
      button.setAttribute("aria-expanded", false); // Updates the ARIA state to collapsed
    } else {
      // Hide all note option containers and collapse all buttons
      noteOptionContainers?.forEach((cont) => cont.classList.add(HIDDEN));
      allButtons.forEach((btn) => btn.setAttribute("aria-expanded", false));

      containerEl?.classList.remove(HIDDEN); // Shows the container if it's currently collapsed
      button.setAttribute("aria-expanded", true); // Updates the ARIA state to expanded
    }
  }
});

// DOM element for the background color options in the note modal
const noteOptionBackgroundColor = document.getElementById("noteOptionBackgroundColor");
const noteOptionTextColor = document.getElementById("noteOptionTextColor");

// Event listener to handle background/text color selection
[noteOptionBackgroundColor, noteOptionTextColor].forEach((container) => {
  container.addEventListener("click", function (e) {
    const button = e.target.closest("button"); // Finds the closest button element
    const allColorBtns = this.querySelectorAll("button:not(:last-child)"); // Selects all color buttons except the last one
    const { type } = this.dataset; // color or background

    if (button) {
      const { color } = button.dataset; // Retrieves the selected color from the button's data attributes

      // If the 'custom' color option is selected, do nothing
      if (color === "custom") {
        const colorPickerModal = document.getElementById("colorPickerModal");

        colorPickerModal.classList.remove(HIDDEN);
        colorPickerModal.setAttribute("data-open-with", type);
        return;
      }

      // Updates the selection state for all color buttons
      allColorBtns.forEach((btn) => btn.setAttribute("aria-selected", false)); // Deselects all color buttons
      button.setAttribute("aria-selected", true); // Marks the clicked button as selected
      sendNoteContentArea.style[type] = color; // Updates the background color of the content area
    }
  });
});

// DOM element for the font family options in the note modal
const noteOptionFontFamily = document.getElementById("noteOptionFontFamily");

noteOptionFontFamily.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  const { fontType } = button.dataset;

  const allFontFamilyBtns = this.querySelectorAll("button"); // Selects all buttons

  if (button) {
    allFontFamilyBtns.forEach((btn) => btn.setAttribute("aria-selected", false)); // Deselects all buttons
    button.setAttribute("aria-selected", true);

    if (fontType === "manrope") {
      sendNoteContentArea.style.fontFamily = '"Manrope", serif';
    } else if (fontType === "montserrat") {
      sendNoteContentArea.style.fontFamily = '"Montserrat", serif';
    } else if (fontType === "mulish") {
      sendNoteContentArea.style.fontFamily = '"Mulish", serif';
    } else if (fontType === "nunito") {
      sendNoteContentArea.style.fontFamily = '"Nunito", serif';
    } else if (fontType === "open-sans") {
      sendNoteContentArea.style.fontFamily = '"Open Sans", serif';
    } else if (fontType === "roboto") {
      sendNoteContentArea.style.fontFamily = '"Roboto", serif';
    } else if (fontType === "poppins") {
      sendNoteContentArea.style.fontFamily = '"Poppins", serif';
    } else if (fontType === "inter") {
      sendNoteContentArea.style.fontFamily = '"Inter", serif';
    } else if (fontType === "urbanist") {
      sendNoteContentArea.style.fontFamily = '"Urbanist", serif';
    } else if (fontType === "outfit") {
      sendNoteContentArea.style.fontFamily = '"Outfit", serif';
    } else if (fontType === "arial") {
      sendNoteContentArea.style.fontFamily = "Arial";
      //     } else if (fontType === "calibri") {
      //       sendNoteContentArea.style.fontFamily = '"Montserrat", serif';
      //     } else if (fontType === "cambria") {
      //       sendNoteContentArea.style.fontFamily = '"Montserrat", serif';
    } else if (fontType === "epilogue") {
      sendNoteContentArea.style.fontFamily = '"Epilogue", serif';
    }
  }
});

// DOM element for the font size options in the note modal
const noteOptionTextSize = document.getElementById("noteOptionTextSize");

noteOptionTextSize.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  const { fontSize } = button.dataset;

  const allFontSizeBtns = this.querySelectorAll("button"); // Selects all buttons

  if (button) {
    allFontSizeBtns.forEach((btn) => btn.setAttribute("aria-selected", false)); // Deselects all buttons
    button.setAttribute("aria-selected", true);

    sendNoteContentArea.style.fontSize = `${fontSize}px`;
  }
});

document.getElementById("noteBold").addEventListener("click", function () {
  const isSelected = this.getAttribute("aria-selected") === "true"; // Checks if the button is selected

  if (isSelected) {
    this.setAttribute("aria-selected", false); // Updates the ARIA state to selected
    sendNoteContentArea.style.fontWeight = "initial";
  } else {
    this.setAttribute("aria-selected", true); // Updates the ARIA state to selected
    sendNoteContentArea.style.fontWeight = "bold";
  }
});

document.getElementById("noteItalic").addEventListener("click", function () {
  const isSelected = this.getAttribute("aria-selected") === "true"; // Checks if the button is selected

  if (isSelected) {
    this.setAttribute("aria-selected", false); // Updates the ARIA state to selected
    sendNoteContentArea.style.fontStyle = "initial";
  } else {
    this.setAttribute("aria-selected", true); // Updates the ARIA state to selected
    sendNoteContentArea.style.fontStyle = "italic";
  }
});

// DOM element for the font size options in the note modal
const noteOptionLists = document.getElementById("noteOptionLists");

noteOptionLists.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  const allListBtns = this.querySelectorAll("button"); // Selects all buttons

  if (button) {
    if (button.getAttribute("aria-selected") === "true") {
      button.setAttribute("aria-selected", false);

      sendNoteContentArea.style.justifyContent = "center";
      sendNoteContentArea.style.alignItems = "center";
      sendNoteContentArea.style.textAlign = "center";
    } else {
      allListBtns.forEach((btn) => btn.setAttribute("aria-selected", false)); // Deselects all buttons
      button.setAttribute("aria-selected", true);

      sendNoteContentArea.style.justifyContent = "initial";
      sendNoteContentArea.style.alignItems = "initial";
      sendNoteContentArea.style.textAlign = "initial";
    }
  }
});
