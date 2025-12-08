/**
 *
 * This file contains logic for showing either for you or task on mobile screen
 * NOTE: header for mobile view is two for switching between for you and task
 *  1) .main_tasks--header--lists
 *  2) .main_tasks--header--landing
 *
 *
 * ------------------------------------------------------
 * A method that was not declare in this file called observeGridChanges() is been used here.
 * check masonry.observer.lib.js file
 *
 */

////////////////////////////////////////////////
////////////////////////////////////////////////
const selectionContainer1 = document.querySelector(
  "#selection_container--options-1"
);
const selectionContainer2 = document.querySelector(
  "#selection_container--options-2"
);

const mainTaskList = document.querySelector(".main_tasks_list");
const taskHeaderMobile = document.querySelector(".main_tasks--header--landing");
const taskHeaderDesktop = document.querySelector(".main_tasks--header--lists");
const gridContainerWrapper = document.querySelector(".gridContainer--wrapper");
const mobileGridContainerEl = document.querySelector(".gridContainer");

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
[selectionContainer1, selectionContainer2].forEach((selectionContainer) => {
  const showSelectingBtn = selectionContainer.querySelector(
    ".show_selecting--options"
  );
  const selectionContainerOption = selectionContainer.querySelector("ul");

  // Show the options
  showSelectingBtn.addEventListener("click", (e) => {
    const optionStatus = JSON.parse(selectionContainerOption.ariaExpanded);

    if (!optionStatus) {
      selectionContainerOption.classList.remove(HIDDEN);
      selectionContainerOption.ariaExpanded = true;
    } else {
      selectionContainerOption.classList.add(HIDDEN);
      selectionContainerOption.ariaExpanded = false;
    }
  });

  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  ////////////////////////////////////////////////
  // Select from the option
  selectionContainerOption.addEventListener("click", function (e) {
    const target = e.target;
    const listItem = target.closest("li");
    const allSelectOptionItems = document.querySelectorAll(
      ".select_options--item"
    );
    const allSelectOptionTasks = document.querySelectorAll(
      "#select_options--tasks"
    );
    const allSelectOptionForyou = document.querySelectorAll(
      "#select_options--foryou"
    );
    const taskforyouContent = document.querySelectorAll(".task_foryou_content");

    if (listItem) {
      const { value } = listItem.dataset;
      allSelectOptionItems.forEach((item) => item.classList.remove("active"));

      if (value === "tasks") {
        handleTaskSelection();
        allSelectOptionTasks.forEach((task) => task.classList.add("active"));
        taskforyouContent.forEach((content) => (content.textContent = "Tasks"));

        window.scrollTo(0, 0);
      } else {
        handleForYouSelection();
        allSelectOptionForyou.forEach((foryou) =>
          foryou.classList.add("active")
        );
        taskforyouContent.forEach(
          (content) => (content.textContent = "For you")
        );

        // This function is declared in masonry.observer.js file
        // observeGridChanges();
        window.scrollTo(0, 0);
      }

      // Hide select option after selection
      selectionContainerOption.classList.add(HIDDEN);
      selectionContainerOption.ariaExpanded = false;
    }
  });
});

function handleTaskSelection() {
  mainTaskLists.forEach((list) => {
    list.classList.remove(HIDDEN);
  });
  taskHeaderDesktop.classList.remove(HIDDEN);
  taskHeaderMobile.classList.add(HIDDEN);
  gridContainerWrapper.classList.add(HIDDEN);
  gridContainerWrapper.style.display = "none";

  masonryInstance = new Masonry(mobileGridContainerEl, {
    itemSelector: ".grid_item",
    columnWidth: ".grid_item",
    percentPosition: true,
    gutter: 16,
  });

  masonryInstance.layout();
}

function handleForYouSelection() {
  mainTaskLists.forEach((list) => {
    list.classList.add(HIDDEN);
  });
  taskHeaderDesktop.classList.add(HIDDEN);
  taskHeaderMobile.classList.remove(HIDDEN);
  gridContainerWrapper.classList.remove(HIDDEN);
  gridContainerWrapper.style.display = "block";

  masonryInstance = new Masonry(mobileGridContainerEl, {
    itemSelector: ".grid_item",
    columnWidth: ".grid_item",
    percentPosition: true,
    gutter: 16,
  });

  masonryInstance.layout();
}

window.addEventListener("resize", () => {
  masonryInstance = new Masonry(mobileGridContainerEl, {
    itemSelector: ".grid_item",
    columnWidth: ".grid_item",
    percentPosition: true,
    gutter: 16,
  });

  masonryInstance.layout();
});
