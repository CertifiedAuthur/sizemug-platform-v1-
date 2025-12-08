const suggestionSkeletonContainer = document.querySelector(".suggestion_main_skeleton_container");
const suggestionContainer = document.querySelector(".suggestion_container");
const suggestionSkeletonGridContainer = document.querySelector(".suggestion_skeleton--grid");
const suggestionMainGridContainer = document.getElementById("suggestion_live_body");
const STATIC_HIDDEN = location.pathname === "/collaborations.html" ? "collaboration-hidden" : HIDDEN;

/**
 * Generates an array of user suggestions with random data.
 *
 * @param {number} numSessions - The number of user suggestions to generate.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user suggestion objects.
 * @property {string} name - The full name of the user.
 * @property {string} avatar - The URL of the user's avatar image.
 * @property {string} description - A brief description of the user.
 * @property {Array<string>} interests - A list of user interests.
 */
async function generateSuggestions(numSessions = 20) {
  // Fetch random user data for name, avatar, and description
  const response = await fetch(`https://randomuser.me/api/?results=${numSessions}`);
  const data = await response.json();

  // Sample interests (you can add more interests as needed)
  const userDescriptions = ["A dedicated veterinarian who spends her days caring for animals.", "A passionate developer with a love for open-source projects.", "An avid gamer who streams competitive tournaments online.", "An artist creating beautiful digital art and sharing techniques.", "A music producer sharing live sessions and tutorials online."];

  // Combine fetched data into items array
  const items = Array.from({ length: numSessions }).map((_, index) => {
    const numInterests = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
    const userInterests = sizemugGlobalInterests.sort(() => 0.5 - Math.random()).slice(0, numInterests);

    return {
      name: `${data.results[index].name.first} ${data.results[index].name.last}`,
      avatar: data.results[index].picture.thumbnail,
      description: userDescriptions[index % userDescriptions.length],
      interests: userInterests,
      verified: Math.floor(Math.random() * 10) > 5,
    };
  });

  return items;
}

/**
 * Renders the main suggestion items and inserts them into the suggestion main grid container.
 *
 * @param {Array<Object>} suggestions - An array of suggestion objects.
 * @param {string} suggestions[].avatar - The URL of the user's avatar image.
 * @param {string} suggestions[].description - A brief description of the user.
 * @param {Array<string>} suggestions[].interests - An array of the user's interests.
 * @param {string} suggestions[].name - The name of the user.
 */
let suggestionData = [];

function renderMainSuggestion(suggestions) {
  suggestionData = suggestions;

  suggestions.forEach((suggestion, i) => {
    const { avatar, description, interests, name, verified } = suggestion;
    const shortInterests = interests.slice(0, 3);

    const markup = `
        <div class="suggestion_item" data-suggest="${i}">
          <div>
            <div class="main">
              <div class="suggestion_info animate__animated animate__fadeIn">
                <div class="user-bg-env">
                    <img src="./images/profile-environment/default.png" alt="" />
                </div>

                <div class="suggestion_top_wrapper">
                  <div id="top">
                    <img class="user-profile" src="${avatar}" alt="${name}" />
                    <h1>
                      <span>${name}</span>
                      ${
                        verified
                          ? `<span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"></path><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"></path><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg></span>`
                          : ""
                      }
                    </h1>
                    <p>${description}</p>
                  </div>
            

                  <div class="nested_interests">
                    <h4>Interests</h4>
                    <div>
                      ${shortInterests.map((int) => `<span>${int.label}</span>`).join("")}
                      ${interests.length > 3 ? `<span class="more_int">+${interests.length - 3}</span>` : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div class="suggestion_interests animate__animated animate__fadeIn ${STATIC_HIDDEN}">
                <button class="back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000000" d="m10.8 12l3.9 3.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-4.6-4.6q-.15-.15-.212-.325T8.425 12t.063-.375t.212-.325l4.6-4.6q.275-.275.7-.275t.7.275t.275.7t-.275.7z"/></svg>
                  <span>Interests</span>
                </button>

                <div class="">
                  ${interests.map((int) => `<div>${int.label}</div>`).join("")}
                </div>
              </div>
            </div>

            <div class="footer">
            ${
              location.pathname === "/chat.html"
                ? `
                <button class="follow chat-follow-btn">Follow</button>
                `
                : `
                <button class="follow">Follow</button>
                <a href="/profile.html">Visit profile</a>
                `
            }
            </div>
          </div>
        </div>`;

    suggestionMainGridContainer.insertAdjacentHTML("beforeend", markup);
  });
}

