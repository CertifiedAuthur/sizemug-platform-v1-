// The logic in this file is being used for both pages (dashboard & chat pages)
/**
 *
 *
 *
 *
 *
 *
 * Will Remove this function later ):
 *
 *
 *
 *
 *
 */

// set tasks localstorage
function setLocalStorage(newTasks) {
  localStorage.setItem("sizemug_user_task", JSON.stringify(newTasks));
}

//  get tasks localstorage
function getLocalStorage() {
  return JSON.parse(localStorage.getItem("sizemug_user_task")) ?? [];
}

function removeClass(element, className = HIDDEN) {
  element.classList.remove(className);
}

function addClass(element, className = HIDDEN) {
  element.classList.add(className);
}

const createTaskContainer = document.getElementById("createTaskOverlay");
const createNavbarOverlay = document.querySelector(".create-collaborate-overlay");

function showCreateTaskModal() {
  if (innerWidth < 667) {
    document.querySelector(".mobile_additional_modal").classList.add(HIDDEN);
  }

  removeClass(createTaskContainer);
  addClass(createNavbarOverlay);
}

const chatSuggestionsData = [
  {
    id: "101",
    priotised: false,
    taskImages: [],
    username: "Rafael Richi",
    tracking_rate: 20,
    collaborators: [
      {
        picture: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "heidi",
      },
    ],
    title: "Income statement report for 2025",
    description: {
      long: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.`,
      short: `It is a long established fact that a reader will be distracted by the readable content…`,
    },
    hashtags: ["Accounting", "Business", "Finance"],
    status: "pending",
  },
  {
    id: "102",
    priotised: true,
    taskImages: ["/img/task-102-1.png"],
    username: "Selena Ada",
    tracking_rate: 75,
    collaborators: [
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "alice",
      },
    ],
    title: "Q1 Marketing Campaign Brief",
    description: {
      long: `Our Q1 campaign focuses on increasing brand awareness across social channels. We'll leverage influencer partnerships, targeted ads, and a redesigned landing page to improve conversion rates by 15% over the quarter.`,
      short: `Our Q1 campaign focuses on increasing brand awareness across social channels…`,
    },
    hashtags: ["Marketing", "Campaign", "Q1"],
    status: "ongoing",
  },
  {
    id: "103",
    priotised: false,
    taskImages: ["/img/task-103-1.png", "/img/task-103-2.png"],
    username: "John Doe",
    tracking_rate: 40,
    collaborators: [
      {
        picture: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "bob",
      },
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "carol",
      },
      {
        picture: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "dave",
      },
    ],
    title: "Website Redesign Mockups",
    description: {
      long: `Revamp the company website with a clean, modern aesthetic. Key goals: simplify navigation, improve load times, and highlight our core services above the fold. Deliver high-fidelity prototypes for desktop and mobile by end of month.`,
      short: `Revamp the company website with a clean, modern aesthetic…`,
    },
    hashtags: ["UI/UX", "Design", "Web"],
    status: "stuck",
  },
  {
    id: "104",
    priotised: true,
    taskImages: [],
    username: "Jane Doe",
    tracking_rate: 100,
    collaborators: [
      {
        picture: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "eve",
      },
      {
        picture: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "frank",
      },
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "grace",
      },
      {
        picture: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "heidi",
      },
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "ivan",
      },
    ],
    title: "Annual Security Audit",
    description: {
      long: `Conduct a comprehensive security audit across all systems and infrastructure. Scope includes penetration testing, code review, configuration analysis, and user-permissions audit. Compile findings into a risk report with prioritized remediation.`,
      short: `Conduct a comprehensive security audit across all systems and infrastructure…`,
    },
    hashtags: ["Security", "Audit", "Compliance"],
    status: "stuck",
  },

  {
    id: "105",
    priotised: true,
    taskImages: [],
    username: "Jane Doe",
    tracking_rate: 10,
    collaborators: [
      {
        picture: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "eve",
      },
      {
        picture: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "frank",
      },
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "grace",
      },
      {
        picture: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "heidi",
      },
      {
        picture: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
        username: "ivan",
      },
    ],
    title: "Business Plan for 2025",
    description: {
      long: `Conduct a comprehensive security audit across all systems and infrastructure. Scope includes penetration testing, code review, configuration analysis, and user-permissions audit. Compile findings into a risk report with prioritized remediation.`,
      short: `Conduct a comprehensive security audit across all systems and infrastructure…`,
    },
    hashtags: ["Security", "Audit", "Compliance"],
    status: "completed",
  },
];

const usernameSolution = ["Rafael Richi", "Selena Ada", "John Doe", "Jane Doe", "heidi", "alice", "bob", "carol", "dave", "eve", "frank", "grace", "ivan"];

/**
 *
 *
 *
 *
 *
 *
 * Will Remove this function later ):
 *
 *
 *
 *
 *
 */

