const savedPosts = [
  {
    category: "My default list",
    posts: [
      {
        image:
          "https://images.unsplash.com/photo-1599437120129-04fcdf9b277f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
      },
    ],
  },
  {
    category: "Work",
    posts: [
      {
        image:
          "https://images.unsplash.com/photo-1616043076499-633ae2a7a357?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
      },
      {
        image:
          "https://images.unsplash.com/photo-1608975321561-176c1b187d24?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fGZhc2hpb24lMjBtYW58ZW58MHx8MHx8fDA%3D",
      },
    ],
  },
  {
    category: "School",
    posts: [
      {
        image:
          "https://images.unsplash.com/photo-1727399535326-65e21b522ccb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://images.unsplash.com/photo-1727400068319-565c56633dc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://plus.unsplash.com/premium_photo-1727456264026-13bbc29d49b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
      },
    ],
  },

  {
    category: "School",
    posts: [
      {
        image:
          "https://images.unsplash.com/photo-1727399535326-65e21b522ccb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://images.unsplash.com/photo-1727400068319-565c56633dc3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0fHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://plus.unsplash.com/premium_photo-1727456264026-13bbc29d49b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://images.unsplash.com/photo-1727252161075-0deb18037173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://images.unsplash.com/photo-1727252161075-0deb18037173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
      },
      {
        image:
          "https://images.unsplash.com/photo-1727252161075-0deb18037173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8",
      },
    ],
  },
];

const savedDetail = document.getElementById("savedDetail");
const editWorkshopInput = document.getElementById("editWorkshop--input");
const editWorkshopNameModal = document.getElementById("editWorkshopNameModal");
const newWorkshopNameModal = document.getElementById("newWorkshopNameModal");

