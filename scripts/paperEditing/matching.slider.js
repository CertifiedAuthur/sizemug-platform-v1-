function renderMatchingUserList() {
  window.matchingModal.generateMatchingRandomUsers(30, false).then((users) => {
    const matchUsersUl = document.getElementById("match_users_ul");
    renderMatchingListSlider(users, matchUsersUl);
  });
}

renderMatchingUserList();

function renderMatchingListSlider(users, container) {
  container.innerHTML = "";

  users.forEach((user, i) => {
    const { name, photo, online, newUser, interests } = user;

    const html = `
      <div id="matching_list_wrapper" data-matching-item="${user.id}">
        <li class="matching_list" role="button">
          <div class="matching_list_image--wrapper">
            <a href="/profile.html"><img src="${photo}" alt="${name}" /></a>
            ${online ? '<div class="online"></div>' : ""}
          </div>

          <div class="content">
            <div>
              <h2><a href="/profile.html">${name}</a></h2>
              &bull;
              <a href="#">Follow</a>
            </div>

            <div>${interests.map((int) => `<span>${int.label}</span>`).join("")}</div>
          </div>
        </li>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });
}

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
const openMatchingSlider = document.getElementById("open_matching_slider");
const hideMatchingSlider = document.getElementById("hide_matching_slider");
const matchingSliderContainer = document.getElementById("matching_slider");
const matchingSliderListsContainer = document.getElementById("matching__slider_lists--container");

openMatchingSlider.addEventListener("click", () => {
  matchingSliderContainer.ariaExpanded = true;

  hideMatchingSlider.style.display = "block";
  hideMatchingSlider.classList.remove("spaceOutDown");
  hideMatchingSlider.classList.add("spaceInDown");
});

hideMatchingSlider.addEventListener("click", function () {
  matchingSliderContainer.ariaExpanded = false;

  this.classList.remove("spaceInDown");
  this.classList.add("spaceOutDown");

  setTimeout(() => {
    this.style.display = "none";
  }, 150);
});
