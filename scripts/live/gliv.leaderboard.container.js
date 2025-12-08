const leaderboardGlobalData = [
  {
    name: "John Doe",
    image: "./icons/sg-global-leader-cup-1.svg",
    medal: "./icons/sg-global-creator-award-1.svg",
    place: 1,
  },

  {
    name: "Jane Doe",
    image: "./icons/sg-global-leader-cup-2.svg",
    medal: "./icons/sg-global-creator-award-2.svg",
    place: 2,
  },

  {
    name: "Abdulkabir Musa",
    image: "./icons/sg-global-leader-cup-3.svg",
    medal: "./icons/sg-global-creator-award-3.svg",
    place: 3,
  },
];

const leaderboardLocalData = [
  {
    name: "John Doe",
    image: "./icons/sg-local-leader-cup-1.svg",
    medal: "./icons/sg-local-creator-cup-1.svg",
    place: 1,
  },

  {
    name: "John Doe",
    image: "./icons/sg-local-leader-cup-2.svg",
    medal: "./icons/sg-local-creator-cup-2.svg",
    place: 2,
  },

  {
    name: "John Doe",
    image: "./icons/sg-local-leader-cup-3.svg",
    medal: "./icons/sg-local-creator-cup-3.svg",
    place: 3,
  },
];

class GlivLeaderboardContainer {
  constructor() {
    this.leaderboardCategories = document.getElementById("leaderboardCategories");
    this.leaderboardTitle = document.getElementById("leaderboardTitle");
    this.leaderboardCards = document.getElementById("leaderboardCards");

    this.init();
  }

