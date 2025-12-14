const calenderAddNew = document.getElementById("add-new-cal");
const addNewModal = document.getElementById("addNewModal");

calenderAddNew.addEventListener("click", (e) => {
  addNewModal.classList.remove(HIDDEN);
});

const addEventBtn = document.getElementById("addEventBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const addHolidayBtn = document.getElementById("addHolidayBtn");
const addBirthdayBtn = document.getElementById("addBirthdayBtn");
const eventModal = document.getElementById("eventModal");
const addEventModal = document.getElementById("addEventModal");

let firstTimeAddNew = true;
let path = "";

/**
 * ============================================
 * SLIDE FUNCTIONS - Declare before use
 * ============================================
 */
const slideItems = document.querySelectorAll(".event_intro_container>div");
let currentSlide = 0; // Track the current slide

const goToSlide = function (slide) {
  console.log(`goToSlide(${slide}) called, currentSlide was:`, currentSlide);
  currentSlide = slide;
  slideItems.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  
  // Show/hide done-items button based on slide position
  const doneItemsBtn = document.querySelector(".next-item.done-items");
  const nextTaskBtn = document.querySelector(".next-task");
  
  console.log("Elements found:", { doneItemsBtn: !!doneItemsBtn, nextTaskBtn: !!nextTaskBtn });
  
  if (doneItemsBtn) {
    // Show done button only on last slide (slide 3 = Birthday)
    if (slide === 3) {
      doneItemsBtn.style.display = "flex";
      console.log("Done button set to flex (slide 3)");
    } else {
      doneItemsBtn.style.display = "none";
      console.log("Done button set to none");
    }
  }
  
  if (nextTaskBtn) {
    // Show next-task button on all slides except the last one
    if (slide < 3) {
      nextTaskBtn.style.display = "flex";
      console.log("Next button set to flex (slide < 3)");
      console.log("Next button computed display:", window.getComputedStyle(nextTaskBtn).display);
      console.log("Next button visible?", nextTaskBtn.offsetWidth > 0 && nextTaskBtn.offsetHeight > 0);
    } else {
      nextTaskBtn.style.display = "none";
      console.log("Next button set to none (last slide)");
    }
  }
};

// Allow other modules to reset the intro slides using the existing function.
// (Matches the project pattern of attaching small helpers to window when needed.)
if (typeof window !== "undefined") {
  window.goToSlide = goToSlide;
}

// NOTE: Don't initialize slides on page load - the parent modal is hidden (.cal-hidden)
// so inline display styles won't work. Instead, goToSlide(0) is called when the modal opens.

/**
 * ============================================
 * ISSUE #1: CLICK OUTSIDE TO CLOSE MODALS
 * ============================================
 */
function setupClickOutsideToClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.addEventListener("click", function(event) {
    // Check if the click is on the modal background (not on the content)
    if (event.target === modal) {
      modal.classList.add("cal-hidden");
      
      // Reset slides if it's the eventModal
      if (modalId === "eventModal") {
        goToSlide(0);
      }
    }
  });

  // Find the modal content and prevent clicks from bubbling up
  // EXCEPT for clicks on buttons, which need to reach their handlers
  const modalContent = modal.querySelector(".cal-modal-content, .modal-mobile-container, .event_intro_container");
  if (modalContent) {
    modalContent.addEventListener("click", function(event) {
      console.log("Modal content clicked:", modalId);
      console.log("Target:", event.target);
      console.log("Target classes:", event.target.className);
      console.log("Target ID:", event.target.id);
      
      // Allow clicks on buttons, inputs, and interactive elements to bubble
      const isInteractive = event.target.closest('button, .next-item, .done-items, .next-task, input, select, textarea, a, [role="button"], #nextTaskModal, .footers button');
      console.log("Is interactive?", !!isInteractive);
      
      if (!isInteractive) {
        console.log("Stopping propagation for non-interactive element");
        event.stopPropagation();
      } else {
        console.log("Allowing click to bubble for interactive element");
      }
    });
  }

  // Setup close button if exists
  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    closeButton.addEventListener("click", function() {
      modal.classList.add("cal-hidden");
      
      // Reset slides if it's the eventModal
      if (modalId === "eventModal") {
        goToSlide(0);
      }
    });
  }
}

