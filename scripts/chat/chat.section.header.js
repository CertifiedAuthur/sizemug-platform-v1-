const chatSectionHeaders = document.querySelectorAll(".chatSectionHeader");
const settingsContainer = document.getElementById("settingsContainer");

chatSectionHeaders.forEach((header) => {
  const normalHeader = header.querySelector(".normal_header");
  const searchHeader = header.querySelector(".chat_search_header");

  header.addEventListener("click", (e) => {
    const searchButton = e.target.closest(".search-button");
    const settingsButton = e.target.closest(".settings-button");
    const backToNormalHeader = e.target.closest(".backToNormalHeader");

    // Back Normal Header
    if (backToNormalHeader) {
      searchHeader.classList.add(HIDDEN);
      normalHeader.classList.remove(HIDDEN);
      return;
    }

    // Search Button
    if (searchButton) {
      normalHeader.classList.add(HIDDEN);
      searchHeader.classList.remove(HIDDEN);
      return;
    }

    // Settings Button
    if (settingsButton) {
      hideAllChatSectionContainers();
      showSettingsAsideContainer();
    }
  });
});

function showSettingsAsideContainer() {
  settingsContainer.classList.remove(HIDDEN);
}
