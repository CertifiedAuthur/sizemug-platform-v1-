const addTaskNext = document.getElementById("add_task_next");
const cancelBackTaskBtn = document.getElementById("cancel_back_btn");
const createTaskTitle = document.querySelector(".create_task_title");

const createDatePickerBtn = document.getElementById("create-datepicker");
const createDatePicker = document.querySelector(".create_date_picker");
const taskDateDOM = document.querySelector(".create-task-date");

const today = getDateHelper(new Date());
function formatDate(date) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

let newTaskTitle;
let newTaskStartDate;
let newTaskStatus = "pending";
let newTaskDescription;
let newTaskTags = [];
let newTaskInterests = [];
let newTaskImages = [];
let newTaskDate = new Date(today);

// Custom Date Formatter
function getDateHelper(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Title change
createTaskTitle.addEventListener("input", function (e) {
  newTaskTitle = e.target.value.trim();
});

// Date Picker
// Duet setup
document.addEventListener("DOMContentLoaded", function () {
  // Set initial properties
  createDatePicker.min = today;

  // update default date value
  setPickerDefaultDate();

  // Update DOM initial setup
  taskDateDOM.textContent = today;

  // Custom trigger to show date picker
  createDatePickerBtn.addEventListener("click", function () {
    createDatePicker.show();
  });

  // Listen for date changes
  createDatePicker.addEventListener("duetChange", function (event) {
    const selectedDate = event.detail.value;
    newTaskStartDate = selectedDate;
    taskDateDOM.textContent = selectedDate; // update DOM

    // Delay class removal to allow Duet to complete its cycle
    setTimeout(function () {
      const dateDialog = document.querySelector('[name="createTaskDate"]').querySelector(".duet-date__dialog");

      if (dateDialog) {
        dateDialog.classList.remove("is-active");
      }
    }, 100); // Adjust the delay as needed
  });
});

// Takes in date argument in format YYYY-MM-DD
function setPickerDefaultDate(date) {
  if (!date) {
    createDatePicker.value = today;
  } else {
    createDatePicker.value;
  }
}

/**
 *
 *
 *
 *
 *
 *
 *
 *  Create Task Status
 *
 *
 *
 *
 *
 *
 */
const createTaskStatsus = document.getElementById("create_task_status");
createTaskStatsus.addEventListener("change", function (e) {
  newTaskStatus = e.target.value;
});

/**
 *
 *
 *
 *
 *
 * Select New Task Interests
 *
 *
 *
 *
 *
 */
const createTaskCategories = document.getElementById("create_task_categories");

// Category Event
createTaskCategories.addEventListener("click", function (e) {
  const target = e.target;

  if (target.classList.contains("category")) {
    const { category } = target.dataset;

    if (!target.classList.contains("category--active")) {
      newTaskInterests.push(category);
      target.classList.add("category--active");
    } else {
      newTaskInterests = newTaskInterests.filter((int) => int !== category);
      target.classList.remove("category--active");
    }
  }
});

/**
 *
 *
 *
 *
 *
 *
 *  Upload Task Images
 *
 *
 *
 *
 *
 *
 */

const imageInput = document.getElementById("create-task-image-input");
const previewImages = document.querySelector(".preview-images");
const dropArea = document.querySelector(".drop_images_container");

// Change Images Event
imageInput.addEventListener("change", (e) => {
  const files = e.target.files;

  handleFilesChange(files);
});

// Drag & Drop Event
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});
dropArea.addEventListener("drop", drop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
function drop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFilesChange(files);
}

// function that handle both drop & drag and select images
function handleFilesChange(files) {
  // first clear existing previewing images
  previewImages.innerHTML = "";

  const readFilesAsBase64 = (files) => {
    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) continue;

      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
          resolve(reader.result); // resolve with the base64 data
        };

        reader.onerror = function () {
          reject(new Error("File reading error"));
        };
      });

      promises.push(promise);
    }

    return Promise.all(promises); // Return a promise that resolves when all files are read
  };

  readFilesAsBase64(files).then((base64Images) => {
    newTaskImages.push(...base64Images);
    renderCreateTaskImages(newTaskImages);
  });
}

function renderCreateTaskImages(imageString) {
  imageString.forEach((str, i) => {
    const html = `
        <div class="preview_images_wrapper"  data-selected-image="${i}">
                <img src="${str}" alt="" />
                        <div class="preview_overlay">
                        <img src="icons/rotate-icon.svg" alt="" />
                </div>
                <img src="icons/cancel.svg" alt="" class="cancel_selected_image_btn"/>
        </div>
    `;

    previewImages.insertAdjacentHTML("afterbegin", html);

    // Hide overlay after 1 second
    const previewOverlay = document.querySelectorAll(".preview_overlay");
    setTimeout(() => {
      previewOverlay.forEach((overlay) => overlay.classList.add(HIDDEN));
    }, 1000);

    // Attach the event listener only to the new cancel button
    const cancelImageBtn = previewImages.querySelector(`.preview_images_wrapper[data-selected-image="${i}"] .cancel_selected_image_btn`);
    cancelImageBtn.addEventListener("click", (e) => {
      const btnImage = e.target.closest(".preview_images_wrapper");
      const { selectedImage } = btnImage.dataset;

      // Remove the image from the newTaskImages array
      newTaskImages.splice(+selectedImage, 1);

      // Hide the image
      btnImage.classList.add(HIDDEN);

      // Update data-selected-image for remaining images
      const allImages = document.querySelectorAll(".preview_images_wrapper");
      allImages.forEach((imageWrapper, index) => {
        imageWrapper.dataset.selectedImage = index;
      });
    });
  });
}
/**
 *
 *
 *
 *
 *
 *
 *
 *  Task Next Step Event
 *
 *
 *
 *
 *
 *
 */
