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

const liveItems = document.getElementById("live_items");
async function renderLives() {
  renderLiveSkeletion();

  const lives = await generateLiveItems(15);

  liveItems.innerHTML = ""; // clear skeleton
  lives.forEach((live) => {
    const markup = `
         <div class="live_item">
              <div class="top_level">
                <img src="${live.bannerImage}" alt="" />

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
                      <span>${live.status}</span>
                    </div>

                    <!-- Viewers -->
                    <div class="viewers">
                      <span>${live.views}k</span>
                      <span>Views</span>
                    </div>
                  </div>

                  <div>
                    <div class="live_hot">
                      <img src="icons/popular_fire.svg" alt="Fire Icon" />
                      <span>x630</span>
                    </div>

                    <div class="live_collaborators">
                    ${live.avatars
                      .map((avt, i) => {
                        if (i + 1 > 5) return;
                        return `<img src="${avt}" alt="Collaborator ${
                          i + 1
                        }" />`;
                      })
                      .join("")}
                   ${
                     live.avatars.length > 5
                       ? `<div>+${live.avatars.length - 5}</div>`
                       : ""
                   }
                    </div>
                  </div>
                </div>
              </div>

              <div class="bottom_level">
                <div>
                  <img src="${live.avatar}" alt="${live.host}" />
                </div>
                <div>
                  <h2>${live.title}</h2>
                  <div class="content">
                    <h6>${live.host}</h6>
                    <span></span>
                    <a href="#">Follow</a>
                  </div>
                </div>
              </div>
            </div>
        `;

    liveItems.insertAdjacentHTML("beforeend", markup);
  });
}

function renderLiveSkeletion() {
  const skeleton = Array.from({ length: 16 }, (_, i) => i + 1);

  skeleton.forEach((ske) => {
    const html = `<div class="live_skeleton skeleton_loading"></div>`;
    liveItems.insertAdjacentHTML("beforeend", html);
  });
}

document.addEventListener("DOMContentLoaded", (e) => {
  renderLives();
});
