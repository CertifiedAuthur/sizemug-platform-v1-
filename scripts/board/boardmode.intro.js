/**
 * @class BoardTour
 * @description Encapsulates the whiteboard onboarding tour, including step building, modal handling, and localStorage logic.
 */

// 1. Define your steps: selector + title + description + optional position + optional image
const tourRawSteps = [
  {
    selector: ".open_new_board--intro",
    title: "Collapse Button",
    description: "Shrinks/Expands the toolbar to give you more space to work on your whiteboard. Great for when you need to focus!",
  },
  {
    selector: ".board_rename--intro",
    title: "Board Rename",
    description: "Lets you rename your whiteboard file to keep things neat and easy to find.",
  },
  {
    selector: ".notificaions--intro",
    title: "Notification Center",
    description: "Your go‑to spot for all alerts and updates about what's happening on your whiteboard.",
  },
  {
    selector: ".settings--intro",
    title: "Settings",
    description: "Customize your whiteboard experience with various settings and preferences to make it just right for you.",
  },
  {
    selector: ".comments--intro",
    title: "Comments",
    description: "Pin threaded feedback directly to any element, so teams can discuss, resolve, and track changes in context without losing the conversation.",
  },
  {
    selector: ".reactions--intro",
    title: "Reactions",
    description: "Quickly add fun reactions like emojis or thumbs up to show your thoughts on whiteboard items.",
  },
  {
    selector: ".user--intro",
    title: "Active Users",
    description: "See who's online and working with you on the whiteboard in real‑time.",
  },
  {
    selector: ".share_board--intro",
    title: "Share Board",
    description: "Easily share your whiteboard with others via a link or email for seamless collaboration.",
  },
  {
    selector: ".pointer--intro",
    title: "Pointer",
    description: "Use the Pointer to select and interact with items on your whiteboard easily.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/pointer_intro.png",
  },
  {
    selector: ".hand--intro",
    title: "Hand Tool",
    description: "Move around your whiteboard by clicking and dragging, just like moving a piece of paper.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/hand_intro.png",
  },
  {
    selector: ".pen--intro",
    title: "Pen",
    description: "Draw freehand with the Pen tool, perfect for jotting down notes or sketching ideas.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/pen_intro.png",
  },
  {
    selector: ".text--intro",
    title: "Text Editor",
    description: "Add and format text anywhere on your whiteboard with the Text Editor. Great for titles, labels, or detailed notes.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/text_intro.png",
  },
  {
    selector: ".note--intro",
    title: "Sticky Notes",
    description: "Quickly capture ideas, reminders, or feedback on the canvas with colorful, movable notes that feel just like real‑world stickies.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/note_intro.png",
  },
  {
    selector: ".shape--intro",
    title: "Shapes",
    description: "Add basic shapes—rectangles, circles, arrows, and more—to structure your diagrams, highlight key areas, or frame content with ease.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/shape_intro.png",
  },
  {
    selector: ".arrow--intro",
    title: "Connectors",
    description: "Draw smart lines and arrows that snap to shapes and automatically reroute when you move objects, ideal for mapping workflows and relationships.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/arrow_intro.png",
  },
  {
    selector: ".comment-toolbar--intro",
    title: "Comments",
    description: "Pin threaded feedback directly to any element, so teams can discuss, resolve, and track changes in context without losing the conversation.",
    position: "top",
    imageUrl: "/src/assets/images/whiteboard/comment_intro.png",
  },
  {
    selector: ".undo--intro",
    title: "Undo",
    description: "Effortlessly step backward through your edits to explore ideas and recover from mistakes—no stress, just smooth iteration.",
    position: "top",
  },
  {
    selector: ".redo--intro",
    title: "Redo",
    description: "Effortlessly step forward through your edits to explore ideas and recover from mistakes—no stress, just smooth iteration.",
    position: "top",
  },
];

function selectorExists(selector) {
  return !!document.querySelector(selector);
}

