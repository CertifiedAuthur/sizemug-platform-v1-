/**
 * All the logic here are mostly same as those one in populate.grid.conttainer.js file, just some slight changes for suggestion grid layout
 *
 *
 *
 */
const gridSuggestionContainerEl = document.getElementById(
  "suggestion_grid_container"
);
const goBackToSuggestionFromComment = document.querySelector(
  ".suggestion_comment--goBack"
);
let suggestionsCommentData;

gridSuggestionContainerEl.addEventListener("click", function (e) {
  const target = e.target;
  const gridItemContainer = target.closest(".grid_item");

  if (!gridItemContainer) return;

  const { gridItemId } = gridItemContainer.dataset;
  // Get corresponding data object to update landing modal comment
  const item = suggestionGridDataItem.find((item) => item.id === +gridItemId);

  // if event occur within scroll option :)
  if (target.closest(".scroll")) return;

  // Not Interested :)
  if (e.target.closest(".not-interested")) {
    return showInterestSliderDropdown();
  }

  // Toggle Caption Display
  const gridItemTaskCaption = target.closest(".grid_item_task--caption");
  if (gridItemTaskCaption) {
    const { mode } = gridItemTaskCaption.dataset;

    if (mode === "hide") {
      gridItemTaskCaption.setAttribute("data-mode", "show");
      commentsModal.setAttribute("data-caption-mode", true);
    } else {
      gridItemTaskCaption.setAttribute("data-mode", "hide");
      commentsModal.setAttribute("data-caption-mode", false);
    }
    return;
  }

  // Reposted Modal Button
  const repostedButton = target.closest(".repost--mode");
  if (repostedButton) {
    showRepostedModal();
    return;
  }

  // Save
  const listItemSaved = target.closest("#saveGridItem");
  if (listItemSaved) {
    const savedOutline = listItemSaved.querySelector(".savedOutline");
    const savedFill = listItemSaved.querySelector(".savedFill");

    if (savedOutline.classList.contains(HIDDEN)) {
      savedOutline.classList.remove(HIDDEN);
      savedFill.classList.add(HIDDEN);
    } else {
      savedOutline.classList.add(HIDDEN);
      savedFill.classList.remove(HIDDEN);
    }
    return;
  }

  // Favourite
  const listItemFav = target.closest("#favGridItem");
  if (listItemFav) {
    const favOutline = listItemFav.querySelector(".favOutline");
    const favFill = listItemFav.querySelector(".favFill");

    if (favOutline.classList.contains(HIDDEN)) {
      favOutline.classList.remove(HIDDEN);
      favFill.classList.add(HIDDEN);
    } else {
      favOutline.classList.add(HIDDEN);
      favFill.classList.remove(HIDDEN);
    }

    return;
  }

  // Show share modal
  if (target.closest(".share")) {
    return showGlobalShareFollowingModal();
  }

  // Show Report Modal
  if (target.closest(".show-report-modal-btn")) {
    return showGlobalReportModal();
  }

  // Show Delete Modal
  if (target.closest(".delete")) {
    return showGlobalDiscardModal();
  }

  // Show Like & Love Modal
  if (target.closest("#commentLovesAndLikesBtn")) {
    return handleLovesLikesDisplayModal();
  }

  // Reposted Modal Button
  const repostGridItemButton = target.closest("#repostGridItem");
  if (repostGridItemButton) {
    return showRepostedModal();
  }

  // Ellipsis Event
  const gridOptionBtn = target.closest(".button_icons");
  if (gridOptionBtn) {
    const gridOption =
      gridOptionBtn.parentNode.querySelector(".button_icons ~ ul");
    const ellipsisIcon = gridOptionBtn.querySelector(".ellipsis_icon");
    const cancelIcon = gridOptionBtn.querySelector(".cancel_icon");
    const gridOptionStatus = JSON.parse(gridOption.ariaHidden);
    const gridItemSliderButtonContainer = gridOptionBtn
      .closest(".grid_item")
      .querySelector(".slider_buttons_wrapper");

    if (gridOptionStatus) {
      gridOption.classList.remove(HIDDEN);
      ellipsisIcon.classList.add(HIDDEN);
      cancelIcon.classList.remove(HIDDEN);
      gridOption.ariaHidden = false;
      gridItemSliderButtonContainer.classList.add(HIDDEN);
    } else {
      hideTaskGridOption();
    }

    return;
  }

  // Play Task Music
  const playMusicBtn = target.closest(".grid_item_task--music");
  if (playMusicBtn) {
    const currentMode = playMusicBtn.dataset.mode;

    function newMusic() {
      if (currentMusic) {
        currentMusic.currentTime = 0;
      }

      // Initialize and play new audio
      currentMusic = new Audio(item.music);
      currentMusic.load();
      currentMusic.play();

      // Update the button's mode
      playMusicBtn.setAttribute("data-mode", "play");

      // When music ends, reset the button state
      currentMusic.addEventListener("ended", () => {
        playMusicBtn.setAttribute("data-mode", "idle");
        currentMusic = null;
      });
    }

    // Check if there is already playing audio and stop it
    if (currentMusic && currentMode === "idle") {
      // Pause the currently playing audio
      currentMusic.pause();
      currentMusic.currentTime = 0;

      // Reset all buttons to "idle"
      const allMusicButtons = document.querySelectorAll(
        ".grid_item_task--music"
      );
      allMusicButtons.forEach((btn) => btn.setAttribute("data-mode", "idle"));

      newMusic();
    }

    if (!currentMusic && (currentMode === "idle" || currentMode === "pause")) {
      newMusic();
    } else if (currentMode === "play") {
      // Pause the current music
      currentMusic.pause();
      playMusicBtn.setAttribute("data-mode", "pause");
    } else if (currentMode === "pause") {
      // Pause the current music
      currentMusic.play();
      playMusicBtn.setAttribute("data-mode", "play");
    }

    return;
  }

  // Play Task Audio
  const playAudioBtn = target.closest(".grid_item_task--audio");
  if (playAudioBtn) {
    const currentMode = playAudioBtn.dataset.mode;
    console.log(currentMode);

    function newAudio() {
      if (currentAudio) {
        currentAudio.currentTime = 0;
      }

      // Initialize and play new audio
      currentAudio = new Audio(item.audio);
      currentAudio.load();
      currentAudio.play();

      // Update the button's mode
      playAudioBtn.setAttribute("data-mode", "play");

      // When music ends, reset the button state
      currentAudio.addEventListener("ended", () => {
        playAudioBtn.setAttribute("data-mode", "idle");
        currentAudio = null;
      });
    }

    // Check if there is already playing audio and stop it
    if (currentAudio && currentMode === "idle") {
      currentAudio.pause();
      currentAudio.currentTime = 0;

      // Reset all buttons to "idle"
      const allAudioButtons = document.querySelectorAll(
        ".grid_item_task--audio"
      );
      allAudioButtons.forEach((btn) => btn.setAttribute("data-mode", "idle"));

      newAudio();
    }

    // New Audio
    if (!currentAudio && (currentMode === "idle" || currentMode === "pause")) {
      newAudio();
    } else if (currentMode === "play") {
      // Pause the current audio
      currentAudio.pause();
      playAudioBtn.setAttribute("data-mode", "pause");
    } else if (currentMode === "pause") {
      // Pause the current audio
      currentAudio.play();
      playAudioBtn.setAttribute("data-mode", "play");
    }

    return;
  }

  // Play Task Video
  const playVideoBtn = target.closest(".grid_item_task--video");
  if (playVideoBtn && item.hasVideo) {
    const gridItem = target.closest(".grid_item");
    const gridItemVideo = gridItem.querySelector("#gridLayoutVideo");
    const thumbnail = gridItem.querySelector(".task_thumbnail");

    const currentMode = playVideoBtn.dataset.mode;

    // If there is a video playing
    if (isVideoPlaying && currentMode === "idle") {
      const currentPlayingVideo = document.querySelector(
        "#gridLayoutVideo[data-mode='play']"
      );

      currentPlayingVideo.pause();
      currentPlayingVideo.currentTime = 0;

      thumbnail.classList.add(HIDDEN);
      gridItemVideo.classList.remove(HIDDEN);

      playGridHoverVideo(gridItemVideo, playVideoBtn);

      // When music ends, reset the button state
      gridItemVideo.addEventListener("ended", () => {
        playVideoBtn.setAttribute("data-mode", "idle");
        isVideoPlaying = false;
      });
    }

    // Completely New Video
    if (
      !isVideoPlaying &&
      (currentMode === "idle" || currentMode === "pause")
    ) {
      thumbnail.classList.add(HIDDEN);
      gridItemVideo.classList.remove(HIDDEN);

      playGridHoverVideo(gridItemVideo, playVideoBtn);

      // When music ends, reset the button state
      gridItemVideo.addEventListener("ended", () => {
        playVideoBtn.setAttribute("data-mode", "idle");
        isVideoPlaying = false;
      });
    } else if (currentMode === "play") {
      // Pause the current audio
      gridItemVideo.pause();
      playVideoBtn.setAttribute("data-mode", "pause");
      isVideoPlaying = false;
    }

    return;
  }

  // Sliders Event
  const sliderButtonWrapper = target.closest(".slider_buttons_wrapper");
  if (sliderButtonWrapper) {
    if (target.tagName.toLowerCase() === "button") {
      const count = parseInt(target.dataset.count);
      const nextCount = parseInt(target.dataset.nextCount ?? 0);
      const totalCount = parseInt(sliderButtonWrapper.dataset.totalCount);
      const gridItem = target.closest(".grid_item");
      const nextSlide = gridItem.querySelector(`#slider_count--${count}`);
      const allSlides = gridItem.querySelectorAll(".slide");
      const allButtons = sliderButtonWrapper.querySelectorAll("button");
      const lastButton = sliderButtonWrapper.querySelector("button:last-child");

      if (count === 1) {
        allSlides.forEach((slide) => slide.classList.add(HIDDEN));
        allButtons.forEach((btn) => btn.classList.remove("active"));
        nextSlide.classList.remove(HIDDEN);
        target.classList.add("active");
        lastButton.dataset.count = 3;
        lastButton.dataset.nextCount = 0;

        return;
      }

      if (count === 2) {
        allSlides.forEach((slide) => slide.classList.add(HIDDEN));
        allButtons.forEach((btn) => btn.classList.remove("active"));
        nextSlide.classList.remove(HIDDEN);
        target.classList.add("active");
        lastButton.dataset.count = 3;
        lastButton.dataset.nextCount = 0;

        return;
      }

      if (count === 3 && !nextCount) {
        allSlides.forEach((slide) => slide.classList.add(HIDDEN));
        allButtons.forEach((btn) => btn.classList.remove("active"));

        nextSlide.classList.remove(HIDDEN);
        target.classList.add("active");
        lastButton.dataset.nextCount = 4;

        return;
      }

      if (nextCount && totalCount >= nextCount) {
        const nextSlide = gridItem.querySelector(`#slider_count--${nextCount}`);

        allSlides.forEach((slide) => slide.classList.add(HIDDEN));
        allButtons.forEach((btn) => btn.classList.remove("active"));

        nextSlide.classList.remove(HIDDEN);
        target.classList.add("active");

        if (totalCount === nextCount) {
          lastButton.dataset.nextCount = 0;
        } else {
          lastButton.dataset.nextCount = nextCount + 1;
        }
        return;
      }
    }

    return;
  }

  // Show comments modal
  // const showCommentsModalBtn = target.closest(".grid_task_navigate_comment");
  // if (showCommentsModalBtn) {
  // const gridItem = target.closest(".grid_item");
  // const { gridItemId } = gridItem.dataset;

  // const item = suggestionGridDataItem.find((item) => item.id === +gridItemId);

  showSuggestionComment();
  updateSuggestionCommentInterface(item);
  updateSuggestionTagModal();
  updateSuggestionReposted();

  generateUsersWithTasks(15).then((res) => {
    suggestionScrollingData = res;
    renderCommentSuggestion(res);
  });

  return;
  // }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Show suggestion comment container
function showSuggestionComment() {
  taskSuggestionContainer.classList.add(HIDDEN);
  taskDescriptionContainer.classList.add(HIDDEN);
  suggestionCommentContainer.classList.remove(HIDDEN);
  descriptionSticky.classList.add(HIDDEN);
}

// Hide suggestion comment container and move back to suggestion grid views
goBackToSuggestionFromComment.addEventListener("click", () => {
  suggestionCommentContainer.classList.add(HIDDEN);
  taskSuggestionContainer.classList.remove(HIDDEN);
  descriptionSticky.classList.remove(HIDDEN);

  if (masonryMainSuggestionGridContainer) {
    masonryMainSuggestionGridContainer;
    // update suggestion grid layout
    // masonryInstance.layout();
  }
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
 *
 */

const suggestionScrollGridButtonContainerUp = document.getElementById(
  "suggestionScrollGridButtonContainerUp"
);
const suggestionScrollGridButtonContainerDown = document.getElementById(
  "suggestionScrollGridButtonContainerDown"
);
// const gridSuggestionContainerEl = document.getElementById("gridSuggestionContainerEl");

// Define scroll amount (in pixels)
const SUGGESTION_SCROLL_GRID_CONTAINER_AMOUNT = 700;

// Function to update button states based on scroll position
function updateSuggestionStickyButtonStates() {
  const { scrollTop, scrollHeight, clientHeight } = gridSuggestionContainerEl;

  // Disable "Up" button if at the top (scrollTop = 0)
  suggestionScrollGridButtonContainerUp.disabled = scrollTop === 0;
  // Disable "Down" button if at the bottom (scrollTop + clientHeight >= scrollHeight)
  suggestionScrollGridButtonContainerDown.disabled =
    scrollTop + clientHeight >= scrollHeight - 1; // Small buffer for rounding
}

// Scroll up
suggestionScrollGridButtonContainerUp.addEventListener("click", () => {
  gridSuggestionContainerEl.scrollBy({
    top: -SUGGESTION_SCROLL_GRID_CONTAINER_AMOUNT,
    behavior: "smooth",
  });
  setTimeout(updateSuggestionStickyButtonStates, 300); // Update after smooth scroll finishes
});

// Scroll down
suggestionScrollGridButtonContainerDown.addEventListener("click", () => {
  gridSuggestionContainerEl.scrollBy({
    top: SUGGESTION_SCROLL_GRID_CONTAINER_AMOUNT,
    behavior: "smooth",
  });
  setTimeout(updateSuggestionStickyButtonStates, 300); // Update after smooth scroll finishes
});

// Update button states on manual scroll (e.g., with mouse or keyboard)
gridSuggestionContainerEl.addEventListener(
  "scroll",
  updateSuggestionStickyButtonStates
);
