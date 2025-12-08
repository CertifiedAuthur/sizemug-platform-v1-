////////////////////////////////////////////////////////////////
const matchingModalOverlay = document.getElementById("matching_modal");
const matchingLists = document.querySelector("ul.matching_lists");

function renderMatchingList(users) {
  matchingLists.innerHTML = "";

  users.forEach((user, i) => {
    const { name, photo, online, newUser, interests } = user;

    const html = `
      <div id="matching_list_wrapper" data-matching-item="${user.id}">
        <li class="matching_list" role="button">
            ${newUser ? '<span id="matching_list--dot"></span>' : ""}
          <div class="matching_list_image--wrapper">
           <a href="/profile.html"><img src="${photo}" alt="${name}" /></a>
            ${online ? '<div class="online"></div>' : ""}
          </div>

          <div class="content">
            <div>
              <h2>
                <a href="/profile.html">${name}</a>
              </h2>
              &bull;
              <a href="#">Follow</a>
            </div>

            <div>${interests.map((int) => `<span>${int.label}</span>`).join("")}</div>
          </div>
        </li>
      </div>
    `;

    matchingLists.insertAdjacentHTML("beforeend", html);
  });
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Sliding Buttons
const matchButtons = document.querySelector(".matching_buttons_holder");
const sliderEl = document.querySelector(".matching_slider_holder--slider");

matchButtons.addEventListener("click", (e) => {
  const target = e.target.tagName.toLowerCase();

  if (target === "button") {
    const { position } = e.target.dataset;
    const translateXValue = +position * 100; // 0%, 100%, 200%
    sliderEl.style.transform = `translateX(${translateXValue}%)`;

    if (position === "0") {
      renderMatchingList(usersData);
      return;
    }

    if (position === "1") {
      const followers = usersData.filter((user) => user.followers);
      renderMatchingList(followers);
      return;
    }

    if (position === "2") {
      const following = usersData.filter((user) => !user.followers);
      renderMatchingList(following);
      return;
    }
  }
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Swiperjs
const matchingSwiperWrapper = document.getElementById("swiper_wrapper--matching");
const userInterestTitle = document.querySelector("#user_interests h2");
const userInterests = document.querySelector("#user_interests #categories");

let swiper = null;

function initSwiper() {
  // Destroy existing swiper instance if it exists
  if (swiper) {
    swiper.destroy(true, true);
  }

  // Create new swiper instance
  swiper = new Swiper(".swiper", {
    effect: "cards",
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChange: function () {
        handleSlideChange(this.activeIndex);
      },
    },
  });
}

// Function to show skeleton for matching slides
function showSliderSwiperSkeletonSlides(count = 3) {
  matchingSwiperWrapper.innerHTML = ""; // Clean existing slides

  // Generate skeleton slides
  for (let i = 0; i < count; i++) {
    const skeletonMarkup = `
      <div class="swiper-slide matching-skeleton-slide">
        <div class="skeleton-image skeleton_loading"></div>
      </div>
    `;
    matchingSwiperWrapper.insertAdjacentHTML("beforeend", skeletonMarkup);
  }

  initSwiper();
}

function updateSwiperSlides(users = []) {
  matchingSwiperWrapper.innerHTML = ""; // clean existing slides

  users.forEach((user, i) => {
    const markup = `
        <div class="swiper-slide" data-matching-userId="${user.id}">
          <img src="${user.largePhoto}" alt="${user.name}" />

          <div class="card-content">
          ${
            user.online
              ? `<div class="status">
              <span></span>
              <span>Online</span>
            </div>`
              : ""
          }
            <h1>${user.name}</h1>
            <div class="description">${user.name} is a dedicated individual who spends her days caring for animals at the local shelter.</div>
            <div class="action">
              <button class="follow">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"></path><path fill="currentColor" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"></path></g></svg>
                <span>Collaborate</span>
              </button>
              <a href="/profile.html" class="visit_profile">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-width="2"><path stroke-linejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"/><circle cx="12" cy="7" r="3"/></g></svg>
                <span>Visit Profile</span>
              </a>
            </div>
          </div>
        </div>
  `;

    matchingSwiperWrapper.insertAdjacentHTML("beforeend", markup);
  });

  initSwiper();
}

function handleSlideChange(index) {
  const allMatchingItem = document.querySelectorAll("#matching_list_wrapper");
  const currentSlideListEl = document.querySelector(`[data-matching-item="${index}"]`);
  const currentUser = usersData[+index];

  const lastName = currentUser.name.split(" ")[0];
  userInterestTitle.textContent = `${lastName}'s Interests`;

  userInterests.innerHTML = ""; // clear existing interests
  currentUser.interests.forEach((int) => {
    userInterests.insertAdjacentHTML("afterbegin", `<div class="category" data-category="${int.value}">${int.label}</div>`);
  });

  allMatchingItem.forEach((item) => item.classList.remove("active"));
  currentSlideListEl.classList.add("active");
  currentSlideListEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// keydown event
document.addEventListener("keydown", (e) => {
  if (!matchingModalOverlay.classList.contains(HIDDEN)) {
    if (e.key === "ArrowRight") {
      if (swiper) {
        return swiper.slideNext();
      }
    }

    if (e.key === "ArrowLeft") {
      if (swiper) {
        return swiper.slidePrev();
      }
    }
  }
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Task Matching for the first time
const taskMergingContinue = document.getElementById("task_merging--continue");
const taskMergingCancel = document.getElementById("task_merging--cancel");

taskMergingContinue.addEventListener("click", (e) => {
  localStorage.setItem("sizemug_matching", "true");

  taskApp.removeClass(matchingModalOverlay); // show matching modal
  taskApp.addClass(taskApp.taskMergeModal); // hide first time matching modal

  // This function is in generate.matching.data.js
  window.matchingModal.generateMatchingRandomUsers(); // start fetching
});

taskMergingCancel.addEventListener("click", () => {
  taskApp.addClass(taskApp.taskMergeModal, HIDDEN); // hide first time matching modal
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Hide Task Matching Modal
const hideTaskMergingModal = document.getElementById("close_matching--overlay");
hideTaskMergingModal.addEventListener("click", () => {
  taskApp.addClass(matchingModalOverlay, HIDDEN);
});
