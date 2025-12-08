class RecipientModal {
  constructor() {
    this.hideRecipientsModal = document.getElementById("hideRecipientsModal");
    this.recipientsModal = document.getElementById("recipientsModal");
    this.recipientListAll = document.getElementById("recipientListAll");
    this.recipientListFollowers = document.getElementById("recipientListFollowers");
    this.recipientListFollowing = document.getElementById("recipientListFollowing");
    this.recipientListTopGifted = document.getElementById("recipientListTopGifted");
    this.recipientListVIP = document.getElementById("recipientListVIP");
    this.showRecipientModal = document.getElementById("showRecipientModal");
    this.recipientsTabs = document.getElementById("recipientsTabs");
    this.allTabButtons = this.recipientsTabs.querySelectorAll("button");
    this.recipientContainers = document.querySelectorAll("#recipientsModal .viewer_modal--container .viewers_list");

    this.selectedRecipient = null;

    this.renderViewers();

    // HIDE MODAL
    this.recipientsModal.addEventListener("click", function (e) {
      if (e.target.id === "recipientsModal") {
        this.classList.add(HIDDEN);
      }
    });

    // HIDE MODAL
    this.hideRecipientsModal.addEventListener("click", () => {
      this.recipientsModal.classList.add(HIDDEN);
    });

    this.showRecipientModal.addEventListener("click", () => {
      this.recipientsModal.classList.remove(HIDDEN);
    });

    this.recipientsTabs.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        const { tab } = button.dataset;
        const container = document.getElementById(`viewerList${tab}`);

        this.allTabButtons.forEach((btn) => btn.classList.remove("active"));
        this.recipientContainers.forEach((container) => container.classList.add(HIDDEN));

        button.classList.add("active");
        container.classList.remove(HIDDEN);

        this.renderViewers(tab);
      }
    });

    this.selectRecipientHandler();
  }

  //
  selectRecipientHandler() {
    this.recipientsModal.addEventListener("click", (e) => {
      e.stopPropagation();

      const viewItem = e.target.closest("div.viewer_item");

      if (viewItem) {
        const { viewer } = viewItem.dataset;

        this.recipientsModal.querySelectorAll(".viewer_item").forEach((item) => item.setAttribute("aria-selected", false));
        viewItem.setAttribute("aria-selected", true);
        this.selectedRecipient = allViewers.find((v) => v.id === viewer);

        viewItem.querySelector(".check_button").addEventListener("click", () => {
          this.showRecipientModal.querySelector("h3").textContent = this.selectedRecipient.name;
          this.showRecipientModal.querySelector(".sg_live_avatar_btn img").src = this.selectedRecipient.avatarUrl;
          this.showRecipientModal.querySelector(".sg_live_avatar_btn img").alt = this.selectedRecipient.name;
          if (this.selectedRecipient?.isHost) {
            this.showRecipientModal.querySelector("#hostRecipientBadge").classList.remove(HIDDEN);
          } else {
            this.showRecipientModal.querySelector("#hostRecipientBadge").classList.add(HIDDEN);
          }
          this.recipientsModal.classList.add(HIDDEN);
        });
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

  // Render Viewers
  renderViewers(show = "All") {
    const all = this.getViewersByFilter("All", allViewers);
    const followers = this.getViewersByFilter("Followers", allViewers);
    const following = this.getViewersByFilter("Following", allViewers);
    const topGifted = this.getViewersByFilter("TopGifted", allViewers);
    const vip = this.getViewersByFilter("VIP", allViewers);

    this.recipientListAll.innerHTML = "";
    this.recipientListFollowers.innerHTML = "";
    this.recipientListFollowing.innerHTML = "";
    this.recipientListTopGifted.innerHTML = "";
    this.recipientListVIP.innerHTML = "";

    all.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.recipientListAll.insertAdjacentHTML("beforeend", markup);
    });
    followers.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.recipientListFollowers.insertAdjacentHTML("beforeend", markup);
    });
    following.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.recipientListFollowing.insertAdjacentHTML("beforeend", markup);
    });
    topGifted.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.recipientListTopGifted.insertAdjacentHTML("beforeend", markup);
    });
    vip.forEach((v) => {
      const markup = this.generateMarkup(v);
      this.recipientListVIP.insertAdjacentHTML("beforeend", markup);
    });

    this.recipientListAll.classList.toggle(HIDDEN, show !== "All");
    this.recipientListFollowers.classList.toggle(HIDDEN, show !== "Followers");
    this.recipientListFollowing.classList.toggle(HIDDEN, show !== "Following");
    this.recipientListTopGifted.classList.toggle(HIDDEN, show !== "TopGifted");
    this.recipientListVIP.classList.toggle(HIDDEN, show !== "VIP");
  }

  generateMarkup(v) {
    const badgeSlug = v.badges[0]
      ? v.badges[0]
          .split(" ")
          .map((n) => n.toLowerCase())
          .join("-")
      : "no-badge";

    return `
              <div class="viewer_item" role="button" tabindex="0" data-viewer="${v.id}">
                <div class="viewer_avatar">
                  <div class="sg_nav_profile">
                    <button class="sg_live_avatar_btn" aria-label="Open Profile Menu" style="border: 1px solid rgba(2, 214, 216, 1)">
                      <img loading="lazy" src="${v.avatarUrl}" alt="User Avatar">
                    </button>
                    <img class="badge" src="./icons/sg-pioneer.svg" alt="SG Pioneer">
                  </div>
                </div>

                <div class="viewer_info">
                  <div class="viewer_name_title">
                    <h3 class="viewer_name">${v.name}</h3>
                    ${v?.isHost ? `<span>Host</span>` : ""}
                  </div>
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
                <button class="check_button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
                </button>
              </div>
          `;
  }
}

new RecipientModal();
