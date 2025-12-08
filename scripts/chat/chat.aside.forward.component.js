const forwardFooterButton = document.getElementById("forwardFooterButton");

document.addEventListener("DOMContentLoaded", () => {
  const forwardingToSelected = document.getElementById("forwardingToSelected");

  // Chats
  const chatsList = [
    // Recent
    {
      id: 1,
      category: "Recents",
      name: "Mike Adams",
      username: "@mikey",
      profileImage: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 2,
      category: "Recents",
      name: "Barus Geidt",
      username: "@barus",
      profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 3,
      category: "Recents",
      name: "Chris Travis",
      username: "@chris",
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 4,
      category: "Recents",
      name: "Davis Mike",
      username: "@davis",
      profileImage: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // A
    {
      id: 5,
      category: "A",
      name: "Ann Kenter",
      username: "@annie",
      profileImage: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 6,
      category: "A",
      name: "Amery Calzoni",
      username: "@calzoni",
      profileImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // B
    {
      id: 7,
      category: "B",
      name: "Bothman Ekstrom",
      username: "@mikey",
      profileImage: "https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 8,
      category: "B",
      name: "Bianca Stanton",
      username: "@bianca",
      profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 9,
      category: "B",
      name: "Billy Vaccaro",
      username: "@billy",
      profileImage: "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
  ];

  // Groups
  const groupList = [
    // Recent
    {
      id: 10,
      category: "Recents",
      name: "Frontend Developers",
      username: "@frontend_dev",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 11,
      category: "Recents",
      name: "Nature Photography",
      username: "@nature_photography",
      profileImage: "https://plus.unsplash.com/premium_photo-1675129522693-bd62ffe5e015?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // A
    {
      id: 12,
      category: "A",
      name: "Art Enthusiasts",
      username: "@art",
      profileImage: "https://images.unsplash.com/photo-1522196772883-393d879eb14d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // B
    {
      id: 13,
      category: "B",
      name: "Book Lovers",
      username: "@books",
      profileImage: "https://images.unsplash.com/photo-1455274111113-575d080ce8cd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 14,
      category: "B",
      name: "Bike Riders",
      username: "@bikers",
      profileImage: "https://plus.unsplash.com/premium_photo-1710911198710-3097c518f0e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
  ];

  // Following
  const followingList = [
    // Recent
    {
      id: 15,
      category: "Recents",
      name: "Liam Scott",
      username: "@liams",
      profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 16,
      category: "Recents",
      name: "Ella Johnson",
      username: "@ellaj",
      profileImage: "https://plus.unsplash.com/premium_photo-1664870883044-0d82e3d63d99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 17,
      category: "Recents",
      name: "Noah Williams",
      username: "@noahw",
      profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // A
    {
      id: 18,
      category: "A",
      name: "Aaron Blake",
      username: "@aaronb",
      profileImage: "aaron_blake.jpg",
    },
    {
      id: 19,
      category: "A",
      name: "Ashley Roberts",
      username: "@ashleyr",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // B
    {
      id: 20,
      category: "B",
      name: "Brian Cooper",
      username: "@brianc",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 21,
      category: "B",
      name: "Brianna Lee",
      username: "@briannal",
      profileImage: "https://images.unsplash.com/photo-1532074205216-d0e1f4b87368?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
  ];

  // Followers
  const followersList = [
    // Recent
    {
      id: 22,
      category: "Recents",
      name: "Emma Watson",
      username: "@emmaw",
      profileImage: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 23,
      category: "Recents",
      name: "Oliver Jones",
      username: "@oliverj",
      profileImage: "https://plus.unsplash.com/premium_photo-1673866484792-c5a36a6c025e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 24,
      category: "Recents",
      name: "Mason Clark",
      username: "@masonc",
      profileImage: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
    },

    // A
    {
      id: 25,
      category: "A",
      name: "Amelia Brown",
      username: "@ameliab",
      profileImage: "https://images.unsplash.com/photo-1466112928291-0903b80a9466?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 26,
      category: "A",
      name: "Aiden Hall",
      username: "@aidenh",
      profileImage: "https://plus.unsplash.com/premium_photo-1667667720425-6972aff75f6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },

    // B
    {
      id: 27,
      category: "B",
      name: "Blake Green",
      username: "@blakeg",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: 28,
      category: "B",
      name: "Brooklyn Adams",
      username: "@brooklyna",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    },
  ];

  // Grouping Function
  function groupArrayOfObjects(friends) {
    const grouped = {};

    // Group by category
    friends.forEach((friend) => {
      if (!grouped[friend.category]) {
        grouped[friend.category] = [];
      }
      grouped[friend.category].push(friend);
    });

    // Sort categories alphabetically (except "Recents" comes first)
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      if (a === "Recents") return -1; // Ensure "Recents" comes first
      if (b === "Recents") return 1;
      return a.localeCompare(b); // Sort alphabetically for others
    });

    // Create a sorted grouped object
    const sortedGrouped = {};
    sortedCategories.forEach((category) => {
      sortedGrouped[category] = grouped[category];
    });

    return sortedGrouped;
  }

  // Grouped List
  const groupedChatsList = groupArrayOfObjects(chatsList);
  const groupedGroupsList = groupArrayOfObjects(groupList);
  const groupedFollowingList = groupArrayOfObjects(followingList);
  const groupedFollowersList = groupArrayOfObjects(followersList);

  function renderForwardItems(data, type) {
    const forwardItemsContainer = document.getElementById(`${type}ForwardItemsList`);

    Object.keys(data).forEach((key, i) => {
      const html = `
                      <div class="friend_category_container">
                          <h2>${key}</h2>
                          <ul class="friendCategoryItemList" id="${type}CategoryItemList--${i + 1}"></ul>
                      </div>
                      `;
      forwardItemsContainer.insertAdjacentHTML("beforeend", html);

      const container = document.getElementById(`${type}CategoryItemList--${i + 1}`);
      container.innerHTML = "";

      for (const item of data[key]) {
        const { name, username, id, profileImage } = item;

        const markup = `
                        <li class="friend_category_item" data-type="${type}" data-user-id="${id}">
                            <div class="photo">
                              <img src="${profileImage}" alt="${name}" />
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
  
                            <div class="forward_select_btn_wrapper">
                              <button aria-selected="false" class="forward_select_btn">Select</button>
                            </div>
                          </li>
        `;
        container.insertAdjacentHTML("beforeend", markup);
      }
    });
  }

  renderForwardItems(groupedChatsList, "chats");
  renderForwardItems(groupedGroupsList, "groups");
  renderForwardItems(groupedFollowingList, "following");
  renderForwardItems(groupedFollowersList, "follower");

  //
  function renderForwardSelected() {
    forwardingToSelected.innerHTML = "";

    forwardSelectedUsers.forEach((user, i) => {
      const markup = `
              <div data-selected-index="${i}">
                <img src="${user.profileImage}" alt="${user.name}" />
                <button id="remove">
                  <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_7285_147465)"><rect x="2" y="2" width="16" height="16" rx="8" fill="white"/><path d="M9.99857 2C5.58105 2 2 5.58219 2 10.0003C2 14.4178 5.58105 18 9.99857 18C14.4184 18 18 14.4172 18 10.0003C18 5.58219 14.4184 2 9.99857 2ZM13.4383 12.1664L12.1641 13.4389C12.1641 13.4389 10.1485 11.2762 9.998 11.2762C9.84981 11.2762 7.83358 13.4389 7.83358 13.4389L6.55884 12.1664C6.55884 12.1664 8.72383 10.1799 8.72383 10.0031C8.72383 9.82349 6.55884 7.83644 6.55884 7.83644L7.83358 6.56113C7.83358 6.56113 9.8664 8.72498 9.998 8.72498C10.1307 8.72498 12.1641 6.56113 12.1641 6.56113L13.4383 7.83644C13.4383 7.83644 11.2727 9.8521 11.2727 10.0031C11.2727 10.1468 13.4383 12.1664 13.4383 12.1664Z" fill="#FF3B30"/></g><rect x="1" y="1" width="18" height="18" rx="9" stroke="white" stroke-width="2"/><defs><clipPath id="clip0_7285_147465"><rect x="2" y="2" width="16" height="16" rx="8" fill="white"/></clipPath></defs></svg>
                </button>
              </div>
      `;
      forwardingToSelected.insertAdjacentHTML("beforeend", markup);
    });

    // Update Forward Event Button
    if (forwardSelectedUsers.length > 0) {
      forwardFooterButton.removeAttribute("disabled");
    } else {
      forwardFooterButton.setAttribute("disabled", true);
    }
  }

  forwardingToSelected.addEventListener("click", (e) => {
    const removeUserButton = e.target.closest("#remove");

    if (removeUserButton) {
      const { selectedIndex } = removeUserButton.closest("div").dataset;

      // Implementing DOM Manipulation
      const dataInfo = forwardSelectedUsers.slice(+selectedIndex, +selectedIndex + 1)[0];
      const listItem = document.querySelector(`.friendCategoryItemList li[data-user-id="${dataInfo.id}"]`);
      const button = listItem.querySelector(".forward_select_btn");
      button.setAttribute("aria-selected", false);
      button.textContent = "select";

      forwardSelectedUsers.splice(+selectedIndex, 1);

      renderForwardSelected();
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
   *
   */
  const forwardMessageOptionsTab = document.getElementById("forwardMessageOptionsTab");

  forwardMessageOptionsTab.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    const allButtons = forwardMessageOptionsTab.querySelectorAll("button");
    const allContainers = document.querySelectorAll("#forwardItemsListWrapper>div:not(.forward_items_list_footer)");

    if (button) {
      const dataset = button.dataset.option || "chats";
      const forwardItemsContainer = document.getElementById(`${dataset}ForwardItemsList`);

      allButtons.forEach((btn) => btn.setAttribute("aria-selected", false));
      allContainers.forEach((container) => container.classList.add(HIDDEN));

      button.setAttribute("aria-selected", true);
      forwardItemsContainer.classList.remove(HIDDEN);
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
   *
   */
  const forwardItemsListWrapper = document.getElementById("forwardItemsListWrapper");

  forwardItemsListWrapper.addEventListener("click", (e) => {
    const selectBtn = e.target.closest(".forward_select_btn");

    if (selectBtn) {
      const { type, userId } = selectBtn.closest("li").dataset;
      const isSelected = selectBtn.getAttribute("aria-selected") === "true";

      if (!type) return console.log("Type was not specified :)");

      if (type) {
        let selected;

        if (type === "chats") {
          selected = chatsList.find((list) => list.id === +userId);
        } else if (type === "groups") {
          selected = groupList.find((list) => list.id === +userId);
        } else if (type === "following") {
          selected = followingList.find((list) => list.id === +userId);
        } else if (type === "follower") {
          selected = followersList.find((list) => list.id === +userId);
        }

        if (isSelected) {
          selectBtn.setAttribute("aria-selected", false);
          selectBtn.textContent = "Select";
          forwardSelectedUsers = forwardSelectedUsers.filter((list) => list.id !== selected.id);
        } else {
          selectBtn.setAttribute("aria-selected", true);
          selectBtn.textContent = "Remove";
          forwardSelectedUsers.push(selected);
        }

        renderForwardSelected();
      }
    }
  });

  forwardFooterButton.addEventListener("click", () => {
    let previewData = [];

    // Filter out message with media
    const mediasInTheMessage = forwardingData.filter((data) => data.type === "photo");

    hideAllFooterElements();
    chatPrimaryFooter.classList.remove(HIDDEN);

    // if user has selected user(s) to forward the chat message to ?
    if (forwardSelectedUsers.length) {
      forwardSelectedUsers.forEach((user, i) => {
        const markup = `
          <div class="send_to_item" data-index="${i}">
            <span>${user.name.split(" ")[0]}</span>
            <span role="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#ffffff" d="M7.404 7.404a.5.5 0 0 1 .707 0L12 11.293l3.89-3.89a.5.5 0 1 1 .706.708L12.707 12l3.89 3.89a.5.5 0 1 1-.708.706L12 12.707l-3.89 3.89a.5.5 0 1 1-.706-.708L11.293 12l-3.89-3.89a.5.5 0 0 1 0-.706" /></svg>
            </span>
          </div>
        `;
        SendToItemsContainer.insertAdjacentHTML("beforeend", markup);
      });
    }

    // if media was selected :)
    if (mediasInTheMessage.length) {
      mediasInTheMessage.forEach((media) => {
        previewData = [...previewData, ...media.photos];
      });

      const output = previewData.map((pre) => {
        return {
          type: "image",
          media: pre,
        };
      });

      updateTheEntirePreviewLogic(output);
    }

    forwardingToSelected.innerHTML = ""; // clear content
    forwardSelectedUsers = []; // empty the array
    forwardFooterButton.setAttribute("disabled", true); // disable the forward button
    document.querySelectorAll(".forward_select_btn").forEach((btn) => {
      btn.setAttribute("aria-selected", false);
      btn.textContent = "Select";
    });
    handleSelectChatItem("hide");
    showInboxContainer(); // show chat aside component

    document.getElementById("sendDocumentImageVideo").classList.add(HIDDEN);
  });

  // Forward users `Send to users` click event
  const SendToItemsContainer = document.getElementById("SendToItemsContainer");

  SendToItemsContainer.addEventListener("click", (e) => {
    const button = e.target.closest('[role="button"]');

    if (button) {
      const sendToItem = button.closest(".send_to_item");
      const { index } = sendToItem.dataset;

      sendToItem.remove();
      forwardSelectedUsers.splice(+index, 1);
    }
  });
});
