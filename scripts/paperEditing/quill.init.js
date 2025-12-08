// Initialize Quill with multiple editors
const paperEditors = [];
let currentEditorIndex = 0;
const paperEditor = document.getElementById("editor_paper--wrapper");

function createNewEditor() {
  const wrapper = document.createElement("div");
  wrapper.classList.add("editor-wrapper");
  wrapper.style.position = "relative";

  const container = document.createElement("div");
  container.classList.add("paper", "paper-editor");

  const drawCanvas = document.createElement("canvas");
  drawCanvas.id = "quill-draw-canvas";
  drawCanvas.style.display = "none";

  wrapper.appendChild(container);
  wrapper.appendChild(drawCanvas);
  paperEditor.appendChild(wrapper);

  const editor = new Quill(container, {
    theme: "snow",
    modules: {
      toolbar: {
        container: "#toolbar",
      },
    },
    formats: ["font", "size", "bold", "italic", "underline", "strike", "letterSpacing", "header", "outline", "lineHeight", "color", "highlight", "script", "align", "list", "paragraphSpacing", "indent", "chart", "divider", "link", "shape", "blockquote", "table", "arrow", "custom-image", "citation", "image"],
    placeholder: "Compose something amazing...",
  });

  // Set a fixed height and width for the editor container
  container.style.maxHeight = "900px";
  container.style.minHeight = "900px";
  container.style.maxWidth = "600px";
  container.style.minWidth = "600px";
  container.style.overflow = "hidden";

  paperEditors.push(editor);
  setupEditorListener(editor);

  // Immediately focus new editor when created
  editor?.focus();
  editor?.setSelection(0, 0);

  return editor;
}

// Create initial editor
createNewEditor();

function setupEditorListener(editor) {
  editor?.on("text-change", function (delta, oldContents, source) {
    if (source === "user") {
      const editorElement = editor?.container?.querySelector(".ql-editor");

      // Check if content exceeds container height
      if (editorElement.scrollHeight > editorElement.clientHeight) {
        handleOverflow(editor);
      }
    }
  });
}

function handleOverflow(editor) {
  const editorElement = editor?.container?.querySelector(".ql-editor");
  const currentIndex = paperEditors.indexOf(editor);
  let nextEditor;

  nextEditor = createNewEditor();

  // Get the content that overflows
  const length = editor?.getLength();
  const text = editor?.getText();

  // Find the last paragraph break that fits
  let lastFittingIndex = findLastFittingParagraph(editor);

  if (lastFittingIndex < length - 1) {
    // Get the overflow content
    const overflowText = editor.getText(lastFittingIndex);
    const overflowContent = editor.getContents(lastFittingIndex);

    // Remove overflow content from current editor
    editor.deleteText(lastFittingIndex, length);

    // Insert overflow content at the beginning of next editor
    nextEditor.setContents(overflowContent);

    // Immediately scroll and focus the next editor
    const nextEditorElement = nextEditor.container.parentElement;
    nextEditorElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    // Focus and place cursor at beginning of the next editor immediately
    nextEditor.focus();
    nextEditor.setSelection(0, 0);
  }
}

function findLastFittingParagraph(editor) {
  const editorElement = editor.container.querySelector(".ql-editor");
  let lastFittingIndex = 0;

  // Create a temporary container to measure content
  const temp = document.createElement("div");
  temp.className = "ql-editor";
  Object.assign(temp.style, {
    visibility: "hidden",
    position: "absolute",
    width: editorElement.clientWidth + "px",
    height: "auto",
  });
  document.body.appendChild(temp);

  const tempQuill = new Quill(temp);
  let text = editor.getText();
  let paragraphs = text.split("\n");
  let currentText = "";

  // Find the last paragraph that fits
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i] + (i < paragraphs.length - 1 ? "\n" : "");
    currentText += paragraph;

    tempQuill.setText(currentText);

    if (temp.scrollHeight <= editorElement.clientHeight) {
      lastFittingIndex += paragraph.length;
    } else {
      break;
    }
  }

  // Cleanup
  document.body.removeChild(temp);
  return lastFittingIndex;
}

// Updated styles
const style = document.createElement("style");
style.textContent = `
  #editor_paper--wrapper {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    min-height: 100vh;
  }

  .editor-wrapper {
    position: relative;
    margin-bottom: 2rem;
    flex-shrink: 0;
  }

  .paper-editor {
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 595px;
    height: 842px; 
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    position: relative;
    z-index: 1;
  }

  .ql-editor {
    padding: 0;
    height: 100%;
    font-size: 16px;
    line-height: 1.5;
    overflow-y: hidden;
  }

  .paper-editor {
    transition: box-shadow 0.3s ease;
  }
`;
// .paper-editor:focus-within {
//   box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
//   z-index: 2;
// }
document.head.appendChild(style);

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

