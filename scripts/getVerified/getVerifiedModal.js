document.addEventListener("DOMContentLoaded", () => {
  const getVerifiedNextBtn = document.getElementById("get_verified--next");
  const getVerifiedBackBtn = document.getElementById("get_verified--cancel");
  const personalInfo = document.getElementById("personal_info");
  const accountDetails = document.getElementById("account_details");
  const supportingDocuments = document.getElementById("supporting_documents");
  const verificationDeclaration = document.getElementById("verification_declaration");
  const closeMatchingModal = document.getElementById("close_matching_modal");
  const stepContent = document.getElementById("step_content");

  function hideAllContainers() {
    const containerStepWrapper = document.querySelectorAll(".container_step_wrapper");

    containerStepWrapper.forEach((container) => {
      container.classList.add(HIDDEN);
    });
  }

  function setNextTabButton(element, attr, textContent) {
    element.setAttribute("data-next-tab", attr);
    element.textContent = textContent;
  }

  function setBackTabButton(element, attr, textContent) {
    element.setAttribute("data-back-tab", attr);
    element.textContent = textContent;
  }

  function handleStepContent(content) {
    stepContent.textContent = content;
  }

  // Hide Get Verified Modal
  closeMatchingModal.addEventListener("click", hideApplyVerification);

  // Next Movement
  getVerifiedNextBtn.addEventListener("click", function () {
    const { nextTab } = this.dataset;

    if (nextTab === "accountDetails") {
      hideAllContainers();
      accountDetails.classList.remove(HIDDEN);
      setNextTabButton(this, "supportingDoc", "Next");
      setBackTabButton(getVerifiedBackBtn, "personalInfo", "Back");

      headerDotUpdate(2);
      handleStepContent("Account Details");
      return;
    }

    if (nextTab === "supportingDoc") {
      hideAllContainers();
      supportingDocuments.classList.remove(HIDDEN);
      setNextTabButton(this, "declaration", "Next");
      setBackTabButton(getVerifiedBackBtn, "supportingDoc", "Back");

      headerDotUpdate(3);
      handleStepContent("Supporting Documents");
      return;
    }

    if (nextTab === "declaration") {
      hideAllContainers();
      verificationDeclaration.classList.remove(HIDDEN);
      setNextTabButton(this, "submit", "Submit Application");
      setBackTabButton(getVerifiedBackBtn, "declaration", "Back");
      this.setAttribute("disabled", true);

      headerDotUpdate(4);
      handleStepContent("Declaration");
      return;
    }

    if (nextTab === "submit") {
      hideAllContainers();
      personalInfo.classList.remove(HIDDEN);
      setNextTabButton(this, "accountDetails", "Next");
      setBackTabButton(getVerifiedBackBtn, "", "Cancel");

      hideApplyVerification();
      headerDotUpdate(1);
      handleStepContent("Personal Info");
    }
  });

  // Back Movement
  getVerifiedBackBtn.addEventListener("click", function () {
    const { backTab } = this.dataset;

    if (backTab === "personalInfo") {
      hideAllContainers();
      personalInfo.classList.remove(HIDDEN);
      setNextTabButton(getVerifiedNextBtn, "accountDetails", "Next");
      setBackTabButton(this, "", "Cancel");

      headerDotUpdate(1);
      handleStepContent("Personal Info");
    }

    if (backTab === "accountDetails") {
      hideAllContainers();
      accountDetails.classList.remove(HIDDEN);
      setNextTabButton(getVerifiedNextBtn, "supportingDoc", "Next");
      setBackTabButton(this, "personalInfo", "Back");

      headerDotUpdate(2);
      handleStepContent("Account Details");
      return;
    }

    if (backTab === "supportingDoc") {
      hideAllContainers();
      accountDetails.classList.remove(HIDDEN);
      setNextTabButton(getVerifiedNextBtn, "supportingDoc", "Next");
      setBackTabButton(this, "personalInfo", "Back");

      headerDotUpdate(2);
      handleStepContent("Account Details");
      return;
    }

    if (backTab === "declaration") {
      hideAllContainers();
      supportingDocuments.classList.remove(HIDDEN);
      setNextTabButton(getVerifiedNextBtn, "declaration", "Next");
      setBackTabButton(this, "supportingDoc", "Back");
      getVerifiedNextBtn.removeAttribute("disabled", true);

      headerDotUpdate(3);
      handleStepContent("Supporting Documenets");
      return;
    }

    if (backTab === "") {
      hideAllContainers();
      personalInfo.classList.remove(HIDDEN);
      setNextTabButton(this, "accountDetails", "Next");
      setBackTabButton(getVerifiedBackBtn, "", "Cancel");

      hideApplyVerification();
      headerDotUpdate(1);
      handleStepContent("Personal Info");
    }
  });

  /**
   *
   *
   *
   *
   *
   *
   */
  const identityTypes = document.getElementById("identity_types");
  const identityDocument = document.getElementById("identityDocument");

  identityTypes.addEventListener("click", function (e) {
    const clickedIdentity = e.target.closest("li");

    if (!clickedIdentity) return;

    // Unselect all identities first
    this.querySelectorAll("li").forEach((item) => {
      item.classList.remove("selected");
      item.querySelector("input").checked = false;
    });

    // Select the clicked identity
    clickedIdentity.classList.add("selected");
    clickedIdentity.querySelector("input").checked = true;
  });

  /**
   *
   * Click event change
   */
  identityDocument.addEventListener("change", (e) => {
    const files = [...e.target.files];
    handleUploadDocument(files[0]);
  });

  // Prevent all Default
  ["drop", "dragleave", "dragover"].forEach((event) => {
    document.addEventListener(event, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  document.addEventListener("dragover", function (e) {
    const dropIdentityDocumentArea = e.target.closest("#drop_identity_document_area");

    if (dropIdentityDocumentArea) {
      dropIdentityDocumentArea.classList.add("hover_drop");
    }
  });

  document.addEventListener("dragleave", function (e) {
    const dropIdentityDocumentArea = e.target.closest("#drop_identity_document_area");

    if (dropIdentityDocumentArea) {
      dropIdentityDocumentArea.classList.remove("hover_drop");
    }
  });

  document.addEventListener("drop", function (e) {
    const dropIdentityDocumentArea = e.target.closest("#drop_identity_document_area");

    if (dropIdentityDocumentArea) {
      dropIdentityDocumentArea.classList.remove("hover_drop");
      const files = [...e.dataTransfer.files];

      let file;

      for (let f = 0; f < files.length; f++) {
        const ext = files[f].type.split("/").at(-1);

        if (["pdf", "doc", "docx", "rtf"].includes(ext)) {
          file = files[f];
          break;
        }
      }

      if (file) handleUploadDocument(file);
    }
  });

  let interval;
  let progress = 0;
  const INTERVALTIME = 90; // milliseconds
  const uploadDocument = document.getElementById("upload_document");
  const progressState = document.getElementById("progress_state");
  const uploadProgressStroke = document.getElementById("upload_progress_stroke");
  const uploadingStatusBar = document.getElementById("uploading_status_bar");
  const uploadingDeleteAction = document.getElementById("uploading_delete_action");

  function handleUploadDocument(file) {
    const uploadDocumentName = document.getElementById("upload_document--name");
    const uploadDocumentSize = document.getElementById("upload_document--size");
    const maxFileSize = 50 * 1024 * 1024; // 50 MB in bytes

    const fileName = file.name;
    const fileSize = file.size;

    if (fileSize > maxFileSize) return alert("File size exceeds 50 MB. Please select a smaller file.");

    uploadDocument.classList.remove(HIDDEN);
    uploadDocument.scrollIntoView();
    animateHeight(uploadDocument, 0, uploadDocument.scrollHeight, 1000);

    uploadDocumentName.textContent = fileName;
    uploadDocumentSize.textContent = formatFileSize(fileSize);
    [uploadingStatusBar, uploadingDeleteAction].forEach((button) => {
      button.setAttribute("disabled", true);
    });

    interval = setInterval(() => {
      if (progress < 100) {
        progress++;
        progressState.textContent = `${progress}%`;
        uploadProgressStroke.style.width = `${progress}%`;
        return;
      }

      clearInterval(interval);
      [uploadingStatusBar, uploadingDeleteAction].forEach((button) => {
        button.removeAttribute("disabled");
      });
      uploadingStatusBar.querySelector("#uploading_doc").classList.add(HIDDEN);
      uploadingStatusBar.querySelector("#uploading_success").classList.remove(HIDDEN);
    }, INTERVALTIME);
  }

  /**
   *
   *
   * Agree to term and condition
   *
   */
  const agreeToCondition = document.getElementById("agreeToCondition");

  agreeToCondition.addEventListener("click", function () {
    if (this.querySelector("input").checked) {
      getVerifiedNextBtn.removeAttribute("disabled");
    } else {
      getVerifiedNextBtn.setAttribute("disabled", true);
    }
  });
});

function formatFileSize(bytes) {
  const sizes = ["Bytes", "KB", "MB"]; // more "GB", "TB"
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

function headerDotUpdate(step) {
  const step1Dot = document.getElementById("step_1_dot");
  const step2Dot = document.getElementById("step_2_dot");
  const step3Dot = document.getElementById("step_3_dot");
  const step4Dot = document.getElementById("step_4_dot");

  const line1 = document.getElementById("progress_line--1");
  const line2 = document.getElementById("progress_line--2");
  const line3 = document.getElementById("progress_line--3");

  if (step === 1) {
    addClass(step1Dot, "active");
    removeClass(step2Dot, "active");
    removeClass(step3Dot, "active");
    removeClass(step4Dot, "active");

    line1.style.width = "50%";
    line2.style.width = "0%";
    line3.style.width = "0%";
  } else if (step === 2) {
    addClass(step1Dot, "active");
    addClass(step2Dot, "active");
    removeClass(step3Dot, "active");
    removeClass(step4Dot, "active");

    line1.style.width = "100%";
    line2.style.width = "50%";
    line3.style.width = "0%";
  } else if (step === 3) {
    addClass(step1Dot, "active");
    addClass(step2Dot, "active");
    addClass(step3Dot, "active");
    removeClass(step4Dot, "active");

    line1.style.width = "100%";
    line2.style.width = "100%";
    line3.style.width = "50%";
  } else if (step === 4) {
    addClass(step1Dot, "active");
    addClass(step2Dot, "active");
    addClass(step3Dot, "active");
    addClass(step4Dot, "active");

    line1.style.width = "100%";
    line2.style.width = "100%";
    line3.style.width = "100%";
  }
}

function removeClass(element, className = HIDDEN) {
  element.classList.remove(className);
}

function addClass(element, className = HIDDEN) {
  element.classList.add(className);
}
