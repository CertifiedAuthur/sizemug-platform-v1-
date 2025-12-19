/**
 * This file handles everything that make all the comments on platform works 🫶 :)
 *
 *
 * This file is using an external function (getLandingModalComments()) in getModalComment.js file
 *
 */

const sliderCommentsModal = document.getElementById("comments_modal");

const intialSideCommentImage = document.getElementById("post-attachment--initial");
const footerImages = document.getElementById("post-attachment-footer");
const commentUserImage = document.getElementById("comment_user_image");
const commentUserLabel = document.getElementById("comment_user_label");
const commentSmoothSlideContainer = document.getElementById("comment_smooth_slide");
const postRelatedContainer = document.getElementById("post_related_container");
const commentContainers = document.getElementById("comment-containers");
const commentSeeMoreContent = document.getElementById("comment_see_more_content");
const commentPostModalTitle = document.getElementById("post_content_title");
const commentPostModalTag = document.getElementById("post-hash-tag");

// Video Modal
const videoExpanderBtns = document.querySelectorAll(".video_expander--btn");
const commentModalVideoControls = document.getElementById("commentModalVideoControls");
const commentModalVideo = document.getElementById("commentModalVideo");
const commentVideoMute = document.getElementById("commentVideoMute");
const commentModalPlayPause = document.getElementById("commentModalPlayPause");
const commentVideoProgressTrack = document.querySelector(".comment-video-progress-track");
const commentModalVideoContainer = document.getElementById("comment-modal-video-container");

// Caption
const commentModalVideoCaptions = document.querySelectorAll(".commentModalVideoCaption");
const commentVideoCaption = document.getElementById("commentVideoCaption");
const commentVideoSound = document.getElementById("commentVideoSound");

const commentModalZoomContainer = document.getElementById("commentModalZoomContainer");
const commentModalMinimizeVideoBtns = document.querySelectorAll(".commentModalMinimizeVideoBtn");

/**
 *
 *
 *
 *
 * Minimize Video handle
 *
 *
 *
 */
commentModalMinimizeVideoBtns.forEach((button) => {
  button.addEventListener("click", () => {
    sliderCommentsModal.classList.add(HIDDEN);
    commentModalVideo.pause();
    showMinimizedVideo();
  });
});

// Share Modal
const shareVideoToPeoples = document.querySelectorAll(".shareVideoToPeople");
shareVideoToPeoples.forEach((btn) => {
  btn.addEventListener("click", () => showGlobalShareFollowingModal());
});

// Comment Input With Emoji
const commentInputWithEmoji = document.getElementById("commentInputWithEmoji");
commentInputWithEmoji.addEventListener("click", showCommentModalEmoji);

const commentModalEmojiPickerEmojiContainer = document.getElementById("commentModalEmojiPickerEmojiContainer");
commentModalEmojiPickerEmojiContainer.addEventListener("click", (e) => {
  if (e.target.id === "commentModalEmojiPickerEmojiContainer") return hideCommentModalEmoji();
});

function showCommentModalEmoji() {
  commentModalEmojiPickerEmojiContainer.classList.remove(HIDDEN);
}

function hideCommentModalEmoji() {
  commentModalEmojiPickerEmojiContainer.classList.add(HIDDEN);
}

let commentAudioUrl;
let commentAudio;
let commentGlobalRelatedData;

// Mute Video
commentVideoMute.addEventListener("click", function () {
  const mode = this.getAttribute("data-mode") ?? "unmute";

  if (mode === "mute") {
    this.setAttribute("data-mode", "unmute");
    commentModalVideo.muted = false;
  } else {
    this.setAttribute("data-mode", "mute");
    commentModalVideo.muted = true;
  }
});

// Comment Modal Expanding Button Event
videoExpanderBtns.forEach((btn) => {
  btn.addEventListener("click", function () {
    const isExpanded = btn.getAttribute("aria-expanded") === "true";
    const commentModalPostContent = document.getElementById("commentModalPostContent");

    if (isExpanded) {
      btn.setAttribute("aria-expanded", false);
      commentModalPostContent.classList.remove(HIDDEN);
      document.querySelector(".post-attachment-wrapper").classList.remove("expanded");
    } else {
      btn.setAttribute("aria-expanded", true);
      commentModalPostContent.classList.add(HIDDEN);
      document.querySelector(".post-attachment-wrapper").classList.add("expanded");
    }
  });
});

