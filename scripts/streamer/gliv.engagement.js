class EngagementControl {
  constructor() {
    this.engagementBtn = document.getElementById("engagementBtn");
    this.audienceEngagementBack = document.getElementById("audienceEngagementBack");
    this.asideEngagement = document.getElementById("asideEngagement");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    this.streamerToolAction = document.querySelectorAll(".streamer_tool_action");

    this.bindEvents();
  }

  show() {
    this.streamerToolAction.forEach((btn) => btn.classList.remove("active"));
    this.engagementBtn.classList.add("active");
    this.asideEngagement.classList.remove(HIDDEN);
  }

  hide() {
    this.engagementBtn.classList.remove("active");
    this.asideEngagement.classList.add(HIDDEN);
    this.asideChatSlider.classList.remove(HIDDEN);
  }

  //
  bindEvents() {
    //
    this.engagementBtn.addEventListener("click", () => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.show();
    });

    //
    this.audienceEngagementBack.addEventListener("click", () => {
      this.hide();
    });
  }
}

new EngagementControl();
