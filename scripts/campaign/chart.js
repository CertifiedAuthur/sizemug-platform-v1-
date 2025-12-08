const ctx = document.getElementById("nestedPieChart").getContext("2d");

const data = {
  datasets: [
    {
      // Level 1
      label: "Reach",
      data: [(86.58 * 360) / 100, 360 - (86.58 * 360) / 100], // 305 degrees and the remainder to make a full circle
      backgroundColor: ["#8837E9", "transparent"],
      borderWidth: 0,
      borderRadius: [200, 0],
      hoverBorderColor: "transparent",
      borderColor: "transparent",
      hoverOffset: 4,
      cutout: "65%", // Adjust cutout for nesting
      radius: "100%", // Adjust cutout for nesting
    },
    {
      label: "Engagement",
      data: [(77.42 * 360) / 100, 360 - (77.42 * 360) / 100], // 295 degrees and the remainder to make a full circle
      backgroundColor: ["#1C64F2", "transparent"],
      borderWidth: 0,
      borderRadius: [200, 0],
      hoverBorderColor: "transparent",
      borderColor: "transparent",
      hoverOffset: [0, 0],
      cutout: "63%", // Adjust cutout for nesting
      radius: "95%",
    },
    {
      label: "Click",
      data: [(66.08 * 360) / 100, 360 - (66.08 * 360) / 100], // 200 degrees and the remainder to make a full circle
      backgroundColor: ["#FDA629", "transparent"],
      borderWidth: 0,
      borderRadius: [200, 0],
      hoverBorderColor: "transparent",
      borderColor: "transparent",
      hoverOffset: 1,
      cutout: "60%", // Adjust cutout for nesting
      radius: "90%",
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true, // Hide legend for a cleaner look
      position: "top",
      labels: {
        generateLabels: function (chart) {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor[0],
              hidden: false,
              index: i,
            }));
          }
          return [];
        },
      },
    },
    tooltip: {
      filter: function (tooltipItem) {
        // Skip tooltips for transparent segments
        return tooltipItem.raw !== 360 - tooltipItem.dataset.data[0];
      },
      callbacks: {
        label: function (tooltipItem) {
          // Only show label for non-transparent segments
          if (tooltipItem.raw !== 360 - tooltipItem.dataset.data[0]) {
            return `${tooltipItem.label}: ${tooltipItem.dataset.label}`;
          }
          return null;
        },
      },
    },
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      const text = "Reach 1000";
      ctx.restore();
      const fontSize = (height / 10).toFixed(2);
      ctx.font = fontSize + "px Arial";
      ctx.textBaseline = "middle";
      ctx.color = "blue";
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
    },
  },
};

const nestedPieChart = new Chart(ctx, {
  type: "doughnut",
  data: data,
  options: options,
});

/* Bar Chart */
const bar_chart = document.getElementById("bar_chart").getContext("2d");
// Set the canvas size explicitly to avoid blurriness
const canvas = document.getElementById("bar_chart");
canvas.width = canvas.clientWidth * window.devicePixelRatio;
canvas.height = canvas.clientHeight * window.devicePixelRatio;
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

const barChart = new Chart(bar_chart, {
  type: "bar",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Click",
        data: [300, 0, 0, 500, 200, 0, 0, 0, 250, 300, 0, 250],
        backgroundColor: "#FDA629",
        borderRadius: 10,
      },
      {
        label: "Engagement",
        data: [250, 700, 0, 100, 200, 650, 0, 600, 350, 350, 0, 300],
        backgroundColor: "#1C64F2",
        borderRadius: 3,
      },
      {
        label: "Reach",
        data: [250, 300, 0, 250, 200, 350, 0, 250, 200, 280, 0, 150],
        backgroundColor: "#8837E9",
        borderRadius: 3,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  },
});

/* Line Chart */

