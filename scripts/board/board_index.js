"use strict";

const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><g fill="none" stroke="#222222"><path d="M4.5 13.5c0-1.886 0-2.828.586-3.414S6.614 9.5 8.5 9.5h7c1.886 0 2.828 0 3.414.586s.586 1.528.586 3.414v1c0 2.828 0 4.243-.879 5.121c-.878.879-2.293.879-5.121.879h-3c-2.828 0-4.243 0-5.121-.879C4.5 18.743 4.5 17.328 4.5 14.5z"/><path stroke-linecap="round" d="M16.5 9.5V8A4.5 4.5 0 0 0 12 3.5v0A4.5 4.5 0 0 0 7.5 8v1.5"/></g></svg>`;
const unlockSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><path stroke="white" d="M4 13c0-1.885 0-2.828.586-3.414S6.114 9 8 9h8c1.886 0 2.828 0 3.414.586S20 11.115 20 13v2c0 2.829 0 4.243-.879 5.122C18.243 21 16.828 21 14 21h-4c-2.828 0-4.243 0-5.121-.878C4 19.242 4 17.829 4 15z" /><path stroke="white" stroke-linecap="round" d="m16.5 9l.078-.62a5.52 5.52 0 0 0-2.41-5.273v0a5.52 5.52 0 0 0-6.68.416l-.818.709" /></g></svg>`;
const deleteSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="none" stroke="#F43F5E" stroke-linecap="round" d="M9.5 14.5v-3m5 3v-3M3 6.5h18v0c-1.404 0-2.107 0-2.611.337a2 2 0 0 0-.552.552C17.5 7.893 17.5 8.596 17.5 10v5.5c0 1.886 0 2.828-.586 3.414s-1.528.586-3.414.586h-3c-1.886 0-2.828 0-3.414-.586S6.5 17.386 6.5 15.5V10c0-1.404 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C5.107 6.5 4.404 6.5 3 6.5zm6.5-3s.5-1 2.5-1s2.5 1 2.5 1"/></svg>`;
const commentSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="none" stroke="#222222" stroke-width="1.5" d="M3 20.29V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7.961a2 2 0 0 0-1.561.75l-2.331 2.914A.6.6 0 0 1 3 20.29Z" /></svg>`;
const moveSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#000" d="M8.464 6.707a1 1 0 0 1 0-1.414l2.758-2.758a1.1 1.1 0 0 1 1.556 0l2.757 2.758a1 1 0 1 1-1.414 1.414L13 5.586V11h5.414l-1.121-1.121a1 1 0 0 1 1.414-1.415l2.758 2.758a1.1 1.1 0 0 1 0 1.556l-2.758 2.758a1 1 0 0 1-1.414-1.415L18.414 13H13v5.414l1.121-1.121a1 1 0 0 1 1.414 1.414l-2.757 2.758a1.1 1.1 0 0 1-1.556 0l-2.758-2.758a1 1 0 1 1 1.415-1.414l1.12 1.121V13H5.587l1.121 1.121a1 1 0 1 1-1.414 1.415l-2.758-2.758a1.1 1.1 0 0 1 0-1.556l2.758-2.758A1 1 0 0 1 6.707 9.88L5.586 11H11V5.587l-1.121 1.12a1 1 0 0 1-1.415 0"/></g></svg>`;

// Cursor Initialization

// Responsible for create wrapper element. Also takes in an array of className(s)
function createWrapperEl(className) {
  const wrapper = document.createElement("div");
  wrapper.classList.add(...className);
  return wrapper;
}

// Interactjs Handler for Resizing: Note/Text/Shape
function handleResize() {
  return {
    edges: {
      top: ".resize-top-left, .resize-top-right",
      left: ".resize-top-left, .resize-bottom-left",
      bottom: ".resize-bottom-left, .resize-bottom-right",
      right: ".resize-top-right, .resize-bottom-right",
    },
    listeners: {
      move(event) {
        const target = event.target;
        const lockedState = target.getAttribute("data-locked");

        // Only Resize the container if it has not been locked
        if (lockedState !== "true") {
          let x = parseFloat(target.getAttribute("data-x")) || 0;
          let y = parseFloat(target.getAttribute("data-y")) || 0;

          // Update element's dimensions
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";

          // Translate element
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          target.style.transform = `translate(${x}px, ${y}px)`;

          // Save the position for later use
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      },
    },
    modifiers: [
      interact.modifiers.restrictEdges({
        outer: "parent",
      }),
      interact.modifiers.restrictSize({
        min: { width: 50, height: 20 },
      }),
    ],
    inertia: true,
  };
}

// Handler for editor text transform
function handleEditorTextTransform(contenteditable, button, status) {
  if (status === "lowercase") {
    contenteditable.style.textTransform = "uppercase";
    button.setAttribute("data-transform", "uppercase");
  } else {
    contenteditable.style.textTransform = "lowercase";
    button.setAttribute("data-transform", "lowercase");
  }
}

// Function that handles the RESIZE buttons creation and takes in an array of className(s)
function createResizeButton(className) {
  const button = document.createElement("button");
  button.classList.add(...className);
  return button;
}

// Logout Event
const boardLogoutBtn = document.querySelector(".logout_overlay button");

boardLogoutBtn.addEventListener("click", function () {
  window.location.href = "/board.html";
});

const sizemugBoardLogo = document.querySelectorAll("#whiteboard_sizemug_logo");
sizemugBoardLogo.forEach((btn) =>
  btn.addEventListener("click", function () {
    window.location.href = "/dashboard.html";
  })
);
