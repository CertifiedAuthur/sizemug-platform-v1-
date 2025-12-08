// document.addEventListener("DOMContentLoaded", () => {
//   class PieChartBlot extends BlockEmbed {
//     static create(value) {
//       const node = super.create();
//       node.setAttribute("contenteditable", false);

//       // Create a canvas element for Chart.js
//       const canvas = document.createElement("canvas");
//       node.appendChild(canvas);

//       // Store chart config and data
//       const chartData = value || { type: "pie", data: { datasets: [] }, options: {} };
//       const chart = new Chart(canvas, chartData); // Initialize the chart

//       // Resize handling
//       canvas.style.width = "100%"; // Ensure chart fits the container
//       node.chart = chart; // Save chart instance in the DOM node for resizing later

//       return node;
//     }

//     static value(node) {
//       return node.chart.config; // Save chart config when blot is serialized
//     }

//     // Resize the chart when necessary
//     resize() {
//       if (this.domNode.chart) {
//         this.domNode.chart.resize();
//       }
//     }
//   }

//   PieChartBlot.blotName = "piechart";
//   PieChartBlot.tagName = "div"; // Embed as a div block
//   Quill.register(PieChartBlot);

//   const insertPieChartBtn = document.getElementById("insert_pie_chart--btn");

//   insertPieChartBtn.addEventListener("click", handleInsertPieChart);
// });

// function handleInsertPieChart() {
//   const range = quill.getSelection();

//   // Get form elements for chart data
//   const pieChartForm = document.getElementById("pie_chart_form");
//   const labelsEl = pieChartForm.querySelector("#labels");
//   const valuesEl = pieChartForm.querySelector("#values");
//   const labelEl = pieChartForm.querySelector("#label");

//   console.log(labelEl.value);
//   const chartData = {
//     type: "pie",
//     data: {
//       labels: labelsEl.value.split(" "), // Split the labels by spaces
//       datasets: [
//         {
//           label: labelEl.value, // The chart's label
//           data: valuesEl.value.split(" ").map((value) => Number(value)), // Convert input values to numbers
//           backgroundColor: ["#C760F5", "#FFA500", "#3366FF", "#F5D0FF"], // Colors to match the image
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "right", // Align legend to the right
//           align: "center", // Vertically center the legend
//           labels: {
//             boxWidth: 10, // Control size of the box next to each label
//             usePointStyle: true, // Use a point style to allow custom radius
//           },
//         },
//       },
//     },
//   };

//   // If there is no selection, insert the pie chart at the end
//   if (!range) {
//     const length = quill.getLength(); // Get the total length of the content
//     quill.insertEmbed(length - 1, "piechart", chartData);
//   } else {
//     // Insert the pie chart at the current selection position
//     quill.insertEmbed(range.index, "piechart", chartData);
//   }

//   // Hide the modal after inserting the chart
//   pieChartModal.classList.add(HIDDEN);

//   // Clear form input values
//   labelsEl.value = "";
//   valuesEl.value = "";
//   labelEl.value = "";
// }

document.addEventListener("DOMContentLoaded", () => {
  class PieChartBlot extends BlockEmbed {
    static create(value) {
      const node = super.create();
      node.setAttribute("contenteditable", false);

      // Create a canvas element for Chart.js
      const canvas = document.createElement("canvas");
      node.appendChild(canvas);

      // Store chart config and data
      const chartData = value || { type: "pie", data: { datasets: [] }, options: {} };
      const chart = new Chart(canvas, chartData); // Initialize the chart

      // Resize handling
      canvas.style.width = "100%"; // Ensure chart fits the container
      node.chart = chart; // Save chart instance in the DOM node for resizing later

      return node;
    }

    static value(node) {
      return node.chart.config; // Save chart config when blot is serialized
    }

    // Resize the chart when necessary
    resize() {
      if (this.domNode.chart) {
        this.domNode.chart.resize();
      }
    }
  }

  PieChartBlot.blotName = "piechart";
  PieChartBlot.tagName = "div"; // Embed as a div block
  Quill.register(PieChartBlot);

  const insertPieChartBtn = document.getElementById("insert_pie_chart--btn");
  insertPieChartBtn.addEventListener("click", handleInsertPieChart);
});

function handleInsertPieChart() {
  const range = quill.getSelection();

  // Get form elements for chart data
  const pieChartForm = document.getElementById("pie_chart_form");
  const labelsEl = pieChartForm.querySelector("#labels");
  const valuesEl = pieChartForm.querySelector("#values");
  const labelEl = pieChartForm.querySelector("#label");

  const chartData = {
    type: "pie",
    data: {
      labels: labelsEl.value.split(" "), // Split the labels by spaces and use for each segment
      datasets: [
        {
          label: labelEl.value, // This is the chart's overall label (optional, used in tooltips)
          data: valuesEl.value.split(" ").map((value) => Number(value)), // Convert input values to numbers
          backgroundColor: ["#C760F5", "#FFA500", "#3366FF", "#F5D0FF"], // Colors to match the image
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right", // Align legend to the right
          align: "center", // Vertically center the legend
          labels: {
            boxWidth: 10, // Control size of the box next to each label
            padding: 20, // Adjust space between the label and chart
            usePointStyle: true, // Use point style for custom radius
            generateLabels: function (chart) {
              const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
              const labelsOriginal = original.call(this, chart);

              // Apply border-radius to each box
              labelsOriginal.forEach((label) => {
                label.pointStyle = "rectRounded"; // Add rounded rectangle style to legend
              });
              return labelsOriginal;
            },
          },
        },
      },
    },
  };

  // If there is no selection, insert the pie chart at the end
  if (!range) {
    const length = quill.getLength(); // Get the total length of the content
    quill.insertEmbed(length - 1, "piechart", chartData);
  } else {
    // Insert the pie chart at the current selection position
    quill.insertEmbed(range.index, "piechart", chartData);
  }

  // Hide the modal after inserting the chart
  pieChartModal.classList.add(HIDDEN);

  // Clear form input values
  labelsEl.value = "";
  valuesEl.value = "";
  labelEl.value = "";
}
