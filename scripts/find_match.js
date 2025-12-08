// Goals
const studentGoals = [
  { label: "Improve Time Management", value: "time-management" },
  { label: "Achieve Higher Grades", value: "higher-grades" },
  { label: "Develop Critical Thinking", value: "critical-thinking" },
  { label: "Increase Class Participation", value: "class-participation" },
  { label: "Enhance Communication Skills", value: "communication-skills" },
  { label: "Master a New Subject", value: "master-new-subject" },
  { label: "Build a Strong Work Ethic", value: "work-ethic" },
  { label: "Improve Public Speaking", value: "public-speaking" },
  { label: "Get Involved in Extracurricular Activities", value: "extracurricular-activities" },
  { label: "Improve Test-Taking Strategies", value: "test-taking" },
  { label: "Develop Leadership Skills", value: "leadership-skills" },
  { label: "Build a Portfolio", value: "build-portfolio" },
  { label: "Gain Research Experience", value: "research-experience" },
  { label: "Improve Study Habits", value: "study-habits" },
  { label: "Build Networking Skills", value: "networking-skills" },
  { label: "Enhance Problem-Solving Skills", value: "problem-solving" },
  { label: "Maintain a Healthy Work-Life Balance", value: "work-life-balance" },
  { label: "Complete Assignments on Time", value: "complete-assignments" },
  { label: "Prepare for Future Career", value: "career-preparation" },
  { label: "Develop Teamwork Abilities", value: "teamwork-abilities" },
];

const allOpenFindAMatch = document.querySelectorAll("#get_a_match");
const closeFindAMatch = document.getElementById("close_matching_modal");
const paperMatchingModal = document.getElementById("paper_matching");

function showPaperMatchingModal() {
  paperMatchingModal.classList.remove(HIDDEN);
}

function hidePaperMatchingModal() {
  paperMatchingModal.classList.add(HIDDEN);
}

allOpenFindAMatch.forEach((openFindAMatch) => {
  openFindAMatch.addEventListener("click", () => {
    showPaperMatchingModal();
    closeMobileGetMatching(); // close mobile finding matching overlay
  });
});

closeFindAMatch.addEventListener("click", hidePaperMatchingModal);

// Self Click close
paperMatchingModal.addEventListener("click", (e) => {
  if (e.target.id === "paper_matching") {
    hidePaperMatchingModal();
  }
});

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Hashtag Tagify
const taskTagsEl = document.getElementById("create_task_tags");
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Tagify
  const tagify = new Tagify(taskTagsEl, {
    whitelist: [], // your whitelist array if needed
  });

  setTimeout(() => {
    const tagifyInput = document.querySelector(".tagify__input");

    tagifyInput?.setAttribute("data-placeholder", "Enter your keywords");
    tagifyInput?.setAttribute("aria-placeholder", "Enter your keywords");
    // Clear tags after rendering
    tagify.removeAllTags();
  }, 1000);
});

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Locations & Spoken Languages
const selectOptionLocation = document.getElementById("selectOptionLocation");
const selectOptionLanguage = document.getElementById("selectOptionLanguage");
const selectOptionSubject = document.getElementById("selectOptionSubject");
const selectOptionTopic = document.getElementById("selectOptionTopic");

const goalSelectsPresentation = document.getElementById("goalSelectsPresentation");
const goalSelectsSuceed = document.getElementById("goalSelectsSuceed");
const goalSelectsCreate = document.getElementById("goalSelectsCreate");
const goalSelectsPass = document.getElementById("goalSelectsPass");
const goalSelectsAchieve = document.getElementById("goalSelectsAchieve");

function renderToSelect(data, containerEl) {
  containerEl.innerHTML = "";

  data.forEach((d) => {
    const markup = `<li role="button" value="${d.value}">${d.label}</li>`;
    containerEl.insertAdjacentHTML("beforeend", markup);
  });
}

