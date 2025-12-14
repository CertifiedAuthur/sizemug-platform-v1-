/**
 * Modern Calendar Application - ES6 Class
 * A comprehensive calendar system with modular components
 */

class ModernCalendar {
  constructor() {
    this.selectedDate = new Date();
    this.currentView = "week"; // Default view
    this.currentViewType = "private"; // private/public view type
    this.isModalOpen = false;
    this.events = [];
    this.holidays = [];
    this.birthdays = [];
    this.tasks = [];

    this.init();
  }

  init() {
    this.initializeComponents();
    this.bindEvents();
    this.setupInitialView();
  }

  initializeComponents() {
    // Initialize different calendar components
    this.viewHandler = new ViewHandler(this);
    this.navigationHandler = new NavigationHandler(this);
    this.eventHandler = new EventHandler(this);
    this.modalHandler = new ModalHandler(this);
    this.sidebarHandler = new SidebarHandler(this);
    // We can add more components here as we refactor
  }

  bindEvents() {
    // Main event binding - delegate to specific handlers
    this.viewHandler.bindViewEvents();
    this.navigationHandler.bindNavigationEvents();
    this.eventHandler.bindEventHandlers();
    this.modalHandler.bindModalEvents();
    this.sidebarHandler.bindSidebarEvents();
    // Add more event bindings as we refactor other components
  }

  setupInitialView() {
    // Delegate to view handler
    this.viewHandler.setupInitialView();
  }

  // Public methods for external access
  setSelectedDate(date) {
    this.selectedDate = new Date(date);
    this.viewHandler.updateMainLabel(this.currentView, this.selectedDate);
    this.viewHandler.refreshCurrentView();
  }

  getCurrentView() {
    return this.currentView;
  }

  getSelectedDate() {
    return new Date(this.selectedDate);
  }

  switchView(view) {
    this.viewHandler.switchView(view);
  }
}

// ViewHandler - Handles view switching functionality
class ViewHandler {
  constructor(calendar) {
    this.calendar = calendar;
  }

  bindViewEvents() {
    // Handle desktop view options
    $(".view-options button").on("click", (e) => {
      const view = $(e.currentTarget).data("view");
      this.switchView(view);
    });

    // Handle mobile dropdown
    this.setupMobileDropdown();
  }

  setupMobileDropdown() {
    $(".mobile-drop-down").addClass("cal-hidden");

    $(".dropdown-btn").on("click", (event) => {
      event.stopPropagation();
      $(".mobile-drop-down").toggleClass("cal-hidden");
    });

    $(".dropdown-item").on("click", (event) => {
      const selectedText = $(event.currentTarget).text();
      const view = $(event.currentTarget).data("view");

      $(".dropdown-btn").html(selectedText + ` <span class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6"></path></svg></span>`);

      $(".mobile-drop-down").addClass("cal-hidden");
      this.switchView(view);
    });

    // Hide dropdown if clicking outside
    $(document).on("click", (event) => {
      if (!$(event.target).closest(".dropdown").length) {
        $(".mobile-drop-down").addClass("cal-hidden");
      }
    });
  }

  switchView(view) {
    console.log(`Switching to view: ${view}`);

    // Update current view
    this.calendar.currentView = view;

    // Remove selected class from all buttons
    $(".view-options button").removeClass("selected-view");

    // Add selected class to clicked button
    $(`[data-view="${view}"]`).addClass("selected-view");

    // Hide all calendar views
    $("#main-calendar > *, #main-calendar #mobile-view").addClass("cal-hidden");

    // Show the selected view and update navigation
    switch (view) {
      case "day":
        this.showDayView();
        break;

      case "week":
        this.showWeekView();
        break;

      case "mob-week":
        this.showMobileWeekView();
        break;

      case "month":
      case "mob-month":
        this.showMonthView(view);
        break;

      case "year":
      case "mob-year":
        this.showYearView(view);
        break;

      default:
        console.warn(`Unknown view: ${view}`);
        this.showWeekView(); // Fallback to week view
    }

    // Show navigation buttons
    $("#prev, #next").removeClass("cal-hidden");

    // Update labels and refresh view
    this.updateMainLabel(view, this.calendar.selectedDate);
    this.refreshCurrentView();
  }

