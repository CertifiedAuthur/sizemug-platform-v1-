// Audience Analytics Management
const audienceTabButtons = document.querySelectorAll("#audienceStatContainer .creator_stat_dropdowns button");
const audienceStatsGrid = document.getElementById("audienceStatsGrid");
let audienceChart = null;

// Data for different categories
const audienceData = {
  gender: {
    total: "12.4M",
    chartData: [50, 50],
    chartColors: ["#F59E0B", "#3B82F6"],
    stats: [
      { label: "Male", value: "6,543,345", percentage: "50%", color: "#F59E0B" },
      { label: "Female", value: "6,543,345", percentage: "50%", color: "#3B82F6" },
    ],
  },
  age: {
    total: "12.4M",
    chartData: [40, 20, 10, 30],
    chartColors: ["#F59E0B", "#3B82F6", "#F97316", "#10B981"],
    stats: [
      { label: "80 above", value: "543,345", percentage: "40%", color: "#F59E0B" },
      { label: "40-80", value: "543,345", percentage: "20%", color: "#3B82F6" },
      { label: "18-40", value: "3,300", percentage: "10%", color: "#F97316" },
      { label: "Under 18", value: "543,345", percentage: "30%", color: "#10B981" },
    ],
  },
  locations: {
    total: "12.4M",
    chartData: [50, 50, 50, 50, 50, 50, 50, 50],
    chartColors: ["#F59E0B", "#F97316", "#EF4444", "#EC4899", "#3B82F6", "#10B981", "#84CC16", "#D1D5DB"],
    stats: [
      { label: "United Kingdom", value: "543,345", percentage: "50%", color: "#F59E0B" },
      { label: "Portugal", value: "543,345", percentage: "50%", color: "#3B82F6" },
      { label: "South Africa", value: "543,345", percentage: "50%", color: "#F97316" },
      { label: "Nigeria", value: "543,345", percentage: "50%", color: "#10B981" },
      { label: "Ghana", value: "543,345", percentage: "50%", color: "#EF4444" },
      { label: "Togo", value: "543,345", percentage: "50%", color: "#84CC16" },
      { label: "Italy", value: "543,345", percentage: "50%", color: "#EC4899" },
      { label: "Others", value: "543,345", percentage: "50%", color: "#D1D5DB" },
    ],
  },
  devices: {
    total: "12.4M",
    chartData: [50, 50, 50, 50],
    chartColors: ["#F59E0B", "#F97316", "#3B82F6", "#10B981"],
    stats: [
      { label: "Mobile", value: "543,345", percentage: "50%", color: "#F59E0B" },
      { label: "Tablet", value: "543,345", percentage: "50%", color: "#3B82F6" },
      { label: "Desktop", value: "543,345", percentage: "50%", color: "#F97316" },
      { label: "App", value: "543,345", percentage: "50%", color: "#10B981" },
    ],
  },
};

// Initialize Chart.js donut chart
function initAudienceChart(category = "gender") {
  const canvas = document.getElementById("audienceDonutChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const data = audienceData[category];

  // Destroy existing chart if it exists
  if (audienceChart) {
    audienceChart.destroy();
  }

  // Create new donut chart
  audienceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: data.chartData,
          backgroundColor: data.chartColors,
          borderWidth: 0,
          borderRadius: 0,
          spacing: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "95%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  });

  // Update total display
  const totalNumber = document.querySelector(".audience-total .total-number");
  if (totalNumber) {
    totalNumber.textContent = data.total;
  }
}

// Render statistics grid
function renderAudienceStats(category) {
  if (!audienceStatsGrid) return;

  const data = audienceData[category];
  audienceStatsGrid.innerHTML = "";

  // Determine grid layout based on number of items
  const itemCount = data.stats.length;
  if (itemCount <= 2) {
    audienceStatsGrid.style.gridTemplateColumns = "1fr 1fr";
  } else if (itemCount <= 4) {
    audienceStatsGrid.style.gridTemplateColumns = "1fr 1fr";
  } else {
    audienceStatsGrid.style.gridTemplateColumns = "1fr 1fr";
  }

  data.stats.forEach((stat) => {
    const statItem = document.createElement("div");
    statItem.className = "audience-stat-item";
    statItem.innerHTML = `
      <div class="stat-indicator" style="background: ${stat.color};"></div>
      <div class="stat-info">
        <span class="stat-label">${stat.label}</span>
        <span class="stat-value">${stat.value}</span>
        <span class="stat-separator">-</span>
        <span class="stat-percentage">${stat.percentage}</span>
      </div>
    `;
    audienceStatsGrid.appendChild(statItem);
  });
}

// Handle tab switching
function switchAudienceTab(category) {
  // Update chart and stats
  initAudienceChart(category);
  renderAudienceStats(category);
}

// Initialize tab buttons
if (audienceTabButtons.length > 0) {
  audienceTabButtons.forEach((button, index) => {
    const categories = ["gender", "age", "locations", "devices"];
    const category = categories[index];

    button.addEventListener("click", () => {
      // Update active state
      audienceTabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Switch to selected category
      switchAudienceTab(category);
    });
  });
}

// Initialize with Gender tab
if (document.getElementById("audienceDonutChart")) {
  // Wait for Chart.js to load
  if (typeof Chart !== "undefined") {
    initAudienceChart("gender");
    renderAudienceStats("gender");
  } else {
    // If Chart.js not loaded yet, wait for it
    window.addEventListener("load", () => {
      if (typeof Chart !== "undefined") {
        initAudienceChart("gender");
        renderAudienceStats("gender");
      }
    });
  }
}
