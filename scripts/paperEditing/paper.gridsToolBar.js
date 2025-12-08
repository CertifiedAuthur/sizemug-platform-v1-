document.addEventListener("DOMContentLoaded", () => {
  const sizemugNoGridBtn = document.getElementById("sizemug_no_grid--btn");
  const sizemugRowGridBottomBtn = document.getElementById("sizemug_row_grid_bottom--btn");
  const sizemugColumnGridRightBtn = document.getElementById("sizemug_column_grid_right--btn");
  const sizemugColumnGridCenterBtn = document.getElementById("sizemug_column_grid_center--btn");
  const sizemugRowGridTopBtn = document.getElementById("sizemug_row_grid_top--btn");
  const sizemugOutlineGridBtn = document.getElementById("sizemug_outline_grid--btn");
  const sizemugRowGridCenterBtn = document.getElementById("sizemug_row_grid_center--btn");
  const sizemugColumnGridLeftBtn = document.getElementById("sizemug_column_grid_left--btn");

  sizemugNoGridBtn.addEventListener("click", () => updateTableStyle("no-grid"));

  sizemugRowGridBottomBtn.addEventListener("click", () => updateTableStyle("row-grid-bottom"));

  sizemugColumnGridRightBtn.addEventListener("click", () => updateTableStyle("col-grid-right"));

  sizemugColumnGridCenterBtn.addEventListener("click", () => updateTableStyle("col-grid-center"));

  sizemugRowGridTopBtn.addEventListener("click", () => updateTableStyle("row-grid-top"));

  sizemugOutlineGridBtn.addEventListener("click", () => updateTableStyle("outline-grid"));

  sizemugRowGridCenterBtn.addEventListener("click", () => updateTableStyle("row-grid-center"));

  sizemugColumnGridLeftBtn.addEventListener("click", () => updateTableStyle("col-grid-left"));
});

function updateTableStyle(type, container = null) {
  const activatedTable = container ?? document.querySelector('[data-table-status="activate"]');

  if (activatedTable) {
    const allTableRow = activatedTable.querySelectorAll("tr");
    const allTableData = activatedTable.querySelectorAll("td");
    // For when user use quick buttons first
    activatedTable.setAttribute("data-table-status", "activate");

    const firsTableRow = allTableRow[0];
    const lastTableRow = allTableRow[allTableRow.length - 1];

    switch (type) {
      case "no-grid":
        allTableData.forEach((t) => (t.style.borderStyle = "none"));
        allTableRow.forEach((r) => (r.style.borderStyle = "none"));
        break;

      case "col-grid-center":
        allTableData.forEach((t) => (t.style.borderStyle = "none"));
        allTableRow.forEach((r) => (r.style.borderStyle = "none"));

        allTableRow.forEach((tr, index) => {
          const rowDataItems = tr.querySelectorAll("td");

          rowDataItems.forEach((td, cellIndex) => {
            if (cellIndex === 0) {
              // First row
              td.style.borderLeft = "none";
            } else {
              // Other rows
              td.style.borderLeft = "2px solid #1c2020d2";
            }
            // collapse the each cell border
            td.style.borderCollapse = "collapse";
          });
        });
        break;

      case "row-grid-center":
        allTableRow.forEach((tr, index) => {
          if (index === 0) {
            // First row
            tr.style.borderTop = "none";
          } else {
            // Other rows
            tr.style.borderTop = "2px solid #1c2020d2";
          }

          // collapse the each cell border
          tr.style.borderCollapse = "collapse";
        });
        break;

      case "row-grid-bottom":
        rowGridBottom(lastTableRow);
        break;

      case "row-grid-top":
        rowGridTop(firsTableRow);
        break;

      case "col-grid-right":
        allTableRow.forEach((tr) => colGridRight(tr));
        break;

      case "col-grid-left":
        allTableRow.forEach((tr) => colGridLeft(tr));
        break;

      case "outline-grid":
        allTableRow.forEach((tr) => {
          colGridLeft(tr);
          colGridRight(tr);
        });

        rowGridTop(firsTableRow);
        rowGridBottom(lastTableRow);
        break;
    }
  } else {
    console.log("No activated table found.");
  }
}

// Row Grid Bottom
function rowGridBottom(lastTableRow) {
  lastTableRow.querySelectorAll("td").forEach((td) => (td.style.borderBottom = "none"));

  lastTableRow.style.borderBottom = "none";
  lastTableRow.style.borderBottom = "2px solid #1c2020d2";
}

// Row Grid Top
function rowGridTop(firsTableRow) {
  firsTableRow.querySelectorAll("td").forEach((td) => (td.style.borderTop = "none"));

  firsTableRow.style.borderTop = "none";
  firsTableRow.style.borderTop = "2px solid #1c2020d2";
}

// Col Grid Right
function colGridRight(tr) {
  const rowData = tr.querySelectorAll("td");
  const lastDataRow = rowData[rowData.length - 1];

  lastDataRow.style.borderRight = "none";
  lastDataRow.style.borderRight = "2px solid #1c2020d2";
}

// Col Grid Left
function colGridLeft(tr) {
  const rowData = tr.querySelectorAll("td");
  const firstDataRow = rowData[0];

  firstDataRow.style.borderLeft = "none";
  firstDataRow.style.borderLeft = "2px solid #1c2020d2";
}