// Apply to all add modals
setupClickOutsideToClose("addNewModal");
setupClickOutsideToClose("eventModal"); // Intro slides modal
setupClickOutsideToClose("addEventModal");
setupClickOutsideToClose("addTaskModal");
setupClickOutsideToClose("addHolidayModal");
setupClickOutsideToClose("addBirthdayModal");
setupClickOutsideToClose("addTaskOption");
setupClickOutsideToClose("importModal");
setupClickOutsideToClose("upload-interest");

/**
 * ============================================
 * ISSUE #2: ADD AND CANCEL BUTTONS
 * ============================================
 */
function setupModalButtons(modalId, submitBtnId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  // Cancel button - use jQuery to match existing pattern and avoid duplicate vanilla listeners
  const cancelBtn = modal.querySelector(".to-cancel");
  if (cancelBtn) {
    // Remove any existing handlers first to prevent duplicates
    $(cancelBtn).off("click");
    
    $(cancelBtn).on("click", function(e) {
      e.preventDefault();
      $(modal).addClass("cal-hidden");

      // Special-case: if canceling the final task step, reset the intro slides too
      // so the Add New flow is never stuck half-way.
      if (modalId === "upload-interest") {
        goToSlide(0);
      }
      
      // Also reset buttons to "Add"/"Next" mode when canceling
      if (modalId === "addEventModal") {
        $("#addEventModal #eventSubmitBtn").text("Add").removeAttr("data-mode");
      } else if (modalId === "addTaskModal") {
        $("#nextTaskModal").text("Next").removeAttr("data-mode");
      }

      // Clear form if exists
      const form = modal.querySelector("form");
      if (form) form.reset();
    });
  }

  // Add/Submit button - will be handled by existing submit handlers
  // but we ensure modal closes after successful add
}

// Setup buttons for all modals
setupModalButtons("addEventModal", "eventSubmitBtn");
setupModalButtons("addTaskModal", "nextTaskModal");
setupModalButtons("addHolidayModal", "holidaySubmitBtn");
setupModalButtons("addBirthdayModal", null);
setupModalButtons("upload-interest", "createTaskBtn");

/**
 * ============================================
 * ISSUE #5: PRIVATE/PUBLIC TOGGLE MOVEMENT
 * ============================================
 */
function setupPrivatePublicToggle() {
  const allToggles = document.querySelectorAll(".switch_buttons_wrapper");
  
  allToggles.forEach((wrapper) => {
    const buttons = wrapper.querySelectorAll(".switch_buttons button");
    const slider = wrapper.querySelector(".switch_sliding--slider");
    
    if (!buttons.length || !slider) return;
    
    buttons.forEach((button, index) => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Remove clicked class from all buttons
        buttons.forEach(btn => btn.classList.remove("clicked"));
        
        // Add clicked class to current button
        this.classList.add("clicked");
        
        // Move the slider
        if (this.classList.contains("public")) {
          slider.style.transform = "translateX(100%)";
        } else if (this.classList.contains("private")) {
          slider.style.transform = "translateX(0%)";
        }
      });
    });
  });
}

// Initialize toggle functionality
setupPrivatePublicToggle();

addEventBtn.addEventListener("click", () => {
  console.log("=== Event button clicked ===");
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "event";
    // Reset slides when opening modal for first time
    console.log("Opening event modal, calling goToSlide(0)");
    setTimeout(() => goToSlide(0), 50); // Small delay to ensure modal is visible
  } else {
    $("#addEventModal").removeClass("cal-hidden");
    // Reset button to "Add" mode
    $("#addEventModal #eventSubmitBtn").text("Add").removeAttr("data-mode");
  }
});

