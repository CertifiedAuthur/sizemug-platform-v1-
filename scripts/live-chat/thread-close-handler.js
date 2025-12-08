class CloseThreadModal {
  constructor() {
    this.modal = document.getElementById("closeThreadOverlay");
    this.openBtn = document.getElementById("closeThreadBtn");
    this.cancelBtn = document.getElementById("cancelThreadModal");
    this.closeBtn = document.getElementById("closeThreadModal");
    this.threadInput = document.querySelector(".thread-chat-input");
    this.threadChatView = document.getElementById("threadChatView");

    this.init();
  }

  init() {
    // Open modal when close thread button is clicked
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.showModal());
    }

    // Cancel button - just hide modal
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.hideModal());
    }

    // Close button - actually close the thread
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeThread());
    }

    // Close modal when clicking outside
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.hideModal();
        }
      });
    }

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("kick-member-hidden")) {
        this.hideModal();
      }
    });
  }

  showModal() {
    if (this.modal) {
      this.modal.classList.remove("kick-member-hidden");
      this.modal.style.visibility = "visible";
      this.modal.style.opacity = "1";
      document.body.style.overflow = "hidden";
    }
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.add("kick-member-hidden");
      this.modal.style.visibility = "hidden";
      this.modal.style.opacity = "0";
      document.body.style.overflow = "";
    }
  }

  closeThread() {
    // Hide the modal first
    this.hideModal();

    // Hide the input area
    if (this.threadInput) {
      this.threadInput.classList.add(HIDDEN);
    }

    // Show the "thread is closed" message
    this.showThreadClosedMessage();

    // Update thread status in header
    this.updateThreadStatus();

    // You can add additional logic here like:
    // - Send API request to close thread
    // - Update thread state in your data
    // - Disable other thread actions
  }

  showThreadClosedMessage() {
    // Create the closed thread message if it doesn't exist
    let closedMessage = document.getElementById("threadClosedMessage");
    if (!closedMessage) {
      closedMessage = document.createElement("div");
      closedMessage.id = "threadClosedMessage";
      closedMessage.className = "thread-closed-message";
      closedMessage.innerHTML = `
              <div class="thread-closed-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.364 3.63604C17.9926 5.26472 19 7.51472 19 10C19 14.9706 14.9706 19 10 19C7.51472 19 5.26472 17.9926 3.63604 16.364M16.364 3.63604C14.7353 2.00736 12.4853 1 10 1C5.02944 1 1 5.02944 1 10C1 12.4853 2.00736 14.7353 3.63604 16.364M16.364 3.63604L3.63604 16.364" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>This thread is closed</span>
              </div>
            `;

      // Insert the message where the input was
      if (this.threadChatView) {
        this.threadChatView.appendChild(closedMessage);
      }
    } else {
      closedMessage.classList.remove(HIDDEN);
    }
  }

  updateThreadStatus() {
    // Update the thread status in the header
    const threadStatus = document.querySelector(".thread-chat-status");
    if (threadStatus) {
      threadStatus.textContent = "Closed thread";
      threadStatus.style.color = "#F04438";
    }
  }

  // Method to reopen thread (if needed)
  reopenThread() {
    // Show the input area
    if (this.threadInput) {
      this.threadInput.classList.remove(HIDDEN);
    }

    // Hide the closed message
    const closedMessage = document.getElementById("threadClosedMessage");
    if (closedMessage) {
      closedMessage.classList.add(HIDDEN);
    }

    // Update thread status
    const threadStatus = document.querySelector(".thread-chat-status");
    if (threadStatus) {
      threadStatus.textContent = "Active thread";
      threadStatus.style.color = "";
    }
  }
}

// Initialize close thread modal
document.addEventListener("DOMContentLoaded", () => {
  const closeThreadModal = new CloseThreadModal();
});

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
 */
class LeaveThreadModal {
  constructor() {
    this.modal = document.getElementById("leaveThreadOverlay");
    this.openBtn = document.getElementById("leaveThreadBtn");
    this.cancelBtn = document.getElementById("cancelLeaveThreadModal");
    this.closeBtn = document.getElementById("leaveThreadModalBtn");

    this.init();
  }

