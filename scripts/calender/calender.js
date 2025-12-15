// COMMENTED OUT - Now handled by ModernCalendar class in calender.update.js
/*
$(document).ready(function () {
  $(".expand-trigger").addClass("cal-hidden");
  $(document).on("click", "#add-new-arrow", (event) => {
    const $sidebar = $("#sidebar");
    const isOpen = $sidebar.attr("aria-expanded") === "true";
    $sidebar.attr("aria-expanded", !isOpen);
    $(".expand-trigger").removeClass("cal-hidden");

    console.log("Hello :)");
  });

  $(".expand-trigger").on("click", function () {
    $(".expand-trigger").addClass("cal-hidden");
  });
  if (window.innerWidth <= 1024) {
    // Tablet view
    $(".expand-trigger").removeClass("cal-hidden");
    $("#sidebar").attr("aria-expanded", "false");
    $(".expand-trigger").on("click", function () {
      $(".expand-trigger").addClass("cal-hidden");
      const $sidebar = $("#sidebar");
      const isOpen = $sidebar.attr("aria-expanded") === "true";
      $sidebar.attr("aria-expanded", isOpen);
    });
  }
*/

// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  $("#week-view").on("click", ".header-content", async function (event) {
    // Close Container
    const close = event.target.closest(".close-modal");
    if (close) {
      document.querySelectorAll(".week_view_modal_wrapper").forEach((el) => el.remove());
      document.querySelectorAll("#week-view td").forEach((el) => el.classList.remove("selected-task"));
      return;
    }

    // Close Cotainer
    const seeAllProfile = event.target.closest(".see-all-profile");
    if (seeAllProfile) {
      const modalWrapper = seeAllProfile.closest(".week_view_modal_wrapper");
      const invitedSlide = modalWrapper.querySelector("#invitedListUsersSlide");
      invitedSlide.classList.remove(HIDDEN);
      return;
    }

    const backFromInvitedViewModal = event.target.closest("#backFromInvitedViewModal");
    if (backFromInvitedViewModal) {
      const modalWrapper = backFromInvitedViewModal.closest(".week_view_modal_wrapper");
      const invitedListUsersSlide = modalWrapper.querySelector("#invitedListUsersSlide");
      invitedListUsersSlide.classList.add(HIDDEN);
      return;
    }

    // Check if there's a closest ancestor with the class .week_view_modal_wrapper
    if (event.target.closest(".week_view_modal_wrapper")) {
      console.log("Found .week_view_modal_wrapper as an ancestor.");
      // Place the code that should run when the element is inside .week_view_modal_wrapper here
      return;
    }

    try {
      const $this = $(this);
      const day = $this.data("day") || "";
      const category = $this.data("category") || "";
      const fullDate = $this.data("date") || "";
      const content = staticContent[currentView]?.[day]?.header;

      if (!content) {
        console.warn("No content found for day:", day);
        return;
      }

      let profileImagesHtml = "";
      try {
        profileImagesHtml = await generateProfileImagesHtml(content.images || []);
      } catch (error) {
        console.error("Failed to generate profile images:", error);
      }

      const modalHtml = `
            <div class="week_view_modal_wrapper" data-day="${day}">
                <div style="position: relative; height: 100%">
                  <div class="week-view-modal">
                      <div class="modal-header">
                          <div class="title-dot">
                              <span class="${category === "holiday" ? "orange-dot" : "pink-dot"}"></span>
                              <h2>${escapeHtml(content.text || "")}</h2>
                          </div>
                          <button class="close-modal" aria-label="Close modal">×</button>
                      </div>
                      <div class="modal-body">
                          <p><strong><img src="./images/calender/icons/det-Calendar.svg" alt="Calendar" /></strong> ${escapeHtml(fullDate)}</p>
                          ${
                            content.description
                              ? `
                              <div class="det-description">
                                  <strong><img src="./images/calender/icons/det-Paper.svg" alt="Description" /></strong>
                                  <p>${escapeHtml(content.description)}</p>
                              </div>
                          `
                              : ""
                          }
                          <div class="invite-box">
                              <img src="./images/calender/icons/det-invite.svg" alt="Invites" />
                              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
                          </div>
                          <div class="see-all-profile" role="button" tabindex="0">See all</div>
                          <div class="modal-actions">
                              <div>
                                  <button class="invite-btn" aria-label="Invite"><img src="./images/calender/icons/det-invite2.svg" alt="Invite" /></button>
                                  <button class="delete-btn" aria-label="Delete"><img src="./images/calender/icons/det-Trash.svg" alt="Delete" /></button>
                              </div>
                              <button class="edit-btn">Edit</button>
                          </div>
                      </div>
                  </div>
                   
                  <div id="invitedListUsersSlide" class="active_invited_container_slide animate__animated animate__slideInRight ${HIDDEN}">
                   <div class="invite_slide_header">
                     <button id="backFromInvitedViewModal">
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
                     </button>
                     <h2>Invites</h2>
                   </div>

                   <div class="filter_invited">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
                     <input type="text" placeholder="Search invites" />
                   </div>

                     <ul class="invited_lists">
                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/42.jpg" alt="Zlata Glavaš">
                         <h4>Zlata Glavaš</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/93.jpg" alt="Jade Patel">
                         <h4>Jade Patel</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/21.jpg" alt="Sowjanya Taj">
                         <h4>Sowjanya Taj</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/77.jpg" alt="Leah Brooks">
                         <h4>Leah Brooks</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/23.jpg" alt="Lawrence Palmer">
                         <h4>Lawrence Palmer</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/0.jpg" alt="Dan Young">
                         <h4>Dan Young</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Hanaé Menard">
                         <h4>Hanaé Menard</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/32.jpg" alt="Krystyna Glaß">
                         <h4>Krystyna Glaß</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/12.jpg" alt="Jean Schmitt">
                         <h4>Jean Schmitt</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/78.jpg" alt="Leslie Jones">
                         <h4>Leslie Jones</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Vildan Babaoğlu">
                         <h4>Vildan Babaoğlu</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/25.jpg" alt="Jimi Jarvela">
                         <h4>Jimi Jarvela</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/14.jpg" alt="مهدي یاسمی">
                         <h4>مهدي یاسمی</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>

                       <li>
                         <img src="https://randomuser.me/api/portraits/med/men/10.jpg" alt="Živan Pejaković">
                         <h4>Živan Pejaković</h4>
                         <button>
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
                         </button>
                       </li>
                     </ul>
                   </div>
                </div>
            </div>
        `;

      // Remove existing modals and append new one
      $(".week_view_modal_wrapper").remove();
      $this.append(modalHtml);
    } catch (error) {
      console.error("Error in header-content click handler:", error);
    }
  });
  */

// HTML escape utility
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Add click and hover events
let isModalOpen = false;
// Generate truncated description
function getTruncatedDescription(description) {
  const maxLength = 90; // Adjust based on how many characters fit in two lines
  if (description.length > maxLength) {
    const truncatedText = description.slice(0, maxLength) + "...";
    return {
      truncated: truncatedText,
      full: description,
    };
  }
  return { truncated: description, full: null };
}
const moreBy = [
  {
    time: "10:00 AM",
    detail: "Health Benefits Wal...",
    full: "Health Benefits Walkthrough",
  },
  {
    time: "10:00 AM",
    detail: "Health Benefits Wal...",
    full: "Health Benefits Walkthrough",
  },
  {
    time: "10:00 AM",
    detail: "Health Benefits Wal...",
    full: "Health Benefits Walkthrough",
  },
];

