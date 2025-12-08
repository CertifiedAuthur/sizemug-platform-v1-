const previewColorPickerInstance = new ColorPicker(document.getElementById("colorPickerModal"));

class MediaPreviewHandler {
  constructor() {
    this.addNewChatTasks = document.getElementById("addNewChatTasks");

    this.previewStartDrawing = document.getElementById("previewStartDrawing");
    this.picturePreviewDrawingTools = document.getElementById("picturePreviewDrawingTools");
    this.previewPrimaryBtns = document.querySelectorAll(".picture_preview_left_header button.primary_preview--btn");
    this.picturePreviewDrawingToolsBtns = document.querySelectorAll(".picture_preview_drawing--tools .draw_stroke");
    this.selectPreviewDrawingColor = document.getElementById("selectPreviewDrawingColor");
    this.colorPickerModal = document.getElementById("colorPickerModal");
    this.selectPreviewImage = document.getElementById("selectPreviewImage");

    this.previewTextTool = document.getElementById("previewTextTool");
    this.selectPreviewTextColor = document.getElementById("selectPreviewTextColor");

    this.cropPreviewImage = document.getElementById("cropPreviewImage");
    this.saveCropPreviewImage = document.getElementById("saveCropPreviewImage");
    this.cancelCropPreviewImage = document.getElementById("cancelCropPreviewImage");
    this.downloadPreviewImage = document.getElementById("downloadPreviewImage");
    this.undoPreviewImage = document.getElementById("undoPreviewImage");
    this.redoPreviewImage = document.getElementById("redoPreviewImage");
    this.expandPreviewImage = document.getElementById("expandPreviewImage");
    this.picturePreviewModal = document.getElementById("picturePreviewModal");
    this.cancelPreviewImage = document.getElementById("cancelPreviewImage");
    this.emojiBtn = document.getElementById("emojiPreviewBtn");
    this.customStickerEmojiModal = document.getElementById("customStickerEmojiModal");
    this.customStickerEmojiEmoji = document.getElementById("customStickerEmojiEmoji");
    this.customStickerEmojiSticker = document.getElementById("customStickerEmojiSticker");
    this.customStickerEmojiContainer = this.customStickerEmojiModal.querySelector(".custom_sticker_emoji_container");
    this.customStickerEmojiHeader = document.getElementById("customStickerEmojiHeader");
    this.customStickerEmojiHeaderBtns = this.customStickerEmojiHeader.querySelectorAll("button");
    this.previewNavigationBtnPrev = document.getElementById("previewNavigationBtnPrev");
    this.previewNavigationBtnNext = document.getElementById("previewNavigationBtnNext");
    this.videoContainer = document.getElementById("videoContainer");
    this.imageContainer = document.getElementById("imageContainer");
    this.canvasCideoControls = document.querySelector(".canvas_video_controls");

    this.popperInstance = null;
    this.popperInstanceEmoji = null;

    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    this.CANVAS_CONFIG = {
      // Use viewport-relative sizing
      MAX_WIDTH: Math.min(window.innerWidth * 0.8, 1200), // 80% of viewport or 1200px max
      MAX_HEIGHT: Math.min(window.innerHeight * 0.7, 800), // 70% of viewport or 800px max
      MIN_WIDTH: 400, // Minimum canvas width
      MIN_HEIGHT: 300, // Minimum canvas height
      PADDING: 40, // Padding around canvas
    };

    // Media Resources :)
    // Initialize Fabric.js canvas for images
    this.imageCanvas = new fabric.Canvas("image-canvas", {
      isDrawingMode: false,
      preserveObjectStacking: true,
    });

    // Initialize overlay canvas for videos
    this.videoOverlay = new fabric.Canvas("video-overlay", {
      isDrawingMode: false,
      preserveObjectStacking: true,
      backgroundColor: "transparent",
      selection: false,
    });

    this._fabricToolsSetup();

    // Set up canvas event listeners for undo/redo
    this._setupCanvasEventListeners();

    // File validation constants
    this.FILE_VALIDATION = {
      IMAGE: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
      },
      VIDEO: {
        MAX_SIZE: 30 * 1024 * 1024, // 30MB
        SUPPORTED_TYPES: ["video/mp4", "video/3gpp", "video/avi", "video/mov", "video/wmv"],
      },
    };

    // Media management
    this.mediaFiles = [];
    // let currentMediaIndex = -1;
    this.currentMediaIndex = 0;
    this.mediaStates = {};

    // Tools and state management
    this.currentColor = "#e02525";
    this.currentStroke = 5;
    this.currentTool = "select";
    this.currentCanvas = this.imageCanvas;

    // Undo/Redo functionality
    this.MAX_HISTORY = 50;
    // Video elements
    this.videoPreview = document.getElementById("video-preview");
    this.isVideoPlaying = false;

    this.TENOR_KEY = "AIzaSyDafY_In1u-AtYUT-dNsDFE0W9FSzuUzz0";
    // bind the doc-click handler so `this` stays correct
    // this.onDocumentEmojiClick = this.onDocumentEmojiClick.bind(this);

    // -- set initial disabled state
    this.undoPreviewImage.disabled = true;
    this.redoPreviewImage.disabled = true;

    // Tracks the image we're cropping and the crop rectangle
    this._cropTarget = null;
    this._cropRect = null;