  init() {
    // Open modal when leave thread button is clicked
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.showModal());
    }

    // Cancel button - just hide modal
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.hideModal());
    }

    // Close button - actually close the thread
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closeThread());
    }

    // Leave thread modal - Close modal when clicking outside
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.hideModal();
        }
      });
    }

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("kick-member-hidden")) {
        this.hideModal();
      }
    });
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.add("kick-member-hidden");
      this.modal.style.visibility = "hidden";
      this.modal.style.opacity = "0";
      document.body.style.overflow = "";
    }
  }

  closeThread() {
    // Hide the modal first
    this.hideModal();

    // Hide the input area
    if (this.threadInput) {
      this.threadInput.classList.add(HIDDEN);
    }

    // Show the "thread is closed" message
    this.showThreadClosedMessage();

    // Update thread status in header
    this.updateThreadStatus();
  }

  showThreadClosedMessage() {
    // Create the closed thread message if it doesn't exist
    let closedMessage = document.getElementById("threadClosedMessage");
    if (!closedMessage) {
      closedMessage = document.createElement("div");
      closedMessage.id = "threadClosedMessage";
      closedMessage.className = "thread-closed-message";
      closedMessage.innerHTML = `
              <div class="thread-closed-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.364 3.63604C17.9926 5.26472 19 7.51472 19 10C19 14.9706 14.9706 19 10 19C7.51472 19 5.26472 17.9926 3.63604 16.364M16.364 3.63604C14.7353 2.00736 12.4853 1 10 1C5.02944 1 1 5.02944 1 10C1 12.4853 2.00736 14.7353 3.63604 16.364M16.364 3.63604L3.63604 16.364" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>This thread is closed</span>
              </div>
            `;

      // Insert the message where the input was
      if (this.threadChatView) {
        this.threadChatView.appendChild(closedMessage);
      }
    } else {
      closedMessage.classList.remove(HIDDEN);
    }
  }

  updateThreadStatus() {
    // Update the thread status in the header
    const threadStatus = document.querySelector(".thread-chat-status");
    if (threadStatus) {
      threadStatus.textContent = "Closed thread";
      threadStatus.style.color = "#F04438";
    }
  }

  showModal() {
    if (this.modal) {
      this.modal.classList.remove("kick-member-hidden");
      this.modal.style.visibility = "visible";
      this.modal.style.opacity = "1";
      document.body.style.overflow = "hidden";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const leaveThreadModal = new LeaveThreadModal();
});

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
 */
class DeleteThreadModal {
  constructor() {
    this.modal = document.getElementById("deleteThreadOverlay");
    this.openBtn = document.getElementById("deleteThreadBtn");
    this.cancelBtn = document.getElementById("cancelDeleteThreadModal");
    this.closeBtn = document.getElementById("deleteThreadModalBtn");

    this.init();
  }

  init() {
    // Open modal when delete thread button is clicked
    if (this.openBtn) {
      this.openBtn.addEventListener("click", () => this.showModal());
    }

    // Cancel button - just hide modal
    if (this.cancelBtn) {
      this.cancelBtn.addEventListener("click", () => this.hideModal());
    }

    // Close button - actually delete the thread
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.deleteThread());
    }

    // Delete thread modal - Close modal when clicking outside
    if (this.modal) {
      this.modal.addEventListener("click", (e) => {
        if (e.target === this.modal) {
          this.hideModal();
        }
      });
    }

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.classList.contains("kick-member-hidden")) {
        this.hideModal();
      }
    });
  }

  hideModal() {
    if (this.modal) {
      this.modal.classList.add("kick-member-hidden");
      this.modal.style.visibility = "hidden";
      this.modal.style.opacity = "0";
      document.body.style.overflow = "";
    }
  }

  deleteThread() {
    // Hide the modal first
    this.hideModal();

    // Hide the input area
    if (this.threadInput) {
      this.threadInput.classList.add(HIDDEN);
    }
  }

  showThreadClosedMessage() {
    // Create the closed thread message if it doesn't exist
    let closedMessage = document.getElementById("threadClosedMessage");
    if (!closedMessage) {
      closedMessage = document.createElement("div");
      closedMessage.id = "threadClosedMessage";
      closedMessage.className = "thread-closed-message";
      closedMessage.innerHTML = `
              <div class="thread-closed-content">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.364 3.63604C17.9926 5.26472 19 7.51472 19 10C19 14.9706 14.9706 19 10 19C7.51472 19 5.26472 17.9926 3.63604 16.364M16.364 3.63604C14.7353 2.00736 12.4853 1 10 1C5.02944 1 1 5.02944 1 10C1 12.4853 2.00736 14.7353 3.63604 16.364M16.364 3.63604L3.63604 16.364" stroke="#7D8FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>This thread is deleted</span>
              </div>
            `;

      // Insert the message where the input was
      if (this.threadChatView) {
        this.threadChatView.appendChild(closedMessage);
      }
    } else {
      closedMessage.classList.remove(HIDDEN);
    }
  }

  updateThreadStatus() {
    // Update the thread status in the header
    const threadStatus = document.querySelector(".thread-chat-status");
    if (threadStatus) {
      threadStatus.textContent = "Deleted thread";
      threadStatus.style.color = "#F04438";
    }
  }

  showModal() {
    if (this.modal) {
      this.modal.classList.remove("kick-member-hidden");
      this.modal.style.visibility = "visible";
      this.modal.style.opacity = "1";
      document.body.style.overflow = "hidden";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const deleteThreadModal = new DeleteThreadModal();
});
