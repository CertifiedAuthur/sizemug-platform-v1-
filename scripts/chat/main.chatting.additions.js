const chatSelectTasksBtns = document.querySelectorAll(".chatSelectTasks");
const chatRecentMediasElements = document.querySelectorAll(".chatRecentMedias");
const chatTasksContainers = document.querySelectorAll(".chatTasksContainer");

const chatTasksModal = document.getElementById("chatTasksModal");
const seeAllRecentTasksBtn = document.querySelector(".seeAllRecentTasks");

const taskWithUserItems = document.getElementById("taskWithUserItems");
const additionalChatModalContainer = document.getElementById("additionalChatModalContainer");
let additionalChatModalContainerPopper;

let recentAddtionalReferenceBtn;
let recentAddtionalTrackerId;
let isRecentAddtionalModal; // Boolean

function showAdditionalChatModalContainer(referenceBtn, trackerId, modal = false) {
  hideAdditionalChatModalContainer();

  additionalChatModalContainer.dataset.trackerId = trackerId;
  additionalChatModalContainer.classList.remove(HIDDEN);

  recentAddtionalReferenceBtn = referenceBtn;
  recentAddtionalTrackerId = trackerId;

  if (modal) {
    isRecentAddtionalModal = true;
    additionalChatModalContainer.classList.add("modal");
  } else {
    isRecentAddtionalModal = false;
    additionalChatModalContainer.classList.remove("modal");
    // Create new popper for modal
    additionalChatModalContainerPopper = Popper.createPopper(referenceBtn, additionalChatModalContainer, {
      placement: "bottom-start",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "preventOverflow", options: { boundary: "viewport" } },
      ],
    });
  }
}

function hideAdditionalChatModalContainer() {
  additionalChatModalContainer.dataset.trackerId = "";
  additionalChatModalContainer.classList.add(HIDDEN);

  if (additionalChatModalContainerPopper) {
    additionalChatModalContainerPopper.destroy();
    additionalChatModalContainerPopper = null;
  }
}

async function renderChatMessageRecent(container) {
  const medias = await generateUsersWithTasks(12);

  storedPreviewMediaData = medias;

  if (medias) {
    medias.forEach((media) => {
      const { id, hasVideo, taskVideoThumbnail, taskImages } = media;
      const thumbnail = hasVideo ? taskVideoThumbnail : taskImages[0];

      const markup = `
        <li class="recent_task_item" role="button" data-media-id="${id}" tabindex="0">
           <img src="${thumbnail}" alt="${media.username}" />

           ${
             hasVideo
               ? `
              <button>
              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
              </button`
               : ""
           }
        </li>
    `;

      container.insertAdjacentHTML("beforeend", markup);
    });
  }
}

chatRecentMediasElements.forEach((el, i) => {
  setTimeout(() => {
    renderChatMessageRecent(el);
  }, 2000 * (i + 1));
});

chatRecentMediasElements.forEach((el) => {
  el.addEventListener("click", (e) => {
    const recentTaskItem = e.target.closest(".recent_task_item");

    if (recentTaskItem) {
      const mediaId = recentTaskItem.dataset.mediaId;

      if (mediaId) {
        console.log(mediaId);
        console.log(storedPreviewMediaData);
        showVideosImagesPreviewModal(+mediaId);
      }
    }
  });
});

// Self clicked :)
additionalChatModalContainer.addEventListener("click", (e) => {
  if (e.target.id === "additionalChatModalContainer") {
    hideAdditionalChatModalContainer();
  }
});

function hideAdditionalChatModalContainer() {
  additionalChatModalContainerPopper?.destroy();
  additionalChatModalContainerPopper = null;
  additionalChatModalContainer.classList.add(HIDDEN);
}

chatSelectTasksBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const { trackerId } = button.dataset;

    if ((currentMaxOpenedChat === 3 && [2, 3].includes(+trackerId)) || (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(+trackerId))) {
      showAdditionalChatModalContainer(button, trackerId, true);
      return;
    }

    showAdditionalChatModalContainer(button, trackerId);
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".chatSelectTasks") && !e.target.closest("#additionalChatModalContainer")) {
    hideAdditionalChatModalContainer();
  }
});

seeAllRecentTasksBtn.addEventListener("click", (e) => {
  hideAdditionalChatModalContainer(); // Hide add new task modal
  hideAllChatSectionContainers();
  document.getElementById("tasksTabContainer").classList.remove(HIDDEN);
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

const addNewTaskWithThisUserBtns = document.querySelectorAll(".addNewTaskWithThisUser");

function showAddNewTaskWithThisUserModal() {
  hideAdditionalChatModalContainer();
  window.ChatCreateTask.showCreateTaskWithUser();
}

function hideAddNewTaskWithThisUserModal() {
  window.ChatCreateTask.hideCreateTaskWithUser();
}

addNewTaskWithThisUserBtns.forEach((button) => {
  button.addEventListener("click", () => {
    window.ChatCreateTask.showCreateTaskWithUser();
  });
});
