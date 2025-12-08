class StreamerInvites {
  constructor() {
    this.viewInvitedUsers = document.getElementById("viewInvitedUsers");
    this.asideInvitesSlider = document.getElementById("asideInvitesSlider");
    this.sendMoreInvites = document.getElementById("sendMoreInvites");
    this.asideSendInvite = document.getElementById("asideSendInvite");
    this.asideInvitesBack = document.getElementById("asideInvitesBack");
    this.sendMoreInvitesBack = document.getElementById("sendMoreInvitesBack");
    this.asideChatSlider = document.getElementById("asideChatSlider");

    this.bindEvents();
  }

  hideAsideContainers() {
    const asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
  }

  //
  bindEvents() {
    //
    this.viewInvitedUsers.addEventListener("click", (e) => {
      this.hideAsideContainers();
      this.asideInvitesSlider.classList.remove(HIDDEN);
    });

    //
    this.sendMoreInvites.addEventListener("click", () => {
      this.hideAsideContainers();
      this.asideSendInvite.classList.remove(HIDDEN);
    });

    //
    this.asideInvitesBack.addEventListener("click", () => {
      this.hideAsideContainers();
      this.asideChatSlider.classList.remove(HIDDEN);
    });

    //
    this.sendMoreInvitesBack.addEventListener("click", () => {
      this.hideAsideContainers();
      this.asideInvitesSlider.classList.remove(HIDDEN);
    });
  }
}

new StreamerInvites();
