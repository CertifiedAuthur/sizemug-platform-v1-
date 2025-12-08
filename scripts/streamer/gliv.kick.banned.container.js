class KickOptionsDropdown {
  constructor() {
    this.dropdown = document.getElementById("kickOptions");
    if (!this.dropdown) return;
    this.container = this.dropdown.querySelector(".streaming_options_container");
    this.isVisible = false;
    this.popperInstance = null;
    this.activeBtn = null;
    this.init();
  }

  init() {
    this.renderUsers();
    this.attachToButtons();
    this.addGlobalListeners();
    this.attachListEvents();
    window.kickOptionsDropdownInstance = this;
  }

  renderUsers() {
    const kickBannedLists = document.getElementById("kickBannedLists");

    kickBannedLists.innerHTML = "";
    Array.from({ length: 20 }, (_, i) => i + 1).map((item) => {
      const markup = `
                <li role="button" tabindex="0">
                    <img src="./students/student--5.avif" alt="" />
                    <h2>Darlene Robertson</h2>

                    <div class="kick_banned_list--action">
                      <button class="kick_options">
                        <!-- prettier-ignore -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                      </button>
                      <label class="kick_check_container kick_option_check">
                        <input type="checkbox" />
                        <div class="checkmark"></div>
                      </label>
                    </div>
                </li>
      `;

      kickBannedLists.insertAdjacentHTML("beforeend", markup);
    });
  }

  attachToButtons() {
    document.querySelectorAll(".kick_options").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.isVisible && this.activeBtn === btn) {
          this.hide();
        } else {
          this.show(btn);
        }
      });
    });
  }

  attachListEvents() {
    // Listen for click on each <li> in the dropdown
    this.container.querySelectorAll("li").forEach((li, idx) => {
      li.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onOptionClick && this.onOptionClick(li, idx, li.textContent.trim());
        this.hide();
      });
    });
  }

  /**
   * Set a callback for option click events
   * @param {function} cb - function(liElement, index, text)
   */
  setOptionClickHandler(cb) {
    this.onOptionClick = cb;
  }

  addGlobalListeners() {
    // Hide on outside click
    document.addEventListener("click", (e) => {
      if (this.isVisible && !this.dropdown.contains(e.target) && (!this.activeBtn || !this.activeBtn.contains(e.target))) {
        this.hide();
      }
    });
    // Hide on ESC
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.hide();
      }
    });
  }

  show(triggerBtn) {
    window.closeAllLiveModals && window.closeAllLiveModals();
    this.isVisible = true;
    this.activeBtn = triggerBtn;
    this.dropdown.classList.remove("streamer-hidden");
    this.container.classList.add("modal-anim-in");
    this.container.classList.remove("modal-anim-out");
    if (this.popperInstance) this.popperInstance.destroy();
    this.popperInstance = Popper.createPopper(triggerBtn, this.dropdown, {
      placement: "bottom-end",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
      ],
    });
  }

  hide() {
    if (!this.isVisible) return;
    this.isVisible = false;
    this.activeBtn = null;
    this.container.classList.remove("modal-anim-in");
    this.container.classList.add("modal-anim-out");
    this.container.addEventListener(
      "animationend",
      () => {
        this.dropdown.classList.add("streamer-hidden");
      },
      { once: true }
    );
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }
}

// Patch global closeAllLiveModals to include kick options dropdown
(function () {
  const prevCloseAllLiveModals = window.closeAllLiveModals;
  window.closeAllLiveModals = function () {
    if (prevCloseAllLiveModals) prevCloseAllLiveModals();
    if (window.kickOptionsDropdownInstance) window.kickOptionsDropdownInstance.hide();
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  let selected = 0;

  const instance = new KickOptionsDropdown();
  // Example: handle option clicks globally
  instance.setOptionClickHandler((li, idx, text) => {
    console.log("KickOptions clicked:", { idx, text, li });

    // if (text === "Block User" || text === "Remove Ban") {
    //   const audienceControlsKick = document.getElementById("audienceControlsKick");
    //   audienceControlsKick.setAttribute("data-mode", "selection");
    // }
  });

  const kickCheckContainers = document.querySelectorAll(".kick_check_container input");
  const selectedCountItem = document.getElementById("selectedCountItem");
  const kickActionBtns = document.querySelectorAll(".kick_actions_float button");

  // Initialize selected count if any are checked on load
  kickCheckContainers.forEach((kick) => {
    if (kick.checked) selected++;
  });
  selectedCountItem.textContent = selected;

  // Listen for changes
  kickCheckContainers.forEach((kick) => {
    kick.addEventListener("change", (e) => {
      // Use 'change' event
      if (e.target.checked) {
        selected++;
      } else {
        selected--;
      }
      selectedCountItem.textContent = selected;

      // Enable/disable buttons based on selection
      if (selected > 0) {
        kickActionBtns.forEach((btn) => btn.removeAttribute("disabled"));
      } else {
        kickActionBtns.forEach((btn) => btn.setAttribute("disabled", "disabled"));
      }
    });
  });
});
