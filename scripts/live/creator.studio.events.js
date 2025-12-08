const creatorStudioGlobalData = [
  {
    image: "./icons/sg-50-day-streamer.svg",
    name: "50 Day Streamer",
    date: "Yesterday",
  },

  {
    name: "100 Day Streamer",
    image: "./icons/sg-100-day-streamer.svg",
    date: "Yesterday",
  },

  {
    name: "Trophy Seeker",
    image: "./icons/sg-trophy-seeker-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Director",
    image: "./icons/sg-director-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Trophy Seeker",
    image: "./icons/sg-trophy-seeker-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Director",
    image: "./icons/sg-director-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Celebrity",
    image: "./icons/sg-celebrity-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Trophy Seeker",
    image: "./icons/sg-trophy-seeker-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Director",
    image: "./icons/sg-director-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Celebrity",
    image: "./icons/sg-celebrity-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Trophy Seeker",
    image: "./icons/sg-trophy-seeker-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Director",
    image: "./icons/sg-director-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Celebrity",
    image: "./icons/sg-celebrity-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Magician",
    image: "./icons/sg-magician-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Trophy Seeker",
    image: "./icons/sg-trophy-seeker-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Director",
    image: "./icons/sg-director-lg.svg",
    date: "Yesterday",
  },

  {
    name: "Celebrity",
    image: "./icons/sg-celebrity-lg.svg",
    date: "Yesterday",
  },
];

class CreatorStudioEvents {
  constructor() {
    this.settingNavButtons = document.getElementById("settingNavButtons");
    this.allSettingNavButtons = this.settingNavButtons.querySelectorAll("button");
    this.streamSettingContainer = document.getElementById("streamSettingContainer");
    this.roomSettingContainer = document.getElementById("roomSettingContainer");
    this.creatorStudioAsideContainer = document.getElementById("creatorStudioAsideContainer");
    this.allCreatorStudioAsideContainerItems = this.creatorStudioAsideContainer.querySelectorAll("li");
    this.creatorStudioContainerItems = document.querySelectorAll(".creator_studio_container_item");
    this.creatorStudioSettingsContainer = document.getElementById("creatorStudioSettingsContainer");
    this.creatorStudioRoomContainer = document.getElementById("creatorStudioRoomContainer");
    this.creatorStudioStreamContainer = document.getElementById("creatorStudioStreamContainer");
    this.creatorStudioAnalyticsContainer = document.getElementById("creatorStudioAnalyticsContainer");
    this.creatorStudioRevenueContainer = document.getElementById("creatorStudioRevenueContainer");

    // Insights and Analytics :)
    this.analyticsNavButtons = document.getElementById("analyticsNavButtons");
    this.allAnalyticsNavButtons = this.analyticsNavButtons.querySelectorAll("button");
    this.streamInsightsAnalytics = document.getElementById("streamInsightsAnalytics");
    this.roomInsightsAnalytics = document.getElementById("roomInsightsAnalytics");

    // Revenue & Earnings :)
    this.revenueNavButtons = document.getElementById("revenueNavButtons");
    this.allRevenueNavButtons = this.revenueNavButtons.querySelectorAll("button");
    this.streamRevenueAnalytics = document.getElementById("streamRevenueAnalytics");
    this.roomRevenueAnalytics = document.getElementById("roomRevenueAnalytics");

    // Achievements & Badges
    this.creatorStudioAchievementsContainer = document.getElementById("creatorStudioAchievementsContainer");
    this.achievementBadgesModal = document.getElementById("achievementBadgesModal");
    this.seeAllBadgesBtn = document.getElementById("seeAllBadges");
    this.badgesModalBadgeGrid = document.getElementById("badgesModalBadgeGrid");

    this.revenueEarningFilter = document.getElementById("revenue&EarningFilter");
    this.insightAnalyticsFilter = document.getElementById("insight&AnalyticsFilter");

    //
    this.revenueEarningFilter.addEventListener("click", (e) => {
      const isExpanded = this.revenueEarningFilter.getAttribute("aria-expanded") === "true";
      this.revenueEarningFilter.setAttribute("aria-expanded", !isExpanded);
    });

    //
    this.insightAnalyticsFilter.addEventListener("click", (e) => {
      const isExpanded = this.insightAnalyticsFilter.getAttribute("aria-expanded") === "true";
      this.insightAnalyticsFilter.setAttribute("aria-expanded", !isExpanded);
    });

    this.settingsEvent();
    this.creatorAsideNavigationEvent();
    this.insightsAndAnalyticsTab();
    this.revenueAndEarningsTab();
    this.achievementContainerEvent();
  }

