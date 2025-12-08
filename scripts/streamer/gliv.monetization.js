class MonetizationControl {
  constructor() {
    this.monetizationBtn = document.getElementById("monetizationBtn");
    this.audienceMonetizationGiftingBack = document.getElementById("audienceMonetizationGiftingBack");
    this.asideMonetizationGifting = document.getElementById("asideMonetizationGifting");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    this.streamerToolAction = document.querySelectorAll(".streamer_tool_action");
    this.monetizeAnalyzesItems = document.querySelectorAll(".monetization_analyzes_containers .monetize_analyzes_item");

    this.bindEvents();
  }

  show() {
    this.streamerToolAction.forEach((btn) => btn.classList.remove("active"));
    this.monetizationBtn.classList.add("active");
    this.asideMonetizationGifting.classList.remove(HIDDEN);
  }

  hide() {
    this.monetizationBtn.classList.remove("active");
    this.asideMonetizationGifting.classList.add(HIDDEN);
    this.asideChatSlider.classList.remove(HIDDEN);
  }

  //
  bindEvents() {
    //
    this.monetizationBtn.addEventListener("click", () => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.show();
    });

    //
    this.audienceMonetizationGiftingBack.addEventListener("click", () => {
      this.hide();
    });

    //
    this.monetizeAnalyzesItems.forEach((monetizeItem) => {
      monetizeItem.addEventListener("click", (e) => {
        const expandContainerBtn = e.target.closest(".expand_container--btn");

        if (expandContainerBtn) {
          if (monetizeItem.classList.contains("expanded")) {
            this.monetizeAnalyzesItems.forEach((item) => item.classList.remove("expanded"));
          } else {
            this.monetizeAnalyzesItems.forEach((item) => item.classList.remove("expanded"));
            monetizeItem.classList.add("expanded");
          }
        }
      });
    });
  }
}

new MonetizationControl();
