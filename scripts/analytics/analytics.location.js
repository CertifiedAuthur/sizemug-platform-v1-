document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("locationChart").getContext("2d");

  // Create the chart and keep a reference to it.
  const locationChart = new Chart(ctx, {
    type: "doughnut", // Doughnut chart type
    data: {
      labels: ["United Kingdom", "Canada", "Mexico", "Other"],
      datasets: [
        {
          data: [52.1, 22.8, 13.9, 11.2], // Percentages
          backgroundColor: ["#a34df0", "#4f86f0", "#f0a34d", "#add8e6"],
          borderWidth: 3,
          borderColor: "#ffffff",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      cutout: "50%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
      },
      // Add an onClick callback to handle click events on the chart.
      onClick: (event, elements, chart) => {
        if (elements.length) {
          // Get the first clicked element
          const firstElement = elements[0];
          const label = chart.data.labels[firstElement.index];
          // Check if the clicked segment is the "Other" slice.
          if (label === "Other") {
            viewByLocationModal.classList.remove(HIDDEN);
          }
        }
      },
    },
  });
});

const showOtherViewedByLocations = document.querySelectorAll(".showOtherViewedByLocation");
const viewByLocationModal = document.getElementById("viewByLocationModal");
const hideViewByLocationModal = document.getElementById("hideViewByLocationModal");

showOtherViewedByLocations.forEach((button) => {
  button.addEventListener("click", () => {
    viewByLocationModal.classList.remove(HIDDEN);
  });
});

viewByLocationModal.addEventListener("click", (e) => {
  if (e.target.id === "viewByLocationModal") {
    return viewByLocationModal.classList.add(HIDDEN);
  }
});

hideViewByLocationModal.addEventListener("click", () => {
  viewByLocationModal.classList.add(HIDDEN);
});
