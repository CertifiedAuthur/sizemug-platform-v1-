const videoMinimizeModal = document.getElementById("videoMinimizeModal");
const videoMinimizeElement = document.getElementById("videoMinimizeElement");
const imageMinimizeElement = document.getElementById("imageMinimizeElement");

const minimizedVideoLengthTrackerProgress = document.querySelector(".minimized_video_length_tracker--progress");
const togglePlayingState = document.querySelector(".minimized_container_video_tools button.toggle_playing_state");

const hideMinimizedContainer = document.getElementById("hideMinimizedContainer");
const expandMinimizedVideo = document.getElementById("expandMinimizedVideo");

const minimizedVideoFastBackward = document.getElementById("minimizedVideoFastBackward");
const minimizedVideoFastForward = document.getElementById("minimizedVideoFastForward");

videoMinimizeElement?.addEventListener("timeupdate", () => {
  togglePlayingState.dataset.mode = "pause";

  const progress = (videoMinimizeElement.currentTime / videoMinimizeElement.duration) * 100;
  minimizedVideoLengthTrackerProgress.style.width = `${progress}%`;
});

videoMinimizeElement?.addEventListener("ended", () => {
  document.querySelector(".toggle_playing_state").dataset.mode = "play";
});

// Set initial CSS positions (these are your base coordinates)
if (videoMinimizeModal) {
  videoMinimizeModal.style.top = "20px";
  videoMinimizeModal.style.left = "20px";
}