  showDayView() {
    $("#day-view").removeClass("cal-hidden");
    $(".navigation").addClass("cal-hidden");
    $(".week-view-pub-priv").removeClass("cal-hidden");
    console.log("Day view activated");
  }

  showWeekView() {
    $("#main-calendar #weekViewContainer").removeClass("cal-hidden");
    $(".navigation").addClass("cal-hidden");
    $(".week-view-pub-priv").removeClass("cal-hidden");
    console.log("Week view activated");
  }

  showMobileWeekView() {
    $("#main-calendar #mobile-view").removeClass("cal-hidden");
    $(".navigation").addClass("cal-hidden");
    $(".week-view-pub-priv").removeClass("cal-hidden");
    console.log("Mobile week view activated");
  }

  showMonthView(view) {
    const monthView = view === "month" ? "#month-view" : "#mobmon-view";
    $(monthView).removeClass("cal-hidden");
    $(".navigation.month-container").removeClass("cal-hidden");
    $(".navigation.year-container").addClass("cal-hidden");
    $(".week-view-pub-priv").addClass("cal-hidden");
    console.log(`Month view activated: ${view}`);
  }

  showYearView(view) {
    const yearView = view === "year" ? "#year-view" : "#mobyear-view";
    $(yearView).removeClass("cal-hidden");
    $(".navigation.month-container").addClass("cal-hidden");
    $(".navigation.year-container").removeClass("cal-hidden");
    $(".week-view-pub-priv").addClass("cal-hidden");
    console.log(`Year view activated: ${view}`);
  }

  updateMainLabel(view, date) {
    console.log(`Updating main label for ${view} view with date:`, date);

    // Call existing updateMainLabel function if available
    if (typeof updateMainLabel === "function") {
      updateMainLabel(view, date);
    } else {
      // Fallback implementation
      const labelElement = $("#main-label");
      if (labelElement.length) {
        switch (view) {
          case "day":
            labelElement.text(
              date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );
            break;
          case "week":
          case "mob-week":
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            labelElement.text(`${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`);
            break;
          case "month":
          case "mob-month":
            labelElement.text(
              date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })
            );
            break;
          case "year":
          case "mob-year":
            labelElement.text(date.getFullYear().toString());
            break;
        }
      }
    }
  }

  refreshCurrentView() {
    console.log(`Refreshing ${this.calendar.currentView} view`);

    switch (this.calendar.currentView) {
      case "day":
        this.generateDayView();
        break;
      case "week":
      case "mob-week":
        if (window.innerWidth <= 760) {
          this.generateMobileView();
        } else {
          this.generateWeekView();
        }
        break;
      case "month":
      case "mob-month":
        this.generateMonthView();
        break;
      case "year":
        this.generateYearView();
        break;
      case "mob-year":
        this.generateMobileYearView();
        break;
    }
  }

  generateDayView() {
    console.log("Generating day view...");
    if (typeof generateDayView === "function") {
      generateDayView(this.calendar.selectedDate);
    }
  }

  generateWeekView() {
    console.log("Generating week view...");
    if (typeof generateWeekView === "function") {
      generateWeekView(this.calendar.selectedDate);
    }
  }

  generateMobileView() {
    console.log("Generating mobile view...");
    if (typeof generateMobileView === "function") {
      generateMobileView(this.calendar.selectedDate);
    }
  }

  generateMonthView() {
    console.log("Generating month view...");
    if (typeof generateMonthView === "function") {
      generateMonthView(this.calendar.selectedDate);
    }
  }

  generateYearView() {
    console.log("Generating year view...");
    if (typeof generateYearView === "function") {
      generateYearView(this.calendar.selectedDate.getFullYear());
    }
  }

  generateMobileYearView() {
    console.log("Generating mobile year view...");
    if (typeof generateMobileYearView === "function") {
      generateMobileYearView(this.calendar.selectedDate.getFullYear());
    }
  }

  setupInitialView() {
    // Set up the initial view based on screen size
    if (window.innerWidth <= 760) {
      this.switchView("mob-week");
    } else {
      this.switchView("week");
    }
  }
}

// NavigationHandler - Handles calendar navigation (prev/next buttons, date selection)
class NavigationHandler {
  constructor(calendar) {
    this.calendar = calendar;
  }

