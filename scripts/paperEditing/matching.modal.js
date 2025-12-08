// Sliding Buttons
const matchButtonContainer = document.querySelectorAll("#matching_buttons_holder");
const sliderEls = document.querySelectorAll(".matching_slider_holder--slider");
const openMatchingModal = document.getElementById("open_matching_modal");
const floatingTaskMergePaperEditingMobile = document.getElementById("floating_task_merge");

const $matchSlides = $("#match_slides");

[floatingTaskMergePaperEditingMobile, openMatchingModal].forEach((button) => {
  button.addEventListener("click", () => {
    matchingModal.classList.remove(HIDDEN);

    console.log(matchingListsUl);

    renderSkeleton(matchingListsUl); // render skeleton before start fetching
    window.matchingModal.generateMatchingRandomUsers().then((users) => {
      matchingData = users;

      renderMatchingList(users); // update user lists
      updateSlickListItems(users); // update slick to fetched items
    });
  });
});

window.addEventListener("resize", updateSlickLayout);

matchButtonContainer.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const target = e.target.tagName.toLowerCase();

    if (target === "button") {
      const { position } = e.target.dataset;
      const translateXValue = +position * 100;
      sliderEls.forEach((s) => (s.style.transform = `translateX(${translateXValue}%)`));

      // Update container content
      renderSkeleton(matchingListsUl); // render skeleton before start fetching
      window.matchingModal.generateMatchingRandomUsers().then((users) => {
        matchingData = users;

        renderMatchingList(users); // update user lists
        updateSlickListItems(users); // update slick to fetched items
      });
    }
  });
});

/**
 * Matching Modal Slider Handler
 */

// Function to manually update the layout
function updateSlickLayout() {
  $matchSlides.slick("setPosition");
}

const slickConfig = {
  speed: 300,
  slidesToShow: 1,
  adaptiveHeight: true,
  prevArrow: "#slider_btn--left",
  nextArrow: "#slider_btn--right",
};

$(document).ready(function () {
  $matchSlides.slick(slickConfig);

  $(".slick-track").css("height", "100%");
  $(".slick-list").css("height", "100%");

  // Update slick layout
  updateSlickLayout();
  $(window).on("resize", updateSlickLayout);
});

// Function to create splash effect
function createSplash(event) {
  const button = event.currentTarget;
  const splash = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  splash.className = "splash";
  splash.style.width = splash.style.height = `${diameter}px`;
  splash.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  splash.style.top = `${event.clientY - button.offsetTop - radius}px`;

  button.appendChild(splash);

  // Remove the splash element after the animation
  setTimeout(() => {
    splash.remove();
  }, 600); // Match this with the animation duration
}

// Add click event listeners for splash effect
document.getElementById("slider_btn--left").addEventListener("click", createSplash);
document.getElementById("slider_btn--right").addEventListener("click", createSplash);

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Edit Entries
const editEntries1 = document.getElementById("edit_entries--1");
const editEntries2 = document.getElementById("edit_entries--2");
const mobileShowEditEntries = document.getElementById("show_matching_entries_mobile--btn");

[editEntries1, editEntries2, mobileShowEditEntries].forEach((button) => {
  button.addEventListener("click", showEntriesModal);
});

