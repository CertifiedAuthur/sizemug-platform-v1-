document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter_christmas button");

  function unActivateOtherButtons() {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", async function (e) {
      unActivateOtherButtons();
      const gridContainerEl = document.querySelector(".gridContainer");

      gridContainerSkeleton.classList.remove(HIDDEN);
      gridContainerEl.innerHTML = "";
      renderGridContainerSkeleton();

      const data = await generateUsersWithTasks();
      if (data) {
        gridContainerSkeleton.classList.add(HIDDEN);
        populateGridLayout(data, gridContainerEl);
        gridDataItem = data;
      }

      this.classList.add("active");
    });
  });

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
