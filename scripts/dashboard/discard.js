// const discardBtn = document.getElementById("discard_task--btn");
// const hideDiscardBtn= document.querySelector(".cancel_discard");

// // Hide Discard Modal
// hideDiscardModal.addEventListener("click", function () {
//   localStorage.setItem("sizemug_discard", JSON.stringify([]));
//   taskDiscardContainer.classList.add(HIDDEN);
// });

// // Delete Event
// discardBtn.addEventListener("click", function (e) {
//   const discardItem = JSON.parse(localStorage.getItem("sizemug_discard")) ?? [];

//   if (discardItem.length) {
//     const toBeDiscard = discardItem[0];
//     if (toBeDiscard.type === "task") {
//       const savedTasks = getLocalStorage(); // get localstorage data
//       const results = savedTasks.filter((task) => task.id !== +toBeDiscard.taskId);

//       setLocalStorage(results); // update localstorage
//       localStorage.setItem("sizemug_discard", JSON.stringify([])); // empty storage sizemug_discard
//       taskDiscardContainer.classList.add(HIDDEN); // hide discard comtainer
//       localStorage.removeItem(`taskTimer_${toBeDiscard.taskId}`);

//       renderUserTasks(); // update task lists again
//       return;
//     }
//   }
// });
