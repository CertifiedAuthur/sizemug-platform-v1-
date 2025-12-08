// Get the element with the ID "FollowersLists"
const followersLists = document.getElementById("followersLists");
const followingLists = document.getElementById("followingLists");
const userListsContainer = document.getElementById("userListsContainer");
let fetchedData = [];

// Asynchronous function to render users
async function renderUsers(container) {
  // Render skeleton loading placeholders
  renderUsersSkeleton(container);
  renderUsersSkeleton(container);

  try {
    // Generate user data with tasks and log it to the console
    const data = await generateUsersWithTasks(30);
    container.innerHTML = "";

    fetchedData = [...fetchedData, ...data];

    // if (firstContainer) {
    updateTopBio(fetchedData[0]);
    // }

    data.forEach((item, i) => {
      const { id, username, userPhoto, online, followering } = item;

      const markup = `
            <div class="user_list_item" role="button" aria-selected="${i === 0 ? "true" : "false"}" data-list-id="${id}">
              <div>
                <img src="${userPhoto}" alt="" />
                ${online ? `<span class="online_sign showOnlineSign ${HIDDEN}"></span>` : ""}
              </div>

              <div>
                <h5>${username}</h5>

                <p style="padding-bottom: 0.4rem">
                  <a href="#" class="user_list_item_username">@marcus</a>
                </p>

                <div>
                  <img src="./images/suggestion--2.png" alt="" />
                  <img src="./images/suggestion--3.png" alt="" />
                  <img src="./images/suggestion--2.png" alt="" />
                  <img src="./images/suggestion--5.png" alt="" />
                  <span class="mutual_friend" href="#">Alex and 1 mutual friend</span>
                </div>
              </div>

              <div id="user_item_tool">
                <button data-mode="${followering ? "following" : "follower"}" class="user_list_item_action">${followering ? "Following" : "Follower"}</button>

                <button class="user_list_item_options">
                  <!-- prettier-ignore -->
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.0003" cy="9.9987" r="0.833333" transform="rotate(-90 10.0003 9.9987)" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><circle cx="10.0003" cy="14.9987" r="0.833333" transform="rotate(-90 10.0003 14.9987)" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><circle cx="10.0003" cy="4.9987" r="0.833333" transform="rotate(-90 10.0003 4.9987)" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>
                </button>

                <div class="user_list_item_option animation-dropdown ${HIDDEN}">
                    <a href="/chat.html" class="message">
                      <span>
                        <!-- prettier-ignore -->
                        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.78991 9.04479H15.3866M7.78991 12.8431H13.4874M17.2857 4.29688C18.0413 4.29688 18.7659 4.59701 19.3001 5.13125C19.8344 5.6655 20.1345 6.39009 20.1345 7.14563V14.7423C20.1345 15.4978 19.8344 16.2224 19.3001 16.7567C18.7659 17.2909 18.0413 17.591 17.2857 17.591H12.5378L7.78991 20.4398V17.591H5.89074C5.13521 17.591 4.41062 17.2909 3.87637 16.7567C3.34213 16.2224 3.04199 15.4978 3.04199 14.7423V7.14563C3.04199 6.39009 3.34213 5.6655 3.87637 5.13125C4.41062 4.59701 5.13521 4.29688 5.89074 4.29688H17.2857Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </span>
                      <span>Message</span>
                    </a>

                    <button class="send_note_option">
                      <span>
                        <!-- prettier-ignore -->
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6486_119681)"><path d="M13.1934 20.0898L20.1934 13.0898" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.1934 20.0898V14.0898C13.1934 13.8246 13.2987 13.5703 13.4863 13.3827C13.6738 13.1952 13.9281 13.0898 14.1934 13.0898H20.1934V6.08984C20.1934 5.55941 19.9826 5.0507 19.6076 4.67563C19.2325 4.30056 18.7238 4.08984 18.1934 4.08984H6.19336C5.66293 4.08984 5.15422 4.30056 4.77915 4.67563C4.40407 5.0507 4.19336 5.55941 4.19336 6.08984V18.0898C4.19336 18.6203 4.40407 19.129 4.77915 19.5041C5.15422 19.8791 5.66293 20.0898 6.19336 20.0898H13.1934Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_6486_119681"><rect width="24" height="24" fill="white" transform="translate(0.193359 0.0898438)"/></clipPath></defs></svg>
                      </span>
                      <span>Send note</span>
                    </button>

                    <button class="follow_option">
                      <span>
                        <!-- prettier-ignore -->
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.1934 14.5372V16.6272C13.2883 16.3072 12.3196 16.209 11.3688 16.3409C10.4179 16.4729 9.51256 16.831 8.72879 17.3854C7.94502 17.9397 7.3057 18.674 6.86452 19.5266C6.42334 20.3792 6.19318 21.3252 6.19336 22.2852H4.19336C4.1929 21.064 4.47202 19.8589 5.00933 18.7622C5.54664 17.6656 6.32788 16.7065 7.29318 15.9585C8.25848 15.2105 9.38222 14.6934 10.5783 14.4469C11.7743 14.2003 13.0109 14.2319 14.1934 14.5372ZM12.1934 13.2852C8.87836 13.2852 6.19336 10.6002 6.19336 7.28516C6.19336 3.97016 8.87836 1.28516 12.1934 1.28516C15.5084 1.28516 18.1934 3.97016 18.1934 7.28516C18.1934 10.6002 15.5084 13.2852 12.1934 13.2852ZM12.1934 11.2852C14.4034 11.2852 16.1934 9.49516 16.1934 7.28516C16.1934 5.07516 14.4034 3.28516 12.1934 3.28516C9.98336 3.28516 8.19336 5.07516 8.19336 7.28516C8.19336 9.49516 9.98336 11.2852 12.1934 11.2852ZM19.1934 17.8712L21.3144 15.7502L22.7294 17.1642L20.6074 19.2852L22.7284 21.4062L21.3144 22.8212L19.1934 20.6992L17.0724 22.8202L15.6574 21.4062L17.7804 19.2852L15.6594 17.1642L17.0734 15.7492L19.1934 17.8712Z" fill="#808080"/></svg>
                      </span>
                      <span>Unfollow</span>
                    </button>

                    <hr />

                    <button class="report_option">
                      <span>
                        <!-- prettier-ignore -->
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1934 17.4805C12.4767 17.4805 12.7144 17.3845 12.9064 17.1925C13.0984 17.0005 13.194 16.7631 13.1934 16.4805C13.1927 16.1978 13.0967 15.9605 12.9054 15.7685C12.714 15.5765 12.4767 15.4805 12.1934 15.4805C11.91 15.4805 11.6727 15.5765 11.4814 15.7685C11.29 15.9605 11.194 16.1978 11.1934 16.4805C11.1927 16.7631 11.2887 17.0008 11.4814 17.1935C11.674 17.3861 11.9114 17.4818 12.1934 17.4805ZM11.1934 13.4805H13.1934V7.48047H11.1934V13.4805ZM8.44336 21.4805L3.19336 16.2305V8.73047L8.44336 3.48047H15.9434L21.1934 8.73047V16.2305L15.9434 21.4805H8.44336ZM9.29336 19.4805H15.0934L19.1934 15.3805V9.58047L15.0934 5.48047H9.29336L5.19336 9.58047V15.3805L9.29336 19.4805Z" fill="#808080"/></svg>
                      </span>
                      <span>Report</span>
                    </button>

                    <button class="block_option">
                      <span>
                        <!-- prettier-ignore -->
                        <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11.5888" cy="11.6718" r="8.54676" stroke="#FF5F55" stroke-width="1.89928"/><path d="M17.2871 17.3711L5.89143 5.97541" stroke="#FF5F55" stroke-width="1.89928"/></svg>
                      </span>
                      <span>Block</span>
                    </button>
                  </div>
              </div>
            </div>
      `;
      container.insertAdjacentHTML("beforeend", markup);
    });
  } catch (error) {}
}

