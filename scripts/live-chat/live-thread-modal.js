// Join Thread Modal functionality
document.addEventListener("DOMContentLoaded", function () {
  const startThreadBtn = document.querySelector(".start-thread-btn");
  const joinThreadModal = document.getElementById("joinThreadModal");
  const closeModalBtn = document.getElementById("closeJoinThreadModal");
  const searchInput = document.getElementById("threadSearchInput");
  const joinBtns = document.querySelectorAll(".join-btn");

  // Open modal
  if (startThreadBtn) {
    startThreadBtn.addEventListener("click", function () {
      joinThreadModal.classList.remove("live-chat-hidden");
      document.body.style.overflow = "hidden";
      searchInput.focus();
    });
  }

  // Close modal
  function closeModal() {
    joinThreadModal.classList.add("live-chat-hidden");
    document.body.style.overflow = "";
    searchInput.value = "";
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Close on overlay click
  joinThreadModal.addEventListener("click", function (e) {
    if (e.target === joinThreadModal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !joinThreadModal.classList.contains("live-chat-hidden")) {
      closeModal();
    }
  });

  // Join button functionality
  joinBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const threadItem = this.closest(".thread-item");
      const threadName = threadItem.querySelector(".thread-name").textContent;

      // Change button state
      this.textContent = "Joined";
      this.classList.add("joined");
      this.disabled = true;

      // You can add more functionality here like API calls
      console.log(`Joined thread: ${threadName}`);
    });
  });

  // Search functionality
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const threadItems = document.querySelectorAll(".thread-item");

    threadItems.forEach((item) => {
      const threadName = item.querySelector(".thread-name").textContent.toLowerCase();
      const threadDesc = item.querySelector(".thread-description").textContent.toLowerCase();

      if (threadName.includes(searchTerm) || threadDesc.includes(searchTerm)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  });
});
