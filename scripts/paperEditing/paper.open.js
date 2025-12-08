const openDocumentInput = document.getElementById("open_document_input");

document.addEventListener("DOMContentLoaded", () => {
  const sizemugOpenBtn = document.getElementById("sizemug_open--btn");
  const openDocumentElement = document.querySelector(".open_document_element");

  // Initialize PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  [openDocumentElement, sizemugOpenBtn].forEach((button) => {
    button.addEventListener("click", () => {
      readDocumentInto();
      closeDropdownBar(); // close all dropdown
    });
  });

  // Handle documents selection
  openDocumentInput.addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let content = "";
      const filenameIncludeExt = file.name.split(".");
      const fileExtension = filenameIncludeExt.at(-1).toLowerCase();
      handleSaveFileRename(filenameIncludeExt.at(0)); // function in rename.modal.js

      switch (fileExtension) {
        case "docx":
          content = await handleDocx(file);
          break;
        case "pdf":
          content = await handlePdf(file);
          break;
        case "txt":
          content = await handleTxt(file);
          break;
        default:
          throw new Error("Unsupported file format");
      }

      // Insert content into Quill editor
      focusedEditor.setText(""); // Clear existing content
      focusedEditor.clipboard.dangerouslyPasteHTML(0, content);
    } catch (error) {
      console.error("Error importing file:", error);
      alert("Error importing file: " + error.message);
    }
  });

  // Handle DOCX files
  async function handleDocx(file) {
    const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }

  // Handle PDF files
  async function handlePdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let content = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      content += textContent.items.map((item) => item.str).join(" ") + "\n\n";
    }

    return content;
  }

  // Handle TXT files
  async function handleTxt(file) {
    const text = await file.text();
    return text.replace(/\n/g, "<br>");
  }
});

function readDocumentInto() {
  openDocumentInput.click();
}
