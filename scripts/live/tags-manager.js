/*
  SGTagManager: A reusable, framework-agnostic tag manager
  Usage: new SGTagManager(containerSelectorOrElement, options)
  Options:
    - inputSelector: selector for input inside container (default: '.sg-tag-input')
    - tagClass: CSS class for tag elements (default: 'sg-tag')
    - removeClass: CSS class for remove button (default: 'remove-sg-tag')
    - maxTags: maximum number of tags (default: Infinity)
    - lowercase: boolean, convert tags to lower case (default: true)
    - onChange: callback(tagsArray) fired after add/remove
*/
class SGTagManager {
  constructor(root, options = {}) {
    this.root = typeof root === "string" ? document.querySelector(root) : root;
    if (!this.root) throw new Error("SGTagManager: root element not found");

    // merge defaults
    const defaults = {
      inputSelector: ".sg-tag-input",
      tagClass: "sg-tag",
      removeClass: "remove-sg-tag",
      maxTags: Infinity,
      lowercase: true,
      onChange: null,
    };
    this.opts = { ...defaults, ...options };

    this.input = this.root.querySelector(this.opts.inputSelector);
    if (!this.input) throw new Error("SGTagManager: input element not found");

    this.tags = [];
    this._bindEvents();
  }

  _bindEvents() {
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        this.add(this.input.value);
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.root.contains(e.target)) this.input.blur();
    });
  }

  add(raw) {
    let tag = String(raw).trim();
    if (!tag) return;
    if (this.opts.lowercase) tag = tag.toLowerCase();

    if (this.tags.includes(tag)) {
      this._signal(`Tag \"${tag}\" exists`);
      this.input.value = "";
      return;
    }

    if (this.tags.length >= this.opts.maxTags) {
      this._signal(`Max of ${this.opts.maxTags} tags reached`);
      this.input.value = "";
      return;
    }

    this.tags.push(tag);
    this.input.value = "";
    this._render();
    this._emitChange();
  }

  remove(tag) {
    const idx = this.tags.indexOf(tag);
    if (idx === -1) return;
    this.tags.splice(idx, 1);
    this._render();
    this._emitChange();
  }

  _render() {
    // clear existing tags
    this.root.querySelectorAll(`.${this.opts.tagClass}`).forEach((el) => el.remove());

    // insert new tags before the input
    this.tags.forEach((tag) => {
      const el = document.createElement("div");
      el.className = this.opts.tagClass;
      el.textContent = tag;

      const btn = document.createElement("span");
      btn.className = this.opts.removeClass;
      btn.innerHTML = "&#10005;";
      btn.addEventListener("click", () => this.remove(tag));

      el.appendChild(btn);
      this.input.insertAdjacentElement("beforebegin", el);
    });
  }

  _emitChange() {
    const event = new CustomEvent("tagsChange", { detail: [...this.tags], bubbles: true });
    this.root.dispatchEvent(event);
    if (typeof this.opts.onChange === "function") {
      this.opts.onChange([...this.tags]);
    }
  }

  getTags() {
    return [...this.tags];
  }

  setTags(newTags) {
    this.tags = Array.isArray(newTags) ? newTags.map((t) => (this.opts.lowercase ? t.toLowerCase() : t)) : [];
    if (this.tags.length > this.opts.maxTags) this.tags.length = this.opts.maxTags;
    this._render();
    this._emitChange();
  }

  clear() {
    this.tags = [];
    this._render();
    this._emitChange();
  }
}

// Auto-initialize any containers with data-sg-tag-manager attribute
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-sg-tag-manager]").forEach((el) => {
    const inputSel = el.dataset.inputSelector || ".sg-tag-input";
    const max = parseInt(el.dataset.maxTags, 10) || Infinity;
    new SGTagManager(el, { inputSelector: inputSel, maxTags: max });
  });
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SGTagManager;
}
