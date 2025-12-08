// Reusable Analytics Chart Class
class AnalyticsChart {
  constructor(canvasId, config = {}) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(canvasId);

    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    if (typeof Chart === "undefined") {
      console.error("Chart.js not loaded");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    this.container = this.canvas.closest('[id$="StatContainer"]') || this.canvas.closest(".statistics_analysis-container");

    // Configuration
    this.metrics = config.metrics || this.getDefaultMetrics();
    this.labels = config.labels || this.getDefaultLabels();
    this.currentMetric = config.defaultMetric || Object.keys(this.metrics)[0];

    // Initialize
    this.init();
  }

  getDefaultMetrics() {
    return {
      followers: {
        label: "Followers",
        data: [1200, 1800, 1400, 2800, 4200, 3800, 5200, 6800, 6200, 7800, 8400, 8200, 8800, 8600],
        suffix: " followers",
        color: "#6366f1",
      },
      "new-followers": {
        label: "New Followers",
        data: [800, 1200, 900, 1800, 2800, 2400, 3200, 4200, 3800, 4800, 5200, 5000, 5400, 5200],
        suffix: " new followers",
        color: "#8b5cf6",
      },
      "lost-followers": {
        label: "Lost Followers",
        data: [200, 300, 250, 400, 600, 500, 700, 900, 800, 1000, 1100, 1050, 1150, 1100],
        suffix: " lost followers",
        color: "#ec4899",
      },
      "return-viewers": {
        label: "Return Viewers",
        data: [3000, 3500, 3200, 4500, 6000, 5500, 7000, 8500, 8000, 9500, 10000, 9800, 10500, 10200],
        suffix: " return viewers",
        color: "#10b981",
      },
    };
  }

  getDefaultLabels() {
    return ["Mon\n15", "Tue\n16", "Wed\n17", "Thu\n18", "Fri\n19", "Sat\n20", "Sun\n21", "Mon\n22", "Tue\n23", "Wed\n24", "Thu\n25", "Fri\n26", "Sat\n27", "Sun\n28"];
  }

