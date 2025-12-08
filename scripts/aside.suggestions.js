const suggestionLists = document.querySelector(".sidebar_suggestions ul");

async function getAsideSuggestions(count = 15) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();

  return data.results.map((user) => ({
    name: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.medium,
    follow: Math.floor(Math.random() * 10) > 5,
  }));
}

const verifiedBadge = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16Z" fill="url(#gradient)"/><path d="M7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="white"/><defs><linearGradient id="gradient" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"/><stop offset="1" stop-color="#8837E9" stop-opacity="1"/></linearGradient></defs></svg>`;

function renderAsideSuggestions(suggestions = []) {
  suggestionLists.innerHTML = ""; // clear  existing

  suggestions.forEach((suggestion, i) => {
    const idName = i === 0 || i === 2 ? "visitor" : i === 1 || i === 3 || i === 4 ? "visitor-creator" : "";

    const markup = `
          <li>
            <a href="/profile.html" class="aside-item" data-type="${idName}">
              <div style="position: relative">
                <img loading="lazy" src="${suggestion.avatar}" alt="${suggestion.name}'s Avatar" />
                <span class="badge">${isFinite(i / 2) ? verifiedBadge : ""}</span>
              </div>
              <div class="info">
                <span class="name">${suggestion.name}</span>
              </div>
            </a>
            <button class="follow-action">
              ${suggestion.follow ? `Unfollow` : "Follow"}
            </button>
          </li>
         `;

    suggestionLists.insertAdjacentHTML("beforeend", markup);
  });
}

function renderAsideListSkeleton() {
  const suggestionItems = Array.from({ length: 16 }, (_, i) => i + 1);
  suggestionLists.innerHTML = "";

  suggestionItems.forEach((item) => {
    const html = `<li class="aside_item skeleton_loading" style="height: 2.2rem"></li>`;
    suggestionLists.insertAdjacentHTML("beforeend", html);
  });
}

renderAsideListSkeleton();

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    getAsideSuggestions().then((data) => {
      renderAsideSuggestions(data);
    });
  }, 600);
});

suggestionLists.addEventListener("click", (e) => {
  // Follow Action
  const followAction = e.target.closest(".follow-action");
  if (followAction) {
    if (followAction.textContent === "Follow") {
      followAction.textContent = "Unfollow";
    } else {
      followAction.textContent = "Follow";
    }
    return;
  }

  const li = e.target.closest("li");
  if (li) {
    const { type } = li.querySelector(".aside-item").dataset;
    localStorage.setItem("user-type", type);
  }
});
