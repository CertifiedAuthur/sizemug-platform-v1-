const livePageContentsList = document.getElementById("livePageContentsList");
const livePageTab = document.getElementById("livePageTab");
let liveDataInfo;

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
function renderLiveTabInterests() {
  sizemugGlobalInterests.forEach((int) => {
    const markup = `<label data-tab="${int.value}" class="chip"><input type="radio" name="tab" hidden /><span>${int.label}</span></label>`;
    livePageTab.insertAdjacentHTML("beforeend", markup);
  });
}
renderLiveTabInterests();

async function fetchLiveFeed() {
  renderLiveFeedSkeleton();

  liveDataInfo = await generateUsersWithTasks(50);
  renderLiveFeeds(liveDataInfo);
}
fetchLiveFeed();

function renderLiveFeeds(data) {
  livePageContentsList.innerHTML = "";

  data.forEach((info) => {
    const markup = `
                <li class="live-item">
                    <a href="./live-room.html">
                      <div class="live_media">
                        <!-- <video src="../videos/vid.mp4" controls></video> -->
                        <img src="${info.taskVideoThumbnail}" alt="live stream" />
                        <div class="live-tag">
                          <span class="material-icons-round">sensors</span>
                          <span class="live-label">Live</span>
                        </div>
                        <div class="live_views">235K Views</div>
                        <div class="live_user_views">
                          <img src="../images/small-img/3.png" alt="img list 3" class="people-tags" />
                          <img src="../images/small-img/1.png" alt="img list 1" class="people-tags" />
                          <img src="../images/small-img/2.png" alt="img list 2" class="people-tags" />
                        </div>
                      </div>
                    </a>
                    <div class="live_details">
                      <div class="live_details-content">
                        <img src="../images/lives/2.jpg" alt="" />
                        <p class="multiline-ellipsis">Explore nature reserves, hike trails, and discover hidden gems.</p>
                      </div>
                      <div class="live_details-user_details">
                        <span class="live_details-user_details-name">Eleanor Pena</span>
                        <span class="ellipse"></span>
                        <a href="#" class="follow">Following</a>
                      </div>
                    </div>
                </li>
    `;
    livePageContentsList.insertAdjacentHTML("beforeend", markup);
  });
}

function renderLiveFeedSkeleton() {
  livePageContentsList.innerHTML = "";

  Array.from({ length: 20 }, (_, i) => i + 1).map(() => {
    const markup = `<li class="live-item-skeleton skeleton_loading"></li>`;

    livePageContentsList.insertAdjacentHTML("beforeend", markup);
  });
}

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
 */

livePageTab.addEventListener("click", (e) => {
  const label = e.target.closest("label");

  if (label) {
    const { tab } = label.dataset;

    if (tab === "all") {
      return renderLiveFeeds(liveDataInfo);
    }

    if (tab) {
      const lives = liveDataInfo.filter((live) => live.liveTag === tab) ?? [];
      renderLiveFeeds(lives);
    }
  }
});