  bindNavigationEvents() {
    // Previous/Next navigation buttons
    $("#prev").on("click", () => {
      this.navigatePrevious();
    });

    $("#next").on("click", () => {
      this.navigateNext();
    });

    // Sidebar calendar day clicks
    $(document).on("click", "#sidebar-calendar .day", (event) => {
      this.handleSidebarDayClick(event);
    });

    // Mobile day selection
    $(document).on("click", ".clickable-day", (event) => {
      this.handleMobileDayClick(event);
    });
  }

  navigatePrevious() {
    const currentView = this.calendar.currentView;
    const currentDate = new Date(this.calendar.selectedDate);

    switch (currentView) {
      case "day":
        currentDate.setDate(currentDate.getDate() - 1);
        break;
      case "week":
      case "mob-week":
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case "month":
      case "mob-month":
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case "year":
      case "mob-year":
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        break;
    }

    this.calendar.setSelectedDate(currentDate);
  }

  navigateNext() {
    const currentView = this.calendar.currentView;
    const currentDate = new Date(this.calendar.selectedDate);

    switch (currentView) {
      case "day":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "week":
      case "mob-week":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "month":
      case "mob-month":
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case "year":
      case "mob-year":
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }

    this.calendar.setSelectedDate(currentDate);
  }

  handleSidebarDayClick(event) {
    $("#sidebar-calendar .day").removeClass("selected");
    $(event.currentTarget).addClass("selected");

    const day = parseInt($(event.currentTarget).text());
    const currentDate = new Date(this.calendar.selectedDate);
    currentDate.setDate(day);

    this.calendar.setSelectedDate(currentDate);
  }

  handleMobileDayClick(event) {
    $(".clickable-day").removeClass("selected-day");
    $(event.currentTarget).addClass("selected-day");

    const selectedDay = $(event.currentTarget).data("day");
    // Update mobile items for the selected day
    if (typeof updateMobileItems === "function") {
      updateMobileItems(selectedDay);
    }
  }
}

// EventHandler - Handles calendar cell clicks and interactions
class EventHandler {
  constructor(calendar) {
    this.calendar = calendar;
    this.modalElement = null;
    this.initializeModal();
  }

  initializeModal() {
    // Create a single modal container in the body
    this.modalElement = $(`
      <div id="calendar-modal-wrapper" class="week_view_modal_wrapper" style="display: none; position: fixed; z-index: 9999;">
        <div style="position: relative; height: 100%">
          <div class="week-view-modal">
            <!-- Modal content will be dynamically updated -->
          </div>
        </div>
      </div>
    `);

    $("body").append(this.modalElement);

    // Add click outside to close modal
    $(document).on("click", (e) => {
      if (!e.target?.closest("td.static-event") && !e.target?.closest("td.static-task") && !e.target.closest(".static-birthday") && !e.target.closest(".static-holiday")) {
        this.hideModal();
      }
    });
  }

  showModal(content, triggerElement) {
    // Update modal content
    this.modalElement.find(".week-view-modal").html(content);

    // Position modal near the trigger element
    const triggerOffset = $(triggerElement).offset();
    const triggerHeight = $(triggerElement).outerHeight();
    const triggerWidth = $(triggerElement).outerWidth();
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();

    // Calculate position
    let left = triggerOffset.left;
    let top = triggerOffset.top + triggerHeight + 10;

    // Adjust if modal would go off screen
    if (left + 400 > windowWidth) {
      // Assuming modal width ~400px
      left = windowWidth - 420;
    }
    if (left < 10) {
      left = 10;
    }

    if (top + 300 > windowHeight) {
      // Assuming modal height ~300px
      top = triggerOffset.top - 310;
    }
    if (top < 10) {
      top = 10;
    }

    // Show modal with positioning - make sure display is set to block
    this.modalElement.css({
      left: left + "px",
      top: top + "px",
      display: "block",
    });

    // Also ensure the modal is visible using jQuery show() as backup
    this.modalElement.show();
  }

  hideModal() {
    this.modalElement.hide();
    // Remove selected state from calendar cells
    document.querySelectorAll("#week-view td").forEach((el) => el.classList.remove("selected-task"));
  }

  updateModalContent(content) {
    if (this.modalElement.is(":visible")) {
      this.modalElement.find(".week-view-modal").html(content);
    }
  }

