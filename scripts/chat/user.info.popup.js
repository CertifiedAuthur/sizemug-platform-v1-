const userInfoPopupTab = document.getElementById("userInfoPopupTab");
const allPopupTabButtons = userInfoPopupTab.querySelectorAll("button");
const closeUserInfoPopup = document.getElementById("closeUserInfoPopup");
const userInfoPopupModal = document.getElementById("userInfoPopup");
const seeAllChatMediasElements = document.querySelectorAll(".seeAllChatMedias");

const userInfoPopupContainerLists = document.getElementById("userInfoPopupContainerLists");
const videosImagesPreviewModal = document.getElementById("videosImagesPreviewModal");
// Footer
const userInfoPopupFooterDelete = document.getElementById("userInfoPopupFooterDelete");
const userInfoPopupFooterDeleteCancel = document.getElementById("userInfoPopupFooterDeleteCancel");
const userInfoPopupFooterDeleteBtn = document.getElementById("userInfoPopupFooterDeleteBtn");

const userInfoPopupFooterShare = document.getElementById("userInfoPopupFooterShare");
const userInfoPopupFooterShareCancel = document.getElementById("userInfoPopupFooterShareCancel");
const userInfoPopupFooterShareBtn = document.getElementById("userInfoPopupFooterShareBtn");

const replyFromPreview = document.getElementById("replyFromPreview");

let currentPopupTab = "medias";
let mediaActionOption = "delete";
let replyMessageInElement;

function hideAllInfoPopupCheckboxes() {
  const allInfoPopupCheckbox = document.querySelectorAll(".info_popup_checkbox");

  // Hide all delete checkboxes :)
  allInfoPopupCheckbox.forEach((checkbox) => {
    checkbox.classList.remove("active");
    checkbox.setAttribute("aria-selected", false);
  });
}

// Reply From Preview :)
replyFromPreview.addEventListener("click", (e) => {
  if (!replyMessageInElement) return;

  const messageIn = replyMessageInElement.closest(".message_in");
  const { messageId } = messageIn.dataset;

  videosImagesPreviewModal.classList.add(HIDDEN);
  handleReplyToMessage(messageId, currentOpenedChatContainer);
});

// Tab Items
userInfoPopupTab.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const { tab } = button.dataset || "medias";

    const container = document.getElementById(`${tab}UserContainer`);
    const allContainer = document.querySelectorAll(".userInfoSideContainer");

    currentPopupTab = tab;
    allPopupTabButtons.forEach((btn) => btn.setAttribute("aria-selected", false));
    allContainer.forEach((container) => container.classList.add(HIDDEN));
    hideAllInfoPopupCheckboxes();

    button.setAttribute("aria-selected", true);
    container.classList.remove(HIDDEN);
  }
});

