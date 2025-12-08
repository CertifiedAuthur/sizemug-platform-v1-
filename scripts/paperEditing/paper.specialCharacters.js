const specialCharacters = [
  { symbol: "©", name: "Copyright" },
  { symbol: "®", name: "Registered Trademark" },
  { symbol: "™", name: "Trademark" },
  { symbol: "¶", name: "Pilcrow" },
  { symbol: "§", name: "Section Sign" },
  { symbol: "•", name: "Bullet" },
  { symbol: "†", name: "Dagger" },
  { symbol: "‡", name: "Double Dagger" },
  { symbol: "¢", name: "Cent" },
  { symbol: "£", name: "Pound Sterling" },
  { symbol: "¥", name: "Yen" },
  { symbol: "€", name: "Euro" },
  { symbol: "¤", name: "Currency Sign" },
  { symbol: "¬", name: "Not Sign" },
  { symbol: "°", name: "Degree" },
  { symbol: "'", name: "Single Quote" },
  { symbol: '"', name: "Double Quote" },
  { symbol: "«", name: "Left Guillemet" },
  { symbol: "»", name: "Right Guillemet" },
  { symbol: "′", name: "Prime" },
  { symbol: "″", name: "Double Prime" },
  { symbol: "‽", name: "Interrobang" },
  { symbol: "¿", name: "Inverted Question Mark" },
  { symbol: "¡", name: "Inverted Exclamation Mark" },
  { symbol: "¯", name: "Macron" },
  { symbol: "~", name: "Tilde" },
  { symbol: "‰", name: "Per Mille" },
  { symbol: "‣", name: "Triangular Bullet" },
  { symbol: "‹", name: "Single Left Angle Quotation" },
  { symbol: "›", name: "Single Right Angle Quotation" },
  { symbol: "…", name: "Ellipsis" },
  { symbol: "—", name: "Em Dash" },
  { symbol: "–", name: "En Dash" },
  { symbol: "‐", name: "Hyphen" },
];

const specialCharactersModal = document.getElementById("specialCharactersModal");
const specialCharactersList = document.getElementById("specialCharactersList");
let specialSymbolSelected;

document.addEventListener("DOMContentLoaded", () => {
  const specialCharactersBtn = document.getElementById("sizemug_special_characters--btn");
  const hideSpecialCharactersBtn = document.getElementById("cancel_special_characters_modal");
  const insertSpecialCharactersBtn = document.getElementById("insert_special_characters--btn");
  const specialCharactersDocumentElement = document.querySelector(".specialCharacters_document_element");
  const mobileHideSpecialCharatersModalBtn = document.getElementById("mobileHideSpecialCharatersModalBtn");

  [specialCharactersDocumentElement, specialCharactersBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showSpecialCharactersModal();
      closeDropdownBar(); // close all dropdown
    });
  });
  hideSpecialCharactersBtn.addEventListener("click", hideSpecialCharactersModal);
  insertSpecialCharactersBtn.addEventListener("click", handleInsertSpecialCharacters);
  mobileHideSpecialCharatersModalBtn.addEventListener("click", hideSpecialCharactersModal);
});

function showSpecialCharactersModal() {
  specialCharactersModal.classList.remove(HIDDEN);
}

function hideSpecialCharactersModal() {
  specialCharactersModal.classList.add(HIDDEN);
  unSelectedSpecialCharactersSymbols();
}

function handleInsertSpecialCharacters() {
  if (specialSymbolSelected && focusedEditor) {
    const range = focusedEditor.getSelection();

    if (range) {
      // Directly use range.index to insert at the cursor position
      const insertPosition = range.index;

      // Insert the symbol at the cursor position
      focusedEditor.insertText(insertPosition, specialSymbolSelected);

      // Move the cursor after the inserted symbol
      focusedEditor.setSelection(insertPosition + specialSymbolSelected.length);
    } else {
      // If no selection, insert at the end of the document
      const length = focusedEditor.getLength();
      focusedEditor.insertText(length - 1, specialSymbolSelected);
      focusedEditor.setSelection(length);
    }

    hideSpecialCharactersModal();
  }
}

function insertSpecialCharacters(data) {
  data.map((s) => {
    const markup = `<span aria-selected="false" title="${s.name}" role="button" data-symbol="${s.symbol}">${s.symbol}</span>`;
    specialCharactersList.insertAdjacentHTML("beforeend", markup);
  });
}
insertSpecialCharacters(specialCharacters);

specialCharactersList.addEventListener("click", (e) => {
  const symbolItem = e.target.closest("span");

  if (symbolItem) {
    const { symbol } = symbolItem.dataset;
    unSelectedSpecialCharactersSymbols();

    if (symbolItem.getAttribute("aria-selected") === "false") {
      symbolItem.classList.add("selected");
      symbolItem.setAttribute("aria-selected", "true");

      specialSymbolSelected = symbol;
    }
  }
});

function unSelectedSpecialCharactersSymbols() {
  specialCharactersList.querySelectorAll("span").forEach((el) => {
    el.setAttribute("aria-selected", "false");
    el.classList.remove("selected");
  });
}
