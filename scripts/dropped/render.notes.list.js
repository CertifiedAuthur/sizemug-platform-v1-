const notesData = [
  {
    id: 526,
    content: ["Detailed Project Plan for Q1 Success 🚀 – Tasks, Milestones, and Deadlines", "Breaking down goals into bite-sized wins 📅✨ with team sync-ups every Monday!"],
    notesCounts: 25,
    background: "linear-gradient(to right, #ff7e5f, #feb47b)",
    userInfo: {
      username: "Alice Johnson",
      userPhoto: "https://randomuser.me/api/portraits/med/women/38.jpg",
    },
  },
  {
    id: 52,
    content: ["My Ultimate Workout Routine 💪: Cardio, Strength, Flexibility", "Starting with a 5K run 🏃‍♂️, then hitting the weights 🏋️‍♀️, and winding down with yoga 🧘‍♂️ – feeling unstoppable!"],
    notesCounts: 15,
    background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
    userInfo: {
      username: "John Doe",
      userPhoto: "https://randomuser.me/api/portraits/med/women/20.jpg",
    },
  },
  {
    id: 5,
    content: ["Weekly Grocery List 🛒 – Veggies, Snacks, Essentials", "Stocking up on kale 🥬, grabbing some guilty-pleasure chips 🍟, and don’t forget the coffee ☕ – survival fuel!"],
    notesCounts: 8,
    background: "linear-gradient(to bottom right, #ff416c, #ff4b2b)",
    userInfo: {
      username: "Emma Smith",
      userPhoto: "https://randomuser.me/api/portraits/med/women/46.jpg",
    },
  },
  {
    id: 781,
    content: ["Travel Itinerary ✈️", "Day 1: Explore the city 🌆, Day 2: Beach vibes 🏖️ , Day 3: Food tour 🍜 – passport ready!"],
    notesCounts: 12,
    background: "linear-gradient(to bottom left, #8e2de2, #4a00e0)",
    userInfo: {
      username: "Michael Brown",
      userPhoto: "https://randomuser.me/api/portraits/med/women/48.jpg",
    },
  },
  {
    id: 78,
    content: ["Meeting Notes 📝 – Quiet day, no updates yet!"],
    notesCounts: 0,
    background: "linear-gradient(to right, #ff8a00, #e52e71)",
    userInfo: {
      username: "Sophia Wilson",
      userPhoto: "https://randomuser.me/api/portraits/med/women/19.jpg",
    },
  },
  {
    id: 7,
    content: ["Birthday Party Ideas 🎉", "Theme: Retro Disco 🕺💃 – neon lights, funky playlist 🎶, and a cake that screams WOW 🍰"],
    notesCounts: 20,
    background: "repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)",
    userInfo: {
      username: "Daniel Martinez",
      userPhoto: "https://randomuser.me/api/portraits/med/women/13.jpg",
    },
  },
  {
    id: 981,
    content: ["Book Summary 📚", "Just finished a sci-fi thriller – aliens 👽, plot twists 🔄, and a cliffhanger that’s still haunting me!"],
    notesCounts: 10,
    background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
    userInfo: {
      username: "Olivia Garcia",
      userPhoto: "https://randomuser.me/api/portraits/med/women/16.jpg",
    },
  },
  {
    id: 98,
    content: ["Coding Notes 💻", "Debugging that pesky bug 🐞 in the API, plus some slick new features in JS – code is life! 🚀"],
    notesCounts: 50,
    background: "linear-gradient(to bottom right, #ff416c, #ff4b2b)",
    userInfo: {
      username: "Liam Anderson",
      userPhoto: "https://randomuser.me/api/portraits/med/women/20.jpg",
    },
  },
  {
    id: 9,
    content: ["Recipe Collection 🍳", "Spicy tacos 🌮, creamy pasta 🍝, and a killer chocolate lava cake 🍫 – kitchen experiments FTW!"],
    notesCounts: 18,
    background: "linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5))",
    userInfo: {
      username: "Emily Thomas",
      userPhoto: "https://randomuser.me/api/portraits/med/women/34.jpg",
    },
  },
  {
    id: 6881,
    content: ["Investment Strategies 💰 – Researching stocks 📈 and crypto 📊, more to come soon!"],
    notesCounts: 0,
    background: "linear-gradient(to right, #ff7e5f, #feb47b 20%, #ff7e5f 80%)",
    userInfo: {
      username: "Noah Harris",
      userPhoto: "https://randomuser.me/api/portraits/med/women/4.jpg",
    },
  },
  {
    id: 688,
    content: ["Investment Strategies 💸", "Diving into dividend stocks 🤑 and plotting some long-term gains – patience is key! ⏳"],
    notesCounts: 0,
    background: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)",
    userInfo: {
      username: "Noah Harris",
      userPhoto: "https://randomuser.me/api/portraits/med/women/10.jpg",
    },
  },
  {
    id: 68,
    content: ["Investment Strategies 📉", "Quick thoughts: ETFs for stability 🏦, maybe a sprinkle of risky bets 🎲 – still brainstorming!"],
    notesCounts: 0,
    background: "linear-gradient(to right, #ff7e5f 50%, #feb47b 50%)",
    userInfo: {
      username: "Noah Harris",
      userPhoto: "https://randomuser.me/api/portraits/med/women/50.jpg",
    },
  },
];

