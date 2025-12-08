$(document).ready(function () {
  // Initially hide all modals and set arrow direction
  $(".header_modal").hide();
  $(".lang-up").hide(); // Hide up arrow initially
  $(".lang-down").show(); // Show down arrow initially

  // Show header modal when #show_header_modal button is clicked
  $("#show_header_modal").click(function (event) {
    event.stopPropagation(); // Prevent click from closing modals
    $("#header_modal_list").toggle(); // Toggle header modal visibility
  });

  // Toggle language modal and arrow direction
  $(".language").click(function (event) {
    event.stopPropagation(); // Prevent click propagation to document
    $(".language-modal").toggle(); // Toggle language modal visibility
    $(".lang-up").toggle(!$(".language-modal").is(":visible")); // Show up arrow if language modal is open
    $(".lang-down").toggle($(".language-modal").is(":visible")); // Show down arrow if language modal is hidden
  });

  // Show switch account modal from header modal
  $(".switch-account").click(function (event) {
    event.stopPropagation();
    $("#header_modal_list").hide(); // Hide header modal
    $("#Switch-modal").show(); // Show switch modal
  });

  // Show add account modal from switch account modal
  $(".add-account button").click(function (event) {
    event.stopPropagation();
    $("#Switch-modal").hide(); // Hide switch modal
    $("#Add-account-modal").show(); // Show add account modal
  });

  // Close all modals and reset arrows when clicking outside
  $(document).click(function (event) {
    if (!$(event.target).closest(".header_modal_content, .language-option,  #show_header_modal").length) {
      $(".header_modal").hide(); // Hide all modals
      $(".lang-up").hide(); // Hide up arrow
      $(".lang-down").show(); // Show down arrow
    }
  });

  // Close switch modal and add account modal on their close button
  $("#Switch-modal .close-switch, #Add-account-modal .close-switch").click(function (event) {
    event.stopPropagation();
    $(".header_modal").hide(); // Hide all modals
    $(".lang-up").hide(); // Reset up arrow visibility
    $(".lang-down").show(); // Reset down arrow visibility
  });
});
