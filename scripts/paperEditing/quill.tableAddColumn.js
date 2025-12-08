document.addEventListener("DOMContentLoaded", () => {
  const sizemugAddColumnBtn = document.getElementById("sizemug_add_column--btn");

  sizemugAddColumnBtn.addEventListener("click", handleQuillAddColumn);
});

function handleQuillAddColumn() {
  const activatedTable = document.querySelector('[data-table-status="activate"]');

  if (activatedTable) {
    // Find the <table> element inside the activated container
    const table = activatedTable.querySelector("table");

    if (table) {
      const rows = table.querySelectorAll("tr");

      // Loop through each row and add a new cell with an empty input field
      rows.forEach((row) => {
        const newCell = row.insertCell(); // Adds cell at the end of each row
        const input = document.createElement("input");
        input.type = "text";
        input.className = "table-cell-input";
        newCell.appendChild(input);
      });
    } else {
      console.log("No <table> element found inside the activated container.");
    }
  } else {
    console.log("No activated table found.");
  }
}