// Call the renderUsers function to start the process
renderUsers(followersLists, true);
renderUsers(followingLists);

// Function to render skeleton loading placeholders
function renderUsersSkeleton(container) {
  container.innerHTML = "";

  // Create an array of 30 elements and iterate over it
  Array.from({ length: 30 }, (_, i) => i + 1).forEach((ske) => {
    // Create a skeleton loading div and insert it into the DOM
    const markup = `<div class="user_list_item--skeleton skeleton_loading"></div>`;
    container.insertAdjacentHTML("beforeend", markup);
  });
}

function updateTopBio(user) {
  const selectedUserPhoto = document.getElementById("selectedUserPhoto");
  const selectedUsername = document.getElementById("selectedUsername");
  const selectedUserSizemugUsername = document.getElementById("selectedUserSizemugUsername");

  selectedUserPhoto.src = user.userPhoto;
  selectedUsername.innerText = user.username;
  selectedUserSizemugUsername.innerText = `@${user.sizemugUsername}`;

  userInterestsText.innerHTML = "";

  user.interests.forEach((int) => {
    const markup = `<span>${int.label}</span>`;
    userInterestsText.insertAdjacentHTML("beforeend", markup);
  });
}

userListsContainer.addEventListener("click", (e) => {
  const userListItemOptions = e.target.closest(".user_list_item_options");

  if (userListItemOptions) {
    const options = userListItemOptions.closest("#user_item_tool").querySelector(".user_list_item_option");
    document.querySelectorAll(".user_list_item_option").forEach((option) => option.classList.add(HIDDEN));

    options.classList.remove(HIDDEN);
    return;
  }

  const userListItemAction = e.target.closest(".user_list_item_action");
  if (userListItemAction) {
    const { mode } = userListItemAction.dataset;

    if (mode === "following") {
      userListItemAction.setAttribute("data-mode", "follower");
      userListItemAction.textContent = "Follower";
    } else {
      userListItemAction.setAttribute("data-mode", "following");
      userListItemAction.textContent = "Following";
    }

    return;
  }

  const sendNoteOption = e.target.closest(".send_note_option");
  if (sendNoteOption) {
    return showSendNoteModal();
  }

  const followOption = e.target.closest(".follow_option");
  if (followOption) {
    const spanEl = followOption.querySelector("span:last-child");
    spanEl.textContent = spanEl.textContent === "Unfollow" ? "Follow" : "Unfollow";
    return;
  }

  const reportOption = e.target.closest(".report_option");
  if (reportOption) {
    return showGlobalReportModal();
  }

  const blockOption = e.target.closest(".block_option");
  if (blockOption) {
    return showBlockModal();
  }

  const mutualFriend = e.target.closest(".mutual_friend");
  if (mutualFriend) {
    return showMutualFriendModal();
  }

  const listItem = e.target.closest(".user_list_item");
  const allListItem = userListsContainer.querySelectorAll(".user_list_item");
  if (listItem) {
    const { listId } = listItem.dataset;

    allListItem.forEach((list) => list.setAttribute("aria-selected", false));
    listItem.setAttribute("aria-selected", true);

    const selectedItem = fetchedData.find((data) => data.id === +listId);
    updateTopBio(selectedItem);

    return;
  }
});

