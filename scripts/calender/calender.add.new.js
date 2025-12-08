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

addEventBtn.addEventListener("click", () => {
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "event";
  } else {
    $("#addEventModal").removeClass("cal-hidden");
  }
});

addTaskBtn.addEventListener("click", () => {
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "task";
  } else {
    $("#addTaskOption").removeClass("cal-hidden");
  }
});

addHolidayBtn.addEventListener("click", () => {
  addNewModal.classList.add(HIDDEN);

  if (firstTimeAddNew) {
    eventModal.classList.remove(HIDDEN);
    firstTimeAddNew = false;
    path = "holiday";
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
  } else {
    $("#addBirthdayModal").removeClass("cal-hidden");
  }
});

const slideItems = document.querySelectorAll(".event_intro_container>div");
const goToSlide = function (slide) {
  slideItems.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
};

goToSlide(0);

/**
 *
 *
 *
 *
 */

document.querySelector(".next-task").addEventListener("click", function () {
  goToSlide(1);
});

document.querySelector(".next-holiday").addEventListener("click", function () {
  goToSlide(2);
});

document.querySelector(".next-birthday").addEventListener("click", function () {
  goToSlide(3);
});

document.querySelector(".next-item.done-items").addEventListener("click", function () {
  // addEventModal.classList.remove(HIDDEN);
  $("#eventModal").addClass("cal-hidden");

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
