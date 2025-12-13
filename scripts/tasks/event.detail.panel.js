// Event Detail Panel Component - Integrates with existing system
// Follows existing patterns from modal and panel components

const EVENT_HIDDEN = "event-hidden";

class EventDetailPanelComponent {
  constructor() {
    this.eventModal = null;
    this.currentEvent = null;
    this.init();
  }

  init() {
    this.createEventDetailPanel();
    this.attachEventListeners();
  }

  createEventDetailPanel() {
    // Create modal overlay and panel - follows existing modal pattern
    const modalHtml = `
      <div class="event_detail_modal ${EVENT_HIDDEN}" id="eventDetailModal">
        <div class="event_detail_panel_container" id="eventDetailPanelContainer">
          <!-- Dynamic content will be inserted here -->
        </div>
      </div>
    `;

    // Append to body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Cache DOM references
    this.eventModal = document.getElementById("eventDetailModal");
    this.panelContainer = document.getElementById("eventDetailPanelContainer");
  }

  renderEventDetail(event) {
    const visibilityIcon = this.getVisibilityIcon(event.visibility);
    const categoryClass = event.category || "work";

    return `
      <!-- Event Header -->
      <div class="event_detail_header">
        <div class="event_detail_header_top">
          <span class="event_detail_date_header">${event.date}</span>
          <button class="event_detail_close_btn" id="closeEventDetailBtn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        ${
          event.relatedTasks
            ? `
          <div class="event_detail_task_preview">
            ${event.relatedTasks
              .slice(0, 3)
              .map(
                (task) => `
              <div class="event_task_chip">
                <span class="event_task_chip_dot"></span>
                <span>${task}</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        <div class="event_detail_host">
          <img src="${event.owner.avatar}" alt="${event.owner.name}" class="event_host_avatar" />
          <div class="event_host_info">
            <div class="event_host_label">Hosted by</div>
            <div class="event_host_name">${event.owner.name}</div>
          </div>
        </div>
      </div>

      <!-- Event Body -->
      <div class="event_detail_body">
        <!-- Title Section -->
        <div class="event_detail_title_section">
          <div class="event_detail_title_row">
            <div class="event_category_indicator ${categoryClass}"></div>
            <h1 class="event_detail_title">${event.title}</h1>
          </div>
          ${
            event.status
              ? `<div class="event_status_badge ${event.status}">${event.status}</div>`
              : ""
          }
        </div>

        <!-- Information Rows -->
        <div class="event_detail_info">
          <!-- Date & Time -->
          <div class="event_info_row">
            <svg class="event_info_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div class="event_info_content">
              <div class="event_info_label">Date & Time</div>
              <div class="event_info_value">${event.date}, ${event.startTime} - ${event.endTime}</div>
            </div>
          </div>

          <!-- Description -->
          ${
            event.description
              ? `
            <div class="event_info_row">
              <svg class="event_info_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div class="event_info_content">
                <div class="event_info_label">Description</div>
                <div class="event_info_value">${event.description}</div>
              </div>
            </div>
          `
              : ""
          }

          <!-- Visibility -->
          <div class="event_info_row">
            <svg class="event_info_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              ${visibilityIcon}
            </svg>
            <div class="event_info_content">
              <div class="event_info_label">Visibility</div>
              <div class="event_info_value">${this.capitalizeFirst(event.visibility)}</div>
            </div>
          </div>

          <!-- Attendees -->
          ${
            event.attendees && event.attendees.length > 0
              ? `
            <div class="event_info_row">
              <svg class="event_info_icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div class="event_info_content">
                <div class="event_info_label">Attendees (${event.attendees.length})</div>
                <div class="event_attendees_list">
                  ${event.attendees
                    .map(
                      (attendee) => `
                    <div class="event_attendee_item">
                      <img src="${attendee.avatar}" alt="${attendee.name}" class="event_attendee_avatar" />
                      <span class="event_attendee_name">${attendee.name}</span>
                      <span class="event_attendee_status">${attendee.status}</span>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- Event Footer Actions -->
      <div class="event_detail_footer">
        <button class="event_action_btn secondary" id="eventDeclineBtn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Decline
        </button>
        <button class="event_action_btn primary" id="eventAcceptBtn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Accept
        </button>
      </div>
    `;
  }

  getVisibilityIcon(visibility) {
    switch (visibility) {
      case "public":
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
      case "private":
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
      case "team":
      default:
        return '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />';
    }
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  attachEventListeners() {
    // Close modal when clicking outside - follows existing pattern
    this.eventModal.addEventListener("click", (e) => {
      if (e.target.id === "eventDetailModal") {
        this.hideEventDetail();
      }
    });

    // Delegate event listeners for dynamic buttons
    this.panelContainer.addEventListener("click", (e) => {
      // Close button
      if (e.target.closest("#closeEventDetailBtn")) {
        this.hideEventDetail();
        return;
      }

      // Accept button
      if (e.target.closest("#eventAcceptBtn")) {
        this.handleAccept();
        return;
      }

      // Decline button
      if (e.target.closest("#eventDeclineBtn")) {
        this.handleDecline();
        return;
      }
    });

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.eventModal.classList.contains(EVENT_HIDDEN)) {
        this.hideEventDetail();
      }
    });
  }

  handleAccept() {
    if (this.currentEvent) {
      console.log("Event accepted:", this.currentEvent.id);
      // Add your accept logic here (e.g., API call)
      
      // Show feedback - you can integrate with existing flash message system
      // For now, just close the modal
      this.hideEventDetail();
    }
  }

  handleDecline() {
    if (this.currentEvent) {
      console.log("Event declined:", this.currentEvent.id);
      // Add your decline logic here (e.g., API call)
      
      // Show feedback
      this.hideEventDetail();
    }
  }

  showEventDetail(event) {
    this.currentEvent = event;
    
    // Render event detail content
    this.panelContainer.innerHTML = this.renderEventDetail(event);
    
    // Show modal
    this.eventModal.classList.remove(EVENT_HIDDEN);
  }

  hideEventDetail() {
    this.eventModal.classList.add(EVENT_HIDDEN);
    this.currentEvent = null;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = EventDetailPanelComponent;
}
