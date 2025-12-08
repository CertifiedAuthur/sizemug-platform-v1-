const hideTaskTimer = document.getElementById("hide_task_timer");
const taskTimerHeader = document.querySelector(".task_timer_main>div");
const startTimerBtn = document.getElementById("set_timer");
const resetTimerBtn = document.getElementById("reset_timer");
const stopTimerBtn = document.getElementById("stop_timer");
const deleteTimerBtn = document.getElementById("delete_timer");
const daysTimer = document.getElementById("days_timer");
const hoursTimer = document.getElementById("hours_timer");
const minutesTimer = document.getElementById("minutes_timer");
const secondsTimer = document.getElementById("seconds_timer");
const stopContent = stopTimerBtn.querySelector("span");
const taskTimerModal = document.getElementById("task_timer--modal");

let timerInterval;
let remainingTime;
let initialTime;
let currentTaskId;
let pausedTime = null; // Track when the timer was paused

// Hide Task Timer
hideTaskTimer.addEventListener("click", function () {
  addClass(taskTimerModal);
});

taskTimerModal.addEventListener("click", (e) => {
  if (e.target.id === "task_timer--modal") {
    addClass(taskTimerModal);
  }
});

function showTaskTimerModal(taskId) {
  if (!taskId) return; // Guard clause

  taskTimerModal.setAttribute("data-task-id", taskId);
  initializeTaskTimer(taskId);

  removeClass(taskTimerModal);
  // Update task list to hide timer icon if needed or show
  renderUserTasks();
}

// Function to save timer state to localStorage
function saveTimerState(taskId, initialTime, remainingTime, isPaused = false) {
  const timerState = {
    taskId,
    initialTime,
    remainingTime,
    lastUpdated: Date.now(),
    isPaused,
    pausedTime: isPaused ? remainingTime : null,
  };
  localStorage.setItem(`taskTimer_${taskId}`, JSON.stringify(timerState));
}

// Function to calculate the correct remaining time
function calculateRemainingTime(storedState) {
  // If the timer was paused, return the pausedTime directly
  if (storedState.isPaused && storedState.pausedTime !== null) {
    return storedState.pausedTime;
  }

  // Otherwise calculate elapsed time
  const elapsedTime = (Date.now() - storedState.lastUpdated) / 1000;
  return Math.max(0, storedState.remainingTime - elapsedTime);
}

// Function to retrieve timer state from localStorage
function getTimerState(taskId) {
  const storedState = localStorage.getItem(`taskTimer_${taskId}`);
  return storedState ? JSON.parse(storedState) : null;
}

// Function to initialize timer when opening a task
function initializeTaskTimer(taskId) {
  const storedState = getTimerState(taskId);
  if (storedState) {
    if (storedState.remainingTime === 0) {
      localStorage.removeItem(`taskTimer_${taskId}`);
      return;
    }

    remainingTime = calculateRemainingTime(storedState);
    initialTime = storedState.initialTime;
    updateTime(Math.floor(remainingTime / 86400), Math.floor((remainingTime % 86400) / 3600), Math.floor((remainingTime % 3600) / 60), Math.floor(remainingTime % 60));
    startTimer(taskId);
    currentTimerTask = taskId;
  } else {
    resetCompletely();
  }
}

taskTimerHeader.addEventListener("click", function (e) {
  const timerEl = e.target.closest(".timer");

  if (!timerEl) return;
  const { time } = timerEl?.dataset;
  const timerInNumber = Number(time);
  const timeEl = timerEl.querySelector(".time");

  // Increment
  if (e.target.closest(".increment_timer--btn")) {
    const updatedValue = timerInNumber + 1;
    timerEl.setAttribute("data-time", updatedValue);
    timeEl.textContent = formatNumber(updatedValue);
  }

  // Decrement
  if (e.target.closest(".decrement_timer--btn")) {
    if (timerInNumber <= 0) return;

    const updatedValue = timerInNumber - 1;
    timerEl.setAttribute("data-time", updatedValue);
    timeEl.textContent = formatNumber(updatedValue);
  }
});

// Start Timer
startTimerBtn.onclick = () => {
  const { taskId } = taskTimerModal.dataset;

  localStorage.removeItem(`taskTimer_${taskId}`);
  startTimer(taskId);
  currentTimerTask = taskId;

  // update task list to show the timer icon
  renderUserTasks();
};