function showEntriesModal() {
  const paperMatchingModal = document.getElementById("paper_matching");
  paperMatchingModal.classList.remove(HIDDEN);
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Edit Entries
const closeMatchingModal = document.getElementById("close_matching--modal");
const closeMatchingMobileBtn = document.getElementById("close_matching_mobile--btn");

[closeMatchingModal, closeMatchingMobileBtn].forEach((button) => {
  button.addEventListener("click", closeModalMatching);
});

function closeModalMatching() {
  matchingModal.classList.add(HIDDEN);
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Mobile Show Interests
const moreInterests = document.querySelectorAll("#moreInterests");
const matchingInterestsWrapper = document.getElementById("matchingInterestsWrapper");
const mobileInterestsCancelBtn = document.getElementById("mobileInterestsCancelBtn");
const matchesCountMatchingMobileBtn = document.getElementById("matches_count_matching_mobile--btn");
const matchingListsContainer = document.getElementById("matching_lists");

/**
 * @param {number} num - Should be completely real number
 * @returns - formatted number to shorted format
 */
function formatNumbers(num) {
  if (num < 1000) {
    return num; // No formatting for numbers less than 1,000
  } else if (num >= 1000 && num < 1_000_000) {
    return (num / 1000).toFixed(1) + "K"; // Display in thousands
  } else if (num >= 1_000_000 && num < 1_000_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"; // Display in millions
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B"; // Display in billions
  }
}
matchesCountMatchingMobileBtn.textContent = formatNumbers(1_000_000);

moreInterests.forEach((button) => {
  button.addEventListener("click", () => {
    matchingInterestsWrapper.setAttribute("aria-hidden", "false");
  });
});

mobileInterestsCancelBtn.addEventListener("click", () => {
  matchingInterestsWrapper.setAttribute("aria-hidden", "true");
});

matchesCountMatchingMobileBtn.addEventListener("click", () => {
  matchingListsContainer.classList.add("active");
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#matchingInterestsWrapper") && !e.target.closest("#moreInterests")) {
    matchingInterestsWrapper.setAttribute("aria-hidden", "true");
  }

  if (!e.target.closest("#matching_lists") && !e.target.closest("#matches_count_matching_mobile--btn")) {
    matchingListsContainer.classList.remove("active");
  }
});

/**
 *
 *
 * API for matching modal list
 *
 *
 *
 */

function renderMatchingList(users) {
  matchingListsUl.innerHTML = "";

  users.forEach((user, i) => {
    const { name, photo, online, interests } = user;

    const markup = ` 
            <div id="matching_list_wrapper" data-matching-item="0" class="active">
              <li class="matching_list" role="button">
                <div class="matching_list_image--wrapper">
                  <a href="/profile.html"><img src="${photo}" alt="${name}" /></a>
                  ${online ? '<div class="online"></div>' : ""}
                </div>

                <div class="content">
                  <div>
                    <h2><a href="/profile.html">${name}</a></h2>
                    •
                    <a href="#">Follow</a>
                  </div>

                  <div>${interests.map((int) => `<span>${int.label}</span>`).join("")}</div>
                </div>
              </li>
            </div>
    `;

    matchingListsUl.insertAdjacentHTML("beforeend", markup);
  });
}

// Slick Update
function updateSlickListItems(users) {
  const matchSlides = document.getElementById("match_slides");

  // Destroy existing Slick instance if it exists
  if ($matchSlides.hasClass("slick-initialized")) {
    $matchSlides.slick("unslick");
  }

  matchSlides.innerHTML = "";

  users.forEach((user) => {
    const { largePhoto, name, id, online, interests } = user;

    const overlayInterest = interests.slice(0, 3);

    const markup = `
        <div>
          <div class="match_slide" data-matching-userId="${id}">
            <img class="main_image" src="${largePhoto}" alt="${name}" />

            <div class="card-content">
             ${
               online
                 ? `<div class="status">
                <span></span>
                <span>Online</span>
              </div>`
                 : ""
             }
              <h1>${name}</h1>
              <div class="description">Eleanor Pena is a dedicated individual who spends her days caring for animals at the local shelter.</div>
              <div id="mobile_interests">
                <h4>Top Interests</h4>

                <ul>
                  ${overlayInterest.map((int) => `<li>${int.label}</li>`).join("")}
                  <li id="moreInterests">+${interests.slice(3).length}</li>
                </ul>
              </div>
              <div class="action">
                <button class="follow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><path stroke="currentColor" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"></path><path fill="currentColor" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"></path></g></svg>
                  <span>Collaborate</span>
                </button>
                <button class="visit_profile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
                  <span>Invite</span>
                </button>
              </div>
            </div>
          </div>
        </div>
  `;

    matchSlides.insertAdjacentHTML("beforeend", markup);
  });

  // Update interests with first user in the array
  updateMatchingModalInterest(users[0]);

  // Reinitialize Slick
  $matchSlides.slick(slickConfig);

  // Update slick layout if needed
  updateSlickLayout();
}

function updateMatchingModalInterest(user) {
  const { interests, name } = user;

  const userInterests = document.querySelector("#user_interests h2");
  const interestsList = document.querySelector("div#categories.categories");

  userInterests.textContent = `${name}'s Interests`;

  interestsList.innerHTML = "";

  interests.forEach((int) => {
    const markup = `<div class="category" data-category="${int.value}">${int.label[0].toUpperCase()}${int.label.slice(1)}</div>`;
    interestsList.insertAdjacentHTML("beforeend", markup);
  });
}

// Update interests when the slide changes programmatically
$matchSlides.on("afterChange", () => {
  const activeSlideIndex = $matchSlides.slick("slickCurrentSlide");
  updateMatchingModalInterest(matchingData[activeSlideIndex]);
}); // Slick event for programmatic slide changes
