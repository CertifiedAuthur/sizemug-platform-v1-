const inviteBtn = document.getElementById("collaboration_invite");
const inviteModal = document.getElementById("invite_modal");
const findCollaboration = document.getElementById("find_collaboration");

// event outside
document.addEventListener("click", function (e) {
  // Entire Invite Modal
  if (!e.target.closest("#collaboration_invite_holder") && !e.target.closest("#find_collaboration") && !inviteModal.classList.contains(COLLABORATIONHIDDEN)) {
    hideInviteModal(); // hide invite modal
    hideAllDropdown(); // hide all dropdown in invite modal
    moveStep1(); // start from the beginning, when opened again
    return;
  }

  // Dropdown option
  if (!e.target.closest("#dropdown_option--invite") && !e.target.closest("#direct_select")) {
    hideAllDropdown(); // hide all dropdown in invite modal
  }
});

[inviteBtn, findCollaboration].forEach((btn) =>
  btn.addEventListener("click", function () {
    inviteModal.classList.remove(COLLABORATIONHIDDEN); // show invite modal
  })
);

// Choose step 1
const inviteStep1 = document.getElementById("invite_modal--step-1");
const allDropdown = inviteStep1.querySelectorAll(".dropdown_option");

inviteStep1.addEventListener("click", (e) => {
  const dropdownOptionBtn = e.target.closest('[role="button"]');
  const option = dropdownOptionBtn?.closest(".option");
  const optionItems = dropdownOptionBtn?.closest("ul")?.querySelectorAll("li");
  const spanEl = option?.querySelector("#direct_select>span:first-child");

  // Select an option
  const optionLi = e.target.closest("li");
  if (optionLi) {
    const { value } = optionLi.dataset;

    // allDropdown.forEach((drop) => drop.classList.add(COLLABORATIONHIDDEN));
    optionItems.forEach((item) => item.classList.remove("active"));
    optionLi.classList.add("active");

    const transformString = value.slice(1).split("-").join(" ");
    spanEl.textContent = `${value[0].toUpperCase()}${transformString}`;

    hideAllDropdown(); // hide all dropdown in invite modal
    return;
  }

  if (dropdownOptionBtn) {
    const dropdownOption = option.querySelector(".dropdown_option");
    inviteModal.style.overflow = "initial";

    if (!customContains(dropdownOption)) {
      dropdownOption.classList.add(COLLABORATIONHIDDEN);
    } else {
      hideAllDropdown(); // hide all dropdown in invite modal
      dropdownOption.classList.remove(COLLABORATIONHIDDEN);
    }
  }
});

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
// Navigate Invite Steps
const collabInviteActions = document.getElementById("invite_action--btn");
const inviteStep2 = document.getElementById("invite_modal--step-2");
const cancelEl = collabInviteActions.querySelector("#invite_backward");
const nextEl = collabInviteActions.querySelector("#invite_forward");

collabInviteActions.addEventListener("click", (e) => {
  const target = e.target;

  // Cancel Button
  const cancelBtn = target.closest("#invite_backward");
  if (cancelBtn) {
    const { mode } = cancelBtn.dataset;

    if (mode === "hide") {
      hideInviteModal(); // hide invite modal
    } else {
      moveStep1();
    }

    return;
  }

  // Next Button
  const nextBtn = target.closest("#invite_forward");
  if (nextBtn) {
    const { mode } = nextBtn.dataset;

    if (mode === "follow") {
      moveStep2();
    } else {
      hideInviteModal(); // hide invite modal
    }
  }
});

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
///////////////////////////////////
// Follower & Following Switch
const step2Header = inviteStep2.querySelector("header");
const inviteFollowersContainer = inviteStep2.querySelector("#follower_items");
const inviteFollowingContainer = inviteStep2.querySelector("#following_items");
const step2HeaderButtons = inviteStep2.querySelectorAll("header button");
const followingListContainer = inviteFollowingContainer.querySelector("ul");
const followersListContainer = inviteFollowersContainer.querySelector("ul");

