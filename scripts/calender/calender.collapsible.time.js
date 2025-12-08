class CollapsibleCalendar {
  /**
   * @param {string|HTMLElement} container  – ID of your calendar div or the element itself
   * @param {number} startHour              – first hour to render (24-hr)
   * @param {number} endHour                – last hour to render (24-hr)
   */
  constructor(container, startHour = 7, endHour = 18) {
    this.container = typeof container === "string" ? document.getElementById(container) : container;
    this.startHour = startHour;
    this.endHour = endHour;

    this.#render();
    this.#attachToggleHandler();
  }

  #render() {
    // clear any existing content
    this.container.innerHTML = "";

    for (let hour = this.startHour; hour <= this.endHour; hour++) {
      const group = this.#createHourGroup(hour);
      this.container.appendChild(group);
    }
  }

  #createHourGroup(hour) {
    // wrapper
    const group = document.createElement("div");
    group.className = "time-group";

    // header
    const header = document.createElement("div");
    header.className = "time-group-header";
    header.innerHTML = `
            <span class="label">${this.#formatHour(hour)}</span>
            <button class="toggle">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="m18 15l-6-6l-6 6"/></svg>
            </button>
          `;
    group.appendChild(header);

    // slots container
    const slots = document.createElement("div");
    slots.className = "time-slots";

    // four quarter-hour slots
    for (let mins = 0; mins < 60; mins += 15) {
      if (mins !== 0) {
        const slot = document.createElement("div");
        slot.className = "time-slot";
        // slot.textContent = `${this.#formatHour(hour)}:${String(mins).padStart(2, "0")}`;
        slot.textContent = this._formatSlotTime(hour, mins);
        slots.appendChild(slot);
      }
    }

    group.appendChild(slots);
    return group;
  }

  #attachToggleHandler() {
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle");
      if (!btn) return;
      const group = btn.closest(".time-group");
      group.classList.toggle("collapsed");
    });
  }

  #formatHour(h24) {
    const period = h24 < 12 ? "AM" : "PM";
    const h12 = ((h24 + 11) % 12) + 1;
    return `${h12} ${period}`;
  }

  _formatSlotTime(hour, mins) {
    const period = hour < 12 ? "AM" : "PM";
    const h12 = ((hour + 11) % 12) + 1;
    return `${h12}:${String(mins).padStart(2, "0")}`;
  }
}

// on DOM ready, instantiate your calendar
document.addEventListener("DOMContentLoaded", () => {
  // new CollapsibleCalendar("timeGroup", 7, 18);
  new CollapsibleCalendar("timeGroup", 0, 23);
});
