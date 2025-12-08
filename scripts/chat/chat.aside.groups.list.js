/**
 *
 *
 *
 *
 * Render Group
 *
 *
 *
 *
 *
 */
const groupItemsList = document.getElementById("groupItemsList");

function renderGroupChatItems(groupChatItems) {
  groupItemsList.innerHTML = "";

  groupChatItems.forEach((chat) => {
    const { id, name, verified, messageNew, unreadCount, profileImage, activeOnline, document, images, lastMessageId } = chat;
    const allGroupMessages = groupMessages.filter((message) => message.groupId === id) ?? [];
    const lastMessage = allGroupMessages.find((message) => message.messageId === lastMessageId);

    const { type, message, time } = lastMessage;

    const markup = `
              <div class="chat_list ${messageNew ? "new" : ""}" data-group-id="${id}" role="button">
                    <div id="chat_user">
                      ${profileImage ? `<img src="${profileImage}" alt="" />` : `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.4189 19.482C26.7661 19.6552 27.2868 19.6552 27.8076 19.6552C30.9319 19.6552 33.5356 17.0577 33.5356 13.9408C33.5356 10.824 30.9319 8.22656 27.8076 8.22656C27.6339 8.22656 27.6339 8.22656 27.4604 8.22656C28.5019 9.61185 29.0226 11.3434 29.0226 13.2482C29.0226 15.4993 28.1548 17.7504 26.4189 19.482Z" fill="white"/><path d="M30.0636 21.9062H28.8486C31.1051 23.6377 32.4938 26.4084 32.4938 29.5252C32.4938 30.2179 32.3201 30.9106 32.1466 31.6031C33.8823 31.2569 34.9238 30.9106 35.6181 30.5642C36.3125 30.2179 36.6596 29.3521 36.6596 28.4862C36.8331 24.8499 33.7088 21.9062 30.0636 21.9062Z" fill="white"/><path d="M12.186 19.6525C12.7067 19.6525 13.0539 19.6525 13.5746 19.4793C12.0124 17.7478 10.971 15.6698 10.971 13.0724C10.971 11.1677 11.4917 9.43606 12.5331 8.05078C12.5331 8.05078 12.3596 8.05078 12.186 8.05078C9.06164 8.05078 6.45801 10.6482 6.45801 13.7651C6.45801 16.882 8.88807 19.6525 12.186 19.6525Z" fill="white"/><path d="M10.9703 21.9062H9.92886C6.28379 21.9062 3.33301 24.8499 3.33301 28.4862C3.33301 29.3521 3.68016 30.2179 4.37446 30.5642C5.06876 30.9106 6.11021 31.4299 7.84596 31.6031C7.67239 30.9106 7.49881 30.2179 7.49881 29.5252C7.49881 26.5816 8.71384 23.8109 10.9703 21.9062Z" fill="white"/><path d="M16.004 18.0965C17.0454 18.9624 18.4341 19.4819 19.9963 19.4819C21.5584 19.4819 22.9469 18.9624 23.9884 18.0965C25.5506 16.8844 26.4184 15.1528 26.4184 13.0749C26.4184 11.5165 25.8978 9.95802 24.8563 8.91905C23.6413 7.53377 21.9056 6.66797 19.9963 6.66797C18.0869 6.66797 16.1776 7.53377 15.1361 8.91905C14.0947 9.95802 13.4004 11.5165 13.4004 13.0749C13.4004 15.1528 14.4418 16.8844 16.004 18.0965Z" fill="white"/><path d="M23.4682 22.25C23.1211 22.25 22.7741 22.25 22.4269 22.25H17.2196C16.8724 22.25 16.5253 22.25 16.1781 22.25C12.5331 22.7695 9.75586 25.8863 9.75586 29.5227C9.75586 30.5617 10.2766 31.4275 10.9709 31.7738C12.1859 32.4665 14.616 33.3323 19.6496 33.3323C24.6832 33.3323 27.1134 32.4665 28.3284 31.7738C29.1962 31.2543 29.5434 30.3885 29.5434 29.5227C30.0641 25.8863 27.1134 22.7695 23.4682 22.25Z" fill="white"/></svg>`}
                      ${
                        activeOnline
                          ? `<span class="chat_user_status group_chat_status">
                          <span></span>
                          <span>${activeOnline > 99 ? `+99` : `${activeOnline}`}</span>
                        </span>`
                          : ""
                      }
                    </div>
      
                      <div>
                        <h2 id="asideGroupName">
                          <span>${name}</span>
                         ${
                           verified
                             ? `<span>
                            <!-- prettier-ignore -->
                            <svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"/><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"/><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"/><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"/></linearGradient></defs></svg>
                          </span>`
                             : ""
                         }
                        </h2>
      
                        <p class="message_content">${message}</p>

                        <div class="message_include">
                        ${
                          document
                            ? `  
                         <div>
                            <span><img src="./images/chat/icons/document.svg"/></span>
                            <span>${document.name}</span>
                         </div>
                        `
                            : ""
                        }
                        ${
                          images?.length
                            ? `  
                          <div>
                            <span><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_5919_102667)"><path d="M14.4 0H3.6C1.61178 0 0 1.61178 0 3.6V14.4C0 16.3882 1.61178 18 3.6 18H14.4C16.3882 18 18 16.3882 18 14.4V3.6C18 1.61178 16.3882 0 14.4 0Z" fill="url(#paint0_linear_5919_102667)"/><path d="M14.4 0H3.6C1.61178 0 0 1.61178 0 3.6V14.4C0 16.3882 1.61178 18 3.6 18H14.4C16.3882 18 18 16.3882 18 14.4V3.6C18 1.61178 16.3882 0 14.4 0Z" fill="url(#paint1_linear_5919_102667)"/><path d="M13.4992 6.29925C14.4933 6.29925 15.2992 5.49333 15.2992 4.49922C15.2992 3.50511 14.4933 2.69922 13.4992 2.69922C12.5051 2.69922 11.6992 3.50511 11.6992 4.49922C11.6992 5.49333 12.5051 6.29925 13.4992 6.29925Z" fill="url(#paint2_linear_5919_102667)"/><path d="M8.75242 13.996C8.45323 14.5944 8.88838 15.2985 9.55741 15.2985H13.845C14.514 15.2985 14.9491 14.5944 14.65 13.996L12.5062 9.70845C12.1745 9.0451 11.2279 9.0451 10.8962 9.70845L8.75242 13.996Z" fill="#DEDEE7"/><path d="M3.35008 13.9991C3.05088 14.5975 3.48602 15.3016 4.15507 15.3016H10.2426C10.9117 15.3016 11.3468 14.5975 11.0476 13.9991L8.00381 7.91158C7.67216 7.24822 6.72553 7.24822 6.39383 7.91158L3.35008 13.9991Z" fill="url(#paint3_linear_5919_102667)"/></g><defs><linearGradient id="paint0_linear_5919_102667" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse"><stop stop-color="#00E676"/><stop offset="1" stop-color="#00C853"/></linearGradient><linearGradient id="paint1_linear_5919_102667" x1="900" y1="0" x2="900" y2="1800" gradientUnits="userSpaceOnUse"><stop stop-color="#EDEEF4"/><stop offset="1" stop-color="#D7D8E6"/></linearGradient><linearGradient id="paint2_linear_5919_102667" x1="371.699" y1="182.701" x2="11.6992" y2="182.701" gradientUnits="userSpaceOnUse"><stop stop-color="#C3C4D4"/><stop offset="1" stop-color="#AEAFC8"/></linearGradient><linearGradient id="paint3_linear_5919_102667" x1="792.242" y1="401.791" x2="3.25391" y2="401.791" gradientUnits="userSpaceOnUse"><stop stop-color="#C3C4D4"/><stop offset="1" stop-color="#AEAFC8"/></linearGradient><clipPath id="clip0_5919_102667"><rect width="18" height="18" fill="white"/></clipPath></defs></svg></span>
                            <span>${images[0].filename}</span>
                          </div>
                      `
                            : ""
                        }
                        </div>
                      </div>

                      <div class="chat_list_item_option_wrapper chat_list_item_option_wrapper--group">
                        <button class="chat_list_item_option">
                          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5003" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="5.50033" cy="10.5013" rx="0.833333" ry="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><circle cx="15.5003" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/></svg>
                        </button>

                        <ul class="chat_page_options animate__animated animate__fadeIn" aria-expanded="false">
                          <li role="button" id="favourite" tabindex="0">
                            <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="#33363F" stroke-width="2"/></svg></span>
                            <span>Favourite</span>
                          </li>
                          <li role="button" id="startSingleVoiceCall" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.7071 13.7071L20.3552 16.3552C20.7113 16.7113 20.7113 17.2887 20.3552 17.6448C18.43 19.57 15.3821 19.7866 13.204 18.153L11.6286 16.9714C9.88504 15.6638 8.33622 14.115 7.02857 12.3714L5.84701 10.796C4.21341 8.61788 4.43001 5.56999 6.35523 3.64477C6.71133 3.28867 7.28867 3.28867 7.64477 3.64477L10.2929 6.29289C10.6834 6.68342 10.6834 7.31658 10.2929 7.70711L9.27175 8.72825C9.10946 8.89054 9.06923 9.13846 9.17187 9.34373C10.3585 11.7171 12.2829 13.6415 14.6563 14.8281C14.8615 14.9308 15.1095 14.8905 15.2717 14.7283L16.2929 13.7071C16.6834 13.3166 17.3166 13.3166 17.7071 13.7071Z" stroke="#33363F" stroke-width="2"/></svg></span>
                            <span>Voice call</span>
                          </li>
                          <li role="button" id="multiplyScreen" tabindex="0">
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="M19 15h4V1H9v4m6 14h4V5H5v4M1 23h14V9H1z"/></svg></span>
                            <span>Multiple</span>
                          </li>
                          <li role="button" id="startSingleVideoCall" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z" stroke="#363853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            <span>Video call</span>
                          </li>
                          <li role="button" id="unread" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V4C16.4183 4 20 7.58172 20 12V17.0909C20 17.9375 20 18.3608 19.8739 18.6989C19.6712 19.2425 19.2425 19.6712 18.6989 19.8739C18.3608 20 17.9375 20 17.0909 20H12C7.58172 20 4 16.4183 4 12V12" stroke="#363853" stroke-width="2"/><path d="M9 11L15 11" stroke="#363853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="6" r="3" fill="#363853"/><path d="M12 15H15" stroke="#363853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            <span>Unread</span>
                          </li>
                           <li class="report" id="report" role="button" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#FF3B30" stroke-width="2"/><circle cx="12" cy="18" r="0.5" fill="#FF3B30" stroke="#FF3B30"/><path d="M12 16V14.5811C12 13.6369 12.6042 12.7986 13.5 12.5V12.5C14.3958 12.2014 15 11.3631 15 10.4189V9.90569C15 8.30092 13.6991 7 12.0943 7H12C10.3431 7 9 8.34315 9 10V10" stroke="#FF3B30" stroke-width="2"/></svg></span>
                            <span>Report</span>
                          </li>
                          <li role="button" class="delete" id="delete" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15L10 12" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/><path d="M14 15L14 12" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/><path d="M3 7H21V7C20.0681 7 19.6022 7 19.2346 7.15224C18.7446 7.35523 18.3552 7.74458 18.1522 8.23463C18 8.60218 18 9.06812 18 10V16C18 17.8856 18 18.8284 17.4142 19.4142C16.8284 20 15.8856 20 14 20H10C8.11438 20 7.17157 20 6.58579 19.4142C6 18.8284 6 17.8856 6 16V10C6 9.06812 6 8.60218 5.84776 8.23463C5.64477 7.74458 5.25542 7.35523 4.76537 7.15224C4.39782 7 3.93188 7 3 7V7Z" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/><path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#ff3b30" stroke-width="2" stroke-linecap="round"/></svg></span>
                            <span>Delete</span>
                          </li>
                          <li role="button" class="block" id="block" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#ff3b30" stroke-width="2"/><path d="M18 18L6 6" stroke="#ff3b30" stroke-width="2"/></svg></span>
                            <span>Block</span>
                          </li>
                        </ul>
                      </div>
      
                      <div class="message_info group_message_info">
                        <time>${time}</time>
                        <div>
                          ${
                            unreadCount
                              ? `
                              <div class="message_count">
                                <span>${unreadCount}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24"><path fill="#8837E9" d="M21.99 12a9.9 9.9 0 0 1-.76 3.83a9.7 9.7 0 0 1-2.17 3.24a10 10 0 0 1-3.24 2.17a9.9 9.9 0 0 1-3.83.76a9.7 9.7 0 0 1-3.88-.79l-3.65.54a1.94 1.94 0 0 1-2.21-2.33l.5-3.65A9.6 9.6 0 0 1 2.01 12a9.8 9.8 0 0 1 .76-3.82a10 10 0 0 1 2.16-3.25a10 10 0 0 1 14.15 0a9.7 9.7 0 0 1 2.17 3.25a9.8 9.8 0 0 1 .74 3.82"/></svg>
                              </div>`
                              : `<img src="https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />`
                          }
                        </div>
                      </div>
              </div>
          `;

    groupItemsList.insertAdjacentHTML("beforeend", markup);
  });

  // Initialize Popper for each chat item after rendering
  const chatLists = groupItemsList.querySelectorAll(".chat_list");
  chatLists.forEach((chatList) => {
    const button = chatList.querySelector(".chat_list_item_option");
    const dropdown = chatList.querySelector(".chat_page_options");

    // Create Popper instance
    const popperInstance = Popper.createPopper(button, dropdown, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 8] },
        },
        {
          name: "preventOverflow",
          options: { padding: 8 },
        },
      ],
    });

    // Click handler for options button
    button?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = dropdown.getAttribute("aria-expanded") === "true";
      dropdown.setAttribute("aria-expanded", !isExpanded);
      popperInstance.update();
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".chat_list_item_option_wrapper--group")) {
      chatLists.forEach((chatList) => {
        const dropdown = chatList.querySelector(".chat_page_options");
        dropdown.setAttribute("aria-expanded", "false");
      });
    }
  });
}

renderGroupChatItems(groupChatItems);

/**
 *
 *
 *
 *
 * Render Admin List
 *
 *
 *
 *
 *
 */
const groupAdminsData = [
  {
    category: "Recents",
    name: "Mike Adams",
    username: "@mikey",
    profileImage: "mike_adams.jpg",
  },
  {
    category: "Recents",
    name: "Barus Geidt",
    username: "@barus",
    profileImage: "barus_geidt.jpg",
  },
  {
    category: "Recents",
    name: "Chris Travis",
    username: "@chris",
    profileImage: "chris_travis.jpg",
  },
  {
    category: "Recents",
    name: "Davis Mike",
    username: "@davis",
    profileImage: "davis_mike.jpg",
  },
];

const groupAdminsUL = document.getElementById("groupAdminsUL");

function renderGroupAdmins() {
  groupAdminsData.forEach((ad) => {
    const { name, username } = ad;

    const markup = `
        <li class="friend_category_item">
            <div class="photo">
              <img src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww" alt="" />
            </div>

            <div class="friend_profile_info">
              <div>
                <span class="name">${name}</span>
                <span class="badge">
                  <!-- prettier-ignore -->
                  <svg width="17" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16.5L4.14545 14.0619L1.52727 13.4524L1.78182 10.6333L0 8.5L1.78182 6.36667L1.52727 3.54762L4.14545 2.9381L5.52727 0.5L8 1.60476L10.4727 0.5L11.8545 2.9381L14.4727 3.54762L14.2182 6.36667L16 8.5L14.2182 10.6333L14.4727 13.4524L11.8545 14.0619L10.4727 16.5L8 15.3952L5.52727 16.5ZM7.23636 11.2048L11.3455 6.9L10.3273 5.79524L7.23636 9.03333L5.67273 7.43333L4.65455 8.5L7.23636 11.2048Z" fill="#3897F0"/><path d="M5.52727 16.5L4.14545 14.0619L1.52727 13.4524L1.78182 10.6333L0 8.5L1.78182 6.36667L1.52727 3.54762L4.14545 2.9381L5.52727 0.5L8 1.60476L10.4727 0.5L11.8545 2.9381L14.4727 3.54762L14.2182 6.36667L16 8.5L14.2182 10.6333L14.4727 13.4524L11.8545 14.0619L10.4727 16.5L8 15.3952L5.52727 16.5ZM7.23636 11.2048L11.3455 6.9L10.3273 5.79524L7.23636 9.03333L5.67273 7.43333L4.65455 8.5L7.23636 11.2048Z" fill="url(#paint0_linear_5919_107630)"/><defs><linearGradient id="paint0_linear_5919_107630" x1="8" y1="0.5" x2="8" y2="16.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"/><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"/></linearGradient></defs></svg>
                </span>
              </div>

              <div class="username">${username}</div>
            </div>

            <div class="friend_item_call_to_action">
              <button class="follow">Follow</button>
              <button class="open_chat">
                <!-- prettier-ignore -->
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6914_85937)"><path d="M12 20L9 17H7C6.20435 17 5.44129 16.6839 4.87868 16.1213C4.31607 15.5587 4 14.7956 4 14V8C4 7.20435 4.31607 6.44129 4.87868 5.87868C5.44129 5.31607 6.20435 5 7 5H17C17.7956 5 18.5587 5.31607 19.1213 5.87868C19.6839 6.44129 20 7.20435 20 8V14C20 14.7956 19.6839 15.5587 19.1213 16.1213C18.5587 16.6839 17.7956 17 17 17H15L12 20Z" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 9H16" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13H14" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_6914_85937"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
              </button>
            </div>
          </li>
      `;

    groupAdminsUL.insertAdjacentHTML("beforeend", markup);
  });
}

renderGroupAdmins();

groupAdminsUL.addEventListener("click", (e) => {
  const openChatButton = e.target.closest(".open_chat");

  if (openChatButton) {
    // Open Chat
    handleOpenSelectedChatItem(1);
  }
});

/**
 *
 *
 *
 *
 * Group Tab
 *
 *
 *
 *
 *
 */
const groupAsideTab = document.getElementById("groupAsideTab");
const groupAsideTabButtons = groupAsideTab.querySelectorAll("button");

groupAsideTab.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const { tab } = button.dataset;

    groupAsideTabButtons.forEach((button) => button.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    groupItemsList.classList.remove(HIDDEN);
    groupAdminsUL.classList.add(HIDDEN);

    // All Tab
    if (tab === "all") {
      return renderGroupChatItems(groupChatItems);
    }

    // Unread Tab
    if (tab === "unread") {
      const unreadData = groupChatItems.filter((group) => group.unreadCount);
      return renderGroupChatItems(unreadData);
    }

    // Admin Tab
    if (tab === "admin") {
      groupItemsList.classList.add(HIDDEN);
      groupAdminsUL.classList.remove(HIDDEN);
      return;
    }
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
 * Open Group Chat
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
const groupProfileQrcode = document.getElementById("groupProfileQrcode");

function showGroupProfileContainer(groupId) {
  // Find the group item data by group ID
  const groupItem = groupChatItems.find((group) => group.id === +groupId);

  hideAllChatSectionContainers();
  document.getElementById("groupInfoTabContainer").classList.remove(HIDDEN);
  document.getElementById("groupInfoTitle").textContent = groupItem.name;
  document.getElementById("groupInfoDescription").textContent = groupItem.description;

  // liveProfileQrcode
  groupProfileQrcode.addEventListener("click", () => showGroupLiveQRcodeModal(groupItem.name));
}

groupItemsList.addEventListener("click", (e) => {
  const groupItemEL = e.target.closest(".chat_list");
  if (!groupItemEL) return;

  const { groupId } = groupItemEL.dataset;

  // Find the group item data by group ID
  const groupItem = groupChatItems.find((group) => group.id === +groupId);

  const asideGroupName = e.target.closest("#asideGroupName");
  if (asideGroupName) {
    showGroupProfileContainer(groupId);
    return;
  }

  // if option button is clicked :)
  const chatListItemOption = e.target.closest(".chat_list_item_option");
  if (chatListItemOption) {
    const container = chatListItemOption.closest(".chat_list_item_option_wrapper");

    const dropdown = container.querySelector("ul");

    if (dropdown) {
      dropdown.setAttribute("aria-expanded", true);

      // Dropdown
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".chat_list_item_option_wrapper--group")) {
          dropdown.setAttribute("aria-expanded", false);
        }
      });
    }

    return;
  }

  // if the click happens with chat options (Fav/voice/video/unread/delete/block)
  const chatPageOptions = e.target.closest(".chat_page_options");
  if (chatPageOptions) {
    // Block
    const blockOption = e.target.closest("#block");
    if (blockOption) {
      showBlockModal();
    }

    // Delete
    const deleteOption = e.target.closest("#delete");
    if (deleteOption) {
      showGlobalDiscardModal();
    }

    // Report
    const reportOption = e.target.closest("#report");
    if (reportOption) {
      showGlobalReportModal();
    }

    // Multiple Screen :)
    const multiplyScreen = e.target.closest("#multiplyScreen");
    if (multiplyScreen) {
      handleOpenChatThroughMultipleButton(groupId, "group");
    }

    chatPageOptions.setAttribute("aria-expanded", false);
    return;
  }

  // Open Chat
  openChats = [];
  openChats.push({ type: "group", userId: +groupId });
  currentOpenedUser = groupItem;
  currentChattingInfo = { id: groupItem.id, type: "group" };
  handleOpenChat(groupId, "group");
});

// Open Group Chat
function handleOpenSelectedGroupItem(groupId) {
  // Select the group chat item element by group ID
  const groupChatItem = document.querySelector(`.chat_list[data-group-id="${groupId}"]`);

  // Get all group chat list items
  const allGroupChatList = groupItemsList.querySelectorAll(".chat_list");

  // Find the group item data by group ID
  const groupItem = groupChatItems.find((group) => group.id === +groupId);

  // Remove 'active' class from all group chat list items
  allGroupChatList.forEach((chat) => chat.classList.remove("active"));

  // Add 'active' class to the selected group chat item
  groupChatItem.classList.add("active");

  // Set the current opened group to the selected group item
  currentOpenedGroup = groupItem;

  // Populate the chatting Group area container with the selected group item data
  populateGroupChattingAreaContainer(groupItem);

  // Remove the chat spacer element
  chatSpacerEmpty.remove();

  // Set the data attributes for the chatting area container
  chattingAreaContainer.dataset.typeOpened = "group";
  chattingAreaContainer.dataset.id = groupId;

  // Show the chatting area container
  chattingAreaContainer.classList.remove(HIDDEN);
  chattingAreaContainer.setAttribute("data-type", "group");
}

// Invalidate Group Chatting Container
function populateGroupChattingAreaContainer(groupItem, messagesItem, chatSpacerGridItem) {
  const { profileImage, name, activeOnline } = groupItem;

  // User Profile Photo
  const chattingContainerPhoto = chatSpacerGridItem.querySelector(".chatting_container_photo");
  chattingContainerPhoto.innerHTML = "";
  if (profileImage) {
    const image = document.createElement("img");
    image.src = profileImage;

    chattingContainerPhoto.appendChild(image);
  } else {
    chattingContainerPhoto.insertAdjacentHTML("beforeend", defaultProfilePhoto);
  }

  // User Name
  const chattingUserInfo = chatSpacerGridItem.querySelector(".chattingUserInfo");
  chattingUserInfo.textContent = name;

  // Update info dataset
  const chatClickToViewInfo = chatSpacerGridItem.querySelector(".chatClickToViewInfo");
  chatClickToViewInfo.setAttribute("data-type", "group");

  // User Status
  const chattingUserStatus = chatSpacerGridItem.querySelector(".chattingUserStatus");
  const statusOutput = `${activeOnline} Online`;

  // chattingUserStatus.classList.add(statusOutput);
  chattingUserStatus.textContent = statusOutput;

  // // Find the group item data by group ID
  const groupItemMessages = groupMessages.filter((msg) => msg.groupId === groupItem.id);

  const chattingContainerMessage = chatSpacerGridItem.querySelector(".chatting_container_message");

  invalidateGroupChattingMessages(groupItemMessages, chattingContainerMessage);
}

// RENDER MESSAGES
function invalidateGroupChattingMessages(messagesItem, chattingContainerMessage) {
  chattingContainerMessage.innerHTML = ""; // clear all existing messages

  messagesItem.forEach((msg, i) => {
    const { senderId, messageId, message, taggedId, type, photos, videoURL, document } = msg;

    // check if next message what sent by you or not. for you, space_up class to be applied
    let nextMessageWasSentByMe;
    const nextMessageObject = messagesItem[i + 1];
    if (nextMessageObject) {
      nextMessageWasSentByMe = nextMessageObject.senderId.id === senderId.id;
    }

    // tagged name
    let taggedUserInfo;
    let whoWasTagged;
    if (taggedId) {
      taggedUserInfo = messagesItem.find((message) => message.messageId === taggedId);
      whoWasTagged = taggedUserInfo.senderId.id !== USERID ? taggedUserInfo.senderId.name : "You";
    }

    let markup;

    const { trackerId } = chattingContainerMessage.closest(".chat_spacer_area").dataset;

    if (msg?.liveChatGameInfo?.type) {
      markup = liveCoinMarkup(msg, nextMessageWasSentByMe, trackerId, i);
    } else if (type === "typing") {
      markup = typingMarkup(msg, nextMessageWasSentByMe, i, "group");
    } else {
      markup = `
              <div class="chat_message_item_container_first_wrapper chatMessageContainer--${i}" id="${USERID === senderId.id ? "sendMessageCategory" : "receiverMessageCategory"}" data-message-id="${messageId}">
                <div class="chat_message_item_container_second_wrapper ${nextMessageWasSentByMe ? "space_left" : "space_down"}">
                  <div data-message-id="${messageId}" class="message_in">
                    <div class="chat_message_quick_action chat-hidden">
                      <div class="chat_message_item_options_wrapper">
                        <button id="chatMessageItemOptions" class="chat_message_item_options">
                          <!-- prettier-ignore -->
                          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5013" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="5.5013" cy="10.5013" rx="0.833333" ry="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><circle cx="15.5013" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/></svg>
                        </button>

                        <ul class="chat_page_options animation-dropdown" aria-expanded="false">
                          <li role="button" tabindex="0" class="selectToForwardButton">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6644 5.4768L18.6367 9.00773C20.2053 10.402 20.9896 11.0992 20.9896 11.9973C20.9896 12.8955 20.2053 13.5926 18.6367 14.987L14.6644 18.5179C13.9484 19.1543 13.5903 19.4726 13.2952 19.34C13 19.2075 13 18.7285 13 17.7705V15.4259C9.4 15.4259 5.5 17.1402 4 19.9973C4 10.8545 9.33333 8.5688 13 8.5688V6.22421C13 5.26622 13 4.78722 13.2952 4.65467C13.5903 4.52212 13.9484 4.84035 14.6644 5.4768Z" stroke="#363853" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            <span>Forward</span>
                          </li>
                          <li role="button" class="replyTo" tabindex="0">
                            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.3335 6.66537L2.62639 7.37247L1.91928 6.66537L2.62639 5.95826L3.3335 6.66537ZM7.50016 16.832C6.94788 16.832 6.50016 16.3843 6.50016 15.832C6.50016 15.2797 6.94788 14.832 7.50016 14.832L7.50016 16.832ZM6.79306 11.5391L2.62639 7.37247L4.0406 5.95826L8.20727 10.1249L6.79306 11.5391ZM2.62639 5.95826L6.79306 1.79159L8.20727 3.2058L4.0406 7.37247L2.62639 5.95826ZM3.3335 5.66537L12.0835 5.66536L12.0835 7.66536L3.3335 7.66537L3.3335 5.66537ZM12.0835 16.832L7.50016 16.832L7.50016 14.832L12.0835 14.832L12.0835 16.832ZM17.6668 11.2487C17.6668 14.3323 15.1671 16.832 12.0835 16.832L12.0835 14.832C14.0625 14.832 15.6668 13.2277 15.6668 11.2487L17.6668 11.2487ZM12.0835 5.66536C15.1671 5.66536 17.6668 8.16511 17.6668 11.2487L15.6668 11.2487C15.6668 9.26968 14.0625 7.66536 12.0835 7.66536L12.0835 5.66536Z" fill="#363853"/></svg></span>
                            <span>Reply</span>
                          </li>
                          <li role="button" tabindex="0">
                            <span>
                               <svg id="Layer_1" data-name="Layer 1" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 89.43 169.37"><title>full hd_svg_logo</title><path d="M35.08,141.89s-.94.39-1.3-.79c.55-.95-2.54-9.27,26.93-14.8,31.63-4.54,47.3,2,46.8,1.62.52.25-16.86-7.47-42.57-4.71-24.78,3.18-30,8.09-33.61,14.81,0,0-1-9.54-1-11.07.2-.79,6.13-13.58,39-17.61.37-.21-19.51-.64-34.65,9.19.06,0-.77-3,4.31-6.71s18.3-9.67,35.93-10.34c8.68-.45,20.16,1,28.3,4,8.31,2.93,13.27,7.06,12.92,10.55a9.45,9.45,0,0,1-.68,3.08c.1,0,5,1.38,4.24,8.42s-.25,14.1-3.83,13.85c-.47.43-4.55-7-40.73-7.32C39,135.3,35.59,142.31,35.08,141.89Z" transform="translate(-30.28 -65.31)"></path><path d="M45.75,182.25a4,4,0,0,0-.51-.5,4.35,4.35,0,0,0-.82-.57,1.49,1.49,0,0,0-.72-.19.45.45,0,0,0-.43.34,14,14,0,0,0-.6,2.16c-.07.32-.13.64-.18,1-.49-3.29-1-6.62-1.43-9.94-1.58-11.41-3-22.89-4.09-33.8l-.33-3.27c1.13-.25,2.3-.51,3.51-.76l.24,2.41c.07.7.15,1.4.22,2.11l.33,3.11c1.06,9.85,2.31,20.05,3.71,30.14Q45.18,178.36,45.75,182.25Z" transform="translate(-30.28 -65.31)"></path><path d="M47.5,193.81q-.12.41-.27.78a4.83,4.83,0,0,1-.42.88,1.68,1.68,0,0,1-.48.53.56.56,0,0,1-.56,0,1.46,1.46,0,0,1-.67-1,8,8,0,0,1-.27-1.86,20.1,20.1,0,0,1,.06-2.41,22.24,22.24,0,0,1,.36-2.58c.16-.85.35-1.66.57-2.41.1-.35.2-.67.31-1C46.58,187.86,47,190.86,47.5,193.81Z" transform="translate(-30.28 -65.31)"></path><path d="M102.26,197.86l-.13.2c0-.14,0-.28.07-.42l.39-.3C102.47,197.52,102.36,197.69,102.26,197.86Z" transform="translate(-30.28 -65.31)"></path><path d="M105.63,197.93l.11-.08q-1,6.56-2.13,12.83c-1.42,8.2-2.92,16-4.45,23.07-16.2,2.12-32.08.59-48.56-4-1.51-6.89-3-14.43-4.39-22.35-.63-3.52-1.23-7.12-1.83-10.77l.09.08a2.49,2.49,0,0,0,1.36.59,1.53,1.53,0,0,0,1.32-.48,3.47,3.47,0,0,0,.67-.93c.71,4.39,1.43,8.69,2.16,12.86a.08.08,0,0,1,0,0c.22,1.23.44,2.46.65,3.66,1,5.21,1.91,10.18,2.88,14.83,14.44,4.48,28.56,5.75,42.8,3.36.92-4.5,1.84-9.29,2.75-14.31.27-1.52.55-3.07.82-4.63,0,0,0-.06,0-.09.57-3.26,1.13-6.61,1.68-10,.24-.24.48-.5.71-.78.52-.62,1-1.26,1.48-1.91A10.76,10.76,0,0,0,105.63,197.93Z" transform="translate(-30.28 -65.31)"></path><path d="M106.17,195.05v0c-.07.48-.15,1-.22,1.44a9.08,9.08,0,0,1-1.07.72c.25-.4.49-.78.7-1.14S106,195.35,106.17,195.05Z" transform="translate(-30.28 -65.31)"></path><path d="M106.8,190.93l-.17,1.13a.17.17,0,0,0-.06-.06,1.12,1.12,0,0,0-.75-.3c-.28,0-.49.18-.65.53,0,0,0,0,0,0s-.11.24-.26.52-.32.6-.53,1-.45.74-.72,1.14a9.54,9.54,0,0,1-.82,1.08,6,6,0,0,1-.43.44c.18-1.2.37-2.41.55-3.63a9.19,9.19,0,0,1,1-.78,6.61,6.61,0,0,1,1.93-.93A3.56,3.56,0,0,1,106.8,190.93Z" transform="translate(-30.28 -65.31)"></path><path d="M113.41,136.62c-.1,1.06-.2,2.12-.31,3.18-1.14,11.85-2.58,24.25-4.22,36.49-.59,4.4-1.21,8.78-1.85,13.11a5.54,5.54,0,0,0-1.15-.05,7.54,7.54,0,0,0-2.48.55h0c.68-4.58,1.34-9.24,2-13.92,1.45-10.88,2.76-21.92,3.85-32.65.17-1.64.33-3.28.49-4.91a.28.28,0,0,0,0-.09c.08-.81.15-1.62.23-2.42C111.12,136.15,112.29,136.39,113.41,136.62Z" transform="translate(-30.28 -65.31)"></path><path d="M38.58,141.65c1.35-.32,2.72-.59,4.15-.84s2.9-.46,4.42-.63a52.17,52.17,0,0,1,9.49-.32A53.42,53.42,0,0,0,47.43,142c-1.44.45-2.84.94-4.18,1.43s-2.65,1-3.85,1.56C39.12,143.85,38.85,142.75,38.58,141.65Z" transform="translate(-30.28 -65.31)"></path><path d="M111,144c-2.31-.83-4.87-1.62-7.55-2.38s-5.52-1.46-8.46-2.08-6-1.19-9.1-1.58a73.05,73.05,0,0,0-9.52-.67,75.38,75.38,0,0,1,9.58-.75c3.17-.07,6.3,0,9.33.22s6,.49,8.74.84,5.41.79,7.89,1.3C111.56,140.54,111.25,142.24,111,144Z" transform="translate(-30.28 -65.31)"></path><path d="M101,215.71c-.35.14-.58.2-.85.29l-.77.23c-.51.13-1,.26-1.51.37-1,.23-2,.41-3,.56a57.55,57.55,0,0,1-6,.56c-2,.09-4,.06-6,0-1-.05-2-.12-3-.2s-2-.2-3-.32l3-.21,3-.33c2-.28,4-.61,5.91-1.07a52.91,52.91,0,0,0,5.78-1.66c1-.33,1.89-.69,2.8-1.09.46-.19.91-.4,1.36-.61l.65-.33a6.38,6.38,0,0,0,.56-.31C100.3,213,100.65,214.34,101,215.71Z" transform="translate(-30.28 -65.31)"></path><path d="M49,208.12c1.05.66,2.16,1.31,3.26,1.92s2.21,1.21,3.32,1.76a51.68,51.68,0,0,0,6.81,2.89,44.29,44.29,0,0,1-7-1c-1.16-.25-2.32-.54-3.47-.85s-2.29-.66-3.46-1C48.67,210.56,48.84,209.35,49,208.12Z" transform="translate(-30.28 -65.31)"></path><path d="M96.54,89.94q.17,4.13.3,8.45a.82.82,0,0,1-1,.83c-3-.3-6-.52-9.09-.64-2,1.78-4,3.61-6,5.51L79.52,103c2-1.9,4.06-3.75,6-5.52,0-2.76-.1-5.46-.16-8.08-1-.93-2.08-1.83-3.11-2.71-4.4,0-8.83.19-13.23.59a.83.83,0,0,1-1-.76c.06-3.7.13-7.23.2-10.54q-.89-.61-1.77-1.2c-1.83.21-3.64.46-5.46.73-.53.09-1-.18-.93-.6.08-1.45.15-2.86.23-4.22a1.1,1.1,0,0,1,1-.85q2.76-.39,5.52-.7c.53-.06,1,.2.94.58q-.06,2-.12,4l1.77,1.19q6.3-.61,12.59-.73a1,1,0,0,1,1.15.88c.11,3.33.2,6.86.28,10.57,1,.88,2.07,1.78,3.11,2.7q4.55.16,9,.6A1.13,1.13,0,0,1,96.54,89.94Z" transform="translate(-30.28 -65.31)"></path><path d="M65.7,89.18c-2.18.25-4.35.54-6.5.89a1.19,1.19,0,0,0-1,1c-.06,1.87-.12,3.78-.17,5.72a.78.78,0,0,0,1,.75c2.17-.33,4.37-.61,6.58-.84a1.12,1.12,0,0,0,1-1c0-2,.06-3.89.09-5.77A.81.81,0,0,0,65.7,89.18Z" transform="translate(-30.28 -65.31)"></path><path d="M71.54,68.46l2.31-.19c.53,0,1-.38,1-.75V65.9c0-.37-.42-.62-.94-.58l-2.28.19c-.52,0-1,.38-1,.74l0,1.62C70.59,68.24,71,68.51,71.54,68.46Z" transform="translate(-30.28 -65.31)"></path><path d="M95.22,79.22l-2-.15a.79.79,0,0,0-.94.76l.09,1.73a1.05,1.05,0,0,0,1,.92l2,.17a.77.77,0,0,0,.92-.76l-.09-1.75A1.08,1.08,0,0,0,95.22,79.22Z" transform="translate(-30.28 -65.31)"></path><path d="M101.68,84.17c-1.13-.16-2.27-.3-3.42-.43a.76.76,0,0,0-.92.76c0,1,.1,2.09.14,3.15a1.14,1.14,0,0,0,1,1c1.15.14,2.29.3,3.43.47a.73.73,0,0,0,.9-.75c0-1.07-.1-2.13-.16-3.18A1.15,1.15,0,0,0,101.68,84.17Z" transform="translate(-30.28 -65.31)"></path><path d="M56.9,88.42c.05-1.34.11-2.66.17-4,0-.45-.41-.74-1-.64-1.53.29-3.06.6-4.57.94a1.26,1.26,0,0,0-1,1c-.06,1.3-.13,2.62-.19,4,0,.46.39.75.93.63,1.51-.33,3.05-.65,4.6-.94A1.2,1.2,0,0,0,56.9,88.42Z" transform="translate(-30.28 -65.31)"></path><path d="M113.91,178.88c-1.36,9.48-2.88,19-4.54,28.18a3.11,3.11,0,0,1-1.86,2.32c-.9.36-2.23.81-3.9,1.3-1.08.32-2.31.64-3.65,1l-.07,0-.22.05h0c-6.72,1.6-16.14,3.07-24.81,2.36-8.54-.37-17.91-2.91-24.69-5.25h0l-.17-.06-1-.36c-1-.35-1.91-.7-2.76-1-1.84-.72-3.3-1.37-4.27-1.85a3.47,3.47,0,0,1-1.88-2.39c-1.61-8.7-3.09-17.66-4.41-26.56-.16-1,.32-1.84,1.17-1.88s2.28-.12,4.24-.17c1,0,2.23-.05,3.58-.06,6.46-.09,16.5-.08,30.26.22,14,.3,24,.82,30.43,1.31,1.35.1,2.53.2,3.55.3,1.78.17,3.08.32,3.89.46S114.08,177.76,113.91,178.88Z" transform="translate(-30.28 -65.31)"></path></svg>
                            </span>
                            <span>Mug</span>
                          </li>
                          <li role="button" class="copyMessageText" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7V7C14 6.06812 14 5.60218 13.8478 5.23463C13.6448 4.74458 13.2554 4.35523 12.7654 4.15224C12.3978 4 11.9319 4 11 4H8C6.11438 4 5.17157 4 4.58579 4.58579C4 5.17157 4 6.11438 4 8V11C4 11.9319 4 12.3978 4.15224 12.7654C4.35523 13.2554 4.74458 13.6448 5.23463 13.8478C5.60218 14 6.06812 14 7 14V14" stroke="#33363F" stroke-width="2"/><rect x="10" y="10" width="10" height="10" rx="2" stroke="#33363F" stroke-width="2"/></svg></span>
                            <span>Copy</span>
                          </li>
                          <li class="report reportMessage" role="button" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#FF3B30" stroke-width="2"/><circle cx="12" cy="18" r="0.5" fill="#FF3B30" stroke="#FF3B30"/><path d="M12 16V14.5811C12 13.6369 12.6042 12.7986 13.5 12.5V12.5C14.3958 12.2014 15 11.3631 15 10.4189V9.90569C15 8.30092 13.6991 7 12.0943 7H12C10.3431 7 9 8.34315 9 10V10" stroke="#FF3B30" stroke-width="2"/></svg></span>
                            <span>Report</span>
                          </li>
                          <li class="delete selectToDeleteButton" role="button" tabindex="0">
                            <span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15L10 12" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M14 15L14 12" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M3 7H21V7C20.0681 7 19.6022 7 19.2346 7.15224C18.7446 7.35523 18.3552 7.74458 18.1522 8.23463C18 8.60218 18 9.06812 18 10V16C18 17.8856 18 18.8284 17.4142 19.4142C16.8284 20 15.8856 20 14 20H10C8.11438 20 7.17157 20 6.58579 19.4142C6 18.8284 6 17.8856 6 16V10C6 9.06812 6 8.60218 5.84776 8.23463C5.64477 7.74458 5.25542 7.35523 4.76537 7.15224C4.39782 7 3.93188 7 3 7V7Z" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/><path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke="#FF3B30" stroke-width="2" stroke-linecap="round"/></svg></span>
                            <span>Delete</span>
                          </li>
                        </ul>
                      </div>

                      <button id="tagForReplyButton" class="tag_for_reply_button">
                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.83203 7.16537L3.33706 7.66034L2.84208 7.16537L3.33706 6.67039L3.83203 7.16537ZM7.9987 17.032C7.6121 17.032 7.2987 16.7186 7.2987 16.332C7.2987 15.9454 7.6121 15.632 7.9987 15.632L7.9987 17.032ZM7.50372 11.827L3.33706 7.66034L4.32701 6.67039L8.49367 10.8371L7.50372 11.827ZM3.33706 6.67039L7.50372 2.50372L8.49367 3.49367L4.32701 7.66034L3.33706 6.67039ZM3.83203 6.46537L12.582 6.46536L12.582 7.86536L3.83203 7.86537L3.83203 6.46537ZM12.582 17.032L7.9987 17.032L7.9987 15.632L12.582 15.632L12.582 17.032ZM17.8654 11.7487C17.8654 14.6666 15.4999 17.032 12.582 17.032L12.582 15.632C14.7267 15.632 16.4654 13.8934 16.4654 11.7487L17.8654 11.7487ZM12.582 6.46536C15.4999 6.46536 17.8654 8.83079 17.8654 11.7487L16.4654 11.7487C16.4654 9.60399 14.7267 7.86536 12.582 7.86536L12.582 6.46536Z" fill="#222222"/></svg>
                      </button>
                    </div>

                    <button class="select_chat_item_button chat-hidden" aria-selected="false" aria-label="Select Chat Item" aria-selected="false">
                      <svg width="12" height="10" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2.0013L2 3.0013C2.18407 3.18537 2.4826 3.18537 2.66667 3.0013L5 0.667969" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>

                   ${
                     !nextMessageWasSentByMe && USERID !== senderId.id
                       ? `
                      <div class="group_sender_profile_picture">
                          <img src="${senderId.image}" alt="${senderId.name}"/>
                      </div>`
                       : ""
                   }

                    <div class="chat_message_item_container ${USERID === senderId.id ? "sender_message" : "receiver_message"}">
                      ${USERID === senderId.id ? `<svg width="16" height="16" fill="#8837e9" style="position: absolute; z-index: -1; top: -6px; right: 0px; transition-property: scale, fill; transition-duration: 300ms; transition-timing-function: cubic-bezier(0.31, 0.1, 0.08, 0.96); transition-delay: 0ms; will-change: fill;"><path d="M-2.70729e-07 6.19355C8 6.19355 12 4.12903 16 6.99382e-07C16 6.70968 16 13.5 10 16L-2.70729e-07 6.19355Z"></path></svg>` : `<svg width="16" height="16" fill="#ffffff" style="position: absolute; z-index: 1; top: -6px; left: 0px; transition-property: scale, fill; transition-duration: 300ms; transition-timing-function: cubic-bezier(0.31, 0.1, 0.08, 0.96); transition-delay: 0ms; will-change: fill;" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 6.19355 C8 6.19355 4 4.12903 0 6.99382e-07 C0 6.70968 0 13.5 6 16 L16 6.19355 Z"/></svg>`}
                      <div class="chat_emoji_container animate__animated animate__pulse ${HIDDEN}">
                        <button class="chat_emoji_container--button" data-emoji="😀">😀</button>
                        <button class="chat_emoji_container--button" data-emoji="🔥">🔥</button>
                        <button class="chat_emoji_container--button" data-emoji="❤️">❤️</button>
                        <button class="chat_emoji_container--button" data-emoji="✨">✨</button>
                        <button class="chat_emoji_container--button" data-emoji="👍">👍</button>
                        <button class="chat_emoji_container--button" data-emoji="🙏">🙏</button>
                        <button data-position="${trackerId}" class="show_select_manual_emoji">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="#8837e9" d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"/></svg>
                        </button>
                      </div>

                      ${taggedId ? `<div class="tag_reply_stick"></div>` : ""}

                      <!-- Download Image Button -->
                     ${
                       photos?.length
                         ? `
                            <button class="download_image">
                              <svg width="16" height="16" class="export_svg" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5007 4.66797L10.0057 4.17299L10.5007 3.67802L10.9956 4.17299L10.5007 4.66797ZM11.2007 12.168C11.2007 12.5546 10.8873 12.868 10.5007 12.868C10.1141 12.868 9.80065 12.5546 9.80065 12.168L11.2007 12.168ZM5.83901 8.33966L10.0057 4.17299L10.9956 5.16294L6.82896 9.32961L5.83901 8.33966ZM10.9956 4.17299L15.1623 8.33966L14.1723 9.32961L10.0057 5.16294L10.9956 4.17299ZM11.2007 4.66797L11.2007 12.168L9.80065 12.168L9.80065 4.66797L11.2007 4.66797Z" fill="#33363F"/><path d="M4.66602 13.832L4.66602 14.6654C4.66602 15.5858 5.41221 16.332 6.33268 16.332L14.666 16.332C15.5865 16.332 16.3327 15.5858 16.3327 14.6654V13.832" stroke="#33363F" stroke-width="1.4"/></svg>
                              <svg width="16" height="16" class="import_svg" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5007 11.668L10.0057 12.1629L10.5007 12.6579L10.9956 12.1629L10.5007 11.668ZM11.2007 4.16797C11.2007 3.78137 10.8873 3.46797 10.5007 3.46797C10.1141 3.46797 9.80065 3.78137 9.80065 4.16797L11.2007 4.16797ZM5.83901 7.99628L10.0057 12.1629L10.9956 11.173L6.82896 7.00633L5.83901 7.99628ZM10.9956 12.1629L15.1623 7.99628L14.1723 7.00633L10.0057 11.173L10.9956 12.1629ZM11.2007 11.668L11.2007 4.16797L9.80065 4.16797L9.80065 11.668L11.2007 11.668Z" fill="#33363F"/><path d="M4.66602 13.332L4.66602 14.1654C4.66602 15.0858 5.41221 15.832 6.33268 15.832L14.666 15.832C15.5865 15.832 16.3327 15.0858 16.3327 14.1654V13.332" stroke="#33363F" stroke-width="1.4"/></svg>
                            </button>
                          `
                         : ""
                     }

                      <div class="chat_message">
                        <div class="message_content">
                          <!-- Tagged -->
                          ${
                            taggedId
                              ? `<div class="tag_reply">
                                  <div>
                                    <span class="tagged_user">${taggedUserInfo?.senderId.name}</span>
                                    <p>${taggedUserInfo?.message}</p>
                                  </div>
                                </div>`
                              : ""
                          }

                          ${
                            type === "photo"
                              ? `
                                <div class="chat_message_image images-${photos.length < 4 ? photos.length : 4}">
                                  ${photos
                                    .map((photo, i) => {
                                      if (i < 4) {
                                        return `
                                          <div data-on-chat-images="[${[...photos]}]" class="chat-on-images ${photos.length === 3 && i < 2 ? "top-box" : "bottom-box"}">
                                            <img src="${photo}" alt="" />

                                            ${
                                              photos.length > 4 && i === 3
                                                ? `
                                              <div class="chat_message_image--overlay">
                                                <span>+${photos.length - 4}</span>
                                              </div>`
                                                : ""
                                            }
                                          </div>
                                          `;
                                      }
                                    })
                                    .join("")}
                                </div>
                            `
                              : ""
                          }

                          ${
                            type === "video"
                              ? `
                                <div class="chat_message_image chat_message_image--video images-1 ">
                                  <div class="chat_video_message_container">
                                    <video src="${videoURL}"></video>
                                    <button class="change_video_state play_video--btn" data-mode="idle" id="changeVideoState">
                                      <svg class="play_icon" width="1.5em" height="1.5em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                                      <svg class="pause_icon" width="1.5em" height="1.5em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" d="M14 19V5h4v14zm-8 0V5h4v14z"/></svg>
                                    </button>
                                  </div>
                                </div>
                            `
                              : ""
                          }

                           ${
                             type === "document"
                               ? `
                                <div class="chat_message_file" tabindex="0">
                                  <div>
                                    <img src="${document.thumbnail}" />
                                  </div>

                                  <div>
                                    <h5>${document.filename}</h5>
                                    <p>${document.size}</p>
                                  </div>
                                </div>
                             `
                               : ""
                           }

                           ${
                             type === "voice_call"
                               ? `
                                <div class="chat_message_call" role="button">
                                  <div class="call_icon">
                                    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.67962 2.63617L4.60868 0.707107C4.99921 0.316582 5.63237 0.316583 6.0229 0.707108L9.66131 4.34552C10.0518 4.73605 10.0518 5.36921 9.66131 5.75974L7.21113 8.20992C6.8336 8.58745 6.74 9.16422 6.97878 9.64177C8.3591 12.4024 10.5976 14.6409 13.3582 16.0212C13.8358 16.26 14.4125 16.1664 14.7901 15.7889L17.2403 13.3387C17.6308 12.9482 18.264 12.9482 18.6545 13.3387L22.2929 16.9771C22.6834 17.3676 22.6834 18.0008 22.2929 18.3913L20.3638 20.3204C18.2525 22.4317 14.9099 22.6693 12.5212 20.8777L9.20752 18.3925C7.46399 17.0848 5.91517 15.536 4.60752 13.7925L2.12226 10.4788C0.330722 8.09009 0.568272 4.74752 2.67962 2.63617Z" fill="#${msg?.call_category === "missed" ? "ff3b30" : "999999"}"/></svg>
                                  </div>

                                  <div class="call_info">
                                    <h4>Missed Voice Call</h4>
                                    <span class="call_again_duration">Call ${USERID === senderId.id ? "Again" : "Back"}</span>
                                    <span class="call_time">12:00</span>
                                  </div>
                                </div>
                            `
                               : ""
                           }

                          ${
                            type === "video_call"
                              ? `
                              <div class="chat_message_call" role="button">
                                <div class="call_icon">
                                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5H15C16.1 6.5 17 7.4 17 8.5V16.5C17 17.6 16.1 18.5 15 18.5H4C2.9 18.5 2 17.6 2 16.5V8.5C2 7.4 2.9 6.5 4 6.5Z" fill="#FF3B30"/><path d="M22 18L17 15V10L22 7V18Z" fill="#${msg?.call_category === "missed" ? "ff3b30" : "999999"}"/></svg>
                                </div>

                                <div class="call_info">
                                  <h4>Missed Video Call</h4>
                                  <span class="call_again_duration">Call ${USERID === senderId.id ? "Again" : "Back"}</span>
                                  <span class="call_time">12:00</span>
                                </div>
                              </div>
                          `
                              : ""
                          }


                          ${
                            type === "voice_call" || type === "video_call"
                              ? ""
                              : `
                                <div class="chat_message_content">
                                  <!-- Message -->
                                  ${message ? `<p>${message}</p>` : ""}

                                  ${!nextMessageWasSentByMe && senderId.id !== USERID ? `<p class="group_user_name">${senderId.name}</p>` : ""}

                                  <div class="message_time ${type !== "photo" && type !== "video" ? "up" : ""}">
                                    <span>12:00</span>
                                  </div>
                                </div>
                              `
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                 ${
                   USERID === senderId.id
                     ? `
                      <div class="user-seen-signature">
                        <img src="https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://images.unsplash.com/photo-1457449940276-e8deed18bfff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" />
                      </div>
                      `
                     : ""
                 }
                </div>
              </div>
    `;
    }

    // Insert Content
    chattingContainerMessage.insertAdjacentHTML("beforeend", markup);
  });

  handleShowMessageItemEmoji(chattingContainerMessage);

  // Handler Emoji Reactions
  handleReactionToGroupMessages(messagesItem, chattingContainerMessage);

  // Handler Emoji Container Selection Reaction :)
  handleGroupEmojiContainerSelectionReaction(messagesItem, chattingContainerMessage);

  // Handle Typing Mode Event
  handleChatTyping();

  // Scroll to the bottom
  chattingContainerMessage.scrollTop = chattingContainerMessage.scrollHeight;
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
 */

function handleGroupEmojiContainerSelectionReaction(messagesItem, chattingContainerMessage) {
  messagesItem.forEach((msg, i) => {
    const chatMessageItemContainer = chattingContainerMessage.querySelector(`.chatMessageContainer--${i}`);
    if (!chatMessageItemContainer) return;

    chatMessageItemContainer.addEventListener("click", (e) => {
      const chatEmojiManualBtn = e.target.closest(".show_select_manual_emoji");
      if (!chatEmojiManualBtn) return;

      const { position } = chatEmojiManualBtn.dataset;

      if ((currentMaxOpenedChat === 3 && [2, 3].includes(+position)) || (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(+position))) {
        const trackerId = chatEmojiManualBtn.closest(".chat_spacer_area").dataset.trackerId;
        showChattingEmojiModal(trackerId, "chatting-grid");
        return;
      }

      // Ensure only the emoji picker inside the specific chat container opens
      const chatContainer = chatEmojiManualBtn.closest(".chatting_container");
      const stickersModal = chatContainer?.querySelector(".emoji-picker-container");

      if (!stickersModal) return;

      stickersModal.dataset.open = "message-reaction";
      stickersModal.classList.remove(HIDDEN);
      chatEmojiManualBtn.closest(".chat_emoji_container")?.classList.add(HIDDEN);

      const messageIn = chatEmojiManualBtn.closest(".message_in");
      const messageIdStr = messageIn?.dataset.messageId;

      currentMessageItem = messagesItem;
      messageIdBeforeOpeningEmojiContainer = Number(messageIdStr);

      // Close only the emoji picker inside this chat container when clicking outside
      document.addEventListener(
        "click",
        (e) => {
          if (!e.target.closest(".chat-emoji-wrapper") && !e.target.closest(".show_select_manual_emoji")) {
            stickersModal.classList.add(HIDDEN);
          }
        },
        { once: true }
      ); // Ensure event fires only once
    });
  });
}

function handleReactionToGroupMessages(messagesItem, chattingContainerMessage) {
  messagesItem.forEach((msg, i) => {
    const chatMessageItemContainer = chattingContainerMessage.querySelector(`.chatMessageContainer--${i}`);

    if (!chatMessageItemContainer) return;

    chatMessageItemContainer.addEventListener("click", (e) => {
      const chatEmojiContainerBtn = e.target.closest(".chat_emoji_container--button");
      if (!chatEmojiContainerBtn) return;

      const { emoji } = chatEmojiContainerBtn.dataset;
      const messageIn = chatEmojiContainerBtn.closest(".message_in");
      const messageIdStr = messageIn?.dataset.messageId;

      if (!emoji || !messageIdStr) {
        console.warn("Missing emoji or messageId in dataset");
        return;
      }

      const messageId = Number(messageIdStr);
      if (isNaN(messageId)) {
        console.error("Invalid messageId format");
        return;
      }

      const messageIndex = messagesItem.findIndex((m) => m.messageId === messageId);
      if (messageIndex === -1) {
        console.error("Message not found in array");
        return;
      }

      const message = messagesItem[messageIndex];
      if (!message.reactions) message.reactions = [];
      message.reactions.push(emoji);

      // Hide Select Container
      chatEmojiContainerBtn.closest(".chat_emoji_container")?.classList.add(HIDDEN);

      updateEmojiReactionInDOM(chatMessageItemContainer, message.reactions);
    });
  });
}

const groupInfoBack = document.getElementById("groupInfoBack");

groupInfoBack.addEventListener("click", hideGroupChatInformation);
function hideGroupChatInformation() {
  const groupsTabContainer = document.getElementById("groupsTabContainer");

  hideAllChatSectionContainers();
  groupsTabContainer.classList.remove(HIDDEN);
}

const groupAsideExitButton = document.getElementById("groupAsideExitButton");
const groupAsideReportButton = document.getElementById("groupAsideReportButton");

groupAsideExitButton.addEventListener("click", showGlobalDiscardModal);
groupAsideReportButton.addEventListener("click", showGlobalReportModal);

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
const createNewGroupModal = document.getElementById("createNewGroupModal");
const createNewGroup = document.getElementById("createNewGroup");
const hideCreateGroupModalBtn = document.getElementById("hideCreateGroupModalBtn");
const nextFromGroupInfo = document.getElementById("nextFromGroupInfo");

function hideCreateGroupModal() {
  createNewGroupModal.classList.add(HIDDEN);
}

function showCreateGroupModal() {
  createNewGroupModal.classList.remove(HIDDEN);
}

createNewGroup.addEventListener("click", showCreateGroupModal);
hideCreateGroupModalBtn.addEventListener("click", hideCreateGroupModal);

nextFromGroupInfo.addEventListener("click", (e) => {
  hideCreateGroupModal();
  showGlobalFollowingModal();
});

createNewGroupModal.addEventListener("click", (e) => {
  if (e.target.id === "createNewGroupModal") return hideCreateGroupModal();
});
