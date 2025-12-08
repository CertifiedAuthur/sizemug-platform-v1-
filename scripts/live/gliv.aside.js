const topCreators = [
  {
    name: "Esther Howard",
    tag: { label: "No 1 Top Creator", color: "orange" },
    live: true,
    medal: "sg-global-creator-award-1.svg",
  },
  {
    name: "Brooklyn Simmons",
    tag: { label: "No 2 Top Creator", color: "red" },
    live: true,
    medal: "sg-global-creator-award-2.svg",
  },
  {
    name: "Guy Hawkins",
    tag: { label: "No 3 Top Creator", color: "orange" },
    live: true,
    medal: "sg-global-creator-award-3.svg",
  },
  {
    name: "Savannah Nguyen",
    tag: { label: "Pioneer", color: "blue" },
    medal: "sg-pioneer.svg",
  },
  {
    name: "Darlene Robertson",
    tag: { label: "Popular", color: "green" },
    medal: "sg-popular.svg",
  },
  {
    name: "Theresa Webb",
    tag: { label: "Coin Hoarder", color: "yellow" },
    medal: "sg-coin-hoarder.svg",
  },
  {
    name: "Ralph Edwards",
    tag: { label: "Trophy Seeker", color: "orange" },
    medal: "sg-trophy-seeker.svg",
  },
  {
    name: "Esther Howard",
    tag: { label: "100 Day Streamer", color: "red" },
    medal: "sg-100-day-streamer.svg",
  },
  {
    name: "Wade Warren",
    tag: { label: "50 Day Streamer", color: "red" },
    live: true,
    medal: "sg-50-day-streamer.svg",
  },
  {
    name: "Ronald Richards",
    tag: { label: "Combo 100", color: "blue" },
    medal: "sg-combo-100.svg",
  },
  {
    name: "Marvin McKinney",
    tag: { label: "Combo 50", color: "blue" },
    medal: "sg-combo-50.svg",
  },
];

class GlivAside {
  constructor() {
    this.glivTopCreators = document.getElementById("glivTopCreators");
    this.liveAsideComponent = document.getElementById("liveAsideComponent");
    this.mainLiveNavigation = document.getElementById("mainLiveNavigation");
    this.navItems = this.mainLiveNavigation.querySelectorAll("li");
    this.liveFollowContainer = document.getElementById("liveFollowContainer");
    this.popularLiveStream = document.getElementById("popularLiveStream");
    this.roomStreamsWrapper = document.getElementById("roomStreamsWrapper");
    this.followingStraightContainer = document.getElementById("followingStraightContainer");
    this.followersStraightContainer = document.getElementById("followersStraightContainer");
    this.spacerExploreContainer = document.getElementById("spacerExploreContainer");
    this.spacerClipFarmContainer = document.getElementById("spacerClipFarmContainer");
    this.spacerLeaderboardContainer = document.getElementById("spacerLeaderboardContainer");
    this.spacerCreatorStudioContainer = document.getElementById("spacerCreatorStudioContainer");
    this.sgLiveMenu = document.getElementById("sgLiveMenu");
    this.openCreatorGoLive = document.getElementById("openCreatorGoLive");

    //
    this.renderTopCreators();
    //
    this.bindEvents();
  }

  bindEvents() {
    //
    this.liveAsideComponent.addEventListener("transitionend", (e) => {
      if (e.propertyName === "width") {
        if (!this.liveAsideComponent.classList.contains("collapsed")) {
          this.liveAsideComponent.classList.add("expanded");
        }
      }
    });

    this.sgLiveMenu?.addEventListener("click", () => {
      const isExpanded = this.sgLiveMenu.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        this.sgLiveMenu.setAttribute("aria-expanded", false);
        this.liveAsideComponent.setAttribute("aria-expanded", false);
        this.liveAsideComponent.classList.add("collapsed");
        this.liveAsideComponent.classList.remove("expanded");
      } else {
        this.sgLiveMenu.setAttribute("aria-expanded", true);
        this.liveAsideComponent.setAttribute("aria-expanded", true);
        this.liveAsideComponent.classList.remove("collapsed");
        this.liveAsideComponent.classList.remove("expanded");
      }
    });

    // Go Live Homepage Button
    this.openCreatorGoLive.addEventListener("click", () => {
      this.openNavigationCreatorStudio();
    });

