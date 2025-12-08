let currentViewingStoryId;
let replayClickedForCurrentStory = false;

const viewStoryList = document.getElementById("viewStoryList");

async function renderModalStories(stories) {
  viewStoryList.innerHTML = "";

  // for (const story of stories) {
  stories.forEach((story, index) => {
    const { id, watched, medias, userPhoto, fullName, pinIcon } = story;

    const firstMedia = medias?.[0];
    const mediaLength = Array.from({ length: medias?.length || 0 }, (_, i) => i + 1);

    const markup = `
          <li class="view_story-list-item" data-position="${index + 1}" data-story-id="${id}">
            <div class="${watched ? "viewed_update" : "new_update"}" id="story_list--item">
              <div class="story-media">
                ${firstMedia?.type === "video" ? `<video src="${firstMedia.media}"></video>` : `<img src="${firstMedia.media}" />`}
                <div class="story-overlay"></div>
                 
                <div class="user_story">
                  <img src="${userPhoto}" alt="${fullName}" />
                  <span>${fullName}</span>
                </div>
               
                <div class="story_seen_overlay ${HIDDEN}">
                  <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66a7.5 7.5 0 0 0-13.888 0a1 1 0 0 0 0 .66a7.5 7.5 0 0 0 13.888 0"/></g></svg>
                       </span>
                </div>
              </div>
              ${pinIcon ? `<div class="pin-icon"><img src="${pinIcon}" alt="pin-icon" /> </div>` : ""}
            </div>
            
          </li>
  `;

    viewStoryList.insertAdjacentHTML("afterbegin", markup);
  });
  // backup for story option
  // <div class="footer">
  //   <span>Just now</span>
  //   <span role="button" id="storyOption">
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       id="story_ellipsis"
  //       width="20"
  //       height="20"
  //       viewBox="0 0 24 24"
  //     >
  //       <circle cx="6.5" cy="12" r="1.5" fill="currentColor" />
  //       <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  //       <circle cx="17.5" cy="12" r="1.5" fill="currentColor" />
  //     </svg>
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       class="${HIDDEN}"
  //       id="story_times"
  //       width="20"
  //       height="20"
  //       viewBox="0 0 24 24"
  //     >
  //       <path
  //         fill="none"
  //         stroke="currentColor"
  //         stroke-linecap="round"
  //         stroke-linejoin="round"
  //         stroke-width="1.5"
  //         d="m5 19l7-7m0 0l7-7m-7 7L5 5m7 7l7 7"
  //       />
  //     </svg>
  //   </span>
  //   <div class="story_menu_panel ${HIDDEN}" aria-expanded="false">
  //     <ul class="menu_list">
  //       <li class="menu_list_item save">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             fill="#fff"
  //             d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12zm-2 .85L16.15 5H5v14h14zM12 18q1.25 0 2.125-.875T15 15t-.875-2.125T12 12t-2.125.875T9 15t.875 2.125T12 18m-6-8h9V6H6zM5 7.85V19V5z"
  //           />
  //         </svg>
  //         <span>Save</span>
  //       </li>
  //       <li class="menu_list_item share">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             fill="#fff"
  //             d="M10 3v2H5v14h14v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm7.586 2H13V3h8v8h-2V6.414l-7 7L10.586 12z"
  //           />
  //         </svg>
  //         <span>Share</span>
  //       </li>
  //       <li class="menu_list_item block">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             fill="#fff"
  //             d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.35 0 2.6-.437t2.3-1.263L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20m6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7z"
  //           />
  //         </svg>
  //         <span>Block</span>
  //       </li>
  //     </ul>
  //   </div>
  // </div>;
  // insert the add new story later
  viewStoryList.insertAdjacentHTML(
    "afterbegin",
    `
        <li class="story-list-item add_new_story" id="addNewStoryFromStoryDisplay">
           <span>Your Story</span>
           <svg data-icon><use href="../icons/sprite.svg#add" /></svg>
        </li>
   `
  );

  viewStoryList.insertAdjacentHTML(
    "beforeend",
    `
    <li class="no-story">
 <img src="./images/stories/no-stories-white.svg" />
 <div>
     <span>No more Stories to Show</span>
     <div class="find-friends">Find Friends</div>
     </div>
    </li>
  `
  );

  // const addNewStoryFromStoryDisplay = document.getElementById("addNewStoryFromStoryDisplay");
  // const uploadInterface = document.getElementById("upload-interface");

  // addNewStoryFromStoryDisplay.addEventListener("click", (e) => {
  //   document.getElementById("story_overlay").classList.remove(HIDDEN);
  //   console.log("clickeddd");
  // });
}