  bindEventHandlers() {
    // Week view header content clicks
    $("#week-view").on("click", ".header-content", async (event) => {
      await this.handleHeaderContentClick(event);
    });

    // Week view cell clicks
    $("#week-view").on("click", "td", async (event) => {
      await this.handleCellClick(event);
    });

    // Mobile view header content clicks
    $("#mobile-view").on("click", ".header-content", async (event) => {
      await this.handleMobileHeaderClick(event);
    });

    // Mobile view row clicks
    $("#mobile-view").on("click", ".mobile-row", async (event) => {
      await this.handleMobileRowClick(event);
    });

    // See more item clicks
    $(document).on("click", ".see-more-item", (event) => {
      this.handleSeeMoreClick(event);
    });

    // Public/Private view toggle
    $(".public").on("click", () => {
      this.switchToPublicView();
    });

    $(".private").on("click", () => {
      this.switchToPrivateView();
    });

    // Highlight icon clicks
    $("#week-view").on("click", ".highlight-icon", (e) => {
      this.handleHighlightClick(e);
    });

    $("#week-view").on("click", ".highlight-icon-on-cell", (e) => {
      this.handleCellHighlightClick(e);
    });

    $("#week-view").on("click", ".multiple-task-highlight", (e) => {
      this.handleMultipleTaskHighlight(e);
    });
  }

  async handleHeaderContentClick(event) {
    // Handle modal interactions if modal is visible
    if (this.modalElement.is(":visible")) {
      // Close modal if close button clicked
      const close = event.target.closest(".close-modal");
      if (close) {
        this.hideModal();
        return;
      }

      // Handle see all profile clicks
      const seeAllProfile = event.target.closest(".see-all-profile");
      if (seeAllProfile) {
        const invitedSlide = this.modalElement.find("#invitedListUsersSlide");
        invitedSlide.removeClass("cal-hidden");
        return;
      }

      // Handle back from invited view
      const backFromInvitedViewModal = event.target.closest("#backFromInvitedViewModal");
      if (backFromInvitedViewModal) {
        const invitedListUsersSlide = this.modalElement.find("#invitedListUsersSlide");
        invitedListUsersSlide.addClass("cal-hidden");
        return;
      }

      // Check if click is inside modal wrapper
      if (event.target.closest(".week_view_modal_wrapper")) {
        return;
      }
    }

    try {
      const $this = $(event.currentTarget);
      const day = $this.data("day") || "";
      const category = $this.data("category") || "";
      const fullDate = $this.data("date") || "";
      const content = staticContent[currentView]?.[day]?.header;

      if (!content) {
        console.warn("No content found for day:", day);
        return;
      }

      let profileImagesHtml = "";
      try {
        profileImagesHtml = await generateProfileImagesHtml(content.images || []);
      } catch (error) {
        console.error("Failed to generate profile images:", error);
      }

      const modalContent = this.generateHeaderModalContent(content, category, fullDate, day, profileImagesHtml);
      this.showModal(modalContent, event.currentTarget);
    } catch (error) {
      console.error("Error in header-content click handler:", error);
    }
  }

  async handleCellClick(event) {
    console.log("handleCellClick called");

    // Handle modal interactions if modal is visible
    if (this.modalElement.is(":visible")) {
      console.log("Modal is visible, checking interactions");
      if (this.handleModalInteractions(event)) return;

      // Check if click is inside modal wrapper
      if (event.target.closest(".week_view_modal_wrapper")) {
        console.log("Click inside modal wrapper, returning");
        return;
      }
    }

    this.calendar.isModalOpen = true;
    const day = $(event.currentTarget).data("day");
    const time = $(event.currentTarget).data("time");
    const fullDate = $(event.currentTarget).data("date");

    console.log("Cell data:", { day, time, fullDate });
    console.log("Current view type:", this.calendar.currentViewType);
    console.log("Static content:", staticContent);

    const content = staticContent[currentView]?.[day]?.[time];
    console.log("Found content:", content);

    if (!content) {
      console.log("No content found for this cell");
      return;
    }

    try {
      const profileImagesHtml = await generateProfileImagesHtml(content.images || []);
      const descriptionData = this.getTruncatedDescription(content.description || "");

      $("#week-view td").removeClass("selected-task");
      $(event.currentTarget).addClass("selected-task");

      const modalContent = this.generateCellModalContent(content, fullDate, time, profileImagesHtml, descriptionData);
      console.log("Showing modal with content");
      this.showModal(modalContent, event.currentTarget);
    } catch (error) {
      console.error("Error in cell click handler:", error);
    }
  }

