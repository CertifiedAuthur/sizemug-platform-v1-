// Get the button and modal elements
const viewsContainerBtn = document.getElementById("viewsContainer");
const viewsOverlayModal = document.getElementById("viewsOverlayModal");

// Add event listener to show the modal when the button is clicked
viewsContainerBtn.addEventListener("click", showViewsOverlayModal);

// Add event listener to hide the modal when clicking outside the modal content
viewsOverlayModal.addEventListener("click", (e) => {
  if (e.target.id === "viewsOverlayModal") return hideViewsOverlayModal();
});

// Function to show the overlay modal
function showViewsOverlayModal() {
  viewsOverlayModal.classList.remove(HIDDEN); // Remove hidden class to display the modal

  updateModalLocation(); // Update the location chart in the modal
  updateModalDevice(); // Update the device chart in the modal

  // renderAnalyticsOverlayItemList(); // Update the based on country item lists

  /**
   * Function to render the list of analytics overlay items
   * Calls an asynchronous function to generate user data
   * and updates the list accordingly.
   */
  updateAnalyticsOverlayUserListsSkeleton();
  window.matchingModal
    .generateMatchingRandomUsers()
    .then((data) => updateAnalyticsOverlayUserLists(data))
    .catch((error) => console.error("Error generating user data:", error)); // Add error handling for async operation
}

// Function to hide the overlay modal
function hideViewsOverlayModal() {
  viewsOverlayModal.classList.add(HIDDEN); // Add hidden class to hide the modal
}

// Location chart update function
function updateModalLocation() {
  const ctx = document.getElementById("overlayLocationChart").getContext("2d");

  new Chart(ctx, {
    type: "doughnut", // Doughnut chart type
    data: {
      labels: ["United Kingdom", "Canada", "Mexico", "Other"], // Labels for the chart
      datasets: [
        {
          data: [52.1, 22.8, 13.9, 11.2], // Data values for each segment
          backgroundColor: ["#a34df0", "#4f86f0", "#f0a34d", "#add8e6"], // Colors for each segment
          borderWidth: 3, // Space between segments
          borderColor: "#ffffff", // Border color to match the background
          borderRadius: 5, // Rounded edges for each segment
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      cutout: "50%", // Inner radius for the doughnut
      plugins: {
        legend: {
          display: false, // Hide the default legend
        },
        tooltip: {
          enabled: true, // Enable tooltips
        },
      },

      // Add an onClick callback to handle click events on the chart.
      onClick: (event, elements, chart) => {
        if (elements.length) {
          // Get the first clicked element
          const firstElement = elements[0];
          const label = chart.data.labels[firstElement.index];
          // Check if the clicked segment is the "Other" slice.
          if (label === "Other") {
            viewByLocationModal.classList.remove(HIDDEN);
          }
        }
      },
    },
  });
}

// Device
/**
 * Updates the modal device chart with a bar chart displaying device usage statistics.
 *
 * The chart is rendered on a canvas element with the ID "overlayDeviceChart".
 * It displays the usage of different devices (Linux, Mac, iOS, Windows, Android, Other)
 * with specific colors and rounded corners for each bar.
 *
 * Chart Configuration:
 * - Type: Bar chart
 * - Data:
 *   - Labels: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"]
 *   - Datasets:
 *     - Data: [10, 25, 15, 30, 8, 12]
 *     - Background Colors: ["#a34df0", "#f0a34d", "#000000", "#4f86f0", "#add8e6", "#c4c4c4"]
 *     - Bar Styling: Rounded corners, specific bar thickness
 * - Options:
 *   - Responsive: True
 *   - Maintain Aspect Ratio: False
 *   - Plugins:
 *     - Legend: Hidden
 *   - Scales:
 *     - X-axis:
 *       - Grid: Hidden
 *       - Ticks: Hidden
 *       - Bar Percentage: 0.1
 *       - Category Percentage: 0.2
 *     - Y-axis:
 *       - Grid: Hidden
 *       - Ticks: Gray color, values appended with 'K'
 */
function updateModalDevice() {
  const ctx = document.getElementById("overlayDeviceChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"], // X-axis labels
      datasets: [
        {
          data: [10, 25, 15, 30, 8, 12], // Bar values
          backgroundColor: [
            "#a34df0", // Linux
            "#f0a34d", // Mac
            "#000000", // iOS
            "#4f86f0", // Windows
            "#add8e6", // Android
            "#c4c4c4", // Other
          ],
          borderRadius: 10, // Rounded corners
          borderSkipped: false, // Ensures all sides of the bar are rounded
          barThickness: 28, // Explicitly set bar width in pixels
          maxBarThickness: 40, // Max width in pixels
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Makes the chart fit nicely in the container
      plugins: {
        legend: {
          display: false, // Hides the legend since it's not in the design
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Completely hide grid lines on the x-axis
            drawBorder: false, // Ensure the bottom border is removed
            color: "#fff",
          },
          ticks: {
            //     display: true,
          },
          barPercentage: 0.1, // Reduce bar width (0.0 to 1.0, default is 0.9)
          categoryPercentage: 0.2, // Controls spacing between categories
        },
        y: {
          grid: {
            display: false, // Hide grid lines on the y-axis
            drawBorder: false, // Remove the left border
            color: "#fff",
          },
          ticks: {
            color: "#7a7a7a", // Gray color for labels
            callback: function (value) {
              return value + "K"; // Add 'K' to values (e.g., 10K, 20K)
            },
          },
        },
      },
    },
  });
}

