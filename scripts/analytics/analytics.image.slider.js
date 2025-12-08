const $templateImage = $("#templateImage");

$(document).ready(function () {
  initializeSlick();

  // Call updateSlickLayout after initialization
  updateSlickLayout();
});

// Function to initialize Slick carousel
function initializeSlick() {
  $templateImage.slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: "linear",
    arrows: false,
  });
}

function renderBannerImages(images = []) {
  const templateImage = document.getElementById("templateImage");

  // Destroy the existing Slick instance
  if ($templateImage.hasClass("slick-initialized")) {
    $templateImage.slick("unslick");
  }
  // Update the templateImage content
  templateImage.innerHTML = ""; // Clear existing slides
  images.forEach((img) => {
    const markup = `<div><img src="${img}" alt="Banner Image" /></div>`;
    templateImage.insertAdjacentHTML("beforeend", markup);
  });

  // Reinitialize Slick with the new content
  initializeSlick();
}

function updateSlickLayout() {
  $templateImage.slick("setPosition");
}

// Call on window resize
$(window).on("resize", function () {
  updateSlickLayout();
});
