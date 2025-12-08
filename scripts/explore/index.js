document.addEventListener("DOMContentLoaded", () => {
  const gridContainerEl = document.querySelector(".gridContainer");

  ///////// IIFE for grid view
  (async () => {
    renderGridContainerSkeleton();

    const data = await generateUsersWithTasks();
    if (data) {
      gridContainerSkeleton.remove();

      populateGridLayout(data, gridContainerEl);

      gridDataItem = data;
    }
  })();

  /**
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   *
   */

  const explorePageTab = document.getElementById("explorePageTab");

  function renderExploreTabItem() {
    sizemugGlobalInterests.forEach((int) => {
      const markup = `
      <label data-tab="${int.value}" class="chip">
        <input type="radio" name="tab" hidden />
        <span><img width="20" height="20" src="${int.icon}" alt=""/>  ${int.label}</span>
      </label>`;
      explorePageTab.insertAdjacentHTML("beforeend", markup);
    });
  }

  renderExploreTabItem();

  explorePageTab.addEventListener("click", (e) => {
    const label = e.target.closest("label");

    if (label) {
      const { tab } = label.dataset;

      gridContainerEl.innerHTML = "";

      if (tab === "all") {
        return populateGridLayout(gridDataItem, gridContainerEl);
      }

      if (tab) {
        const exploreItems = gridDataItem.filter((explore) => explore.liveTag === tab) ?? [];
        populateGridLayout(exploreItems, gridContainerEl);
      }
    }
  });
});
