document.addEventListener("DOMContentLoaded", () => {
  // Starting time (in seconds)
  let countdownTime = 5 * 24 * 60 * 60 + 20 * 60 * 60 + 12 * 60 + 39;

  // Update the timer every second
  const countdownInterval = setInterval(() => {
    // Calculate remaining time units
    const days = Math.floor(countdownTime / (24 * 60 * 60));
    const hours = Math.floor((countdownTime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((countdownTime % (60 * 60)) / 60);
    const seconds = countdownTime % 60;

    // Update the HTML elements
    document.querySelector(".time-block:nth-child(1) .time-block-count").textContent = days;
    document.querySelector(".time-block:nth-child(2) .time-block-count").textContent = hours;
    document.querySelector(".time-block:nth-child(3) .time-block-count").textContent = minutes;
    document.querySelector(".time-block:nth-child(4) .time-block-count").textContent = seconds;

    // Decrease countdown time
    countdownTime--;

    // Stop countdown when time reaches zero
    if (countdownTime < 0) {
      clearInterval(countdownInterval);
      alert("Countdown finished!");
    }
  }, 1000);
});
