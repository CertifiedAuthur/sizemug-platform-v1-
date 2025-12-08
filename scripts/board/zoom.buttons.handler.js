/**
 * Handles zoom button interactions and synchronizes with ZoomPanController
 */
class ZoomButtonsHandler {
  constructor(zoomController) {
    this.zoomController = zoomController;
    this.zoomLabel = document.querySelector(".zoom_percentage--label");
    this.zoomTrack = document.querySelector(".zoom_track");
    this.zoomButton = document.querySelector(".zoom_in_out--btn");

    // Constants for zoom
    this.ZOOM_STEP = 0.2;
    this.MIN_ZOOM = 0.2;
    this.MAX_ZOOM = 6;
    this.DEFAULT_ZOOM = 1;

    // For drag functionality
    this.isDragging = false;
    this.startY = 0;
    this.startScale = 1;
    this._init();
  }

  _init() {
    if (!this.zoomController || !this.zoomButton || !this.zoomTrack) return;

    // Initialize zoom display
    this._updateZoomDisplay(this.zoomController.getTransform().k);

    // Set initial button position
    this._updateButtonPosition(this.zoomController.getTransform().k);

    // Initialize drag handlers
    this._initDragHandlers();

    // Double click to reset zoom
    this.zoomButton.addEventListener("dblclick", () => {
      const currentTransform = this.zoomController.getTransform();
      const transform = d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(this.DEFAULT_ZOOM);
      this.zoomController.setTransform(transform);
    });

    // Subscribe to zoom events to update display
    const originalOnTransform = this.zoomController.onTransform;
    this.zoomController.onTransform = (transform) => {
      if (originalOnTransform) {
        originalOnTransform(transform);
      }
      this._updateZoomDisplay(transform.k);
      this._updateButtonPosition(transform.k);
    };
  }

  _updateZoomDisplay(scale) {
    if (this.zoomLabel) {
      const percentage = Math.round(scale * 100);
      this.zoomLabel.textContent = `${percentage}%`;
    }
  }

  _updateButtonPosition(scale) {
    if (!this.zoomButton || !this.zoomTrack) return;

    const trackHeight = this.zoomTrack.offsetHeight;
    const buttonHeight = this.zoomButton.offsetHeight;

    // Calculate position percentage based on current scale
    const percentage = (scale - this.MIN_ZOOM) / (this.MAX_ZOOM - this.MIN_ZOOM);
    const position = (trackHeight - buttonHeight) * (1 - percentage);

    this.zoomButton.style.top = `${position}px`;
  }

  _initDragHandlers() {
    if (!this.zoomButton || !this.zoomTrack) return;

    const dragStart = (e) => {
      this.isDragging = true;
      this.startY = e.clientY;
      const currentTransform = this.zoomController.getTransform();
      this.startScale = currentTransform.k;
      this.zoomButton.style.transition = "none";
    };

    const dragEnd = () => {
      this.isDragging = false;
      this.zoomButton.style.transition = "";
    };

    const drag = (e) => {
      if (!this.isDragging) return;

      e.preventDefault();

      const deltaY = this.startY - e.clientY;
      const trackHeight = this.zoomTrack.offsetHeight - this.zoomButton.offsetHeight;
      const percentage = deltaY / trackHeight;

      // Calculate new scale based on drag position
      const scaleRange = this.MAX_ZOOM - this.MIN_ZOOM;
      const newScale = Math.max(this.MIN_ZOOM, Math.min(this.MAX_ZOOM, this.startScale + percentage * scaleRange));

      const currentTransform = this.zoomController.getTransform();
      const transform = d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale);

      this.zoomController.setTransform(transform);
    };

    // Mouse event listeners
    this.zoomButton.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);

    // Touch event listeners for mobile
    this.zoomButton.addEventListener("touchstart", (e) => dragStart(e.touches[0]));
    document.addEventListener("touchmove", (e) => drag(e.touches[0]));
    document.addEventListener("touchend", dragEnd);
  }
}
