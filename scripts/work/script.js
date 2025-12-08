const $headerDropdown = $(".header_dropdown");

$(document).on(
  "click",
  "#suggestions_expand, #Tablet-suggestion-modal",
  function (event) {
    const $el = $(event.currentTarget);
    const list = $el.parent().find("ul");
    const isExpanded = list.attr("aria-expanded") === "true";

    // Toggle the expanded state
    list.attr("aria-expanded", isExpanded ? "false" : "true");
    list.css("--item-count", list.children().length);

    // Check if the "See All" is clicked and modal should be triggered
    if ($el.is("#Tablet-suggestion-modal, #suggestions_expand") && isExpanded) {
      // Open the modal when "See All" is clicked
      $("#suggestions-modal")
        .removeClass("hidden-modal")
        .addClass("visible-modal");
      console.log("Modal opened for tablet or desktop");
    }
  }
);

// Close the modal when required (for example, a close button)
$(document).on("click", "#close-modal-btn", function () {
  $("#suggestions-modal").addClass("hidden-modal").removeClass("visible-modal");
});

$(document).on("click", ".popup_trigger", (event) => {
  const $el = $(event.currentTarget);
  const $target = $($el.attr("data-popup-target"));
  const dialog = $target.get(0);

  if (!dialog) return;
  const isOpen = dialog.open;

  if (isOpen) {
    $target.removeClass("open");
    setTimeout(() => dialog.close(), 200);
  } else {
    dialog.show();
    setTimeout(() => $target.addClass("open"), 1);
  }

  $el.attr("data-active", isOpen);
});

$(document).on("click", ".sidebar_trigger", (event) => {
  const $sidebar = $("#sidebar");
  const isOpen = $sidebar.attr("aria-expanded") === "true";
  $sidebar.attr("aria-expanded", !isOpen);
});

$(window).on("resize", () => {
  if (window.innerWidth > 768) {
    $(".popup").each((_, el) => {
      el.close();
    });
  }
});

function eventHandlers() {
  // To hide the modal during outside click
  $(".modal").click(function (e) {
    if (!$(e.target).hasClass("modal")) return;
    $(".modal").addClass("hidden-modal");
  });

  // The icons in each list
  $(".toggle-icon").click(function () {
    const containerId = $(this).closest(".saved-item").data("id");
    console.log(containerId);

    var target = $(`div[data-id='${containerId}']`).find(".nav-menu");
    $(this).hide();
    $(this).siblings(".close-icon").show();
    $(target).slideDown();
  });
  $(".close-icon").click(function () {
    const containerId = $(this).closest(".saved-item").data("id");

    var target = $(`div[data-id='${containerId}']`).find(".nav-menu");
    $(this).hide();
    $(this).siblings(".toggle-icon").show();
    $(target).slideUp();
  });
  // Modal for edit btn
  $(".edit-btn").on("click", function () {
    const elId = $(this).data("id");
    var title = $(this)
      .closest(`div[data-id='${elId}']`)
      .find(".editable-title")
      .text();
    console.log("=-=-=-=-=-=-=--", title);
    $("#editModal").data(
      "titleElement",
      $(this).closest(".flex-col-2").find(".editable-title")
    );
    $("#editModal #title").val(title);
    $("#editModal").removeClass("hidden-modal");
    $("#save-btn").on("click", function () {
      var newTitle = $("#editModal #title").val();
      console.log("title", newTitle);
      $(`div[data-id='${elId}']`).find(".editable-title").text(newTitle);
      $("#editModal").addClass("hidden-modal");
    });
  });

  // modal for delete-btn
  $("#deleteModal").addClass("hidden-modal");
  $(".delete-btn").on("click", function () {
    $("#deleteModal").removeClass("hidden-modal");
  });

  $(".cancel-btn").on("click", function () {
    $("#deleteModal").addClass("hidden-modal");
  });

  $(".delete").on("click", function () {
    $("#deleteModal").addClass("hidden-modal");
  });
}

