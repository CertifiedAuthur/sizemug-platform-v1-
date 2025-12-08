const viewersUsers = [
  {
    id: 1,
    name: "Arlene McCoy",
    avatar: "../images/small-img/1.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 2,
    name: "Theresa Webb",
    avatar: "../images/small-img/2.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 3,
    name: "Darrell Steward",
    avatar: "../images/small-img/3.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 4,
    name: "Theresa Webb",
    avatar: "../images/small-img/4.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 5,
    name: "Darrell Steward",
    avatar: "../images/small-img/5.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 6,
    name: "Arlene McCoy",
    avatar: "../images/small-img/2.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 7,
    name: "Darrell Steward",
    avatar: "../images/small-img/3.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 8,
    name: "Arlene McCoy",
    avatar: "../images/small-img/4.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 9,
    name: "Theresa Webb",
    avatar: "../images/small-img/2.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 10,
    name: "Darrell Steward",
    avatar: "../images/small-img/3.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 11,
    name: "Theresa Webb",
    avatar: "../images/small-img/4.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 12,
    name: "Darrell Steward",
    avatar: "../images/small-img/5.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 13,
    name: "Arlene McCoy",
    avatar: "../images/small-img/2.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 14,
    name: "Darrell Steward",
    avatar: "../images/small-img/3.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 15,
    name: "Arlene McCoy",
    avatar: "../images/small-img/4.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 16,
    name: "Theresa Webb",
    avatar: "../images/small-img/2.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 17,
    name: "Darrell Steward",
    avatar: "../images/small-img/3.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
  {
    id: 18,
    name: "Arlene McCoy",
    avatar: "../images/small-img/4.png",
    actions: [
      { label: "Message", icon: "../images/message.svg", href: "/chat.html" },
      { label: "View Profile", icon: "../images/view-profile.svg" },
    ],
  },
];

class ViewersList {
  /**
   * @param {string|Element} ulSelector
   * @param {Array} data   // array of {id,name,avatar,actions…}
   */
  constructor(ulSelector, data) {
    this.container = typeof ulSelector === "string" ? document.querySelector(ulSelector) : ulSelector;
    this.data = data;
    // the single dropdown element
    this.dropdown = document.getElementById("viewersDropdown");
    this.popperInstance = null;
    this.currentBtn = null;

    this._render();
    this._bindEvents();
  }

  _render() {
    this.container.innerHTML = this.data
      .map(
        (user) => `
            <li data-id="${user.id}">
              <img src="${user.avatar}" alt="${user.name}" draggable="false" />
              <span class="user-name">${user.name}</span>
              <button class="more-btn" aria-label="More options">⋮</button>
            </li>
          `
      )
      .join("");
  }

  _bindEvents() {
    // 1) clicking the “⋮” button
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest(".more-btn");
      if (!btn) return;

      e.stopPropagation();
      // if we clicked the same button, just toggle off
      if (this.currentBtn === btn) {
        this._hideDropdown();
        return;
      }

      this.currentBtn = btn;
      this._showDropdown(btn);
    });

    // 2) click anywhere else should close the dropdown
    document.addEventListener("click", (e) => {
      if (!this.dropdown.contains(e.target) && !this.currentBtn?.contains(e.target)) {
        this._hideDropdown();
      }
    });
  }

  _showDropdown(referenceBtn) {
    // make dropdown visible
    this.dropdown.style.display = "block";

    // destroy old popper, if any
    if (this.popperInstance) {
      this.popperInstance.destroy();
    }

    // create a new one, positioning it under the button
    this.popperInstance = Popper.createPopper(referenceBtn, this.dropdown, {
      placement: "bottom-end",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        // make sure it stays within viewport
        { name: "preventOverflow", options: { boundary: "viewport" } },
      ],
    });
  }

  _hideDropdown() {
    // hide and destroy popper
    this.dropdown.style.display = "none";
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
    this.currentBtn = null;
  }
}

// Instantiate ✨
new ViewersList("#viewersUserList", viewersUsers);
