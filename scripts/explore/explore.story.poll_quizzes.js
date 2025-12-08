class AddStoryPollQuizzes {
  constructor() {
    // core controls (some may be optional in your markup)
    this.pollQuizToggle = document.getElementById("pollQuizToggle");
    this.pollCreationContainer = document.getElementById("pollCreationContainer");
    this.quizCreationContainer = document.getElementById("quizCreationContainer");

    this.pollQuestionInput = document.getElementById("pollQuestionInput");
    this.pollOptionOne = document.getElementById("pollOptionOne");
    this.pollOptionTwo = document.getElementById("pollOptionTwo");

    this.quizQuestionInput = document.getElementById("quizQuestionInput");

    this.pollCreateContainer = document.getElementById("pollCreateContainer");
    this.quizCreateContainer = document.getElementById("quizCreateContainer");
    this.pollFillCheckbox = document.getElementById("pollFillCheckbox");
    this.quizFillCheckbox = document.getElementById("quizFillCheckbox");

    this.pollColorButtons = document.querySelectorAll("#pollColorPickerList button");
    this.quizColorButtons = document.querySelectorAll("#quizColorPickerList button");

    this.pollAddMoreOption = document.getElementById("pollAddMoreOption");
    this.pollOptionsContainer = document.getElementById("pollOptionsContainer");

    // NEW: quiz option controls (optional — create these in your UI if you want)
    this.quizAddMoreOption = document.getElementById("quizAddMoreOption");
    this.quizOptionsContainer = document.getElementById("quizOptionsContainer");

    this.pollColorPickerBtn = document.getElementById("pollColorPickerBtn");
    this.pollColorPicker = document.getElementById("pollColorPicker");
    this.quizColorPickerBtn = document.getElementById("quizColorPickerBtn");
    this.quizColorPicker = document.getElementById("quizColorPicker");

    // internal flags to avoid double-binding
    this._pollDelegated = false;
    this._quizDelegated = false;

    this._init();
  }

  _init() {
    this._bindEvents();

    // Delegated handlers (will do nothing if containers are missing)
    this._invalidatePollInputEvent();
    this._invalidateQuizInputEvent();
  }

  // Returns the elements in the currently active canvas/editor (safe if not present)
  _getActiveEditorElements() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia?.id}"]`);
    if (!canvasEditorContainer) return { pollElement: null, quizElement: null, canvasEditorContainer: null };
    const pollElement = canvasEditorContainer.querySelector(".story_poll_container");
    const quizElement = canvasEditorContainer.querySelector(".story_quiz_container");
    return { pollElement, quizElement, canvasEditorContainer };
  }

  // Delegated input handler for poll option inputs
  _invalidatePollInputEvent() {
    if (!this.pollOptionsContainer || this._pollDelegated) return;
    this._pollDelegated = true;

    this.pollOptionsContainer.addEventListener("input", (e) => {
      const input = e.target.closest("input");
      if (!input) return;

      const raw = input.value ?? "";
      const value = raw.trim();
      const id = input.dataset.id ?? input.getAttribute("data-id");
      if (!id) return;

      let { pollElement, canvasEditorContainer } = this._getActiveEditorElements();
      // If no canvas editor container, abort
      if (!canvasEditorContainer) return;

      // Create poll element in canvas if missing and there is content to show
      if (!pollElement && value) {
        const markup = this._generatePollMarkup();
        canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
        pollElement = canvasEditorContainer.querySelector(".story_poll_container");
        new Interactive()._makeInteractive(pollElement);
      }

      // If input cleared and poll exists maybe remove the option and (optionally) remove poll when empty
      if (!value) {
        if (pollElement) {
          const optionEl = pollElement.querySelector(`[data-id="${id}"]`);
          if (optionEl) optionEl.remove();

          // if poll has no more .poll_options children, remove the poll entirely
          const opts = pollElement.querySelectorAll(".poll_options li");
          if (!opts || opts.length === 0) {
            pollElement.remove();
          }
        }
        return;
      }

      // Ensure pollElement exists (we created above if needed)
      if (!pollElement) return;

      // Find existing option by data-id
      let optionEl = pollElement.querySelector(`[data-id="${id}"]`);

      // Update or create
      if (optionEl) {
        optionEl.textContent = value;
        optionEl.setAttribute("data-content", value);
      } else {
        const li = document.createElement("li");
        li.classList.add(`option--${id}`);
        li.textContent = value;
        li.setAttribute("data-content", value);
        li.setAttribute("data-id", id);
        const container = pollElement.querySelector(".poll_options");
        if (container) container.appendChild(li);
      }
    });
  }

  // Delegated input handler for quiz option inputs
  _invalidateQuizInputEvent() {
    if (!this.quizOptionsContainer || this._quizDelegated) return;
    this._quizDelegated = true;

    this.quizOptionsContainer.addEventListener("input", (e) => {
      const input = e.target.closest("input");
      if (!input) return;

      const raw = input.value ?? "";
      const value = raw.trim();
      const id = input.dataset.id ?? input.getAttribute("data-id");
      if (!id) return;

      let { quizElement, canvasEditorContainer } = this._getActiveEditorElements();
      if (!canvasEditorContainer) return;

      // Create quiz element in canvas if needed and value present
      if (!quizElement && value) {
        const markup = this._generateQuizMarkup();
        canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
        quizElement = canvasEditorContainer.querySelector(".story_quiz_container");
        new Interactive()._makeInteractive(quizElement);

        // attach click handler to quiz list for marking correct answer
        this._attachQuizCanvasClickHandler(quizElement);
      }

      // if value removed -> remove corresponding li; possibly remove entire quiz if no options left
      if (!value) {
        if (quizElement) {
          const optionEl = quizElement.querySelector(`[data-id="${id}"]`);
          if (optionEl) optionEl.remove();

          const opts = quizElement.querySelectorAll(".quiz_options li");
          if (!opts || opts.length === 0) {
            quizElement.remove();
          }
        }
        return;
      }

      if (!quizElement) return;

      // Find existing option by data-id
      let optionEl = quizElement.querySelector(`[data-id="${id}"]`);

      // Update existing option
      if (optionEl) {
        optionEl.textContent = value;
        optionEl.setAttribute("data-content", value);
      } else {
        // Create new li with data-id and role button
        const li = document.createElement("li");
        li.setAttribute("role", "button");
        li.setAttribute("data-id", id);
        li.textContent = value;
        li.setAttribute("data-content", value);
        li.classList.add(`quiz-option--${id}`);

        // append a small marker element used to indicate correct answer visually
        const correctBadge = document.createElement("span");
        correctBadge.className = "quiz-correct-badge";
        correctBadge.textContent = ""; // you'll style this via CSS (e.g., show a checkmark background)
        li.appendChild(correctBadge);

        const container = quizElement.querySelector(".quiz_options");
        if (container) container.appendChild(li);
      }
    });
  }

  // attach click handler to quiz canvas element for marking correct answer
  _attachQuizCanvasClickHandler(quizElement) {
    if (!quizElement) return;
    // avoid multiple attachments
    if (quizElement._quizClickAttached) return;
    quizElement._quizClickAttached = true;

    quizElement.addEventListener("click", (e) => {
      const li = e.target.closest("li[role='button'], li[data-id]");
      if (!li) return;

      // Toggle 'correct' state
      const isCorrect = li.classList.toggle("correct"); // CSS can color .correct
      // keep a single-correct-answer behavior: remove .correct from siblings if toggled on
      if (isCorrect) {
        const siblings = Array.from(quizElement.querySelectorAll(".quiz_options li")).filter((n) => n !== li);
        siblings.forEach((s) => s.classList.remove("correct"));
      }

      // sync state back to the input in quizOptionsContainer if present
      const dataId = li.getAttribute("data-id");
      if (!dataId || !this.quizOptionsContainer) return;

      const input = this.quizOptionsContainer.querySelector(`input[data-id="${dataId}"]`);
      if (input) {
        if (isCorrect) {
          input.setAttribute("data-correct", "true");
          input.dataset.correct = "true";
        } else {
          input.removeAttribute("data-correct");
          delete input.dataset.correct;
        }
      }
    });
  }

  _bindEvents() {
    // Poll & Quiz Tab toggle
    if (this.pollQuizToggle) {
      this.pollQuizToggle.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        const { type } = button.dataset;
        this.pollQuizToggle.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        if (type === "poll") {
          if (this.quizCreationContainer) this.quizCreationContainer.classList.add(HIDDEN);
          if (this.pollCreationContainer) this.pollCreationContainer.classList.remove(HIDDEN);
        } else {
          if (this.pollCreationContainer) this.pollCreationContainer.classList.add(HIDDEN);
          if (this.quizCreationContainer) this.quizCreationContainer.classList.remove(HIDDEN);
        }
      });
    }

    // Poll question input -> create/update poll title; if cleared, remove poll
    if (this.pollQuestionInput) {
      this.pollQuestionInput.addEventListener("input", (e) => {
        const value = e.target.value?.trim() ?? "";
        let { pollElement, canvasEditorContainer } = this._getActiveEditorElements();
        if (!canvasEditorContainer) return;

        if (!pollElement && value) {
          const markup = this._generatePollMarkup();
          canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
          pollElement = canvasEditorContainer.querySelector(".story_poll_container");
          new Interactive()._makeInteractive(pollElement);
        }

        if (pollElement) {
          if (value) {
            const h2 = pollElement.querySelector("h2");
            if (h2) h2.textContent = value;
          } else {
            pollElement.remove();
          }
        }
      });
    }

    // Quiz question input
    if (this.quizQuestionInput) {
      this.quizQuestionInput.addEventListener("input", (e) => {
        const value = e.target.value?.trim() ?? "";
        let { quizElement, canvasEditorContainer } = this._getActiveEditorElements();
        if (!canvasEditorContainer) return;

        if (!quizElement && value) {
          const markup = this._generateQuizMarkup();
          canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
          quizElement = canvasEditorContainer.querySelector(".story_quiz_container");
          new Interactive()._makeInteractive(quizElement);
          this._attachQuizCanvasClickHandler(quizElement);
        }

        if (quizElement) {
          if (value) {
            const h2 = quizElement.querySelector("h2");
            if (h2) h2.textContent = value;
          } else {
            quizElement.remove();
          }
        }
      });
    }

    // Poll color picker
    if (this.pollColorButtons && this.pollColorButtons.length) {
      this.pollColorButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.pollColorButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const { pollElement } = this._getActiveEditorElements();
          const color = btn.dataset.color;
          if (pollElement && color) pollElement.style.background = color;
        });
      });
    }

    // Quiz color picker
    if (this.quizColorButtons && this.quizColorButtons.length) {
      this.quizColorButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.quizColorButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const { quizElement } = this._getActiveEditorElements();
          const color = btn.dataset.color;
          if (quizElement && color) quizElement.style.background = color;
        });
      });
    }

    // Poll fill checkbox
    if (this.pollFillCheckbox) {
      this.pollFillCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        let { pollElement, canvasEditorContainer } = this._getActiveEditorElements();
        if (!canvasEditorContainer) return;
        if (!pollElement) {
          const markup = this._generatePollMarkup();
          canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
          pollElement = canvasEditorContainer.querySelector(".story_poll_container");
          new Interactive()._makeInteractive(pollElement);
        }
        if (!pollElement) return;
        if (e.target.checked) pollElement.classList.remove("fill-none");
        else pollElement.classList.add("fill-none");
      });
    }

    // Quiz fill checkbox
    if (this.quizFillCheckbox) {
      this.quizFillCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        let { quizElement, canvasEditorContainer } = this._getActiveEditorElements();
        if (!canvasEditorContainer) return;
        if (!quizElement) {
          const markup = this._generateQuizMarkup();
          canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
          quizElement = canvasEditorContainer.querySelector(".story_quiz_container");
          new Interactive()._makeInteractive(quizElement);
        }
        if (!quizElement) return;
        if (e.target.checked) quizElement.classList.remove("fill-none");
        else quizElement.classList.add("fill-none");
      });
    }

    // Poll add more option
    if (this.pollAddMoreOption && this.pollOptionsContainer) {
      this.pollAddMoreOption.addEventListener("click", () => {
        const el = this._createOptionInput(this.pollOptionsContainer, "poll");
        this.pollOptionsContainer.appendChild(el);
        // no need to rebind: delegation already handles new inputs
      });
    }

    // Quiz add more option
    if (this.quizAddMoreOption && this.quizOptionsContainer) {
      this.quizAddMoreOption.addEventListener("click", () => {
        const el = this._createOptionInput(this.quizOptionsContainer, "quiz");
        this.quizOptionsContainer.appendChild(el);
        // delegation handles new inputs
      });
    }

    // Color Picker
    if (this.quizColorPickerBtn && this.pollColorPickerBtn && this.quizColorPicker && this.quizColorPickerBtn) {
      this.quizColorPickerBtn.addEventListener("click", () => {
        this.quizColorPicker.click();
      });

      this.pollColorPickerBtn.addEventListener("click", () => {
        this.pollColorPicker.click();
      });

      this.quizColorPicker.addEventListener("change", (e) => {
        const customColor = e.target.value;
        const { quizElement } = this._getActiveEditorElements();
        if (quizElement && customColor) quizElement.style.background = customColor;
      });

      this.pollColorPicker.addEventListener("change", (e) => {
        const customColor = e.target.value;
        const { pollElement } = this._getActiveEditorElements();
        if (pollElement && customColor) pollElement.style.background = customColor;
      });
    }
  }

  // create an input node for poll/quiz options
  _createOptionInput(parent, type = "poll") {
    const el = document.createElement("input");
    el.type = "text";
    const count = parent.querySelectorAll("input").length + 1;
    el.id = `${type}Option--${count}`;
    el.placeholder = `Option ${count}`;
    el.classList.add(`${type}-option`);
    el.setAttribute("data-id", String(count));
    // For quiz options we might want to mark correct via a checkbox in UI (optional)
    if (type === "quiz") {
      // add a small wrapper so we can show a "correct" toggle in the UI if desired
      const wrapper = document.createElement("div");
      wrapper.className = "quiz-input-row";
      const correctToggle = document.createElement("button");
      correctToggle.type = "button";
      correctToggle.className = "quiz-mark-correct";
      correctToggle.title = "Mark as correct";
      correctToggle.innerText = "✓";
      // clicking button toggles data-correct attribute and syncs to canvas if present
      correctToggle.addEventListener("click", (e) => {
        e.preventDefault();
        const is = wrapper.querySelector("input").dataset.correct === "true";
        if (is) {
          wrapper.querySelector("input").removeAttribute("data-correct");
          delete wrapper.querySelector("input").dataset.correct;
        } else {
          wrapper.querySelector("input").dataset.correct = "true";
        }
        // sync to canvas element if exists
        const id = wrapper.querySelector("input").dataset.id;
        const { quizElement } = this._getActiveEditorElements();
        if (!id || !quizElement) return;
        // mark correct state on canvas list items
        const lis = quizElement.querySelectorAll(".quiz_options li");
        lis.forEach((li) => {
          if (li.getAttribute("data-id") === id) li.classList.toggle("correct", !is);
          else if (!is) li.classList.remove("correct"); // if we just set one to true, clear others
        });
      });

      wrapper.appendChild(el);
      wrapper.appendChild(correctToggle);
      return wrapper;
    }

    return el;
  }

  // Default poll markup (ensure data-id attributes present)
  _generatePollMarkup() {
    return `
      <div class="poll_create_container story_poll_container">
        <h2>Poll Question</h2>
        <ul class="poll_options">
          <li class="option--1" data-id="1" data-content="Option One">Option One</li>
        </ul>
      </div>
    `;
  }

  // Default quiz markup (options have data-id and placeholder container .quiz_options)
  _generateQuizMarkup() {
    return `
      <div class="poll_create_container story_quiz_container">
        <h2>Quiz Question</h2>
        <ul class="quiz_options">
          <li role="button" data-id="1" data-content="React">React<span class="quiz-correct-badge"></span></li>
        </ul>
      </div>
    `;
  }
}

// bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.addStoryPollQuizzes = new AddStoryPollQuizzes();
});
