async function getSearchUsers(num) {
  const response = await fetch(`https://randomuser.me/api/?results=${num}`);
  const data = await response.json();

  return data.results.map((d) => {
    return {
      name: `${d.name.first} ${d.name.last}`,
      photo: d.picture.medium,
    };
  });
}

// Search results accounts
const resultAccountContainer = document.getElementById("search_accounts_results");
async function renderSearchAccount() {
  const accounts = await getSearchUsers(3);

  if (!accounts.length) return;

  accounts.forEach((acc) => {
    const html = `
                 <li class="account_list">
                    <a href="/profile.html" class="account_list-profile">
                      <img src="${acc.photo}" alt="User profile" class="rounded-full" />
                      <span class="account_list-profile-name">${acc.name}</span>
                    </a>
                    <a href="#" class="account_list-follow">Follow</a>
                  </li>
        `;

    resultAccountContainer.insertAdjacentHTML("beforeend", html);
  });
}

const resultCreatorsContainer = document.getElementById("search_creators_results");
async function renderCreatorAccount() {
  const creators = await getSearchUsers(2);

  if (!creators.length) return;

  creators.forEach((acc) => {
    const html = `
                <li class="account_list">
                    <a href="/profile.html" class="account_list-profile">
                      <img src="${acc.photo}" alt="User profile" class="rounded-md" />
                      <span class="account_list-profile-name">${acc.name}</span>
                    </a>
                    <a href="#" class="account_list-follow">Follow</a>
                  </li>
        `;

    resultCreatorsContainer.insertAdjacentHTML("beforeend", html);
  });
}

const resultLiveContainer = document.getElementById("search_live_results");
async function renderLiveAccount() {
  const lives = await getSearchUsers(20);

  if (!lives.length) return;
  resultLiveContainer.innerHTML = "";

  lives.forEach((acc) => {
    const html = `
                <li class="result_category-list-box">
                    <div class="live-wrapper">
                      <div class="live-img-wrapper">
                        <img src="${acc.photo}" alt="live image" />
                      </div>
                      <div class="live-tag">
                        <svg xmlns="http://www.w3.org/2000/svg" width="0.9em" height="0.9em" viewBox="0 0 24 24"><path fill="white" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>
                        <span class="live-label">Live</span>
                      </div>
                    </div>
                  </li>
        `;

    resultLiveContainer.insertAdjacentHTML("beforeend", html);
  });
}

