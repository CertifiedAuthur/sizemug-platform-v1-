class BoardsContainer extends BaseBoardRenderer {
  constructor(hideAllDropdowns) {
    super();
    this.hideAllDropdowns = hideAllDropdowns;
    this.openBoardLists = document.getElementById("openBoardLists");
    this.openBoardSVG = this.openBoardLists.querySelector("svg");
    this.boardListsContainer = document.getElementById("boardListsContainer");
    this.sharedContainerWrapper = document.getElementById("sharedContainerWrapper");
    this.boardListHide = document.getElementById("boardListHide");
    this.boardRecent = innerWidth < 850 ? document.querySelector(".board_recent_scrolling--mobile") : document.querySelector(".board_recent_scrolling");
    this.allScrollMobile2 = document.querySelector(".all_scrolling_mobile--2");

    // Initialize switch button functionality
    this.switchButton = new SwitchButton();

    this.#bindEvents();
    this.#renderBoardRecent(this.boardRecent);
    this.#renderBoardRecent(this.sharedContainerWrapper);

    // Initialize with private boards
    const data = boardsData.filter((data) => data.status === "private");
    this.renderBoards(data, window.innerWidth < 850 ? this.allScroll1 : this.allScroll1);
    this.renderBoards(data, window.innerWidth < 850 ? this.allScrollMobile2 : this.allScroll2);
  }

  #bindEvents() {
    // Toggle Container :)
    this.openBoardLists.addEventListener("click", () => {
      const isExpanded = this.openBoardLists.ariaExpanded === "true";

      if (isExpanded) {
        this.openBoardSVG.classList.remove("active");
        this.boardListsContainer.classList.add(HIDDEN);
        this.openBoardLists.setAttribute("aria-expanded", false);
      } else {
        this.hideAllDropdowns?.();
        this.openBoardSVG.classList.add("active");
        this.boardListsContainer.classList.remove(HIDDEN);
        this.openBoardLists.setAttribute("aria-expanded", true);
      }
    });

    //
    this.boardListHide.addEventListener("click", () => {
      this.hide();
    });

    // Listen for clicks outside the board list container
    document.addEventListener("click", (e) => {
      e.stopPropagation();

      // Check if the board list container is currently open
      const isOpen = this.boardListsContainer && !this.boardListsContainer.classList.contains(HIDDEN);

      if (isOpen) {
        // Check if the click is outside both the container and the open button
        const isClickOutsideContainer = !this.boardListsContainer.contains(e.target);
        const isClickOnOpenButton = this.openBoardLists.contains(e.target);

        if (isClickOutsideContainer && !isClickOnOpenButton) {
          this.hide();
        }
      }
    });
  }

  // Board Recents - This is specific to BoardsContainer
  #renderBoardRecent(container) {
    container.innerHTML = "";

    boardRecents.forEach((recent) => {
      const remainingImageLengths = recent.collaborators.slice(3).length;

      const markup = `
      <div class="recent_item board_page_recent_item">
            <div class="recent_item_thumbnail"></div>
            <div class="details">
              <div>
                <h3>${recent.title}</h3>
                <div class="who_minutes">
                  <span>${recent.user}</span>
                  <span>&bull;</span>
                  <span>${recent.minutes} min ago</span>
                </div>
              </div>
              <div class="collaborating_with">
               <div>
                  ${recent.collaborators
                    .map((collab, i) => {
                      if (i === 3) return;
                      return `<img src="${collab}" alt="Collab" style="border: 2px solid ${getRandomColorValue()}" />`;
                    })
                    .join("")}
                  <span class="${recent.collaborators.length > 3 ? "" : "board--hidden"}">+${remainingImageLengths}</span>
                </div>
              </div>
            </div>
        </div>
    `;

      container.insertAdjacentHTML("afterbegin", markup);
    });
  }

  // Hide Board List Hide :)
  hide() {
    this.openBoardSVG.classList.remove("active");
    this.openBoardLists.setAttribute("aria-expanded", false);
    this.boardListsContainer.classList.add(HIDDEN);
  }
}

window.BoardsContainer = BoardsContainer;