/* globals HIDDEN, location */
class TaskList {
  constructor() {
    // DOM elements
    this.taskListParent = document.querySelector(".tasks_list_priority--wrapper");
    this.mobileOptionModal = document.querySelector(".mobile_options_modal");
    this.unpriotiseContainer = document.querySelector(".tasks_list");
    this.priorityContainer = document.querySelector(".priority_container");
    this.tasksContainer = document.querySelector(".main_tasks_list");
    this.unpriotiseContainer2s = document.querySelectorAll(".tasks_list--2");
    this.taskWithUserListsContainer = document.getElementById("taskWithUserListsContainer");
    this.chatSuggestionFilters = document.getElementById("chatSuggestionFilters");
    this.chatSuggestionFiltersButtons = this.chatSuggestionFilters?.querySelectorAll("button");
    this.createTaskBannerBtn = document.getElementById("createTaskBannerBtn");

    // State
    this.currentTask = null;
    this.nextImage = 2;
    this.userTasks = [];
    this.isChatPage = location.pathname === "/chat.html" ? "chatPage" : "";
    this.isExplorePage = location.pathname === "/explore.html" ? true : false;
    this.suggestionUsernameIndex = 0;

    this.currentTaskData = [];

    // Single dropdown instance
    this.taskOptionsDropdown = null;
    this.popperInstance = null;
    this.currentTaskId = null;

    // Event Listeners
    this.chatSuggestionFilters?.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { status } = button.dataset;

        this.chatSuggestionFiltersButtons.forEach((btn) => btn.setAttribute("aria-selected", false));
        button.setAttribute("aria-selected", true);

        let filteredTasks = [];

        if (status === "all") {
          filteredTasks = chatSuggestionsData;
        } else if (status === "pending") {
          filteredTasks = chatSuggestionsData.filter((t) => t.status === "pending");
        } else if (status === "ongoing") {
          filteredTasks = chatSuggestionsData.filter((t) => t.status === "ongoing");
        } else if (status === "stuck") {
          filteredTasks = chatSuggestionsData.filter((t) => t.status === "stuck");
        } else if (status === "completed") {
          filteredTasks = chatSuggestionsData.filter((t) => t.status === "completed");
        }

        this.unpriotiseContainer.innerHTML = "";

        if (filteredTasks.length) {
          filteredTasks.forEach((t) => {
            this.unpriotiseContainer.insertAdjacentHTML("afterbegin", this.generateChatTaskSuggestionsMarkup(t));
          });
        }
      }
    });

    // Show Task Modal
    this.createTaskBannerBtn?.addEventListener("click", showCreateTaskModal);

    // Search and Filter functionality
    this.initSearchAndFilter();

    // Initial render
    this.renderUserTasks();

    // Initialize single dropdown
    this.initTaskOptionsDropdown();
  }

  initSearchAndFilter() {
    const searchBtn = document.querySelector(".search_for_your_tasks");
    const searchWrapper = document.querySelector(".search_input_wrapper");
    const searchInput = document.querySelector(".search_tasks_input");
    const closeSearchBtn = document.querySelector(".close_search_btn");
    const filterBtn = document.querySelector(".filter_yours_tasks");
    const filterDropdown = document.querySelector(".filter_dropdown");

    // Toggle search input
    searchBtn?.addEventListener("click", () => {
      searchWrapper?.classList.remove(HIDDEN);
      searchBtn.classList.add(HIDDEN);
      filterBtn?.classList.add(HIDDEN);
      searchInput?.focus();
    });

    // Close search input
    closeSearchBtn?.addEventListener("click", () => {
      searchWrapper?.classList.add(HIDDEN);
      searchBtn?.classList.remove(HIDDEN);
      filterBtn?.classList.remove(HIDDEN);
      searchInput.value = "";
      this.renderUserTasks(); // Reset to show all tasks
    });

    // Search functionality
    searchInput?.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      this.filterTasks(searchTerm);
    });

    // Toggle filter dropdown
    filterBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      filterDropdown?.classList.toggle(HIDDEN);
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!filterBtn?.contains(e.target) && !filterDropdown?.contains(e.target)) {
        filterDropdown?.classList.add(HIDDEN);
      }
    });

    // Filter dropdown selection
    filterDropdown?.addEventListener("click", (e) => {
      const filterItem = e.target.closest("li");
      if (filterItem) {
        const filterValue = filterItem.dataset.filter;
        this.applyFilter(filterValue);
        filterDropdown.classList.add(HIDDEN);
      }
    });
  }

  filterTasks(searchTerm) {
    const stored = taskApp.getLocalStorage();

    if (!searchTerm) {
      this.renderUserTasks();
      return;
    }

    const filteredTasks = stored.filter((task) => {
      return task.title.toLowerCase().includes(searchTerm) || task.description?.long?.toLowerCase().includes(searchTerm) || task.hashtags?.some((tag) => tag.toLowerCase().includes(searchTerm));
    });

    this.updateFilteredTasks(filteredTasks);
  }

  applyFilter(filterValue) {
    const stored = taskApp.getLocalStorage();

    let filteredTasks = stored;

    if (filterValue !== "all") {
      filteredTasks = stored.filter((task) => task.status === filterValue);
    }

    this.updateFilteredTasks(filteredTasks);
  }

  updateFilteredTasks(tasks) {
    const dashboardPriorityContainer = document.getElementById("dashboardPriorityContainer");
    const tasksBanner = this.tasksContainer?.querySelector(".tasks_banner");

    if (tasks.length) {
      document.querySelector(".main_tasks_list_empty")?.classList.add(HIDDEN);
      this.taskListParent.classList.remove(HIDDEN);

      if (tasksBanner) {
        tasksBanner.classList.add(HIDDEN);
      }

      const priorityTasks = tasks.filter((t) => t.priotised);
      const unpriorityTasks = tasks.filter((t) => !t.priotised);

      if (!this.isChatPage) {
        this.updatedPriorityTask(priorityTasks);
      }

      this.updatedUnPriorityTask(unpriorityTasks);
    } else {
      dashboardPriorityContainer?.classList.add(HIDDEN);
      this.unpriotiseContainer.innerHTML = '<div style="padding: 20px; text-align: center; color: #667085;">No tasks found</div>';
    }
  }

  renderUserTasks() {
    const stored = taskApp.getLocalStorage();
    this.currentTaskData = stored;

    const dashboardPriorityContainer = document.getElementById("dashboardPriorityContainer");
    const tasksBanner = this.tasksContainer?.querySelector(".tasks_banner");

    if (stored?.length) {
      document.querySelector(".main_tasks_list_empty")?.classList.add(HIDDEN);
      this.taskListParent.classList.remove(HIDDEN);

      // Hide tasks banner when there are tasks
      if (tasksBanner) {
        tasksBanner.classList.add(HIDDEN);
      }

      // Render Explore Page Tasks ✌️ :)
      if (this.isExplorePage && stored) {
        this.updateTasksExplore(stored);
        return;
      }

      // Render Chat Suggestions
      if (this.isChatPage) {
        this.updateChatSuggestions(stored);
        return;
      }

      const priorityTasks = stored.filter((t) => t.priotised);
      const unpriorityTasks = stored.filter((t) => !t.priotised);

      if (!this.isChatPage) {
        this.updatedPriorityTask(priorityTasks);
      }

      this.updatedUnPriorityTask(unpriorityTasks);
    } else {
      dashboardPriorityContainer?.classList.add(HIDDEN);

      // Show tasks banner when empty state is rendered
      if (tasksBanner) {
        tasksBanner.classList.remove(HIDDEN);
      }

      this?._renderEmptyState();
    }
  }

  updatedPriorityTask(tasks) {
    const noPrioEl = document.getElementById("noPriorityTask");
    const prioCountEl = document.getElementById("priorityItemCounts");

    this.priorityContainer.classList.remove(HIDDEN);
    insertPriorityTasks.innerHTML = ""; // global

    tasks.forEach((t) => {
      insertPriorityTasks.insertAdjacentHTML("afterbegin", this.generateTaskMarkup(t));
    });

    if (!tasks.length) {
      noPrioEl.classList.remove(HIDDEN);
      prioCountEl.classList.add(HIDDEN);
      addToPriority.classList.remove("active"); // global
      taskApp.handleCollapsePriorityButton(true); // global instance
    } else {
      noPrioEl.classList.add(HIDDEN);
      prioCountEl.classList.remove(HIDDEN);
      prioCountEl.textContent = `: ${tasks.length}`;
      addToPriority.classList.remove("active");
      taskApp.handleCollapsePriorityButton(false);
    }
  }

  updatedUnPriorityTask(tasks) {
    const dashboardPriorityContainer = document.getElementById("dashboardPriorityContainer");
    this.unpriotiseContainer.classList.remove(HIDDEN);
    this.unpriotiseContainer.innerHTML = "";

    const taskNoWithUser = tasks.filter((t) => t.sharedWith !== "user");
    const taskWithUser = tasks.filter((t) => t.sharedWith === "user");

    if (taskNoWithUser.length && !this.isChatPage) {
      taskNoWithUser.forEach((t) => {
        this.unpriotiseContainer.insertAdjacentHTML("afterbegin", this.generateTaskMarkup(t));
      });
    } else if (!taskNoWithUser.length && !this.isChatPage) {
      dashboardPriorityContainer.classList.add(HIDDEN);
      this._renderEmptyState();
    }

    // Task with user container
    if (taskWithUser.length && this.isChatPage) {
      this.taskWithUserListsContainer.innerHTML = "";

      taskWithUser.forEach((t) => {
        this.taskWithUserListsContainer.insertAdjacentHTML("afterbegin", this.generateTaskMarkup(t));
      });
    }
  }

  // Render all tasks no filter anything :)
  updateTasksExplore(tasks) {
    this.unpriotiseContainer.innerHTML = "";

    tasks.forEach((t) => {
      const markup = this.generateTaskMarkup(t);
      this.unpriotiseContainer.insertAdjacentHTML("beforeend", markup);
    });
  }

  // Chat Suggestions: Render Public Tasks :)
  updateChatSuggestions(tasks) {
    const publicTasks = tasks.filter((t) => t.public);

    if (!publicTasks.length) {
      this._renderEmptyState();
      return;
    }

    this.unpriotiseContainer.innerHTML = "";

    publicTasks.forEach((t) => {
      const markup = this.generateTaskMarkup(t);
      this.unpriotiseContainer.insertAdjacentHTML("beforeend", markup);
    });
  }

  generateTaskMarkup(task) {
    const timer = JSON.parse(localStorage.getItem(`taskTimer_${task.id}`)) || {};

    return `
    <div class="task_big_wrapper">
      <div class="task_priority_checkbox_container ${HIDDEN}">
        <button id="selectPriorityTask" data-task-id="${task.id}" aria-selected="false" class="task_priority_checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
        </button>
      </div>

      <div class="task task_item--hover task_id--${task.id}" data-priority="${task.priotised ? "on" : "off"}" data-task-id="${task.id}">
          <div class="task_row--1 ${task.isShared || timer.taskId ? "" : HIDDEN}">
             ${task.isShared ? `<div class="shared_from">Shared from <span>${task.sharedFrom || "Rafael Richi"}</span></div>` : ""}
              <div class="wrapper">
                  <svg class="sharing_to_follower" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 20 20"><path fill="black" d="M12.378 5.708v-2.13c0-.48.53-.738.89-.47l.062.054l4.497 4.42c.21.207.229.539.057.768l-.057.065l-4.497 4.423c-.338.332-.887.119-.947-.334l-.005-.082v-2.096l-.258.023c-1.8.193-3.526 1.024-5.187 2.507c-.39.348-.992.02-.928-.506c.498-4.09 2.585-6.345 6.148-6.627zM5.5 4A2.5 2.5 0 0 0 3 6.5v8A2.5 2.5 0 0 0 5.5 17h8a2.5 2.5 0 0 0 2.5-2.5v-1a.5.5 0 0 0-1 0v1a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 14.5v-8A1.5 1.5 0 0 1 5.5 5h3a.5.5 0 0 0 0-1z"/></svg>
                  <div class="user"><img src="${task.image}" alt="Owner" /></div>
                  <button class="timer_task--btn ${timer.taskId ? "" : HIDDEN}">
                    <img src="/icons/timer_icon.svg" alt="Task Timer Icon" />
                  </button>
              </div>
          </div>
          <div class="task_row--2">
              <div class="task_status task_status--${task.status}">
                <span class="status_bull"></span>
              </div>
              <h3>${task.title}</h3>
              <button class="task_options_btn" data-task="${task.id}">
                <img src="icons/ellipsis.svg" alt="Ellipsis Icon" class="ellipsis" />
                <img src="icons/cancel.svg" class="cancel ${HIDDEN}" alt="Cancel Icon" />
              </button>
          </div>
          <div class="task_row--3 ${!task.taskImages.length ? HIDDEN : ""}" data-dot-active="0">
            <div class="images">
              ${task.taskImages
                .map((img, i) => {
                  if (i >= 5) return "";

                  return `
                    <div>
                      <img src="${img}" alt="${img}" id="task_image_count--${i + 1}" />
                      ${i === 4 && task.taskImages.length > 5 ? `<div class="task_image_overlay">+${task.taskImages.length - 5}</div>` : ""}
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
            <div class="task_row--4 ${task.public ? "" : HIDDEN}">
              <div class="progress" style="width: ${task?.tracking_rate || 0}%"></div>
              <div class="box_wrapper">
                <div class="box box-1" data-progress="0">0%</div>
                <div class="box box-2" data-progress="20">5%</div>
                <div class="box box-3" data-progress="40">25%</div>
                <div class="box box-4" data-progress="60">50%</div>
                <div class="box box-5" data-progress="75">75%</div>
                <div class="box box-6" data-progress="100">100%</div>
              </div>
            </div>
         ${
           !this.isExplorePage
             ? `<div class="task_row--5">
            ${
              this.isChatPage
                ? `
                <button class="collaborate">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"/><path fill="currentColor" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"/></g></svg>
                  <span>Collaboration</span>
                </button>`
                : `
              <div class="notification">
                <div class="suggestion_btn" role="button" tabindex="0">
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5002 5.83325C8.19898 5.83325 6.3335 7.69874 6.3335 9.99992C6.3335 11.1343 6.78685 12.1628 7.52225 12.9143C7.8087 13.2069 8.04417 13.5552 8.12452 13.9568L8.56544 16.1603C8.7213 16.9393 9.40533 17.4999 10.1997 17.4999H10.8006C11.595 17.4999 12.279 16.9393 12.4349 16.1603L12.8758 13.9568C12.9562 13.5552 13.1916 13.2069 13.4781 12.9143C14.2135 12.1628 14.6668 11.1343 14.6668 9.99992C14.6668 7.69874 12.8013 5.83325 10.5002 5.83325Z" stroke="url(#paint0_linear_8440_6163)" stroke-width="1.5"/><path d="M10.5 3.33333V2.5" stroke="url(#paint1_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 5.00008L16.3333 4.16675" stroke="url(#paint2_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17.1665 10H17.9998" stroke="url(#paint3_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.83333 10H3" stroke="url(#paint4_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.6665 4.16675L5.49984 5.00008" stroke="url(#paint5_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.8335 14.1667H12.1668" stroke="url(#paint6_linear_8440_6163)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path opacity="0.1" d="M6.3335 9.99992C6.3335 7.69874 8.19898 5.83325 10.5002 5.83325C12.8013 5.83325 14.6668 7.69874 14.6668 9.99992C14.6668 11.1343 14.2135 12.1628 13.4781 12.9143C13.1916 13.2069 12.9562 13.5552 12.8758 13.9568L12.8338 14.1666H8.1665L8.12452 13.9568C8.04417 13.5552 7.8087 13.2069 7.52225 12.9143C6.78685 12.1628 6.3335 11.1343 6.3335 9.99992Z" fill="url(#paint7_linear_8440_6163)"/><defs><linearGradient id="paint0_linear_8440_6163" x1="8.52787" y1="8.26693" x2="14.752" y2="14.0175" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint1_linear_8440_6163" x1="10.7633" y1="2.67383" x2="11.1694" y2="3.30416" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint2_linear_8440_6163" x1="15.7194" y1="4.34058" x2="16.151" y2="4.89885" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint3_linear_8440_6163" x1="17.3859" y1="10.2086" x2="17.9196" y2="10.7838" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint4_linear_8440_6163" x1="3.21944" y1="10.2086" x2="3.7531" y2="10.7838" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint5_linear_8440_6163" x1="4.88594" y1="4.34058" x2="5.31755" y2="4.89885" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint6_linear_8440_6163" x1="9.71125" y1="14.3753" x2="9.94682" y2="15.391" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient><linearGradient id="paint7_linear_8440_6163" x1="8.52787" y1="7.5716" x2="12.8439" y2="13.1543" gradientUnits="userSpaceOnUse"><stop stop-color="#FFA800"/><stop offset="0.938927" stop-color="#FFC838"/></linearGradient></defs></svg>
                </div>
                <div class="task_merge" role="button" tabindex="0">
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.2" d="M16.9317 16.9683C18.1205 16.3202 18.8346 15.4891 18.8346 14.583C18.8346 13.6226 18.0323 12.7464 16.7127 12.083C15.1868 11.3158 12.9694 10.833 10.5013 10.833C8.03324 10.833 5.81578 11.3158 4.28989 12.083C2.97034 12.7464 2.16797 13.6226 2.16797 14.583C2.16797 15.5434 2.97034 16.4196 4.28989 17.083C5.81578 17.8502 8.03324 18.333 10.5013 18.333C13.0901 18.333 15.4032 17.8018 16.9317 16.9683Z" fill="#1C64F2"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.20703 3.33366C8.20703 2.06801 9.23303 1.04199 10.4987 1.04199C11.7644 1.04199 12.7904 2.06801 12.7904 3.33366C12.7904 4.59931 11.7644 5.62533 10.4987 5.62533C9.23303 5.62533 8.20703 4.59931 8.20703 3.33366Z" fill="#1C64F2"/><path d="M7.35388 9.64492L5.54113 9.04067C5.01969 8.86684 4.66797 8.37884 4.66797 7.82922C4.66797 7.01625 5.41758 6.41025 6.21251 6.5806L7.79382 6.91945C7.88175 6.93829 7.92572 6.94771 7.96931 6.95672C9.63964 7.30222 11.363 7.30222 13.0333 6.95672C13.0769 6.94771 13.1209 6.93829 13.2088 6.91945L14.7901 6.58059C15.5851 6.41025 16.3346 7.01625 16.3346 7.82922C16.3346 8.37884 15.9829 8.86684 15.4615 9.04067L13.6487 9.64492C13.4296 9.71792 13.3201 9.75442 13.2377 9.80534C12.9572 9.97842 12.8051 10.3007 12.8498 10.6273C12.863 10.7233 12.9044 10.831 12.9873 11.0465L14.0263 13.7479C14.3356 14.552 13.742 15.4163 12.8804 15.4163C12.4399 15.4163 12.0331 15.1803 11.8145 14.7977L10.5013 12.4996L9.18814 14.7977C8.96955 15.1803 8.56274 15.4163 8.12219 15.4163C7.26062 15.4163 6.66704 14.552 6.97633 13.7479L8.01532 11.0465C8.09821 10.831 8.13966 10.7233 8.15278 10.6273C8.19744 10.3007 8.04536 9.97842 7.76484 9.80534C7.68248 9.75442 7.57294 9.71792 7.35388 9.64492Z" fill="#1C64F2"/></svg>
                </div>
              </div>`
            }  

            <div class="images overlap_images ${!task.collaborators.length ? HIDDEN : ""}" id="task_collaborator">
              <div>
                  ${task.collaborators
                    .map((collab, i) => {
                      if (i < 3) {
                        return `<img src="${collab.picture}" alt="${collab.username}" class="image" />`;
                      }
                    })
                    .join("")}
                  ${task.collaborators.length > 3 ? `<div class="image">+${task.collaborators.length - 3}</div>` : ""}
              </div>
            </div>
          </div>`
             : ""
         }
      </div>
    </div>
  `;
  }

  _renderEmptyState() {
    this.unpriotiseContainer.innerHTML = "";
    this.unpriotiseContainer2s.forEach((el) => (el.innerHTML = ""));

    const markup = `
        <div class="main_tasks_list_empty ${this.isChatPage}">
          <img src="images/empty-task.svg" alt="No Task" />

          <div>
            <h2>No Tasks Assigned</h2>
            <p>You haven't added any tasks yet. Stay organized and on top of your responsibilities by creating your first task.</p>
          </div>
        </div>`;

    this.taskListParent.classList.add(HIDDEN);

    // Find the tasks banner and insert after it
    const tasksBanner = this.tasksContainer.querySelector(".tasks_banner");
    if (tasksBanner) {
      tasksBanner.insertAdjacentHTML("afterend", markup);
    } else {
      // Fallback to original behavior if banner not found
      this.tasksContainer.insertAdjacentHTML("afterbegin", markup);
    }
  }

  generateChatTaskSuggestionsMarkup(task) {
    const shortDesc = task.description.slice(0, 70);
    this.suggestionUsernameIndex++;

    return `
    <div class="task_big_wrapper">
      <div class="task_priority_checkbox_container ${HIDDEN}">
        <button id="selectPriorityTask" data-task-id="${task.id}" aria-selected="false" class="task_priority_checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
        </button>
      </div>

      <div class="task task_item--hover task_id--${task.id}" data-task-id="${task.id}">
          <div class="task_row--2">
              <div style="display: flex; align-items: center; gap: 5px;">
                <img src="${task.collaborators[0]?.picture}" class="status_bull" style="width: 40px; min-width: 40px; height: 40px; border-radius: 50%" />
                <div style="line-height: 15px">
                  <h3 style="color: #000000; font-size: 14px; font-weight: 400">${usernameSolution[this.suggestionUsernameIndex - 1]}</h3>
                  <label style="color: #8E8E93; font-size: 12px; font-weight: 300">@mikey</label>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 5px;">
                <span role="button" class="chat_task_suggestion_love">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#E50800" d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"/></svg>
                </span>

                <button class="task_options_btn" data-task="${task.id}">
                  <img src="icons/ellipsis.svg" alt="Ellipsis Icon" class="ellipsis" />
                  <img src="icons/cancel.svg" class="cancel ${HIDDEN}" alt="Cancel Icon" />

                </button>
            </div>
          </div>

          <div class="task_card">
              <h2>${task.title}</h2>
              <div class="collapsible">
                <p>
                <span  class="task-chat-image" style="display: flex; gap: 5px; overflow-x: auto;" >
  ${task.taskImages?.length ? task.taskImages.map((image) => `<img src="${image}" style="width: 66px ; height: 44px; border-radius: 8px" alt="Task Image"/>`).join("") : ""}
</span>
                  <span class="descriptionArea short">${shortDesc}</span>
                  <span class="descriptionArea long ${HIDDEN}">${task.description}</span>
                  <span class="toggle-btn expandTaskDesc">See more</span>
                </p>

                <div class="expandTaskFooter ${HIDDEN}">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 5px;">
                    <span class="toggle-btn collapseTaskDesc">See less</span>

                    <div style="color: #5F6167; font-size: 10px; display: flex; align-items: center; gap: 5px;">
                        <div style="display: flex; align-items: center; gap: 3px;">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#E50800" d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"/></svg>
                          </span>
                          <span>800 Loves</span>
                        </div>

                        <div style="display: flex; align-items: center; gap: 3px;">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="#000000" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 8.25a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"/><path d="M12 3.25c-4.514 0-7.555 2.704-9.32 4.997l-.031.041c-.4.519-.767.996-1.016 1.56c-.267.605-.383 1.264-.383 2.152s.116 1.547.383 2.152c.25.564.617 1.042 1.016 1.56l.032.041C4.445 18.046 7.486 20.75 12 20.75s7.555-2.704 9.32-4.997l.031-.041c.4-.518.767-.996 1.016-1.56c.267-.605.383-1.264.383-2.152s-.116-1.547-.383-2.152c-.25-.564-.617-1.041-1.016-1.56l-.032-.041C19.555 5.954 16.514 3.25 12 3.25M3.87 9.162C5.498 7.045 8.15 4.75 12 4.75s6.501 2.295 8.13 4.412c.44.57.696.91.865 1.292c.158.358.255.795.255 1.546s-.097 1.188-.255 1.546c-.169.382-.426.722-.864 1.292C18.5 16.955 15.85 19.25 12 19.25s-6.501-2.295-8.13-4.412c-.44-.57-.696-.91-.865-1.292c-.158-.358-.255-.795-.255-1.546s.097-1.188.255-1.546c.169-.382.426-.722.864-1.292"/></g></svg>
                          </span>
                          <span>800 views</span>
                        </div>
                    </div>
                  </div>

                  <div style="display: inline-flex; align-items: center; gap: 5px; color: #1266C3; flex-wrap: wrap; text-tranform: capitalize; font-size: 12px; font-weight: 500;">
                   ${task?.interests?.map((h) => `<span>#${h}</span>`).join("")}
                  </div>
                </div>
              </div>
            </div>

            <div class="task_row--4">
              <div class="progress" style="width: ${task?.tracking_rate || 0}%"></div>
              <div class="box_wrapper">
                <div class="box box-1" data-progress="0">0%</div>
                <div class="box box-2" data-progress="20">5%</div>
                <div class="box box-3" data-progress="40">25%</div>
                <div class="box box-4" data-progress="60">50%</div>
                <div class="box box-5" data-progress="75">75%</div>
                <div class="box box-6" data-progress="100">100%</div>
              </div>
            </div>
          <div class="task_row--5">
           
            <button class="collaborate">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"/><path fill="currentColor" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"/></g></svg>
              <span>Collaboration</span>
            </button>
           
            <div class="images overlap_images ${!task.collaborators.length ? HIDDEN : ""}" id="task_collaborator">
              <div>
                  ${task.collaborators
                    .map((collab, i) => {
                      if (i < 3) {
                        return `<img src="${collab.picture}" alt="${collab.username}" class="image" />`;
                      }
                    })
                    .join("")}
                  ${task.collaborators.length > 3 ? `<div class="image">+${task.collaborators.length - 3}</div>` : ""}
              </div>
            </div>
          </div>
      </div>
    </div>
  `;
  }

  initTaskOptionsDropdown() {
    // Create single dropdown element
    this.taskOptionsDropdown = document.createElement("div");
    this.taskOptionsDropdown.className = `task_options animate__animated animate__fadeIn ${HIDDEN}`;
    this.taskOptionsDropdown.setAttribute("aria-hidden", "true");
    this.taskOptionsDropdown.innerHTML = `
      <ul>
        <li class="show_share--modal">
          <img src="icons/share.svg" alt="Share" />
          <span>Share</span>
        </li>
        <li role="button" class="show-report-modal-btn report">
          <span>
            <img src="icons/report.svg" alt="Report" />
          </span>
          <span>Report</span>
        </li>
        <li class="show_task_edit">
          <img src="icons/edit.svg" alt="Edit" />
          <span>Edit</span>
        </li>
        <li class="show_timer--modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 512 512"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M112.91 128A191.85 191.85 0 0 0 64 254c-1.18 106.35 85.65 193.8 192 194c106.2.2 192-85.83 192-192c0-104.54-83.55-189.61-187.5-192a4.36 4.36 0 0 0-4.5 4.37V152"/><path fill="black" d="m233.38 278.63l-79-113a8.13 8.13 0 0 1 11.32-11.32l113 79a32.5 32.5 0 0 1-37.25 53.26a33.2 33.2 0 0 1-8.07-7.94"/></svg>
          <span>Timer</span>
        </li>
        <li class="prioritise">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="black" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 19v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v9M6 19h12M6 19H4m14 0h2m-9 3h2"/><circle cx="12" cy="3" r="1"/></g></svg>
          <span>Unprioritise</span>
        </li>
        <li class="task_option_track" data-tracking="no">
          <img src="icons/untracked.svg" alt="Track/Untrack" />
          <span>Tracked</span>
        </li>
        <li role="button" class="task_visibility">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m-1-2.05V18q-.825 0-1.412-.587T9 16v-1l-4.8-4.8q-.075.45-.137.9T4 12q0 3.025 1.988 5.3T11 19.95m6.9-2.55q1.025-1.125 1.563-2.512T20 12q0-2.45-1.362-4.475T15 4.6V5q0 .825-.587 1.413T13 7h-2v2q0 .425-.288.713T10 10H8v2h6q.425 0 .713.288T15 13v3h1q.65 0 1.175.388T17.9 17.4"/></svg>
          </span>
          <span style="white-space: nowrap;">Send Public</span>
          <label class="switch">
            <input type="checkbox" class="toggleScrollArrow" />
            <span class="slider round"></span>
          </label>
        </li>
        <li class="task_option_collaboration">
          <img src="icons/collaboration.svg" alt="Collaboration" />
          <span>Find Collaboration</span>
        </li>
        <li class="task_option_calender">
          <img src="icons/calender.svg" alt="Calender Light" />
          <span>Add to calender</span>
        </li>
        <li class="discard_btn">
          <img src="icons/trash.svg" alt="Delete" />
          <span>Delete</span>
        </li>
      </ul>
    `;

    // Append to body for proper positioning
    document.body.appendChild(this.taskOptionsDropdown);
  }

  showTaskOptionsDropdown(triggerBtn, taskId) {
    // Store current task ID
    this.currentTaskId = taskId;
    this.taskOptionsDropdown.setAttribute("data-task-id", taskId);

    // Get task data to update dropdown content
    const task = this.currentTaskData.find((t) => t.id == taskId);
    if (!task) return;

    // Update dropdown content based on task and page context
    this.updateDropdownContent(task);

    // Position dropdown relative to trigger button
    this.positionDropdown(triggerBtn);

    // Show dropdown
    this.taskOptionsDropdown.classList.remove(HIDDEN);
    this.taskOptionsDropdown.setAttribute("aria-hidden", "false");
  }

  hideTaskOptionsDropdown() {
    this.taskOptionsDropdown.classList.add(HIDDEN);
    this.taskOptionsDropdown.setAttribute("aria-hidden", "true");
    this.currentTaskId = null;

    // Destroy Popper instance
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  updateDropdownContent(task) {
    const dropdown = this.taskOptionsDropdown;

    // Show/hide report option based on page (only show on chat page)
    const reportOption = dropdown.querySelector(".show-report-modal-btn");
    if (reportOption) {
      reportOption.style.display = this.isChatPage ? "flex" : "none";
    }

    // Show/hide edit option based on page
    const editOption = dropdown.querySelector(".show_task_edit");
    if (editOption) {
      editOption.style.display = this.isChatPage || this.isExplorePage ? "none" : "flex";
    }

    // Show/hide prioritise option based on task state and page
    const prioritiseOption = dropdown.querySelector(".prioritise");
    if (prioritiseOption) {
      const shouldShow = !this.isChatPage && task.priotised && !this.isExplorePage;
      prioritiseOption.style.display = shouldShow ? "flex" : "none";
    }

    // Show/hide track option based on page
    const trackOption = dropdown.querySelector(".task_option_track");
    if (trackOption) {
      trackOption.style.display = this.isChatPage || this.isExplorePage ? "none" : "flex";
    }

    // Show/hide collaboration option based on page
    const collaborationOption = dropdown.querySelector(".task_option_collaboration");
    if (collaborationOption) {
      collaborationOption.style.display = this.isChatPage || this.isExplorePage ? "none" : "flex";
    }

    // Show/hide calendar option based on page
    const calendarOption = dropdown.querySelector(".task_option_calender");
    if (calendarOption) {
      calendarOption.style.display = this.isChatPage || this.isExplorePage ? "none" : "flex";
    }

    // Update visibility toggle
    const visibilityOption = dropdown.querySelector(".task_visibility");
    const visibilityCheckbox = dropdown.querySelector(".toggleScrollArrow");
    if (visibilityOption && visibilityCheckbox) {
      visibilityOption.setAttribute("data-task-id", task.id);
      visibilityCheckbox.checked = task.public || false;
    }
  }

  positionDropdown(triggerBtn) {
    // Destroy existing popper instance
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    // Create new Popper instance
    this.popperInstance = Popper.createPopper(triggerBtn, this.taskOptionsDropdown, {
      placement: "right-start",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
        {
          name: "preventOverflow",
          options: {
            padding: 8,
            boundary: "viewport",
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["right-end", "left-start", "left-end"],
          },
        },
      ],
    });
  }
}

// Initialize
window.taskListApp = new TaskList();