renderModalStories(scrollStoriesData);

let storyInterval;
let intervalSeconds = 1; // Initialize the interval counter
let currentStoryUser; // store users info array of medias
let currentDisplayMediaIndex;
let maxSeconds;
let mediaPaused = false;

const previousStoryMedia = document.getElementById("previousStoryMedia");
const nextStoryMedia = document.getElementById("nextStoryMedia");
const storyDisplayPlaceholderContainer = document.getElementById("storyDisplayPlaceholderContainer");
const storyDisplayContainer = document.getElementById("storyDisplayContainer");
const storyMediaWrapper = document.getElementById("storyMediaWrapper");

nextStoryMedia.addEventListener("click", handleDisplayNextStory);
previousStoryMedia.addEventListener("click", handleDispalyPreviousStory);

const storyProgress = storyDisplayContainer.querySelector(".story_progress");

storyProgress.addEventListener("click", (e) => {
  const target = e.target.closest("li");

  if (target) {
    clearInterval(storyInterval);
    const index = +target.dataset.index;

    // storyInterval = null;
    intervalSeconds = 1;
    maxSeconds = null;

    document.querySelectorAll(".line_progress").forEach((progress) => {
      progress.style.transition = "none";
      progress.style.width = "0%";
    });

    Array.from({ length: index }, (_, i) => i).map((index) => {
      const progressBar = document.getElementById(`lineProgress--${index}`).querySelector("#lineProgress");

      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
    });

    handleDisplayCurrentContent(index);
  }
});

// Play/Pause Event on image/Video
storyMediaWrapper.addEventListener("click", function () {
  const image = this.querySelector("img");

  if (image) {
    if (!mediaPaused) {
      clearInterval(storyInterval);
      mediaPaused = true;
    } else {
      initialInterval();
      mediaPaused = false;
    }

    return;
  }
});

function handleDisplayNextStory() {
  clearInterval(storyInterval);

  // storyInterval = null;
  intervalSeconds = 1;
  maxSeconds = null;

  if (currentStoryUser[currentDisplayMediaIndex + 1]) {
    Array.from({ length: currentDisplayMediaIndex + 1 }, (_, i) => i).map((index) => {
      const progressBar = document.getElementById(`lineProgress--${index}`).querySelector("#lineProgress");

      progressBar.style.transition = "none";
      progressBar.style.width = "100%";
    });

    currentDisplayMediaIndex = currentDisplayMediaIndex + 1;
    handleCurrentDisplayingMedia(currentStoryUser[currentDisplayMediaIndex]);
  } else {
    const asideStoryItem = document.querySelector(`.view_story-list-item[data-story-id="${currentViewingStoryId}"]`);
    asideStoryItem.querySelector(".story_seen_overlay").classList.remove(HIDDEN);

    hideStoryDisplayContainer();
  }
}

function handleDispalyPreviousStory() {
  clearInterval(storyInterval);

  // storyInterval = null;
  intervalSeconds = 1;
  maxSeconds = null;

  if (currentDisplayMediaIndex === 0) {
    currentDisplayMediaIndex = 0;
  } else {
    currentDisplayMediaIndex = currentDisplayMediaIndex - 1;
  }

  const progressBar = document.getElementById(`lineProgress--${currentDisplayMediaIndex}`).querySelector("#lineProgress");
  const prevProgressBar = document.getElementById(`lineProgress--${currentDisplayMediaIndex + 1}`).querySelector("#lineProgress");

  prevProgressBar.style.transition = "none";
  prevProgressBar.style.width = "0%";
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";

  handleCurrentDisplayingMedia(currentStoryUser[currentDisplayMediaIndex]);
}