    this.init();
    //
  }

  //
  _setupCanvasEventListeners() {
    // Listen for object modifications on both canvases
    this.imageCanvas.on("object:modified", () => {
      this._saveCurrentState();
    });

    this.videoOverlay.on("object:modified", () => {
      this._saveCurrentState();
    });

    // Listen for drawing events
    this.imageCanvas.on("path:created", () => {
      this._saveCurrentState();
    });

    this.videoOverlay.on("path:created", () => {
      this._saveCurrentState();
    });
  }

  //
  _addTextCentered() {
    const text = new fabric.IText("Double click to edit", {
      left: this.currentCanvas.width / 2,
      top: this.currentCanvas.height / 2,
      fontSize: 20,
      fill: this.currentColor,
      originX: "center",
      originY: "center",
    });

    this.currentCanvas.add(text);
    this.currentCanvas.setActiveObject(text);
    this.currentCanvas.renderAll();
  }

  //
  init() {
    this._handleCustomEmojiTab();

    // Add this to your video loading section
    this.videoPreview.addEventListener("error", (e) => {
      console.error("Video loading error:", e);
      showFlashMessage("Failed to load video. The file may be corrupted or in an unsupported format.");
    });
    //
    this.videoPreview.addEventListener("stalled", () => {
      console.warn("Video loading stalled");
    });

    // Upload files :)
    this.addNewChatTasks.addEventListener("click", (e) => {
      // Image Listener
      const uploadNewImagesToChat = e.target.closest("#uploadNewImagesToChat");
      if (uploadNewImagesToChat) {
        hideAdditionalChatModalContainer();

        const fileInput = this._createInputElement("input", "image/*", true);
        fileInput.click(); // Programmatically click generated input element :)

        // Listen for input change 😊 :)
        fileInput.addEventListener("change", (e) => {
          this._fileListnerChange(e.target.files);
        });
        return;
      }

      // Image Listener
      const uploadNewVideosToChat = e.target.closest("#uploadNewVideosToChat");
      if (uploadNewVideosToChat) {
        hideAdditionalChatModalContainer();

        const fileInput = this._createInputElement("input", "video/*", true);
        fileInput.click(); // Programmatically click generated input element :)

        // Listen for input change 😊 :)
        fileInput.addEventListener("change", (e) => {
          this._fileListnerChange(e.target.files);
        });
      }
    });

    this.selectPreviewImage.addEventListener("click", (e) => {
      this._updateToolsActiveButton();
      this.currentCanvas.isDrawingMode = false;
    });

    // Start Drawing
    this.previewStartDrawing.addEventListener("click", () => {
      this._updateToolsActiveButton();
      this.currentCanvas.isDrawingMode = true;
      this.currentCanvas.freeDrawingBrush.color = this.currentColor;
      this.currentCanvas.freeDrawingBrush.width = this.currentStroke;
    });

    // Drawing Tools
    this.picturePreviewDrawingTools.addEventListener("click", (e) => {
      const drawStroke = e.target.closest(".draw_stroke");

      if (drawStroke) {
        this.currentStroke = Number(drawStroke.dataset.strokeWidth);

        if (this.currentStroke) {
          this.currentCanvas.isDrawingMode = true;
          this.currentCanvas.freeDrawingBrush.color = this.currentColor;
          this.currentCanvas.freeDrawingBrush.width = this.currentStroke;

          this.picturePreviewDrawingToolsBtns.forEach((btn) => btn.classList.remove("active"));
          drawStroke.classList.add("active");
        }

        return;
      }
    });

    // Select Drawing Color
    this.selectPreviewDrawingColor.addEventListener("click", (e) => {
      e.stopPropagation();

      // toggle visibility
      const isHidden = this.colorPickerModal.classList.toggle(HIDDEN, false);

      // if we haven’t created a Popper yet, do it now
      if (!this.popperInstance) {
        this.popperInstance = Popper.createPopper(
          this.selectPreviewDrawingColor, // reference
          this.colorPickerModal, // popper
          {
            placement: "bottom-start",
            modifiers: [
              { name: "offset", options: { offset: [0, 8] } }, // 8px below
              { name: "preventOverflow", options: { boundary: "viewport" } },
            ],
          }
        );
      } else {
        // if already created, just update (in case the button moved)
        this.popperInstance.update();
      }
    });

    // Hide the modal when you pick a color (example)
    this.colorPickerModal.addEventListener("colorchange", (e) => {
      this.currentColor = e.detail.color;
      if (this.currentCanvas.isDrawingMode) {
        this.currentCanvas.freeDrawingBrush.color = this.currentColor;
      }
      this.hideModal();
    });

    // Hide the modal when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.colorPickerModal.contains(e.target) && !this.selectPreviewDrawingColor.contains(e.target)) {
        this.hideModal();
      }
    });

    // Text Tool
    this.previewTextTool.addEventListener("click", (e) => {
      e.stopPropagation();

      this._updateToolsActiveButton();
      this.currentCanvas.isDrawingMode = false;

      if (this.previewTextTool.classList.contains("active")) {
        this.previewTextTool.classList.remove("active");
        return;
      }

      this.previewTextTool.classList.add("active");
      this._addTextCentered();

      // record the change
      this._saveCurrentState();
    });

    // Select Text Color
    this.selectPreviewTextColor.addEventListener("click", (e) => {
      e.stopPropagation();

      // toggle visibility
      const isHidden = this.colorPickerModal.classList.toggle(HIDDEN, false);

      // if we haven’t created a Popper yet, do it now
      if (!this.popperInstance) {
        this.popperInstance = Popper.createPopper(
          this.selectPreviewTextColor, // reference
          this.colorPickerModal, // popper
          {
            placement: "bottom-start",
            modifiers: [
              { name: "offset", options: { offset: [0, 8] } }, // 8px below
              { name: "preventOverflow", options: { boundary: "viewport" } },
            ],
          }
        );
      } else {
        // if already created, just update (in case the button moved)
        this.popperInstance.update();
      }
    });

    // Select Text Color
    this.colorPickerModal.addEventListener("colormove", (e) => {
      const newColor = e.detail.color;

      // Get the active object from the current canvas
      const obj = this.currentCanvas.getActiveObject();
      if (obj && obj.type === "i-text") {
        // Set its fill and re-render
        obj.set("fill", newColor);
        this.currentCanvas.renderAll();
      }
    });

    // Start Crop Image
    this.cropPreviewImage.addEventListener("click", () => this._startCanvasCrop());
    // Save Crop Image
    this.saveCropPreviewImage.addEventListener("click", () => this._saveCanvasCrop());
    // Cancel Crop Image
    this.cancelCropPreviewImage.addEventListener("click", () => this._cancelCanvasCrop());

    // Download Image
    this.downloadPreviewImage.addEventListener("click", () => {
      // 1. Get a base64 Data URL of the canvas
      const dataURL = this.currentCanvas.toDataURL({ format: "png", quality: 0.9 });
      // 2. Create a temporary <a> and “click” it
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `sizemug-${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });

    // Expand Picture Preview Modal
    this.expandPreviewImage.addEventListener("click", () => {
      if (this.picturePreviewModal.classList.contains("expanded")) {
        this.picturePreviewModal.classList.remove("expanded");
      } else {
        this.picturePreviewModal.classList.add("expanded");
      }
    });

    // Cancel Image
    this.cancelPreviewImage.addEventListener("click", () => {
      this._cleanupAndCloseModal();
    });

    // Emoji Image
    this.emojiBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (this.customStickerEmojiModal.classList.contains(HIDDEN)) {
        this.showEmojiModal();
      } else {
        this.hideEmojiModal();
      }
    });

    // Undo Image
    this.undoPreviewImage.addEventListener("click", () => {
      if (this.undoPreviewImage.disabled) return;
      this._undo();
    });

    // Redo Image
    this.redoPreviewImage.addEventListener("click", () => {
      if (this.redoPreviewImage.disabled) return;
      this._redo();
    });

    this.previewNavigationBtnPrev.addEventListener("click", () => {
      this._saveCurrentState();
      const prev = this.currentMediaIndex;
      if (this.currentMediaIndex > 0) {
        this._stopVideoRenderLoop();
        // this._revokeObjectUrlForIndex(prev);
        this._loadMedia(this.currentMediaIndex - 1);
        this._updateNavigationButtons();
      }
    });

    this.previewNavigationBtnNext.addEventListener("click", () => {
      this._saveCurrentState();
      const prev = this.currentMediaIndex;
      if (this.currentMediaIndex < this.mediaFiles.length - 1) {
        this._stopVideoRenderLoop();
        // this._revokeObjectUrlForIndex(prev);
        this._loadMedia(this.currentMediaIndex + 1);
        this._updateNavigationButtons();
      }
    });

    // Add window resize handler
    window.addEventListener("resize", this._handleWindowResize.bind(this));

    // close-button inside the modal
    const closeBtn = this.customStickerEmojiModal.querySelector("#emojiModalCloseBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.hideEmojiModal();
      });
    }
  }

  //
  _createInputElement(element, type, multiple) {
    const fileInput = document.createElement(element);
    fileInput.type = "file";
    fileInput.accept = type;
    fileInput.multiple = multiple;
    return fileInput;
  }

  // helper: nice human-readable sizes
  _formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  }

  /*** @param {File} fls - Raw Set({}) files ***/
  _fileListnerChange(fls) {
    const files = Array.from(fls);
    if (files.length === 0) return;

    // Reset
    this.mediaFiles = [];
    this.currentMediaIndex = 0;
    this.mediaStates = {};

    const accepted = [];

    files.forEach((file) => {
      const isVideo = file.type.startsWith("video");
      const isImage = file.type.startsWith("image");
      const kind = isVideo ? "Video" : "Image";
      const max = isVideo ? this.FILE_VALIDATION.VIDEO.MAX_SIZE : this.FILE_VALIDATION.IMAGE.MAX_SIZE;
      const humanMax = this._formatBytes(max);

      // type check
      if (!isVideo && !isImage) {
        showFlashMessage(`Skipping "${file.name}" — unsupported file type.`);
        return; // skip this file
      }

      // size check
      if (file.size > max) {
        showFlashMessage(`Whoa — that ${kind.toLowerCase()} ("${file.name}") is huge! Max allowed: ${humanMax}.`);
        return; // skip this file
      }

      // if we reach here, accept the file
      accepted.push(file);
    });

    // If none passed validation, do not open the modal or attempt to load
    if (accepted.length === 0) {
      // optional: focus file input or show a consolation message
      showFlashMessage("No valid files to preview. Try smaller images/videos or different file types.");
      return;
    }

    // Use accepted files
    this.mediaFiles = accepted;

    // Load first media automatically
    this._loadMedia(0);

    // Update navigation and show modal
    this._updateNavigationButtons();
    this.picturePreviewModal.classList.remove(HIDDEN);
  }

  // Enhanced media loading with better sizing
  _loadMedia(index) {
    if (index < 0 || index >= this.mediaFiles.length) return;

    // Save current state before switching
    if (this.currentMediaIndex >= 0) {
      this._saveCurrentState();
    }

    this.currentMediaIndex = index;
    const file = this.mediaFiles[index];

    if (file.type.startsWith("image")) {
      this._loadImageWithEnhancedSizing(file, index);
    } else if (file.type.startsWith("video")) {
      this._loadVideoWithEnhancedSizing(file, index);
    }

    this._updateToolAvailability(file.type);
    this._updateToolsActiveButton();
  }

  // Enhanced image loading with better sizing
  _loadImageWithEnhancedSizing(file, index) {
    this.videoContainer.classList.add(HIDDEN);
    this.canvasCideoControls.classList.add(HIDDEN);
    this.imageContainer.classList.remove(HIDDEN);
    this.currentCanvas = this.imageCanvas;

    const reader = new FileReader();
    reader.onload = (event) => {
      fabric.Image.fromURL(event.target.result, (img) => {
        const dimensions = this._calculateOptimalDimensions(img.width, img.height);

        // Set canvas dimensions
        this.imageCanvas.setWidth(dimensions.width);
        this.imageCanvas.setHeight(dimensions.height);

        // Make canvas container responsive
        this._makeCanvasResponsive(this.imageCanvas, dimensions);

        // Set background image with proper scaling
        this.imageCanvas.setBackgroundImage(event.target.result, this.imageCanvas.renderAll.bind(this.imageCanvas), {
          originX: "left",
          originY: "top",
          left: 0,
          top: 0,
          scaleX: dimensions.width / img.width,
          scaleY: dimensions.height / img.height,
          crossOrigin: "anonymous",
        });

        // Store media state
        this.mediaStates[index] = this.mediaStates[index] || {};
        this.mediaStates[index].baseMedia = {
          type: "image",
          src: event.target.result,
          width: dimensions.width,
          height: dimensions.height,
          scaleX: dimensions.width / img.width,
          scaleY: dimensions.height / img.height,
          originalWidth: img.width,
          originalHeight: img.height,
        };

        this._initializeOrRestoreState(index);
        this._updateNavigationInfo();
      });
    };
    reader.readAsDataURL(file);
  }

  // Enhanced video loading with better sizing
  // _loadVideoWithEnhancedSizing(file, index) {
  //   this.imageContainer.classList.add(HIDDEN);
  //   this.canvasCideoControls.classList.remove(HIDDEN);
  //   this.videoContainer.classList.remove(HIDDEN);
  //   this.currentCanvas = this.videoOverlay;

  //   // Clean up previous video URL
  //   if (file._objectUrl) {
  //     try {
  //       URL.revokeObjectURL(file._objectUrl);
  //     } catch (e) {}
  //   }

  //   const videoUrl = URL.createObjectURL(file);
  //   file._objectUrl = videoUrl;
  //   this.videoPreview.src = videoUrl;
  //   this.videoPreview.controls = false;
  //   this.videoPreview.muted = true;
  //   this.videoPreview.preload = "metadata";

  //   // Enhanced video setup
  //   const setupVideoCanvas = () => {
  //     const videoWidth = this.videoPreview.videoWidth || 640;
  //     const videoHeight = this.videoPreview.videoHeight || 480;

  //     const dimensions = this._calculateOptimalDimensions(videoWidth, videoHeight);

  //     // Set video element dimensions
  //     this.videoPreview.width = dimensions.width;
  //     this.videoPreview.height = dimensions.height;
  //     this.videoPreview.style.width = dimensions.width + "px";
  //     this.videoPreview.style.height = dimensions.height + "px";

  //     // Set overlay canvas dimensions
  //     this.videoOverlay.setWidth(dimensions.width);
  //     this.videoOverlay.setHeight(dimensions.height);

  //     // Make canvas responsive
  //     this._makeCanvasResponsive(this.videoOverlay, dimensions);

  //     // Position video behind canvas
  //     this.videoPreview.style.position = "absolute";
  //     this.videoPreview.style.left = "0";
  //     this.videoPreview.style.top = "0";
  //     this.videoPreview.style.zIndex = "-1";

  //     // Store media state
  //     this.mediaStates[index] = this.mediaStates[index] || {};
  //     this.mediaStates[index].baseMedia = {
  //       type: "video",
  //       objectUrl: videoUrl,
  //       width: dimensions.width,
  //       height: dimensions.height,
  //       originalWidth: videoWidth,
  //       originalHeight: videoHeight,
  //     };

  //     this._attachVideoAsFabricBackground();
  //     this._setupVideoControlHandlers();
  //     this.videoPreview.currentTime = 0.1;

  //     this._initializeOrRestoreState(index);
  //     this._updateNavigationInfo();
  //   };

  //   // Set up video event handlers
  //   const onVideoReady = () => {
  //     this.videoPreview.removeEventListener("loadeddata", onVideoReady);
  //     this.videoPreview.removeEventListener("loadedmetadata", onVideoReady);
  //     this.videoPreview.removeEventListener("canplay", onVideoReady);
  //     setupVideoCanvas();
  //   };

  //   this.videoPreview.addEventListener("loadeddata", onVideoReady);
  //   this.videoPreview.addEventListener("loadedmetadata", onVideoReady);
  //   this.videoPreview.addEventListener("canplay", onVideoReady);

  //   // Fallback
  //   setTimeout(() => {
  //     if (this.videoPreview.readyState >= 1) {
  //       onVideoReady();
  //     }
  //   }, 1000);
  // }
  _loadVideoWithEnhancedSizing(file, index) {
    this.imageContainer.classList.add(HIDDEN);
    this.canvasCideoControls.classList.remove(HIDDEN);
    this.videoContainer.classList.remove(HIDDEN);
    this.currentCanvas = this.videoOverlay;

    // Clean up previous video URL
    if (file._objectUrl) {
      try {
        URL.revokeObjectURL(file._objectUrl);
      } catch (e) {}
    }

    const videoUrl = URL.createObjectURL(file);
    file._objectUrl = videoUrl;
    this.videoPreview.src = videoUrl;
    this.videoPreview.controls = false;
    this.videoPreview.muted = true;
    this.videoPreview.preload = "metadata";

    // Enhanced video setup
    const setupVideoCanvas = () => {
      const videoWidth = this.videoPreview.videoWidth || 640;
      const videoHeight = this.videoPreview.videoHeight || 480;

      console.log("Video dimensions:", videoWidth, "x", videoHeight);

      const dimensions = this._calculateOptimalDimensions(videoWidth, videoHeight);

      // Set video element dimensions
      this.videoPreview.width = dimensions.width;
      this.videoPreview.height = dimensions.height;
      this.videoPreview.style.width = dimensions.width + "px";
      this.videoPreview.style.height = dimensions.height + "px";

      // CRITICAL FIX: Make video visible but positioned properly
      this.videoPreview.style.position = "absolute";
      this.videoPreview.style.left = "0";
      this.videoPreview.style.top = "0";
      this.videoPreview.style.zIndex = "1"; // ← Changed from -1 to 1
      this.videoPreview.style.display = "block";
      this.videoPreview.style.visibility = "visible";

      // Set overlay canvas dimensions
      this.videoOverlay.setWidth(dimensions.width);
      this.videoOverlay.setHeight(dimensions.height);

      // Position canvas OVER the video
      const canvasElement = this.videoOverlay.upperCanvasEl;
      canvasElement.style.position = "absolute";
      canvasElement.style.left = "0";
      canvasElement.style.top = "0";
      canvasElement.style.zIndex = "2"; // Canvas on top
      canvasElement.style.pointerEvents = "auto"; // Allow drawing

      // Make canvas responsive
      this._makeCanvasResponsive(this.videoOverlay, dimensions);

      // Store media state
      this.mediaStates[index] = this.mediaStates[index] || {};
      this.mediaStates[index].baseMedia = {
        type: "video",
        objectUrl: videoUrl,
        width: dimensions.width,
        height: dimensions.height,
        originalWidth: videoWidth,
        originalHeight: videoHeight,
      };

      // Set up video controls first
      this._setupVideoControlHandlers();

      // Force video to first frame and wait for it
      this.videoPreview.currentTime = 0.1;

      const onSeeked = () => {
        this.videoPreview.removeEventListener("seeked", onSeeked);
        console.log("Video seeked to first frame");

        // Now attach video to fabric canvas
        this._attachVideoAsFabricBackground();

        // Start render loop
        this._startVideoRenderLoop();

        // Initialize state
        this._initializeOrRestoreState(index);
        this._updateNavigationInfo();

        console.log("Video setup complete");
      };

      this.videoPreview.addEventListener("seeked", onSeeked, { once: true });

      // Fallback if seeked doesn't fire
      setTimeout(() => {
        console.log("Fallback: Forcing video attachment after timeout");
        this._attachVideoAsFabricBackground();
        this._startVideoRenderLoop();
        this._initializeOrRestoreState(index);
        this._updateNavigationInfo();
      }, 1000);
    };

    // Set up video event handlers with better error handling
    const onVideoReady = () => {
      this.videoPreview.removeEventListener("loadeddata", onVideoReady);
      this.videoPreview.removeEventListener("loadedmetadata", onVideoReady);
      this.videoPreview.removeEventListener("canplay", onVideoReady);

      console.log("Video ready event fired, readyState:", this.videoPreview.readyState);
      setupVideoCanvas();
    };

    // Add error handling
    this.videoPreview.addEventListener("error", (e) => {
      console.error("Video loading error:", e);
      console.error("Video error details:", this.videoPreview.error);
    });

    this.videoPreview.addEventListener("loadeddata", onVideoReady);
    this.videoPreview.addEventListener("loadedmetadata", onVideoReady);
    this.videoPreview.addEventListener("canplay", onVideoReady);

    // Multiple fallbacks
    setTimeout(() => {
      if (this.videoPreview.readyState >= 1) {
        console.log("Timeout fallback 1: Video ready");
        onVideoReady();
      }
    }, 1000);

    setTimeout(() => {
      if (this.videoPreview.readyState >= 2) {
        console.log("Timeout fallback 2: Video has enough data");
        onVideoReady();
      }
    }, 2000);
  }

  // Calculate optimal dimensions for media display
  _calculateOptimalDimensions(originalWidth, originalHeight) {
    const aspectRatio = originalWidth / originalHeight;

    let targetWidth = originalWidth;
    let targetHeight = originalHeight;

    // First, try to use original dimensions if they're reasonable
    if (originalWidth <= this.CANVAS_CONFIG.MAX_WIDTH && originalHeight <= this.CANVAS_CONFIG.MAX_HEIGHT && originalWidth >= this.CANVAS_CONFIG.MIN_WIDTH && originalHeight >= this.CANVAS_CONFIG.MIN_HEIGHT) {
      return { width: originalWidth, height: originalHeight };
    }

    // Scale up small images/videos to minimum size
    if (originalWidth < this.CANVAS_CONFIG.MIN_WIDTH || originalHeight < this.CANVAS_CONFIG.MIN_HEIGHT) {
      const scaleForMinWidth = this.CANVAS_CONFIG.MIN_WIDTH / originalWidth;
      const scaleForMinHeight = this.CANVAS_CONFIG.MIN_HEIGHT / originalHeight;
      const minScale = Math.max(scaleForMinWidth, scaleForMinHeight);

      targetWidth = originalWidth * minScale;
      targetHeight = originalHeight * minScale;
    }

    // Scale down large images/videos to fit maximum constraints
    if (targetWidth > this.CANVAS_CONFIG.MAX_WIDTH) {
      targetWidth = this.CANVAS_CONFIG.MAX_WIDTH;
      targetHeight = targetWidth / aspectRatio;
    }

    if (targetHeight > this.CANVAS_CONFIG.MAX_HEIGHT) {
      targetHeight = this.CANVAS_CONFIG.MAX_HEIGHT;
      targetWidth = targetHeight * aspectRatio;
    }

    // Ensure we don't go below minimum after scaling down
    if (targetWidth < this.CANVAS_CONFIG.MIN_WIDTH) {
      targetWidth = this.CANVAS_CONFIG.MIN_WIDTH;
      targetHeight = targetWidth / aspectRatio;
    }

    if (targetHeight < this.CANVAS_CONFIG.MIN_HEIGHT) {
      targetHeight = this.CANVAS_CONFIG.MIN_HEIGHT;
      targetWidth = targetHeight * aspectRatio;
    }

    return {
      width: Math.round(targetWidth),
      height: Math.round(targetHeight),
    };
  }

  // Make canvas responsive and properly sized
  _makeCanvasResponsive(canvas, dimensions) {
    const canvasElement = canvas.upperCanvasEl;
    const canvasContainer = canvasElement.closest(".canvas-container") || canvasElement.parentElement;

    if (canvasContainer) {
      // Set container styles for better presentation
      canvasContainer.style.display = "flex";
      canvasContainer.style.justifyContent = "center";
      canvasContainer.style.alignItems = "center";
      canvasContainer.style.padding = "20px";
      canvasContainer.style.minHeight = dimensions.height + "px";

      // Add some styling to make it look more professional
      canvasElement.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
      canvasElement.style.borderRadius = "8px";
      canvasElement.style.border = "1px solid #e0e0e0";
    }

    // Set explicit dimensions
    canvasElement.style.width = dimensions.width + "px";
    canvasElement.style.height = dimensions.height + "px";

    // Ensure the lower canvas (background) matches
    if (canvas.lowerCanvasEl) {
      canvas.lowerCanvasEl.style.width = dimensions.width + "px";
      canvas.lowerCanvasEl.style.height = dimensions.height + "px";
    }
  }

  // Initialize or restore media state
  _initializeOrRestoreState(index) {
    if (this.mediaStates[index] && this.mediaStates[index].history) {
      try {
        this.currentCanvas.loadFromJSON(JSON.parse(this.mediaStates[index].history[this.mediaStates[index].historyIndex]), () => {
          this.currentCanvas.renderAll();
          this._updateHistoryButtons();
        });
      } catch (e) {
        this.mediaStates[index] = {
          history: [JSON.stringify(this.currentCanvas.toJSON())],
          historyIndex: 0,
        };
        this._updateHistoryButtons();
      }
    } else {
      this.mediaStates[index] = {
        history: [JSON.stringify(this.currentCanvas.toJSON())],
        historyIndex: 0,
      };
      this._updateHistoryButtons();
    }
  }

  // Handle window resize to adjust canvas size
  _handleWindowResize() {
    // Recalculate max dimensions based on new viewport
    this.CANVAS_CONFIG.MAX_WIDTH = Math.min(window.innerWidth * 0.8, 1200);
    this.CANVAS_CONFIG.MAX_HEIGHT = Math.min(window.innerHeight * 0.7, 800);

    // Reload current media with new dimensions if modal is open
    if (!this.picturePreviewModal.classList.contains(HIDDEN) && this.currentMediaIndex >= 0) {
      const file = this.mediaFiles[this.currentMediaIndex];
      const baseMedia = this.mediaStates[this.currentMediaIndex]?.baseMedia;

      if (baseMedia && baseMedia.originalWidth && baseMedia.originalHeight) {
        const newDimensions = this._calculateOptimalDimensions(baseMedia.originalWidth, baseMedia.originalHeight);

        // Only resize if dimensions actually changed significantly
        const currentWidth = this.currentCanvas.width;
        const widthDiff = Math.abs(newDimensions.width - currentWidth);

        if (widthDiff > 50) {
          // Only resize if difference is significant
          this._loadMedia(this.currentMediaIndex);
        }
      }
    }
  }

  // Update tool availability based on media type
  _updateToolAvailability(mediaType) {
    const isVideo = mediaType.startsWith("video");

    // Get all tool buttons
    const selectTool = document.getElementById("selectPreviewImage");
    const drawTool = document.getElementById("previewStartDrawing");
    const textTool = document.getElementById("previewTextTool");
    const cropTool = document.getElementById("cropPreviewImage");
    const cropTools = document.getElementById("picturePreviewCropTools");
    const emojiTool = document.getElementById("emojiPreviewBtn");
    const downloadTool = document.getElementById("downloadPreviewImage");
    const undoTool = document.getElementById("undoPreviewImage");
    const redoTool = document.getElementById("redoPreviewImage");

    if (isVideo) {
      // For videos: Enable drawing, text, emoji, download, undo/redo
      // Disable crop (not suitable for videos)
      if (selectTool) selectTool.classList.remove(HIDDEN);
      if (drawTool) drawTool.classList.remove(HIDDEN);
      if (textTool) textTool.classList.remove(HIDDEN);
      if (cropTool) cropTool.classList.add(HIDDEN);
      if (cropTools) cropTools.classList.add(HIDDEN);
      if (emojiTool) emojiTool.classList.remove(HIDDEN);
      if (downloadTool) downloadTool.classList.remove(HIDDEN);
      if (undoTool) undoTool.classList.remove(HIDDEN);
      if (redoTool) redoTool.classList.remove(HIDDEN);

      // Set drawing as default tool for videos
      this._updateToolsActiveButton("draw");
      this.currentCanvas.isDrawingMode = true;
      this.currentCanvas.freeDrawingBrush.color = this.currentColor;
      this.currentCanvas.freeDrawingBrush.width = this.currentStroke;
    } else {
      // For images: Enable all tools
      if (selectTool) selectTool.classList.remove(HIDDEN);
      if (drawTool) drawTool.classList.remove(HIDDEN);
      if (textTool) textTool.classList.remove(HIDDEN);
      if (cropTool) cropTool.classList.remove(HIDDEN);
      if (cropTools) cropTools.classList.add(HIDDEN); // Hidden by default, shows when crop is active
      if (emojiTool) emojiTool.classList.remove(HIDDEN);
      if (downloadTool) downloadTool.classList.remove(HIDDEN);
      if (undoTool) undoTool.classList.remove(HIDDEN);
      if (redoTool) redoTool.classList.remove(HIDDEN);

      // Set select as default tool for images
      this._updateToolsActiveButton("select");
      this.currentCanvas.isDrawingMode = false;
    }
  }

  //
  _updateToolsActiveButton(tool = "select") {
    this.previewPrimaryBtns.forEach((btn) => btn.classList.remove("active"));
    const activeTool = document.querySelector(`[data-tool-type="${tool}"]`);
    activeTool.classList.add("active");
    this.currentTool = tool;
  }

  // Save current canvas state
  _saveCurrentState() {
    if (this.currentMediaIndex < 0) return;

    if (!this.mediaStates[this.currentMediaIndex]) {
      this.mediaStates[this.currentMediaIndex] = { history: [], historyIndex: -1 };
    }
    const state = this.mediaStates[this.currentMediaIndex];

    // truncate forward history if we're in the middle
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }

    // get canvas JSON object so we can prune it
    const jsonObj = this.currentCanvas.toJSON();

    // remove backgroundImage if present — base image is stored in baseMedia
    if (jsonObj.backgroundImage) {
      delete jsonObj.backgroundImage;
    }

    // remove any objects that are marked as permanent media (video background etc)
    if (Array.isArray(jsonObj.objects)) {
      jsonObj.objects = jsonObj.objects.filter((o) => !o.permanentMedia && !o.isVideoBackground);
    }

    // push pruned JSON
    state.history.push(JSON.stringify(jsonObj));
    state.historyIndex = state.history.length - 1;

    if (state.history.length > this.MAX_HISTORY) {
      state.history.shift();
      state.historyIndex--;
    }
    this._updateHistoryButtons();
  }

  // Load state from history
  _loadState(index) {
    if (this.currentMediaIndex < 0) return;

    const state = this.mediaStates[this.currentMediaIndex];
    if (!state || !state.history || !state.history[index]) return;

    const json = JSON.parse(state.history[index]);

    // load overlay-only JSON
    this.currentCanvas.loadFromJSON(json, () => {
      // Re-apply permanent base media (image or video)
      const base = this.mediaStates[this.currentMediaIndex] && this.mediaStates[this.currentMediaIndex].baseMedia;
      if (base) {
        if (base.type === "image") {
          this.currentCanvas.setBackgroundImage(base.src, this.currentCanvas.renderAll.bind(this.currentCanvas), {
            originX: "left",
            originY: "top",
            left: base.left || 0,
            top: base.top || 0,
            scaleX: base.scaleX || 1,
            scaleY: base.scaleY || 1,
            crossOrigin: "anonymous",
          });
        } else if (base.type === "video") {
          // ensure the <video> has the correct objectUrl
          const file = this.mediaFiles[this.currentMediaIndex];
          const url = (file && file._objectUrl) || base.objectUrl;
          if (url) {
            this.videoPreview.src = url;
            // re-attach the video fabric image as permanent background
            this._attachVideoAsFabricBackground();
          }
        }
      }

      this.currentCanvas.renderAll();
      this._updateHistoryButtons();
    });
  }

  //
  _setupVideoControlHandlers() {
    // Use stable bound handlers so off() can work later
    if (!this._boundTogglePlay) {
      this._boundTogglePlay = this._togglePlayPause.bind(this);
    }

    const playBtn = this.canvasCideoControls.querySelector("#play-pause-btn");

    // remove any previous listeners to avoid duplicates
    playBtn.removeEventListener("click", this._boundTogglePlay);
    playBtn.addEventListener("click", this._boundTogglePlay);

    // Ensure initial state shows play button (video starts paused)
    this._updatePlayPauseButtonState();
  }

  //
  _togglePlayPause() {
    if (!this.videoPreview) return;

    if (this.videoPreview.paused) {
      this.videoPreview
        .play()
        .then(() => {
          this._updatePlayPauseButtonState();
        })
        .catch((e) => {
          console.log("Play failed:", e.message);
          // Keep button state consistent with actual video state
          this._updatePlayPauseButtonState();
        });
    } else {
      this.videoPreview.pause();
      this._updatePlayPauseButtonState();
    }
  }

  //
  _updatePlayPauseButtonState() {
    const playBtn = this.canvasCideoControls.querySelector(".play-btn-icon");
    const pauseBtn = this.canvasCideoControls.querySelector(".pause-btn-icon");

    if (playBtn && pauseBtn) {
      if (this.videoPreview.paused || this.videoPreview.ended) {
        // Show play button
        playBtn.classList.remove(HIDDEN);
        pauseBtn.classList.add(HIDDEN);
      } else {
        // Show pause button
        playBtn.classList.add(HIDDEN);
        pauseBtn.classList.remove(HIDDEN);
      }
    }
  }

  //
  _captureVideoFrame() {
    if (!this.videoPreview) return;
    // Pause to ensure stable frame or allow capture while playing (either works)
    // this.videoPreview.pause();

    // Create offscreen canvas matching display pixel size (account for DPR)
    const dpr = window.devicePixelRatio || 1;
    const w = this.videoPreview.videoWidth;
    const h = this.videoPreview.videoHeight;

    // If intrinsic dims are 0 (not loaded), fallback to element width/height
    const sw = w || this.videoPreview.width;
    const sh = h || this.videoPreview.height;

    const off = document.createElement("canvas");
    off.width = Math.round(sw * dpr);
    off.height = Math.round(sh * dpr);
    const ctx = off.getContext("2d");

    // draw current frame scaled to full size (use the element's drawing)
    ctx.drawImage(this.videoPreview, 0, 0, off.width, off.height);

    // convert to dataURL (beware of CORS: if video uses cross-origin sources without CORS headers, this may throw)
    try {
      const dataUrl = off.toDataURL("image/png");

      // Decide behaviour: add as a fabric.Image overlay item, centered and scaled to display size
      fabric.Image.fromURL(
        dataUrl,
        (img) => {
          const displayW = this.videoPreview.width;
          const displayH = this.videoPreview.height;

          // Scale the loaded image to match overlay display size
          img.set({ originX: "center", originY: "center" });
          img.scaleToWidth(displayW);
          img.scaleY = img.scaleX;
          this.videoOverlay.add(img);
          this.videoOverlay.centerObject(img);
          this.videoOverlay.setActiveObject(img);
          this.videoOverlay.renderAll();

          // record change into history
          this._saveCurrentState();
        },
        { crossOrigin: "anonymous" }
      );
    } catch (err) {
      console.error("Capture failed (possible CORS):", err);
      alert("Unable to capture frame — cross-origin policy prevents reading video pixels.");
    }
  }

  //
  // _attachVideoAsFabricBackground() {
  //   // Remove old fabric video item if any
  //   if (this._videoFabricImage) {
  //     try {
  //       this.videoOverlay.remove(this._videoFabricImage);
  //     } catch (e) {}
  //     this._videoFabricImage = null;
  //   }

  //   // Ensure video has loaded enough data
  //   if (this.videoPreview.readyState < 2) {
  //     // Not ready yet, try again in a bit
  //     setTimeout(() => this._attachVideoAsFabricBackground(), 100);
  //     return;
  //   }

  //   // Create a fabric.Image backed by the HTMLVideoElement
  //   this._videoFabricImage = new fabric.Image(this.videoPreview, {
  //     left: 0,
  //     top: 0,
  //     originX: "left",
  //     originY: "top",
  //     selectable: false,
  //     evented: false,
  //   });

  //   // Mark it as permanent so it is never saved to history
  //   this._videoFabricImage.set({
  //     isVideoBackground: true,
  //     permanentMedia: true,
  //   });

  //   // Scale to fit overlay canvas
  //   const canvasW = this.videoOverlay.getWidth();
  //   const canvasH = this.videoOverlay.getHeight();
  //   const vidW = this.videoPreview.videoWidth || this.videoPreview.width;
  //   const vidH = this.videoPreview.videoHeight || this.videoPreview.height;

  //   if (vidW && vidH) {
  //     const scale = Math.min(canvasW / vidW, canvasH / vidH) || 1;
  //     this._videoFabricImage.scaleX = scale;
  //     this._videoFabricImage.scaleY = scale;

  //     const imgDisplayW = vidW * scale;
  //     const imgDisplayH = vidH * scale;
  //     this._videoFabricImage.left = (canvasW - imgDisplayW) / 2;
  //     this._videoFabricImage.top = (canvasH - imgDisplayH) / 2;
  //   } else {
  //     this._videoFabricImage.scaleToWidth(canvasW);
  //   }

  //   this.videoOverlay.add(this._videoFabricImage);
  //   this.videoOverlay.sendToBack(this._videoFabricImage);

  //   // Force immediate render
  //   this.videoOverlay.renderAll();
  // }

  _attachVideoAsFabricBackground() {
    console.log("Attempting to attach video to fabric canvas");

    // Remove old fabric video item if any
    if (this._videoFabricImage) {
      try {
        this.videoOverlay.remove(this._videoFabricImage);
      } catch (e) {
        console.log("Error removing old video fabric image:", e);
      }
      this._videoFabricImage = null;
    }

    // Check if video is ready
    if (!this.videoPreview || this.videoPreview.readyState < 2) {
      console.log("Video not ready yet, readyState:", this.videoPreview?.readyState);
      // Try again in a bit
      setTimeout(() => this._attachVideoAsFabricBackground(), 200);
      return;
    }

    try {
      // Create a fabric.Image backed by the HTMLVideoElement
      this._videoFabricImage = new fabric.Image(this.videoPreview, {
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        selectable: false,
        evented: false,
      });

      // Mark it as permanent so it is never saved to history
      this._videoFabricImage.set({
        isVideoBackground: true,
        permanentMedia: true,
      });

      // Scale to fit overlay canvas
      const canvasW = this.videoOverlay.getWidth();
      const canvasH = this.videoOverlay.getHeight();
      const vidW = this.videoPreview.videoWidth || this.videoPreview.width || 640;
      const vidH = this.videoPreview.videoHeight || this.videoPreview.height || 480;

      console.log("Canvas dimensions:", canvasW, "x", canvasH);
      console.log("Video dimensions:", vidW, "x", vidH);

      if (vidW && vidH && canvasW && canvasH) {
        // Calculate scale to fit canvas while maintaining aspect ratio
        const scaleX = canvasW / vidW;
        const scaleY = canvasH / vidH;
        const scale = Math.min(scaleX, scaleY);

        this._videoFabricImage.set({
          scaleX: scale,
          scaleY: scale,
          left: (canvasW - vidW * scale) / 2,
          top: (canvasH - vidH * scale) / 2,
        });
      }

      // Add to canvas and send to back
      this.videoOverlay.add(this._videoFabricImage);
      this.videoOverlay.sendToBack(this._videoFabricImage);

      // Force immediate render
      this.videoOverlay.renderAll();

      console.log("Video fabric image attached successfully");
    } catch (error) {
      console.error("Error attaching video to fabric canvas:", error);
    }
  }

  //
  // _startVideoRenderLoop() {
  //   // stop any existing loop first
  //   this._stopVideoRenderLoop();

  //   this._videoRafActive = true;
  //   const loop = () => {
  //     if (!this._videoRafActive) return;

  //     // Update the fabric video image with current frame
  //     if (this._videoFabricImage && this.videoPreview.readyState >= 2) {
  //       this._videoFabricImage.setElement(this.videoPreview);
  //     }

  //     // Only re-render if canvas exists
  //     try {
  //       this.videoOverlay.renderAll();
  //     } catch (e) {}

  //     // continue loop while playing, or keep looping at slow interval while paused if you want
  //     if (!this.videoPreview.paused && !this.videoPreview.ended) {
  //       this._videoRafId = requestAnimationFrame(loop);
  //     } else {
  //       // render once and stop RAF (no continuous redraw while paused)
  //       this._videoRafActive = false;
  //     }
  //   };

  //   // Kick off loop only if video is playing
  //   if (!this.videoPreview.paused && !this.videoPreview.ended) {
  //     this._videoRafId = requestAnimationFrame(loop);
  //   } else {
  //     // if it's paused, render once (so frame appears)
  //     this.videoOverlay.renderAll();
  //   }

  //   // also listen for play/pause events to start/stop loop
  //   if (!this._boundVideoPlay) {
  //     this._boundVideoPlay = () => {
  //       if (this.videoPreview.paused) {
  //         // paused -> render once
  //         this.videoOverlay.renderAll();
  //       } else {
  //         // playing -> start RAF
  //         this._startVideoRenderLoop();
  //       }
  //     };
  //   }

  //   // attach events
  //   this.videoPreview.removeEventListener("play", this._boundVideoPlay);
  //   this.videoPreview.removeEventListener("pause", this._boundVideoPlay);
  //   this.videoPreview.addEventListener("play", this._boundVideoPlay);
  //   this.videoPreview.addEventListener("pause", this._boundVideoPlay);
  // }
  // Enhanced render loop with better frame updates
  _startVideoRenderLoop() {
    console.log("Starting video render loop");

    // Stop any existing loop first
    this._stopVideoRenderLoop();

    this._videoRafActive = true;

    const loop = () => {
      if (!this._videoRafActive) return;

      // Update the fabric video image with current frame
      if (this._videoFabricImage && this.videoPreview && this.videoPreview.readyState >= 2) {
        try {
          // Force the fabric image to update its element reference
          this._videoFabricImage.setElement(this.videoPreview);
          this.videoOverlay.renderAll();
        } catch (e) {
          console.log("Render loop error:", e);
        }
      }

      // Continue loop while playing
      if (!this.videoPreview.paused && !this.videoPreview.ended && this._videoRafActive) {
        this._videoRafId = requestAnimationFrame(loop);
      } else {
        // Render once more when paused
        if (this._videoFabricImage) {
          this.videoOverlay.renderAll();
        }
        this._videoRafActive = false;
      }
    };

    // Start loop if video is playing, or render once if paused
    if (!this.videoPreview.paused && !this.videoPreview.ended) {
      this._videoRafId = requestAnimationFrame(loop);
    } else {
      // Render once for thumbnail
      if (this._videoFabricImage) {
        this.videoOverlay.renderAll();
      }
    }

    // Set up play/pause event handlers
    if (!this._boundVideoPlay) {
      this._boundVideoPlay = () => {
        console.log("Video play/pause event:", this.videoPreview.paused ? "paused" : "playing");
        if (this.videoPreview.paused) {
          this._videoRafActive = false;
          // Render once when paused
          if (this._videoFabricImage) {
            this.videoOverlay.renderAll();
          }
        } else {
          // Start render loop when playing
          this._startVideoRenderLoop();
        }
        this._updatePlayPauseButtonState();
      };
    }

    // Remove old listeners and add new ones
    this.videoPreview.removeEventListener("play", this._boundVideoPlay);
    this.videoPreview.removeEventListener("pause", this._boundVideoPlay);
    this.videoPreview.addEventListener("play", this._boundVideoPlay);
    this.videoPreview.addEventListener("pause", this._boundVideoPlay);
  }

  //
  _stopVideoRenderLoop() {
    this._videoRafActive = false;
    if (this._videoRafId) {
      cancelAnimationFrame(this._videoRafId);
      this._videoRafId = null;
    }
    // remove play/pause listeners
    if (this._boundVideoPlay) {
      this.videoPreview.removeEventListener("play", this._boundVideoPlay);
      this.videoPreview.removeEventListener("pause", this._boundVideoPlay);
    }
    // remove fabric image if needed? keep it so overlay persists
  }

  // Update thumbnail selection
  _updateThumbnailSelection() {
    document.querySelectorAll(".media-thumbnail").forEach((thumb, index) => {
      if (index === this.currentMediaIndex) {
        thumb.classList.add("active");
      } else {
        thumb.classList.remove("active");
      }
    });
  }

  // Enhanced navigation info to show dimensions
  _updateNavigationInfo() {
    const infoElement = document.querySelector(".media-info") || this._createInfoElement();

    if (this.currentMediaIndex >= 0) {
      const file = this.mediaFiles[this.currentMediaIndex];
      const baseMedia = this.mediaStates[this.currentMediaIndex]?.baseMedia;
      const fileName = file.name.length > 30 ? file.name.substring(0, 27) + "..." : file.name;

      let dimensionText = "";
      if (baseMedia && baseMedia.originalWidth) {
        dimensionText = ` (${baseMedia.originalWidth}×${baseMedia.originalHeight})`;
      }

      infoElement.textContent = `${this.currentMediaIndex + 1}/${this.mediaFiles.length}: ${fileName}${dimensionText}`;
    }
  }

  // Create info element if it doesn't exist
  _createInfoElement() {
    const infoElement = document.createElement("div");
    infoElement.className = "media-info";
    infoElement.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
    `;

    // Add to modal or appropriate container
    const container = document.getElementById("pictureSpacerPreview") || document.body;
    container.appendChild(infoElement);

    return infoElement;
  }

  // only revoke when force === true (explicit removal)
  _revokeObjectUrlForIndex(index, force = false) {
    const file = this.mediaFiles[index];
    if (!file) return;
    if (!force) return; // do nothing unless explicitly asked

    if (file._objectUrl) {
      try {
        URL.revokeObjectURL(file._objectUrl);
      } catch (e) {}
      delete file._objectUrl;
    }

    if (index === this.currentMediaIndex) {
      this._stopVideoRenderLoop();
    }
  }

  // Update navigation buttons
  _updateNavigationButtons() {
    console.log("[nav] currentIndex:", this.currentMediaIndex, "total:", this.mediaFiles.length);

    // Prev button
    if (this.currentMediaIndex <= 0) {
      this.previewNavigationBtnPrev.disabled = true;
      this.previewNavigationBtnPrev.classList.add(HIDDEN);
    } else {
      this.previewNavigationBtnPrev.disabled = false;
      this.previewNavigationBtnPrev.classList.remove(HIDDEN);
    }

    // Next button
    if (this.currentMediaIndex >= this.mediaFiles.length - 1) {
      this.previewNavigationBtnNext.disabled = true;
      this.previewNavigationBtnNext.classList.add(HIDDEN);
    } else {
      this.previewNavigationBtnNext.disabled = false;
      this.previewNavigationBtnNext.classList.remove(HIDDEN);
    }
  }

  // Start interactive canvas-wide cropping (click-drag to draw, then resize/move)
  _startCanvasCrop() {
    // ensure drawing is off
    this.currentCanvas.isDrawingMode = false;
    this._updateToolsActiveButton("crop");

    // Show crop tools
    const cropTools = document.getElementById("picturePreviewCropTools");
    if (cropTools) {
      cropTools.classList.remove(HIDDEN);
    }

    // Remove any previous crop rect
    if (this._cropRect) {
      try {
        this.currentCanvas.remove(this._cropRect);
      } catch (e) {}
      this._cropRect = null;
      this._cropTarget = null;
    }

    // mark cropping state
    this._isCropping = true;
    this._cropDrawing = false;

    // Save selection state and disable group selection while drawing
    this._prevCanvasSelection = this.currentCanvas.selection;
    this.currentCanvas.selection = false;

    const canvas = this.currentCanvas;

    // --- Handlers are stored on `this` so we can remove them later ---
    this._cropMouseDown = (opt) => {
      // If the click hit the existing crop rect, let Fabric handle selection/dragging —
      // do NOT start a new rect in that case.
      if (this._cropRect && opt.target === this._cropRect) {
        return;
      }

      // start drawing a new rect
      const pointer = canvas.getPointer(opt.e);
      this._cropStartPoint = { x: pointer.x, y: pointer.y };

      // If a previous cropRect exists remove it (this is a true new-draw intent)
      if (this._cropRect) {
        try {
          canvas.remove(this._cropRect);
        } catch (e) {}
        this._cropRect = null;
      }

      // create an initial zero-size rect (will be resized on mousemove)
      this._cropRect = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: "rgba(0,0,0,0.20)",
        stroke: "#8837E9",
        strokeWidth: 2,
        selectable: false, // not selectable while drawing
        evented: false,
        originX: "left",
        originY: "top",
        hasRotatingPoint: false,
        transparentCorners: false,
      });

      canvas.add(this._cropRect);
      this._cropDrawing = true;
    };

    this._cropMouseMove = (opt) => {
      if (!this._cropDrawing || !this._cropRect) return;
      const pointer = canvas.getPointer(opt.e);

      const x = Math.min(pointer.x, this._cropStartPoint.x);
      const y = Math.min(pointer.y, this._cropStartPoint.y);
      const w = Math.abs(pointer.x - this._cropStartPoint.x);
      const h = Math.abs(pointer.y - this._cropStartPoint.y);

      // update geometry and render
      this._cropRect.set({ left: x, top: y, width: Math.max(1, w), height: Math.max(1, h) });
      canvas.renderAll();
    };

    this._cropMouseUp = (opt) => {
      if (!this._cropDrawing) return;
      this._cropDrawing = false;

      // finalize: allow the rect to be selectable and evented so user can move/resize it
      this._cropRect.set({
        selectable: true,
        evented: true,
        hasRotatingPoint: false,
        lockRotation: true,
      });

      // enable controls (so users can resize corners)
      this._cropRect.setControlsVisibility({
        mt: true,
        mb: true,
        ml: true,
        mr: true,
        tl: true,
        tr: true,
        bl: true,
        br: true,
        mtr: false,
      });

      // ensure coords are correct for interaction
      this._cropRect.setCoords();

      // Restore canvas.selection to previous value so object interactions behave normally
      this.currentCanvas.selection = !!this._prevCanvasSelection;

      // Make it the active object
      canvas.setActiveObject(this._cropRect);
      canvas.renderAll();

      // Remove the drawing-phase listeners (we leave the rect so it can be manipulated)
      canvas.off("mouse:down", this._cropMouseDown);
      canvas.off("mouse:move", this._cropMouseMove);
      canvas.off("mouse:up", this._cropMouseUp);

      // store refs so save/cancel handlers can access them
      this._cropRect.originX = "left";
      this._cropRect.originY = "top";
      this._isCropping = false;

      // crop mode finished — remove Escape listener (we could keep it if desired)
      if (this._onKeyDownDuringCrop) {
        document.removeEventListener("keydown", this._onKeyDownDuringCrop);
        this._onKeyDownDuringCrop = null;
      }
    };

    // Attach the drawing-phase listeners
    canvas.on("mouse:down", this._cropMouseDown);
    canvas.on("mouse:move", this._cropMouseMove);
    canvas.on("mouse:up", this._cropMouseUp);

    // allow Esc to cancel the crop quickly
    this._onKeyDownDuringCrop = (e) => {
      if (e.key === "Escape" || e.key === "Esc") {
        this._cancelCanvasCrop();
      }
    };
    document.addEventListener("keydown", this._onKeyDownDuringCrop);
  }

  /*** Save a crop that trims EVERYTHING on the current canvas to the active crop rectangle. Produces a single raster representing the cropped region and replaces the canvas content with it. */
  _saveCanvasCrop() {
    if (!this._cropRect) {
      alert("No crop selection active.");
      return;
    }

    // Save current canvas logical size so we fit the cropped image to it
    const prevW = this.currentCanvas.getWidth();
    const prevH = this.currentCanvas.getHeight();

    // Compute device pixel ratio / retina multiplier used by fabric.toDataURL
    const ratio = typeof this.currentCanvas.getRetinaScaling === "function" ? this.currentCanvas.getRetinaScaling() : window.devicePixelRatio || 1;

    // Safety: discard any active controls (so controls / selection outlines are not captured)
    this.currentCanvas.discardActiveObject();
    this.currentCanvas.renderAll();

    // Temporarily hide the crop rect so it's not included in the exported image
    this._cropRect.visible = false;
    this.currentCanvas.renderAll();

    // Export full canvas to dataURL at retina multiplier
    const fullDataUrl = this.currentCanvas.toDataURL({ format: "png", multiplier: ratio });

    // Restore cropRect visibility for UX (we'll remove it after applying the crop)
    this._cropRect.visible = true;
    this.currentCanvas.renderAll();

    // Load exported image and crop with an offscreen canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Compute source rectangle inside the exported image (multiply by ratio)
      const sx = Math.max(0, Math.round(this._cropRect.left * ratio));
      const sy = Math.max(0, Math.round(this._cropRect.top * ratio));
      const sw = Math.max(1, Math.round(this._cropRect.width * ratio));
      const sh = Math.max(1, Math.round(this._cropRect.height * ratio));

      // Clamp to exported image bounds (extra safety)
      const srcW = Math.min(sw, img.width - sx);
      const srcH = Math.min(sh, img.height - sy);

      // Offscreen canvas to extract the cropped pixels
      const off = document.createElement("canvas");
      off.width = srcW;
      off.height = srcH;
      const ctx = off.getContext("2d");

      ctx.drawImage(img, sx, sy, srcW, srcH, 0, 0, srcW, srcH);
      const croppedDataUrl = off.toDataURL("image/png");

      // Convert cropped raster back into a fabric.Image so we can measure intrinsic size,
      // then set it as the canvas background (fit + preserve aspect ratio).
      fabric.Image.fromURL(
        croppedDataUrl,
        (croppedImg) => {
          try {
            // Remove crop rect if present
            if (this._cropRect) {
              try {
                this.currentCanvas.remove(this._cropRect);
              } catch (e) {}
            }
            this._cropRect = null;
            this._cropTarget = null;

            // IMPORTANT: keep the canvas logical size (prevW x prevH).
            // We will set the cropped raster as background and scale it to *fit* the canvas,
            // preserving aspect ratio (contain).
            this.currentCanvas.clear(); // clears objects (backgroundImage will be set next)
            this.currentCanvas.setWidth(prevW);
            this.currentCanvas.setHeight(prevH);

            // Compute scale to *contain* the image in the canvas while preserving aspect ratio
            const imgW = croppedImg.width || srcW; // intrinsic pixel width
            const imgH = croppedImg.height || srcH;
            const scale = Math.min(prevW / imgW, prevH / imgH) || 1;
            const scaleX = scale;
            const scaleY = scale;

            // Center the background image
            const left = (prevW - imgW * scale) / 2;
            const top = (prevH - imgH * scale) / 2;

            // Set background image (non-selectable — background images are not part of canvas objects)
            // Using the croppedDataUrl directly avoids potential cross-origin issues with the Fabric image object.
            this.currentCanvas.setBackgroundImage(croppedDataUrl, this.currentCanvas.renderAll.bind(this.currentCanvas), {
              originX: "left",
              originY: "top",
              left: left,
              top: top,
              scaleX: scaleX,
              scaleY: scaleY,
              crossOrigin: "anonymous",
            });

            if (this.mediaStates[this.currentMediaIndex]) {
              this.mediaStates[this.currentMediaIndex].baseMedia = {
                type: "image",
                src: croppedDataUrl,
                width: off.width,
                height: off.height,
                scaleX: 1,
                scaleY: 1,
              };
            }
            this._saveCurrentState();

            // No active object — background is non-selectable by default
            this.currentCanvas.discardActiveObject();
            this.currentCanvas.renderAll();

            // Record new state in history
            this._saveCurrentState();
            this._updateToolsActiveButton();

            // Hide crop tools after successful crop
            const cropTools = document.getElementById("picturePreviewCropTools");
            if (cropTools) {
              cropTools.classList.add(HIDDEN);
            }
          } catch (err) {
            console.error("Error applying cropped background:", err);
            alert("An error occurred while setting the cropped background.");
          }
        },
        { crossOrigin: "anonymous" }
      );
    };

    img.onerror = (err) => {
      console.error("Failed to load exported canvas image for cropping", err);
      alert("Crop failed — could not process the canvas image (CORS or export error).");
      // Restore visibility in case of error
      if (this._cropRect) {
        this._cropRect.visible = true;
        this.currentCanvas.renderAll();
      }
    };

    img.src = fullDataUrl;
  }

  _cancelCanvasCrop() {
    // remove crop rect if present
    if (this._cropRect) {
      try {
        this.currentCanvas.remove(this._cropRect);
      } catch (e) {}
      this._cropRect = null;
      this._cropTarget = null;
    }

    // remove any drawing listeners (in case they still exist)
    try {
      if (this._cropMouseDown) this.currentCanvas.off("mouse:down", this._cropMouseDown);
      if (this._cropMouseMove) this.currentCanvas.off("mouse:move", this._cropMouseMove);
      if (this._cropMouseUp) this.currentCanvas.off("mouse:up", this._cropMouseUp);
    } catch (e) {}

    // restore selection
    if (typeof this._prevCanvasSelection !== "undefined") {
      this.currentCanvas.selection = this._prevCanvasSelection;
    } else {
      this.currentCanvas.selection = true;
    }

    // cleanup key handler
    if (this._onKeyDownDuringCrop) {
      document.removeEventListener("keydown", this._onKeyDownDuringCrop);
      this._onKeyDownDuringCrop = null;
    }

    this._isCropping = false;
    this._cropDrawing = false;
    this._cropStartPoint = null;

    // Hide crop tools
    const cropTools = document.getElementById("picturePreviewCropTools");
    if (cropTools) {
      cropTools.classList.add(HIDDEN);
    }

    // make sure UI button state is reverted
    this._updateToolsActiveButton();
    this.currentCanvas.renderAll();
  }

  // Update undo/redo buttons
  _updateHistoryButtons() {
    if (this.currentMediaIndex < 0 || !this.mediaStates[this.currentMediaIndex]) {
      this.undoPreviewImage.disabled = true;
      this.redoPreviewImage.disabled = true;
      return;
    }

    const state = this.mediaStates[this.currentMediaIndex];
    this.undoPreviewImage.disabled = state.historyIndex <= 0;
    this.redoPreviewImage.disabled = state.historyIndex >= state.history.length - 1;
  }

  //
  hideModal() {
    if (!this.popperInstance) return;

    this.colorPickerModal.classList.add(HIDDEN);
    this.popperInstance.destroy();
    this.popperInstance = null;
  }

  //
  _handleCustomEmojiTab() {
    this.customStickerEmojiHeader.addEventListener("click", (e) => {
      const button = e.target.closest("button");

      if (button) {
        this.customStickerEmojiHeaderBtns.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        if (button.dataset.tab === "sticker") {
          this._handleStickerFetchAndInsert();
        } else {
          this._handleEmojiFetchAndInsert();
        }
      }
    });
  }

  // Undo action
  _undo() {
    if (this.currentMediaIndex < 0) return;

    const state = this.mediaStates[this.currentMediaIndex];
    if (state.historyIndex > 0) {
      state.historyIndex--;
      this._loadState(state.historyIndex);
      this._updateHistoryButtons();
    }
  }

  // Redo action
  _redo() {
    if (this.currentMediaIndex < 0) return;

    const state = this.mediaStates[this.currentMediaIndex];
    if (state.historyIndex < state.history.length - 1) {
      state.historyIndex++;
      this._loadState(state.historyIndex);
      this._updateHistoryButtons();
    }
  }

  //
  _fabricToolsSetup() {
    // Disable the rotation control by overriding it with an invisible control.
    fabric.Object.prototype.controls.mtr = new fabric.Control({
      visible: false, // Hide the control
      render: function () {}, // No render needed
    });

    // Custom render function for controls (draws a rounded, colored circle)
    function renderCustomControl(ctx, left, top, styleOverride, fabricObject) {
      const size = fabricObject.cornerSize || 10; // Default size
      const halfSize = size / 2;
      ctx.beginPath();
      ctx.arc(left, top, halfSize, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#8837E9"; // Custom border color
      ctx.fillStyle = "white"; // Custom fill color
      ctx.stroke();
      ctx.fill();
    }

    // Set default appearance for objects' borders and controls
    fabric.Object.prototype.borderColor = "#8837E9"; // Border color
    fabric.Object.prototype.borderOpacityWhenMoving = 0.9;
    fabric.Object.prototype.cornerColor = "#8837E9"; // Control corner color

    // Overriding the default controls with custom ones:
    fabric.Object.prototype.controls.br = new fabric.Control({
      x: 0.5,
      y: 0.5,
      cursorStyle: "se-resize",
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.bl = new fabric.Control({
      x: -0.5,
      y: 0.5,
      cursorStyle: "sw-resize",
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      cursorStyle: "ne-resize",
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.tl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      cursorStyle: "nw-resize",
      actionHandler: fabric.controlsUtils.scalingEqually,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    // Edge controls
    fabric.Object.prototype.controls.ml = new fabric.Control({
      x: -0.5,
      y: 0,
      cursorStyle: "w-resize",
      actionHandler: fabric.controlsUtils.scalingX,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.mt = new fabric.Control({
      x: 0,
      y: -0.5,
      cursorStyle: "n-resize",
      actionHandler: fabric.controlsUtils.scalingY,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.mr = new fabric.Control({
      x: 0.5,
      y: 0,
      cursorStyle: "e-resize",
      actionHandler: fabric.controlsUtils.scalingX,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });

    fabric.Object.prototype.controls.mb = new fabric.Control({
      x: 0,
      y: 0.5,
      cursorStyle: "s-resize",
      actionHandler: fabric.controlsUtils.scalingY,
      render: renderCustomControl,
      cornerSize: 10,
      padding: 2,
    });
  }

  // Fetch and insert emojis
  async _handleEmojiFetchAndInsert() {
    const container = this.customStickerEmojiEmoji;
    this.customStickerEmojiSticker.classList.add(HIDDEN);
    container.classList.remove(HIDDEN);
    this.customStickerEmojiHeaderBtns.forEach((btn) => btn.classList.remove("active"));
    this.customStickerEmojiHeaderBtns[0].classList.add("active");
    if (container.childNodes.length) return;

    container.innerHTML = "";
    // ✅ Correct URL for the OpenMoji data file:
    const res = await fetch("https://cdn.jsdelivr.net/npm/openmoji@14.0.0/data/openmoji.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const allEmojis = await res.json();

    // pick a subset, e.g. the first 100
    const subset = allEmojis.slice(0, 800);

    subset.forEach((e) => {
      // build the Twemoji URL from the codepoint
      const code = e.hexcode.toLowerCase();
      const url = `https://twemoji.maxcdn.com/v/latest/72x72/${code}.png`;

      const img = document.createElement("img");
      img.src = url;
      img.title = e.annotation; // hover-tooltip name
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.cursor = "pointer";

      img.addEventListener("click", () => {
        fabric.Image.fromURL(
          url,
          (emojiImg) => {
            // Force an actual object size, independent of canvas scaling
            emojiImg.set({
              originX: "center",
              originY: "center",
              scaleX: 1,
              scaleY: 1,
            });

            // Resize the image itself to desired pixel dimensions
            const desiredSize = 20; // px
            emojiImg.scaleToWidth(desiredSize, false); // false = don't adjust height automatically
            emojiImg.scaleToHeight(desiredSize);

            this.currentCanvas.add(emojiImg);
            this.currentCanvas.centerObject(emojiImg);
            this.currentCanvas.setActiveObject(emojiImg);
            this.currentCanvas.renderAll();

            // record the change
            this._saveCurrentState();
            this.hideEmojiModal();
          },
          { crossOrigin: "anonymous" }
        );
      });

      container.appendChild(img);
    });
  }

  //
  async _handleStickerFetchAndInsert(query = "trending") {
    const container = this.customStickerEmojiSticker;
    this.customStickerEmojiEmoji.classList.add(HIDDEN);
    container.classList.remove(HIDDEN);
    this.customStickerEmojiHeaderBtns.forEach((btn) => btn.classList.remove("active"));
    this.customStickerEmojiHeaderBtns[1].classList.add("active");
    if (container.childNodes.length) return;

    container.innerHTML = "";
    const res = await fetch(`https://tenor.googleapis.com/v2/search` + `?key=${this.TENOR_KEY}` + `&q=${encodeURIComponent(query)}` + `&limit=108`);
    if (!res.ok) throw new Error(`Tenor API HTTP ${res.status}`);
    const { results } = await res.json();

    results.forEach((item) => {
      const gifFmt = item.media_formats?.gif;
      if (!gifFmt) return; // skip if no gif format

      // pick a stable thumbnail (fall back to the gif itself if necessary)
      const thumbUrl = gifFmt.max_200w?.url || gifFmt.preview_gif?.url || gifFmt.url || null;
      if (!thumbUrl) return; // skip if we really have nothing

      const img = document.createElement("img");
      img.src = thumbUrl;
      img.title = item.content_description || "sticker";
      Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        cursor: "pointer",
      });

      img.addEventListener("click", () => {
        // now pick the best “full” URL:
        const fullUrl = gifFmt.url || gifFmt.max_480w?.url || gifFmt.max_200w?.url;
        if (!fullUrl) return console.warn("No full‐size URL for this sticker");

        fabric.Image.fromURL(
          fullUrl,
          (stickerImg) => {
            stickerImg.scaleToWidth(150);
            stickerImg.set({
              originX: "center",
              originY: "center",
            });

            this.currentCanvas.add(stickerImg);
            this.currentCanvas.centerObject(stickerImg);
            this.currentCanvas.setActiveObject(stickerImg);
            this.currentCanvas.renderAll();

            // record the change
            this._saveCurrentState();
            this.hideEmojiModal();
          },
          { crossOrigin: "anonymous" }
        );
      });

      container.appendChild(img);
    });
  }

  showEmojiModal() {
    this._handleEmojiFetchAndInsert();

    this.customStickerEmojiModal.classList.remove(HIDDEN);
    this.emojiBtn.classList.add("active");
    //
    if (this.picturePreviewModal.classList.contains("expanded")) {
      this.customStickerEmojiContainer.classList.add("massive-height");
    }

    this.popperInstanceEmoji = Popper.createPopper(
      this.emojiBtn, // correct reference
      this.customStickerEmojiModal,
      {
        placement: "bottom-start",
        modifiers: [
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
          // disable flip so it never goes above
          { name: "flip", enabled: false },
        ],
      }
    );

    // now correctly bound
    // document.addEventListener("click", this.onDocumentEmojiClick);
  }

  hideEmojiModal() {
    this.customStickerEmojiModal.classList.add(HIDDEN);
    this._updateToolsActiveButton();

    //
    this.customStickerEmojiContainer.classList.remove("massive-height");

    if (this.popperInstanceEmoji) {
      this.popperInstanceEmoji.destroy();
      this.popperInstanceEmoji = null;
    }
    // document.removeEventListener("click", this.onDocumentEmojiClick);
  }

  // Comprehensive cleanup when closing the modal
  _cleanupAndCloseModal() {
    // 1. Stop any active video render loops
    this._stopVideoRenderLoop();

    // 2. Hide any open emoji/sticker modal
    this.hideEmojiModal();

    // 3. Hide color picker modal if open
    this.hideModal();

    // 4. Cancel any active crop operation
    if (this._isCropping) {
      this._cancelCanvasCrop();
    }

    // 5. Clear canvas objects (optional - you might want to keep them)
    // this.currentCanvas.clear();

    // 6. Reset tool states
    this._updateToolsActiveButton("select");
    this.currentCanvas.isDrawingMode = false;

    // 7. Clean up any active crop tools
    const cropTools = document.getElementById("picturePreviewCropTools");
    if (cropTools) {
      cropTools.classList.add(HIDDEN);
    }

    // 8. Remove expanded state and hide modal
    this.picturePreviewModal.classList.remove("expanded");
    this.picturePreviewModal.classList.add(HIDDEN);

    // 9. Restore additional buttons
    showEmojiTasksAdditionalButtons();

    // 10. Clear media files and reset state (uncomment if you want to reset everything)
    this.mediaFiles = [];
    this.currentMediaIndex = 0;
    this.mediaStates = {};
  }
}

new MediaPreviewHandler();
