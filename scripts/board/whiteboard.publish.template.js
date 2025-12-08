class PublishTemplateModal {
  constructor() {
    this.publishAsTemplateModal = document.getElementById("publishAsTemplateModal");
    this.openPublishBtn = document.getElementById("openPublishBtn");
    this.publishAsTemplateModalCloseButton = document.getElementById("publishAsTemplateModalCloseButton");
    this.uploadButton = document.getElementById("publishAsTemplateUploadImageButton");
    this.dropZone = document.querySelector(".publish-as-template-modal-upload-image-before");
    this.previewContainer = document.querySelector(".publish-as-template-modal-upload-image-after");
    this.previewImage = this.previewContainer.querySelector("img");
    this.removeImageButton = this.previewContainer.querySelector("button");

    this.openPublishBtn.addEventListener("click", () => {
      this.publishAsTemplateModal.classList.remove(HIDDEN);
    });

    this.publishAsTemplateModalCloseButton.addEventListener("click", () => {
      this.publishAsTemplateModal.classList.add(HIDDEN);
    });

    this._initializeUploadHandlers();

    // 모달 외부 클릭 시 모달 닫기
    this.templateModal = document.getElementById("publishAsTemplateModal");
    this.templateModal.addEventListener("click", (event) => {
      if (event.target === this.templateModal) {
        this.templateModal.classList.add(HIDDEN);
      }
    });

    // Instantiate the custom dropdown
    this.categoryDropdown = new SGCustomDropdown("publishCategoryDropdown", {
      placeholder: "Select Category",
      data: [
        { value: "business", label: "Business" },
        { value: "education", label: "Education" },
        { value: "personal", label: "Personal" },
        { value: "marketing", label: "Marketing" },
        { value: "design", label: "Design" },
      ],
      disabled: false,
      onChange: (value) => {
        console.log("Selected category:", value);
      },
    });
  }

  _initializeUploadHandlers() {
    // Handle file upload button click
    this.uploadButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => this._handleFileSelect(e.target.files[0]);
      input.click();
    });

    // Handle drag and drop events
    this.dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropZone.style.backgroundColor = "#f3f4f6";
    });

    this.dropZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropZone.style.backgroundColor = "";
    });

    this.dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropZone.style.backgroundColor = "";

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        this._handleFileSelect(file);
      }
    });

    // Handle remove image button click
    this.removeImageButton.addEventListener("click", () => {
      this.previewImage.src = "";
      this.dropZone.classList.remove(HIDDEN);
      this.previewContainer.classList.add(HIDDEN);
    });
  }

  _handleFileSelect(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewImage.src = e.target.result;
      this.dropZone.classList.add(HIDDEN);
      this.previewContainer.classList.remove(HIDDEN);
    };

    reader.readAsDataURL(file);
  }
}

new PublishTemplateModal();