function hideStoryDisplayContainer() {
  removeClass(storyDisplayPlaceholderContainer);
  addClass(storyDisplayContainer);
  // Reset replay state when closing stories
  replayClickedForCurrentStory = false;
}

// Render User Stories
function renderClickUserStories(storyId) {
  if (typeof storyId !== "number") return console.log("Story id should be passed in form of number");

  const clickedStory = scrollStoriesData.find((story) => story.id === storyId);

  if (clickedStory) {
    currentStoryUser = clickedStory.medias;

    // update current story user info
    const { fullName, userPhoto } = clickedStory;

    document.getElementById("currentStoryUserName").textContent = fullName;
    document.getElementById("currentStoryUserImage").src = userPhoto;

    console.log(storyDisplayPlaceholderContainer);
    console.log(storyDisplayContainer);

    // show story dislay container
    addClass(storyDisplayPlaceholderContainer);
    removeClass(storyDisplayContainer);

    // update story progress line
    renderProgressLine(clickedStory.medias.length);

    // Display Active Status
    handleDisplayCurrentContent(0);

    // Reset replay state for new story
    replayClickedForCurrentStory = false;
  }
}

// update story progress line
function renderProgressLine(progressLength) {
  const arrayOfNumberLength = Array.from({ length: progressLength }, (_, i) => i);

  storyProgress.innerHTML = "";
  arrayOfNumberLength.forEach((num) => {
    const markup = `
        <li id="lineProgress--${num}" data-index="${num}">
          <div class="line_progress" id="lineProgress"></div>
        </li>
    `;

    storyProgress.insertAdjacentHTML("beforeend", markup);
  });
}

// Display Active Status
function handleDisplayCurrentContent(index) {
  currentDisplayMediaIndex = index;

  handleCurrentDisplayingMedia(currentStoryUser[index]);
}
// Update your existing event listener
const storyCaptionWrapper = document.getElementById("storyCaptionWrapper");
const storyCaption = document.getElementById("storyCaption");
const messageIconGift = document.getElementById("messageIconGift");

storyCaptionWrapper.addEventListener("click", () => {
  storyCaptionWrapper.classList.add(HIDDEN);
  messageIconGift.classList.remove(HIDDEN);
  // Set flag to remember replay was clicked for this story
  replayClickedForCurrentStory = true;
});
// Display type of media
function handleCurrentDisplayingMedia(media) {
  const storyCaptionWrapper = document.getElementById("storyCaptionWrapper");
  const storyCaption = document.getElementById("storyCaption");
  const messageIconGift = document.getElementById("messageIconGift");
  mediaPaused = false;

  console.log("HI");

  if (media.type !== "image" && media.type !== "video") return;

  // Media Caption - only show if replay wasn't clicked for current story
  if (media.caption && !replayClickedForCurrentStory) {
    removeClass(storyCaptionWrapper);
    addClass(messageIconGift); // Make sure message icon is hidden
    const { text, isTrunc } = truncateText(media.caption, 130);

    // Clear previous content
    // storyCaption.innerHTML = "";

    if (isTrunc) {
      storyCaption.insertAdjacentHTML("beforeend", `<div id="expandTextButton" class="see-more">See more</div>`);

      const button = storyCaption.querySelector("#expandTextButton");
      button.addEventListener("click", () => {
        storyCaption.textContent = media.caption;
      });
    }
  } else if (!media.caption || replayClickedForCurrentStory) {
    addClass(storyCaptionWrapper);
    // If replay was clicked, keep message interface visible
    if (replayClickedForCurrentStory) {
      removeClass(messageIconGift);
    }
  }

  // Handle Image
  if (media.type === "image") {
    maxSeconds = 7;
    const image = document.createElement("img");
    image.alt = "Story Image";
    image.src = media.media;

    storyMediaWrapper.innerHTML = "";
    storyMediaWrapper.appendChild(image);

    image.onload = () => {
      initialInterval(); // Start the progress bar for images
    };
  }

  // Handle Video
  if (media.type === "video") {
    const video = document.createElement("video");
    video.src = media.media;
    video.id = "media_video";
    video.preload = "metadata";
    video.controls = false;
    video.autoplay = true;

    storyMediaWrapper.innerHTML = "";
    storyMediaWrapper.appendChild(video);

    video.addEventListener("loadedmetadata", () => {
      maxSeconds = Math.round(video.duration);
      video.play();
    });

    video.addEventListener("timeupdate", () => {
      updateVideoProgress(video);
    });

    video.addEventListener("ended", () => {
      handleDisplayNextStory(); // Move to the next story when the video ends
    });
  }
}