function renderSavedPosts() {
  savedDetail.innerHTML = "";

  savedPosts.forEach((savedPost, i) => {
    const { posts, category } = savedPost;
    const dynamicClassName =
      posts.length === 1
        ? "saved_item_1"
        : posts.length === 2
        ? "saved_item_2"
        : posts.length === 3
        ? "saved_item_3"
        : posts.length >= 4
        ? "saved_item_4"
        : "";
    const moreLength = posts.length - 4;

    const markup = `
 
    <div class="saved-item border-2" data-workshop-id="${i}">
     <a href="/work.html">
      <div class="saved_top ${dynamicClassName}">
        ${
          posts.length === 0
            ? '<img class="cover__img" loading="lazy" src="/images/image-placeholder.png" alt="" />'
            : ""
        }
        ${posts
          .map(({ image }, i) => {
            if (i <= 2) {
              return `
                <img class="cover__img" loading="lazy" src="${image}" />
              `;
            } else {
              return `
                <div class="img-container">
                  <img class="cover__img" loading="lazy" src="${image}" />
                  ${
                    moreLength
                      ? `
                      <div class="img_container_overlay">
                        <span>+${moreLength}</span>
                      </div>
                    `
                      : ""
                  }
                </div>
              `;
            }
          })
          .join("")}
      </div>
     </a>
      <div class="saved_bottom">
        <div>
          <span id="title" class="text-dark font-medium text-xl">${category}</span>
          <div class="button">
            <button class="text-gray-500 text-sm font-regular" type="button">
              ${posts.length} Saved post${posts.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>

        <div>
          <div class="saved_option">
            <button class="border-2 toggle-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="toggle-icon" id="savedToggle" width="24" height="24" viewBox="0 0 24 24"><circle cx="6.5" cy="12" r="1.5" fill="#33363F" /><circle cx="12" cy="12" r="1.5" fill="#33363F" /><circle cx="17.5" cy="12" r="1.5" fill="#33363F" /></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="close-icon saved-hidden" id="savedClose" width="24" height="24" viewBox="0 0 20 20"><g fill="#33363F"><path d="M6.854 13.854a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708.708z" /><path d="M6.146 6.854a.5.5 0 1 1 .708-.708l7 7a.5.5 0 0 1-.708.708z" /></g></svg>
            </button>

            <div class="saved_dropdown" id="savedDropdown" aria-expanded="false">
              <button id="editWorkshopName">
                <img loading="lazy" src="icons/Edit.svg" class="size-6" />
                <span>Edit</span>
              </button>
              <button id="deleteWorkshopName">
                <img loading="lazy" src="icons/Trash.svg" class="size-6" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    savedDetail.insertAdjacentHTML("beforeend", markup);
  });

  const savedOptions = savedDetail.querySelectorAll(".saved_option");

  savedOptions.forEach((option) => {
    const button = option.querySelector(".toggle-button");
    const dropdown = option.querySelector("#savedDropdown");

    // Create Popper instance
    const popperInstance = Popper.createPopper(button, dropdown, {
      placement: "bottom-end",
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
      const isExpanded = dropdown.getAttribute("aria-expanded") === "true";
      dropdown.setAttribute("aria-expanded", !isExpanded);
      popperInstance.update();
    });
    // });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".saved_option")) {
        dropdown.setAttribute("aria-expanded", "false");
        popperInstance.update
          ? popperInstance.update()
          : console.log("No popper instance");
      }
    });
  });
}

setTimeout(() => renderSavedPosts(savedPosts), 1000);

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Saved Items
let editingContainerIndex;

savedDetail.addEventListener("click", (e) => {
  const target = e.target;

  // Show Dropdown
  const toggleButton = target.closest(".toggle-button");
  if (toggleButton) {
    const savedDropdown = toggleButton
      .closest(".saved_option")
      .querySelector("#savedDropdown");
    const state = JSON.parse(savedDropdown.ariaExpanded);
    const toggleIcon = toggleButton.querySelector("#savedToggle");
    const closeIcon = toggleButton.querySelector("#savedClose");

    if (!state) {
      closeAllSavedOption();

      savedDropdown.ariaExpanded = true;
      toggleIcon.classList.add(HIDDEN);
      closeIcon.classList.remove(HIDDEN);
    } else {
      closeAllSavedOption();
    }

    return;
  }

  // Edit Workshop filename
  const editWorkshopName = target.closest("#editWorkshopName");
  if (editWorkshopName) {
    editWorkshopNameModal.classList.remove(HIDDEN);

    const savedItem = target.closest(".saved-item");
    const workshopTitle = savedItem.querySelector("#title");
    editingContainerIndex = savedItem.dataset.workshopId;

    editWorkshopInput.value = workshopTitle.textContent;

    closeAllSavedOption(); // close all saved options
  }

  // Delete Workshop filename
  const deleteWorkshopName = target.closest("#deleteWorkshopName");
  if (deleteWorkshopName) {
    showGlobalDiscardModal();
    closeAllSavedOption(); // close all saved options
  }
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Filter
const filter = document.getElementById("filter");
const filterOption = document.getElementById("filterOption");

filter.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const lists = li?.closest("ul").querySelectorAll("li");

  if (li) {
    lists.forEach((li) => li.classList.remove("active-list"));
    li.classList.add("active-list");
  }

  if (!filterOption.classList.contains(HIDDEN)) {
    hideFilterOption();
  } else {
    filterOption.classList.remove(HIDDEN);
  }
});

function closeAllSavedOption() {
  const allSavedDropdown = document.querySelectorAll("#savedDropdown");
  const allToggleIcon = document.querySelectorAll("#savedToggle");
  const allCloseIcon = document.querySelectorAll("#savedClose");

  allSavedDropdown.forEach((dropdown) => (dropdown.ariaExpanded = false));
  allToggleIcon.forEach((toggle) => toggle.classList.remove(HIDDEN));
  allCloseIcon.forEach((close) => close.classList.add(HIDDEN));
}

function hideFilterOption() {
  filterOption.classList.add(HIDDEN);
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".saved_option")) {
    closeAllSavedOption();
  }

  if (!e.target.closest(".filter")) {
    hideFilterOption();
  }
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Edit Workshop Name
const cancelWorkshopEdit = document.getElementById("cancelWorkshopEdit");
const savedWorkshopEdit = document.getElementById("savedWorkshopEdit");

cancelWorkshopEdit.addEventListener("click", () => {
  editWorkshopNameModal.classList.add(HIDDEN);
});

savedWorkshopEdit.addEventListener("click", () => {
  const editingContainer = document.querySelector(
    `[data-workshop-id="${editingContainerIndex}"]`
  );

  editingContainer.querySelector("#title").textContent =
    editWorkshopInput.value;
  editWorkshopNameModal.classList.add(HIDDEN);
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// New Workshop Name
const cancelWorkshopNew = document.getElementById("cancelWorkshopNew");
const savedWorkshopNew = document.getElementById("savedWorkshopNew");
const newListBtn = document.getElementById("new-list-btn");

newListBtn.addEventListener("click", () => {
  newWorkshopNameModal.classList.remove(HIDDEN);
});

cancelWorkshopNew.addEventListener("click", () => {
  newWorkshopNameModal.classList.add(HIDDEN);
});

savedWorkshopNew.addEventListener("click", () => {
  const newFolderName = newWorkshopNameModal.querySelector("input").value;
  console.log(newFolderName);

  if (!newFolderName) return;

  savedPosts.push({
    category: newFolderName,
    posts: [],
  });

  // Re-render saved posts with updated data
  renderSavedPosts(savedPosts);

  newWorkshopNameModal.classList.add(HIDDEN);
});