const randomImages = generateRandomImages(sampleImages);
const randomImagesHtml = randomImages.map((image) => `<img src="${image}" alt="Profile Image" class="profile-img" />`).join("");
// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  $("#week-view").on("click", "td", async function (event) {
    // Close Container
    const close = event.target.closest(".close-modal");
    if (close) {
      document.querySelectorAll(".week_view_modal_wrapper").forEach((el) => el.remove());
      document.querySelectorAll("#week-view td").forEach((el) => el.classList.remove("selected-task"));
      return;
    }

    // Close Cotainer
    const seeAllProfile = event.target.closest(".see-all-profile");
    if (seeAllProfile) {
      const modalWrapper = seeAllProfile.closest(".week_view_modal_wrapper");
      const invitedSlide = modalWrapper.querySelector("#invitedListUsersSlide");
      invitedSlide.classList.remove(HIDDEN);
      return;
    }

    const backFromMoreUsersModal = event.target.closest("#backFromMoreUsersModal");
    if (backFromMoreUsersModal) {
      event.target.closest("#moreFromUserContainerSlide").classList.add(HIDDEN);
      return;
    }

    const seeAllBy = event.target.closest(".see-all-by");
    if (seeAllBy) {
      const modalWrapper = seeAllBy.closest(".week_view_modal_wrapper");
      const moreFromUserContainerSlide = modalWrapper.querySelector("#moreFromUserContainerSlide");
      moreFromUserContainerSlide.classList.remove(HIDDEN);
      return;
    }

    const backFromInvitedViewModal = event.target.closest("#backFromInvitedViewModal");
    if (backFromInvitedViewModal) {
      const modalWrapper = backFromInvitedViewModal.closest(".week_view_modal_wrapper");
      const invitedListUsersSlide = modalWrapper.querySelector("#invitedListUsersSlide");
      invitedListUsersSlide.classList.add(HIDDEN);
      return;
    }

    // Check if there's a closest ancestor with the class .week_view_modal_wrapper
    if (event.target.closest(".week_view_modal_wrapper")) {
      console.log("Found .week_view_modal_wrapper as an ancestor.");
      // Place the code that should run when the element is inside .week_view_modal_wrapper here
      return;
    }

    // if (isModalOpen) return;
    isModalOpen = true;
    const day = $(this).data("day");
    const time = $(this).data("time");
    const fullDate = $(this).data("date");

    const content = staticContent[currentView]?.[day]?.[time];
    const isHighlighted = $(this).data("isHighlighted") || false; // Retrieve stored state

    if (!content) return;
    const isMultipleTasks = Array.isArray(content);
    const numOfTask = content.length;

    const profileImagesHtml = await generateProfileImagesHtml(content.images || []);
    // const profileImages =
    const descriptionData = getTruncatedDescription(content.description || "");
    const descriptionHtml = `
  <div class="det-description">
    <strong><img src="./images/calender/icons/det-Paper.svg" /></strong>
    <div class="des-expand">
    <p class="description-text">${descriptionData.truncated}</p>
    ${descriptionData.full ? `<button class="read-more-btn">Read All</button>` : ""}
    
    ${descriptionData.full ? `<p class="full-description" >${descriptionData.full}</p>` : ""}
    </div>
  </div>`;

    $("#week-view td").removeClass("selected-task");
    $(this).addClass("selected-task");

    const categoryDotClass =
      {
        task: "purple-dot",
        event: "blue-dot",
        holiday: "green-dot",
        birthday: "yellow-dot",
      }[content.category] || "";

    // Generate profile images with random names

    // Generate the modal content
    if (currentView === "private") {
      const modalHtml = `
    <div class="week_view_modal_wrapper">
      <div style="position: relative; height: 100%">
      <div class="week-view-modal">
          <div class="modal-header">
          <div class="title-dot">
              <div class="${categoryDotClass}"></div>
              <h2>${content.text_2 || content.text || "No Title"}</h2>
              </div>
              <button class="close-modal">&times;</button>
          </div>
          <div class="modal-body">
          <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
              ${time ? `<p><strong><img src="./images/calender/icons/det-Time.svg" /></strong> ${time}</p>` : ""}
             
              ${descriptionHtml}
              <div class="invite-box"> 
              <img src="./images/calender/icons/det-invite.svg" />
              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
              </div>
               <div class="another-picture">
              </div>
              <div class="see-all-profile">See all</div>
              
              <div class="modal-actions">
              <div>
                  <button class="invite-btn"><img        src="./images/calender/icons/det-invite2.svg"/></button>
                  <button class="delete-btn"><img src="./images/calender/icons/det-Trash.svg" /></button>
                  </div>
                  <button class="edit-btn">Edit</button>
              </div>
          </div>
      </div>

      <div id="moreFromUserContainerSlide" class="active_invited_container_slide animate__animated animate__slideInRight cal-hidden">
                      <div class="moreFromUserContainerSlideWrapper">
                        <div class="invite_slide_header">
                          <button id="backFromMoreUsersModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
                          </button>
                          <h2>More by West Henry</h2>
                        </div>

                        <div class="main-form-wrapper">
                          <form class="filter_invited">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
                            <input type="text" placeholder="Search Events" />
                          </form>

                          <ul class="bookmarked_list">
                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>
                          </ul>
                        </div>

                        <button class="more-from-user-location-button">
                          <span class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"></path></svg>
                          </span>
                          <span class="text-content">Highlight all on Calendar</span>
                        </button>
                      </div>
                  </div>

      <div id="invitedListUsersSlide" class="active_invited_container_slide animate__animated animate__slideInRight ${HIDDEN}">
        <div class="invite_slide_header">
          <button id="backFromInvitedViewModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
          </button>
          <h2>Invites</h2>
        </div>

        <div class="filter_invited">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
          <input type="text" placeholder="Search invites" />
        </div>

          <ul class="invited_lists">
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/42.jpg" alt="Zlata Glavaš">
              <h4>Zlata Glavaš</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/93.jpg" alt="Jade Patel">
              <h4>Jade Patel</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/21.jpg" alt="Sowjanya Taj">
              <h4>Sowjanya Taj</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/77.jpg" alt="Leah Brooks">
              <h4>Leah Brooks</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/23.jpg" alt="Lawrence Palmer">
              <h4>Lawrence Palmer</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/0.jpg" alt="Dan Young">
              <h4>Dan Young</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Hanaé Menard">
              <h4>Hanaé Menard</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/32.jpg" alt="Krystyna Glaß">
              <h4>Krystyna Glaß</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/12.jpg" alt="Jean Schmitt">
              <h4>Jean Schmitt</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/78.jpg" alt="Leslie Jones">
              <h4>Leslie Jones</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Vildan Babaoğlu">
              <h4>Vildan Babaoğlu</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/25.jpg" alt="Jimi Jarvela">
              <h4>Jimi Jarvela</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/14.jpg" alt="مهدي یاسمی">
              <h4>مهدي یاسمی</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/10.jpg" alt="Živan Pejaković">
              <h4>Živan Pejaković</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
      </div>
      `;

      // Append the modal next to the clicked cell
      $(".week_view_modal_wrapper").remove();
      $(this).append(modalHtml);
    } else if (currentView === "public" && !isMultipleTasks) {
      const modalHtml = `
       <div class="week_view_modal_wrapper">
      <div style="position: relative; height: 100%">
      <div class="week-view-modal">
          <div class="modal-header">
           <h2><img src="./images/calender/icons/Avatar.svg"/> Wade Warren <span class="purple-color">Host</span> </h2>
          <button class="close-modal">&times;</button>
          </div>
          <div class="title-dot">
              <div class="${categoryDotClass}"></div>
              <h2>${content.text_2 || content.text || "No Title"}</h2>
              </div>
          <div class="modal-body">
          <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
              ${time ? `<p><strong><img src="./images/calender/icons/det-Time.svg" /></strong> ${time}</p>` : ""}
             
              ${descriptionHtml}
              <div class="invite-box"> 
              <img src="./images/calender/icons/det-invite.svg" />
              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
              </div>
              <div class="another-picture">
              </div>
              <div class="see-all-profile"> See all </div>
             <div class="more-by">
        <div class="more-by-header">
          <h3>More by Wade</h3>
          <button class="see-all see-all-by">See all</button>
        </div>
        <ul class="more-by-list">
          ${moreBy
            .map(
              (item) => `
            <li class="more-by-item">
              <strong>${item.time}</strong> 
              <span>${item.detail}</span>
              <div class="profile-right">
                        ${randomImagesHtml}
                      </div>
            </li>`
            )
            .join("")}
        </ul>
      </div>
    
          <div class="modal-actions">
            <div>
              <button class="more-from-user-location-button not-positioned">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"></path></svg>
                </span>
                <span class="text-content">Highlight all on Calendar</span>
              </button>
            </div>
            <button class="open-btn">open</button>
          </div>
        </div>
      </div>


      <div id="moreFromUserContainerSlide" class="active_invited_container_slide animate__animated animate__slideInRight cal-hidden">
                      <div class="moreFromUserContainerSlideWrapper">
                        <div class="invite_slide_header">
                          <button id="backFromMoreUsersModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
                          </button>
                          <h2>More by West Henry</h2>
                        </div>

                        <div class="main-form-wrapper">
                          <form class="filter_invited">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
                            <input type="text" placeholder="Search Events" />
                          </form>

                          <ul class="bookmarked_list">
                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>
                          </ul>
                        </div>

                        <button class="more-from-user-location-button">
                          <span class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"></path></svg>
                          </span>
                          <span class="text-content">Highlight all on Calendar</span>
                        </button>
                      </div>
                  </div>

       <div id="invitedListUsersSlide" class="active_invited_container_slide animate__animated animate__slideInRight ${HIDDEN}">
        <div class="invite_slide_header">
          <button id="backFromInvitedViewModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
          </button>
          <h2>Invites</h2>
        </div>

        <div class="filter_invited">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
          <input type="text" placeholder="Search invites" />
        </div>

          <ul class="invited_lists">
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/42.jpg" alt="Zlata Glavaš">
              <h4>Zlata Glavaš</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/93.jpg" alt="Jade Patel">
              <h4>Jade Patel</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/21.jpg" alt="Sowjanya Taj">
              <h4>Sowjanya Taj</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/77.jpg" alt="Leah Brooks">
              <h4>Leah Brooks</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/23.jpg" alt="Lawrence Palmer">
              <h4>Lawrence Palmer</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/0.jpg" alt="Dan Young">
              <h4>Dan Young</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Hanaé Menard">
              <h4>Hanaé Menard</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/32.jpg" alt="Krystyna Glaß">
              <h4>Krystyna Glaß</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/12.jpg" alt="Jean Schmitt">
              <h4>Jean Schmitt</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/78.jpg" alt="Leslie Jones">
              <h4>Leslie Jones</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Vildan Babaoğlu">
              <h4>Vildan Babaoğlu</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/25.jpg" alt="Jimi Jarvela">
              <h4>Jimi Jarvela</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/14.jpg" alt="مهدي یاسمی">
              <h4>مهدي یاسمی</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/10.jpg" alt="Živan Pejaković">
              <h4>Živan Pejaković</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
      </div>
      `;

      // Append the modal next to the clicked cell
      $(".week_view_modal_wrapper").remove(); // Remove existing modals
      $(this).append(modalHtml);
    } else if (currentView === "public" && isMultipleTasks) {
      const modalHtml = `
    <div class="week_view_modal_wrapper">
      <div style="position: relative; height: 100%">
      <div class="week-view-modal multiple-tasks-modal">
        <div class="modal-header">
          <div class="title-dot">
            <div class="task-count-indicator-modal">${numOfTask}</div>
            <h2 class="modal-label">Tasks</h2>
          </div>
          <button class="close-modal">&times;</button>
        </div>
         <div class="public-search">
              <img src="./images/calender/icons/Search.svg" />
              <input type="text" placeholder="Search" />
            </div>
        <div class="modal-body">
          <ul class="tasks-list">
            ${content
              .map((task) => {
                const randomName = generateRandomName();
                const randomImages = generateRandomImages(sampleImages);
                const randomImagesHtml = randomImages.map((image) => `<img src="${image}" alt="Profile Image" class="profile-img" />`).join("");

                return `
                  <li class="task-item">
                  <div class="multiple-task-with-highlight">
                    <div class="task-title">
                      <strong>${task.time || "Untitled Time"}</strong><br />
                      <strong>${task.text_2 || task.text_1 || "Untitled Task"}</strong>
                    </div>
                    <div class="multiple-task-highlight data-tooltip="highlight">
                            <img class="highlighted-icon" <img src="./images/calender/icons/hover-highlight.svg"  />
                            
   
  
                </div>
                    </div>
                    <div class="profile-images multiple-task-image">
                      <div class="profile-left">
                        <img src="${sampleImages[Math.floor(Math.random() * sampleImages.length)]}" alt="Profile Image" class="profile-img-left" />
                        <span class="profile-name">${randomName}</span>
                      </div>
                      <div class="profile-right">
                        ${randomImagesHtml}
                      </div>
                    </div>
                  </li>`;
              })
              .join("")}
          </ul>
          <div class="highlight-for-multiple">
            <button class="highlight-icon ${isHighlighted ? "remove" : "highlighttt"}">
              <span class="highlight-text">${isHighlighted ? "Remove this highlight" : "Highlight this icon"}</span>
              <img src="./images/calender/icons/${isHighlighted ? "remove-higlight.svg" : "det-higlight-footer.svg"}" />
            </button>   
          </div>
        </div>
      </div>



      <div id="moreFromUserContainerSlide" class="active_invited_container_slide animate__animated animate__slideInRight cal-hidden">
                      <div class="moreFromUserContainerSlideWrapper">
                        <div class="invite_slide_header">
                          <button id="backFromMoreUsersModal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
                          </button>
                          <h2>More by West Henry</h2>
                        </div>

                        <div class="main-form-wrapper">
                          <form class="filter_invited">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
                            <input type="text" placeholder="Search Events" />
                          </form>

                          <ul class="bookmarked_list">
                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>

                            <li>
                              <div class="bookmarked_header">
                                <div>
                                  <p>10:00AM</p>
                                  <h3>Onboarding Content</h3>
                                </div>

                                <button class="location">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path fill="#33363F" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16" /></svg>
                                </button>
                              </div>

                              <div>
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                                <img src="https://images.unsplash.com/photo-1694881227396-ce65d526e6c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhlYWRwaG9uZSUyMG1hbnxlbnwwfHwwfHx8MA%3D%3D" alt="" />
                              </div>
                            </li>
                          </ul>
                        </div>

                        <button class="more-from-user-location-button">
                          <span class="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M11 22.95v-2q-3.125-.35-5.363-2.587T3.05 13h-2v-2h2q.35-3.125 2.588-5.363T11 3.05v-2h2v2q3.125.35 5.363 2.588T20.95 11h2v2h-2q-.35 3.125-2.587 5.363T13 20.95v2zM12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"></path></svg>
                          </span>
                          <span class="text-content">Highlight all on Calendar</span>
                        </button>
                      </div>
                  </div>

      <div id="invitedListUsersSlide" class="active_invited_container_slide animate__animated animate__slideInRight ${HIDDEN}">
        <div class="invite_slide_header">
          <button id="backFromInvitedViewModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6" /></svg>
          </button>
          <h2>Invites</h2>
        </div>

        <div class="filter_invited">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#cecece" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314" /></svg>
          <input type="text" placeholder="Search invites" />
        </div>

        <ul class="invited_lists">
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/42.jpg" alt="Zlata Glavaš">
              <h4>Zlata Glavaš</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/93.jpg" alt="Jade Patel">
              <h4>Jade Patel</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/21.jpg" alt="Sowjanya Taj">
              <h4>Sowjanya Taj</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/77.jpg" alt="Leah Brooks">
              <h4>Leah Brooks</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/23.jpg" alt="Lawrence Palmer">
              <h4>Lawrence Palmer</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/0.jpg" alt="Dan Young">
              <h4>Dan Young</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Hanaé Menard">
              <h4>Hanaé Menard</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/32.jpg" alt="Krystyna Glaß">
              <h4>Krystyna Glaß</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/12.jpg" alt="Jean Schmitt">
              <h4>Jean Schmitt</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/78.jpg" alt="Leslie Jones">
              <h4>Leslie Jones</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/women/17.jpg" alt="Vildan Babaoğlu">
              <h4>Vildan Babaoğlu</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/25.jpg" alt="Jimi Jarvela">
              <h4>Jimi Jarvela</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/14.jpg" alt="مهدي یاسمی">
              <h4>مهدي یاسمی</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
    
            <li>
              <img src="https://randomuser.me/api/portraits/med/men/10.jpg" alt="Živan Pejaković">
              <h4>Živan Pejaković</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"></path></svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
      `;

      // Remove existing modals and append the new one
      $(".week_view_modal_wrapper").remove();
      $(this).append(modalHtml);
    }

    $(".full-description").addClass("cal-hidden");
    $(document).on("click", ".read-more-btn", function () {
      const $button = $(this);
      const $fullDescription = $button.closest(".des-expand").find(".full-description");
      const $truncatedText = $button.closest(".des-expand").find(".description-text");

      console.log("Read More clicked");
      $(".full-description").removeClass("cal-hidden");
      $(".description-text").addClass("cal-hidden");
      $(".read-more-btn").addClass("cal-hidden");

      this.addClass("cal-hidden");

      // Toggle visibility of the descriptions
      $fullDescription.removeClass("cal-hidden");
      $truncatedText.addClass("cal-hidden");
      $button.addClass("cal-hidden");
    });
  });
  */