// Interval for image progress update
function initialInterval() {
  const progressBar = document.getElementById(`lineProgress--${currentDisplayMediaIndex}`).querySelector("#lineProgress");

  function timer() {
    // Calculate the width percentage based on the elapsed time
    const progressPercentage = (intervalSeconds / maxSeconds) * 100;

    // Apply smooth transition
    progressBar.style.transition = "width 1s linear"; // Smooth transition over 1 second
    progressBar.style.width = `${progressPercentage}%`;

    if (intervalSeconds <= maxSeconds) {
      // Increment the interval counter
      return intervalSeconds++;
    }

    clearInterval(storyInterval);
    // Display to next status
    handleDisplayNextStory();
  }

  timer();

  // Interval
  storyInterval = setInterval(timer, 1000);
}

// Video Progress Update
function updateVideoProgress(video) {
  const progressBar = document.getElementById(`lineProgress--${currentDisplayMediaIndex}`).querySelector("#lineProgress");

  if (!progressBar || !video.duration) return;

  const progressPercentage = (video.currentTime / Math.floor(video.duration)) * 100;

  // Apply smooth transition
  progressBar.style.transition = "width 1s linear"; // Smooth transition over 1 second
  progressBar.style.width = `${progressPercentage}%`;
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// outside view story event
document.addEventListener("click", (e) => {
  if (!e.target.closest("#storyOption")) {
    return hideStoriesOption();
  }
});

// Hide
function hideStoriesOption() {
  const storyMenuPanel = document.querySelectorAll(".story_menu_panel");
  const storyEllipsis = document.querySelectorAll("#story_ellipsis");
  const storyTimes = document.querySelectorAll("#story_times");

  // handle icons
  storyEllipsis.forEach((ellip) => ellip.classList.remove(HIDDEN));
  storyTimes.forEach((times) => times.classList.add(HIDDEN));

  storyMenuPanel.forEach((panel) => {
    panel.classList.add(HIDDEN);
    panel.classList.add("slide-out");
    panel.classList.remove("slide-in");
    panel.setAttribute("aria-expanded", false);

    // Destroy Popper instance
    if (panel._popperInstance) {
      panel._popperInstance.destroy();
      panel._popperInstance = null;
    }
  });
}

// Story Container Tab
const storyGroupTab = document.getElementById("storyGroupTab");
storyGroupTab?.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    if (button.classList.contains("all_story")) {
      groupActivation("all_story");
    } else if (button.classList.contains("my_story")) {
      groupActivation("my_story");
    }
  }
});

