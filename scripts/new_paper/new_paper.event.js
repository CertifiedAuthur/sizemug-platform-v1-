const mainContainer = document.getElementById("main_container");

function toggleMobilePaperOptions(target) {
  const binParentWrapper = target.closest(".bin_parent_wrapper");
  const allBinParentWrapper = document.querySelectorAll(".bin_parent_wrapper");

  if (!containsClass(binParentWrapper, "show-buttons")) {
    allBinParentWrapper.forEach((parent) => removeClass(parent, "show-buttons"));
    addClass(binParentWrapper, "show-buttons");
  } else {
    removeClass(binParentWrapper, "show-buttons");
  }
}

function handleDeleting(container) {
  const identifier = Math.random().toString().split(".").at(-1);
  container.setAttribute("data-delete-template", identifier);

  const markup = `
      <div class="template_delete_wrapper" id="templateDeleteWrapper--${identifier}">
          <p>Are you sure you want to delete this paper?</p>

          <button role="button" id="permanentDeleteTemplate--${identifier}">
            <svg width="30" height="29" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 15L10.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M14.5 15L14.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M3.5 7H21.5V7C20.5681 7 20.1022 7 19.7346 7.15224C19.2446 7.35523 18.8552 7.74458 18.6522 8.23463C18.5 8.60218 18.5 9.06812 18.5 10V16C18.5 17.8856 18.5 18.8284 17.9142 19.4142C17.3284 20 16.3856 20 14.5 20H10.5C8.61438 20 7.67157 20 7.08579 19.4142C6.5 18.8284 6.5 17.8856 6.5 16V10C6.5 9.06812 6.5 8.60218 6.34776 8.23463C6.14477 7.74458 5.75542 7.35523 5.26537 7.15224C4.89782 7 4.43188 7 3.5 7V7Z" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M10.5681 3.37059C10.6821 3.26427 10.9332 3.17033 11.2825 3.10332C11.6318 3.03632 12.0597 3 12.5 3C12.9403 3 13.3682 3.03632 13.7175 3.10332C14.0668 3.17033 14.3179 3.26427 14.4319 3.37059" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
            <span>Delete</span>
          </button>
      </div>
`;

  container.insertAdjacentHTML("afterend", markup);

  const actionButton = document.querySelector(`#permanentDeleteTemplate--${identifier}`);
  const templateDeleteWrapper = document.querySelector(`#templateDeleteWrapper--${identifier}`);

  /** Delete the target template container & and generated temaplate wrapper */
  actionButton.addEventListener("click", () => {
    container.remove();
    templateDeleteWrapper.remove();
  });
}

