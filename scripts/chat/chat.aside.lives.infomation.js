const liveInfoTabContainer = document.getElementById("liveInfoTabContainer");
const liveInfoBack = document.getElementById("liveInfoBack");

liveInfoBack.addEventListener("click", hideLiveChatInformation);

function showLiveChatInformation(liveItem) {
  document.getElementById("liveInfoTitle").textContent = liveItem.title;
  document.getElementById("liveChatDescription").textContent = liveItem.description;

  hideAllChatSectionContainers();
  liveInfoTabContainer.classList.remove(HIDDEN);
}

function hideLiveChatInformation() {
  const livesTabContainer = document.getElementById("livesTabContainer");

  hideAllChatSectionContainers();
  livesTabContainer.classList.remove(HIDDEN);
}

/**
 *
 *
 *
 * Render Live Members
 *
 *
 *
 */
const liveMembersList = document.getElementById("liveMembersList");
const groupMembersList = document.getElementById("groupMembersList");

function renderLiveMembers(container, type = "group") {
  container.innerHTML = "";

  Array.from({ length: 5 }, (_, i) => i).forEach((member) => {
    const markup = `
      <li class="member_item">
        <div class="member_item_info">
          <div>
            <img
              src="https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt=""
            />
          </div>

          <div>
            <span>Faith Muema</span>
            <span>@fay24</span>
          </div>
        </div>

        <div class="member_item_action">
          <span class="admin">Admin</span>
          <button class="member_item_action_option_button">
            <span class="btn_icon">
              <!-- prettier-ignore -->
              <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12.0352" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round" /><circle cx="6" cy="12.0352" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round" /><circle cx="18" cy="12.0352" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round" /></svg>
            </span>

            <!-- Button Options -->
            <ul class="member_item_options animate__animated animate__fadeIn">
              <a href="/profile.html">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7365 21.8481C15.0297 21.62 16.2654 21.1395 17.373 20.4339C18.4806 19.7283 19.4383 18.8115 20.1915 17.7358C20.9448 16.66 21.4787 15.4465 21.763 14.1644C22.0472 12.8823 22.0761 11.5568 21.8481 10.2635C21.62 8.97025 21.1395 7.73456 20.4339 6.627C19.7283 5.51945 18.8115 4.56171 17.7358 3.80848C16.66 3.05525 15.4465 2.52127 14.1644 2.23704C12.8823 1.95281 11.5568 1.92388 10.2635 2.15192C8.97025 2.37996 7.73456 2.86049 6.627 3.56609C5.51945 4.27168 4.56171 5.18851 3.80848 6.26424C3.05525 7.33996 2.52127 8.55352 2.23704 9.83561C1.95281 11.1177 1.92388 12.4432 2.15192 13.7365C2.37996 15.0298 2.86049 16.2654 3.56609 17.373C4.27168 18.4806 5.18851 19.4383 6.26424 20.1915C7.33996 20.9448 8.55352 21.4787 9.83561 21.763C11.1177 22.0472 12.4432 22.0761 13.7365 21.8481L13.7365 21.8481Z" stroke="#33363F" stroke-width="2"/><path d="M12 12L12 18" stroke="#33363F" stroke-width="2" stroke-linecap="square"/><path d="M12 7L12 6" stroke="#33363F" stroke-width="2" stroke-linecap="square"/></svg>
                </span>
                <span>View Info</span>
              </a>

             ${
               type !== "lives"
                 ? `<li role="button" class="create_group">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="9" r="3" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M12.2679 9C12.5332 8.54063 12.97 8.20543 13.4824 8.06815C13.9947 7.93086 14.5406 8.00273 15 8.26795C15.4594 8.53317 15.7946 8.97 15.9319 9.48236C16.0691 9.99472 15.9973 10.5406 15.7321 11C15.4668 11.4594 15.03 11.7946 14.5176 11.9319C14.0053 12.0691 13.4594 11.9973 13 11.7321C12.5406 11.4668 12.2054 11.03 12.0681 10.5176C11.9309 10.0053 12.0027 9.45937 12.2679 9L12.2679 9Z" stroke="#33363F" stroke-width="2"/><path d="M13.8816 19L12.9012 19.1974L13.0629 20H13.8816V19ZM17.7201 17.9042L18.6626 17.5699L17.7201 17.9042ZM11.7808 15.7105L11.1759 14.9142L10.0193 15.7927L11.2526 16.5597L11.7808 15.7105ZM16.8672 18H13.8816V20H16.8672V18ZM16.7777 18.2384C16.7706 18.2186 16.7641 18.181 16.7725 18.1354C16.7803 18.0921 16.7982 18.0593 16.8151 18.0383C16.8473 17.9982 16.8739 18 16.8672 18V20C18.0132 20 19.1413 18.9194 18.6626 17.5699L16.7777 18.2384ZM14 16C15.6415 16 16.4026 17.1811 16.7777 18.2384L18.6626 17.5699C18.1976 16.2588 16.9485 14 14 14V16ZM12.3856 16.5069C12.7701 16.2148 13.2819 16 14 16V14C12.8381 14 11.9027 14.3622 11.1759 14.9142L12.3856 16.5069ZM11.2526 16.5597C12.2918 17.206 12.727 18.3324 12.9012 19.1974L14.8619 18.8026C14.6439 17.7204 14.0374 15.9364 12.3089 14.8614L11.2526 16.5597Z" fill="#33363F"/><path d="M9 15C12.5715 15 13.5919 17.5512 13.8834 19.0089C13.9917 19.5504 13.5523 20 13 20H5C4.44772 20 4.00829 19.5504 4.11659 19.0089C4.4081 17.5512 5.42846 15 9 15Z" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M19 3V7" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M21 5L17 5" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <span>Create Group with Pena</span>
              </li>`
                 : ""
             }

              <li role="button" class="create_task">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 5C16.9045 5 17.6067 5 18.1111 5.33706C18.3295 5.48298 18.517 5.67048 18.6629 5.88886C19 6.39331 19 7.09554 19 8.5V18C19 19.8856 19 20.8284 18.4142 21.4142C17.8284 22 16.8856 22 15 22H9C7.11438 22 6.17157 22 5.58579 21.4142C5 20.8284 5 19.8856 5 18V8.5C5 7.09554 5 6.39331 5.33706 5.88886C5.48298 5.67048 5.67048 5.48298 5.88886 5.33706C6.39331 5 7.09554 5 8.5 5" stroke="#33363F" stroke-width="2"/><path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="#33363F" stroke-width="2"/><path d="M9 12L15 12" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><path d="M9 16L13 16" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <span>Create Task with Pena</span>
              </li>

              <li role="button" class="make_admin">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5919_107257)"><path d="M12 3.1C14.65 3.85 17.55 4.75 19 5.25V13.1C19 14.8 17.15 17.8 12 20.8C6.85 17.75 5 14.8 5 13.1V5.25C6.45 4.7 9.35 3.85 12 3.1ZM12 1C12 1 3 3.55 3 4V13.1C3 17.7 9.65 21.75 11.5 22.85C11.648 22.9489 11.822 23.0017 12 23.0017C12.178 23.0017 12.352 22.9489 12.5 22.85C14.4 21.8 21 17.7 21 13.1V4C21 3.55 12 1 12 1Z" fill="#33363F"/><path d="M9.79995 14.7016L7.29995 12.2516C7.12671 12.0745 7.02166 11.8419 7.00336 11.5948C6.98506 11.3478 7.05469 11.1022 7.19995 10.9016C7.28088 10.7811 7.38835 10.6807 7.51411 10.6082C7.63987 10.5357 7.78057 10.493 7.9254 10.4833C8.07024 10.4737 8.21537 10.4973 8.34963 10.5525C8.4839 10.6077 8.60374 10.6929 8.69995 10.8016L10.5 12.6016L15.3 7.80156C15.4925 7.65714 15.7307 7.58702 15.9708 7.60408C16.211 7.62114 16.4368 7.72425 16.6071 7.89446C16.7773 8.06467 16.8804 8.29057 16.8974 8.53067C16.9145 8.77078 16.8444 9.00899 16.7 9.20156L11.2 14.7016C11.111 14.7986 11.0028 14.876 10.8823 14.929C10.7618 14.9819 10.6316 15.0093 10.5 15.0093C10.3683 15.0093 10.2381 14.9819 10.1176 14.929C9.99712 14.876 9.88895 14.7986 9.79995 14.7016Z" fill="#33363F"/></g><defs><clipPath id="clip0_5919_107257"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                </span>
                <span>Make Alexa Admin</span>
              </li>

              <li class="color_red block_user" role="button">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#FF3B30" stroke-width="2"/><path d="M18 18L6 6" stroke="#FF3B30" stroke-width="2"/></svg>
                </span>
                <span>Block Alexa</span>
              </li>

              <li class="color_red remove_user" role="button">
                <span>
                  <!-- prettier-ignore -->
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15L10 12" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M14 15L14 12" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M3 7H21V7C20.0681 7 19.6022 7 19.2346 7.15224C18.7446 7.35523 18.3552 7.74458 18.1522 8.23463C18 8.60218 18 9.06812 18 10V16C18 17.8856 18 18.8284 17.4142 19.4142C16.8284 20 15.8856 20 14 20H10C8.11438 20 7.17157 20 6.58579 19.4142C6 18.8284 6 17.8856 6 16V10C6 9.06812 6 8.60218 5.84776 8.23463C5.64477 7.74458 5.25542 7.35523 4.76537 7.15224C4.39782 7 3.93188 7 3 7V7Z" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/></svg>
                </span>
                <span>Remove Alexa </span>
              </li>
            </ul>
          </button>
        </div>
      </li>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });

  /**
   *
   *
   * Handler Popper.js
   *
   */

  const memberItemActionOptionButtons = document.querySelectorAll(".member_item_action_option_button");
  const optionContainers = document.querySelectorAll(".member_item_options");

  memberItemActionOptionButtons.forEach((button) => {
    const optionContainer = button.querySelector(".member_item_options");
    let popperInstance = null;

    // Function to create Popper.js instance
    const createPopper = () => {
      popperInstance = Popper.createPopper(button, optionContainer, {
        placement: "bottom-start", // Positioning
        modifiers: [
          {
            name: "offset",
            options: {
              offset: [0, 8], // Adjust position (horizontal, vertical)
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport", // Ensure it stays in the viewport
            },
          },
        ],
      });
    };

    // Handle click on button
    button.addEventListener("click", (e) => {
      if (e.target.closest(".btn_icon")) {
        // Close all other dropdowns
        optionContainers.forEach((container) => container.setAttribute("aria-expanded", false));

        // Toggle the current dropdown
        const isExpanded = optionContainer.getAttribute("aria-expanded") === "true";
        optionContainer.setAttribute("aria-expanded", !isExpanded);

        if (!isExpanded) {
          createPopper(); // Initialize Popper.js for positioning
        } else if (popperInstance) {
          popperInstance.destroy(); // Destroy Popper.js instance
          popperInstance = null;
        }
      }
    });
  });

  // Close all dropdowns on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".member_item_action_option_button")) {
      optionContainers.forEach((container) => {
        container.setAttribute("aria-expanded", false);
      });
    }
  });
}

// For Live Member
renderLiveMembers(liveMembersList, "lives");
// For Group Member
renderLiveMembers(groupMembersList);

/**
 *
 *
 *
 *
 *
 */
[groupMembersList, liveMembersList].forEach((container) => {
  container.addEventListener("click", (e) => {
    // Create Task With User
    if (e.target.closest(".create_task")) {
      return showAddNewTaskWithThisUserModal();
    }

    // Create Group With User
    if (e.target.closest(".create_group")) {
      return showCreateGroupModal();
    }

    // Block User
    if (e.target.closest(".block_user")) {
      return showBlockModal();
    }

    // Delete User
    if (e.target.closest(".remove_user")) {
      return showGlobalDiscardModal();
    }
  });
});

const liveAsideExitButton = document.getElementById("liveAsideExitButton");
const liveAsideReportButton = document.getElementById("liveAsideReportButton");

liveAsideExitButton.addEventListener("click", showGlobalDiscardModal);
liveAsideReportButton.addEventListener("click", showGlobalReportModal);
