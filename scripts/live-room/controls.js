class Controls {
  constructor() {
    this.toggleCaption = document.getElementById("toggleCaption");
    this.toggleChat = document.getElementById("toggleChat");
    this.liveAside = document.getElementById("liveAside");
    this.goFullScreenMode = document.getElementById("goFullScreenMode");

    this._bind();
  }

  _bind() {
    this.handleCaption();
    this.handleChat();
    this.handleFullScreenMode();
  }

  handleCaption() {
    this.toggleCaption.addEventListener("click", () => {
      const isExpanded = this.toggleCaption.getAttribute("aria-expanded") === "true";
      this.toggleCaption.setAttribute("aria-expanded", !isExpanded);
    });
  }

  // Open Chat
  handleChat() {
    this.toggleChat.addEventListener("click", () => {
      const isExpanded = this.toggleChat.getAttribute("aria-expanded") === "true";
      this.toggleChat.setAttribute("aria-expanded", !isExpanded);

      if (isExpanded) {
        this.toggleChat.querySelector("span").textContent = "Open Chat";
        this.liveAside.style.display = "none";
      } else {
        this.toggleChat.querySelector("span").textContent = "Close Chat";
        this.liveAside.style.display = "flex";
      }
    });
  }

  handleFullScreenMode() {
    const liveRoomDetails = document.getElementById("liveRoomDetails");
    let inFullscreen = false;

    // helper to enter fullscreen
    function enterFS() {
      if (!inFullscreen && liveRoomDetails.requestFullscreen) {
        liveRoomDetails.requestFullscreen().catch(console.error);
        inFullscreen = true;
      }
    }

    // helper to exit fullscreen
    function exitFS() {
      if (inFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(console.error);
        inFullscreen = false;
      }
    }

    this.goFullScreenMode.addEventListener("click", () => {
      const isExpanded = this.goFullScreenMode.getAttribute("aria-expanded") === "true";
      this.goFullScreenMode.setAttribute("aria-expanded", !isExpanded);

      if (isExpanded) {
        exitFS();
      } else {
        enterFS();
      }
    });

    // clean up when user presses ESC or fullscreen exit
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement) {
        inFullscreen = false;
        this.goFullScreenMode.setAttribute("aria-expanded", false);
      }
    });
  }
}

new Controls();
