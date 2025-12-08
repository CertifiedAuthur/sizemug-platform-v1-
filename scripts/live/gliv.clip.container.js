class GlivClipContainer {
  constructor() {
    this.clipFarmItems = document.getElementById("clipFarmItems");
    this.backToClipFullLists = document.getElementById("backToClipFullLists");
    this.clipFarmItemsContainer = document.getElementById("clipFarmItemsContainer");
    this.clipFarmItemFullDetails = document.getElementById("clipFarmItemFullDetails");

    this.glivClips = glivClips;
    this.renderClips();

    this.bindEvents();
  }

  bindEvents() {
    //
    this.clipFarmItems.addEventListener("click", (e) => {
      const clipFarmItem = e.target.closest(".clip_farm_item");

      if (clipFarmItem) {
        this.clipFarmItemsContainer.classList.add(HIDDEN);
        this.clipFarmItemFullDetails.classList.remove(HIDDEN);

        const { id } = clipFarmItem.dataset;
        this.renderClipContents(Number(id));
      }
    });

    //
    this.backToClipFullLists.addEventListener("click", () => {
      this.clipFarmItemsContainer.classList.remove(HIDDEN);
      this.clipFarmItemFullDetails.classList.add(HIDDEN);
    });
  }

  show() {
    this.clipFarmItemsContainer.classList.remove(HIDDEN);
    this.clipFarmItemFullDetails.classList.add(HIDDEN);
  }

  renderClips() {
    this.clipFarmItems.innerHTML = "";

    this.glivClips.forEach((farm, i) => {
      const markup = this.generateMarkup(farm, i);
      this.clipFarmItems.insertAdjacentHTML("beforeend", markup);
    });
  }

  generateMarkup(farm, i) {
    const length = farm.clips.length;
    const number = i + 1;
    return `
                <div data-id="${farm.id}" class="clip_farm_item" aria-label="Clip Farm Folder Item" role="button" tabindex="0">
                  <header>
                    <div class="clip_item_title">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 13.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                      <div>
                        <span>${length}</span>
                        <span>Clip(s)</span>
                      </div>
                    </div>

                    <button>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="2.5" cy="8" r=".75"/><circle cx="8" cy="8" r=".75"/><circle cx="13.5" cy="8" r=".75"/></g></svg>
                    </button>
                  </header>

                  <div class="clips_grid clips_grid--${number < 7 ? number : 7}">
                        ${farm.clips
                          .map((f, i) => {
                            const count = i + 1;
                            if (count >= 7) return "";

                            let moreCount;
                            if (count === 6 && farm.clips.length > 6) {
                              moreCount = farm.clips.length - 6;
                            }

                            return `<div class="clip${moreCount ? " clip--more" : ""}">${moreCount ? `+${moreCount}` : ""}</div>`;
                          })
                          .join("")}
                  </div>

                  <div class="clip_item_footer">
                    <div class="clip_item_footer_thumbnail">
                      <img src="https://images.unsplash.com/photo-1574923930958-9b653a0e5148?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdmllJTIwdGh1bWJuYWlsfGVufDB8fDB8fHww" alt="Thumbnail" />
                    </div>

                    <div class="clip_item_footer_details">
                      <h2>We're Celebrating 10K Followers — Live Q&A + Gift Giveaways!</h2>
                      <div class="stats">
                        <span>By Kristin Watson</span>
                        &bull;
                        <span>Today</span>
                      </div>
                    </div>
                  </div>
                </div>
    `;
  }

  renderClipContents(id) {
    const clipMediaGrid = document.getElementById("clipMediaGrid");
    const clip = this.glivClips.find((clip) => clip.id === id);

    clip.clips.forEach((c) => {
      const markup = this.generateClipContentMarkup(c);
      clipMediaGrid.insertAdjacentHTML("beforeend", markup);
    });
  }

  generateClipContentMarkup(c) {
    const { type, media } = c;

    return `
      <div class="clip_media_item">
        <div class="clip_media_item_content">
          <!-- <img src="" alt=""> -->
          <!-- <video src=""></video> -->
        </div>

        <div class="clip_media_tools">
          <button class="clip_media_options">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><circle cx="2.5" cy="8" r=".75"/><circle cx="8" cy="8" r=".75"/><circle cx="13.5" cy="8" r=".75"/></g></svg>
          </button>
        ${
          type === "video"
            ? `<button class="play_media">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4"><path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/><path d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464z"/></g></svg>
          </button>
          <time>00:23</time>`
            : ""
        }
        </div>
      </div>
    `;
  }
}

new GlivClipContainer();
