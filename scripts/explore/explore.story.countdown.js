class AddStoryCountdown {
  constructor() {
    this.countdownInput = document.getElementById("countdownInput");
    this.countdownColorButtons = document.querySelectorAll("#countdownColorButtons button");
    this.countdownFillCheckbox = document.getElementById("countdownFillCheckbox");

    this.countdownColorBtn = document.getElementById("countdownColorBtn");
    this.countdownColorPicker = document.getElementById("countdownColorPicker");

    this.targetDateTime = null; // store combined target date+time

    this._init();
  }

  _init() {
    this._bindEvents();
  }

  _getActiveEditorElements() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    const countdownContainer = canvasEditorContainer.querySelector(".countdown_container");
    return { countdownContainer, canvasEditorContainer };
  }

  _setupElement(el, cn, cl) {
    const markup = this._generateMarkup();
    cn.insertAdjacentHTML("beforeend", markup);
    el = cn.querySelector(cl);
    new Interactive()._makeInteractive(el);
    return el;
  }

  _bindEvents() {
    /** Title input **/
    this.countdownInput.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value) {
        let { countdownContainer, canvasEditorContainer } = this._getActiveEditorElements();
        if (!countdownContainer) {
          countdownContainer = this._setupElement(null, canvasEditorContainer, ".countdown_container");
        }
        countdownContainer.querySelector("h2").textContent = value;
      }
    });

    /** Color buttons **/
    this.countdownColorButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.countdownColorButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const { countdownContainer } = this._getActiveEditorElements();
        if (countdownContainer) {
          countdownContainer.style.background = btn.dataset.color;
        }
      });
    });

    /** Fill toggle **/
    this.countdownFillCheckbox.addEventListener("change", (e) => {
      let { countdownContainer, canvasEditorContainer } = this._getActiveEditorElements();
      if (!countdownContainer) {
        countdownContainer = this._setupElement(null, canvasEditorContainer, ".countdown_container");
      }
      countdownContainer.classList.toggle("fill-none", !e.target.checked);
    });

    //
    this.countdownColorBtn.addEventListener("click", () => {
      this.countdownColorPicker.click();
    });

    //
    this.countdownColorPicker.addEventListener("change", (e) => {
      const { countdownContainer } = this._getActiveEditorElements();
      if (countdownContainer) {
        countdownContainer.style.background = e.target.value;
      }
    });

    /** Helpers **/
    const parseYmdHi = (s) => {
      if (!s) return null;
      const [d, t] = s.split(" ");
      if (!d) return null;
      const [y, m, day] = d.split("-").map(Number);
      let [hh, mm] = [0, 0];
      if (t) [hh, mm] = t.split(":").map(Number);
      return new Date(y, m - 1, day, hh, mm);
    };

    /** Date+Time Picker **/
    const dtInput = document.getElementById("countdownDatetimeInput");
    const dtMonthDay = document.querySelector(".dtMonthDay");

    flatpickr(dtInput, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: true,
      allowInput: true,
      onChange: (selectedDates, dateStr) => {
        const dt = selectedDates[0] || parseYmdHi(dateStr);
        this.targetDateTime = dt;
        if (dtMonthDay) {
          dtMonthDay.textContent = dt.toLocaleString("en-US", { month: "short", day: "numeric" });
        }
        this._updateCountdownDisplay();
      },
    });

    /** Time-only Picker **/
    const tInput = document.getElementById("countdownTimeInput");
    const dtTimeStored = document.querySelector(".dtTimeStored");

    flatpickr(tInput, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      time_24hr: false,
      onChange: (selectedDates) => {
        const dt = selectedDates[0];
        if (dtTimeStored) {
          dtTimeStored.textContent = dt.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        }
        if (this.targetDateTime) {
          this.targetDateTime.setHours(dt.getHours(), dt.getMinutes());
          this._updateCountdownDisplay();
        }
      },
    });

    /** Interval updater **/
    setInterval(() => this._updateCountdownDisplay(), 1000);
  }

  /** Render countdown timer */
  _updateCountdownDisplay() {
    if (!this.targetDateTime) return;

    let { countdownContainer, canvasEditorContainer } = this._getActiveEditorElements();
    if (!countdownContainer) {
      countdownContainer = this._setupElement(null, canvasEditorContainer, ".countdown_container");
    }

    const now = new Date();
    let diff = Math.max(0, this.targetDateTime - now); // ms
    const sec = Math.floor((diff / 1000) % 60);
    const min = Math.floor((diff / (1000 * 60)) % 60);
    const hr = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const cards = countdownContainer.querySelectorAll(".timer_card_big_text");

    if (cards.length >= 3) {
      cards[0].textContent = days > 0 ? `${days}d` : this._pad(hr) + "h";
      cards[1].textContent = this._pad(min) + "m";
      cards[2].textContent = this._pad(sec) + "s";
    }
  }

  _pad(n) {
    return n.toString().padStart(2, "0");
  }

  _generateMarkup() {
    return `
    <div class="countdown_container">
      <h2>Countdown title</h2>
      <div class="countdown_timer">
        <div class="timer_card_gradient"><div class="timer_card_big_text">00h</div></div>
        <span>:</span>
        <div class="timer_card_gradient"><div class="timer_card_big_text">00m</div></div>
        <span>:</span>
        <div class="timer_card_gradient"><div class="timer_card_big_text">00s</div></div>
      </div>
    </div>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addStoryCountdown = new AddStoryCountdown();
});