/**
 * Renders a skeleton loading screen for suggestions.
 *
 * This function clears the current content of the `suggestionSkeletonGridContainer`
 * and populates it with 30 skeleton loading items. Each item is represented by a
 * grid structure with placeholder elements styled to indicate loading state.
 *
 * The skeleton loading items include:
 * - A head section
 * - A profile section
 * - A title section
 * - A description section
 *
 * The purpose of this function is to provide a visual indication to users that
 * content is being loaded, enhancing the user experience during data fetching.
 */
function renderSuggestionSkeleton() {
  suggestionSkeletonGridContainer.innerHTML = "";
  const dummyArray = Array.from({ length: 30 }, (_, i) => i + 1);

  dummyArray.forEach((_) => {
    const markup = `
            <div class="live-loading-grid-item">
              <div class="live-loading-grid-item-head skeleton---loading"></div>

              <div class="live-loading-grid-item-content">
                <div class="live-loading-grid-item-content-profile skeleton---loading"></div>

                <div style="width: 100%">
                  <div class="live-loading-grid-item-content-title skeleton---loading"></div>
                  <div class="live-loading-grid-item-content-desc skeleton---loading"></div>
                </div>
              </div>
            </div>
  `;

    suggestionSkeletonGridContainer.insertAdjacentHTML("afterbegin", markup);
  });
}

