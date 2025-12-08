const $headerDropdown = $(".header_dropdown");

$(document).on("click", "#suggestions_expand", (event) => {
  const $el = $(event.currentTarget);

  const list = $el.parent().find("ul");
  const isExpanded = list.attr("aria-expanded") === "true";
  list.css("--item-count", list.children().length);
  list.attr("aria-expanded", isExpanded ? "false" : "true");
});

$(document).on("click", ".popup_trigger", (event) => {
  const $el = $(event.currentTarget);
  const $target = $($el.attr("data-popup-target"));
  const dialog = $target.get(0);

  if (!dialog) return;
  const isOpen = dialog.open;

  if (isOpen) {
    $target.removeClass("open");
    setTimeout(() => dialog.close(), 200);
  } else {
    dialog.show();
    setTimeout(() => $target.addClass("open"), 1);
  }

  $el.attr("data-active", isOpen);
});

// Function to toggle sidebar
function toggleSidebar() {
  const $sidebar = $("#sidebar");
  const isOpen = $sidebar.attr("aria-expanded") === "true";
  $sidebar.attr("aria-expanded", !isOpen);
}

// Click event for sidebar trigger
$(document).on("click", ".sidebar_trigger", toggleSidebar);

// Keyboard shortcut (Ctrl + B on Windows/Linux, Command + B on Mac)
$(document).on("keydown", (event) => {
  // Check if it's Command key on Mac or Ctrl key on other OS
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modifierKey = isMac ? event.metaKey : event.ctrlKey;

  if (modifierKey && event.key === "b") {
    event.preventDefault(); // Prevent default browser behavior
    toggleSidebar();
  }
});

// document.addEventListener("click", (e) => {
//   if (location.pathname === "/explore.html" && document.getElementById("story_overlay")) {
//     // document.getElementById("story_overlay").remove();
//   }
// });

$(window).on("resize", () => {
  if (window.innerWidth > 768) {
    $(".popup").each((_, el) => {
      el.close();
    });
  }
});

const popup_status = () => {
  $(`[data-status]`).each(function (ele) {
    this.setAttribute("data-status", "0");
  });
};

const login = 1;

if (!login) {
  document.getElementById("login").classList.remove("hide");
  document.getElementById("logged").classList.add("hide");
} else {
  // document.getElementById("login").classList.add("hide");
  // document.getElementById("logged").classList.remove("hide");
}

$(".tab-link > div").on("click", function (e) {
  $(".tab-link > div").removeClass("active-tab");
  let target = this.getAttribute(`aria-labelledBy`);
  $(`.tab-panel`).addClass(`hide`);
  $(`#${target}`).removeClass(`hide`);

  $(this).addClass("active-tab");
});

/* Select Toggle */
$(`.select-toggle`).on(`click`, function () {
  $(this).hasClass(`select-none`);
});

// Logo Event
const sizemugLogo = document.querySelector('[loading="lazy"]');
if (sizemugLogo) {
  sizemugLogo.style.cursor = "pointer";

  sizemugLogo.addEventListener("click", () => {
    // reload the page
    window.location.href = "/dashboard.html";
  });
}

const asideHomeLink = document.getElementById("aside_home_link");
asideHomeLink?.addEventListener("click", (e) => {
  localStorage.setItem("sizemug_loading_type", "Home");
});

const sizemugNavbarActionPlus = document.getElementById("sizemugNavbarActionPlus");
sizemugNavbarActionPlus.addEventListener("click", (e) => {
  const isExpanded = sizemugNavbarActionPlus.getAttribute("aria-expanded") === "true";
  sizemugNavbarActionPlus.setAttribute("aria-expanded", !isExpanded);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#sizemugNavbarActionPlus")) {
    sizemugNavbarActionPlus.removeAttribute("aria-expanded");
  }
});

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Function to calculate the time ago
function timeAgo(isoDateString) {
  const inputDate = new Date(isoDateString); // Parse the input date
  const now = new Date(); // Current date

  const diffInMs = now - inputDate; // Difference in milliseconds
  const diffInSeconds = Math.floor(diffInMs / 1000); // Convert to seconds

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInWeek = 7 * secondsInDay;

  let weeks = Math.floor(diffInSeconds / secondsInWeek);
  let days = Math.floor((diffInSeconds % secondsInWeek) / secondsInDay);
  let hours = Math.floor((diffInSeconds % secondsInDay) / secondsInHour);
  let minutes = Math.floor((diffInSeconds % secondsInHour) / secondsInMinute);

  let result = "";

  if (weeks > 0) {
    result += weeks + " week" + (weeks > 1 ? "s" : "") + ", ";
  }
  if (days > 0) {
    result += days + " day" + (days > 1 ? "s" : "") + ", ";
  }
  if (hours > 0) {
    result += hours + " hour" + (hours > 1 ? "s" : "") + ", ";
  }
  if (minutes > 0) {
    result += minutes + " minute" + (minutes > 1 ? "s" : "") + ", ";
  }

  // Remove trailing comma and space, or return "Just now"
  return result ? result.slice(0, -2).split(", ").at(-1) + " ago" : "Just now";
}

/**
 *
 *
 * Tag Modal
 *
 *
 */
const hideTagModal = document.getElementById("hideTagModal");

hideTagModal?.addEventListener("click", (e) => {
  e.target.closest(".overlay").classList.add(HIDDEN);
});

localStorage.setItem("auth", 1);

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   █████╗ ██╗███████╗██████╗  █████╗ ██████╗ ███████╗██╗   ██╗     ║
║  ██╔══██╗██║██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██║   ██║     ║
║  ███████║██║█████╗  ██████╔╝███████║██║  ██║█████╗  ██║   ██║     ║
║  ██╔══██║██║██╔══╝  ██╔══██╗██╔══██║██║  ██║██╔══╝  ╚██╗ ██╔╝     ║
║  ██║  ██║██║███████╗██║  ██║██║  ██║██████╔╝███████╗ ╚████╔╝      ║
║  ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝  ╚═══╝       ║
║                                                                   ║
║                🚀 Powered by AIEraDev Development 🚀              ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ███████╗██╗███████╗███████╗███╗   ███╗██╗   ██╗ ██████╗         ║
║   ██╔════╝██║╚══███╔╝██╔════╝████╗ ████║██║   ██║██╔════╝         ║
║   ███████╗██║  ███╔╝ █████╗  ██╔████╔██║██║   ██║██║  ███╗        ║
║   ╚════██║██║ ███╔╝  ██╔══╝  ██║╚██╔╝██║██║   ██║██║   ██║        ║
║   ███████║██║███████╗███████╗██║ ╚═╝ ██║╚██████╔╝╚██████╔╝        ║
║   ╚══════╝╚═╝╚══════╝╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚═════╝         ║
║                                                                   ║
║              🎯 General Platform for People 🎯                    ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);
