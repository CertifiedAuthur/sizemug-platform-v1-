const $headerDropdown = $(".header_dropdown");

$(document).on("click", "#suggestions_expand", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const $el = $(event.currentTarget);

  const list = $el.parent().find("ul");
  const isExpanded = list.attr("aria-expanded") === "true";
  list.css("--item-count", list.children().length);
  list.attr("aria-expanded", isExpanded ? "false" : "true");
});

$(document).on("click", ".popup_trigger", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const $el = $(event.currentTarget);
  const $target = $($el.attr("data-popup-target"));
  const dialog = $target.get(0);

  if (!dialog) return;
  const isOpen = dialog.open;

  if (isOpen) {
    $target.removeClass("open");
    setTimeout(() => dialog.close(), 200);
  } else {
    dialog.show();
    setTimeout(() => $target.addClass("open"), 1);
  }

  $el.attr("data-active", isOpen);
});

$(window).on("resize", () => {
  if (window.innerWidth > 768) {
    $(".popup").each((_, el) => {
      el.close();
    });
  }
});

$(document).on("click", ".modal-popup", function (event) {
  event.stopPropagation();
  event.preventDefault();
  let target = this.getAttribute("data-trigger");
  load__modal(this, target);
});

$(document).on("click", ".mobile-menu", function (event) {
  event.stopPropagation();
  event.preventDefault();
  let target = this.getAttribute("data-mobile-menu");
  load__modal(this, target);
});

const load__modal = ($this, target) => {
  let status = $this.getAttribute("data-status");
  let type = $this.getAttribute("data-drop");
  let popup = $this.getAttribute("aria-haspopup");
  if (status == 0) {
    if (type == "menu") {
      $this.innerHTML = `<i class="material-symbols-outlined">close</i>`;
    }
    document.querySelector(`[data-modal=${target}]`).classList.remove("hidden");
    document.querySelector(`[data-modal=${target}]`).classList.remove("hide");
    $this.setAttribute("data-status", "1");
    setTimeout(() => {
      document.querySelector(`[data-modal=${target}]`).setAttribute(`aria-haspopup`, true);
    }, 200);
  } else if (status == 1) {
    if (type == "menu") {
      $this.innerHTML = `<i class="material-symbols-outlined">more_horiz</i>`;
    }
    $this.setAttribute("data-status", "0");
    document.querySelector(`[data-modal=${target}]`).classList.add("hidden");
    document.querySelector(`[data-modal=${target}]`).classList.add("hide");
    setTimeout(() => {
      document.querySelector(`[data-modal=${target}]`).setAttribute(`aria-haspopup`, false);
    }, 200);
  }
};

const popup_status = () => {
  $(`[data-status]`).each(function (ele) {
    this.setAttribute("data-status", "0");
  });
};

$(document).on("click", ".close-popup", function (e) {
  e.preventDefault();
  e.stopPropagation();
  let target = this.getAttribute("data-trigger");
  close_override(this, target);
});
$(document).on("click", ".close-override", function (e) {
  let target = this.getAttribute("data-override");
  close_override(this, target);
});

const close_override = ($this, target = null) => {
  document.querySelector(`${target}`).classList.add("hidden");
  document.querySelector(`${target}`).classList.add("hide");
  document.querySelector(`${target}`).setAttribute("aria-haspopup", "false");

  $(`[data-status]`).each(function (ele) {
    $this.setAttribute("data-status", "0");
  });
  $(`[data-status][data-drop]`).each(function (ele) {
    $this.setAttribute("data-status", "1");
  });
  popup_status();
};

$(document).on("click", ".over_lay", function (event) {
  let target = this.getAttribute("data-modal");

  if (event.target === this) {
    let mw = document.querySelectorAll(`[data-modal=${target}]`);
    mw.forEach((ele) => {
      ele.classList.add("hidden");
      ele.classList.add("hide");
      ele.setAttribute("aria-haspopup", "false");
    });
    popup_status();
  }
});

/* Hidden Specified Items */
$(`.logged_acct`).each(function (i, ele) {
  ele.classList.add("hide");
});
$(`.login_acct`).each(function (i, ele) {
  ele.classList.add("hide");
});

let login_ = window.localStorage.getItem("auth");
login_ = login_ == null ? 0 : login_;
login_ = parseInt(login_);

if (!login_) {
  $(`.logged_acct`).each(function (i, ele) {
    ele.classList.add("hide");
  });
  $(`.login_acct`).each(function (i, ele) {
    ele.classList.remove("hide");
  });
} else {
  $(`.logged_acct`).each(function (i, ele) {
    ele.classList.remove("hide");
  });
  $(`.login_acct`).each(function (i, ele) {
    ele.classList.add("hide");
  });
}

$(".tab-link > div").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(".tab-link > div").removeClass("active-tab");
  let target = this.getAttribute(`aria-labelledBy`);
  $(`.tab-panel`).addClass(`hide`);
  $(`#${target}`).removeClass(`hide`);
  $(this).addClass("active-tab");
});