// Function to generate additional profiles
async function generateAdditionalProfilesHtml() {
  const randomNames = ["Jane Doe", "Chris Evans", "Mark Taylor"];
  const sampleImages = ["https://randomuser.me/api/portraits/men/1.jpg", "https://randomuser.me/api/portraits/men/2.jpg", "https://randomuser.me/api/portraits/women/1.jpg"];

  return randomNames
    .map(
      (name, index) => `
          <div class="profile-item extra-profile-item">
            <img src="${sampleImages[index % sampleImages.length]}" alt="profile">
            <p>${name}</p>
          </div>`
    )
    .join("");
}

// Open a new modal when Invite or Delete buttons are clicked
// NOTE: Edit button is handled by calender.update.js ModalHandler class
$(document).on("click", ".invite-btn, .delete-btn", function () {
  let modalContent = "";
  let isMobile = window.innerWidth <= 700; // Adjust breakpoint as needed

  if ($(this).hasClass("delete-btn")) {
    modalContent = `   <div class="close-mobile close-modal">
                <img src="./images/calender/icons/close-mobile.svg" />

      </div>
            ${isMobile ? '<div class="mobile-modal-wrapper">' : ""}
             
                <div class="delete-modal-body">
                    <img src="./images/calender/icons/det-delete.svg" />
                    <h2>Delete Holiday</h2>
                    <p>Are you sure you want to delete this Private Holiday? This action cannot be undone.</p>
                </div>
                <div class="delete-modal-footer">
                    <button class="close-modal">Cancel</button>
                    <button class="yes-delete">Yes, Delete</button>
                </div>
            ${isMobile ? "</div>" : ""}
        `;

    $(".week-view-modal").html(modalContent);
  } else if ($(this).hasClass("invite-btn")) {
    let inviteModal = $(".invite-modal-template").html();
    $(".week-view-modal").html(inviteModal);
  }
});

// Highlight Icon Click Handler
$("#week-view").on("click", ".highlight-icon", function (e) {
  e.stopPropagation(); // Prevent triggering parent cell click
  const parentCell = $(this).closest("td");
  parentCell.removeClass("selected-task");
  const isHighlighted = parentCell.toggleClass("highlighted").hasClass("highlighted");

  // Update the state on the parent cell
  parentCell.data("isHighlighted", isHighlighted);

  // Update the icon and text
  const button = $(this);
  const img = button.find("img");
  const hoverText = button.find(".highlight-text");

  if (isHighlighted) {
    console.log("Switching to 'Remove Highlight' state");
    button.removeClass("highlighttt").addClass("remove"); // Black background
    img.attr("src", "./images/calender/icons/remove-higlight.svg?" + new Date().getTime()); // Update image
    hoverText.text("Remove this highlight"); // Update hover text
  } else {
    console.log("Switching to 'Highlight' state");
    button.removeClass("remove").addClass("highlighttt"); // Orange background
    img.attr("src", "./images/calender/icons/det-higlight-footer.svg?" + new Date().getTime()); // Reset image
    hoverText.text("Highlight this icon");
    parentCell.removeClass("selected-task");
  }

  $(".week-view-modal").remove();
});

// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  // Handle button clicks
  $(".public").on("click", function () {
    currentView = "public";
    $(".public").addClass("clicked");
    $(".private").removeClass("clicked");

    const $wrapper = $(this).closest(".switch_buttons_wrapper");
    // find *its* slider
    const $slider = $wrapper.find(".switch_sliding--slider");
    $slider.css("transform", "translateX(100%)");

    $("#week-view").on("click", ".multiple-task-highlight", function (e) {
      e.stopPropagation();
      const taskItem = $(this).closest(".task-item");

      taskItem.toggleClass("highlighted");
      console.log("Task highlighted");

      const img = $(this).find(".highlighted-icon");
      const isHighlighted = taskItem.hasClass("highlighted");

      if (isHighlighted) {
        img.attr("src", "./images/calender/icons/det-higlighted.svg");

        const randomName = taskItem.find(".profile-left .profile-name").text();

        $(".highlight-success-message").remove();

        // Create a new success message
        const successMessage = $(
          `<div class="highlight-success-message">
              <div class="left-success">
                <img src="./images/calender/icons/det-higlight.svg"  alt="Highlight Icon" class="success-icon" />
                <span>Task highlighted  <strong>${randomName}</strong></span>
              </div>
              <div class="right-close">
                <button class="close-success"><img src="./images/calender/icons/success_close.svg" /></button>
              </div>
           </div>`
        );

        $("body").append(successMessage);
        successMessage.find(".close-success").on("click", function () {
          successMessage.remove();
        });

        // Automatically hide the message after 3 seconds
        setTimeout(() => {
          successMessage.fadeOut(300, () => successMessage.remove());
        }, 3000);
      } else {
        img.attr("src", "./images/calender/icons/hover-highlight.svg");
      }
    });

    $("#week-view").on("click", ".highlight-icon-on-cell", function (e) {
      e.stopPropagation();
      const parentCell = $(this).closest("td");
      parentCell.toggleClass("highlighted");
      console.log("highlightedd");
      const img = $(this).find(".highlighted-icon");
      const isHighlighted = parentCell.hasClass("highlighted");

      if (isHighlighted) {
        img.attr("src", "./images/calender/icons/det-higlighted.svg");
      } else {
        img.attr("src", "./images/calender/icons/hover-highlight.svg");
      }
    });

    generateWeekView(new Date());
    generateMobileView(new Date());
  });

  $(".private").on("click", function () {
    currentView = "private";
    $(".public").removeClass("clicked");
    $(".private").addClass("clicked");

    const $wrapper = $(this).closest(".switch_buttons_wrapper");
    // find *its* slider
    const $slider = $wrapper.find(".switch_sliding--slider");
    $slider.css("transform", "translateX(0%)");

    generateWeekView(new Date());
    generateMobileView(new Date());
  });
  */

function generateMobileView(date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay()); // Start of the week

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let html = `<div class="header-row">`;

  const currentDay = daysOfWeek[date.getDay()]; // Get today's day name

  // Add the header row with days and dates
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    const dayName = daysOfWeek[i];

    // Add a class 'current-day' if it's the current day
    const isToday = dayName === currentDay ? "current-day" : "";

    html += `
            <div class="day-column clickable-day ${isToday}" data-day="${dayName}">
                <div>${dayName}</div>
                <div class="large-font">${day.getDate()}</div>
            </div>`;
  }

  html += `</div>`;

  // **Placeholder for header content (will be updated dynamically)**
  html += `<div id="header-content"></div>`;

  html += `<div class="body-container">`;

  // Create rows for each hour of the day
  for (let hour = 7; hour <= 30; hour++) {
    const adjustedHour = hour > 24 ? hour - 24 : hour;
    const time = adjustedHour <= 11 ? `${adjustedHour} AM` : adjustedHour === 12 ? `12 PM` : `${adjustedHour - 12} PM`;

    html += `<div class="mobile-row"  data-time="${time}" data-day="${currentDay}" data-date="${date.toISOString().split("T")[0]}">
          <div class="time-row">
              <div class="time-column">${time}</div>
              <div class="items-column" id="items-${time.replace(" ", "-")}"></div>
          </div>
          </div>`;
  }

  html += `</div>`;

  $("#mobile-view").html(html);

  $(".clickable-day").on("click", function () {
    $(".clickable-day").removeClass("selected-day");
    $(this).addClass("selected-day");

    const selectedDay = $(this).data("day");
    updateMobileItems(selectedDay);
  });

  console.log("Current Day:", currentDay);
  updateMobileItems(currentDay);
}

