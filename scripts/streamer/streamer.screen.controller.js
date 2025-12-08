class LiveStreamControllerModal {
  constructor() {
    this.liveStreamControllerModal = document.getElementById("liveStreamControllerModal");
    this.liveScreenView = document.getElementById("liveScreenView");

    this.bindEvent();
  }

  bindEvent() {
    // Only for Video Streaming Page
    this.liveScreenView?.addEventListener("mouseenter", () => {
      this.liveStreamControllerModal?.classList.remove(HIDDEN);
    });

    // Only for Video Streaming Page
    this.liveScreenView?.addEventListener("mouseleave", () => {
      this.liveStreamControllerModal?.classList.add(HIDDEN);
    });
  }
}

new LiveStreamControllerModal();
