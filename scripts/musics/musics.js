document.addEventListener("DOMContentLoaded", async () => {
  await populateMusicSearches();
});

async function populateMusicSearches() {
  const gridContainerEl = document.querySelector(".gridContainer");

  renderGridContainerSkeleton();
  gridContainerEl.classList.add(HIDDEN);
  gridContainerSkeleton.classList.remove(HIDDEN);
  dashboardGridSkeletonInstance.layout();

  const data = await generateUsersWithTasks();
  if (data) {
    gridContainerSkeleton.innerHTML = "";
    gridContainerEl.innerHTML = "";
    gridContainerSkeleton.classList.add(HIDDEN);
    gridContainerEl.classList.remove(HIDDEN);

    populateGridLayout(data, gridContainerEl);
    gridDataItem = data;
  }
}

// Popular Container Row Items
const popularContainerRowItems = document.querySelectorAll("button.popular_container_row_item");
popularContainerRowItems.forEach((item) => {
  item.addEventListener("click", () => {
    populateMusicSearches();
  });
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
 *
 */

const hashTagHeaderOption = document.getElementById("hashTagHeaderOption");
hashTagHeaderOption.addEventListener("click", function () {
  const isExpanded = this.getAttribute("aria-expanded") === "true";

  if (isExpanded) {
    this.setAttribute("aria-expanded", false);
  } else {
    this.setAttribute("aria-expanded", true);
  }
});

const hashTagHeaderOptions = document.querySelector(".hashtag_header_option_container ul");
hashTagHeaderOptions.addEventListener("click", (e) => {
  // Save
  const savedOption = e.target.closest(".save");
  if (savedOption) {
    if (savedOption.classList.contains("saved")) {
      savedOption.classList.remove("saved");
    } else {
      savedOption.classList.add("saved");
    }
  }

  // Share
  const shareOption = e.target.closest(".share");
  if (shareOption) {
    showGlobalShareFollowingModal();
  }

  // Report
  const reportOption = e.target.closest(".report");
  if (reportOption) {
    showGlobalReportModal();
  }

  hashTagHeaderOption.setAttribute("aria-expanded", false);
});

/***
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
 *
 *
 * HEADER MUSIC LOGIC :)
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
 *
 *
 *
 *
 */

const musicHeaderPlaying = document.getElementById("listenToMusic");
const musicProgressContainer = document.getElementById("musicProgressContainer");

let playingAudio = null;

musicHeaderPlaying.addEventListener("click", function () {
  if (!playingAudio) {
    // Create a new Audio object if it doesn't exist
    playingAudio = new Audio("./music/Salam-Alaikum.mp3");

    playingAudio.play();
    this.dataset.mode = "playing";

    // Attach progress update event listener
    playingAudio.addEventListener("timeupdate", function () {
      const percentage = (playingAudio.currentTime / playingAudio.duration) * 100;
      musicProgressContainer.style.width = `${percentage}%`;
    });

    // Reset when audio ends
    playingAudio.addEventListener("ended", function () {
      musicHeaderPlaying.dataset.mode = "idle";
      musicProgressContainer.style.width = "0%";
      playingAudio = null; // Reset audio reference
    });
  } else if (playingAudio.paused) {
    // Resume audio if it is paused
    playingAudio.play();
    this.dataset.mode = "playing";
  } else {
    // Pause audio if it is playing
    playingAudio.pause();
    this.dataset.mode = "paused";
  }
});
