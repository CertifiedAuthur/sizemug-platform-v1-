const documentPreviewName = document.getElementById("documentPreviewName");
const closeSendUserDocumentModalBtn = document.getElementById("closeSendUserDocumentModalBtn");
const documentPreviewModal = document.getElementById("documentPreviewModal");
const uploadNewDocumentToChatBtns = document.querySelectorAll(".uploadNewDocumentToChat");
const documentSpacerPreview = document.getElementById("documentSpacerPreview");
const documentPreviewHeader = document.getElementById("documentPreviewHeader");
const sendDocumentFromPreview = document.getElementById("sendDocumentFromPreview");

let pdfDoc = null;
const scale = 1.5;

/*** Creates an input element of type "file" for uploading documents. */
uploadNewDocumentToChatBtns.forEach((button) => {
  button.addEventListener("click", (e) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.click();

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      // Hide after ensuring everything works
      hideAdditionalChatModalContainer();

      if (file.type === "application/pdf") {
        const fileReader = new FileReader();
        fileReader.onload = async function () {
          pdfDoc = await pdfjsLib.getDocument(fileReader.result).promise;
          const totalPages = pdfDoc.numPages;
          documentPreviewName.textContent = `${file.name} - ${totalPages} pages`;

          // Clear any previous content
          documentSpacerPreview.innerHTML = "";

          // Render all pages
          for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
            renderPage(pageNumber, file);
          }
        };
        fileReader.readAsArrayBuffer(file);
      } else {
        alert("Please upload a valid PDF file.");
      }

      // Clean up the file input
      fileInput.remove();
    });
  });
});

// Close the modal and hide the preview
function renderPage(pageNumber, file) {
  pdfDoc.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale });

    // Create a container for each page
    const pageContainer = document.createElement("div");
    pageContainer.classList.add("document_preview_page_container");

    // Create a canvas for each page
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.className = "documentPreviewCanvas";

    // Add some styling to make pages look better
    canvas.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
    canvas.style.border = "1px solid #e0e0e0";
    canvas.style.borderRadius = "4px";
    canvas.style.maxWidth = "100%"; // Responsive sizing
    canvas.style.height = "auto";

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Add page number indicator
    const pageIndicator = document.createElement("div");
    pageIndicator.textContent = `Page ${pageNumber}`;
    pageIndicator.style.textAlign = "center";
    pageIndicator.style.fontSize = "12px";
    pageIndicator.style.color = "#666";
    pageIndicator.style.marginBottom = "1rem";
    pageIndicator.style.fontWeight = "500";

    // Render the page onto the canvas
    page
      .render({
        canvasContext: context,
        viewport: viewport,
      })
      .promise.then(() => {
        // If this is the first page, capture the thumbnail
        if (pageNumber === 1) {
          const canvasThumbnail = canvas.toDataURL("image/png");

          previewDocumentInfo = {
            size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`, // Convert to MB for larger files
            thumbnail: canvasThumbnail,
            filename: file.name,
          };
        }
      })
      .catch((error) => {
        console.error(`Error rendering page ${pageNumber}:`, error);
        // Add error indicator
        const errorDiv = document.createElement("div");
        errorDiv.textContent = `Error loading page ${pageNumber}`;
        errorDiv.style.color = "red";
        errorDiv.style.textAlign = "center";
        errorDiv.style.padding = "20px";
        pageContainer.appendChild(errorDiv);
      });

    // Append page indicator and canvas to the container
    pageContainer.appendChild(pageIndicator);
    pageContainer.appendChild(canvas);

    // Append the page container to the preview container
    documentSpacerPreview.appendChild(pageContainer);

    // Show Document preview Modal (only once, after first page)
    if (pageNumber === 1) {
      showDocumentPreviewModal();
    }
  });
}

closeSendUserDocumentModalBtn.addEventListener("click", hideDocumentPreviewModal);

// Listening for scroll event
documentSpacerPreview.addEventListener("scroll", function () {
  if (this.scrollTop > 0) {
    documentPreviewHeader.classList.add("active");
  } else {
    documentPreviewHeader.classList.remove("active");
  }
});

function showDocumentPreviewModal() {
  documentPreviewModal.classList.remove(HIDDEN);
  sendDocumentImageVideo.setAttribute("data-type", "document");

  hideEmojiTasksAdditionalButtons();
}

function hideDocumentPreviewModal() {
  documentPreviewModal.classList.add(HIDDEN);
  sendDocumentImageVideo.removeAttribute("data-type");

  showEmojiTasksAdditionalButtons();
}

/**
 *
 *
 *
 * SEND DOCUMENT :)
 *
 *
 *
 */

sendDocumentFromPreview.addEventListener("click", () => {
  if (currentOpenedUser) {
    const currentUserChats = chatMessages.find((msg) => msg.userId === currentOpenedUser.id);
    console.log(currentOpenedUser);

    const newDocument = {
      sender_id: USERID,
      receiver_id: Number(`${Math.random()}`.split(".").at(-1)),
      message_id: Number(`${Math.random()}`.split(".").at(-1)),
      type: "document",
      photos: ["https://images.unsplash.com/photo-1513097847644-f00cfe868607?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHN0eWxpc2glMjB3b21hbiUyMGltYWdlfGVufDB8fDB8fHww"],
      videoURL: null,
      message: {
        // text: "Check this out",
      },
      document: {
        filename: "Sizemug.pdf",
        size: "342 KB",
        thumbnail: "/assets/images/document-preview.png",
        type: "pdf",
      },
      timestamp: "1670001010",
      status: "sent",
      reactions: [],
    };

    currentUserChats.messages.push(newDocument);

    const container = currentOpenedChatContainer.querySelector(".chatting_container_message");

    invalidateChattingMessages(currentUserChats, container);
    hideDocumentPreviewModal();
  }
});