function startTimer(taskId) {
  const { time: days } = daysTimer.dataset;
  const { time: hours } = hoursTimer.dataset;
  const { time: minutes } = minutesTimer.dataset;
  const { time: seconds } = secondsTimer.dataset;

  const convertedDaysToNumber = Number(days);
  const convertedHoursToNumber = Number(hours);
  const convertedMinutesToNumber = Number(minutes);
  const convertedSecondsToNumber = Number(seconds);

  if (convertedDaysToNumber <= 0 && convertedHoursToNumber <= 0 && convertedMinutesToNumber <= 0 && convertedSecondsToNumber <= 0) return;

  clearInterval(timerInterval);
  const setTime = convertedDaysToNumber * 86400 + convertedHoursToNumber * 3600 + convertedMinutesToNumber * 60 + convertedSecondsToNumber;

  const storedState = getTimerState(taskId);
  if (storedState) {
    remainingTime = calculateRemainingTime(storedState);
    initialTime = storedState.initialTime;
  } else {
    remainingTime = Math.floor(setTime);
    initialTime = Math.floor(setTime);
  }

  currentTaskId = taskId; // Set currentTaskId here
  saveTimerState(taskId, initialTime, remainingTime, false);

  timerInterval = setInterval(() => {
    updateCountdown();
    // State saving is now handled in updateCountdown
  }, 1000);

  handleButtonsState(true, false, false, false, true);
}

// Update Timer
function updateCountdown() {
  if (remainingTime <= 0) {
    // Clear the interval first
    clearInterval(timerInterval);

    if (currentTaskId) {
      const timerKey = `taskTimer_${currentTaskId}`;
      localStorage.removeItem(timerKey);

      // Clear current task ID to prevent re-saving
      currentTaskId = null;

      // Reset the timer display
      updateTime(0, 0, 0, 0);

      // Update button states
      handleButtonsState(false, true, true, true, false);

      // Update task list
      renderUserTasks();
    }
  } else {
    remainingTime--;

    const days = Math.floor(remainingTime / 86400);
    const hours = Math.floor((remainingTime % 86400) / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = Math.floor(remainingTime % 60);

    // Update time interface and DOM
    updateTime(days, hours, minutes, seconds);
  }
}

function handleButtonsState(startBtn, resetBtn, stopBtn, deleteBtn, updateBtn) {
  startTimerBtn.disabled = startBtn;
  resetTimerBtn.disabled = resetBtn;
  stopTimerBtn.disabled = stopBtn;
  deleteTimerBtn.disabled = deleteBtn;
  taskTimerHeader.querySelectorAll("button").forEach((btn) => (btn.disabled = updateBtn));
}

// PadStart the Number
function formatNumber(num) {
  return num.toString().padStart(2, "0");
}

// Reset Everything completely
function resetCompletely() {
  clearInterval(timerInterval);
  remainingTime = 0;
  initialTime = 0;
  currentTaskId = null;

  // Update time interface and DOM
  updateTime(0, 0, 0, 0);

  // Actions state
  handleButtonsState(false, true, true, true, false);
}

/**
 * @param {string} day
 * @param {string} hours
 * @param {string} minutes
 * @param {string} seconds
 */
function updateTime(days, hours, minutes, seconds) {
  daysTimer.setAttribute("data-time", days);
  hoursTimer.setAttribute("data-time", hours);
  minutesTimer.setAttribute("data-time", minutes);
  secondsTimer.setAttribute("data-time", seconds);

  daysTimer.querySelector(".time").innerText = formatNumber(days);
  hoursTimer.querySelector(".time").innerText = formatNumber(hours);
  minutesTimer.querySelector(".time").innerText = formatNumber(minutes);
  secondsTimer.querySelector(".time").innerText = formatNumber(seconds);

  // const { taskId } = taskTimerModal.dataset;
  // currentTaskId = taskId;
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// Reset Event
resetTimerBtn.onclick = function () {
  const { taskId } = taskTimerModal.dataset;

  clearInterval(timerInterval);

  // Reset remainingTime to initialTime
  remainingTime = initialTime;

  // Update the timer display
  const days = Math.floor(remainingTime / 86400);
  const hours = Math.floor((remainingTime % 86400) / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;
  updateTime(days, hours, minutes, seconds);

  currentTaskId = taskId;

  // If we're using localStorage, update the stored state
  if (currentTaskId) {
    saveTimerState(currentTaskId, initialTime, remainingTime);
  }

  // Restart the timer
  timerInterval = setInterval(updateCountdown, 1000);

  // Update button states
  handleButtonsState(true, false, false, false, true);
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// Stop Event
stopTimerBtn.onclick = function () {
  const { mode } = this.dataset;
  const { taskId } = taskTimerModal.dataset;

  if (mode === "stop") {
    // Pause the timer
    clearInterval(timerInterval);
    pausedTime = remainingTime; // Store the exact time when paused
    saveTimerState(taskId, initialTime, remainingTime, true); // Save paused state

    stopTimerBtn.dataset.mode = "resume";
    stopContent.textContent = "Resume";
  } else if (mode === "resume") {
    // Resume from exactly where we paused
    remainingTime = pausedTime;
    startTimer(taskId);
    currentTimerTask = taskId;
    pausedTime = null;

    stopTimerBtn.dataset.mode = "stop";
    stopTimerBtn.textContent = "Stop";
  }
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// Delete Event
deleteTimerBtn.onclick = function () {
  const { taskId } = taskTimerModal.dataset;
  clearInterval(timerInterval);

  localStorage.removeItem(`taskTimer_${taskId}`);
  resetCompletely();

  // update task list to hide the timer icon
  renderUserTasks();
};
