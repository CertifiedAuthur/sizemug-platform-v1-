document.addEventListener("DOMContentLoaded", function () {
  const suggestionsToggle = document.getElementById("suggestionsToggle");
  const suggestionsContent = document.getElementById("suggestionsContent");
  const followBtns = document.querySelectorAll(".suggestion-follow-btn");
  const closeBtns = document.querySelectorAll(".suggestion-close");

  // Toggle suggestions section
  if (suggestionsToggle && suggestionsContent) {
    suggestionsToggle.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        // Collapse
        this.setAttribute("aria-expanded", "false");
        suggestionsContent.classList.add("collapsed");
      } else {
        // Expand
        this.setAttribute("aria-expanded", "true");
        suggestionsContent.classList.remove("collapsed");
      }
    });
  }

  // Follow button functionality
  followBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      if (this.classList.contains("following")) {
        // Unfollow
        this.textContent = "Follow";
        this.classList.remove("following");
      } else {
        // Follow
        this.textContent = "Following";
        this.classList.add("following");

        // Add a subtle animation
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      }
    });
  });

  // Close button functionality
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const card = this.closest(".suggestion-card");
      if (card) {
        // Add removing animation
        card.classList.add("removing");

        // Remove the card after animation
        setTimeout(() => {
          card.remove();

          // Check if there are any cards left
          const remainingCards = document.querySelectorAll(".suggestion-card");
          if (remainingCards.length === 0) {
            // Hide the entire suggestions section if no cards left
            const suggestionsSection = document.querySelector(".suggestions-section");
            if (suggestionsSection) {
              suggestionsSection.style.animation = "slideOut 0.3s ease forwards";
              setTimeout(() => {
                suggestionsSection.style.display = "none";
              }, 300);
            }
          }
        }, 300);
      }
    });
  });

  // Add smooth scrolling for horizontal scroll
  const scrollContainer = document.querySelector(".suggestions-scroll-container");
  if (scrollContainer) {
    let isScrolling = false;

    scrollContainer.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      if (!isScrolling) {
        isScrolling = true;

        this.scrollBy({
          left: e.deltaY > 0 ? 200 : -200,
          behavior: "smooth",
        });

        setTimeout(() => {
          isScrolling = false;
        }, 100);
      }
    });
  }
});
