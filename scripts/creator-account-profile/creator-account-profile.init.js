/**
 * Initializes the creator profile by rendering skeletons for various post types
 * and then fetching and rendering the actual data.
 *
 * This function performs the following steps:
 * 1. Renders skeletons for posts, media, reposts, and tagged posts.
 * 2. Fetches user data with tasks.
 * 3. If data is successfully fetched, renders the actual posts, media, reposts, and tagged posts.
 * 4. If an error occurs during data fetching, displays error messages in the respective containers.
 *
 * @async
 * @function
 * @returns {Promise<void>} - A promise that resolves when the profile initialization is complete.
 */

let globalProfileData;

// Render Skeleton for Post
(async () => {
  const postGalleryGrid = document.getElementById("postGalleryGrid");
  const mediaGalleryGrid = document.getElementById("mediaGalleryGrid");
  const repostGalleryGrid = document.getElementById("repostGalleryGrid");
  const taggedGalleryGrid = document.getElementById("taggedGalleryGrid");
  const favouriteGalleryGrid = document.getElementById("favouriteGalleryGrid");
  const boostGalleryGrid = document.getElementById("boostGalleryGrid");
  const creatorPostItems = document.getElementById("creatorPostItems");
  const creatorGeneralItems = document.getElementById("creatorGeneralItems");

  renderGlobalProfilePostSkeleton(postGalleryGrid);
  renderGlobalProfilePostSkeleton(creatorPostItems);
  renderGlobalProfilePostSkeleton(creatorGeneralItems);
  renderGlobalProfilePostSkeleton(mediaGalleryGrid);
  renderGlobalProfilePostSkeleton(repostGalleryGrid);
  renderGlobalProfilePostSkeleton(taggedGalleryGrid);
  renderGlobalProfilePostSkeleton(favouriteGalleryGrid);
  renderGlobalProfilePostSkeleton(boostGalleryGrid);

  try {
    const data = await generateUsersWithTasks(40);

    if (data) {
      globalProfileData = data;
      gridDataItem = data;

      // Posts Container
      renderGlobalProfilePost(postGalleryGrid, data.slice(0, 10));
      //  Your Content
      renderGlobalProfilePost(creatorPostItems, data.slice(0, 10), false, false, "", true);
      // General Contents
      renderGlobalProfilePost(creatorGeneralItems, data.slice(0, 10), true, false, "New Content");
      // Medias Container
      renderGlobalProfileMedia(mediaGalleryGrid, data.slice(31, 40));
      // Reposts Container
      renderProfileReposts(repostGalleryGrid, data.slice(10, 20));
      // Tags Container
      renderProfileReposts(taggedGalleryGrid, data.slice(21, 30));
      // Favourite Container
      renderProfileReposts(favouriteGalleryGrid, data.slice(21, 30));
      // Boost Container
      renderProfileReposts(boostGalleryGrid, data.slice(21, 30));

      return;
    }
  } catch (error) {
    postGalleryGrid.innerHTML = "";
    postGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Posts</h1>");
    mediaGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Medias</h1>");
    repostGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Reposts</h1>");
    taggedGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");

    console.log(error.message);
  }
})();

// // const switchToCreatorStatistics = document.getElementById("switchToCreatorStatistics");
// // const switchToCreatorInitial = document.getElementById("switchToCreatorInitial");
// const initialCreatorLayout = document.getElementById("initialCreatorLayout");
// const creatorStatisticsLayout = document.getElementById("creatorStatisticsLayout");

// // switchToCreatorStatistics?.addEventListener("click", showCreatorStatistics);
// // switchToCreatorInitial.addEventListener("click", showCreatorInitialView);

// function showCreatorStatistics() {
//   initialCreatorLayout.classList.add(HIDDEN);
//   creatorStatisticsLayout.classList.remove(HIDDEN);
// }

// function showCreatorInitialView() {
//   initialCreatorLayout.classList.remove(HIDDEN);
//   creatorStatisticsLayout.classList.add(HIDDEN);
// }

/**
 *
 *
 *
 *
 *
 *
 *
 */
const filterStats = document.querySelectorAll(".filter_stat");

filterStats.forEach((stat) => {
  const button = stat.querySelector("button");
  const dropdown = stat.querySelector("ul");

  button.addEventListener("click", () => {
    const isExpanded = dropdown.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      dropdown.setAttribute("aria-expanded", false);
    } else {
      dropdown.setAttribute("aria-expanded", true);
    }
  });

  // outside click :0
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".filter_stat")) {
      document.querySelectorAll(".filter_stat ul").forEach((dropdown) => dropdown.setAttribute("aria-expanded", false));
    }
  });
});
