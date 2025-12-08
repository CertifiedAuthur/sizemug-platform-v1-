class StreamerManagement {
  constructor() {
    this.streamManagementBtn = document.getElementById("streamManagementBtn");
    this.streamManagementBack = document.getElementById("streamManagementBack");
    this.asideStreamManagement = document.getElementById("asideStreamManagement");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    this.streamerToolAction = document.querySelectorAll(".streamer_tool_action");

    this.bindEvents();
  }

  show() {
    this.streamerToolAction.forEach((btn) => btn.classList.remove("active"));
    this.streamManagementBtn.classList.add("active");
    this.asideStreamManagement.classList.remove(HIDDEN);
  }

  hide() {
    this.streamManagementBtn.classList.remove("active");
    this.asideStreamManagement.classList.add(HIDDEN);
    this.asideChatSlider.classList.remove(HIDDEN);
  }

  //
  bindEvents() {
    //
    this.streamManagementBtn.addEventListener("click", () => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.show();
    });

    //
    this.streamManagementBack.addEventListener("click", () => {
      this.hide();
    });
  }
}

new StreamerManagement();
