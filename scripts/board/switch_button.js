class SwitchButton extends BaseBoardRenderer {
  constructor() {
    super();
    this.switchContainer = document.querySelectorAll(".switch_buttons_wrapper");
    this.allScrollMobile1 = document.querySelector(".all_scrolling_mobile--1");
    this.allScrollMobile2 = document.querySelector(".all_scrolling_mobile--2");

    this.#bindEvents();
  }

  #bindEvents() {
    this.switchContainer.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.#handleSwitchClick(e, btn);
      });
    });
  }

  #handleSwitchClick(e, btn) {
    const target = e.target;
    const targetBtn = target.closest("button");
    const btns = btn.querySelectorAll("button");
    const btnSlider = btn.querySelector(".switch_sliding--slider");

    if (targetBtn) {
      btns.forEach((btn) => btn.classList.remove("clicked"));
      targetBtn.classList.add("clicked");

      if (targetBtn.classList.contains("private")) {
        btnSlider.style.transform = "translateX(0%)";
        const data = boardsData.filter((data) => data.status === "private");
        this.renderBoards(data, window.innerWidth < 850 ? this.allScroll1 : this.allScroll1); /** allScroll1 from parent class */
        this.renderBoards(data, window.innerWidth < 850 ? this.allScrollMobile2 : this.allScroll2); /** allScroll2 from parent class */
      } else {
        btnSlider.style.transform = "translateX(100%)";
        const data = boardsData.filter((data) => data.status === "public");
        this.renderBoards(data, window.innerWidth < 850 ? this.allScroll1 : this.allScroll1); /** allScroll1 from parent class */
        this.renderBoards(data, window.innerWidth < 850 ? this.allScrollMobile2 : this.allScroll2); /** allScroll2 from parent class */
      }
    }
  }
}

window.SwitchButton = SwitchButton;
