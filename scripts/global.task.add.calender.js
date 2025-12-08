const addCalenderModal = document.getElementById("add_calender--modal");
const hideAddCalender = document.getElementById("hide_add_calender");

hideAddCalender.addEventListener("click", hideTaskAddCalender);
addCalenderModal.addEventListener("click", (e) => {
  if (e.target.id === "add_calender--modal") hideTaskAddCalender();
});

function showTaskAddCalender() {
  addCalenderModal.classList.remove(HIDDEN);
}

function hideTaskAddCalender() {
  addCalenderModal.classList.add(HIDDEN);
}

// Duet setup
const addCalender = document.getElementById("add_to_calender");
const addCalenderLabel = addCalender.querySelector(".calender_label");
const calendarDatePicker = addCalender.querySelector(".add_to_calender");

document.addEventListener("DOMContentLoaded", function () {
  // Set initial properties
  calendarDatePicker.min = today;

  // Update DOM initial setup
  addCalenderLabel.textContent = today;

  // Custom trigger to show date picker
  addCalender.addEventListener("click", function () {
    calendarDatePicker.show();
  });

  // Listen for date changes on calendarDatePicker
  calendarDatePicker.addEventListener("duetChange", function (event) {
    const selectedDate = event.detail.value;
    addCalenderLabel.textContent = selectedDate; // update DOM

    // Delay class removal to allow Duet to complete its cycle
    setTimeout(function () {
      const dateDialog = document.querySelector('[name="addToCalender"]').querySelector(".duet-date__dialog");

      if (dateDialog) {
        dateDialog.classList.remove("is-active");
      }
    }, 100); // Adjust the delay as needed
  });
});