// Add event listener to the suggestion main grid container
suggestionMainGridContainer.addEventListener("click", (e) => {
  const suggestion = e.target.closest(".suggestion_item");
  const moreInterests = e.target.closest(".more_int");

  // If no suggestion element is found, return early
  if (!suggestion) return;

  const suggestionContainer = suggestion.querySelector(".suggestion_info");
  const interestContainer = suggestion.querySelector(".suggestion_interests");

  // If the "more interests" element is clicked, show the full interests list
  if (moreInterests) {
    suggestionContainer.classList.add(STATIC_HIDDEN);
    interestContainer.classList.remove(STATIC_HIDDEN);
    return;
  }

  const backTo = e.target.closest(".back");
  // If the "back" button is clicked, hide the full interests list and show the suggestion info
  if (backTo) {
    suggestionContainer.classList.remove(STATIC_HIDDEN);
    interestContainer.classList.add(STATIC_HIDDEN);
    return;
  }

  // chat follow clicked :)
  const chatFollowBtn = e.target.closest(".chat-follow-btn");
  if (chatFollowBtn) {
    const footer = chatFollowBtn.closest(".footer");

    const markup = `
     <button class="follow chat-message-btn">Message</button>
     <button class="unfollow chat-unfollow-btn">Unfollow</button>
    `;

    footer.innerHTML = "";
    footer.insertAdjacentHTML("beforeend", markup);
    return;
  }

  // chat unfollow clicked :)
  const chatUnfollowBtn = e.target.closest(".chat-unfollow-btn");
  if (chatUnfollowBtn) {
    const footer = chatUnfollowBtn.closest(".footer");

    const markup = `<button class="follow chat-follow-btn">Follow</button>`;

    footer.innerHTML = "";
    footer.insertAdjacentHTML("beforeend", markup);
    return;
  }

  // chat unfollow clicked :)
  const chatMessageBtn = e.target.closest(".chat-message-btn");
  if (chatMessageBtn) {
    const suggestionItem = chatMessageBtn.closest(".suggestion_item");
    const { suggest } = suggestionItem.dataset;

    const suggestionItemData = suggestionData[+suggest];

    console.log(suggestionItemData);

    // Store this structure in LS

    const data = {
      id: 83932,
      name: suggestionItemData.name,
      profileImage: suggestionItemData.avatar,
      verified: suggestionItemData.verified,
      message: "Hello how have you been?",
      onlineStatus: false,
    };
    localStorage.setItem("sizemug-chat-users", JSON.stringify([data]));

    // {
    //   id: 1,
    //   name: "Liam Johnson",
    //   verified: true,
    //   message: "Hello how have you been?",
    //   type: "text",
    //   time: "9:20 AM",
    //   unreadCount: null,
    //   profileImage:
    //     "https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    //   messageNew: true,
    //   onlineStatus: true,
    //   document: {
    //     name: "Document name",
    //   },
    //   image: null,
    //   messages: [{}],
    //   status: "new",
    // },

    // Hide suggestion Modal
    suggestionModal.classList.add(HIDDEN);

    // Invalidate Aside Chat list
    // renderChatItems([data]);

    // Open the first chat automatically
    const chatSpacerEmpty = document.getElementById("chatSpacerEmpty");
    const chattingAreaContainer = document.getElementById("chattingAreaContainer");
    const chattingContainerPhoto = document.getElementById("chattingContainerPhoto");

    // const { profileImage, name, onlineStatus } = userItem;

    // User Profile Photo
    chattingContainerPhoto.innerHTML = "";
    // if (profileImage) {
    const image = document.createElement("img");
    image.src = suggestionItemData.avatar;
    chattingContainerPhoto.appendChild(image);
    // } else {
    //   chattingContainerPhoto.insertAdjacentHTML("beforeend", defaultProfilePhoto);
    // }

    // User Name
    const chattingUserInfo = document.getElementById("chattingUserInfo");
    chattingUserInfo.textContent = suggestionItemData.name;

    // User Status
    const chattingUserStatus = document.getElementById("chattingUserStatus");
    // const statusOutput = onlineStatus ? "Online" : "Offline";
    chattingUserStatus.className = "Offline";
    chattingUserStatus.textContent = "Offline";

    // Render Messages
    invalidateChattingMessages({ messages: [] });

    chatSpacerEmpty.remove();
    chattingAreaContainer.dataset.id = 83932;
    chattingAreaContainer.classList.remove(HIDDEN);
    chattingAreaContainer.setAttribute("data-type", "chat");

    const chatPrimaryFooterSiblings = document.querySelectorAll(".chat_primary_footer .chat-primary-footer-siblings");
    chatPrimaryFooterSiblings.forEach((sibling) => sibling.classList.add(HIDDEN));

    // This dataset was user to track whether this is user first time on chat and want to send message to someone :)
    sendNewMessage.setAttribute("data-user-type", "new");

    //
    showNoneLiveChatHeader();
    return;
  }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Suggestion Modal Event
const suggestionsExpand = document.getElementById("suggestions_expand");
const chatSuggestions = document.getElementById("chatSuggestions");
const suggestionModal = document.getElementById("suggestion_modal");

//
suggestionsExpand?.addEventListener("click", function (e) {
  const lists = suggestionsExpand.closest(".sidebar_suggestions").querySelector("ul");
  const expanded = JSON.parse(lists.ariaExpanded);

  if (expanded) {
    handleShowSuggestionModal();
  }
});
//
chatSuggestions?.addEventListener("click", handleShowSuggestionModal);

//
function handleShowSuggestionModal() {
  suggestionModal.classList.remove(STATIC_HIDDEN);

  // Show skeleton while loading...
  suggestionSkeletonContainer.classList.remove(STATIC_HIDDEN);

  // update popular skeleton loading
  renderSuggestionSkeleton();

  // Hide main container while loading
  suggestionContainer.classList.add(STATIC_HIDDEN);

  // Start fecthing after I clicked on show suggestion button
  generateSuggestions(30).then((items) => {
    // Hide skeleton while loading...
    suggestionSkeletonContainer.classList.add(STATIC_HIDDEN);
    // Show main container while loading
    suggestionContainer.classList.remove(STATIC_HIDDEN);
    renderMainSuggestion(items); // pass in the real data
  });
}

// Hide suggestion overlay on modal self clicked
suggestionModal.addEventListener("click", function (e) {
  if (e.target.id === "suggestion_modal") {
    return this.classList.add(HIDDEN);
  }
});

/**
 * Populates a dropdown container with suggestion items.
 *
 * @param {HTMLElement} container - The container element where the suggestions will be appended.
 * @param {Array} data - An array of suggestion objects to populate the dropdown.
 * @param {string} data[].value - The value attribute for the suggestion item.
 * @param {string} data[].label - The display label for the suggestion item.
 *
 * @example
 * const container = document.querySelector('#suggestionDropdown');
 * const data = [
 *   { value: '1', label: 'Suggestion 1' },
 *   { value: '2', label: 'Suggestion 2' }
 * ];
 * populateSuggestionDropdown(container, data);
 */
function populateSuggestionDropdown(container, data) {
  data.forEach((d) => {
    const markup = `
     <li role="button" aria-selected="false" data-label="${d.label}" data-value="${d.value}">
        <span>${d.label}</span>
        <span class="checked">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.6654 1L5.4987 10.1667L1.33203 6" stroke="#8837E9" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </span>
      </li>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

function populateGroupSuggestionDropdown(container, data, clear = false) {
  if (clear) {
    container.innerHTML = "";
  }

  data.forEach((d) => {
    const markup = `
      <li>
        <div class="group_photo">
        ${
          d.groupImage
            ? `<img src="${d.groupImage}" alt="${d.groupName}" />`
            : `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.4189 19.482C26.7661 19.6552 27.2868 19.6552 27.8076 19.6552C30.9319 19.6552 33.5356 17.0577 33.5356 13.9408C33.5356 10.824 30.9319 8.22656 27.8076 8.22656C27.6339 8.22656 27.6339 8.22656 27.4604 8.22656C28.5019 9.61185 29.0226 11.3434 29.0226 13.2482C29.0226 15.4993 28.1548 17.7504 26.4189 19.482Z" fill="white"/><path d="M30.0636 21.9062H28.8486C31.1051 23.6377 32.4938 26.4084 32.4938 29.5252C32.4938 30.2179 32.3201 30.9106 32.1466 31.6031C33.8823 31.2569 34.9238 30.9106 35.6181 30.5642C36.3125 30.2179 36.6596 29.3521 36.6596 28.4862C36.8331 24.8499 33.7088 21.9062 30.0636 21.9062Z" fill="white"/><path d="M12.186 19.6525C12.7067 19.6525 13.0539 19.6525 13.5746 19.4793C12.0124 17.7478 10.971 15.6698 10.971 13.0724C10.971 11.1677 11.4917 9.43606 12.5331 8.05078C12.5331 8.05078 12.3596 8.05078 12.186 8.05078C9.06164 8.05078 6.45801 10.6482 6.45801 13.7651C6.45801 16.882 8.88807 19.6525 12.186 19.6525Z" fill="white"/><path d="M10.9703 21.9062H9.92886C6.28379 21.9062 3.33301 24.8499 3.33301 28.4862C3.33301 29.3521 3.68016 30.2179 4.37446 30.5642C5.06876 30.9106 6.11021 31.4299 7.84596 31.6031C7.67239 30.9106 7.49881 30.2179 7.49881 29.5252C7.49881 26.5816 8.71384 23.8109 10.9703 21.9062Z" fill="white"/><path d="M16.004 18.0965C17.0454 18.9624 18.4341 19.4819 19.9963 19.4819C21.5584 19.4819 22.9469 18.9624 23.9884 18.0965C25.5506 16.8844 26.4184 15.1528 26.4184 13.0749C26.4184 11.5165 25.8978 9.95802 24.8563 8.91905C23.6413 7.53377 21.9056 6.66797 19.9963 6.66797C18.0869 6.66797 16.1776 7.53377 15.1361 8.91905C14.0947 9.95802 13.4004 11.5165 13.4004 13.0749C13.4004 15.1528 14.4418 16.8844 16.004 18.0965Z" fill="white"/><path d="M23.4682 22.25C23.1211 22.25 22.7741 22.25 22.4269 22.25H17.2196C16.8724 22.25 16.5253 22.25 16.1781 22.25C12.5331 22.7695 9.75586 25.8863 9.75586 29.5227C9.75586 30.5617 10.2766 31.4275 10.9709 31.7738C12.1859 32.4665 14.616 33.3323 19.6496 33.3323C24.6832 33.3323 27.1134 32.4665 28.3284 31.7738C29.1962 31.2543 29.5434 30.3885 29.5434 29.5227C30.0641 25.8863 27.1134 22.7695 23.4682 22.25Z" fill="white"/></svg>`
        }
        </div>

        <div>
          <div class="group_name">${d.groupName}</div>
          <div class="group_members"><span>${d.members}</span> Members</div>
        </div>

        <button>Join</button>
      </li>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

// Populate the suggestion modal countries dropdown with global countries data
const suggestionModalCountriesList = document.getElementById("suggestionModalCountriesList");
populateSuggestionDropdown(suggestionModalCountriesList, globalCountriesData);

// Populate the suggestion modal cities dropdown with global cities data
const suggestionModalCitiesList = document.getElementById("suggestionModalCitiesList");
populateSuggestionDropdown(suggestionModalCitiesList, globalStatesData);

// Populate the suggestion modal interests dropdown with global interests data
const suggestionModalInterestsList = document.getElementById("suggestionModalInterestsList");
populateSuggestionDropdown(suggestionModalInterestsList, globalInterestsData);

// Populate the suggestion modal profession dropdown with global profession data
const suggestionModalProfessionList = document.getElementById("suggestionModalProfessionList");
populateSuggestionDropdown(suggestionModalProfessionList, globalProfessionalWorks);

// Populate the suggestion modal education dropdown with global education data
const suggestionModalEducationList = document.getElementById("suggestionModalEducationList");
populateSuggestionDropdown(suggestionModalEducationList, globalProfessionalWorks);

// Populate the suggestion modal work dropdown with global work data
const suggestionModalWorkList = document.getElementById("suggestionModalWorkList");
populateSuggestionDropdown(suggestionModalWorkList, globalProfessionalWorks);

// Populate the suggestion modal group dropdown with global group data
const suggestionModalGroupList = document.getElementById("suggestionModalGroupList");
populateGroupSuggestionDropdown(suggestionModalGroupList, globalGroupData);

/**
 * A NodeList of elements with the class "suggestion_modal_dropdown".
 * These elements are intended to be used for handling dropdown interactions
 * within the suggestion modal.
 *
 * @type {NodeListOf<Element>}
 */
const suggestionModalDropdowns = document.querySelectorAll(".suggestion_modal_dropdown");
const suggestionDropdownCityContainer = document.getElementById("suggestionDropdownCityContainer");
const suggestionDropdownCountryContainer = document.getElementById("suggestionDropdownCountryContainer");

let suggestionSelectedData = [];
let suggestionAppliedData = [];

suggestionModalDropdowns.forEach((dropdown) => {
  // Add event listener for click events on each dropdown
  dropdown.addEventListener("click", function (e) {
    // Find the closest element with the class "suggestionDropdownBtn"
    const suggestionDropdownBtn = e.target.closest(".suggestionDropdownBtn");

    // If a dropdown button is clicked, expand the corresponding dropdown
    if (suggestionDropdownBtn) {
      // Collapse all dropdowns
      hideAllSuggestionDropdown();

      // Expand the clicked dropdown
      dropdown.setAttribute("aria-expanded", true);
      return;
    }

    const listItem = e.target.closest("li");
    if (listItem) {
      const suggestionDropdownMain = listItem.closest(".suggestion_dropdown--main");
      const listItems = listItem.closest("ul").querySelectorAll("li");

      const dropdownCategory = suggestionDropdownMain.getAttribute("data-dropdown-category");
      const { label, value } = listItem.dataset;

      // if the category is country
      if (dropdownCategory === "country") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        suggestionDropdownCityContainer.classList.remove(HIDDEN);
        if (window.innerWidth <= 667) {
          suggestionDropdownCountryContainer.classList.add(HIDDEN);
        }

        const filtered = suggestionSelectedData.filter((data) => data.id !== "country");

        filtered.push({
          id: "country",
          label,
          value,
          apply: false,
        });

        suggestionSelectedData = filtered;

        return;
      }

      // if the category is city
      if (dropdownCategory === "cities") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        // selectedCountry = label;
        suggestionDropdownCityContainer.classList.remove(HIDDEN);

        const filtered = suggestionSelectedData.filter((data) => data.id !== "country");
        const country = suggestionSelectedData.filter((data) => data.id === "country");

        filtered.push({
          ...country,
          label: `${country.label}, ${label}`,
          value: `${country.value}, ${value}`,
        });

        suggestionSelectedData = filtered;

        return;
      }

      // Not Country or Cities
      if (dropdownCategory !== "country" || dropdownCategory !== "cities") {
        listItems.forEach((item) => item.setAttribute("aria-selected", false));
        listItem.setAttribute("aria-selected", true);

        const filtered = suggestionSelectedData.filter((data) => data.id !== dropdownCategory);

        filtered.push({
          id: dropdownCategory,
          label,
          value,
          apply: false,
        });

        suggestionSelectedData = filtered;
      }
    }
  });

  // Add event listener to document to handle clicks outside dropdowns
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".suggestion_modal_dropdown")) {
      // Collapse all dropdowns
      hideAllSuggestionDropdown();
    }
  });
});

