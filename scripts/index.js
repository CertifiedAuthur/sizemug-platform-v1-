// On document load scroll to the top
document.addEventListener("load", () => {
  window.scrollTo(0, 0);
});

if (window.innerWidth < 667) {
  document.querySelector("svg.mug-icon").style.width = 70;
  document.querySelector("svg.mug-icon").style.height = 70;
}

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// Development Mode: Set to true to bypass authentication
const DEV_MODE = true;

const onboardingPage = document.querySelector(".onboarding_page");
const landingPageHeader = document.querySelector("body .header");
const landingPageContentArea = document.querySelector("body .content_area");
const dashboardIntroModal = document.querySelector(".landing_welcome");
const mainDashboardSubHeader = document.getElementById("mainDashboardSubHeader");

function redirect() {
  // Development mode bypass
  if (DEV_MODE) {
    console.log("DEV_MODE enabled - bypassing authentication");
    return openDashboardHasOldUser();
  }
  
  const userStatus = localStorage.getItem("sizemug_status");

  if (userStatus) {
    if (userStatus === "mid-start") {
      return openDashboardFromOnboarding();
    }
    if (userStatus === "mid-end") {
      return openDashboardHasNewUser();
    }

    if (userStatus === "old") {
      return openDashboardHasOldUser();
    }
  } else {
    location.href = "/";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const loadingType = localStorage.getItem("sizemug_loading_type");
  const onboardLoadingContainer = document.getElementById("onboard_loading_container");

  if (!loadingType) {
    onboardLoadingContainer.classList.remove("homepage-hidden");

    setTimeout(() => {
      onboardLoadingContainer?.classList.add("homepage-hidden");
      callAPIs();
    }, 3000);
  } else {
    onboardLoadingContainer.classList.add("homepage-hidden");
    callAPIs();
  }

  function callAPIs() {
    localStorage.removeItem("sizemug_loading_type"); // clear localstorage
    redirect(); // redirect

    // Fetch Landing Grid layout :)
    // I have to must the call here so that masonry layout will be well organized
    ///////// IIFE for landing task display
    (async () => {
      renderGridContainerSkeleton();
      const data = await generateUsersWithTasks();
      if (data) {
        gridContainerSkeleton.remove();
        const gridContainerEl = document.querySelector(".gridContainer");
        populateGridLayout(data, gridContainerEl, dashboardMainMasonryInstance);
        gridDataItem = data;
      }
    })();
  }
});

function openDashboardFromOnboarding() {
  onboardingPage.classList.remove(HIDDEN);
}

function openDashboardHasNewUser() {
  onboardingPage.classList.add(HIDDEN);
  landingPageHeader.classList.remove(HIDDEN);
  landingPageContentArea.classList.remove(HIDDEN);
  dashboardIntroModal.classList.remove(HIDDEN);

  setTimeout(async () => {
    renderGridContainerSkeleton();
    const data = await generateUsersWithTasks();
    if (data) {
      gridContainerSkeleton.remove();
      const gridContainerEl = document.querySelector(".gridContainer");
      populateGridLayout(data, gridContainerEl, dashboardMainMasonryInstance);
      gridDataItem = data;
    }
  }, 2000);
}

