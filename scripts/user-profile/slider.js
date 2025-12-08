let inner_items = document.querySelectorAll(`.imgs__slider`);
window.addEventListener("load", function () {
  inner_items.forEach((el, i) => {
    let exp = false;
    if (el.classList.contains("explore_img")) {
      exp = true;
    } else {
      el.setAttribute(`x-data`, `{slide__i:0}`);
    }
    let post_imgs = [];
    $(el)
      .find(`.slider_img img`)
      .each(function (index, img) {
        img.setAttribute(`x-show`, `slide__i==${index}`);
        img.setAttribute(`x-transition.origin.center`, ``);
        post_imgs.push(img.getAttribute(`src`));
      });
    $(`<ul class="more-post-att ${i}" x-show="if(${exp}){return ${exp} && !menu__list} return true"></ul>`).prependTo(el);
    $(`<div class="post-image-footer x-thin-scroll overflow-y-hidden"></div>`).appendTo(`.imgs__slider.dk-imgs`);
    const allowSlideBtn = 2;
    const allowFooterImgs = 3;
    let img_len = $(el).find(`.slider_img img`).length;

    /* Footer Images */
    $(el)
      .find(`.post-image-footer`)
      .each(function (i, ftImg) {
        $(ftImg).html(``);

        for (let img_index = 0; img_index < img_len; img_index++) {
          if (img_len > 1 && img_index < allowFooterImgs) {
            $(ftImg).append(`<img src="${post_imgs[img_index]}" alt="img list ${img_index}" class="img-item" @click='slide__i=${img_index}'  />`);
          }

          if (img_index == allowFooterImgs) {
            $(ftImg).append(`
                <span class="img-item more-comment_img" @click="image_viewers=true"
                    @click='' >+${img_len - allowFooterImgs}</span>
                `);
          }
        }
      });

    /* Toggle post image */
    $(el)
      .find(`.more-post-att`)
      .each(function (i, elem) {
        $(elem).html(``);

        for (let img_index = 0; img_index < img_len; img_index++) {
          if (img_len > 1 && img_index < allowSlideBtn) {
            $(elem).append(`<li @click='slide__i=${img_index}' :class="slide__i==${img_index} ? 'bg-white bg-opacity-70':'bg-gray-400'"></li>`);
          }
          if (img_index == allowSlideBtn) {
            $(elem).append(`
                <li @click='()=>{ slide__i++; if(${img_len}>slide__i) {}else {slide__i=0;}}' :class="slide__i>${allowSlideBtn - 1} ? 'bg-white bg-opacity-70':'bg-gray-400'"></li>
                `);
          }
        }
      });
  });
});
