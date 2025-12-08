/* CONFIG */
// Get the current URL
const currentUrl = window.location.href;

// Get the domain including protocol from the current URL
const fullDomain = window.location.origin;

// Define the base URL you want to extract the path from
const baseUrl = `${fullDomain}/output`;

const pathAfter = (pathUrl = null) => {
  // Check if the current URL starts with the base URL
  pathUrl = pathUrl ? pathUrl : currentUrl;
  
  if (typeof pathUrl != "object" && pathUrl.startsWith(baseUrl)) {
    // Get the path after the base URL
    const pathAfterBaseUrl = pathUrl.substring(baseUrl.length);
    return pathAfterBaseUrl;
  } else {
    console.error('Current URL does not match the base URL.');
  }
};

/* LOAD CONTENT */
function loadContent(url, containerId) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      document.getElementById(containerId).innerHTML = html;
    })
    .catch((error) => {
      console.error('Error loading content:', error);
    });
}

/* SIDEBAR LINK */
$(`.link_page`).on(`click`, function (e) {
  e.preventDefault();
  link_page(this);
});

const link_page = e => {
  
  // Manipulate the URL without reloading the page
  let newPath = e.getAttribute('href');
  // history.pushState(null, '', newPath);
  newPath = newPath.startsWith(baseUrl) ? newPath : `${baseUrl}/${newPath}`;
  loadContentBasedOnUrl(newPath);
}

// Function to determine which content to load based on URL
function loadContentBasedOnUrl(url = null) {
  let page = pathAfter(url);
  if (page === '/' || page === '/home') {
    return loadContent(`explore`, 'load-content');
  }
  page = page.startsWith(`/`) ? page.substr(1) : page;
  loadContent(page, 'load-content');
  setTimeout(() => {
    loadAfter();
  }, 3000);
}

const loadAfter = () => {
    
    /* Following Link */
    $(`.ff-link`).each(function (i, e) {
      const l_id = e.getAttribute(`data-id`);
      
      let nextElement = $(e).next();
      let id = `${l_id}follow_lk_${i}`;
      let c_id = `${l_id}conf_${i}`;
      let c_btn = nextElement.find(`button`);
      c_btn.each(function (i, btn) {
        btn.setAttribute(`data-target`, id);
        btn.setAttribute(`data-parent`, c_id);
      });
      nextElement.addClass(c_id)
      e.setAttribute(`data-target`, c_id);
      e.classList.add(id);
    });
  
  $(`.card-menu`).each(function (i, e) {
    $(e).on(`mouseleave`, function (event) {
      let opt = $(e).find(`.cdm_btn`);
      opt.html(`<i class="material-symbols-outlined">more_horiz</i>`);
      opt.attr(`data-status`, 0);
      let opt_btn = $(e).find(`.drop-down-menu`);
      opt_btn.addClass(`hidden hide`);
    });
  });
}

// Call the function on page load or refresh
window.addEventListener('load', loadContentBasedOnUrl(`${baseUrl}/following`));
