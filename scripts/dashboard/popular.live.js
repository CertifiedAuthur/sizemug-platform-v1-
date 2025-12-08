////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// List of possible session titles
const titles = [
  "Explore museums, historical sites, and landmarks through",
  "Compete or watch live gaming tournaments with C",
  "Learn photography with real-time feedback from experts",
  "Virtual cooking classes with world-renowned chefs",
  "Travel the world from your screen with live city tours",
  "Join exclusive fitness challenges and workouts live",
  "Attend live art and painting sessions from professionals",
  "Dive into coding bootcamps and programming tutorials",
  "Gaming Tournament Live",
  "Compete or Watch",
  "Learn to Code",
  "Live Art Session",
  "Music Production Stream",
];
const popularSkeletonContainer = document.querySelector(
  ".popular_skeleton_container"
);
const popularContainer = document.querySelector(".popular_container");
const popularSkeletonGridContainer = document.querySelector(
  ".popular_skeleton--grid"
);
const popularMainGridContainer = document.getElementById("popular_live_body");

async function generateLiveItems(numSessions) {
  const response = await fetch(
    `https://randomuser.me/api/?results=${numSessions}`
  );
  const data = await response.json();

  // Example data for the number of views, live status, and reactions
  const liveStatus = ["Live", "Ended"];
  const views = Array.from(
    { length: numSessions },
    () => Math.floor(Math.random() * 500) + 100
  );

  // Function to generate a random color
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  // Combine fetched data into items array
  return data.results.map((user, i) => ({
    host: `${user.name.first} ${user.name.last}`,
    avatar: user.picture.thumbnail,
    status: liveStatus[Math.floor(Math.random() * liveStatus.length)],
    views: views[i],
    avatars: data.results
      .slice(0, Math.floor(Math.random() * (10 - 0 + 1)) + 0)
      .map((user) => user.picture.thumbnail),
    title: titles[i % titles.length],
    bannerImage: freeImages[i],
  }));
}

// Popular Real Data Rendering
function renderMainPopular(popular) {
  // popularMainGridContainer.innerHTML = "";
  popular.forEach((p) => {
    const markup = `
         <div class="popular_live_item">
              <div class="top_level">
                <img src="${p.bannerImage}" alt="" />

                <!-- Overlay -->
                <div class="live_overlay">
                  <div>
                    <div class="signal live_signal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24">
                        <path
                          fill="white"
                          d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"
                        ></path>
                      </svg>
                      <span>${p.status}</span>
                    </div>

                    <!-- Viewers -->
                    <div class="viewers">
                      <span>${p.views}k</span>
                      <span>Views</span>
                    </div>
                  </div>

                  <div>
                    <div class="live_hot">
                      <img src="icons/popular_fire.svg" alt="Fire Icon" />
                      <span>x630</span>
                    </div>

                    <div class="live_collaborators">
                    ${p.avatars
                      .map((avt, i) => {
                        if (i + 1 > 5) return;
                        return `<img src="${avt}" alt="Collaborator ${
                          i + 1
                        }" />`;
                      })
                      .join("")}
                   ${
                     p.avatars.length > 5
                       ? `<div>+${p.avatars.length - 5}</div>`
                       : ""
                   }
                    </div>
                  </div>
                </div>
              </div>

              <div class="bottom_level">
                <div>
                  <img src="${p.avatar}" alt="${p.host}" />
                </div>
                <div>
                  <h2>${p.title}</h2>
                  <div class="content">
                    <h6>${p.host}</h6>
                    <span></span>
                    <a href="#">Follow</a>
                  </div>
                </div>
              </div>
            </div>
        `;

    popularMainGridContainer.insertAdjacentHTML("beforeend", markup);
  });
}

// Popular Skeleton Rendering
function renderPopularSkeleton() {
  popularSkeletonGridContainer.innerHTML = "";
  const dummyArray = Array.from({ length: 30 }, (_, i) => i + 1);

  dummyArray.forEach((_) => {
    const markup = `
      <div class="popular_skeleton--grid--item">
        <div class="popular_skeleton--image skeleton---loading"></div>

        <div>
          <div class="skeleton_image_holder">
            <div class="image skeleton---loading"></div>
          </div>

          <div class="desc">
            <div class="name skeleton---loading"></div>
            <div class="interests skeleton---loading"></div>
          </div>
        </div>
      </div>
  `;

    popularSkeletonGridContainer.insertAdjacentHTML("afterbegin", markup);
  });
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
const seeAllPopular = document.getElementById("see_all_popular--live");
const popularLiveModal = document.getElementById("popular_live");

seeAllPopular.addEventListener("click", (e) => {
  removeClass(popularLiveModal);

  // Show skeleton while loading...
  popularSkeletonContainer.classList.remove(HIDDEN);
  // update popular skeleton loading
  renderPopularSkeleton();
  // Hide main container while loading
  popularContainer.classList.add(HIDDEN);

  // Start fecthing after I clicked on show popular button
  generateLiveItems(32).then((items) => {
    // Hide skeleton while loading...
    popularSkeletonContainer.classList.add(HIDDEN);
    // Show main container while loading
    popularContainer.classList.remove(HIDDEN);
    renderMainPopular(items); // pass in the real data
  });
});

const allHidePopular = document.querySelectorAll(".hide_popular");
allHidePopular.forEach((el) =>
  el.addEventListener("click", () => {
    addClass(popularLiveModal);
  })
);

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////// DROP DOWN HANDLER FOR POPULAR MODAL
// const popularDropdown = document.querySelectorAll("#popular_dropdown");
// const allSuggestionDropdown = document.querySelectorAll("#popular_dropdown .options");

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//  Show more suggestions
const showMorePopularBtn = document.getElementById("popular_more--btn");
const popularDownIcon = showMorePopularBtn.querySelector(".down_icon");
const popularSpinnerIcon = showMorePopularBtn.querySelector("svg");

showMorePopularBtn.addEventListener("click", async (e) => {
  popularDownIcon.classList.add(HIDDEN);
  popularSpinnerIcon.classList.remove(HIDDEN);
  const morePopulars = await generateLiveItems(32);

  setTimeout(() => {
    if (morePopulars) {
      renderMainPopular(morePopulars);
      popularDownIcon.classList.remove(HIDDEN);
      popularSpinnerIcon.classList.add(HIDDEN);
    }
  }, 2000);
});
