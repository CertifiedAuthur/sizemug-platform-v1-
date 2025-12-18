/**
 * The `gridContainerWrapper` variable name used in this file has been declared in mobile_select.tasks-for_you.js file
 */

const gridContainer = document.getElementById("gridContainer");
// This file was relying on another script to declare `gridContainerWrapper`.
// If that script loads after this one (or not at all on some pages), it throws
// a ReferenceError that can stop unrelated features (like the Story Music modal).
// Use window object to avoid duplicate declaration errors
if (typeof window.gridContainerWrapper === 'undefined') {
  window.gridContainerWrapper = document.getElementById("gridContainerWrapper") || gridContainer?.parentElement;
}
const gridContainerWrapper = window.gridContainerWrapper;

// Some pages don't define the global `mainTaskLists`. Provide a safe fallback so
// this file doesn't throw and break other features.
const mainTaskLists = window.mainTaskLists || document.querySelectorAll?.(".tasks_list, .main_task_list, .task_lists") || [];
const commentsModal = document.getElementById("comments_modal");

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

let MODE_TIME_MILLI = 1800000;

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// Grid layout rendering
// The gridData here is stored in grid.data.js file
function populateGridLayout(gridData, gridContainerEl, masonryInstance) {
  gridData.forEach((item, i) => {
    const gridItem = `
                <div class="grid_item" id="grid_item--${i}" style="height: ${item.height}px" data-grid-item-id="${item.id}">
                  <div class="grid_item_content--wrapper">
                      <div class="grid_item--overlay">
                        <div class="top_content">
                          <div class="grid_item_task--mode">
                            <button class="${item.type === "repost" ? "repost--mode" : item.type === "new" ? "new--mode" : "promote--mode"}">
                            ${item.type === "repost" ? `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="white" d="M17 17H7v-3l-4 4l4 4v-3h12v-6h-2M7 7h10v3l4-4l-4-4v3H5v6h2z" /></svg>` : item.type === "new" ? "New" : `<svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="white" d="M21 10.063V4a1 1 0 0 0-1-1h-1c-1.979 1.979-5.697 3.087-8 3.613v10.774c2.303.526 6.021 1.634 8 3.613h1a1 1 0 0 0 1-1v-6.063a2 2 0 0 0 0-3.874M5 7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1l1 5h2V7z" /></svg>`}
                            </button>

                         ${
                           item.hasVideo
                             ? `
                            <button class="grid_item_task--video" data-music-url="${item.music}" data-mode="idle">
                              <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                              <svg class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                            </button>
                            `
                             : ""
                         }

                        ${
                          item.music
                            ? `
                            <button class="grid_item_task--music" data-mode="idle">
                              <svg xmlns="http://www.w3.org/2000/svg" class="play_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M19.8 22.6L1.4 4.2l1.4-1.4l18.4 18.4zM14 11.15l-2-2V3h6v4h-4zM10 21q-1.65 0-2.825-1.175T6 17t1.175-2.825T10 13q.575 0 1.063.138t.937.412V12l2 2v3q0 1.65-1.175 2.825T10 21"/></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" class="pause_icon" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M12 13.535V3h8v3h-6v11a4 4 0 1 1-2-3.465"/></svg>
                            </button> 
                             `
                            : ""
                        }

                        ${
                          item.audio
                            ? `
                              <button class="grid_item_task--audio" data-mode="idle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M16.8 14.575q-.35-.2-.45-.612t.1-.763q.175-.275.288-.587t.162-.638q.1-.425.388-.7T18 11t.7.3t.225.725q-.075.575-.262 1.125t-.488 1.05q-.2.35-.612.463t-.763-.088m-3.5-4.125L9.575 6.725Q9.3 6.45 9.15 6.088T9 5.325V5q0-1.25.875-2.125T12 2t2.125.875T15 5v4.725q0 .675-.612.938T13.3 10.45M11 20v-2.1q-2.3-.3-3.937-1.925t-1.988-3.95q-.05-.425.225-.725T6 11t.713.288T7.1 12q.35 1.75 1.738 2.875T12 16q.85 0 1.613-.262T15 15l1.425 1.425q-.725.575-1.588.963T13 17.9V20q0 .425-.288.713T12 21t-.712-.288T11 20m8.1 1.9l-17-17q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l17 17q.275.275.275.7t-.275.7t-.7.275t-.7-.275"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" d="M18.25 11a.75.75 0 0 1 .743.648l.007.102v.5a6.75 6.75 0 0 1-6.249 6.732l-.001 2.268a.75.75 0 0 1-1.493.102l-.007-.102v-2.268a6.75 6.75 0 0 1-6.246-6.496L5 12.25v-.5a.75.75 0 0 1 1.493-.102l.007.102v.5a5.25 5.25 0 0 0 5.034 5.246l.216.004h.5a5.25 5.25 0 0 0 5.246-5.034l.004-.216v-.5a.75.75 0 0 1 .75-.75M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4"/></svg>
                              </button>
                            `
                            : ""
                        }

                        ${
                          item.hasVideo
                            ? `
                              <button class="grid_item_task--caption" data-mode="hide">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.855 14.322a2.475 2.475 0 1 1 .133-4.241m6.053 4.241a2.475 2.475 0 1 1 .133-4.241M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1"/></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#fff" fill-rule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm6.962 4.856a1.48 1.48 0 0 1 1.484.066A1 1 0 1 0 11.53 9.24a3.475 3.475 0 1 0-.187 5.955a1 1 0 1 0-.976-1.746a1.474 1.474 0 1 1-1.405-2.593m6.186 0a1.48 1.48 0 0 1 1.484.066a1 1 0 1 0 1.084-1.682a3.475 3.475 0 1 0-.187 5.955a1 1 0 1 0-.976-1.746a1.474 1.474 0 1 1-1.405-2.593" clip-rule="evenodd"/></svg>
                              </button>
                            `
                            : ""
                        }


                        </div>

                          <button class="grid_item_task--btn">
                            <span class="button_icons" id="grid_task_button_icons">
                              <img src="icons/ellipsis.svg" alt="Item options" class="ellipsis_icon button" />
                              <img src="icons/cancel.svg" alt="Item options" class="cancel_icon ${HIDDEN} button" />
                            </span>

                            <ul class="grid_item_task--options ${HIDDEN}" aria-hidden="true">
                              <li role="button" id="saveGridItem">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" class="savedOutline" style="margin-left: -5px" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.769q.69 0 1.153.463T18 5.616V19.5l-6-2.577zm1-1.55l5-2.15l5 2.15V5.616q0-.231-.192-.424T16.384 5H7.616q-.231 0-.424.192T7 5.616zM7 5h10z"/></svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" class="savedFill ${HIDDEN}" style="margin-left: -5px" width="24" height="24" viewBox="0 0 24 24"><path fill="orange" d="M6 19.5V5.616q0-.691.463-1.153T7.616 4h8.769q.69 0 1.153.463T18 5.616V19.5l-6-2.577z"/></svg>
                                </span>
                                <span>Save</span>
                              </li>
                              <li role="button" id="favGridItem">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" class="favOutline" style="margin-left: -3px" width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m13.728 3.444l1.76 3.549c.24.494.88.968 1.42 1.058l3.189.535c2.04.343 2.52 1.835 1.05 3.307l-2.48 2.5c-.42.423-.65 1.24-.52 1.825l.71 3.095c.56 2.45-.73 3.397-2.88 2.117l-2.99-1.785c-.54-.322-1.43-.322-1.98 0L8.019 21.43c-2.14 1.28-3.44.322-2.88-2.117l.71-3.095c.13-.585-.1-1.402-.52-1.825l-2.48-2.5C1.39 10.42 1.86 8.929 3.899 8.586l3.19-.535c.53-.09 1.17-.564 1.41-1.058l1.76-3.549c.96-1.925 2.52-1.925 3.47 0" color="#000"/></svg>
                                  <svg xmlns="http://www.w3.org/2000/svg" class="favFill ${HIDDEN}" style="margin-left: -3px" width="18" height="18" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="red" d="M10.92 2.868a1.25 1.25 0 0 1 2.16 0l2.795 4.798l5.428 1.176a1.25 1.25 0 0 1 .667 2.054l-3.7 4.141l.56 5.525a1.25 1.25 0 0 1-1.748 1.27L12 19.592l-5.082 2.24a1.25 1.25 0 0 1-1.748-1.27l.56-5.525l-3.7-4.14a1.25 1.25 0 0 1 .667-2.055l5.428-1.176z"/></g></svg>
                                </span>
                                <span>Favourite</span>
                              </li>
                              <li role="button" id="repostGridItem">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="black" d="M17 17H7v-3l-4 4l4 4v-3h12v-6h-2M7 7h10v3l4-4l-4-4v3H5v6h2z" /></svg>
                                </span>
                                <span>Repost</span>
                              </li>
                              <a href="/campaign.html" role="button" class="promote">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-width="2" d="m1 16l7-7l5 5L23 4M0 22h23.999M16 4h7v7" /></svg>
                                </span>
                                <span>Promote</span>
                              </a>
                              <li role="button" class="scroll">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 16 16"><path fill="#000000" fill-rule="evenodd" d="M10 14a2 2 0 1 1-4 0a2 2 0 0 1 4 0m1.78-8.841a.75.75 0 0 0-1.06 0l-1.97 1.97V.75a.75.75 0 0 0-1.5 0v6.379l-1.97-1.97a.75.75 0 0 0-1.06 1.06l3.25 3.25L8 10l.53-.53l3.25-3.25a.75.75 0 0 0 0-1.061" clip-rule="evenodd"/></svg>
                                </span>
                                <span>Scroll Arrow</span>
                                <label class="switch">
                                  <input type="checkbox" class="toggleScrollArrow" />
                                  <span class="slider round"></span>
                                </label>
                              </li>
                              <li role="button" class="share">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="9" cy="9" r="4"/><path d="M16 19c0-3.314-3.134-6-7-6s-7 2.686-7 6m13-6a4 4 0 1 0-3-6.646"/><path d="M22 19c0-3.314-3.134-6-7-6c-.807 0-2.103-.293-3-1.235"/></g></svg>
                                </span>
                                <span>Share</span>
                              </li>
                              <li role="button" class="boost">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#000" d="M7 2h10l-3.5 7H17l-7 13v-8H7zm2 2v8h3v2.66L14 11h-3.76l3.52-7z"/></svg>
                                </span>
                                <span>Boost</span>
                              </li>
                              <li role="button" class="interests not-interested">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="black" d="M4.707 3.293a1 1 0 0 0-1.414 1.414l2.424 2.424c-1.43 1.076-2.678 2.554-3.611 4.422a1 1 0 0 0 0 .894C4.264 16.764 8.096 19 12 19c1.555 0 3.1-.355 4.53-1.055l2.763 2.762a1 1 0 0 0 1.414-1.414zm10.307 13.135c-.98.383-2 .572-3.014.572c-2.969 0-6.002-1.62-7.87-5c.817-1.479 1.858-2.62 3.018-3.437l2.144 2.144a3 3 0 0 0 4.001 4.001zm3.538-2.532c.483-.556.926-1.187 1.318-1.896c-1.868-3.38-4.9-5-7.87-5q-.168 0-.336.007L9.879 5.223A10.2 10.2 0 0 1 12 5c3.903 0 7.736 2.236 9.894 6.553a1 1 0 0 1 0 .894a13 13 0 0 1-1.925 2.865z" /></svg>
                                </span>
                                <span>Not interested</span>
                              </li>
                              <li role="button" class="show-report-modal-btn report">
                                <span>
                                  <img src="icons/report.svg" alt="Report" />
                                </span>
                                <span>Report</span>
                              </li>
                              <li role="button" class="delete">
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: -2px" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="red" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" /></svg>
                                </span>
                                <span>Delete</span>
                              </li>
                            </ul>
                          </button>
                        </div>

                        <div class="bottom_content">
                          <a href="/profile.html" class="grid_task_user">
                            <img src="${item.userPhoto}" alt="${item.username}" />
                            <h3 style="color: white">${item.username}</h3>
                          </a>

                          <div class="grid_task_title">${item.taskTitle}</div>

                          <div class="grid_task_reactions">
                            <button>
                              <img src="icons/eye.svg" alt="Eye Icon" />
                              <span>${item.seen}</span>
                            </button>
                            <button id="commentLovesAndLikesBtn">
                              <img src="icons/heart.svg" alt="Heart Icon" />
                              <span>${item.likes}</span>
                            </button>
                          </div>

                          <button class="grid_task_navigate_comment">
                            <span>Comment:</span>
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M13 3a3 3 0 0 1 2.995 2.824L16 6v4h2a3 3 0 0 1 2.98 2.65l.015.174L21 13l-.02.196l-1.006 5.032c-.381 1.626-1.502 2.796-2.81 2.78L17 21H9a1 1 0 0 1-.993-.883L8 20l.001-9.536a1 1 0 0 1 .5-.865a3 3 0 0 0 1.492-2.397L10 7V6a3 3 0 0 1 3-3m-8 7a1 1 0 0 1 .993.883L6 11v9a1 1 0 0 1-.883.993L5 21H4a2 2 0 0 1-1.995-1.85L2 19v-7a2 2 0 0 1 1.85-1.995L4 10z"/></svg>
                            </span>
                          </button>
                        </div>
                      </div>

                      <!-- Slider -->
                      <div class="grid_item_sliders">
                         ${
                           !item.hasVideo
                             ? item.taskImages.map((img, i) => `<img src="${img}" alt="Slider Image Item" class="slide ${i + 1 !== 1 ? HIDDEN : ""}" id="slider_count--${i + 1}" />`).join("")
                             : `
                             <img src="${item.taskVideoThumbnail}" alt="Thumbnail" class="task_thumbnail"/>
                          <video data-mode="idle" id="gridLayoutVideo" class="gridLayoutVideo--${i} ${HIDDEN} video" preload="metadata" src="${item.taskVideo}"></video>
                          `
                         }
                      </div>

                      <!-- Slider Buttons -->
                      <div class="slider_buttons_wrapper" data-total-count="${item.taskImages.length}">
                          <button data-count="1" class="${item.taskImages.length > 1 ? "" : HIDDEN} active"></button>
                          <button data-count="2" class="${item.taskImages.length >= 2 ? "" : HIDDEN}"></button>
                          <button data-count="3" class="${item.taskImages.length >= 3 ? "" : HIDDEN}"></button>
                      </div>
                  </div>

                ${
                  item.type === "priority"
                    ? `<button class="promote_learn_more--btn">
                    <span>Learn More</span>
                    <span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12.6 12L8.7 8.1q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.6 4.6q.15.15.213.325t.062.375t-.062.375t-.213.325l-4.6 4.6q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7z"/></svg></span>
                  </button>`
                    : ""
                }
                </div>
    `;

    gridContainerEl.insertAdjacentHTML("beforeend", gridItem);

    // Video Handler
    if (item.hasVideo) {
      const gridItem = gridContainerEl.querySelector(`#grid_item--${i}`);
      const gridItemVideo = gridItem.querySelector("#gridLayoutVideo");
      const thumbnail = gridItem.querySelector(".task_thumbnail");
      const gridItemTaskVideoButton = gridItem.querySelector(".grid_item_task--video");

      gridItem.addEventListener("mouseenter", () => {
        if (thumbnail && gridItemVideo) {
          // Hide the thumbnail and show the video
          thumbnail.classList.add(HIDDEN); // Hide thumbnail
          gridItemVideo.classList.remove(HIDDEN); // Show video to play

          // Reset video time to the beginning
          gridItemVideo.currentTime = 0;

          // Play the video
          playGridHoverVideo(gridItemVideo, gridItemTaskVideoButton);
        }
      });

      gridItem.addEventListener("mouseleave", () => {
        if (isVideoPlaying) {
          isVideoPlaying = false;

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

      gridItemVideo?.addEventListener("ended", () => {
        gridItemVideo.currentTime = 0; // Ensure video resets to the beginning on end
      });
    }

    // New
    if (item.type === "new") {
      const newModeButton = document.querySelector(".grid_item_task--mode button.new");
      setTimeout(() => {
        newModeButton.remove();
      }, MODE_TIME_MILLI);
    }
  });

  // Invalidate Mansory Layout
  masonryInstance = new Masonry(gridContainerEl, {
    itemSelector: ".grid_item",
    columnWidth: ".grid_item",
    percentPosition: true,
    gutter: 16,
  });

  // Scroll Arrow
  // Add event listener for checkbox change
  const toggleScrollArrows = gridContainerEl.querySelectorAll(".toggleScrollArrow");
  let scrollGridButtonContainer;

  if (gridContainerEl.id === "suggestion_grid_container") {
    scrollGridButtonContainer = document.getElementById("suggestionScrollGridButtonContainer");
  } else {
    scrollGridButtonContainer = document.getElementById("scrollGridButtonContainer");
  }

  toggleScrollArrows.forEach((button) => {
    button.addEventListener("change", (e) => {
      const isChecked = e.target.checked;

      // Update visibility
      scrollGridButtonContainer.classList.toggle(HIDDEN, !isChecked);

      // Sync other checkboxes without triggering their change events
      toggleScrollArrows.forEach((check) => {
        if (check !== e.target) {
          // Skip the checkbox that triggered the event
          check.checked = isChecked;
        }
      });
    });
  });

  if (gridContainerEl.id === "suggestion_grid_container") {
    updateSuggestionStickyButtonStates();
  } else {
    // Initial SCROLL BUTTON [update the buttons for disable after the container height has been finally calculated, This prevent wrong diabling of buttons]
    updateLandingStickyButtonStates();
  }
}

function playGridHoverVideo(videoEl, button) {
  // Play the video
  videoEl
    .play()
    .then(() => {
      isVideoPlaying = true;
      button.setAttribute("data-mode", "play");
      videoEl.setAttribute("data-mode", "play");
    })
    .catch((error) => {
      console.error("Video play error:", error);
    });
}

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Hid grid container on mobile view
["load"].forEach((event) => {
  window.addEventListener(event, function (e) {
    if (innerWidth < 667) {
      if (gridContainerWrapper) gridContainerWrapper.classList.add(HIDDEN);

      try {
        mainTaskLists.forEach((list) => {
          list?.classList?.remove?.(HIDDEN);
        });
      } catch {
        // ignore
      }
    }
  });
});

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

gridContainer.addEventListener("click", function (e) {
  const target = e.target;
  const gridItemContainer = target.closest(".grid_item");

  if (!gridItemContainer) return;

  const { gridItemId } = gridItemContainer.dataset;
  // Get corresponding data object to update landing modal comment
  const item = gridDataItem.find((item) => item.id === +gridItemId);

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
    return showRepostedModal();
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
    const gridOption = gridOptionBtn.parentNode.querySelector(".button_icons ~ ul");
    const ellipsisIcon = gridOptionBtn.querySelector(".ellipsis_icon");
    const cancelIcon = gridOptionBtn.querySelector(".cancel_icon");
    const gridOptionStatus = JSON.parse(gridOption.ariaHidden);
    const gridItemSliderButtonContainer = gridOptionBtn.closest(".grid_item").querySelector(".slider_buttons_wrapper");

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

  // Play Task Video
  const playVideoBtn = target.closest(".grid_item_task--video");
  if (playVideoBtn && item.hasVideo) {
    const gridItem = target.closest(".grid_item");
    const gridItemVideo = gridItem.querySelector("#gridLayoutVideo");
    const thumbnail = gridItem.querySelector(".task_thumbnail");

    const currentMode = playVideoBtn.dataset.mode;

    // If there is a video playing
    if (isVideoPlaying && currentMode === "idle") {
      const currentPlayingVideo = document.querySelector("#gridLayoutVideo[data-mode='play']");

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
    if (!isVideoPlaying && (currentMode === "idle" || currentMode === "pause")) {
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

  // Prevent opening comment modal when clicking Boost button (Issue #8 fix)
  if (target.closest(".boost")) {
    return;
  }

  // Show comments modal
  showCommentModalGlobalHandler(item);
  return;
});

function startPlayingAudio(path, playIcon, pauseIcon, playMusicBtn) {
  // Reset all button first
  const allPlayingBtns = document.querySelectorAll(".grid_item_task--music");
  allPlayingBtns.forEach((btn) => {
    const playingIcon = btn.querySelector(".play");
    const pauseIcon = btn.querySelector(".pause");
    playingIcon.classList.remove(HIDDEN);
    pauseIcon.classList.add(HIDDEN);
    btn.setAttribute("data-mode", "idle");
  });

  audio = new Audio(path);

  audio.load(); // Load the new music file
  audio.play(); // Play music

  playIcon.classList.add(HIDDEN);
  pauseIcon.classList.remove(HIDDEN);
  playMusicBtn.dataset.mode = "playing";

  // When music finish play
  audio.addEventListener("ended", () => {
    playIcon.classList.remove(HIDDEN);
    pauseIcon.classList.add(HIDDEN);
    playMusicBtn.dataset.mode = "idle";
  });
}

// Outside click
document.addEventListener("click", function (e) {
  if (!e.target.closest(".grid_item_task--btn")) {
    hideTaskGridOption();
    return;
  }
});

function hideTaskGridOption() {
  const allTaskGridEllipsis = document.querySelectorAll("#grid_task_button_icons .ellipsis_icon");
  const allTaskGridCancel = document.querySelectorAll("#grid_task_button_icons .cancel_icon");
  const allTaskGridOptions = document.querySelectorAll(".grid_item_task--options");
  const allGridItemSliderButtonContainer = document.querySelectorAll(".slider_buttons_wrapper");

  allTaskGridOptions.forEach((option) => {
    option.classList.add(HIDDEN);
    option.ariaHidden = true;
  });

  allTaskGridCancel.forEach((c) => {
    c.classList.add(HIDDEN);
  });

  allTaskGridEllipsis.forEach((ellip) => {
    ellip.classList.remove(HIDDEN);
  });

  allGridItemSliderButtonContainer.forEach((btn) => btn.classList.remove(HIDDEN));
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
 */
const scrollGridButtonContainerUp = document.getElementById("scrollGridButtonContainerUp");
const scrollGridButtonContainerDown = document.getElementById("scrollGridButtonContainerDown");
const scrollGridContainerElement = document.getElementById("scrollGridContainerElement");

// Define scroll amount (in pixels)
const SCROLL_GRID_CONTAINER_AMOUNT = 700;

// Function to update button states based on scroll position
function updateLandingStickyButtonStates() {
  const { scrollTop, scrollHeight, clientHeight } = scrollGridContainerElement;

  // Disable "Up" button if at the top (scrollTop = 0)
  scrollGridButtonContainerUp.disabled = scrollTop === 0;
  // Disable "Down" button if at the bottom (scrollTop + clientHeight >= scrollHeight)
  scrollGridButtonContainerDown.disabled = scrollTop + clientHeight >= scrollHeight - 1; // Small buffer for rounding
}

// Scroll up
scrollGridButtonContainerUp.addEventListener("click", () => {
  scrollGridContainerElement.scrollBy({
    top: -SCROLL_GRID_CONTAINER_AMOUNT,
    behavior: "smooth",
  });
  setTimeout(updateLandingStickyButtonStates, 300); // Update after smooth scroll finishes
});

// Scroll down
scrollGridButtonContainerDown.addEventListener("click", () => {
  scrollGridContainerElement.scrollBy({
    top: SCROLL_GRID_CONTAINER_AMOUNT,
    behavior: "smooth",
  });
  setTimeout(updateLandingStickyButtonStates, 300); // Update after smooth scroll finishes
});

// Update button states on manual scroll (e.g., with mouse or keyboard)
scrollGridContainerElement.addEventListener("scroll", updateLandingStickyButtonStates);
