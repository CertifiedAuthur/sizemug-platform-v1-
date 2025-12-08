//////////////////////////////////////
//// GENERATE REQUESTS LIST /////
//////////////////////////////////////
function renderListSkeleton(container) {
  container.insertAdjacentHTML(
    "beforeend",
    '<li class="skeleton_loading" style="min-height: 2rem; height: 2rem; border-radius: 6px; width: 100%"></li>'.repeat(
      10
    )
  );
}

async function getListRequestContainer(count = 15) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();

  return data.results.map((user) => ({
    name: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.medium,
    follow: Math.floor(Math.random() * 10) > 5,
  }));
}

const listRequestContainer = document.querySelector(
  ".request_list .collaborators--list"
);

async function renderRequestList() {
  renderListSkeleton(listRequestContainer);

  const data = await getListRequestContainer();

  listRequestContainer.innerHTML = "";

  data.map((d) => {
    const html = `
        <li class="collaborator__item">
          <a href="/profile.html">
            <img src="${d.avatar}" alt="${d.name}" />
            <h3>${d.name}</h3>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>
          </a>

          <div class="req_accept_cancel">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"/></svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7L10 17l-5-5"/></svg>
            </button>
          </div>
        </li>
  `;

    listRequestContainer.insertAdjacentHTML("beforeend", html);
  });
}

renderRequestList();

listRequestContainer.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const parent = button.closest(".collaborator__item");
    parent.remove();
  }
});
