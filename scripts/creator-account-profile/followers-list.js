// Followers List Management
const followersList = document.getElementById("creatorFollowers");
const similarCreatorFollowers = document.getElementById("similarCreatorFollowers");

const followersSearchInput = document.getElementById("followersSearchInput");
const filterTabs = document.querySelectorAll(".filter-tab");
const loadMoreBtn = document.getElementById("loadMoreFollowers");
const loadMoreSimilarCreatorFollowers = document.getElementById("loadMoreSimilarCreatorFollowers");

let currentFilter = "most-recent";
let currentPage = 1;
let allFollowers = [];

// Sample follower data structure
function generateFollowerData(count = 5) {
  const followers = [];
  for (let i = 0; i < count; i++) {
    followers.push({
      id: Date.now() + i,
      name: "Darrell Steward",
      avatar: "https://i.pravatar.cc/150?img=" + (i + 1),
      isFollowing: false,
    });
  }
  return followers;
}

// Render a single follower item
function renderFollowerItem(follower, showActions = false) {
  const actionsHTML = showActions
    ? `
    <div class="follower-actions">
      <button class="action-btn block">Block</button>
      <button class="action-btn view-profile">View profile</button>
      <button class="action-btn close-btn" data-action="close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="action-btn follow-btn ${follower.isFollowing ? "following" : ""}" data-id="${follower.id}">
        ${follower.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  `
    : `
    <div class="follower-actions">
      <button class="action-btn more-btn" data-id="${follower.id}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
        </svg>
      </button>
      <button class="action-btn follow-btn ${follower.isFollowing ? "following" : ""}" data-id="${follower.id}">
        ${follower.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  `;

  return `
    <div class="follower-item" data-id="${follower.id}">
      <div class="follower-info">
        <img src="${follower.avatar}" alt="${follower.name}" class="follower-avatar" />
        <span class="follower-name">${follower.name}</span>
      </div>
      ${actionsHTML}
    </div>
  `;
}

// Render all followers
function renderFollowers(followers, append = false, targetList = "both") {
  if (!append) {
    if (targetList === "both" || targetList === "main") {
      if (followersList) followersList.innerHTML = "";
    }
    if (targetList === "both" || targetList === "similar") {
      if (similarCreatorFollowers) similarCreatorFollowers.innerHTML = "";
    }
  }

  followers.forEach((follower) => {
    const showFullActions = false;
    const html = renderFollowerItem(follower, showFullActions);

    if ((targetList === "both" || targetList === "main") && followersList) {
      followersList.insertAdjacentHTML("beforeend", html);
    }
    if ((targetList === "both" || targetList === "similar") && similarCreatorFollowers) {
      similarCreatorFollowers.insertAdjacentHTML("beforeend", html);
    }
  });
}

// Filter followers based on search
function filterFollowers(searchTerm) {
  const filtered = allFollowers.filter((follower) => follower.name.toLowerCase().includes(searchTerm.toLowerCase()));
  renderFollowers(filtered);
}

// Handle filter tab clicks
filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active state
    filterTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    currentFilter = tab.dataset.filter;
    currentPage = 1;

    // In a real app, you'd fetch filtered data from API
    // For now, just re-render existing data
    renderFollowers(allFollowers.slice(0, currentPage * 5));
  });
});

// Handle search input
if (followersSearchInput) {
  followersSearchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm) {
      filterFollowers(searchTerm);
    } else {
      renderFollowers(allFollowers.slice(0, currentPage * 5));
    }
  });
}

// Handle load more for main followers list
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    const newFollowers = generateFollowerData(5);
    allFollowers = [...allFollowers, ...newFollowers];

    // Append only to main followers list
    newFollowers.forEach((follower) => {
      followersList.insertAdjacentHTML("beforeend", renderFollowerItem(follower, false));
    });
  });
}

// Handle load more for similar creator followers
if (loadMoreSimilarCreatorFollowers) {
  loadMoreSimilarCreatorFollowers.addEventListener("click", () => {
    const newFollowers = generateFollowerData(5);

    // Append only to similar creator followers list
    newFollowers.forEach((follower) => {
      similarCreatorFollowers.insertAdjacentHTML("beforeend", renderFollowerItem(follower, false));
    });
  });
}

// Handle follow button clicks with event delegation
function handleFollowerActions(e) {
  const followBtn = e.target.closest(".follow-btn");
  const moreBtn = e.target.closest(".more-btn");
  const closeBtn = e.target.closest('[data-action="close"]');
  const blockBtn = e.target.closest(".block");
  const viewProfileBtn = e.target.closest(".view-profile");

  if (followBtn) {
    const followerId = followBtn.dataset.id;
    const follower = allFollowers.find((f) => f.id == followerId);

    if (follower) {
      follower.isFollowing = !follower.isFollowing;
      followBtn.textContent = follower.isFollowing ? "Following" : "Follow";
      followBtn.classList.toggle("following");
    }
  }

  if (moreBtn) {
    const followerItem = moreBtn.closest(".follower-item");
    const followerId = followerItem.dataset.id;
    const follower = allFollowers.find((f) => f.id == followerId);

    if (follower) {
      // Replace the follower item with full actions version
      const newHTML = renderFollowerItem(follower, true);
      followerItem.outerHTML = newHTML;
    }
  }

  if (closeBtn) {
    const followerItem = closeBtn.closest(".follower-item");
    const followerId = followerItem.dataset.id;
    const follower = allFollowers.find((f) => f.id == followerId);

    if (follower) {
      // Replace back to dots menu version
      const newHTML = renderFollowerItem(follower, false);
      followerItem.outerHTML = newHTML;
    }
  }

  if (blockBtn) {
    const followerItem = blockBtn.closest(".follower-item");
    const followerId = followerItem.dataset.id;
    console.log("Block user:", followerId);
    // Add your block logic here
    followerItem.style.opacity = "0.5";
  }

  if (viewProfileBtn) {
    const followerItem = viewProfileBtn.closest(".follower-item");
    const followerId = followerItem.dataset.id;
    console.log("View profile:", followerId);
    // Add your view profile logic here
    // window.location.href = `/profile/${followerId}`;
  }
}

// Attach event listeners to both lists
if (followersList) {
  followersList.addEventListener("click", handleFollowerActions);
}

if (similarCreatorFollowers) {
  similarCreatorFollowers.addEventListener("click", handleFollowerActions);
}

// Initialize with sample data
function initFollowersList() {
  allFollowers = generateFollowerData(5);
  renderFollowers(allFollowers, false, "both");
}

// Initialize when DOM is ready
if (followersList || similarCreatorFollowers) {
  initFollowersList();
}
