/////////////////////////////////
//// Collaboration Tabs ////
/////////////////////////////////
tabsContainer.addEventListener("click", function (e) {
  const targetButton = e.target.closest(".tab");

  if (targetButton) {
    const { tab } = targetButton.dataset;
    const container = document.querySelector(`.collaboration_contents--${tab}`);

    tabRemoveActive();

    targetButton.classList.add("navbar--active");
    container.classList.remove(COLLABORATIONHIDDEN);
  }
});

/////////////////////////////////
//// Collaboration All Lists ////
/////////////////////////////////
const notFoundContainer = document.querySelector(".search_not_found");
function hideAllProfileDropdown() {
  const allDropdownEl = document.querySelectorAll(".profile_details_container");
  allDropdownEl.forEach((dropdown) => {
    dropdown.ariaHidden = true;
    dropdown.classList.add(COLLABORATIONHIDDEN);
  });
}

// Hide Profile dropdown on outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile_image")) {
    hideAllProfileDropdown();
  }
});

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
///// UNMOUNTED AND USER NAVIGATE FROM SEE ALL COLLABORATION FROM DASHBOARD PAGE /////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function initiallyLoaded() {
  const status = JSON.parse(localStorage.getItem("collaboration_see_all") ?? "false");
  const recommendedBtn = document.querySelector(".tab--recommended");
  const recommendedContainer = document.querySelector(".collaboration_contents--recommended");

  // Open Recommeded collaboration straight
  if (status) {
    tabRemoveActive();
    recommendedBtn.classList.add("navbar--active");
    recommendedContainer.classList.remove(COLLABORATIONHIDDEN);

    localStorage.setItem("collaboration_see_all", "false");
  }
}

initiallyLoaded();

function tabRemoveActive() {
  allCollabTabButtons.forEach((btn) => btn.classList.remove("navbar--active"));
  tabContents.forEach((tabContent) => tabContent.classList.add(COLLABORATIONHIDDEN));
}