// Function to update the items for the selected day
function updateMobileItems(selectedDay) {
  if (!staticContent[currentView]) {
    console.error("Invalid currentView:", currentView);
    return;
  }

  const dayContent = staticContent[currentView][selectedDay];

  $("#header-content").empty();

  if (!dayContent) {
    console.warn(`No content found for ${selectedDay} in ${currentView} view.`);
    return;
  }

  if (dayContent.header) {
    const headerText = dayContent.header.text || "";
    const headerCategory = dayContent.header.category || "default";
    const headerClass = `static-${headerCategory}`;

    $("#header-content").html(`
            <div class="header-container">
                <span>All day</span>
                <div class="${headerClass}">${headerText}</div>
            </div>
        `);
  }

  $(".items-column").empty();

  for (const [time, content] of Object.entries(dayContent)) {
    if (time === "header") continue;

    const timeId = time.replace(" ", "-");
    const $cell = $(`#items-${timeId}`);

    if (Array.isArray(content)) {
      // Multiple tasks exist at this time slot
      let taskCount = content.length;

      content.forEach((event, index) => {
        const text_1 = event.text_1 || "";
        const text_2 = event.text_2 || "";
        const categoryClass = `static-${event.category || "default"}`;

        let imagesHtml = "";
        if (event.images && event.images.length > 0) {
          imagesHtml = `<div class="item-profile-images">
                        ${event.images.map((img) => `<img src="${img}" alt="profile" class="profile-image">`).join("")}
                    </div>`;
        }

        // If it's the first event, show the count
        let taskCountBadge = index === 0 && taskCount > 1 ? `<span class="task-count">${taskCount}</span>` : "";

        $cell.append(`
                    <div class="event-container ${categoryClass}">
                        ${taskCountBadge}
                        ${text_1 ? `<div>${text_1}</div>` : ""}
                        ${text_2 ? `<div>${text_2}</div>` : ""}
                        ${imagesHtml}
                    </div>
                `);
      });
    } else if (typeof content === "object" && content !== null) {
      // Single event
      const text_1 = content.text_1 || "";
      const text_2 = content.text_2 || "";
      const categoryClass = `static-${content.category || "default"}`;

      let imagesHtml = "";
      if (content.images && content.images.length > 0) {
        imagesHtml = `<div class="item-profile-images">
                    ${content.images.map((img) => `<img src="${img}" alt="profile" class="profile-image">`).join("")}
                </div>`;
      }

      $cell.append(`
                <div class="event-container ${categoryClass}">
                    ${text_1 ? `<div>${text_1}</div>` : ""}
                    ${text_2 ? `<div>${text_2}</div>` : ""}
                    ${imagesHtml}
                </div>
            `);
    }
  }
}
// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  $("#mobile-view").on("click", ".header-content", async function () {
    const day = $(this).data("day");
    const category = $(this).data("category");
    const fullDate = $(this).data("date");
    const content = staticContent[currentView]?.[day]?.header;

    if (!content) return;
    const profileImagesHtml = await generateProfileImagesHtml(content.images || []);

    // Generate modal content for headers
    const modalHtml = `
      <div class="week-view-modal">
        <div class="modal-header">
        <div class = "title-dot">
          <span class="${category === "holiday" ? "orange-dot" : "pink-dot"}"></span>
          <h2>${content.text}</h2>
          </div>
           <button class="close-modal">&times;</button>
        </div>
        
        <div class="modal-body">
          <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
             
             
              ${content.description ? `<div class="det-description"><strong><img  src="./images/calender/icons/det-Paper.svg" /></strong><p> ${content.description} </p></div>` : ""}
              <div class="invite-box"> 
              <img src="./images/calender/icons/det-invite.svg" />
              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
              </div>
              <div class="see-all-profile"> See all </div>
              
              <div class="modal-actions">
              <div>
                  <button class="invite-btn"><img        src="./images/calender/icons/det-invite2.svg"/></button>
                  <button class="delete-btn"><img src="./images/calender/icons/det-Trash.svg" /></button>
                  </div>
                  <button class="edit-btn">Edit</button>
              </div>
          </div>
      </div>
    `;

    $(".week-view-modal").remove(); // Remove existing modals
    $(this).append(modalHtml);
  });
  });
  */

// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  $("#mobile-view").on("click", ".mobile-row", async function () {
    console.log("Mobile time-row clicked");

    isModalOpen = true;
    const day = $(this).data("day");
    const time = $(this).data("time");
    const fullDate = $(this).data("date");
    console.log(day, time);

    const content = staticContent[currentView]?.[day]?.[time];
    if (!content) return;

    const isMultipleTasks = Array.isArray(content);
    const numOfTask = isMultipleTasks ? content.length : 1;
    const isHighlighted = $(this).data("isHighlighted") || false; // Retrieve stored state

    if (!content) return;

    // const profileImages =
    const descriptionData = getTruncatedDescription(content.description || "");
    const descriptionHtml = `
  <div class="det-description">
    <strong><img src="./images/calender/icons/det-Paper.svg" /></strong>
    <div class="des-expand">
    <p class="description-text">${descriptionData.truncated}</p>
    ${descriptionData.full ? `<button class="read-more-btn">Read All</button>` : ""}
    
    ${descriptionData.full ? `<p class="full-description" >${descriptionData.full}</p>` : ""}
    </div>
  </div>`;

    const categoryDotClass =
      {
        task: "purple-dot",
        event: "blue-dot",
        holiday: "green-dot",
        birthday: "yellow-dot",
      }[content.category] || "";

    const profileImagesHtml = await generateProfileImagesHtml(content.images || []);

    if (currentView === "private") {
      const modalHtml = `
      <div class="week-view-modal cal-modal">
      <div class="close-mobile close-modal">
                <img src="./images/calender/icons/close-mobile.svg" />

      </div>

      <div class="week-view-modal-mobile">
          <div class="modal-header">
          <div class="title-dot">
              <div class="${categoryDotClass}"></div>
              <h2>${content.text_2 || content.text || "No Title"}</h2>
              </div>
             
          </div>
          <div class="modal-body">
          <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
              ${time ? `<p><strong><img src="./images/calender/icons/det-Time.svg" /></strong> ${time}</p>` : ""}
             
              ${descriptionHtml}
              <div class="invite-box"> 
              <img src="./images/calender/icons/det-invite.svg" />
              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
              </div>
              <div class="see-all-profile"> See all </div>
              
              <div class="modal-actions">
              <div>
                  <button class="invite-btn"><img        src="./images/calender/icons/det-invite2.svg"/></button>
                  <button class="delete-btn"><img src="./images/calender/icons/det-Trash.svg" /></button>
                  </div>
                  <button class="edit-btn">Edit</button>
              </div>
          </div>
          </div>
      </div>`;

      // Append the modal next to the clicked cell
      $(".week-view-modal").remove(); // Remove existing modals
      $(this).append(modalHtml);
    } else if (currentView === "public" && !isMultipleTasks) {
      const modalHtml = `
      <div class="week-view-modal cal-modal">
          <div class="close-mobile close-modal">
                <img src="./images/calender/icons/close-mobile.svg" />

      </div>
      <div class= "week-view-modal-mobile ">
          <div class="modal-header">
           <h2><img src="./images/calender/icons/Avatar.svg"/> Wade Warren <span class="purple-color">Host</span> </h2>
         
          </div>
          <div class="title-dot">
              <div class="${categoryDotClass}"></div>
              <h2>${content.text_2 || content.text || "No Title"}</h2>
              </div>
          <div class="modal-body">
          <p><strong><img src="./images/calender/icons/det-Calendar.svg" /></strong> ${fullDate}</p>
              ${time ? `<p><strong><img src="./images/calender/icons/det-Time.svg" /></strong> ${time}</p>` : ""}
             
              ${descriptionHtml}
              <div class="invite-box"> 
              <img src="./images/calender/icons/det-invite.svg" />
              ${profileImagesHtml ? `<div class="profile-images">${profileImagesHtml}</div>` : ""}
              </div>
              <div class="see-all-profile"> See all </div>
             <div class="more-by">
        <div class="more-by-header">
          <h3>More by Wade</h3>
          <button class="see-all see-all-by">See all</button>
        </div>
        <ul class="more-by-list">
          ${moreBy
            .map(
              (item) => `
            <li class="more-by-item">
              <strong>${item.time}</strong> 
              <span>${item.detail}</span>
              <div class="profile-right">
                        ${randomImagesHtml}
                      </div>
            </li>`
            )
            .join("")}
        </ul>
      </div>

             
              
              <div class="modal-actions">
              <div>
                 <button class="highlight-icon ${isHighlighted ? "remove" : "highlighttt"}">
            <img src="./images/calender/icons/${isHighlighted ? "remove-higlight.svg" : "det-higlight-footer.svg"}" />
            <span class="highlight-text">${isHighlighted ? "Remove this highlight" : "Highlight this icon"}</span>
          </button>   
                  </div>
                  <button class="open-btn">open</button>
              </div>
          </div>
          </div>
      </div>`;

      // Append the modal next to the clicked cell
      $(".week-view-modal").remove(); // Remove existing modals
      $(this).append(modalHtml);
    } else if (currentView === "public" && isMultipleTasks) {
      const modalHtml = `
      <div class="week-view-modal multiple-tasks-modal cal-modal">
          <div class="close-mobile close-modal">
                <img src="./images/calender/icons/close-mobile.svg" />

      </div>
        <div class= "week-view-modal-mobile ">
        <div class="modal-header">
          <div class="title-dot">
            <div class="task-count-indicator-modal">${numOfTask}</div>
            <h2 class="modal-label">Tasks</h2>
          </div>
         
        </div>
         <div class="public-search">
              <img src="./images/calender/icons/Search.svg" />
              <input type="text" placeholder="Search" />
            </div>
        <div class="modal-body">
          <ul class="tasks-list">
            ${content
              .map((task) => {
                const randomName = generateRandomName();
                const randomImages = generateRandomImages(sampleImages);
                const randomImagesHtml = randomImages.map((image) => `<img src="${image}" alt="Profile Image" class="profile-img" />`).join("");

                return `
                  <li class="task-item">
                  <div class="multiple-task-with-highlight">
                    <div class="task-title">
                      <strong>${task.time || "Untitled Time"}</strong><br />
                      <strong>${task.text_2 || task.text_1 || "Untitled Task"}</strong>
                    </div>
                    <div class="multiple-task-highlight data-tooltip="highlight">
                            <img class="highlighted-icon" <img src="./images/calender/icons/hover-highlight.svg"  />
                            
   
  
                </div>
                    </div>
                    <div class="profile-images multiple-task-image">
                      <div class="profile-left">
                        <img src="${sampleImages[Math.floor(Math.random() * sampleImages.length)]}" alt="Profile Image" class="profile-img-left" />
                        <span class="profile-name">${randomName}</span>
                      </div>
                      <div class="profile-right">
                        ${randomImagesHtml}
                      </div>
                    </div>
                  </li>`;
              })
              .join("")}
          </ul>
        </div>
        </div>
      </div>`;

      // Remove existing modals and append the new one
      $(".week-view-modal").remove();
      $(this).append(modalHtml);
    }
  });
  */
$(".sidebar_calendar_content_mobile").addClass("cal-hidden");

// COMMENTED OUT - Now handled by SidebarHandler class in calender.update.js
/*
  $("#mobile-month-label").on("click", function () {
    $(".sidebar_calendar_content_mobile").removeClass("cal-hidden");
  });
  $(".add-new-arrow").on("click", function () {
    $(".sidebar_calendar_content_mobile").addClass("cal-hidden");
  });
  */
// Trigger content population and view generation
populateStaticContentWithImages();

// Initial render
if (window.innerWidth <= 760) {
  // Mobile view
  generateMobileView(new Date());
} else {
  // Desktop view
  generateWeekView(new Date());
}