  // Initialize
  init() {
    this.switchHeaderActive("global");

    this.leaderboardCategories.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { key } = button.dataset;
        this.switchHeaderActive(key);
        this.render(key);
      }
    });

    this.render("global");
  }

  // Switch Header Active
  switchHeaderActive(tabType) {
    this.leaderboardCategories.querySelectorAll("button").forEach((btn) => btn.removeAttribute("data-active"));
    this.leaderboardCategories.querySelector(`button[data-key="${tabType}"]`).setAttribute("data-active", "");
    this.leaderboardTitle.textContent = tabType === "global" ? "Global Leaderboard" : "Local Leaderboard";
  }

  // Render Leaderboard
  render(tabType) {
    const data = tabType === "global" ? leaderboardGlobalData : leaderboardLocalData;
    this.leaderboardCards.innerHTML = data.map((item) => this.renderLeaderboardCard(item, tabType)).join("");
  }

  // Render Leaderboard Card
  renderLeaderboardCard(item, tabType) {
    return `
        <div class="leaderboard_card">
                <div class="leaderboard_card--top">
                  <div class="leader-card__cup">
                    <img src="${item.image}" alt="SG ${tabType === "global" ? "Global" : "Local"} Leader Cup 1" />
                  </div>

                  <div class="leader-card__profile">
                    <div class="leader-card__profile-info">
                      <img class="leader-card__avatar" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="Profile" />
                      <h4 class="leader-card__name">Esther Howard</h4>
                      ${
                        item.place !== 2
                          ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="gradArrow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8DFF9E"/><stop offset="100%" stop-color="#13D230"/></linearGradient></defs><path fill="url(#gradArrow)" d="m17.71 11.29l-5-5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-5 5a1 1 0 0 0 1.42 1.42L11 9.41V17a1 1 0 0 0 2 0V9.41l3.29 3.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#F43F5E" transform="rotate(180 12 12)" d="m17.71 11.29l-5-5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-5 5a1 1 0 0 0 1.42 1.42L11 9.41V17a1 1 0 0 0 2 0V9.41l3.29 3.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42" /></svg>`
                      }
                    </div>

                    <div class="leader-card__award">
                      <img class="leader-card__award-icon" src="${item.medal}" alt="SG Global Creator 1" />
                      <span class="leader-card__award-label">No ${item.place} Top Creator</span>
                    </div>
                  </div>
                </div>

                <ul class="stats__list">
                  <li class="stats__item">
                    <div class="stats__label">Hours</div>
                    <div class="stats__icon">
                      <!-- prettier-ignore -->
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.6667 21C17.6373 21 21.6667 16.9706 21.6667 12C21.6667 7.02944 17.6373 3 12.6667 3C7.69619 3 3.66675 7.02944 3.66675 12C3.66675 16.9706 7.69619 21 12.6667 21ZM13.6667 6.5C13.6667 5.94772 13.219 5.5 12.6667 5.5C12.1144 5.5 11.6667 5.94772 11.6667 6.5V11.75C11.6667 12.4404 12.2263 13 12.9167 13H16.1667C16.719 13 17.1667 12.5523 17.1667 12C17.1667 11.4477 16.719 11 16.1667 11H13.6667V6.5Z" fill="#8837E9"/></svg>
                    </div>
                    <div class="stats__value">2,000</div>
                  </li>

                  <div class="divider"></div>

                  <li class="stats__item">
                    <div class="stats__label">Views</div>
                    <div class="stats__icon">
                      <!-- prettier-ignore -->
                      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_10_10936)"><path d="M0.666748 11.9997C0.698748 12.0637 0.738748 12.1517 0.786748 12.2637C0.834748 12.3757 0.954748 12.6077 1.14675 12.9597C1.33875 13.3117 1.54675 13.6477 1.77075 13.9677C1.99475 14.2877 2.30675 14.6717 2.70675 15.1197C3.10675 15.5677 3.52275 15.9917 3.95475 16.3917C4.38675 16.7917 4.92275 17.1837 5.56275 17.5677C6.20275 17.9517 6.85875 18.2877 7.53075 18.5757C8.20275 18.8637 8.98675 19.0877 9.88275 19.2477C10.7787 19.4077 11.7067 19.4957 12.6667 19.5117C13.6267 19.5277 14.5547 19.4397 15.4507 19.2477C16.3467 19.0557 17.1387 18.8237 17.8267 18.5517C18.5147 18.2797 19.1627 17.9517 19.7707 17.5677C20.3787 17.1837 20.9147 16.7837 21.3787 16.3677C21.8427 15.9517 22.2587 15.5437 22.6267 15.1437C22.9947 14.7437 23.3067 14.3437 23.5627 13.9437C23.8187 13.5437 24.0267 13.2157 24.1867 12.9597C24.3467 12.7037 24.4667 12.4717 24.5467 12.2637L24.6667 11.9997C24.6507 11.9357 24.6107 11.8477 24.5467 11.7357C24.4827 11.6237 24.3627 11.3997 24.1867 11.0637C24.0107 10.7277 23.8027 10.3917 23.5627 10.0557C23.3227 9.71972 23.0107 9.32772 22.6267 8.87972C22.2427 8.43172 21.8267 8.01572 21.3787 7.63172C20.9307 7.24772 20.3947 6.85572 19.7707 6.45572C19.1467 6.05572 18.4907 5.71972 17.8027 5.44772C17.1147 5.17572 16.3307 4.95172 15.4507 4.77572C14.5707 4.59972 13.6427 4.51172 12.6667 4.51172C11.6907 4.51172 10.7627 4.59972 9.88275 4.77572C9.00275 4.95172 8.21075 5.17572 7.50675 5.44772C6.80275 5.71972 6.15475 6.05572 5.56275 6.45572C4.97075 6.85572 4.43475 7.24772 3.95475 7.63172C3.47475 8.01572 3.05875 8.43172 2.70675 8.87972C2.35475 9.32772 2.04275 9.71972 1.77075 10.0557C1.49875 10.3917 1.29075 10.7277 1.14675 11.0637C1.00275 11.3997 0.882748 11.6317 0.786748 11.7597L0.666748 11.9997ZM8.17875 11.9997C8.17875 10.7677 8.61075 9.71172 9.47475 8.83172C10.3387 7.95172 11.4027 7.51172 12.6667 7.51172C13.9307 7.51172 14.9947 7.95172 15.8587 8.83172C16.7227 9.71172 17.1627 10.7677 17.1787 11.9997C17.1947 13.2317 16.7547 14.2957 15.8587 15.1917C14.9627 16.0877 13.8987 16.5277 12.6667 16.5117C11.4347 16.4957 10.3707 16.0557 9.47475 15.1917C8.57875 14.3277 8.14675 13.2637 8.17875 11.9997ZM9.66675 11.9997C9.66675 12.8317 9.96275 13.5437 10.5547 14.1357C11.1467 14.7277 11.8507 15.0157 12.6667 14.9997C13.4827 14.9837 14.1867 14.6957 14.7787 14.1357C15.3707 13.5757 15.6667 12.8637 15.6667 11.9997C15.6667 11.1357 15.3707 10.4317 14.7787 9.88772C14.1867 9.34372 13.4827 9.04772 12.6667 8.99972C11.8507 8.95172 11.1467 9.24772 10.5547 9.88772L12.6667 11.9997H9.66675Z" fill="#1C64F2"/></g><defs><clipPath id="clip0_10_10936"><rect width="24" height="24" fill="white" transform="translate(0.666748)"/></clipPath></defs></svg>
                    </div>
                    <div class="stats__value">600.5M</div>
                  </li>

                  <div class="divider"></div>

                  <li class="stats__item">
                    <div class="stats__label">Boost</div>
                    <div class="stats__icon">
                      <!-- prettier-ignore -->
                      <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.2887 4.378 9.53866 6.46134 8.25 7.75C8.02146 7.97854 7.77122 8.18746 7.49929 8.37677L7.49928 9.49769L5.99928 10.9977L5.08394 9.39588L2.60605 6.91774L1 6L2.5 4.5L3.62687 4.50001C3.81447 4.22783 4.02218 3.97782 4.25 3.75C5.53866 2.46134 7.622 1.71134 10.5 1.5ZM4.19523 9.22753L4.90234 9.93463L3.84168 10.9953L3.13457 10.2882L4.19523 9.22753ZM3.13457 8.16687L3.84168 8.87397L2.07391 10.6417L1.36681 9.93463L3.13457 8.16687ZM2.07391 7.10621L2.78102 7.81331L1.72036 8.87397L1.01325 8.16687L2.07391 7.10621ZM6.75 4.5C6.33579 4.5 6 4.83579 6 5.25C6 5.66421 6.33579 6 6.75 6C7.16421 6 7.5 5.66421 7.5 5.25C7.5 4.83579 7.16421 4.5 6.75 4.5Z" fill="#FD2945"></path></svg>
                    </div>
                    <div class="stats__value">20.4k</div>
                  </li>

                  <div class="divider"></div>

                  <li class="stats__item">
                    <div class="stats__label">Super Boost</div>
                    <div class="stats__icon">
                      <!-- prettier-ignore -->
                      <img src="./icons/sg-fire.svg" alt="SG Custom Fire" aria-hidden="true">
                    </div>
                    <div class="stats__value">1,234</div>
                  </li>

                  <div class="divider"></div>

                  <li class="stats__item">
                    <div class="stats__label">Coins</div>
                    <div class="stats__icon">
                      <img src="./icons/sg-coin.svg" alt="SG Custom Coin" aria-hidden="true" />
                    </div>
                    <div class="stats__value">100k</div>
                  </li>

                  <div class="divider"></div>

                  <li class="stats__item">
                    <div class="stats__label">Gifts</div>
                    <div class="stats__icon">
                      <!-- prettier-ignore -->
                      <svg aria-hidden="true" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7777 12.231V6.90736H10.2811C8.62372 6.90736 7.74982 5.83258 7.74982 4.78794C7.74982 3.7031 8.55343 3.06024 9.6282 3.06024C10.8637 3.06024 11.828 4.0145 11.828 5.61157V6.90736H13.5054V5.61157C13.5054 4.0145 14.4697 3.06024 15.7052 3.06024C16.78 3.06024 17.5936 3.7031 17.5936 4.78794C17.5936 5.83258 16.6896 6.90736 15.0523 6.90736H13.5556V12.231H20.6371C21.732 12.231 22.3247 11.8091 22.3247 10.7343V8.40401C22.3247 7.33927 21.732 6.90736 20.6371 6.90736H18.2967C18.9195 6.34486 19.2912 5.58144 19.2912 4.71761C19.2912 2.77901 17.7543 1.38281 15.8056 1.38281C14.3592 1.38281 13.184 2.18634 12.6717 3.61271C12.1594 2.18634 10.9742 1.38281 9.52775 1.38281C7.58915 1.38281 6.04226 2.77901 6.04226 4.71761C6.04226 5.58144 6.40385 6.34486 7.03667 6.90736H4.69629C3.66167 6.90736 3.00879 7.33927 3.00879 8.40401V10.7343C3.00879 11.8091 3.61145 12.231 4.69629 12.231H11.7777ZM11.7777 22.6172V13.3058H4.44515V20.0658C4.44515 21.7433 5.42953 22.6172 7.10696 22.6172H11.7777ZM13.5556 13.3058V22.6172H18.2264C19.9038 22.6172 20.8882 21.7433 20.8882 20.0658V13.3058H13.5556Z" fill="#F43F5E"/></svg>
                    </div>
                    <div class="stats__value">500</div>
                  </li>
                </ul>
        </div>
    `;
  }
}

new GlivLeaderboardContainer();