addTaskBtn.addEventListener("click", () => {
  console.log("=== Task button clicked ===");
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "task";
    // Reset slides when opening modal for first time
    console.log("Opening task modal, calling goToSlide(0)");
    setTimeout(() => goToSlide(0), 50); // Small delay to ensure modal is visible
  } else {
    $("#addTaskOption").removeClass("cal-hidden");
    // Reset button to "Next" mode when opening for new task
    $("#nextTaskModal").text("Next").removeAttr("data-mode");
  }
});

addHolidayBtn.addEventListener("click", () => {
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "holiday";
    // Reset slides when opening modal for first time
    goToSlide(0);
  } else {
    // $("#addNewModal").addClass("cal-hidden");
    $("#addHolidayModal").removeClass("cal-hidden");
  }
});

addBirthdayBtn.addEventListener("click", () => {
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "birthday";
    // Reset slides when opening modal for first time
    goToSlide(0);
  } else {
    $("#addBirthdayModal").removeClass("cal-hidden");
  }
});

/**
 * ============================================
 * ISSUE #2: FIX NAVIGATION ARROW
 * Navigate through all slides (0 -> 1 -> 2 -> 3)
 * Use jQuery event delegation to ensure handlers work even if DOM changes
 * ============================================
 */

// Wrap in document ready to ensure DOM and jQuery are fully loaded
$(document).ready(function() {
  console.log("=== Setting up arrow handlers ===");
  console.log("#eventModal exists:", $("#eventModal").length > 0);
  console.log(".next-task exists:", $(".next-task").length);
  console.log(".done-items exists:", $(".done-items").length);
  
  // IMPORTANT: We CANNOT use delegated handlers because setupClickOutsideToClose()
  // adds event.stopPropagation() to .event_intro_container, which prevents
  // clicks from bubbling up to #eventModal. So we must use direct binding.
  
  // Direct handler for arrow button
  $(".next-task").on("click", function (e) {
    console.log("🎯 Arrow clicked!");
    console.log("currentSlide:", currentSlide);
    // Move to the next slide
    if (currentSlide < 3) {
      goToSlide(currentSlide + 1);
    }
  });

  // Direct handler for done button
  $(".next-item.done-items").on("click", function () {
    console.log("Done button clicked!");
    $("#eventModal").addClass("cal-hidden");
    
    // Reset to first slide for next time
    goToSlide(0);

    if (path === "event") {
      $("#addEventModal").removeClass("cal-hidden");
    } else if (path === "task") {
      $("#addTaskOption").removeClass("cal-hidden");
    } else if (path === "holiday") {
      $("#addHolidayModal").removeClass("cal-hidden");
    } else if (path === "birthday") {
      $("#addBirthdayModal").removeClass("cal-hidden");
    }
  });
  
  console.log("=== Arrow handlers setup complete ===");
});

/**
 *
 *
 *
 *
 *
 *
 *
 * Year Slider Transition
 *
 *
 *
 *
 *
 *
 *
 *
 */

/**
 *
 *
 *
 *
 */
//////////////////////////////////////////////////////////////// Year Slider
const yearSliderContainer = document.getElementById("yearSliderContainer");
let yearSliderContainerItems;

function createYearsInitially() {
  const startYear = 1900;
  const endYear = 2100;
  yearSliderContainer.innerHTML = "";
  for (let year = startYear; year <= endYear; year++) {
    const li = document.createElement("li");
    li.textContent = year;
    li.classList.add("label");
    li.id = `main-label-${year}`;
    yearSliderContainer.appendChild(li);
  }
  yearSliderContainerItems = document.querySelectorAll("#yearSliderContainer > li");
}

createYearsInitially();

