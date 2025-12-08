// const HIDDEN = "paper-editing-hidden";

const matchingModal = document.getElementById("matching_modal");
const matchingListsUl = document.getElementById("matching_lists--ul");
let matchingData;

function renderSkeleton(container) {
  if (!container) throw new Error("No container found for skeleton rendering");

  const skeletonData = Array.from({ length: 30 }, (_, i) => i + 1);
  container.innerHTML = "";

  skeletonData.forEach((data) => {
    const html = `<div class="skeleton__loading" style="height: 100px"></div>`;
    container.insertAdjacentHTML("beforeend", html);
  });
}

function onWindowLoad() {
  const editingStatus = JSON.parse(localStorage.getItem("new-paper-match")) || false;

  if (editingStatus) {
    matchingModal.classList.remove(HIDDEN);

    // Update container content
    renderSkeleton(matchingListsUl); // render skeleton before start fetching
    window.matchingModal.generateMatchingRandomUsers().then((users) => {
      matchingData = users;

      renderMatchingList(users); // update user lists
      updateSlickListItems(users); // update slick to fetched items
    });
  } else {
    matchingModal.classList.add(HIDDEN);
  }

  localStorage.removeItem("new-paper-match");
}

onWindowLoad();

// Overlay close listen
function handleAllOverlay() {
  document.querySelectorAll(".overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target.classList.contains("overlay")) {
        overlay.classList.add(HIDDEN);
      }
    });
  });
}

handleAllOverlay();

/**
 *
 * @param {HTMLElement} htmlElement - 'div' | 'h1' | 'article' | .....
 * @param {*} className - class name to be assign
 * @param {*} id - id to be assign
 * @returns
 */
function createElement(htmlElement, className = "", id = "") {
  const element = document.createElement(htmlElement);
  element.classList.add(...className.split(" "));
  element.id = id;
  return element;
}
