const editorCanvas = document.getElementById("quill-draw-canvas");
const toggleButton = document.getElementById("draw-toggle-button");
const ctx = editorCanvas.getContext("2d");

// Drawing variables
let penPencilTool;
let isDrawing = false;
ctx.strokeStyle = "black";
ctx.lineWidth = 2;

document.addEventListener("DOMContentLoaded", () => {
  const sizemugPenBtn = document.getElementById("sizemug_pen--btn");
  const sizemugPencilBtn = document.getElementById("sizemug_pencil--btn");

  // Variables to track drawing bounds
  let minX, minY, maxX, maxY;
  const CL = "active";

  function removeActiveFromBothButtons() {
    [sizemugPenBtn, sizemugPencilBtn].forEach((p) => {
      penPencilTool = "";
      p.classList.remove(CL);
      toggleEditorsCanvas();
    });
  }

  sizemugPenBtn.addEventListener("click", function () {
    if (this.classList.contains(CL)) {
      removeActiveFromBothButtons();
    } else {
      removeActiveFromBothButtons();

      penPencilTool = "pen";
      this.classList.add(CL);

      ctx.strokeStyle = "black";
      toggleEditorsCanvas(true);
    }
  });

  sizemugPencilBtn.addEventListener("click", function () {
    if (this.classList.contains(CL)) {
      removeActiveFromBothButtons();
    } else {
      removeActiveFromBothButtons();

      penPencilTool = "pencil";
      this.classList.add(CL);

      ctx.strokeStyle = "gray";
      toggleEditorsCanvas(true);
    }
  });

  // Drawing functions
  function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);

    // Initialize bounds on the first point
    minX = maxX = e.offsetX;
    minY = maxY = e.offsetY;
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function draw(e) {
    if (!isDrawing) return;

    // Draw the line
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();

    // Update bounds
    minX = Math.min(minX, e.offsetX);
    minY = Math.min(minY, e.offsetY);
    maxX = Math.max(maxX, e.offsetX);
    maxY = Math.max(maxY, e.offsetY);
  }

  // Save drawing to Quill editor
  function saveDrawingToQuill() {
    if (minX == null || minY == null || maxX == null || maxY == null) {
      return; // No drawing made
    }

    // Calculate width and height of the drawn area
    const width = maxX - minX;
    const height = maxY - minY;

    // Create a temporary canvas to hold the cropped image
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext("2d");

    // Draw the cropped image onto the temporary canvas
    tempCtx.drawImage(editorCanvas, minX, minY, width, height, 0, 0, width, height);
    const dataURL = tempCanvas.toDataURL("image/png");
    const range = focusedEditor.getSelection(true);
    focusedEditor.insertEmbed(range.index, "custom-image", { url: dataURL });

    // Clear the canvas and reset bounds after saving
    ctx.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    minX = minY = maxX = maxY = null;
  }

  // Event listeners for drawing
  editorCanvas.addEventListener("mousedown", startDrawing);
  editorCanvas.addEventListener("mouseup", stopDrawing);
  editorCanvas.addEventListener("mousemove", draw);
  editorCanvas.addEventListener("mouseleave", stopDrawing);

  document.addEventListener("click", (e) => {
    if (penPencilTool && !e.target.closest(".editor-wrapper") && !e.target.closest("#sizemug_pen--btn") && !e.target.closest("#sizemug_pencil--btn")) {
      saveDrawingToQuill(); // Save Drawing to editor
      removeActiveFromBothButtons(); // Remove pen & pencil active state
    }
  });

  // Touch events for mobile/tablets
  editorCanvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrawing({ offsetX: touch.clientX, offsetY: touch.clientY });
  });

  editorCanvas.addEventListener("touchend", stopDrawing);

  editorCanvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    draw({ offsetX: touch.clientX, offsetY: touch.clientY });
  });
});

function updateCanvasDimension() {
  const editorWrapper = document.querySelectorAll(".editor-wrapper");

  editorWrapper.forEach((editor) => {
    const canvas = editor.querySelector("#quill-draw-canvas");

    // Set up canvas size to match editor
    canvas.width = editor.clientWidth;
    canvas.height = editor.clientHeight;
  });
}

// update canvas dimension(width & height) initially
updateCanvasDimension();

window.addEventListener("resize", () => {
  updateCanvasDimension();
});

function toggleEditorsCanvas(status = false) {
  const allCanvas = document.querySelectorAll("#quill-draw-canvas");

  allCanvas.forEach((canvas) => {
    canvas.style.display = status ? "block" : "none";
  });
}
