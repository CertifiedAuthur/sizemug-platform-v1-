class RequestJoinModal {
  constructor() {
    this.selectJoinOption = document.getElementById("selectJoinOption");
    this.selectJoinOptions = document.getElementById("selectJoinOptions");
    this.requestJoinAccepted = document.getElementById("requestJoinAccepted");
    this.cancelRequestJoin = document.getElementById("cancelRequestJoin");
    this.requestJoinModal = document.getElementById("requestJoinModal");
    this.requestToJoinStream = document.getElementById("requestToJoinStream");
    this.viewRequestToJoinStream = document.getElementById("viewRequestToJoinStream");
    this.requestJoinWrapper = document.getElementById("requestJoinWrapper");
    this.asideJoinRequest = document.getElementById("asideJoinRequest");
    this.requestJoinItems = document.getElementById("requestJoinItems");
    this.audienceJoinRequestBack = document.getElementById("audienceJoinRequestBack");
    this.asideSlidesContainers = document.querySelectorAll(".aside_slides_containers");
    this.asideChatSlider = document.getElementById("asideChatSlider");
    this.liveScreenMonitorContainer = document.getElementById("liveScreenMonitorContainer");

    this.layoutCount = 1;

    this.bindEvents();

    this.selectJoinOption?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isExpanded = this.selectJoinOption.getAttribute("aria-expanded") === "true";
      this.selectJoinOption.setAttribute("aria-expanded", !isExpanded);
    });
  }

  _removeItemClasses(el) {
    if (!el || !el.classList) return;
    [...el.classList].forEach((cls) => {
      if (cls.startsWith("item--")) el.classList.remove(cls);
    });
  }

  bindEvents() {
    // Select Option :)
    this.selectJoinOptions?.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");

      if (listItem) {
        const content = listItem.textContent;
        const listItems = this.selectJoinOptions.querySelectorAll("li");

        listItems.forEach((li) => li.classList.remove("active"));

        listItem.classList.add("active");
        this.selectJoinOption.querySelector("span").textContent = content;
        this.selectJoinOption.setAttribute("aria-expanded", false);
        this.requestJoinAccepted.removeAttribute("disabled");

        this.layoutCount++;

        // Remove any existing item--
        this._removeItemClasses(this.liveScreenMonitorContainer);
        this.liveScreenMonitorContainer.classList.add(`item--${this.layoutCount}`);
        const markup = `
          <div class="live_screen_monitor_screen--item">
            <img src="./images/live-image.png" alt="" />
          </div>
        `;
        this.liveScreenMonitorContainer.insertAdjacentHTML("beforeend", markup);
      }
    });

    // Viewers Page
    this.requestToJoinStream?.addEventListener("click", (e) => {
      e.preventDefault();
      if (this.requestToJoinStream.getAttribute("data-loading") !== "true") {
        this.#showRequestJoinModal();
      }
    });

    // Streamer Page
    this.viewRequestToJoinStream?.addEventListener("click", () => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.asideJoinRequest.classList.remove(HIDDEN);
      // Start fetching :)
      this.renderJoinRequestsSkeleton();
      this.renderJoinRequests();
    });

    // Cancel
    this.cancelRequestJoin?.addEventListener("click", (e) => {
      e.preventDefault();
      this.#hideRequestJoinModal();
    });

    // Self clicked :)
    this.requestJoinModal?.addEventListener("click", (e) => {
      if (e.target.id === "requestJoinModal") {
        this.#hideRequestJoinModal();
      }
    });

    // RequestJoinAccepted
    this.requestJoinAccepted?.addEventListener("click", (e) => {
      e.preventDefault();
      this.requestToJoinStream.setAttribute("data-loading", true);
      this.requestJoinWrapper.classList.add("loading");
      this.#hideRequestJoinModal();
    });

    // Audience Join Request Back
    this.audienceJoinRequestBack?.addEventListener("click", (e) => {
      this.asideSlidesContainers.forEach((container) => container.classList.add(HIDDEN));
      this.asideChatSlider.classList.remove(HIDDEN);
    });
  }

  //
  async renderJoinRequests() {
    const users = await apiGetUsers(20);
    this.requestJoinItems.innerHTML = "";

    users.forEach((user) => {
      const markup = `
        <div class="request_join_item">
          <img src="${user.photo}" alt="${user.name}" />
          <h4>${user.name}</h4>
          <div class="request_action_btns">
            <button class="cancel">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z" /></svg>
            </button>
            <button class="accept">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" /></svg>
            </button>
          </div>
        </div>
      `;
      this.requestJoinItems.insertAdjacentHTML("beforeend", markup);
    });
  }

  renderJoinRequestsSkeleton() {
    this.requestJoinItems.innerHTML = "";
    Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
      const markup = `<div class="skeleton-loading" style="height: 3rem; min-height: 3rem; width: 100%"></div>`;
      this.requestJoinItems.insertAdjacentHTML("beforeend", markup);
    });
  }

  #hideRequestJoinModal() {
    this.requestJoinModal.classList.add(HIDDEN);
  }

  #showRequestJoinModal() {
    this.requestJoinModal.classList.remove(HIDDEN);
  }
}

new RequestJoinModal();
