class StreamerChatUsersExpanded {
  constructor() {
    this.hideChatUserExpand = document.getElementById("hideChatUserExpand");
    this.chatUserExpand = document.getElementById("chatUserExpand");
    this.listAllTopGifted = document.getElementById("listAllTopGifted");
    this.listAllVIP = document.getElementById("listAllVIP");
    this.liveChatTabExpand = document.getElementById("liveChatTabExpand");
    this.chatExpandTabs = document.getElementById("chatExpandTabs");
    this.allTabButtons = this.chatExpandTabs.querySelectorAll("button");
    this.expandItemContainers = document.querySelectorAll("#chatUserExpand .viewer_modal--container .viewers_list");

    this.renderViewers();

    // HIDE MODAL
    this.chatUserExpand.addEventListener("click", function (e) {
      if (e.target.id === "chatUserExpand") {
        this.classList.add(HIDDEN);
      }
    });

    // HIDE MODAL
    this.hideChatUserExpand.addEventListener("click", () => {
      this.chatUserExpand.classList.add(HIDDEN);
    });

    this.liveChatTabExpand.addEventListener("click", () => {
      this.chatUserExpand.classList.remove(HIDDEN);
    });

    this.chatExpandTabs.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        const { tab } = button.dataset;
        const container = document.getElementById(`listAll${tab}`);

        this.allTabButtons.forEach((btn) => btn.classList.remove("active"));
        this.expandItemContainers.forEach((container) => container.classList.add(HIDDEN));

        button.classList.add("active");
        container.classList.remove(HIDDEN);
      }
    });
  }

  //
  getViewersByFilter(filter, viewers) {
    switch (filter) {
      case "TopGifted":
        // e.g. “Top Gifted” might mean gifts ≥ some threshold
        return viewers.filter((v) => v.badges.includes("Top Gifted")).sort((a, b) => b.totalGiftsSent - a.totalGiftsSent);
      case "VIP":
        return viewers.filter((v) => v.isVIP);
      default:
        // never happens if FilterKey is exhaustive
        return viewers;
    }
  }

  //
  renderViewers() {
    const topGifted = this.getViewersByFilter("TopGifted", allViewers);
    const vip = this.getViewersByFilter("VIP", allViewers);

    this.listAllTopGifted.innerHTML = "";
    this.listAllVIP.innerHTML = "";

    topGifted.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.listAllTopGifted.insertAdjacentHTML("beforeend", markup);
    });
    vip.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.listAllVIP.insertAdjacentHTML("beforeend", markup);
    });
  }

  generateMarkup(v) {
    const badgeSlug = v.badges[0]
      ? v.badges[0]
          .split(" ")
          .map((n) => n.toLowerCase())
          .join("-")
      : "no-badge";

    return `
              <div class="viewer_item">
                  <div class="viewer_avatar">
                   <div class="sg_nav_profile ${badgeSlug}">
                        <button class="sg_live_avatar_btn" aria-label="Open Profile Menu">
                          <img loading="lazy" src="${v.avatarUrl}" alt="User Avatar">
                        </button>
                        ${badgeSlug && badgeSlug !== "top-gifted" ? `<img class="badge" src="./icons/sg-${badgeSlug}.svg" alt="SG ${badgeSlug}">` : ""}
                      </div>
                  </div>
      
                  <div class="viewer_info">
                    <h3 class="viewer_name">${v.name}</h3>
                    <p class="viewer_bio">${v.tagline}</p>
                    <span class="viewer_stats gifter ${badgeSlug}-${v.badges.length}">${v.badges.length} ${v.badges[0] || ""}</span>
                  </div>
      
                 ${
                   v.isFollower
                     ? `<button class="follow_button">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.8999H19M12 5.8999V19.8999" stroke="#3897F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12.8999H19M12 5.8999V19.8999" stroke="url(#paint0_linear_10_29005)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="paint0_linear_10_29005" x1="12" y1="5.8999" x2="12" y2="19.8999" gradientUnits="userSpaceOnUse"><stop stop-color="#0184FF"/><stop offset="0.932692" stop-color="#7400FF"/></linearGradient></defs></svg>
                  </button>`
                     : ""
                 }
              </div>
          `;
  }
}

new StreamerChatUsersExpanded();
