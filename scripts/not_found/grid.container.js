document.addEventListener("DOMContentLoaded", () => {
  // I have to must the call here so that masonry layout will be well organized
  ///////// IIFE for landing task display
  (async () => {
    renderGridContainerSkeleton();

    const data = await generateUsersWithTasks();
    if (data) {
      gridContainerSkeleton.remove();
      const gridContainerEl = document.querySelector(".gridContainer");
      populateGridLayout(data, gridContainerEl);
      gridDataItem = data;
    }
  })();
});
