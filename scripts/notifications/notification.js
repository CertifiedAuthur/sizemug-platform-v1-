// Outside click of Profile Modal
document.body.addEventListener("click", (e) => {
  if (!e.target.closest(".user_profile")) {
    document.querySelectorAll(".header_modal").forEach((modal) => modal.classList.add("hide-list"));
  }
});

$(document).ready(function () {
  $(".app_notification_footer").on("click", function () {
    window.location.href = "notification.html";
  });
  $("#explore").on("click", function () {
    window.location.href = "notification.html";
  });

  $("#show_header_modal").on("click", function (e) {
    e.stopPropagation();
    $("#header_modal_list").removeClass("hide-list");
  });

  $(".switch-account").on("click", function (e) {
    e.stopPropagation();
    $("#Switch-modal").removeClass("hide-list");
    $("#header_modal_list").addClass("hide-list");
  });

  $(".add-account").on("click", function (e) {
    e.stopPropagation();
    $("#Add-account-modal").removeClass("hide-list");
  });

  $(".header_modal").click(function (e) {
    if (!$(e.target).hasClass("header_modal")) return;
    $(".header_modal").addClass("hide-list");
  });

  $(".close-switch").on("click", function (e) {
    e.stopPropagation();
    $(".header_modal").addClass("hide-list");
    $("#Add-account-modal").addClass("hide-list");
  });

  $("#mobile_header_modal").on("click", function () {
    $("#header_modal_list").removeClass("hide-list");
  });

  $(".Ad").on("click", function () {
    $("#ad-modal").removeClass("hid");
  });

  $(".Why").on("click", function () {
    $("#Seeing").removeClass("hid");
  });

  $(".close-ad").on("click", function () {
    $(".modal").addClass("hid");
  });

  $(".ad-yes").on("click", function () {
    $(".modal").addClass("hid");
  });

  $(".ad-no").on("click", function () {
    $(".modal").addClass("hid");
  });

  $(".Hide").on("click", function () {
    $("#hide-report-modal").removeClass("hid");
  });

  $(".report-ad").on("click", function () {
    $("#Report").removeClass("hid");
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        modal.classList.add("hid");
      }
    });
  });

  /**
   *
   *
   *
   * Notification Page Tab
   *
   *
   */
  let currentSection = "all"; // Default section is "all"

  // Show all lists when 'All' is clicked
  $(".all").on("click", function () {
    $(".notifiy-list, .notification-request-list").removeClass("hide-list");
    $("#No-list").remove(); // Remove No-list from both sections
    $(".notification").removeClass("checked");
    $(".all").addClass("checked");
    $(".requests").removeClass("checked");
    currentSection = "all"; // Update current section
  });

  // Show only the notify-list when 'Notification' is clicked
  $(".notification").on("click", function () {
    $(".notifiy-list").removeClass("hide-list");
    $(".notification-request-list").addClass("hide-list");
    $("#No-list").remove(); // Remove No-list from both sections
    $(".notification").addClass("checked");
    $(".all").removeClass("checked");
    $(".requests").removeClass("checked");
    currentSection = "notification"; // Update current section
  });

  // Show only the notification-request-list when 'Request' is clicked
  $(".requests").on("click", function () {
    $(".notifiy-list").addClass("hide-list");
    $(".notification-request-list").removeClass("hide-list");
    $(".notification").removeClass("checked");
    $(".requests").addClass("checked");
    $(".all").removeClass("checked");
    currentSection = "request"; // Update current section
  });

  // Delete request list independently
  $(document).on("click", ".cancel-req", function () {
    $(this).closest(".list").remove();

    // Check if all request lists are deleted
    if ($(".notification-request-list .list").length === 0) {
      // Ensure no "No-list" message is rendered in the all section
      if (currentSection === "request") {
        $("#request-section").append(`
          <div class="no_request_notifications" style="height: 100%; width: 100%; display: flex; flex-direction: column; padding-top: 4rem; justify-content: flex-start !important;">
            <img src="/icons/notification_icons/no-list.svg" alt="" style="height: 9rem; width: 9rem"/>
            <h2>No Notification Request</h2>
            <p>
              You haven't created any list yet. <br />
              Organize your items, tasks or posts <br />
              by creating your first list.
            </p>
            <a href="/notification.html">
              <span> Notifications &nbsp; </span>
              <img src="/icons/notification_icons/Arrow_right.svg" alt="" style="width: 1.5rem; height: 1.5rem" />
            </a>
          </div>
        `);
      }
    }
  });
});