// Comment Modal Caption Button Event
commentModalVideoCaptions.forEach((btn) => {
  btn.addEventListener("click", function () {
    const isSelected = this.getAttribute("aria-selected") === "true";

    if (isSelected) {
      btn.setAttribute("aria-selected", false);
      commentVideoCaption.classList.add(HIDDEN);
    } else {
      btn.setAttribute("aria-selected", true);
      commentVideoCaption.classList.remove(HIDDEN);
      handleActivateCommentModalCaption();
    }
  });
});

// Pause & Play Video
commentModalPlayPause.addEventListener("click", togglePausePlay);
commentModalVideoContainer.addEventListener("click", (e) => {
  if (!e.target.closest("#commentModalVideoControls") && !e.target.closest("#video_expander--btn")) {
    togglePausePlay();
  }
});

function togglePausePlay() {
  const mode = commentModalPlayPause.getAttribute("data-mode");

  if (mode === "pause") {
    commentModalPlayPause.setAttribute("data-mode", "play");
    commentModalVideo.pause();
  } else {
    commentModalPlayPause.setAttribute("data-mode", "pause");
    commentModalVideo.play();
  }
}

let commentModalMusic;
let commentModalAudio;

function handleCommentModalMusicAudioPlaying(data) {
  const commentModalMusicBtn = document.getElementById("commentModalMusicBtn");
  const commentModalAudioBtn = document.getElementById("commentModalAudioBtn");

  if (data.music) {
    commentModalMusicBtn.classList.remove(HIDDEN);

    commentModalMusicBtn.addEventListener("click", function () {
      const mode = this.getAttribute("data-mode") || "idle";

      if (mode === "idle") {
        commentModalMusic = new Audio(data.music);

        commentModalMusic.play();
        this.setAttribute("data-mode", "play");
      } else if (mode === "play") {
        commentModalMusic.pause();
        this.setAttribute("data-mode", "pause");
      } else if (mode === "pause") {
        commentModalMusic.play();
        this.setAttribute("data-mode", "play");
      }
    });
  }

  if (data.audio) {
    commentModalAudioBtn.classList.remove(HIDDEN);

    commentModalAudioBtn.addEventListener("click", function () {
      const mode = this.getAttribute("data-mode") || "idle";

      if (mode === "idle") {
        commentModalAudio = new Audio(data.audio);

        commentModalAudio.play();
        this.setAttribute("data-mode", "play");
      } else if (mode === "play") {
        commentModalAudio.pause();
        this.setAttribute("data-mode", "pause");
      } else if (mode === "pause") {
        commentModalAudio.play();
        this.setAttribute("data-mode", "play");
      }
    });
  }
}
// Comment Modal Video Volume control
const volumeThumb = document.getElementById("commentIncreaseDecreaseVolume");
const commentVolumeProgress = document.getElementById("commentVolumeProgress");
const commentVolumeLevel = document.getElementById("commentVolumeLevel");

let isDraggingVolume = false;

// Function to update volume based on position
const updateVolume = (e) => {
  if (!isDraggingVolume) return;

  const progressBarRect = commentVolumeProgress.getBoundingClientRect();
  let offsetY = e.clientY - progressBarRect.top;

  // Clamp the value between 0 and progressBar height
  offsetY = Math.max(0, Math.min(progressBarRect.height, offsetY));

  // Convert offsetY to volume percentage (top = 100%, bottom = 0%)
  let percentage = (1 - offsetY / progressBarRect.height) * 100;

  // Update video volume (0 to 1)
  commentModalVideo.volume = percentage / 100;

  // Move the volume thumb
  volumeThumb.style.top = `${offsetY}px`;

  // Update label
  commentVolumeLevel.textContent = `${Math.round(percentage)}%`;
};

// Mouse events
volumeThumb.addEventListener("mousedown", () => {
  isDraggingVolume = true;
  document.addEventListener("mousemove", updateVolume);
});

document.addEventListener("mouseup", () => {
  isDraggingVolume = false;
  document.removeEventListener("mousemove", updateVolume);
});

function showCommentModalGlobalHandler(defaultData) {
  const postRelatedContainer = document.getElementById("post_related_container");
  const commentsModal = document.getElementById("comments_modal");

  commentsModal.classList.remove(HIDDEN);

  handleCommentModalMusicAudioPlaying(defaultData);

  // Reset modal expand video
  videoExpanderBtns.forEach((btn) => btn.setAttribute("aria-expanded", false));

  // Skeleton Suggestions
  renderCommentModalGlobalSkeleton(postRelatedContainer);

  // if there is default data provided, then load the data
  if (defaultData) {
    handleUpdateTaskLandingComment(defaultData);
  }

  // Get Post Related Task
  generateUsersWithTasks(20).then((res) => {
    postRelatedContainer.innerHTML = ""; // clear existing content

    if (res) {
      commentGlobalRelatedData = res;
      renderAsideLandingComment(res);
    }
  });
}

