class AudienceControl {
  constructor() {
    this.audienceBtn = document.getElementById("audienceBtn");
    this.audienceControlsBack = document.getElementById("audienceControlsBack");
    this.asideAudienceControls = document.getElementById("asideAudienceControls");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    this.streamerToolAction = document.querySelectorAll(".streamer_tool_action");
    this.kickBanUsers = document.getElementById("kickBanUsers");
    this.asideAudienceControlsBan = document.getElementById("asideAudienceControlsBan");
    this.cancelAddMoreBannedUsers = document.getElementById("cancelAddMoreBannedUsers");
    this.audienceControlsBanBack = document.getElementById("audienceControlsBanBack");

    this.banFromStreamAction = document.getElementById("banFromStreamAction");
    this.banContainerModal = document.getElementById("banContainerModal");
    this.closeBanModal = document.querySelectorAll(".close_ban_modal");
    this.addMoreBannedUsers = document.getElementById("addMoreBannedUsers");

    this.bindEvents();
  }

  //
  bindEvents() {
    //
    this.audienceBtn.addEventListener("click", () => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.show();
    });

    //
    this.audienceControlsBack.addEventListener("click", () => {
      this.hide();
    });

    //
    this.kickBanUsers.addEventListener("click", (e) => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.asideAudienceControlsBan.classList.remove(HIDDEN);
    });

    //
    this.banFromStreamAction.addEventListener("click", () => {
      this.banContainerModal.classList.remove(HIDDEN);
    });

    // Self close :)
    this.banContainerModal.addEventListener("click", (e) => {
      if (e.target.id === "banContainerModal") {
        this.banContainerModal.classList.add(HIDDEN);
      }
    });

    //
    this.closeBanModal.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.banContainerModal.classList.add(HIDDEN);
      });
    });

    this.addMoreBannedUsers.addEventListener("click", () => {
      const audienceControlsKick = document.getElementById("audienceControlsKick");
      audienceControlsKick.setAttribute("data-mode", "selection");
      this.asideAudienceControlsBan.setAttribute("data-mode", "selection");
    });

    this.cancelAddMoreBannedUsers.addEventListener("click", () => {
      const audienceControlsKick = document.getElementById("audienceControlsKick");
      audienceControlsKick.removeAttribute("data-mode");
      this.asideAudienceControlsBan.removeAttribute("data-mode");
    });

    this.audienceControlsBanBack.addEventListener("click", (e) => {
      this.asideAudienceControlsBan.classList.add(HIDDEN);
      this.asideAudienceControls.classList.remove(HIDDEN);
    });
  }

  show() {
    this.streamerToolAction.forEach((btn) => btn.classList.remove("active"));
    this.audienceBtn.classList.add("active");
    this.asideAudienceControls.classList.remove(HIDDEN);
  }

  hide() {
    this.audienceBtn.classList.remove("active");
    this.asideAudienceControls.classList.add(HIDDEN);
    this.asideChatSlider.classList.remove(HIDDEN);
  }
}

new AudienceControl();
