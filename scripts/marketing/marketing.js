"use strict";
let currentTab = "templates";

// const HIDDEN = "marketing-hidden";
const landingSubNav = document.querySelector(".marketing_sub_nav");
const previewContainer = document.querySelector(".template_preview_modal--wrapper");
const hidePreviewContainer = previewContainer.querySelector(".owner_cancel button");
const mainTemplateContainer = document.querySelector(".templates_list--template .templates_list--items");
const mainLandingContent = document.querySelector(".main_marketing--container > .landing_content");
const mainTemplateLists = document.querySelector(".main_marketing--container > .template_lists");
const navButton = document.querySelectorAll(".marketing_sub_nav .left [role='button']");
const cartSlider = document.querySelector(".cart_aside");
const cancelSlider = cartSlider.querySelector(".cart_cancel");

// category
const categoryList = document.querySelector(".category_list");
const allCategoryButton = categoryList.querySelectorAll("button");

// Close Overlay
const overlays = document.querySelectorAll(".overlay");
overlays.forEach((overlay) => {
  overlay.addEventListener("click", function (e) {
    if (e.target.classList.contains("overlay")) {
      this.classList.add(HIDDEN);
    }
  });
});

function renderTemplatesPresentationSkeleton(container) {
  // Clear previous content
  container.innerHTML = "";
  Array.from({ length: 10 }, (_, i) => i + 1).forEach((ske) => {
    const markup = `<div class="templates_list--item--skeleton skeleton_loading"></div>`;
    container.insertAdjacentHTML("beforeend", markup);
  });
}
async function renderTemplatesPresentation(container, data) {
  renderTemplatesPresentationSkeleton(container);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Clear skeleton content
  container.innerHTML = "";

  data.map((t, i) => {
    const html = `
          <figure class="templates_list--item" data-under="${t.under}" data-template-id="${t.id}">
                <!-- Top -->
                <div class="top">
                  <img src="${t.template}" alt="Template" />

                  <div class="overlay">
                    <button class="buy" id="add_to_cart">
                      <!-- prettier-ignore -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><g fill="none" stroke="#ffffff" stroke-width="2"><path stroke-linecap="round" d="M8 12V8a4 4 0 0 1 4-4v0a4 4 0 0 1 4 4v4"/><path d="M3.694 12.668c.145-1.741.218-2.611.792-3.14C5.06 9 5.934 9 7.681 9h8.639c1.746 0 2.62 0 3.194.528c.574.528.647 1.399.792 3.14l.514 6.166c.084 1.013.126 1.52-.17 1.843c-.298.323-.806.323-1.824.323H5.174c-1.017 0-1.526 0-1.823-.323c-.297-.323-.255-.83-.17-1.843z"/></g></svg>
                      <span>Buy</span>
                    </button>

                    <button class="preview">
                      <!-- prettier-ignore -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="1.6em" height="1.6em" viewBox="0 0 24 24"><g fill="none" stroke="black" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M20.188 10.934c.388.472.582.707.582 1.066c0 .359-.194.594-.582 1.066C18.768 14.79 15.636 18 12 18c-3.636 0-6.768-3.21-8.188-4.934c-.388-.472-.582-.707-.582-1.066c0-.359.194-.594.582-1.066C5.232 9.21 8.364 6 12 6c3.636 0 6.768 3.21 8.188 4.934Z"/></g></svg>
                      <span>Preview </span>
                    </button>
                  </div>

                  ${
                    t.tier === "paid"
                      ? `
                      <div class="pay_tier">
                        <span>$${t.price}</span>
                        <span>${t.coin}</span>
                      </div>
                    `
                      : ""
                  }

                  ${t.tier !== "paid" ? `<div class="free_tier">Free</div>` : ""}
                </div>

                <!-- Bottom -->
                <div class="bottom">
                  <div class="owner">
                    <img src="${t.image}" alt="User 4" />
                    <h2>${t.owner}</h2>
                  </div>

                  <div class="ratings">
                    <!-- prettier-ignore -->
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#F59E0B" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"/></svg>

                    <div>
                      <span>${t.rating}</span>
                      <span>(${t.reviews})</span>
                    </div>
                  </div>
                </div>
          </figure>
  `;

    container.insertAdjacentHTML("beforeend", html);
  });
}

// Templates Template
const temp = templates.filter((tem) => tem.category === "portfolio");
renderTemplatesPresentation(mainTemplateContainer, temp);

