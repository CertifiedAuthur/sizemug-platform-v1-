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

  renderGlobalProfilePostSkeleton(postGalleryGrid);
  renderGlobalProfilePostSkeleton(repostGalleryGrid);
  renderGlobalProfilePostSkeleton(taggedGalleryGrid);
  renderGlobalProfilePostSkeleton(mediaGalleryGrid);

  try {
    const data = await generateUsersWithTasks(30);

    if (data) {
      globalProfileData = data;
      gridDataItem = data;

      // Posts Container
      renderGlobalProfilePost(postGalleryGrid, data.slice(0, 10));
      // Media Container
      renderGlobalProfilePost(mediaGalleryGrid, data.slice(21, 30));
      // Reposts Container
      renderProfileReposts(repostGalleryGrid, data.slice(10, 20));
      // Tags Container
      renderProfileReposts(taggedGalleryGrid, data.slice(21, 30));

      return;
    }
  } catch (error) {
    postGalleryGrid.innerHTML = "";
    postGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Posts</h1>");
    repostGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Reposts</h1>");
    taggedGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");
    mediaGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");

    console.log(error.message);
  }
})();