/**
 *
 *
 *
 *
 *
 *
 *
 * @param {*} container
 *
 *
 *
 *
 *
 *
 *
 */
function renderCommentModalGlobalSkeleton(container) {
  const commentContainers = document.getElementById("comment-containers");

  const sideSkeleton = Array.from({ length: 15 }, (_, i) => i + 1);

  sideSkeleton.forEach((ske) => {
    const markup = `<div class="related_skeleton skeleton---loading"></div>`;
    container.insertAdjacentHTML("beforeend", markup);
  });

  sideSkeleton.forEach((ske) => {
    const markup = `
      <div id="comment_skeleton_loading--item">
        <div class="comment_profile">
          <div class="skeleton---loading"></div>
        </div>

        <div id="comment_main_content" class="comment_main_content">
          <div class="skeleton---loading"></div>
          <div class="skeleton---loading"></div>
        </div>
      </div>
    `;

    commentContainers.insertAdjacentHTML("beforeend", markup);
  });
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 * @param {*} data
 *
 *
 *
 *
 *
 *
 *
 *
 */

function handleActivateCommentModalCaption() {
  commentVideoCaption.classList.remove(HIDDEN);

  // Check if Web Speech API is supported
  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Show partial results

    recognition.onresult = (event) => {
      let caption = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        caption += event.results[i][0].transcript + " ";
      }
      commentVideoCaption.textContent = caption.trim();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    // Start recognition when video plays
    commentModalVideo.onplay = () => recognition.start();
    commentModalVideo.onpause = () => recognition.stop();
    commentModalVideo.onended = () => recognition.stop();
  } else {
    captionsDiv.textContent = "Sorry, your browser does not support speech recognition.";
  }
}

function handleUpdateTaskLandingComment(data) {
  const commentModalImageContainer = document.getElementById("commentModalImageContainer");
  // const commentVideoCaption = document.getElementById("commentVideoCaption");
  const commentsModal = document.getElementById("comments_modal");

  commentVideoCaption.classList.add(HIDDEN);

  currentCommentModalMinimizedMedia = data;

  if (data.hasVideo) {
    commentModalImageContainer.classList.add(HIDDEN);
    commentModalVideoContainer.classList.remove(HIDDEN);

    commentModalVideo.src = data.taskVideo;

    const captionMode = commentsModal.getAttribute("data-caption-mode") === "true";

    if (captionMode) {
      handleActivateCommentModalCaption();
    }
  } else {
    commentModalImageContainer.classList.remove(HIDDEN);
    commentModalVideoContainer.classList.add(HIDDEN);

    intialSideCommentImage.src = data.taskImages[0]; // Update Large Image display
    commentAudioUrl = data.music; // Update music
  }

  commentPostModalTitle.textContent = data.taskTitle; // update title

  // update post tag
  commentPostModalTag.innerHTML = "";
  data.tags.forEach((tag) => {
    const html = `<a href="/hashtag.html">${tag}</a>`;
    commentPostModalTag.insertAdjacentHTML("beforeend", html);
  });

  // Tags
  updateCommentTagModal();
  // Resposted
  updateRepostedTag();

  footerImages.innerHTML = ""; //  // clear existing content

  data.taskImages.slice(0, 4).forEach((img) => {
    const html = `<img src="${img}" alt="" class="avatar-item" />`;
    footerImages.insertAdjacentHTML("beforeend", html);
  });

  // Render Images list
  if (data.taskImages.length > 4) {
    footerImages.insertAdjacentHTML("beforeend", ` <div class="avatar-item" >+${data.taskImages.length - 4}</div>`);
  }

  // User profile Image
  commentUserImage.src = data.userPhoto;
  commentUserLabel.textContent = data.username;

  // Render to smooth slider
  commentSmoothSlideContainer.innerHTML = ""; // clear existing content
  data.taskImages.forEach((img) => {
    const html = `
         <div class="slide">
            <img src="${img}" alt="Image 2" class="img__slider" />
         </div>
      `;

    commentSmoothSlideContainer.insertAdjacentHTML("beforeend", html);
  });

  // landing comment modal comment :)
  getLandingModalComments().then((res) => {
    renderComments(res);
  });

  // Show volume container
  commentVideoMute.addEventListener("mouseenter", () => {
    commentModalZoomContainer.classList.remove(HIDDEN);
  });

  // Hide volume container only when mouse is not over the container or button
  document.addEventListener("mousemove", (e) => {
    if (
      !e.target.closest("#comment-modal-video-container") &&
      !e.target.closest("#comment-video-mute") // Ensures it doesn't hide when interacting with mute button
    ) {
      commentModalZoomContainer.classList.add(HIDDEN);
    }
  });

  // Update progress bar
  commentModalVideo.addEventListener("timeupdate", function () {
    const percentage = (this.currentTime / this.duration) * 100;
    commentVideoProgressTrack.style.width = `${percentage}%`;
  });

  function handleVideoPlay() {
    commentModalVideo.play();

    commentModalVideo.addEventListener("ended", () => {
      commentModalPlayPause.setAttribute("data-mode", "play");
      commentModalVideo.pause();
    });

    commentModalPlayPause.setAttribute("data-mode", "pause");
  }

  handleVideoPlay();
}

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
 *
 * POST RELATED EVENT
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
 *
 *
 */

