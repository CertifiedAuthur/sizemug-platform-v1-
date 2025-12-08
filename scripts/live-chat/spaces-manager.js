/* ============================================
   Spaces Manager - Class-based Implementation
   ============================================ */

class SpacesManager {
  constructor() {
    this.storageKey = "liveChatSpaces";
    this.spaces = [];
    this.container = null;
    this.init();
  }

  // Initialize the manager
  init() {
    this.loadFromStorage();

    // Find the "Your spaces" section specifically
    const sections = document.querySelectorAll(".sidebar-section");
    sections.forEach((section) => {
      const title = section.querySelector(".section-title");
      if (title && title.textContent.trim() === "Your spaces") {
        this.container = section;
      }
    });

    if (this.container) {
      // Check if this is first visit
      const hasVisited = this.checkVisitStatus();

      if (!hasVisited) {
        // First visit - show "New Space" button only
        this.showNewSpaceButton();
      } else {
        // Subsequent visit - show spaces
        this.render();
      }
    }

    this.setupEventListeners();
    this.render();
  }

  // Check visit status
  checkVisitStatus() {
    try {
      return localStorage.getItem("liveChatAsideVisibility") === "true";
    } catch (error) {
      return false;
    }
  }

  // Show only new space button for first visit
  showNewSpaceButton() {
    const newSpaceBtn = this.container?.querySelector("#initialNewSpace");
    if (newSpaceBtn) {
      newSpaceBtn.style.display = "flex";
    }
  }

