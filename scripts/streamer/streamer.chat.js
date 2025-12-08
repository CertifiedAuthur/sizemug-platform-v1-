/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
class StreamerLiveChat {
  constructor() {
    this.messages = ["Hey everyone 👋 just joined!", "Welcome!", "This is my first time here, love the vibe already 🙌", "Where’s everyone tuning in from?", "The audio is 💤 — super crisp!", "You got me hooked with that intro 💤💤💤", "Back again 💤 never miss your streams!", "Omg this setup looks 💤💤💤", "Can we get a shoutout? 💬", "Wow the chat is moving fast today!"];
    this.statuses = ["offline", "offline", "offline", "active", "active", "offline", "active", "active", "offline", null];
    this.roles = [null, "Host", null, "Co-Host", "Top Gifted 1", null, "Top Gifted 2", "Top Gifted 3", null, null];
    this.badges = [null, "medal-gold-level-1", "sg-pioneer", null, null, null, null, null, "sg-100-days-streamer-badge", null];
    this.emojis = [null, "❌", "❌", "💬", "💬", "❌", "💬", "💬", "❌", null];

    this.liveChatGiftersList = document.getElementById("liveChatGiftersList");
    this.liveChatVIPsList = document.getElementById("liveChatVIPsList");
    this.topGiftedBtn = document.getElementById("topGiftedBtn");
    this.topVIPBtn = document.getElementById("topVIPBtn");
    this.liveChatTabExpand = document.getElementById("liveChatTabExpand");
    this.liveChatsListArea = document.getElementById("liveChatsListArea");
    this.collapseLiveContainer = document.getElementById("collapseLiveContainer");
    this.expandStreamAsideContainer = document.getElementById("expandStreamAsideContainer");
    this.liveChatContainer = document.getElementById("liveChatContainer");
    this.streamOnScreenMessage = document.getElementById("streamOnScreenMessage");
    this.chatHostOptions = document.getElementById("chatHostOptions");
    this.bannedModal = document.getElementById("bannedModal");
    this.hideBanModal = document.querySelector(".hide_ban_modal");

    this.displayTopGifted();
    this.displayVIPs();
    this.displayLiveChatMessages();
    this.bindEvents();
  }

  async getUsers() {
    const users = await apiGetUsers(10);

    const chats = users.map((user, i) => {
      return {
        sender: {
          name: user.name,
          photo: user.photo,
          emoji: this.emojis[i],
          role: this.roles[i],
          badge: this.badges[i],
        },
        message: this.messages[i],
        status: this.statuses[i],
      };
    });

    return chats;
  }

