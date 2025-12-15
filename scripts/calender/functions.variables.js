let globalCurrentYear = new Date().getFullYear();
const today = new Date();
let selectedDate = new Date(today);
let currentView = "private";

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
function getUserTimeZone() {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return userTimeZone; // e.g., "America/New_York", "Africa/Lagos", etc.
}

// getTimeZoneName();
function getGlobalTimeZone(location) {
  const now = new Date();
  const localDate = new Date(now.toLocaleString("en-US", { timeZone: location }));
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetInHours = (localDate - utcDate) / (1000 * 60 * 60);
  const time = localDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    timeZone: location,
  });

  return {
    location: location,
    currentTime: time,
    gmtOffset: `GMT${offsetInHours >= 0 ? "+" : ""}${offsetInHours}`,
    utcOffset: `UTC${offsetInHours >= 0 ? "+" : ""}${offsetInHours}`,
    isoOffset: offsetInHours >= 0 ? `+${String(Math.abs(offsetInHours)).padStart(2, "0")}:00` : `-${String(Math.abs(offsetInHours)).padStart(2, "0")}:00`,
  };
}

// Use it with your function
const userTimeZone = getUserTimeZone();
const userZoneInfo = getGlobalTimeZone(userTimeZone);

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

// Static content structure with support for images
const staticContent = {
  private: {
    Mon: {
      "10 AM": {
        text_1: "11:00 AM",
        text_2: "User Research",
        category: "task",
        description: "Plan and conduct user research for the upcoming feature.",
      },
      header: { text: "🎉 John's Birthday", category: "birthday" },
      "11 AM": {
        category: "task",
        images: [],
        description: "Team discussion about sprint tasks.",
      },
      "7 AM": {
        text_1: "8:00 AM",
        text_2: "Monday Wake-Up H...",
        category: "event",
        description: "Morning meeting to discuss the weekly plan.",
      },
      "8 AM": {
        text_1: "8:00 AM",
        text_2: "Monday Wake-Up H...",
        category: "event",
        description: "Overview of tasks and goals for the week.",
      },
      "9 AM": {
        text_1: "10:00 AM",
        text_2: "Monday Wake-Up H...",
        category: "event",
        description: "Continued planning for the day.",
      },
      "12 PM": {
        text_1: "1:00 PM",
        text_2: "Design Review",
        category: "event",
        description: "Review the design mockups for feedback.",
      },
    },
    Tue: {
      "1 PM": {
        text_1: "2:00 PM",
        text_2: "Concept Design Review II",
        category: "event",
        rowspan: 2,
        description: "Deep dive into the concept designs for iteration.",
      },
      "8 AM": {
        text_1: "9:00 AM",
        text_2: "Design Review: Acm...",
        category: "event",
        description: "Collaborate on the marketing design.",
      },

      "11 AM": {
        text_1: "12:00 PM",
        text_2: "🍔 Design System Kickoff Lunch",
        category: "event",
        description: "Lunch and kickoff for the new design system project.",
      },
    },
    Wed: {
      "8 AM": {
        text_1: "9:00 AM",
        text_2: "☕️ Coffee Chat",
        category: "event",
        description: "Casual coffee chat with the team.",
      },
      "10 AM": {
        text_1: "11:00 AM",
        text_2: "Onboarding",
        category: "task",
        images: [],
        description: "Sarah is a dedicated veterinarian who spends her days caring for animals of all shapes and sizes. She believes in the power of compassion and strives to make a positive impact on each furry patient's life.",
      },
      "12 PM": {
        text_1: "1:00 PM",
        text_2: "Concept Design Review II",
        category: "event",
        description: "Sarah is a dedicated veterinarian who spends her days caring for animals of all shapes and sizes. She believes in the power of compassion and strives to make a positive impact on each furry patient's life.",
      },
      "1 PM": {
        category: "event",
        description: "Brainstorming session with cross-functional teams.",
      },
    },
    Thu: {
      header: {
        text: "🎂 Joseph’s Birthday",
        category: "birthday",
        description: "Celebrate Joseph’s special day with the team!",
      },
      "9 AM": {
        text_1: "1:00 PM",
        text_2: "Concept Design Review II",
        category: "event",
        description: "Brainstorming session with cross-functional teams.",
      },
    },
    Sun: {
      header: {
        text: "Christmas",
        category: "holiday",
        description: "Celebrate a christmas holiday",
      },
    },
    Fri: {
      "8 AM": {
        text_1: "9:00 AM",
        text_2: "☕️ Coffee Chat",
        category: "event",
        description: "Casual coffee chat with the team.",
      },
    },
  },

  public: {
    Mon: {
      "7 AM": {
        text_1: "8:00 AM",
        text_2: "Project Planning",
        category: "task",
        description: "Outline the roadmap for the upcoming sprint.",
        images: [],
        name: "wade Warren",
      },
    },
    Fri: {
      header: {
        text: "🎂 Joseph’s Birthday",
        category: "birthday",
        description: "Celebrate Joseph’s special day with the team!",
      },
    },
    Sun: {
      header: {
        text: "Christmas",
        category: "holiday",
        description: "Celebrate a christmas holiday",
      },
    },

    Thu: {
      "11 AM": {
        text_1: "8:00 AM",
        text_2: "Project Planning",
        category: "task",
        description: "Outline the roadmap for the upcoming sprint.",
        images: [],
        name: "wade Warren",
      },
    },
    Tue: {
      "10 AM": [
        {
          text_1: "11:00 AM",
          text_2: "Team Standup",
          category: "task",
          description: "Daily standup meeting with the team.",
        },
        {
          time: "7:30 AM - 10:53 AM",

          text_1: "11:30 AM",
          text_2: "Bug Triage",
          category: "task",
          description: "Review and prioritize reported bugs.",
        },
        {
          text_1: "12:00 PM",
          text_2: "Client Feedback Review",
          category: "task",
          description: "Analyze client feedback from the last release.",
        },
        {
          time: "7:30 AM - 10:53 AM",

          text_1: "12:30 PM",
          text_2: "Design Sync",
          category: "task",
          description: "Sync with designers on UI/UX updates.",
        },
        {
          text_1: "1:00 PM",
          text_2: "Code Review",
          category: "task",
          description: "Peer review for recent PRs.",
        },
      ],
    },
    Wed: {
      "8 AM": [
        {
          time: "9:00 AM - 10:00 AM",
          text_1: "9:00 AM",

          text_2: "Backend API Discussion",
          category: "task",
          description: "Discuss API architecture improvements.",
        },
        {
          time: "9:30 AM - 11:53 AM",
          text_1: "9:30 AM",

          text_2: "Frontend Feature Testing",
          category: "task",
          description: "Test new frontend features before merging.",
        },
        {
          time: "7:30 AM - 10:53 AM",

          text_1: "10:00 AM",
          text_2: "Sprint Planning",
          category: "task",
          description: "Prepare sprint goals for the next cycle.",
        },
      ],
    },
  },
};

const sampleImages = ["https://randomuser.me/api/portraits/men/1.jpg", "https://randomuser.me/api/portraits/men/2.jpg", "https://randomuser.me/api/portraits/women/1.jpg", "https://randomuser.me/api/portraits/women/2.jpg", "https://randomuser.me/api/portraits/men/3.jpg", "https://randomuser.me/api/portraits/women/3.jpg", "https://randomuser.me/api/portraits/men/4.jpg", "https://randomuser.me/api/portraits/women/4.jpg", "https://randomuser.me/api/portraits/men/5.jpg", "https://randomuser.me/api/portraits/women/5.jpg"];

