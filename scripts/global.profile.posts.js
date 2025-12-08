/**
 * Handles click events on the profile tab container.
 * @param {Event} e - The click event.
 */
const profileTabContainer = document.getElementById("profileTabContainer");
profileTabContainer.addEventListener("click", function (e) {
  const tabItem = e.target.closest(".tab-heading");
  const tabHeading = this.querySelectorAll(".tab-heading");

  if (tabItem) {
    const { content } = tabItem.dataset;
    const galleryGrid = document.querySelector(`#${content}GalleryGrid`);
    const tabSections = document.querySelectorAll("#tabSections .post-gallery-grid");

    tabHeading.forEach((label) => label.setAttribute("aria-pressed", false));
    tabSections.forEach((section) => section.classList.add(HIDDEN));

    tabItem.setAttribute("aria-pressed", true);
    galleryGrid.classList.remove(HIDDEN);
  }
});

/**
 * Renders skeleton loading placeholders for global profile posts.
 * @param {HTMLElement} container - The container element to render the skeletons in.
 */
function renderGlobalProfilePostSkeleton(container) {
  const data = Array.from({ length: 20 }, (_, i) => i + 1);

  data.forEach(() => {
    const markup = `<div class="global-profile-skeleton skeleton_loading"></div>`;
    container.insertAdjacentHTML("beforeend", markup);
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
/**
 * Renders global profile posts.
 * @param {HTMLElement} container - The container element to render the posts in.
 */
let profileItemVideoPlaying = false;

function handlePostsVideoPlaying(gridItem) {
  const gridItemVideo = gridItem.querySelector("#postVideo");
  const thumbnail = gridItem.querySelector(".userPostsVideoThumbnail");
  const gridItemTaskVideoButton = gridItem.querySelector(".task_video_play");

  gridItem.addEventListener("mouseenter", () => {
    // Hide the thumbnail and show the video
    thumbnail.classList.add(HIDDEN); // Hide thumbnail
    gridItemVideo.classList.remove(HIDDEN); // Show video to play

    // Reset video time to the beginning
    gridItemVideo.currentTime = 0;

    // Play the video
    gridItemVideo
      .play()
      .then(() => {
        profileItemVideoPlaying = true;

        gridItemTaskVideoButton.setAttribute("data-mode", "play");
        gridItemVideo.setAttribute("data-mode", "play");
      })
      .catch((error) => {
        console.error("Video play error:", error);
      });
  });

  gridItem.addEventListener("mouseleave", () => {
    if (profileItemVideoPlaying) {
      profileItemVideoPlaying = false;

      // Pause the video
      gridItemVideo.pause();
      gridItemVideo.currentTime = 0; // Reset video time to the beginning

      // Hide the video and show the thumbnail
      gridItemVideo.classList.add(HIDDEN); // Hide video to play
      thumbnail.classList.remove(HIDDEN); // Show thumbnail

      gridItemTaskVideoButton.setAttribute("data-mode", "idle");
      gridItemVideo.setAttribute("data-mode", "idle");
    }
  });

  gridItemVideo.addEventListener("ended", () => {
    gridItemVideo.currentTime = 0; // Ensure video resets to the beginning on end
  });
}

function renderGlobalProfilePost(container, posts, showEditingContainer = true, showEditingBadge = true, emptyContent = "", postsAnalyticsButtons = false) {
  const page = location.pathname === "/profile.html" || location.pathname === "/creator-profile.html";
  container.innerHTML = "";

  posts.forEach((post, i) => {
    const { likes, seen, taskImages, hasVideo, taskVideoThumbnail, taskVideo, id, music, audio } = post;

    const markup = `
              <div class="user-post-item user-post-item--${i}" data-grid-item-id="${id}" data-ca>
                      <div class="userPostsImages ${hasVideo ? HIDDEN : ""}">
                        ${taskImages.map((img, i) => `<img src="${img}" class="${i === 0 ? "" : HIDDEN}" data-img-count="${i + 1}" alt="" />`).join("")}
                      </div>

                      <div class="userPostsVideo ${hasVideo ? "" : HIDDEN}">
                        <img src="${taskVideoThumbnail}" class="userPostsVideoThumbnail" alt="" />
                        <video id="postVideo" src="${taskVideo}" class="video ${HIDDEN}"></video>
                      </div>
      
                      <div>
                      <div class="video_music_audio">
                      ${
                        hasVideo
                          ? `
                            <button id="taskVideoPlay" data-mode="idle" class="task_video_play">
                              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                              <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                            </button>
                        `
                          : ""
                      }

                       ${
                         music
                           ? `
                            <button class="grid_item_task--music" data-mode="idle">
                             <svg xmlns="http://www.w3.org/2000/svg" class="play_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M19.8 22.6L1.4 4.2l1.4-1.4l18.4 18.4zM14 11.15l-2-2V3h6v4h-4zM10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V12l2 2v3q0 1.65-1.175 2.825T10 21"/></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465"/></svg>
                            </button> 
                             `
                           : ""
                       }

                         ${
                           audio
                             ? `
                                <button class="grid_item_task--audio" data-mode="idle">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M16.8 14.575q-.35-.2-.45-.612t.1-.763q.175-.275.288-.587t.162-.638q.1-.425.388-.7T18 11t.7.3t.225.725q-.075.575-.262 1.125t-.488 1.05q-.2.35-.612.463t-.763-.088m-3.5-4.125L9.575 6.725Q9.3 6.45 9.15 6.088T9 5.325V5q0-1.25.875-2.125T12 2t2.125.875T15 5v4.725q0 .675-.612.938T13.3 10.45M11 20v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.963T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20m8.1 1.9l-17-17q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275"/></svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M18.25 11a.75.75 0 0 1 .743.648l.007.102v.5a6.75 6.75 0 0 1-6.249 6.732l-.001 2.268a.75.75 0 0 1-1.493.102l-.007-.102v-2.268a6.75 6.75 0 0 1-6.246-6.496L5 12.25v-.5a.75.75 0 0 1 1.493-.102l.007.102v.5a5.25 5.25 0 0 0 5.034 5.246l.216.004h.5a5.25 5.25 0 0 0 5.246-5.034l.004-.216v-.5a.75.75 0 0 1 .75-.75M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4"/></svg>
                                </button>
                              `
                             : ""
                         }

                        ${
                          hasVideo
                            ? `
                            <button class="grid_item_task--caption" data-mode="hide">
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.855 14.322a2.475 2.475 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1"/></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm6.962 4.856a1.48 1.48 0 0 1 1.484.066A1 1 0 1 0 11.53 9.24a3.475 3.475 0 1 0-.187 5.955a1 1 0 1 0-.976-1.746a1.474 1.474 0 1 1-1.405-2.593m6.186 0a1.48 1.48 0 0 1 1.484.066a1 1 0 1 0 1.084-1.682a3.475 3.475 0 1 0-.187 5.955a1 1 0 1 0-.976-1.746a1.474 1.474 0 1 1-1.405-2.593" clip-rule="evenodd"/></svg>
                            </button>
                          `
                            : ""
                        }
                    </div>

                        <div class="user-post-item-btns">
                          <div>
                            <button>
                              <span>
                                <!-- prettier-ignore -->
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2"/><path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="white" stroke-width="2"/></svg>
                              </span>
                              <span>${seen}M</span>
                            </button>
      
                            <!-- Heart Modal -->
                            <button id="commentLovesAndLikesBtn" tabindex="-1">
                              <span>
                                <!-- prettier-ignore -->
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="white" stroke-width="2"/></svg>
                              </span>
                              <span>${likes}M</span>
                            </button>
      
                            <!-- Comment Modal -->
                            <button id="commentModalBtn" style="display: none;" tabindex="-1">
                              <span>
                                <!-- prettier-ignore -->
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.91104 6.03755C6.47262 6.07337 6.24842 6.1383 6.09202 6.21799C5.7157 6.40974 5.40974 6.7157 5.21799 7.09202C5.1383 7.24842 5.07337 7.47262 5.03755 7.91104C5.00078 8.36113 5 8.94342 5 9.8V12V17V18.5858L7 16.5858C7.37507 16.2107 7.88378 16 8.41422 16H15.2C16.0566 16 16.6389 15.9992 17.089 15.9625C17.5274 15.9266 17.7516 15.8617 17.908 15.782C18.2843 15.5903 18.5903 15.2843 18.782 14.908C18.8617 14.7516 18.9266 14.5274 18.9625 14.089C18.9992 13.6389 19 13.0566 19 12.2V9.8C19 8.94342 18.9992 8.36113 18.9625 7.91104C18.9266 7.47262 18.8617 7.24842 18.782 7.09202C18.5903 6.7157 18.2843 6.40973 17.908 6.21799C17.7516 6.1383 17.5274 6.07337 17.089 6.03755C16.6389 6.00078 16.0566 6 15.2 6H8.8C7.94342 6 7.36113 6.00078 6.91104 6.03755ZM8.7587 4H8.8H15.2H15.2413H15.2413C16.0463 3.99999 16.7106 3.99998 17.2518 4.04419C17.8139 4.09012 18.3306 4.18868 18.816 4.43598L18.3678 5.31553L18.816 4.43598C19.5686 4.81947 20.1805 5.43139 20.564 6.18404L19.673 6.63803L20.564 6.18404C20.8113 6.66938 20.9099 7.18608 20.9558 7.74818C21 8.28937 21 8.95372 21 9.75868V9.8V12.2V12.2413C21 13.0463 21 13.7106 20.9558 14.2518C20.9099 14.8139 20.8113 15.3306 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C18.3306 17.8113 17.8139 17.9099 17.2518 17.9558C16.7106 18 16.0463 18 15.2413 18H15.2H8.41422L5.47531 20.9389C4.56185 21.8524 3 21.2054 3 19.9136V17V12V9.8V9.7587V9.75868C2.99999 8.95372 2.99998 8.28937 3.04419 7.74818C3.09012 7.18608 3.18868 6.66937 3.43598 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43598C5.66937 4.18868 6.18608 4.09012 6.74818 4.04419C7.28937 3.99998 7.95372 3.99999 8.75868 4H8.7587ZM7 9C7 8.44772 7.44772 8 8 8H16C16.5523 8 17 8.44772 17 9C17 9.55229 16.5523 10 16 10H8C7.44772 10 7 9.55229 7 9ZM8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H8Z" fill="white"/></svg>
                              </span>
                              <span>10</span>
                            </button>
                          </div>
      
                        ${
                          !page && showEditingBadge
                            ? `
                          <div class="your_post_actions">
                            <button class="view">View</button>
                            <button class="edit">Edit Post</button>
                          </div>
                          `
                            : ""
                        }

                         ${
                           postsAnalyticsButtons
                             ? `
                          <div class="your_post_actions post_analytics_buttons">
                            <button class="edit">Edit</button>
                            <button class="analytics">Analytics</button>
                          </div>
                          `
                             : ""
                         }
                        </div>

                        <div class="user-post-item-media-type">
                          ${hasVideo ? `<svg width="18" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1988_42096)"><path d="M23.3467 7L16.3467 12L23.3467 17V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.3467 5H3.34668C2.24211 5 1.34668 5.89543 1.34668 7V17C1.34668 18.1046 2.24211 19 3.34668 19H14.3467C15.4512 19 16.3467 18.1046 16.3467 17V7C16.3467 5.89543 15.4512 5 14.3467 5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1988_42096"><rect width="24" height="24" fill="white" transform="translate(0.34668)"/></clipPath></defs></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99951 21H18.9995C20.1041 21 20.9995 20.1046 20.9995 19V5C20.9995 3.89543 20.1041 3 18.9995 3H4.99951C3.89494 3 2.99951 3.89543 2.99951 5V19C2.99951 20.1046 3.89494 21 4.99951 21ZM4.99951 21L15.9995 10L20.9995 15M9.99951 8.5C9.99951 9.32843 9.32794 10 8.49951 10C7.67108 10 6.99951 9.32843 6.99951 8.5C6.99951 7.67157 7.67108 7 8.49951 7C9.32794 7 9.99951 7.67157 9.99951 8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
                        </div>
      
                        <ul class="dots" data-total-images="${taskImages.length}">
                          <li role="button" data-count="1" class="dot-item ${taskImages.length > 1 ? "" : HIDDEN} active"></li>
                          <li role="button" data-count="2" class="dot-item ${taskImages.length >= 2 ? "" : HIDDEN}"></li>
                          <li role="button" data-count="3" class="dot-item ${taskImages.length >= 3 ? "" : HIDDEN}"></li>
                        </ul>
                      </div>
                    </div>
              `;
    container.insertAdjacentHTML("beforeend", markup);

    // if item has video, Play video when mouseever
    if (hasVideo) {
      const gridItem = container.querySelector(`.user-post-item--${i}`);
      handlePostsVideoPlaying(gridItem);
    }
  });

  if (!page && showEditingContainer) {
    const html = `
              <div class="user-post-item create-post">
                <h1>${!emptyContent ? `Post your ideas, <br /> inspire others` : emptyContent}</h1>
                <a href="/post.html" class="create">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.8267 5.94531V19.9453M5.82666 12.9453H19.8267" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Create
                </a>
              </div>
    `;

    container.insertAdjacentHTML("afterbegin", html);
  }
}

/**
 * Renders global profile media posts.
 * @param {HTMLElement} container - The container element to render the media posts in.
 */
function renderGlobalProfileMedia(container, data) {
  const page = location.pathname === "/profile.html" || location.pathname === "/creator-profile.html";
  container.innerHTML = "";

  data.forEach((post, i) => {
    const { username, taskImages, hasVideo, taskVideoThumbnail, taskVideo, id, music, audio } = post;

    const markup = `
        <div class="user-post-item user-post-item--${i}" data-grid-item-id="${id}">
                <div class="userPostsImages">
                  ${taskImages.map((img, i) => `<img src="${img}" class="${i === 0 ? "" : HIDDEN}" data-img-count="${i + 1}" alt="" />`).join("")}
                </div>

                <div class="userPostsVideo ${hasVideo ? "" : HIDDEN}">
                  <img src="${taskVideoThumbnail}" class="userPostsVideoThumbnail" alt="" />
                  <video id="postVideo" src="${taskVideo}" class="video ${HIDDEN}"></video>
                </div>

                
                <div>
                <div class="video_music_audio">
                      ${
                        hasVideo
                          ? `
                            <button id="taskVideoPlay" data-mode="idle" class="task_video_play">
                              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                              <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                            </button>
                        `
                          : ""
                      }

                       ${
                         music
                           ? `
                            <button class="grid_item_task--music" data-mode="idle">
                              <svg xmlns="http://www.w3.org/2000/svg" class="play_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M19.8 22.6L1.4 4.2l1.4-1.4l18.4 18.4zM14 11.15l-2-2V3h6v4h-4zM10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V12l2 2v3q0 1.65-1.175 2.825T10 21"/></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465"/></svg>
                            </button> 
                             `
                           : ""
                       }

                         ${
                           audio
                             ? `
                                <button class="grid_item_task--audio" data-mode="idle">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M16.8 14.575q-.35-.2-.45-.612t.1-.763q.175-.275.288-.587t.162-.638q.1-.425.388-.7T18 11t.7.3t.225.725q-.075.575-.262 1.125t-.488 1.05q-.2.35-.612.463t-.763-.088m-3.5-4.125L9.575 6.725Q9.3 6.45 9.15 6.088T9 5.325V5q0-1.25.875-2.125T12 2t2.125.875T15 5v4.725q0 .675-.612.938T13.3 10.45M11 20v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.963T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20m8.1 1.9l-17-17q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275"/></svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M18.25 11a.75.75 0 0 1 .743.648l.007.102v.5a6.75 6.75 0 0 1-6.249 6.732l-.001 2.268a.75.75 0 0 1-1.493.102l-.007-.102v-2.268a6.75 6.75 0 0 1-6.246-6.496L5 12.25v-.5a.75.75 0 0 1 1.493-.102l.007.102v.5a5.25 5.25 0 0 0 5.034 5.246l.216.004h.5a5.25 5.25 0 0 0 5.246-5.034l.004-.216v-.5a.75.75 0 0 1 .75-.75M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4"/></svg>
                                </button>
                              `
                             : ""
                         }
                    </div>
                  <div class="user-post-item-btns media-tab">
                    <div class="media-tab-action-wrapper">
                      <!-- Heart Button -->
                      <button class="heartBtn">
                        <span>
                          <!-- prettier-ignore -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" fill-rule="evenodd" d="M4.222 5.364A6 6 0 0 1 12 4.758a6.002 6.002 0 0 1 7.778 9.091l-5.657 5.657a3 3 0 0 1-4.242 0L4.222 13.85a6 6 0 0 1 0-8.485" clip-rule="evenodd"/></svg>
                        </span>
                      </button>

                      <!-- Repost Button -->
                      <button class="repostBtn">
                        <span>
                          <!-- prettier-ignore -->
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"/></svg>
                        </span>
                      </button>
                    </div>

                        ${
                          username
                            ? ` <button class="users-tagged-to-post">
                                    <img src="./images/suggestion--4.png" alt="" />
                                    <span>${username}b</span>
                           </button>`
                            : ""
                        }
                  </div>

                  <div class="user-post-item-media-type">
                    ${hasVideo ? `<svg width="18" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1988_42096)"><path d="M23.3467 7L16.3467 12L23.3467 17V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.3467 5H3.34668C2.24211 5 1.34668 5.89543 1.34668 7V17C1.34668 18.1046 2.24211 19 3.34668 19H14.3467C15.4512 19 16.3467 18.1046 16.3467 17V7C16.3467 5.89543 15.4512 5 14.3467 5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1988_42096"><rect width="24" height="24" fill="white" transform="translate(0.34668)"/></clipPath></defs></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99951 21H18.9995C20.1041 21 20.9995 20.1046 20.9995 19V5C20.9995 3.89543 20.1041 3 18.9995 3H4.99951C3.89494 3 2.99951 3.89543 2.99951 5V19C2.99951 20.1046 3.89494 21 4.99951 21ZM4.99951 21L15.9995 10L20.9995 15M9.99951 8.5C9.99951 9.32843 9.32794 10 8.49951 10C7.67108 10 6.99951 9.32843 6.99951 8.5C6.99951 7.67157 7.67108 7 8.49951 7C9.32794 7 9.99951 7.67157 9.99951 8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
                  </div>

                  <!-- Dots -->
                  <ul class="dots" data-total-images="${taskImages.length}">
                    <li role="button" data-count="1" class="dot-item ${taskImages.length > 1 ? "" : HIDDEN} active"></li>
                    <li role="button" data-count="2" class="dot-item ${taskImages.length >= 2 ? "" : HIDDEN}"></li>
                    <li role="button" data-count="3" class="dot-item ${taskImages.length >= 3 ? "" : HIDDEN}"></li>
                  </ul>
                </div>
              </div>
        `;
    container.insertAdjacentHTML("beforeend", markup);

    // if item has video, Play video when mouseever
    if (hasVideo) {
      const gridItem = container.querySelector(`.user-post-item--${i}`);
      handlePostsVideoPlaying(gridItem);
    }
  });
}

/**
 * Renders profile reposts.
 * @param {HTMLElement} container - The container element to render the reposts in.
 */
function renderProfileReposts(container, data) {
  const page = location.pathname === "/profile.html" || location.pathname === "/creator-profile.html";
  container.innerHTML = "";

  data.forEach((post, i) => {
    const { username, taskImages, hasVideo, taskVideoThumbnail, taskVideo, id, music, audio } = post;

    const markup = `
        <div class="user-post-item user-post-item--${i}" data-grid-item-id="${id}">
                <div class="userPostsImages">
                        ${taskImages.map((img, i) => `<img src="${img}" class="${i === 0 ? "" : HIDDEN}" data-img-count="${i + 1}" alt="" />`).join("")}
                </div>

                 <div class="userPostsVideo ${hasVideo ? "" : HIDDEN}">
                  <img src="${taskVideoThumbnail}" class="userPostsVideoThumbnail" alt="" />
                  <video id="postVideo" muted src="${taskVideo}" class="video ${HIDDEN}"></video>
                </div>

                
                <div>
                <div class="video_music_audio">
                                      ${
                                        hasVideo
                                          ? `
                                            <button id="taskVideoPlay" data-mode="idle" class="task_video_play">
                                              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                                              <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                                            </button>
                                        `
                                          : ""
                                      }
                
                                       ${
                                         music
                                           ? `
                                            <button class="grid_item_task--music" data-mode="idle">
                                              <svg xmlns="http://www.w3.org/2000/svg" class="play_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M19.8 22.6L1.4 4.2l1.4-1.4l18.4 18.4zM14 11.15l-2-2V3h6v4h-4zM10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V12l2 2v3q0 1.65-1.175 2.825T10 21"/></svg>
                                              <svg xmlns="http://www.w3.org/2000/svg" class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465"/></svg>
                                            </button> 
                                             `
                                           : ""
                                       }
                
                                         ${
                                           audio
                                             ? `
                                                <button class="grid_item_task--audio" data-mode="idle">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M16.8 14.575q-.35-.2-.45-.612t.1-.763q.175-.275.288-.587t.162-.638q.1-.425.388-.7T18 11t.7.3t.225.725q-.075.575-.262 1.125t-.488 1.05q-.2.35-.612.463t-.763-.088m-3.5-4.125L9.575 6.725Q9.3 6.45 9.15 6.088T9 5.325V5q0-1.25.875-2.125T12 2t2.125.875T15 5v4.725q0 .675-.612.938T13.3 10.45M11 20v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.963T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20m8.1 1.9l-17-17q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275"/></svg>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M18.25 11a.75.75 0 0 1 .743.648l.007.102v.5a6.75 6.75 0 0 1-6.249 6.732l-.001 2.268a.75.75 0 0 1-1.493.102l-.007-.102v-2.268a6.75 6.75 0 0 1-6.246-6.496L5 12.25v-.5a.75.75 0 0 1 1.493-.102l.007.102v.5a5.25 5.25 0 0 0 5.034 5.246l.216.004h.5a5.25 5.25 0 0 0 5.246-5.034l.004-.216v-.5a.75.75 0 0 1 .75-.75M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4"/></svg>
                                                </button>
                                              `
                                             : ""
                                         }
                                    </div>
                  <div class="user-post-item-btns">
                    <div>
                      <button tabindex="-1">
                        <span>
                          <!-- prettier-ignore -->
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2"/><path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="white" stroke-width="2"/></svg>
                        </span>
                        <span>20</span>
                      </button>

                      <!-- Heart Modal -->
                      <button id="commentLovesAndLikesBtn" tabindex="-1">
                        <span>
                          <!-- prettier-ignore -->
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="white" stroke-width="2"/></svg>
                        </span>
                        <span>3</span>
                      </button>

                      <!-- Comment Modal -->
                      <button id="commentModalBtn" tabindex="-1">
                        <span>
                          <!-- prettier-ignore -->
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6.91104 6.03755C6.47262 6.07337 6.24842 6.1383 6.09202 6.21799C5.7157 6.40974 5.40974 6.7157 5.21799 7.09202C5.1383 7.24842 5.07337 7.47262 5.03755 7.91104C5.00078 8.36113 5 8.94342 5 9.8V12V17V18.5858L7 16.5858C7.37507 16.2107 7.88378 16 8.41422 16H15.2C16.0566 16 16.6389 15.9992 17.089 15.9625C17.5274 15.9266 17.7516 15.8617 17.908 15.782C18.2843 15.5903 18.5903 15.2843 18.782 14.908C18.8617 14.7516 18.9266 14.5274 18.9625 14.089C18.9992 13.6389 19 13.0566 19 12.2V9.8C19 8.94342 18.9992 8.36113 18.9625 7.91104C18.9266 7.47262 18.8617 7.24842 18.782 7.09202C18.5903 6.7157 18.2843 6.40973 17.908 6.21799C17.7516 6.1383 17.5274 6.07337 17.089 6.03755C16.6389 6.00078 16.0566 6 15.2 6H8.8C7.94342 6 7.36113 6.00078 6.91104 6.03755ZM8.7587 4H8.8H15.2H15.2413H15.2413C16.0463 3.99999 16.7106 3.99998 17.2518 4.04419C17.8139 4.09012 18.3306 4.18868 18.816 4.43598L18.3678 5.31553L18.816 4.43598C19.5686 4.81947 20.1805 5.43139 20.564 6.18404L19.673 6.63803L20.564 6.18404C20.8113 6.66938 20.9099 7.18608 20.9558 7.74818C21 8.28937 21 8.95372 21 9.75868V9.8V12.2V12.2413C21 13.0463 21 13.7106 20.9558 14.2518C20.9099 14.8139 20.8113 15.3306 20.564 15.816C20.1805 16.5686 19.5686 17.1805 18.816 17.564C18.3306 17.8113 17.8139 17.9099 17.2518 17.9558C16.7106 18 16.0463 18 15.2413 18H15.2H8.41422L5.47531 20.9389C4.56185 21.8524 3 21.2054 3 19.9136V17V12V9.8V9.7587V9.75868C2.99999 8.95372 2.99998 8.28937 3.04419 7.74818C3.09012 7.18608 3.18868 6.66937 3.43598 6.18404C3.81947 5.43139 4.43139 4.81947 5.18404 4.43598C5.66937 4.18868 6.18608 4.09012 6.74818 4.04419C7.28937 3.99998 7.95372 3.99999 8.75868 4H8.7587ZM7 9C7 8.44772 7.44772 8 8 8H16C16.5523 8 17 8.44772 17 9C17 9.55229 16.5523 10 16 10H8C7.44772 10 7 9.55229 7 9ZM8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H8Z" fill="white"/></svg>
                        </span>
                        <span>10</span>
                      </button>
                    </div>

                    <div class="profile-report-user">
                      <a href="/account-profile.html">
                        <img src="${taskImages[0]}" alt="" />
                        <span>${username}</span>
                      </a>

                      <a href="#">Follow</a>
                    </div>
                  </div>
                  
                  <div class="user-post-item-media-type">
                    ${hasVideo ? `<svg width="18" height="18" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1988_42096)"><path d="M23.3467 7L16.3467 12L23.3467 17V7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.3467 5H3.34668C2.24211 5 1.34668 5.89543 1.34668 7V17C1.34668 18.1046 2.24211 19 3.34668 19H14.3467C15.4512 19 16.3467 18.1046 16.3467 17V7C16.3467 5.89543 15.4512 5 14.3467 5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_1988_42096"><rect width="24" height="24" fill="white" transform="translate(0.34668)"/></clipPath></defs></svg>` : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99951 21H18.9995C20.1041 21 20.9995 20.1046 20.9995 19V5C20.9995 3.89543 20.1041 3 18.9995 3H4.99951C3.89494 3 2.99951 3.89543 2.99951 5V19C2.99951 20.1046 3.89494 21 4.99951 21ZM4.99951 21L15.9995 10L20.9995 15M9.99951 8.5C9.99951 9.32843 9.32794 10 8.49951 10C7.67108 10 6.99951 9.32843 6.99951 8.5C6.99951 7.67157 7.67108 7 8.49951 7C9.32794 7 9.99951 7.67157 9.99951 8.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
                  </div>

                  <!-- Dots -->
                  <ul class="dots" data-total-images="${taskImages.length}">
                    <li role="button" data-count="1" class="dot-item ${taskImages.length > 1 ? "" : HIDDEN} active"></li>
                    <li role="button" data-count="2" class="dot-item ${taskImages.length >= 2 ? "" : HIDDEN}"></li>
                    <li role="button" data-count="3" class="dot-item ${taskImages.length >= 3 ? "" : HIDDEN}"></li>
                  </ul>
                </div>
              </div>
        `;
    container.insertAdjacentHTML("beforeend", markup);

    // if item has video, Play video when mouseever
    if (hasVideo) {
      const gridItem = container.querySelector(`.user-post-item--${i}`);
      handlePostsVideoPlaying(gridItem);
    }
  });
}

/**
 * Initializes event listeners for gallery grids and handles various interactions.
 */

(() => {
  const postGalleryGrid = document.getElementById("postGalleryGrid");
  const mediaGalleryGrid = document.getElementById("mediaGalleryGrid");
  const repostGalleryGrid = document.getElementById("repostGalleryGrid");
  const taggedGalleryGrid = document.getElementById("taggedGalleryGrid");
  const favouriteGalleryGrid = document.getElementById("favouriteGalleryGrid");
  const boostGalleryGrid = document.getElementById("boostGalleryGrid");
  const creatorPostItems = document.getElementById("creatorPostItems");

  // Grid Container Events
  let audio;
  let playing = false;

  // Track currently playing music globally if needed
  let currentMusic = null;

  // Track currently playing music globally if needed
  let currentAudio = null;

  // Track currently playing video globally if needed
  let isVideoPlaying = false;
  let currentVideoAudio;

  // Click event listener
  [postGalleryGrid, mediaGalleryGrid, repostGalleryGrid, taggedGalleryGrid, favouriteGalleryGrid, boostGalleryGrid, creatorPostItems].forEach((container) => {
    container?.addEventListener("click", function (e) {
      const target = e.target;

      const { gridItemId } = target.closest(".user-post-item").dataset;
      const showModalData = globalProfileData.find((item) => item.id === +gridItemId);

      function showCommentModalForProfile() {
        const commentsModal = document.getElementById("comments_modal");
        // Show the comment Modal
        commentsModal.classList.remove(HIDDEN);

        showCommentModalGlobalHandler(showModalData);
      }

      if (target.closest("button.edit")) {
        window.location.href = "/post.html";
        return;
      }

      //
      if (target.closest("button.analytics")) {
        document.getElementById("mainPostsViews").classList.add(HIDDEN);
        document.getElementById("postDetailView").classList.remove(HIDDEN);
        return;
      }

      // Toggle Caption Display
      const gridItemTaskCaption = target.closest(".grid_item_task--caption");
      if (gridItemTaskCaption) {
        // const gridItem = gridItemTaskCaption.closest(".user-post-item");
        const { mode } = gridItemTaskCaption.dataset;
        const commentsModal = document.getElementById("comments_modal");

        if (mode === "hide") {
          gridItemTaskCaption.setAttribute("data-mode", "show");
          commentsModal.setAttribute("data-caption-mode", true);
        } else {
          gridItemTaskCaption.setAttribute("data-mode", "hide");
          commentsModal.setAttribute("data-caption-mode", false);
        }
        return;
      }

      // Love & Likes for a Post
      const commentLovesAndLikesBtn = target.closest("#commentLovesAndLikesBtn");
      if (commentLovesAndLikesBtn) {
        const lovesAndLikesPopup = document.getElementById("lovesLikeModal");
        lovesAndLikesPopup.classList.remove(HIDDEN);

        return;
      }

      // Dots
      const dotItem = target.closest(".dot-item");
      if (dotItem) {
        const { count } = dotItem.dataset;
        const dotsContainer = dotItem.closest(".dots");
        const dotItems = dotsContainer.querySelectorAll(".dot-item");
        const allPostImages = dotItem.closest(".user-post-item").querySelectorAll(".userPostsImages img");

        dotItems.forEach((dot) => dot.classList.remove("active"));
        allPostImages.forEach((post) => post.classList.add(HIDDEN));

        // activate the dotItem clicked
        dotItem.classList.add("active");

        const position = Number(count);
        const { totalImages, nextCount } = dotsContainer.dataset;

        if (position === 1) {
          allPostImages[0].classList.remove(HIDDEN);
          dotsContainer.removeAttribute("data-next-count");

          return;
        }

        if (position === 2) {
          allPostImages[1].classList.remove(HIDDEN);
          dotsContainer.removeAttribute("data-next-count");

          return;
        }

        if (position === 3 && !nextCount) {
          allPostImages[position - 1].classList.remove(HIDDEN);

          if (totalImages > 3) {
            dotsContainer.setAttribute("data-next-count", 4);
          }

          return;
        }

        if (nextCount && +totalImages >= +nextCount) {
          allPostImages[+nextCount - 1].classList.remove(HIDDEN);

          if (+totalImages === +nextCount) {
            dotsContainer.setAttribute("data-next-count", 3);
          } else {
            dotsContainer.setAttribute("data-next-count", +nextCount + 1);
          }
          return;
        }
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
          currentMusic = new Audio(showModalData.music);
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
          const allMusicButtons = document.querySelectorAll(".grid_item_task--music");
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
        const currentMode = playAudioBtn.dataset.mode || "idle";

        function newAudio() {
          if (currentAudio) {
            currentAudio.currentTime = 0;
          }

          // Initialize and play new audio
          currentAudio = new Audio(showModalData.audio);
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
          const allAudioButtons = document.querySelectorAll(".grid_item_task--audio");
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

      // Task Video
      const taskVideoPlay = target.closest("#taskVideoPlay");
      if (taskVideoPlay) {
        const userPostItem = taskVideoPlay.closest(".user-post-item");
        const postVideo = userPostItem.querySelector("#postVideo");
        const userPostsVideoThumbnail = userPostItem.querySelector(".userPostsVideoThumbnail");

        const mode = taskVideoPlay.getAttribute("data-mode");

        // Play the video
        if (mode === "pause") {
          postVideo
            .play()
            .then(() => {
              userPostsVideoThumbnail.classList.add(HIDDEN);
              postVideo.classList.remove(HIDDEN);
              taskVideoPlay.setAttribute("data-mode", "play");

              isVideoPlaying = true;
            })
            .catch((error) => {
              console.error("Video play error:", error);
            });

          postVideo.loop = true;
        } else {
          postVideo.pause();
          postVideo.currentTime = 0; // Reset video time to the beginning
          taskVideoPlay.setAttribute("data-mode", "pause");

          isVideoPlaying = false;
        }

        return;
      }

      //  Show Comment Modal
      showCommentModalForProfile();
    });
  });
})();
