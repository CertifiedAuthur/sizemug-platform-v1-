document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const openPollModalBtn = document.getElementById("openPollModalBtn");
  const pollModalOverlay = document.getElementById("pollModalOverlay");
  const pollCloseBtn = document.getElementById("pollCloseBtn");
  const pollAddOptionBtn = document.getElementById("pollAddOptionBtn");
  const pollOptionsContainer = document.getElementById("pollOptionsContainer");
  const pollCreateBtn = document.getElementById("pollCreateBtn");

  // New elements for polls list functionality
  const pollsListModalOverlay = document.getElementById(
    "pollsListModalOverlay"
  );
  const pollsListContainer = document.getElementById("pollsListContainer");
  const pollsListAddBtn = document.getElementById("pollsListAddBtn");
  const pollCountBadge = document.getElementById("pollCountBadge");
  const surveyEndBtn = document.getElementById("surveyEndBtn");

  let popperInstance = null;
  let polls = [];

  // Initialize Popper
  function createPopper(overlayElement = pollModalOverlay) {
    if (popperInstance) {
      popperInstance.destroy();
    }

    popperInstance = Popper.createPopper(openPollModalBtn, overlayElement, {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 20],
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top", "right", "left"],
          },
        },
        {
          name: "preventOverflow",
          options: {
            boundary: document.body,
            padding: 10,
          },
        },
      ],
    });
  }

  function closeAllModals() {
    pollModalOverlay.style.display = "none";
    pollsListModalOverlay.style.display = "none";
    openPollModalBtn.classList.remove("edit_tool--active");

    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  }

  function updatePopperPosition() {
    if (popperInstance) {
      popperInstance.update();
    }
  }

  // Show polls list modal
  function showPollsListModal() {
    closeAllModals();
    pollsListModalOverlay.style.display = "flex";
    renderPollsList();
    createPopper(pollsListModalOverlay);

    // Update position after display
    setTimeout(() => {
      updatePopperPosition();
    }, 10);
  }

  // Open poll creation modal
  function openPollCreationModal() {
    closeAllModals();
    pollModalOverlay.style.display = "flex";
    createPopper(pollModalOverlay);

    // Update position after display
    setTimeout(() => {
      updatePopperPosition();
    }, 10);
  }

  // Render polls list
  function renderPollsList() {
    pollsListContainer.innerHTML = "";
    const votesCountSpan = document.querySelector(".survey-icon span");

    if (polls.length === 0) {
      pollsListContainer.innerHTML =
        '<p class="no-polls">No polls created yet</p>';
      return;
    }

    polls.forEach((poll, index) => {
      const pollElement = document.createElement("div");
      pollElement.className = "poll-list-item";
      pollElement.innerHTML = `
        <span class="poll-list-title">  <span class="vote-number">${poll.totalVotes}</span>${poll.title}</span>
        <button class="poll-view-btn" data-index="${index}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" d="M0 22h24M22 2h-4v16h4zM6 6H2v12h4zm8 12h-4v-8h4z"/></svg>View</button>
      `;
      pollsListContainer.appendChild(pollElement);
    });
  }

  // Update badge count
  function updatePollBadge() {
    if (polls.length > 0) {
      pollCountBadge.textContent = polls.length;
      pollCountBadge.style.display = "flex";
    } else {
      pollCountBadge.style.display = "none";
    }
  }

  // Open appropriate modal based on poll count
  openPollModalBtn.addEventListener("click", () => {
    if (polls.length === 0) {
      // No polls exist - open creation modal
      openPollCreationModal();
    } else {
      // Polls exist - open list modal
      showPollsListModal();
    }
  });

  // Close modal buttons
  pollCloseBtn.addEventListener("click", closeAllModals);

  // Close modal when clicking outside
  const handleOutsideClick = (e) => {
    if (
      !pollModalOverlay.contains(e.target) &&
      !pollsListModalOverlay.contains(e.target) &&
      !e.target.closest("#openPollModalBtn")
    ) {
      closeAllModals();
    }
  };

  document.addEventListener("click", handleOutsideClick);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Add new option
  pollAddOptionBtn.addEventListener("click", () => {
    const optionCount =
      pollOptionsContainer.querySelectorAll(".poll-option-group").length + 1;

    const optionGroup = document.createElement("div");
    optionGroup.className = "poll-input-group poll-option-group";

    optionGroup.innerHTML = `
      <input type="text" class="poll-input poll-option-input" placeholder="Option ${optionCount}">
      <button class="poll-remove-option-btn">&times;</button>
    `;

    pollOptionsContainer.appendChild(optionGroup);

    // Focus the new input
    const newInput = optionGroup.querySelector(".poll-option-input");
    newInput.focus();

    // Update popper position after adding content
    updatePopperPosition();
  });

  // Remove option
  pollOptionsContainer.addEventListener("click", (e) => {
    const pollRemoveOptionBtn = e.target.closest(".poll-remove-option-btn");

    if (pollRemoveOptionBtn) {
      pollRemoveOptionBtn.closest(".poll-option-group").remove();
    }
  });

  // Create poll
  pollCreateBtn.addEventListener("click", () => {
    const pollTitle = document.querySelector(".poll-title-input").value;
    const options = Array.from(
      document.querySelectorAll(".poll-option-input")
    ).map((input) => input.value);

    if (!pollTitle.trim()) {
      alert("Please enter a poll title");
      return;
    }

    if (options.some((option) => !option.trim())) {
      alert("Please fill in all options");
      return;
    }

    // Placeholder for vote data
    const mockVotes = options.map(() => Math.floor(Math.random() * 100));
    const totalVotes = mockVotes.reduce((sum, votes) => sum + votes, 0);

    // Create new poll object
    const newPoll = {
      title: pollTitle,
      options: options,
      votes: mockVotes,
      totalVotes: totalVotes,
    };

    // Add to polls array
    polls.push(newPoll);
    updatePollBadge();

    // Display the new poll
    displayPoll(newPoll);

    // Close the modal and reset form
    closeAllModals();
    resetPollForm();
  });

  // Display poll in survey container
  function displayPoll(poll) {
    const surveyContainer = document.getElementById("surveyContainer");
    const surveyQuestion = document.getElementById("surveyQuestion");
    const surveyOptions = document.getElementById("surveyOptions");
    const votesCountSpan = document.querySelector(".survey-icon span");

    surveyQuestion.textContent = poll.title;
    surveyOptions.innerHTML = poll.options
      .map((option, index) => {
        let percentage;

        if (poll.totalVotes === 0) {
          percentage = 0;
        } else {
          // Calculate raw percentage
          const rawPercentage = (poll.votes[index] / poll.totalVotes) * 100;

          // Format to max 2 digits: round to nearest integer
          percentage = Math.round(rawPercentage);

          // Handle case where rounding might produce 100 with small decimals
          if (percentage > 99.5) percentage = 100;
        }

        return `
        <div class="survey-option">
          <div class="poll-option-text">${option}</div>
          <div class="poll-progress-bar-container">
            <div class="poll-progress-bar" style="width: ${percentage}%;"></div>
          </div>
          <div class="poll-percentage">${percentage}%</div>
        </div>
      `;
      })
      .join("");

    if (votesCountSpan) {
      votesCountSpan.textContent = `${poll.totalVotes} Votes`;
    }

    surveyContainer.style.display = "block";
  }

  // Reset poll form
  function resetPollForm() {
    document.querySelector(".poll-title-input").value = "";
    // Keep first two options (Option 1 and the add button)
    while (pollOptionsContainer.children.length > 2) {
      pollOptionsContainer.lastChild.remove();
    }
    // Clear remaining inputs
    document.querySelectorAll(".poll-option-input").forEach((input) => {
      input.value = "";
    });
  }

  // Add button in polls list to show creation form
  pollsListAddBtn.addEventListener("click", () => {
    openPollCreationModal();
  });

  // View poll from list
  pollsListContainer.addEventListener("click", (e) => {
    const viewButton = e.target.closest(".poll-view-btn");

    if (viewButton) {
      const index = viewButton.dataset.index;
      displayPoll(polls[index]);
      closeAllModals();
    }
  });

  surveyEndBtn.addEventListener("click", () => {
    // Close the survey container
    const surveyContainer = document.getElementById("surveyContainer");
    surveyContainer.style.display = "none";

    // Reset the poll form
    resetPollForm();

    // Optionally, you can also clear the current poll data
    document.getElementById("surveyQuestion").textContent = "";
    document.getElementById("surveyOptions").innerHTML = "";
  });

  // Initialize badge
  updatePollBadge();
});