const goToYearSlideItem = function (slide) {
  yearSliderContainerItems.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

function goToYearSlider(targetYear) {
  const startYear = 1900;
  const index = targetYear - startYear;
  if (index >= 0 && index < yearSliderContainerItems.length) {
    goToYearSlideItem(index);
  } else {
    console.error(`Year ${targetYear} is out of range (1900-${startYear + yearSliderContainerItems.length - 1})`);
  }
}
goToYearSlider(globalCurrentYear);

const yearPrevButton = document.querySelector(".year-container .prevYearButton"); // Adjust selector
const yearNextButton = document.querySelector(".year-container .nextYearButton"); // Adjust selector

yearNextButton.addEventListener("click", () => {
  globalCurrentYear++;

  selectedDate.setFullYear(globalCurrentYear);
  updateSidebarMonthLabel(selectedDate);
  generateSidebarCalendar(selectedDate);

  updateMainCalendar();
  goToYearSlider(globalCurrentYear);
  goToMonthSlider(selectedDate.getMonth());
});

yearPrevButton.addEventListener("click", () => {
  globalCurrentYear--;
  goToYearSlider(globalCurrentYear);
});

//////////////////////////////////////////////////////////////// Month Slider
const monthSliderContainer = document.getElementById("monthSliderContainer");
let monthSliderContainerItems;
let currentMonthIndex = 0; // 0 = January, 11 = December

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function createMonthsInitially() {
  monthSliderContainer.innerHTML = "";
  months.forEach((month, index) => {
    const li = document.createElement("li");
    li.textContent = month;
    li.classList.add("label");
    li.id = `month-label-${index}`; // e.g., month-label-0 for January
    monthSliderContainer.appendChild(li);
  });
  monthSliderContainerItems = document.querySelectorAll("#monthSliderContainer > li");
}

createMonthsInitially();

const goToMonthSlideItem = function (slide) {
  monthSliderContainerItems.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

function goToMonthSlider(targetMonth) {
  // Accept month name (e.g., "March") or index (e.g., 2)
  let index;
  if (typeof targetMonth === "string") {
    index = months.indexOf(targetMonth);
  } else {
    index = targetMonth;
  }

  if (index >= 0 && index < months.length) {
    currentMonthIndex = index; // Update current month
    goToMonthSlideItem(index);
  } else {
    console.error(`Month ${targetMonth} is invalid. Use 0-11 or a valid month name.`);
  }
}

// Initialize the month slider to the current month
goToMonthSlider(new Date().getMonth());

const monthPrevButton = document.querySelector(".month-container .prevYearButton");
const monthNextButton = document.querySelector(".month-container .nextYearButton");

monthNextButton.addEventListener("click", () => {
  currentMonthIndex = (currentMonthIndex + 1) % 12; // Wrap around to 0 after 11
  goToMonthSlider(currentMonthIndex);
});

monthPrevButton.addEventListener("click", () => {
  currentMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Wrap around to 11 from 0
  goToMonthSlider(currentMonthIndex);
});

/**
 * ============================================
 * ISSUE #6 & #7: MONTH VIEW EVENT DETAILS & SEE MORE
 * ============================================
 */

// Create see more modal if it doesn't exist
function createSeeMoreModal() {
  if (document.getElementById("seeMoreModal")) return;

  const modalHTML = `
    <div id="seeMoreModal" class="cal-modal cal-hidden" style="z-index: 10000;">
      <div class="modal-mobile-container">
        <div class="close-mobile close-modal">
          <img src="./images/calender/icons/close-mobile.svg" />
        </div>
        <div class="cal-modal-content">
          <h3 class="modal-title" id="seeMoreTitle">All Events</h3>
          <div id="seeMoreContent" style="max-height: 400px; overflow-y: auto; padding: 20px 0;">
            <!-- Events will be populated here -->
          </div>
          <div class="footers">
            <button class="to-cancel">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  setupClickOutsideToClose("seeMoreModal");
}

// Initialize modals
createSeeMoreModal();

// Handle month event clicks - Use existing week calendar modal
document.addEventListener("click", function(e) {
  // Handle individual event clicks - Show same modal as week view
  if (e.target.closest(".month-event-item")) {
    e.stopPropagation();
    const eventItem = e.target.closest(".month-event-item");
    const td = eventItem.closest("td");
    const day = td.dataset.day;
    
    // Extract event details from the clicked item
    const title = eventItem.querySelector(".event-content span") ? eventItem.querySelector(".event-content span").textContent : "Event";
    const time = eventItem.querySelector(".event-time") ? eventItem.querySelector(".event-time").textContent : "";
    
    // Use the existing week calendar modal
    const modal = $("#eventDetailModal");
    if (modal.length) {
      modal.find(".event-title").text(title);
      modal.find(".event-date").text(`Date: ${selectedDate.toLocaleDateString("default", { month: "long" })} ${day}, ${selectedDate.getFullYear()}`);
      modal.find(".event-time").text(`Time: ${time}`);
      modal.find(".event-description").text(""); // Can be populated if available
      
      // Highlight the clicked event by adding a class
      $("#month-view .month-event-item").removeClass("highlighted-event");
      $(eventItem).addClass("highlighted-event");
      
      // Position modal near the clicked event
      const itemOffset = $(eventItem).offset();
      modal.css({
        top: itemOffset.top + $(eventItem).outerHeight(),
        left: itemOffset.left,
      });
      
      modal.removeClass("cal-hidden").fadeIn();
    }
  }
  
  // Handle "See more" button clicks
  if (e.target.closest(".see-more-item")) {
    e.stopPropagation();
    const button = e.target.closest(".see-more-item");
    const day = button.dataset.day;
    const td = button.closest("td");
    
    // Get all events for this day
    const allEvents = td.querySelectorAll(".month-event-item");
    let eventsHTML = "";
    
    allEvents.forEach((event, index) => {
      const title = event.querySelector(".event-content span") ? event.querySelector(".event-content span").textContent : "Event";
      const time = event.querySelector(".event-time") ? event.querySelector(".event-time").textContent : "";
      const profileImg = event.querySelector(".event-profile img") ? event.querySelector(".event-profile img").src : "";
      
      eventsHTML += `
        <div style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #e5e7eb; cursor: pointer;" class="see-more-event-item" data-event-title="${title}" data-event-time="${time}">
          ${profileImg ? `<div style="margin-right: 10px;">
            <img src="${profileImg}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
          </div>` : ''}
          <div style="flex: 1;">
            <div style="font-weight: 600; color: #374151;">${title}</div>
            <div style="font-size: 12px; color: #9CA3AF;">${time}</div>
          </div>
        </div>
      `;
    });
    
    document.getElementById("seeMoreTitle").textContent = `All Events - ${selectedDate.toLocaleDateString("default", { month: "long" })} ${day}`;
    document.getElementById("seeMoreContent").innerHTML = eventsHTML;
    document.getElementById("seeMoreModal").classList.remove("cal-hidden");
    
    // Add click handlers to events in see more modal to show detail modal
    $("#seeMoreContent .see-more-event-item").on("click", function() {
      const itemTitle = $(this).data("event-title");
      const itemTime = $(this).data("event-time");
      
      // Close see more modal
      $("#seeMoreModal").addClass("cal-hidden");
      
      // Show detail modal
      const modal = $("#eventDetailModal");
      if (modal.length) {
        modal.find(".event-title").text(itemTitle);
        modal.find(".event-date").text(`Date: ${selectedDate.toLocaleDateString("default", { month: "long" })} ${day}, ${selectedDate.getFullYear()}`);
        modal.find(".event-time").text(`Time: ${itemTime}`);
        modal.find(".event-description").text("");
        
        modal.removeClass("cal-hidden").fadeIn();
      }
    });
  }
});

