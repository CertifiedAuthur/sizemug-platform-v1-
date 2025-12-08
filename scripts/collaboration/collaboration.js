"use strict";

/////////////////////////
///// Overlay Click /////
/////////////////////////
const overlays = document.querySelectorAll(".overlay");
overlays.forEach((overlay) =>
  overlay.addEventListener("click", function (event) {
    if (event.target.classList.contains("share_collaboration--controller")) {
      return overlay.classList.add(COLLABORATIONHIDDEN);
    }

    if (event.target.classList.contains("overlay")) {
      overlay.classList.add(COLLABORATIONHIDDEN);
    }
  })
);

// This must be at the top, so that data will be already fill into the right dom before selecting & adding event to elements
// Filling country/subject with data in data.js file
// country

function populateCollaborationHeaderDropdown(container, data) {
  container.innerHTML = "";

  data.forEach((d) => {
    const markup = `
     <li role="button" aria-selected="false" data-label="${d.label}" data-value="${d.value}">
        <span>${d.label}</span>
        <span class="checked">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6654 1L5.4987 10.1667L1.33203 6" stroke="#8837E9" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </li>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

const collaborationHeaderCountry = document.getElementById("collaborationHeaderCountry");
populateCollaborationHeaderDropdown(collaborationHeaderCountry, globalCountriesData);
const collaborationHeaderSubject = document.getElementById("collaborationHeaderSubject");
populateCollaborationHeaderDropdown(collaborationHeaderSubject, globalInterestsData);
const suggestionModalCitiesCollabList = document.getElementById("suggestionModalCitiesCollabList");
populateCollaborationHeaderDropdown(suggestionModalCitiesCollabList, globalStatesData);

/**
 * A NodeList of elements with the class "suggestion_modal_dropdown".
 * These elements are intended to be used for handling dropdown interactions
 * within the suggestion modal.
 *
 * @type {NodeListOf<Element>}
 */
const collaborationModalDropdowns = document.querySelectorAll(".collaboration_modal_dropdown");
const collaborationDropdownCountryContainer = document.getElementById("collaborationDropdownCountryContainer");
const collaborationDropdownCityContainer = document.getElementById("collaborationDropdownCityContainer");

let collaborationSelectedData = [];
let collaborationAppliedData = [];

collaborationModalDropdowns.forEach((dropdown) => {
  // Add event listener for click events on each dropdown
  dropdown.addEventListener("click", function (e) {
    // Find the closest element with the class "suggestionDropdownBtn"
    const suggestionDropdownBtn = e.target.closest(".suggestionDropdownBtn");

    // If a dropdown button is clicked, expand the corresponding dropdown
    if (suggestionDropdownBtn) {
      // Collapse all dropdowns
      hideAllSuggestionDropdown();

      // Expand the clicked dropdown
      dropdown.setAttribute("aria-expanded", true);
      return;
    }

    const listItem = e.target.closest("li");
    if (listItem) {
      const suggestionDropdownMain = listItem.closest(".suggestion_dropdown--main");
      const listItems = listItem.closest("ul").querySelectorAll("li");

      const dropdownCategory = suggestionDropdownMain.getAttribute("data-dropdown-category");
      const { label, value } = listItem.dataset;

      // if the category is country
      if (dropdownCategory === "country") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        collaborationDropdownCityContainer.classList.remove(HIDDEN);
        if (window.innerWidth <= 667) {
          collaborationDropdownCityContainer.classList.add(HIDDEN);
        }

        const filtered = collaborationSelectedData.filter((data) => data.id !== "country");

        filtered.push({
          id: "country",
          label,
          value,
          apply: false,
        });

        collaborationSelectedData = filtered;

        return;
      }

      // if the category is city
      if (dropdownCategory === "cities") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        // selectedCountry = label;
        suggestionDropdownCityContainer.classList.remove(HIDDEN);

        const filtered = collaborationSelectedData.filter((data) => data.id !== "country");
        const country = collaborationSelectedData.filter((data) => data.id === "country");

        filtered.push({
          ...country,
          label: `${country.label}, ${label}`,
          value: `${country.value}, ${value}`,
        });

        collaborationSelectedData = filtered;

        return;
      }

      // Not Country or Cities
      if (dropdownCategory !== "country" || dropdownCategory !== "cities") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        const filtered = collaborationSelectedData.filter((data) => data.id !== dropdownCategory);

        filtered.push({
          id: dropdownCategory,
          label,
          value,
          apply: false,
        });

        collaborationSelectedData = filtered;
      }
    }
  });

  // Add event listener to document to handle clicks outside dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".suggestion_modal_dropdown")) {
      // Collapse all dropdowns
      hideAllSuggestionDropdown();
    }
  });
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const countryOptionsMobile = document.querySelector(".select-items--location--mobile");
const subjectOptionsMobile = document.querySelector(".select-items--subject--mobile");
const statusOptionsMobile = document.querySelector(".select-items--status--mobile");

const countryOptionItemsMobile = countryOptionsMobile.querySelectorAll(".options div");
const subjectOptionItemsMobile = subjectOptionsMobile.querySelectorAll(".options div");
const statusOptionItemsMobile = statusOptionsMobile.querySelectorAll(".options div");

const tabsContainer = document.querySelector(".collaboration_body .navbar_collab");
const tabContents = document.querySelectorAll(".tab_container");
const allCollabTabButtons = document.querySelectorAll(".navbar_collab .tab");

const stickyRequestBtn = document.querySelector(".position_req--button");

function selectOptionItem(optionItems, selectContainer, mobileViewContainer) {
  optionItems.forEach((option) => {
    option.addEventListener("click", () => {
      const containerMarks = option.closest(`${innerWidth < 667 ? ".options" : ".select-items"}`).querySelectorAll(".status--mark");
      const targetMark = option.querySelector(".status--mark");

      // hid all marks at first
      containerMarks.forEach((mark) => mark.classList.add("collaboration-hidden--id"));

      selectContainer.querySelector(".text").textContent = option.textContent; // update textContent
      targetMark?.classList.remove("collaboration-hidden--id"); // show mark for the clicked option

      // Only for mobile view
      mobileViewContainer.classList.add(COLLABORATIONHIDDEN);
      allChevron.forEach((icon) => icon.classList.add("icon_rotate--down"));
    });
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth <= 667) {
    selectOptionItem(countryOptionItemsMobile, countrySelect, countryOptionsMobile);
    selectOptionItem(subjectOptionItemsMobile, subjectSelect, subjectOptionsMobile);
    selectOptionItem(statusOptionItemsMobile, statusSelect, statusOptionsMobile);
  }
});

////////////////////////////////////
/// COLLABORATION SEARCH HANDLER ///
///////////////////////////////////
const collaborationSearchInput = document.getElementById("collaboration--input");

collaborationSearchInput.addEventListener("input", function () {
  const results = [];

  collaborationArray.map((item) => {
    if (item.name.includes(this.value)) {
      results.push(item);
    }
  });

  // Update UI to default
  handleSearchPerform("add", "remove");

  // Update UI with incoming data
  renderCollaboratorsAll(results, containerAll);
  renderCollaboratorsSaved(results, containerSaved);
  renderCollaboratorsRequested(results, containerRequested);
  renderCollaboratorsShared(results, containerShared);
});

function handleSearchPerform(methodAdd, methodRemove) {
  notFoundContainer.classList[methodAdd](COLLABORATIONHIDDEN);
  // hid all tab contents
  tabContents.forEach((tab) => tab.classList[methodRemove](COLLABORATIONHIDDEN));
  tabsContainer.classList[methodRemove](COLLABORATIONHIDDEN); // hidden tab navigation
  stickyRequestBtn.classList[methodRemove](COLLABORATIONHIDDEN); // hid overlay button if opened
}

// When document is clicked
const allProfileDetailContainer = document.querySelectorAll(".profile_details_container");

document.addEventListener("click", (event) => {
  document.querySelectorAll(".select-items").forEach((item) => item.classList.add(COLLABORATIONHIDDEN));
  // [countrySelect, subjectSelect, statusSelect].forEach((select) => select.classList.remove("custom-select--active"));

  allProfileDetailContainer.forEach((container) => {
    if (!event.target.closest(".profile_image")) {
      // container.classList.add(COLLABORATIONHIDDEN);
    }
  });
});

// Mobile Bar Additional Event
const additionalMobileBarBtn = document.querySelector(".additional_bar_options");
const mobileBarContainer = document.querySelector(".mobile_additional_modal");

additionalMobileBarBtn.addEventListener("click", function () {
  if (mobileBarContainer.classList.contains(COLLABORATIONHIDDEN)) {
    return mobileBarContainer.classList.remove(COLLABORATIONHIDDEN);
  }

  mobileBarContainer.classList.add(COLLABORATIONHIDDEN);
});

// Mobile button to cancel modal
document.querySelectorAll(".mobile_cancel--btn").forEach((cancel) =>
  cancel.addEventListener("click", function (e) {
    const target = e.target;
    const parent = target.closest(".mobile_cancel--btn");
    const targetButton = target.classList.contains("mobile_cancel--btn");

    if (parent || targetButton) {
      parent.closest(".overlay").classList.add(COLLABORATIONHIDDEN);
    }
  })
);

/////////////////////////////////
/// SHARE MODAL SELECT USERS ////
/////////////////////////////////
const shareHeaderBtns = document.querySelector(".modal_bar .btns");
const cancelModalButtons = document.querySelectorAll(".share_collaboration--controller .cancel");
const showShareModal = document.querySelectorAll(".share--btn");
const shareModalLists = document.querySelector(".modal_lists");
const shareModal = document.querySelector(".share_collaboration--controller");

// Tab Switch Clicked
shareHeaderBtns.addEventListener("click", function (event) {
  const btns = shareHeaderBtns.querySelectorAll("button");

  // remove (modal_bar--active) from all buttons
  btns.forEach((btn) => btn.classList.remove("modal_bar--active"));

  // add (modal_bar--active) to the target element
  event.target.classList.add("modal_bar--active");
});

// Row Select
const CHECK = "modal_list--checked";

shareModalLists.addEventListener("click", handleSharedModal.bind(shareModalLists));
function handleSharedModal(event) {
  const listRow = event.target.closest(".list_row");

  if (!listRow) return; // if listRow is undefined

  const checkBox = listRow.querySelector(".check");
  const checkBoxIcon = listRow.querySelector(".check i");

  if (listRow.classList.contains("list_row-all") && !checkBox.classList.contains(CHECK)) {
    const allRows = document.querySelectorAll(".modal_lists .check");

    allRows.forEach((row) => {
      row.classList.add(CHECK);
      row.querySelector("i").classList.remove(COLLABORATIONHIDDEN);
    });

    handleClassState(checkBox, "add", CHECK);
    handleClassState(checkBoxIcon, "remove", COLLABORATIONHIDDEN);
    return;
  }

  if (listRow.classList.contains("list_row-all") && checkBox.classList.contains(CHECK)) {
    const allRows = document.querySelectorAll(".modal_lists .check");

    allRows.forEach((row) => {
      row.classList.remove(CHECK);
      row.querySelector("i").classList.add(COLLABORATIONHIDDEN);
    });

    handleClassState(checkBox, "remove", CHECK);
    handleClassState(checkBoxIcon, "add", COLLABORATIONHIDDEN);
    return;
  }

  const overallCheck = document.querySelector(".list_row-all .check");
  const overallMark = overallCheck.querySelector("i");

  handleClassState(overallCheck, "remove", CHECK);
  handleClassState(overallMark, "add", COLLABORATIONHIDDEN);

  // Single Select
  if (!checkBox.classList.contains(CHECK)) {
    handleClassState(checkBox, "add", CHECK);
    handleClassState(checkBoxIcon, "remove", COLLABORATIONHIDDEN);
  } else {
    handleClassState(checkBox, "remove", CHECK);
    handleClassState(checkBoxIcon, "add", COLLABORATIONHIDDEN);
  }
}

function handleClassState(element, method, className) {
  element.classList[method](className);
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Why Showing Ads
const whyShowingAds = document.querySelectorAll(".showing_ads");
const whyAdsModal = document.querySelector(".why_modal");
const manageAdsPreference = document.querySelector(".manage_ads_preference");
const hideReportAds = document.querySelector(".hide_report_ads");
const container1 = document.querySelector(".manage_hide");
const container2 = document.querySelector(".why_seeing");
const container3 = document.querySelector(".manage_hide--option");
const manageFooter = document.querySelector(".why_modal--footer");
const manageFooterBtns = manageFooter.querySelectorAll("button");
const hideWhyModalBtn = document.querySelector(".hide_why_modal_top");
const whyWrapper = document.querySelector(".why_modal_wrapper");

whyShowingAds.forEach((btn) =>
  btn.addEventListener("click", () => {
    whyWrapper.classList.remove(COLLABORATIONHIDDEN);
    whyWrapper.classList.remove(COLLABORATIONHIDDEN);
  })
);

manageAdsPreference.addEventListener("click", () => {
  container1.classList.add(COLLABORATIONHIDDEN);
  container2.classList.remove(COLLABORATIONHIDDEN);
  manageFooter.classList.remove(COLLABORATIONHIDDEN);
});

hideReportAds.addEventListener("click", () => {
  container1.classList.add(COLLABORATIONHIDDEN);
  container3.classList.remove(COLLABORATIONHIDDEN);
  manageFooter.classList.remove(COLLABORATIONHIDDEN);
});

manageFooterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    container1.classList.remove(COLLABORATIONHIDDEN);
    container2.classList.add(COLLABORATIONHIDDEN);
    container3.classList.add(COLLABORATIONHIDDEN);
    manageFooter.classList.add(COLLABORATIONHIDDEN);
  })
);

hideWhyModalBtn.addEventListener("click", () => {
  whyWrapper.classList.add(COLLABORATIONHIDDEN);
});

// Hide Ads
const hideAds = document.getElementById("report_ads");
const reportContainer = document.querySelector(".report_modal_container");
const hideReportModal = reportContainer.querySelector(".cancel-modal");

hideAds.addEventListener("click", (e) => {
  reportContainer.classList.remove(COLLABORATIONHIDDEN);
  whyWrapper.classList.add(COLLABORATIONHIDDEN);
});

hideReportModal.addEventListener("click", function () {
  reportContainer.classList.add(COLLABORATIONHIDDEN);
});
