document.addEventListener("DOMContentLoaded", () => {
  const sizemugAddCellBtn = document.getElementById("sizemug_add_cell--btn");

  sizemugAddCellBtn.addEventListener("click", handleQuillAddRow);
});

function handleQuillAddRow() {
  const activatedTable = document.querySelector('[data-table-status="activate"]');

  if (activatedTable) {
    // Find the <table> element inside the activated container
    const table = activatedTable.querySelector("table");

    if (table) {
      const rows = table.querySelectorAll("tr");

      // Determine the number of columns based on the first row
      const columnCount = rows[0] ? rows[0].cells.length : 0;

      // Create a new row at the end of the table
      const newRow = table.insertRow();

      // Add cells with empty input fields for each column
      for (let i = 0; i < columnCount; i++) {
        const newCell = newRow.insertCell();
        const input = document.createElement("input");
        input.type = "text";
        input.className = "table-cell-input";
        newCell.appendChild(input);
      }
    } else {
      console.log("No <table> element found inside the activated container.");
    }
  } else {
    console.log("No activated table found.");
  }
}
