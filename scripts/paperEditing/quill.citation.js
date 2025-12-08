document.addEventListener("DOMContentLoaded", () => {
  const citationModal = document.getElementById("citation_modal");
  const sizemugCitationBtn = document.getElementById("sizemug_citation--btn");
  const citationDocumentElement = document.querySelector(".citation_document_element");
  const cancelCitationModal = document.getElementById("cancel_citation_modal");
  const saveCitation = document.getElementById("save_citation");
  const referenceInput = document.getElementById("citation_reference");
  const yearInput = document.getElementById("citation_year");

  // Show Citation modal
  const showCitationModal = () => {
    citationModal.classList.remove(HIDDEN);
    if (typeof closeDropdownBar === "function") {
      closeDropdownBar(); // close all dropdown
    }
    // Clear previous values
    referenceInput.value = "";
    yearInput.value = "";
  };

  // Hide Citation modal
  const hideCitationModal = () => {
    citationModal.classList.add(HIDDEN);
  };

  // Citation handler function
  const insertCitation = () => {
    const reference = referenceInput.value.trim();
    const year = yearInput.value.trim();

    if (!reference || !year) {
      console.log("Please fill in both reference and year fields");
      return;
    }

    if (focusedEditor) {
      const range = focusedEditor.getSelection(true);

      if (!range) {
        console.error("No selection range found");
        return;
      }

      try {
        if (range.length > 0) {
          // If text is selected, format it as citation
          focusedEditor.formatText(range.index, range.length, "citation", {
            reference: reference,
            year: year,
          });
        } else {
          // If no text is selected, insert the citation at cursor
          const citationText = `(${reference}, ${year})`;
          focusedEditor.insertText(range.index, citationText, {}, true);
          focusedEditor.formatText(range.index, citationText.length, "citation", {
            reference: reference,
            year: year,
          });
        }

        // Move cursor after the insertion
        focusedEditor.setSelection(range.index + (range.length || 1));
        hideCitationModal();
      } catch (error) {
        console.error("Error inserting citation:", error);
      }
    } else {
      console.error("No focused editor found");
    }
  };

  // Event Listeners
  if (sizemugCitationBtn) {
    sizemugCitationBtn.addEventListener("click", showCitationModal);
  }

  if (citationDocumentElement) {
    citationDocumentElement.addEventListener("click", showCitationModal);
  }

  if (cancelCitationModal) {
    cancelCitationModal.addEventListener("click", hideCitationModal);
  }

  if (saveCitation) {
    saveCitation.addEventListener("click", insertCitation);
  }

  // Add tooltip on hover for citations
  if (typeof paperEditors !== "undefined" && Array.isArray(paperEditors)) {
    paperEditors.forEach((editor) => {
      if (editor && editor.container) {
        editor.container.addEventListener("mouseover", (e) => {
          const citation = e.target.closest(".citation");
          if (citation) {
            const reference = citation.getAttribute("data-citation");
            const year = citation.getAttribute("data-year");
            citation.title = `${reference} (${year})`;
          }
        });
      }
    });
  }

  // Close modal when clicking outside
  citationModal.addEventListener("click", (e) => {
    if (e.target === citationModal) {
      hideCitationModal();
    }
  });
});