// Modal
userInfoPopupModal.addEventListener("click", (e) => {
  if (e.target.id === "userInfoPopup") {
    userInfoPopupModal.classList.add(HIDDEN);
  }
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Media Container Event
let currentPlayingVoiceNote;
userInfoPopupContainerLists.addEventListener("click", (e) => {
  // Delete Media Item
  const infoPopupCheckbox = e.target.closest(".info_popup_checkbox");
  if (infoPopupCheckbox) {
    const isSelected = infoPopupCheckbox.getAttribute("aria-selected") === "true";

    const mediaItem = infoPopupCheckbox.closest(".media_item");
    const { media, mediaType } = mediaItem.dataset;

    if (isSelected) {
      infoPopupCheckbox.setAttribute("aria-selected", false);

      // located in global.variables.js
      shareMedias = shareMedias.filter((item) => item.media !== media);
    } else {
      infoPopupCheckbox.setAttribute("aria-selected", true);
      if (mediaType === "video") {
        shareMedias.push({
          id: shareMedias.length + 1,
          type: "video",
          media,
        });
      } else if (mediaType === "image") {
        shareMedias.push({
          id: shareMedias.length + 1,
          type: "image",
          media,
        });
      }
    }

    if (mediaActionOption === "share") {
      showUserInfoPopupFooterShare();
    } else if (mediaActionOption === "delete") {
      showUserInfoPopupFooterDelete();
    }

    return;
  }

  // Preview Medias || Photo(s) & Video(s)
  const mediaImage = e.target.closest(".media_image");
  const mediaVideo = e.target.closest(".media_video") || e.target.closest(".userInfoMediaPlayVideo");
  if (mediaImage || mediaVideo) {
    const videosImagesPreviewMain = document.getElementById("videosImagesPreviewMain");
    const image = videosImagesPreviewMain.querySelector("img");
    const video = videosImagesPreviewMain.querySelector("video");

    if (mediaImage) {
      image.classList.remove(HIDDEN);
      video.classList.add(HIDDEN);

      videosImagesPreviewMain.setAttribute("data-type", "image");
    } else {
      image.classList.add(HIDDEN);
      video.classList.remove(HIDDEN);

      videosImagesPreviewMain.setAttribute("data-type", "video");
    }

    const mediaItem = e.target.closest(".media_item");
    const mediaImageId = Number(mediaItem.dataset.mediaId);
    console.log(mediaImageId);

    hideUserInfoPopup();
    showVideosImagesPreviewModal(mediaImageId);
    return;
  }

  // Play Voice Notes
  const playNoteBtn = e.target.closest(".play_note");
  if (playNoteBtn) {
    const noteRow = playNoteBtn.closest(".note_row");
    const noteTrack = noteRow.querySelector(".note_track");

    const { mode, music } = playNoteBtn.dataset;

    if (mode === "idle") {
      if (currentPlayingVoiceNote) {
        currentPlayingVoiceNote.currentTime = 0;
        currentPlayingVoiceNote.pause();
        // Reset all buttons
        const playNoteBtns = document.querySelectorAll("#voicesUserContainer .play_note");
        const noteTracks = document.querySelectorAll("#voicesUserContainer .note_track");

        playNoteBtns.forEach((noteBtn) => noteBtn.setAttribute("data-mode", "idle"));
        noteTracks.forEach((track) => (track.style.width = "100%"));
      }

      currentPlayingVoiceNote = new Audio(music);

      currentPlayingVoiceNote.play();
      playNoteBtn.dataset.mode = "playing";
    }

    if (mode === "playing" && currentPlayingVoiceNote) {
      currentPlayingVoiceNote.pause();
      playNoteBtn.dataset.mode = "pause";
    }

    if (mode === "pause" && currentPlayingVoiceNote) {
      currentPlayingVoiceNote.play();
      playNoteBtn.dataset.mode = "playing";
    }

    currentPlayingVoiceNote.addEventListener("loadedmetadata", () => {
      // The below conditional statement is compulsory for getting accurate audio duration for a blob type
      if (currentPlayingVoiceNote.duration === Infinity) {
        currentPlayingVoiceNote.currentTime = 1e101;
        currentPlayingVoiceNote.ontimeupdate = () => {
          currentPlayingVoiceNote.ontimeupdate = null;
          currentPlayingVoiceNote.currentTime = 0;
        };
      }
    });

    currentPlayingVoiceNote.addEventListener("timeupdate", () => {
      const progress = (currentPlayingVoiceNote.currentTime / currentPlayingVoiceNote.duration) * 100;
      noteTrack.style.width = `${progress}%`;
    });

    currentPlayingVoiceNote.addEventListener("ended", () => {
      playNoteBtn.dataset.mode = "idle";
    });
    return;
  }
});

closeUserInfoPopup.addEventListener("click", hideUserInfoPopup);

seeAllChatMediasElements.forEach((button) => {
  button.addEventListener("click", () => {
    showUserInfoPopup();
    hideAdditionalChatModalContainer();
    hideAdditionalChatModalContainer();
    renderPopupMedia();
  });
});

userInfoPopupFooterDeleteCancel.addEventListener("click", hideUserInfoPopupFooterDelete);
userInfoPopupFooterShareCancel.addEventListener("click", hideUserInfoPopupFooterShare);

userInfoPopupFooterShareBtn.addEventListener("click", () => {});

function showUserInfoPopup() {
  userInfoPopupModal.classList.remove(HIDDEN);
}

function hideUserInfoPopup() {
  userInfoPopupModal.classList.add(HIDDEN);
}

function showVideosImagesPreviewModal(mediaId) {
  videosImagesPreviewModal.classList.remove(HIDDEN);
  new ManageMediaPreviewSlider({ currentMediaId: mediaId, medias: storedPreviewMediaData });
}

function hideVideosImagesPreviewModal() {
  videosImagesPreviewModal.classList.add(HIDDEN);
}

function showUserInfoPopupFooterDelete() {
  userInfoPopupFooterDelete.classList.remove(HIDDEN);

  // animation
  userInfoPopupFooterDelete.classList.remove("animate__slideOutDown");
  userInfoPopupFooterDelete.classList.add("animate__slideInUp");
}

function hideUserInfoPopupFooterDelete() {
  userInfoPopupFooterDelete.classList.add(HIDDEN);

  // animation
  userInfoPopupFooterDelete.classList.remove("animate__slideInUp");
  userInfoPopupFooterDelete.classList.add("animate__slideOutDown");

  hideAllInfoPopupCheckboxes();
}

function showUserInfoPopupFooterShare() {
  userInfoPopupFooterShare.classList.remove(HIDDEN);

  // animation
  userInfoPopupFooterShare.classList.remove("animate__slideOutDown");
  userInfoPopupFooterShare.classList.add("animate__slideInUp");
}

function hideUserInfoPopupFooterShare() {
  userInfoPopupFooterShare.classList.add(HIDDEN);

  // animation
  userInfoPopupFooterShare.classList.remove("animate__slideInUp");
  userInfoPopupFooterShare.classList.add("animate__slideOutDown");

  hideAllInfoPopupCheckboxes();
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Media Share & Delete Options
const userInfoMediaOptionsBtn = document.getElementById("userInfoMediaOptions");

userInfoMediaOptionsBtn.addEventListener("click", function (e) {
  e.stopPropagation();

  const svg = e.target.closest("svg");

  if (svg) {
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);

    return;
  }

  // Share Button
  const shareBtn = e.target.closest(`[data-option="share"]`);
  if (shareBtn) {
    // Share Handler
    mediaActionOption = "share";
  }

  // Delete Button
  const deleteBtn = e.target.closest(`[data-option="delete"]`);
  if (deleteBtn) {
    // Delete Handler
    mediaActionOption = "delete";
  }

  const container = document.getElementById(`${currentPopupTab}UserContainer`);
  const infoPopupCheckboxBtns = container.querySelectorAll(".info_popup_checkbox");

  infoPopupCheckboxBtns.forEach((btn) => {
    btn.classList.add("active");
  });

  hideUserInfoOptionDropdown();
});

// Close Dropdown
document.addEventListener("click", (e) => {
  if (!e.target.closest("#userInfoMediaOptions")) {
    hideUserInfoOptionDropdown();
  }
});

function hideUserInfoOptionDropdown() {
  userInfoMediaOptionsBtn.setAttribute("aria-expanded", false);
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
const mediaOnlyUserInfoContainer = document.getElementById("mediaOnlyUserInfoContainer");
// https://plus.unsplash.com/premium_photo-1671411322574-e6dd4eea0183?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D
// let storedPreviewMediaData = [];

function renderPopupMedia() {
  if (!storedPreviewMediaData.length) return;

  const todayData = storedPreviewMediaData.slice(0, 6); /* 1 - 6 */
  const otherData = storedPreviewMediaData.slice(6); /* 7 - 12 */

  const [todayContainer = container, todayMediaGrid = mediaGridLists] = generateSetup("Today");
  const [septemberContainer = container, septemberMediaGrid = mediaGridLists] = generateSetup("September, 2022");

  // Today
  todayData.forEach((media) => {
    const markup = generateMediaMarkup(media);
    todayMediaGrid.insertAdjacentHTML("beforeend", markup);
  });
  mediaOnlyUserInfoContainer.appendChild(todayContainer);

  // September
  otherData.forEach((media) => {
    const markup = generateMediaMarkup(media);
    septemberMediaGrid.insertAdjacentHTML("beforeend", markup);
  });
  mediaOnlyUserInfoContainer.appendChild(septemberContainer);
}

function generateSetup(title) {
  const container = document.createElement("div");
  const mediaGridLists = document.createElement("div");
  const h2 = document.createElement("h2");

  container.classList.add("user_info_item_container");
  mediaGridLists.classList.add("media_grid_lists");
  mediaGridLists.id = `media_grid_lists--${title}`;

  h2.textContent = title;
  container.appendChild(h2);
  container.appendChild(mediaGridLists);

  return [container, mediaGridLists];
}

function generateMediaMarkup(media) {
  const { id, hasVideo, taskVideoThumbnail, taskImages, taskVideo, username } = media;

  return `
    <div data-media-id="${id}" data-media="${hasVideo ? taskVideo : taskImages[0]}" class="media_item" data-media-type="${hasVideo ? "video" : "image"}">
    ${
      !hasVideo
        ? `<img src="${taskImages[0]}" alt="${username}" class="media_image" />`
        : `
          <video src="${taskVideo}" class="${HIDDEN}"></video>
          <img src="${taskVideoThumbnail}" alt="${username}" class="media_image" />
          <div class="user_info_video_overlay">
            <button class="userInfoMediaPlayVideo">
              <!-- prettier-ignore -->
              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
              <!-- <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z" /></svg> -->
            </button>
          </div>`
    }
      <button class="info_popup_checkbox">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 2048 2048"><path fill="#fff" d="M1837 557L768 1627l-557-558l90-90l467 466l979-978z"/></svg>
      </button>
    </div>
`;
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Share Media Following/Follower Modal
const shareMediaFollowFooterCancel = document.getElementById("shareMediaFollowFooterCancel");
const shareMediaFollowModal = document.getElementById("shareMediaFollowModal");
const shareMediaFollowModalHeader = document.getElementById("shareMediaFollowModalHeader");
const shareMediaFollowFooterNext = document.getElementById("shareMediaFollowFooterNext");

shareMediaFollowModalHeader.addEventListener("click", function (e) {
  const button = e.target.closest("button");
  const buttons = this.querySelectorAll("button");

  if (button) {
    buttons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (button.classList.contains("following--btn")) {
      document.getElementById("shareFollowingsContainer").classList.remove(HIDDEN);
      document.getElementById("shareFollowersContainer").classList.add(HIDDEN);
    } else {
      document.getElementById("shareFollowersContainer").classList.remove(HIDDEN);
      document.getElementById("shareFollowingsContainer").classList.add(HIDDEN);
    }
  }
});

shareMediaFollowModal.addEventListener("click", (e) => {
  if (e.target.id === "shareMediaFollowModal") {
    shareMediaFollowModal.classList.add(HIDDEN);
  }
});

shareMediaFollowFooterCancel.addEventListener("click", () => {
  shareMediaFollowModal.classList.add(HIDDEN);
});

// Share Media Logic
userInfoPopupFooterShareBtn.addEventListener("click", () => {
  shareMediaFollowModal.classList.remove(HIDDEN);
});

shareMediaFollowFooterNext.addEventListener("click", () => {
  updateTheEntirePreviewLogic(shareMedias);

  shareMediaFollowModal.classList.add(HIDDEN);
  userInfoPopupModal.classList.add(HIDDEN);
  hideAllInfoPopupCheckboxes();
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
 *
 *
 */
class ManageMediaPreviewSlider {
  constructor({ currentMediaId = null, medias = [] }) {
    this.medias = medias;
    this.currentMediaId = currentMediaId;
    this.currentMediaIndex = this._getIndexFromId(currentMediaId);

    this.containerPreviewItemsRight = document.getElementById("containerPreviewItemsRight");
    this.containerPreviewItemsLeft = document.getElementById("containerPreviewItemsLeft");
    this.startPlayingPreviewVideo = document.getElementById("startPlayingPreviewVideo");
    this.videosImagesPreviewMain = document.getElementById("videosImagesPreviewMain");
    this.collapseVideosImagesModalBtn = document.getElementById("collapseVideosImagesModalBtn");
    this.downloadCurrentMediaPreview = document.getElementById("downloadCurrentMediaPreview");
    this.mediaPreviewModalOption = document.getElementById("mediaPreviewModalOption");
    this.mediaPreviewModalOptions = document.getElementById("mediaPreviewModalOptions");

    //
    this._init();
  }

  _init() {
    if (this.medias?.length <= 0) {
      throw new Error("media must be an array with valid values 😤");
    }

    if (this.currentMediaIndex === -1) {
      throw new Error("Invalid media ID provided - media not found in the array");
    }

    // Initial update of slider buttons :)
    this._updateSliderButtons();

    //
    this._updateMediaSliderCount();

    //
    this._attachEvent();

    //
    this._loadMedia();
  }

  // Helper method to get index from media ID
  _getIndexFromId(mediaId) {
    if (!mediaId) {
      return this.medias.length > 0 ? 0 : -1;
    }

    const index = this.medias.findIndex((media) => media.id === mediaId);
    return index !== -1 ? index : -1;
  }

  // Helper method to get media ID from index
  _getIdFromIndex(index) {
    const media = this.medias[index];
    return media ? media.id : null;
  }

  // Method to update current media by ID
  _setCurrentMediaById(mediaId) {
    const newIndex = this._getIndexFromId(mediaId);
    if (newIndex !== -1) {
      this.currentMediaId = mediaId;
      this.currentMediaIndex = newIndex;
      return true;
    }
    return false;
  }

  // Method to move to next media
  _moveToNextMedia() {
    if (this.currentMediaIndex < this.medias.length - 1) {
      this.currentMediaIndex++;
      this.currentMediaId = this._getIdFromIndex(this.currentMediaIndex);
      return true;
    }
    return false;
  }

  // Method to move to previous media
  _moveToPreviousMedia() {
    if (this.currentMediaIndex > 0) {
      this.currentMediaIndex--;
      this.currentMediaId = this._getIdFromIndex(this.currentMediaIndex);
      return true;
    }
    return false;
  }

  //
  _attachEvent() {
    //
    this.containerPreviewItemsRight.addEventListener("click", () => {
      if (this._moveToNextMedia()) {
        this._updateSliderButtons();
        this._updateMediaSliderCount();
        this._loadMedia();
      }
    });

    //
    this.containerPreviewItemsLeft.addEventListener("click", () => {
      if (this._moveToPreviousMedia()) {
        this._updateSliderButtons();
        this._updateMediaSliderCount();
        this._loadMedia();
      }
    });

    //
    this.startPlayingPreviewVideo.addEventListener("click", () => {
      const currentVideo = this.videosImagesPreviewMain.querySelector("video.active");

      const { mode } = this.startPlayingPreviewVideo.dataset;

      if (mode === "idle" || mode === "pause") {
        currentVideo.play();
        this.startPlayingPreviewVideo.dataset.mode = "play";
      } else {
        currentVideo.pause();
        this.startPlayingPreviewVideo.dataset.mode = "pause";
      }

      currentVideo.addEventListener("ended", () => {
        currentVideo.currentTime = 0;
        this.startPlayingPreviewVideo.dataset.mode = "idle";
      });
    });

    //
    this.collapseVideosImagesModalBtn.addEventListener("click", () => {
      const currentVideo = this.videosImagesPreviewMain.querySelector("video.active");
      currentVideo.pause();
      this.startPlayingPreviewVideo.dataset.mode = "idle";
      currentVideo.currentTime = 0;

      hideVideosImagesPreviewModal();
    });

    //  Download
    this.downloadCurrentMediaPreview.addEventListener("click", async (e) => {
      try {
        const main = this.videosImagesPreviewMain;
        const type = main.getAttribute("data-type"); // "image" or "video"
        const container = document.querySelector(".container_preview_item_image");
        const imageElement = container.querySelector("img");
        const videoElement = container.querySelector("video");

        // Get current src depending on type
        const src = type === "video" ? videoElement?.src || "" : imageElement?.src || "";
        if (!src) throw new Error("No media source found.");

        // Build a friendly filename using current media
        const currentMedia = this.medias[this.currentMediaIndex];
        const base = `${this._sanitizeFilename(currentMedia.taskTitle || "media")}_${currentMedia.username || "user"}_${currentMedia.id || this.currentMediaIndex + 1}`;
        const ext = this._getExtensionFromSrcOrFallback(src, type);
        const filename = `${base}.${ext}`;

        // If src is data: or blob: or same origin with no CORS issues, try direct anchor download
        if (src.startsWith("data:") || src.startsWith("blob:") || this._isLikelySameOrigin(src)) {
          this._downloadUrl(src, filename);
          return;
        }

        // Otherwise fetch the resource and download as blob
        const blob = await this._fetchAsBlobWithCORS(src);
        if (!blob) throw new Error("Failed to fetch media (CORS or network issue).");

        const blobUrl = URL.createObjectURL(blob);
        this._downloadUrl(blobUrl, filename);
        // revoke after a short delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000 * 10);
      } catch (err) {
        console.error("Download failed:", err);
        // user-facing fallback / message - you can replace with your UI flash
        alert(`Could not download media: ${err.message}. If it's a remote file, CORS might be blocking the fetch. Consider enabling CORS on the server or proxying the file through your backend.`);
      }
    });

    //
    this.mediaPreviewModalOption.addEventListener("click", () => {
      const isExpanded = this.mediaPreviewModalOption.getAttribute("aria-expanded") === "true";

      this.mediaPreviewModalOption.setAttribute("aria-expanded", !isExpanded);

      // Outside click
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".call_modal_actions--media-preview")) {
          this.mediaPreviewModalOption.setAttribute("aria-expanded", false);
        }
      });
    });

    this.mediaPreviewModalOptions.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");
      const action = listItem.dataset.action;

      if (listItem) {
        if (action === "share") {
          showGlobalFollowingModal();
        } else {
          showGlobalDiscardModal();
        }
      }
    });
  }

  //
  _loadMedia() {
    const media = this.medias[this.currentMediaIndex];

    if (!media) {
      throw new Error("There is no media for that index provided :)");
    }

    const currentMedia = media.hasVideo ? media.taskVideo : media.taskImages[0];

    const containerPreviewItemImage = document.querySelector(".container_preview_item_image");
    const imageElement = containerPreviewItemImage.querySelector("img");
    const videoElement = containerPreviewItemImage.querySelector("video");

    const previewItemCaption = document.getElementById("previewItemCaption");
    const captionContent = previewItemCaption.querySelector(".content");
    const captionWhoTrack = previewItemCaption.querySelector(".who_track");
    const captionDayTrack = previewItemCaption.querySelector(".day_track");
    const captionDayTime = previewItemCaption.querySelector(".time_track");

    videoElement.currentTime = 0;
    this.startPlayingPreviewVideo.dataset.mode = "idle";

    captionDayTime.textContent = media.date;
    captionWhoTrack.textContent = media.username;
    captionContent.textContent = media.taskTitle;

    if (media.hasVideo) {
      imageElement.classList.add(HIDDEN);
      videoElement.classList.remove(HIDDEN);
      videoElement.src = currentMedia;
      this.videosImagesPreviewMain.setAttribute("data-type", "video");
    } else {
      videoElement.classList.add(HIDDEN);
      imageElement.classList.remove(HIDDEN);
      imageElement.src = currentMedia;
      this.videosImagesPreviewMain.setAttribute("data-type", "image");
    }
  }

  //
  _updateMediaSliderCount() {
    const currentMediaCount = document.getElementById("currentMediaCount");
    currentMediaCount.textContent = `${this.currentMediaIndex + 1} of ${this.medias.length}`;
  }

  //
  _updateSliderButtons() {
    if (this.currentMediaIndex < 0 || !this.medias[this.currentMediaIndex]) {
      this.containerPreviewItemsLeft.disabled = true;
      this.containerPreviewItemsRight.disabled = true;
      return;
    }

    // Slide Left button
    if (this.currentMediaIndex <= 0) {
      this.containerPreviewItemsLeft.disabled = true;
      this.containerPreviewItemsLeft.classList.add(HIDDEN);
    } else {
      this.containerPreviewItemsLeft.disabled = false;
      this.containerPreviewItemsLeft.classList.remove(HIDDEN);
    }

    // Slide Right button
    if (this.currentMediaIndex >= this.medias.length - 1) {
      this.containerPreviewItemsRight.disabled = true;
      this.containerPreviewItemsRight.classList.add(HIDDEN);
    } else {
      this.containerPreviewItemsRight.disabled = false;
      this.containerPreviewItemsRight.classList.remove(HIDDEN);
    }
  }

  // ---------- Public API methods ----------

  // Get current media ID
  getCurrentMediaId() {
    return this.currentMediaId;
  }

  // Get current media object
  getCurrentMedia() {
    return this.medias[this.currentMediaIndex];
  }

  // Navigate to specific media by ID
  navigateToMedia(mediaId) {
    if (this._setCurrentMediaById(mediaId)) {
      this._updateSliderButtons();
      this._updateMediaSliderCount();
      this._loadMedia();
      return true;
    }
    return false;
  }

  // Reset everything and cleanup
  _resetAndCleanup() {
    // Stop and reset any playing video
    const currentVideo = this.videosImagesPreviewMain.querySelector("video.active");
    if (currentVideo) {
      currentVideo.pause();
      currentVideo.currentTime = 0;
    }

    // Reset video controls
    if (this.startPlayingPreviewVideo) {
      this.startPlayingPreviewVideo.dataset.mode = "idle";
    }

    // Reset modal options
    if (this.mediaPreviewModalOption) {
      this.mediaPreviewModalOption.setAttribute("aria-expanded", "false");
    }

    // Clear all media sources
    const containerPreviewItemImage = document.querySelector(".container_preview_item_image");
    if (containerPreviewItemImage) {
      const imageElement = containerPreviewItemImage.querySelector("img");
      const videoElement = containerPreviewItemImage.querySelector("video");

      if (imageElement) {
        imageElement.src = "";
        imageElement.classList.add("HIDDEN");
      }
      if (videoElement) {
        videoElement.src = "";
        videoElement.classList.add("HIDDEN");
      }
    }

    // Clear caption content
    const previewItemCaption = document.getElementById("previewItemCaption");
    if (previewItemCaption) {
      const captionContent = previewItemCaption.querySelector(".content");
      const captionWhoTrack = previewItemCaption.querySelector(".who_track");
      const captionDayTrack = previewItemCaption.querySelector(".day_track");
      const captionDayTime = previewItemCaption.querySelector(".time_track");

      if (captionContent) captionContent.textContent = "";
      if (captionWhoTrack) captionWhoTrack.textContent = "";
      if (captionDayTrack) captionDayTrack.textContent = "";
      if (captionDayTime) captionDayTime.textContent = "";
    }

    // Clear media counter
    const currentMediaCount = document.getElementById("currentMediaCount");
    if (currentMediaCount) {
      currentMediaCount.textContent = "";
    }

    // Remove all tracked event listeners
    this._removeAllEventListeners();

    // Reset internal state
    this.currentMediaId = null;
    this.currentMediaIndex = -1;
    this.medias = [];
  }

  // Remove all tracked event listeners
  _removeAllEventListeners() {
    for (const [element, listeners] of this.eventListeners) {
      listeners.forEach(({ event, handler, options }) => {
        element.removeEventListener(event, handler, options);
      });
    }
    this.eventListeners.clear();
  }

  // Public method to destroy the slider
  destroy() {
    this._resetAndCleanup();
  }

  // ---------- Download Helper functions ----------
  _sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_\-\.]/gi, "_").slice(0, 120);
  }

  _downloadUrl(url, filename) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    // In some browsers you need to append to DOM for click to work reliably
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  _getExtensionFromSrcOrFallback(src, type) {
    try {
      // try extract from URL path
      const path = new URL(src, window.location.href).pathname;
      const m = path.match(/\.([a-zA-Z0-9]{2,8})(?:$|\?)/);
      if (m) return m[1].toLowerCase();
    } catch (e) {
      // ignore parsing failure
    }
    // fallback by type
    return type === "video" ? "mp4" : "jpg";
  }

  _isLikelySameOrigin(url) {
    try {
      const u = new URL(url, window.location.href);
      return u.origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  async _fetchAsBlobWithCORS(url) {
    // try fetch normally — if CORS blocks it, this will throw or return opaque response
    const resp = await fetch(url, { mode: "cors" });
    // opaque responses cannot be consumed as blob reliably; check status/type
    if (!resp.ok || resp.type === "opaque") {
      // Could still be ok but opaque (no CORS). Treat as error.
      throw new Error("Network/CORS error fetching resource.");
    }
    const blob = await resp.blob();
    return blob;
  }
}

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
 *
 *
 */
class ManageDocument {
  constructor() {
    this.filesUserContainer = document.getElementById("filesUserContainer");
    this.docPreviewHideBtn = document.getElementById("docPreviewHideBtn");
    this.sizemugDocPreview = document.getElementById("sizemugDocPreview");

    this._onClickHandler();
  }

  _onClickHandler() {
    this.filesUserContainer.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");
      const docType = listItem.dataset.docType;

      this.sizemugDocPreview.classList.add(HIDDEN);
      if (listItem && docType) {
        if (docType === "pdf") {
          this.sizemugDocPreview.classList.remove(HIDDEN);
          docPreview.load("http://127.0.0.1:5506/assets/documents/book-generator.pdf");
        } else if (docType === "docx") {
          this.sizemugDocPreview.classList.remove(HIDDEN);
          docPreview.load("http://127.0.0.1:5506/assets/documents/microsoft.docx");
        }
      }
    });

    this.docPreviewHideBtn.addEventListener("click", (e) => {
      this.sizemugDocPreview.classList.add(HIDDEN);
    });
  }
}

