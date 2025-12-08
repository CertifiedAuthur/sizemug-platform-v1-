const addBarChart = document.getElementById("add_bar_chart");
const addLineChart = document.getElementById("add_line_chart");
const addPieChart = document.getElementById("add_pie_chart");

const barChartModal = document.getElementById("bar_chart_modal");
const lineChartModal = document.getElementById("line_chart_modal");
const pieChartModal = document.getElementById("pie_chart_modal");

const lineChartDocumentElement = document.querySelector(".lineChart_document_element");
const barChartDocumentElement = document.querySelector(".barChart_document_element");
const pieChartDocumentElement = document.querySelector(".pieChart_document_element");

const mobileHideChartsModalBtn = document.querySelectorAll(".mobileHideChartsModalBtn");
mobileHideChartsModalBtn.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.target.closest(".overlay").classList.add(HIDDEN);
  });
});

// Bar Chart
[addBarChart, barChartDocumentElement].forEach((button) => {
  button.addEventListener("click", () => {
    barChartModal.classList.remove(HIDDEN);
    closeDropdownBar(); // close all dropdown
  });
});

// Line Chart
[addLineChart, lineChartDocumentElement].forEach((button) => {
  button.addEventListener("click", () => {
    lineChartModal.classList.remove(HIDDEN);
    closeDropdownBar(); // close all dropdown
  });
});

// Pie Chart
[addPieChart, pieChartDocumentElement].forEach((button) => {
  button.addEventListener("click", () => {
    pieChartModal.classList.remove(HIDDEN);
    closeDropdownBar(); // close all dropdown
  });
});

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const insertPieChartBtn = document.getElementById("insert_pie_chart--btn");
  const insertLineChartBtn = document.getElementById("insert_line_chart--btn");
  const insertBarChartBtn = document.getElementById("insert_bar_chart--btn");

  insertPieChartBtn.addEventListener("click", () => handleInsertChart("pie", pieChartModal, focusedEditor));
  insertLineChartBtn.addEventListener("click", () => handleInsertChart("line", lineChartModal, focusedEditor));
  insertBarChartBtn.addEventListener("click", () => handleInsertChart("bar", barChartModal, focusedEditor));
});

function handleInsertChart(chartType, chartModal, editor) {
  const range = editor?.getSelection();

  // Get all inputs elements
  const labelsEl = chartModal.querySelector("#labels");
  const valuesEl = chartModal.querySelector("#values");
  const labelEl = chartModal.querySelector("#label");

  console.log(labelsEl.value.split(" "));
  console.log(labelEl.value);
  console.log(valuesEl.value.split(" ").map((value) => Number(value)));

  // Common chart data configuration
  const chartData = {
    type: chartType, // Set the type to pie, line, or bar
    data: {
      labels: labelsEl.value.split(" "), // Split the labels by spaces
      datasets: [
        {
          label: labelEl.value, // The chart's label (for tooltip or line/bar labels)
          data: valuesEl.value.split(" ").map((value) => Number(value)), // Convert input values to numbers
          backgroundColor: chartType === "pie" ? ["#C760F5", "#FFA500", "#3366FF", "#F5D0FF"] : "rgba(75, 192, 192, 0.2)", // Colors for pie chart or transparent bars/lines
          borderColor: chartType === "pie" ? [] : "rgba(75, 192, 192, 1)", // Borders for line and bar charts
          borderWidth: 1, // Border width for line/bar charts
          fill: chartType === "line" ? false : true, // Do not fill under the line chart
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales:
        chartType !== "pie"
          ? {
              y: {
                beginAtZero: true, // Start Y-axis from zero for line and bar charts
              },
            }
          : {}, // No scales for pie chart
      plugins: {
        legend: {
          position: "right", // Align legend to the right
          align: "center", // Vertically center the legend
          labels: {
            boxWidth: 10, // Control size of the box next to each label
            padding: 20, // Adjust space between the label and chart
            usePointStyle: chartType === "pie", // Use rounded box for pie chart only
            generateLabels: function (chart) {
              if (chartType === "pie") {
                const original = Chart.overrides[chartType]?.plugins?.legend?.labels.generateLabels;
                const labelsOriginal = original?.call(this, chart);

                // Apply border-radius to each box in pie chart
                labelsOriginal.forEach((label) => {
                  label.pointStyle = "rectRounded"; // Add rounded rectangle style to legend
                });
                return labelsOriginal;
              }
            },
          },
        },
      },
    },
  };

  // If there is no selection, insert the chart at the end
  if (!range) {
    const length = editor?.getLength(); // Get the total length of the content
    editor.insertEmbed(length - 1, "chart", chartData);
  } else {
    // Insert the chart at the current selection position
    editor.insertEmbed(range.index, "chart", chartData);
  }

  // Hide the modal after inserting the chart
  chartModal.classList.add(HIDDEN);

  // Clear form input values
  labelsEl.value = "";
  valuesEl.value = "";
  labelEl.value = "";
}