// COMMENTED OUT - Now handled by EventHandler class in calender.update.js
/*
  $(document).on("click", ".see-more-item", function (event) {
    event.stopPropagation();
    const day = $(this).data("day");
    $(this).siblings(".hidden").removeClass("hidden");
    $(this).remove();
  });
  */

$(".week-view-pub-priv").addClass("cal-hidden");

// COMMENTED OUT - Now handled by ViewOptionsHandler class in calender.update.js
/*
  $(".view-options button").on("click", function (e) {
    const view = $(this).data("view");

    $(".view-options button").removeClass("selected-view");
    $(this).addClass("selected-view");

    $("#main-calendar > * , #main-calendar #mobile-view").addClass("cal-hidden");

    if (view === "mob-week") {
      $("#main-calendar #mobile-view").removeClass("cal-hidden");
    }

    if (view === "mob-month") {
      $("#main-calendar #mobmon-view").removeClass("cal-hidden");
    }

    if (view === "mob-year") {
      $("#main-calendar #mobyear-view").removeClass("cal-hidden");
    }

    if (view === "week") {
      $("#main-calendar #weekViewContainer").removeClass("cal-hidden");
    } else {
      $(`#${view}-view`).removeClass("cal-hidden");
    }

    $("#prev, #next").removeClass("cal-hidden");

    if (view === "week" || view === "mob-week") {
      updateMainLabel("week", selectedDate);
      $(".navigation").addClass("cal-hidden");
      $(".week-view-pub-priv").removeClass("cal-hidden");
    } else if (view === "month" || view === "mob-month") {
      $(".navigation.month-container").removeClass("cal-hidden");
      $(".navigation.year-container").addClass("cal-hidden");
      $(".week-view-pub-priv").addClass("cal-hidden");
    } else if (view === "year" || view === "mob-year") {
      updateMainLabel("year", selectedDate);
      $(".navigation.month-container").addClass("cal-hidden");
      $(".navigation.year-container").removeClass("cal-hidden");
      $(".week-view-pub-priv").addClass("cal-hidden");
    }
  });
  */

// COMMENTED OUT - Now handled by ViewOptionsHandler class in calender.update.js
/*
  $(".mobile-drop-down").addClass("cal-hidden");

  $(".dropdown-btn").on("click", function (event) {
    event.stopPropagation();
    $(".mobile-drop-down").toggleClass("cal-hidden");
  });

  $(".dropdown-item").on("click", function () {
    var selectedText = $(this).text();
    const view = $(this).data("view");
    console.log("hiiiiiiii", view);

    $(".dropdown-btn").html(selectedText + ` <span class="arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="m15 6l-6 6l6 6"></path></svg></span>`);

    // Hide dropdown after selection
    $(".mobile-drop-down").addClass("cal-hidden");

    if (view === "mob-week") {
      $("#main-calendar #mobile-view").removeClass("cal-hidden");
    }
    if (view === "mob-month") {
      $("#main-calendar #mobmon-view").removeClass("cal-hidden");
    }
    if (view === "mob-year") {
      $("#main-calendar #mobyear-view").removeClass("cal-hidden");
    }
    // Update navigation and labels based on view
    if (view.includes("week")) {
      updateMainLabel("week", selectedDate);
      $(".navigation").addClass("cal-hidden");
      $(".week-view-pub-priv").removeClass("cal-hidden");
    } else if (view.includes("month")) {
      updateMainLabel("month", selectedDate);
      $(".navigation").removeClass("cal-hidden");
      $(".week-view-pub-priv").addClass("cal-hidden");
    } else if (view.includes("year")) {
      updateMainLabel("year", selectedDate);
      $(".navigation").removeClass("cal-hidden");
      $(".week-view-pub-priv").addClass("cal-hidden");
    }

    if ($("#mobile-view").is(":visible")) {
      generateMobileView(new Date());
    }
  });

  // Hide dropdown if clicking outside
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".dropdown").length) {
      $(".mobile-drop-down").addClass("cal-hidden");
    }
  });
  */

$("#prev").on("click", function () {
  let view;
  if ($("#week-view").is(":visible")) {
    selectedDate.setDate(selectedDate.getDate() - 7);
    view = "week";
  } else if ($("#month-view").is(":visible")) {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    view = "month";
  } else if ($("#year-view").is(":visible")) {
    selectedDate.setFullYear(selectedDate.getFullYear() - 1);
    view = "year";
  }

  updateMainLabel(view, selectedDate);
  updateMainCalendar();
});

$("#prevMonth").on("click", function () {
  let view;
  if ($("#week-view").is(":visible")) {
    selectedDate.setDate(selectedDate.getDate() - 7);
    view = "week";
  } else if ($("#month-view").is(":visible")) {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    view = "month";
  } else if ($("#year-view").is(":visible")) {
    selectedDate.setFullYear(selectedDate.getFullYear() - 1);
    view = "year";
  }
  // updateMainLabel(view, selectedDate);
  updateMainCalendar();
});

$("#next").on("click", function () {
  let view;
  if ($("#week-view").is(":visible")) {
    selectedDate.setDate(selectedDate.getDate() + 7);
    view = "week";
  } else if ($("#month-view").is(":visible")) {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    view = "month";
  } else if ($("#year-view").is(":visible")) {
    selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    view = "year";
  }

  updateMainLabel(view, selectedDate);
  updateMainCalendar();
});

$("#nextMonth").on("click", function () {
  let view;
  if ($("#week-view").is(":visible")) {
    selectedDate.setDate(selectedDate.getDate() + 7);
    view = "week";
  } else if ($("#month-view").is(":visible")) {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    view = "month";
  } else if ($("#year-view").is(":visible")) {
    selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    view = "year";
  }

  updateMainLabel(view, selectedDate);
  updateMainCalendar();
});

$("#sidebar-prev").on("click", function () {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  updateSidebarMonthLabel(selectedDate);
  generateSidebarCalendar(selectedDate);
  updateMainCalendar();

  goToYearSlider(selectedDate.getFullYear());
  goToMonthSlider(selectedDate.getMonth());
  console.log(selectedDate);

  globalCurrentYear = selectedDate.getFullYear();
});

$("#sidebar-next").on("click", function () {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  updateSidebarMonthLabel(selectedDate);
  generateSidebarCalendar(selectedDate);

  updateMainCalendar();
  goToYearSlider(selectedDate.getFullYear());
  goToMonthSlider(selectedDate.getMonth());

  globalCurrentYear = selectedDate.getFullYear();
});

updateSidebarMonthLabel(today);
generateSidebarCalendar(today);
updateMobileMonthLabel(today);
updateMainCalendar();
if (window.innerWidth <= 760) {
  // Mobile view
  $("[data-view='mob-week']").click();
} else {
  $("[data-view='week']").click();
}

// Manual DOM event by `commandcodes`
// selecting a day in year calender event :)
document.getElementById("year-view").addEventListener("click", (e) => {
  const dayElem = e.target.closest(".day-with-dot");
  const monthElem = e.target.closest(".month");

  const { month } = monthElem.dataset;
  const { day } = dayElem.dataset;

  selectedDate = new Date(globalCurrentYear, +month, +day);

  updateMainCalendar();

  updateSidebarMonthLabel(selectedDate);
  generateSidebarCalendar(selectedDate);

  updateMainCalendar();
  goToYearSlider(selectedDate.getFullYear());
  goToMonthSlider(selectedDate.getMonth());

  $("#sidebar-calendar .day").removeClass("selected");
  const todayDate = new Date().getDate();
  document.querySelector(`.day[data-day="${todayDate}"]`).classList.add("selected");
});
// });

