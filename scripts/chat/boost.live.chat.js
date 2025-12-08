class BoostLive {
  constructor() {
    this.boostLiveModal = document.getElementById("boostLiveModal");
    this.boostDialog = document.getElementById("boostDialog");
    this.boostLiveChat = document.getElementById("boostLiveChat");
    this.boostLiveModalBoostButton = document.getElementById("boostLiveModalBoostButton");

    this.boostLiveChat.addEventListener("click", () => {
      this.boostDialog.style.display = "none";
    });

    this.boostLiveModalBoostButton.addEventListener("click", () => {
      this.boostLiveModal.style.display = "none";
    });

    this.init();
  }

  init() {
    // Boost Buttons
    this.boostDialog.addEventListener("click", (e) => {
      const btn = e.target.closest(".boost-button");
      if (!btn) return;

      const boostType = btn.dataset.boostType; // "basic" | "power30" | "power60"
      const duration = parseInt(btn.dataset.duration, 10); // in minutes
      const cssClass = btn.dataset.cssClass; // "boost-basic" | "boost-power30" | "boost-power60"

      const chatContainer = this.boostLiveChat.closest(".chatting_area_container");
      if (!chatContainer) return;

      const liveId = chatContainer.dataset.id;
      const liveType = chatContainer.dataset.type;

      if (liveType !== "lives") return;

      const liveChatItem = document.querySelector(`[data-live-chat-id="${liveId}"]`);
      if (!liveChatItem) return;

      // 2. Move it to the top of its container
      const liveItemsList = document.getElementById("liveItemsList");
      liveItemsList.querySelector(".title").insertAdjacentHTML("beforeend", `<span>${boostType === "basic" ? "🔥" : boostType === "power30" ? "🔥🔥" : "🔥🔥🔥"}</span>`);
      liveItemsList.prepend(liveChatItem);

      // 3. Apply the appropriate styling
      liveChatItem.classList.add(cssClass);

      // 4. Schedule cleanup after `duration` minutes
      setTimeout(() => {
        liveChatItem.classList.remove(cssClass);

        // Optionally, move it back to its original position:
        liveItemsList.insertBefore(liveChatItem, liveItemsList.children[originalIndex]);
      }, duration * 60 * 1000);

      // 5. Close your modal
      this.boostDialog.style.display = "none";
    });
  }
}

new BoostLive();

//
new PopperModal({
  triggerSelector: "#boostLiveChat",
  modalSelector: "#boostLiveModal",
  placement: "right-start",
  offset: [0, 12],
});

new PopperModal({
  triggerSelector: "#boostLiveModalBoostButton",
  modalSelector: "#boostDialog",
  referenceSelector: "#boostLiveChat",
  placement: "right-start",
  offset: [0, 12],
});