  #removeActiveFromTab() {
    const liveChatTabs = document.querySelectorAll(".live_chat_tab");
    liveChatTabs.forEach((btn) => btn.classList.remove("active"));
  }

  bindEvents() {
    this.topGiftedBtn.addEventListener("click", () => {
      this.#removeActiveFromTab();
      this.topGiftedBtn.classList.add("active");
      this.liveChatVIPsList.classList.add(HIDDEN);
      this.liveChatGiftersList.classList.remove(HIDDEN);
    });

    this.topVIPBtn.addEventListener("click", () => {
      this.#removeActiveFromTab();
      this.topVIPBtn.classList.add("active");
      this.liveChatGiftersList.classList.add(HIDDEN);
      this.liveChatVIPsList.classList.remove(HIDDEN);
    });

    //
    this.liveChatTabExpand.addEventListener("click", () => {});

    //
    this.collapseLiveContainer.addEventListener("click", () => {
      const isExpanded = this.collapseLiveContainer.getAttribute("aria-expanded") === "true";
      this.showAsideContainer(isExpanded);
    });

    //
    this.expandStreamAsideContainer?.addEventListener("click", () => {
      this.showAsideContainer(false);
    });

    // Movemove && Mouseover on user profile name
    this.updateProfileCardPosition();

    //
    this.chatHostOptions.addEventListener("click", (e) => {
      const listItem = e.target.closest("li");

      if (listItem) {
        // Block Modal
        const reportLI = listItem.closest("li.report");
        if (reportLI) {
          if (chatHostOptionsDropdownInstance) {
            chatHostOptionsDropdownInstance.hide();
          }
          return showGlobalReportModal();
        }

        // Block Modal
        const blockLI = listItem.closest("li.block");
        if (blockLI) {
          if (chatHostOptionsDropdownInstance) {
            chatHostOptionsDropdownInstance.hide();
          }
          return showBlockModal();
        }

        // Block Modal
        const deleteLI = listItem.closest("li.delete");
        if (deleteLI) {
          if (chatHostOptionsDropdownInstance) {
            chatHostOptionsDropdownInstance.hide();
          }
          this.bannedModal.classList.remove(HIDDEN);
          return;
        }
      }
    });

    //
    this.hideBanModal.addEventListener("click", () => {
      this.bannedModal.classList.add(HIDDEN);
    });
  }

  showAsideContainer(show) {
    this.liveChatContainer.classList[!show ? "remove" : "add"]("collapsed");
    this.streamOnScreenMessage.classList[show ? "remove" : "add"](HIDDEN);

    this.collapseLiveContainer.setAttribute("aria-expanded", !show);
    this.expandStreamAsideContainer.classList[show ? "remove" : "add"](HIDDEN);
  }

  updateProfileCardPosition() {
    const liveChatsListArea = this.liveChatsListArea;
    const profileCard = document.getElementById("profileCardModal");
    let popperInstance = null;
    let hideTimeout = null;

    // Helper functions
    function showProfileCard(referenceEl) {
      profileCard.classList.add("show");
      if (popperInstance) popperInstance.destroy();
      popperInstance = Popper.createPopper(referenceEl, profileCard, {
        placement: "right", // Always right
        modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
      });
    }

    function hideProfileCard() {
      profileCard.classList.remove("show");
      if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
      }
    }

    // Event delegation for click
    liveChatsListArea.addEventListener("click", (e) => {
      const username = e.target.closest(".live_chats_message_username");
      if (username) {
        clearTimeout(hideTimeout);
        showProfileCard(username);

        return;
      }

      hideProfileCard();
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".live_chats_message_username")) {
        hideProfileCard();
      }
    });
  }

  async displayVIPs() {
    const chats = await this.getUsers();

    chats.forEach((msg) => {
      const markup = `
                <div class="sg_nav_profile">
                  <button class="sg_live_avatar_btn" aria-label="Open Profile Menu" style="border: 1px solid rgba(2, 214, 216, 1)">
                    <img loading="lazy" src="${msg.sender.photo}" alt="${msg.sender.name}" />
                  </button>
                 ${msg.sender.badge ? `<img class="badge" src="./icons/${msg.sender.badge}.svg" alt="${msg.sender.badge}" />` : ""}
                </div>
      `;

      this.liveChatVIPsList.insertAdjacentHTML("beforeend", markup);
    });
  }

  async displayTopGifted() {
    const users = await this.getUsers();

    users.forEach((user, i) => {
      const markup = `
         <div class="gifted_item">
                <img src="${user.sender.photo}" alt="${user.sender.name}" />
                <span>${i + 1}</span>
        </div>
      `;
      this.liveChatGiftersList.insertAdjacentHTML("beforeend", markup);
    });

    /* <span>No User Gifted</span>  */
  }

  async displayLiveChatMessages() {
    const messages = await this.getUsers();

    messages.forEach((msg) => {
      let slugRole;
      if (msg.sender?.role) {
        slugRole = msg?.sender?.role
          .split(" ")
          .map((s) => s)
          .join("-");
      }

      const markup = `
        <div class="live_chats_message_item">
                <div class="live_chats_message_avatar">
                  <img src="${msg.sender.photo}" alt="${msg.sender.name}" />
                </div>

                <div class="live_chats_message_content">
                  <div class="live_chats_message_meta">
                    <span class="live_chats_message_username">${msg.sender.name}</span>
                    ${
                      msg.sender.badge
                        ? `
                    <span class="live_chats_message_badge">
                      <img src="./icons/${msg.sender.badge}.svg" alt="${msg.sender.badge}" />
                    </span>`
                        : ""
                    }
                    ${msg.sender.role ? `<span class="live_chats_message_role ${slugRole}">${msg.sender.role}</span>` : ""}
                    <button class="live_options">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                    </button>
                  </div>
                  <span class="live_chats_message_text">${msg.message}</span>
                </div>
        </div>
      `;

      this.liveChatsListArea.insertAdjacentHTML("beforeend", markup);

      this.updateProfileCardPosition();
    });

    //
    new ChatHostOptionsDropdown();
  }
}

