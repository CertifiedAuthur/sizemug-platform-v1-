/**
 * Watch with Friends Modal Handler
 */
class WatchWithFriendsModal {
  constructor() {
    this.initiateModal = document.querySelector(".initiate_watch_with_friend");
    this.friendsModal = document.querySelector(".select_friends_to_watch_with");
    this.continueBtn = this.initiateModal?.querySelector("button");
    this.closeBtn = document.querySelector(".close_watch_modal");
    this.searchInput = document.querySelector(".friends_search_input input");
    this.friendItems = document.querySelectorAll(".friend_item");
    this.triggerBtns = document.querySelectorAll(".initiateWatchWithFriendBtn");
    this.activeWatchingContainer = document.querySelector(".active_watching_people");
    this.watchingNames = document.querySelector(".watching_names");
    this.watchingAvatars = document.querySelector(".watching_avatars");
    this.currentlyWatchingModal = document.querySelector(".currently_watching_modal");
    this.closeWatchingModalBtn = document.querySelector(".close_watching_modal");
    this.watchingPeopleList = document.getElementById("watchingPeopleList");
    this.addMorePeopleBtn = document.querySelector(".add_more_people_btn");
    this.leaveWatchBtn = document.getElementById("leaveWatchTogetherBtn");

    this.invitedFriends = new Set();
    this.watchingUsers = new Map(); // Store user data with avatars

    this.init();
  }

  init() {
    this.bindEvents();
    this.updateWatchingDisplay();
    this.updateButtonBadges();
  }