// Locations
renderToSelect(countriesKeyValue, selectOptionLocation);
// spoken languages
renderToSelect(languagesKeyValue, selectOptionLanguage);
// Subjects
renderToSelect(subjectsKeyValue, selectOptionSubject);
// Sub-topic
renderToSelect(subTopicsKeyValue, selectOptionTopic);
// Presentation
renderToSelect(studentGoals, goalSelectsPresentation);
// Succeed
renderToSelect(studentGoals, goalSelectsSuceed);
// Create
renderToSelect(studentGoals, goalSelectsCreate);
// Pass
renderToSelect(studentGoals, goalSelectsPass);
// Achieve
renderToSelect(studentGoals, goalSelectsAchieve);

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Interests Lists
const interestsStep = document.querySelector(".interests_step");

function renderMatchingInterests() {
  const HID = location.pathname === "/paper-editing.html" ? "paper-editing-hidden" : HIDDEN;

  sizemugGlobalInterests.forEach((int) => {
    const markup = `
                <div class="interests_item">
                  <span>${int.label}</span>
                  <img src="icons/mark-brown.svg" alt="Mark" class="${HID}" />
                </div>
    `;
    interestsStep.insertAdjacentHTML("beforeend", markup);
  });
}
renderMatchingInterests();

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// const goalPresentation = document.getElementById("goal_selects--presentation");
// const goalSucceed = document.getElementById("goal_selects--suceed");
// const goalCreate = document.getElementById("goal_selects--create");
// const goalPass = document.getElementById("goal_selects--pass");
// const goalAchieve = document.getElementById("goal_selects--achieve");

// function renderGoalSelect(containerEl) {
//   studentGoals.forEach((goal) => {
//     const markup = `<option value="${goal.value}">${goal.label}</option>`;
//     containerEl.insertAdjacentHTML("beforeend", markup);
//   });
// }
// renderGoalSelect(goalPresentation);
// renderGoalSelect(goalSucceed);
// renderGoalSelect(goalCreate);
// renderGoalSelect(goalPass);
// renderGoalSelect(goalAchieve);

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Navigating functionalities
const paperCancelBtn = document.getElementById("paper_matching--cancel");
const paperNextBtn = document.getElementById("paper_matching--next");

const detailsContainer = document.getElementById("step_container--details");
const interestsContainer = document.getElementById("step_container--interests");
const goalsContainer = document.getElementById("step_container--goals");

let step = 1;

// Next/Continue Button
paperNextBtn.addEventListener("click", function () {
  const { nextTab } = this.dataset;

  if (nextTab === "interests") {
    detailsContainer.classList.add(HIDDEN);
    interestsContainer.classList.remove(HIDDEN);
    this.setAttribute("data-next-tab", "goals");
    paperCancelBtn.setAttribute("data-back-tab", "details");
    paperCancelBtn.textContent = "Back";

    step = 2;
    headerDotUpdate();

    return;
  }

  if (nextTab === "goals") {
    interestsContainer.classList.add(HIDDEN);
    goalsContainer.classList.remove(HIDDEN);
    this.setAttribute("data-next-tab", "continue"); // update attribute
    this.textContent = "Continue"; // update button text content
    paperCancelBtn.setAttribute("data-back-tab", "interests");

    step = 3;
    headerDotUpdate();
    return;
  }

  if (nextTab === "continue") {
    // detailsContainer.classList.remove(HIDDEN);
    // goalsContainer.classList.add(HIDDEN);
    // this.setAttribute("data-next-tab", "interests"); // update attribute

    // this.textContent = "Next"; // update button text content
    // paperCancelBtn.setAttribute("data-back-tab", "");
    // paperCancelBtn.textContent = "Cancel";

    // step = 1;
    // headerDotUpdate();

    if (location.pathname !== "/paper-editing.html") {
      localStorage.setItem("new-paper-match", true);
      location.href = "/paper-editing.html";
    } else {
      hidePaperMatchingModal(); // close matching modal
    }
    return;
  }
});