// Elements
const noteBodyUL = document.getElementById("noteBody");
const sharedBodyUL = document.getElementById("sharedBody");
const allNotesModalLists = document.getElementById("allNotesModalLists");
const viewAllNotesModal = document.getElementById("viewAllNotesModal");
const viewNoteModal = document.getElementById("viewNoteModal");
const viewNoteModalTrash = document.getElementById("viewNoteModalTrash");
const viewNoteModalClose = document.getElementById("viewNoteModalClose");

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
// Rendering Notes
function renderDroppedNotes(data, container, noteCount = "show") {
  container.innerHTML = "";

  data.forEach((d) => {
    const {
      id,
      content,
      notesCounts,
      background,
      userInfo: { username },
    } = d;

    const markup = `
         <li class="card-menu note-card initial-note-card" data-note-id="${id}">
                         ${notesCounts && noteCount === "show" ? `<div class="note-card-count">${notesCounts}</div>` : ""}
                          <div class="text-body" style="background: ${background}">
                            <span class="text_label">${content[0]}</span>
                            <div class="card-over">
                              <div class="card-over-btn">
                                <button class="expandNoteItem">
                                  <span class="flex flex-grow">Expand</span>
                                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.5 20H3.5V21H4.5V20ZM10.2071 15.7071C10.5976 15.3166 10.5976 14.6834 10.2071 14.2929C9.81658 13.9024 9.18342 13.9024 8.79289 14.2929L10.2071 15.7071ZM3.5 14V20H5.5V14H3.5ZM4.5 21H10.5V19H4.5V21ZM5.20711 20.7071L10.2071 15.7071L8.79289 14.2929L3.79289 19.2929L5.20711 20.7071Z" fill="#33363F" />
                                    <path d="M20.5 4H21.5V3H20.5V4ZM14.7929 8.29289C14.4024 8.68342 14.4024 9.31658 14.7929 9.70711C15.1834 10.0976 15.8166 10.0976 16.2071 9.70711L14.7929 8.29289ZM21.5 10V4H19.5V10H21.5ZM20.5 3H14.5V5H20.5V3ZM19.7929 3.29289L14.7929 8.29289L16.2071 9.70711L21.2071 4.70711L19.7929 3.29289Z" fill="#33363F" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div class="note-info h-20 border-2 bg-gray-100 flex rounded-b-3xl justify-between items-center p-5">
                            <div class="profile_ w-fit flex gap-3 justify-start">
                              <img src="${d.userInfo.userPhoto}" alt="" class="w-10 h-10 object-cover border-2 border-blue-500 rounded-full" />
                              <div class="profile_info flex flex-col justify-between">
                                <span class="name font-semibold text-sm">${username}</span>
                                <span class="name font-normal text-gray-500 text-xs">Just now</span>
                              </div>
                            </div>
                            <div class="relative note_card_menu_option_container">
                              <button aria-expanded="false" class="menu-btn cdm_btn hover:bg-gray-50">
                                <svg class="ellipsis" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#1e1c1c" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                                <svg class="times" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1e1c1c" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                              </button>

                              <div class="drop-down-menu w-44 modal-wrapper shadow-s0 shadow-gray-100 px-4">
                                <div class="menu-content">
                                  <div class="menu-nav">
                                    <div class="menu-nav-list">
                                      <a href="#" class="menu-nav-items send_note_option hover:bg-gray-200" >
                                        <div class="items-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000"><path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/><path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/></g></svg>
                                        </div>
                                        <div class="items-item">
                                          <span>Send Note</span>
                                        </div>
                                      </a>
                                      <a href="/chat.html" class="menu-nav-items">
                                        <div class="items-icon">
                                          <svg data-icon><use href="../icons/sprite.svg#message" /></svg>
                                        </div>
                                        <div class="items-item">
                                          <span>Message</span>
                                        </div>
                                      </a>
                                      <a href="#" class="menu-nav-items block-note-option hover:bg-gray-200">
                                        <div class="items-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="64" stroke-dashoffset="64" d="M5.64 5.64c3.51 -3.51 9.21 -3.51 12.73 0c3.51 3.51 3.51 9.21 0 12.73c-3.51 3.51 -9.21 3.51 -12.73 0c-3.51 -3.51 -3.51 -9.21 -0 -12.73Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M6 6l12 12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="20;0"/></path></g></svg>
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
                        </li>
  `;

    container.insertAdjacentHTML("beforeend", markup);
  });

  // Initialize Popper for each chat item after rendering
  handleItemWithPopper(container, ".initial-note-card");

  // Container
  handleItemContainerEvents(container);
}

