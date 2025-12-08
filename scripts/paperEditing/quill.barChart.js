// 1. Create a custom Blot for charts
class ChartBlot extends Quill.Embed {
  static create(value) {
    let node = super.create();
    node.setAttribute("data-chart-type", value.type);
    node.setAttribute("data-chart-data", JSON.stringify(value.data));
    node.setAttribute("data-chart-options", JSON.stringify(value.options));
    return node;
  }

  static value(node) {
    return {
      type: node.getAttribute("data-chart-type"),
      data: JSON.parse(node.getAttribute("data-chart-data")),
      options: JSON.parse(node.getAttribute("data-chart-options")),
    };
  }
}

ChartBlot.blotName = "chart";
ChartBlot.tagName = "div";

Quill.register(ChartBlot);

// 2. Create a custom module for chart handling
class ChartModule {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.container = document.querySelector(options.container);
    this.quill.root.addEventListener("click", this.handleClick.bind(this));
    this.charts = new Map();
  }

  handleClick(evt) {
    if (evt.target && evt.target.classList.contains("ql-chart")) {
      const blot = Quill.find(evt.target);
      if (blot instanceof ChartBlot) {
        this.initChart(blot);
      }
    }
  }

  initChart(blot) {
    const node = blot.domNode;
    const chartId = "chart-" + Math.random().toString(36).substr(2, 9);
    node.id = chartId;

    const canvas = document.createElement("canvas");
    node.appendChild(canvas);

    const value = ChartBlot.value(node);
    const chart = new Chart(canvas.getContext("2d"), {
      type: value.type,
      data: value.data,
      options: {
        ...value.options,
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    this.charts.set(chartId, chart);

    // Add resize handle
    const resizeHandle = document.createElement("div");
    resizeHandle.className = "chart-resize-handle";
    node.appendChild(resizeHandle);

    // Initialize resize functionality
    this.initResize(node, chart);
  }

  initResize(node, chart) {
    const resizeHandle = node.querySelector(".chart-resize-handle");
    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = node.offsetWidth;
      startHeight = node.offsetHeight;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const width = startWidth + e.clientX - startX;
      const height = startHeight + e.clientY - startY;
      node.style.width = width + "px";
      node.style.height = height + "px";
      chart.resize();
    });

    document.addEventListener("mouseup", () => {
      isResizing = false;
    });
  }
}
