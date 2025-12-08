const newLiveChatModal = document.getElementById("newLiveChatModal");
const newLiveChat = document.getElementById("newLiveChat");
const canceLiveChatModal = document.getElementById("canceLiveChatModal");

newLiveChat.addEventListener("click", showCreateLiveChat);
canceLiveChatModal.addEventListener("click", hideCreateLiveChat);

newLiveChatModal.addEventListener("click", (e) => {
  if (e.target.id === "newLiveChatModal") hideCreateLiveChat();
});

function showCreateLiveChat() {
  newLiveChatModal.focus(); // Apply focus state

  newLiveChatModal.classList.remove(HIDDEN);
}

function hideCreateLiveChat() {
  newLiveChatModal.blur(); // Remove focus state

  newLiveChatModal.classList.add(HIDDEN);
}

/**
 *
 *
 *
 *
 */
const newLiveChatMemberCounts = document.getElementById("newLiveChatMemberCounts");

// Prevent the letter 'e', 'E', and symbols like '+', '-' from being entered
newLiveChatMemberCounts.addEventListener("keydown", function (event) {
  if (event.key === "e" || event.key === "E" || event.key === "+" || event.key === "-") {
    event.preventDefault();
  }
});

// Ensure the value remains a valid number
newLiveChatMemberCounts.addEventListener("input", function () {
  this.value = this.value.replace(/e|E|\+|\-/g, "");
});

/**
 *
 *
 *
 *
 *
 */

const profilePhotoLabel = document.getElementById("profilePhotoLabel");
const newLiveChatPhoto = document.getElementById("newLiveChatPhoto");
const sizemugImageDropContainer = document.getElementById("sizemugImageDropContainer");

profilePhotoLabel.addEventListener("click", (e) => {
  newLiveChatPhoto.click();
});

// Change Images Event
newLiveChatPhoto.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  handleFilesChange(files);
});

// Drag & Drop Event
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  sizemugImageDropContainer.addEventListener(eventName, preventDefaults, false);
});

sizemugImageDropContainer.addEventListener("dragover", function () {
  this.classList.add("active");
});

sizemugImageDropContainer.addEventListener("dragleave", function () {
  this.classList.remove("active");
});

sizemugImageDropContainer.addEventListener("drop", drop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function drop(e) {
  const dt = e.dataTransfer;
  const files = Array.from(dt.files);

  handleFilesChange(files);
}

// function that handle both drop & drag and select images
// function handleFilesChange(files) {
//   console.log("Files received:", files);
//   console.log("Is Array?", Array.isArray(files));
//   console.log("Type:", typeof files);

//   const readFilesAsBase64 = (files) => {
//     console.log(files);
//     return files.map((file) => {
//       if (!file.type.startsWith("image/")) return;

//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);

//         reader.onloadend = function () {
//           resolve(reader.result); // resolve with the base64 data
//         };

//         reader.onerror = function () {
//           reject(new Error("File reading error"));
//         };
//       });
//     });
//   };

//   readFilesAsBase64(files).then((base64Images) => {
//     console.log(base64Images);

//     // const newLiveChatPhotoPreview = document.getElementById("newLiveChatPhotoPreview");
//     // const img = document.createElement("img");

//     // newLiveChatPhotoPreview.innerHTML = "";

//     // img.src = base64Images;
//     // newLiveChatPhotoPreview.appendChild(img);
//   });
// }