$(document).ready(function () {
  eventHandlers();

  // for filter list
  $(".filter-list").addClass("hidden-modal");
  $(".filter").on("click", function (event) {
    event.stopPropagation();
    $(".filter-list").toggleClass("hidden-modal");
  });

  $(".filter-list .list").on("click", function () {
    // Remove 'active-list' class from all list items
    $(".filter-list .list").removeClass("active-list");
    // Add 'active-list' class to the clicked list item
    $(this).addClass("active-list");
  });

  $(document).on("click", function (event) {
    var $target = $(event.target);
    if (
      !$target.closest(".modal").length &&
      !$target.closest(".filter-list .list").length
    ) {
      $(".filter-list").addClass("hidden-modal");
    }
  });

  // Notification container
  $(".app_notification").addClass("hidden-modal");

  $("#Notification-btn").on("click", function () {
    $(".app_notification").removeClass("hidden-modal");
    $(".top-message").addClass("hidden-modal");
    showContent();
  });

  $("#Request-btn").on("click", function () {
    $(".app_notification").removeClass("hidden-modal");
    $(".top-message").addClass("hidden-modal");
    showContent();
  });

  $("#notification-center").on("click", function () {
    activeContent = "notification";
    showContent();
  });

  $("#request-center").on("click", function () {
    activeContent = "request";
    showContent();
  });

  showContent();

  $(".close-notification").on("click", function () {
    $(".app_notification").addClass("hidden-modal");
  });

  ////// Request for following functionalities button

  $(".confirm-following").addClass("hidden-modal");

  $(".following-link").on("click", function () {
    const mId = $(this).data("id");
    console.log(mId);
    $(this).addClass("hidden-modal");
    $("#confirm-following-" + mId).removeClass("hidden-modal");
  });
  $("#No-req-list").addClass("hidden-modal");
  $(".confirm-cancel , .confirm-done").on("click", function () {
    $(this).closest("li.req-list").remove();
    // // Check if there are any list items left
    if ($(".req-list-container").children("li.req-list").length === 0) {
      $(".req-list-container").append(` <div id="No-req-list">
          <div class="no-scrollbar pb-4">
            <div class="">
              <div class="page-element">
                <div class="element-header">
                  <img src="./icons/notification_icons/no-list.svg" />
                  <span>No Notification Request</span>
                  <p>
                    You haven't created any list yet. <br />
                    Organize your items, tasks or posts <br />
                    by creating your first list.
                  </p>
                </div>
                <button>
                  <div>Notifications</div>
                  <img src="./icons/notification_icons/Arrow_right.svg" />
                </button>
              </div>
            </div>
          </div>
        </div>`);
    }
  });

  // $(".confirm-done").on("click", function () {
  //   const mId = $(this).data("id");
  //   $(this).closest(".confirm-following").addClass("hidden-modal");
  //   $('.following-link[data-id="' + mId + '"]')
  //     .text("Following")
  //     .removeClass("hidden-modal");
  // });
  // message;

  $(".top-message").addClass("hidden-modal");
  $("#Message-btn").on("click", function (event) {
    event.stopPropagation();
    $(".top-message").toggleClass("hidden-modal");
    $(".app_notification").addClass("hidden-modal");
  });

  $(".close-message").on("click", function () {
    $(".top-message").addClass("hidden-modal");
    $(".app_notification").addClass("hidden-modal");
  });
  // out side click for message and notification
  $(document).on("click", function (event) {
    if (
      !$(event.target).closest(
        ".app_notification, #Notification-btn , .top-message , .confirm-cancel , .confirm-done"
      ).length
    ) {
      $(".app_notification , .top-message").addClass("hidden-modal");
    }
  });
});

// Modal

$(document).ready(function () {
  var modal = $("#myModal");
  var btn = $("#new-list-btn");
  var span = $(".close");
  var cancelBtn = $(".cancel-btn");
  var addBtn = $(".add-btn");

  modal.addClass("hidden-modal");
  btn.on("click", function () {
    console.log("btn clicked");
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
      console.log(event.target);
      modal.addClass("hidden-modal");
    }
  });
  // Handle form submission
  addBtn.on("click", function (event) {
    event.preventDefault();
    const prevDataSet = $(".cards .saved-item:last-child").data().id;
    console.log(prevDataSet);
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
    eventHandlers();
  });

  // $("#edit-list-btn").on("click", function () {
  //   $("#editModal").removeClass("hidden-modal");
  // });

  // $("#delete-list-btn").on("click", function () {
  //   $("#deleteModal").removeClass("hidden-modal");
  // });

  // $(".cancel-btn").on("click", function () {
  //   $("#editModal").addClass("hidden-modal");
  // });
});

// for routes of index.html and work.html

$(document).ready(function () {
  $("#savedPage").on("click", function () {
    window.location.href = "index.html";
  });
  $("#myButton").on("click", function () {
    window.location.href = "work.html";
  });
  $(".app_notification_footer").on("click", function () {
    window.location.href = "notification.html";
  });
  $("#explore").on("click", function () {
    window.location.href = "notification.html";
  });
});
// slider image list in the work page

