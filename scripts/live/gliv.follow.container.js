class GlivFollowContainer {
  constructor() {
    this.followingStraightContainer = document.getElementById("followingStraightContainer");
    this.followersStraightContainer = document.getElementById("followersStraightContainer");
    this.liveFollowContainerTab = document.getElementById("liveFollowContainerTab");
    this.filterFollowLive = document.getElementById("filterFollowLive");

    this.liveFollowContainerTab.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        const { tab } = button.dataset;

        this.switchHeaderActive(tab);

        if (tab === "follower") {
          this.followingStraightContainer.classList.add(HIDDEN);
          this.followersStraightContainer.classList.remove(HIDDEN);
        } else {
          this.followingStraightContainer.classList.remove(HIDDEN);
          this.followersStraightContainer.classList.add(HIDDEN);
        }
      }
    });

    this.#render();
    this.setupPopper();
  }

  setupPopper() {
    this.popper = new PopperModal({
      triggerSelector: "#filterFollowBtn",
      modalSelector: "#filterFollowLive",
    });
    this.filterFollowLive.style.display = "none";
  }

  #render() {
    Array.from({ length: 9 }, (_, i) => i + 1).map((item) => {
      const markup = this.#generateMarkup();
      this.followingStraightContainer.insertAdjacentHTML("beforeend", markup);
    });

    Array.from({ length: 9 }, (_, i) => i + 1).map((item) => {
      const markup = this.#generateMarkup("follower");
      this.followersStraightContainer.insertAdjacentHTML("beforeend", markup);
    });
  }

  #generateMarkup(type = "") {
    return `
                <li class="follow_item" role="button" tabindex="0" aria-label="Following User">
                  <div class="sg_live_nav_avatar_area">
                    <div class="sg_nav_profile">
                      <button class="sg_live_avatar_btn" aria-label="Open Profile Menu">
                        <img loading="lazy" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" id="show_header_modal" alt="User Avatar" />
                      </button>
                      <img class="badge" src="./icons/sg-pioneer.svg" alt="SG Pioneer" />
                    </div>
                  </div>

                  <div class="follow_content">
                        <div class="follow_content_title">
                          <h2 class="follow_name">Savannah Nguyen</h2>
                          <span>Live</span>
                        </div>
                        <p class="follow_bio">An innovative software engineer known for his groundbreaking work in cloud computing, Jackson has revolutionized the way organizations handle their data by developing scalable solutions that are both efficient and user-friendly.</p>
                        <span class="follow_badge">Pioneer</span>
                  </div>

                 ${
                   type === "follower"
                     ? `<button class="follow_item_add">
                     <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5H19M12 5.5V19.5" stroke="#3897F0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12.5H19M12 5.5V19.5" stroke="url(#paint0_linear_10_4163)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><defs><linearGradient id="paint0_linear_10_4163" x1="12" y1="5.5" x2="12" y2="19.5" gradientUnits="userSpaceOnUse"><stop stop-color="#0184FF"/><stop offset="0.932692" stop-color="#7400FF"/></linearGradient></defs></svg>
                   </button>`
                     : ""
                 }
                </li>   
     `;
  }

  switchHeaderActive(tabType) {
    const buttons = this.liveFollowContainerTab.querySelectorAll("button");
    buttons.forEach((btn) => {
      if (btn.dataset.tab === tabType) {
        btn.setAttribute("data-active", "");
      } else {
        btn.removeAttribute("data-active");
      }
    });
  }
}

window.glivFollowContainer = new GlivFollowContainer();