/**
 * Collapses all suggestion modal dropdowns by setting their
 * aria-expanded attribute to false.
 */
function hideAllSuggestionDropdown() {
  suggestionModalDropdowns.forEach((dropdown) => dropdown.setAttribute("aria-expanded", false));
  suggestionDropdownCityContainer.classList.add(HIDDEN);
}

/**
 * Renders the applied item tags in the dropdown.
 *
 * This function clears the current inner HTML of the `dropdownTags` element
 * and iterates over the `suggestionSelectedData` array to create and insert
 * new HTML markup for each item. Each item is represented as a `div` with
 * the class `dropdown_tag`, containing a `span` for the label and a `span`
 * with an SVG icon for a button.
 *
 * @function renderAppliedItemTags
 * @example
 * // Assuming `suggestionSelectedData` is an array of objects with a `label` property
 * suggestionSelectedData = [{ label: 'Tag1' }, { label: 'Tag2' }];
 * renderAppliedItemTags();
 */
const dropdownTags = document.getElementById("dropdownTags");

function renderAppliedItemTags() {
  dropdownTags.innerHTML = "";

  suggestionAppliedData.forEach((data) => {
    const markup = `
        <div class="dropdown_tag" data-id="${data.id}">
          <span>${data.label}</span>
          <span class="remove_tag" role="button" tabindex="0">
            <!-- prettier-ignore -->
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.4701 1.97157C9.73045 1.71122 9.73045 1.28911 9.4701 1.02876C9.20975 0.768409 8.78764 0.768409 8.52729 1.02876L4.9987 4.55735L1.4701 1.02876C1.20975 0.768409 0.787643 0.768409 0.527293 1.02876C0.266944 1.28911 0.266944 1.71122 0.527293 1.97157L4.05589 5.50016L0.527293 9.02876C0.266944 9.28911 0.266944 9.71122 0.527293 9.97157C0.787643 10.2319 1.20975 10.2319 1.4701 9.97157L4.9987 6.44297L8.52729 9.97157C8.78764 10.2319 9.20975 10.2319 9.4701 9.97157C9.73045 9.71122 9.73045 9.28911 9.4701 9.02876L5.94151 5.50016L9.4701 1.97157Z" fill="#50535C"/></svg>
          </span>
        </div>`;

    dropdownTags.insertAdjacentHTML("afterbegin", markup);
  });
}