$(document).ready(function () {
  $(".card-box").each(function () {
    let currentIndex = 0;
    const images = $(this).find(".slider_img img");
    const dots = $(this).find(".dot");

    function showImage(index) {
      images.hide().eq(index).show();
      if (index < 2) {
        dots.removeClass("active").eq(index).addClass("active");
      } else {
        dots.removeClass("active").eq(2).addClass("active");
      }
    }

    dots.eq(0).click(function () {
      currentIndex = 0;
      showImage(currentIndex);
    });

    dots.eq(1).click(function () {
      currentIndex = 1;
      showImage(currentIndex);
    });

    dots.eq(2).click(function () {
      currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 2;
      showImage(currentIndex);
    });

    // Initial display
    showImage(currentIndex);
  });

  // Hover functionality for the overlay
  $(".card-box").find(".popular_overlay").css("display", "none");
  $(".card-box").hover(
    function () {
      $(this).find(".popular_overlay").css("display", "flex");
    },
    function () {
      $(this).find(".popular_overlay").css("display", "none");
    }
  );

  // For the nav menu in each image
  // $(".list-nav").css({
  //   position: "absolute", // Ensure the element is positioned
  //   "z-index": "100",
  // });
  $(".toggle").click(function () {
    console.log("Clicked toggle");
    $(this).hide();
    $(this).siblings(".close-icon").show();
    $(this)
      .closest(".popular_task_ellipsis")
      .find(".list-nav")

      .removeClass("hidden-modal");
    // $(".user-post-item").closest(".controls").addClass("hidden-modal");
    $(".controls").hide();
  });

  $(".over_lay").addClass("hidden-modal");

  $(".row-4").on("click", function () {
    $(".over_lay").removeClass("hidden-modal");
  });

  $(".post-close").on("click", function () {
    $(".over_lay").addClass("hidden-modal");
  });

  $("#commentModal").on("click", function (event) {
    if ($(event.target).is("#commentModal")) {
      $("#commentModal").addClass("hidden-modal");
    }
  });

  $(".content-see-more").click(function () {
    var content = $(this).next(".see-more-content");
    var rightIcon = $(this).find(".fa-chevron-right");
    var downIcon = $(this).find(".fa-chevron-down");

    content.slideToggle(function () {
      rightIcon.toggleClass("hidden-seemore", content.is(":visible"));
      downIcon.toggleClass("hidden-seemore", !content.is(":visible"));
    });
  });
});

///////////////////////////////////////////////
////////// HomePage Task Music Playing  /////////
///////////////////////////////////////////////

$(document).ready(function () {
  let audio;
  let playing = false;

  $(".play_popular_music_button").click(function (e) {
    const $closest = $(this).closest(".play_popular_music_button");
    const $playBtn = $closest.find(".fa-play");
    const $pauseBtn = $closest.find(".fa-pause");

    if (audio) {
      if (!playing) {
        audio.play();
        playing = true;
        $playBtn.addClass("hidden-modal");
        $pauseBtn.removeClass("hidden-modal");
      } else {
        playing = false;
        audio.pause();
        $playBtn.removeClass("hidden-modal");
        $pauseBtn.addClass("hidden-modal");
      }
    } else {
      audio = new Audio("./music/Salam-Alaikum.mp3");
      playing = true;
      audio.play();
      $playBtn.addClass("hidden-modal");
      $pauseBtn.removeClass("hidden-modal");
    }
  });

  // ////////////////// For the slider image ///////////
  $(".popup-overlay").addClass("hidden-modal");

  $(".avatar-item").on("click", function () {
    $(".popup-overlay").removeClass("hidden-modal");
    console.log("clicked");
  });

  $("#secondModal").on("click", function (event) {
    if ($(event.target).is("#secondModal")) {
      $("#secondModal").addClass("hidden-modal");
    }
  });
  // Modal for marketings
  const HIDDEN = "marketing-hidden";

  // Close Overlay
  $(".overlay").on("click", function (e) {
    if ($(e.target).hasClass("overlay")) {
      $(this).addClass(HIDDEN);
    }
  });

  // Show
  $(".task_option_share").on("click", function () {
    $(".share_modal").removeClass(HIDDEN);
  });

  // Hide
  $(".share_modal--main .share_modal--heading button").on(
    "click",
    function (e) {
      $(e.target).closest(".overlay").addClass(HIDDEN);
    }
  );

  // Copy (Clipboard)
  const shareURL = $(".share_modal--main .clipboard p").text();
  $(".share_modal--main .clipboard button").on("click", function () {
    navigator.clipboard.writeText(shareURL).then(() => {
      $(".copy").addClass(HIDDEN);
      $(".copied").removeClass(HIDDEN);

      setTimeout(() => {
        $(".copy").removeClass(HIDDEN);
        $(".copied").addClass(HIDDEN);
      }, 3000);
    });
  });

  $(".res-header").on("click", function () {
    $(".share_modal , .follow-overlay").addClass(HIDDEN);
  });

  // Follower / Following
  $(".share_modal-grid .share_follower--tab").on("click", function () {
    $(".follow-overlay").removeClass(HIDDEN);
    $(".share_modal").addClass(HIDDEN);
  });

  $(".share_modal-grid .share_following--tab").on("click", function () {
    $(".follow-overlay").removeClass(HIDDEN);
    $(".share_modal").addClass(HIDDEN);
  });

  // Tab
  // $(".follow_modal_header_switch_button button:first-child").on("click", function () {
  //   followTabHandler.call(this, "remove", "add");
  // });

  // $(".follow_modal_header_switch_button button:last-child").on("click", function () {
  //   followTabHandler.call(this, "add", "remove");
  // });

  // function followTabHandler(tab1, tab2) {
  //   $(".follow_modal_header_switch_button button").removeClass("active");
  //   $(this).addClass("active");

  //   $(".follow_users .followings").toggleClass(HIDDEN, tab1 === "add");
  //   $(".follow_users .followers").toggleClass(HIDDEN, tab2 === "add");
  // }

  // Follow Row Buttons
  // $(".follow_modal_row button").on("click", function () {
  //   $(this).toggleClass("active");
  // });

  // // Hide Follow Modal
  // $(".modal_footer button:first-child").on("click", function () {
  //   $(".follow-overlay").addClass(HIDDEN);
  // });
});

