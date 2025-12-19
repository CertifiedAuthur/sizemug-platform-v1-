// let gridDataItem;
let suggestionGridDataItem;
let suggestionScrollingData;
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

// Suggestion
const suggestionGridContainerSkeleton = document.getElementById("suggestionGridContainerSkeleton");
function renderSuggestionGridContainerSkeleton() {
  if (!suggestionGridContainerSkeleton) return;
  const dummyHeights = Array.from({ length: 100 }, (_, i) => {
    return getRandomNumber(250, 400);
  });

  dummyHeights.forEach((height) => {
    const html = `<div style="height: ${height}px" class="suggestionGridContainerSkeleton--item skeleton---loading"></div>`;
    suggestionGridContainerSkeleton.insertAdjacentHTML("beforeend", html);
  });

  if (typeof Masonry === "function") {
    masonrySuggestionGridContainerSkeleton = new Masonry(suggestionGridContainerSkeleton, {
      itemSelector: ".suggestionGridContainerSkeleton--item",
      columnWidth: ".suggestionGridContainerSkeleton--item",
      percentPosition: true,
      gutter: 16,
    });

    masonrySuggestionGridContainerSkeleton.layout();
  }
}