  // Load spaces from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.spaces = JSON.parse(stored);
      } else {
        // Initialize with empty spaces array
        this.spaces = [];
      }
    } catch (error) {
      console.error("Error loading spaces:", error);
      this.spaces = [];
    }
  }

  // Save spaces to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.spaces));
    } catch (error) {
      console.error("Error saving spaces:", error);
    }
  }

  // Generate unique ID
  generateId() {
    return `space_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Format time ago
  formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
    return "Last month";
  }

  // Create space card HTML
  createSpaceCard(space) {
    const visibilityIcon = space.visibility === "private" ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M12 21C4.75561 13.08 8.98151 5.7 12 3M12 21C19.2444 13.08 15.0185 5.7 12 3" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    return `
      <div class="space-card" data-space-id="${space.id}">
        <div class="space-card-header">
          <div class="space-info">
            <span class="space-color-dot" style="background-color: ${space.color}"></span>
            <h4 class="space-name">${space.name} ${space.emoji}</h4>
          </div>
        </div>
        
        <div class="space-card-body">
          <span class="thread-count" style="color: #01c74a">${space.threadCount} threads</span>

           <button class="space-add-btn" title="Add thread">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 5L10 15" stroke="#01c74a" stroke-width="1.66667" stroke-linecap="round"/><path d="M15 10L5 10" stroke="#01c74a" stroke-width="1.66667" stroke-linecap="round"/></svg>
          </button>
        </div>
        
        <div class="space-card-footer">
          <div class="space-activity">
            <span class="activity-icon" style="color: ${space.color}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.9996 3L5.06859 12.6934C4.72703 13.1109 4.55625 13.3196 4.55471 13.4956C4.55336 13.6486 4.62218 13.7939 4.74148 13.8897C4.87867 14 5.14837 14 5.68776 14H11.9996L10.9996 21L18.9305 11.3066C19.2721 10.8891 19.4429 10.6804 19.4444 10.5044C19.4458 10.3514 19.377 10.2061 19.2577 10.1103C19.1205 10 18.8508 10 18.3114 10H11.9996L12.9996 3Z" stroke="${space.color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </span>
            <span class="activity-time">${this.formatTimeAgo(space.lastActivity)}</span>
          </div>
          <span class="visibility-icon">${visibilityIcon}</span>
        </div>
      </div>
    `;
  }

  // Create new space card HTML
  createNewSpaceCard(isSpaces) {
    return `
      <div class="space-card new-space-card ${isSpaces ? "" : "new-space-card-wrapper"}" data-action="create-space" style="cursor: pointer;">
        <div class="new-space-content">
          <button class="new-space-icon" data-action="create-space">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10L20 30" stroke="#01c74a" stroke-width="2.5" stroke-linecap="round"/><path d="M30 20L10 20" stroke="#01c74a" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
          <h4 class="new-space-label">New Space</h4>
        </div>
      </div>
    `;
  }

  // Render spaces
  render() {
    if (!this.container) return;

    // Hide the initial new space button
    const initialBtn = document.getElementById("initialNewSpace");
    if (initialBtn) {
      initialBtn.style.display = "none";
    }

    // Find or create spaces list container
    let spacesList = this.container.querySelector(".spaces-list");

    if (!spacesList) {
      spacesList = document.createElement("div");
      spacesList.className = "spaces-list";

      // Insert before the "New Space" button
      const newSpaceBtn = this.container.querySelector(".new-space-btn");
      if (newSpaceBtn) {
        this.container.insertBefore(spacesList, newSpaceBtn);
      } else {
        this.container.appendChild(spacesList);
      }
    }

    // Render all spaces + new space card at the end
    const spacesHTML = this.spaces.map((space) => this.createSpaceCard(space)).join("");
    const newSpaceCardHTML = this.createNewSpaceCard(!!this.spaces.length);
    spacesList.innerHTML = spacesHTML + newSpaceCardHTML;

    // Attach event listeners to cards
    this.attachCardListeners();
    this.attachNewSpaceCardListener();
  }

  // Setup event listeners
  setupEventListeners() {
    const seeAllBtn = this.container?.querySelector(".see-all-btn");

    if (seeAllBtn) {
      seeAllBtn.addEventListener("click", () => this.handleSeeAll());
    }

    // Space action buttons
    this.setupSpaceActionListeners();
  }

  // Setup space action button listeners
  setupSpaceActionListeners() {
    const deleteSpaceBtn = document.getElementById("deleteSpaceBtn");
    const leaveSpaceBtn = document.getElementById("leaveSpaceBtn");
    const closeSpaceBtn = document.getElementById("closeSpaceBtn");

    deleteSpaceBtn?.addEventListener("click", () => this.showDeleteSpaceModal());
    leaveSpaceBtn?.addEventListener("click", () => this.showLeaveSpaceModal());
    closeSpaceBtn?.addEventListener("click", () => this.showCloseSpaceModal());
  }

  // Attach listeners to space cards
  attachCardListeners() {
    const cards = this.container?.querySelectorAll(".space-card:not(.new-space-card)");

    cards?.forEach((card) => {
      const spaceId = card.dataset.spaceId;
      const addBtn = card.querySelector(".space-add-btn");

      // Card click
      card.addEventListener("click", (e) => {
        if (!e.target.closest(".space-add-btn")) {
          this.handleSpaceClick(spaceId);
        }
      });

      // Add button click
      addBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        this.handleAddThread(spaceId);
      });
    });
  }

  // Attach listener to new space card
  attachNewSpaceCardListener() {
    const newSpaceCard = this.container?.querySelector(".new-space-card");

    if (newSpaceCard) {
      newSpaceCard.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("New space card clicked!");
        console.log("Available modals:", {
          createSpaceModal: !!window.createSpaceModal,
          CreateSpaceModal: !!window.CreateSpaceModal,
          createThreadModal: !!window.createThreadModal,
        });

        // Check if create space modal exists, otherwise open thread modal
        if (window.createSpaceModal) {
          console.log("Opening create space modal via instance");
          window.createSpaceModal.show();
        } else if (window.CreateSpaceModal) {
          // Try to create an instance if class is available
          console.log("Creating new create space modal instance");
          const modal = new window.CreateSpaceModal();
          window.createSpaceModal = modal;
          modal.show();
        } else if (window.createThreadModal) {
          // Open thread modal without pre-selected space
          console.log("Fallback: opening thread modal");
          window.createThreadModal.open();
        } else {
          console.error("No modals available!");
          this.showNotification("Modal not available", "error");
        }
      });
    } else {
      console.warn("New space card not found in container");
    }
  }

  // Handle see all
  handleSeeAll() {
    this.showNotification("Showing all spaces", "info");
    // Could expand to show modal or navigate to dedicated page
  }

  // Handle space click
  handleSpaceClick(spaceId) {
    const space = this.spaces.find((s) => s.id === spaceId);
    if (space) {
      // Update last activity
      space.lastActivity = Date.now();
      this.saveToStorage();

      // Highlight the space
      this.highlightSpace(spaceId);

      //
      this.showSpaceAsideContainerInfo(space);

      // Automatically open the first thread in the space
      this.openFirstThread(space);

      if (window.innerWidth < 1024) {
        document.getElementById("liveChatSidebar").classList.add("live-chat-hidden");
        document.getElementById("liveChatMain").classList.remove("live-chat-hidden");
      }
    }
  }

  // Open the first thread in a space automatically
  openFirstThread(space) {
    // Get threads manager instance
    if (window.threadsManager) {
      // Get all threads and filter by space
      const allThreads = window.threadsManager.getAllThreads();
      const spaceThreads = allThreads.filter((thread) => thread.spaceId === space.id || thread.spaceName === space.name);

      if (spaceThreads && spaceThreads.length > 0) {
        const firstThread = spaceThreads[0];
        // Open the first thread using existing method
        window.threadsManager.handleThreadClick(firstThread.id);
      } else {
        // If no threads exist, show empty state or create a default thread
        console.log(`No threads found in space: ${space.name}`);
        // You could optionally create a default "General" thread here
        // this.createDefaultThread(space);
      }
    }
  }

  showSpaceAsideContainerInfo(space) {
    const containers = document.querySelectorAll(".live-chat-container .space-thread-aside-container");
    const asideSpaceContainer = document.getElementById("asideSpaceContainer");

    containers.forEach((container) => container.classList.add("live-chat-hidden"));
    asideSpaceContainer.classList.remove("live-chat-hidden");

    // Update Banner
    const asideStickyImage = asideSpaceContainer.querySelector(".aside-sticky-image");
    asideStickyImage.innerHTML = "";

    if (space.banner) {
      const img = document.createElement("img");
      img.alt = "Sticky Image";
      img.src = space.banner;
      asideStickyImage.appendChild(img);
    } else {
      const span = document.createElement("span");
      span.textContent = "No Banner";
      asideStickyImage.appendChild(span);
    }

    // Background Color
    const asideAnnouncementSpaceDot = asideSpaceContainer.querySelector(".aside-announcement-space-dot");
    if (asideAnnouncementSpaceDot) {
      asideAnnouncementSpaceDot.style.backgroundColor = space.color;
    }

    // Update Space Name
    const asideSpaceTitle = asideSpaceContainer.querySelector(".aside-space-thread-count");
    if (window.threadsManager) {
      asideSpaceTitle.textContent = `${space.threadCount} Active threads`;
    }

    //
    const asideSpaceName = asideSpaceContainer.querySelector(".aside-announcement-title");
    if (asideSpaceName) {
      asideSpaceName.textContent = space.name;
    }

    //
    const asideSpaceDescription = asideSpaceContainer.querySelector(".aside-space-description");
    if (asideSpaceDescription) {
      asideSpaceDescription.textContent = space.description;
    }

    // Space Visibility Icon
    const visibilityIconEl = asideSpaceContainer.querySelector(".visibility-icon");
    const visibilityText = asideSpaceContainer.querySelector(".visibility-text");
    visibilityIconEl.innerHTML = "";
    visibilityText.innerHTML = "";
    const visibilityIcon = space.visibility === "private" ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12H21M3 12C3 16.9706 7.02944 21 12 21M3 12C3 7.02944 7.02944 3 12 3M21 12C21 16.9706 16.9706 21 12 21M21 12C21 7.02944 16.9706 3 12 3M12 21C4.75561 13.08 8.98151 5.7 12 3M12 21C19.2444 13.08 15.0185 5.7 12 3" stroke="#7D8FAA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    if (space.isPrivate) {
      visibilityIconEl.innerHTML = visibilityIcon;
      visibilityText.textContent = `Open to ”${space.name} ${space?.emoji}” Only`;
    } else {
      visibilityIconEl.innerHTML = visibilityIcon;
      visibilityText.textContent = "Open to Everyone";
    }

    // Threads Lists
    const threadsList = asideSpaceContainer.querySelector(".threads-list");
    if (space.threadCount > 0 && threadsList) {
      threadsList.innerHTML = "";

      const sortedThreads = window.threadsManager.threads
        .filter((thread) => thread.spaceName === space.name)
        .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
        .slice(0, 7);

      sortedThreads.forEach((thread) => {
        const threadItem = document.createElement("div");
        threadItem.className = "thread-item";
        threadItem.setAttribute("data-thread-id", thread.id);

        threadItem.innerHTML = `
          <div class="thread-info">
            <span class="thread-hash">
              <!-- prettier-ignore -->
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="#7D8FAA" stroke-dasharray="20" stroke-dashoffset="20" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M4 9h17"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="20;0"></animate></path><path d="M3 15h17"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="20;0"></animate></path><path d="M10 3l-2 18"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="20;0"></animate></path><path d="M16 3l-2 18"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.2s" values="20;0"></animate></path></g></svg>
            </span>
            <div class="thread-details">
              <span class="thread-name">${thread.name}</span>
              <span class="thread-space">${space.name}</span>
            </div>
          </div>
          <div class="thread-stats">
            <div class="thread-views">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7304 8.33088C14.2673 8.86785 15.1379 8.86785 15.6749 8.33088C16.2119 7.79391 16.2119 6.92331 15.6749 6.38633C15.1379 5.84936 14.2673 5.84936 13.7304 6.38633C13.1934 6.92331 13.1934 7.79391 13.7304 8.33088Z" fill="url(#paint0_linear_2256_203348)"></path><path d="M10.0031 12.0592L5.46582 16.5965M13.2443 13.6796L13.4241 15.6569C13.5133 16.6389 13.07 17.5933 12.2623 18.1588L10.3275 19.5132L10.1654 15.7861M8.38287 8.81821L6.40562 8.63843C5.92322 8.59458 5.43779 8.67892 4.99845 8.88292C4.55912 9.08692 4.18146 9.40335 3.90369 9.80019L2.54932 11.735L6.27637 11.8971M10.6513 6.54962C13.2441 3.95695 17.2952 2.49853 19.4018 2.66067C19.5638 4.76717 18.1054 8.81837 15.5127 11.4111C12.9199 14.0037 10.0031 15.9483 8.38265 16.5965L5.46582 13.6797C6.11402 12.0592 8.05861 9.14242 10.6513 6.54962Z" stroke="url(#paint1_linear_2256_203348)" stroke-width="1.375" stroke-linecap="round" stroke-linejoin="round"></path><defs><linearGradient id="paint0_linear_2256_203348" x1="13.1178" y1="6.99887" x2="16.1513" y2="7.85446" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"></stop><stop offset="1" stop-color="#FFAE00"></stop></linearGradient><linearGradient id="paint1_linear_2256_203348" x1="2.54932" y1="16.3932" x2="19.414" y2="6.94901" gradientUnits="userSpaceOnUse"><stop stop-color="#FF0000"></stop><stop offset="1" stop-color="#FFAE00"></stop></linearGradient></defs></svg>
              <span class="thread-views-count">x100k</span>
            </div>
            <span class="thread-unread-badge">10</span>
          </div>
        `;

        threadsList.appendChild(threadItem);

        // Add click event listener to thread item
        threadItem.addEventListener("click", () => {
          this.handleConnectedThreadClick(thread.id, space.id, space.name + " " + (space.emoji || ""));
        });
      });
    }

    // Space Members
    const membersList = asideSpaceContainer.querySelector(".aside-members-list");
    if (membersList) {
      membersList.innerHTML = "";

      // Generate random member count between 6 and 20
      const memberCount = Math.floor(Math.random() * (20 - 6 + 1)) + 6;

      // Generate fake members array based on random count with different roles
      const spaceMembers = Array.from({ length: memberCount }, (_, index) => {
        let role;
        let name;
        if (index === 0) {
          role = "curator";
          name = "You";
        } else if (index < 3) {
          role = "contributor";
          name = "Albert Flores";
        } else {
          role = "member";
          name = "Darlene Robertson";
        }

        return {
          id: `member_${index + 1}`,
          name: name,
          role: role,
        };
      });

      spaceMembers.splice(0, 7).forEach((member) => {
        const memberItem = document.createElement("div");
        memberItem.className = "aside-member-item";
        memberItem.setAttribute("data-member-id", member.id);

        memberItem.innerHTML = `
          <div class="aside-member-avatar">
            <img src="./icons/Avatar.svg" alt="${member.name}" />
          </div>
          <h4 class="aside-member-name">${member.name}</h4>

          <div class="aside-member-info">
            <p class="aside-member-role ${member.role}">${member.role.charAt(0).toUpperCase() + member.role.slice(1)}</p>
            <button class="member-options-btn" data-member-id="${member.id}" data-member-name="${member.name}" data-member-role="${member.role}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
            </button>
          </div>
        `;

        membersList.appendChild(memberItem);

        // Add event listener to the options button
        const optionsBtn = memberItem.querySelector(".member-options-btn");
        optionsBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.showMemberDropdown(e.target.closest("button"), member);
        });
      });
    }

    console.log(space);
  }

  // Highlight active space
  highlightSpace(spaceId) {
    const cards = document.querySelectorAll(".space-card");
    cards.forEach((card) => {
      if (card.dataset.spaceId === spaceId) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  // Handle add thread
  handleAddThread(spaceId) {
    const space = this.spaces.find((s) => s.id === spaceId);
    if (!space) {
      this.showNotification("Space not found", "error");
      return;
    }

    console.log(`Creating thread for space: ${space.name} (${space.id})`);

    // Open thread creation modal with pre-selected space
    if (window.createThreadModal) {
      console.log(`Opening thread modal with pre-selected space: ${space.name}`);
      window.createThreadModal.open(spaceId);
    } else {
      // Wait for modal to be available and try again
      console.log("Thread modal not ready, waiting...");
      setTimeout(() => {
        if (window.createThreadModal) {
          console.log(`Retrying - opening thread modal for space: ${space.name}`);
          window.createThreadModal.open(spaceId);
        } else {
          // Fallback: just increment count if modal is still not available
          console.warn("Thread modal still not available, using fallback");
          space.threadCount++;
          space.lastActivity = Date.now();
          this.saveToStorage();
          this.render();
          this.showNotification(`Thread added to ${space.name}`, "success");
        }
      }, 100);
    }
  }

  // Method to increment thread count (called by thread modal after creation)
  incrementThreadCount(spaceId) {
    const space = this.spaces.find((s) => s.id === spaceId);
    if (space) {
      space.threadCount++;
      space.lastActivity = Date.now();
      this.saveToStorage();
      this.render();
    }
  }

  // Get random color
  getRandomColor() {
    const colors = ["#8b5cf6", "#3b82f6", "#f59e0b", "#ec4899", "#10b981", "#ef4444"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Show notification
  showNotification(message, type = "info") {
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API methods
  addSpace(spaceData) {
    const newSpace = {
      id: this.generateId(),
      ...spaceData,
      lastActivity: Date.now(),
    };
    this.spaces.unshift(newSpace);
    this.saveToStorage();
    this.render();
    return newSpace;
  }

  removeSpace(spaceId) {
    this.spaces = this.spaces.filter((s) => s.id !== spaceId);
    this.saveToStorage();
    this.render();
  }

  updateSpace(spaceId, updates) {
    const space = this.spaces.find((s) => s.id === spaceId);
    if (space) {
      Object.assign(space, updates);
      this.saveToStorage();
      this.render();
    }
  }

  getSpace(spaceId) {
    return this.spaces.find((s) => s.id === spaceId);
  }

  getAllSpaces() {
    return [...this.spaces];
  }

  clearAllSpaces() {
    if (confirm("Are you sure you want to clear all spaces?")) {
      this.spaces = [];
      this.saveToStorage();
      this.render();
    }
  }

  // Show member dropdown menu
  showMemberDropdown(button, member) {
    // Hide any existing dropdowns
    this.hideMemberDropdown();

    // Get the template and clone it
    const template = document.getElementById("memberDropdownTemplate");
    if (!template) return;

    const dropdown = template.cloneNode(true);
    dropdown.id = "activeMemberDropdown";
    dropdown.classList.remove("member-dropdown-hidden");

    // Add to document first (required for Popper)
    document.body.appendChild(dropdown);

    // Use Popper.js for positioning
    if (typeof Popper !== "undefined") {
      this.popperInstance = Popper.createPopper(button, dropdown, {
        placement: "bottom-end",
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8],
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
              padding: 8,
            },
          },
          {
            name: "flip",
            options: {
              fallbackPlacements: ["top-end", "bottom-start", "top-start"],
            },
          },
        ],
      });
    } else {
      // Fallback positioning if Popper is not available
      const buttonRect = button.getBoundingClientRect();
      dropdown.style.position = "fixed";
      dropdown.style.top = `${buttonRect.bottom + 8}px`;
      dropdown.style.left = `${buttonRect.left - 150}px`;
      dropdown.style.zIndex = "1000";
    }

    // Add event listeners to dropdown items
    const viewProfileBtn = dropdown.querySelector('[data-action="view-profile"]');
    const messageBtn = dropdown.querySelector('[data-action="message"]');
    const setContributorBtn = dropdown.querySelector('[data-action="set-contributor"]');
    const kickOutBtn = dropdown.querySelector('[data-action="kick-out"]');

    viewProfileBtn?.addEventListener("click", () => {
      this.handleViewProfile(member);
      this.hideMemberDropdown();
    });

    messageBtn?.addEventListener("click", () => {
      this.handleMessage(member);
      this.hideMemberDropdown();
    });

    setContributorBtn?.addEventListener("click", () => {
      this.handleSetContributor(member);
      this.hideMemberDropdown();
    });

    kickOutBtn?.addEventListener("click", () => {
      this.handleKickOut(member);
      this.hideMemberDropdown();
    });

    // Hide dropdown options based on member role
    if (member.role === "curator") {
      // Curators can't be kicked out or promoted
      setContributorBtn?.style.setProperty("display", "none");
      kickOutBtn?.style.setProperty("display", "none");
    } else if (member.role === "contributor") {
      // Contributors can't be promoted to contributor (already are)
      setContributorBtn?.style.setProperty("display", "none");
    }

    // Trigger animation after positioning
    requestAnimationFrame(() => {
      dropdown.classList.add("show");
    });

    // Add click outside listener
    setTimeout(() => {
      document.addEventListener("click", this.handleClickOutside.bind(this));
    }, 0);
  }

  // Hide member dropdown
  hideMemberDropdown() {
    const activeDropdown = document.getElementById("activeMemberDropdown");
    if (activeDropdown) {
      // Animate out
      activeDropdown.classList.remove("show");

      // Remove after animation completes
      setTimeout(() => {
        if (activeDropdown.parentNode) {
          activeDropdown.remove();
        }
      }, 150); // Match the CSS transition duration

      document.removeEventListener("click", this.handleClickOutside.bind(this));
    }

    // Destroy Popper instance if it exists
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  // Handle click outside dropdown
  handleClickOutside(event) {
    const dropdown = document.getElementById("activeMemberDropdown");
    if (dropdown && !dropdown.contains(event.target)) {
      this.hideMemberDropdown();
    }
  }

  // Handle dropdown actions
  handleViewProfile(member) {
    console.log("View profile for:", member);
    // Implement view profile functionality
  }

  handleMessage(member) {
    console.log("Message member:", member);
    window.location.href = "/chat.html";
  }

  handleSetContributor(member) {
    console.log("Set as contributor:", member);
    // Implement role change functionality
  }

  handleKickOut(member) {
    console.log("Kick out member:", member);
    // Implement kick out functionality - could open the kick member modal
    if (window.kickMemberModal) {
      window.kickMemberModal.open(member);
    }
  }

  // Show delete space modal
  showDeleteSpaceModal() {
    const overlay = document.getElementById("deleteSpaceOverlay");
    if (overlay) {
      // Remove hidden class first
      overlay.classList.remove("kick-member-hidden");

      // Add visible class after a short delay for animation
      setTimeout(() => {
        overlay.classList.add("visible");
      }, 10);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Setup modal event listeners
      this.setupDeleteSpaceModalListeners();
    }
  }

  // Show leave space modal
  showLeaveSpaceModal() {
    const overlay = document.getElementById("leaveSpaceOverlay");
    if (overlay) {
      // Remove hidden class first
      overlay.classList.remove("kick-member-hidden");

      // Add visible class after a short delay for animation
      setTimeout(() => {
        overlay.classList.add("visible");
      }, 10);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Setup modal event listeners
      this.setupLeaveSpaceModalListeners();
    }
  }

  // Show close space modal
  showCloseSpaceModal() {
    const overlay = document.getElementById("closeSpaceOverlay");
    if (overlay) {
      // Remove hidden class first
      overlay.classList.remove("kick-member-hidden");

      // Add visible class after a short delay for animation
      setTimeout(() => {
        overlay.classList.add("visible");
      }, 10);

      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Setup modal event listeners
      this.setupCloseSpaceModalListeners();
    }
  }

  // Setup delete space modal listeners
  setupDeleteSpaceModalListeners() {
    const overlay = document.getElementById("deleteSpaceOverlay");
    const cancelBtn = document.getElementById("deleteSpaceCancel");
    const confirmBtn = document.getElementById("deleteSpaceConfirm");

    // Remove existing listeners to prevent duplicates
    const newCancelBtn = cancelBtn?.cloneNode(true);
    const newConfirmBtn = confirmBtn?.cloneNode(true);

    if (cancelBtn && newCancelBtn) {
      cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn);
      newCancelBtn.addEventListener("click", () => this.hideDeleteSpaceModal());
    }

    if (confirmBtn && newConfirmBtn) {
      confirmBtn.parentNode?.replaceChild(newConfirmBtn, confirmBtn);
      newConfirmBtn.addEventListener("click", () => this.handleDeleteSpace());
    }

    // Close on overlay click
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.hideDeleteSpaceModal();
      }
    });
  }

  // Setup leave space modal listeners
  setupLeaveSpaceModalListeners() {
    const overlay = document.getElementById("leaveSpaceOverlay");
    const cancelBtn = document.getElementById("kickDeleteCancel");
    const confirmBtn = document.getElementById("leaveSpaceConfirm");

    // Remove existing listeners to prevent duplicates
    const newCancelBtn = cancelBtn?.cloneNode(true);
    const newConfirmBtn = confirmBtn?.cloneNode(true);

    if (cancelBtn && newCancelBtn) {
      cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn);
      newCancelBtn.addEventListener("click", () => this.hideLeaveSpaceModal());
    }

    if (confirmBtn && newConfirmBtn) {
      confirmBtn.parentNode?.replaceChild(newConfirmBtn, confirmBtn);
      newConfirmBtn.addEventListener("click", () => this.handleLeaveSpace());
    }

    // Close on overlay click
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.hideLeaveSpaceModal();
      }
    });
  }

  // Setup close space modal listeners
  setupCloseSpaceModalListeners() {
    const overlay = document.getElementById("closeSpaceOverlay");
    const cancelBtn = overlay?.querySelector("#kickDeleteCancel");
    const confirmBtn = overlay?.querySelector("#leaveSpaceConfirm");

    // Remove existing listeners to prevent duplicates
    const newCancelBtn = cancelBtn?.cloneNode(true);
    const newConfirmBtn = confirmBtn?.cloneNode(true);

    if (cancelBtn && newCancelBtn) {
      cancelBtn.parentNode?.replaceChild(newCancelBtn, cancelBtn);
      newCancelBtn.addEventListener("click", () => this.hideCloseSpaceModal());
    }

    if (confirmBtn && newConfirmBtn) {
      confirmBtn.parentNode?.replaceChild(newConfirmBtn, confirmBtn);
      newConfirmBtn.addEventListener("click", () => this.handleCloseSpace());
    }

    // Close on overlay click
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.hideCloseSpaceModal();
      }
    });
  }

  // Hide modals
  hideDeleteSpaceModal() {
    const overlay = document.getElementById("deleteSpaceOverlay");
    if (overlay) {
      // Remove visible class first for animation
      overlay.classList.remove("visible");

      // Add hidden class after animation completes
      setTimeout(() => {
        overlay.classList.add("kick-member-hidden");
        document.body.style.overflow = "";
      }, 300);
    }
  }

  hideLeaveSpaceModal() {
    const overlay = document.getElementById("leaveSpaceOverlay");
    if (overlay) {
      // Remove visible class first for animation
      overlay.classList.remove("visible");

      // Add hidden class after animation completes
      setTimeout(() => {
        overlay.classList.add("kick-member-hidden");
        document.body.style.overflow = "";
      }, 300);
    }
  }

  hideCloseSpaceModal() {
    const overlay = document.getElementById("closeSpaceOverlay");
    if (overlay) {
      // Remove visible class first for animation
      overlay.classList.remove("visible");

      // Add hidden class after animation completes
      setTimeout(() => {
        overlay.classList.add("kick-member-hidden");
        document.body.style.overflow = "";
      }, 300);
    }
  }

  // Handle modal actions
  handleDeleteSpace() {
    console.log("Delete space confirmed");
    // Implement delete space logic here
    this.hideDeleteSpaceModal();

    // Show success message
    if (typeof flashMessage === "function") {
      flashMessage("Space deleted successfully", "success");
    }
  }

  handleLeaveSpace() {
    // Implement leave space logic here
    this.hideLeaveSpaceModal();

    // Show success message
    if (typeof flashMessage === "function") {
      flashMessage("Left space successfully", "success");
    }
  }

  handleCloseSpace() {
    // Hide the thread input and show closed message
    this.setSpaceClosedState(true);

    // Update the close button to show "Open Space"
    this.updateCloseSpaceButton(true);

    this.hideCloseSpaceModal();

    // Show success message
    if (typeof flashMessage === "function") {
      flashMessage("Space closed successfully", "success");
    }
  }

  // Set space closed state
  setSpaceClosedState(isClosed) {
    const threadInput = document.querySelector(".thread-chat-input");
    const threadContainer = document.querySelector(".thread-chat-container");

    if (isClosed) {
      // Hide thread input
      if (threadInput) {
        threadInput.style.display = "none";
      }

      // Show closed message
      this.showSpaceClosedMessage();
    } else {
      // Show thread input
      if (threadInput) {
        threadInput.style.display = "flex";
      }

      // Hide closed message
      this.hideSpaceClosedMessage();
    }
  }

  // Show space closed message
  showSpaceClosedMessage() {
    // Remove existing message if any
    this.hideSpaceClosedMessage();

    const threadContainer = document.querySelector(".thread-chat-container");
    if (threadContainer) {
      const closedMessage = document.createElement("div");
      closedMessage.className = "space-closed-message";
      closedMessage.id = "spaceClosedMessage";
      closedMessage.innerHTML = `
        <div class="space-closed-content">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.364 5.63604C19.9926 7.26472 21 9.51472 21 12C21 16.9706 16.9706 21 12 21C9.51472 21 7.26472 19.9926 5.63604 18.364M18.364 5.63604C16.7353 4.00736 14.4853 3 12 3C7.02944 3 3 7.02944 3 12C3 14.4853 4.00736 16.7353 5.63604 18.364M18.364 5.63604L5.63604 18.364" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>This thread is closed</span>
        </div>
      `;

      threadContainer.appendChild(closedMessage);
    }
  }

  // Hide space closed message
  hideSpaceClosedMessage() {
    const existingMessage = document.getElementById("spaceClosedMessage");
    if (existingMessage) {
      existingMessage.remove();
    }
  }

  // Update close space button
  updateCloseSpaceButton(isClosed) {
    const closeSpaceBtn = document.getElementById("closeSpaceBtn");
    if (closeSpaceBtn) {
      const span = closeSpaceBtn.querySelector("span");
      const existingSvg = closeSpaceBtn.querySelector("svg");

      if (isClosed) {
        // Change to "Open Space"
        if (span) span.textContent = "Open Space";
        closeSpaceBtn.classList.remove("aside-action-item--danger");
        closeSpaceBtn.classList.add("aside-action-item--success");

        // Replace with open icon
        if (existingSvg) {
          existingSvg.innerHTML = `<path d="M2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C11.5858 21.25 11.25 21.5858 11.25 22C11.25 22.4142 11.5858 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 12.4142 1.58579 12.75 2 12.75C2.41421 12.75 2.75 12.4142 2.75 12Z" fill="#01C749"/><path d="M5 12.25C4.58579 12.25 4.25 12.5858 4.25 13C4.25 13.4142 4.58579 13.75 5 13.75H9.18934L2.46967 20.4697C2.17678 20.7626 2.17678 21.2374 2.46967 21.5303C2.76256 21.8232 3.23744 21.8232 3.53033 21.5303L10.25 14.8107V19C10.25 19.4142 10.5858 19.75 11 19.75C11.4142 19.75 11.75 19.4142 11.75 19V13C11.75 12.5858 11.4142 12.25 11 12.25H5Z" fill="#01C749"/>`;
          existingSvg.setAttribute("width", "24");
          existingSvg.setAttribute("height", "24");
          existingSvg.setAttribute("viewBox", "0 0 24 24");
        }

        // Update click handler to open space
        closeSpaceBtn.onclick = () => this.handleOpenSpace();
      } else {
        // Change back to "Close Space"
        if (span) span.textContent = "Close Space";
        closeSpaceBtn.classList.remove("aside-action-item--success");
        closeSpaceBtn.classList.add("aside-action-item--danger");

        // Replace with close icon
        if (existingSvg) {
          existingSvg.innerHTML = `<path d="M16.364 3.63604C17.9926 5.26472 19 7.51472 19 10C19 14.9706 14.9706 19 10 19C7.51472 19 5.26472 17.9926 3.63604 16.364M16.364 3.63604C14.7353 2.00736 12.4853 1 10 1C5.02944 1 1 5.02944 1 10C1 12.4853 2.00736 14.7353 3.63604 16.364M16.364 3.63604L3.63604 16.364" stroke="#F04438" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
          existingSvg.setAttribute("width", "20");
          existingSvg.setAttribute("height", "20");
          existingSvg.setAttribute("viewBox", "0 0 20 20");
        }

        // Update click handler back to close space
        closeSpaceBtn.onclick = () => this.showCloseSpaceModal();
      }
    }
  }

  // Handle opening space
  handleOpenSpace() {
    console.log("Opening space");

    // Show the thread input and hide closed message
    this.setSpaceClosedState(false);

    // Update the button back to "Close Space"
    this.updateCloseSpaceButton(false);

    // Show success message
    if (typeof flashMessage === "function") {
      flashMessage("Space opened successfully", "success");
    }
  }

  // Show thread warning modal for first-time space access
  showThreadWarningModal(spaceName, spaceId, threadId = null) {
    const overlay = document.getElementById("threadWarningModal");
    const spaceNameEl = document.getElementById("warningSpaceName");
    const spaceNameBtnEl = document.getElementById("warningSpaceNameBtn");

    if (overlay && spaceNameEl && spaceNameBtnEl) {
      // Update space name in modal
      spaceNameEl.textContent = spaceName;
      spaceNameBtnEl.textContent = spaceName;

      // Show modal with animation
      overlay.style.display = "flex";
      // Prevent body scroll
      document.body.style.overflow = "hidden";

      // Setup event listeners
      this.setupThreadWarningListeners(spaceId, threadId);
    }
  }

  // Setup thread warning modal listeners
  setupThreadWarningListeners(spaceId, threadId = null) {
    const overlay = document.getElementById("threadWarningModal");
    const joinBtn = document.getElementById("threadWarningJoin");

    // Remove existing listeners
    const newJoinBtn = joinBtn?.cloneNode(true);

    if (joinBtn && newJoinBtn) {
      joinBtn.parentNode?.replaceChild(newJoinBtn, joinBtn);
      newJoinBtn.addEventListener("click", () => this.handleJoinSpace(spaceId, threadId));
    }

    // Close on overlay click
    overlay?.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.hideThreadWarningModal();
      }
    });
  }

  // Hide thread warning modal
  hideThreadWarningModal() {
    const overlay = document.getElementById("threadWarningModal");
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  // Handle joining space after warning
  handleJoinSpace(spaceId, threadId = null) {
    // Mark space as visited to prevent showing warning again
    this.markSpaceAsVisited(spaceId);

    // Hide warning modal
    this.hideThreadWarningModal();

    // Show success message
    if (typeof flashMessage === "function") {
      flashMessage("Successfully joined the space!", "success");
    }
  }

  // Mark space as visited
  markSpaceAsVisited(spaceId) {
    try {
      const visitedSpaces = JSON.parse(localStorage.getItem("visitedSpaces") || "[]");
      if (!visitedSpaces.includes(spaceId)) {
        visitedSpaces.push(spaceId);
        localStorage.setItem("visitedSpaces", JSON.stringify(visitedSpaces));
      }
    } catch (error) {
      console.error("Error marking space as visited:", error);
    }
  }

  // Check if space has been visited before
  hasVisitedSpace(spaceId) {
    try {
      const visitedSpaces = JSON.parse(localStorage.getItem("visitedSpaces") || "[]");
      return visitedSpaces.includes(spaceId);
    } catch (error) {
      console.error("Error checking visited spaces:", error);
      return false;
    }
  }

  // Proceed to space after warning acceptance
  proceedToSpace(spaceId) {
    // Proceed with normal space opening logic
    this.proceedToSpaceDirectly(spaceId);
  }

  // Handle connected thread click from space sidebar
  handleConnectedThreadClick(threadId, spaceId, spaceName) {
    // If threadId is provided, open the specific thread
    if (threadId && window.threadsManager) {
      window.threadsManager.proceedToThreadDirectly(threadId);
    } else {
      // Otherwise, just proceed to space
      this.proceedToSpace(spaceId);
    }

    // Check if this is the first time opening a thread from this space
    if (!this.hasVisitedSpace(spaceId)) {
      // Show warning modal for first-time thread access
      this.showThreadWarningModal(spaceName, spaceId, threadId);
      return;
    }
  }
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.spacesManager = new SpacesManager();
    setupGlobalEventListeners();
  });
} else {
  window.spacesManager = new SpacesManager();
  setupGlobalEventListeners();
}

// Setup global event listeners
function setupGlobalEventListeners() {
  // Back button
  const backBtn = document.querySelector(".live-chat-back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      window.location.href = "/chat.html";
    });
  }

  // Global thread creation buttons
  const threadCreateButtons = document.querySelectorAll('[data-action="create-thread"]');
  threadCreateButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.createThreadModal) {
        window.createThreadModal.open();
      }
    });
  });

  // Listen for custom events from thread creation
  document.addEventListener("threadCreated", (event) => {
    const threadData = event.detail;

    // Update the space's thread count and last activity
    if (window.spacesManager && threadData.spaceId) {
      window.spacesManager.incrementThreadCount(threadData.spaceId);
    }
  });
}