// Modal for responsive Add button

$(document).ready(function () {
  var modal = $("#addResponsive");
  var btn = $("#new-list-btn");
  var span = $(".close");
  var cancelBtn = $(".cancel-btn");
  var icon = $(".float-icon");
  var addBtn = $(".add-btn-res");
  modal.addClass("hidden-modal");
  btn.on("click", function () {
    console.log("btn clicked");
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
    console.log("=-=-=-=-=-=-=--", title);

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

// for no list

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
  // For the see all functionality
  $("#suggestions-modal").addClass("hidden-modal");
  $(".close_suggestion").on("click", function () {
    $("#suggestions-modal").addClass("hidden-modal");
  });

  $(".Close_suggestion").on("click", function () {
    $("#suggestions-modal").addClass("hidden-modal");
  });

  $(
    ".location-option, .interest-option, .status-option, .expand-up-location, .expand-up-interest, .expand-up-status"
  ).addClass("hidden-modal");

  $(".filter-btn").on("click", function () {
    var id = $(this).attr("id");

    // Toggle the clicked state
    $("#" + id).toggleClass("clicked");

    // Toggle visibility of the corresponding expand up/down icons and options
    $(".expand-up-" + id.toLowerCase()).toggleClass("hidden-modal");
    $(".expand-down-" + id.toLowerCase()).toggleClass("hidden-modal");
    $("." + id.toLowerCase() + "-option").toggleClass("hidden-modal");

    // Close other dropdowns and reset their state
    $(".filter-btn").not(this).removeClass("clicked");
    $(".location-option, .interest-option, .status-option")
      .not("." + id.toLowerCase() + "-option")
      .addClass("hidden-modal");
    $(".expand-up-location, .expand-up-interest, .expand-up-status")
      .not(".expand-up-" + id.toLowerCase())
      .addClass("hidden-modal");
    $(".expand-down-location, .expand-down-interest, .expand-down-status")
      .not(".expand-down-" + id.toLowerCase())
      .removeClass("hidden-modal");
  });
});
// close the modals out side
$(document).on("click", function (event) {
  // Check if the clicked target is not the button or the dropdown content
  if (
    !$(event.target).closest("#Location, .location-option").length &&
    !$(event.target).closest("#Interest, .interest-option").length &&
    !$(event.target).closest("#Status, .status-option").length
  ) {
    // If clicked outside, close all dropdowns
    $(".filter-btn").removeClass("clicked");
    $(".location-option, .interest-option, .status-option").addClass(
      "hidden-modal"
    );
    $(".expand-up-location, .expand-up-interest, .expand-up-status").addClass(
      "hidden-modal"
    );
    $(
      ".expand-down-location, .expand-down-interest, .expand-down-status"
    ).removeClass("hidden-modal");
  }
});
$(document).ready(function () {
  let profilesPerPage = 15;
  let maxProfiles = 60;
  let allProfiles = [];
  let profilesLoaded = 0;

  // Function to fetch all profiles at once (initial load only)
  function fetchAllProfiles() {
    // Show the skeleton loader before fetching profiles
    $("#skeleton-loader").show();
    $("#modal-content").hide(); // Hide the actual content during the load
    $("#see-more").hide();

    $.ajax({
      url: `https://randomuser.me/api/?results=${maxProfiles}`,
      dataType: "json",
      success: function (data) {
        allProfiles = data.results; // Store all profiles at once
        setTimeout(() => {
          renderProfiles(); // Initially render the first batch after a 2-second delay
        }, 100); // Delay of 2 seconds to simulate loading
      },
      error: function () {
        console.error("Failed to fetch profiles.");
        $("#skeleton-loader").hide(); // Hide skeleton if request fails
      },
    });
  }

  // Function to render the next set of profiles
  function renderProfiles() {
    let profilesToShow = allProfiles.slice(
      profilesLoaded,
      profilesLoaded + profilesPerPage
    ); // Get the next set

    profilesToShow.forEach((profile) => {
      const profileHtml = `
        <div class="profile-card">
          <div class="profile-body">
            <div class="profile-body-top">
              <img src="${profile.picture.medium}" alt="Profile picture">
              <h2>${profile.name.first} ${profile.name.last}</h2>
              <div class="profile-paragraph">
                <p>Sarah is a dedicated veterinarian who spends her days caring for animals of all shapes and sizes. She believes in the power of compassion and strives to make a positive impact on each furry patient's life.</p>
              </div>
            </div>
            <div class="profile-body-bottom">
              <h4>Interests</h4>
              <div class="categories">
                <span class="tech">Tech</span>
                <span class="edu">Education</span>
                <span class="fashion">Fashion</span>
                <span class="more">+20</span>
              </div>
            </div>
          </div>
          <button class="follow-btn">Follow</button>
          <button class="view-btn">View Profile</button>
        </div>
      `;
      $("#profile-container").append(profileHtml);
    });

    profilesLoaded += profilesToShow.length; // Track how many profiles have been loaded

    if (profilesLoaded >= maxProfiles) {
      $("#see-more").hide(); // Hide "See More" when all profiles are loaded
    } else {
      $("#see-more").fadeIn(); // Show "See More" if more profiles are available
    }

    // Hide the skeleton loader and show the actual modal content
    $("#skeleton-loader").hide(); // Hide skeleton after the initial load
    $("#modal-content").fadeIn(); // Show content after initial load

    // Attach the click event to the "+20" button to show all interests
    $("#profile-container").on("click", ".more", function () {
      let profileBody = $(this).closest(".profile-body"); // Reference the profile body
      let categoriesContainer = $(this).closest(".categories");

      // Prevent multiple interestsContent being added
      if (profileBody.find(".expanded-interests").length > 0) {
        return; // Exit if the content already exists
      }
      // Hide the original profile body content
      profileBody.find(".profile-body-top").hide();
      profileBody.find(".profile-body-bottom").hide();

      // Create the expanded interests list and close button
      let interestsContent = `
        <div class="expanded-interests">
        <div class="interest-header">
          <button class="close-interests"><img src="./icons/close-interest.svg"/></button>
          <h4>All Interests</h4>
          </div>
          <div class="expanded-categories">
            <span class="purple">Fashion</span>
            <span class="red">Education</span>
            <span class="purple">Fashion</span>
            <span class="blue">Tech</span>
            <span class="dark-blue">Graphics Design</span>
            <span class="orange">Business</span>
             <span class="purple">Fashion</span>
            <span class="red">Education</span>
            <span class="purple">Fashion</span>
            <span class="blue">Tech</span>
            <span class="dark-blue">Graphics Design</span>
            <span class="orange">Business</span>
             <span class="purple">Fashion</span>
            <span class="red">Education</span>
            <span class="purple">Fashion</span>
            <span class="blue">Tech</span>
            <span class="dark-blue">Graphics Design</span>
            <span class="orange">Business</span>
             <span class="purple">Fashion</span>
            <span class="red">Education</span>
            <span class="purple">Fashion</span>
            <span class="blue">Tech</span>
            <span class="dark-blue">Graphics Design</span>
            <span class="orange">Business</span>
             <span class="purple">Fashion</span>
            <span class="red">Education</span>
            <span class="purple">Fashion</span>
            <span class="blue">Tech</span>
            <span class="dark-blue">Graphics Design</span>
            <span class="orange">Business</span>
            <!-- Add more interests here as needed -->
          </div>
        </div>
      `;

      profileBody.append(interestsContent); // Append the expanded interests section

      // Remove the "+20" button after clicking it
      // $(this).remove();

      // Add event listener to the close button
      // $(".close-interests").on("click", function () {
      //   // Remove the expanded interests and close button
      //   $(this).closest(".expanded-interests").remove();

      //   // Restore the original profile body content
      //   profileBody.find(".profile-body-top").fadeIn();
      //   profileBody.find(".profile-body-bottom").fadeIn();
      // });
      profileBody.find(".close-interests").on("click", function () {
        // Remove the expanded interests and close button
        $(this).closest(".expanded-interests").remove();

        // Restore the original profile body content
        profileBody.find(".profile-body-top").fadeIn();
        profileBody.find(".profile-body-bottom").fadeIn();
      });
    });
  }

  // "See More" button click event (no skeleton on subsequent loads)
  $("#see-more").click(function () {
    if (profilesLoaded < maxProfiles) {
      $("#see-more").hide(); // Hide "See More" temporarily

      setTimeout(() => {
        renderProfiles(); // Load and show more profiles without skeleton
      }, 500); // Short delay for smooth loading experience
    }
  });

  // Load all profiles when the page is ready (initial load with skeleton)
  fetchAllProfiles();
});

$(document).ready(function () {
  const maxProfiles = 15;
  const userList = $("#user-list");

  // Fetch profiles from the API
  $.getJSON(
    `https://randomuser.me/api/?results=${maxProfiles}`,
    function (data) {
      const profiles = data.results.map((user) => {
        // Combine first and last names and limit total length to 11 characters
        let fullName = `${user.name.first} ${user.name.last}`;
        fullName = fullName.replace(/\s+/g, " "); // Ensure single space between names

        // Split names and adjust their lengths
        let [firstName, lastName] = fullName.split(" ");
        const totalLength = 11; // Maximum length for names without space
        const firstNameLength = Math.min(
          firstName.length,
          Math.floor(totalLength / 2)
        );
        const lastNameLength = totalLength - firstNameLength;

        firstName = firstName.slice(0, firstNameLength);
        lastName = lastName.slice(0, lastNameLength);

        fullName = `${firstName} ${lastName}`; // Combine with the space

        // Randomly decide if the user should have the verified icon
        const isVerified = Math.random() < 0.5; // 50% chance

        return `
          <li>
            <img loading="lazy" src="${user.picture.thumbnail}" />
            <span>${fullName}
              ${
                isVerified
                  ? `<img class="verified-icon" src="./icons/verified-user.svg" alt="Verified" />`
                  : ""
              }
            </span>
            <a href="#">${
              user.gender === "female"
                ? "Follow"
                : `<svg data-icon="search"><use href="./icons/sprite.svg#done" /></svg>`
            }</a>
          </li>
        `;
      });

      userList.html(profiles.join("")).addClass("loaded");
    }
  );
});

$(document).ready(function () {
  // Initially hide notification and request content, show skeleton loaders
  $("#notification-content").addClass("skeleton-hide");
  $("#request-content").addClass("skeleton-hide");
  $(".top-message-items").addClass("skeleton-hide");

  $("#skeleton-loaders").removeClass("skeleton-hide");
  $("#request-loaders").addClass("skeleton-hide");
  $("#message-loaders").addClass("skeleton-hide");
  $("#saved-skeleton").removeClass("skeleton-hide");
  $("#saved-skeleton-work").removeClass("skeleton-hide");

  $("#saved-content").addClass("skeleton-hide");
  $("#work_list").addClass("skeleton-hide");

  $("#noti-search").addClass("skeleton-hide");
  $("#search-skeleton").removeClass("skeleton-hide");
  $("#comment-post-skeleton").removeClass("skeleton-hide");
  $(".notification-list").addClass("skeleton-hide");
  $("#add-skeleton").removeClass("skeleton-hide");
  $(".advertisment").addClass("skeleton-hide");
  $(".add-noti-skeleton").removeClass("skeleton-hide");
  $(".notification-and-advertisiment").addClass("skeleton-hide");

  let isRequestLoaded = false;
  let isMessageLoaded = false;

  // Function to load notifications
  function loadNotifications() {
    setTimeout(() => {
      $("#skeleton-loaders").addClass("skeleton-hide");
      $("#notification-content").removeClass("skeleton-hide");

      $("#noti-search").removeClass("skeleton-hide");
      $("#search-skeleton").addClass("skeleton-hide");
      $("#comment-post-skeleton").addClass("skeleton-hide");
      $(".notification-list").removeClass("skeleton-hide");
      $("#add-skeleton").addClass("skeleton-hide");
      $(".advertisment").removeClass("skeleton-hide");
      $(".add-noti-skeleton").addClass("skeleton-hide");
      $(".notification-and-advertisiment").removeClass("skeleton-hide");
    }, 2000);
  }
  function loadSaved() {
    setTimeout(() => {
      $("#saved-skeleton").addClass("skeleton-hide");
      $("#saved-content").removeClass("skeleton-hide");
    }, 2000);
  }

  function loadWork() {
    setTimeout(() => {
      $("#saved-skeleton-work").addClass("skeleton-hide");
      $("#work_list").removeClass("skeleton-hide");
    }, 2000);
  }

  $("#request-center").on("click", function () {
    if (!isRequestLoaded) {
      $("#request-loaders").removeClass("skeleton-hide");
      $("#request-content").addClass("skeleton-hide");

      setTimeout(() => {
        $("#request-loaders").addClass("skeleton-hide");
        $("#request-content").removeClass("skeleton-hide");

        isRequestLoaded = true;
      }, 3000);
    } else {
      $("#request-loaders").addClass("skeleton-hide");
      $("#request-content").removeClass("skeleton-hide");
    }
  });

  $("#Message-btn").on("click", function () {
    if (!isMessageLoaded) {
      $("#message-loaders").removeClass("skeleton-hide");
      $(".top-message-items").addClass("skeleton-hide");

      setTimeout(() => {
        $("#message-loaders").addClass("skeleton-hide");
        $(".top-message-items").removeClass("skeleton-hide");

        isMessageLoaded = true;
      }, 3000);
    } else {
      $("#message-loaders").addClass("skeleton-hide");
      $(".top-message-items").removeClass("skeleton-hide");
    }
  });
  $("#comment-loader").removeClass("skeleton-hide");
  $(".post-related-group").addClass("skeleton-hide");
  $("#comment-post-skeleton").removeClass("skeleton-hide");
  $(".comment-contents").addClass("skeleton-hide");
  let isCommentLoad = false;
  $(".row-4").on("click", function () {
    if (!isCommentLoad) {
      $("#comment-loader").removeClass("skeleton-hide");
      $(".post-related-group").addClass("skeleton-hide");
      $("#comment-post-skeleton").removeClass("skeleton-hide");
      $(".comment-contents").addClass("skeleton-hide");

      setTimeout(() => {
        $("#comment-loader").addClass("skeleton-hide");
        $(".post-related-group").removeClass("skeleton-hide");
        $("#comment-post-skeleton").addClass("skeleton-hide");
        $(".comment-contents").removeClass("skeleton-hide");

        isCommentLoad = true;
      }, 3000);
    } else {
      $("#comment-loader").addClass("skeleton-hide");
      $(".post-related-group").removeClass("skeleton-hide");
      $("#comment-post-skeleton").addClass("skeleton-hide");
      $(".comment-contents").removeClass("skeleton-hide");
    }
  });

  // Start loading
  loadNotifications();
  loadSaved();
  loadWork();
});

// script.js

// Time Ago function (you can use a library like moment.js or write your own)
function timeAgo(date) {
  console.log("Date passed to timeAgo:", date); // Log the date value

  // Parse the provided date string
  const parsedDate = new Date(date); // Use Date constructor for parsing

  if (isNaN(parsedDate)) {
    return "Invalid date"; // Return "Invalid date" if parsing fails
  }

  // Get the current time
  const now = new Date();

  // Calculate the difference in milliseconds
  const diff = now - parsedDate; // Difference in milliseconds

  // Convert difference to minutes, hours, and days
  const minutes = Math.floor(diff / 60000); // 60,000 ms in 1 minute
  const hours = Math.floor(diff / 3600000); // 3,600,000 ms in 1 hour
  const days = Math.floor(diff / 86400000); // 86,400,000 ms in 1 day

  // Determine the correct time representation
  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (days < 365) {
    // For time within the same year
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    // If it's over a year
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

const hashtags = [
  "#webdevelopment",
  "#javascript",
  "#frontend",
  "#coding",
  "#tech",
  "#programming",
  "#html",
  "#css",
  "#reactjs",
  "#nodejs",
  "#expressjs",
  "#api",
  "#webdesign",
  "#fullstack",
  "#developer",
  "#softwareengineering",
];

function getRandomHashtags() {
  const shuffled = hashtags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3); // Select 3 random hashtags
}

// Helper function to return a random task title
function getRandomTaskTitle() {
  const tasks = [
    "Complete the Data Dive",
    "Prepare Presentation",
    "Brainstorm New Ideas",
    "Analyze Market Trends",
    "Update User Profiles",
    "Develop the Deployment Strategy",
    "Close the Contract Countdown",
    "Develop the Deployment Strategy",
    "Prepare the Product Presentation",
    "Wrap Up the Weekly Wins",
    "Initiate the Client Collaboration",
    "Finalize the Design Details",
    "Polish the Project Plan",
    "Conquer the Code Crunch",
    "Blueprint the Future Vision",
    "Tackle the To-Do Tornado",
    "Launch the Marketing Masterpiece",
    "Organize the Inbox Overhaul",
  ];

  return tasks[Math.floor(Math.random() * tasks.length)];
}

// Helper function to return a random type
function getRandomType() {
  const types = ["repost", "new", "priority"];
  return types[Math.floor(Math.random() * types.length)];
}

// Helper function to return a random number in a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to return random task music
function getRandomMusic() {
  const musics = [
    "",
    "./music/running_chinese.mp3",
    "./music/Salam-Alaikum.mp3",
    "./music/sec.mp3",
    "./music/cool_down.mp3",
    "./music/thinking_droplet.mp3",
    "./music/water.mp3",
  ];

  return musics[Math.floor(Math.random() * musics.length)];
}

// Helper function to return random task images
function getRandomTaskImages() {
  // Get a random number of images (min 1, max 7)
  const numberOfImages = Math.floor(Math.random() * 7) + 1;

  console.log(freeImages[0]);
  // Shuffle the array to ensure random selection
  const shuffledImages = freeImages.sort(() => 0.5 - Math.random());

  // Return a subset of the shuffled array based on random number of images
  return shuffledImages.slice(0, numberOfImages);
}

const freeImages = [
  "https://images.unsplash.com/photo-1720048171419-b515a96a73b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727252161075-0deb18037173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  "https://plus.unsplash.com/premium_photo-1727456264026-13bbc29d49b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727400068319-565c56633dc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727399535326-65e21b522ccb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1608975321561-176c1b187d24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1616043076499-633ae2a7a357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1599437120129-04fcdf9b277f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1619005718925-4cb33cff6bed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1715418554358-d34e420b18ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1706212825296-b2bebf3de002?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1727098562186-3dffdb16ef22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1671826911671-b67a378ab2ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1594363482433-07ba7d4ac8c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1606913852449-8ebf553565cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1617039346892-d72191157374?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1574281570877-bd815ebb50a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1611095006350-afe920e25979?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1611095006345-9b2577b83717?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1535949686800-a6b928ce2fd5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673734625279-2738ecf66fa1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1611095006346-d5e3313245e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1622377036957-4db3d2eda1a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1599670998937-441a3a74b2f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1665413642308-c5c1ed052d12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1682125177822-63c27a3830ea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1493552152660-f915ab47ae9d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1542272201-b1ca555f8505?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1676478746576-a3e1a9496c23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1527769929977-c341ee9f2033?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdhbGxwYXBlcnxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1708110770188-3e4216b93119?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1707932495000-5748b915e4f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://plus.unsplash.com/premium_photo-1675186049419-d48f4b28fe7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1571513800374-df1bbe650e56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8RmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1485231183945-fffde7cc051e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEZhc2hpb258ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1727774477390-2c1d534a28e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxM3x8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1727638786395-6df4fc4a2048?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1720048171419-b515a96a73b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727252161075-0deb18037173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
  "https://plus.unsplash.com/premium_photo-1727456264026-13bbc29d49b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727400068319-565c56633dc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
  "https://images.unsplash.com/photo-1727399535326-65e21b522ccb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
];

$(document).ready(function () {
  $(".cover__img").each(function (index) {
    if (freeImages[index]) {
      $(this).attr("src", freeImages[index]);
    }
  });
});

async function generateUsersWithTasks(length = 100) {
  try {
    const response = await fetch(
      `https://randomuser.me/api/?results=${length}`
    );
    const data = await response.json();

    const usersWithTasks = data.results.map((user, i) => {
      console.log("the timeee", user.dob.date);

      return {
        id: i + 1,
        username: `${user.name.first} ${user.name.last}`,
        userPhoto: user.picture.medium,
        taskTitle: getRandomTaskTitle(),
        seen: getRandomNumber(1, 10),
        likes: getRandomNumber(20, 200),
        music: getRandomMusic(),
        height: getRandomNumber(250, 400),
        type: getRandomType(),
        taskImages: getRandomTaskImages(),
        tags: getRandomHashtags(),
        date: timeAgo(user.dob.date),
      };
    });

    return usersWithTasks;
  } catch (error) {
    console.error("Error fetching data from API:", error);
  }
}

generateUsersWithTasks(2);

$(document).ready(function () {
  async function loadPosts() {
    try {
      const users = await generateUsersWithTasks(100);
      insertPostsToHTML(users);

      console.log("Fetched users:", users); // Debug: Check fetched data
      if (!users || users.length === 0) {
        console.error("No users fetched from API");
        return;
      }
      insertPostsToHTML(users);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  }

  function insertPostsToHTML(posts) {
    // function updateAvatar(
    //   $element,
    //   user,
    //   placeholder = "./icons/default-avatar.svg"
    // ) {
    //   const userPhoto = user?.userPhoto || placeholder;
    //   $element.find(".user-avatar").attr("src", userPhoto);
    // }
    $(".notifiy-list li").each(function (index) {
      if (posts[index]) {
        if (index >= posts.length) {
          console.warn(`Skipping list item ${index + 1}: No matching post`);
          return;
        }
        const user = posts[index];

        // Debug: Log user data
        console.log(`Updating list item ${index + 1}`, user);

        // Update the avatar image
        $(this).find(".user-avatar").attr("src", user.userPhoto);

        // // Update the sender name
        // $(this).find(".sender__").text(user.username);

        // // Update the send time
        // $(this).find(".send__time").text(user.date);
      } else {
        console.warn(`No user data available for list item ${index + 1}`);
      }
    });

    $(".app_notification_body li").each(function (index) {
      if (posts[index]) {
        if (index >= posts.length) {
          console.warn(`Skipping list item ${index + 1}: No matching post`);
          return;
        }
        const user = posts[index];

        // Debug: Log user data
        console.log(`Updating list item ${index + 1}`, user);

        // Update the avatar image
        $(this).find(".user-avatar").attr("src", user.userPhoto);

        // // Update the sender name
        // $(this).find(".sender__").text(user.username);

        // // Update the send time
        // $(this).find(".send__time").text(user.date);
      } else {
        console.warn(`No user data available for list item ${index + 1}`);
      }
    });

    $("#request-section li").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });
    $("#the-older-list li").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });

    $("#tablet-sidebar-suggestion li").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });

    $(".header").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });

    $("#work_list .row-1").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });
    // $(".holder_name").each(function (index) {
    //   const user = posts[index];

    //   $(this).find(".user-avatar").attr("src", user.userPhoto);
    // });
    $(".post-attachment-footer img.user-avatar ").each(function (index) {
      const user = posts[index];

      $(this).attr("src", user.userPhoto);
    });
    $("#tags img.user-avatar").each(function (index) {
      const user = posts[index]; // Match the image to the post
      if (user) {
        $(this).attr("src", user.userPhoto); // Update the `src` attribute
      }
    });
    $("#mobile_header_modal img.user-avatar").each(function (index) {
      const user = posts[index]; // Match the image to the post
      if (user) {
        $(this).attr("src", user.userPhoto); // Update the `src` attribute
      }
    });

    $(".post-name-img").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });

    $(".post-related-content .post-name-img").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });
    $(".comment-contents").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });

    $(".top-message-items a").each(function (index) {
      const user = posts[index];

      $(this).find(".user-avatar").attr("src", user.userPhoto);
    });
  }
  loadPosts();
});
