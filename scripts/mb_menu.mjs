const mobile__menu = () => {
  $(`.drop-down-menu`).each((i, elem) => {
    window.innerWidth < 641 ? elem.classList.add("hide") : elem.classList.remove("hide");
  });

  $(`.option-btn`).each((i, elem) => {
    window.innerWidth < 641 ? elem.setAttribute("x-on:click", "mobile_menu=true") : elem.setAttribute("x-on:click", "menu__list=true");
  });

  $(`.menu-btn`).each((i, elem) => {
    window.innerWidth < 641 ? elem.setAttribute("x-on:click", "mobile_menu=true") : elem.setAttribute("x-on:click", "menu__list=true");
  });
  $(`.comm_menu-btn`).each((i, elem) => {
    window.innerWidth < 641 ? elem.setAttribute("x-on:click", "mobile_menu_comment=true") : elem.setAttribute("x-on:click", "menu__list=true");
  });
  document.querySelectorAll(`.mobile_b_menu`).forEach((el) => {
    window.innerWidth < 768 ? el.classList.remove(`hide`) : el.classList.add(`hide`);
  });
};
window.addEventListener("resize", mobile__menu);
window.addEventListener("load", mobile__menu);