// click post related item
postRelatedContainer.addEventListener("click", (e) => {
  const playIcon = e.target.closest("#postRelatedPlay");

  if (playIcon) {
    const postImageWrapper = playIcon.closest(".post-image-wrapper");

    const thumbnail = postImageWrapper.querySelector("img");
    const video = postImageWrapper.querySelector("video");

    thumbnail.classList.add(HIDDEN);
    video.classList.remove(HIDDEN);

    video.play();

    return;
  }

  const related = e.target.closest(".post-related-group");
  if (related) {
    const { relatedId } = related.dataset;

    if (relatedId) {
      // check landing.comment.js file for below funtion
      return handleUpdateTaskLandingComment(commentGlobalRelatedData[+relatedId]);
    }
  }
});

// Hide comment modal
const closeCommentModalSlider = document.getElementById("closeCommentModalSlider");
closeCommentModalSlider.addEventListener("click", function (e) {
  const commentsModal = document.getElementById("comments_modal");

  commentsModal.classList.add(HIDDEN);
});

// Comment Global Slider Post Menu
const commentGlobalSliderPostMenu = document.querySelector(".commentGlobalSliderPostMenu");
const menuDropdown = commentGlobalSliderPostMenu.querySelector("ul");
const ellipsisSVG = commentGlobalSliderPostMenu.querySelector("#postMenuEllipsis");
const timesSVG = commentGlobalSliderPostMenu.querySelector("#postMenuTimes");