// Get the element that will display the user list
const analyticsItemLists = document.getElementById("analyticsItemLists");

/**
 * Function to update the analytics overlay user list
 * @param {Array} data - Array of user objects with `photo`, `name`, and other attributes
 */
function updateAnalyticsOverlayUserListsSkeleton() {
  analyticsItemLists.innerHTML = "";
  Array.from({ length: 30 }, (_, i) => i + 1).map((ske) => {
    const markup = `<li class="user-skeleton skeleton_loading"></li>`;
    analyticsItemLists.insertAdjacentHTML("beforeend", markup);
  });
}

function updateAnalyticsOverlayUserLists(data) {
  if (!Array.isArray(data)) {
    console.error("Invalid data format: Expected an array.");
    return; // Early exit if data is not an array
  }

  // Clear the current list
  analyticsItemLists.innerHTML = "";

  // Loop through the data and create markup for each user
  data.forEach((user) => {
    // Ensure necessary user properties exist to avoid errors
    const { photo = "default-photo.jpg", name = "Unknown User" } = user;

    const markup = `
      <li>
        <a href="/profile.html"><img src="${photo}" alt="${name}" /></a>
        <h4>${name}</h4>
        <button>
          <span><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path stroke="#ffffff" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"></path><path fill="#ffffff" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"></path></g></svg></span>
          <span>Collaborate</span>
        </button>
      </li>
    `;

    // Append the markup to the list
    analyticsItemLists.insertAdjacentHTML("beforeend", markup);
  });

  // Smoothly scroll to the first list item (if any exist)
  const firstListItem = analyticsItemLists.querySelector("li");
  if (firstListItem) {
    firstListItem.scrollIntoView({ behavior: "smooth" });
  }
}

// Get the filter header element
const filterListsHeader = document.getElementById("filterListsHeader");

// Add an event listener for filter button clicks
filterListsHeader.addEventListener("click", (e) => {
  // Find the closest button element to the click event
  const button = e.target.closest("button");
  const allButtons = filterListsHeader.querySelectorAll("button");

  if (button) {
    // Extract the data-category attribute from the clicked button
    const { category } = button.dataset;

    allButtons.forEach((button) => button.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    // Check if usersData is defined and is an array to prevent runtime errors
    if (!Array.isArray(usersData)) {
      console.error("usersData is not defined or not an array.");
      return; // Early exit if usersData is invalid
    }

    // Filter and update the user list based on the selected category
    if (category === "all") {
      updateAnalyticsOverlayUserLists(usersData);
    } else if (category === "followers") {
      updateAnalyticsOverlayUserLists(usersData.filter((user) => user.followers));
    } else {
      updateAnalyticsOverlayUserLists(usersData.filter((user) => !user.followers));
    }
  }
});

// Filter By Head Count
const filterByAgeCount = document.getElementById("filterByAgeCount");

filterByAgeCount.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const { count } = button.dataset;

    filterByAgeCount.querySelectorAll("button").forEach((btn) => btn.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    // 13-18
    if (count === "13-18") {
      return updateAnalyticsOverlayUserLists(usersData.filter((user) => user.range >= 13 && user.range <= 18));
    }

    // 19-24
    if (count === "19-24") {
      return updateAnalyticsOverlayUserLists(usersData.filter((user) => user.range >= 19 && user.range <= 24));
    }

    // 25-40 (Fixed: Previously mislabeled as "19-24")
    if (count === "25-40") {
      return updateAnalyticsOverlayUserLists(usersData.filter((user) => user.range >= 25 && user.range <= 40));
    }

    // 41 above
    if (count === "41-above") {
      return updateAnalyticsOverlayUserLists(usersData.filter((user) => user.range >= 41));
    }
  }
});
