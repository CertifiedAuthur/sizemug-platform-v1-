class BaseBoardRenderer {
  constructor() {
    this.allScroll1 = document.querySelector(".all_scrolling--1");
    this.allScroll2 = document.querySelector(".all_scrolling--2");
  }

  /**
   * Renders boards data into a container
   * @param {Array} data - Array of board objects
   * @param {HTMLElement} container - Container element to render into
   * @param {string} type - Type of rendering ('recent' or 'all')
   */
  renderBoards(data, container, type = "all") {
    if (!container) return;

    container.innerHTML = ""; // clear the container

    data.forEach((board) => {
      const markup = this.#generateBoardMarkup(board, type);
      container.insertAdjacentHTML("afterbegin", markup);
    });

    // Call after render hook
    this.afterRender(container, data);
  }

  /**
   * Hook method that can be overridden by child classes
   * Called before rendering each board
   * @param {Object} board - Board object
   * @param {string} type - Type of rendering
   * @returns {Object} Modified board object
   */
  beforeRender(board, type) {
    // Default implementation - can be overridden
    return board;
  }

  /**
   * Hook method that can be overridden by child classes
   * Called after rendering all boards
   * @param {HTMLElement} container - Container element
   * @param {Array} data - Array of board objects
   */
  afterRender(container, data) {
    // Default implementation - can be overridden
  }

  /**
   * Generates HTML markup for a board item
   * @param {Object} board - Board object
   * @param {string} type - Type of rendering ('recent' or 'all')
   * @returns {string} HTML markup
   */
  #generateBoardMarkup(board, type) {
    // Apply any pre-rendering modifications
    const modifiedBoard = this.beforeRender(board, type);

    if (type === "recent") {
      return this.#generateRecentBoardMarkup(modifiedBoard);
    } else {
      return this.#generateAllBoardMarkup(modifiedBoard);
    }
  }

  /**
   * Generates markup for recent board items
   * @param {Object} board - Board object
   * @returns {string} HTML markup
   */
  #generateRecentBoardMarkup(board) {
    const remainingImageLengths = board.collaborators.slice(3).length;

    return `
      <div class="recent_item board_page_recent_item">
        <div class="recent_item_thumbnail"></div>
        <div class="details">
          <div>
            <h3>${board.title}</h3>
            <div class="who_minutes">
              <span>${board.user}</span>
              <span>&bull;</span>
              <span>${board.minutes} min ago</span>
            </div>
          </div>
          <div class="collaborating_with">
            <div>
              ${board.collaborators
                .map((collab, i) => {
                  if (i === 3) return;
                  return `<img src="${collab}" alt="Collab" style="border: 2px solid ${getRandomColor()}" />`;
                })
                .join("")}
              <span class="${board.collaborators.length > 3 ? "" : "board--hidden"}">+${remainingImageLengths}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generates markup for all board items
   * @param {Object} board - Board object
   * @returns {string} HTML markup
   */
  #generateAllBoardMarkup(board) {
    const remainingImageLengths = board?.collaborators?.slice(1).length;

    return `
      <div class="board_item board_page_recent_item">
        <div class="board_item_thumbnail"></div>
        
        <div class="details">
          <div>
            <h3>${board.title}</h3>
          
            <div class="who_minutes">
              <span>${board.user}</span>
              <span>&bull;</span>
              <span>${board.minutes} min ago</span>
            </div>
          </div>
          ${
            board.status === "public" && board.collaborators
              ? ` <div class="collaborating_with">
                    <div>
                      ${board.collaborators
                        .map((collab, i) => {
                          if (i >= 1) return;
                          return `
                          <img src="${collab}" alt="Collab" style="border: 2px solid ${getRandomColor()}"/>
                        `;
                        })
                        .join("")}
                      <span class="${board.collaborators.length > 1 ? "" : "board--hidden"}">+${remainingImageLengths && remainingImageLengths}</span>
                    </div>
                </div>`
              : ""
          }
        </div>
      </div>
    `;
  }
}

window.BaseBoardRenderer = BaseBoardRenderer;