////////////////////////////////////////////
////////////////////////////////////////////
/// Templates / Presentations / Projects ///
////////////////////////////////////////////
////////////////////////////////////////////
landingSubNav.addEventListener("click", (e) => {
  const target = e.target;

  // Show Cart
  if (target.closest(".cart")) {
    return cartSlider.classList.add("active");
  }

  allCategoryButton.forEach((cat) => cat.classList.remove("focus"));
  allCategoryButton[0].classList.add("focus");

  // Show Template
  if (target.closest(".templates")) {
    currentTab = "templates";

    const temp = templates.filter((tem) => tem.category === "portfolio");

    navButton.forEach((nav) => nav.classList.remove("active"));
    target.closest(".templates").classList.add("active");

    mainTemplateContainer.innerHTML = "";
    renderTemplatesPresentation(mainTemplateContainer, temp);
  }

  // Show Presentations
  if (target.closest(".presentations")) {
    currentTab = "presentations";

    const pre = presentations.filter((pre) => pre.category === "portfolio");

    navButton.forEach((nav) => nav.classList.remove("active"));
    target.closest(".presentations").classList.add("active");
    mainTemplateContainer.innerHTML = "";

    renderTemplatesPresentation(mainTemplateContainer, pre);

    currentTab = "presentations";
  }

  // Show Projects
  if (target.closest(".projects")) {
    mainLandingContent.classList.add(HIDDEN);
    mainTemplateLists.classList.remove(HIDDEN);
  }
});

// Template Preview
mainTemplateContainer.addEventListener("click", (e) => {
  const target = e.target;
  const templateItem = target.closest(".templates_list--item");

  if (templateItem) {
    const { templateId, under } = templateItem.dataset;

    // Preview Template
    const previewBtn = target.closest(".preview");
    if (previewBtn) {
      const templateItem = templates.find((t) => t.id === +templateId);
      displayTemplateOverlay(templateItem);

      return;
    }

    // Add to carts
    const addToCart = target.closest("#add_to_cart");
    if (addToCart) {
      let templateItem;

      if (under === "templates") {
        templateItem = templates.find((t) => t.id === +templateId);
      } else {
        templateItem = presentations.find((t) => t.id === +templateId);
      }

      const cartItem = JSON.parse(localStorage.getItem("sizemug_carts")) ?? [];
      const filteredCarts = cartItem.filter((cart) => cart.id !== +templateId);
      localStorage.setItem("sizemug_carts", JSON.stringify([templateItem, ...filteredCarts]));

      // update cart list item
      renderCartsItem();
    }
  }
});

function displayTemplateOverlay(templateItem) {
  // Dataset
  previewContainer.dataset.tempId = templateItem.id;

  // Template Owner
  previewContainer.querySelector(".owner h2").textContent = templateItem.owner;

  // profile
  previewContainer.querySelector(".owner img").src = templateItem.image;

  // Template Title
  previewContainer.querySelector(".template_preview--modal h1").textContent = templateItem.templateName;

  // Template Image
  previewContainer.querySelector(".sample img").src = templateItem.template;

  if (templateItem.tier === "paid") {
    // For Paid
    previewContainer.querySelector(".add_to_projects").classList.add(HIDDEN);
    previewContainer.querySelector(".free").classList.add(HIDDEN);

    // For Free
    previewContainer.querySelector(".icon").classList.remove(HIDDEN);
    previewContainer.querySelector(".ratings").classList.remove(HIDDEN);
    previewContainer.querySelector(".buy").classList.remove(HIDDEN);
    previewContainer.querySelector(".price").classList.remove(HIDDEN);
    previewContainer.querySelector(".price").textContent = `$${templateItem.price}`;
  } else {
    // For Free
    previewContainer.querySelector(".icon").classList.add(HIDDEN);
    previewContainer.querySelector(".ratings").classList.add(HIDDEN);
    previewContainer.querySelector(".buy").classList.add(HIDDEN);
    previewContainer.querySelector(".price").classList.add(HIDDEN);

    // For Paid
    previewContainer.querySelector(".add_to_projects").classList.remove(HIDDEN);
    previewContainer.querySelector(".free").classList.remove(HIDDEN);
  }

  // Show preview container
  previewContainer.classList.remove(HIDDEN);
}

// Hid preview container
hidePreviewContainer.addEventListener("click", () => {
  previewContainer.classList.add(HIDDEN);
});