  createGradient(color) {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 300);
    const rgb = this.hexToRgb(color);
    gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
    gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.0)`);
    return gradient;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 99, g: 102, b: 241 };
  }

  init() {
    const currentColor = this.metrics[this.currentMetric].color;

    this.chart = new Chart(this.ctx, {
      type: "line",
      data: {
        labels: this.labels,
        datasets: [
          {
            label: this.metrics[this.currentMetric].label,
            data: this.metrics[this.currentMetric].data,
            borderColor: currentColor,
            backgroundColor: this.createGradient(currentColor),
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: currentColor,
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "#fff",
            titleColor: "#111827",
            bodyColor: "#6b7280",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              size: 13,
              weight: "600",
            },
            bodyFont: {
              size: 14,
              weight: "700",
            },
            callbacks: {
              label: (context) => {
                return context.parsed.y.toLocaleString() + this.metrics[this.currentMetric].suffix;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#f3f4f6",
              drawBorder: false,
            },
            ticks: {
              color: "#9ca3af",
              font: {
                size: 11,
              },
              callback: function (value) {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + "M";
                }
                if (value >= 1000) {
                  return value / 1000 + "K";
                }
                return value;
              },
            },
          },
        },
        animation: {
          duration: 750,
          easing: "easeInOutQuart",
        },
      },
    });

    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.container) return;

    // Handle stat card clicks
    const statCards = this.container.querySelectorAll(".analytics-stat-card");
    statCards.forEach((card) => {
      card.addEventListener("click", () => {
        const metric = card.getAttribute("data-metric");
        if (this.metrics[metric] && metric !== this.currentMetric) {
          this.switchMetric(metric, statCards, card);
        }
      });
    });

    // Handle filter dropdown
    const filterBtn = this.container.querySelector(".filter_stat button");
    const filterDropdown = this.container.querySelector(".filter_stat ul");

    if (filterBtn && filterDropdown) {
      filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = filterDropdown.getAttribute("aria-expanded") === "true";
        filterDropdown.setAttribute("aria-expanded", !isExpanded);
      });

      const filterOptions = filterDropdown.querySelectorAll("li");
      filterOptions.forEach((option) => {
        option.addEventListener("click", () => {
          const value = option.textContent.trim();
          filterBtn.textContent = value;
          filterOptions.forEach((opt) => opt.setAttribute("aria-selected", "false"));
          option.setAttribute("aria-selected", "true");
          filterDropdown.setAttribute("aria-expanded", "false");

          // Trigger custom event for filter change
          this.canvas.dispatchEvent(new CustomEvent("filterChange", { detail: { value } }));
        });
      });

      document.addEventListener("click", (e) => {
        if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
          filterDropdown.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  switchMetric(metric, statCards, activeCard) {
    // Update active state
    statCards.forEach((c) => c.classList.remove("active"));
    activeCard.classList.add("active");

    // Update current metric
    this.currentMetric = metric;
    const newColor = this.metrics[metric].color;

    // Update chart
    this.chart.data.datasets[0].label = this.metrics[metric].label;
    this.chart.data.datasets[0].data = this.metrics[metric].data;
    this.chart.data.datasets[0].borderColor = newColor;
    this.chart.data.datasets[0].backgroundColor = this.createGradient(newColor);
    this.chart.data.datasets[0].pointHoverBackgroundColor = newColor;

    this.chart.update();
  }

  updateData(metric, newData) {
    if (this.metrics[metric]) {
      this.metrics[metric].data = newData;
      if (metric === this.currentMetric) {
        this.chart.data.datasets[0].data = newData;
        this.chart.update();
      }
    }
  }

  updateAllData(newMetrics) {
    Object.keys(newMetrics).forEach((metric) => {
      if (this.metrics[metric]) {
        this.metrics[metric].data = newMetrics[metric].data;
      }
    });
    this.chart.data.datasets[0].data = this.metrics[this.currentMetric].data;
    this.chart.update();
  }

  destroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

// Auto-initialize charts on DOM load
document.addEventListener("DOMContentLoaded", function () {
  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded");
    return;
  }

  // Chart configurations
  const chartConfigs = {
    postDetailChart: {
      metrics: {
        views: {
          label: "Views",
          data: [2000, 1500, 3000, 2500, 4000, 3500, 5000],
          suffix: " views",
          color: "#3b82f6",
        },
      },
      labels: ["Mon\n15", "Tue\n16", "Wed\n17", "Thu\n18", "Fri\n19", "Sat\n20", "Sun\n21"],
      defaultMetric: "views",
    },
    followersChart: {
      metrics: {
        followers: {
          label: "Followers",
          data: [1200, 1800, 1400, 2800, 4200, 3800, 5200, 6800, 6200, 7800, 8400, 8200, 8800, 8600],
          suffix: " followers",
          color: "#6366f1",
        },
        "new-followers": {
          label: "New Followers",
          data: [800, 1200, 900, 1800, 2800, 2400, 3200, 4200, 3800, 4800, 5200, 5000, 5400, 5200],
          suffix: " new followers",
          color: "#8b5cf6",
        },
        "lost-followers": {
          label: "Lost Followers",
          data: [200, 300, 250, 400, 600, 500, 700, 900, 800, 1000, 1100, 1050, 1150, 1100],
          suffix: " lost followers",
          color: "#ec4899",
        },
        "return-viewers": {
          label: "Return Viewers",
          data: [3000, 3500, 3200, 4500, 6000, 5500, 7000, 8500, 8000, 9500, 10000, 9800, 10500, 10200],
          suffix: " return viewers",
          color: "#10b981",
        },
      },
    },
    postsChart: {
      metrics: {
        followers: {
          label: "Average Likes",
          data: [12000, 18000, 14000, 28000, 42000, 38000, 52000, 68000, 62000, 78000, 84000, 82000, 88000, 86000],
          suffix: " likes",
          color: "#6366f1",
        },
        "new-followers": {
          label: "Average Shares",
          data: [8000, 12000, 9000, 18000, 28000, 24000, 32000, 42000, 38000, 48000, 52000, 50000, 54000, 52000],
          suffix: " shares",
          color: "#8b5cf6",
        },
        "lost-followers": {
          label: "Average Comments",
          data: [2000, 3000, 2500, 4000, 6000, 5000, 7000, 9000, 8000, 10000, 11000, 10500, 11500, 11000],
          suffix: " comments",
          color: "#ec4899",
        },
        "return-viewers": {
          label: "Average Views",
          data: [30000, 35000, 32000, 45000, 60000, 55000, 70000, 85000, 80000, 95000, 100000, 98000, 105000, 102000],
          suffix: " views",
          color: "#10b981",
        },
      },
    },
    profileChart: {
      metrics: {
        followers: {
          label: "Profile Visits",
          data: [16000, 19000, 17000, 24000, 32000, 29000, 38000, 45000, 42000, 51000, 56000, 54000, 59000, 57000],
          suffix: " visits",
          color: "#6366f1",
        },
        "new-followers": {
          label: "Website Clicks",
          data: [50, 65, 58, 82, 110, 98, 125, 148, 138, 165, 180, 175, 190, 185],
          suffix: " clicks",
          color: "#f59e0b",
        },
        "lost-followers": {
          label: "Email Clicks",
          data: [100, 125, 115, 160, 210, 190, 240, 285, 270, 320, 350, 340, 370, 360],
          suffix: " clicks",
          color: "#3b82f6",
        },
        "return-viewers": {
          label: "Phone Clicks",
          data: [543, 620, 580, 750, 920, 850, 1050, 1200, 1150, 1350, 1450, 1420, 1520, 1480],
          suffix: " clicks",
          color: "#10b981",
        },
      },
    },
  };

  // Initialize charts
  window.analyticsCharts = {};

  Object.keys(chartConfigs).forEach((chartId) => {
    const canvas = document.getElementById(chartId);
    if (canvas) {
      window.analyticsCharts[chartId] = new AnalyticsChart(chartId, chartConfigs[chartId]);
    }
  });
});

// Export for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnalyticsChart;
}
