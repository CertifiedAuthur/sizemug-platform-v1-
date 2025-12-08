const mathSymbols = [
  { symbol: "±", name: "Plus-Minus" },
  { symbol: "×", name: "Multiplication" },
  { symbol: "÷", name: "Division" },
  { symbol: "∑", name: "Summation" },
  { symbol: "∏", name: "Product" },
  { symbol: "√", name: "Square Root" },
  { symbol: "∛", name: "Cube Root" },
  { symbol: "∜", name: "Fourth Root" },
  { symbol: "α", name: "Alpha" },
  { symbol: "β", name: "Beta" },
  { symbol: "γ", name: "Gamma" },
  { symbol: "δ", name: "Delta" },
  { symbol: "ε", name: "Epsilon" },
  { symbol: "θ", name: "Theta" },
  { symbol: "λ", name: "Lambda" },
  { symbol: "π", name: "Pi" },
  { symbol: "σ", name: "Sigma" },
  { symbol: "φ", name: "Phi" },
  { symbol: "ω", name: "Omega" },
  { symbol: "≈", name: "Approximately" },
  { symbol: "≠", name: "Not Equal" },
  { symbol: "≡", name: "Identical" },
  { symbol: "≤", name: "Less Than or Equal" },
  { symbol: "≥", name: "Greater Than or Equal" },
  { symbol: "∈", name: "Element Of" },
  { symbol: "∉", name: "Not Element Of" },
  { symbol: "⊂", name: "Subset Of" },
  { symbol: "⊃", name: "Superset Of" },
  { symbol: "∪", name: "Union" },
  { symbol: "∩", name: "Intersection" },
  { symbol: "←", name: "Left Arrow" },
  { symbol: "→", name: "Right Arrow" },
  { symbol: "↑", name: "Up Arrow" },
  { symbol: "↓", name: "Down Arrow" },
  { symbol: "↔", name: "Left Right Arrow" },
  { symbol: "⇒", name: "Double Right Arrow" },
  { symbol: "⇐", name: "Double Left Arrow" },
  { symbol: "⇔", name: "Double Left Right Arrow" },
  { symbol: "∞", name: "Infinity" },
  { symbol: "∂", name: "Partial Derivative" },
  { symbol: "∇", name: "Nabla" },
  { symbol: "∫", name: "Integral" },
  { symbol: "∮", name: "Contour Integral" },
  { symbol: "∀", name: "For All" },
  { symbol: "∃", name: "Exists" },
  { symbol: "∄", name: "Does Not Exist" },
];

let mathSymbolSelected;

const mathSymbolModal = document.getElementById("mathSymbolModal");
const mathSymbolLists = document.getElementById("mathSymbolLists");

document.addEventListener("DOMContentLoaded", () => {
  const mathEquationBtn = document.getElementById("sizemug_equation--btn");
  const hideMathSymbolModalBtn = document.getElementById("cancel_math_symbol_modal");
  const insertMathSymbolBtn = document.getElementById("insert_math_symbol--btn");
  const equationDocumentElement = document.querySelector(".equation_document_element");
  const mobileHideEquationModalBtn = document.getElementById("mobileHideEquationModalBtn");

  [equationDocumentElement, mathEquationBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showMathSymbolModal();
      closeDropdownBar(); // close all dropdown
    });
  });
  hideMathSymbolModalBtn.addEventListener("click", hideMathSymbolModal);
  insertMathSymbolBtn.addEventListener("click", handleInsertMathSymbols);
  mobileHideEquationModalBtn.addEventListener("click", hideMathSymbolModal);
});

function showMathSymbolModal() {
  mathSymbolModal.classList.remove(HIDDEN);
}

function hideMathSymbolModal() {
  mathSymbolModal.classList.add(HIDDEN);
  unSelectedSymbols();
}

function handleInsertMathSymbols() {
  if (mathSymbolSelected && focusedEditor) {
    const range = focusedEditor.getSelection();

    if (range) {
      // Directly use range.index to insert at the cursor position
      const insertPosition = range.index;

      // Insert the symbol at the cursor position
      focusedEditor.insertText(insertPosition, mathSymbolSelected);

      // Move the cursor after the inserted symbol
      focusedEditor.setSelection(insertPosition + mathSymbolSelected.length);
    } else {
      // If no selection, insert at the end of the document
      const length = focusedEditor.getLength();
      focusedEditor.insertText(length - 1, mathSymbolSelected);
      focusedEditor.setSelection(length);
    }

    hideMathSymbolModal();
  }
}

function insertMathSymbols(data) {
  data.map((s) => {
    const markup = `<span aria-selected="false" title="${s.name}" role="button" data-symbol="${s.symbol}">${s.symbol}</span>`;
    mathSymbolLists.insertAdjacentHTML("beforeend", markup);
  });
}
insertMathSymbols(mathSymbols);

mathSymbolLists.addEventListener("click", (e) => {
  const symbolItem = e.target.closest("span");

  if (symbolItem) {
    const { symbol } = symbolItem.dataset;
    unSelectedSymbols();

    if (symbolItem.getAttribute("aria-selected") === "false") {
      symbolItem.classList.add("selected");
      symbolItem.setAttribute("aria-selected", "true");

      mathSymbolSelected = symbol;
    }
  }
});

function unSelectedSymbols() {
  mathSymbolLists.querySelectorAll("span").forEach((el) => {
    el.setAttribute("aria-selected", "false");
    el.classList.remove("selected");
  });
}
