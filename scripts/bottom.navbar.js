/**
 * Everything related to mobile and tablet sticky bottom navbar
 */

const bottomNavbar = document.getElementById("bottom_navbar");

bottomNavbar.addEventListener("click", (e) => {
  const target = e.target;

  // Show More Button
  const showMore = target.closest("#bottom_navbar_show_more");
  if (showMore) {
    const mobileBarContainer = document.querySelector(
      ".mobile_additional_modal"
    );
    mobileBarContainer.classList.remove(HIDDEN);
    return;
  }
});