// Category Select
categoryList.addEventListener("click", (e) => {
  const { category } = e.target.dataset;

  if (e.target.tagName.toLowerCase() === "button") {
    // remove active class from all button first
    allCategoryButton.forEach((btn) => btn.classList.remove("focus"));
    // attach active class to the target button
    e.target.classList.add("focus");

    // For Portfolio
    if (category === "portfolio") {
      if (currentTab === "templates") {
        const portfolioTem = templates.filter((tem) => tem.category === "portfolio");
        renderTemplatesPresentation(mainTemplateContainer, portfolioTem);
      } else {
        const portfolioPre = presentations.filter((pre) => pre.category === "portfolio");
        renderTemplatesPresentation(mainTemplateContainer, portfolioPre);
      }
      return;
    }

    // For Business Corporate
    if (category === "business-corporate") {
      if (currentTab === "templates") {
        const businessTem = templates.filter((tem) => tem.category === "business-corporate");
        renderTemplatesPresentation(mainTemplateContainer, businessTem);
      } else {
        const businessPre = presentations.filter((pre) => pre.category === "business-corporate");
        renderTemplatesPresentation(mainTemplateContainer, businessPre);
      }
      return;
    }

    // For E-commerce
    if (category === "e-commerce") {
      if (currentTab === "templates") {
        const commerceTem = templates.filter((tem) => tem.category === "e-commerce");
        renderTemplatesPresentation(mainTemplateContainer, commerceTem);
      } else {
        const commercePre = presentations.filter((pre) => pre.category === "e-commerce");
        renderTemplatesPresentation(mainTemplateContainer, commercePre);
      }
      return;
    }

    // For Education
    if (category === "education") {
      if (currentTab === "templates") {
        const educationTem = templates.filter((tem) => tem.category === "education");
        renderTemplatesPresentation(mainTemplateContainer, educationTem);
      } else {
        const educationPre = presentations.filter((pre) => pre.category === "education");
        renderTemplatesPresentation(mainTemplateContainer, educationPre);
      }
      return;
    }

    // For Health Fitness
    if (category === "health-fitness") {
      if (currentTab === "templates") {
        const healthTem = templates.filter((tem) => tem.category === "health-fitness");
        renderTemplatesPresentation(mainTemplateContainer, healthTem);
      } else {
        const healthPre = presentations.filter((pre) => pre.category === "health-fitness");
        renderTemplatesPresentation(mainTemplateContainer, healthPre);
      }
      return;
    }

    // For Charity
    if (category === "charity") {
      if (currentTab === "templates") {
        const charityTem = templates.filter((tem) => tem.category === "charity");
        renderTemplatesPresentation(mainTemplateContainer, charityTem);
      } else {
        const charityPre = presentations.filter((pre) => pre.category === "charity");
        renderTemplatesPresentation(mainTemplateContainer, charityPre);
      }
      return;
    }

    // For Real Estate
    if (category === "real-estate") {
      if (currentTab === "templates") {
        const realEstateTem = templates.filter((tem) => tem.category === "real-estate");
        renderTemplatesPresentation(mainTemplateContainer, realEstateTem);
      } else {
        const realEstatePre = presentations.filter((pre) => pre.category === "real-estate");
        renderTemplatesPresentation(mainTemplateContainer, realEstatePre);
      }
      return;
    }

    // For Finance
    if (category === "finance") {
      if (currentTab === "templates") {
        const financeTem = templates.filter((tem) => tem.category === "finance");
        renderTemplatesPresentation(mainTemplateContainer, financeTem);
      } else {
        const financePre = presentations.filter((pre) => pre.category === "finance");
        renderTemplatesPresentation(mainTemplateContainer, financePre);
      }
      return;
    }

    // For Personal Development
    if (category === "personal-development") {
      if (currentTab === "templates") {
        const personalDevTem = templates.filter((tem) => tem.category === "personal-development");
        renderTemplatesPresentation(mainTemplateContainer, personalDevTem);
      } else {
        const personalDevPre = presentations.filter((pre) => pre.category === "personal-development");
        renderTemplatesPresentation(mainTemplateContainer, personalDevPre);
      }
      return;
    }

    // For Infographics
    if (category === "infographics") {
      if (currentTab === "templates") {
        const infographicsTem = templates.filter((tem) => tem.category === "infographics");
        renderTemplatesPresentation(mainTemplateContainer, infographicsTem);
      } else {
        const infographicsPre = templates.filter((pre) => pre.category === "infographics");
        renderTemplatesPresentation(mainTemplateContainer, infographicsPre);
      }
      return;
    }
  }
});

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////////  Share Modal /////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
const shareModal = document.querySelector(".share_modal");
const showShareModal = document.querySelectorAll(".template_preview--modal button.share");

// SHOW
showShareModal.forEach((btn) =>
  btn.addEventListener("click", () => {
    shareModal.classList.remove(HIDDEN);
  })
);

// HIDE
const hideShareModal = document.querySelector(".share_modal--main .share_modal--heading button");
hideShareModal.addEventListener("click", (e) => {
  e.target.closest(".overlay").classList.add(HIDDEN);
});

// COPY
const clipboardButton = document.querySelector(".share_modal--main .clipboard button");
const shareURL = document.querySelector(".share_modal--main .clipboard p").textContent;
const copyIcon = clipboardButton.querySelector(".copy");
const copiedIcon = clipboardButton.querySelector(".copied");

clipboardButton.addEventListener("click", () => {
  navigator.clipboard.writeText(shareURL).then(() => {
    copyIcon.classList.add(HIDDEN);
    copiedIcon.classList.remove(HIDDEN);

    setTimeout(() => {
      copyIcon.classList.remove(HIDDEN);
      copiedIcon.classList.add(HIDDEN);
    }, 3000);
  });
});
