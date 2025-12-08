/* ============================================
   Live Chat - JavaScript
   ============================================ */

(function () {
  "use strict";

  // DOM Elements
  const sidebar = document.querySelector(".live-chat-sidebar");
  const spaceItems = document.querySelectorAll(".space-item");
  const joinButtons = document.querySelectorAll(".join-space-btn");
  const createBtn = document.querySelector(".create-btn");
  const backBtn = document.querySelector(".back-btn");
  const newSpaceBtn = document.querySelector(".new-space-btn");
  const startThreadBtn = document.querySelector(".start-thread-btn");
  const joinThreadBtn = document.querySelector(".join-thread-btn");
  const joinAllBtn = document.querySelector(".join-all-btn");
  const hideAsideContainerMenu = document.getElementById("hideAsideContainerMenu");
  const collapseSpaceAside = document.getElementById("collapseSpaceAside");
  const collapseThreadAside = document.getElementById("collapseThreadAside");
  const sidebarTriggerBtn = document.querySelector(".sidebar_trigger");

  // Initialize
  function init() {
    setupEventListeners();
    loadSpaces();
  }

  //
  function handleSidebarTrigger() {
    const liveChatSidebar = document.querySelector(".live-chat-sidebar");
    const isCollapsed = liveChatSidebar.getAttribute("aria-expanded") === "true";

    if (isCollapsed) {
      liveChatSidebar.setAttribute("aria-expanded", false);
    } else {
      liveChatSidebar.setAttribute("aria-expanded", true);
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Sidebar trigger
    if (sidebarTriggerBtn) {
      sidebarTriggerBtn.addEventListener("click", handleSidebarTrigger);
    }

    // Space item click
    spaceItems.forEach((item) => {
      item.addEventListener("click", handleSpaceClick);
    });

    // Join button click
    joinButtons.forEach((btn) => {
      btn.addEventListener("click", handleJoinSpace);
    });

    // Create button
    if (createBtn) {
      createBtn.addEventListener("click", handleCreateSpace);
    }

    // Back button
    if (backBtn) {
      backBtn.addEventListener("click", handleBack);
    }

    // New space button
    if (newSpaceBtn) {
      newSpaceBtn.addEventListener("click", handleNewSpace);
    }

    // Start thread button
    if (startThreadBtn) {
      startThreadBtn.addEventListener("click", handleStartThread);
    }

    // Join thread button
    if (joinThreadBtn) {
      joinThreadBtn.addEventListener("click", handleJoinThread);
    }

    // Join all button
    if (joinAllBtn) {
      joinAllBtn.addEventListener("click", handleJoinAll);
    }

    if (hideAsideContainerMenu) {
      hideAsideContainerMenu.addEventListener("click", handleAsideContainer);
    }

    if (collapseSpaceAside) {
      collapseSpaceAside.addEventListener("click", () => {
        document.getElementById("asideSpaceContainer").classList.add(HIDDEN);
        hideAsideContainerMenu.setAttribute("aria-expanded", true);
      });
    }

    if (collapseThreadAside) {
      collapseThreadAside.addEventListener("click", () => {
        document.getElementById("asideThreadContainer").classList.add(HIDDEN);
        hideAsideContainerMenu.setAttribute("aria-expanded", true);
      });
    }
  }

  function handleAsideContainer() {
    document.querySelectorAll(".space-thread-aside-container").forEach((container) => container.classList.add(HIDDEN));
    const asideThreadContainer = document.getElementById("asideThreadContainer");
    const isExpanded = hideAsideContainerMenu.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
      asideThreadContainer.classList.remove(HIDDEN);
      hideAsideContainerMenu.setAttribute("aria-expanded", false);
    } else {
      hideAsideContainerMenu.setAttribute("aria-expanded", true);
    }
  }

  // Handle space click
  function handleSpaceClick(e) {
    // Don't trigger if clicking on join button
    if (e.target.closest(".join-space-btn")) {
      return;
    }

    // Remove active class from all items
    spaceItems.forEach((item) => item.classList.remove("active"));

    // Add active class to clicked item
    this.classList.add("active");

    // Load space content
    loadSpaceContent(this.dataset.spaceId);
  }

  // Handle join space
  function handleJoinSpace(e) {
    e.stopPropagation();
    const spaceItem = e.target.closest(".space-item");
    const spaceName = spaceItem.querySelector(".space-name").textContent.trim();

    // Change button text
    e.target.textContent = "Joined";
    e.target.classList.add("joined");
    e.target.disabled = true;

    // Show success message
    showNotification(`Successfully joined ${spaceName}!`, "success");

    // Simulate joining animation
    setTimeout(() => {
      spaceItem.classList.add("joined-space");
    }, 300);
  }

  // Handle create space
  function handleCreateSpace() {
    showNotification("Create space feature coming soon!", "info");
  }

  // Handle back button
  function handleBack() {
    window.history.back();
  }

  // Handle new space
  function handleNewSpace() {
    showNotification("New space creation coming soon!", "info");
  }

  // Handle start thread
  function handleStartThread() {
    showNotification("Start thread feature coming soon!", "info");
  }

  // Handle join thread
  function handleJoinThread() {
    showNotification("Please select a space to join!", "info");
  }

  // Handle join all
  function handleJoinAll() {
    const unjoinedSpaces = document.querySelectorAll(".join-space-btn:not(.joined)");

    if (unjoinedSpaces.length === 0) {
      showNotification("You have already joined all spaces!", "info");
      return;
    }

    unjoinedSpaces.forEach((btn, index) => {
      setTimeout(() => {
        btn.click();
      }, index * 200);
    });

    showNotification(`Joining ${unjoinedSpaces.length} spaces...`, "success");
  }

  // Load spaces (simulate API call)
  function loadSpaces() {
    // This would typically fetch from an API
    console.log("Loading spaces...");
  }

  // Load space content
  function loadSpaceContent(spaceId) {
    console.log("Loading space content for:", spaceId);
    // This would typically fetch space messages and content
  }

  // Show notification
  function showNotification(message, type = "info") {
    // Check if flashMessage function exists (from your existing code)
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      // Fallback to console
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Responsive sidebar toggle
  function setupResponsiveSidebar() {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    function handleMediaChange(e) {
      if (e.matches) {
        // Mobile view
        sidebar?.classList.add("mobile");
      } else {
        // Desktop view
        sidebar?.classList.remove("mobile");
      }
    }

    mediaQuery.addListener(handleMediaChange);
    handleMediaChange(mediaQuery);
  }

  // Search functionality
  function setupSearch() {
    const searchInput = document.querySelector(".live-chat-search");

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterSpaces(searchTerm);
      });
    }
  }

  // Filter spaces based on search
  function filterSpaces(searchTerm) {
    spaceItems.forEach((item) => {
      const spaceName = item.querySelector(".space-name").textContent.toLowerCase();

      if (spaceName.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  // Add pulse animation to CSS dynamically
  function addPulseAnimation() {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse {
        0%, 100% {
          box-shadow: 0 0 8px rgba(0, 217, 163, 0.5);
        }
        50% {
          box-shadow: 0 0 16px rgba(0, 217, 163, 0.8);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("resize", screensHandler);
  document.addEventListener("DOMContentLoaded", screensHandler);

  function screensHandler() {
    const spaceThreadAsideContainer = document.querySelectorAll(".space-thread-aside-container");
    const liveChatMain = document.getElementById("liveChatMain");
    const navbarSearchForm = document.querySelector(".navbar_search_form--wrapper");

    spaceThreadAsideContainer.forEach((container) => container.classList.add("live-chat-hidden"));

    if (window.innerWidth <= 1024) {
      liveChatMain?.classList.add("live-chat-hidden");
      navbarSearchForm?.classList.add("live-chat-hidden");
    } else {
      liveChatMain?.classList.remove("live-chat-hidden");
      navbarSearchForm?.classList.remove("live-chat-hidden");
    }
  }

  // Setup additional features
  setupResponsiveSidebar();
  setupSearch();
  addPulseAnimation();
})();
