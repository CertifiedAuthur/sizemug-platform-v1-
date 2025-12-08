const categories = ["event", "birthday", "task", "holiday"];

async function getAsideSuggestions(count = 15) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();

  return data.results.map((user) => ({
    name: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.medium,
    follow: Math.floor(Math.random() * 10) > 5,
    category: categories[Math.floor(Math.random() * 4)],
  }));
}

const activeCalenderUserEl = document.getElementById("activeCalenderUser");
let activeCalenderUsersData;

function renderSkeletonActiveUserOnCalender() {
  Array.from({ length: 20 }, (_, i) => i + 1).map(() => {
    const markup = ` <div class="active_item_skeleton skeleton_loading"></div>`;
    activeCalenderUserEl.insertAdjacentHTML("beforeend", markup);
  });
}

async function renderActiveUserOnCalender() {
  renderSkeletonActiveUserOnCalender();

  const users = (await getAsideSuggestions(15)) ?? [];
  activeCalenderUsersData = users;

  activeCalenderUserEl.innerHTML = "";
  users.forEach((user, i) => {
    const { name, avatar } = user;

    const markup = `
        <div class="active_item" data-user-index="${i}" role="button" tabindex="0">
           <div>
              <img src="${avatar}" alt="${name}" />
           </div>

           <h4>${name}</h4>

           <img src="./images/calender/verify-badge.svg" />
        </div>
    `;

    activeCalenderUserEl.insertAdjacentHTML("beforeend", markup);
  });
}

renderActiveUserOnCalender();

const activeUserInfoModal = document.getElementById("activeUserInfoModal");

activeCalenderUserEl.addEventListener("click", (e) => {
  const activeItem = e.target.closest(".active_item");

  if (activeItem) {
    const { userIndex } = activeItem.dataset;

    const userItem = activeCalenderUsersData[+userIndex];

    // Fetch Active Invited :)
    renderModalInterest();
    // Show Modal
    activeUserInfoModal.classList.remove(HIDDEN);
    // Update profile photo
    document.getElementById("activeUserPhoto").src = userItem.avatar;
    // Update profile name
    document.getElementById("activeUserName").textContent = userItem.name;

    let content;
    let dotColor;
    const firstName = userItem.name.split(" ")[0];

    if (userItem.category === "birthday") {
      content = `${firstName}’s Birthday`;
      dotColor = "birthday";
    } else if (userItem.category === "event") {
      content = `${firstName}’s Event`;
      dotColor = "event";
    } else if (userItem.category === "task") {
      content = `${firstName}’s Task`;
      dotColor = "task";
    } else {
      content = `${firstName}’s Holiday`;
      dotColor = "holiday";
    }

    document.getElementById("activeModalDot").className = `${dotColor}-dot`;
    document.getElementById("activeModalCategoryType").textContent = content;
  }
});

activeUserInfoModal.addEventListener("click", (e) => {
  if (e.target.id === "activeUserInfoModal") {
    return activeUserInfoModal.classList.add(HIDDEN);
  }
});

const modalInvitedContainer = document.getElementById("modalInvitedContainer");

async function renderModalInterest() {
  const users = (await getAsideSuggestions(14)) ?? [];

  modalInvitedContainer.innerHTML = "";
  users.forEach((user, i) => {
    const { name, avatar } = user;

    const markup = `
            <li>
              <img src="${avatar}" alt="${name}" />
              <h4>${name}</h4>
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6" /></svg>
              </button>
            </li>
    `;

    modalInvitedContainer.insertAdjacentHTML("beforeend", markup);
  });
}

modalInvitedContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button) {
    button.closest("li").remove();
  }
});

const backFromInvitedViewModal = document.getElementById("backFromInvitedViewModal");
const showInvitedViewModal = document.getElementById("showInvitedViewModal");
const activeInvitedContainerSlide = document.getElementById("activeInvitedContainerSlide");
const containerReadAll = document.getElementById("containerReadAll");
const closeActiveModal = document.getElementById("close-active-modal");

showInvitedViewModal.addEventListener("click", () => {
  activeInvitedContainerSlide.classList.remove(HIDDEN);
});

backFromInvitedViewModal.addEventListener("click", () => {
  activeInvitedContainerSlide.classList.add(HIDDEN);
});

closeActiveModal.addEventListener("click", () => {
  activeUserInfoModal.classList.add(HIDDEN);
});

const read_little_container = document.getElementById("read_little_container");
const read_all_content_container = document.getElementById("read_all_content_container");

containerReadAll.addEventListener("click", function () {
  read_little_container.classList.add(HIDDEN);
  read_all_content_container.classList.remove(HIDDEN);
  this.classList.add(HIDDEN);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".det-description-content") && read_little_container.classList.contains(HIDDEN)) {
    read_little_container.classList.remove(HIDDEN);
    read_all_content_container.classList.add(HIDDEN);
    containerReadAll.classList.remove(HIDDEN);
  }
});

const seeMoreCalenderFromUser = document.getElementById("seeMoreCalenderFromUser");
const moreFromUserContainerSlide = document.getElementById("moreFromUserContainerSlide");
const backFromMoreUsersModal = document.getElementById("backFromMoreUsersModal");

seeMoreCalenderFromUser.addEventListener("click", () => {
  moreFromUserContainerSlide.classList.remove(HIDDEN);
});

backFromMoreUsersModal.addEventListener("click", () => {
  moreFromUserContainerSlide.classList.add(HIDDEN);
});

// Highlight Overlay Modal More list
const highlitedButtons = document.querySelectorAll(".bookmarked_list button.location");
highlitedButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const listItem = button.closest("li");

    if (listItem?.classList.contains("highlighted")) {
      listItem.classList.remove("highlighted");
    } else {
      listItem.classList.add("highlighted");
    }
  });
});
