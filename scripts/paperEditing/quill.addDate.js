// Custom Date Formatter
function getDateHelper(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const today = getDateHelper(new Date());

document.addEventListener("DOMContentLoaded", function () {
  const sizemugDateBtn = document.getElementById("sizemug_add_date--btn");
  const editorDatePicker = document.querySelector('[identifier="editorDatePicker"]');
  const toolsNavbar = document.getElementById("tools_navbar");

  // Set initial properties
  editorDatePicker.setAttribute("min", today);

  sizemugDateBtn.addEventListener("click", () => {
    editorDatePicker.show();

    toolsNavbar.classList.add("tools-navbar-expanded");
    toolsNavbar.classList.remove("tools-navbar-collapsed");
  });

  // Listen for date changes
  editorDatePicker.addEventListener("duetChange", function (event) {
    const selectedDate = event.detail.value;
    const range = focusedEditor.getSelection(true);
    // Insert the date at cursor position
    focusedEditor.insertText(range?.index, selectedDate);

    // Delay class removal
    setTimeout(function () {
      const dateDialog = editorDatePicker.querySelector(".duet-date__dialog");

      if (dateDialog) {
        dateDialog.classList.remove("is-active");
      }
    }, 100); // Adjust the delay as needed
  });
});