// Story Activation
function groupActivation(active = "all_story") {
  const groupActiveTab = document.getElementById("groupActiveTab");
  const storyAllContainer = document.getElementById("storyAllContainer");
  const storyMyContainer = document.getElementById("storyMyContainer");

  if (active === "all_story") {
    groupActiveTab.style.transform = "translateX(0%)";
    storyAllContainer.classList.remove(HIDDEN);
    storyMyContainer.classList.add(HIDDEN);
  } else {
    groupActiveTab.style.transform = "translateX(100%)";
    storyAllContainer.classList.add(HIDDEN);
    storyMyContainer.classList.remove(HIDDEN);
  }
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// My Story Tab Items
const myStoryTabContainer = document.getElementById("myStoryTabItems");
myStoryTabContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const { targetIndex, myStoryTab } = button.dataset;
    myStoryTabActivation(myStoryTab, +targetIndex);
  }
});

function myStoryTabActivation(active = "icon", targetIndex = 0) {
  const myStoryGroupTabs = document.getElementById("myStoryGroupTabs");
  const myStoryTabContainer = document.getElementById(`myStoryTabContainer--${active}`);
  const myStoryTabContainers = document.querySelectorAll(".myStoryTabContainers");

  myStoryTabContainers.forEach((container) => container.classList.add(HIDDEN));

  myStoryGroupTabs.style.transform = `translateX(${targetIndex * 100}%)`;
  removeClass(myStoryTabContainer);
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// My Story Tab Containers
const myStoryTabContainersSubHeaders = document.querySelectorAll(".myStoryTabContainers header");

myStoryTabContainersSubHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const { state } = header.dataset;
    const articleContainer = header.closest(".myStoryTabContainers").querySelector("article");

    if (state === "open") {
      animateHeight(articleContainer, 0, 0, 500);
      header.setAttribute("data-state", "close");
    } else {
      animateHeight(articleContainer, 0, articleContainer.scrollHeight, 500);
      header.setAttribute("data-state", "open");
    }
  });
});

function addClass(element, className = HIDDEN) {
  element.classList.add(className);
}

function removeClass(element, className = HIDDEN) {
  element.classList.remove(className);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// View Story List Event
viewStoryList.addEventListener("click", (e) => {
  const target = e.target;

  // share modal
  const shareBtn = target.closest(".share");
  if (shareBtn) {
    return showGlobalShareFollowingModal();
  }

  // Report Modal
  const blockBtn = e.target.closest(".block");
  if (blockBtn) {
    return showBlockModal();
  }

  // story option
  const storyOption = target.closest("#storyOption");
  if (storyOption) {
    const storyMenuPanel = storyOption.closest(".footer").querySelector(".story_menu_panel");
    const isExpanded = storyMenuPanel.getAttribute("aria-expanded") === "true";
    const storyEllipsis = storyOption.querySelector("#story_ellipsis");
    const storyTimes = storyOption.querySelector("#story_times");

    if (!isExpanded) {
      hideStoriesOption();

      // Show menu and position it with Popper.js
      storyMenuPanel.classList.remove(HIDDEN);
      storyMenuPanel.classList.add("slide-in");
      storyMenuPanel.classList.remove("slide-out");
      storyMenuPanel.setAttribute("aria-expanded", true);
      storyEllipsis.classList.add(HIDDEN);
      storyTimes.classList.remove(HIDDEN);

      // Initialize Popper.js
      const popperInstance = Popper.createPopper(storyOption, storyMenuPanel, {
        placement: "bottom-end", // Adjust placement as needed
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8], // Adjust offsets (x, y)
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport", // Ensure it stays within the viewport
            },
          },
        ],
      });

      // Save the Popper instance for later cleanup
      storyMenuPanel._popperInstance = popperInstance;
    } else {
      hideStoriesOption();
    }
    return;
  }

  // View Story
  const storyListItem = target.closest("#story_list--item");
  if (storyListItem) {
    const { storyId, position } = storyListItem.closest("li").dataset;
    const shareStoryOverlay = document.getElementById("shareStoryOverlay");

    const contentEl = shareStoryOverlay.querySelector(".content p");
    const buttonEl = shareStoryOverlay.querySelector(".content button");

    shareStoryOverlay.dataset.storyMode = "";
    shareStoryOverlay.classList.remove(HIDDEN);

    if (position === "2") {
      shareStoryOverlay.dataset.storyMode = "task";
      contentEl.textContent = "You";
      shareStoryOverlay.querySelector("h2").textContent = "Wants to collaborate on a task";
      buttonEl.textContent = "Collaborate";
    } else if (position === "3") {
      shareStoryOverlay.dataset.storyMode = "board";
      contentEl.textContent = "You";
      shareStoryOverlay.querySelector("h2").textContent = "Want to collaborate on board";
      buttonEl.textContent = "Join Board";
    } else if (position === "5") {
      shareStoryOverlay.dataset.storyMode = "live";
      contentEl.textContent = "Annette Black";
      shareStoryOverlay.querySelector("h2").textContent = "Started streaming 5 hours ago";
      buttonEl.textContent = "Join Live";
    } else {
      shareStoryOverlay.classList.add(HIDDEN);
    }

    currentViewingStoryId = storyId;

    clearInterval(storyInterval);
    intervalSeconds = 1;

    console.log(storyId);
    renderClickUserStories(+storyId);

    return;
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
 *
 *
 *
 *
 */
const viewStoryLargeOption = document.getElementById("viewStoryLargeOption");
const exploreStoryMenuPanel = document.getElementById("exploreStoryMenuPanel");

viewStoryLargeOption.addEventListener("click", () => {
  clearInterval(storyInterval);

  exploreStoryMenuPanel.classList.remove(HIDDEN);
});

exploreStoryMenuPanel.addEventListener("click", (e) => {
  // Share Modal
  const shareBtn = e.target.closest(".share");
  if (shareBtn) {
    return showGlobalShareFollowingModal();
  }

  // Report Modal
  const reportBtn = e.target.closest(".report");
  if (reportBtn) {
    return showGlobalReportModal();
  }

  const blockBtn = e.target.closest(".block");
  if (blockBtn) {
    return showBlockModal();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".viewStoryLargeOption--menu")) {
    exploreStoryMenuPanel.classList.add(HIDDEN);
  }
});

