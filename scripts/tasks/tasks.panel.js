// Tasks Panel Component - Integrates with existing system
// Follows existing patterns from chat, explore, and modal components

const TASK_HIDDEN = "task-hidden";
const EVENT_HIDDEN = "event-hidden";

// Sample task data structure - replace with actual API data
const sampleTasksData = [
  {
    id: 1,
    title: "Review Q4 Marketing Strategy",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    visibility: "public", // public, private, team
    owner: {
      id: 1,
      name: "Wade Warren",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
    },
    collaborators: [
      {
        id: 2,
        name: "Emily Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 3,
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 4,
        name: "Sarah Williams",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60",
      },
    ],
    category: "meeting",
    status: "confirmed",
    description: "Comprehensive review of our Q4 marketing initiatives and strategy alignment.",
    date: "December 15, 2025",
    attendees: [
      { id: 1, name: "Wade Warren", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
      { id: 2, name: "Emily Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60", status: "Pending" },
      { id: 3, name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
    ],
  },
  {
    id: 2,
    title: "Team Standup - Development",
    startTime: "11:00 AM",
    endTime: "11:30 AM",
    visibility: "team",
    owner: {
      id: 5,
      name: "Cameron Williamson",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60",
    },
    collaborators: [
      {
        id: 6,
        name: "Alex Martinez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60",
      },
    ],
    category: "work",
    status: "confirmed",
    description: "Daily standup to sync on development progress and blockers.",
    date: "December 15, 2025",
    attendees: [
      { id: 5, name: "Cameron Williamson", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
      { id: 6, name: "Alex Martinez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
    ],
  },
  {
    id: 3,
    title: "Client Presentation - Acme Corp",
    startTime: "02:00 PM",
    endTime: "03:30 PM",
    visibility: "private",
    owner: {
      id: 7,
      name: "Brooklyn Simmons",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
    },
    collaborators: [
      {
        id: 1,
        name: "Wade Warren",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60",
      },
      {
        id: 8,
        name: "David Lee",
        avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&auto=format&fit=crop&q=60",
      },
    ],
    category: "meeting",
    status: "pending",
    description: "Final presentation of the new brand identity and marketing materials for Acme Corp.",
    date: "December 15, 2025",
    attendees: [
      { id: 7, name: "Brooklyn Simmons", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
      { id: 1, name: "Wade Warren", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
    ],
  },
  {
    id: 4,
    title: "Design Review - Mobile App",
    startTime: "04:00 PM",
    endTime: "05:00 PM",
    visibility: "team",
    owner: {
      id: 2,
      name: "Emily Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60",
    },
    collaborators: [],
    category: "work",
    status: "confirmed",
    description: "Review and feedback session for the new mobile app design mockups.",
    date: "December 15, 2025",
    attendees: [
      { id: 2, name: "Emily Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60", status: "Accepted" },
    ],
  },
];

class TasksPanelComponent {
  constructor() {
    this.tasksModal = null;
    this.tasksListContainer = null;
    this.searchInput = null;
    this.currentTasks = [...sampleTasksData];
    this.init();
  }

  init() {
    this.createTasksPanel();
    this.attachEventListeners();
  }

  createTasksPanel() {
    // Create modal overlay and panel - follows existing modal pattern
    const modalHtml = `
      <div class="tasks_modal ${TASK_HIDDEN}" id="tasksModal">
        <div class="tasks_panel_container">
          <!-- Panel Header -->
          <div class="tasks_panel_header">
            <div class="tasks_panel_title">
              <span>Tasks</span>
              <span class="tasks_count_badge" id="tasksCountBadge">${this.currentTasks.length}</span>
            </div>
          </div>

          <!-- Search Container -->
          <div class="tasks_search_container">
            <div class="tasks_search_wrapper">
              <svg class="tasks_search_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                class="tasks_search_input" 
                id="tasksSearchInput"
                placeholder="Search tasks..."
                autocomplete="off"
              />
            </div>
          </div>

          <!-- Task List -->
          <div class="tasks_list_container" id="tasksListContainer">
            ${this.renderTaskCards()}
          </div>
        </div>
      </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Cache DOM references
    this.tasksModal = document.getElementById("tasksModal");
    this.tasksListContainer = document.getElementById("tasksListContainer");
    this.searchInput = document.getElementById("tasksSearchInput");
  }

  renderTaskCards() {
    if (this.currentTasks.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem; color: #667085;">
          <p>No tasks found</p>
        </div>
      `;
    }

    return this.currentTasks
      .map(
        (task) => `
      <div class="task_card" data-task-id="${task.id}">
        <!-- Row 1: Time and Visibility -->
        <div class="task_card_row_time">
          <span class="task_time">${task.startTime} - ${task.endTime}</span>
          <svg class="task_visibility_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            ${
              task.visibility === "public"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />'
                : task.visibility === "private"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />'
            }
          </svg>
        </div>

        <!-- Row 2: Title -->
        <div class="task_card_row_title">
          <h3 class="task_title">${task.title}</h3>
        </div>

        <!-- Row 3: Owner and Collaborators -->
        <div class="task_card_row_footer">
          <div class="task_owner">
            <img src="${task.owner.avatar}" alt="${task.owner.name}" class="task_owner_avatar" />
            <span class="task_owner_name">${task.owner.name}</span>
          </div>
          ${
            task.collaborators.length > 0
              ? `
            <div class="task_collaborators">
              ${task.collaborators
                .slice(0, 3)
                .map((collab) => `<img src="${collab.avatar}" alt="${collab.name}" class="task_collaborator_avatar" />`)
                .join("")}
              ${
                task.collaborators.length > 3
                  ? `<div class="task_collaborator_more">+${task.collaborators.length - 3}</div>`
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>
      </div>
    `
      )
      .join("");
  }

  attachEventListeners() {
    // Close modal when clicking outside - follows existing pattern
    this.tasksModal.addEventListener("click", (e) => {
      if (e.target.id === "tasksModal") {
        this.hideTasksPanel();
      }
    });

    // Search functionality
    this.searchInput.addEventListener("input", (e) => {
      this.handleSearch(e.target.value);
    });

    // Task card click - delegate event listener
    this.tasksListContainer.addEventListener("click", (e) => {
      const taskCard = e.target.closest(".task_card");
      if (taskCard) {
        const taskId = parseInt(taskCard.dataset.taskId);
        this.handleTaskClick(taskId);
      }
    });
  }

  handleSearch(query) {
    const searchTerm = query.toLowerCase().trim();

    if (!searchTerm) {
      this.currentTasks = [...sampleTasksData];
    } else {
      this.currentTasks = sampleTasksData.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.owner.name.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Update task count badge
    document.getElementById("tasksCountBadge").textContent = this.currentTasks.length;

    // Re-render task list
    this.tasksListContainer.innerHTML = this.renderTaskCards();
  }

  handleTaskClick(taskId) {
    const task = sampleTasksData.find((t) => t.id === taskId);
    if (task) {
      // Hide tasks panel
      this.hideTasksPanel();

      // Open event detail panel
      if (window.eventDetailPanel) {
        window.eventDetailPanel.showEventDetail(task);
      }
    }
  }

  showTasksPanel() {
    this.tasksModal.classList.remove(TASK_HIDDEN);
  }

  hideTasksPanel() {
    this.tasksModal.classList.add(TASK_HIDDEN);
  }

  updateTasksData(newTasks) {
    this.tasksData = newTasks;
    this.filteredTasks = newTasks;
    this.renderTaskCards();
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TasksPanelComponent;
}