new StreamerLiveChat();

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

class OnScreenChat {
  /**
   * @param {string} containerId  the ID of your chat container
   * @param {Array} messages
   * @param {object} [opts]
   * @param {number} [opts.interval=10000] ms between messages
   * @param {number} [opts.max=5] max visible messages
   */
  constructor(containerId, messages, opts = {}) {
    this.chatEl = document.getElementById(containerId);
    this.messages = messages;
    this.interval = opts.interval || 10000;
    this.max = opts.max || 5;
    this.idx = 0;
    this.timer = null;
  }

  start() {
    this._addNext(); // show first immediately
    this.timer = setInterval(() => this._addNext(), this.interval);
  }

  stop() {
    clearInterval(this.timer);
  }

  _addNext() {
    const msgObj = this.messages[this.idx];
    this._renderMessage(msgObj);
    this.idx = (this.idx + 1) % this.messages.length;
  }

  _renderMessage(msg) {
    // Remove oldest if over max
    while (this.chatEl.children.length >= this.max) {
      this.chatEl.removeChild(this.chatEl.firstChild);
    }
    // Use displayLiveChatMessages markup logic, but for a single message
    let slugRole;
    if (msg.sender?.role) {
      slugRole = msg?.sender?.role
        .split(" ")
        .map((s) => s)
        .join("-");
    }
    const markup = `
      <div class="live_chats_message_item">
        <div class="live_chats_message_avatar">
          <img src="https://media.istockphoto.com/id/1487465664/photo/portrait-employee-and-asian-woman-with-happiness-selfie-and-confident-entrepreneur-with.webp?a=1&b=1&s=612x612&w=0&k=20&c=wS14CqknuT6mj3bnzopHuMbyhSernzpXIKeKFJhHDro=" alt="" />
        </div>
        <div class="live_chats_message_content">
          <div class="live_chats_message_meta">
            <a href="/dashboard.html" class="live_chats_message_username">${msg.sender.name}</a>
            ${msg.sender.badge ? `<span class="live_chats_message_badge"><img src="./icons/${msg.sender.badge}.svg" alt="" /></span>` : ""}
            ${msg.sender.role ? `<span class="live_chats_message_role ${slugRole}">${msg.sender.role}</span>` : ""}
          </div>
          <span class="live_chats_message_text">${msg.message}</span>
        </div>
      </div>
    `;
    this.chatEl.insertAdjacentHTML("beforeend", markup);
    this.chatEl.scrollTop = this.chatEl.scrollHeight;
  }
}

// Use chatMessages from streamer.chat.js if available globally
const chat = new OnScreenChat("onScreenLiveChats", streamerChats, { interval: 1000, max: 5 });
chat.start();

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

document.addEventListener("DOMContentLoaded", () => {
  const emojiPickerBtn = document.getElementById("emojiPickerBtn");

  new window.EmojiPickerTrigger(emojiPickerBtn, {
    placement: "bottom-end",
    onEmojiSelect: (emoji) => console.log("Picked:", emoji),
  });
});