dropdownTags.addEventListener("click", (e) => {
  const item = e.target.closest(".remove_tag");
  if (item) {
    const dropdownTag = item.closest(".dropdown_tag");
    const { id } = dropdownTag.dataset;

    suggestionAppliedData = suggestionAppliedData.filter((selected) => selected.id !== id);
    suggestionSelectedData = suggestionSelectedData.filter((selected) => selected.id !== id);

    // Invalidate DOM
    renderAppliedItemTags();
  }
});

/**
 * A NodeList of all button elements within the footer of suggestion options dropdowns.
 *
 * This selection targets all button elements found within elements that have the class
 * "suggestion_options_dropdown_footer". It can be used to apply event listeners or
 * manipulate these buttons collectively.
 *
 * @type {NodeListOf<HTMLButtonElement>}
 */
const allApplyButton = document.querySelectorAll(".suggestion_options_dropdown_footer button");

allApplyButton.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const applyType = e.target.closest(".suggestion_modal_dropdown").getAttribute("data-dropdown");

    const otherSelections = suggestionSelectedData.filter((selected) => selected.id !== applyType);
    const selected = suggestionSelectedData.find((selected) => selected.id === applyType);

    console.log(suggestionAppliedData);
    console.log(suggestionSelectedData);

    suggestionSelectedData = [
      ...otherSelections,
      {
        ...selected,
        apply: true,
      },
    ];

    suggestionAppliedData = [...suggestionAppliedData.filter((applied) => !suggestionSelectedData.some((selected) => selected.id === applied.id && selected.apply)), ...suggestionSelectedData.filter((selected) => selected.apply)];

    renderAppliedItemTags();

    // Collapse all dropdowns
    hideAllSuggestionDropdown();

    // For mobile purpose
    suggestionDropdownCountryContainer.classList.remove(HIDDEN);
    suggestionDropdownCityContainer.classList.add(HIDDEN);
  });
});

