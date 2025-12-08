// const $headerDropdown = $(".header_dropdown");
// const $item_length = 10;
// let suggestion_expand = document.getElementById("suggestions_expand");
// const list = $(suggestion_expand.parentElement).find("ul");
// const $item_count = list.children().length;
// if ($item_count < $item_length) list.css("--item-visible", $item_count);
// $(document).on("click", "#suggestions_expand", (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   const $el = $(event.currentTarget);

//   const list = $el.parent().find("ul");
//   const isExpanded = list.attr("aria-expanded") === "true";
//   list.css("--item-count", list.children().length);
//   list.attr("aria-expanded", isExpanded ? "false" : "true");
// });

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

/* Comment Message */
$(".show__replies").on("click", function (e) {
  let replies_count = this.nextElementSibling;
  if (replies_count.innerHTML.length) {
    let replies = replies_count.getAttribute("for");
    $(`#${replies}`).trigger("click");
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

let login_ = window.localStorage.getItem("auth");
login_ = login_ == null ? 0 : login_;
login_ = parseInt(login_);

// if (!login_) {
//   // $(`.logged_acct`).each(function (i, ele) {
//   //   ele.classList.add("hide");
//   // });
//   // $(`.login_acct`).each(function (i, ele) {
//   //   ele.classList.remove("hide");
//   // });
// } else {
//   $(`.logged_acct`).each(function (i, ele) {
//     ele.classList.remove("hide");
//   });
//   $(`.login_acct`).each(function (i, ele) {
//     ele.classList.add("hide");
//   });
// }

$(`.post-image-footer > img`).on(`click`, function () {
  let displayImg = document.getElementById(`display-img`);
  displayImg.setAttribute(`src`, `${this.getAttribute(`src`)}`);
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