  handleModalInteractions(event) {
    // Close modal
    const close = event.target.closest(".close-modal");
    if (close) {
      this.hideModal();
      return true;
    }

    // See all profile
    const seeAllProfile = event.target.closest(".see-all-profile");
    if (seeAllProfile) {
      const invitedSlide = this.modalElement.find("#invitedListUsersSlide");
      invitedSlide.removeClass("cal-hidden");
      return true;
    }

    // Back from more users modal
    const backFromMoreUsersModal = event.target.closest("#backFromMoreUsersModal");
    if (backFromMoreUsersModal) {
      this.modalElement.find("#moreFromUserContainerSlide").addClass("cal-hidden");
      return true;
    }

    // See all by
    const seeAllBy = event.target.closest(".see-all-by");
    if (seeAllBy) {
      const moreFromUserContainerSlide = this.modalElement.find("#moreFromUserContainerSlide");
      moreFromUserContainerSlide.removeClass("cal-hidden");
      return true;
    }

    // Back from invited view modal
    const backFromInvitedViewModal = event.target.closest("#backFromInvitedViewModal");
    if (backFromInvitedViewModal) {
      const invitedListUsersSlide = this.modalElement.find("#invitedListUsersSlide");
      invitedListUsersSlide.addClass("cal-hidden");
      return true;
    }

    return false;
  }

  async handleMobileHeaderClick(event) {
    const day = $(event.currentTarget).data("day");
    const category = $(event.currentTarget).data("category");
    const fullDate = $(event.currentTarget).data("date");
    const content = staticContent[currentView]?.[day]?.header;

    if (!content) {
      console.warn("No content found for day:", day);
      return;
    }

    try {
      const profileImagesHtml = await generateProfileImagesHtml(content.images || []);
      const modalContent = this.generateHeaderModalContent(content, category, fullDate, day, profileImagesHtml);
      this.showModal(modalContent, event.currentTarget);
    } catch (error) {
      console.error("Error in mobile header click handler:", error);
    }
  }

  async handleMobileRowClick(event) {
    console.log("Mobile time-row clicked");

    const day = $(event.currentTarget).data("day");
    const time = $(event.currentTarget).data("time");
    const fullDate = $(event.currentTarget).data("date");

    const content = staticContent[currentView]?.[day]?.[time];

    if (!content) return;

    try {
      const profileImagesHtml = await generateProfileImagesHtml(content.images || []);
      const descriptionData = this.getTruncatedDescription(content.description || "");

      const modalContent = this.generateCellModalContent(content, fullDate, time, profileImagesHtml, descriptionData);
      this.showModal(modalContent, event.currentTarget);
    } catch (error) {
      console.error("Error in mobile row click handler:", error);
    }
  }

  handleSeeMoreClick(event) {
    event.stopPropagation();
    const day = $(event.currentTarget).data("day");
    console.log("See more clicked for day:", day);
    // Add see more functionality here
  }

  switchToPublicView() {
    this.calendar.currentViewType = "public";
    if (typeof currentView !== "undefined") {
      currentView = "public";
    }
    $(".public").addClass("clicked");
    $(".private").removeClass("clicked");
    const $slider = $(".slider");
    $slider.css("transform", "translateX(100%)");
    this.calendar.viewHandler.refreshCurrentView();
  }

  switchToPrivateView() {
    this.calendar.currentViewType = "private";
    if (typeof currentView !== "undefined") {
      currentView = "private";
    }
    $(".public").removeClass("clicked");
    $(".private").addClass("clicked");
    const $slider = $(".slider");
    $slider.css("transform", "translateX(0%)");
    this.calendar.viewHandler.refreshCurrentView();
  }

  handleHighlightClick(e) {
    e.stopPropagation();
    const parentCell = $(e.currentTarget).closest("td");
    const isHighlighted = parentCell.data("isHighlighted") || false;

    if (isHighlighted) {
      parentCell.removeClass("highlighted-cell");
      parentCell.data("isHighlighted", false);
    } else {
      parentCell.addClass("highlighted-cell");
      parentCell.data("isHighlighted", true);
    }
  }

