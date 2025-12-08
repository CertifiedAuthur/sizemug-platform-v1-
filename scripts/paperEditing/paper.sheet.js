document.addEventListener("DOMContentLoaded", () => {
  const toolbarDirectSheetOption = document.getElementById("toolbar_direct_sheet--option");
  const mainWhitePaperBoard = document.getElementById("main_white_paper_board");

  toolbarDirectSheetOption.addEventListener("click", function () {
    const btnStat = this.getAttribute("data-status");

    if (btnStat === "false") {
      this.setAttribute("data-status", true);
      this.textContent = "Docs";

      mainWhitePaperBoard.classList.add("sheet-active");
    } else {
      this.setAttribute("data-status", false);
      this.textContent = "Sheet";

      mainWhitePaperBoard.classList.remove("sheet-active");
    }
  });

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  // Insert Cell Inputs
});

function generateCellInput() {
  const cellInputsLengths = Array.from({ length: 1050 }, (_, i) => i + 1);

  cellInputsLengths.forEach((cell) => {
    const markup = `<input type="text" class="cell" data-col="1" data-row="1" style="--cell-col: 1; --cell-row: 1" />`;
  });
}

///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
const cols = 21;
const rows = 50;

const $sheet = $("#spreadsheet");

$sheet.css("--col-count", cols);
$sheet.css("--row-count", rows);

/**
 * update the spreadsheet
 * @param {number} cols - column count
 * @param {number} rows - row count
 */
function updateSheet(cols, rows) {
  const $cellsWrapper = $sheet.find("#cells_wrapper");
  const $rulerCols = $sheet.find(".ruler_cols");
  const $rulerRows = $sheet.find(".ruler_rows");
  const chars = "ABCDEFGHIJKLMNOPQRST";

  for (let c = 1; c <= cols; c++) {
    const $cell = $(`<span/>`).attr("data-col", c).text(generateIndex(c));
    $rulerCols.append($cell);
  }
  for (let r = 1; r <= rows; r++) {
    const $cell = $(`<span/>`).attr("data-row", r).text(r);
    $rulerRows.append($cell);
  }
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      const $cell = $(`<input type='text' class="cell" />`).css("--cell-col", c).css("--cell-row", r).attr("data-col", c).attr("data-row", r);
      $cellsWrapper.append($cell);
    }
  }
}

/**
 * generates alpha numertic index
 * @param {number} num - index of the column
 */
function generateIndex(num) {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  let index = "";
  while (num > 0) {
    index = letters.at((num - 1) % 26) + index;
    num = Math.floor((num - 1) / 26);
  }
  return index;
}

$(() => {
  updateSheet(cols, rows);
});

$(document).on("keydown", "input.cell[data-col][data-row]", (event) => {
  const $input = $(event.currentTarget);

  const col = Number($input.attr("data-col"));
  const row = Number($input.attr("data-row"));
  // configure behavior on press enter key
  if (event.which === 13 || event.key === "Enter") {
    const nextRow = event.shiftKey ? row - 1 : row + 1;
    // change focus to next or previous row
    $input.parent().find(`input.cell[data-row=${nextRow}][data-col=${col}]`).trigger("focus");
    event.preventDefault();
  }
});
