const gridContainerSkeleton = document.getElementById("gridContainerSkeleton");

function renderGridContainerSkeleton() {
  const dummyHeights = Array.from({ length: 50 }, (_, i) => {
    return getRandomNumber(250, 400);
  });

  dummyHeights.forEach((height) => {
    const html = `<div style="height: ${height}px" class="gridContainerSkeleton--item skeleton---loading"></div>`;
    gridContainerSkeleton.insertAdjacentHTML("beforeend", html);
  });

  dashboardGridSkeletonInstance = new Masonry(gridContainerSkeleton, {
    itemSelector: ".gridContainerSkeleton--item",
    columnWidth: ".gridContainerSkeleton--item",
    percentPosition: true,
    gutter: 16,
  });

  dashboardGridSkeletonInstance.layout();
}
