const customToastEl = document.getElementById("custom_toast");

let interval;

function showToast(className, content = "Empty Toast content", type = "correct") {
  const toastContent = customToastEl.querySelector(".toast_content");
  const correctEmoji = customToastEl.querySelector(".emoji .correct");
  const failEmoji = customToastEl.querySelector(".emoji .fail");

  if (!className) return console.error("Please provide className to used 👍.");

  if (type === "fail") {
    correctEmoji.classList.add(className);
    failEmoji.classList.remove(className);
  } else if (type === "correct") {
    failEmoji.classList.add(className);
    correctEmoji.classList.remove(className);
  }

  customToastEl.classList.add(type);
  toastContent.innerHTML = content;
  customToastEl.classList.remove(className);

  clearInterval(interval);
  interval = setInterval(() => {
    customToastEl.classList.add(className);
  }, 2000);
}

function hideToast() {
  customToastEl.classList.add(className);
}