  handleCellHighlightClick(e) {
    e.stopPropagation();
    const parentCell = $(e.currentTarget).closest("td");
    const isHighlighted = parentCell.data("isHighlighted") || false;

    if (isHighlighted) {
      parentCell.removeClass("highlighted-cell");
      parentCell.data("isHighlighted", false);
    } else {
      parentCell.addClass("highlighted-cell");
      parentCell.data("isHighlighted", true);
    }
  }

  handleMultipleTaskHighlight(e) {
    e.stopPropagation();
    const taskItem = $(e.currentTarget).closest(".task-item");
    const isHighlighted = taskItem.data("isHighlighted") || false;

    if (isHighlighted) {
      taskItem.removeClass("highlighted-task");
      taskItem.data("isHighlighted", false);
    } else {
      taskItem.addClass("highlighted-task");
      taskItem.data("isHighlighted", true);

      // Show success message
      const successMessage = $(`
        <div class="success-message">
          <span>Task highlighted successfully!</span>
          <button class="close-success">&times;</button>
        </div>
      `);

      $("body").append(successMessage);
      successMessage.find(".close-success").on("click", function () {
        successMessage.remove();
      });

      setTimeout(() => {
        successMessage.remove();
      }, 3000);
    }
  }

  getTruncatedDescription(description) {
    const maxLength = 90;
    if (description.length > maxLength) {
      const truncatedText = description.slice(0, maxLength) + "...";
      return {
        truncated: truncatedText,
        full: description,
      };
    }
    return { truncated: description, full: null };
  }

  generateHeaderModalContent(content, category, fullDate, day, profileImagesHtml) {
    return `
      <div class="modal-header">
        <div class="title-dot">
          <span class="${category === "holiday" ? "orange-dot" : "pink-dot"}"></span>
          <h2>${this.escapeHtml(content.text || "")}</h2>
        </div>
        <button class="close-modal" aria-label="Close modal">×</button>
      </div>
      <div class="modal-body">
        <p><strong><img src="./images/calender/icons/det-Calendar.svg" alt="Calendar" /></strong> ${this.escapeHtml(fullDate)}</p>
        ${
          content.description
            ? `
          <div class="det-description">
            <strong><img src="./images/calender/icons/det-Paper.svg" alt="Description" /></strong>
            <p>${this.escapeHtml(content.description)}</p>
          </div>
        `
            : ""
        }
        <div class="invite-box">
          <img src="./images/calender/icons/det-invite.svg" alt="Invites" />
          ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
        </div>
        <div class="see-all-profile" role="button" tabindex="0">See all</div>
        <div class="modal-actions">
          <div>
            <button class="invite-btn" aria-label="Invite"><img src="./images/calender/icons/det-invite2.svg" alt="Invite" /></button>
            <button class="delete-btn" aria-label="Delete"><img src="./images/calender/icons/det-Trash.svg" alt="Delete" /></button>
          </div>
          <button class="edit-btn">Edit</button>
        </div>
      </div>
      ${this.generateInvitedSlideHtml()}
    `;
  }

  generateCellModalContent(content, fullDate, time, profileImagesHtml, descriptionData) {
    const categoryDotClass =
      {
        task: "purple-dot",
        event: "blue-dot",
        holiday: "green-dot",
        birthday: "yellow-dot",
      }[content.category] || "";

    const descriptionHtml = `
      <div class="det-description">
        <strong><img src="./images/calender/icons/det-Paper.svg" /></strong>
        <div class="des-expand">
          <p class="description-text">${descriptionData.truncated}</p>
          ${descriptionData.full ? `<button class="read-more-btn">Read All</button>` : ""}
          ${descriptionData.full ? `<p class="full-description">${descriptionData.full}</p>` : ""}
        </div>
      </div>
    `;

    return `
      <div class="modal-header">
        <div class="title-dot">
          <div class="${categoryDotClass}"></div>
          <h2>${content.text_2 || content.text || "No Title"}</h2>
        </div>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
        ${time ? `<p><strong><img src="./images/calender/icons/det-Time.svg" /></strong> ${time}</p>` : ""}
        ${descriptionHtml}
        <div class="invite-box"> 
          <img src="./images/calender/icons/det-invite.svg" />
          ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
        </div>
        <div class="another-picture"></div>
        <div class="see-all-profile">See all</div>
        <div class="modal-actions">
          <div>
            <button class="invite-btn"><img src="./images/calender/icons/det-invite2.svg"/></button>
            <button class="delete-btn"><img src="./images/calender/icons/det-Trash.svg" /></button>
          </div>
          <button class="edit-btn">Edit</button>
        </div>
      </div>
      ${this.generateMoreFromUserSlideHtml()}
      ${this.generateInvitedSlideHtml()}
    `;
  }