const generateRandomName = () => {
  const names = ["John", "Jane", "Alex", "Sam", "Taylor", "Chris"];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomImages = (images) => {
  const numImages = Math.floor(Math.random() * 3) + 3;
  const randomImages = [];
  for (let i = 0; i < numImages; i++) {
    randomImages.push(images[Math.floor(Math.random() * images.length)]);
  }
  return randomImages;
};

async function generateProfileImagesHtml(images = []) {
  const randomNames = ["Wade Warren", "Wade Warren", "Wade Warren", "Wade Warren", "Emily"];
  const defaultImage = "./images/calender/icons/Avatar.svg";

  // If no images are provided, use the sample images
  if (images.length === 0) {
    images = [...sampleImages];
  }

  while (images.length < 3) {
    images.push(defaultImage);
  }

  return (
    images
      .slice(0, 3)
      .map(
        (img, index) =>
          `<div class="profile-item">
          <img src="${img}" alt="profile">
          <p>${randomNames[index % randomNames.length]}</p>
        </div>`
      )
      .join("") + `<button class="see-all-btn"></button>`
  );
}

function updateSidebarMonthLabel(date) {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  $("#sidebar-month-label , .sidebar-month-label").html(`${month} <span class="purple-color">${year}</span>`);
}

function updateMobileMonthLabel(date) {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  $("#mobile-month-label").html(`${month} <span class="purple-color">${year}</span>`);
}

function updateMainLabel(view, date) {
  if (view === "month") {
    const monthLabel = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    // $("#main-label").text(monthLabel);
  } else if (view === "year") {
    // $("#main-label").text(date.getFullYear());
  }
}

function getDotsForDay(day) {
  const dotPatterns = {
    1: ["#8B5CF6", "#F59E0B", "#F43F5E"],
    2: ["#0EA5E9", "#8B5CF6", "#F59E0B", "#F43F5E"],
    3: ["#8B5CF6", "#F59E0B", "#F43F5E"],
    4: ["#0EA5E9", "#8B5CF6", "#F59E0B"],
    5: ["#0EA5E9", "#8B5CF6", "#F59E0B"],
    8: ["#8B5CF6", "#F59E0B", "#F43F5E"],
    9: ["#0EA5E9", "#8B5CF6"],
    10: ["#0EA5E9", "#8B5CF6", "#F59E0B"],
    11: ["#8B5CF6"],
    12: ["#0EA5E9", "#F59E0B", "#F43F5E"],
    14: ["#0EA5E9", "#F59E0B"],
    15: ["#8B5CF6"],
    16: ["#0EA5E9", "#8B5CF6", "#F59E0B", "#F43F5E"],
    19: ["#0EA5E9", "#8B5CF6", "#F59E0B"],
    22: ["#0EA5E9", "#F59E0B"],
    23: ["#0EA5E9", "#F59E0B"],
    27: ["#0EA5E9"],
    29: ["#8B5CF6", "#F59E0B"],
    30: ["#F59E0B"],
  };
  return dotPatterns[day] || []; // Default: No dots for other days
}

function generateSidebarCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const nextMonthStartDay = (firstDay + daysInMonth) % 7;

  let html = "";

  // Render weekdays header
  ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].forEach((day) => {
    html += `<div class="day cal-header">${day}</div>`;
  });

  // Fill in days from the previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    html += generateDayHTML(day, "inactive", getDotsForDay(day));
  }

  // Fill in days for the current month
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    html += generateDayHTML(day, isSelected ? "selected" : "", getDotsForDay(day));
  }

  // Fill in days for the next month
  for (let i = 1; nextMonthStartDay !== 0 && i <= 7 - nextMonthStartDay; i++) {
    html += generateDayHTML(i, "inactive", getDotsForDay(i));
  }

  $("#sidebar-calendar , .sidebar-calendar").html(html);

  // Attach click event for days
  $("#sidebar-calendar .day").on("click", function () {
    $("#sidebar-calendar .day").removeClass("selected");
    $(this).addClass("selected");
    selectedDate.setDate($(this).data("day"));
    updateMainCalendar();
  });
}

// Helper function to generate HTML for each day
function generateDayHTML(day, additionalClass, dots) {
  let dotsHTML = "";
  dots.forEach((color) => {
    dotsHTML += `<span class="dot" style="background-color: ${color};"></span>`;
  });

  return `<div class="day ${additionalClass}" data-day="${day}">
              <h3>${day}</h3>
              <div class="dots-container">${dotsHTML}</div>
          </div>`;
}

function updateMainCalendar() {
  if (window.innerWidth <= 760) {
    // Mobile view
    generateMobileView(selectedDate);
  } else {
    // Desktop view
    generateWeekView(selectedDate);
  }

  if (window.innerWidth <= 760) {
    // Mobile view
    generateMobileMonthView(selectedDate.getFullYear());
  } else {
    generateMonthView(selectedDate);
  }

  if (window.innerWidth <= 760) {
    // Mobile view
    generateMobileYearView(selectedDate.getFullYear());
  } else {
    generateYearView(selectedDate.getFullYear());
  }
}

// Fetch multiple profile images for tasks
async function fetchProfileImages(count = 20) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    const data = await response.json();
    return data.results.map((user) => user.picture.thumbnail);
  } catch (error) {
    console.error("Failed to fetch profile images:", error);
    return [];
  }
}

// Populate static content with profile images for tasks
async function populateStaticContentWithImages() {
  const profileImages = await fetchProfileImages(50);
  let imageIndex = 0; // To assign images sequentially

  for (const view of Object.keys(staticContent)) {
    for (const day of Object.keys(staticContent[view])) {
      for (const time of Object.keys(staticContent[view][day])) {
        const content = staticContent[view][day][time];

        if (content.category === "task" && content.images) {
          if (day === "Mon" && time === "11 AM") {
            content.images = profileImages.slice(imageIndex, imageIndex + 6);
            imageIndex += 6;
          } else if (day === "Wed" && time === "10 AM") {
            content.images = profileImages.slice(imageIndex, imageIndex + 1);
            imageIndex += 1;
          } else {
            content.images = profileImages.slice(imageIndex, imageIndex + 1);
            imageIndex += 1;
          }
        }
      }
    }
  }

  // Render the week view after images are populated
  const currentDate = new Date();
  if (window.innerWidth <= 760) {
    // Mobile view
    generateMobileView(currentDate);
  } else {
    // Desktop view
    generateWeekView(currentDate);
  }
}

