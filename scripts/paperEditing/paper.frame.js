document.addEventListener("DOMContentLoaded", function () {
  const sizemugFrameWrapper = document.querySelector(".sizemug_frame--wrapper");
  const sizemugAddTableBtn = document.getElementById("sizemug_add_table--btn");
  const frameTableButton = sizemugFrameWrapper.querySelector("#sizemug_frame--btn");
  const frameSelector = sizemugFrameWrapper.querySelector(".frame_selector");
  const frameSizeDisplays = document.querySelectorAll(".frame_size_display");
  const allFrameGrid = document.querySelectorAll(".frame_grid_table");
  const dropdownTableOption = document.getElementById("dropdown_table_option");
  const toolsNavbar = document.getElementById("tools_navbar");

  const ADDTABLETOOLBARROW = 2;
  const ADDTABLETOOLBARCOL = 2;

  dropdownTableOption.addEventListener("mouseenter", function () {
    const targetFrame = this.querySelector("#target_frame");
    targetFrame.classList.remove(HIDDEN);
  });

  dropdownTableOption.addEventListener("mouseleave", function () {
    const targetFrame = this.querySelector("#target_frame");
    targetFrame.classList.add(HIDDEN);
  });

  // Create frame cells
  allFrameGrid.forEach((frameGrid) => {
    for (let i = 0; i < 100; i++) {
      const frameCell = document.createElement("div");
      frameCell.className = "frame_cell";
      frameGrid.appendChild(frameCell);
    }
  });

  frameTableButton.addEventListener("click", () => {
    setTimeout(() => {
      frameSelector.classList.remove(HIDDEN);

      toolsNavbar.classList.add("tools-navbar-expanded");
      toolsNavbar.classList.remove("tools-navbar-collapsed");
    }, 50);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".sizemug_frame--wrapper")) {
      frameSelector.classList.add(HIDDEN);
    }
  });

  let currentSize = { rows: 0, cols: 0 };

  allFrameGrid.forEach((frameGrid) => {
    frameGrid.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("frame_cell")) {
        const index = Array.from(frameGrid.children).indexOf(e.target);
        const row = Math.floor(index / 10) + 1;
        const col = (index % 10) + 1;
        highlightCells(row, col);
        updateSizeDisplay(row, col);
      }
    });
  });

  function highlightCells(rows, cols) {
    allFrameGrid.forEach((frameGrid) => {
      Array.from(frameGrid.children).forEach((cell, index) => {
        const row = Math.floor(index / 10) + 1;
        const col = (index % 10) + 1;
        cell.classList.toggle("highlighted", row <= rows && col <= cols);
      });
    });
  }

  function updateSizeDisplay(rows, cols) {
    currentSize = { rows, cols };
    frameSizeDisplays.forEach((display) => {
      display.textContent = `${rows}x${cols}`;
    });
  }

  // Add new table toolbar button
  sizemugAddTableBtn.addEventListener("click", function () {
    focusedEditor.format("table", { rows: ADDTABLETOOLBARROW, cols: ADDTABLETOOLBARCOL });
  });

  allFrameGrid.forEach((frameGrid) => {
    frameGrid.addEventListener("click", (e) => {
      if (e.target.classList.contains("frame_cell")) {
        focusedEditor.format("table", { rows: currentSize.rows, cols: currentSize.cols });
        frameSelector.classList.add(HIDDEN);

        toolsNavbar.classList.remove("tools-navbar-expanded");
        toolsNavbar.classList.add("tools-navbar-collapsed");
        closeDropdownBar(); // close all dropdown
      }
    });
  });

  // document.addEventListener("click", () => {
  //   if (frameSelector.classList.contains(HIDDEN)) {
  //     frameSelector.classList.add(HIDDEN);

  //     // toolsNavbar.classList.remove("tools-navbar-expanded");
  //     // toolsNavbar.classList.add("tools-navbar-collapsed");
  //   }
  // });
});
