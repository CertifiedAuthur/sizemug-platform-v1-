/* CONFIG */
// Get the current URL
const currentUrl = window.location.href;

// Get the domain including protocol from the current URL
const fullDomain = window.location.origin;
const indexFile = `index.html`;

// Define the base URL you want to extract the path from
const baseUrl = `${fullDomain}/output`;

const pathAfter = (pathUrl = null) => {
  // Check if the current URL starts with the base URL
  pathUrl = pathUrl ? pathUrl : currentUrl;

  if (typeof pathUrl != 'object' && pathUrl.startsWith(baseUrl)) {
    // Get the path after the base URL
    const pathAfterBaseUrl = pathUrl.substring(baseUrl.length);
    return pathAfterBaseUrl;
  } else {
    console.error('Current URL does not match the base URL.');
  }
};

/* Active Navs (MOBILE, TABLET, DESKTOP) */
const similar_nav = link => {
  let active_navs = $(`[href='${link}']`);
  active_navs.each((i, v) => {
    if (v.classList.contains(`desktop_nav`) || v.classList.contains(`tablet_nav`)) {
      v.setAttribute(`data-active`, 1);
      v.setAttribute(`data-active_`, 1);
    }
  });
}

const inactive_navs = ($this = null) => {
  $(`.desktop_nav`).each((i, elem) => {
    elem.removeAttribute(`data-active`);
  });
  $(`.tablet_nav`).each((i, elem) => {
    elem.removeAttribute(`data-active_`);
  });
  if ($this != null) {
    console.log(typeof $this)
    $this.setAttribute(`data-active_`, 1);
    // $this.setAttribute(`data-active`, 1);
    let link = $this.getAttribute(`href`);
    similar_nav(link)
  }
}

/* LOAD CONTENT */
async function loadContent(url, containerId) {
  return new Promise((res, rej) => {
    url = `${url}/${indexFile}`;
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById(containerId).innerHTML = html;
        loadAfter();
        mobile__menu();
        res(`connect`);
      })
      .catch((error) => {
        console.error('Error loading content:', error);
        rej(`false`);
      });
  });
}


/* allocate menu button */
const mobile__menu = () => {
  if (window.innerWidth > 640) {
    document.querySelector(`[data-modal="mobile--menu"]`).classList.add('hidden');
    document.querySelector(`[data-modal="mobile--menu"]`).classList.add('hide');
  }
  $(`[data-drop='menu']`).each((i, elem) => {
    let elemID = elem.dataset.id;
    if (window.innerWidth < 641) {
      elem.setAttribute("data-mobile-menu", `mobile--menu${elemID}`);
      elem.setAttribute("data-status", 0);
      elem.classList.add("mobile-menu");
      elem.classList.remove("modal-popup");
    } else {
      elem.classList.remove("mobile-menu");
      elem.classList.add("modal-popup");
    }
  });
}

/* SIDEBAR LINK */
$(`.link_page`).on(`click`, function (e) {
  e.preventDefault();
  link_page(this);
});

const link_page = (e) => {
  // Manipulate the URL without reloading the page
  let newPath = e.getAttribute('href');
  inactive_navs(e);
  similar_nav(newPath);
  // history.pushState(null, '', newPath);
  newPath = newPath.startsWith(baseUrl) ? newPath : `${baseUrl}/${newPath}`;
  loadContentBasedOnUrl(newPath);
};

// Function to determine which content to load based on URL
async function loadContentBasedOnUrl(url = null) {
  let page = pathAfter(url);
  
  page = page.startsWith(`/`) ? page.substr(1) : page;
  loadContent(page, 'load-content').then();
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
    nextElement.addClass(c_id);
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
      opt_btn.attr(`aria-haspopup`, `false`);
      opt_btn.removeClass(`open`);
    });
  });

  $(`.profile__link`).on(`click`, function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    let link = $(`.profile__link`).attr(`href`);
    
    inactive_navs(this);
    similar_nav(link);
    link = link.startsWith(baseUrl) ? link : `${baseUrl}/${link}`;
    loadContentBasedOnUrl(link);
  });

  const inline_tabs = document.querySelectorAll('input[type="radio"]');

  inline_tabs.forEach((tabs, key) => {
    tabs.addEventListener('change', function () {
      const targetId = this.getAttribute('data-tabpanel');
      const targetPage = this.getAttribute('name');
      if (key > 0) {
        $(`#${targetPage} .panels > .panel-item`).addClass('hide');
      }
      $(`#${targetPage} .current`).html(targetId);
      $(`#${targetPage} .search_current`).attr(`placeholder`, `Search ${targetId}`);
      const tab_panels = document.querySelectorAll(`#${targetPage} .panels > .panel-item`);

      tab_panels.forEach((panel) => {
        const panelId = panel.getAttribute('id');
        if (targetId === panelId) {
          $(panel).fadeIn(100);
          panel.classList.remove('hide', 'invisible', 'opacity-0');
          panel.classList.add('visible', 'opacity-100','transition', 'ease-in', 'duration-75');
        } else {
          $(panel).fadeOut(100);
          panel.classList.add('invisible', 'opacity-0', 'hide');
        }
      });
    });
  });

  $(`.shrk_text`).each((index, text) => {
    let len = text.getAttribute(`data-value`);
    let tx = text.innerText;
    let attr = tx.length > parseInt(len) ? `...` : ``;
    text.innerHTML = tx.substring(0, len) + attr;
  });
  $(`.shrk_text_`).each((index, text) => {
    let len = text.getAttribute(`data-value`);
    let tx = text.innerText;
    let attr = tx.length > parseInt(len) ? `.` : ``;
    text.innerHTML = tx.substring(0, len) + attr;
  });
  $(`.toggleText`).on(`click`, function (e) {
    const from = this.getAttribute(`data-text_from`);
    const to = this.getAttribute(`data-text_to`);
    this.dataset.text_from = to;
    this.dataset.text_to = from;
    this.innerHTML = `<span>${to}</span>`;
  });
  $(`.ads-close`).on(`click`, function () {
    let target = this.getAttribute(`data-trigger`);
    $(target).addClass(`hidden hide`);
    let p = $(target).parent();
    $(`.crumb`).css(`justify-content`, `center`);
    $(`.ff-switch`).css(`justify-content`, `center`);
    $(`.ff-currect-label`).css(`text-align`, `center`);
    $(p).removeClass(`justify-start`);
    $(p).addClass(`justify-center`);
  });
  
  let login_ = window.localStorage.getItem('auth');
  login_ = login_ == null ? 0 : login_;
  login_ = parseInt(login_);
  
  if (!login_) {
    $(`.logged_acct`).each(function (i,ele) {
      ele.classList.add('hide');
    });
    $(`.login_acct`).each(function (i,ele) {
      ele.classList.remove('hide');
    });

  } else {
    $(`.logged_acct`).each(function (i,ele) {
      ele.classList.remove('hide');
    });
    $(`.login_acct`).each(function (i,ele) {
      ele.classList.add('hide');
    });
  }

  $(`.post-image-footer > img`).on(`click`, function () {
    let displayImg = document.getElementById(`display-img`);
    displayImg.setAttribute(`src`, `${this.getAttribute(`src`)}`);
  });

  $.getScript(`./scripts/auth_required.mjs`);

};

// Call the function on page load or refresh
window.addEventListener('resize', mobile__menu);
window.addEventListener('load', function () {
  let __startPage = `explore`;
  similar_nav(__startPage);
  loadContentBasedOnUrl(`${baseUrl}/${__startPage}`);
});
