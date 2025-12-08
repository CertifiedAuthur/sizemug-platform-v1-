const asideLists = document.getElementById("aside_lists");
let asideData;

async function renderAsideLists() {
  const data = await generateUsersWithTasks(20);
  asideData = data;

  gridDataItem = data;

  asideLists.innerHTML = "";

  data.forEach((d, i) => {
    const { username, userPhoto, taskTitle, likes, seen, hasVideo, taskVideoThumbnail, taskImages } = d;

    // <img src="${hasVideo ? taskVideoThumbnail : userPhoto}" alt="" />
    const markup = `
           <div class="aside_list" role="button" data-data="${i}">
              <div class="top_part">
                 ${
                   hasVideo
                     ? `
                  <img src="${taskVideoThumbnail}" class="video_thumb" alt="Thumbnail"/>
                  <svg width="1.2em" height="1.2em" id="postRelatedPlay" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                  <video id="gridLayoutVideo" class="${HIDDEN} video" preload="metadata" muted loop src="${d.taskVideo}"></video>
                `
                     : `<img src="${taskImages}" alt="related-attachment" class="post-related-attachment" />`
                 }

                ${
                  hasVideo
                    ? `
                   <button class="aside_item_video" data-mode="idle">
                      <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                      <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                   </button>
                   `
                    : ""
                }

                <div class="position_item">
                  <img src="${userPhoto}" alt="${username}" />
                  <span>${username}</span>
                </div>
              </div>

              <div class="bottom_part">
                <h3>${taskTitle}</h3>

                <div class="reaction_container">
                  <div class="reaction">
                    <button>
                      <img src="/icons/newPaper/aside_eye_icon.svg" alt="" />
                    </button>
                    <span>${seen}k</span>
                  </div>

                  <div class="reaction">
                    <button id="heart_reaction">
                      <!-- prettier-ignore -->
                      <svg width="20" height="20"  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.96647 9.27247L7.60154 13.6266C7.65338 13.6753 7.6793 13.6997 7.70399 13.7177C7.87985 13.8465 8.11885 13.8465 8.29471 13.7177C8.31939 13.6997 8.34531 13.6753 8.39716 13.6266L13.0322 9.27247C14.3363 8.04739 14.4947 6.03139 13.3979 4.6177L13.1917 4.35189C11.8795 2.66071 9.24577 2.94433 8.32379 4.87609C8.19356 5.14896 7.80514 5.14896 7.6749 4.87609C6.75293 2.94433 4.11916 2.66071 2.80705 4.35189L2.60081 4.6177C1.50398 6.03139 1.66235 8.04739 2.96647 9.27247Z" stroke="#33363F"/></svg>
                    </button>
                    <span>${likes}k</span>
                  </div>
                </div>
              </div>
            </div>
    `;
    asideLists.insertAdjacentHTML("beforeend", markup);
  });

  const asideListsEl = asideLists.querySelectorAll(".aside_list");
  asideListsEl.forEach((list) => {
    const video = list.querySelector("video");
    const thumbnail = list.querySelector(".video_thumb");
    const asideItemVideoBtn = list.querySelector(".aside_item_video");

    if (video) {
      list.addEventListener("mouseenter", () => {
        thumbnail.classList.add(HIDDEN);
        video.classList.remove(HIDDEN);
        asideItemVideoBtn.dataset.mode = "play";

        video.play();
        video.loop = true;
      });

      list.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;

        video.classList.add(HIDDEN);
        thumbnail.classList.remove(HIDDEN);
        asideItemVideoBtn.dataset.mode = "idle";
      });
    }
  });
}

renderTemplatesSkeleton(asideLists);
renderAsideLists();

// Events
asideLists.addEventListener("click", (e) => {
  const target = e.target;

  // Heart reaction
  const heartReaction = target.closest("#heart_reaction");
  if (heartReaction) {
    const svg = heartReaction.querySelector("svg");

    if (svg.classList.contains("active")) {
      svg.classList.remove("active");
    } else {
      svg.classList.add("active");
    }
    return;
  }

  // Aside Item
  const asideItem = target.closest(".aside_list");
  if (asideItem) {
    // Get corresponding data object to update landing modal comment
    const { data } = asideItem.dataset;

    showCommentModalGlobalHandler(asideData[+data]);
  }
});

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
const showRightSidebarBtn = document.getElementById("show_right--slider");
const rightSidebarContainer = document.getElementById("aside_container");
const mainContainerBodyLarge = document.getElementById("main_container_body--large");

showRightSidebarBtn.addEventListener("click", () => {
  const sidebarStatus = JSON.parse(rightSidebarContainer.ariaExpanded);
  const toolsNavbarTarget = document.querySelector(".tools_navbar  #tools_navbar_target");

  if (sidebarStatus) {
    rightSidebarContainer.classList.add("collapsed");
    mainContainerBodyLarge.classList.add("expanded");
    rightSidebarContainer.ariaExpanded = false;

    setTimeout(() => {
      rightSidebarContainer.style.display = "none";

      if (innerWidth <= 1420) {
        toolsNavbarTarget.style.width = "100%";
      }
    }, 30);
  } else {
    rightSidebarContainer.classList.remove("collapsed");
    mainContainerBodyLarge.classList.remove("expanded");
    rightSidebarContainer.ariaExpanded = true;
    rightSidebarContainer.style.display = "block";

    if (innerWidth <= 1420) {
      toolsNavbarTarget.style.width = "fit-content";
    }
  }
});

//////////////////////////////
//////////////////////////////
//////////////////////////////
// Render Skeleton Loading
function renderTemplatesSkeleton(container) {
  const ske = Array.from({ length: 20 }, (_, i) => i + 1);

  ske.forEach((s) => {
    const markup = '<div style="height: 150px; border-radius:8px; margin-bottom: 15px" class="skeleton_loading recent_skeleton"></div>';
    container.insertAdjacentHTML("afterbegin", markup);
  });
}

window.addEventListener("resize", () => {
  if (innerWidth <= 1024) {
    setTimeout(() => {
      document.getElementById("tools_navbar--header--input").style.display = "none";
    }, 200);
  }
});
