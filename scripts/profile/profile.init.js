let environmentTimeout; // for handling change environment setTimeout

// Initialize the tooltip for the remaining interests
tippy("#interest-tooltip-more", {
  content: document.getElementById("interest-tooltip-markup"), // Correct ID
  allowHTML: true, // Enable HTML content inside the tooltip
  placement: "right", // Position of the tooltip
  interactive: true, // Allow interaction with the content
  animation: "fade", // Smooth fade effect
  arrow: true, // Show arrow
  theme: "custom", // Use a custom theme
  trigger: "click", // Show tooltip on click
});

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
  const repostGalleryGrid = document.getElementById("repostGalleryGrid");
  const taggedGalleryGrid = document.getElementById("taggedGalleryGrid");
  const favouriteGalleryGrid = document.getElementById("favouriteGalleryGrid");

  renderGlobalProfilePostSkeleton(postGalleryGrid);
  renderGlobalProfilePostSkeleton(repostGalleryGrid);
  renderGlobalProfilePostSkeleton(taggedGalleryGrid);
  renderGlobalProfilePostSkeleton(favouriteGalleryGrid);

  try {
    const data = await generateUsersWithTasks(40);

    if (data) {
      globalProfileData = data;
      gridDataItem = data;

      // Posts Container
      renderGlobalProfilePost(postGalleryGrid, data.slice(0, 10));
      // Reposts Container
      renderProfileReposts(repostGalleryGrid, data.slice(10, 20));
      // Tags Container
      renderProfileReposts(taggedGalleryGrid, data.slice(21, 30));
      // Favourite Container
      renderProfileReposts(favouriteGalleryGrid, data.slice(31, 40));

      return;
    }
  } catch (error) {
    postGalleryGrid.innerHTML = "";
    postGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Posts</h1>");
    repostGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Reposts</h1>");
    taggedGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");
    favouriteGalleryGrid.insertAdjacentHTML("beforeend", "<h1>Try Again Later. Tags</h1>");

    console.log(error.message);
  }
})();
