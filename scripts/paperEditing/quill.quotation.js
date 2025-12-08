document.addEventListener("DOMContentLoaded", function () {
  const sizemugQuotationBtn = document.getElementById("sizemug_quotation--btn");
  const quotationDocumentElement = document.querySelector(".quotation_document_element");

  [quotationDocumentElement, sizemugQuotationBtn].forEach((button) => {
    button.addEventListener("click", () => {
      handleBlockQuote();
      closeDropdownBar(); // close all dropdown
    });
  });
});

function handleBlockQuote() {
  const range = focusedEditor.getSelection();

  if (range) {
    const format = focusedEditor?.getFormat(range);
    focusedEditor.format("blockquote", !format.blockquote);
  } else {
    console.log("No text selected for bold.");
  }
}
