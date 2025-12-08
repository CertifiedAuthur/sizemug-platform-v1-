class StreamerViewerModal {
  constructor() {
    this.hideViewerModal = document.getElementById("hideViewerModal");
    this.viewerModal = document.getElementById("viewerModal");
    this.viewerListAll = document.getElementById("viewerListAll");
    this.viewerListFollowers = document.getElementById("viewerListFollowers");
    this.viewerListFollowing = document.getElementById("viewerListFollowing");
    this.viewerListTopGifted = document.getElementById("viewerListTopGifted");
    this.viewerListVIP = document.getElementById("viewerListVIP");
    this.showViewersModal = document.getElementById("showViewersModal");
    this.viewersTabs = document.getElementById("viewersTabs");
    this.allTabButtons = this.viewersTabs.querySelectorAll("button");
    this.viewerContainers = document.querySelectorAll("#viewerModal .viewer_modal--container .viewers_list");

    this.renderViewers();

    // HIDE MODAL
    this.viewerModal.addEventListener("click", function (e) {
      if (e.target.id === "viewerModal") {
        this.classList.add(HIDDEN);
      }
    });

    // HIDE MODAL
    this.hideViewerModal.addEventListener("click", () => {
      this.viewerModal.classList.add(HIDDEN);
    });

    this.showViewersModal.addEventListener("click", () => {
      this.viewerModal.classList.remove(HIDDEN);
    });

    this.viewersTabs.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        const { tab } = button.dataset;
        const container = document.getElementById(`viewerList${tab}`);

        this.allTabButtons.forEach((btn) => btn.classList.remove("active"));
        this.viewerContainers.forEach((container) => container.classList.add(HIDDEN));

        button.classList.add("active");
        container.classList.remove(HIDDEN);
      }
    });
  }

  //
  getViewersByFilter(filter, viewers) {
    switch (filter) {
      case "All":
        return viewers;
      case "Following":
        return viewers.filter((v) => v.isFollowing);
      case "Followers":
        return viewers.filter((v) => v.isFollower);
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
    const all = this.getViewersByFilter("All", allViewers);
    const followers = this.getViewersByFilter("Followers", allViewers);
    const following = this.getViewersByFilter("Following", allViewers);
    const topGifted = this.getViewersByFilter("TopGifted", allViewers);
    const vip = this.getViewersByFilter("VIP", allViewers);

    this.viewerListAll.innerHTML = "";
    this.viewerListFollowers.innerHTML = "";
    this.viewerListFollowing.innerHTML = "";
    this.viewerListTopGifted.innerHTML = "";
    this.viewerListVIP.innerHTML = "";

    all.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.viewerListAll.insertAdjacentHTML("beforeend", markup);
    });
    followers.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.viewerListFollowers.insertAdjacentHTML("beforeend", markup);
    });
    following.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.viewerListFollowing.insertAdjacentHTML("beforeend", markup);
    });
    topGifted.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.viewerListTopGifted.insertAdjacentHTML("beforeend", markup);
    });
    vip.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.viewerListVIP.insertAdjacentHTML("beforeend", markup);
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
                  ${badgeSlug !== "top-gifted" ? `<img class="badge" src="./icons/sg-${badgeSlug || "pioneer"}.svg" alt="SG Pioneer">` : ""}
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

new StreamerViewerModal();
