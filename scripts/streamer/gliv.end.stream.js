class EndStreamModal {
  constructor() {
    this.endStreamModal = document.getElementById("endStreamModal");
    this.endLiveStream = document.getElementById("endLiveStream");
    this.endLiveModalBtn = document.getElementById("endLiveModalBtn");
    this.cancelEndLive = document.getElementById("cancelEndLive");

    this.bindEvent();
  }

  bindEvent() {
    //
    this.endLiveStream.addEventListener("click", () => {
      this.show();
    });

    //
    this.endStreamModal.addEventListener("click", (e) => {
      if (e.target.id === "endStreamModal") {
        this.hide();
      }
    });

    //
    this.cancelEndLive.addEventListener("click", () => {
      this.hide();
    });

    //
    this.endLiveModalBtn.addEventListener("click", () => {
      window.location.href = "/live.html";
    });
  }

  hide() {
    this.endStreamModal.classList.add(HIDDEN);
  }

  show() {
    this.endStreamModal.classList.remove(HIDDEN);
  }
}

new EndStreamModal();
