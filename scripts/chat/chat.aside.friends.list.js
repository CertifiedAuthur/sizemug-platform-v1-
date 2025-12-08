const friendList = [
  // Recent
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

  // A
  {
    category: "A",
    name: "Ann Kenter",
    username: "@annie",
    profileImage: "ann_kenter.jpg",
  },
  {
    category: "A",
    name: "Amery Calzoni",
    username: "@calzoni",
    profileImage: "amery_calzoni.jpg",
  },

  // B
  {
    category: "B",
    name: "Bothman Ekstrom",
    username: "@mikey",
    profileImage: "bothman_ekstrom.jpg",
  },
  {
    category: "B",
    name: "Bianca Stanton",
    username: "@bianca",
    profileImage: "bianca_stanton.jpg",
  },
  {
    category: "B",
    name: "Billy Vaccaro",
    username: "@billy",
    profileImage: "billy_vaccaro.jpg",
  },
];

// Grouping Function
function groupFriends(friends) {
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

// Grouped Friend List
const groupedFriends = groupFriends(friendList);

const friendCategoryTypes = [
  "Recents",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const friendItemsList = document.getElementById("friendItemsList");

friendItemsList.innerHTML = "";

Object.keys(groupedFriends).forEach((key, i) => {
  const html = `
              <div class="friend_category_container">
                      <h2>${key}</h2>
                      <ul class="friendCategoryItemList" id="friendCategoryItemList--${
                        i + 1
                      }"></ul>
              </div>
              `;
  friendItemsList.insertAdjacentHTML("beforeend", html);

  const friendCategoryList = document.getElementById(
    `friendCategoryItemList--${i + 1}`
  );
  friendCategoryList.innerHTML = "";

  for (const friend of groupedFriends[key]) {
    const { name, username } = friend;

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
                      <button>Remove</button>
                      <button>
                        <!-- prettier-ignore -->
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6914_85937)"><path d="M12 20L9 17H7C6.20435 17 5.44129 16.6839 4.87868 16.1213C4.31607 15.5587 4 14.7956 4 14V8C4 7.20435 4.31607 6.44129 4.87868 5.87868C5.44129 5.31607 6.20435 5 7 5H17C17.7956 5 18.5587 5.31607 19.1213 5.87868C19.6839 6.44129 20 7.20435 20 8V14C20 14.7956 19.6839 15.5587 19.1213 16.1213C18.5587 16.6839 17.7956 17 17 17H15L12 20Z" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 9H16" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13H14" stroke="#75787C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_6914_85937"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>
                      </button>
                    </div>
                  </li>
              `;
    friendCategoryList.insertAdjacentHTML("beforeend", markup);
  }
});

const backToChatFromFriendAside = document.getElementById(
  "backToChatFromFriendAside"
);

backToChatFromFriendAside.addEventListener("click", () => {
  hideAllChatSectionContainers();
  showInboxContainer();
});
