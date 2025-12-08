const downloadDocModal = document.getElementById("download_doc_modal");

document.addEventListener("DOMContentLoaded", () => {
  const downloadFormatContainer = document.getElementById("download_format");
  const sizemugDownloadBtn = document.getElementById("sizemug_download--btn");
  const downloadDocumentAction = document.getElementById("downloadDocumentAction");
  const hideDownloadModal = document.getElementById("hideDownloadModal");
  const downloadDocumentElements = document.querySelectorAll(".download_document_element");
  const mobileHideDownloadModalBtn = document.getElementById("mobileHideDownloadModalBtn");

  let fileSelected;

  downloadFormatContainer.addEventListener("click", function (e) {
    const button = e.target.closest("button");

    if (button) {
      const { type } = button.dataset;
      const allButtons = this.querySelectorAll("button");

      allButtons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");

      downloadDocumentAction.setAttribute("aria-disabled", "false");
      downloadDocumentAction.disabled = false;

      if (type === "pdf") fileSelected = "PDF";
      if (type === "doc") fileSelected = "DOC";
      if (type === "text") fileSelected = "TXT";
    }
  });

  [...downloadDocumentElements, sizemugDownloadBtn].forEach((button) => {
    button.addEventListener("click", () => {
      showDownloadDocModal();
      closeDropdownBar(); // close all dropdown
    });
  });
  hideDownloadModal.addEventListener("click", hideDownloadDocModal);
  mobileHideDownloadModalBtn.addEventListener("click", hideDownloadDocModal);

  downloadDocumentAction.addEventListener("click", () => {
    if (!fileSelected) return;

    // TXT selected
    if (fileSelected === "TXT") downloadDocumentAsTXT();

    // DOC selected
    if (fileSelected === "DOC") downloadDocumentAsWord();

    // PDF selected
    if (fileSelected === "PDF") downloadDocumentAsPDF();

    fileSelected = "";
    hideDownloadDocModal();
  });
});

function showDownloadDocModal() {
  downloadDocModal.classList.remove(HIDDEN);
}

function hideDownloadDocModal() {
  downloadDocModal.classList.add(HIDDEN);
}

//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
// Download as PDF
async function downloadDocumentAsPDF() {
  // Create a new div with the content
  const content = document.createElement("div");
  content.innerHTML = focusedEditor.root.innerHTML;
  content.style.padding = "20px";

  const filename = getFilename("pdf");

  // Configuration for PDF
  const opt = {
    margin: [10, 10],
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  try {
    await html2pdf().from(content).set(opt).save();
    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
}

// Download as DOCX
function downloadDocumentAsWord() {
  // Get the HTML content
  const content = focusedEditor.root.innerHTML;

  // Create a simple XML document that Word can open
  const wordContent = `
                <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
                <?mso-application progid="Word.Document"?>
                <w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
                    <w:body>
                        ${content}
                    </w:body>
                </w:wordDocument>
            `;

  // Create blob and download
  const blob = new Blob([wordContent], { type: "application/msword" });
  downloadBlob(blob, "docx");
}

// Download as TXT
function downloadDocumentAsTXT() {
  const text = focusedEditor.getText();
  const blob = new Blob([text], { type: "text/plain" });
  downloadBlob(blob, "txt");
}

// Helper function to download blobs
function downloadBlob(blob, ext) {
  const filename = getFilename(ext);

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Helper function to get filename
function getFilename(ext) {
  const paperTitle = document.getElementById("paper_title");
  const filename = `${paperTitle.textContent.trim()}.${ext.trim()}`;
  return filename;
}