renderDroppedNotes(notesData, noteBodyUL);
renderDroppedNotes(notesData, allNotesModalLists, "hide");

//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
// Render Shared
function renderDroppedShared(data, container) {
  container.innerHTML = "";

  data.forEach((d, i) => {
    const story = i === 0 || i === 2 || i === 3 || i === data.length - 1;

    const markup = `
      <li class="shared_list card-menu" data-container-type="${story ? "story" : "comment-modal"}">
        <div class="text-body bg-gray-100 justify-start gap-5">
          <div class="story__ new_update">
            <div class="story-media">
              <img src="../images/img2.jpg" alt="" />

              <div class="story-overlay"></div>
              <div class="user_story">
                <img src="../images/lives/23.png" alt="story" />
              </div>
              <div class="story-media-count-wrapper">
                <ul class="story-media-count">
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex-grow h-full flex-col gap-5">
            <span class="shared-title font-semibold text-xl">The miracle called: Women</span>
            <a href="#" class="shared-link text-gray-600 font-light flex items-center gap-3">
              <span class="showCommentModal">${story ? "Story" : "View Post"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="oklch(0.446 0.03 256.802)" d="M12.6 12L8 7.4L9.4 6l6 6l-6 6L8 16.6z"/></svg>
            </a>
          </div>
        </div>
        <div class="note-info h-20 border bg-gray-100 flex rounded-b-xl justify-between items-center p-3">
          <div class="profile_ w-fit flex gap-3 justify-start">
            <img src="${d.userInfo.userPhoto}" alt="" class="w-10 h-10 object-cover border-2 border-blue-500 rounded-full" />
            <div class="profile_info flex flex-col justify-between">
              <span class="name font-semibold text-sm">${d.userInfo.username}</span>
              <span class="name font-normal text-gray-500 text-xs">Just now</span>
            </div>
          </div>
          <div class="relative note_card_menu_option_container">
            <button aria-expanded="false" class="menu-btn cdm_btn hover:bg-gray-50">
              <svg class="ellipsis" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#1e1c1c" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
              <svg class="times" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#1e1c1c" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
            </button>

            <div class="drop-down-menu w-44 modal-wrapper hidden hide shadow-s0 shadow-gray-100 px-4">
              <div class="menu-content">
                <div class="menu-nav">
                  <div class="menu-nav-list">
                    <a href="#" class="menu-nav-items send_note_option hover:bg-gray-200">
                      <div class="items-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#000"><path d="M17 2v2m-5-2v2M7 2v2M3.5 16V9c0-2.828 0-4.243.879-5.121C5.257 3 6.672 3 9.5 3h5c2.828 0 4.243 0 5.121.879c.879.878.879 2.293.879 5.121v3c0 4.714 0 7.071-1.465 8.535C17.572 22 15.215 22 10.5 22h-1c-2.828 0-4.243 0-5.121-.879C3.5 20.243 3.5 18.828 3.5 16M8 15h4m-4-5h8"/><path d="M20.5 14.5A2.5 2.5 0 0 1 18 17c-.5 0-1.088-.087-1.573.043a1.25 1.25 0 0 0-.884.884c-.13.485-.043 1.074-.043 1.573A2.5 2.5 0 0 1 13 22"/></g></svg>
                      </div>
                      <div class="items-item">
                        <span>Send Note</span>
                      </div>
                    </a>
                    <a href="/chat.html" class="menu-nav-items">
                      <div class="items-icon">
                        <svg data-icon><use href="../icons/sprite.svg#message" /></svg>
                      </div>
                      <div class="items-item">
                        <span>Message</span>
                      </div>
                    </a>
                    <a href="#" class="menu-nav-items block-note-option hover:bg-gray-200" @click="block_popup=true">
                      <div class="items-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="64" stroke-dashoffset="64" d="M5.64 5.64c3.51 -3.51 9.21 -3.51 12.73 0c3.51 3.51 3.51 9.21 0 12.73c-3.51 3.51 -9.21 3.51 -12.73 0c-3.51 -3.51 -3.51 -9.21 -0 -12.73Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M6 6l12 12"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="20;0"/></path></g></svg>
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
      </li>
  `;

    container.insertAdjacentHTML("beforeend", markup);
  });

  // Initialize Popper for each chat item after rendering
  handleItemWithPopper(container, ".shared_list.card-menu");

  // Container
  handleItemContainerEvents(container);
}

