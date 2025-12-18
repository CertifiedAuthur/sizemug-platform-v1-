// Birthday Celebrant Dropdown Functionality
$(document).ready(function () {
  console.log("🎂 Birthday dropdown script loaded");
  
  // Check if elements exist
  const selectedItem = $(".selected-item");
  const dropdownOptions = $(".dropdown-options");
  const customDropdown = $(".custom-dropdown");
  
  console.log("Selected item found:", selectedItem.length);
  console.log("Dropdown options found:", dropdownOptions.length);
  console.log("Custom dropdown found:", customDropdown.length);
  
  // Toggle dropdown on click
  $(".selected-item").on("click", function (e) {
    e.stopPropagation();
    console.log("✅ Selected item clicked!");
    
    $(".dropdown-options").toggle();
    console.log("Dropdown visible:", $(".dropdown-options").is(":visible"));
    
    // Rotate arrow
    const arrow = $(this).find(".dropdown-arrow");
    if ($(".dropdown-options").is(":visible")) {
      arrow.css("transform", "rotate(180deg)");
      console.log("🔽 Arrow rotated down");
    } else {
      arrow.css("transform", "rotate(0deg)");
      console.log("🔼 Arrow rotated up");
    }
  });

  // Handle option selection
  $(".dropdown-options li").on("click", function (e) {
    e.stopPropagation();
    console.log("👤 User option clicked");
    
    // Remove selected class from all items
    $(".dropdown-options li").removeClass("selected");
    // Add selected class to clicked item
    $(this).addClass("selected");

    // Get selected user's name and image
    const selectedName = $(this).find("span").text();
    const selectedImage = $(this).find("img").attr("src");
    const selectedValue = $(this).data("value");

    console.log("Selected user:", selectedName, "Value:", selectedValue);

    // Update the displayed selection
    $(".placeholder-birthday span").text(selectedName);
    $(".selected-avatar").attr("src", selectedImage);

    // Store selected value (can be used when submitting form)
    $(".custom-dropdown").data("selected-user", selectedValue);

    // Hide dropdown after selection
    $(".dropdown-options").hide();
    $(".dropdown-arrow").css("transform", "rotate(0deg)");
    console.log("✅ Selection complete, dropdown closed");
  });

  // Close dropdown when clicking outside
  $(document).on("click", function (e) {
    if (!$(e.target).closest(".custom-dropdown").length) {
      const wasVisible = $(".dropdown-options").is(":visible");
      $(".dropdown-options").hide();
      $(".dropdown-arrow").css("transform", "rotate(0deg)");
      if (wasVisible) {
        console.log("🚪 Dropdown closed (clicked outside)");
      }
    }
  });
  
  console.log("🎂 Birthday dropdown initialized successfully");
});