const sortFollowListsButton = document.getElementById("sortFollowListsButton");
const sortByResetButton = document.getElementById("sortByResetButton");
const userSortInputs = document.querySelectorAll(".user_sort_input");
const sortByApplyButton = document.getElementById("sortByApplyButton");

// Add click event listener to the sortFollowListsButton
sortFollowListsButton.addEventListener("click", function () {
  // Check if the button is currently expanded
  const isExpanded = this.getAttribute("aria-expanded") === "true";

  // Toggle the aria-expanded attribute based on the current state
  if (isExpanded) {
    this.setAttribute("aria-expanded", false);
  } else {
    this.setAttribute("aria-expanded", true);
  }
});

// Add click event listener to the document
document.addEventListener("click", (e) => {
  // If the click is outside the sort_follow_lists--wrapper or wrapper overlay on (show on mobile), collapse the sortFollowListsButton
  if (!e.target.closest(".sort_follow_lists--wrapper") || e.target.id === "userSortby") {
    sortFollowListsButton.setAttribute("aria-expanded", false);
  }

  if (!e.target.closest(".user_list_item_option") && !e.target.closest(".user_list_item_options")) {
    document.querySelectorAll(".user_list_item_option").forEach((option) => option.classList.add(HIDDEN));
  }
});

// Iterate over each userSortInput element
userSortInputs.forEach((sort) => {
  // Add change event listener to each sort input
  sort.addEventListener("change", (e) => {
    // Uncheck all sort inputs
    userSortInputs.forEach((input) => (input.checked = false));

    // Check the clicked sort input
    e.target.checked = true;
    // Enable the apply button
    sortByApplyButton.removeAttribute("disabled");
    // Enable the reset button
    sortByResetButton.removeAttribute("disabled");
  });
});

// Add click event listener to the reset button
sortByResetButton.addEventListener("click", function () {
  // Uncheck all sort inputs
  userSortInputs.forEach((input) => (input.checked = false));
  // Disable the apply button
  sortByApplyButton.setAttribute("disabled", true);
  // Disable the reset button
  sortByResetButton.setAttribute("disabled", true);
});

// Add click event listener to the apply button
sortByApplyButton.addEventListener("click", () => {
  // Collapse the sortFollowListsButton
  return sortFollowListsButton.setAttribute("aria-expanded", false);
});

const userFollowStats = document.getElementById("userFollowStats");
const mobileUserFollowStats = document.getElementById("mobileUserFollowStats");

[mobileUserFollowStats, userFollowStats].forEach((stat) => {
  stat.addEventListener("click", function (e) {
    const button = e.target.closest("button");
    const allButton = this.querySelectorAll("button");

    if (button) {
      const { buttonType } = button.dataset;
      const container = document.getElementById(`${buttonType}Lists`);

      allButton.forEach((btn) => btn.setAttribute("aria-selected", false));
      button.setAttribute("aria-selected", true);

      userListsContainer.querySelectorAll(".following_followers_lists").forEach((container) => {
        container.classList.add(HIDDEN);
      });
      container.classList.remove(HIDDEN);
    }
  });
});

const mobileHideUserSort = document.querySelector(".mobileHideUserSort");
mobileHideUserSort.addEventListener("click", () => {
  sortFollowListsButton.setAttribute("aria-expanded", false);
});
