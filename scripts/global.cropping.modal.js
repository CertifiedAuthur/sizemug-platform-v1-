document.addEventListener("DOMContentLoaded", () => {
  /**
   * A reference to the file input element for uploading profile photos.
   * This element is used to handle the user's profile photo upload process.
   *
   * @type {HTMLInputElement}
   */
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  const croppingPreviewContainerImage = document.getElementById("croppingPreviewContainerImage");
  const croppingModal = document.getElementById("croppingModal");
  const progressBar = document.querySelector(".cropping_progress_bar");
  const progressThumb = document.querySelector(".cropping_progress_thumb");
  const progressFill = document.querySelector(".cropping_progress_fill");
  const cropBtn = document.getElementById("cropBtn");
  const cancelCroppingModal = document.getElementById("cancelCroppingModal");

  let cropper;
  let isDragging = false;
  const minZoom = 0.1;
  const maxZoom = 3;

  // Initialize cropper when image is loaded
  function initCropper() {
    if (cropper) {
      cropper.destroy();
    }

    cropper = new Cropper(croppingPreviewContainerImage, {
      viewMode: 1, // Restrict view to container
      responsive: true,
      dragMode: "move",
      aspectRatio: 1,
      ready: function () {
        // Set initial zoom when cropper is ready
        const zoomRatio = 0.5; // 50% zoom
        setZoomPosition(zoomRatio);
      },
    });
  }

  if (profilePhotoInput) {
    profilePhotoInput.addEventListener("change", function () {
      const files = Array.from(this.files);

      if (files.length) {
        readFilesAsBase64(files).then((base64Images) => {
          showCroppingModal();
          croppingPreviewContainerImage.src = base64Images[0];

          // Initialize cropper after image is loaded
          croppingPreviewContainerImage.addEventListener("load", initCropper);
        });
      } else {
        console.log("Nothing was selected");
      }
    });
  } else {
    console.error("Element with id 'profilePhotoInput' not found.");
  }

  cancelCroppingModal.addEventListener("click", hideCroppingModal);
  croppingModal.addEventListener("click", (e) => {
    if (e.target.id === "croppingModal") return hideCroppingModal();
  });

  cropBtn.addEventListener("click", handleCrop);

  function handleCrop() {
    if (!cropper) {
      console.error("Cropper is not initialized or not ready.");
      return;
    }

    const canvas = cropper.getCroppedCanvas({
      width: 300,
      height: 300,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high",
    });

    const croppedImage = canvas?.toDataURL?.("image/jpeg", 0.9);

    updateUserProfilePhoto(croppedImage);
    hideCroppingModal();

    //     cropBtn.removeEventListener("click", handleCrop);
  }

  function showCroppingModal() {
    croppingModal.classList.remove(HIDDEN); // Show cropping modal
    cropBtn.removeAttribute("disabled");
    //     cropper = null;
  }

  function hideCroppingModal() {
    croppingModal.classList.add(HIDDEN); // Hide cropping modal
    //     cropper = null;
  }

  // Handle zoom based on progress bar position
  function handleZoom(e) {
    if (!cropper || !cropper.ready) return;

    const rect = progressBar.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percentage = x / rect.width;

    setZoomPosition(percentage);
  }

  // Set zoom position and update UI
  function setZoomPosition(percentage) {
    if (!cropper || !cropper.ready) return;

    try {
      // Update progress bar UI
      progressFill.style.width = `${percentage * 100}%`;
      progressThumb.style.left = `${percentage * 100}%`;

      // Calculate and apply zoom
      const zoomValue = minZoom + percentage * (maxZoom - minZoom);

      // Get the center point of the crop box
      const cropBox = cropper.getCropBoxData();
      const centerX = cropBox.left + cropBox.width / 2;
      const centerY = cropBox.top + cropBox.height / 2;

      // Apply zoom with center point
      cropper.zoomTo(zoomValue, {
        x: centerX,
        y: centerY,
      });
    } catch (error) {
      console.warn("Zoom operation failed:", error);
    }
  }

  // Mouse event handlers for zoom control
  progressBar.addEventListener("mousedown", (e) => {
    if (!cropper || !cropper.ready) return;
    isDragging = true;
    handleZoom(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging && cropper && cropper.ready) {
      handleZoom(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
});
