"use strict";

const recentContainer = document.querySelector(".recents_wrapper_2");
const sharedContainerWrapper = document.getElementById("sharedContainerWrapper");

// Recents
function renderRecent(container) {
  container.innerHTML = "";

  recents.forEach((recent) => {
    const remainingImageLengths = recent.collaborators.slice(3).length;

    const markup = `
        <div class="recent_item boarding_item">
                <div class="recent_item_thumbnail"></div>
                <div class="details">
                    <div>
                      <div class="item_head">
                        <h3>${recent.title}</h3>
                        <button class="board_item_option" aria-expanded="false">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#222222" d="M7 12a2 2 0 1 1-4.001-.001A2 2 0 0 1 7 12m12-2a2 2 0 1 0 .001 4.001A2 2 0 0 0 19 10m-7 0a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 10"/></svg>

                          <ul class="animate__animated animate__fadeIn">
                            <li role="button" data-option="share" tabindex="0">
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"></path></svg>
                              </span>
                              <span>Share</span>
                            </li>
                            <li role="button" data-option="delete" tabindex="0">
                              <span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"></path></svg>
                              </span>
                              <span>Delete</span>
                            </li>
                          </ul>
                        </button>
                      </div>
                      <div class="who_minutes">
                        <span>${recent.user}</span>
                        <span>&bull;</span>
                        <span>${recent.minutes} min ago</span>
                      </div>
                    </div>
                    <div class="collaborating_with">
                        ${recent.collaborators
                          .map((collab, i) => {
                            if (i === 3) return;

                            return `<img src="${collab}" alt="Collab" style="border: 2px solid ${getRandomGeneratedColor()}"/>`;
                          })
                          .join("")}
                        <span class="${recent.collaborators.length > 3 ? "" : "board--hidden"}">+${remainingImageLengths}</span>
                    </div>
                </div>
        </div>
    `;

    container.insertAdjacentHTML("afterbegin", markup);
  });

  // Initailize Popper
  const boardOption = container.querySelectorAll(".board_item_option");
  InitiatePopper(boardOption);
}
renderRecent(recentContainer);
renderRecent(sharedContainerWrapper);

// All Boards
const boardsContainer = document.querySelector(".all_boards");

function renderBoards(status = "private", boards = boardsData) {
  boardsContainer.innerHTML = ""; // clear the container

  const data = boards.filter((b) => b.status === status);

  data.forEach((b) => {
    const remainingImageLengths = b?.collaborators?.slice(1).length;

    const markup = `
      <div class="board_item boarding_item">
        <div class="board_item_thumbnail"></div>
        
        <div class="details">
          <div>
            <div class="item_head">
              <h3>${b.title}</h3>
              <button class="board_item_option" aria-expanded="false">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#222222" d="M7 12a2 2 0 1 1-4.001-.001A2 2 0 0 1 7 12m12-2a2 2 0 1 0 .001 4.001A2 2 0 0 0 19 10m-7 0a2 2 0 1 0 .001 4.001A2 2 0 0 0 12 10"/></svg>

                <ul class="animate__animated animate__fadeIn">
                  <li role="button" data-option="share" tabindex="0">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"></path></svg>
                    </span>
                    <span>Share</span>
                  </li>
                ${
                  status === "private"
                    ? `<li role="button" data-option="delete" tabindex="0">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#000" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"></path></svg>
                    </span>
                    <span>Delete</span>
                  </li>`
                    : ""
                }
                </ul>
              </button>
            </div>
          
            <div class="who_minutes">
              <span>${b.user}</span>
              <span>&bull;</span>
              <span>${b.minutes} min ago</span>
            </div>
          </div>
          ${
            b.status === "public"
              ? ` <div class="collaborating_with">
                        ${b.collaborators
                          .map((collab, i) => {
                            if (i >= 1) return;
                            return `
                            <img src="${collab}" alt="Collab" style="border: 2px solid ${getRandomGeneratedColor()}"/>
                          `;
                          })
                          .join("")}
                        <span class="${b.collaborators.length > 1 ? "" : "board--hidden"}">+${remainingImageLengths && remainingImageLengths}</span>
                      </div>`
              : ""
          }
        </div>
      </div>
    `;

    boardsContainer.insertAdjacentHTML("afterbegin", markup);
  });

  // Initailize Popper
  const boardOption = boardsContainer.querySelectorAll(".board_item_option");
  InitiatePopper(boardOption);
}