const mobileBackToCountriesList = document.getElementById("mobileBackToCountriesList");
mobileBackToCountriesList.addEventListener("click", () => {
  // For mobile purpose
  suggestionDropdownCountryContainer.classList.remove(HIDDEN);
  suggestionDropdownCityContainer.classList.add(HIDDEN);
});

/**
 * A NodeList of elements with the class "hide_suggestion--modal".
 * These elements are intended to be used for hiding suggestion modals.
 *
 * @type {NodeListOf<Element>}
 */
const hideSuggestionModals = document.querySelectorAll(".hide_suggestion--modal");
hideSuggestionModals.forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    suggestionModal.classList.add(HIDDEN);
  });
});

/**
 * A reference to the "Show More Suggestions" button element.
 * This button is used to load and display additional suggestions
 * when clicked by the user.
 *
 * @type {HTMLElement}
 */
const showMoreSuggestionBtn = document.getElementById("suggestion_more--btn");
const downIcon = showMoreSuggestionBtn.querySelector(".down_icon");
const spinnerIcon = showMoreSuggestionBtn.querySelector("svg");

showMoreSuggestionBtn.addEventListener("click", async (e) => {
  downIcon.classList.add(HIDDEN);
  spinnerIcon.classList.remove(HIDDEN);
  const moreSuggestions = await generateSuggestions(30);

  setTimeout(() => {
    if (moreSuggestions) {
      renderMainSuggestion(moreSuggestions);
      downIcon.classList.remove(HIDDEN);
      spinnerIcon.classList.add(HIDDEN);
    }
  }, 2000);
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
 */
const groupSelectedWrapperUL = document.getElementById("groupSelectedWrapperUL");

function renderSuggestionModalGroupTab() {
  sizemugGlobalInterests.forEach((int) => {
    const markup = `<li role="button" data-value="${int.value}">${int.label}</li>`;
    groupSelectedWrapperUL.insertAdjacentHTML("beforeend", markup);
  });
}
renderSuggestionModalGroupTab();

groupSelectedWrapperUL.addEventListener("click", (e) => {
  const listItem = e.target.closest("li");

  if (listItem) {
    const { value } = listItem.dataset;

    listItem.setAttribute("aria-selected", true);

    if (value === "all") {
      return populateGroupSuggestionDropdown(suggestionModalGroupList, globalGroupData, true);
    }

    const data = globalGroupData.filter((group) => group.interest === value);
    populateGroupSuggestionDropdown(suggestionModalGroupList, data, true);
  }
});
