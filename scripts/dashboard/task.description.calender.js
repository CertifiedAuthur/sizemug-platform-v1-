// Duet setup
const addCalender2 = document.getElementById("add_calender_picker2");
const addCalenderLabel2 = addCalender2?.querySelector(".calender_label");
const calendarDatePicker2 = addCalender2?.querySelector(".add_to_calender2");

document.addEventListener("DOMContentLoaded", function () {
  // Set initial properties
  calendarDatePicker2.min = today;

  // Update DOM initial setup
  addCalenderLabel2.textContent = today;

  // Custom trigger to show date picker
  addCalender2.addEventListener("click", () => {
    calendarDatePicker2.show();
  });

  // Listen for date changes on calendarDatePicker2
  calendarDatePicker2.addEventListener("duetChange", function (event) {
    const selectedDate = event.detail.value;
    addCalenderLabel2.textContent = selectedDate; // update DOM

    // Delay class removal to allow Duet to complete its cycle
    setTimeout(function () {
      const dateDialog = document.querySelector('[name="addToCalender2"]').querySelector(".duet-date__dialog");

      if (dateDialog) {
        dateDialog.classList.remove("is-active");
      }
    }, 100); // Adjust the delay as needed
  });
});
