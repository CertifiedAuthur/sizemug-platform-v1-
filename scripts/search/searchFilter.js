/**
 *
 *
 *
 *
 * Interest Filter Modals
 *
 *
 *
 *
 */

function renderInterestsFilter() {
  const interestsFiltersList = document.getElementById("interestsFiltersList");

  interestsFiltersList.innerHTML = "";
  sizemugGlobalInterests.forEach((int) => {
    const markup = `
      <label class="interest_list__item" for="${int.value}">
        <input id="${int.value}" name="${int.value}" type="checkbox" hidden />
        <span>${int.label}</span>
      </label>
    `;

    interestsFiltersList.insertAdjacentHTML("beforeend", markup);
  });
}
renderInterestsFilter();

// Interest
const accountInterestFilter = document.getElementById("accountInterestFilter");
const showAccountInterest = document.querySelectorAll(".showAccountInterest");

accountInterestFilter.addEventListener("click", (e) => {
  if (e.target.id === "accountInterestFilter") {
    return accountInterestFilter.classList.add(HIDDEN);
  }
});
showAccountInterest.forEach((button) => {
  button.addEventListener("click", () => {
    accountInterestFilter.classList.remove(HIDDEN);
  });
});

const filterCategoriesItem = document.querySelectorAll(".filter_categories-item");

filterCategoriesItem.forEach(function (filterCat) {
  filterCat.addEventListener("click", function (e) {
    const listItem = e.target.closest("li");
    if (listItem) {
      const content = listItem.textContent;
      filterCat.querySelector(".ellipsis").textContent = content;
      filterCat.removeAttribute("aria-expanded");
      return;
    }

    const filterCategoriesItem = e.target.closest(".filter_categories-item");
    if (filterCategoriesItem) {
      filterCategoriesItem.setAttribute("aria-expanded", true);
      return;
    }
  });
});

// outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".filter_categories-item")) {
    filterCategoriesItem.forEach(function (filterCat) {
      filterCat.removeAttribute("aria-expanded");
    });
  }
});

/**
 *
 *
 *
 *
 * Tab Options
 *
 *
 *
 *
 */

const tabCategories = document.getElementById("tabCategories");
tabCategories.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  const allLists = tabCategories.querySelectorAll("li");

  if (li) {
    const { tabCategory } = li.dataset;

    allLists.forEach((li) => li.removeAttribute("data-active"));
    li.setAttribute("data-active", true);

    if (tabCategory === "top") return showTopCategory();
    if (tabCategory === "creators") return showCreatorCategory();
    if (tabCategory === "accounts") return showAccountsCategory();
    if (tabCategory === "posts") return showPostsCategory();
    if (tabCategory === "live") return showLiveCategory();
  }
});

const creatorsCategory = document.getElementById("creatorsCategory");
const postsCategory = document.getElementById("postsCategory");
const livesCategory = document.getElementById("livesCategory");
const creatorsAndAccount = document.getElementById("creatorsAndAccount");
const accountCategory = document.getElementById("accountCategory");

function showTopCategory() {
  const asideCreators = document.getElementById("asideCreators");
  const asideAccount = document.getElementById("asideAccount");
  const asidePosts = document.getElementById("asidePosts");
  const asideLiveStream = document.getElementById("asideLiveStream");

  hideAllCategory();

  asideCreators.classList.remove(HIDDEN);
  asideAccount.classList.remove(HIDDEN);
  asidePosts.classList.remove(HIDDEN);
  asideLiveStream.classList.remove(HIDDEN);

  creatorsAndAccount.classList.remove(HIDDEN);
  postsCategory.classList.remove(HIDDEN);
  livesCategory.classList.remove(HIDDEN);
}

function showCreatorCategory() {
  const asideContainer = document.querySelectorAll(".aside_container");
  const asideCreators = document.getElementById("asideCreators");

  hideAllCategory();

  asideContainer.forEach((container) => container.classList.add(HIDDEN));
  asideCreators.classList.remove(HIDDEN);
  creatorsCategory.classList.remove(HIDDEN);
}

function showAccountsCategory() {
  const asideAccount = document.getElementById("asideAccount");
  hideAllCategory();

  asideAccount.classList.remove(HIDDEN);
  accountCategory.classList.remove(HIDDEN);
}

function showPostsCategory() {
  const asidePosts = document.getElementById("asidePosts");
  hideAllCategory();

  asidePosts.classList.remove(HIDDEN);
  postsCategory.classList.remove(HIDDEN);
}

function showLiveCategory() {
  const asideLiveStream = document.getElementById("asideLiveStream");
  hideAllCategory();

  asideLiveStream.classList.remove(HIDDEN);
  livesCategory.classList.remove(HIDDEN);
}

function hideAllCategory() {
  const categoryItems = document.querySelectorAll(".category_item");
  const asideContainer = document.querySelectorAll(".aside_container");

  asideContainer.forEach((container) => container.classList.add(HIDDEN));
  categoryItems.forEach((category) => category.classList.add(HIDDEN));
}
