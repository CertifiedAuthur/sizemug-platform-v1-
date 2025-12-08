/**
 * Member Dropdown Menu System
 * Handles dropdown menus for aside member items
 */

class MemberDropdownManager {
  constructor() {
    this.activeDropdown = null;
    this.activeButton = null;

    this.init();
  }

  init() {
    this.setupGlobalListeners();
    this.enhanceExistingMembers();
  }

  setupGlobalListeners() {
    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".member-options-btn") && !e.target.closest(".member-dropdown")) {
        this.closeActiveDropdown();
      }
    });

    // Handle dropdown button clicks
    document.addEventListener("click", (e) => {
      const optionsBtn = e.target.closest(".member-options-btn");
      if (optionsBtn) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown(optionsBtn);
      }
    });

    // Handle dropdown item clicks
    document.addEventListener("click", (e) => {
      const dropdownItem = e.target.closest(".member-dropdown-item");
      if (dropdownItem) {
        e.preventDefault();
        this.handleDropdownAction(dropdownItem);
      }
    });

    // Close on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeDropdown) {
        this.closeActiveDropdown();
      }
    });
  }

  enhanceExistingMembers() {
    // Find existing member items and enhance them
    const memberItems = document.querySelectorAll(".aside-member-item");
    memberItems.forEach((item) => {
      this.enhanceMemberItem(item);
    });
  }

  enhanceMemberItem(memberItem) {
    // Check if already enhanced
    if (memberItem.querySelector(".member-options-btn")) {
      return;
    }

    // Get member data
    const memberData = this.extractMemberData(memberItem);

    // Add options button
    const optionsBtn = this.createOptionsButton(memberData);
    memberItem.appendChild(optionsBtn);

    // Add dropdown menu
    const dropdown = this.createDropdownMenu(memberData);
    memberItem.appendChild(dropdown);
  }

  extractMemberData(memberItem) {
    const nameEl = memberItem.querySelector(".member-name, h4, .name");
    const roleEl = memberItem.querySelector(".member-role, .role");
    const avatarEl = memberItem.querySelector(".member-avatar img, img");

    return {
      id: memberItem.dataset.memberId || `member_${Date.now()}`,
      name: nameEl?.textContent?.trim() || "Unknown Member",
      role: roleEl?.textContent?.trim() || "Member",
      avatar: avatarEl?.src || null,
      element: memberItem,
    };
  }

  createOptionsButton(memberData) {
    const button = document.createElement("button");
    button.className = "member-options-btn";
    button.dataset.memberId = memberData.id;
    button.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
        <circle cx="12" cy="5" r="1" fill="currentColor"/>
        <circle cx="12" cy="19" r="1" fill="currentColor"/>
      </svg>
    `;
    return button;
  }

  createDropdownMenu(memberData) {
    const template = document.getElementById("memberDropdownTemplate");
    if (!template) {
      console.error("Member dropdown template not found");
      return this.createFallbackDropdown(memberData);
    }

    const dropdown = template.cloneNode(true);
    dropdown.id = `memberDropdown_${memberData.id}`;
    dropdown.dataset.memberId = memberData.id;

    // Hide/show items based on member role and permissions
    this.configureDropdownItems(dropdown, memberData);

    return dropdown;
  }

  createFallbackDropdown(memberData) {
    const dropdown = document.createElement("div");
    dropdown.className = "member-dropdown member-dropdown-hidden";
    dropdown.dataset.memberId = memberData.id;

    const items = this.getDropdownItems(memberData);
    dropdown.innerHTML = items.map((item) => this.createDropdownItemHTML(item)).join("");

    return dropdown;
  }

  configureDropdownItems(dropdown, memberData) {
    const setContributorBtn = dropdown.querySelector('[data-action="set-contributor"]');
    const kickOutBtn = dropdown.querySelector('[data-action="kick-out"]');

    // Hide "Set as Contributor" and "Kick Out" for curators and self
    if (memberData.role.toLowerCase() === "curator" || memberData.name === "You") {
      if (setContributorBtn) setContributorBtn.style.display = "none";
      if (kickOutBtn) kickOutBtn.style.display = "none";
    }

    // Hide "Set as Contributor" if already a contributor
    if (memberData.role.toLowerCase() === "contributor") {
      if (setContributorBtn) setContributorBtn.style.display = "none";
    }
  }

  getDropdownItems(memberData) {
    const items = [
      {
        id: "view-profile",
        label: "View Profile",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        className: "view-profile",
      },
      {
        id: "message",
        label: "Message",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        className: "message",
      },
    ];

    // Add role-specific items
    if (memberData.role.toLowerCase() !== "curator" && memberData.name !== "You") {
      items.push({
        id: "set-contributor",
        label: "Set as Contributor",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 11l-3-3M19 11l3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        className: "set-contributor",
      });
    }

    // Add kick option for non-curators and not self
    if (memberData.role.toLowerCase() !== "curator" && memberData.name !== "You") {
      items.push({
        id: "kick-out",
        label: "Kick Out",
        icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 11l-5-5M17 11l5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        className: "kick-out",
      });
    }

    return items;
  }

  createDropdownItemHTML(item) {
    return `
      <button class="member-dropdown-item ${item.className}" data-action="${item.id}">
        <span class="member-dropdown-icon">${item.icon}</span>
        ${item.label}
      </button>
    `;
  }

  toggleDropdown(optionsBtn) {
    const memberId = optionsBtn.dataset.memberId;
    const memberItem = optionsBtn.closest(".aside-member-item");
    const dropdown = memberItem.querySelector(".member-dropdown");

    // Close any other active dropdown
    if (this.activeDropdown && this.activeDropdown !== dropdown) {
      this.closeActiveDropdown();
    }

    if (dropdown.classList.contains("member-dropdown-hidden")) {
      this.openDropdown(dropdown, optionsBtn);
    } else {
      this.closeDropdown(dropdown, optionsBtn);
    }
  }

  openDropdown(dropdown, optionsBtn) {
    dropdown.classList.remove("member-dropdown-hidden");

    setTimeout(() => {
      dropdown.classList.add("visible");
      optionsBtn.classList.add("active");
    }, 10);

    this.activeDropdown = dropdown;
    this.activeButton = optionsBtn;
  }

  closeDropdown(dropdown, optionsBtn) {
    dropdown.classList.remove("visible");
    optionsBtn.classList.remove("active");

    setTimeout(() => {
      dropdown.classList.add("member-dropdown-hidden");
    }, 200);

    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
      this.activeButton = null;
    }
  }

  closeActiveDropdown() {
    if (this.activeDropdown && this.activeButton) {
      this.closeDropdown(this.activeDropdown, this.activeButton);
    }
  }

  handleDropdownAction(dropdownItem) {
    const action = dropdownItem.dataset.action;
    const memberItem = dropdownItem.closest(".aside-member-item");
    const memberData = this.extractMemberData(memberItem);

    console.log(`Action: ${action} for member:`, memberData);

    switch (action) {
      case "view-profile":
        this.handleViewProfile(memberData);
        break;
      case "message":
        this.handleMessage(memberData);
        break;
      case "set-contributor":
        this.handleSetContributor(memberData);
        break;
      case "kick-out":
        this.handleKickOut(memberData);
        break;
    }

    // Close dropdown after action
    this.closeActiveDropdown();
  }

  handleViewProfile(memberData) {
    console.log("Viewing profile for:", memberData.name);
    // Implement profile view logic
    this.showNotification(`Opening ${memberData.name}'s profile`, "info");
  }

  handleMessage(memberData) {
    console.log("Messaging:", memberData.name);
    // Implement messaging logic
    this.showNotification(`Opening chat with ${memberData.name}`, "info");
  }

  handleSetContributor(memberData) {
    console.log("Setting as contributor:", memberData.name);
    // Implement role change logic
    this.showNotification(`${memberData.name} has been set as Contributor`, "success");

    // Update role in UI
    const roleEl = memberData.element.querySelector(".member-role, .role");
    if (roleEl) {
      roleEl.textContent = "Contributor";
      roleEl.className = "member-role contributor";
    }
  }

  handleKickOut(memberData) {
    console.log("Kicking out:", memberData.name);

    // Open kick member modal if available
    if (window.kickMemberModal) {
      window.kickMemberModal.openModal({
        memberId: memberData.id,
        memberName: memberData.name,
        memberAvatar: memberData.avatar,
        spaceId: "current-space", // You might want to get this dynamically
        spaceName: "Current Space", // You might want to get this dynamically
      });
    } else {
      this.showNotification(`Removing ${memberData.name} from space`, "warning");
    }
  }

  showNotification(message, type = "info") {
    // Use existing notification system if available
    if (typeof flashMessage === "function") {
      flashMessage(message, type);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }

  // Public API methods
  addMemberItem(memberElement) {
    this.enhanceMemberItem(memberElement);
  }

  refreshDropdowns() {
    this.enhanceExistingMembers();
  }

  closeAllDropdowns() {
    this.closeActiveDropdown();
  }
}

// Initialize the dropdown manager
let memberDropdownManager;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    memberDropdownManager = new MemberDropdownManager();
    window.memberDropdownManager = memberDropdownManager;
  });
} else {
  memberDropdownManager = new MemberDropdownManager();
  window.memberDropdownManager = memberDropdownManager;
}

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = MemberDropdownManager;
}
