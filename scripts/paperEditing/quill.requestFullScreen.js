document.addEventListener("DOMContentLoaded", function () {
  const requestFullScreenBtn = document.getElementById("sizemug_request_full_screen--btn");
  const fullScreenDocumentElement = document.querySelector(".fullScreen_document_element");

  const elem = document.documentElement;
  [fullScreenDocumentElement, requestFullScreenBtn].forEach((button) => {
    button.addEventListener("click", () => {
      toggleFullscreen(elem);
      closeDropdownBar(); // close all dropdown
    });
  });
});

function toggleFullscreen(elem) {
  if (
    !document.fullscreenElement && // Standard API
    !document.mozFullScreenElement && // Firefox
    !document.webkitFullscreenElement && // Chrome, Safari, Opera
    !document.msFullscreenElement // IE/Edge
  ) {
    // Enter fullscreen
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // Firefox
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      // Chrome, Safari, and Opera
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE/Edge
      elem.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari, and Opera
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document.msExitFullscreen();
    }
  }
}