// Create the Pickr instance
function createPickrInstance(element, containerEl, appClass, theme = "nano") {
  return Pickr.create({
    el: element,
    theme: theme, // or 'classic', 'monolith', etc.
    container: containerEl,
    swatches: ["rgba(244, 67, 54, 1)", "rgba(233, 30, 99, 0.95)", "rgba(156, 39, 176, 0.9)", "rgba(103, 58, 183, 0.85)", "rgba(63, 81, 181, 0.8)", "rgba(33, 150, 243, 0.75)", "rgba(3, 169, 244, 0.7)", "rgba(0, 188, 212, 0.7)", "rgba(0, 150, 136, 0.75)", "rgba(76, 175, 80, 0.8)", "rgba(139, 195, 74, 0.85)", "rgba(205, 220, 57, 0.9)", "rgba(255, 235, 59, 0.95)", "rgba(255, 193, 7, 1)"],
    components: {
      // Main components
      preview: true,
      opacity: true,
      hue: true,

      // Input / output Options
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        save: true,
      },
    },
    useAsButton: true, // This tells Pickr to use the existing element as a button
    appClass: appClass, // Add a custom class for easier styling
  });
}

// SVG icons (rotateIcon and deleteIcon) should be defined here
const rotateIcon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 15L10 19L14 23" stroke="#222222"/><path d="M18.0622 8.5C18.7138 9.62862 19.0374 10.9167 18.9966 12.2193C18.9557 13.5219 18.5521 14.7872 17.8311 15.8728C17.11 16.9584 16.1003 17.8212 14.9155 18.364C13.7307 18.9067 12.4179 19.108 11.1249 18.9451" stroke="#222222" stroke-linecap="round"/><path d="M10 9L14 5L10 1" stroke="#222222"/><path d="M5.93782 15.5C5.27676 14.355 4.95347 13.0462 5.0054 11.7251C5.05733 10.404 5.48234 9.12457 6.23124 8.03498C6.98013 6.9454 8.02229 6.09019 9.23708 5.56834C10.4519 5.04649 11.7896 4.87934 13.0955 5.08625" stroke="#222222" stroke-linecap="round"/></svg>`;
const deleteIcon = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 14.5L9.5 11.5" stroke="#F43F5E" stroke-linecap="round"/><path d="M14.5 14.5L14.5 11.5" stroke="#F43F5E" stroke-linecap="round"/><path d="M3 6.5H21V6.5C19.5955 6.5 18.8933 6.5 18.3889 6.83706C18.1705 6.98298 17.983 7.17048 17.8371 7.38886C17.5 7.89331 17.5 8.59554 17.5 10V15.5C17.5 17.3856 17.5 18.3284 16.9142 18.9142C16.3284 19.5 15.3856 19.5 13.5 19.5H10.5C8.61438 19.5 7.67157 19.5 7.08579 18.9142C6.5 18.3284 6.5 17.3856 6.5 15.5V10C6.5 8.59554 6.5 7.89331 6.16294 7.38886C6.01702 7.17048 5.82952 6.98298 5.61114 6.83706C5.10669 6.5 4.40446 6.5 3 6.5V6.5Z" stroke="#F43F5E" stroke-linecap="round"/><path d="M9.5 3.50024C9.5 3.50024 10 2.5 12 2.5C14 2.5 14.5 3.5 14.5 3.5" stroke="#F43F5E" stroke-linecap="round"/></svg>`;
const moveIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="black" fill-rule="evenodd" d="M12.707 2.293a1 1 0 0 0-1.414 0l-2 2A1 1 0 0 0 10 6h1v5H6v-1a1 1 0 0 0-1.707-.707l-2 2a1 1 0 0 0 0 1.414l2 2A1 1 0 0 0 6 14v-1h5v5h-1a1 1 0 0 0-.707 1.707l2 2a1 1 0 0 0 1.414 0l2-2A1 1 0 0 0 14 18h-1v-5h5v1a1 1 0 0 0 1.707.707l2-2a1 1 0 0 0 0-1.414l-2-2A1 1 0 0 0 18 10v1h-5V6h1a1 1 0 0 0 .707-1.707z" clip-rule="evenodd"/></svg>`;
const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="black" d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"/></svg>`;
const bgColorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="-6 -6 24 24"><path fill="black" d="m7.543 8l.506 1.386c.17.466.734.722 1.26.57c.525-.15.813-.651.643-1.117l-2.05-5.61c-.197-.542-.675-.967-1.285-1.142c-1.05-.302-2.179.209-2.52 1.141L2.05 8.838c-.17.467.118.967.643 1.119c.525.15 1.09-.105 1.26-.571L4.458 8zm-.73-2H5.188L6 3.776zM2 0h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/></svg>`;

const noGridIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H11.0067M11 8H11.0067M11 14H11.0067M14 2H14.0067M14 8H14.0067M14 14H14.0067M14 11H14.0067M14 5H14.0067" stroke="#33363F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const colGridCenterIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H11.0067M11 8H11.0067M11 14H11.0067M14 2H14.0067M14 8H14.0067M14 14H14.0067M14 11H14.0067M14 5H14.0067M8 14V2" stroke="#33363F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const colGridLeftIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H11.0067M11 8H11.0067M11 14H11.0067M14 2H14.0067M14 8H14.0067M14 14H14.0067M14 11H14.0067M14 5H14.0067M2 14V2" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const colGridRightIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H11.0067M11 8H11.0067M11 14H11.0067M14 14V2" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rowGridCenterIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M11 2H11.0067M11 14H11.0067M14 2H14.0067M14 14H14.0067M14 11H14.0067M14 5H14.0067M14 8H2" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rowGridBottomIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M10.9867 2H10.9933M10.9867 8H10.9933M14 2H14.0067M14 8H14.0067M14 11H14.0067M14 5H14.0067M14 14H2" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const rowGridTopIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M10.9867 14H10.9933M10.9867 8H10.9933M14 14H14.0067M14 8H14.0067M14 11H14.0067M14 5H14.0067M14 2H2" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const outlineGridIcon = `<svg width="18" height="18" viewBox="0 0 16 16" fill="none" class="copy" xmlns="http://www.w3.org/2000/svg"><path d="M10.9933 8H11M2 5.2V10.8C2 11.92 2 12.48 2.22 12.9067C2.40994 13.2816 2.71319 13.5872 3.08667 13.78C3.52 14 4.08 14 5.2 14H10.8C11.92 14 12.48 14 12.9067 13.78C13.2816 13.5901 13.5872 13.2868 13.78 12.9133C14 12.48 14 11.92 14 10.8V5.2C14 4.08 14 3.52 13.78 3.09333C13.5901 2.71839 13.2868 2.41281 12.9133 2.22C12.4733 2 11.9133 2 10.8 2H5.2C4.08 2 3.52 2 3.09333 2.22C2.71839 2.40994 2.41281 2.71319 2.22 3.08667C2 3.52667 2 4.08667 2 5.2Z" stroke="#33363F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// Initialize with the first editor
let focusedEditor = paperEditors[0];

paperEditors.forEach((editor) => {
  editor.container.addEventListener("focusin", function () {
    focusedEditor = editor;
  });
});

/**
 * Mobile Toolbar Toggle Height
 */
document.addEventListener("DOMContentLoaded", () => {
  const mobileHeaderNav = document.getElementById("mobile_header_nav");

  animateHeight(mobileHeaderNav, 0, 0);

  if (typeof paperEditors !== "undefined" && Array.isArray(paperEditors)) {
    paperEditors.forEach((editor) => {
      if (editor?.container) {
        // // Use focusin instead of focus (bubbles up)
        editor.container.addEventListener("focusin", (e) => {
          if (e.relatedTarget && e.relatedTarget.closest("#mobile_header_nav")) return;

          if (window.innerWidth < 667) {
            animateHeight(mobileHeaderNav, 0, mobileHeaderNav.scrollHeight);
          }
        });

        // Handle blur with a delay to allow for clicks
        editor.container.addEventListener("focusout", (e) => {
          if (window.innerWidth < 667) {
            if (e.relatedTarget && e.relatedTarget.closest("#mobile_header_nav")) return;

            // Safely check relatedTarget
            setTimeout(() => {
              const newFocusElement = document.activeElement;

              if (!mobileHeaderNav.contains(newFocusElement)) {
                animateHeight(mobileHeaderNav, mobileHeaderNav.scrollHeight, 0);
              }
            }, 100);
          }
        });
      }
    });
  }
});