function generateWeekView(date) {
  const stripLeadingEmoji = (value) => {
    const text = String(value ?? "");
    // Remove leading emojis/pictographs (plus optional variation selectors / ZWJ), then trim.
    return text
      .replace(
        /^[\s\uFE0F\u200D]*(?:[\u2600-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])+/g,
        ""
      )
      .trim();
  };

  let html = "<tr>";

  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [];

  // Add empty header for time column
  html += `<th class="est"></th>`;

  // Generate day headers
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const fullDate = day.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const dayName = daysOfWeek[i];
    dates.push({ dayName, date: fullDate });

    const headerContent = staticContent[currentView][dayName]?.header || {};
    const headerText = headerContent.text || "";
    const headerCategory = headerContent.category || "";
    const headerClass = headerCategory ? `static-${headerCategory}` : "";
    const displayHeaderText = headerCategory === "birthday" || headerCategory === "holiday" ? stripLeadingEmoji(headerText) : headerText;
    const weekendClass = i === 0 || i === 6 ? "weekend-column" : "";
    const thuDay = i === 4 ? "thuDay" : "";

    html += `
          <th class="day-column ${thuDay} ${weekendClass}">
              <div class="the-day-date">
                  <div class="day-name"><span>${dayName}</span> - <span class="large-font">${day.getDate()}</span></div>
                  ${
                    displayHeaderText
                      ? `
                  <div data-current-count="1" data-total-count="1" class="header-content-container ${headerClass}">
                    <div class="header-content active" data-index="1" data-day="${dayName}" data-category="${headerCategory}" data-date="${fullDate}">
                      <p>${displayHeaderText}</p>
                    </div>
                  </div>`
                      : ""
                  }
              </div>
          </th>`;
  }

  html += `</tr>`;

  // Generate time rows - 1-hour intervals (6am -> 5am next day)
  for (let hour = 6; hour <= 29; hour++) {
    const hourOfDay = hour % 24;
    // Keep `time` in the same format as `staticContent` keys (e.g. "7 AM")
    const time = hourOfDay === 0 ? "12 AM" : hourOfDay < 12 ? `${hourOfDay} AM` : hourOfDay === 12 ? "12 PM" : `${hourOfDay - 12} PM`;
    // Only control what the user sees in the UI (e.g. "7am")
    const timeLabel = hourOfDay === 0 ? "12am" : hourOfDay < 12 ? `${hourOfDay}am` : hourOfDay === 12 ? "12pm" : `${hourOfDay - 12}pm`;

    html += `<tr>`;

    // Time label column (UI only) - FIRST column
    html += `<td class="time-column"><span class="time-label">${timeLabel}</span></td>`;

    // Generate cells for each day
    for (let j = 0; j < 7; j++) {
      const { dayName, date: fullDate } = dates[j];
      const content = staticContent[currentView][dayName]?.[time];
      const weekendClass = j === 0 || j === 6 ? "weekend-column" : "";
      const lastColumnClass = j === 6 ? "last-column-white" : "";
      const thuDay = j === 4 ? "thuDay" : "";
      const highlightedClass = content?.highlighted ? "highlighted" : "";

      html += `<td class="${thuDay} ${weekendClass} ${lastColumnClass} ${highlightedClass} ${content?.category ? `static-${content.category}` : ""}" data-day="${dayName}" data-time="${time}" data-date="${fullDate}" id="${dayName}-${time.replace(" ", "-")}">`;

      if (content) {
        html += generateCellContent(content);
      }

      html += `</td>`;
    }

    html += `</tr>`;
  }

  $("#week-view").html(html);
}

// ///// to generate cell contents
function generateCellContent(content) {
  let html = "";

  if (currentView === "public") {
    if (Array.isArray(content)) {
      const taskCount = content.length;
      const firstTask = content[0];
      const text_1 = firstTask.text_1 || "";
      const text_2 = firstTask.text_2 || "";
      html += `<div class = "first-task">`;
      html += `<div class=" static-task ">`;
      html += text_1 ? `<div>${text_1}</div>` : "";
      html += text_2 ? `<div>${text_2}</div>` : "";
      html += `</div>`;
      html += `<span class="second-task"></span>`;
      html += `<span class="thrid-task"></span>`;

      html += `</div>`;

      if (taskCount > 1) {
        html += `<div class="task-count-indicator">${taskCount}</div>`;
      } else {
        html += `<div class="highlight-icon-on-cell" data-tooltip="highlight\nClick this icon to Highlight this Task. After you highlight a task, it will be added to your private calendar. You can highlight multiple task of multiple friends. Click the Highlight icon again in the private calendar to remove the highlight.">⭐</div>`;
      }
    } else {
      const text_1 = content.text_1 || "";
      const text_2 = content.text_2 || "";
      html += `<div class="">`;
      html += text_1 ? `<div>${text_1}</div>` : "";
      html += text_2 ? `<div>${text_2}</div>` : "";
      html += `</div>`;

      html += `
              <div class="highlight-icon-on-cell" data-tooltip="highlight">
                    <img class="highlighted-icon" <img src="./images/calender/icons/hover-highlight.svg"  />
                <div class="tooltip">
                <div>
                  <div class="highlight-header"> <img src="./images/calender/icons/det-higlight.svg" alt="Icon" class="tooltip-icon" /> Highlight </div>Click this icon to Highlight this Task. After you highlight a task, it will be added to your private calendar. You can highlight multiple tasks of multiple friends. Click the Highlight icon again in the private calendar to remove the highlight.</div>
                </div>
              </div>`;
    }
  } else {
    // PRIVATE VIEW - Display all tasks normally
    if (Array.isArray(content)) {
      content.forEach((event) => {
        const text_1 = event.text_1 || "";
        const text_2 = event.text_2 || "";

        html += `<div class="event-container">`;
        html += text_1 ? `<div>${text_1}</div>` : "";
        html += text_2 ? `<div>${text_2}</div>` : "";
        html += `</div>`;
      });
    } else {
      const text_1 = content.text_1 || "";
      const text_2 = content.text_2 || "";

      html += `<div class="">`;
      html += text_1 ? `<div>${text_1}</div>` : "";
      html += text_2 ? `<div>${text_2}</div>` : "";
      html += `</div>`;
    }
  }

  // Handle images for both views
  if (content.images?.length) {
    if (currentView === "public") {
      const image = content.images[0];
      html += `<div class="item-profile-images public-view">
                     <img src="${image}" alt="profile" class="profile-image">
                     <p>${content.name}</p>
                   </div>`;
    } else {
      html += `<div class="item-profile-images">`;
      content.images.forEach((image) => {
        html += `<img src="${image}" alt="profile" class="profile-image">`;
      });
      html += `</div>`;
    }
  }

  return html;
}

