const coveredSkeletonLoading = document.getElementById("coveredSkeletonLoading");
const liveMainPageContainer = document.getElementById("liveMainPageContainer");

// Render Grid Skeleton
Array.from({ length: 15 }, (_, i) => i + 1).forEach(() => {
  const markup = `
        <div class="live-loading-grid-item">
                <div class="live-loading-grid-item-head skeleton-loading"></div>

                <div class="live-loading-grid-item-content">
                <div class="live-loading-grid-item-content-profile skeleton-loading"></div>

                <div style="width: 100%">
                <div class="live-loading-grid-item-content-title skeleton-loading"></div>
                <div class="live-loading-grid-item-content-desc skeleton-loading"></div>
                </div>
                </div>
        </div>
  `;

  const firstSkeletonGridContainer = document.getElementById("firstSkeletonGridContainer");
  const secondSkeletonGridContainer = document.getElementById("secondSkeletonGridContainer");

  firstSkeletonGridContainer.insertAdjacentHTML("beforeend", markup);
  secondSkeletonGridContainer.insertAdjacentHTML("beforeend", markup);
});

// After 3 seconds of loading the live main page will show
setTimeout(() => {
  coveredSkeletonLoading.remove();
  liveMainPageContainer.classList.remove(HIDDEN);
}, 3000);
