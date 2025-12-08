const qrCodeModal = document.getElementById("qrCodeModal");
const hideQRcodeModalBtn = document.getElementById("hideQRcodeModalBtn");
const downloadQrcodeBtn = document.getElementById("downloadQrcodeBtn");
const qrCodeCanvas = document.getElementById("qrCodeCanvas");
const qrCodeContainerModalMobileCancel = document.getElementById("qrCodeContainerModalMobileCancel");

// Download QR code
downloadQrcodeBtn?.addEventListener("click", function (e) {
  this.href = qrCodeCanvas.toDataURL("image/png");
  this.style.display = "none";
});

// Hide QR code modal
qrCodeModal.addEventListener("click", (e) => {
  if (e.target.id === "qrCodeModal") {
    hideQRcodeModal();
  }
});

// Mobile Hide QR code
qrCodeContainerModalMobileCancel.addEventListener("click", () => {
  hideQRcodeModal();
});

// Desktop Hide Button
hideQRcodeModalBtn.addEventListener("click", (e) => {
  hideQRcodeModal();
});

// Show QR code modal
function showQRcodeModal() {
  const userType = localStorage.getItem("user-type") ?? "normal";
  const qrcodeModalName = document.getElementById("qrcode-modal-name");
  const qrcodeProfileName = document.getElementById("qrcode-profile-name");

  console.log("QRCODE");

  if (userType === "") {
    qrcodeModalName.innerText = "Your";
    qrcodeProfileName.innerText = "Musa Abdulkabir";
  } else {
    qrcodeModalName.innerText = `${"Musa Abdulkabir".split(" ").at(0)}'s`;
    qrcodeProfileName.innerText = "Musa Abdulkabir";
  }

  // generate QR code
  new QRious({
    element: qrCodeCanvas,
    value: "https://github.com/official-commandcodes", // URL to encode
    size: 270, // Ensure it's a perfect square
    background: "transparent", // Transparent background
    foreground: "#000000", // Black QR code
  });

  qrCodeModal.classList.remove(HIDDEN);
}

// Hide QR code modal
function hideQRcodeModal() {
  qrCodeModal.classList.add(HIDDEN);
}

document.getElementById("copyUserURL")?.addEventListener("click", function () {
  const username = this.closest(".content").querySelector(".username");
  const text = `https://sizemug.com/${username.textContent}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      showFlashMessage("Text copied to clipboard successfully!", "", "success", 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
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
 * This is for chat page only. Group & Live chat
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

const groupLiveQRCodeModal = document.getElementById("groupLiveQRCodeModal");
const groupLiveQRCodeCanvas = document.getElementById("groupLiveQRCodeCanvas");
const downloadGroupLiveQrcodeBtn = document.getElementById("downloadGroupLiveQrcodeBtn");

downloadGroupLiveQrcodeBtn?.addEventListener("click", function (e) {
  this.href = groupLiveQRCodeCanvas.toDataURL("image/png");
  this.style.display = "none";
});

groupLiveQRCodeModal?.addEventListener("click", (e) => {
  if (e.target.id === "groupLiveQRCodeModal") {
    hideGroupLiveQRcodeModal();
  }
});

function hideGroupLiveQRcodeModal() {
  groupLiveQRCodeModal.classList.add(HIDDEN);
}

// Show QR code modal
function showGroupLiveQRcodeModal(name) {
  const qrcodeModalName = document.getElementById("groupQRCodeModalName");
  const qrcodeProfileName = document.getElementById("groupQRCodeProfileName");

  qrcodeModalName.innerText = `${name.split(" ").at(0)}'s`;
  qrcodeProfileName.innerText = name;

  // generate QR code
  new QRious({
    element: groupLiveQRCodeCanvas,
    value: "https://sizemug.com/commandcodes", // URL to encode
    size: 270, // Ensure it's a perfect square
    background: "transparent", // Transparent background
    foreground: "#000000", // Black QR code
  });

  groupLiveQRCodeModal.classList.remove(HIDDEN);
}