// Header Events
step2Header.addEventListener("click", async (e) => {
  const target = e.target;

  // Followings
  const followings = customContains(target, "followings");
  if (followings) {
    step2HeaderButtons.forEach((b) => b.classList.remove("active"));
    handleFollowHeader(target, inviteFollowingContainer, inviteFollowersContainer);

    return;
  }

  // Followers
  const followers = customContains(target, "followers");
  if (followers) {
    step2HeaderButtons.forEach((b) => b.classList.remove("active"));
    handleFollowHeader(target, inviteFollowersContainer, inviteFollowingContainer);

    return;
  }

  // Search
  const search = target.closest(".search");
  if (search) {
    console.log("Search");
  }
});

function followerListMark(container) {
  getUsers().then((lists) => {
    container.innerHTML = "";

    lists.forEach((list) => {
      const markup = `
        <li class="item" role="button">
          <div>
            <img src="${list.photo}" alt="${list.name}" />
            <h3>${list.name}</h3>
          </div>

          <button>
            <img src="/icons/select.svg" alt="" />
          </button>
        </li>
    `;

      container.insertAdjacentHTML("beforeend", markup);
    });
  });
}

setTimeout(() => {
  // Update Following & Followers Modal lists
  followerListMark(followingListContainer);
  followerListMark(followersListContainer);
}, 3000);

function handleFollowHeader(target, addEl, removeEl) {
  target.classList.add("active");
  addEl.classList.add(COLLABORATIONHIDDEN);
  removeEl.classList.remove(COLLABORATIONHIDDEN);
}

// Get Followers & Followings
async function getUsers(numUsers = 20) {
  const response = await fetch(`https://randomuser.me/api/?results=${numUsers}`);
  const data = await response.json();

  if (response.ok) {
    const users = data.results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.medium,
    }));

    return users;
  }
}

// Lists Item Event
[inviteFollowersContainer, inviteFollowingContainer].forEach((container) => {
  container.addEventListener("click", function (e) {
    const target = e.target;
    const li = target.closest(".item");

    if (li) {
      // All
      if (customContains(li, "select_all")) {
        const allItem = container.querySelectorAll(".item");
        if (!customContains(li, "active")) {
          allItem.forEach((item) => item.classList.add("active"));
        } else {
          allItem.forEach((item) => item.classList.remove("active"));
        }

        return;
      }

      // Single item
      if (li.classList.contains("active")) {
        const closestAllItem = container.querySelector(".select_all");

        li.classList.remove("active");
        closestAllItem.classList.remove("active");
      } else {
        li.classList.add("active");
      }
    }
  });
});

//
function customContains(element, className) {
  return element.classList.contains(className ?? COLLABORATIONHIDDEN);
}

function hideAllDropdown() {
  allDropdown.forEach((drop) => drop.classList.add(COLLABORATIONHIDDEN));
}

// Move to step 1
function moveStep1() {
  cancelEl.textContent = "Cancel"; // update the textContent
  cancelEl.setAttribute("data-mode", "hide"); // update dataset

  nextEl.textContent = "Next"; // update the textContent
  nextEl.setAttribute("data-mode", "follow"); // update dataset

  inviteStep1.classList.remove(COLLABORATIONHIDDEN);
  inviteStep2.classList.add(COLLABORATIONHIDDEN);
}

// Move to step 2
function moveStep2() {
  cancelEl.textContent = "Back"; // update the textContent
  cancelEl.setAttribute("data-mode", "back"); // update dataset

  nextEl.textContent = "Invite"; // update the textContent
  nextEl.setAttribute("data-mode", "invite"); // update dataset

  inviteStep1.classList.add(COLLABORATIONHIDDEN);
  inviteStep2.classList.remove(COLLABORATIONHIDDEN);
}

// Hide the Invite Modal
function hideInviteModal() {
  moveStep1(); // start from the beginning, when opened again
  inviteModal.classList.add(COLLABORATIONHIDDEN);
}

const inviteSubjectContainer = document.getElementById("invite_subject--list");

// Render Subject List
function renderSubjectList() {
  inviteSubjectContainer.innerHTML = "";

  subjectsData.forEach((subject) => {
    const markup = `
        <li role="button" data-label="${subject.label}" data-value="${subject.value}">
          <span>${subject.label}</span>
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#8837E9" d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41z" /></svg>
          </span>
        </li>
    `;

    inviteSubjectContainer.insertAdjacentHTML("beforeend", markup);
  });
}
renderSubjectList();
