const convertFileModal = document.getElementById("convert_file_modal");
const convertFileBtn = document.getElementById("convert_file_btn");

const convertFormatContainer = document.getElementById("convert_format");
const startConvertingContainer = document.getElementById("start_converting");
const convertContinueBtn = document.getElementById("convert_continue");
const convertBackBtn = document.getElementById("convert_back");
const startConvertingHeader = startConvertingContainer.querySelector(".start_converting--header");
const startConvertingDesc = startConvertingContainer.querySelector(".start_converting--desc");
const startConvertingDoneImage = startConvertingContainer.querySelector(".done_image");
const convertDocumentElement = document.querySelector(".convert_document_element");
const mobileHideConvertToFileModalBtn = document.getElementById("mobileHideConvertToFileModalBtn");

let fileSelected;

[convertDocumentElement, convertFileBtn].forEach((button) => {
  button.addEventListener("click", () => {
    convertFileModal.classList.remove(HIDDEN);
    closeDropdownBar(); // close all dropdown
  });
});

mobileHideConvertToFileModalBtn.addEventListener("click", () => {
  convertFileModal.classList.add(HIDDEN);
});

// Choose Format Type
convertFormatContainer.addEventListener("click", function (e) {
  const button = e.target.closest("button");

  if (button) {
    const { type } = button.dataset;
    const allButtons = this.querySelectorAll("button");

    allButtons.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");

    if (type === "pdf") fileSelected = "PDF";
    if (type === "doc") fileSelected = "DOC";
    if (type === "text") fileSelected = "TXT";
  }
});

// Continue Event
convertContinueBtn.addEventListener("click", function () {
  const { current } = this.dataset;

  if (current === "select") {
    if (fileSelected) {
      moveToStartConverting(fileSelected);
    }

    return;
  }
});

// Back Event
convertBackBtn.addEventListener("click", function () {
  const { current } = this.dataset;

  if (current === "select") {
    handleHideConvertContainer();
    return;
  }

  if (current === "converting") {
    moveToSelectFile();
  }
});

function moveToStartConverting(type) {
  const selectConvertType = document.getElementById("select_convert_type");

  selectConvertType.textContent = type; // hide DOM content
  convertFormatContainer.classList.add(HIDDEN); // hide select convert type container
  startConvertingContainer.classList.remove(HIDDEN); // show start converting container
  convertContinueBtn.classList.add(HIDDEN); // hide continue button

  convertBackBtn.textContent = "Back";
  convertBackBtn.setAttribute("data-current", "converting");
}

function moveToSelectFile() {
  convertFormatContainer.classList.remove(HIDDEN); // show select convert type container
  startConvertingContainer.classList.add(HIDDEN); // hide start converting container
  convertContinueBtn.classList.remove(HIDDEN); // show continue button

  convertBackBtn.textContent = "Cancel";
  convertBackBtn.setAttribute("data-current", "select");
}

function handleHideConvertContainer() {
  convertBackBtn.textContent = "Cancel";
  convertContinueBtn.textContent = "Continue";
  convertBackBtn.setAttribute("data-current", "select");
  convertFileModal.classList.add(HIDDEN); // hide convert container
  convertFormatContainer.classList.remove(HIDDEN);
  startConvertingContainer.classList.add(HIDDEN);
  convertContinueBtn.classList.remove(HIDDEN); // show continue button
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
const startConvertingBtn = document.getElementById("start_converting--btn");
const convertingProgressContainer = document.getElementById("converting_progress_container");
const convertingIncreasingBg = document.getElementById("converting_increasing_bg");
const downloadConvert = document.getElementById("download_convert");

const convertingText = "Please hold on while we process your document into the selected format. This may take a few moments, depending on the size of the file.";
const completedConvertingText = "You are about to convert your file. Please review the selected format and ensure everything is correct. Once confirmed, we will begin the conversion process.";

startConvertingBtn.addEventListener("click", function () {
  this.classList.add(HIDDEN);
  convertingProgressContainer.classList.remove(HIDDEN);
  startConvertingDesc.textContent = convertingText;
  startProcessing();
});

let processInterval;
let progressCount = 0;

function startProcessing() {
  processInterval = setInterval(() => {
    if (progressCount === 100) {
      clearInterval(processInterval);
      startConvertingDoneImage.classList.remove(HIDDEN);
      startConvertingHeader.innerHTML = `Successfully converted to <span id="select_convert_type">PDF</span>`;
      startConvertingDesc.textContent = completedConvertingText;
      startConvertingBtn.classList.add(HIDDEN);
      downloadConvert.classList.remove(HIDDEN);
      convertingProgressContainer.classList.add(HIDDEN);
      return;
    }

    progressCount++;
    convertingIncreasingBg.textContent = `${progressCount}%`;
    convertingIncreasingBg.style.width = `${progressCount}%`;
  }, 50);
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
downloadConvert.addEventListener("click", () => {
  handleHideConvertContainer();
});
