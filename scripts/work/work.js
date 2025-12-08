$(document).ready(function () {
  $("#edit-list-btn").on("click", function () {
    $("#editModal").removeClass("work-hidden");
  });

  $("#delete-list-btn").on("click", function () {
    $("#discardModal").removeClass("work-hidden");
  });

  $(".cancel-btn").on("click", function () {
    $("#editModal").addClass("work-hidden");
  });

  $(".cancel_discard").on("click", function () {
    $("#discard_modal").addClass("work-hidden");
  });

  $(document).on("click", function (event) {
    const $target = $(event.target);

    // Check if the click is outside the #showFilterList and #showFilter elements
    if (
      !$target.closest("#showFilterList").length &&
      !$target.closest("#showFilter").length
    ) {
      $("#showFilterList").addClass("work-hidden");
    }
  });

  // Prevent the event from propagating when clicking inside #showFilterList or on the button
  $("#showFilter").on("click", function (event) {
    $("#showFilterList").removeClass("work-hidden");
    event.stopPropagation();
  });

  $("#showFilterList").on("click", function (event) {
    event.stopPropagation();
  });
});
