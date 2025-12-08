const liveItemsList = document.getElementById("liveItemsList");

function renderLiveChats() {
  liveItemsList.innerHTML = "";

  liveChatList.forEach((live) => {
    const { interests, title, newMessageCount, profileImage, id, description } = live;

    const moreLength = interests.length > 3 ? interests.length - 3 : 0;

    const markup = `
        <li class="live_chat_item" data-live-chat-id="${id}" tabindex="0" role="button">
                <div class="live_chat_photo">
                      <img src="${profileImage}" alt="${title}" />
                </div>

                <div class="live_chat_title">
                        <div class="title"># <span> ${title}</span></div>

                        <p class="live_chat_description">${description}</p>

                        <ul class="live_interests">
                                ${interests
                                  .map((int, i) => {
                                    if (i < 3) {
                                      return `<li style="color: ${getRandomGeneratedColor()}">${int}</li>`;
                                    }
                                  })
                                  .join("")}
                                <li class="more ${moreLength ? "" : HIDDEN}">+${moreLength}</li>
                        </ul>
                </div>

                <div class="message_info live_message_info">
                      ${
                        newMessageCount
                          ? `
                        <div>
                          ${
                            newMessageCount
                              ? `
                              <div class="message_count">
                                <span>${newMessageCount}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2.3em" height="2.3em" viewBox="0 0 24 24"><path fill="#8837E9" d="M21.99 12a9.9 9.9 0 0 1-.76 3.83a9.7 9.7 0 0 1-2.17 3.24a10 10 0 0 1-3.24 2.17a9.9 9.9 0 0 1-3.83.76a9.7 9.7 0 0 1-3.88-.79l-3.65.54a1.94 1.94 0 0 1-2.21-2.33l.5-3.65A9.6 9.6 0 0 1 2.01 12a9.8 9.8 0 0 1 .76-3.82a10 10 0 0 1 2.16-3.25a10 10 0 0 1 14.15 0a9.7 9.7 0 0 1 2.17 3.25a9.8 9.8 0 0 1 .74 3.82"/></svg>
                              </div>`
                              : `<img src="https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />`
                          }
                        </div>
                        `
                          : ""
                      }
                </div>

                 <div class="chat_list_item_option_wrapper chat_list_item_option_wrapper--chat">
                  <button class="chat_live_item_option">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5003" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><ellipse cx="5.50033" cy="10.5013" rx="0.833333" ry="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/><circle cx="15.5003" cy="10.5013" r="0.833333" fill="#33363F" stroke="#33363F" stroke-width="1.4" stroke-linecap="round"/></svg>
                  </button>

                  <ul class="chat_page_options chat_live_item_options animate__animated animate__fadeIn" aria-expanded="false">
                    <li role="button" id="favourite" tabindex="0">
                      <span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="#33363F" stroke-width="2"/></svg></span>
                      <span>Favourite</span>
                    </li>
                    <li role="button" id="multiplyScreen" tabindex="0">
                      <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-width="2" d="M19 15h4V1H9v4m6 14h4V5H5v4M1 23h14V9H1z"/></svg></span>
                      <span>Multiple</span>
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
        </li>`;

    liveItemsList.insertAdjacentHTML("beforeend", markup);
  });

  // Initialize Popper for each chat item after rendering
  const liveChatItems = liveItemsList.querySelectorAll(".live_chat_item");
  liveChatItems.forEach((liveChatItem) => {
    const button = liveChatItem.querySelector(".chat_live_item_option");
    const dropdown = liveChatItem.querySelector(".chat_live_item_options");

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
    if (!e.target.closest(".chat_list_item_option_wrapper--chat")) {
      liveChatItems.forEach((liveChatItem) => {
        const dropdown = liveChatItem.querySelector(".chat_live_item_options");
        dropdown.setAttribute("aria-expanded", "false");
      });
    }
  });
}

renderLiveChats();

/**
 *
 *
 * Live Chat Events
 *
 */
const liveProfileQrcode = document.getElementById("liveProfileQrcode");

liveItemsList.addEventListener("click", (e) => {
  const li = e.target.closest(".live_chat_item");
  const { liveChatId } = li.dataset;

  // Find the live item data by live ID
  const liveItem = liveChatList.find((live) => live.id === +liveChatId);

  // Show Live Chat Item Information
  if (e.target.closest(".title")) {
    // liveProfileQrcode
    liveProfileQrcode.addEventListener("click", () => showGroupLiveQRcodeModal(liveItem.title));

    return showLiveChatInformation(liveItem);
  }

  // if the click happens with chat options (Fav/unread/delete/block)
  const chatLiveItemOption = e.target.closest(".chat_live_item_options");
  if (chatLiveItemOption) {
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
      handleOpenChatThroughMultipleButton(liveChatId, "lives");
    }

    chatLiveItemOption.setAttribute("aria-expanded", false);
    return;
  }

  // Open Chat
  openChats = [];
  openChats.push({ type: "lives", userId: +liveChatId });
  li.classList.add("active");
  currentOpenedUser = liveItem;
  currentChattingInfo = { id: liveItem.id, type: "lives" };
  updateLiveChatOpened(liveItem);
  handleOpenChat(liveChatId, "lives");
});

// Invalidate Live Chatting Container
function populateLiveChattingAreaContainer(liveItem, messagesItem, chatSpacerGridItem) {
  const { profileImage, name, activeOnline } = liveItem;

  const nonLiveHeader = chatSpacerGridItem.querySelector(".none_live_chat_header");
  const liveHeader = chatSpacerGridItem.querySelector(".live_chat_header");

  nonLiveHeader.classList.add(HIDDEN);
  liveHeader.classList.remove(HIDDEN);

  // Live Chat title
  chatSpacerGridItem.querySelector(".liveChatHeaderTitle").textContent = liveItem.title;

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

  // // Find the live item data by live ID
  const liveItemMessages = liveMessages.filter((msg) => msg.liveId === liveItem.id);

  const chattingContainerMessage = chatSpacerGridItem.querySelector(".chatting_container_message");
  invalidateGroupChattingMessages(liveItemMessages, chattingContainerMessage);
}

function updateLiveChatOpened(liveItem, show = true) {
  const openedLiveChattingContainerPreview = document.getElementById("openedLiveChattingContainerPreview");
  const openedLiveChattingContainerPreviewIMG = document.getElementById("openedLiveChattingContainerPreviewIMG");

  if (show) {
    openedLiveChattingContainerPreview.classList.remove(HIDDEN);
    openedLiveChattingContainerPreviewIMG.src = liveItem.profileImage;
  } else {
    openedLiveChattingContainerPreview.classList.add(HIDDEN);
    openedLiveChattingContainerPreviewIMG.src = "";
  }
}