  generateInvitedSlideHtml() {
    return `
      <div id="invitedListUsersSlide" class="active_invited_container_slide animate__animated animate__slideInRight cal-hidden">
        <div class="invite_slide_header">
          <button id="backFromInvitedViewModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
          </button>
          <h2>Invites</h2>
        </div>
        <div class="filter_invited">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
          <input type="text" placeholder="Search invites" />
        </div>
        <ul class="invited_lists">
          <!-- Invited users list would be populated here -->
        </ul>
      </div>
    `;
  }

  generateMoreFromUserSlideHtml() {
    return `
      <div id="moreFromUserContainerSlide" class="active_invited_container_slide animate__animated animate__slideInRight cal-hidden">
        <div class="moreFromUserContainerSlideWrapper">
          <div class="invite_slide_header">
            <button id="backFromMoreUsersModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
            </button>
            <h2>More by West Henry</h2>
          </div>
          <div class="main-form-wrapper">
            <form class="filter_invited">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
              <input type="text" placeholder="Search Events" />
            </form>
            <ul class="bookmarked_list">
              <!-- More events list would be populated here -->
            </ul>
          </div>
          <button class="more-from-user-location-button">
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"></path></svg>
            </span>
            <span class="text-content">Highlight all on Calendar</span>
          </button>
        </div>
      </div>
    `;
  }

  escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}

// ModalHandler - Handles modal-specific functionality
class ModalHandler {
  constructor(calendar) {
    this.calendar = calendar;
  }

  bindModalEvents() {
    // Read more button functionality
    $(document).on("click", ".read-more-btn", (event) => {
      this.handleReadMoreClick(event);
    });

    // Modal action buttons
    $(document).on("click", ".invite-btn, .delete-btn, .edit-btn", (event) => {
      this.handleModalActionClick(event);
    });
  }

  handleReadMoreClick(event) {
    const $button = $(event.currentTarget);
    const $fullDescription = $button.closest(".des-expand").find(".full-description");
    const $truncatedDescription = $button.closest(".des-expand").find(".description-text");

    if ($fullDescription.hasClass("cal-hidden")) {
      $fullDescription.removeClass("cal-hidden");
      $truncatedDescription.addClass("cal-hidden");
      $button.text("Read Less");
    } else {
      $fullDescription.addClass("cal-hidden");
      $truncatedDescription.removeClass("cal-hidden");
      $button.text("Read All");
    }
  }