/* TAB PANEL */
$(`.tab-panel`).addClass(`hide`);
$(`.tab-panel:first`).removeClass(`hide`);
$(`.list-check`).addClass(`hide`);
$(`.list-check:first`).removeClass(`hide`);

/* Following  */
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

/* Following Tab */

$(`[data-label] li`).each(function (i, e) {
  const parent = this.parentElement.dataset.label;
  let s_t = $(e).find(`.check-circle`);
  let li_id = i;
  s_t.each(function (ii, elem) {
    let l = $(elem).find(`label`);
    let i = $(elem).find(`input`);
    let id = `${parent}_${li_id}_${ii}`;
    i.attr(`id`, id);
    l.attr(`for`, id);
  });
});

$(`.toggle-follow`).on(`click`, function (e) {
  e.preventDefault();
  e.stopPropagation();
  $(this).toggleClass(`hide`);
  const target = this.getAttribute(`data-target`);
  $(`.${target}`).toggleClass(`hide`);
});

function toggleText(e) {
  const from = $(e).data(`text_from`);
  const to = $(e).data(`text_to`);

  $(e).data(`text_from`, to);
  $(e).data(`text_to`, from);
  $(e).html(`<span>${to}</span>`);
}

$(`.confirm-cancel`).on(`click`, function (e) {
  e.preventDefault();
  e.stopPropagation();
  const target = this.getAttribute(`data-target`);
  const parent = this.getAttribute(`data-parent`);
  const text = this.getAttribute(`data-text`);
  $(`.${parent}`).toggleClass(`hide`);
  $(`.${target}`).toggleClass(`hide`);
  $(`.${target}`).html(`${text}`);
});

$(`.confirm-done`).on(`click`, function () {
  const text = this.getAttribute(`data-text`);
  const target = this.getAttribute(`data-target`);
  const parent = this.getAttribute(`data-parent`);
  $(`.${parent}`).toggleClass(`hide`);
  $(`.${target}`).toggleClass(`hide`);
  $(`.${target}`).html(`${text}`);
});

/* Notifications */
function close_notify(trigger) {
  $(trigger).trigger("click");
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleBtn");
  toggleBtn.addEventListener("click", function (event) {
    const attribute = this.getAttribute("data-show");
    const slide_show = document.getElementById(attribute);
    // slide_show.style.zIndex = 53;

    // Toggle 'hidden' class to show/hide slide_show
    slide_show.classList.toggle("hidden");
    slide_show.classList.toggle("hide");

    // Toggle animation classes
    if (!slide_show.classList.contains("hidden")) {
      slide_show.classList.add("slide-enter-from");
      setTimeout(() => {
        slide_show.setAttribute(`aria-haspopup`, true);
      }, 200);
      setTimeout(() => {
        slide_show.classList.remove("slide-enter-from");
        slide_show.classList.add("slide-enter-to");
      }, 10); // Add a small delay for smooth animation
    } else {
      slide_show.setAttribute(`aria-haspopup`, false);
      slide_show.classList.remove("slide-enter-to");
      slide_show.classList.add("slide-enter-from");
      setTimeout(() => {
        slide_show.classList.remove("slide-enter-from");
      }, 500); // Match transition duration
    }
  });

  const body = document.addEventListener(`click`, function (e) {
    close_queue(e);
  });
});

const close_queue = (e) => {
  $(`[data-notification]`).each((i, element) => {
    let popup = element.getAttribute(`aria-haspopup`);
    if (popup == `true`) {
      if (!element.contains(e.target)) {
        element.setAttribute(`aria-haspopup`, false);
        element.classList.add(`hidden`);
        element.classList.add(`hide`);
        popup_status();
      }
    }
  });
};

/* Select Toggle */
$(`.select-toggle`).on(`click`, function () {
  $(this).hasClass(`select-none`);
});

/* Color pallet */
const button = document.getElementsByClassName("color");
$(button).each(function (i, e) {
  e.addEventListener("click", function () {
    // Get all computed CSS properties of the element
    const computedStyles = window.getComputedStyle(e);
    $(`.text-body-pallet`).css(`background`, computedStyles.background);
  });
});

/* Comment Message */
$(".show__replies").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();
  let replies_count = this.nextElementSibling;
  if (replies_count.innerHTML.length) {
    let replies = replies_count.getAttribute("for");
    $(`#${replies}`).trigger("click");
  } else {
    this.getAttribute("for");
  }
});

/* Auth */
$(`.auth__in`).on(`click`, function (e) {
  e.preventDefault();
  window.localStorage.setItem("auth", 1);
  window.location.reload();
});
$(`.auth__out`).on(`click`, function (e) {
  e.preventDefault();
  window.localStorage.setItem("auth", 0);
  window.location.reload();
});