function lineChart(chart = "click") {
  const line_canvas = document.getElementById(`line_${chart}`);
  const line_chart = line_canvas.getContext("2d");

  const colors = {
    engagement: {
      default: "rgb(28 100 242 / 100%)",
      half: "rgb(28 100 242 / 35%)",
      quarter: "rgb(28 100 242 / 5%)",
      zero: "rgb(28 100 242 / 1%)",
    },
    click: {
      default: "rgb(253 166 41 / 100%)",
      half: "rgb(253 166 41 / 35%)",
      quarter: "rgb(253 166 41 / 5%)",
      zero: "rgb(253 166 41 / 1%)",
    },
    reach: {
      default: "rgb(136 55 233 / 100%)",
      half: "rgb(136 55 233 / 35%)",
      quarter: "rgb(136 55 233 / 5%)",
      zero: "rgb(136 55 233 / 1%)",
    },
  };

  gradient = line_chart.createLinearGradient(0, 25, 0, 150);
  gradient.addColorStop(0, colors[chart].half);
  gradient.addColorStop(0.35, colors[chart].quarter);
  gradient.addColorStop(1, colors[chart].zero);

  // Set the line_canvas size explicitly to avoid blurriness
  line_canvas.width = line_canvas.clientWidth * window.devicePixelRatio;
  line_canvas.height = canvas.clientHeight * window.devicePixelRatio;
  line_chart.scale(window.devicePixelRatio, window.devicePixelRatio);

  // Function to generate daily data with close values
  const generateDailyData = (numDays) => {
    let data = [];
    let baseValue = Math.floor(Math.random() * 10) + 10; // Base value between 10 and 19
    for (let i = 0; i < numDays; i++) {
      // Generate values close to the base value
      const variation = Math.floor(Math.random() * 5) + 2; // Variation between -2 and 2
      data.push(baseValue + variation);
    }
    return data;
  };

  // Data for each month, containing daily data for each month
  const months = [
    { month: "Jan", days: generateDailyData(31) },
    { month: "Feb", days: generateDailyData(28) },
    { month: "Mar", days: generateDailyData(31) },
    { month: "Apr", days: generateDailyData(30) },
    { month: "May", days: generateDailyData(31) },
    { month: "Jun", days: generateDailyData(30) },
    { month: "Jul", days: generateDailyData(31) },
    { month: "Aug", days: generateDailyData(31) },
    { month: "Sep", days: generateDailyData(30) },
    { month: "Oct", days: generateDailyData(31) },
    { month: "Nov", days: generateDailyData(30) },
    { month: "Dec", days: generateDailyData(31) },
  ];

  // Flatten the daily data into a single array for the line chart
  const dailyData = months.flatMap((month) => month.days);

  // Generate labels for months
  const labels = months.flatMap((month) => Array.from({ length: month.days.length }, (_, i) => `${month.month}`));
  const label = months.flatMap((month) => `${month.month}`);

  const lineChart = new Chart(line_chart, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: chart,
          data: dailyData,
          backgroundColor: gradient,
          pointBackgroundColor: colors[chart].default,
          borderColor: colors[chart].default,
          borderWidth: 2,
          pointRadius: 10,
          lineTension: 0.2,
          fill: true, // Fill under the line
          tension: 0.4, // Curved line
          pointRadius: 0, // Hide the dots
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItem, data) {
              return "";
            },
            label: function (context) {
              const index = context.dataIndex;
              const value = dailyData[index];
              const dateLabel = labels[index % labels.length]; // Use modulo to cycle through months
              const formattedDate = `- ${dateLabel}`; // Format the date

              // Return HTML formatted string for the tooltip
              return `${value} ${chart[0].toUpperCase() + chart.substring(1)} ${formattedDate}`;
            },
          },
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        x: {
          type: "category",
          labels: labels, // Ensure exactly 12 labels (months)
          ticks: {
            maxTicksLimit: 12, // Limit to 12 ticks
            callback: function (value, index, values) {
              return labels[index % labels.length].split(" ")[0]; // Display only month names
            },
          },
          grid: {
            display: false, // Hide vertical grid lines
          },
          beginAtZero: true,
        },
        y: {
          grid: {
            color: "rgba(0, 0, 0, 0.1)", // Set horizontal grid line color to gray with 0.3 opacity
          },
          beginAtZero: true,
          ticks: {
            callback: function (value, index, values) {
              return "";
            },
          },
        },
      },
    },
  });
}
lineChart("click");
lineChart("engagement");
lineChart("reach");
