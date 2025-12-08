class TaskApp {
  constructor() {
    this.collapsePriorityButton = document.getElementById("collapsePriorityButton");
    this.priorityListEmpty = document.getElementById("priorityListEmpty");
    this.insertPriorityTasks = document.getElementById("insertPriorityTasks");
    this.taskMergeModal = document.getElementById("task_merging--modal");
    this.matchingModal = document.getElementById("matching_modal");
  }

  setLocalStorage(tasks) {
    localStorage.setItem("sizemug_user_task", JSON.stringify(tasks));
  }

  getLocalStorage() {
    return JSON.parse(localStorage.getItem("sizemug_user_task")) || [];
  }

  handleCollapsePriorityButton(hide = false) {
    this.collapsePriorityButton.classList[hide ? "add" : "remove"](HIDDEN);
  }

  addClass(el, cls = HIDDEN) {
    el.classList.add(cls);
  }

  removeClass(el, cls = HIDDEN) {
    el.classList.remove(cls);
  }

  handleShowMatchingModal() {
    const cancelBtn = this.taskMergeModal.querySelector("#landing_steps_events--cancel");
    const continueBtn = this.taskMergeModal.querySelector("#landing_steps_events--continue");
    const matching = JSON.parse(localStorage.getItem("sizemug_matching") || "false");
    const matchList = document.querySelector("ul.matching_lists");

    if (!matching) {
      this.removeClass(this.taskMergeModal);
    } else {
      this.removeClass(window.matchingModal.matchingModal);
    }

    [cancelBtn, continueBtn].forEach((el) => el?.addEventListener("click", () => this.addClass(this.taskMergeModal)));

    window.matchingModal.renderMatchingModalSkeleton(matchList);
    showSliderSwiperSkeletonSlides();
    window.matchingModal.generateMatchingRandomUsers().then((users) => {
      renderMatchingList(users);
      updateSwiperSlides(users);
      handleSlideChange(0);
    });
  }
}
const taskApp = new TaskApp();
