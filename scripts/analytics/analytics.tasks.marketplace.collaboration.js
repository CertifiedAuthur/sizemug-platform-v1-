document.addEventListener("DOMContentLoaded", () => {
  const tasksTab = document.getElementById("tasksTab");
  const allTabButtons = tasksTab.querySelectorAll("button");
  const allAnalyticsContainer = document.querySelectorAll(".task_marketplace_collaboration_container .analytics_container");
  const allForeseeContainer = document.querySelectorAll(".foresee_container>div");

  const progressAnalysisButton = document.getElementById("progressAnalysisButton");

  tasksTab.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
      const { container } = button.dataset;
      const containerEl = document.querySelector(`.analytics_container--${container}`);
      const foreseeCurrentContainer = document.getElementById(`foresee--${container}`);

      allTabButtons.forEach((button) => button.setAttribute("aria-selected", false));
      allAnalyticsContainer.forEach((container) => container.classList.add(HIDDEN));
      allForeseeContainer.forEach((foresee) => foresee.classList.add(HIDDEN));

      button.setAttribute("aria-selected", true);
      containerEl.classList.remove(HIDDEN);
      foreseeCurrentContainer.classList.remove(HIDDEN);

      /**
       *
       *
       *
       *
       */
      // Analysis Container
      const taskProgressAnalysisContainer = document.getElementById("taskProgressAnalysisContainer");
      taskProgressAnalysisContainer.setAttribute("data-analysis-status", container);
      const progressAnalysisContent = document.getElementById("progressAnalysisContent");
      const analysisTooltipItems = document.querySelectorAll("#analysisTMCChartTooltip .analysis_tooltip_item");

      analysisTooltipItems.forEach((con) => con.classList.add(HIDDEN));

      // Tasks
      if (container === "tasks") {
        progressAnalysisContent.textContent = "Task Progress";
        progressAnalysisButton.textContent = "Missed Tasks";
        invalidateGraphLayout("Task Progress", "Task Progress", "missed", "progress");
        document.getElementById("taskAnalysisTMCChartTooltip").classList.remove(HIDDEN);

        return;
      }

      // Marketplace
      if (container === "marketplace") {
        progressAnalysisContent.textContent = "Hours Spent";
        progressAnalysisButton.textContent = "Missed Templates";
        invalidateGraphLayout("Hours Spent", "Hours Spent", "missed", "progress");
        document.getElementById("marketplaceAnalysisTMCChartTooltip").classList.remove(HIDDEN);

        return;
      }

      // Collaboration
      if (container === "collaborations") {
        progressAnalysisContent.textContent = "Activity Level";
        progressAnalysisButton.textContent = "Missed Collaborations";
        invalidateGraphLayout("Activity Level", "Activity Level", "missed", "progress");
        document.getElementById("collaborationAnalysisTMCChartTooltip").classList.remove(HIDDEN);

        return;
      }
    }
  });

  progressAnalysisButton.addEventListener("click", function (e) {
    const { analysisStatus } = e.target.closest("#taskProgressAnalysisContainer").dataset;
    const { currentSwitch } = progressAnalysisButton.dataset;

    // Toggle Gradient and Data Logic
    toggleBetweenMissedAndProgressGraphData();

    // Tasks
    if (analysisStatus === "tasks") {
      if (currentSwitch === "missed") {
        invalidateGraphLayout("Missed Task", "Missed Task", "progress", "missed");
      } else {
        invalidateGraphLayout("Task Progress", "Task Progress", "missed", "progress");
      }

      return;
    }

    // Marketplace
    if (analysisStatus === "marketplace") {
      if (currentSwitch === "missed") {
        invalidateGraphLayout("Missed Templates", "Missed Templates", "progress", "missed");
      } else {
        invalidateGraphLayout("Hours Spent", "Hours Spent", "missed", "progress");
      }

      return;
    }

    // Collaborations
    if (analysisStatus === "collaborations") {
      if (currentSwitch === "missed") {
        invalidateGraphLayout("Missed Collaborations", "Missed Collaborations", "progress", "missed");
      } else {
        invalidateGraphLayout("Activity Level", "Activity Level", "missed", "progress");
      }

      return;
    }
  });

  function invalidateGraphLayout(content, buttonText, attr, status) {
    progressAnalysisContent.textContent = content;
    progressAnalysisButton.textContent = buttonText;
    progressAnalysisButton.setAttribute("data-current-switch", attr);
    taskProgressAnalysisContainer.setAttribute("data-status", status);
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
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
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

const analyticsTask = [
  {
    id: 723,
    owner: "Ethan B. Rodriguez",
    image: "/images/postImages/user--2.avif",
    template: ["/images/Marketing/template--3.jpg", "/images/Marketing/template--9.jpg", "/images/Marketing/template--5.jpg"],
    templateName: "Smart Home Automation Control Panel Template",
    rating: 8,
    reviews: 142,
    price: 85,
    coin: 15,
    tier: "paid",
    category: "portfolio",
  },

  {
    id: 156,
    owner: "Sophia L. Garcia",
    image: "/images/Marketing/user--8.avif",
    template: ["/images/Marketing/portfolio--2.png", "/images/Marketing/template--3.jpg", "/images/Marketing/template--8.png", "/images/Marketing/template--5.jpg"],
    templateName: "Video Streaming And Content Sharing Template",
    rating: 9,
    reviews: 203,
    price: 65,
    coin: 12,
    tier: "free",
    category: "portfolio",
  },
  {
    id: 489,
    owner: "Oliver K. Thompson",
    image: "/images/Marketing/user--8.avif",
    template: ["/images/Marketing/template--1.png", "/images/Marketing/template--3.jpg", "/images/Marketing/template--9.jpg", "/images/Marketing/template--5.jpg"],
    templateName: "Online Course Enrollment And Tracking Template",
    rating: 7,
    reviews: 98,
    price: 55,
    coin: 8,
    tier: "free",
    category: "portfolio",
  },
  {
    id: 912,
    owner: "Ava M. Wilson",
    image: "/images/Marketing/user--8.avif",
    template: ["/images/Marketing/template--2.png", "/images/Marketing/template--3.jpg", "/images/Marketing/template--9.jpg", "/images/Marketing/template--5.jpg"],
    templateName: "Document Collaboration And Editing Portal Template",
    rating: 9,
    reviews: 276,
    price: 95,
    coin: 18,
    tier: "paid",
    category: "portfolio",
  },
  {
    id: 347,
    owner: "Liam J. Anderson",
    image: "/images/Marketing/user--9.avif",
    template: ["/images/Marketing/portfolio--3.png", "/images/Marketing/template--3.jpg", "/images/Marketing/template--9.jpg", "/images/Marketing/template--5.jpg"],
    templateName: "Custom Data Analytics And Reports Template",
    rating: 8,
    reviews: 187,
    price: 75,
    coin: 14,
    tier: "free",
    category: "portfolio",
  },
];
const analyticsContainerTask = document.getElementById("analyticsContainerTask");
const analyticsContainerPurchase = document.getElementById("analyticsContainerPurchase");
const analyticsContainerCollaboration = document.getElementById("analyticsContainerCollaboration");

function renderAnalyticsTask() {
  analyticsContainerTask.innerHTML = "";

  analyticsTask.forEach((task) => {
    const markup = `
      <li role="button" data-item-id="${task.id}">
        <img src="${task.template[0]}" alt="${task.templateName}" />
        <h4>${task.templateName}</h4>
      </li>
    `;

    analyticsContainerTask.insertAdjacentHTML("beforeend", markup);
  });
}
renderAnalyticsTask();

function renderAnalyticsPurchases() {
  analyticsContainerPurchase.innerHTML = "";

  analyticsTask.forEach((task) => {
    const markup = `
      <li role="button" data-item-id="${task.id}">
        <img src="${task.template[0]}" alt="${task.templateName}" />
        <h4>${task.templateName}</h4>
        <span>${task.coin}</span>
      </li>

  `;

    analyticsContainerPurchase.insertAdjacentHTML("beforeend", markup);
  });
}
renderAnalyticsPurchases();

function renderAnalyticsCollaboration() {
  analyticsContainerCollaboration.innerHTML = "";

  analyticsTask.forEach((task) => {
    const markup = `
      <li role="button" data-item-id="${task.id}">
        <img src="${task.template[0]}" alt="${task.templateName}" />
        <h4>${task.templateName}</h4>
      </li>
    `;

    analyticsContainerCollaboration.insertAdjacentHTML("beforeend", markup);
  });
}
renderAnalyticsCollaboration();

[analyticsContainerTask, analyticsContainerPurchase, analyticsContainerCollaboration].forEach((container) => {
  container.addEventListener("click", (e) => {
    const listItem = e.target.closest("li");
    const listItemUL = listItem.closest("ul");
    const listeItems = listItemUL.querySelectorAll("li");

    if (listItem) {
      const { itemId } = listItem.dataset;

      listeItems.forEach((list) => list.setAttribute("aria-selected", false));
      listItem.setAttribute("aria-selected", true);

      const task = analyticsTask.find((task) => task.id === +itemId);
      renderBannerImages(task.template);
    }
  });
});
