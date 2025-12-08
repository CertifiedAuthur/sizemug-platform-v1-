const titles = ["Project Plan", "Marketing Strategy", "Budget Report", "Team Meeting Notes", "Sales Report", "Client Presentation", "Annual Review", "Employee Onboarding", "Performance Analysis", "Work Schedule"];
const categories = ["Work", "Marketing", "Finance", "Sales", "HR", "Marketing", "Finance", "Sales", "HR", "Marketing", "Finance", "Sales", "HR", "Sales", "HR"];

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getSuggestionsTemplates() {
  const response = await fetch("https://jsonplaceholder.typicode.com/photos?_limit=15");
  const data = await response.json();

  function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const suggestingTemplates = [];

  for (let i = 0; i < 15; i++) {
    suggestingTemplates.push({
      name: getRandomItem(titles),
      category: getRandomItem(categories),
      image: data[i].url,
    });
  }

  return suggestingTemplates;
}

const templateListsScroller = document.getElementById("template_lists_scroller");

function renderSuggestionTemplatesSkeleton() {
  const suggest = Array.from({ length: 15 });

  suggest.forEach((s) => {
    const markup = `<div class="skeleton_loading suggestion_skeleton"></div>`;
    templateListsScroller.insertAdjacentHTML("beforeend", markup);
  });
}

function renderSuggestingTemplates() {
  // skeleton
  renderSuggestionTemplatesSkeleton();

  getSuggestionsTemplates().then((data) => {
    templateListsScroller.innerHTML = ""; // clear skeleton

    data.forEach((tem, i) => {
      const markup = `
             <div class="template_item">
                <div class="paper_container" role="button">
                  <img src="/images/suggestion_new_paper.png" alt="${tem.name}" />
                </div>

                <div class="below_content">
                  <span class="template_title">${tem.name}</span>
                  <span class="template_category">${categories[i]}</span>
                </div>
              </div>
        `;
      templateListsScroller.insertAdjacentHTML("afterbegin", markup);
    });

    // Append Blank
    const blankMark = `
              <div class="template_item blank_paper">
                <div class="paper_container" role="button">
                  <div class="plus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="white" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z" /></svg>
                  </div>
                </div>

                <div class="below_content">
                  <span class="template_title">Blank paper sh d7 8jk</span>
                  <span class="template_category">Work</span>
                </div>
              </div>
    `;
    templateListsScroller.insertAdjacentHTML("afterbegin", blankMark);

    const findMatchSkeleton = document.querySelector(".find_match_skeleton");
    const findAMatch = document.getElementById("find_a_match");
    findMatchSkeleton.remove();
    removeClass(findAMatch);
  });
}
renderSuggestingTemplates();

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
/////////////// RECENT TEMPLATES //////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const recentPaperItemContainer = document.getElementById("recent_paper_item--container");
const getValue = () => Math.floor(Math.random() * 255 + 1);
const getColor = () => {
  const random1 = getValue();
  const random2 = getValue();
  const random3 = getValue();
  return `rgb(${random1},${random2},${random3})`;
};