  //
  settingsEvent() {
    this.settingNavButtons.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { key } = button.dataset;

        this.allSettingNavButtons.forEach((btn) => btn.removeAttribute("data-active"));
        button.setAttribute("data-active", "");

        if (key === "stream") {
          this.roomSettingContainer.classList.add(HIDDEN);
          this.streamSettingContainer.classList.remove(HIDDEN);
        } else {
          this.roomSettingContainer.classList.remove(HIDDEN);
          this.streamSettingContainer.classList.add(HIDDEN);
        }
      }
    });
  }

  //
  creatorAsideNavigationEvent() {
    this.creatorStudioAsideContainer.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");

      if (listItem) {
        const { tab } = listItem.dataset;

        this.allCreatorStudioAsideContainerItems.forEach((li) => li.removeAttribute("data-active"));
        this.creatorStudioContainerItems.forEach((container) => container.classList.add(HIDDEN));

        listItem.setAttribute("data-active", "");
        //  settings | analytics | revenue | badge | room | stream
        if (tab === "settings") {
          this.creatorStudioSettingsContainer.classList.remove(HIDDEN);
        } else if (tab === "room") {
          this.creatorStudioRoomContainer.classList.remove(HIDDEN);
        } else if (tab === "stream") {
          this.creatorStudioStreamContainer.classList.remove(HIDDEN);
        } else if (tab === "analytics") {
          this.creatorStudioAnalyticsContainer.classList.remove(HIDDEN);
        } else if (tab === "revenue") {
          this.creatorStudioRevenueContainer.classList.remove(HIDDEN);
        } else if (tab === "badge") {
          this.creatorStudioAchievementsContainer.classList.remove(HIDDEN);
        }
      }
    });
  }

  //
  insightsAndAnalyticsTab() {
    this.analyticsNavButtons.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { key } = button.dataset;

        this.allAnalyticsNavButtons.forEach((btn) => btn.removeAttribute("data-active"));
        button.setAttribute("data-active", "");

        if (key === "stream") {
          this.roomInsightsAnalytics.classList.add(HIDDEN);
          this.streamInsightsAnalytics.classList.remove(HIDDEN);
        } else {
          this.streamInsightsAnalytics.classList.add(HIDDEN);
          this.roomInsightsAnalytics.classList.remove(HIDDEN);
        }
      }
    });
  }

  //
  revenueAndEarningsTab() {
    this.revenueNavButtons.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { key } = button.dataset;

        this.allRevenueNavButtons.forEach((btn) => btn.removeAttribute("data-active"));
        button.setAttribute("data-active", "");

        if (key === "stream") {
          this.roomRevenueAnalytics.classList.add(HIDDEN);
          this.streamRevenueAnalytics.classList.remove(HIDDEN);
        } else {
          this.streamRevenueAnalytics.classList.add(HIDDEN);
          this.roomRevenueAnalytics.classList.remove(HIDDEN);
        }
      }
    });
  }

  //
  achievementContainerEvent() {
    this.seeAllBadgesBtn.addEventListener("click", () => {
      this.achievementBadgesModal.classList.remove(HIDDEN);
    });

    this.achievementBadgesModal.addEventListener("click", (e) => {
      if (e.target.id === "achievementBadgesModal") {
        this.achievementBadgesModal.classList.add(HIDDEN);
      }
    });

    creatorStudioGlobalData.map((data) => {
      const markup = `
        <div class="badge_container dark">
          <img src="${data.image}" alt="" />
          <h4>${data.name}</h4>
          <span>${data.date}</span>
        </div>
      `;
      this.badgesModalBadgeGrid.insertAdjacentHTML("beforeend", markup);
    });
  }
}

new CreatorStudioEvents();
