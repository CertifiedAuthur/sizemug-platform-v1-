/**
 * Initializes the account profile by rendering skeletons for various post types
 * and then fetching and rendering the actual data.
 *
 * This function performs the following steps:
 * 1. Renders skeletons for posts, media, reposts, tagged and favourites posts.
 * 2. Fetches user data with tasks.
 * 3. If data is successfully fetched, renders the actual posts, media, reposts, tagged and favourites posts.
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

  renderGlobalProfilePostSkeleton(postGalleryGrid);
  renderGlobalProfilePostSkeleton(mediaGalleryGrid);
  renderGlobalProfilePostSkeleton(repostGalleryGrid);
  renderGlobalProfilePostSkeleton(taggedGalleryGrid);
  renderGlobalProfilePostSkeleton(favouriteGalleryGrid);
  renderGlobalProfilePostSkeleton(boostGalleryGrid);

  try {
    const data = await generateUsersWithTasks(50);

    if (data) {
      globalProfileData = data;

      gridDataItem = data;

      // Posts Container
      renderGlobalProfilePost(postGalleryGrid, data.slice(0, 10));
      // Medias Container
      renderGlobalProfileMedia(mediaGalleryGrid, data.slice(40, 50));
      // Reposts Container
      renderProfileReposts(repostGalleryGrid, data.slice(10, 20));
      // Tags Container
      renderProfileReposts(taggedGalleryGrid, data.slice(21, 30));
      // Favourite Container
      renderProfileReposts(favouriteGalleryGrid, data.slice(31, 40));
      // Boost Container
      renderProfileReposts(boostGalleryGrid, data.slice(31, 40));

      return;
    }
  } catch (error) {
    postGalleryGrid.innerHTML = "";
    postGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Posts</h1>");
    mediaGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Medias</h1>");
    repostGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Reposts</h1>");
    taggedGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");
    boostGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");

    console.log(error.message);
  }
})();
