// Add a state variable to track if tooltip is locked
let isTooltipLocked = false;

// Select canvas and tooltip elements
const ctx = document.getElementById("analysisTMCChart").getContext("2d");
const tooltip = document.getElementById("analysisTMCChartTooltip");

// Define labels for different views
const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthlyLabels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const yearlyLabels = ["2019", "2020", "2021", "2022", "2023", "2024"];

// Define data for each view
const weeklyData1 = [10, 15, 20, 25, 18, 22, 30];
const weeklyData2 = [5, 12, 18, 24, 16, 20, 28];
const monthlyData1 = [120, 150, 180, 200, 190, 170, 160, 220, 230, 240, 250, 260];
const monthlyData2 = [110, 140, 170, 210, 200, 180, 150, 200, 220, 230, 240, 250];
const yearlyData1 = [500, 600, 700, 800, 900, 1000];
const yearlyData2 = [450, 550, 650, 750, 850, 950];

// Create gradients
const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
gradient1.addColorStop(0, "#b35eff");
gradient1.addColorStop(1, "#b35eff00");

const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
gradient2.addColorStop(0, "#5eb3ff");
gradient2.addColorStop(1, "#5eb3ff00");

// Define datasets
const dataset1 = {
  label: "Dataset 1",
  data: weeklyData1, // Default to weekly data
  borderColor: "#B35EFF",
  backgroundColor: gradient1,
  fill: true,
  pointRadius: 5,
  tension: 0.4,
};

const dataset2 = {
  label: "Dataset 2",
  data: weeklyData2, // Default to weekly data
  borderColor: "#5EB3FF",
  backgroundColor: gradient2,
  fill: true,
  pointRadius: 5,
  tension: 0.4,
};

// Initialize chart
const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: weeklyLabels, // Default labels
    datasets: [dataset1], // Default dataset
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#999" },
      },
      y: {
        grid: { display: false },
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}%`,
          color: "#999",
        },
      },
    },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    hover: { mode: "index", intersect: false },
  },
});

// Toggle dataset function
function toggleBetweenMissedAndProgressGraphData() {
  if (chart.data.datasets[0] === dataset1) {
    chart.data.datasets[0] = dataset2;
  } else {
    chart.data.datasets[0] = dataset1;
  }
  chart.update();
}

// Custom Tooltip Logic
document.getElementById("analysisTMCChart").addEventListener("mousemove", (event) => {
  if (isTooltipLocked) return;

  const points = chart.getElementsAtEventForMode(event, "index", { intersect: false }, false);

  if (points.length) {
    const point = points[0]; // Get the first matching point
    const datasetIndex = point.datasetIndex;
    const dataIndex = point.index;

    const dataset = chart.data.datasets[datasetIndex];
    const label = chart.data.labels[dataIndex];
    const value = dataset.data[dataIndex];

    // Position the tooltip
    const rect = chart.canvas.getBoundingClientRect();
    tooltip.style.left = `${event.clientX - rect.left}px`;
    tooltip.style.top = `${event.clientY - rect.top - 20}px`;
    tooltip.style.display = "block";
  } else {
    if (!isTooltipLocked) tooltip.style.display = "none";
  }
});

// Click event to lock/unlock tooltip
document.getElementById("analysisTMCChart").addEventListener("click", (event) => {
  const points = chart.getElementsAtEventForMode(event, "index", { intersect: false }, false);

  if (points.length) {
    isTooltipLocked = true;

    const rect = chart.canvas.getBoundingClientRect();
    tooltip.style.left = `${event.clientX - rect.left}px`;
    tooltip.style.top = `${event.clientY - rect.top - 20}px`;
    tooltip.style.display = "block";
    tooltip.classList.add("show-tooltip");
  }
});

// Click outside to hide tooltip
document.addEventListener("click", (event) => {
  if (!tooltip.contains(event.target) && !event.target.matches("#analysisTMCChart")) {
    isTooltipLocked = false;
    tooltip.style.display = "none";
  }
});

// Mouseleave event to hide tooltip if not locked
document.getElementById("analysisTMCChart").addEventListener("mouseleave", () => {
  if (!isTooltipLocked) tooltip.style.display = "none";
});

// Toggle view function
function toggleView(view) {
  switch (view) {
    case "weekly":
      chart.data.labels = weeklyLabels;
      chart.data.datasets[0].data = chart.data.datasets[0] === dataset1 ? weeklyData1 : weeklyData2;
      break;
    case "monthly":
      chart.data.labels = monthlyLabels;
      chart.data.datasets[0].data = chart.data.datasets[0] === dataset1 ? monthlyData1 : monthlyData2;
      break;
    case "yearly":
      chart.data.labels = yearlyLabels;
      chart.data.datasets[0].data = chart.data.datasets[0] === dataset1 ? yearlyData1 : yearlyData2;
      break;
    default:
      console.error("Invalid view");
      return;
  }
  chart.update();
}

// Buttons to switch views
const weeklyMonthlyYearlyButton = document.getElementById("weeklyMonthlyYearlyButton");

weeklyMonthlyYearlyButton.addEventListener("click", function (e) {
  const button = e.target.closest("button");

  if (button) {
    const buttons = this.querySelectorAll("button");

    buttons.forEach((btn) => btn.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    const view = button.dataset.view;

    toggleView(view);
  }
});

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
 */