// /////// DYNAMICALLY ADDING ITEMS ON THE CALENDER /////////////////////////
$(document).ready(function (event) {
  let events = []; // Store events, birthdays, holidays here
  let holiday = [];
  let birthday = [];
  let task = [];
  let selectedDate = new Date(); // Global variable for the currently selected date

  // Initialize Datepicker (wrapped in try-catch in case library not loaded)
  try {
    $(".datePicker").datepicker({
      dateFormat: "yy-mm-dd",
      onSelect: function (dateText) {
        selectedDate = new Date(dateText);
        updateCalendars(events);
      },
    });
  } catch (e) {
    console.warn("Datepicker not available:", e);
  }

  // Open "Add New" Modal

  // $("#addNewModal").addClass("cal-hidden");
  // $("#addItemModal").addClass("cal-hidden");
  // $("#eventModal").addClass("cal-hidden");
  // $("#taskModal").addClass("cal-hidden");
  // $("#holidayModal").addClass("cal-hidden");
  // $("#birthdayModal").addClass("cal-hidden");
  // $("#addEventModal").addClass("cal-hidden");
  // $("#addTaskModal").addClass("cal-hidden");
  // $("#addHolidayModal").addClass("cal-hidden");
  // $("#addBirthdayModal").addClass("cal-hidden");
  $("#addTaskOption").addClass("cal-hidden");
  $("#importModal").addClass("cal-hidden");
  $("#upload-interest").addClass("cal-hidden");

  $(".import-task").on("click", function () {
    $("#importModal").removeClass("cal-hidden");
  });

  // let isFirstClick = true;
  // $("#add-new-cal-mobile").on("click", function () {
  //   if (isFirstClick) {
  //     // Show Event Modal
  //     // $("#eventModal").removeClass("cal-hidden").fadeIn().css("display", "flex");
  //     isFirstClick = false;
  //   } else {
  //     // $("#addNewModal").removeClass("cal-hidden").fadeIn().css("display", "flex");
  //   }
  // });

  // NOTE: Primary cancel handlers moved to calender.add.new.js setupModalButtons()
  // This remains as a catch-all for backwards compatibility
  $(".to-cancel").on("click", function () {
    $("#addItemModal").addClass("cal-hidden");
    $("#addEventModal").addClass("cal-hidden");
    $("#addTaskModal").addClass("cal-hidden");
    $("#addHolidayModal").addClass("cal-hidden");
    $("#addBirthdayModal").addClass("cal-hidden");
    $("#importModal").addClass("cal-hidden");
    $("#upload-interest").addClass("cal-hidden");
    $(".invite-input").empty();
    $("#addNewModal").addClass("cal-hidden");
    
    // Reset buttons to "Add" mode when canceling
    $("#addEventModal #eventSubmitBtn").text("Add").removeAttr("data-mode");
    $("#nextTaskModal").text("Next").removeAttr("data-mode");
  });

  // Close modal when clicking outside of .cal-modal-content
  $(".close-modal").on("click", function (e) {
    $(".cal-modal").addClass("cal-hidden");
  });
  $(".cal-modal").on("click", function (e) {
    if ($(e.target).is(".cal-modal")) {
      $(this).addClass("cal-hidden");
      $(".invite-input").empty();
      // $(".week-view-modal").addClass(".cal-hidden")
    }
  });

  // Handle clicks for Add Event, Add Birthday, Add Holiday
  // $("#addEventBtn").on("click", function () {

  //   $("#addNewModal").addClass("cal-hidden");
  //   $("#addEventModal").removeClass("cal-hidden");
  // });
  // $("#addTaskBtn").on("click", function () {

  //   $("#addNewModal").addClass("cal-hidden");

  //   $("#addTaskOption").removeClass("cal-hidden");
  // });

  $(".create-task").on("click", function () {
    $("#addTaskOption").addClass("cal-hidden");

    $("#addTaskModal").removeClass("cal-hidden");
  });
  // $("#addHolidayBtn").on("click", function () {

  //   $("#addNewModal").addClass("cal-hidden");

  //   $("#addHolidayModal").removeClass("cal-hidden");
  // });
  // $("#addBirthdayBtn").on("click", function () {

  //   $("#addNewModal").addClass("cal-hidden");

  //   $("#addBirthdayModal").removeClass("cal-hidden");
  // });

  function updateCalendars(currentEvents) {
    // Update Sidebar Calendar

    updateSidebarCal(currentEvents);

    // Update Main Calendar Views
    updateWeekView(currentEvents);
    updateMonthView(currentEvents);
    updateYearView(currentEvents);
  }
  function updateCalendarsHoliday(events) {
    // Update Sidebar Calendar

    updateSidebarCal(events);

    // Update Main Calendar Views
    updateWeekViewHoliday(events);
    updateMonthView(events);
    updateYearView(events);
  }
  function updateCalendarsTask(events) {
    // Update Sidebar Calendar

    updateSidebarCal(events);

    // Update Main Calendar Views
    updateWeekView(events);
    updateMonthView(events);
    updateYearView(events);
  }
  function updateSidebarCal(currentEvents) {
    $("#sidebar-calendar .day").each(function () {
      const day = $(this).data("day");
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();

      // Clear previous dots
      // $(this).find(".dot").remove();

      // Add dots for current events
      currentEvents.forEach((event) => {
        const eventDate = new Date(event.date);

        if (eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year) {
          const color = "#8B5CF6"; // Adjust the color as needed

          $(this)
            .find(".dots-container")
            .append(`<span class="dot" style="background-color: ${getColorYear(event.type)};;"></span>`);
        }
      });
    });
  }

  function updateWeekView(currentEvents, isPublicView = false) {
    // In this codebase, edits append new items to state.
    // To prevent older revisions from rendering alongside the latest one,
    // we collapse the incoming list to the most recent item per stable key.
    const collapseToLatestByKey = (items) => {
      const latest = new Map();
      items.forEach((item) => {
        if (!item) return;
        const key = `${item.type || ""}|${item.name || ""}|${item.date || ""}`;
        latest.set(key, item);
      });
      return Array.from(latest.values());
    };

    currentEvents = collapseToLatestByKey(currentEvents);

    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    console.log("hhhhh");

    $("#week-view tr").each(function (rowIndex, row) {
      $(row)
        .find("td")
        .each(function (colIndex, cell) {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + colIndex - 1);

          const cellTime = $(cell).data("time"); // e.g., "9 AM"
          const cellDay = $(cell).data("day"); // e.g., "Mon"
          if (!cellTime || !cellDay) return;

          const filteredEvents = currentEvents.filter((event) => {
            const eventDate = new Date(event.date);

            const parseTime = (time) => {
              const [hour, period] = time.split(" ");
              let hour24 = parseInt(hour, 10);
              if (period === "PM" && hour24 !== 12) hour24 += 12;
              if (period === "AM" && hour24 === 12) hour24 = 0;
              return hour24;
            };

            const fromHour = parseTime(event.customTimeFrom);
            const toHour = parseTime(event.customTimeTo);
            const cellHour = parseTime(cellTime);

            return eventDate.toDateString() === day.toDateString() && cellDay === eventDate.toLocaleDateString("en-US", { weekday: "short" }) && cellHour >= fromHour && cellHour < toHour && event.isPublic === isPublicView;
          });

          // Render events in the cell
          filteredEvents.forEach((event) => {
            const eventElement = $(`
              <div class="event-item" data-event-id="${event.name}">
                
                <div class="event-time">${event.fromHour}:00 ${event.fromPeriod}</div>
                <div class="event-title">${event.name}</div>
              </div>
            `);

            eventElement.on("click", function (e) {
              e.stopPropagation();
              console.log("am event");

              // Populate and show the modal
              const modal = $("#eventDetailModal");
              modal.find(".event-title").text(event.name);
              modal.find(".event-date").text(`Date: ${new Date(event.date).toDateString()}`);
              modal.find(".event-time").text(`Time: ${event.customTimeFrom} - ${event.customTimeTo}`);
              modal.find(".event-description").text(event.description);

              // Position the modal next to the clicked cell
              const cellOffset = $(cell).offset();
              modal.css({
                top: cellOffset.top + $(cell).outerHeight(),
                left: cellOffset.left,
              });

              modal.removeClass("cal-hidden").fadeIn();
            });
            $(cell).addClass("static-event").append(eventElement);
            //   $(cell).addClass("static-event").append(`
            //   <div class="event-item">
            //     <div class="event-time">${event.fromHour}:00 ${event.fromPeriod}</div>
            //     <div class="event-title">${event.name}</div>
            //   </div>
            // `);
          });
        });
    });
  }
  $(document).on("click", function (e) {
    const modal = $("#eventDetailModal");
    if (!$(e.target).closest(".detail-modal").length) {
      modal.fadeOut();
    }
  });

  $(".close-modal").on("click", function () {
    $("#eventDetailModal").fadeOut();
  });
  function updateWeekViewHoliday(currentEvents, isPublicView = false) {
    const stripLeadingEmoji = (value) => {
      const text = String(value ?? "");
      // Remove leading emojis/pictographs (plus optional variation selectors / ZWJ), then trim.
      return text
        .replace(
          /^[\s\uFE0F\u200D]*(?:[\u2600-\u27BF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF])+/g,
          ""
        )
        .trim();
    };

    const weekStart = new Date(selectedDate);
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay()); // Start of the week (Sunday)

    // Iterate over header cells
    $("#week-view tr th").each(function (colIndex, header) {
      if (colIndex === 0 || colIndex === 8) return; // Skip time column headers (first and last columns)

      // Calculate the date for the current header
      const headerDate = new Date(weekStart);
      headerDate.setDate(weekStart.getDate() + colIndex - 1); // Adjust based on the column index

      // Normalize headerDate to "YYYY-MM-DD" format
      const normalizedHeaderDate = headerDate.toISOString().split("T")[0];

      const $header = $(header);
      const $headerDiv = $header.find(".the-day-date .header-content");

      if (!$headerDiv.length) {
        console.warn(`Header content div not found for column index ${colIndex}`);
        return;
      }

      // Filter events for the current header's date
      const filteredEvents = currentEvents.filter((event) => {
        const eventDate = new Date(event.date);

        // Normalize eventDate to "YYYY-MM-DD" format
        const normalizedEventDate = eventDate.toISOString().split("T")[0];

        return normalizedEventDate === normalizedHeaderDate && event.isPublic === isPublicView;
      });

      // Clear existing content in the header for fresh render
      $headerDiv.find(".event-title").remove();

      // Append filtered events to the header
      filteredEvents.forEach((event) => {
        const eventClass = event.type === "holiday" ? "static-holiday" : "static-birthday";
        const displayName = stripLeadingEmoji(event.name);
        if (!displayName) return;
        $headerDiv.append($("<span />", { class: `event-title ${eventClass}`, text: displayName }));
      });
    });
  }

  function updateMonthView(events) {
    // See note in updateWeekView(): edits append new items, so render only latest per key.
    const collapseToLatestByKey = (items) => {
      const latest = new Map();
      items.forEach((item) => {
        if (!item) return;
        const key = `${item.type || ""}|${item.name || ""}|${item.date || ""}`;
        latest.set(key, item);
      });
      return Array.from(latest.values());
    };

    events = collapseToLatestByKey(events);

    $("#month-view td").each(function () {
      const cell = $(this);
      const day = parseInt(cell.text(), 10);

      if (isNaN(day)) return; // Skip empty cells

      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();

      // Find or create the day-items container
      let dayItemsDiv = cell.find(".day-items");
      if (dayItemsDiv.length === 0) {
        dayItemsDiv = $('<div class="day-items"></div>');
        cell.append(dayItemsDiv);
      }

      // Filter events for the current day
      const filteredEvents = events.filter((event) => new Date(event.date).getDate() === day && new Date(event.date).getMonth() === month && new Date(event.date).getFullYear() === year);

      filteredEvents.forEach((event) => {
        // Check if the event/holiday is already rendered
        const isAlreadyRendered = dayItemsDiv.find(`.item[data-name="${event.name}"][data-date="${event.date}"]`).length > 0;

        if (!isAlreadyRendered) {
          // Create the event/holiday HTML
          let eventHtml = "";
          if (event.type === "holiday" || event.type === "birthday") {
            eventHtml = `
              <div class="item ${event.type}" data-name="${event.name}" data-date="${event.date}">
               
                  
                    ${event.description}
                 
              </div>
            `;
          } else if (event.type === "event") {
            eventHtml = `
              <div class="item event" data-name="${event.name}" data-date="${event.date}">
                <div class="title-time">
                  <span style="background: ${getBackground(event.type)}">
                    <span style="color: ${getColor(event.type)}">●</span> ${event.description}
                  </span>
                  <span class="dark-light">${event.fromHour}:00 ${event.fromPeriod}</span>
                </div>
              </div>
            `;
          }

          // Append the new item to the day-items div
          dayItemsDiv.append(eventHtml);
        }
      });
    });
  }

  function updateYearView(currentEvents) {
    // See note in updateWeekView(): edits append new items, so render only latest per key.
    const collapseToLatestByKey = (items) => {
      const latest = new Map();
      items.forEach((item) => {
        if (!item) return;
        const key = `${item.type || ""}|${item.name || ""}|${item.date || ""}`;
        latest.set(key, item);
      });
      return Array.from(latest.values());
    };

    currentEvents = collapseToLatestByKey(currentEvents);

    $("#year-view .month-days span").each(function () {
      const cell = $(this);
      const day = parseInt(cell.text(), 10);
      const month = $(this).closest(".month").index();
      const year = selectedDate.getFullYear();

      if (isNaN(day)) return;

      // Clear existing dots
      cell.find(".dots-container").empty();

      const event = currentEvents.find((event) => new Date(event.date).getDate() === day && new Date(event.date).getMonth() === month && new Date(event.date).getFullYear() === year);

      if (event) {
        cell.find(".dots-container").append(`<span  style="color: ${getColorYear(event.type)};">●</span>`);
      }
    });
  }

  function getColor(type) {
    return type === "event" ? "#8B5CF6" : type === "task" ? "#78A8EF" : "";
  }
  function getBackground(type) {
    return type === "birthday" ? "f43f5e" : type === "holiday" ? "#F59E0B" : "";
  }
  function getColorYear(type) {
    return type === "event" ? "#8B5CF6" : type === "task" ? "#78A8EF" : type === "birthday" ? "#f43f5e" : type === "holiday" ? "#F59E0B" : "";
  }
  //  to add items dynamically
  $("#eventSubmitBtn").on("click", function (e) {
    e.preventDefault();

    console.log("=== Event Submit Button Clicked ===");

    // Check if we're in edit mode or add mode
    const isEditMode = $(this).attr("data-mode") === "edit";
    console.log("Edit mode:", isEditMode);
    
    // Gather event data
    const type = "event";
    const name = $("#addEventModal .name").val();
    const description = $("#addEventModal .description").val();
    
    // Get date from the correct input field (#addEventStart)
    const dateFrom = $("#addEventStart").val();
    const dateTo = $("#addEventEnd").val();
    
    console.log("Date From:", dateFrom);
    console.log("Date To:", dateTo);
    console.log("Name:", name);
    console.log("Description:", description);

    if (name && description && dateFrom) {
      // Extract time from datetime string or use defaults
      const fromDate = new Date(dateFrom);
      const toDate = dateTo ? new Date(dateTo) : fromDate;
      
      // Format time as "HH AM/PM" for compatibility with existing calendar view
      const formatTime = (date) => {
        let hours = date.getHours();
        const period = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours} ${period}`;
      };
      
      const newEvent = {
        name,
        type,
        description,
        date: dateFrom.split('T')[0] || dateFrom.split(' ')[0], // Extract date part only
        dateTo: dateTo,
        customTimeFrom: formatTime(fromDate),
        customTimeTo: formatTime(toDate),
        isPublic: $("#addEventModal .pub-priv .public").hasClass("clicked"),
      };

      console.log("New event:", newEvent);

      if (!isNaN(new Date(dateFrom).getTime())) {
        // Save to the global events array first
        events.push(newEvent);
        
        console.log("Total events now:", events.length);
        console.log("All events:", events);

        // Update the calendar with ALL events
        updateCalendars(events);

        // Reset form and hide modal
        $("#addEventModal").addClass("cal-hidden");
        $("#addEventModal .name").val("");
        $("#addEventModal .description").val("");
        $("#addEventStart").val("");
        $("#addEventEnd").val("");
        
        // Reset button to "Add" mode after saving
        $("#eventSubmitBtn").text("Add").removeAttr("data-mode");
        
        // Show success message
        if (isEditMode) {
          console.log("Event updated successfully");
          alert("Event updated successfully!");
        } else {
          console.log("Event added successfully");
          alert("Event added successfully!");
        }
      } else {
        console.error("Invalid date:", dateFrom);
        alert("Please select a valid date");
      }
    } else {
      console.error("Missing required fields");
      alert("Please fill in all required fields (Title and Note)");
    }
  });
  
  console.log("=== Setting up #nextTaskModal handler ===");
  console.log("#nextTaskModal exists?", $("#nextTaskModal").length);
  
  $("#nextTaskModal").on("click", function (e) {
    e.preventDefault();
    
    console.log("=== nextTaskModal clicked ===");
    
    // Check if we're in edit mode
    const isEditMode = $(this).attr("data-mode") === "edit";
    console.log("Edit mode:", isEditMode);
    console.log("Button text:", $(this).text());
    console.log("data-mode attribute:", $(this).attr("data-mode"));
    
    // If in edit mode, save the task directly
    if (isEditMode) {
      type = "task";
      // Gather task data
      const name = $("#addTaskModal .name").val();
      const description = $("#addTaskModal .description").val();
      const date = $("#addTaskModal input[type='text'][id='addTaskStart']").val();
      const invites = gatherInvites();

      console.log("Save task data:", { name, description, date });

      if (name && description && date) {
        const newTask = {
          type,
          name,
          description,
          date,
          invites,
          status: $("#addTaskModal #status").val(),
          isPublic: $("#addTaskModal .pub-priv .public").hasClass("clicked"),
        };
        console.log("Task updated:", newTask);

        // Update the calendar with the edited task
        updateCalendars([newTask]);
        tasks.push(newTask);
        
        console.log("Task updated successfully");
        alert("Task updated successfully!");

        resetTaskForm();
        $("#addTaskModal").addClass("cal-hidden");
        
        // Reset button to "Next" mode after saving
        $(this).text("Next").removeAttr("data-mode");
      } else {
        console.error("Missing required fields for edit");
        alert("Please fill in all required fields (Title, Description, and Date)");
      }
    } else {
      // Normal add mode - proceed to next step (upload-interest modal)
      const name = $("#addTaskModal .name").val();
      const description = $("#addTaskModal .description").val();
      const date = $("#addTaskModal input[type='text'][id='addTaskStart']").val();
      
      console.log("Next step - task data:", { name, description, date });
      
      if (name && description && date) {
        $("#addTaskModal").addClass("cal-hidden");
        $("#upload-interest").removeClass("cal-hidden");
      } else {
        alert("Please fill in all required fields (Title, Description, and Date)");
      }
    }
  });

  // Handler for the Create button in the upload-interest modal (final step of task creation)
  $("#createTaskBtn").on("click", function (e) {
    e.preventDefault();
    
    type = "task";
    // Gather task data from the first modal (addTaskModal)
    const name = $("#addTaskModal .name").val();
    const description = $("#addTaskModal .description").val();
    const date = $("#addTaskModal input[type='text'][id='addTaskStart']").val();
    const invites = gatherInvites();

    if (name && description && date) {
      const newTask = {
        type,
        name,
        description,
        date,
        invites,
        status: $("#addTaskModal #status").val(),
        isPublic: $("#addTaskModal .pub-priv .public").hasClass("clicked"),
      };
      console.log("New task created:", newTask);

      // Update the calendar with the new task
      updateCalendars([newTask]);
      tasks.push(newTask);
      
      console.log("Task created successfully");
      alert("Task created successfully!");

      resetTaskForm();
      $("#upload-interest").addClass("cal-hidden");
      // Reset intro slides so the next Add New starts from the beginning.
      if (typeof window !== "undefined" && typeof window.goToSlide === "function") {
        window.goToSlide(0);
      }
    } else {
      console.error("Missing required fields for task creation");
      alert("Please fill in all required fields (Title, Description, and Date)");
    }
  });

  // Function to gather selected invites
  function gatherInvites() {
    const selectedInvites = [];
    $(".invite-input .selected-user").each(function () {
      const userImage = $(this).find(".user-chip-avatar").attr("src");
      selectedInvites.push({ image: userImage });
    });
    return selectedInvites;
  }

  // Function to reset the task form
  function resetTaskForm() {
    $("#addTaskModal input, #addTaskModal textarea").val("");
    $("#addTaskModal #status").val("pending");
    $(".invite-input").empty();
  }

  $("#holidaySubmitBtn").on("click", function (e) {
    e.preventDefault();

    const type = "holiday";
    const name = $("#addHolidayModal .name").val();
    const description = $("#addHolidayModal .description").val();
    const date = $("#addHolidayModal .holiday-date").val();

    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Date:", date);

    if (name && description) {
      const newHoliday = {
        name,
        type,
        description,
        date,
        isPublic: $("#addHolidayModal .pub-priv .public").hasClass("clicked"),
      };

      if (!isNaN(new Date(date).getTime())) {
        // Add to the global holiday array
        holiday.push(newHoliday);

        // Update the calendar with only the new holiday
        updateMonthView([newHoliday]);
        updateCalendarsHoliday(holiday);
        
        // Close modal and reset form
        $("#addHolidayModal").addClass("cal-hidden");
        $("#addHolidayModal .name").val("");
        $("#addHolidayModal .description").val("");
        
        console.log("Holiday added successfully");
        alert("Holiday added successfully!");
      } else {
        console.error("Invalid date:", date);
        alert("Please select a valid date");
      }
    } else {
      if (!name) console.error("Name is missing");
      if (!description) console.error("Description is missing");
      if (!date) console.error("Date is missing");
      alert("Please fill in all required fields (Title and Note)");
    }
  });
  $("#birthdaySubmitBtn").on("click", function (e) {
    e.preventDefault();

    const type = "birthday";
    const name = $("#addBirthdayModal .selected-item span").first().text();
    const description = $("#addBirthdayModal .selected-item span").first().text();
    const date = $("#addBirthdayModal .holiday-date").val();

    console.log("Name:", name);
    console.log("Date:", date);

    if (name && date) {
      const newBirthday = {
        name,
        type,
        description,
        date,
        isPublic: $("#addBirthdayModal .pub-priv .public").hasClass("clicked"),
      };

      if (!isNaN(new Date(date).getTime())) {
        // Add to the global birthday array
        birthday.push(newBirthday);

        // Update the calendar with only the new birthday
        updateMonthView([newBirthday]);
        updateCalendarsHoliday(birthday);
        
        // Close modal and reset form
        $("#addBirthdayModal").addClass("cal-hidden");
        $("#addBirthdayModal .name").val("");
        $("#addBirthdayModal .description").val("");
        
        console.log("Birthday added successfully");
        alert("Birthday added successfully!");
      } else {
        console.error("Invalid date:", date);
        alert("Please select a valid date");
      }
    } else {
      if (!name) console.error("Name is missing");
      if (!date) console.error("Date is missing");
      alert("Please fill in all required fields (Name and Date)");
    }
  });

  // Handler for Import button in the import task modal
  $("#importBtn").on("click", function (e) {
    e.preventDefault();
    
    // Get all selected tasks
    const selectedTasks = [];
    $(".accounts .select-round.selected").each(function() {
      const accountDiv = $(this).closest(".accounts");
      const taskName = accountDiv.find(".task-name").text();
      const taskStatus = accountDiv.find(".task-status").text().toLowerCase();
      
      selectedTasks.push({
        type: "task",
        name: taskName,
        status: taskStatus,
        description: taskName,
        date: new Date().toISOString().split("T")[0], // Default to today
        isPublic: false // Imported tasks default to private
      });
    });
    
    if (selectedTasks.length > 0) {
      // Add imported tasks to calendar
      selectedTasks.forEach(task => {
        tasks.push(task);
      });
      
      // Update calendar
      updateCalendars(selectedTasks);
      
      console.log(`Imported ${selectedTasks.length} task(s) successfully`);
      alert(`Successfully imported ${selectedTasks.length} task(s)!`);
      
      // Close modal and clear selections
      $("#importModal").addClass("cal-hidden");
      $(".accounts .select-round").removeClass("selected");
    } else {
      alert("Please select at least one task to import");
    }
  });

  $(" .pub-priv span").on("click", function () {
    // $(".pub-priv span").removeClass("clicked");
    $(this).addClass("clicked");

    const isPublicView = $(this).hasClass("public");
    updateWeekView(events, isPublicView);
    updateWeekViewHoliday(holiday, isPublicView);
  });
  $("#addEventModal").on("show.bs.modal", function () {
    $(".pub-priv .private").addClass("clicked");
    $(".pub-priv .public").removeClass("clicked");
  });
});

// Event all day or not /////
$(document).ready(function () {
  $(".event-all-day").addClass("cal-hidden");

  $(".on-off input[type='checkbox']").on("change", function () {
    if ($(this).is(":checked")) {
      // Checkbox is checked: Show all-day and hide not-all-day
      $(".event-not-all-day").addClass("cal-hidden");
      $(".event-all-day").removeClass("cal-hidden");
    } else {
      // Checkbox is unchecked: Show not-all-day and hide all-day
      $(".event-not-all-day").removeClass("cal-hidden");
      $(".event-all-day").addClass("cal-hidden");
    }
  });
});
$(document).ready(function () {
  $('input[type="date"]').click(function () {
    $(this).focus();
  });

  $('input[type="time"]').click(function () {
    $(this).focus();
  });

  $('input[type="date"]').each(function () {
    var placeholderDate = "2025-01-01";

    if (!$(this).val()) {
      $(this).val(placeholderDate);
    }
  });

  $('input[type="time"]').each(function () {
    var placeholderTime = "07:00";

    if (!$(this).val()) {
      $(this).val(placeholderTime);
    }
  });
});

// Weather Api Integration //////

$(document).ready(function () {
  const baseUrl = "https://api.open-meteo.com/v1/forecast";
  const latitude = 40.7128;
  const longitude = -74.006;

  // Fetch weather data
  $.ajax({
    url: baseUrl,
    data: {
      latitude: latitude,
      longitude: longitude,
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
      timezone: "auto",
    },
    success: function (data) {
      const availableDates = data.daily.time;
      const temperatureData = data.daily.temperature_2m_max;
      const minTemperatureData = data.daily.temperature_2m_min;
      const weatherCodes = data.daily.weathercode;

      $(".date-weather").each(function (index) {
        if (index < availableDates.length) {
          const dateElement = $(this);
          const weatherContainer = dateElement.find(".weather");

          const newDate = availableDates[index];
          dateElement.data("date", newDate);

          dateElement.find("span:first-child").html(formatDate(newDate));

          const maxTemp = Math.round(temperatureData[index]);
          const minTemp = Math.round(minTemperatureData[index]);
          const temperature = `${maxTemp}°/${minTemp}°`;

          const weatherCode = weatherCodes[index];
          const iconUrl = mapWeatherCodeToIcon(weatherCode);

          weatherContainer.find(".temperature").text(temperature);
          weatherContainer.find(".icon").attr("src", iconUrl);
          if (weatherCode === 0 || weatherCode === undefined || weatherCode === null) {
            weatherContainer.find(".icon").addClass("sunny");
          }
        }
      });
    },
    error: function (error) {
      console.error("Error fetching weather data", error);
    },
  });

  function mapWeatherCodeToIcon(code) {
    const weatherIcons = {
      0: "https://cdn-icons-png.flaticon.com/128/869/869869.png", // Clear
      1: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-day-cloudy.svg", // Partly cloudy
      2: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-cloudy.svg", // Cloudy
      3: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-cloudy.svg", // Overcast
      45: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-fog.svg", // Fog
      61: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-rain.svg", // Rain
      71: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-snow.svg", // Snow
      95: "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-thunderstorm.svg", // Thunderstorm
    };

    return (
      weatherIcons[code] ||
      // "https://cdn-icons-png.flaticon.com/128/869/869869.png"
      "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-cloudy.svg"
      // "https://raw.githubusercontent.com/erikflowers/weather-icons/master/svg/wi-na.svg" // Fallback icon
    );
  }

  // Function to format date for display (e.g., "TODAY 12/26/2024")
  function formatDate(date) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    if (date === today) {
      return `TODAY  <span style="color: #8837E9;">${new Date(date).toLocaleDateString()}</span>`;
    }
    if (date === tomorrow) {
      return `TOMORROW <span class="dark-light"> ${new Date(date).toLocaleDateString()}</span>`;
    }

    // Format for other days
    const dayName = new Date(date)
      .toLocaleDateString("en-US", {
        weekday: "long",
      })
      .toUpperCase(); // Capitalize the weekday
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });

    return `${dayName} <span class="dark-light">${formattedDate}</span>`; // Wrap the formattedDate in a span
  }
});

///////////// Invite Modal Integration ////////////////

$(document).ready(function () {
  $("#inviteModal").addClass("cal-hidden");

  $(".invite-button").on("click", function () {
    $("#inviteModal").removeClass("cal-hidden");
  });

  // NOTE: This cancel handler is specific to inviteModal only
  // Other modals use calender.add.new.js setupModalButtons()
  $("#inviteModal .to-cancel").on("click", function () {
    $("#inviteModal").addClass("cal-hidden");
  });

  $(".requests span").on("click", function () {
    $(".requests span").removeClass("active");
    $(this).addClass("active");
  });

  $(".select-round")
    .not(".select-all-round")
    .on("click", function () {
      $(this).toggleClass("select-follows");

      const allSelected = $(".select-round").not(".select-all-round").length === $(".select-round.select-follows").not(".select-all-round").length;

      $(".select-all-round").toggleClass("select-follows", allSelected);
    });

  $(".select-all-round").on("click", function () {
    const isAllSelected = $(this).hasClass("select-follows");

    $(this).toggleClass("select-follows");

    if (isAllSelected) {
      $(".select-round").removeClass("select-follows");
    } else {
      $(".select-round").addClass("select-follows");
    }
  });

  $("#inviteBtn").on("click", function () {
    const selectedUsers = [];

    $(".select-round.select-follows")
      .not(".select-all-round")
      .each(function () {
        const userName = $(this).siblings(".account-left").find("span").text();
        const userImage = $(this).siblings(".account-left").find(".user-avatar").attr("src");

        selectedUsers.push({ name: userName, image: userImage });
      });

    if (selectedUsers.length > 0) {
      const inviteBox = $(".invite-input");
      inviteBox.empty();

      selectedUsers.forEach((user) => {
        const userHtml = `
          <div class="selected-user">
            <img class="user-chip-avatar" src="${user.image}" alt="${user.name}" />
            <span class="user-name">${user.name}</span>
            <span class="remove-user" data-user="${user.name}">✕</span>
          </div>
        `;
        inviteBox.append(userHtml);
      });

      $("#inviteModal").addClass("cal-hidden");
    }
  });

  $(document).on("click", ".remove-user", function () {
    $(this).parent(".selected-user").remove();
  });
});

//////////////// Import Modal Integration /////

$(document).ready(function () {
  $(".all-task").on("click", function () {
    $(".accounts").removeClass("cal-hidden");
  });

  $(".ongoing-task").on("click", function () {
    $(".accounts").addClass("cal-hidden");
    $(".status-ongoing").closest(".accounts").removeClass("cal-hidden");
  });

  $(".pending-task").on("click", function () {
    $(".accounts").addClass("cal-hidden");
    $(".status-pending").closest(".accounts").removeClass("cal-hidden");
  });

  $(".completed-task").on("click", function () {
    $(".accounts").addClass("cal-hidden");
    $(".status-completed").closest(".accounts").removeClass("cal-hidden");
  });

  function updateActiveButton(activeButton) {
    $(".requests span").removeClass("active");
    $(activeButton).addClass("active");
  }
});

// /////// Image uploading effect ///////////
$(document).ready(function () {
  $(".upload-box").on("click", function () {
    $("#file-upload").click();
  });

  // Handle file selection
  $("#file-upload").on("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imageHtml = `
          <div class="upload-image-container">
            <img src="${e.target.result}" class="uploading" />
            <div class="spinner-overlay">
              <div class="spinner"></div>
            </div>
          </div>
        `;

        $(".upload-images").append(imageHtml);

        setTimeout(() => {
          $(".upload-image-container:last-child .spinner-overlay").remove();
          $(".upload-image-container:last-child img").removeClass("uploading").addClass("uploaded");
        }, 3000);
      };

      reader.readAsDataURL(file); // Convert the image file to a Base64 URL
    }
  });
});
//////////////  Hashtag integration ////////////////
$(document).ready(function () {
  const $inputField = $("#hashtag-input");

  $inputField.on("keypress", function (event) {
    if (event.which === 32 || event.which === 13) {
      // Space or Enter
      event.preventDefault();

      const hashtagText = $inputField.val().trim();
      if (hashtagText) {
        addHashtag(hashtagText);
        $inputField.val("");
      }
    }
  });

  // Function to add a hashtag
  function addHashtag(text) {
    const hashtagHtml = `
      <div class="hashtag">
        <span>${text}</span>
        <button type="button" class="delete-hashtag">&times;</button>
      </div>
    `;

    $inputField.before(hashtagHtml);
  }

  $(document).on("click", ".delete-hashtag", function () {
    $(this).parent(".hashtag").remove();
  });

  $(".hashtag-input-container").on("click", function () {
    $inputField.focus();
  });
});

//////////////Birth day drop down ///////////////
$(document).ready(function () {
  $(".selected-item").on("click", function () {
    $(".dropdown-options").toggle();
  });

  $(".dropdown-options li").on("click", function () {
    $(".dropdown-options li").removeClass("selected");
    $(this).addClass("selected");

    const selectedName = $(this).find("span").text();
    const selectedImage = $(this).find("img").attr("src");

    $(".selected-item span").first().text(selectedName);
    $(".selected-item .selected-avatar").attr("src", selectedImage);

    $(".dropdown-options").hide();
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".custom-dropdown").length) {
      $(".dropdown-options").hide();
    }
  });
});

/**
 *
 *
 *
 * Date Event Slider
 *
 *
 *
 */

class DateEventSlider {
  constructor() {
    this._bind();
  }

  _bind() {
    document.addEventListener("click", (e) => {
      // Only care about clicks on prev/next inside a .header-content-container
      const btn = e.target.closest(".event-slider-prev-btn, .event-slider-next-btn");
      if (!btn) return;

      const container = btn.closest(".header-content-container");
      let current = parseInt(container.dataset.currentCount, 10);
      const total = parseInt(container.dataset.totalCount, 10);

      // hide all
      container.querySelectorAll(".header-content").forEach((el) => el.classList.remove("active"));

      // move index up or down
      if (btn.classList.contains("event-slider-prev-btn")) {
        if (current > 1) current--;
      } else {
        // next button
        if (current < total) current++;
      }

      // clamp & store
      current = Math.min(Math.max(current, 1), total);
      container.dataset.currentCount = current;

      console.log(container.querySelector(`.header-content[data-index="${current}"]`));

      // show the right slide
      container.querySelector(`.header-content[data-index="${current}"]`).classList.add("active");

      // re-lookup both buttons and update their disabled state
      const prev = container.querySelector(".event-slider-prev-btn");
      const next = container.querySelector(".event-slider-next-btn");
      prev.disabled = current === 1;
      next.disabled = current === total;
    });
  }
}

new DateEventSlider();

/**
 *
 *
 *
 *
 */
document.addEventListener("DOMContentLoaded", function () {
  const options = {
    enableTime: true, // turn on time picker
    time_24hr: true, // 24-hour format
    minuteIncrement: 15, // step minutes by 15
    defaultDate: new Date(), // pre-select today
    dateFormat: "Y-m-d H:i", // the actual value format
    altInput: true, // show user-friendly input
    altFormat: "F j, Y H:i", // e.g. “May 7, 2025 17:30”
    theme: "material_blue", // matches the CSS theme you loaded
  };

  flatpickr("#addEventStart", options);
  flatpickr("#addEventEnd", options);
  flatpickr("#addHolidayStart", options);
  flatpickr("#addBirthdayStart", options);
  flatpickr("#addTaskStart", options);
});

/**  **/
