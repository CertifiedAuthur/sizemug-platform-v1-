class GlivExplore {
  constructor() {
    this.liveCategories = document.getElementById("liveCategories");
    this.popularLiveStream = document.getElementById("popularLiveStream");

    this.popularStreamData = [
      { title: "We’re Celebrating 10K Followers — Live Q&A + Gift Giveaways!", thumbnail: "./images/game-stream.png", userImage: "./students/student--1.avif" },
      { title: "We’re Celebrating 10K Followers — Live Q&A + Gift Giveaways!", thumbnail: "./images/nba.png", userImage: "./students/student--2.avif" },
      { title: "We’re Celebrating 10K Followers — Live Q&A + Gift Giveaways!", thumbnail: "https://images.unsplash.com/photo-1653266995041-48b28503c037?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fGZvb3RiYWxsJTIwYmFubmVyfGVufDB8fDB8fHww", userImage: "./students/student--1.avif" },
    ];

    this.sidebarCategories = [
      { key: "all", value: "All" },
      { key: "gaming", value: "Gaming" },
      { key: "technology", value: "Technology" },
      { key: "health_wellness", value: "Health & Wellness" },
      { key: "finance", value: "Finance" },
      { key: "travel", value: "Travel" },
      { key: "education", value: "Education" },
      { key: "food_beverage", value: "Food & Beverage" },
      { key: "fashion", value: "Fashion" },
      { key: "real_estate", value: "Real Estate" },
      { key: "sports", value: "Sports" },
      { key: "automotive", value: "Automotive" },
      { key: "entertainment", value: "Entertainment" },
      { key: "art_culture", value: "Art & Culture" },
      { key: "music", value: "Music" },
      { key: "science", value: "Science" },
    ];

    this.#renderCategories();
    this.#renderGliveBanners();
  }

  // Render Live Categories :)
  #renderCategories() {
    if (!this.liveCategories) return;
    this.liveCategories.innerHTML = this.sidebarCategories.map((cat, i) => `<button ${i === 0 ? "data-active" : ""} type="button" aria-label="${cat.value}" role="button" data-key="${cat.key}">${cat.value}</button>`).join("");
  }

  #renderGliveBanners() {
    this.popularLiveStream.innerHTML = "";

    this.popularStreamData.map((popular) => {
      const markup = `
      <div class="popular_live_stream_item">
        <div class="stream_banner">
          <img src="${popular.thumbnail}" alt="${popular.title}" />
        </div>

        <div class="banner_overlay">
          <div class="banner_content">
            <div class="sg_nav_profile">
              <button class="sg_live_avatar_btn" aria-label="Open Profile Menu" style="border: 1px solid red">
                <img loading="lazy" src="${popular.userImage}" alt="${popular.title}" />
              </button>
              <img class="badge" src="./icons/sg-pioneer.svg" alt="SG Pioneer" />
            </div>

            <div class="ongoing_live_info">
              <h3>${popular.title}</h3>

              <div class="ongoing_live_tag">
                <div class="hostname">Jacob Janes</div>
                <div class="country">Japanese</div>
                <div class="live_category">Music</div>
                <div class="live_views">
                  <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.2887 4.378 9.53866 6.46134 8.25 7.75C8.02146 7.97854 7.77122 8.18746 7.49929 8.37677L7.49928 9.49769L5.99928 10.9977L5.08394 9.39588L2.60605 6.91774L1 6L2.5 4.5L3.62687 4.50001C3.81447 4.22783 4.02218 3.97782 4.25 3.75C5.53866 2.46134 7.622 1.71134 10.5 1.5ZM4.19523 9.22753L4.90234 9.93463L3.84168 10.9953L3.13457 10.2882L4.19523 9.22753ZM3.13457 8.16687L3.84168 8.87397L2.07391 10.6417L1.36681 9.93463L3.13457 8.16687ZM2.07391 7.10621L2.78102 7.81331L1.72036 8.87397L1.01325 8.16687L2.07391 7.10621ZM6.75 4.5C6.33579 4.5 6 4.83579 6 5.25C6 5.66421 6.33579 6 6.75 6C7.16421 6 7.5 5.66421 7.5 5.25C7.5 4.83579 7.16421 4.5 6.75 4.5Z" fill="#FD2945"/></svg>
                  <span>75.3k</span>
                </div>
                <div class="live_streak">
                  <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.96297 10.287C3.40267 10.6554 3.9234 10.9143 4.48247 11.0425C4.53597 11.06 4.57197 10.99 4.53597 10.955C3.33847 9.81252 3.99647 8.57602 4.48247 8.01852C4.82897 7.62052 5.32247 6.96502 5.28647 6.08602C5.28647 5.99802 5.37647 5.92752 5.44747 5.98052C6.12697 6.33202 6.59147 7.10552 6.71647 7.73802C6.91347 7.54502 6.98497 7.24602 6.98497 6.98252C6.98497 6.89452 7.09197 6.82402 7.18147 6.89452C7.82497 7.47452 8.93297 9.44302 7.14547 10.9895C7.10997 11.025 7.14547 11.0955 7.18147 11.078C7.72348 10.9359 8.23319 10.6912 8.68297 10.357C11.5965 8.10702 9.70147 4.11702 8.46797 2.79902C8.30747 2.64052 8.02147 2.74602 8.02147 2.97452C8.00347 3.44952 7.86047 3.97652 7.48547 4.32802C7.19947 3.13302 6.24647 1.77552 4.88797 1.10752C4.70947 1.01952 4.49497 1.16002 4.51297 1.35352C4.54797 2.98852 3.48147 4.02952 2.55197 5.38302C1.72947 6.59552 1.19347 8.82802 2.96297 10.287Z" fill="#FF6A00"/></svg>
                  <span>5.1k</span>
                </div>
              </div>
            </div>
          </div>

          <div class="live--pointer">
            <div class="live_sign">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"/><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"/></g></svg>
              <span>75.3k</span>
              <span class="live-blinking-signature"></span>
            </div>
          </div>
        </div>
      </div>
      `;
      this.popularLiveStream.insertAdjacentHTML("beforeend", markup);
    });
  }
}