function openDashboardHasOldUser() {
  onboardingPage.classList.add(HIDDEN);
  dashboardIntroModal.classList.add(HIDDEN);
  landingPageHeader.classList.remove(HIDDEN);
  landingPageContentArea.classList.remove(HIDDEN);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
function setToLocalStorage(name, data) {
  return localStorage.setItem(name, JSON.stringify(data));
}

function getFromLocalStorage(name) {
  return JSON.parse(localStorage.getItem(name)) ?? "";
}

///////////////////////////////////////////////
//////// Task Listing functionalities /////////
///////////////////////////////////////////////
const tabletTasks = [
  {
    status: "pending",
    title: "Business Case",
    completed_task: 0,
    remain_task: 10,
    collaborators: [
      {
        image: "",
        name: "",
      },
      {
        image: "",
        name: "",
      },
    ],
    image: "",
    isShared: false,
  },

  {
    status: "completed",
    title: "Project Management",
    completed_task: 0,
    remain_task: 30,
    collaborators: [],
    image: "",
    isShared: false,
  },
];

///////////////////////////////
/// All About Creating Task ///
///////////////////////////////
// Homepage navbar create btn functionlaity
const createNavbarBtn = document.querySelector(".main_header_createBtn");

createNavbarBtn.addEventListener("click", () => {
  const createNavbarOverlay = document.querySelector(".create-collaborate-overlay");
  createNavbarOverlay.classList.remove(HIDDEN);
});

/**
 * Show Create task Modal
 */
const editCreateBtn = document.querySelectorAll("#add_new_task");
editCreateBtn.forEach((btn) => {
  btn.addEventListener("click", function () {
    showCreateTaskModal();
  });
});

///////////////////////////////////////////////
/////// Task Description and Suggestion ///////
///////////////////////////////////////////////
const landingPageContent = document.querySelector(".landing_page");
const taskDescriptionSuggestionContainer = document.querySelector(".task_description_suggestion_container");
const taskDescriptionContainer = document.querySelector(".task_description_container");
const taskSuggestionContainer = document.querySelector(".task_suggestion_wrapper");
const suggestionCommentContainer = document.querySelector(".suggestion_comment--container");
const descriptionSticky = document.querySelector(".task_description_sticky_btns");
const modalDescriptionHeaderLinkContainer = document.querySelector(".modal_description_header_editor--link");
const modalDescriptionLink = document.querySelector(".modal_description_only_editor--link");

///////////////////////////////////////////////
///////// Editing Task header content /////////
///////////////////////////////////////////////
const taskHeader = document.querySelector(".task_description_header");
const taskDescription = document.querySelector(".task_description_describing");
const taskHeaderForm = document.querySelector(".task_description_main_content .header .form"); // prettier-ignore
const taskDecriptionForm = document.querySelector(".task_description_main_content .description .form"); // prettier-ignore
const startEditingHeaderBtn = document.querySelector(".btn_edit_title");
const startEditingDescriptionBtn = document.querySelector(".btn_edit_description"); // prettier-ignore
const headerContentEditable = document.querySelector(".task_description_header_editor"); // prettier-ignore
const headerEditor = document.querySelector("#description_editor--header");

// Header Next line move & Enter event
const editableDivHeader = document.querySelector(".editableHeaderDiv");

//////////////////////////////////////
// Link Handler for description editor
//////////////////////////////////////
// Header
const descriptionLinkBtn = document.querySelector("#description-link");
const headerDescriptionEditor = document.querySelector(".task_description_header_editor");

// Description
const descriptionLinkEditorBtn = document.querySelector("#description-content-link"); // prettier-ignore
const modalDescriptionLinkContainer = document.querySelector(".modal_description_only_editor--link"); // prettier-ignore
const descriptionLinkOkButton = modalDescriptionLinkContainer.querySelector("button"); // prettier-ignore

descriptionLinkOkButton.addEventListener("click", function (event) {
  event.preventDefault();

  const text = modalDescriptionLinkContainer.querySelector('[name="text"]').value; // prettier-ignore
  const url = modalDescriptionLinkContainer.querySelector('[name="url"]').value; // prettier-ignore

  if (!url || !text) return;

  // Hide the modal
  modalDescriptionLinkContainer.classList.add(HIDDEN);

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text; // range.toString();

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
  const formWrapper = document.querySelector(".modal_description--wrapper"); // prettier-ignore
  formWrapper.requestFullscreen();
});

const descriptionEditor = document.querySelector(".task_description_editor"); // prettier-ignore

// click on description
const descriptionContentEditable = document.querySelector(".task_description_editor"); // prettier-ignore

// Sharing to follower/following only
const sharingToFollowBtns = document.querySelectorAll(".sharing_to_follower");

sharingToFollowBtns.forEach((btn) =>
  btn.addEventListener("click", function () {
    followOverlay.classList.remove(HIDDEN);
  })
);

// Mobile button to cancel modal
document.querySelectorAll(".mobile_cancel--btn").forEach((cancel) =>
  cancel.addEventListener("click", function (e) {
    const target = e.target;
    const parent = target.closest(".mobile_cancel--btn");
    const targetButton = target.classList.contains("mobile_cancel--btn");

    if (parent || targetButton) {
      parent.closest(".overlay").classList.add(HIDDEN);
    }
  })
);

// Comment Open Event
const replyBtn = document.querySelectorAll(".comment-lr-group .comment-reply");
const commentReply = document.querySelectorAll(".comment-contents.replied-comment"); // prettier-ignore

replyBtn.forEach((btn) =>
  btn.addEventListener("click", () => {
    commentReply.forEach((reply) => {
      if (reply.classList.contains(HIDDEN)) {
        reply.classList.remove(HIDDEN);
      } else {
        reply.classList.add(HIDDEN);
      }
    });
  })
);

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Render Create Task Modal Interests ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
function renderCreateTaskModalInterests() {
  sizemugGlobalInterests.forEach((interest) => {
    const markup = `<div class="category" data-category="${interest.value}">${interest.label}</div>`;
    document.getElementById("create_task_categories").insertAdjacentHTML("beforeend", markup);
  });
}
renderCreateTaskModalInterests();

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////// SEE ALL COLLABORATIONS ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
const seeAllCollaborations = document.getElementById("see_all_collaborations");

seeAllCollaborations.addEventListener("click", () => {
  location.href = "/collaborations.html";
  localStorage.setItem("collaboration_see_all", "true");
});
