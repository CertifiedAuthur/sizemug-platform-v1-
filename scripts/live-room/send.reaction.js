class ReactionAnimator {
  /**
   * @param {Object}   options
   * @param {string}   options.triggerSelector   — CSS selector for the element (or container) whose clicks fire a reaction.
   * @param {string}   options.streamSelector    — CSS selector for the container where reaction markup is injected.
   * @param {string}   options.userName          — Name to show in the description.
   * @param {string}   options.actionText        — Action to show (e.g. "boosted the live", "liked the post").
   * @param {string}   options.imageBasePath     — Base URL or path where your reaction SVGs live.
   * @param {string}   [options.closeParent=""]  — CSS selector for the parent element to close.
   * @param {number}   [options.duration=5000]   — How long (ms) each reaction should stick around.
   */
  constructor({ triggerSelector, streamSelector, userName, actionText, imageBasePath, closeParent = "", duration = 5000 }) {
    this.triggerEl = document.querySelector(triggerSelector);
    this.streamEl = document.querySelector(streamSelector);
    this.userName = userName;
    this.actionText = actionText;
    this.imageBasePath = imageBasePath.replace(/\/$/, ""); // strip trailing slash
    this.duration = duration;
    this.closeParent = closeParent;

    if (!this.triggerEl || !this.streamEl) {
      throw new Error(`ReactionAnimator: couldn't find trigger (${triggerSelector}) or stream (${streamSelector})`);
    }

    this.triggerEl.addEventListener("click", this._onClick.bind(this));
  }

  _onClick(event) {
    // assume each button is an LI with data-reaction
    const btn = event.target.closest("[data-reaction]");
    if (!btn) return;

    const reactionType = btn.dataset.reaction;
    this._emitReaction(reactionType);

    if (this.closeParent) {
      const closeParentEl = document.querySelector(this.closeParent);
      if (closeParentEl) {
        closeParentEl.style.display = "none";
      }
    }
  }

  _emitReaction(type) {
    const id = Math.random().toString(36).slice(2);
    const markup = this._template(type, id);
    this.streamEl.insertAdjacentHTML("beforeend", markup);

    setTimeout(() => {
      const el = this.streamEl.querySelector(`.animating_reaction--${id}`);
      if (el) el.remove();
    }, this.duration);
  }

  _template(reaction, id) {
    return `
      <div class="animating_reaction animating_reaction--${id}">
        <div style="position: relative">
          <div class="description">
            <span>${this.userName}</span> ${this.actionText}
          </div>
          <div class="reaction_type">
            <img src="${this.imageBasePath}/${reaction}.svg" alt="${reaction}" />
            <div>
              <!-- user avatar or other image -->
              <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?w=500&auto=format&fit=crop&q=60" alt="avatar" />
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// set up a “like/love” reactor:
new ReactionAnimator({
  triggerSelector: "#waveReactButtons",
  streamSelector: "#streamShow",
  userName: "Annette Black",
  actionText: "interacted with this post",
  imageBasePath: "../images",
  duration: 4000,
});

// set up a “boost” reactor separately:
new ReactionAnimator({
  triggerSelector: "#smileReactButtons",
  streamSelector: "#streamShow",
  userName: "Jane Doe",
  actionText: "boosted the broadcast",
  imageBasePath: "../images",
  duration: 6000,
});

// set up a “boost” reactor separately:
new ReactionAnimator({
  triggerSelector: "#heartReactButtons",
  streamSelector: "#streamShow",
  userName: "Jane Doe",
  actionText: "boosted the broadcast",
  imageBasePath: "../images",
  duration: 6000,
});

// set up a “boost” reactor separately:
new ReactionAnimator({
  triggerSelector: "#fireReactButtons",
  streamSelector: "#streamShow",
  userName: "Jane Doe",
  actionText: "boosted the broadcast",
  imageBasePath: "../images",
  duration: 6000,
});

// // set up a coin reactor separately:
// new ReactionAnimator({
//   triggerSelector: "#sendCoin",
//   streamSelector: "#streamShow",
//   userName: "Rafeal Richi",
//   actionText: "sent coins to the broadcast",
//   imageBasePath: "./images",
//   closeParent: "#sendCoinModal",
//   duration: 6000,
// });
