const grid = document.querySelector(".grid");

let selectedRows = 0;
let selectedCols = 0;

// Create grid cells
for (let i = 0; i < 80; i++) {
  // 8 rows * 10 columns = 80 cells
  const cell = document.createElement("div");
  cell.addEventListener("mouseover", (e) => highlightCells(e.target));
  cell.addEventListener("click", (e) => {
    setSelection(e.target);
    generateTable();

    const gridContainer = document.querySelector(".collaboration_tool--grid");
    gridContainer.classList.add("hidden-page");
  });
  grid.appendChild(cell);
}

function highlightCells(target) {
  const cells = Array.from(grid.children);
  const index = cells.indexOf(target);
  const col = index % 10; // 10 columns
  const row = Math.floor(index / 10); // 10 columns

  cells.forEach((cell, i) => {
    const cellCol = i % 10; // 10 columns
    const cellRow = Math.floor(i / 10); // 10 columns
    if (cellCol <= col && cellRow <= row) {
      cell.classList.add("selected");
    } else {
      cell.classList.remove("selected");
    }
  });
}

function setSelection(target) {
  const cells = Array.from(grid.children);
  const index = cells.indexOf(target);
  selectedCols = (index % 10) + 1; // 10 columns
  selectedRows = Math.floor(index / 10) + 1; // 10 columns
}

let initWidth = "400px";
let initHeight = "400px";

function generateTable() {
  const previewContainer = document.createElement("div");
  previewContainer.className = "container_table";

  previewContainer.style.minHeight = "180.352px";
  previewContainer.style.width = `${initWidth}`;
  previewContainer.style.height = `${initHeight}`;
  previewContainer.style.position = "absolute";
  previewContainer.style.left = "50%";
  previewContainer.style.top = "50%";
  previewContainer.style.transform = "translate(-50%, -50%)";

  const table = document.createElement("table");
  table.style.position = "absolute";
  const tbody = document.createElement("tbody");

  for (let r = 0; r < selectedRows; r++) {
    const row = document.createElement("tr");
    for (let c = 0; c < selectedCols; c++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.style.width = "100%";

      // Add event listener to stop propagation
      input.addEventListener("click", function (event) {
        event.stopPropagation();
      });

      cell.appendChild(input);
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);

  // Add move buttons
  const moveButtonLeft = document.createElement("button");
  moveButtonLeft.classList.add("move_left_table", "hidden-page");
  moveButtonLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

  const moveButtonRight = document.createElement("button");
  moveButtonRight.classList.add("move_right_table", "hidden-page");
  moveButtonRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

  const moveButtonTop = document.createElement("button");
  moveButtonTop.classList.add("move_top_table", "hidden-page");
  moveButtonTop.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

  const moveButtonBottom = document.createElement("button");
  moveButtonBottom.classList.add("move_bottom_table", "hidden-page");
  moveButtonBottom.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;

  // Add resize buttons
  const resizeButtonTopLeft = document.createElement("button");
  resizeButtonTopLeft.classList.add("resize_top_left_table", "hidden-page");
  resizeButtonTopLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonTopRight = document.createElement("button");
  resizeButtonTopRight.classList.add("resize_top_right_table", "hidden-page");
  resizeButtonTopRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonBottomLeft = document.createElement("button");
  resizeButtonBottomLeft.classList.add("resize_bottom_left_table","hidden-page"); // prettier-ignore
  resizeButtonBottomLeft.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const resizeButtonBottomRight = document.createElement("button");
  resizeButtonBottomRight.classList.add("resize_bottom_right_table","hidden-page"); // prettier-ignore
  resizeButtonBottomRight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="none" stroke="#ffff" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M304 96h112v112m-10.23-101.8L111.98 400.02M208 416H96V304"/></svg>`;

  const cancelTableButton = document.createElement("button");
  cancelTableButton.classList.add("cancel_table");
  cancelTableButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="#ffff" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>`; // Set the text content of the cancel button

  cancelTableButton.addEventListener("click", function (e) {
    e.stopPropagation();
    containerCollaboration.removeChild(previewContainer);
  });

  previewContainer.appendChild(table);
  previewContainer.appendChild(cancelTableButton);
  previewContainer.appendChild(moveButtonTop);
  previewContainer.appendChild(moveButtonBottom);
  previewContainer.appendChild(moveButtonRight);
  previewContainer.appendChild(moveButtonLeft);
  previewContainer.appendChild(resizeButtonBottomLeft);
  previewContainer.appendChild(resizeButtonBottomRight);
  previewContainer.appendChild(resizeButtonTopLeft);
  previewContainer.appendChild(resizeButtonTopRight);

  // Create an overlay element
  const overlay = document.createElement("div");
  overlay.className = "table_overlay";
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

    moveButtonTop.classList.remove(PAGEHIDDEN);
    moveButtonBottom.classList.remove(PAGEHIDDEN);
    moveButtonLeft.classList.remove(PAGEHIDDEN);
    moveButtonRight.classList.remove(PAGEHIDDEN);

    resizeButtonBottomLeft.classList.remove(PAGEHIDDEN);
    resizeButtonBottomRight.classList.remove(PAGEHIDDEN);
    resizeButtonTopLeft.classList.remove(PAGEHIDDEN);
    resizeButtonTopRight.classList.remove(PAGEHIDDEN);
    cancelTableButton.classList.remove(PAGEHIDDEN);
  });

  // handle document click here...
  document.addEventListener("click", function (event) {
    if (!event.target.closest(".table_overlay")) {
      overlay.classList.remove(PAGEHIDDEN);

      moveButtonTop.classList.add(PAGEHIDDEN);
      moveButtonBottom.classList.add(PAGEHIDDEN);
      moveButtonLeft.classList.add(PAGEHIDDEN);
      moveButtonRight.classList.add(PAGEHIDDEN);

      resizeButtonBottomLeft.classList.add(PAGEHIDDEN);
      resizeButtonBottomRight.classList.add(PAGEHIDDEN);
      resizeButtonTopLeft.classList.add(PAGEHIDDEN);
      resizeButtonTopRight.classList.add(PAGEHIDDEN);
      cancelTableButton.classList.add(PAGEHIDDEN);
    }
  });

  previewContainer.appendChild(overlay);

  // containerCollaboration.innerHTML = ""; // Clear any previous table
  containerCollaboration.appendChild(previewContainer);

  // Make the table draggable
  const draggableConfig = {
    listeners: {
      move(event) {
        const target = event.target.closest(".container_table");
        const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      },
    },
  };

  interact(moveButtonTop).draggable(draggableConfig);
  interact(moveButtonBottom).draggable(draggableConfig);
  interact(moveButtonLeft).draggable(draggableConfig);
  interact(moveButtonRight).draggable(draggableConfig);

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

  interact(".resize_top_left_table").draggable(topResizeConfig);
  interact(".resize_top_right_table").draggable(topResizeConfig);
  interact(".resize_bottom_left_table").draggable({
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
  interact(".resize_bottom_right_table").draggable({
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
}