// For `board.html`
if (boardsContainer) {
  renderBoards();
}

function InitiatePopper(boardOption) {
  boardOption.forEach((button) => {
    const dropdown = button.querySelector("ul");

    // Create Popper instance
    const popperInstance = Popper.createPopper(button, dropdown, {
      placement: "top-start",
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 8] },
        },
        {
          name: "preventOverflow",
          options: { padding: 8 },
        },
      ],
    });

    // Click handler for options button
    button?.addEventListener("click", (e) => {
      e.stopPropagation();

      // Share
      const share = e.target.closest('[data-option="share"]');
      if (share) {
        return showGlobalShareFollowingModal();
      }

      // Delete
      const deleteBtn = e.target.closest('[data-option="delete"]');
      if (deleteBtn) {
        return showGlobalDiscardModal();
      }

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      boardOption.forEach((btn) => btn.setAttribute("aria-expanded", false));

      button.setAttribute("aria-expanded", !isExpanded);
      popperInstance.update();
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".board_item_option")) {
        button.setAttribute("aria-expanded", "false");
        popperInstance.update ? popperInstance.update() : console.log("No popper instance");
      }
    });
  });
}

///////////////////////////////////
///////////////////////////////////
///// Private - Public Switch /////
///////////////////////////////////
///////////////////////////////////
const buttonSwitchContainer = document.querySelector(".private_public_switch");
const allSwitchButton = buttonSwitchContainer.querySelectorAll("button");
const btnSlider = buttonSwitchContainer.querySelector(".slider");

buttonSwitchContainer.addEventListener("click", (e) => {
  const target = e.target;
  if (target.tagName.toLowerCase() !== "button") return;

  allSwitchButton.forEach((btn) => btn.classList.remove("active")); // remove active class from all button
  target.classList.add("active"); // add active class to the target one

  if (target.classList.contains("public")) {
    btnSlider.style.marginLeft = "-4px";
    btnSlider.style.transform = "translatex(100%)";
    // Public
    renderBoards("public");
  } else {
    btnSlider.style.marginLeft = "4px";
    btnSlider.style.transform = "translatex(0)";
    // Private
    renderBoards("private");
  }
});

// Filters
const filterBoard = document.getElementById("filters");
const mobileFilterContainer = document.querySelector(".filter_board_overlay");

filterBoard.addEventListener("click", () => {
  const sortOptions = filterBoard.closest("div").querySelector("ul");

  if (!sortOptions.classList.contains(HIDDEN)) {
    sortOptions.classList.add(HIDDEN);
  } else {
    if (innerWidth > 667) {
      sortOptions.classList.remove(HIDDEN);
    } else {
      mobileFilterContainer.classList.remove(HIDDEN);
    }
  }
});

// Create New Board
const showCreateBoard = document.querySelector(".create_board");
const newBoardModal = document.querySelector(".new_board_overlay");

showCreateBoard.addEventListener("click", () => {
  newBoardModal.classList.remove(HIDDEN);
});

// Create Public/Private Board
const publicPrivateBoardBtns = document.querySelectorAll(".new_board_overlay .action_btns button");

publicPrivateBoardBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    // open("/board-page.html", "_self");
  });
});

// Board Filter
const boardFilters = document.querySelectorAll(".board_filter--unique");

boardFilters.forEach((filter) => {
  filter.addEventListener("click", function (e) {
    const listItem = e.target.closest("li");
    const allLists = filter.querySelectorAll("li");

    if (listItem) {
      allLists.forEach((li) => li.classList.remove("active"));
      listItem.classList.add("active");
    }
  });
});

// Navigate to Board Editing
const boardModeTemplates = document.querySelector(".board_mode_templates");
boardModeTemplates.addEventListener("click", function (e) {
  const boardingItem = e.target.closest(".boarding_item");
  if (boardingItem) {
    open("/board-page.html", "_self");
  }
});
