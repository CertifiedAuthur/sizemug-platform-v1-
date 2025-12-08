// Sample data
const items = [
  { id: 1, title: "Project Management Project Management Project Management Project Management Project Management", status: "ongoing", progress: 60 },
  { id: 2, title: "Requirements Gathering", status: "pending", progress: 40 },
  { id: 3, title: "Business Case", status: "ongoing", progress: 75 },
  { id: 4, title: "Project Planning", status: "completed", progress: 100 },
  { id: 5, title: "Design Phase", status: "ongoing", progress: 30 },
  { id: 6, title: "Development", status: "pending", progress: 0 },
  { id: 7, title: "Testing", status: "ongoing", progress: 45 },
  { id: 8, title: "Deployment", status: "pending", progress: 15 },
];

function createMasonryLayout() {
  const grid = document.getElementById("task_tablet_list--grid");
  grid.innerHTML = "";

  // Create a temporary container for measurements
  const tempContainer = document.createElement("div");
  tempContainer.style.cssText = "position: absolute; visibility: hidden; width: 280px;";
  document.body.appendChild(tempContainer);

  const storedTask = getLocalStorage();

  // Measure all items
  const itemsWithHeight = storedTask.map((item) => {
    const itemElement = createItemElement(item);
    tempContainer.appendChild(itemElement);
    const height = itemElement.offsetHeight;
    tempContainer.removeChild(itemElement);
    return { ...item, measuredHeight: height };
  });

  // Remove the temporary container
  document.body.removeChild(tempContainer);

  // Distribute items into columns
  const columns = distributeItemsIntoColumns(itemsWithHeight);

  // Create and append columns
  columns.forEach((columnItems) => {
    const column = document.createElement("div");
    column.className = "tablet_masonry-column";

    columnItems.forEach((item) => {
      const itemElement = createItemElement(item);
      column.appendChild(itemElement);
    });

    grid.appendChild(column);
  });
}

function createItemElement(item) {
  const itemElement = document.createElement("div");
  itemElement.className = "masonry-item";

  itemElement.innerHTML = taskListApp.generateTaskMarkup(item);
  return itemElement;
}

function distributeItemsIntoColumns(itemsWithHeight) {
  const columns = [[]];
  let currentColumn = 0;
  const maxColumnHeight = 360 - 16; // Maximum height minus last gap
  let currentColumnHeight = 0;

  itemsWithHeight.forEach((item) => {
    const itemHeightWithGap = item.measuredHeight + 16; // Add gap

    // Check if adding this item would exceed the max height
    if (currentColumnHeight + itemHeightWithGap > maxColumnHeight) {
      // Start a new column
      currentColumn++;
      columns[currentColumn] = [];
      currentColumnHeight = 0;
    }

    columns[currentColumn].push(item);
    currentColumnHeight += itemHeightWithGap;
  });

  return columns;
}

function scrollGrid(direction) {
  const container = document.getElementById("masonryScroll");
  const scrollAmount = 300;

  if (direction === "left") {
    container.scrollLeft -= scrollAmount;
  } else {
    container.scrollLeft += scrollAmount;
  }
}

// Initialize the grid
createMasonryLayout();

// Add smooth scroll behavior for mouse wheel
document.getElementById("task_tablet_list--scroll").addEventListener("wheel", (e) => {
  if (e.deltaY !== 0) {
    e.preventDefault();
    e.currentTarget.scrollLeft += e.deltaY;
  }
});

// Optional: Recalculate layout on window resize
window.addEventListener("resize", createMasonryLayout);
