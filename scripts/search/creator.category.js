const searchCreatorCategory = document.getElementById("searchCreatorCategory");
const searchAccountCategory = document.getElementById("searchAccountCategory");

function renderSkeletonCategory(container) {
  container.innerHTML = "";

  Array.from({ length: 15 }).forEach(() => {
    const markup = `
           <li class="skeleton_loading" style="width: 100%; height: 6rem; margin-top: 10px; margin-bottom: 10px; border-radius: 10px"></li>
        `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

function renderCreatoryCategory(container) {
  renderSkeletonCategory(searchCreatorCategory);
  renderSkeletonCategory(searchAccountCategory);

  window.matchingModal.generateMatchingRandomUsers(10).then((data) => {
    container.innerHTML = "";

    data.forEach((d) => {
      const { name, largePhoto } = d;

      const markup = `
                  <li class="ff-content-item flex-col card-menu max-sm:w-full w-full transition-all justify-start hover:bg-gray-100">
                    <div class="ff-items-group gap-3">
                      <img class="ff-p-avatar w-20 h-20" src="${largePhoto}" alt="${name}" />
                      <div class="ff-profile-menu flex flex-grow h-full items-center gap-3">
                        <div class="ff-profile w-1/2">
                          <span class="ff-profile-name">${name}</span>
                          <a href="/profile.html" class="profile__link ff-profile-link logged_acct">
                            <span class="ff-p-link-text">View Profile</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 4L10 8L6 12" stroke="#222222"></path>
                            </svg>
                          </a>
                        </div>
                        <div class="h-full flex flex-grow order-1 justify-end">
                          <div class="ff-options justify-end max-sm:justify-start transition-all relative logged_acct">
                            <button class="ff-btn transition-all bg-gray-100 hover:bg-gray-200" x-data="{ show: false }" @click="show = !show">
                              <span x-text.transition.in="show ? 'Unfollow' : 'Following'">Following</span>
                            </button>

                            <button class="option-btn menu-button cdm_btn hover:bg-gray-50" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></g></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#000" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"/></svg>
                            </button>
                            <div class="drop-down-menu w-44 modal-wrapper shadow-md shadow-gray-200 search-hidden">
                                  <div class="menu-nav-list" style="padding: 4px">
                                    <button class="menu-nav-items send_note_option hover:bg-gray-200">
                                        <div class="items-icon">
                                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000"><path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"></path><path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"></path></g></svg>
                                        </div>
                                        <div class="items-item">
                                           <span>Send Note</span>
                                        </div>
                                    </button>
                                    <a href="/chat.html" class="menu-nav-items">
                                      <div class="items-icon">
                                        <svg data-icon>
                                          <use href="../icons/sprite.svg#message" />
                                        </svg>
                                      </div>
                                      <div class="items-item">
                                        <span>Message</span>
                                      </div>
                                    </a>
                                    <button class="menu-nav-items block-note-option hover:bg-gray-200">
                                        <div class="items-icon">
                                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.35 0 2.6-.437t2.3-1.263L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20m6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7z"/></svg>
                                        </div>
                                      <div class="items-item">
                                        <span>Block</span>
                                      </div>
                                    </button>
                                  </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
      `;

      container.insertAdjacentHTML("beforeend", markup);
    });
  });
}

renderCreatoryCategory(searchCreatorCategory);
renderCreatoryCategory(searchAccountCategory);

[searchCreatorCategory, searchAccountCategory].forEach((container) => {
  container.addEventListener("click", (e) => {
    const menuButton = e.target.closest(".menu-button");

    if (menuButton) {
      const ffOptions = menuButton.closest(".ff-options");
      const dropdown = ffOptions.querySelector(".drop-down-menu");

      document.querySelectorAll(".drop-down-menu").forEach((dropdown) => dropdown.classList.add(HIDDEN));

      if (dropdown.classList.contains(HIDDEN)) {
        dropdown.classList.remove(HIDDEN);
        ffOptions.setAttribute("aria-expanded", true);
      } else {
        dropdown.classList.add(HIDDEN);
        ffOptions.removeAttribute("aria-expanded");
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
  if (!e.target.closest(".ff-options")) {
    document.querySelectorAll(".ff-options").forEach((option) => option.removeAttribute("aria-expanded"));

    document.querySelectorAll(".drop-down-menu").forEach((dropdown) => dropdown.classList.add(HIDDEN));
  }
});
