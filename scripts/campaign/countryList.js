let all_c_c = $(".all-countries");
$(all_c_c).html("");
countriesData.forEach((country) => {
  $(`<li class="user-list" x-bind="dropdown_item">
                    <span>${country}</span>
            </li>`).appendTo(all_c_c);
});
document.addEventListener("DOMContentLoaded", function () {
  const dateStart = document.getElementById("date_start");
  const dateEnd = document.getElementById("date_end");
  // formattedDate(dateStart);
  // formattedDate(dateEnd);

  function formattedDate(datePickerInput) {
    // Initialize the date picker
    const datepicker = new Datepicker(datePickerInput, {
      // Set the initial date format to your desired format
      // format: function (date) {
      //     const options = { year: 'numeric', month: 'short', day: 'numeric' };
      //     date.toLocaleDateString('en-US', options);
      // },
      autohide: true,
    });
    // Update the input field when a date is selected
    datePickerInput.addEventListener("change", function (event) {
      console.log(event);
    });
    datePickerInput.addEventListener("changeDate", function (event) {
      console.log(event);
      const selectedDate = new Date(event.detail.date);
      const formattedDate = selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      datePickerInput.value = formattedDate;
      return datepicker.hide();
    });
  }
});
