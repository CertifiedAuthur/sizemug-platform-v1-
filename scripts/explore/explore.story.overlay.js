class AddStoryOverlay {
  constructor() {
    this.boardsData = [
      {
        id: "new-board-1",
        title: "New board",
        creator: "You",
        daysAgo: 10,
        type: "private",
      },
      {
        id: "new-board-2",
        title: "New board",
        creator: "You",
        daysAgo: 11,
        type: "private",
      },
      {
        id: "design-review-1",
        title: "Design review",
        creator: "Alex",
        daysAgo: 9,
        type: "public",
      },
      {
        id: "prototype-testing-1",
        title: "Prototype testing",
        creator: "Jamie",
        daysAgo: 5,
        type: "public",
      },
      {
        id: "client-feedback",
        title: "Client feedback",
        creator: "Morgan",
        daysAgo: 3,
        type: "private",
      },
      {
        id: "final-adjustments",
        title: "Final adjustments",
        creator: "Taylor",
        daysAgo: 1,
        type: "recent",
      },
      {
        id: "design-review-2",
        title: "Design review",
        creator: "Jordan",
        daysAgo: 2,
        type: "recent",
      },
      {
        id: "prototype-testing-2",
        title: "Prototype testing",
        creator: "Alex",
        daysAgo: 3,
        type: "recent",
      },
      {
        id: "feedback-implementation",
        title: "Feedback implementation",
        creator: "You",
        daysAgo: 4,
        type: "private",
      },
      {
        id: "launch-preparation",
        title: "Launch preparation",
        creator: "Jamie",
        daysAgo: 6,
        type: "public",
      },
    ];

    this.liveStreamData = [
      {
        id: "1",
        title: "New board",
        creator: "You",
        daysAgo: 10,
        type: "yours",
      },
      {
        id: "2",
        title: "New board",
        creator: "You",
        daysAgo: 11,
        type: "followers",
      },
      {
        id: "3",
        title: "Design review",
        creator: "Alex",
        daysAgo: 9,
        type: "yours",
      },
      {
        id: "4",
        title: "Prototype testing",
        creator: "Jamie",
        daysAgo: 5,
        type: "followers",
      },
      {
        id: "5",
        title: "Client feedback",
        creator: "Morgan",
        daysAgo: 3,
        type: "followers",
      },
      {
        id: "6",
        title: "Final adjustments",
        creator: "Taylor",
        daysAgo: 1,
        type: "yours",
      },
      {
        id: "7",
        title: "Design review",
        creator: "Jordan",
        daysAgo: 2,
        type: "followers",
      },
      {
        id: "8",
        title: "Prototype testing",
        creator: "Alex",
        daysAgo: 3,
        type: "followering",
      },
      {
        id: "9",
        title: "Feedback implementation",
        creator: "You",
        daysAgo: 4,
        type: "yours",
      },
      {
        id: "10",
        title: "Launch preparation",
        creator: "Jamie",
        daysAgo: 6,
        type: "yours",
      },
    ];

    this.tasksToolTarget = document.querySelector('[data-tool-target="tasks"]');
    this.liveStreamToolTarget = document.querySelector('[data-tool-target="live-stream"]');
    this.boardModeToolTarget = document.querySelector('[data-tool-target="board-mode"]');
    this.overlayTargetButton = document.querySelectorAll(".overlay_target_button");

    // Board :)
    this.boardsGrid = document.getElementById("boardsGrid");
    this.liveStreamGrid = document.getElementById("liveStreamGrid");

    this.trackOverlayType = null; // "task" | "board" | "live"
    this.currentFilter = "all";
    this.currentLiveFilter = "yours";

    this._init();
  }

  _init() {
    // board Mode
    this._initializeBoardMode();

    //
    this._taskTabHandler();
  }

  //
  _taskTabHandler() {
    const taskTabItems = document.querySelectorAll(".task_tab_item");

    taskTabItems.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const filter = btn.dataset.filter;

        taskTabItems.forEach((btn) => btn.removeAttribute("aria-selected"));
        btn.setAttribute("aria-selected", "true");

        let filteredTasks;

        if (filter === "all") {
          filteredTasks = taskListApp.currentTaskData;
        } else {
          filteredTasks = taskListApp.currentTaskData.filter((task) => task.status === filter);
        }

        try {
          window.taskListApp.updateTasksExplore(filteredTasks);
          console.log("Method called successfully");
        } catch (error) {
          console.error("Error calling updateTasksExplore:", error);
        }
      });
    });
  }

  /**
   * @param {task | board | live} type
   */
  showStoryOverlay(type) {
    if (!type) {
      console.warn("Type needs to be specified to show the modal 😤 :)");
      return;
    }

    const { shareStoryOverlay, canvasEditorContainer } = this._getActiveEditorElements();

    if (shareStoryOverlay) {
      shareStoryOverlay.remove();
    }

    const markup = this._getOverlayMarkup(type);
    canvasEditorContainer.insertAdjacentHTML("beforeend", markup);
    const el = canvasEditorContainer.querySelector(".share_story_overlay");
    new Interactive()._makeInteractive(el);

    this.trackOverlayType = type;
    this._invalidateOneOverlayButtons();
  }

  //
  hideStoryOverlay() {
    this.trackOverlayType = null;
    this._invalidateOneOverlayButtons(false);
  }

  //   If `disabled` is true, means that one overlay is in used, else no overlay is being used :)
  _invalidateOneOverlayButtons(disabled = true) {
    if (disabled) {
      this.overlayTargetButton.forEach((btn) => btn.setAttribute("disabled", true));

      if (this.trackOverlayType === "task") {
        this.tasksToolTarget.removeAttribute("disabled");
        return;
      }

      if (this.trackOverlayType === "board") {
        this.boardModeToolTarget.removeAttribute("disabled");
        return;
      }

      if (this.trackOverlayType === "live") {
        this.liveStreamToolTarget.removeAttribute("disabled");
      }
    } else {
      this.overlayTargetButton.forEach((btn) => btn.removeAttribute("disabled"));
    }
  }

  /**
   *
   *
   *
   *
   *
   * Board mode Handler 😎 :)
   *
   *
   *
   *
   *
   *
   */
  _initializeBoardMode() {
    // Render initial boards
    this._renderBoards();
    this._renderLiveStream();

    const filterLiveStream = document.getElementById("filterLiveStream");

    filterLiveStream.addEventListener("click", (e) => {
      const filterBtn = e.target.closest("button");

      if (filterBtn) {
        const filter = filterBtn.dataset.filter;

        filterLiveStream.querySelectorAll("button").forEach((btn) => btn.classList.remove("active"));
        filterBtn.classList.add("active");
        this.currentLiveFilter = filter;
        this._renderLiveStream();
      }
    });

    // Select Board
    this.liveStreamGrid.addEventListener("click", (e) => {
      const boardItem = e.target.closest(".board-card");

      if (boardItem) {
        const boardItems = this.liveStreamGrid.querySelectorAll(".board-card");

        if (boardItem.classList.contains("selected")) {
          boardItems.forEach((card) => card.classList.remove("selected"));
          this.hideStoryOverlay();
        } else {
          boardItems.forEach((card) => card.classList.remove("selected"));
          boardItem.classList.add("selected");
          this.showStoryOverlay("live");
        }
      }
    });

    // Select Board
    this.boardsGrid.addEventListener("click", (e) => {
      const boardItem = e.target.closest(".board-card");

      if (boardItem) {
        const boardItems = this.boardsGrid.querySelectorAll(".board-card");

        if (boardItem.classList.contains("selected")) {
          boardItems.forEach((card) => card.classList.remove("selected"));
          this.hideStoryOverlay();
        } else {
          boardItems.forEach((card) => card.classList.remove("selected"));
          boardItem.classList.add("selected");
          this.showStoryOverlay("board");
        }
      }
    });
  }

  _renderLiveStream() {
    this.liveStreamGrid.innerHTML = "";

    const liveStream = this._filterLiveStream();

    liveStream.forEach((board) => {
      const liveStreamCard = this._createBoardCard(board);
      this.liveStreamGrid.appendChild(liveStreamCard);
    });
  }

  _renderBoards() {
    this.boardsGrid.innerHTML = "";

    const filteredBoards = this._filterBoards();

    filteredBoards.forEach((board) => {
      const boardCard = this._createBoardCard(board);
      this.boardsGrid.appendChild(boardCard);
    });
  }

  _createBoardCard(board) {
    const boardCard = document.createElement("div");
    boardCard.className = "board-card";
    boardCard.dataset.board = board.id;
    const id = `${Math.random()}`.split(".").at(-1);

    boardCard.innerHTML = `
          <span class="selected_sign">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48"><defs><mask id="SVGIQLGgV2F--${id}"><g fill="none" stroke-linejoin="round" stroke-width="4"><path fill="#fff" stroke="#fff" d="M24 44a19.94 19.94 0 0 0 14.142-5.858A19.94 19.94 0 0 0 44 24a19.94 19.94 0 0 0-5.858-14.142A19.94 19.94 0 0 0 24 4A19.94 19.94 0 0 0 9.858 9.858A19.94 19.94 0 0 0 4 24a19.94 19.94 0 0 0 5.858 14.142A19.94 19.94 0 0 0 24 44Z"/><path stroke="#000000" stroke-linecap="round" d="m16 24l6 6l12-12"/></g></mask></defs><path fill="#8837e9" d="M0 0h48v48H0z" mask="url(#SVGIQLGgV2F--${id})"/></svg>
          </span>
          <div class="board-thumbnail"></div>
          <div class="board-info">
            <h4 class="board-title">${board.title}</h4>
            <p class="board-meta">${board.creator} • ${board.daysAgo} day${board.daysAgo > 1 ? "s" : ""} ago</p>
          </div>
        `;

    return boardCard;
  }

  _filterLiveStream() {
    if (this.currentLiveFilter === "yours") {
      return this.liveStreamData;
    } else if (this.currentLiveFilter === "followers") {
      return this.liveStreamData.filter((board) => board.type === "followers");
    } else {
      return this.liveStreamData.filter((board) => board.type === "followering");
    }
  }

  _filterBoards() {
    if (this.currentFilter === "all") {
      return this.boardsData;
    } else if (this.currentFilter === "recent") {
      return this.boardsData.filter((board) => board.daysAgo <= 3 || board.type === "recent");
    } else {
      return this.boardsData.filter((board) => board.type === this.currentFilter);
    }
  }

  _getActiveEditorElements() {
    const canvasEditorContainer = document.querySelector(`[data-canvas-media-id="${currentStoryEditingMedia.id}"]`);
    const shareStoryOverlay = canvasEditorContainer.querySelector(".share_story_overlay");
    return { shareStoryOverlay, canvasEditorContainer };
  }

  // type: "task" | "board" | "live"
  _getOverlayMarkup(type = "task") {
    return `
      <div id="shareStoryOverlay" class="share_story_overlay" data-story-mode="${type}">
        <div class="share_story_overlay_wrapper">
          <div class="main_share_story_overlay">
            <div class="top_header">
              <button>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e93737" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"></path></svg>
              </button>
            </div>

            <div class="content">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.0.3&amp;ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
              <div>
                <p>You</p>
                <h2 class="overlay_desc_content">${type === "task" ? "Wants to collaborate on a task" : type === "board" ? "Wants to collaborate on a board" : "Started streaming 5 hours ago"}</h2>
              </div>
              <button class="overlay_action_button">${type === "task" ? "Collaborate" : type === "board" ? "Join Board" : "Join Live"}</button>
            </div>
          </div>

          <div class="positon_share_overlay">
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="task-icon" width="20" height="20" viewBox="0 0 36 36"><path fill="#8837E9" d="M29.29 4.95h-7.2a4.31 4.31 0 0 0-8.17 0H7a1.75 1.75 0 0 0-2 1.69v25.62a1.7 1.7 0 0 0 1.71 1.69h22.58A1.7 1.7 0 0 0 31 32.26V6.64a1.7 1.7 0 0 0-1.71-1.69m-18 3a1 1 0 0 1 1-1h3.44v-.63a2.31 2.31 0 0 1 4.63 0V7h3.44a1 1 0 0 1 1 1v1.8H11.25Zm14.52 9.23l-9.12 9.12l-5.24-5.24a1.4 1.4 0 0 1 2-2l3.26 3.26l7.14-7.14a1.4 1.4 0 1 1 2 2Z" class="clr-i-solid clr-i-solid-path-1"></path><path fill="none" d="M0 0h36v36H0z"></path></svg>
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="collaborate-icon" width="20" height="20" viewBox="0 0 24 24"><g fill="none"><path stroke="#1C64F2" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"></path><path fill="#1C64F2" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"></path></g></svg>
            <!-- prettier-ignore -->
            <svg xmlns="http://www.w3.org/2000/svg" class="live-icon" width="20" height="20" viewBox="0 0 20 20"><path fill="#8837E9" d="M5.453 4.167a.726.726 0 0 0-1.027-.01A8.23 8.23 0 0 0 2 10a8.23 8.23 0 0 0 2.604 6.015a.725.725 0 0 0 1.01-.025c.316-.316.277-.819-.027-1.11A6.73 6.73 0 0 1 3.5 10c0-1.846.741-3.52 1.943-4.738c.29-.295.32-.785.01-1.095M7.214 5.93a.714.714 0 0 0-1.008-.016A5.73 5.73 0 0 0 4.5 10c0 1.692.73 3.213 1.893 4.265a.713.713 0 0 0 .983-.038c.328-.328.267-.844-.041-1.134A4.24 4.24 0 0 1 6 10c0-1.15.457-2.194 1.2-2.96c.286-.294.333-.793.014-1.111m5.572 0a.714.714 0 0 1 1.008-.016A5.73 5.73 0 0 1 15.5 10c0 1.692-.73 3.213-1.893 4.265a.713.713 0 0 1-.983-.038c-.328-.328-.267-.844.041-1.134A4.24 4.24 0 0 0 14 10c0-1.15-.457-2.194-1.2-2.96c-.286-.294-.333-.793-.014-1.111m1.761-1.762a.726.726 0 0 1 1.027-.01A8.23 8.23 0 0 1 18 10a8.23 8.23 0 0 1-2.604 6.015a.725.725 0 0 1-1.01-.025c-.316-.316-.277-.819.028-1.11A6.73 6.73 0 0 0 16.5 10c0-1.846-.741-3.52-1.943-4.738c-.29-.295-.32-.785-.01-1.095M10 8.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"></path></svg>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.addStoryOverlay = new AddStoryOverlay();
});