new GlivExplore();

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
class GlivStreamExplore {
  constructor() {
    this.exploreStreamContainer = document.getElementById("exploreStreamContainer");

    this.#render();
  }

  #render() {
    Array.from({ length: 30 }, (_, i) => i + 1).map((item) => {
      const markup = this.#generateMarkup();
      this.exploreStreamContainer.insertAdjacentHTML("beforeend", markup);
    });
  }

  #generateMarkup() {
    const random = Math.floor(Math.random() * 6) + 1;
    return `
        <a href="/live-room.html">
                   <article class="live-card">
                      <div class="live-card__thumb">
                        <img src="./images/lives/live-stream-${random}.png" alt="Stream Thumbnail" />

                        <div class="live-card__badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path><path d="M2 12c1.6-4.097 5.336-7 10-7s8.4 2.903 10 7c-1.6 4.097-5.336 7-10 7s-8.4-2.903-10-7"></path></g></svg>
                          <span class="live-card__views">75.3k</span>
                          <span class="live-card__dot"></span>
                        </div>
                      </div>

                      <div class="live-card__meta">
                        <div class="sg_live_nav_avatar_area">
                          <div class="sg_nav_profile">
                            <button class="sg_live_avatar_btn" aria-label="Open Profile Menu">
                              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" id="show_header_modal" alt="User Avatar" />
                            </button>
                            <img class="badge" src="./icons/sg-pioneer.svg" alt="SG Pioneer" />
                          </div>
                        </div>

                        <div>
                          <div class="live-card__text">
                            <h3 class="live-card__title">We’re Celebrating 10K Followers — Live Q&A + Gift Giveaways!</h3>
                          </div>

                          <div class="live-card__tags">
                            <div class="streaming_user">Kristin Watson</div>
                            <div class="live-card__tag">English</div>
                            <div class="live-card__tag">Gaming</div>
                            <div class="live-card__tag">
                              <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 1.5C10.2887 4.378 9.53866 6.46134 8.25 7.75C8.02146 7.97854 7.77122 8.18746 7.49929 8.37677L7.49928 9.49769L5.99928 10.9977L5.08394 9.39588L2.60605 6.91774L1 6L2.5 4.5L3.62687 4.50001C3.81447 4.22783 4.02218 3.97782 4.25 3.75C5.53866 2.46134 7.622 1.71134 10.5 1.5ZM4.19523 9.22753L4.90234 9.93463L3.84168 10.9953L3.13457 10.2882L4.19523 9.22753ZM3.13457 8.16687L3.84168 8.87397L2.07391 10.6417L1.36681 9.93463L3.13457 8.16687ZM2.07391 7.10621L2.78102 7.81331L1.72036 8.87397L1.01325 8.16687L2.07391 7.10621ZM6.75 4.5C6.33579 4.5 6 4.83579 6 5.25C6 5.66421 6.33579 6 6.75 6C7.16421 6 7.5 5.66421 7.5 5.25C7.5 4.83579 7.16421 4.5 6.75 4.5Z" fill="#FD2945"></path></svg>
                              <span>4.3k</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
</a>
    `;
  }
}

new GlivStreamExplore();
