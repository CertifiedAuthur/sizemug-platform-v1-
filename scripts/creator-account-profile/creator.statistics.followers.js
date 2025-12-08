const creatorFollowers = document.getElementById("creatorFollowers");
const creatorProfileItems = document.getElementById("creatorProfileItems");

function renderStatisticsFollowers(container) {
  if (!container) return;

  container.innerHTML = "";
  window.matchingModal.generateMatchingRandomUsers(10).then((data) => {
    data.forEach((d) => {
      const { name, largePhoto } = d;

      const markup = `
                        <div class="creator_profile_item">
                            <div class="profile_image">
                              <img src="${largePhoto}" alt="${name}" />
                            </div>

                            <div>
                              <div class="profile_info">
                                <h2>${name}</h2>
                                <a href="/profile.html">
                                  <span>Visit profile</span>
                                  <span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6 4L10 8L6 12" stroke="#222222" />
                                    </svg>
                                  </span>
                                </a>
                              </div>

                              <div class="profile_action">
                                <button data-state="Following">Following</button>

                                <div class="note_card_menu_option_container">
                                        <button class="menu-button">
                                                <span>
                                                        <svg class="ellipsis" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="12" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round"/><circle cx="18" cy="12" r="1" stroke="#33363F" stroke-width="2" stroke-linecap="round"/></svg>
                                                        <svg class="times" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1e1c1c" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg>
                                                </span>
                                        </button>
    
                                  <div class="drop-down-menu animation-dropdown">
                                    <div class="menu-content">
                                      <div class="menu-nav">
                                        <div class="menu-nav-list">
                                          <a href="#" class="menu-nav-items send_note_option hover:bg-gray-200">
                                            <div class="items-icon">
                                              <!-- prettier-ignore -->
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000"><path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"></path><path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"></path></g></svg>
                                            </div>
                                            <div class="items-item">
                                              <span>Send Note</span>
                                            </div>
                                          </a>
                                          <a href="/chat.html" class="menu-nav-items">
                                            <div class="items-icon">
                                              <!-- prettier-ignore -->
                                              <svg data-icon=""><use href="../icons/sprite.svg#message"></use></svg>
                                            </div>
                                            <div class="items-item">
                                              <span>Message</span>
                                            </div>
                                          </a>
                                          <a href="#" class="menu-nav-items block-note-option">
                                            <div class="items-icon">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.35 0 2.6-.437t2.3-1.263L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20m6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7z"/></svg>
                                            </div>
                                            <div class="items-item">
                                              <span>Block</span>
                                            </div>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
  `;

      container.insertAdjacentHTML("beforeend", markup);
    });
  });
}

renderStatisticsFollowers(creatorFollowers);
renderStatisticsFollowers(creatorProfileItems);

[creatorProfileItems, creatorFollowers].forEach((container) => {
  if (!container) return;

  container.addEventListener("click", (e) => {
    const menuButton = e.target.closest(".menu-button");

    if (menuButton) {
      const cardMenuContainer = menuButton.closest(".note_card_menu_option_container");
      const isExpanded = cardMenuContainer.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        cardMenuContainer.setAttribute("aria-expanded", false);
      } else {
        document.querySelectorAll(".note_card_menu_option_container").forEach((container) => container.removeAttribute("aria-expanded"));
        cardMenuContainer.setAttribute("aria-expanded", true);
      }
      return;
    }

    // Check if the clicked element is inside a ".block-note-option" (Block Note Option)
    const blockNoteOption = e.target.closest(".block-note-option");
    if (blockNoteOption) {
      return showBlockModal(); // Show the "Block Note" modal
    }

    // Check if the clicked element is inside a ".send_note_option" (Send Note)
    const sendNoteOption = e.target.closest(".send_note_option");
    if (sendNoteOption) {
      return showSendNoteModal(); // Show the "Send Note" modal
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".note_card_menu_option_container")) {
    document.querySelectorAll(".note_card_menu_option_container").forEach((container) => container.removeAttribute("aria-expanded"));
  }
});
