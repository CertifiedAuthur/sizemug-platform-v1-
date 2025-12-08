const storiesUsers = [
  {
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "john_doe",
    name: "John Doe",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    username: "jane_smith",
    name: "Jane Smith",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    username: "alex_johnson",
    name: "Alex Johnson",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    username: "emily_white",
    name: "Emily White",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    username: "michael_brown",
    name: "Michael Brown",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    username: "sophia_miller",
    name: "Sophia Miller",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    username: "david_wilson",
    name: "David Wilson",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    username: "olivia_taylor",
    name: "Olivia Taylor",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    username: "chris_martin",
    name: "Chris Martin",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/10.jpg",
    username: "lily_clark",
    name: "Lily Clark",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    username: "robert_lee",
    name: "Robert Lee",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    username: "mia_walker",
    name: "Mia Walker",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/13.jpg",
    username: "jack_hall",
    name: "Jack Hall",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/14.jpg",
    username: "ava_young",
    name: "Ava Young",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/15.jpg",
    username: "daniel_harris",
    name: "Daniel Harris",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/16.jpg",
    username: "isabella_wright",
    name: "Isabella Wright",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/17.jpg",
    username: "ryan_lopez",
    name: "Ryan Lopez",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    username: "amelia_hill",
    name: "Amelia Hill",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/men/19.jpg",
    username: "ethan_scott",
    name: "Ethan Scott",
    selected: false,
  },
  {
    image: "https://randomuser.me/api/portraits/women/20.jpg",
    username: "charlotte_green",
    name: "Charlotte Green",
    selected: false,
  },
];

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// Story List
const hideWhoCanViewStoryLists = document.getElementById("hideWhoCanViewStoryLists");

function renderUsersForUserStoriesViewSettings(users) {
  hideWhoCanViewStoryLists.innerHTML = "";

  users.forEach((user) => {
    const { image, username, name, selected } = user;

    const markup = `
        <div role="button" class="user-item" tabindex="0">
          <div>
            <img src="${image}" alt="${name}" />
          </div>
          <div>
            <h2>${name}</h2>
            <a href="/profile.html">@${username}</a>
          </div>
          <button class="checkbox" aria-selected="${selected ?? false}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
          </button>
        </div>
  `;

    hideWhoCanViewStoryLists.insertAdjacentHTML("beforeend", markup);
  });
}
renderUsersForUserStoriesViewSettings(storiesUsers);

hideWhoCanViewStoryLists.addEventListener("click", (e) => {
  const userItem = e.target.closest(".user-item");

  if (userItem) {
    const button = userItem.querySelector("button");

    const isSelected = button.getAttribute("aira-selected") === "true";

    if (isSelected) {
      button.setAttribute("aria-selected", false);
    } else {
      button.setAttribute("aria-selected", true);
    }
    return;
  }
});

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
// Block List
const blockAsideLists = document.getElementById("blockAsideLists");

function renderAsideUserBlockList(users) {
  blockAsideLists.innerHTML = "";

  users.forEach((user) => {
    const { image, username, name } = user;

    const markup = `
      <div role="button" class="user-item" tabindex="0">
        <div>
          <img src="${image}" alt="${name}" />
        </div>
        <div>
          <h2>${name}</h2>
          <a href="/profile.html">@${username}</a>
        </div>
        <button class="block" aria-selected="false">Unblock</button>
      </div>
        `;

    blockAsideLists.insertAdjacentHTML("beforeend", markup);
  });
}

renderAsideUserBlockList(storiesUsers);
