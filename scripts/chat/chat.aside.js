const chatAsideTabComponent = document.getElementById("chatAsideTabComponent");
const allChatAsideTabComponentButtons = chatAsideTabComponent.querySelectorAll("button");

chatAsideTabComponent.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    allChatAsideTabComponentButtons.forEach((button) => button.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    const attr = button.getAttribute("data-container");
    const container = document.getElementById(`${attr}TabContainer`);

    hideAllChatSectionContainers();
    container.classList.remove(HIDDEN);

    if (attr === "lives") {
      window.location.href = "/live-chat.html";
    }
  }
});

// Reusable functions
function hideAllChatSectionContainers() {
  const chatFilterSectionItems = document.querySelectorAll(".chat_filter_section--item");
  chatFilterSectionItems.forEach((filter) => filter.classList.add(HIDDEN));
}

/**
 *
 *
 *
 *
 *
 *
 * Aside Collapsing functionality
 *
 *
 *
 *
 *
 *
 */

const sidebarTrigger = document.getElementById("sidebarTrigger");
const largeAsideComponent = document.getElementById("largeAsideComponent");
const smallAsideComponent = document.getElementById("smallAsideComponent");

sidebarTrigger.addEventListener("click", () => {
  const isExpanded = largeAsideComponent.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    largeAsideComponent.setAttribute("aria-expanded", false);
    largeAsideComponent.classList.add(HIDDEN);
    smallAsideComponent.classList.remove(HIDDEN);
  } else {
    largeAsideComponent.setAttribute("aria-expanded", true);
    largeAsideComponent.classList.remove(HIDDEN);
    smallAsideComponent.classList.add(HIDDEN);
  }
});

/**
 * 




 */

document.querySelectorAll(".showAvailableHereUsers").forEach((button) => {
  button.addEventListener("click", showGlobalFollowingModal);
});
