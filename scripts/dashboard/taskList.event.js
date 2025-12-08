class TaskListEvent {
  constructor() {
    // Modals & overlays
    this.matchingModal = document.getElementById("matching_modal");
    this.shareOverlay = document.querySelector(".share_overlay--followers");
    this.mobileTaskEllipsis = document.getElementById("mobileTaskEllipsis");
    this.mobileTaskOptionModal = document.getElementById("mobileTaskOptionModal");
    this.createTaskContainer = document.getElementById("createTaskOverlay");
    this.createNavbarOverlay = document.querySelector(".create-collaborate-overlay");
    this.discardModal = discardModal; // global
    this.followOverlay = document.querySelector(".follow-overlay");

    // Priority controls
    this.addToPriority = document.getElementById("addToPriority");
    this.collapsePriorityButton = document.getElementById("collapsePriorityButton");
    this.selectedPriorityCountsEl = document.getElementById("selectedPriorityCounts");
    this.addTasksPriority = document.getElementById("addTasksPriority");
    this.selectedTasksForPriority = [];

    this.isExplorePage = location.pathname === "/explore.html" ? true : false;

    this._bindEvents();
  }

  _bindEvents() {
    // Create task overlay click
    this.createTaskContainer?.addEventListener("click", (e) => {
      if (e.target.id === this.createTaskContainer.id) {
        this.hideCreateTaskModal();
      }
    });

    // Priority toggle & apply
    this.addToPriority?.addEventListener("click", () => this._handleAddToPriority());
    this.addTasksPriority?.addEventListener("click", () => this.handlePriotiseUpdate(this.selectedTasksForPriority));
    this.collapsePriorityButton?.addEventListener("click", () => {
      const isExpanded = this.collapsePriorityButton.getAttribute("aria-expanded") === "true";
      this.handleCollapsePriorityContainer(isExpanded);
    });

    // Global click for main task lists
    // mainTaskLists.forEach((list) => list.addEventListener("click", (e) => this._onMainClick(e)));
    document.querySelector(".main_tasks_list").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      this._onMainClick(e);
    });

    // Outside click to hide any open options
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".task_options_btn") && !e.target.closest(".task_options")) {
        this.taskAllElementDesign();
      }
    });
  }

  // --- Event handlers ------------------------------------------------------
  _onMainClick(e) {
    e.stopPropagation();

    const t = e.target;

    // 1. Select for priority
    const pv = t.closest("#selectPriorityTask");
    if (pv) return this._toggleSelectPriority(pv);

    // 2. "Add new task" button
    if (t.closest("#add_new_task")) return showCreateTaskModal();

    // 3. Share to follower
    if (t.closest(".sharing_to_follower")) return showGlobalShareFollowingModal();

    // 4. Timer button
    if (t.closest(".timer_task--btn")) {
      const { taskId } = t.closest(".task").dataset;
      return showTaskTimerModal(taskId);
    }

    // 5. Task visibility
    if (t.closest(".task_visibility")) {
      const taskVisibility = t.closest(".task_visibility");
      const { taskId } = taskVisibility.dataset;
      return this._showTaskVisibilityModal(taskVisibility, taskId);
    }

    // 5. Ellipsis (options) button
    if (t.closest(".ellipsis")) return this._handleEllipsis(t);

    // 6. Cancel inside options
    if (t.closest(".cancel")) {
      const btn = t.closest(".task_options_btn");
      return this.handleTaskOptionShowAndHide(btn);
    }

    // 7. Inside .task_options menu
    if (t.closest(".task_options")) return this._handleTaskOptionsMenu(t);

    // 8. Dots for image carousel
    if (t.closest(".dots")) return this._handleDots(t);

    // 9. Progress bar click
    if (t.closest(".task_row--4")) return this._handleProgress(t);

    // 11. Collaborators icon
    if (t.closest("#task_collaborator")) return showCollaboratorsModal();

    // 12. Task merge
    if (t.closest(".task_merge")) return taskApp.handleShowMatchingModal();

    // 13. Love button
    const loveBtn = t.closest(".chat_task_suggestion_love");
    if (loveBtn) {
      return this._handleLoveButton(loveBtn);
    }

    // 14. Suggestion button
    if (t.closest(".suggestion_btn")) {
      taskOpenSuggestion();
      updateMasonrySuggestionGridLayout();
      return;
    }

    // 14. Collaborate chat
    if (t.closest(".collaborate")) {
      return (location.href = "/collaborations.html");
    }

    // 15. Expand task description
    const toggleBtn = t.closest(".toggle-btn");
    if (toggleBtn) {
      const collapsibleContainer = toggleBtn.closest(".collapsible");
      const expandTaskFooter = collapsibleContainer.querySelector(".expandTaskFooter");
      const collapseTaskDesc = collapsibleContainer.querySelector(".collapseTaskDesc");
      const descriptionAreaLong = collapsibleContainer.querySelector(".descriptionArea.long");
      const descriptionAreaShort = collapsibleContainer.querySelector(".descriptionArea.short");

      const show = toggleBtn.classList.contains("expandTaskDesc");

      descriptionAreaLong.classList[show ? "remove" : "add"](HIDDEN);
      descriptionAreaShort.classList[show ? "add" : "remove"](HIDDEN);
      // toggleBtn.classList[show ? "add" : "remove"](HIDDEN);
      expandTaskFooter.classList[show ? "remove" : "add"](HIDDEN);
      collapseTaskDesc.classList[show ? "remove" : "add"](HIDDEN);

      collapsibleContainer.querySelector(".toggle-btn.expandTaskDesc").classList[show ? "add" : "remove"](HIDDEN);
      collapsibleContainer.querySelector(".toggle-btn.collapseTaskDesc").classList[show ? "remove" : "add"](HIDDEN);
      return;
    }

    // 16. Clicking a task itself
    if (t.closest(".task")) {
      // If it's explore Page, handle differently 😂 :)
      if (this.isExplorePage) {
        const taskBigWrapper = t.closest(".task_big_wrapper");
        const taskPriorityCheckboxContainer = taskBigWrapper.querySelector(".task_priority_checkbox_container");
        const priorityButton = taskPriorityCheckboxContainer.querySelector("button");

        if (taskPriorityCheckboxContainer.classList.contains(HIDDEN)) {
          // hid all checkboxes container 😂 :)
          const checkboxes = document.querySelectorAll(".tasks_list .task_priority_checkbox_container");
          checkboxes.forEach((c) => {
            c.querySelector("button").setAttribute("aria-selected", "false");
            c.classList.remove(HIDDEN);
          });

          // Show Selected One :)
          priorityButton.setAttribute("aria-selected", "true");
          taskPriorityCheckboxContainer.classList.remove(HIDDEN);

          //
          if (window.addStoryOverlay) {
            window.addStoryOverlay.showStoryOverlay("task");
          } else {
            console.warn("addStoryOverlay class is needed 😥 :)");
          }
        } else {
          // hid all checkboxes container 😂 :)
          const checkboxes = document.querySelectorAll(".tasks_list .task_priority_checkbox_container");
          checkboxes.forEach((c) => {
            c.querySelector("button").setAttribute("aria-selected", "false");
            c.classList.remove(HIDDEN);
          });

          // Hide Selected One :)
          taskPriorityCheckboxContainer.classList.add(HIDDEN);

          //
          if (window.addStoryOverlay) {
            window.addStoryOverlay.hideStoryOverlay();
          } else {
            console.warn("addStoryOverlay class is needed 😥 :)");
          }
        }
        return;
      }

      taskOpenDescription();
      document.querySelector(".main_tasks").classList.add(HIDDEN);
      const { taskId } = t.closest(".task").dataset;
      return updateTaskDescriptionOnClick(+taskId);
    }
  }

  _handleLoveButton(loveBtn) {
    const isActive = loveBtn.classList.contains("active");

    if (isActive) {
      loveBtn.classList.remove("active");
    } else {
      loveBtn.classList.add("active");
    }
  }

  _toggleSelectPriority(el) {
    const was = el.getAttribute("aria-selected") === "true";
    const id = +el.dataset.taskId;
    el.setAttribute("aria-selected", was ? "false" : "true");
    if (was) {
      this.selectedTasksForPriority = this.selectedTasksForPriority.filter((i) => i !== id);
    } else {
      this.selectedTasksForPriority.push(id);
    }
    this.selectedPriorityCountsEl.textContent = this.selectedTasksForPriority.length;
    this.addTasksPriority.classList.toggle(HIDDEN, !this.selectedTasksForPriority.length);
  }

  _handleEllipsis(target) {
    const btn = target.closest(".task_options_btn");
    if (window.innerWidth > 667) {
      return this.handleTaskOptionShowAndHide(btn);
    }

    // mobile flow
    const taskEl = target.closest(".task");
    const { taskId, priority: pri } = taskEl.dataset;
    const row4 = taskEl.querySelector(".task_row--4");
    const trackH2 = this.mobileTaskOptionModal.querySelector(".task_option_track h2");
    const priH2 = this.mobileTaskOptionModal.querySelector(".task_option_priority h2");

    trackH2.textContent = row4.classList.contains(HIDDEN) ? "Tracked" : "Untracked";
    priH2.textContent = pri === "off" ? "Priority" : "UnPriority";

    this.mobileTaskEllipsis.classList.remove(HIDDEN);
    this.mobileTaskEllipsis.dataset.taskId = taskId;
    this.mobileTaskEllipsis.dataset.taskPriotise = pri;
  }

  _handleTaskOptionsMenu(target) {
    // Get task ID from the dropdown data attribute
    const taskId = taskListApp.currentTaskId;
    if (!taskId) return;

    // Hide dropdown after action
    taskListApp.hideTaskOptionsDropdown();
    this.taskAllElementDesign();

    if (target.closest(".show_share--modal")) return showGlobalShareFollowingModal();
    if (target.closest(".show-report-modal-btn")) return showGlobalReportModal();

    if (target.closest(".show_task_edit")) return showCreateTaskModal();
    if (target.closest(".show_timer--modal")) {
      return showTaskTimerModal(taskId);
    }
    if (target.closest(".prioritise")) return this.handlePriotiseUpdate(+taskId);
    if (target.closest(".task_option_track")) return this._toggleTracking(target.closest(".task_option_track"));
    if (target.closest(".task_option_collaboration")) {
      return (location.href = "/collaborations.html");
    }
    if (target.closest(".task_option_calender")) return showTaskAddCalender();
    if (target.closest(".discard_btn")) {
      this.discardModal.dataset.type = "task";
      this.discardModal.dataset.taskId = taskId;
      return showGlobalDiscardModal();
    }
  }

  _toggleTracking(target) {
    const taskEl = target.closest(".task");
    const prog = taskEl.querySelector(".task_row--4");
    const span = target.querySelector("span");
    if (!prog.classList.contains(HIDDEN)) {
      span.textContent = "Tracked";
      prog.classList.add(HIDDEN);
    } else {
      span.textContent = "Untracked";
      prog.classList.remove(HIDDEN);
    }
  }

  _handleDots(target) {
    if (target.tagName !== "BUTTON") return;
    const btn = target;
    const container = btn.closest(".dots");
    const dotImagesContainer = btn.closest(".task_row--3");
    const allSlides = dotImagesContainer.querySelectorAll(".images img");
    const allButtons = container.querySelectorAll("button");
    const lastBtn = container.querySelector("button:last-child");

    const count = +btn.dataset.count;
    const nextCount = +btn.dataset.nextCount || 0;
    const total = +container.dataset.totalTaskImageCount;

    let showIndex = count;
    if (count < 3 || (count === 3 && !nextCount)) {
      showIndex = count;
      lastBtn.dataset.nextCount = 4;
    } else if (nextCount && total >= nextCount) {
      showIndex = nextCount;
      lastBtn.dataset.nextCount = nextCount === total ? 0 : nextCount + 1;
    }

    allSlides.forEach((s) => s.classList.add(HIDDEN));
    allButtons.forEach((b) => b.classList.remove("active"));
    dotImagesContainer.querySelector(`#task_image_count--${showIndex}`).classList.remove(HIDDEN);
    btn.classList.add("active");
  }

  _handleProgress(target) {
    const progBtn = target.closest("[data-progress]");

    if (!progBtn || window.location.pathname === "/chat.html") return;

    const val = +progBtn.dataset.progress;
    const progBar = target.closest(".task_row--4").querySelector(".progress");
    progBar.style.width = `${val}%`;

    // save to localStorage
    const tid = +target.closest(".task").dataset.taskId;
    const tasks = getLocalStorage().map((t) => (t.id === tid ? { ...t, tracking_rate: val } : t));
    setLocalStorage(tasks);
  }

  hideCreateTaskModal() {
    this.addClass(this.createTaskContainer);
  }

  handlePriotiseUpdate(data) {
    const stored = getLocalStorage();
    let updated;

    if (typeof data === "number") {
      updated = stored.map((t) => (t.id === data ? { ...t, priotised: false } : t));
    } else {
      updated = stored.map((t) => (data.includes(t.id) ? { ...t, priotised: true } : t));
    }

    setLocalStorage(updated);
    taskListApp.renderUserTasks();

    // reset UI
    this.selectedTasksForPriority = [];
    this.selectedPriorityCountsEl.textContent = 0;
    this.selectedPriorityCountsEl.classList.add(HIDDEN);
    this.addTasksPriority.classList.add(HIDDEN);
  }

  handleTaskOptionShowAndHide(btn) {
    const ell = btn.querySelector(".ellipsis");
    const can = btn.querySelector(".cancel");
    const taskId = btn.dataset.task;

    // Check if dropdown is currently showing for this task
    const isCurrentlyShowing = taskListApp.taskOptionsDropdown && !taskListApp.taskOptionsDropdown.classList.contains(HIDDEN) && taskListApp.currentTaskId == taskId;

    // Hide all other dropdowns first
    this.taskAllElementDesign();
    taskListApp.hideTaskOptionsDropdown();

    if (!isCurrentlyShowing) {
      // Show dropdown for this task
      ell.classList.add(HIDDEN);
      can.classList.remove(HIDDEN);

      // Show the single dropdown positioned relative to this button
      taskListApp.showTaskOptionsDropdown(btn, taskId);
    } else {
      // Hide dropdown
      ell.classList.remove(HIDDEN);
      can.classList.add(HIDDEN);
    }
  }

  taskAllElementDesign() {
    document.querySelectorAll(".task_options_btn .ellipsis").forEach((e) => e.classList.remove(HIDDEN));
    document.querySelectorAll(".task_options_btn .cancel").forEach((c) => c.classList.add(HIDDEN));

    // Hide the single dropdown
    if (taskListApp && taskListApp.taskOptionsDropdown) {
      taskListApp.hideTaskOptionsDropdown();
    }
  }

  _handleAddToPriority() {
    const active = this.addToPriority.classList.toggle("active");
    taskApp.handleCollapsePriorityButton(!!active);
    this._toggleTaskSelection(active);
    this.selectedPriorityCountsEl.classList.toggle(HIDDEN, !active);
    this.selectedTasksForPriority = [];
    this.selectedPriorityCountsEl.textContent = 0;
  }

  _toggleTaskSelection(show = true) {
    const checkboxes = document.querySelectorAll(".tasks_list .task_priority_checkbox_container");

    if (show) {
      checkboxes.forEach((c) => {
        c.querySelector("button").setAttribute("aria-selected", "false");
        c.classList.remove(HIDDEN);
      });
    } else {
      this.addTasksPriority.classList.add(HIDDEN);

      checkboxes.forEach((c) => {
        c.classList.add(HIDDEN);
        c.querySelector("button").setAttribute("aria-selected", "false");
      });
    }
  }

  handleCollapsePriorityContainer(hide = false) {
    this.collapsePriorityButton.setAttribute("aria-expanded", hide ? "false" : "true");

    taskApp.insertPriorityTasks.classList[hide ? "add" : "remove"](HIDDEN);
    taskApp.priorityListEmpty.classList[hide ? "add" : "remove"](HIDDEN);
  }

  _showTaskVisibilityModal(taskVisibility, taskId) {
    const tasks = taskApp.getLocalStorage();
    const others = tasks.filter((t) => t.id !== +taskId);
    const task = tasks.find((t) => t.id === +taskId);
    if (!task) return;
    const newState = !task.public;

    task.public = newState;
    taskVisibility.querySelector("[type='checkbox']").checked = newState;

    if (newState) {
      showFlashMessage("Task is now public", "Task Visibility", "success");
    } else {
      showFlashMessage("Task is now private", "Task Visibility", "warning");
    }

    taskApp.setLocalStorage([...others, task]);
  }
}

// Initialize
new TaskListEvent();
