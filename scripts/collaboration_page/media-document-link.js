const uploadDocument = document.getElementById("documentInput");
const uploadMedia = document.getElementById("mediaInput");

const initialWidth = 200; // in pixels
const initialHeight = 150; // in pixels

function uploadMediaDocumentHandler(event) {
  const files = event.target.files;
  const filesArray = [...files];

  const uploadFileContainer = document.querySelector(".display_bars .upload_styling");

  uploadFileContainer.classList.add(PAGEHIDDEN);

  filesArray.forEach((file) => {
    const fileURL = URL.createObjectURL(file);
    const previewContainer = document.createElement("div");
    previewContainer.className = "preview-container";
    previewContainer.style.width = `${initialWidth}px`;
    previewContainer.style.height = `${initialHeight}px`;
    previewContainer.style.position = "absolute";
    previewContainer.style.left = "50%";
    previewContainer.style.top = "50%";
    previewContainer.style.transform = "translate(-50%, -50%)";

    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";

    const cancelButton = document.createElement("button"); // Create the cancel button
    cancelButton.className = "cancel_button"; // Add a class for the cancel button
    cancelButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#ffff" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>`; // Set the text content of the cancel button

    const mediaWrapper = document.createElement("div");
    mediaWrapper.className = "media-wrapper";

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.src = fileURL;
      img.style.width = `${initialWidth}px`;
      img.style.height = `${initialHeight}px`;

      mediaWrapper.appendChild(cancelButton);
      mediaWrapper.appendChild(img);
      previewItem.appendChild(mediaWrapper);
    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = fileURL;
      video.controls = true;
      video.style.width = `${initialWidth}px`;
      video.style.height = `${initialHeight}px`;

      mediaWrapper.appendChild(cancelButton);
      mediaWrapper.appendChild(video);
      previewItem.appendChild(mediaWrapper);
    } else if (file.type === "application/pdf") {
      const pdfWrapper = document.createElement("div");
      pdfWrapper.className = "pdf-wrapper";

      const iframe = document.createElement("iframe");
      iframe.src = fileURL;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.referrerpolicy = "strict-origin-when-cross-origin";
      // iframe.allow =
      //   "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.style.width = "100%";
      iframe.style.height = "100%";

      pdfWrapper.appendChild(iframe);
      pdfWrapper.appendChild(cancelButton);
      previewItem.appendChild(pdfWrapper);

      // Add move buttons
      const moveButtonLeft = document.createElement("div");
      moveButtonLeft.className = "move-button left hidden-page";
      moveButtonLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

      const moveButtonRight = document.createElement("div");
      moveButtonRight.className = "move-button right hidden-page";
      moveButtonRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

      const moveButtonTop = document.createElement("div");
      moveButtonTop.className = "move-button top hidden-page";
      moveButtonTop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

      const moveButtonBottom = document.createElement("div");
      moveButtonBottom.className = "move-button bottom hidden-page";
      moveButtonBottom.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

      // Add resize buttons
      const resizeButtonTopLeft = document.createElement("div");
      resizeButtonTopLeft.className = "resize-button topleft hidden-page";
      resizeButtonTopLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

      const resizeButtonTopRight = document.createElement("div");
      resizeButtonTopRight.className = "resize-button topright hidden-page";
      resizeButtonTopRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

      const resizeButtonBottomLeft = document.createElement("div");
      resizeButtonBottomLeft.className = "resize-button bottomleft hidden-page";
      resizeButtonBottomLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

      const resizeButtonBottomRight = document.createElement("div");
      resizeButtonBottomRight.className = "resize-button bottomright hidden-page";
      resizeButtonBottomRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

      const cancelPDFButton = document.createElement("button");
      cancelPDFButton.classList.add("cancel_frame", "top", "hidden-page");
      cancelPDFButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="#ffff" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>`; // Set the text content of the cancel button

      cancelPDFButton.addEventListener("click", function () {
        containerCollaboration.removeChild(previewContainer);
      });

      previewContainer.appendChild(cancelPDFButton);
      previewContainer.appendChild(moveButtonLeft);
      previewContainer.appendChild(moveButtonRight);
      previewContainer.appendChild(moveButtonTop);
      previewContainer.appendChild(moveButtonBottom);
      previewContainer.appendChild(resizeButtonTopLeft);
      previewContainer.appendChild(resizeButtonTopRight);
      previewContainer.appendChild(resizeButtonBottomLeft);
      previewContainer.appendChild(resizeButtonBottomRight);

      // Create an overlay element
      const overlay = document.createElement("div");
      overlay.className = "pdf_overlay";
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = "10";
      overlay.style.cursor = "pointer";

      // Add click event listener to the overlay
      overlay.addEventListener("click", () => {
        moveButtonTop.classList.remove(PAGEHIDDEN);
        moveButtonBottom.classList.remove(PAGEHIDDEN);
        moveButtonLeft.classList.remove(PAGEHIDDEN);
        moveButtonRight.classList.remove(PAGEHIDDEN);

        resizeButtonBottomLeft.classList.remove(PAGEHIDDEN);
        resizeButtonBottomRight.classList.remove(PAGEHIDDEN);
        resizeButtonTopLeft.classList.remove(PAGEHIDDEN);
        resizeButtonTopRight.classList.remove(PAGEHIDDEN);
        cancelPDFButton.classList.remove(PAGEHIDDEN);

        overlay.classList.add(PAGEHIDDEN);
      });

      // handle document click here...
      document.addEventListener("click", function (event) {
        if (!event.target.closest(".pdf_overlay")) {
          overlay.classList.remove(PAGEHIDDEN);

          moveButtonTop.classList.add(PAGEHIDDEN);
          moveButtonBottom.classList.add(PAGEHIDDEN);
          moveButtonLeft.classList.add(PAGEHIDDEN);
          moveButtonRight.classList.add(PAGEHIDDEN);

          resizeButtonBottomLeft.classList.add(PAGEHIDDEN);
          resizeButtonBottomRight.classList.add(PAGEHIDDEN);
          resizeButtonTopLeft.classList.add(PAGEHIDDEN);
          resizeButtonTopRight.classList.add(PAGEHIDDEN);
          cancelPDFButton.classList.add(PAGEHIDDEN);
        }
      });

      pdfWrapper.appendChild(overlay);
    }

    previewContainer.appendChild(previewItem);
    containerCollaboration.appendChild(previewContainer);

    // Apply Interact.js to make the preview container draggable with move buttons
    interact(previewContainer).draggable({
      listeners: {
        move(event) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    });

    // Apply Interact.js to make the preview container resizable with resize buttons
    const topResizeConfig = {
      listeners: {
        move(event) {
          const target = previewContainer;
          let width = parseFloat(target.style.width) - event.dx;
          let height = parseFloat(target.style.height) - event.dy;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        },
      },
    };

    interact(".resize-button.topleft").draggable(topResizeConfig);
    interact(".resize-button.topright").draggable(topResizeConfig);

    interact(".resize-button.bottomleft").draggable({
      listeners: {
        move(event) {
          const target = previewContainer;
          let width = parseFloat(target.style.width) - event.dx;
          let height = parseFloat(target.style.height) + event.dy;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          target.style.transform = `translate(${x}px, ${target.getAttribute("data-y")}px)`;
          target.setAttribute("data-x", x);
        },
      },
    });

    interact(".resize-button.bottomright").draggable({
      listeners: {
        move(event) {
          const target = previewContainer;
          let width = parseFloat(target.style.width) + event.dx;
          let height = parseFloat(target.style.height) + event.dy;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
        },
      },
    });

    // Add event listener to cancel button to remove the previewContainer
    cancelButton.addEventListener("click", function () {
      previewContainer.remove();
    });
  });
}

uploadDocument.addEventListener("change", uploadMediaDocumentHandler);
uploadMedia.addEventListener("change", uploadMediaDocumentHandler);

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// PREVENT writing on documents
document.querySelectorAll(".preview-container").forEach((preview) => {
  preview.addEventListener("mouseenter", () => {
    containerCollaboration.querySelectorAll('[contenteditable="true"]').forEach((content) => {
      content.setAttribute("contenteditable", "false");
    });
  });

  preview.addEventListener("mouseleave", () => {
    containerCollaboration.querySelectorAll('[contenteditable="true"]').forEach((content) => {
      content.setAttribute("contenteditable", "true");
    });
  });
});

////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////// Link Handlers ///////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
////////////////////////////
const linkBtn = document.querySelector("#create_link--btn");
const modalLinkContainer = document.getElementById("addLinkModal");

linkBtn.addEventListener("click", function () {
  const selection = window.getSelection();
  modalLinkContainer.classList.remove("hidden-page");

  if (!selection.rangeCount) return;

  // Save the selected range
  const range = selection?.getRangeAt(0);
  window.selectedRange = range;

  // Show the modal
});

const linkOkButton = modalLinkContainer.querySelector("button");

linkOkButton.addEventListener("click", function (event) {
  event.preventDefault();

  const text = modalLinkContainer.querySelector('[name="text"]').value;
  const url = modalLinkContainer.querySelector('[name="url"]').value;

  if (!url || !text) return;

  // Hide the modal
  modalLinkContainer.classList.add("hidden-page");

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text; // range.toString();

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
});

containerCollaboration.addEventListener("mouseenter", function () {
  const anchorElements = containerCollaboration.querySelectorAll("a");
  const whiteboardPlayRecordings = collaboratorContainer.querySelectorAll(".text-box");

  // Recording State
  whiteboardPlayRecordings.forEach((recording) => {
    recording.addEventListener("mouseenter", function () {
      containerCollaboration.setAttribute("contenteditable", "false");
      recording.closest(".text-box").setAttribute("contenteditable", "false");
    });

    recording.addEventListener("mouseleave", function () {
      containerCollaboration.setAttribute("contenteditable", "true");
    });
  });

  anchorElements.forEach((anchor) => {
    anchor.addEventListener("mouseenter", function () {
      containerCollaboration.setAttribute("contenteditable", "false");
      anchor.closest(".text-box").setAttribute("contenteditable", "false");
      anchor.target = "_blank";
    });

    anchor.addEventListener("mouseleave", function () {
      anchor.closest(".text-box").setAttribute("contenteditable", "true");
      containerCollaboration.setAttribute("contenteditable", "true");
    });
  });
});

modalLinkContainer.addEventListener("click", (e) => {
  if (e.target.id === "addLinkModal") {
    modalLinkContainer.classList.add(PAGEHIDDEN);
  }
});

////////////////////////////
////// Embed Handler ///////
////////////////////////////
// Starting Point
const embedInitialWidth = 560; // in pixels
const embedInitialHeight = 315; // in pixels
const embedBtn = document.querySelector(".embed.label");
const embedSaveBtn = document.querySelector(".embed-btn.save");
const embedCancelBtn = document.querySelector(".embed-btn.cancel");
const embedContainer = document.querySelector(".collaboration_tool-embed");
const linkContainer = document.querySelector(".collaboration_tool--link");
const embedURL = document.getElementById("embedURL");

embedBtn.addEventListener("click", function () {
  embedContainer.classList.remove("hidden-page");
  linkContainer.classList.add("hidden-page");
  embedURL.focus();
});

embedCancelBtn.addEventListener("click", function () {
  embedContainer.classList.add("hidden-page");
  document.querySelectorAll(".edit_tools .tool").forEach((tool) => tool.classList.remove("edit_tool--active"));
});

embedSaveBtn.addEventListener("click", () => {
  if (!embedURL.value) {
    return alert("Please insert a URL");
  }

  document.querySelectorAll(".edit_tools .tool").forEach((tool) => tool.classList.remove("edit_tool--active"));

  const iframe = document.createElement("iframe");

  function extractVideoId(url) {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/, // Standard URL
      /youtu\.be\/([a-zA-Z0-9_-]+)/, // Shortened URL
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/, // Embed URL
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&/, // Playlist URL
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  function generateEmbedUrl(youtubeUrl) {
    const videoId = extractVideoId(youtubeUrl);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    } else {
      return null;
    }
  }

  function hasContentAfterLastSlash(url) {
    // Create a URL object
    const urlObject = new URL(url);

    // Get the pathname from the URL object
    const path = urlObject.pathname;

    // Check if the path ends with a slash and has content after it
    // const checkLast = path !== "/" && path.trim().length > 1;

    if (path.trim() === "/") {
      return url;
    } else {
      return generateEmbedUrl(url);
    }
  }

  const url = hasContentAfterLastSlash(embedURL.value);

  iframe.src = url;
  // iframe.width = "560";
  // iframe.height = "315";
  iframe.title = "Embedded content";
  iframe.frameBorder = "0";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  iframe.className = "embedded-iframe";

  iframe.onload = () => {
    console.log("Iframe loaded successfully");
  };

  iframe.onerror = () => {
    alert("Error loading the iframe. Please check the URL and try again.");
    return;
  };

  // Create a container for the iframe and buttons
  const previewItem = document.createElement("div");
  previewItem.style.width = `${embedInitialWidth}px`;
  previewItem.style.height = `${embedInitialHeight}px`;
  previewItem.style.position = "absolute";
  previewItem.style.left = "50%";
  previewItem.style.top = "50%";
  previewItem.style.transform = "translate(-50%, -50%)";
  previewItem.className = "preview-item preview-item--youTube";

  // Create and append the close button
  const closeButton = document.createElement("button");
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 36 36"><path fill="#ffff" d="m19.41 18l8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29l-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29l8.29 8.29a1 1 0 0 0 1.41-1.41Z" class="clr-i-outline clr-i-outline-path-1"/><path fill="none" d="M0 0h36v36H0z"/></svg>`;
  closeButton.className = "close-button hidden-page";
  closeButton.onclick = () => previewItem.remove();
  previewItem.appendChild(closeButton);

  // Create and append the move button
  const moveButton = document.createElement("button");
  moveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;
  moveButton.className = "move-button hidden-page";
  previewItem.appendChild(moveButton);

  // Add resize buttons
  const resizeButtonTopLeft = document.createElement("div");
  resizeButtonTopLeft.className = "resize-button topleft hidden-page";
  resizeButtonTopLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonTopRight = document.createElement("div");
  resizeButtonTopRight.className = "resize-button topright hidden-page";
  resizeButtonTopRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonBottomLeft = document.createElement("div");
  resizeButtonBottomLeft.className = "resize-button bottomleft hidden-page";
  resizeButtonBottomLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonBottomRight = document.createElement("div");
  resizeButtonBottomRight.className = "resize-button bottomright hidden-page";
  resizeButtonBottomRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  previewItem.appendChild(resizeButtonTopLeft);
  previewItem.appendChild(resizeButtonTopRight);
  previewItem.appendChild(resizeButtonBottomLeft);
  previewItem.appendChild(resizeButtonBottomRight);

  // Create an overlay element
  const overlay = document.createElement("div");
  overlay.className = "pdf_overlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "10";
  overlay.style.cursor = "pointer";

  // Add click event listener to the overlay
  overlay.addEventListener("click", () => {
    overlay.classList.add(PAGEHIDDEN);

    resizeButtonBottomLeft.classList.remove(PAGEHIDDEN);
    resizeButtonBottomRight.classList.remove(PAGEHIDDEN);
    resizeButtonTopLeft.classList.remove(PAGEHIDDEN);
    resizeButtonTopRight.classList.remove(PAGEHIDDEN);
    closeButton.classList.remove(PAGEHIDDEN);
    moveButton.classList.remove(PAGEHIDDEN);
  });

  // handle document click here...
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".pdf_overlay")) {
      overlay.classList.remove(PAGEHIDDEN);

      resizeButtonBottomLeft.classList.add(PAGEHIDDEN);
      resizeButtonBottomRight.classList.add(PAGEHIDDEN);
      resizeButtonTopLeft.classList.add(PAGEHIDDEN);
      resizeButtonTopRight.classList.add(PAGEHIDDEN);
      closeButton.classList.add(PAGEHIDDEN);
      moveButton.classList.add(PAGEHIDDEN);
    }
  });

  // Append the iframe to the container
  previewItem.appendChild(iframe);
  // Append the overlay
  previewItem.appendChild(overlay);
  containerCollaboration.appendChild(previewItem);

  embedURL.value = ""; // clear input field
  embedContainer.classList.add("hidden-page"); // hide the embed container

  // Apply Interact.js to make the preview container resizable with resize buttons
  interact(".resize-button.topleft").draggable({
    listeners: {
      move(event) {
        const target = previewItem;
        let width = parseFloat(target.style.width) - event.dx;
        let height = parseFloat(target.style.height) - event.dy;
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      },
    },
  });

  interact(".resize-button.topright").draggable({
    listeners: {
      move(event) {
        const target = previewItem;
        let width = parseFloat(target.style.width) + event.dx;
        let height = parseFloat(target.style.height) - event.dy;
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        let y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
        target.style.transform = `translate(${target.getAttribute("data-x")}px, ${y}px)`;
        target.setAttribute("data-y", y);
      },
    },
  });

  interact(".resize-button.bottomleft").draggable({
    listeners: {
      move(event) {
        const target = previewItem;
        let width = parseFloat(target.style.width) - event.dx;
        let height = parseFloat(target.style.height) + event.dy;
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
        let x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        target.style.transform = `translate(${x}px, ${target.getAttribute("data-y")}px)`;
        target.setAttribute("data-x", x);
      },
    },
  });

  interact(".resize-button.bottomright").draggable({
    listeners: {
      move(event) {
        const target = previewItem;
        let width = parseFloat(target.style.width) + event.dx;
        let height = parseFloat(target.style.height) + event.dy;
        target.style.width = `${width}px`;
        target.style.height = `${height}px`;
      },
    },
  });

  // Apply Interact.js to make the preview item draggable using the move button
  interact(moveButton).draggable({
    listeners: {
      move(event) {
        const previewItem = event.target.closest(".preview-item");
        let x = (parseFloat(previewItem.getAttribute("data-x")) || 0) + event.dx;
        let y = (parseFloat(previewItem.getAttribute("data-y")) || 0) + event.dy;

        // Update the element's position
        previewItem.style.transform = `translate(${x}px, ${y}px)`;

        // Update the position attributes
        previewItem.setAttribute("data-x", x);
        previewItem.setAttribute("data-y", y);
      },
    },
  });
});
