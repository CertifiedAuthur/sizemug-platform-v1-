// Gallery functionality
document.addEventListener("DOMContentLoaded", function () {
  const galleryToggleBtn = document.getElementById("galleryToggleBtn");
  const galleryContent = document.getElementById("galleryContent");
  const galleryBackBtn = document.getElementById("galleryBackBtn");
  const galleryModal = document.getElementById("galleryModal");
  const galleryModalClose = document.getElementById("galleryModalClose");
  const galleryModalImage = document.getElementById("galleryModalImage");
  const galleryModalTitle = document.getElementById("galleryModalTitle");
  const galleryThumbnails = document.getElementById("galleryThumbnails");
  const gallerySearchInput = document.getElementById("gallerySearchInput");
  const galleryGrid = document.getElementById("galleryGrid");

  let currentImageIndex = 0;
  let galleryImages = [];

  // Initialize gallery images from the grid
  function initializeGalleryImages() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    galleryImages = Array.from(galleryItems).map((item, index) => ({
      src: item.dataset.image,
      alt: item.querySelector("img").alt,
      index: index,
    }));
  }

  // Toggle gallery visibility
  function toggleGallery() {
    const isVisible = galleryContent.style.display !== "none";
    const modalContent = document.getElementById("modalContent");
    const modalHeader = document.querySelector(".modal-header");

    if (isVisible) {
      // Hide gallery, show modal content and header
      galleryContent.style.display = "none";
      if (modalContent) {
        modalContent.style.display = "block";
      }
      if (modalHeader) {
        modalHeader.style.display = "flex";
      }
    } else {
      // Show gallery, hide modal content and header
      galleryContent.style.display = "block";
      if (modalContent) {
        modalContent.style.display = "none";
      }
      if (modalHeader) {
        modalHeader.style.display = "none";
      }
      initializeGalleryImages();
    }
  }

  // Show gallery modal with specific image
  function showGalleryModal(imageIndex) {
    if (imageIndex < 0 || imageIndex >= galleryImages.length) return;

    currentImageIndex = imageIndex;
    const image = galleryImages[imageIndex];

    galleryModalImage.src = image.src;
    galleryModalImage.alt = image.alt;
    galleryModalTitle.textContent = image.alt || "Media name";

    // Generate thumbnails
    generateThumbnails();

    // Hide gallery content and show modal
    galleryContent.style.display = "none";
    galleryModal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Hide gallery modal
  function hideGalleryModal() {
    galleryModal.style.display = "none";
    galleryContent.style.display = "block";
    document.body.style.overflow = "";
  }

  // Generate thumbnail navigation
  function generateThumbnails() {
    if (!galleryThumbnails) return;

    galleryThumbnails.innerHTML = "";

    galleryImages.forEach((image, index) => {
      const thumbnail = document.createElement("div");
      thumbnail.className = `gallery-thumbnail ${index === currentImageIndex ? "active" : ""}`;
      thumbnail.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;

      thumbnail.addEventListener("click", () => {
        showGalleryModal(index);
      });

      galleryThumbnails.appendChild(thumbnail);
    });

    // Scroll active thumbnail into view
    const activeThumbnail = galleryThumbnails.querySelector(".gallery-thumbnail.active");
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }

  // Navigate to next/previous image
  function navigateImage(direction) {
    const newIndex = currentImageIndex + direction;
    if (newIndex >= 0 && newIndex < galleryImages.length) {
      showGalleryModal(newIndex);
    }
  }

  // Search functionality
  function filterGallery(searchTerm) {
    const galleryItems = document.querySelectorAll(".gallery-item");

    galleryItems.forEach((item) => {
      const alt = item.querySelector("img").alt.toLowerCase();
      const matches = alt.includes(searchTerm.toLowerCase());
      item.style.display = matches ? "block" : "none";
    });
  }

  // Download image
  function downloadImage(imageSrc, imageName) {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = imageName || "image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Event listeners
  if (galleryToggleBtn) {
    galleryToggleBtn.addEventListener("click", toggleGallery);
  }

  if (galleryBackBtn) {
    galleryBackBtn.addEventListener("click", toggleGallery);
  }

  if (galleryModalClose) {
    galleryModalClose.addEventListener("click", hideGalleryModal);
  }

  // Close modal when clicking outside
  if (galleryModal) {
    galleryModal.addEventListener("click", function (e) {
      if (e.target === galleryModal) {
        hideGalleryModal();
      }
    });
  }

  // Search input
  if (gallerySearchInput) {
    gallerySearchInput.addEventListener("input", function (e) {
      filterGallery(e.target.value);
    });
  }

  // Gallery item click handlers
  document.addEventListener("click", function (e) {
    // Handle expand button clicks
    if (e.target.closest(".gallery-item-expand")) {
      e.preventDefault();
      const galleryItem = e.target.closest(".gallery-item");
      const imageIndex = Array.from(document.querySelectorAll(".gallery-item")).indexOf(galleryItem);
      showGalleryModal(imageIndex);
    }

    // Handle download button clicks
    if (e.target.closest(".gallery-item-download")) {
      e.preventDefault();
      const galleryItem = e.target.closest(".gallery-item");
      const imageSrc = galleryItem.dataset.image;
      const imageName = galleryItem.querySelector("img").alt;
      downloadImage(imageSrc, imageName);
    }

    // Handle modal download button
    if (e.target.closest(".gallery-modal-download")) {
      e.preventDefault();
      const currentImage = galleryImages[currentImageIndex];
      downloadImage(currentImage.src, currentImage.alt);
    }

    // Handle modal share button
    if (e.target.closest(".gallery-modal-share")) {
      e.preventDefault();
      const currentImage = galleryImages[currentImageIndex];
      if (navigator.share) {
        navigator.share({
          title: currentImage.alt,
          url: currentImage.src,
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(currentImage.src).then(() => {
          alert("Image URL copied to clipboard!");
        });
      }
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (galleryModal.style.display === "block") {
      switch (e.key) {
        case "Escape":
          hideGalleryModal();
          break;
        case "ArrowLeft":
          navigateImage(-1);
          break;
        case "ArrowRight":
          navigateImage(1);
          break;
      }
    }
  });

  // Initialize on load
  initializeGalleryImages();
});