const resultLiveChatContainer = document.getElementById("search_live_chat_results");
function renderLiveChatAccount() {
  const livesChat = Array.from({ length: 4 }, (_, i) => i + 1);

  livesChat.forEach(() => {
    const html = `
              <div class="space-item">
                <span class="space-indicator online"></span>
                <div class="space-info">
                  <div class="space-name">
                    ThinkTank
                    <span class="space-emoji">🧠</span>
                  </div>
                </div>
                <div class="space-actions">
                  <div class="member-avatars">
                    <img src="./images/suggestion--1.png" alt="Member" class="member-avatar" />
                    <img src="./images/suggestion--2.png" alt="Member" class="member-avatar" />
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.5 21C22.5 21 24 21 24 19.5C24 18 22.5 13.5 16.5 13.5C10.5 13.5 9 18 9 19.5C9 21 10.5 21 10.5 21H22.5ZM10.533 19.5C10.5219 19.4985 10.5109 19.4965 10.5 19.494C10.5015 19.098 10.7505 17.949 11.64 16.914C12.468 15.9435 13.923 15 16.5 15C19.0755 15 20.5305 15.945 21.36 16.914C22.2495 17.949 22.497 19.0995 22.5 19.494L22.488 19.497C22.481 19.4982 22.474 19.4992 22.467 19.5H10.533ZM16.5 10.5C17.2956 10.5 18.0587 10.1839 18.6213 9.62132C19.1839 9.05871 19.5 8.29565 19.5 7.5C19.5 6.70435 19.1839 5.94129 18.6213 5.37868C18.0587 4.81607 17.2956 4.5 16.5 4.5C15.7044 4.5 14.9413 4.81607 14.3787 5.37868C13.8161 5.94129 13.5 6.70435 13.5 7.5C13.5 8.29565 13.8161 9.05871 14.3787 9.62132C14.9413 10.1839 15.7044 10.5 16.5 10.5ZM21 7.5C21 8.09095 20.8836 8.67611 20.6575 9.22208C20.4313 9.76804 20.0998 10.2641 19.682 10.682C19.2641 11.0998 18.768 11.4313 18.2221 11.6575C17.6761 11.8836 17.0909 12 16.5 12C15.9091 12 15.3239 11.8836 14.7779 11.6575C14.232 11.4313 13.7359 11.0998 13.318 10.682C12.9002 10.2641 12.5687 9.76804 12.3425 9.22208C12.1164 8.67611 12 8.09095 12 7.5C12 6.30653 12.4741 5.16193 13.318 4.31802C14.1619 3.47411 15.3065 3 16.5 3C17.6935 3 18.8381 3.47411 19.682 4.31802C20.5259 5.16193 21 6.30653 21 7.5ZM10.404 13.92C9.80397 13.7311 9.18545 13.6069 8.559 13.5495C8.207 13.516 7.85359 13.4995 7.5 13.5C1.5 13.5 0 18 0 19.5C0 20.5005 0.4995 21 1.5 21H7.824C7.60163 20.5317 7.49074 20.0183 7.5 19.5C7.5 17.985 8.0655 16.437 9.135 15.144C9.4995 14.703 9.924 14.2905 10.404 13.92ZM7.38 15C6.49223 16.3339 6.01266 17.8977 6 19.5H1.5C1.5 19.11 1.746 17.955 2.64 16.914C3.4575 15.96 4.878 15.03 7.38 15.0015V15ZM2.25 8.25C2.25 7.05653 2.72411 5.91193 3.56802 5.06802C4.41193 4.22411 5.55653 3.75 6.75 3.75C7.94347 3.75 9.08807 4.22411 9.93198 5.06802C10.7759 5.91193 11.25 7.05653 11.25 8.25C11.25 9.44347 10.7759 10.5881 9.93198 11.432C9.08807 12.2759 7.94347 12.75 6.75 12.75C5.55653 12.75 4.41193 12.2759 3.56802 11.432C2.72411 10.5881 2.25 9.44347 2.25 8.25ZM6.75 5.25C5.95435 5.25 5.19129 5.56607 4.62868 6.12868C4.06607 6.69129 3.75 7.45435 3.75 8.25C3.75 9.04565 4.06607 9.80871 4.62868 10.3713C5.19129 10.9339 5.95435 11.25 6.75 11.25C7.54565 11.25 8.30871 10.9339 8.87132 10.3713C9.43393 9.80871 9.75 9.04565 9.75 8.25C9.75 7.45435 9.43393 6.69129 8.87132 6.12868C8.30871 5.56607 7.54565 5.25 6.75 5.25Z" fill="#7D8FAA" /></svg>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="space-action-icon activity-icon">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <button class="join-space-btn">Join</button>
                </div>
              </div>
        `;

    resultLiveChatContainer.insertAdjacentHTML("beforeend", html);
  });
}
renderLiveChatAccount();

// Navbar Form
const navbarForm = document.getElementById("navbar_search_form");
navbarForm.addEventListener("submit", function (e) {
  const inputValue = this.querySelector("input").value;

  // prevent browser default behaviour on form
  e.preventDefault();

  if (inputValue === "not found") {
    location.href = "not-found.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    renderSearchAccount();
    renderCreatorAccount();
    renderLiveAccount();
  }, 4000);
});

document.addEventListener("click", (e) => {
  if (!e.target.closest("#search_dialog") && !e.target.closest("#navbar_search_form")) {
    document.getElementById("search_dialog").style.display = "none";
  }
});

document.querySelector(".navbar-search-input").addEventListener("input", (e) => {
  if (e.target.value) {
    document.getElementById("search_dialog").style.display = "block";
  } else {
    document.getElementById("search_dialog").style.display = "none";
  }
});
