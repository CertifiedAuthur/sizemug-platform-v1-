document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("deviceChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"], // X-axis labels
      datasets: [
        {
          data: [10, 25, 15, 30, 8, 12], // Bar values
          backgroundColor: [
            "#a34df0", // Linux
            "#f0a34d", // Mac
            "#000000", // iOS
            "#4f86f0", // Windows
            "#add8e6", // Android
            "#c4c4c4", // Other
          ],
          borderRadius: 10, // Rounded corners
          borderSkipped: false, // Ensures all sides of the bar are rounded
          barThickness: 28, // Explicitly set bar width in pixels
          maxBarThickness: 40, // Max width in pixels
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Makes the chart fit nicely in the container
      plugins: {
        legend: {
          display: false, // Hides the legend since it's not in the design
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Completely hide grid lines on the x-axis
            drawBorder: false, // Ensure the bottom border is removed
            color: "#fff",
          },
          ticks: {
            //     display: true,
          },
          barPercentage: 0.1, // Reduce bar width (0.0 to 1.0, default is 0.9)
          categoryPercentage: 0.2, // Controls spacing between categories
        },
        y: {
          grid: {
            display: false, // Hide grid lines on the y-axis
            drawBorder: false, // Remove the left border
            color: "#fff",
          },
          ticks: {
            color: "#7a7a7a", // Gray color for labels
            callback: function (value) {
              return value + "K"; // Add 'K' to values (e.g., 10K, 20K)
            },
          },
        },
      },
    },
  });
});