mainContainer.addEventListener("click", (e) => {
  const target = e.target;

  const favouriteBtn = e.target.closest("#favourite_btn");
  if (favouriteBtn) {
    const isSelected = favouriteBtn.getAttribute("aria-selected") === "true";

    if (isSelected) {
      favouriteBtn.setAttribute("aria-selected", false);
    } else {
      favouriteBtn.setAttribute("aria-selected", true);
    }
    return;
  }

  // Options Button
  const optionBtn = target.closest(".temp_option--btn");
  const optionContainer = optionBtn?.querySelector(".temp_option");

  if (target.closest("#delete_action")) {
    const binParentWrapper = target.closest(".bin_parent_wrapper");

    if (binParentWrapper) {
      handleDeleting(binParentWrapper);
    }
    return;
  }

  // Add to Favourite
  const fav = e.target.closest(".add_favourite");
  if (fav) {
    const paperItem = fav.closest(".paper_item");
    const favouriteBtn = paperItem.querySelector("#favourite_btn");
    const isSelected = fav.getAttribute("aria-selected") === "true";

    if (isSelected) {
      favouriteBtn.setAttribute("aria-selected", false);
      fav.setAttribute("aria-selected", false);
      fav.querySelector("span").textContent = "Add to favourite";
    } else {
      favouriteBtn.setAttribute("aria-selected", true);
      fav.setAttribute("aria-selected", true);
      fav.querySelector("span").textContent = "Remove to favourite";
    }

    return;
  }

  // Delete Option
  const deleteBtn = target.closest("li.delete");
  if (deleteBtn) {
    addClass(optionContainer);
    return showGlobalDiscardModal();
  }

  // Share Option
  const shareBtn = target.closest("li.share");
  if (shareBtn) {
    addClass(optionContainer);
    return showGlobalShareFollowingModal();
  }

  if (optionBtn && innerWidth <= 667) {
    // Mobile Option Event
    toggleMobilePaperOptions(target);
    return;
  }

  if (optionBtn) {
    const ellipsisIcon = optionBtn.querySelector(".ellipsis");
    const cancelIcon = optionBtn.querySelector(".cancel");
    const optionContainer = optionBtn.querySelector(".temp_option");
    const optionStatus = JSON.parse(optionContainer.ariaExpanded);

    if (optionStatus) {
      addClass(optionContainer);
      addClass(cancelIcon);
      removeClass(ellipsisIcon);

      optionContainer.ariaExpanded = false;
    } else {
      closeAllTemplateOption();

      removeClass(optionContainer);
      removeClass(cancelIcon);
      addClass(ellipsisIcon);

      optionContainer.ariaExpanded = true;
    }

    return;
  }

  // Blank container Click
  if (e.target.closest(".blank_paper")) {
    localStorage.setItem("new-paper-match", false);
    location.href = "/paper-editing.html";
    return;
  }
});

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".temp_option--btn")) {
    closeAllTemplateOption();

    // For mobile device
    if (innerWidth <= 667) {
      const allBinParentWrapper = document.querySelectorAll(".bin_parent_wrapper");
      allBinParentWrapper.forEach((parent) => removeClass(parent, "show-buttons"));
      return;
    }
  }
});

function closeAllTemplateOption() {
  const allOptionsBtn = document.querySelectorAll(".temp_option--btn");

  allOptionsBtn.forEach((optionEl) => {
    const option = optionEl.querySelector(".temp_option");
    const ellipsisIcon = optionEl.querySelector(".ellipsis");
    const cancelIcon = optionEl.querySelector(".cancel");

    addClass(option);
    addClass(cancelIcon);
    removeClass(ellipsisIcon);
    option.ariaExpanded = false;
  });
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Show More Recent
const showMoreRecent = document.getElementById("show_more_recent");
const recentPapersContainer = document.getElementById("recent_papers--container");

showMoreRecent.addEventListener("click", () => {
  const recentPaperRow = createElement("div", "recent_paper_row");
  const recentPaperWholeMainContainer = createElement("div", "", "recent_paper_whole_main_container");
  const recentPaperItemContaner = createElement("div", "recent_paper_item--container", "recent_paper_item--container");

  const recentTemp = Array.from({ length: 20 }, (_, i) => i + 1);
  renderRecentTemplates(recentTemp, recentPaperItemContaner);
  recentPaperWholeMainContainer.appendChild(recentPaperItemContaner);
  recentPaperRow.appendChild(recentPaperWholeMainContainer);

  recentPapersContainer.appendChild(recentPaperRow);
});

function createElement(type, className = "", id = "") {
  const element = document.createElement(type);
  element.className = className;
  element.id = id;
  return element;
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
// Show More Favourites & Bins
const showMoreFavBin = document.getElementById("show_more_fav_bin");

showMoreFavBin.addEventListener("click", function (e) {
  // Here, I am using the sliding buttons to track which is currently active
  const favBtn = document.querySelector('[data-type="favourites"]');
  const binBtn = document.querySelector('[data-type="bins"]');

  if (containsClass(favBtn, "clicked")) {
    const fav = Array.from({ length: 10 }, (_, i) => i + 1);
    renderFavouritesTemplates(fav, false);
    return;
  }

  if (containsClass(binBtn, "clicked")) {
    const bins = Array.from({ length: 10 }, (_, i) => i + 1);
    renderBinsTemplates(bins);
    return;
  }
});