  bindEvents() {
    // Trigger buttons to show initiate modal
    this.triggerBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showInitiateModal();
      });
    });

    // Continue button to show friends selection
    if (this.continueBtn) {
      this.continueBtn.addEventListener("click", () => {
        this.showFriendsModal();
      });
    }

    // Close modal
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => {
        this.closeFriendsModal();
      });
    }

    // Close initiate modal on overlay click
    if (this.initiateModal) {
      this.initiateModal.addEventListener("click", (e) => {
        if (e.target === this.initiateModal) {
          this.hideInitiateModal();
        }
      });
    }

    // Close friends modal on overlay click
    if (this.friendsModal) {
      this.friendsModal.addEventListener("click", (e) => {
        if (e.target === this.friendsModal) {
          this.closeFriendsModal();
        }
      });
    }

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => {
        this.filterFriends(e.target.value);
      });
    }

    // Invite button handlers
    this.friendItems.forEach((item) => {
      const inviteBtn = item.querySelector(".invite_btn");
      const friendName = item.querySelector(".friend_name").textContent;

      if (inviteBtn) {
        inviteBtn.addEventListener("click", () => {
          this.toggleInvite(friendName, inviteBtn);
        });
      }
    });

    // Active watching people click to show modal
    if (this.activeWatchingContainer) {
      this.activeWatchingContainer.addEventListener("click", () => {
        this.showCurrentlyWatchingModal();
      });
    }

    // Close currently watching modal
    if (this.closeWatchingModalBtn) {
      this.closeWatchingModalBtn.addEventListener("click", () => {
        this.closeCurrentlyWatchingModal();
      });
    }

    // Close on overlay click
    if (this.currentlyWatchingModal) {
      this.currentlyWatchingModal.addEventListener("click", (e) => {
        if (e.target === this.currentlyWatchingModal) {
          this.closeCurrentlyWatchingModal();
        }
      });
    }

    // Add more people button
    if (this.addMorePeopleBtn) {
      this.addMorePeopleBtn.addEventListener("click", () => {
        this.closeCurrentlyWatchingModal();
        this.showFriendsModal();
      });
    }

    // Leave watch together button
    if (this.leaveWatchBtn) {
      this.leaveWatchBtn.addEventListener("click", () => {
        this.leaveWatchTogether();
      });
    }

    // ESC key to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.currentlyWatchingModal?.classList.contains("active")) {
          this.closeCurrentlyWatchingModal();
        } else if (this.friendsModal?.classList.contains("active")) {
          this.closeFriendsModal();
        } else if (this.initiateModal?.classList.contains("active")) {
          this.hideInitiateModal();
        }
      }
    });
  }

  showInitiateModal() {
    if (this.initiateModal) {
      this.initiateModal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  hideInitiateModal() {
    if (this.initiateModal) {
      this.initiateModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  showFriendsModal() {
    if (this.initiateModal) {
      this.initiateModal.classList.remove("active");
    }

    if (this.friendsModal) {
      this.friendsModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus on search input
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.focus();
        }
      }, 300);
    }
  }

  closeFriendsModal() {
    if (this.friendsModal) {
      this.friendsModal.classList.remove("active");
    }
  }

  toggleInvite(friendName, button) {
    if (this.invitedFriends.has(friendName)) {
      // Remove invite
      this.invitedFriends.delete(friendName);
      this.watchingUsers.delete(friendName);
      button.innerHTML = "Invite";
      button.classList.remove("invited");

      // Update display
      this.updateWatchingDisplay();
      this.updateButtonBadges();
    } else {
      // Start loading state
      this.setButtonLoading(button);

      // Simulate API call delay
      setTimeout(() => {
        // Add invite
        this.invitedFriends.add(friendName);

        // Get user avatar from the friend item
        const friendItem = button.closest(".friend_item");
        const avatarImg = friendItem?.querySelector(".friend_avatar img");
        const avatarSrc = avatarImg?.src || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face";

        // Store user data
        this.watchingUsers.set(friendName, {
          name: friendName,
          avatar: avatarSrc,
        });

        button.innerHTML = "Invited";
        button.classList.remove("waiting");
        button.classList.add("invited");

        // Update display
        this.updateWatchingDisplay();
        this.updateButtonBadges();

        // Show success feedback
        this.showInviteSuccess(friendName);
      }, 2000); // 2 second delay to simulate API call
    }
  }

  setButtonLoading(button) {
    button.classList.add("waiting");
    button.innerHTML = `
      <div class="invite_spinner"></div>
      <span>Waiting</span>
    `;
  }

  showInviteSuccess(friendName) {
    // Create a temporary success message
    const successMsg = document.createElement("div");
    successMsg.className = "invite-success-toast";
    successMsg.textContent = `Invited ${friendName} to watch!`;
    successMsg.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      z-index: 50000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(successMsg);

    // Remove after 3 seconds
    setTimeout(() => {
      successMsg.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        if (successMsg.parentNode) {
          successMsg.parentNode.removeChild(successMsg);
        }
      }, 300);
    }, 3000);
  }

  filterFriends(searchTerm) {
    const term = searchTerm.toLowerCase().trim();

    this.friendItems.forEach((item) => {
      const friendName = item.querySelector(".friend_name").textContent.toLowerCase();

      if (friendName.includes(term)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  getInvitedFriends() {
    return Array.from(this.invitedFriends);
  }

  updateWatchingDisplay() {
    const count = this.invitedFriends.size;

    if (count === 0) {
      // Hide the watching display
      if (this.activeWatchingContainer) {
        this.activeWatchingContainer.classList.remove("active");
      }
      return;
    }

    // Show and update the watching display
    if (this.activeWatchingContainer) {
      this.activeWatchingContainer.classList.add("active");
    }

    // Update avatars (show up to 3)
    if (this.watchingAvatars) {
      const users = Array.from(this.watchingUsers.values());
      this.watchingAvatars.innerHTML = users
        .slice(0, 3)
        .map((user) => `<img src="${user.avatar}" alt="${user.name}" class="watching_avatar" />`)
        .join("");
    }

    // Update names text
    if (this.watchingNames) {
      const users = Array.from(this.watchingUsers.values());
      if (users.length === 1) {
        this.watchingNames.textContent = users[0].name;
      } else if (users.length === 2) {
        this.watchingNames.textContent = `${users[0].name} and ${users[1].name}`;
      } else {
        const othersCount = users.length - 1;
        this.watchingNames.textContent = `${users[0].name} and ${othersCount} other${othersCount > 1 ? "s" : ""}`;
      }
    }
  }

  updateButtonBadges() {
    const count = this.invitedFriends.size;

    this.triggerBtns.forEach((btn) => {
      // Remove existing badge
      const existingBadge = btn.querySelector(".watch_counter_badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      // Add new badge if there are invited friends
      if (count > 0) {
        const badge = document.createElement("span");
        badge.className = "watch_counter_badge";
        badge.textContent = count;
        btn.appendChild(badge);
      }
    });
  }

  clearInvites() {
    this.invitedFriends.clear();
    this.watchingUsers.clear();

    // Reset all invite buttons
    this.friendItems.forEach((item) => {
      const inviteBtn = item.querySelector(".invite_btn");
      if (inviteBtn) {
        inviteBtn.innerHTML = "Invite";
        inviteBtn.classList.remove("invited", "waiting");
      }
    });

    // Update displays
    this.updateWatchingDisplay();
    this.updateButtonBadges();
  }

  showCurrentlyWatchingModal() {
    if (this.currentlyWatchingModal) {
      this.currentlyWatchingModal.classList.add("active");
      document.body.style.overflow = "hidden";
      this.renderWatchingPeopleList();
    }
  }

  closeCurrentlyWatchingModal() {
    if (this.currentlyWatchingModal) {
      this.currentlyWatchingModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  renderWatchingPeopleList() {
    if (!this.watchingPeopleList) return;

    const users = Array.from(this.watchingUsers.values());

    this.watchingPeopleList.innerHTML = users
      .map((user, index) => {
        const isHost = index === 0; // First user is the host
        return `
          <div class="watching_person_item">
            <div class="watching_person_avatar">
              <img src="${user.avatar}" alt="${user.name}" />
            </div>
            <div class="watching_person_info">
              <div class="watching_person_name">${user.name}</div>
            </div>
            ${isHost ? '<span class="host_badge">Host</span>' : '<button class="kick_btn" data-user="' + user.name + '">Kick</button>'}
          </div>
        `;
      })
      .join("");

    // Bind kick button events
    this.watchingPeopleList.querySelectorAll(".kick_btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const userName = btn.dataset.user;
        this.kickUser(userName);
      });
    });
  }

  kickUser(userName) {
    // Remove user from watching
    this.invitedFriends.delete(userName);
    this.watchingUsers.delete(userName);

    // Update all displays
    this.updateWatchingDisplay();
    this.updateButtonBadges();
    this.renderWatchingPeopleList();

    // Reset the invite button for this user
    this.friendItems.forEach((item) => {
      const friendName = item.querySelector(".friend_name").textContent;
      if (friendName === userName) {
        const inviteBtn = item.querySelector(".invite_btn");
        if (inviteBtn) {
          inviteBtn.innerHTML = "Invite";
          inviteBtn.classList.remove("invited", "waiting");
        }
      }
    });

    // Show kick notification
    this.showKickNotification(userName);
  }

  showKickNotification(userName) {
    const notification = document.createElement("div");
    notification.className = "kick-notification-toast";
    notification.textContent = `${userName} has been removed from the watch party`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(239, 68, 68, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      z-index: 60000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  leaveWatchTogether() {
    // Clear all invited friends and watching users
    this.invitedFriends.clear();
    this.watchingUsers.clear();

    // Reset all invite buttons
    this.friendItems.forEach((item) => {
      const inviteBtn = item.querySelector(".invite_btn");
      if (inviteBtn) {
        inviteBtn.innerHTML = "Invite";
        inviteBtn.classList.remove("invited", "waiting");
      }
    });

    // Update all displays
    this.updateWatchingDisplay();
    this.updateButtonBadges();

    // Close modal
    this.closeCurrentlyWatchingModal();

    // Show leave notification
    const notification = document.createElement("div");
    notification.className = "leave-notification-toast";
    notification.textContent = "You have left the watch party";
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(16, 185, 129, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
      z-index: 60000;
      animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-out";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Add CSS animations for toast notifications
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.watchWithFriendsModal = new WatchWithFriendsModal();
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = WatchWithFriendsModal;
}