// We'll track the incremental offsets from the initial top/left
let deltaX = 0,
  deltaY = 0;

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
function showMinimizedVideo(track = "initial") {
  if (track === "initial") {
    // To know next data index in the array of gridDataItem
    if (!currentMinimizeGridItemIndex) {
      currentMinimizeGridItemIndex = gridDataItem.findIndex((media) => media.id === currentCommentModalMinimizedMedia.id);
    }
  } else if (track === "next") {
    if (gridDataItem.length - 1 === currentMinimizeGridItemIndex) {
      currentMinimizeGridItemIndex = 0;
      currentCommentModalMinimizedMedia = gridDataItem[currentMinimizeGridItemIndex];
    } else {
      currentMinimizeGridItemIndex = currentMinimizeGridItemIndex + 1;
      currentCommentModalMinimizedMedia = gridDataItem[currentMinimizeGridItemIndex];
    }
  } else if (track === "prev") {
    if (currentMinimizeGridItemIndex === 0) {
      currentMinimizeGridItemIndex = gridDataItem.length - 1;
      currentCommentModalMinimizedMedia = gridDataItem[currentMinimizeGridItemIndex];
    } else {
      currentMinimizeGridItemIndex = currentMinimizeGridItemIndex - 1;
      currentCommentModalMinimizedMedia = gridDataItem[currentMinimizeGridItemIndex];
    }
  }

  if (currentCommentModalMinimizedMedia.hasVideo) {
    imageMinimizeElement.classList.add("media_hidden");
    videoMinimizeElement.classList.remove("media_hidden");
    videoMinimizeElement.src = currentCommentModalMinimizedMedia.taskVideo;

    videoMinimizeElement?.addEventListener(
      "loadeddata",
      () => {
        videoMinimizeElement.play();
      },
      { once: true }
    );
  } else {
    videoMinimizeElement.classList.add("media_hidden");
    imageMinimizeElement.classList.remove("media_hidden");
    imageMinimizeElement.src = currentCommentModalMinimizedMedia.taskImages[0];
  }

  videoMinimizeModal?.classList.remove("animate__zoomOutRight");
  videoMinimizeModal?.classList.add("animate__animated", "animate__zoomInRight");
  videoMinimizeModal?.classList.remove(HIDDEN);
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
function hideMinimizedVideo() {
  currentMinimizeGridItemIndex = null;
  videoMinimizeElement.pause();

  videoMinimizeModal?.classList.remove("animate__zoomInRight");
  videoMinimizeModal?.classList.add("animate__animated", "animate__zoomOutRight");

  videoMinimizeModal?.addEventListener(
    "animationend",
    () => {
      videoMinimizeModal?.classList.add(HIDDEN);
    },
    { once: true }
  );
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
function moveMinimizedContainer() {
  if (!videoMinimizeModal) return;

  interact(videoMinimizeModal).draggable({
    inertia: true, // Enables a smooth inertial drag effect
    listeners: {
      move(event) {
        // Update the cumulative offsets
        deltaX += event.dx;
        deltaY += event.dy;

        // Apply the transform for smooth movement during the drag
        if (videoMinimizeModal) {
          videoMinimizeModal.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }
      },
      end(event) {
        // Calculate the element's current absolute position
        const initialLeft = parseFloat(videoMinimizeModal?.style.left);
        const initialTop = parseFloat(videoMinimizeModal?.style.top);

        // The current absolute coordinates are the initial CSS position plus the drag offset
        const currentLeft = initialLeft + deltaX;
        const currentTop = initialTop + deltaY;

        // Define a margin from the viewport edges
        const margin = 10;

        // Get element dimensions
        const rect = videoMinimizeModal.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        // Define four target positions for the corners (top-left, top-right, bottom-left, bottom-right)
        const targets = [
          { left: margin, top: margin }, // Top-left
          { left: window.innerWidth - containerWidth - margin, top: margin }, // Top-right
          { left: margin, top: window.innerHeight - containerHeight - margin }, // Bottom-left
          { left: window.innerWidth - containerWidth - margin, top: window.innerHeight - containerHeight - margin }, // Bottom-right
        ];

        // Find the nearest target by Euclidean distance
        let closestTarget = targets[0];
        let minDistance = Infinity;
        targets.forEach((target) => {
          const dx = target.left - currentLeft;
          const dy = target.top - currentTop;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minDistance) {
            minDistance = distance;
            closestTarget = target;
          }
        });

        if (videoMinimizeModal) {
          // Animate snapping by updating top and left, then reset the transform.
          videoMinimizeModal.style.transition = "top 0.3s ease, left 0.3s ease";
          videoMinimizeModal.style.top = `${closestTarget.top}px`;
          videoMinimizeModal.style.left = `${closestTarget.left}px`;

          // Reset the transform so the element now sits at the new CSS top/left values.
          videoMinimizeModal.style.transform = "";

          // Reset our drag offset values.
          deltaX = 0;
          deltaY = 0;

          // Clean up the transition after the animation completes.
          setTimeout(() => {
            videoMinimizeModal.style.transition = "";
          }, 300);
        }
      },
    },
  });
}
moveMinimizedContainer();

hideMinimizedContainer?.addEventListener("click", hideMinimizedVideo);

togglePlayingState?.addEventListener("click", () => {
  if (togglePlayingState.dataset.mode === "pause") {
    videoMinimizeElement.pause();
    togglePlayingState.dataset.mode = "play";
  } else {
    videoMinimizeElement.play();
    togglePlayingState.dataset.mode = "pause";
  }
});

minimizedVideoFastForward?.addEventListener("click", () => {
  showMinimizedVideo("next");
});

minimizedVideoFastBackward?.addEventListener("click", () => {
  showMinimizedVideo("prev");
});

expandMinimizedVideo?.addEventListener("click", () => {
  hideMinimizedVideo();
  showCommentModalGlobalHandler(currentCommentModalMinimizedMedia);
});

class MinimizeModal {
  constructor() {
    this.videoMinimizeModal = document.getElementById("videoMinimizeModal");
    this.cancelMinimizeLiveModal = document.getElementById("cancelMinimizeLiveModal");
    this.maximizeLiveModalBtn = document.getElementById("maximizeLiveModalBtn");
    this.minimizeStreamBtn = document.getElementById("minimizeStreamBtn");

    this.glivMinimizeModal = localStorage.getItem("glivMinimizeModal") ?? false;

    this.init();
  }

  init() {
    // Minimize Stream Button
    this.minimizeStreamBtn?.addEventListener("click", () => {
      console.log("Minimize Stream Button");

      localStorage.setItem("glivMinimizeModal", "1");
      location.href = "/live.html";
    });

    if (this.videoMinimizeModal) {
      if (this.glivMinimizeModal) {
        this.videoMinimizeModal.classList.remove(HIDDEN);
      } else {
        this.videoMinimizeModal.classList.add(HIDDEN);
      }

      this.cancelMinimizeLiveModal?.addEventListener("click", () => {
        this.videoMinimizeModal.classList.add(HIDDEN);
        localStorage.removeItem("glivMinimizeModal");
      });

      this.maximizeLiveModalBtn?.addEventListener("click", () => {
        this.videoMinimizeModal.classList.add(HIDDEN);
        localStorage.removeItem("glivMinimizeModal");
      });

      localStorage.removeItem("glivMinimizeModal");
    }
  }
}

new MinimizeModal();