// Cancel/Back Button
paperCancelBtn.addEventListener("click", function () {
  const { backTab } = this.dataset;
  paperNextBtn.textContent = "Next";

  if (!backTab) {
    goalsContainer.classList.add(HIDDEN);
    interestsContainer.classList.add(HIDDEN);
    detailsContainer.classList.remove(HIDDEN);
    this.setAttribute("data-back-tab", ""); // update attribute
    hidePaperMatchingModal(); // close matching modal
    this.textContent = "Cancel"; // update button text content

    step = 1;
    headerDotUpdate();
    return;
  }

  if (backTab === "details") {
    detailsContainer.classList.remove(HIDDEN);
    interestsContainer.classList.add(HIDDEN);
    paperNextBtn.setAttribute("data-next-tab", "interests"); // update attribute
    this.setAttribute("data-back-tab", ""); // update attribute
    this.textContent = "Cancel"; // update button text content

    step = 1;
    headerDotUpdate();
    return;
  }

  if (backTab === "interests") {
    interestsContainer.classList.remove(HIDDEN);
    goalsContainer.classList.add(HIDDEN);
    paperNextBtn.setAttribute("data-next-tab", "goals"); // update attribute
    this.setAttribute("data-back-tab", "details"); // update attribute
    this.textContent = "Back"; // update button text content

    step = 2;
    headerDotUpdate();
    return;
  }
});

function headerDotUpdate() {
  const step1Dot = document.getElementById("step_1_dot");
  const step2Dot = document.getElementById("step_2_dot");
  const step3Dot = document.getElementById("step_3_dot");

  const line1 = document.getElementById("progress_line--1");
  const line2 = document.getElementById("progress_line--2");

  if (step === 1) {
    addClass(step1Dot, "active");
    removeClass(step2Dot, "active");
    removeClass(step3Dot, "active");
    line1.style.width = "50%";
    line2.style.width = "0%";
  } else if (step === 2) {
    addClass(step1Dot, "active");
    addClass(step2Dot, "active");
    removeClass(step3Dot, "active");

    line1.style.width = "100%";
    line2.style.width = "50%";
  } else if (step === 3) {
    addClass(step1Dot, "active");
    addClass(step2Dot, "active");
    addClass(step3Dot, "active");

    line1.style.width = "100%";
    line2.style.width = "100%";
  }
}

function removeClass(element, className = HIDDEN) {
  element.classList.remove(className);
}

function addClass(element, className = HIDDEN) {
  element.classList.add(className);
}

function containsClass(element, className = HIDDEN) {
  return element.classList.contains(className);
}

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
// Mobile Overlay Find Task
const floatingTaskMerge = document.getElementById("floating_task_merge");
const floatingTaskMobileModal = document.getElementById("floating_task_mobile_modal");
const floatTaskContainerMobileCloseBtn = document.querySelector(".find_matching_overlay .mobile_close");
const floatTaskContainerTextarea = document.querySelector(".find_matching_overlay textarea");
const getAMatchMobileBtn = document.querySelector(".find_matching_overlay #get_a_match");
const closeMatchingModalMobileBtn = document.getElementById("close_matching_modal--mobile");

floatingTaskMerge?.addEventListener("click", () => {
  removeClass(floatingTaskMobileModal);
});

floatTaskContainerMobileCloseBtn?.addEventListener("click", () => {
  closeMobileGetMatching();
});

closeMatchingModalMobileBtn?.addEventListener("click", () => {
  hidePaperMatchingModal(); // hid find a match modal
});

floatTaskContainerTextarea?.addEventListener("input", (e) => {
  if (e.target.value) {
    getAMatchMobileBtn.disabled = false;
    getAMatchMobileBtn.setAttribute("aria-disabled", "false");
  } else {
    getAMatchMobileBtn.disabled = true;
    getAMatchMobileBtn.setAttribute("aria-disabled", "true");
  }
});

function closeMobileGetMatching() {
  addClass(floatingTaskMobileModal);
}