class BoardTour {
  /**
   * @param {Array} tourRawSteps - Array of raw step objects (selector, title, description, etc.).
   * @param {Object} [options] - Additional introJs options.
   * @param {string} [lsKey] - LocalStorage key for tracking if the tour was shown.
   */
  constructor(tourRawSteps, options = {}) {
    this.tourRawSteps = tourRawSteps;
    this.options = options;
    this.total = tourRawSteps.length;
    this.steps = this.buildSteps();
    this.instance = introJs();
    this.instance.setOptions({
      steps: this.steps,
      ...this.options,
    });
    this.welcomeModal = document.getElementById("firstTimeModal");
    this.continueBtns = document.querySelectorAll(".continue-whiteboard");

    this.buttonEvents();
  }

  /**
   * Builds the steps array for introJs, including custom HTML and dots.
   * @returns {Array}
   */
  buildSteps() {
    const buildDots = (activeIndex) =>
      Array.from({ length: this.total })
        .map((_, i) => `<span class="dot${i === activeIndex ? " active" : ""}"></span>`)
        .join("");

    return this.tourRawSteps.map((step, idx) => {
      const element = selectorExists(step.selector) ? step.selector : "body";
      return {
        element,
        intro: `
          <div id="custom_intro_holder">
            ${step.imageUrl ? `<img src="${step.imageUrl}" alt="${step.title} Icon" />` : ""}
            <h1>${step.title}</h1>
            <p>${step.description}</p>
            <div class="footer_row">
              <div class="dots">${buildDots(idx)}</div>
              <div class="controls">
                ${idx === 0 ? '<button id="dismiss">Dismiss</button>' : '<button id="back">Back</button>'}
                <button id="next">${idx === this.total - 1 ? "Finish" : "Next"}</button>
              </div>
            </div>
          </div>
        `,
        position: step.position || "bottom",
      };
    });
  }

  /**
   * Initializes the tour: handles welcome modal, localStorage, and event listeners.
   * Call this after DOM is ready.
   */
  init() {
    if (!this.welcomeModal || !this.continueBtns.length) return;
    const ls = getLocalStorage(FIRST_TIME_LS_NAME) ?? "";

    if (ls) {
      return this.welcomeModal.classList.add(HIDDEN);
    } else {
      new VideoPlayer("#firstTimeVideoModal", {
        controls: ["play", "progress", "fullscreen", "current-time"],
      });

      this.welcomeModal.classList.remove(HIDDEN);
    }

    this.continueBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        setLocalStorage(FIRST_TIME_LS_NAME, "true");
        this.welcomeModal.classList.add(HIDDEN);
        this.start();
      });
    });
  }

  buttonEvents() {
    // delegate all clicks on our custom intro container
    document.addEventListener("click", (e) => {
      // make sure we’re inside the current step’s wrapper
      const holder = document.querySelector("#custom_intro_holder");
      if (!holder || !holder.contains(e.target)) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.target.closest("#next")) this.nextStep();
      if (e.target.closest("#back")) this.previousStep();
      if (e.target.closest("#dismiss")) this.exit();
    });
  }

  /**
   * Starts the tour.
   */
  start() {
    this.instance.start();
  }

  /**
   * Exits the tour.
   */
  exit() {
    this.instance.exit();
  }

  /**
   * Moves to the next step.
   */
  nextStep() {
    this.instance.nextStep();
  }

  /**
   * Moves to the previous step.
   */
  previousStep() {
    this.instance.previousStep();
  }

  /**
   * Registers an event handler for introJs events.
   * @param {string} event
   * @param {Function} handler
   */
  on(event, handler) {
    this.instance.on(event, handler);
  }

  /**
   * Static helper to check if the tour should be shown (based on localStorage).
   * @param {string} [lsKey]
   * @returns {boolean}
   */
  static shouldShowTour(lsKey = "sizemug_boardmode") {
    return !JSON.parse(localStorage.getItem(lsKey) ?? "false");
  }
}

window.BoardTour = BoardTour;
