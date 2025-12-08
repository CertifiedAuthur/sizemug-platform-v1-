// Get Followers & Followings
async function getUsers(numUsers = 20) {
  const response = await fetch(
    `https://randomuser.me/api/?results=${numUsers}`
  );
  const data = await response.json();

  if (response.ok) {
    const users = data.results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.medium,
    }));

    return users;
  }
}

function handleSharedCollaborationItems(data, container) {
  container.innerHTML = "";

  data.forEach((d) => {
    const markup = `
      <li>
        <img src="${d.photo}" alt="${d.name}" />
        <h3>${d.name}</h3>
        <button aria-selected="false">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" /></svg>
        </button>
      </li>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

// IIFE
(() => {
  const sharedCollaborationContainerFollowers = document.querySelector(
    "#shared_collaboration_container--followers ul"
  );
  const sharedCollaborationContainerFollowing = document.querySelector(
    "#shared_collaboration_container--following ul"
  );
  const sharedCollaborationContainerSuggestions = document.querySelector(
    "#shared_collaboration_container--suggestions ul"
  );

  renderListItemSkeleton(sharedCollaborationContainerFollowers);
  renderListItemSkeleton(sharedCollaborationContainerFollowing);
  renderListItemSkeleton(sharedCollaborationContainerSuggestions);

  getUsers().then((res) => {
    handleSharedCollaborationItems(res, sharedCollaborationContainerFollowers);
  });

  getUsers().then((res) => {
    handleSharedCollaborationItems(res, sharedCollaborationContainerFollowing);
  });

  getUsers().then((res) => {
    handleSharedCollaborationItems(
      res,
      sharedCollaborationContainerSuggestions
    );
  });
})();

function renderListItemSkeleton(container) {
  Array.from({ length: 15 }, (_, i) => i + 1).map((item) => {
    const markup = `<li class="skeleton_loading" style="height: 3rem; border-radius: 10px; width: 100%"></li>`;
    container.insertAdjacentHTML("beforeend", markup);
  });
}

// // Events
// // Events
// // Events
const sharedCollaborationHeader = document.getElementById(
  "sharedCollaborationHeader"
);

sharedCollaborationHeader.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (button) {
    const { tab } = button.dataset;

    const btns = this.querySelectorAll("button");
    const container = document.getElementById(
      `shared_collaboration_container--${tab}`
    );
    const containers = document.querySelectorAll(
      ".shared_collaboration_container"
    );

    btns.forEach((btn) => btn.classList.remove("active"));
    containers.forEach((c) => c.classList.add(HIDDEN));

    button.classList.add("active");
    container.classList.remove(HIDDEN);
  }
});

const shareCollaborationModal = document.getElementById(
  "shareCollaborationModal"
);
shareCollaborationModal.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const isSelected =
      (button.getAttribute("aria-selected") || "false") === "true";

    if (isSelected) {
      button.setAttribute("aria-selected", false);
    } else {
      button.setAttribute("aria-selected", true);
    }
  }
});

///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////
///////////////////////////

const PAGEHIDDEN = "hidden-page";

const overlays = document.querySelectorAll(".overlay");
overlays.forEach((overlay) => {
  overlay.addEventListener("click", function (event) {
    if (event.target.classList.contains("overlay")) {
      overlay.classList.add(PAGEHIDDEN);
    }
  });
});

//////////////////////////////////////
///////// COLLABORATORS LIST /////////
//////////////////////////////////////
const collaboratorBtn = document.querySelector(".active_collaborators");
const notificationBellBtn = document.querySelector(".notification_bell");
const collaboratorContainer = document.querySelector(
  ".collaboration_events .collaborator_list"
);
const notificationContainer = document.querySelector(
  ".collaboration_events .request_list"
);
const cancelCollaboratorsTab = document.querySelector(
  ".collaborator_list .cancel-btn"
);
const cancelRequestTab = document.querySelector(".request_list .cancel-btn");
const shareController = document.querySelector(
  ".share_collaboration--controller"
);
const shareCancelBtn = document.querySelector(
  ".share_collaboration--modal .cancel"
);

collaboratorBtn.addEventListener("click", (event) => {
  shareController.classList.remove(PAGEHIDDEN);
});

shareCancelBtn.addEventListener("click", () => {
  shareController.classList.add(PAGEHIDDEN);
});

notificationBellBtn.addEventListener("click", () => {
  if (innerWidth < 667) {
    document.querySelector(".requests--mobile").classList.remove(PAGEHIDDEN);
  } else {
    notificationContainer.classList.toggle(PAGEHIDDEN);
  }

  notificationBellBtn.classList.toggle("hidden--active");
});

const requestBtn = document.querySelector(".request--btn");
requestBtn.addEventListener("click", () => {
  if (innerWidth < 667) {
    document
      .querySelector(".collaborators--mobile")
      .classList.remove(PAGEHIDDEN);
  } else {
    collaboratorContainer.classList.toggle(PAGEHIDDEN);
  }
  requestBtn.classList.toggle("hidden--active");
});

// Bookmark Event
const bookmarkBtn = document.querySelector(".btns .bookmark");
bookmarkBtn.addEventListener("click", () => {
  if (bookmarkBtn.classList.contains("bookmark--active")) {
    bookmarkBtn.classList.remove("bookmark--active");
  } else {
    bookmarkBtn.classList.add("bookmark--active");
  }
});

// Collaboration Generate List
Array.from({ length: 8 }, (_, i) => i + 1).map((c) => {
  const html = `
      <div class="collaborator">
        <div>
          <img
            src="https://images.unsplash.com/photo-1712847331906-fac48177f9f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
            alt=""
          />
          <h2>Wade Warren</h2>
        </div>

        <a href="#">Follow</a>
      </div>
  `;
  const container = document.querySelector(
    ".collaborators--mobile .collaborators"
  );

  container.insertAdjacentHTML("afterbegin", html);
});

// Request Generate List
Array.from({ length: 8 }, (_, i) => i + 1).map((c) => {
  const html = `
      <div class="collaborator">
        <div>
          <img
            src="https://images.unsplash.com/photo-1712847331906-fac48177f9f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
            alt=""
          />
          <h2>Wade Warren</h2>
        </div>

        <a href="#">Accept</a>
      </div>
  `;
  const container = document.querySelector(".requests--mobile .collaborators");

  container.insertAdjacentHTML("afterbegin", html);
});

// Hid Modal
const cancelBtns = document.querySelectorAll(".mobile_cancel--btn");
cancelBtns.forEach((cancel) =>
  cancel.addEventListener("click", () => {
    cancel.closest(".overlay").classList.add(PAGEHIDDEN);
  })
);
/////////////////////////////////
/// SHARE MODAL SELECT USERS ////
/////////////////////////////////
const shareHeaderBtns = document.querySelector(".modal_bar .btns");
const cancelModalButtons = document.querySelectorAll(
  ".share_collaboration--controller .cancel"
);
// const headerInviteBtn = document.querySelector(".collab_invite");
const showShareModal = document.querySelectorAll(".share--btn");
const shareModalLists = document.querySelector(".modal_lists");
const shareModal = document.querySelector(".share_collaboration--controller");
// const HIDDEN = "share-hidden";

// Hid Share Modal
cancelModalButtons.forEach((btn) =>
  btn.addEventListener("click", function () {
    shareModal.classList.add(PAGEHIDDEN);
  })
);

// Tab Switch Clicked
shareHeaderBtns.addEventListener("click", function (event) {
  const btns = shareHeaderBtns.querySelectorAll("button");

  // remove (modal_bar--active) from all buttons
  btns.forEach((btn) => btn.classList.remove("modal_bar--active"));

  // add (modal_bar--active) to the target element
  event.target.classList.add("modal_bar--active");
});

// Row Select
const CHECK = "modal_list--checked";

shareModalLists.addEventListener(
  "click",
  handleSharedModal.bind(shareModalLists)
);
function handleSharedModal(event) {
  const listRow = event.target.closest(".list_row");

  if (!listRow) return; // if listRow is undefined

  const checkBox = listRow.querySelector(".check");
  const checkBoxIcon = listRow.querySelector(".check i");

  if (
    listRow.classList.contains("list_row-all") &&
    !checkBox.classList.contains(CHECK)
  ) {
    const allRows = document.querySelectorAll(".modal_lists .check");

    allRows.forEach((row) => {
      row.classList.add(CHECK);
      row.querySelector("i").classList.remove(PAGEHIDDEN);
    });

    handleClassState(checkBox, "add", CHECK);
    handleClassState(checkBoxIcon, "remove", PAGEHIDDEN);
    return;
  }

  if (
    listRow.classList.contains("list_row-all") &&
    checkBox.classList.contains(CHECK)
  ) {
    const allRows = document.querySelectorAll(".modal_lists .check");

    allRows.forEach((row) => {
      row.classList.remove(CHECK);
      row.querySelector("i").classList.add(PAGEHIDDEN);
    });

    handleClassState(checkBox, "remove", CHECK);
    handleClassState(checkBoxIcon, "add", PAGEHIDDEN);
    return;
  }

  const overallCheck = document.querySelector(".list_row-all .check");
  const overallMark = overallCheck.querySelector("i");

  handleClassState(overallCheck, "remove", CHECK);
  handleClassState(overallMark, "add", PAGEHIDDEN);

  // Single Select
  if (!checkBox.classList.contains(CHECK)) {
    handleClassState(checkBox, "add", CHECK);
    handleClassState(checkBoxIcon, "remove", PAGEHIDDEN);
  } else {
    handleClassState(checkBox, "remove", CHECK);
    handleClassState(checkBoxIcon, "add", PAGEHIDDEN);
  }
}

function handleClassState(element, method, className) {
  element.classList[method](className);
}

////////////////////////////////
////////// EDIT TOOLS //////////
////////////////////////////////
const editToolContainer = document.querySelector(".edit_tools");
const allTools = document.querySelectorAll(".edit_tools .tool");

editToolContainer.addEventListener("click", function (event) {
  const tool = event.target.closest(".tool");

  if (tool.classList.contains("edit_tool--active")) {
    return tool.classList.remove("edit_tool--active");
  }

  allTools.forEach((tool) => tool.classList.remove("edit_tool--active"));
  tool.classList.add("edit_tool--active");
});

// TEXT COLOR PICKER EVENTS
const textColorPickerButton = document.getElementById("textColorPickerButton");
textColorPickerButton.addEventListener("click", function () {
  textColorPickerButton.querySelector("input").click();
});

// background COLOR PICKER EVENTS
const backgroundColorPickerButton = document.getElementById(
  "backgroundColorPickerButton"
);
backgroundColorPickerButton.addEventListener("click", function () {
  backgroundColorPickerButton.querySelector("input").click();
});

const pickerButton = document.querySelector(".multi-color #colorButton");

pickerButton.addEventListener("click", function (event) {
  const colorPicker = document.querySelector(".multi-color #colorPicker");

  colorPicker.click();
});

// Editor Formatter
function formatDoc(cmd, value = null) {
  if (value) {
    document.execCommand(cmd, false, value);
  } else {
    document.execCommand(cmd);
  }
}

const alignTextBtn = document.querySelector(".align_text");

alignTextBtn.addEventListener("click", function () {
  const alignmentContainer = document.querySelector(
    ".left_center_right--wrapper"
  );
  alignmentContainer.classList.toggle(PAGEHIDDEN);
});

////////////////////////////////
/// FIGMA LIKE EDITING TOOLS ///
////////////////////////////////
const toolsBtn = document.querySelector(".tools_container");
toolsBtn.addEventListener("click", (event) => {
  const btnClicked = event.target.closest(".tool");

  if (btnClicked) {
    const { tool } = btnClicked.dataset;

    const allTools = document.querySelectorAll(".collaboration_tool");
    const container = document.querySelector(`.collaboration_tool--${tool}`);

    // use to error in the case of arrow tool
    if (!container) return;

    if (container.classList.contains(PAGEHIDDEN)) {
      allTools.forEach((tool) => tool.classList.add(PAGEHIDDEN));
      container.classList.remove(PAGEHIDDEN);
    } else {
      container.classList.add(PAGEHIDDEN);
    }
  }
});

// SHAPE COLORS (CIRCLE)
const circleTool = document.querySelector(
  ".collaboration_tool--shapes .circles"
);

circleTool.addEventListener("click", (event) => {
  const allCircle = circleTool.querySelectorAll("button");

  // remove active state from all circle
  allCircle.forEach((circle) => circle.classList.remove("circle--active"));

  // add active state to the target element
  event.target.classList.add("circle--active");
});

// When document is click
document.addEventListener("click", (event) => {
  // collaboration lists
  if (
    !event.target.closest(".request--btn") &&
    !event.target.closest(".collaborator_list")
  ) {
    collaboratorContainer.classList.add(PAGEHIDDEN);
    requestBtn.classList.remove("hidden--active");

    return;
  }

  // collaboration requests
  if (
    !event.target.closest(".notification_bell") &&
    !event.target.closest(".request_list")
  ) {
    notificationContainer.classList.add(PAGEHIDDEN);
    notificationBellBtn.classList.remove("hidden--active");
    return;
  }

  if (
    !event.target.closest(".display_bars") &&
    !event.target.closest(".tools_container")
  ) {
    const collabs = document.querySelectorAll(".collaboration_tool");

    allTools.forEach((tool) => tool.classList.remove("edit_tool--active"));
    collabs.forEach((collab) => collab.classList.add(PAGEHIDDEN));

    return;
  }
});