function generateMonthView(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Get events from static content for the month
  const getEventsForDay = (day) => {
    const events = [];
    const dayDate = new Date(year, month, day);
    const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });

    // Check static content for this day
    if (staticContent[currentView] && staticContent[currentView][dayName]) {
      const dayContent = staticContent[currentView][dayName];

      // Add header events (all-day events)
      if (dayContent.header) {
        events.push({
          type: dayContent.header.category || "event",
          title: dayContent.header.text || "Event",
          time: "All day",
          isHeader: true,
          images: dayContent.header.images || [],
        });
      }

      // Add time-based events
      Object.keys(dayContent).forEach((time) => {
        if (time !== "header") {
          const content = dayContent[time];
          if (Array.isArray(content)) {
            content.forEach((item) => {
              events.push({
                type: item.category || "task",
                title: item.text_1 || item.text || "Task",
                time: time,
                isHeader: false,
                images: item.images || [],
              });
            });
          } else if (content && typeof content === "object") {
            events.push({
              type: content.category || "task",
              title: content.text_2 || content.text || "Task",
              time: time,
              isHeader: false,
              images: content.images || [],
              description: content.description || "",
              data: content, // Store full content for modal
            });
          }
        }
      });
    }

    return events;
  };

  let html = "<tr>";
  // Removed weekday headers (SUN, MON, TUE, etc.) as requested
  html += "</tr><tr>";

  // Add previous month's days
  for (let i = firstDay; i > 0; i--) {
    const colIndex = firstDay - i;
    const grayClass = colIndex === 0 ? "gray-column" : "";
    html += `<td class="less-bold ${grayClass}"><div class="day-number" style="color: #9CA3AF; font-size: 14px; text-align: right; padding-right: 8px;">${prevMonthDays - i + 1}</div></td>`;
  }

  // Add current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    const colIndex = (firstDay + day - 1) % 7;
    const grayClass = colIndex === 0 || colIndex === 6 ? "gray-column" : "";

    if (colIndex === 0 && day !== 1) {
      html += "</tr><tr>"; // Start a new row every Sunday
    }

    // Add the day number at the top (moved to right)
    const dayContent = day === 1 ? `<div class="day-number" style="text-align: right; padding-right: 8px;"><strong>${date.toLocaleString("default", { month: "long" })} ${day}</strong></div>` : `<div class="day-number" style="text-align: right; padding-right: 8px;">${day}</div>`;

    let items = "";
    const maxVisibleItems = 6;
    const events = getEventsForDay(day);

    if (events.length > 0) {
      // Define colors for numbered circles
      const getCircleColor = (index) => {
        const colors = [
          "#F59E0B", // Yellow/Orange
          "#6B7280", // Blue/Gray
          "#F97316", // Orange
          "#8B5CF6", // Purple
          "#8B5CF6", // Purple
          "#8B5CF6", // Purple
        ];
        return colors[index % colors.length];
      };

      events.forEach((event, index) => {
        if (index >= maxVisibleItems) return;

        const circleColor = getCircleColor(index);
        const profileImage = event.images && event.images.length > 0 ? event.images[0] : "./icons/Avatar.svg";

        const isBirthday = event.type === "birthday";
        const isHoliday = event.type === "holiday";

        if (isBirthday || isHoliday) {
          const pillClass = isBirthday ? "month-pill-birthday" : "month-pill-holiday";
          const displayTitle = (event.title || "")
            // Remove leading emoji/icon characters (covers common surrogate-pair emojis)
            .replace(/^\s*(?:[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF])+/g, "")
            .trim();

          items += `
            <div class="month-event-item month-pill ${pillClass}" data-event-index="${index}" data-day="${day}">
              <span class="month-pill-text">${displayTitle || event.title}</span>
              <span class="month-pill-more" aria-hidden="true"></span>
            </div>
          `;
          return;
        }

        items += `
          <div class="month-event-item" style="display: flex; align-items: center; margin: 2px 0; font-size: 10px; line-height: 1.2;" data-event-index="${index}" data-day="${day}">
            <div class="event-number" style="background-color: ${circleColor}; color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; margin-right: 4px; flex-shrink: 0;">
              ${index + 1}
            </div>
            <div class="event-profile" style="margin-right: 4px; flex-shrink: 0;">
              <img src="${profileImage}" alt="Profile" style="width: 16px; height: 16px; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="event-content" style="flex: 1; min-width: 0; margin-right: 4px;">
              <span style="color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; font-size: 9px;">
                ${event.title}
              </span>
            </div>
            <div class="event-time" style="color: #9CA3AF; font-size: 8px; flex-shrink: 0;">
              ${event.time}
            </div>
          </div>
        `;
      });

      // Add "See More" button if there are more items
      if (events.length > maxVisibleItems) {
        const moreCount = events.length - maxVisibleItems;
        items += `<button class="see-more-item" data-day="${day}" style="background: none; border: none; color: #9CA3AF; cursor: pointer; font-size: 8px; padding: 2px 0; width: 100%; text-align: left;">
          +${moreCount} more...
        </button>`;
      }
    }

    html += `<td class="${grayClass}" data-day="${day}" style="vertical-align: top; padding: 4px; height: 120px; position: relative;">
      ${dayContent}
      <div class="day-items" style="margin-top: 4px;">
        ${items}
      </div>
    </td>`;
  }

  // Add next month's days
  const remainingDays = (7 - ((firstDay + daysInMonth) % 7)) % 7;
  for (let i = 1; i <= remainingDays; i++) {
    html += `<td class="less-bold gray-column"><div class="day-number" style="color: #9CA3AF; font-size: 14px; text-align: right; padding-right: 8px;">${i}</div></td>`;
  }

  html += "</tr>";
  $("#month-view").html(html);

  // Attach click event to dynamically generated `td`
  $("#month-view td").on("click", function (event) {
    // Don't switch to week view if clicking on event items or see-more button
    if ($(event.target).closest(".month-event-item").length) return;
    if ($(event.target).is(".see-more-item") || $(event.target).closest(".see-more-item").length) return;

    const clickedDay = parseInt($(this).data("day"), 10);
    if (isNaN(clickedDay)) return;

    selectedDate.setDate(clickedDay);

    // Switch to week view only when clicking empty space in the cell
    $("[data-view='week']").trigger("click");
    updateMainCalendar();
  });

  // Handle month event item clicks - show modal like week view
  $("#month-view").on("click", ".month-event-item", async function (event) {
    event.stopPropagation();
    
    const $item = $(this);
    const day = parseInt($item.data("day"), 10);
    const eventIndex = parseInt($item.data("event-index"), 10);
    
    // Get the event data
    const events = getEventsForDay(day);
    const eventData = events[eventIndex];
    
    if (!eventData || !eventData.data) return;
    
    const content = eventData.data;
    const dayDate = new Date(year, month, day);
    const fullDate = dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const time = eventData.time !== "All day" ? eventData.time : "";
    
    // Generate profile images HTML
    const profileImagesHtml = await generateProfileImagesHtml(content.images || []);
    
    // Get truncated description
    const descriptionData = getTruncatedDescription(content.description || "");
    
    // Determine category dot class
    const categoryDotClass = {
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
    
    // Create modal HTML (same as week view)
    const modalContent = `
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
    `;
    
    // Highlight the clicked event item
    $("#month-view .month-event-item").removeClass("highlighted-event");
    $item.addClass("highlighted-event");
    
    // Show modal using the calendar's event handler
    if (window.calendar && window.calendar.eventHandler) {
      window.calendar.eventHandler.modalElement.find(".week-view-modal").html(modalContent);
      window.calendar.eventHandler.showModal(modalContent, this);
    } else {
      // Fallback: create modal wrapper if calendar instance not available
      $(".week_view_modal_wrapper").remove();
      
      const modalWrapper = $(`
        <div class="week_view_modal_wrapper" style="position: fixed; z-index: 9999;">
          <div style="position: relative; height: 100%">
            <div class="week-view-modal">
              ${modalContent}
            </div>
          </div>
        </div>
      `);
      
      $("body").append(modalWrapper);
      
      // Position modal
      const itemOffset = $item.offset();
      const windowWidth = $(window).width();
      const windowHeight = $(window).height();
      const scrollLeft = $(window).scrollLeft();
      const scrollTop = $(window).scrollTop();
      
      let left = itemOffset.left - scrollLeft;
      let top = itemOffset.top - scrollTop + $item.outerHeight() + 10; // always downward
      
      // Adjust if modal would go off screen
      if (left + 400 > windowWidth) {
        left = windowWidth - 420;
      }
      if (left < 10) {
        left = 10;
      }
      if (top < 10) {
        top = 10;
      }

      const availableHeight = Math.max(120, windowHeight - top - 10);
      modalWrapper.css({ maxHeight: availableHeight + "px" });
      modalWrapper.find(".week-view-modal").css({ maxHeight: availableHeight + "px", overflowY: "auto" });
      
      modalWrapper.css({
        left: left + "px",
        top: top + "px",
        display: "block",
      });
      
      // Close modal handler
      modalWrapper.find(".close-modal").on("click", function() {
        modalWrapper.remove();
        $("#month-view .month-event-item").removeClass("highlighted-event");
      });
      
      // Close on click outside
      $(document).on("click.monthModal", function(e) {
        if (!$(e.target).closest(".week_view_modal_wrapper").length && !$(e.target).closest(".month-event-item").length) {
          modalWrapper.remove();
          $("#month-view .month-event-item").removeClass("highlighted-event");
          $(document).off("click.monthModal");
        }
      });
    }
  });
}

