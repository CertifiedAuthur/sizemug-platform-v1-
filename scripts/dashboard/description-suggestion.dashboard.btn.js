const taskDescriptionBtn = document.querySelector(".task_description--btn");
const taskSuggestionBtn = document.querySelector(".task_suggestion--btn");
const taskDescriptionBtnIcon = taskDescriptionBtn.querySelector("img");
const taskSuggestionBtnIcon = taskSuggestionBtn.querySelector("img");
const checkingClassName = "task_description_suggestion--active";

taskDescriptionBtn.addEventListener("click", (e) => {
  const btn = e.target.closest(".task_description--btn");

  if (!btn.classList.contains(checkingClassName)) {
    taskOpenDescription();

    if (window.innerWidth < 667) {
      descriptionSticky.classList.remove(HIDDEN);
    }
  }
});

taskSuggestionBtn.addEventListener("click", (e) => {
  const btn = e.target.closest(".task_suggestion--btn");

  if (!btn.classList.contains(checkingClassName)) {
    taskOpenSuggestion();

    if (window.innerWidth < 667) {
      descriptionSticky.classList.add(HIDDEN);
    }

    updateMasonrySuggestionGridLayout();
  }
});

function updateMasonrySuggestionGridLayout() {
  if (masonryMainSuggestionGridContainer) {
    // just call the layout method on the instance variable to update suggestion grid layout sharp!
    masonryMainSuggestionGridContainer.layout();
  }

  if (masonrySuggestionGridContainerSkeleton) {
    // update suggestion skeleton
    masonrySuggestionGridContainerSkeleton.layout();
  }

  // Fetch Suggestion Grid layout :)
  ///////// IIFE for suggestions task display
  (async () => {
    renderSuggestionGridContainerSkeleton();

    const data = await generateUsersWithTasks();

    if (data) {
      suggestionGridContainerSkeleton.remove();
      const gridSuggestionContainerEl = document.getElementById("suggestion_grid_container");
      populateGridLayout(data, gridSuggestionContainerEl, masonryMainSuggestionGridContainer);
      suggestionGridDataItem = data;
    }
  })();
}

function taskOpenDescription() {
  addClass(landingPageContent);
  removeClass(taskDescriptionSuggestionContainer);
  removeClass(taskDescriptionContainer);
  addClass(taskSuggestionContainer);
  addClass(taskDescriptionBtn, checkingClassName);
  removeClass(taskSuggestionBtn, checkingClassName);
  removeClass(descriptionSticky);
  addClass(suggestionCommentContainer);
  descriptionSticky.classList.remove(HIDDEN);
  addClass(mainDashboardSubHeader);

  taskSuggestionBtnIcon.src = "icons/suggestions-nonactive.svg";
  taskDescriptionBtnIcon.src = "icons/file_description.svg";
}

function taskOpenSuggestion() {
  addClass(landingPageContent);
  removeClass(taskDescriptionSuggestionContainer);
  addClass(taskDescriptionContainer);
  removeClass(taskSuggestionContainer);
  removeClass(taskDescriptionBtn, checkingClassName);
  addClass(taskSuggestionBtn, checkingClassName);
  taskSuggestionBtnIcon.src = "icons/suggestions-active.svg";
  taskDescriptionBtnIcon.src = "icons/file_description--nonactive.svg";
  descriptionSticky.classList.add(HIDDEN);

  if (innerWidth < 667) {
    addClass(document.querySelector(".main_tasks"));
  }
}

function taskCloseDescription() {
  removeClass(landingPageContent);
  addClass(taskDescriptionSuggestionContainer);
  addClass(taskDescriptionContainer);
  removeClass(taskSuggestionContainer);
  removeClass(taskDescriptionBtn, checkingClassName);
  addClass(taskSuggestionBtn, checkingClassName);
  addClass(descriptionSticky);
  removeClass(suggestionCommentContainer);
  removeClass(mainDashboardSubHeader);
  taskSuggestionBtnIcon.src = "icons/suggestions-nonactive.svg";
  taskDescriptionBtnIcon.src = "icons/file_description.svg";
}