renderDroppedShared(notesData, sharedBodyUL);

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Notes Counts
viewAllNotesModal.addEventListener("click", (e) => {
  if (e.target.id === "viewAllNotesModal") {
    hideViewAllNotesModal();
  }
});

function showViewAllNotesModal() {
  viewAllNotesModal.classList.remove(HIDDEN);
}

function hideViewAllNotesModal() {
  viewAllNotesModal.classList.add(HIDDEN);
}

// Expand Button
viewNoteModal.addEventListener("click", (e) => {
  if (e.target.id === "viewNoteModal") {
    hideViewNoteModal();
  }
});

function showViewNoteModal() {
  viewNoteModal.classList.remove(HIDDEN);
}

function hideViewNoteModal() {
  viewNoteModal.classList.add(HIDDEN);
}

viewNoteModalTrash.addEventListener("click", showGlobalDiscardModal);
viewNoteModalClose.addEventListener("click", hideViewNoteModal);

// Popper.js Handler
function handleItemWithPopper(container, cardClassName) {
  // Select all elements with the given card class name inside the container
  const cards = container.querySelectorAll(cardClassName);

  cards.forEach((card) => {
    // Get the menu button inside the current card
    const button = card.querySelector(".menu-btn");
    // Get the dropdown menu inside the current card
    const dropdown = card.querySelector(".drop-down-menu");
    // Select all menu buttons inside the container
    const allDropdownButtons = container.querySelectorAll(".menu-btn");

    // Create a Popper instance to position the dropdown
    const popperInstance = Popper.createPopper(button, dropdown, {
      placement: "bottom-end", // Positions the dropdown at the bottom-right
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 8] }, // Adds spacing between button and dropdown
        },
        {
          name: "preventOverflow",
          options: { padding: 8 }, // Prevents the dropdown from overflowing the viewport
        },
      ],
    });

    // Handle click event on the menu button
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevents the event from bubbling up to document

      // Check if the dropdown is currently expanded
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      // Close all dropdowns before opening the clicked one
      allDropdownButtons.forEach((btn) => btn.setAttribute("aria-expanded", false));

      // Toggle the clicked dropdown
      button.setAttribute("aria-expanded", !isExpanded);

      // Update the Popper instance for proper positioning
      popperInstance.update();
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    cards.forEach((card) => {
      const button = card.querySelector(".menu-btn");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

let defaultCommentModalData;

generateUsersWithTasks(10).then((res) => {
  defaultCommentModalData = res[0];
  gridDataItem = res;
});

// Dropped Container Events
function handleItemContainerEvents(container) {
  // Add a click event listener to the container
  container.addEventListener("click", (e) => {
    const cardMenu = e.target.closest(".card-menu");
    const { containerType } = cardMenu.dataset;

    const storyNewUpdate = e.target.closest(".story__.new_update");
    const showCommentModal = e.target.closest(".showCommentModal");

    // Show Story Container :)
    if (containerType === "story" && (storyNewUpdate || showCommentModal)) {
      return removeClass(storyModalContainer);
    }

    // Show Comment Modal
    if (containerType === "comment-modal" && (storyNewUpdate || showCommentModal)) {
      if (defaultCommentModalData) {
        showCommentModalGlobalHandler(defaultCommentModalData);
      }

      return;
    }

    // Check if the clicked element is inside a ".note-card-count" (Notes Counts)
    const allNotesCounts = e.target.closest(".note-card-count");
    if (allNotesCounts) {
      return showViewAllNotesModal(); // Show the "View All Notes" modal
    }

    // Check if the clicked element is inside a ".expandNoteItem" (Expand Note Item)
    const expandNoteItem = e.target.closest(".expandNoteItem");
    if (expandNoteItem) {
      const noteCard = expandNoteItem.closest(".note-card");
      const { noteId } = noteCard.dataset;
      const viewNoteContentModal = document.getElementById("viewNoteContentModal");

      const note = notesData.find((note) => note.id === +noteId);

      const title = note.content[0];
      const listOptions = note.content.slice(1).join("").split(",");

      viewNoteContentModal.innerHTML = "";

      // Title
      const noteTextLabel = document.createElement("span");
      noteTextLabel.className = "text_label";
      noteTextLabel.textContent = title;
      viewNoteContentModal.appendChild(noteTextLabel);

      if (listOptions.length) {
        const ul = document.createElement("ul");

        listOptions.forEach((list) => {
          const li = document.createElement("li");
          li.textContent = `- ${list}`;
          ul.appendChild(li);
        });

        viewNoteContentModal.appendChild(ul);
      }

      return showViewNoteModal(); // Show the "View Note" modal
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
}
