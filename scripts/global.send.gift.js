class SendGift {
  constructor({ triggerSelector, hideSelector, modalSelector }) {
    this.triggerSelector = document.querySelector(triggerSelector);
    this.hideSelector = document.querySelector(hideSelector);
    this.modalSelector = document.querySelector(modalSelector);
    this.sendGiftSelectionAmount = document.querySelector("#sendGiftSelectionAmount");
    this.sendGiftType = document.getElementById("sendGiftType");
    this.sendGiftUsersSelect = document.querySelector("#sendGiftUsersSelect");
    this.sendGiftUsersDropdown = document.querySelector("#sendGiftUsersDropdown");
    this.sendGiftAndReaction = document.getElementById("sendGiftAndReaction");
    this.giftType = null;
    this.modalInterval = null;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  hideModal() {
    this.modalSelector.classList.add(HIDDEN);
    this.sendGiftSelectionAmount.querySelectorAll(".gift-type").forEach((item) => {
      item.classList.remove("active");
    });
  }

  bindEvents() {
    //
    this.triggerSelector.addEventListener("click", () => {
      this.modalSelector.classList.remove(HIDDEN);
    });

    //
    this.hideSelector.addEventListener("click", () => {
      this.hideModal();
    });

    // sendCoinModal click
    this.modalSelector.addEventListener("click", (e) => {
      if (e.target.id === "sendGiftModal") {
        this.modalSelector.classList.add(HIDDEN);
      }
    });

    //
    this.sendGiftSelectionAmount.addEventListener("click", (e) => {
      const button = e.target.closest(".gift-type");

      if (button) {
        this.giftType = button.dataset.url;

        this.sendGiftSelectionAmount.querySelectorAll(".gift-type").forEach((item) => {
          item.classList.remove("active");
        });
        button.classList.add("active");
      }
    });

    this.sendGiftUsersSelect.addEventListener("click", (e) => {
      const currentValue = this.sendGiftUsersSelect.getAttribute("aria-expanded") === "true";
      this.sendGiftUsersSelect.setAttribute("aria-expanded", !currentValue);
    });

    // Web Accessibilty (Keyboard)
    this.sendGiftUsersSelect.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const currentValue = this.sendGiftUsersSelect.getAttribute("aria-expanded") === "true";
        this.sendGiftUsersSelect.setAttribute("aria-expanded", !currentValue);
      }
    });

    this.sendGiftAndReaction?.addEventListener("click", (e) => {
      console.log("sendGiftAndReaction");

      // assume each button is an LI with data-reaction
      // const btn = e.target.closest("[data-reaction]");
      if (!this.giftType) return;

      // const type = btn.dataset.reaction;
      const streamShow = document.getElementById("streamShow");

      console.log(this.giftType);

      const id = Math.random().toString(36).slice(2);
      const markup = this._template(this.giftType, id);
      streamShow.insertAdjacentHTML("beforeend", markup);
      this.modalSelector.classList.add(HIDDEN);

      setTimeout(() => {
        const el = streamShow.querySelector(`.animating_reaction--${id}`);
        if (el) el.remove();
      }, 6000);
    });

    this.sendGiftUsersDropdown.addEventListener("click", (e) => {
      const button = e.target.closest("li");

      if (button) {
        this.sendGiftUsersDropdown.querySelectorAll("li").forEach((item) => {
          item.setAttribute("aria-selected", false);
        });

        button.setAttribute("aria-selected", true);

        this.sendGiftUsersSelect.querySelector("span").textContent = button.querySelector("span").textContent;
        this.sendGiftUsersSelect.querySelector("img").src = button.querySelector("img").src;
        this.sendGiftUsersSelect.setAttribute("aria-expanded", false);
      }
    });

    //
    this.sendGiftType?.addEventListener("click", (e) => {
      clearTimeout(this.modalInterval);

      if (this.giftType) {
        const container = document.querySelector(".send-something-modal-wrapper");
        const sendSomethingModal = document.getElementById("sendSomethingModal");

        const markup = `
            <div class="item-1">
              <img src="${this.giftType}" alt="gift" />
            </div>
          `;

        container.innerHTML = "";
        container.insertAdjacentHTML("beforeend", markup);
        sendSomethingModal.classList.remove(HIDDEN);

        this.modalInterval = setTimeout(() => {
          sendSomethingModal.classList.add(HIDDEN);
        }, 2000);
      }
    });
  }

  _template(reaction, id) {
    return `
      <div class="animating_reaction animating_reaction--${id}">
        <div style="position: relative">
          <div class="description">
            <span>Rafeal Richi</span> sent gift to the broadcast
          </div>
          <div class="reaction_type">
            <img src="${reaction}" alt="${reaction}" />
            <div>
              <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60" alt="avatar" />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

new SendGift({
  triggerSelector: "#showAddGift",
  hideSelector: "#sendGiftCancel",
  modalSelector: "#sendGiftModal",
});
