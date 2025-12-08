/**
 * Initializes event listeners for the creator statistics navigation.
 *
 * This function sets up a click event listener on the element with the ID "creatorStatNavHeading".
 * When a button within this element is clicked, it updates the `aria-selected` attribute
 * for the clicked button and logs the `statCategory` data attribute to the console.
 *
 * @event DOMContentLoaded
 * @listens document#DOMContentLoaded
 *
 * @function
 * @name initializeCreatorStatNav
 *
 * @param {Event} e - The event object.
 * @param {HTMLElement} e.target - The target element of the event.
 * @param {HTMLElement} e.target.closest - The closest ancestor element that matches the selector.
 * @param {HTMLElement} creatorStatNavHeading - The element with the ID "creatorStatNavHeading".
 * @param {NodeList} tabButtons - A list of all button elements within the creatorStatNavHeading element.
 * @param {HTMLElement} tabButton - The button element that was clicked.
 * @param {DOMStringMap} tabButton.dataset - The dataset of the clicked button element.
 * @param {string} tabButton.dataset.statCategory - The stat category associated with the clicked button.
 */

document.addEventListener("DOMContentLoaded", () => {
  const creatorStatNavHeading = document.getElementById("creatorStatNavHeading");
  const creatorStatContentContainers = document.querySelectorAll(".creator_stat--content");

  creatorStatNavHeading.addEventListener("click", function (e) {
    const tabButton = e.target.closest("button");
    const tabButtons = this.querySelectorAll("button");

    if (tabButton) {
      const { statCategory } = tabButton.dataset;

      tabButtons.forEach((btn) => {
        btn.removeAttribute("aria-selected");
      });

      tabButton.setAttribute("aria-selected", true);

      // General
      if (statCategory === "general") {
        creatorStatContentContainers.forEach((container) => container.classList.remove(HIDDEN));
        followersStatContainer.classList.add(HIDDEN);
        return;
      }

      // Posts
      if (statCategory === "posts") {
        const postsStatContainer = document.getElementById("postsStatContainer");

        creatorStatContentContainers.forEach((container) => container.classList.add(HIDDEN));
        postsStatContainer.classList.remove(HIDDEN);
        return;
      }

      // Followers
      if (statCategory === "followers") {
        const followersStatContainer = document.getElementById("followersStatContainer");

        creatorStatContentContainers.forEach((container) => container.classList.add(HIDDEN));
        followersStatContainer.classList.remove(HIDDEN);
        return;
      }

      // Profile
      if (statCategory === "profile") {
        const profileStatContainer = document.getElementById("profileStatContainer");
        // const profileAnalysisContainer = profileStatContainer.querySelector(".statistics_analysis-container:has(.analysis-items)");

        creatorStatContentContainers.forEach((container) => container.classList.add(HIDDEN));
        // profileAnalysisContainer.classList.remove(HIDDEN);
        profileStatContainer.classList.remove(HIDDEN);
        return;
      }

      // Audience
      if (statCategory === "audience") {
        const audienceStatContainer = document.getElementById("audienceStatContainer");

        creatorStatContentContainers.forEach((container) => container.classList.add(HIDDEN));
        audienceStatContainer.classList.remove(HIDDEN);
        return;
      }

      // similar creator
      if (statCategory === "similar-creator") {
        const similarStatContainer = document.getElementById("similarStatContainer");
        // const profileAnalysisContainer = similarStatContainer.querySelector(".statistics_analysis-container:has(.analysis-items)");

        creatorStatContentContainers.forEach((container) => container.classList.add(HIDDEN));
        // profileAnalysisContainer.classList.add(HIDDEN);
        similarStatContainer.classList.remove(HIDDEN);
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleCreatorInterface = document.getElementById("toggleCreatorInterface");
  const accountProfileHistory = document.getElementById("accountProfileHistory");
  const creatorStatisticsLayout = document.getElementById("creatorStatisticsLayout");

  toggleCreatorInterface.addEventListener("click", (e) => {
    const list = e.target.closest("li");

    if (list) {
      if (list.classList.contains("enable")) {
        toggleCreatorInterface.classList.add("online");
        toggleCreatorInterface.classList.remove("active");

        creatorStatisticsLayout.classList.remove(HIDDEN);
        accountProfileHistory.classList.add(HIDDEN);

        return;
      }

      if (list.classList.contains("disable")) {
        toggleCreatorInterface.classList.remove("online");
        toggleCreatorInterface.classList.remove("active");

        creatorStatisticsLayout.classList.add(HIDDEN);
        accountProfileHistory.classList.remove(HIDDEN);
        return;
      }
    }

    toggleCreatorInterface.classList.toggle("active");
  });
});