// //////////// story
// Add this to your main photo story interface JavaScript file
// or create a separate integration file

// Function to initialize text story button
// Function to initialize text story button
// function initializeTextStoryButton() {
//   const textStoryBtn = document.getElementById("text-story-btn");

//   // Handle text story button click
//   if (textStoryBtn) {
//     textStoryBtn.addEventListener("click", () => {
//       // Hide the story options sidebar
//       const storyOptionsSidebar = document.getElementById("upload-interface");
//       if (storyOptionsSidebar) {
//         storyOptionsSidebar.style.display = "none";
//       }

//       // Show the text story interface
//       openTextStory();
//     });
//   }

//   // Handle close button click - SEPARATE IF STATEMENT
//   if (textCloseBtn) {
//     textCloseBtn.addEventListener("click", () => {
//       // Hide the text story interface
//       const storyOptionsSidebar = document.getElementById("upload-interface");
//       const textStoryInterface = document.getElementById(
//         "text-story-interface"
//       );
//       // if (textStoryInterface) {
//       //   textStoryInterface.style.display = "none";
//       // } else {
//       //   textStoryInterface.style.display = "block";
//       // }

//       // // Show the story options sidebar again
//       // if (storyOptionsSidebar && !textStoryInterface) {
//       //   storyOptionsSidebar.style.display = "block";
//       // }

//       console.log("Returned to main interface");
//     });
//   }
// }

// Function to open text story interface
// function openTextStory() {
//   const textStoryInterface = document.getElementById("text-story-interface");

//   if (textStoryInterface) {
//     textStoryInterface.style.display = "flex";

//     // Initialize the text story interface if not already done
//     if (!window.textStoryInterface) {
//       window.textStoryInterface = new TextStoryInterface();
//     }

//     // Reset to main panel
//     window.textStoryInterface.switchPanel("main");
//   } else {
//     console.error(
//       "Text story interface not found. Make sure text-story.html is included."
//     );
//   }
// }

// Initialize when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   initializeTextStoryButton();
// });
