const $variableWidth = $("#variableWidth");
const $prevButton = $(".mutual_slider_btn--left");
const $nextButton = $(".mutual_slider_btn--right");

let currentSlickCount;

$(document).ready(function () {
  $variableWidth.slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    initialSlide: 0, // Start from the first slide
    centerMode: false,
    variableWidth: true,
    prevArrow: $prevButton,
    nextArrow: $nextButton,
  });

  // Handle button states after each slide change
  $variableWidth.on("afterChange", function (event, slick, currentSlide) {
    const totalSlides = slick.slideCount;

    currentSlickCount = currentSlide;

    // Enable both buttons by default
    $prevButton.prop("disabled", false);
    $nextButton.prop("disabled", false);

    // Disable Prev button if at the first slide
    if (currentSlide === 0) {
      $prevButton.prop("disabled", true);
    }

    // Disable Next button if at the last slide
    if (currentSlide === totalSlides - 1 || currentSlide >= totalSlides - 2) {
      $nextButton.prop("disabled", true);
    }
  });

  // Initial state check after Slick is fully initialized
  $variableWidth.on("init", function (event, slick) {
    $variableWidth.trigger("afterChange", [null, slick, 0]);
  });
});