commentGlobalSliderPostMenu.addEventListener("click", (e) => {
  // Keep the post menu visible when triggering Boost from within the comment modal.
  // The Boost UI is a separate popover and shouldn't collapse this dropdown.
  if (e.target.closest(".boost")) {
    return;
  }

  if (menuDropdown.classList.contains(HIDDEN)) {
    menuDropdown.classList.remove(HIDDEN);

    ellipsisSVG.classList.add(HIDDEN);
    timesSVG.classList.remove(HIDDEN);
  } else {
    menuDropdown.classList.add(HIDDEN);

    ellipsisSVG.classList.remove(HIDDEN);
    timesSVG.classList.add(HIDDEN);
  }

  const target = e.target;

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

  if (target.closest(".share")) {
    return showGlobalShareFollowingModal();
  }

  if (target.closest(".report")) {
    return showGlobalReportModal();
  }

  if (target.closest(".delete")) {
    return showGlobalDiscardModal();
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".commentGlobalSliderPostMenu")) {
    menuDropdown.classList.add(HIDDEN);
    timesSVG.classList.add(HIDDEN);
    ellipsisSVG.classList.remove(HIDDEN);
  }
});

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////// See more
document.addEventListener("DOMContentLoaded", () => {
  const popupSeeBtn = document.querySelector(".content-see-more");
  const popupSeeContent = document.querySelector(".see-more-content");
  const dropdownChevron = document.getElementById("dropdownChevron");

  popupSeeBtn.addEventListener("click", function (e) {
    if (!popupSeeContent.classList.contains(HIDDEN)) {
      popupSeeContent.ariaExpanded = false;
      popupSeeContent.classList.add(HIDDEN);
      dropdownChevron.classList.add("active");
    } else {
      popupSeeContent.ariaExpanded = true;
      popupSeeContent.classList.remove(HIDDEN);
      dropdownChevron.classList.remove("active");
    }
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
 *
 * Smooth Slider Overlay
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
 *
 *
 *
 *
 *
 *
 */
const popOverlay = document.querySelector(".popup-overlay");

popOverlay.addEventListener("click", function (e) {
  if (e.target.classList.contains("over_lay") && location.pathname !== "/user-profile.html") {
    this.classList.add(HIDDEN);
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
 * Close Comment Modal
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

const attachmentHeaderClose = document.querySelector(".post-attachment-header-close");
const closeCommentModalBtn = document.querySelector(".post-close");

attachmentHeaderClose?.addEventListener("click", () => {
  document.querySelector(".post-attachment-header").classList.add(HIDDEN);
});

closeCommentModalBtn.addEventListener("click", () => {
  const commentsModal = document.getElementById("comments_modal");
  commentsModal.classList.add(HIDDEN);
});

document.getElementById("comments_modal").addEventListener("click", function (e) {
  if (e.target.id === "comments_modal") {
    this.classList.add(HIDDEN);
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
 * Useful Function
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
 *
 *
 *
 *
 *
 *
 *
 */

// Update Comment container on post related items click
function updateLandingCommentInterface(data) {
  // User profile Image
  commentUserImage.src = data.photo;
  commentUserLabel.textContent = data.name;
  commentSeeMoreContent.textContent = data.desc;
  postTitle.textContent = `${data.title.at(0).toUpperCase()}${data.title}`;

  // update comments
  renderComments(data.comments);
}

// Render Aside Landing Comment
function renderAsideLandingComment(data) {
  data.forEach((d, i) => {
    const html = `
         <div class="post-related-group" role="button" data-related-id="${i}">
            <div class="post-image-wrapper">
              ${
                d.hasVideo
                  ? `
                <img src="${d.taskVideoThumbnail}" class="video_thumbnail" alt="Thumbnail"/>
                <svg width="1.2em" height="1.2em" id="postRelatedPlay" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                <video id="gridLayoutVideo" class="${HIDDEN} video" preload="metadata" muted loop src="${d.taskVideo}"></video>
                `
                  : `<img src="${d.taskImages[0]}" alt="related-attachment" class="post-related-attachment" />`
              }
            </div>

            <div class="post-related-content">
              <div class="post-user-detail scrolling">
                <label class="post-name-img">
                  <a href="/profile.html">
                    <img class="post-user-img" src="${d.userPhoto}" alt="" />
                    <span class="post-user-name-group">
                      <span class="post-user-name">${d.username}</span>
                    </span>
                  <a>
                </label>
                <a href="#" class="post-user-follow">Follow</a>
              </div>
              <p class="comment-message comment-sidebar-overflow text-black">${d.taskTitle}</p>
              <span class="comment-time">${d.date}</span>
            </div>
          </div>
        `;

    postRelatedContainer.insertAdjacentHTML("beforeend", html);
  });

  const postRelatedGroup = postRelatedContainer.querySelectorAll(".post-related-group");

  postRelatedGroup.forEach((post) => {
    const video = post.querySelector(".post-image-wrapper video");
    const videoThumbnail = post.querySelector(".video_thumbnail");

    post.addEventListener("mouseenter", () => {
      if (video) {
        videoThumbnail.classList.add(HIDDEN);
        video.classList.remove(HIDDEN);
        video.play();
      }
    });

    post.addEventListener("mouseleave", () => {
      if (video) {
        video.classList.add(HIDDEN);
        videoThumbnail.classList.remove(HIDDEN);

        video.pause();
        video.currentTime = 0;
      }
    });
  });
}

// Render Comment
function renderComments(commentsData) {
  commentContainers.innerHTML = "";

  function createCommentHtml(comment, isReply = false) {
    return `
        <div class="comment-thread">
          <div class="comment-contents ${isReply ? "reply" : ""}">
            <img src="${comment.photo}" class="comment-sender-avatar rounded-full" />
            <div class="comment-message-container">
              <p class="comment-message">${comment.content}</p>
              <div class="comment-tlr-group">
                <span class="comment-time">${comment.date}</span>
                <div class="comment-lr-group">
                  <button class="comment-l-group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="black" d="M13.731 3.25a2.09 2.09 0 0 0-1.982 1.464l-.802 2.491a2 2 0 0 1-.442.76a9.5 9.5 0 0 0-1.528 2.218h-.652a2.25 2.25 0 0 0-1.243-.856c-.289-.078-.617-.077-.998-.077h-.168c-.38 0-.71 0-.998.077a2.25 2.25 0 0 0-1.591 1.59c-.078.29-.077.618-.077 1v6.167c0 .38 0 .71.077.998a2.25 2.25 0 0 0 1.59 1.591c.29.078.618.078 1 .077h.167c.38 0 .71 0 .998-.077a2.25 2.25 0 0 0 1.289-.923H15c1.341 0 2.256-.058 2.984-.367a3.87 3.87 0 0 0 1.58-1.24c.465-.618.68-1.426.999-2.622l.04-.148l.691-2.367l.01-.03c.16-.534.293-.98.37-1.35c.078-.379.116-.764.015-1.15a2.35 2.35 0 0 0-.992-1.382c-.339-.219-.717-.296-1.098-.331c-.367-.034-.823-.034-1.364-.034h-2.302c.533-1.695.358-3.066.07-3.977c-.333-1.058-1.342-1.502-2.221-1.502zm-4.98 15v-6.334l-.001-.233h1.182l.294-.636a8 8 0 0 1 1.38-2.064c.35-.377.611-.828.77-1.319l.8-2.49a.59.59 0 0 1 .555-.424h.051c.45 0 .714.21.791.454c.246.779.424 2.15-.416 3.959a.75.75 0 0 0 .68 1.066h3.364c.584 0 .97 0 1.26.027c.285.027.38.072.421.098c.171.11.3.287.356.5c.015.058.027.177-.034.47c-.06.296-.175.68-.347 1.254l-.002.005l-.698 2.386l-.002.008c-.377 1.413-.523 1.91-.79 2.265a2.37 2.37 0 0 1-.967.76c-.409.173-1.026.248-2.398.248zm-3.445-7.475c.071-.019.18-.025.694-.025c.513 0 .623.006.694.025a.75.75 0 0 1 .53.53c.02.072.026.182.026.695v6c0 .513-.006.623-.025.694a.75.75 0 0 1-.53.53c-.072.02-.182.026-.695.026s-.623-.006-.694-.026a.75.75 0 0 1-.53-.53c-.02-.071-.026-.18-.026-.694v-6c0-.513.007-.623.026-.694a.75.75 0 0 1 .53-.53"/></svg>
                    <span class="count-likes">${comment.likes || ""}</span>
                  </button>
                  <button class="add_comment_to_comment">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="m6.825 12l2.9 2.9q.3.3.288.7t-.313.7q-.3.275-.7.288t-.7-.288l-4.6-4.6q-.3-.3-.3-.7t.3-.7l4.6-4.6q.275-.275.688-.275T9.7 5.7q.3.3.3.713t-.3.712L6.825 10H16q2.075 0 3.538 1.463T21 15v3q0 .425-.288.713T20 19t-.712-.288T19 18v-3q0-1.25-.875-2.125T16 12z"/></svg>
                  </button>
                  ${comment?.replies?.length > 0 ? `<button class="comment-reply">Reply ${isReply ? "2" : "1"}</button>` : ""}
                </div>
              </div>
              <button class="comment-item-option" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="#000" d="M8 2.5a1.22 1.22 0 0 1 1.25 1.17A1.21 1.21 0 0 1 8 4.84a1.21 1.21 0 0 1-1.25-1.17A1.22 1.22 0 0 1 8 2.5m0 8.66a1.17 1.17 0 1 1-1.25 1.17A1.21 1.21 0 0 1 8 11.16m0-4.33a1.17 1.17 0 1 1 0 2.34a1.17 1.17 0 1 1 0-2.34"/></svg>

                <ul class="animation-dropdown">
                  <li role="button" data-type="copy">
                    <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7V7C14 6.06812 14 5.60218 13.8478 5.23463C13.6448 4.74458 13.2554 4.35523 12.7654 4.15224C12.3978 4 11.9319 4 11 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V11C4 11.9319 4 12.3978 4.15224 12.7654C4.35523 13.2554 4.74458 13.6448 5.23463 13.8478C5.60218 14 6.06812 14 7 14V14" stroke="#33363F" stroke-width="2"></path><rect x="10" y="10" width="10" height="10" rx="2" stroke="#33363F" stroke-width="2"></rect></svg></span>
                    <span>Copy</span>
                  </li>
                  <li role="button" data-type="highlight">
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#33363F" d="M4.95 7.325L4.2 6.6q-.3-.275-.288-.687T4.2 5.2q.3-.3.713-.312t.712.287l.725.725q.275.275.288.688T6.35 7.3q-.275.275-.687.288t-.713-.263M11 4V3q0-.425.288-.712T12 2t.713.288T13 3v1q0 .425-.288.713T12 5t-.712-.288T11 4m6.7 1.875l.7-.7q.275-.275.688-.275t.712.3q.275.275.275.7t-.275.7l-.7.7q-.275.275-.688.288t-.712-.263q-.3-.3-.3-.725t.3-.725M9 20v-3l-2.425-2.425q-.275-.275-.425-.638T6 13.176V11q0-.825.587-1.412T8 9h8q.825 0 1.413.588T18 11v2.175q0 .4-.15.763t-.425.637L15 17v3q0 .825-.587 1.413T13 22h-2q-.825 0-1.412-.587T9 20m2 0h2v-3.825l3-3V11H8v2.175l3 3zm1-4.5"/></svg></span>
                    <span class="text">Highlight</span>
                  </li>
                  <li role="button" data-type="report">
                    <span><svg width="16" height="16" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1934 17.4805C12.4767 17.4805 12.7144 17.3845 12.9064 17.1925C13.0984 17.0005 13.194 16.7631 13.1934 16.4805C13.1927 16.1978 13.0967 15.9605 12.9054 15.7685C12.714 15.5765 12.4767 15.4805 12.1934 15.4805C11.91 15.4805 11.6727 15.5765 11.4814 15.7685C11.29 15.9605 11.194 16.1978 11.1934 16.4805C11.1927 16.7631 11.2887 17.0008 11.4814 17.1935C11.674 17.3861 11.9114 17.4818 12.1934 17.4805ZM11.1934 13.4805H13.1934V7.48047H11.1934V13.4805ZM8.44336 21.4805L3.19336 16.2305V8.73047L8.44336 3.48047H15.9434L21.1934 8.73047V16.2305L15.9434 21.4805H8.44336ZM9.29336 19.4805H15.0934L19.1934 15.3805V9.58047L15.0934 5.48047H9.29336L5.19336 9.58047V15.3805L9.29336 19.4805Z" fill="#33363F"></path></svg></span>
                    <span>Report</span>
                  </li>
                </ul>
              </button>

              <div class="reply_to_comment ${HIDDEN}">
                <div class="reply_to_comment_tools_wrapper">
                  <div spellcheck="false" contenteditable="true">Add a reply...</div>
                  <button class="commentReplyInputWithEmoji">
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16"><path fill="#000" d="M6.25 7.75a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5m-.114 1.917a.5.5 0 1 0-.745.667A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 2.609-1.166a.5.5 0 0 0-.745-.667A2.5 2.5 0 0 1 8 10.5c-.74 0-1.405-.321-1.864-.833M10.5 7A.75.75 0 1 1 9 7a.75.75 0 0 1 1.5 0M14 8A6 6 0 1 0 2 8a6 6 0 0 0 12 0M3 8a5 5 0 1 1 10 0A5 5 0 0 1 3 8"/></svg>
                  </button>
                  <button class="commentReplyInputWithGift">
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zm9-1v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7m2.5-4a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/></g></svg>
                  </button>
                </div>
                <button class="add_new_reply_comment">Add</button>
              </div>
            </div>
          </div>
          ${isReply ? "" : '<div class="reply-connector"></div>'}
        </div>
  `;
  }

  commentsData.forEach((comment) => {
    let commentHtml = createCommentHtml(comment);

    if (comment.replies && comment.replies.length > 0) {
      commentHtml += `<div class="replies ${HIDDEN}">`;
      comment.replies.forEach((reply) => {
        commentHtml += createCommentHtml(reply, true);
      });
      commentHtml += "</div>";
    }

    commentContainers.insertAdjacentHTML("beforeend", commentHtml);
  });

  /////////////////////////////////////////
  /////////////////////////////////////////
  /////////////////////////////////////////
  // Handle comments options
  const commentOptions = commentContainers.querySelectorAll(".comment-item-option");

  function hideAllCommentOption() {
    const option = document.querySelectorAll(".comment-item-option");
    option.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".comment-item-option")) {
      hideAllCommentOption();
    }
  });

  commentOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      const commentMessageContainer = e.target.closest(".comment-message-container");

      hideAllCommentOption();

      if (e.target.closest('[data-type="copy"]')) {
        const content = commentMessageContainer.querySelector(".comment-message").textContent;

        navigator.clipboard
          .writeText(content)
          .then(() => {
            showFlashMessage("Text copied to clipboard successfully!", "", "success", 2000);
          })
          .catch((err) => {
            console.error("Failed to copy: ", err);
          });
        return;
      }

      const highlightOption = e.target.closest('[data-type="highlight"]');
      if (highlightOption) {
        const commentMessage = commentMessageContainer.querySelector(".comment-message");

        if (commentMessage.classList.contains("highlighted")) {
          highlightOption.querySelector(".text").textContent = "Highlight";
          commentMessage.classList.remove("highlighted");
        } else {
          highlightOption.querySelector(".text").textContent = "Unhighlight";
          commentMessage.classList.add("highlighted");
        }
        return;
      }

      if (e.target.closest('[data-type="report"]')) {
        return showGlobalReportModal();
      }

      const optionBtn = e.target.closest(".comment-item-option");
      if (optionBtn) {
        const isExpanded = optionBtn.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          optionBtn.setAttribute("aria-expanded", false);
        } else {
          optionBtn.setAttribute("aria-expanded", true);
        }
      }
    });
  });

  // Like Comment
  const commentLGroup = commentContainers.querySelectorAll(".comment-l-group");
  commentLGroup.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const hasLiked = thumb.classList.contains("liked");

      if (hasLiked) {
        thumb.classList.remove("liked");
      } else {
        thumb.classList.add("liked");
      }
    });
  });

  // Show Reply Comments
  const commentReply = commentContainers.querySelectorAll(".comment-reply");
  commentReply.forEach((reply) => {
    reply.addEventListener("click", () => {
      const commentThread = reply.closest(".comment-thread");
      const nextElementSibling = commentThread.nextElementSibling;

      if (nextElementSibling.classList.contains("replies")) {
        nextElementSibling.classList.remove(HIDDEN);
      }
    });
  });

  // Show Reply To Comment Input
  const addCommentToComment = commentContainers.querySelectorAll(".add_comment_to_comment");
  addCommentToComment.forEach((form) => {
    form.addEventListener("click", () => {
      const commentThread = form.closest(".comment-thread");
      const replyToComment = commentThread.querySelector(".reply_to_comment");
      const allReplyToComment = commentContainers.querySelectorAll(".reply_to_comment");

      allReplyToComment.forEach((reply) => reply.classList.add(HIDDEN));
      replyToComment.classList.remove(HIDDEN);
    });
  });

  // Show Emoji Modal
  const commentReplyInputWithEmojis = commentContainers.querySelectorAll(".commentReplyInputWithEmoji");
  commentReplyInputWithEmojis.forEach((emoji) => {
    emoji.addEventListener("click", (e) => showCommentModalEmoji());
  });

  // Listen for Submit Reply Input content
  const addNewReplyCommentBtns = commentContainers.querySelectorAll(".add_new_reply_comment");
  addNewReplyCommentBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const replyToComment = btn.closest(".reply_to_comment");
      const editor = replyToComment.querySelector('[contenteditable="true"]');

      if (!editor.innerHTML.length || editor.innerHTML === "Add a reply...") return;

      const newComment = {
        photo: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
        content: editor.innerHTML,
        date: "1 seconds ago",
      };

      const markup = createCommentHtml(newComment);

      const commentThread = btn.closest(".comment-thread");
      const nextElementSibling = commentThread.nextElementSibling;

      if (nextElementSibling.classList.contains("replies")) {
        nextElementSibling.insertAdjacentHTML("beforeend", markup);
      } else {
        const replyContainer = document.createElement("div");
        replyContainer.classList.add("replies");

        // Insert it after commentThread
        commentThread.insertAdjacentElement("afterend", replyContainer);

        // Now append the new comment to it
        replyContainer.insertAdjacentHTML("beforeend", markup);

        editor.innerHTML = "Add a reply...";

        // Hide input fields
        return hideAllReplyCommentInputFields();
      }
    });
  });
}

function hideAllReplyCommentInputFields() {
  const allReplyToComment = document.querySelectorAll(".reply_to_comment");
  allReplyToComment.forEach((reply) => reply.classList.add(HIDDEN));
}

// Hide reply to comment
document.addEventListener("click", (e) => {
  if (!e.target.closest(".comment-thread")) return hideAllReplyCommentInputFields();
});

// Function to render replies
function renderReplies(replies) {
  return replies
    .map(
      (reply) => `
      <div class="comment-contents">
        <img src="images/img5.jpg" class="comment-sender-avatar rounded-full" />
        <div class="comment-message-container">
          <p class="comment-message">Short sample Short sample comment Short sample comment</p>
          <div class="comment-tlr-group">
            <span class="comment-time">1 min ago</span>
            <div class="comment-lr-group hidden hide">
              <span class="comment-l-group"><span class="likes material-symbols-outlined">thumb_up</span><span class="count-likes">2.4k</span></span>
              <a href="#" class="comment-reply">Reply 1</a>
              <a href="#" class="w-4 h-4 font-medium material-symbols-outlined">message</a>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

// Interest Comment Modal
const interestsCommentModal = document.getElementById("interestsCommentModal");
interestsCommentModal.addEventListener("click", showInterestSliderDropdown);