function renderRecentTemplates(data, container) {
  container.innerHTML = "";

  data.forEach((tem) => {
    const num = getRandomNumber(2, 4);

    const markup = `
                  <div class="paper_item">
                    <img class="template_image" src="/images/pdf_image--${num}.png" alt="" />

                    <button id="favourite_btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="#6D7A8F" fill-rule="evenodd" d="M11.292 3.308c-.394.514-.838 1.308-1.484 2.466l-.327.587l-.059.106c-.3.54-.555.998-.964 1.308c-.413.314-.917.427-1.503.559l-.114.026l-.636.144c-1.255.284-2.11.479-2.694.71c-.571.224-.691.409-.737.556c-.049.156-.05.395.29.937c.347.55.932 1.236 1.786 2.236l.434.507l.075.087c.403.47.739.862.893 1.358c.153.493.102 1.01.04 1.638l-.01.117l-.066.677c-.13 1.332-.216 2.25-.187 2.91c.03.66.169.842.28.926c.098.075.28.157.873-.013c.603-.172 1.405-.539 2.58-1.08l.596-.274l.109-.05c.545-.253 1.017-.471 1.533-.471s.988.218 1.533.47q.053.026.11.05l.595.275c1.175.541 1.977.908 2.58 1.08c.593.17.775.088.873.013c.111-.084.25-.267.28-.926c.03-.66-.058-1.578-.187-2.91l-.066-.677l-.01-.117c-.062-.628-.113-1.145.04-1.638c.154-.496.49-.888.893-1.358l.075-.087l.434-.507c.854-1 1.439-1.686 1.785-2.236c.341-.542.34-.78.291-.937c-.046-.147-.166-.332-.737-.556c-.585-.231-1.439-.426-2.694-.71l-.636-.144l-.114-.026c-.586-.132-1.09-.245-1.503-.559c-.41-.31-.663-.767-.964-1.308l-.058-.106l-.328-.587c-.646-1.158-1.09-1.952-1.484-2.466S12.114 2.75 12 2.75s-.315.044-.708.558m-1.19-.912C10.577 1.774 11.166 1.25 12 1.25s1.422.524 1.899 1.146c.468.612.965 1.503 1.572 2.592l.359.643c.392.704.493.854.619.95c.12.091.277.143 1.04.316l.7.158c1.176.266 2.145.485 2.85.763c.732.289 1.373.714 1.62 1.507c.244.785-.03 1.507-.454 2.18c-.412.655-1.07 1.425-1.874 2.365l-.475.555c-.517.604-.625.752-.676.915c-.051.167-.047.36.032 1.165l.071.738c.122 1.256.221 2.28.186 3.06c-.035.795-.215 1.557-.87 2.055c-.668.506-1.445.45-2.195.234c-.727-.208-1.633-.625-2.733-1.132l-.656-.302c-.718-.33-.871-.383-1.015-.383s-.297.053-1.015.383l-.655.302c-1.101.507-2.007.924-2.734 1.132c-.75.215-1.527.272-2.194-.234c-.656-.498-.836-1.26-.871-2.054c-.035-.78.064-1.805.186-3.06l.072-.739c.078-.806.082-.998.03-1.165c-.05-.163-.158-.31-.675-.915l-.475-.555c-.803-.94-1.461-1.71-1.873-2.364c-.425-.674-.699-1.396-.455-2.181c.247-.793.888-1.218 1.62-1.507c.705-.278 1.674-.497 2.85-.763l.063-.014l.636-.144c.764-.173.92-.225 1.041-.317c.126-.095.227-.245.62-.949l.358-.643c.607-1.09 1.104-1.98 1.572-2.592" clip-rule="evenodd"/></svg>
                    </button>

                    <div class="paper_info">
                      <div class="user_on_paper">
                        <img src="images/suggestion--2.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--3.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--5.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--1.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--4.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--3.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--5.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <div class="user_on_paper--more">+3</div>
                      </div>

                      <div class="desc">
                        <div>
                          <h3>SSG 226 Assignment 1.do…</h3>
                          <p>Edited <span>2 min ago</span></p>
                        </div>

                        <button class="temp_option--btn">
                          <div class="temp_option new-paper-hidden" aria-expanded="false">
                            <ul>
                              <li class="edit-filename">
                                <img src="/icons/edit_light.svg" alt="" />
                                <span>Edit filename</span>
                              </li>
                              <li class="share">
                                <img src="/icons/collaboration.svg" alt="" />
                                <span>Share</span>
                              </li>
                              <li class="add_favourite" aria-selected="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#33363F" fill-rule="evenodd" d="M11.292 3.308c-.394.514-.838 1.308-1.484 2.466l-.327.587l-.059.106c-.3.54-.555.998-.964 1.308c-.413.314-.917.427-1.503.559l-.114.026l-.636.144c-1.255.284-2.11.479-2.694.71c-.571.224-.691.409-.737.556c-.049.156-.05.395.29.937c.347.55.932 1.236 1.786 2.236l.434.507l.075.087c.403.47.739.862.893 1.358c.153.493.102 1.01.04 1.638l-.01.117l-.066.677c-.13 1.332-.216 2.25-.187 2.91c.03.66.169.842.28.926c.098.075.28.157.873-.013c.603-.172 1.405-.539 2.58-1.08l.596-.274l.109-.05c.545-.253 1.017-.471 1.533-.471s.988.218 1.533.47q.053.026.11.05l.595.275c1.175.541 1.977.908 2.58 1.08c.593.17.775.088.873.013c.111-.084.25-.267.28-.926c.03-.66-.058-1.578-.187-2.91l-.066-.677l-.01-.117c-.062-.628-.113-1.145.04-1.638c.154-.496.49-.888.893-1.358l.075-.087l.434-.507c.854-1 1.439-1.686 1.785-2.236c.341-.542.34-.78.291-.937c-.046-.147-.166-.332-.737-.556c-.585-.231-1.439-.426-2.694-.71l-.636-.144l-.114-.026c-.586-.132-1.09-.245-1.503-.559c-.41-.31-.663-.767-.964-1.308l-.058-.106l-.328-.587c-.646-1.158-1.09-1.952-1.484-2.466S12.114 2.75 12 2.75s-.315.044-.708.558m-1.19-.912C10.577 1.774 11.166 1.25 12 1.25s1.422.524 1.899 1.146c.468.612.965 1.503 1.572 2.592l.359.643c.392.704.493.854.619.95c.12.091.277.143 1.04.316l.7.158c1.176.266 2.145.485 2.85.763c.732.289 1.373.714 1.62 1.507c.244.785-.03 1.507-.454 2.18c-.412.655-1.07 1.425-1.874 2.365l-.475.555c-.517.604-.625.752-.676.915c-.051.167-.047.36.032 1.165l.071.738c.122 1.256.221 2.28.186 3.06c-.035.795-.215 1.557-.87 2.055c-.668.506-1.445.45-2.195.234c-.727-.208-1.633-.625-2.733-1.132l-.656-.302c-.718-.33-.871-.383-1.015-.383s-.297.053-1.015.383l-.655.302c-1.101.507-2.007.924-2.734 1.132c-.75.215-1.527.272-2.194-.234c-.656-.498-.836-1.26-.871-2.054c-.035-.78.064-1.805.186-3.06l.072-.739c.078-.806.082-.998.03-1.165c-.05-.163-.158-.31-.675-.915l-.475-.555c-.803-.94-1.461-1.71-1.873-2.364c-.425-.674-.699-1.396-.455-2.181c.247-.793.888-1.218 1.62-1.507c.705-.278 1.674-.497 2.85-.763l.063-.014l.636-.144c.764-.173.92-.225 1.041-.317c.126-.095.227-.245.62-.949l.358-.643c.607-1.09 1.104-1.98 1.572-2.592" clip-rule="evenodd"></path></svg>
                                <span>Add to favourite</span>
                              </li>
                              <li class="delete">
                                <img src="/icons/bin_icon_paper.svg" alt="" />
                                <span>Delete</span>
                              </li>
                            </ul>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="ellipsis" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#33363F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" class="cancel new-paper-hidden" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="black" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
    `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

renderTemplatesSkeleton(recentPaperItemContainer);

setTimeout(() => {
  const recentTemp = Array.from({ length: 20 }, (_, i) => i + 1);
  renderRecentTemplates(recentTemp, recentPaperItemContainer);
}, 3000);

///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
///////////////
function renderTemplatesSkeleton(container) {
  const ske = Array.from({ length: 20 }, (_, i) => i + 1);

  ske.forEach((s) => {
    const markup = '<div class="skeleton_loading recent_skeleton"></div>';
    container.insertAdjacentHTML("afterbegin", markup);
  });
}

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////// Favourite Items /////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const favouriteItemsContainer = document.getElementById("favourite_items");

function renderFavouritesTemplates(data, clean = true) {
  if (clean) {
    favouriteItemsContainer.innerHTML = ""; // clear skeleton
  }

  data.forEach((d) => {
    const num = getRandomNumber(2, 4);

    const markup = `
                  <div class="paper_item">
                    <img class="template_image" src="/images/pdf_image--${num}.png" alt="" />

                    <button id="favourite_btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="#6D7A8F" fill-rule="evenodd" d="M11.292 3.308c-.394.514-.838 1.308-1.484 2.466l-.327.587l-.059.106c-.3.54-.555.998-.964 1.308c-.413.314-.917.427-1.503.559l-.114.026l-.636.144c-1.255.284-2.11.479-2.694.71c-.571.224-.691.409-.737.556c-.049.156-.05.395.29.937c.347.55.932 1.236 1.786 2.236l.434.507l.075.087c.403.47.739.862.893 1.358c.153.493.102 1.01.04 1.638l-.01.117l-.066.677c-.13 1.332-.216 2.25-.187 2.91c.03.66.169.842.28.926c.098.075.28.157.873-.013c.603-.172 1.405-.539 2.58-1.08l.596-.274l.109-.05c.545-.253 1.017-.471 1.533-.471s.988.218 1.533.47q.053.026.11.05l.595.275c1.175.541 1.977.908 2.58 1.08c.593.17.775.088.873.013c.111-.084.25-.267.28-.926c.03-.66-.058-1.578-.187-2.91l-.066-.677l-.01-.117c-.062-.628-.113-1.145.04-1.638c.154-.496.49-.888.893-1.358l.075-.087l.434-.507c.854-1 1.439-1.686 1.785-2.236c.341-.542.34-.78.291-.937c-.046-.147-.166-.332-.737-.556c-.585-.231-1.439-.426-2.694-.71l-.636-.144l-.114-.026c-.586-.132-1.09-.245-1.503-.559c-.41-.31-.663-.767-.964-1.308l-.058-.106l-.328-.587c-.646-1.158-1.09-1.952-1.484-2.466S12.114 2.75 12 2.75s-.315.044-.708.558m-1.19-.912C10.577 1.774 11.166 1.25 12 1.25s1.422.524 1.899 1.146c.468.612.965 1.503 1.572 2.592l.359.643c.392.704.493.854.619.95c.12.091.277.143 1.04.316l.7.158c1.176.266 2.145.485 2.85.763c.732.289 1.373.714 1.62 1.507c.244.785-.03 1.507-.454 2.18c-.412.655-1.07 1.425-1.874 2.365l-.475.555c-.517.604-.625.752-.676.915c-.051.167-.047.36.032 1.165l.071.738c.122 1.256.221 2.28.186 3.06c-.035.795-.215 1.557-.87 2.055c-.668.506-1.445.45-2.195.234c-.727-.208-1.633-.625-2.733-1.132l-.656-.302c-.718-.33-.871-.383-1.015-.383s-.297.053-1.015.383l-.655.302c-1.101.507-2.007.924-2.734 1.132c-.75.215-1.527.272-2.194-.234c-.656-.498-.836-1.26-.871-2.054c-.035-.78.064-1.805.186-3.06l.072-.739c.078-.806.082-.998.03-1.165c-.05-.163-.158-.31-.675-.915l-.475-.555c-.803-.94-1.461-1.71-1.873-2.364c-.425-.674-.699-1.396-.455-2.181c.247-.793.888-1.218 1.62-1.507c.705-.278 1.674-.497 2.85-.763l.063-.014l.636-.144c.764-.173.92-.225 1.041-.317c.126-.095.227-.245.62-.949l.358-.643c.607-1.09 1.104-1.98 1.572-2.592" clip-rule="evenodd"/></svg>
                    </button>

                    <div class="paper_info">
                      <div class="user_on_paper">
                        <img src="images/suggestion--2.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--3.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--5.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--1.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--4.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--3.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <img src="images/suggestion--5.png" alt="" style="border: 2px solid ${getRandomGeneratedColor()}" />
                        <div class="user_on_paper--more">+3</div>
                      </div>

                      <div class="desc">
                        <div>
                          <h3>SSG 226 Assignment 1.do…</h3>
                          <p>Edited <span>2 min ago</span></p>
                        </div>

                        <button class="temp_option--btn">
                          <div class="temp_option new-paper-hidden" aria-expanded="false">
                            <ul>
                              <li>
                                <img src="/icons/edit_light.svg" alt="" />
                                <span>Edit filename</span>
                              </li>
                              <li>
                                <img src="/icons/collaboration.svg" alt="" />
                                <span>Share</span>
                              </li>
                              <li>
                                <img src="/icons/fav_icon_paper.svg" alt="" />
                                <span>Add to favourite</span>
                              </li>
                              <li>
                                <img src="/icons/bin_icon_paper.svg" alt="" />
                                <span>Delete</span>
                              </li>
                            </ul>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" class="ellipsis" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#33363F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" class="cancel new-paper-hidden" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="black" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
    `;

    favouriteItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
}
renderTemplatesSkeleton(favouriteItemsContainer);

/**
 * @param {Object} data - favourites fetched data
 * This function handles mobile display of favourite tamples
 */
function renderFavouritesTemplateMobile(data) {
  favouriteItemsContainer.innerHTML = "";

  data.forEach((d) => {
    const num = getRandomNumber(2, 4);

    const markup = `
    <div class="bin_parent_wrapper">
              <div class="bin_item" role="button">
                <div class="left_hand">
                  <img src="/images/pdf_image--${num}.png" alt="" />
                  <div>
                    <h2>UI design planning</h2>
                    <p>Deleted 2 days ago</p>
                  </div>
                </div>

                <div id="option_wrapper">
                  <button class="temp_option--btn">
                      <div class="temp_option temp_option_bin new-paper-hidden" aria-expanded="false">
                        <ul>
                          <li>
                            <img src="/icons/newPaper/redo.svg" alt="" />
                            <span>Restore</span>
                          </li>
                          <li>
                            <img src="/icons/bin_icon_paper.svg" alt="" />
                            <span>Delete permanently </span>
                          </li>
                        </ul>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" class="ellipsis" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#33363F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" class="cancel new-paper-hidden" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="black" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>
                  </button>

                   <button>
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#filter0_dd_5070_115946)">
                    <path d="M10.1443 6.62704C10.931 4.66605 11.3243 3.68555 12.0006 3.68555C12.6769 3.68555 13.0702 4.66605 13.8568 6.62705L13.8934 6.71836C14.3378 7.82623 14.56 8.38016 15.0129 8.71685C15.4657 9.05354 16.0602 9.10678 17.2491 9.21326L17.464 9.2325C19.4099 9.40677 20.3828 9.4939 20.5909 10.1129C20.7991 10.7319 20.0766 11.3892 18.6316 12.7039L18.1493 13.1427C17.4178 13.8082 17.052 14.1409 16.8815 14.5771C16.8497 14.6584 16.8233 14.7418 16.8024 14.8266C16.6903 15.2813 16.7975 15.764 17.0117 16.7295L17.0783 17.03C17.472 18.8043 17.6688 19.6915 17.3252 20.0741C17.1967 20.2171 17.0298 20.3201 16.8444 20.3707C16.3482 20.5061 15.6437 19.932 14.2348 18.7839C13.3096 18.0301 12.847 17.6531 12.3159 17.5683C12.107 17.535 11.8941 17.535 11.6852 17.5683C11.1541 17.6531 10.6915 18.0301 9.76638 18.7839C8.35742 19.932 7.65295 20.5061 7.15675 20.3707C6.97133 20.3201 6.80442 20.2171 6.676 20.0741C6.33232 19.6915 6.52915 18.8043 6.92283 17.03L6.9895 16.7295C7.20371 15.764 7.31082 15.2813 7.19876 14.8266C7.17786 14.7418 7.15142 14.6584 7.11962 14.5771C6.94915 14.1409 6.5834 13.8082 5.85189 13.1427L5.36961 12.7039C3.92456 11.3892 3.20204 10.7319 3.41022 10.1129C3.6184 9.4939 4.59131 9.40677 6.53712 9.2325L6.75206 9.21326C7.94097 9.10678 8.53543 9.05354 8.98828 8.71685C9.44113 8.38016 9.66333 7.82623 10.1077 6.71836L10.1443 6.62704Z" fill="#F59E0B"/></g><defs><filter id="filter0_dd_5070_115946" x="0.375" y="1.68555" width="23.25" height="22.7051" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_5070_115946"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="1.5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="effect1_dropShadow_5070_115946" result="effect2_dropShadow_5070_115946"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_5070_115946" result="shape"/></filter></defs></svg>
                  </button>
                </div>
              </div>
${
  innerWidth < 667
    ? ` <div class="mobile_option">
                <button class="edit">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.47822 19.477L6.47823 19.477L6.50872 19.4694L9.13235 18.8135C9.1493 18.8092 9.16631 18.805 9.18337 18.8008C9.39887 18.7473 9.6224 18.6918 9.82634 18.5764C10.0303 18.4609 10.1928 18.2978 10.3495 18.1405C10.362 18.128 10.3743 18.1156 10.3867 18.1033L17.5808 10.9092L17.5808 10.9092L17.6109 10.8791C17.9183 10.5717 18.1968 10.2933 18.3923 10.037C18.6065 9.75633 18.7858 9.4217 18.7858 9C18.7858 8.5783 18.6065 8.24367 18.3923 7.96296C18.1968 7.70674 17.9183 7.42829 17.6109 7.12091L17.5808 7.09081L17.0858 7.58579L17.5808 7.09081L17.4092 6.91924L17.3791 6.88912C17.0717 6.58168 16.7933 6.30318 16.537 6.1077C16.2563 5.89352 15.9217 5.71421 15.5 5.71421C15.0783 5.71421 14.7437 5.89352 14.463 6.1077C14.2067 6.30319 13.9283 6.58168 13.6209 6.88913L13.5908 6.91924L14.0731 7.40152L13.5908 6.91924L6.39674 14.1133C6.38438 14.1257 6.37197 14.138 6.35951 14.1505C6.20223 14.3072 6.03909 14.4697 5.92362 14.6737C5.80816 14.8776 5.7527 15.1011 5.69924 15.3166C5.695 15.3337 5.69078 15.3507 5.68654 15.3677L5.02301 18.0218C5.02046 18.032 5.01785 18.0424 5.01521 18.0529C4.97714 18.2047 4.93167 18.386 4.91641 18.5421C4.89924 18.7176 4.89868 19.055 5.17184 19.3282C5.445 19.6013 5.78241 19.6008 5.95793 19.5836C6.11397 19.5683 6.29528 19.5229 6.44709 19.4848C6.45761 19.4821 6.46799 19.4795 6.47822 19.477Z" stroke="white" stroke-width="1.4"/><path d="M13 7.5L17 11.5" stroke="white" stroke-width="1.4"/></svg>
                    <span>Edit</span>
                </button>

                 <button class="remove">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 3V2.3H2.8V3H3.5ZM13.005 13.495C13.2784 13.7683 13.7216 13.7683 13.995 13.495C14.2683 13.2216 14.2683 12.7784 13.995 12.505L13.005 13.495ZM4.2 11V3H2.8V11H4.2ZM3.5 3.7H11.5V2.3H3.5V3.7ZM3.00503 3.49497L13.005 13.495L13.995 12.505L3.99497 2.50503L3.00503 3.49497Z" fill="white"/><path d="M4.5 15V15C4.5 16.8692 4.5 17.8038 4.90192 18.5C5.16523 18.9561 5.54394 19.3348 6 19.5981C6.69615 20 7.63077 20 9.5 20H14.5C17.3284 20 18.7426 20 19.6213 19.1213C20.5 18.2426 20.5 16.8284 20.5 14V9C20.5 7.13077 20.5 6.19615 20.0981 5.5C19.8348 5.04394 19.4561 4.66523 19 4.40192C18.3038 4 17.3692 4 15.5 4V4" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
                    <span>Remove</span>
                </button>

                 <button class="delete" id="delete_action">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 15L10.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M14.5 15L14.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M3.5 7H21.5V7C20.5681 7 20.1022 7 19.7346 7.15224C19.2446 7.35523 18.8552 7.74458 18.6522 8.23463C18.5 8.60218 18.5 9.06812 18.5 10V16C18.5 17.8856 18.5 18.8284 17.9142 19.4142C17.3284 20 16.3856 20 14.5 20H10.5C8.61438 20 7.67157 20 7.08579 19.4142C6.5 18.8284 6.5 17.8856 6.5 16V10C6.5 9.06812 6.5 8.60218 6.34776 8.23463C6.14477 7.74458 5.75542 7.35523 5.26537 7.15224C4.89782 7 4.43188 7 3.5 7V7Z" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M10.5681 3.37059C10.6821 3.26427 10.9332 3.17033 11.2825 3.10332C11.6318 3.03632 12.0597 3 12.5 3C12.9403 3 13.3682 3.03632 13.7175 3.10332C14.0668 3.17033 14.3179 3.26427 14.4319 3.37059" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
                    <span>Delete</span>
                </button>
              </div>`
    : ""
}
    <div>

    `;

    favouriteItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
}

const favData = Array.from({ length: 10 }, (_, i) => i + 1);

setTimeout(() => {
  if (innerWidth <= 667) {
    renderFavouritesTemplateMobile(favData);
  } else {
    renderFavouritesTemplates(favData);
  }
}, 2000);

window.addEventListener("resize", () => {
  if (innerWidth <= 667) {
    renderFavouritesTemplateMobile(favData);
  } else {
    renderFavouritesTemplates(favData);
  }
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
//////////////////// Bin Items ////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
const binsItemsContainer = document.getElementById("bin_items");

function renderBinsTemplates(data) {
  data.forEach((d) => {
    const num = getRandomNumber(2, 4);

    const markup = `
    <div class="bin_parent_wrapper">
              <div class="bin_item" role="button">
                <div class="left_hand">
                  <img src="/images/pdf_image--${num}.png" alt="" />
                  <div>
                    <h2>UI design planning</h2>
                    <p>Deleted 2 days ago</p>
                  </div>
                </div>

                <button class="temp_option--btn">
                    <div class="temp_option temp_option_bin new-paper-hidden" aria-expanded="false">
                      <ul>
                        <li>
                          <img src="/icons/newPaper/redo.svg" alt="" />
                          <span>Restore</span>
                        </li>
                        <li>
                          <img src="/icons/bin_icon_paper.svg" alt="" />
                          <span>Delete permanently </span>
                        </li>
                      </ul>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="ellipsis" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#33363F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="cancel new-paper-hidden" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="black" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>
                </button>
              </div>
${
  innerWidth < 667
    ? ` <div class="mobile_option">
                <button class="remove">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 8.5L4.00502 8.99498L3.51005 8.5L4.00502 8.00502L4.5 8.5ZM9.5 20.2C9.1134 20.2 8.8 19.8866 8.8 19.5C8.8 19.1134 9.1134 18.8 9.5 18.8L9.5 20.2ZM9.00503 13.995L4.00502 8.99498L4.99497 8.00502L9.99497 13.005L9.00503 13.995ZM4.00502 8.00502L9.00502 3.00503L9.99497 3.99497L4.99497 8.99498L4.00502 8.00502ZM4.5 7.8L15 7.8L15 9.2L4.5 9.2L4.5 7.8ZM15 20.2L9.5 20.2L9.5 18.8L15 18.8L15 20.2ZM21.2 14C21.2 17.4242 18.4242 20.2 15 20.2L15 18.8C17.651 18.8 19.8 16.651 19.8 14L21.2 14ZM15 7.8C18.4242 7.8 21.2 10.5758 21.2 14L19.8 14C19.8 11.349 17.651 9.2 15 9.2L15 7.8Z" fill="white"/></svg>
                    <span>Restore</span>
                </button>

                 <button class="delete" id="delete_action">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 15L10.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M14.5 15L14.5 12" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M3.5 7H21.5V7C20.5681 7 20.1022 7 19.7346 7.15224C19.2446 7.35523 18.8552 7.74458 18.6522 8.23463C18.5 8.60218 18.5 9.06812 18.5 10V16C18.5 17.8856 18.5 18.8284 17.9142 19.4142C17.3284 20 16.3856 20 14.5 20H10.5C8.61438 20 7.67157 20 7.08579 19.4142C6.5 18.8284 6.5 17.8856 6.5 16V10C6.5 9.06812 6.5 8.60218 6.34776 8.23463C6.14477 7.74458 5.75542 7.35523 5.26537 7.15224C4.89782 7 4.43188 7 3.5 7V7Z" stroke="white" stroke-width="1.4" stroke-linecap="round"/><path d="M10.5681 3.37059C10.6821 3.26427 10.9332 3.17033 11.2825 3.10332C11.6318 3.03632 12.0597 3 12.5 3C12.9403 3 13.3682 3.03632 13.7175 3.10332C14.0668 3.17033 14.3179 3.26427 14.4319 3.37059" stroke="white" stroke-width="1.4" stroke-linecap="round"/></svg>
                    <span>Delete</span>
                </button>
              </div>`
    : ""
}
    <div>

    `;

    binsItemsContainer.insertAdjacentHTML("beforeend", markup);
  });
}

const bins = Array.from({ length: 10 }, (_, i) => i + 1);
renderBinsTemplates(bins);