    this.mainLiveNavigation?.addEventListener("click", (e) => {
      const button = e.target.closest("li");

      if (button) {
        const { tab } = button.dataset;

        this.navItems.forEach((b) => b.removeAttribute("data-active"));
        button.setAttribute("data-active", "");

        if (tab === "explore") {
          this.openNavigationExplore();
        } else if (tab === "following") {
          this.openNavigationFollowing();
        } else if (tab === "follower") {
          this.openNavigationFollower();
        } else if (tab === "clip") {
          this.openNavigationClip();
        } else if (tab === "leaderboard") {
          this.openNavigationLeaderboard();
        } else if (tab === "creator_studio") {
          this.openNavigationCreatorStudio();
        }
      }
    });
  }

  // Open Following Container
  openNavigationFollowing(show = true) {
    this.liveAsideComponent.classList.add("collapsed");
    this.roomStreamsWrapper.classList.add("go_full");

    this.liveFollowContainer.classList.remove(HIDDEN);
    this.popularLiveStream.classList.add(HIDDEN);
    this.followersStraightContainer.classList.add(HIDDEN);
    this.followingStraightContainer.classList.remove(HIDDEN);
    this.spacerExploreContainer.classList.remove(HIDDEN);
    this.spacerCreatorStudioContainer.classList.add(HIDDEN);

    window.glivFollowContainer.switchHeaderActive("following");
  }

  // Open Follower Container
  openNavigationFollower(show = true) {
    if (show) {
      this.liveAsideComponent.classList.add("collapsed");
      this.roomStreamsWrapper.classList.add("go_full");
      this.popularLiveStream.classList.add(HIDDEN);
      this.followingStraightContainer.classList.add(HIDDEN);
      this.spacerCreatorStudioContainer.classList.add(HIDDEN);

      this.spacerExploreContainer.classList.remove(HIDDEN);
      this.liveFollowContainer.classList.remove(HIDDEN);
      this.followersStraightContainer.classList.remove(HIDDEN);
      window.glivFollowContainer.switchHeaderActive("follower");
    } else {
    }
  }

  // Open Explore Container
  openNavigationExplore(show = true) {
    this.liveAsideComponent.classList.remove("collapsed");
    this.roomStreamsWrapper.classList.remove("go_full");

    this.liveFollowContainer.classList.add(HIDDEN);
    this.spacerCreatorStudioContainer.classList.add(HIDDEN);
    this.popularLiveStream.classList.remove(HIDDEN);
    this.spacerExploreContainer.classList.remove(HIDDEN);
    this.openNavigationClip(false);
  }

  // Open Clip Container
  openNavigationClip(show = true) {
    if (show) {
      this.liveAsideComponent.classList.add("collapsed");
      this.spacerExploreContainer.classList.add(HIDDEN);
      this.spacerCreatorStudioContainer.classList.add(HIDDEN);
      this.spacerClipFarmContainer.classList.remove(HIDDEN);
    } else {
      this.spacerClipFarmContainer.classList.add(HIDDEN);
    }
  }

  openNavigationLeaderboard(show = true) {
    if (show) {
      this.liveAsideComponent.classList.add("collapsed");
      this.spacerExploreContainer.classList.add(HIDDEN);
      this.spacerClipFarmContainer.classList.add(HIDDEN);
      this.spacerCreatorStudioContainer.classList.add(HIDDEN);
      this.spacerLeaderboardContainer.classList.remove(HIDDEN);
    } else {
      this.spacerLeaderboardContainer.classList.add(HIDDEN);
    }
  }

  openNavigationCreatorStudio(show = true) {
    if (show) {
      this.liveAsideComponent.classList.add("collapsed");
      this.spacerExploreContainer.classList.add(HIDDEN);
      this.spacerClipFarmContainer.classList.add(HIDDEN);
      this.spacerLeaderboardContainer.classList.add(HIDDEN);
      this.spacerCreatorStudioContainer.classList.remove(HIDDEN);
    } else {
      this.spacerCreatorStudioContainer.classList.add(HIDDEN);
    }
  }

  renderTopCreators() {
    topCreators.forEach((creator) => {
      const markup = this.#generateCreatorMarkup(creator);
      this.glivTopCreators.insertAdjacentHTML("beforeend", markup);
    });
  }

  #generateCreatorMarkup(creator) {
    const medalBorderClass = creator.medal ? creator.medal.split(".")[0] : "";

    return `  
        <li role="button" tabindex="0">
          ${creator.live ? '<span class="creator_bullet"></span>' : ""}
          <div class="sg_nav_profile">
            <button class="sg_live_avatar_btn circular ${medalBorderClass}">
              <img loading="lazy" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="User Avatar" />
            </button>
            <img class="badge" src="./icons/${creator.medal}" alt="${creator.tag.label}" />
          </div>

          <div class="top_creator_info">
            <h5 class="name">${creator.name}</h5>
            <span class="position theme-text-light ${medalBorderClass}">${creator.tag.label}</span>
          </div>

          <button class="creator_add">
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5H19M12 5.5V19.5" stroke="#3897F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12.5H19M12 5.5V19.5" stroke="url(#paint0_linear_10_4164)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="paint0_linear_10_4164" x1="12" y1="5.5" x2="12" y2="19.5" gradientUnits="userSpaceOnUse"><stop stop-color="#0184FF"/><stop offset="0.932692" stop-color="#7400FF"/></linearGradient></defs></svg>
          </button>
        </li>
    `;
  }
}

new GlivAside();