  handleModalActionClick(event) {
    const buttonClass = $(event.currentTarget).attr("class");
    const $modal = $(event.currentTarget).closest(".week-view-modal, .week_view_modal_wrapper");
    
    if (buttonClass.includes("invite-btn")) {
      console.log("Invite functionality would be implemented here");
      // Here you would implement the actual invite modal functionality
    } else if (buttonClass.includes("delete-btn")) {
      console.log("Delete functionality would be implemented here");
      // Here you would implement the actual delete functionality
    } else if (buttonClass.includes("edit-btn")) {
      // Get the event/task data from the modal
      const title = $modal.find(".title-dot h2").text().trim();
      const dateText = $modal.find("p:has(img[src*='det-Calendar'])").text().replace(/\s+/g, ' ').trim();
      const timeText = $modal.find("p:has(img[src*='det-Time'])").text().replace(/\s+/g, ' ').trim();
      const description = $modal.find(".det-description p, .description-text").first().text().trim();
      
      // Determine if it's a task or event based on the modal content
      const hasTimeElement = $modal.find("p:has(img[src*='det-Time'])").length > 0;
      const categoryDot = $modal.find(".title-dot div[class*='-dot']").attr("class");
      
      // Check if it's a task (purple dot) or event (blue/other dots)
      const isTask = categoryDot && categoryDot.includes("purple-dot");
      
      // Close the detail modal
      $modal.remove();
      $(".week_view_modal_wrapper").remove();
      $("#month-view .month-event-item").removeClass("highlighted-event");
      
      // Open the appropriate edit modal
      if (isTask) {
        // Open task edit modal
        $("#addTaskModal").removeClass("cal-hidden");
        // Pre-fill the form with existing data
        $("#addTaskModal .name").val(title);
        $("#addTaskModal .description").val(description);
        
        // Parse and set date if available
        if (dateText) {
          // Extract date from text like "Date: December 10, 2024"
          const dateMatch = dateText.match(/(\w+\s+\d+,\s+\d+)/);
          if (dateMatch) {
            $("#addTaskStart").val(dateMatch[1]);
          }
        }
        
        // Change button text to "Save" for edit mode (use the correct button ID)
        $("#nextTaskModal").text("Save").attr("data-mode", "edit");
      } else {
        // Open event edit modal
        $("#addEventModal").removeClass("cal-hidden");
        // Pre-fill the form with existing data
        $("#addEventModal .name").val(title);
        $("#addEventModal .description").val(description);
        
        // Parse and set date/time if available
        if (dateText) {
          // Extract date from text
          const dateMatch = dateText.match(/(\w+\s+\d+,\s+\d+)/);
          if (dateMatch) {
            $("#addEventModal .datePicker").val(dateMatch[1]);
          }
        }
        
        // Change button text to "Save" for edit mode
        $("#addEventModal #eventSubmitBtn").text("Save").attr("data-mode", "edit");
      }
      
      console.log("Edit clicked:", { title, dateText, timeText, description, isTask });
    }
  }
}

// ModalHandler utility to reset modal to "Add" mode
function resetModalToAddMode(modalId) {
  const submitButton = $(`${modalId} .to-add`);
  submitButton.text("Add").removeAttr("data-mode");
}

// Export function to be used when opening modals in Add mode
if (typeof window !== 'undefined') {
  window.resetModalToAddMode = resetModalToAddMode;
}

// SidebarHandler - Handles sidebar functionality
class SidebarHandler {
  constructor(calendar) {
    this.calendar = calendar;
  }

  bindSidebarEvents() {
    // Sidebar toggle functionality
    $(document).on("click", "#add-new-arrow", (event) => {
      this.toggleSidebar(event);
    });

    $(".expand-trigger").on("click", () => {
      this.closeSidebar();
    });

    // Mobile month label click
    $("#mobile-month-label").on("click", () => {
      $(".sidebar_calendar_content_mobile").removeClass("cal-hidden");
    });

    $(".add-new-arrow").on("click", () => {
      $(".sidebar_calendar_content_mobile").addClass("cal-hidden");
    });

    // Handle responsive sidebar behavior
    this.handleResponsiveSidebar();
  }

  toggleSidebar(event) {
    const $sidebar = $("#sidebar");
    const isOpen = $sidebar.attr("aria-expanded") === "true";
    $sidebar.attr("aria-expanded", !isOpen);
    $(".expand-trigger").removeClass("cal-hidden");
    console.log("Sidebar toggled");
  }

  closeSidebar() {
    $(".expand-trigger").addClass("cal-hidden");
  }

  handleResponsiveSidebar() {
    if (window.innerWidth <= 1024) {
      // Tablet view
      $(".expand-trigger").removeClass("cal-hidden");
      $("#sidebar").attr("aria-expanded", "false");
      $(".expand-trigger").on("click", () => {
        $(".expand-trigger").addClass("cal-hidden");
        const $sidebar = $("#sidebar");
        const isOpen = $sidebar.attr("aria-expanded") === "true";
        $sidebar.attr("aria-expanded", isOpen);
      });
    }
  }
}

// Initialize the modern calendar when DOM is ready
$(document).ready(() => {
  // Create global instance for backward compatibility
  window.modernCalendar = new ModernCalendar();

  // Make it accessible globally for debugging and external access
  window.ModernCalendar = ModernCalendar;

  console.log("Modern Calendar initialized successfully");
});

// Export for module systems if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ModernCalendar,
    ViewHandler,
    NavigationHandler,
    EventHandler,
    ModalHandler,
    SidebarHandler,
  };
}