const taskTagsEl = document.getElementById("create_task_tags");
const taskTags = new Tagify(taskTagsEl, {
  whitelist: [],
});

addTaskNext.addEventListener("click", async function (e) {
  const { button } = addTaskNext.dataset;

  console.log("Create Modal Button");

  if (button === "create") {
    showToast(HIDDEN, "Your will be creating a task! 🫶", "success");
    this.setAttribute("data-button", "next"); // reset button dataset

    // get collaborators
    const collaborators = await fetchRandomUsers(getRandomNumber(1, 10));
    const existingTasks = getLocalStorage(); // get existing tasks
    const isShared = newTaskInterests.length >= 4;

    const newTask = {
      id: existingTasks.length + 1,
      status: newTaskStatus,
      title: newTaskTitle,
      createdAt: today,
      priotised: false,
      completed_task: getRandomNumber(1, 10),
      remain_task: getRandomNumber(10, 15),
      description: newTaskDescription,
      hashtags: newTaskTags,
      interests: newTaskInterests,
      taskImages: newTaskImages,
      collaborators,
      image: "./icons/Avatar.svg",
      isShared,
      fomarttedDate: formatDate(newTaskDate),
      createdAt: newTaskDate,
      tracking_rate: 0,
      sharedFrom: newTaskInterests.length > 4 ? "David John" : newTaskInterests.length > 8 ? "Rafael Richi" : "",
      sharedWith: window.location.pathname === "/chat.html" ? "user" : "",
    };

    console.log(window.location.pathname === "/chat.html");
    console.log(window.location.pathname);

    setLocalStorage([...existingTasks, newTask]); // merge existing tasks with the new task and forward it to localstorage

    hideCreateTaskModal(); // Hide Modal
    taskListApp.renderUserTasks(); // update DOM with the newly created task

    return;
  }

  const tags = taskTags.value;
  const descriptionValue = createTaskEditor.innerHTML.trim();
  const noDescriptionChange = descriptionValue.startsWith("Description") && descriptionValue.length === 11;

  if (!newTaskTitle) return showToast(HIDDEN, "Task title is required", "fail");
  if (!newTaskDescription && noDescriptionChange) return showToast(HIDDEN, "Task description is required", "fail");
  if (!tags.length) return showToast(HIDDEN, "Task tag is required", "fail");

  newTaskDescription = descriptionValue;
  newTaskTags = tags;

  // Move to Create Task Next Screen
  showTaskStep2();
  cancelBackTaskBtn.setAttribute("data-button", "back");
  this.setAttribute("data-button", "create");
});

// Cancel/Back Event
cancelBackTaskBtn.addEventListener("click", function () {
  const { button } = cancelBackTaskBtn.dataset;

  if (button === "cancel") {
    hideCreateTaskModal();
  } else {
    addTaskNext.setAttribute("data-button", "next");
    showTaskStep1();
  }

  cancelBackTaskBtn.setAttribute("data-button", "cancel");
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
 * Useful functions
 *
 *
 *
 *
 *
 *
 *
 */

const createTaskStep1 = document.getElementById("create_task_step-1");
const createTaskStep2 = document.getElementById("create_task_step-2");

function showTaskStep1() {
  createTaskStep1.classList.remove(HIDDEN);
  createTaskStep2.classList.add(HIDDEN);

  addTaskNext.textContent = "Next";
  cancelBackTaskBtn.textContent = "Cancel";
}

function showTaskStep2() {
  createTaskStep1.classList.add(HIDDEN);
  createTaskStep2.classList.remove(HIDDEN);

  addTaskNext.textContent = "Create Task";
  cancelBackTaskBtn.textContent = "Back";
}

// Hide Create Task Modal
function hideCreateTaskModal() {
  newTaskTitle = "";
  newTaskStartDate = "";
  newTaskStatus = "pending";
  newTaskDescription = "";
  newTaskInterests = [];
  newTaskImages = [];

  createTaskTitle.value = "";
  createDatePicker.value = today; // update date picker selected cell
  triggerDatePickerChangeEvent(today); // update date picker shown value
  createTaskStatsus.value = "pending";
  createTaskEditor.innerHTML = "Description";
  taskTagsEl.value = "";
  createTaskCategories.querySelectorAll(".category").forEach((c) => {
    c.classList.remove("category--active");
  });
  previewImages.innerHTML = "";

  showTaskStep1();
  const addNewTaskWithThisUserModal = document.getElementById("addNewTaskWithThisUserModal");

  if (window.location.pathname === "/chat.html") {
    addClass(addNewTaskWithThisUserModal);
  } else {
    addClass(createTaskContainer);
  }
}

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to fetch random user data
async function fetchRandomUsers(count = 5) {
  const response = await fetch(`https://randomuser.me/api/?results=${count}`);
  const data = await response.json();

  return data.results.map((user) => {
    return {
      picture: user.picture.medium,
      username: `${user.name["first"]} ${user.name["last"]}`,
    };
  });
}

// Trigger the duetChange event
function triggerDatePickerChangeEvent(date) {
  const event = new CustomEvent("duetChange", {
    detail: {
      value: date,
    },
  });
  createDatePicker.dispatchEvent(event); // Dispatch the event
}
