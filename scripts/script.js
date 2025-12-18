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

// Development Mode: Set to true to bypass authentication
// Use window object to avoid duplicate declaration errors
if (typeof window.DEV_MODE === 'undefined') {
  window.DEV_MODE = false;
}

const login = window.DEV_MODE ? 1 : 0; // Auto-login when in dev mode

if (!login) {
  const loginEl = document.getElementById("login");
  const loggedEl = document.getElementById("logged");
  loginEl?.classList.remove("hide");
  loggedEl?.classList.add("hide");
} else {
  const loginEl = document.getElementById("login");
  const loggedEl = document.getElementById("logged");
  loginEl?.classList.add("hide");
  loggedEl?.classList.remove("hide");
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
if (sizemugNavbarActionPlus) {
  sizemugNavbarActionPlus.addEventListener("click", (e) => {
    const isExpanded = sizemugNavbarActionPlus.getAttribute("aria-expanded") === "true";
    sizemugNavbarActionPlus.setAttribute("aria-expanded", !isExpanded);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#sizemugNavbarActionPlus")) {
      sizemugNavbarActionPlus.removeAttribute("aria-expanded");
    }
  });
}

// ---------------------------------------------------------------------------
// Global focus guard: prevent an unwanted blinking caret on page load.
// The caret should only appear after an explicit user interaction (e.g. clicking
// a search input). Many pages/modals include contenteditable fields; if any of
// them get focused automatically it looks like a blinking cursor “everywhere”.
//
// This guard blurs any focused editable element during initial page load unless
// the user has already interacted with the page.
// ---------------------------------------------------------------------------
if (typeof window.__sizemugPreventAutofocusCaret === "undefined") {
  window.__sizemugPreventAutofocusCaret = true;

  let hadUserGesture = false;
  const markGesture = () => {
    if (hadUserGesture) return;
    hadUserGesture = true;
    try {
      document.documentElement.classList.add("sizemug-user-gesture");
    } catch (e) {
      // ignore
    }
  };

  // Capture a broad set of interactions.
  window.addEventListener("pointerdown", markGesture, true);
  window.addEventListener("mousedown", markGesture, true);
  window.addEventListener("touchstart", markGesture, true);
  window.addEventListener("keydown", markGesture, true);

  const isEditableElement = (el) => {
    if (!el || el === document.body || el === document.documentElement) return false;
    if (el.isContentEditable) return true;
    const tag = String(el.tagName || "").toUpperCase();
    if (tag === "TEXTAREA") return true;
    if (tag === "INPUT") {
      const type = String(el.getAttribute("type") || "text").toLowerCase();
      // Ignore non-text inputs.
      if (type === "hidden" || type === "checkbox" || type === "radio" || type === "button" || type === "submit" || type === "reset" || type === "file") {
        return false;
      }
      return true;
    }
    return false;
  };

  // Hard guard: some scripts repeatedly call `.focus()` (sometimes even inside
  // setInterval). Blurring after the fact can still show a visible caret flash.
  // To stop that entirely, block programmatic focus on editable elements until
  // the user interacts.
  if (typeof window.__sizemugOriginalHTMLElementFocus !== "function") {
    window.__sizemugOriginalHTMLElementFocus = HTMLElement.prototype.focus;

    HTMLElement.prototype.focus = function (...args) {
      if (!hadUserGesture && isEditableElement(this)) {
        return;
      }
      return window.__sizemugOriginalHTMLElementFocus.apply(this, args);
    };
  }

  const blurIfAutofocused = () => {
    if (hadUserGesture) return;
    const active = document.activeElement;
    if (!isEditableElement(active)) return;

    try {
      active.blur();
    } catch (e) {
      // ignore
    }

    // Defensive: some browsers keep a selection even after blur for contenteditable.
    try {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel && sel.removeAllRanges && sel.removeAllRanges();
      }
    } catch (e) {
      // ignore
    }
  };

  // Some pages focus inputs/contenteditables asynchronously (after API calls,
  // modal init, timers, etc.). Catch those too, until the user actually
  // interacts.
  const onFocusIn = (event) => {
    if (hadUserGesture) return;
    const target = event.target;
    if (!isEditableElement(target)) return;

    // Let the focus event complete, then remove it.
    setTimeout(() => {
      if (hadUserGesture) return;
      try {
        target.blur();
      } catch (e) {
        // ignore
      }

      try {
        if (window.getSelection) {
          const sel = window.getSelection();
          sel && sel.removeAllRanges && sel.removeAllRanges();
        }
      } catch (e) {
        // ignore
      }
    }, 0);
  };

  document.addEventListener("focusin", onFocusIn, true);

  // Run after scripts finish, and a few times shortly after load to catch any
  // delayed focus() calls.
  window.addEventListener("load", () => {
    [0, 30, 120, 350, 800].forEach((ms) => setTimeout(blurIfAutofocused, ms));
  });
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Function to calculate the time ago - make it globally available
window.timeAgo = function(isoDateString) {
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
};

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
