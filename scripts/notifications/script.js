/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Notification Filter Option
 *
 *
 *
 *
 *
 *
 *
 *
 */

$(document).ready(function () {
  // for filter list
  $("#open_filter").on("click", function (event) {
    event.stopPropagation();
    if ($(".filter-list").hasClass("hidden")) {
      $(".filter-list").removeClass("hidden");
    } else {
      $(".filter-list").addClass("hidden");
    }
  });

  $(document).on("click", function (event) {
    if (
      !$(".filter-list").hasClass("hidden") &&
      !event.target.closest("#filter")
    ) {
      $(".filter-list").addClass("hidden");
    }
  });

  $(".filter-list .list").on("click", function () {
    // Remove 'active-list' class from all list items
    $(".filter-list .list").removeClass("active-list");
    // Add 'active-list' class to the clicked list item
    $(this).addClass("active-list");
    // Hide filter list container
    $(".filter-list").addClass("hidden");
  });
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// WORK HTML
// Modal
$(document).ready(function () {
  var modal = $("#myModal");
  var btn = $("#new-list-btn");
  var span = $(".close");
  var cancelBtn = $(".cancel-btn");
  var addBtn = $(".add-btn");

  modal.addClass("hidden-modal");
  btn.on("click", function () {
    modal.removeClass("hidden-modal");
  });
  span.on("click", function () {
    modal.addClass("hidden-modal");
  });

  cancelBtn.on("click", function () {
    modal.addClass("hidden-modal");
  });
  // // Hide the modal when clicking outside of the modal content
  $(window).on("click", function (event) {
    if ($(event.target).is($("myModal"))) {
      modal.addClass("hidden-modal");
    }
  });
  // Handle form submission
  addBtn.on("click", function (event) {
    event.preventDefault();
    const prevDataSet = $(".cards .saved-item:last-child").data().id;
    // Get the title from the form
    var title = $("#title").val();
    // Create a new item
    var newItem = `
      <div data-id='${
        +prevDataSet + 1
      }' class="saved-item px-2 flex-col-1 size-10 border-2 py-2-4">
       
          <div class="list_image">
            <img loading="lazy" src="image-placeholder.png" />
          </div>
          <div class="flex space-between">
            <div class="flex-col-2">
              <span class="text-dark editable-title text-medium font-medium">${title}</span>
              <div class="button">
                <button class="text-gray-500 text-smm font-regular" type="button">24 Saved post</button>
              </div>
            </div>
            <div class="items-center">
              <div class="icon-box px-2 rounded-x border-2 items-center">
                <img loading="lazy" class="toggle-icon" data-target="#school-nav" src="./icons/Meatballs_menu.svg" />
                <img loading="lazy" class="close-icon" data-target="#school-nav" src="./icons/Close_round.svg" />
              </div>
            </div>
            <div id="school-nav" class="nav-menu px-2 rounded-xll" style="display: none">
              <div class="px-2 py-2">
                <div class="nav-menu-list flex items-center text-base font-medium gap-2">
                  <img loading="lazy" src="icons/Edit.svg" class="size-6" />
                  <div>
                    <button data-id='${
                      +prevDataSet + 1
                    }' class="edit-btn">Edit</button>
                  </div>
                </div>
                <div class="nav-menu-list flex items-center text-base font-medium gap-2">
                  <img  loading="lazy" src="icons/Trash.svg" class="size-6" />
                  <div>
                    <button class="delete-btn">Delete</button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    `;

    // Append the new item to the saved-detail container
    $(".cards").append(newItem);

    // Clear the form
    $("#title").val("");

    // Hide the modal
    modal.addClass("hidden-modal");
  });
});

$(document).ready(function () {
  var modal = $("#addResponsive");
  var btn = $("#new-list-btn");
  var span = $(".close");
  var cancelBtn = $(".cancel-btn");
  var icon = $(".float-icon");
  var addBtn = $(".add-btn-res");
  modal.addClass("hidden-modal");
  btn.on("click", function () {
    modal.removeClass("hidden-modal");
  });
  span.on("click", function () {
    modal.addClass("hidden-modal");
  });
  cancelBtn.on("click", function () {
    modal.addClass("hidden-modal");
  });
  icon.on("click", function () {
    modal.addClass("hidden-modal");
  });

  modal.on("click", function (event) {
    if ($(event.target).is(modal)) {
      $(modal).addClass("hidden-modal");
    }
  });

  $("#navResponsive").addClass("hidden-modal");

  $("#nav_mobile").on("click", function () {
    $("#navResponsive").removeClass("hidden-modal");
  });

  $("#navResponsive").on("click", function (event) {
    if ($(event.target).is("#navResponsive")) {
      $("#navResponsive").addClass("hidden-modal");
    }
  });
});

// Modal for responsive edit-btn
$(document).ready(function () {
  $("#editResponsive").addClass("hidden-modal");

  // Open modal on edit button click
  $(".edit-btn").on("click", function () {
    const elId = $(this).data("id");
    var title = $(this)
      .closest(`div[data-id='${elId}']`)
      .find(".editable-title")
      .text();

    $("#editResponsive").data(
      "titleElement",
      $(this).closest(".flex-col-2").find(".editable-title")
    );

    $("#editResponsive #title").val(title);
    $("#editResponsive").removeClass("hidden-modal");
  });
  $(".float-icon").on("click", function () {
    $("#editResponsive").addClass("hidden-modal");
  });
  $(".cancel-btn").on("click", function () {
    $("#editResponsive").addClass("hidden-modal");
  });
  $("#edit-list-btn").on("click", function () {
    $("#editResponsive").removeClass("hidden-modal");
  });

  $("#editResponsive").on("click", function (event) {
    if ($(event.target).is("#editResponsive")) {
      $("#editResponsive").addClass("hidden-modal");
    }
  });
});

// Modal for responsive delete button
$(document).ready(function () {
  $("#deleteResponsive").addClass("hidden-modal");
  $(".delete-btn").on("click", function () {
    $("#deleteResponsive").data("boxElement", $(this).closest(".flex-col-2"));
    $("#deleteResponsive").removeClass("hidden-modal");
  });
  $(".float-icon").on("click", function () {
    $("#deleteResponsive").addClass("hidden-modal");
  });
  $(".cancel-btn").on("click", function () {
    $("#deleteResponsive").addClass("hidden-modal");
  });
  $(".delete").on("click", function () {
    $("#deleteResponsive").addClass("hidden-modal");
  });
  // $("#delete-list-btn").on("click", function () {
  //   $("#deleteResponsive").removeClass("hidden-modal");
  // });

  $("#deleteResponsive").on("click", function (event) {
    if ($(event.target).is("#deleteResponsive")) {
      $("#deleteResponsive").addClass("hidden-modal");
    }
  });
});

// For no list
$(document).ready(function () {
  var currentListItem; // Variable to store the current list item to be deleted
  $("#No-list").addClass("hidden-modal");
  // Show the delete modal when the delete option is clicked
  $(".delete-list").on("click", function () {
    currentListItem = $(this).closest(".card-box"); // Store the current list item
    $("#deleteModal").removeClass("hidden-modal"); // Show the modal
  });

  // Close the modal when cancel is clicked
  $(".cancel-btn").on("click", function () {
    $("#deleteModal").addClass("hidden-modal");
  });

  // Delete the list item when the delete button is clicked
  $("#delete-it").on("click", function () {
    currentListItem.remove(); // Remove the current list item
    $("#deleteModal").addClass("hidden-modal"); // Hide the modal

    // Check if there are any list items left
    if ($("#work_list .card-box").length === 0) {
      $("#No-list").removeClass("hidden-modal"); // Show the "No List Created" message
    }
  });
});