new ManageDocument();

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
 */
// Chat Space Event Delegation :)
const allChatSpacerArea = document.querySelectorAll(".chat_spacer_area");

allChatSpacerArea.forEach((spacer) => {
  spacer.addEventListener("click", (e) => {
    const chatOnImages = e.target.closest(".chat-on-images");

    // Preview Image from Chat
    if (chatOnImages) {
      const onChatImages = chatOnImages.dataset.onChatImages;
      const images = onChatImages.slice(1, -1);

      replyMessageInElement = chatOnImages.closest(".message_in");

      videosImagesPreviewModal.classList.remove(HIDDEN);
      new ManageMediaPreviewSlider({
        currentMediaId: 45,
        medias: [
          {
            id: 45,
            username: "Liam Johnson",
            userPhoto: "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
            taskTitle: "What's wrong?",
            type: "chat",
            taskImages: [images],
            date: "10 min ago",
            hasVideo: false,
            sizemugUsername: "My unique name",
          },
        ],
      });

      return;
    }

    // Preview Document From Chat
    const chatOnDocument = e.target.closest(".chatOnDocument");
    if (chatOnDocument) {
      const docType = chatOnDocument.dataset.docType;

      if (docType === "pdf") {
        this.sizemugDocPreview.classList.remove(HIDDEN);
        docPreview.load("http://127.0.0.1:5506/assets/documents/book-generator.pdf");
      } else if (docType === "docx") {
        this.sizemugDocPreview.classList.remove(HIDDEN);
        docPreview.load("http://127.0.0.1:5506/assets/documents/microsoft.docx");
      }
      return;
    }
  });
});