function generateDayView(date) {
  // Format a 24-hour time string ("H:MM" or "HH:MM") to 12-hour ("h:MM AM/PM")
  const formatTime12From24 = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return timeStr;
    const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
    if (!match) return timeStr;

    let hour24 = parseInt(match[1], 10);
    const minute = (match[2] ?? "00").padStart(2, "0");

    if (Number.isNaN(hour24)) return timeStr;

    // Support extended day ranges (e.g. 24:15 -> 12:15 AM, 29:45 -> 5:45 AM)
    const hourOfDay = ((hour24 % 24) + 24) % 24;
    const period = hourOfDay >= 12 ? "PM" : "AM";
    let hour12 = hourOfDay % 12;
    if (hour12 === 0) hour12 = 12;

    return `${hour12}:${minute} ${period}`;
  };

  // Generate 4 days: Thursday to Sunday
  const generateFourDays = () => {
    const days = [];
    // Find the Thursday of the current week
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate Thursday of the current week
    const thursday = new Date(currentDate);
    if (dayOfWeek >= 4) {
      // Current week Thursday to Sunday
      thursday.setDate(currentDate.getDate() - (dayOfWeek - 4));
    } else {
      // This week's Thursday
      thursday.setDate(currentDate.getDate() + (4 - dayOfWeek));
    }

    // Generate Thursday, Friday, Saturday, Sunday
    for (let i = 0; i < 4; i++) {
      const dayDate = new Date(thursday);
      dayDate.setDate(thursday.getDate() + i);

      days.push({
        date: dayDate,
        dayName: dayDate.toLocaleDateString("en-US", { weekday: "long" }),
        dayShort: dayDate.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: dayDate.getDate(),
        monthName: dayDate.toLocaleDateString("en-US", { month: "long" }),
      });
    }
    return days;
  };

  // Get events for a specific day
  const getDayEvents = (dayShort) => {
    const events = [];

    // Default duration used when no end time/duration exists in the data.
    // Keep this modest so an "8:00" card doesn't visually fill the whole hour.
    const DEFAULT_EVENT_DURATION_MINUTES = 30;

    // Helper function to convert "7 AM" or "12 PM" format to "7:00" or "12:00" 24-hour format
    const convertTo24Hour = (timeStr) => {
      const match = timeStr.match(/(\d+)\s*(AM|PM)/i);
      if (!match) return timeStr; // Return as-is if not in expected format
      
      let hours = parseInt(match[1], 10);
      const period = match[2].toUpperCase();
      
      // Convert to 24-hour format
      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }
      
      return `${hours}:00`;
    };

    // Add events from static content if available
    if (staticContent[currentView] && staticContent[currentView][dayShort]) {
      const dayContent = staticContent[currentView][dayShort];

      // Add time-based events
      Object.keys(dayContent).forEach((time) => {
        if (time !== "header") {
          const content = dayContent[time];
          const time24 = convertTo24Hour(time); // Convert "7 AM" to "7:00" for positioning
          const time12 = formatTime12From24(time24);
          
          if (Array.isArray(content)) {
            content.forEach((item) => {
              events.push({
                type: item.category || "task",
                title: item.text_2 || item.text || "Task", // Use text_2 for title, not text_1 which is the time
                time: time12, // Always display 12-hour time
                startTime: time24, // Keep 24-hour for positioning
                endTime: calculateEndTime(time24, DEFAULT_EVENT_DURATION_MINUTES),
                isHeader: false,
                images: item.images || [],
                organizer: getOrganizerName(),
              });
            });
          } else if (content && typeof content === "object") {
            events.push({
              type: content.category || "task",
              title: content.text_2 || content.text || "Task", // Use text_2 for title, not text_1
              time: time12, // Always display 12-hour time
              startTime: time24, // Keep 24-hour for positioning
              endTime: calculateEndTime(time24, DEFAULT_EVENT_DURATION_MINUTES),
              isHeader: false,
              images: content.images || [],
              organizer: getOrganizerName(),
            });
          }
        }
      });
    }

    // Add additional random events to create a mix of full and half height
    const additionalEvents = generateRandomEvents(dayShort);
    events.push(...additionalEvents);

    return events.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Generate random events for demonstration
  const generateRandomEvents = (dayShort) => {
    const eventTitles = ["Team Standup", "Client Meeting", "Code Review", "Design Workshop", "User Research", "Sprint Planning", "Product Demo", "Training Session", "Onboarding Presentation", "Strategy Meeting", "Performance Review", "Brainstorming Session", "Technical Discussion", "Project Kickoff"];

    const eventTypes = ["task", "event", "meeting", "holiday", "birthday"];
    const timeSlots = ["8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    const profileImages = ["./icons/Avatar.svg", "./icons/Avatar.svg", "./icons/Avatar.svg", "./icons/Avatar.svg"];

    const randomEvents = [];
    const numEvents = Math.floor(Math.random() * 4) + 2; // 2-5 random events per day

    for (let i = 0; i < numEvents; i++) {
      const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const randomTitle = eventTitles[Math.floor(Math.random() * eventTitles.length)];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

      // Randomly decide if this should be full height (with organizer) or half height
      const isFullHeight = Math.random() > 0.4; // 60% chance of full height

      randomEvents.push({
        type: randomType,
        title: randomTitle,
        time: formatTime12From24(randomTime),
        startTime: randomTime,
        endTime: calculateEndTime(randomTime, 30),
        isHeader: false,
        images: isFullHeight ? [profileImages[Math.floor(Math.random() * profileImages.length)]] : [],
        organizer: isFullHeight ? getOrganizerName() : null,
      });
    }

    return randomEvents;
  };

  // Helper function to calculate end time
  const calculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  // Helper function to convert time to minutes for positioning
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // --- Day view positioning helpers (single-source-of-truth constants) ---
  const DAY_START_HOUR = 6;
  const DAY_END_HOUR = 29; // extend through 5am next day
  const DAY_SPACER_PX = 90;
  // Increase spacing: bigger hour blocks -> more vertical room between times
  const PX_PER_HOUR = 224;
  const HOUR_HEADER_PX = 40;
  const MINUTES_PER_INTERVAL = 15;
  const PX_PER_INTERVAL = PX_PER_HOUR / (60 / MINUTES_PER_INTERVAL); // 56px per 15 mins

  // Keep CSS in sync with the dynamic hour range so the view ends cleanly
  // (no extra white space after the last interval).
  try {
    const hourCount = DAY_END_HOUR - DAY_START_HOUR + 1;
    document.documentElement.style.setProperty("--cal-day-hours-count", String(hourCount));
  } catch (_) {
    // ignore (non-browser or restricted env)
  }

  const roundDownToInterval = (minutes, interval = MINUTES_PER_INTERVAL) =>
    Math.floor(minutes / interval) * interval;

  const roundUpToInterval = (minutes, interval = MINUTES_PER_INTERVAL) =>
    Math.ceil(minutes / interval) * interval;

  const roundToInterval = (minutes, interval = MINUTES_PER_INTERVAL) =>
    Math.round(minutes / interval) * interval;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const isExtendedDayRange = DAY_END_HOUR >= 24;
  const normalizeHourForRange = (hour) => (isExtendedDayRange && hour < DAY_START_HOUR ? hour + 24 : hour);
  const timeToMinutesInRange = (timeStr) => {
    const [hoursRaw, minutes] = timeStr.split(":").map(Number);
    if (Number.isNaN(hoursRaw) || Number.isNaN(minutes)) return NaN;
    const hours = normalizeHourForRange(hoursRaw);
    return hours * 60 + minutes;
  };
  const getEventMinuteRange = (startTime, endTime) => {
    let startMinutes = timeToMinutesInRange(startTime);
    let endMinutes = timeToMinutesInRange(endTime);
    if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) return { startMinutes, endMinutes };
    // Handle events that cross midnight (e.g. 23:45 -> 00:15)
    if (endMinutes < startMinutes) endMinutes += 24 * 60;
    return { startMinutes, endMinutes };
  };

  const getDayViewEventRect = (startTime, endTime) => {
    const { startMinutes, endMinutes } = getEventMinuteRange(startTime, endTime);

    const dayStartMin = DAY_START_HOUR * 60;
    const dayEndMin = (DAY_END_HOUR + 1) * 60; // allow events up to 30:00 (5am next day)

    // We keep the top aligned to the 15-minute grid, BUT we do NOT stretch event height
    // to the grid (otherwise cards grow into the next slot when you increase spacing).
    // This makes an 8:00 event stay within the 8:00 block and not enter 8:15.
    const snappedStart = clamp(roundDownToInterval(startMinutes), dayStartMin, dayEndMin);

    // Exact duration in minutes (clamped to at least 1 minute so we can render something)
    const exactDurationMins = Math.max(1, endMinutes - startMinutes);

    // Convert minutes -> pixels using the true scale
    const pxPerMinute = PX_PER_HOUR / 60;

    const offsetMinutes = snappedStart - dayStartMin;
    const top = DAY_SPACER_PX + (offsetMinutes / MINUTES_PER_INTERVAL) * PX_PER_INTERVAL;

  // Minimum visible height (so tiny events are still clickable)
  // Keep this small so events don't appear to run into the next 15-minute tick.
  const MIN_EVENT_PX = Math.max(10, Math.round(pxPerMinute * 2)); // ~2 minutes or 10px
    const height = Math.max(MIN_EVENT_PX, exactDurationMins * pxPerMinute);

    return {
      top,
      height,
      startMinutes: snappedStart,
      endMinutes: clamp(endMinutes, dayStartMin, dayEndMin),
    };
  };

  // Compute dynamic top based on collapsed hour blocks.
  // Collapsed hours shrink to header height, and everything below shifts up.
  const getCollapsedHoursSet = () => {
    const set = new Set();
    document
      .querySelectorAll(".multi-day-time-column .time-hour-group.is-collapsed[data-hour]")
      .forEach((el) => {
        const hour = parseInt(el.getAttribute("data-hour"), 10);
        if (!Number.isNaN(hour)) set.add(hour);
      });
    return set;
  };

  const LAST_HOUR_BLOCK_PX = HOUR_HEADER_PX + 3 * PX_PER_INTERVAL; // end at :45

  const getHourBlockHeight = (hour, collapsedHours) =>
    collapsedHours && collapsedHours.has(hour) ? HOUR_HEADER_PX : hour === DAY_END_HOUR ? LAST_HOUR_BLOCK_PX : PX_PER_HOUR;

  const getTopForTimeWithCollapse = (timeStr, collapsedHours) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return DAY_SPACER_PX;

    let targetHour = hours;
    if (isExtendedDayRange && targetHour < DAY_START_HOUR) targetHour += 24;
    const minuteInHour = minutes;
    let top = DAY_SPACER_PX;

    for (let h = DAY_START_HOUR; h < targetHour; h++) {
      top += getHourBlockHeight(h, collapsedHours);
    }

    // Within an expanded hour, position is proportional to PX_PER_HOUR.
    // For collapsed hours, we hide events anyway.
    top += (minuteInHour / 60) * PX_PER_HOUR;

    return top;
  };

  // Helper function to get organizer name
  const getOrganizerName = () => {
    const names = ["Cameron Williamson", "Esther Howard", "Wade Warren", "Jenny Wilson", "Robert Fox", "Arlene McCoy"];
    return names[Math.floor(Math.random() * names.length)];
  };

  // Generate collapsible time slots with 15-minute intervals
  const generateTimeSlots = () => {
    let html = "";

    // Add spacer at the beginning to align with day headers
    html += `<div class="time-hour-group spacer"></div>`;

    for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour++) {
      const hourOfDay = hour % 24;
      const timeStr = hourOfDay === 0 ? "12 AM" : hourOfDay < 12 ? `${hourOfDay} AM` : hourOfDay === 12 ? "12 PM" : `${hourOfDay - 12} PM`;
      const hourId = `hour-${hour}`;
      const isEndHourClass = hour === DAY_END_HOUR ? " is-day-end" : "";

      // Main hour header with collapse button
      html += `
        <div class="time-hour-group${isEndHourClass}" data-hour="${hour}">
          <div class="time-hour-header" data-hour-id="${hourId}">
            <span class="time-hour-label">${timeStr}</span>
            <button class="time-collapse-btn" id="btn-${hourId}" data-hour-id="${hourId}">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          <div class="time-intervals" id="${hourId}">
            <div class="time-interval">${formatTime12From24(`${hour}:15`)}</div>
            <div class="time-interval">${formatTime12From24(`${hour}:30`)}</div>
            <div class="time-interval">${formatTime12From24(`${hour}:45`)}</div>
          </div>
        </div>
      `;
    }
    return html;
  };

  // Generate events for a single day column
  const generateDayColumn = (dayInfo, events) => {
    const fullDate = dayInfo.date.toISOString().split("T")[0]; // YYYY-MM-DD (matches week view)
    let html = `
      <div class="multi-day-column" data-date="${fullDate}" data-day="${dayInfo.dayShort}">
        <div class="multi-day-header">
          <div class="day-name">${dayInfo.dayName}</div>
          <div class="day-date">${dayInfo.dayNumber}${getDaySuffix(dayInfo.dayNumber)} ${dayInfo.monthName}</div>
        </div>
        <div class="multi-day-events">
    `;

    // Add hour lines for this column (commented out since time-hour-group borders now extend)
    // Lines are positioned to match the time-hour-group structure:
    // Spacer: 90px at top
    // Then each hour: 100px (40px header + 60px intervals)
    for (let hour = DAY_START_HOUR; hour <= DAY_END_HOUR; hour++) {
      const topPosition = DAY_SPACER_PX + (hour - DAY_START_HOUR) * PX_PER_HOUR;
      html += `<div class="day-hour-line" data-hour="${hour}" style="top: ${topPosition}px;"></div>`;
    }

    // Current time indicator intentionally disabled for Day view

    // Add events
    events.forEach((event, index) => {
      const startMinutes = timeToMinutesInRange(event.startTime);
      const startHour = Math.floor(startMinutes / 60);

      if (startHour < DAY_START_HOUR || startHour > DAY_END_HOUR) return;

      const rect = getDayViewEventRect(event.startTime, event.endTime);
      const topPosition = rect.top;
      const eventHeight = rect.height;

      const profileImage = event.images && event.images.length > 0 ? event.images[0] : "./images/calender/default-avatar.png";
      const notificationCount = Math.floor(Math.random() * 50) + 1;

      // Determine if this is a full or half height event based on content
      const isFullHeight = event.organizer && event.images && event.images.length > 0;
      const heightClass = isFullHeight ? "full-height" : "half-height";

      // Generate footer only for full height events
      const footerHtml = isFullHeight
        ? `
        <div class="multi-day-event-footer">
          <img src="${profileImage}" alt="Profile" class="multi-day-event-avatar">
          <div class="multi-day-event-organizer">${event.organizer}</div>
        </div>
      `
        : "";

      // For half-height events, sometimes show an icon instead of notification count
      const notificationHtml = isFullHeight ? `<div class="multi-day-event-notification">${notificationCount}</div>` : Math.random() > 0.5 ? `<div class="multi-day-event-notification">${notificationCount}</div>` : `<div class="multi-day-event-icon">⚡</div>`;

      const imagesAttr = (event.images || []).join(",");

      html += `
        <div class="multi-day-event-wrapper ${heightClass}" data-event-hour="${startHour}" data-start-time="${event.startTime}" data-end-time="${event.endTime}" style="top: ${topPosition}px; height: ${eventHeight}px;">
          <div class="multi-day-event-block event-type-${event.type}" data-event-id="${index}" data-images="${imagesAttr}">
            <div class="multi-day-event-header">
              <div class="multi-day-event-time">${event.time}</div>
              ${notificationHtml}
            </div>
            <div class="multi-day-event-title">${event.title}</div>
            ${footerHtml}
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    return html;
  };

  // Helper function to get day suffix (1st, 2nd, 3rd, etc.)
  const getDaySuffix = (day) => {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const fourDays = generateFourDays();
  const timeColumnHtml = generateTimeSlots();

  // Generate columns for each day
  let dayColumnsHtml = "";
  fourDays.forEach((dayInfo) => {
    const events = getDayEvents(dayInfo.dayShort);
    dayColumnsHtml += generateDayColumn(dayInfo, events);
  });

  // Get the current day number for the large display
  const currentDayNumber = new Date().getDate();

  const dayViewHtml = `
    <div class="multi-day-view-container">
      <div class="multi-day-time-column">
        ${timeColumnHtml}
      </div>
      <div class="multi-day-content">
        <div class="large-day-number">${currentDayNumber}</div>
        ${dayColumnsHtml}
      </div>
    </div>
  `;

  $("#day-view").html(dayViewHtml);

  // Ensure no current-time indicators remain (disabled for Day view)
  $("#day-view .current-time-indicator").remove();
  $("#day-view .day-current-time-line").remove();

  // Expose a small reflow helper so collapse/expand can keep alignment perfect.
  // (We avoid relying on the fixed 17×PX_PER_HOUR math when hours can shrink.)
  window.reflowDayViewLayout = () => {
    const collapsedHours = getCollapsedHoursSet();

    // Toggle a class to disable fixed-gradient grids when the hour heights are non-uniform.
    const container = document.querySelector(".multi-day-view-container");
    if (container) {
      if (collapsedHours.size > 0) container.classList.add("has-collapsed-hours");
      else container.classList.remove("has-collapsed-hours");
    }

    // Update overall min-heights so there isn't dead space at the bottom.
    let totalHeight = DAY_SPACER_PX;
    for (let h = DAY_START_HOUR; h <= DAY_END_HOUR; h++) {
      totalHeight += getHourBlockHeight(h, collapsedHours);
    }

    const viewContainer = document.querySelector(".multi-day-view-container");
    if (viewContainer) viewContainer.style.minHeight = `${totalHeight}px`;
    document.querySelectorAll(".multi-day-events").forEach((el) => {
      el.style.minHeight = `${totalHeight}px`;
    });

    // Current time indicator intentionally disabled for Day view

    // Reposition hour markers (if enabled in the future)
    document.querySelectorAll(".day-hour-line[data-hour]").forEach((line) => {
      const hour = parseInt(line.getAttribute("data-hour"), 10);
      if (Number.isNaN(hour)) return;
      let top = DAY_SPACER_PX;
      for (let h = DAY_START_HOUR; h < hour; h++) {
        top += getHourBlockHeight(h, collapsedHours);
      }
      line.style.top = `${top}px`;
    });

    // Reposition events based on dynamic collapsed heights
    document.querySelectorAll(".multi-day-event-wrapper[data-start-time][data-end-time]").forEach((wrapper) => {
      const startTime = wrapper.getAttribute("data-start-time");
      const endTime = wrapper.getAttribute("data-end-time");
      if (!startTime || !endTime) return;

      const startHour = parseInt(wrapper.getAttribute("data-event-hour"), 10);
      if (!Number.isNaN(startHour) && collapsedHours.has(startHour)) {
        wrapper.style.display = "none";
        return;
      }

      // Respect any prior explicit hide/show (but keep visible hours visible)
      wrapper.style.display = "block";

      const range = getEventMinuteRange(startTime, endTime);
      const durationMins = Math.max(1, range.endMinutes - range.startMinutes);
      const pxPerMinute = PX_PER_HOUR / 60;

      const top = getTopForTimeWithCollapse(startTime, collapsedHours);
      const height = Math.max(10, durationMins * pxPerMinute);

      wrapper.style.top = `${top}px`;
      wrapper.style.height = `${height}px`;
    });
  };

  // Add click handlers for events (open the same modal used by Week view)
  $("#day-view").on("click", ".multi-day-event-block", async function () {
    const $block = $(this);

    const calendar = window.modernCalendar || window.calendar;
    const eventHandler = calendar && calendar.eventHandler;

    const title = ($block.find(".multi-day-event-title").text() || "").trim();
    const time = ($block.find(".multi-day-event-time").text() || "").trim();
    const fullDate = $block.closest(".multi-day-column").data("date") || "";

    // Infer category from the event-type-* class.
    const typeMatch = ($block.attr("class") || "").match(/\bevent-type-([^\s]+)\b/);
    const category = typeMatch ? typeMatch[1] : "task";

    // Pull images from data-images (comma-separated) if present.
    const imagesRaw = ($block.data("images") || "").toString();
    const images = imagesRaw ? imagesRaw.split(",").map((s) => s.trim()).filter(Boolean) : [];

    // Shape content to match what the Week modal expects.
    const content = {
      category,
      text_2: title,
      description: "",
      images,
    };

    // If the modern calendar modal system exists, use it.
    if (eventHandler && typeof eventHandler.showModal === "function" && typeof eventHandler.generateCellModalContent === "function") {
      let profileImagesHtml = "";
      try {
        if (typeof generateProfileImagesHtml === "function") {
          profileImagesHtml = await generateProfileImagesHtml(images);
        }
      } catch (error) {
        console.error("Failed to generate profile images:", error);
      }

      const descriptionData = typeof eventHandler.getTruncatedDescription === "function" ? eventHandler.getTruncatedDescription(content.description || "") : { truncated: "", full: null };
      const modalContent = eventHandler.generateCellModalContent(content, fullDate, time, profileImagesHtml, descriptionData);
      eventHandler.showModal(modalContent, this);
      return;
    }

    // Fallback: do nothing besides logging if the modal system isn't present.
    const eventId = $block.data("event-id");
    console.log("Multi-day event clicked (no modal handler available):", eventId);
  });

  // Add click handlers for time collapse buttons
  $("#day-view .time-hour-header").on("click", function () {
    const hourId = $(this).data("hour-id");
    toggleTimeHour(hourId);
  });

  $("#day-view .time-collapse-btn").on("click", function (e) {
    e.stopPropagation(); // Prevent header click
    const hourId = $(this).data("hour-id");
    toggleTimeHour(hourId);
  });

  // Current time indicator intentionally disabled for Day view

  // Ensure layout is consistent on first render
  if (typeof window.reflowDayViewLayout === "function") window.reflowDayViewLayout();
}

// Function to toggle time hour collapse/expand
function toggleTimeHour(hourId) {
  const intervals = document.getElementById(hourId);
  const button = document.getElementById(`btn-${hourId}`);

  if (!intervals || !button) return;

  const hourGroup = intervals.closest(".time-hour-group");

  // Extract hour number from hourId (e.g., "hour-7" -> 7)
  const hour = parseInt(hourId.split("-")[1]);

  // Find all event wrappers for this hour across all day columns
  const eventWrappers = document.querySelectorAll(`[data-event-hour="${hour}"]`);

  if (intervals.style.display === "none") {
    // Expand: Show intervals and events
    // Clear inline style so CSS restores the correct layout (flex)
    intervals.style.display = "";
    button.style.transform = "rotate(0deg)";

    if (hourGroup) hourGroup.classList.remove("is-collapsed");

    // Show all events for this hour
    eventWrappers.forEach((wrapper) => {
      wrapper.style.display = "block";
    });
  } else {
    // Collapse: Hide intervals and events
    // Keep an explicit inline hide for immediate feedback; CSS also enforces it.
    intervals.style.display = "none";
    button.style.transform = "rotate(-90deg)";

    if (hourGroup) hourGroup.classList.add("is-collapsed");

    // Hide all events for this hour
    eventWrappers.forEach((wrapper) => {
      wrapper.style.display = "none";
    });
  }

  // Recompute positions so everything below shifts and stays aligned.
  if (typeof window.reflowDayViewLayout === "function") window.reflowDayViewLayout();
}

// Function to add current time indicator
function addCurrentTimeIndicator() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Keep these in sync with Day view layout.
  const DAY_START_HOUR = 6;
  const DAY_END_HOUR = 29; // 5am next day
  const DAY_SPACER_PX = 90;
  const PX_PER_HOUR = 224;
  const hourInRange = currentHour < DAY_START_HOUR ? currentHour + 24 : currentHour;

  if (hourInRange >= DAY_START_HOUR && hourInRange <= DAY_END_HOUR) {
    // Add current time indicator to time column (top aligns with the same scale as events)
    const timePositionPx = DAY_SPACER_PX + (hourInRange - DAY_START_HOUR) * PX_PER_HOUR + (currentMinute / 60) * PX_PER_HOUR;
    const hour12 = ((currentHour % 12) || 12);
    const period = currentHour >= 12 ? "PM" : "AM";
    const displayTime = `${hour12}:${currentMinute.toString().padStart(2, "0")} ${period}`;
    const currentTimeHtml = `
      <div class="current-time-indicator" style="top: ${timePositionPx}px;">
        ${displayTime}
      </div>
    `;
    $(".multi-day-time-column").append(currentTimeHtml);
  }
}

function generateYearView(year) {
  let html = "";

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const dateDots = {
    3: ["purple", "blue", "red"],
    5: ["orange", "blue"],
    10: ["purple", "blue", "red", "orange"],
  };

  for (let month = 0; month < 12; month++) {
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    html += `<div class="month" data-month="${month}">
                            <h4>${monthName}</h4>
                            <div class="days-labels">`;

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((day) => {
      html += `<span class="day-label">${day}</span>`;
    });

    html += `</div><div class="month-days">`;

    for (let i = 0; i < firstDay; i++) {
      html += '<span class="inactive"></span>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === todayYear && month === todayMonth && day === todayDate;
      const todayClass = isToday ? "today-circle" : "";

      // Removed dots display as requested
      html += `<span class="day-with-dot ${todayClass}" data-day="${day}">${day}</span>`;
    }

    const remainingCells = (firstDay + daysInMonth) % 7;
    if (remainingCells !== 0) {
      for (let i = remainingCells; i < 7; i++) {
        html += '<span class="inactive"></span>';
      }
    }

    html += "</div></div>";
  }

  $("#year-view").html(html);

  // Add click event to go to month view
  $("#year-view .month").on("click", function () {
    const selectedMonth = parseInt($(this).data("month"), 10);
    const selectedDate = new Date(year, selectedMonth, 1);
    generateMonthView(selectedDate);
    $("[data-view='month']").trigger("click");
  });
}

function generateMobileYearView(year) {
  let html = "";

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  const dateDots = {
    3: ["purple", "blue", "red"], // 3 dots: task, event, holiday
    5: ["orange", "blue"], // 2 dots: birthday, event
    10: ["purple", "blue", "red", "orange"], // 4 dots: task, event, holiday, birthday
  };

  for (let month = 0; month < 12; month++) {
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    html += `<div class="month" data-month="${month}">
                            <h4>${monthName}</h4>
                            <div class="days-labels">`;

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((day) => {
      html += `<span class="day-label">${day}</span>`;
    });

    html += `</div><div class="month-days">`;

    for (let i = 0; i < firstDay; i++) {
      html += '<span class="inactive"></span>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = year === todayYear && month === todayMonth && day === todayDate;
      const todayClass = isToday ? "today-circle" : "";

      // Removed dots display as requested
      html += `<span class="day-with-dot ${todayClass}">${day}</span>`;
    }

    const remainingCells = (firstDay + daysInMonth) % 7;
    if (remainingCells !== 0) {
      for (let i = remainingCells; i < 7; i++) {
        html += '<span class="inactive"></span>';
      }
    }

    html += "</div></div>";
  }

  $("#mobyear-view").html(html);

  // Add click event to go to month view
  $("#mobyear-view .month").on("click", function () {
    const selectedMonth = parseInt($(this).data("month"), 10);
    if (isNaN(selectedMonth)) return;

    selectedDate = new Date(year, selectedMonth, 1);

    console.log("Selected month:", selectedMonth, "Year:", year);

    // Switch to month view
    $("[data-view='mob-month']").trigger("click");
    updateMainCalendar();
  });
}

function generateMobileMonthView(year) {
  let html = "";

  const dateDots = {
    3: ["purple", "blue", "red"],
    5: ["orange", "blue"],
    10: ["purple", "blue", "red", "orange"],
  };

  for (let month = 0; month < 12; month++) {
    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    html += `<div class="month">
                        <h4>${monthName}</h4>
                        <div class="days-labels">`;

    // Add day labels (Sunday to Saturday)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((day) => {
      html += `<span class="day-label">${day}</span>`;
    });

    html += `</div><div class="month-days">`;

    for (let i = 0; i < firstDay; i++) {
      html += '<span class="inactive"></span>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
      let dots = "";

      html += `<span class="day-with-dot" data-day="${day}" data-date="${year}-${month + 1}-${day}">
          ${day} 
          <div class="dots-container">`;
      if (dateDots[day]) {
        dateDots[day].forEach((color) => {
          html += `<span style="color: ${color};">●</span>`;
        });
      }

      html += `</div>
          </span>`;
    }

    const remainingCells = (firstDay + daysInMonth) % 7;
    if (remainingCells !== 0) {
      for (let i = remainingCells; i < 7; i++) {
        html += '<span class="inactive"></span>';
      }
    }

    html += "</div></div>";
  }

  $("#mobmon-view").html(html);
  $("#mobmon-view span.day-with-dot").on("click", function () {
    const clickedDay = parseInt($(this).data("day"), 10);
    const clickedDate = $(this).data("date");

    if (isNaN(clickedDay) || !clickedDate) return;

    selectedDate = new Date(clickedDate);

    // Switch to week view
    $("[data-view='mob-week']").trigger("click");
    updateMainCalendar();
  });
}

/**
 * 






 */

document.addEventListener("mouseover", (e) => {
  const highlightedButton = e.target.closest(".highlight-icon-on-cell");
  if (!highlightedButton) return;

  const tooltip = document.getElementById("pointerTooltipOverlay");
  if (!tooltip) return;

  // -- 1. Show Tooltip with Fade In --
  tooltip.classList.add("active", "animate__animated", "animate__fadeIn");
  // Remove any fade-out class if it was previously applied
  tooltip.classList.remove("animate__fadeOut");

  // Position the tooltip (using fixed positioning relative to the viewport)
  tooltip.style.position = "fixed";
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = "1";

  // Mousemove handler to follow the cursor
  const moveTooltip = (event) => {
    const offsetX = 20;
    const offsetY = 10;

    // Use clientX/clientY for positioning within the viewport
    let left = event.clientX + offsetX;
    let top = event.clientY + offsetY;

    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Prevent overflow on the right
    if (left + tooltipRect.width > viewportWidth) {
      left = event.clientX - tooltipRect.width - offsetX;
    }
    // Prevent overflow on the bottom
    if (top + tooltipRect.height > viewportHeight) {
      top = event.clientY - tooltipRect.height - offsetY;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  // Attach the mousemove listener
  document.addEventListener("mousemove", moveTooltip);

  // When the user leaves the highlighted button
  highlightedButton.addEventListener(
    "mouseleave",
    () => {
      highlightedButton.classList.remove("active");

      // -- 2. Trigger Fade Out --
      tooltip.classList.remove("animate__fadeIn");
      tooltip.classList.add("animate__fadeOut");

      // Listen for the end of the fade-out animation to fully hide the tooltip
      const onAnimationEnd = (animationEvent) => {
        // Only hide after fadeOut is complete (avoid false triggers on fadeIn)
        if (animationEvent.animationName === "fadeOut") {
          tooltip.classList.remove("active", "animate__animated", "animate__fadeOut");
          tooltip.style.visibility = "hidden";
          tooltip.style.opacity = "0";

          // Remove this listener so it doesn’t run multiple times
          tooltip.removeEventListener("animationend", onAnimationEnd);
        }
      };

      tooltip.addEventListener("animationend", onAnimationEnd);

      // Clean up the mousemove event
      document.removeEventListener("mousemove", moveTooltip);
    },
    { once: true }
  );
});
