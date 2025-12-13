// Calendar Integration - Connects calendar events with Tasks and Event Detail panels
// This script bridges the existing calendar system with the new Tasks/Event UI components

// Initialize components when DOM is ready
let tasksPanel;
let eventDetailPanel;

// Sample calendar event data - maps to task structure
const calendarEventsData = {
  tasks: [
    {
      id: 1,
      title: "Product Design Sprint",
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      date: "December 13, 2025",
      visibility: "team",
      category: "work",
      status: "confirmed",
      description: "Review and finalize the new dashboard designs for Q1 2026 release.",
      owner: {
        id: 1,
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      collaborators: [
        { id: 2, name: "Mike Ross", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 3, name: "Emma Wilson", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
      ],
      attendees: [
        { name: "Sarah Chen", avatar: "https://randomuser.me/api/portraits/women/44.jpg", status: "Accepted" },
        { name: "Mike Ross", avatar: "https://randomuser.me/api/portraits/men/32.jpg", status: "Accepted" },
        { name: "Emma Wilson", avatar: "https://randomuser.me/api/portraits/women/65.jpg", status: "Pending" },
      ],
      relatedTasks: ["Design Review", "User Testing", "Prototype"],
    },
    {
      id: 2,
      title: "Team Standup Meeting",
      startTime: "10:00 AM",
      endTime: "10:30 AM",
      date: "December 13, 2025",
      visibility: "team",
      category: "meeting",
      status: "confirmed",
      description: "Daily sync with the engineering team to discuss blockers and progress.",
      owner: {
        id: 4,
        name: "John Smith",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      collaborators: [
        { id: 5, name: "Lisa Anderson", avatar: "https://randomuser.me/api/portraits/women/47.jpg" },
      ],
      attendees: [
        { name: "John Smith", avatar: "https://randomuser.me/api/portraits/men/22.jpg", status: "Accepted" },
        { name: "Lisa Anderson", avatar: "https://randomuser.me/api/portraits/women/47.jpg", status: "Accepted" },
        { name: "David Park", avatar: "https://randomuser.me/api/portraits/men/18.jpg", status: "Accepted" },
      ],
      relatedTasks: ["Sprint Planning", "Code Review"],
    },
    {
      id: 3,
      title: "Client Presentation",
      startTime: "02:00 PM",
      endTime: "03:30 PM",
      date: "December 13, 2025",
      visibility: "public",
      category: "work",
      status: "pending",
      description: "Present Q4 results and roadmap for 2026 to key stakeholders.",
      owner: {
        id: 6,
        name: "Rachel Green",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      collaborators: [
        { id: 7, name: "Tom Brady", avatar: "https://randomuser.me/api/portraits/men/54.jpg" },
        { id: 8, name: "Nina Patel", avatar: "https://randomuser.me/api/portraits/women/29.jpg" },
      ],
      attendees: [
        { name: "Rachel Green", avatar: "https://randomuser.me/api/portraits/women/68.jpg", status: "Accepted" },
        { name: "Tom Brady", avatar: "https://randomuser.me/api/portraits/men/54.jpg", status: "Pending" },
        { name: "Nina Patel", avatar: "https://randomuser.me/api/portraits/women/29.jpg", status: "Accepted" },
      ],
      relatedTasks: ["Slide Deck", "Demo Setup"],
    },
    {
      id: 4,
      title: "Lunch with Marketing Team",
      startTime: "12:30 PM",
      endTime: "01:30 PM",
      date: "December 13, 2025",
      visibility: "private",
      category: "personal",
      status: "confirmed",
      description: "Team bonding lunch at the new Italian restaurant downtown.",
      owner: {
        id: 9,
        name: "Alex Turner",
        avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      },
      collaborators: [],
      attendees: [
        { name: "Alex Turner", avatar: "https://randomuser.me/api/portraits/men/75.jpg", status: "Accepted" },
        { name: "Maria Garcia", avatar: "https://randomuser.me/api/portraits/women/12.jpg", status: "Accepted" },
      ],
    },
    {
      id: 5,
      title: "Holiday Planning Meeting",
      startTime: "04:00 PM",
      endTime: "05:00 PM",
      date: "December 13, 2025",
      visibility: "team",
      category: "holiday",
      status: "confirmed",
      description: "Plan the company holiday party and end-of-year celebrations.",
      owner: {
        id: 10,
        name: "Sophie Martin",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      },
      collaborators: [
        { id: 11, name: "Chris Evans", avatar: "https://randomuser.me/api/portraits/men/41.jpg" },
      ],
      attendees: [
        { name: "Sophie Martin", avatar: "https://randomuser.me/api/portraits/women/33.jpg", status: "Accepted" },
        { name: "Chris Evans", avatar: "https://randomuser.me/api/portraits/men/41.jpg", status: "Accepted" },
      ],
      relatedTasks: ["Venue Booking", "Catering"],
    },
  ],
};

// Initialize the integration when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  // Initialize both panel components
  tasksPanel = new TasksPanelComponent(calendarEventsData.tasks);
  eventDetailPanel = new EventDetailPanelComponent();

  // Make components globally accessible for calendar interactions
  window.tasksPanel = tasksPanel;
  window.eventDetailPanel = eventDetailPanel;

  console.log("Tasks and Event Detail panels initialized");
});

// Override existing month event click handler
document.addEventListener("click", function (e) {
  // Handle individual event clicks - Show Event Detail panel
  if (e.target.closest(".month-event-item")) {
    e.stopPropagation();
    const eventItem = e.target.closest(".month-event-item");

    // Extract event title from the clicked item
    const titleElement = eventItem.querySelector(".event-content span");
    const title = titleElement ? titleElement.textContent : "Event";

    // Find matching event data
    const matchingEvent = calendarEventsData.tasks.find((task) => task.title === title);

    if (matchingEvent && window.eventDetailPanel) {
      // Show the new Event Detail panel
      window.eventDetailPanel.showEventDetail(matchingEvent);
    } else {
      console.warn("Event not found or panel not initialized:", title);
    }

    return;
  }

  // Handle "See more" button clicks - Show Tasks List panel
  if (e.target.closest(".see-more-item")) {
    e.stopPropagation();

    if (window.tasksPanel) {
      // Show the Tasks List panel
      window.tasksPanel.showTasksPanel();
    } else {
      console.warn("Tasks panel not initialized");
    }

    return;
  }
});

// Also handle week view event clicks
$(document).ready(function () {
  // Week view header content clicks (existing events in week/day view)
  $("#week-view, #day-view").on("click", ".header-content, .multi-day-event-block", function (e) {
    // Don't override close buttons or other actions
    if (e.target.closest(".close-modal, .see-all-profile, #backFromInvitedViewModal")) {
      return;
    }

    // Get event title from the clicked element
    const eventTitle = $(this).data("title") || $(this).find("h2").text() || $(this).text().trim();

    if (eventTitle) {
      // Find matching event
      const matchingEvent = calendarEventsData.tasks.find((task) => task.title.includes(eventTitle) || eventTitle.includes(task.title));

      if (matchingEvent && window.eventDetailPanel) {
        // Close any existing modals
        $(".week_view_modal_wrapper").remove();

        // Show new Event Detail panel
        window.eventDetailPanel.showEventDetail(matchingEvent);
      }
    }
  });
});

// Helper function to add event to calendar data (for future API integration)
window.addCalendarEvent = function (eventData) {
  calendarEventsData.tasks.push(eventData);
  if (window.tasksPanel) {
    window.tasksPanel.updateTasksData(calendarEventsData.tasks);
  }
};

// Helper function to update event in calendar data
window.updateCalendarEvent = function (eventId, updatedData) {
  const index = calendarEventsData.tasks.findIndex((task) => task.id === eventId);
  if (index !== -1) {
    calendarEventsData.tasks[index] = { ...calendarEventsData.tasks[index], ...updatedData };
    if (window.tasksPanel) {
      window.tasksPanel.updateTasksData(calendarEventsData.tasks);
    }
  }
};

// Helper function to remove event from calendar data
window.removeCalendarEvent = function (eventId) {
  calendarEventsData.tasks = calendarEventsData.tasks.filter((task) => task.id !== eventId);
  if (window.tasksPanel) {
    window.tasksPanel.updateTasksData(calendarEventsData.tasks);
  }
};

console.log("Calendar integration script loaded");
