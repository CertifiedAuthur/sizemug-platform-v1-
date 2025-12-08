const checkoutBtn = document.querySelector("#checkout--btn");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
// CART COUNT
function updateCartNumberCount() {
  const data = JSON.parse(localStorage.getItem("sizemug_carts") ?? "[]");
  document.querySelector(".number_in_cart").textContent = data.length;
}

updateCartNumberCount();

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Carts
const cartsListWrapper = document.querySelector(".cart_aside_lists");
const cartsEmptyContainer = document.getElementById("cart_aside_empty");

function renderCartsItem() {
  const data = JSON.parse(localStorage.getItem("sizemug_carts") ?? "[]");

  cartsListWrapper.innerHTML = "";
  cartsListWrapper.classList.remove(HIDDEN);
  cartsEmptyContainer.classList.add(HIDDEN);

  // If cart is empty
  if (!data.length) {
    cartsListWrapper.classList.add(HIDDEN);
    cartsEmptyContainer.classList.remove(HIDDEN);
  }

  data.map((cart, i) => {
    const cartItem = `
       <li data-under="${cart.under}" data-cart-id="${cart.id}">
          <div class="image">
            <img src="${cart.template}" alt="Marketing" />
          </div>

          <div class="title">
            <h3>${cart.templateName} Customizable UX Flow Chart</h3>

            <div class="ZXQO">
              <div>
                <div class="price">$${cart.price}</div>

                <div class="icon">${cart.coin}</div>
              </div>

              <button class="remove">
                Remove
              </button>
            </div>
          </div>

          <div class="btn">
            <button class="check">
              <svg xmlns="http://www.w3.org/2000/svg" class="marketing-hidden" width="0.8em" height="0.8em" viewBox="0 0 2048 2048"><path fill="black" d="M1837 557L768 1627l-557-558l90-90l467 466l979-978z"/></svg>
            </button>
          </div>
      </li>
      `;

    cartsListWrapper.insertAdjacentHTML("afterbegin", cartItem);
  });

  // update count
  updateCartNumberCount();
}
renderCartsItem();

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////// Events on Carts Container ///////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Cart Container Events
let allShippingItems = [];

cartsListWrapper.addEventListener("click", function (e) {
  const targetBtn = e.target.closest(".check");

  if (targetBtn) {
    const { cartId, under } = targetBtn.closest("li").dataset;

    let templateItem;
    if (under === "templates") {
      templateItem = templates.find((t) => t.id === +cartId);
    } else {
      templateItem = presentations.find((t) => t.id === +cartId);
    }

    if (!targetBtn.classList.contains("active")) {
      targetBtn.classList.add("active");
      targetBtn.querySelector("svg").classList.remove(HIDDEN);

      allShippingItems.push(templateItem);
    } else {
      targetBtn.classList.remove("active");
      targetBtn.querySelector("svg").classList.add(HIDDEN);

      allShippingItems = allShippingItems.filter((item) => item.id !== templateItem.id);
    }

    // update checkout button mode
    checkoutBtnMode();
    return;
  }

  const targetRemove = e.target.closest(".remove");
  if (targetRemove) {
    const { cartId } = targetRemove.closest("li").dataset;

    const lsData = JSON.parse(localStorage.getItem("sizemug_carts"));
    const newData = lsData.filter((d) => d.id !== +cartId);
    localStorage.setItem("sizemug_carts", JSON.stringify(newData));

    // update cart list item
    renderCartsItem();
    // update checkout storage if item exist
    removeFromCheckOut(cartId);
    return;
  }
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
/////// Go Back Landing from templates  //////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
const gotoLandingContent = document.querySelector(".go_back");
gotoLandingContent.addEventListener("click", function () {
  mainLandingContent.classList.remove(HIDDEN);
  mainTemplateLists.classList.add(HIDDEN);
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////// Preview Overlay /////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
const overlayBuy = document.querySelector(".share_price .buy");

overlayBuy.addEventListener("click", function (e) {
  const { tempId } = previewContainer.dataset;

  const templateItem = templates.find((t) => t.id === +tempId);
  addToCart(templateItem, tempId);
});

function addToCart(temnewItem) {
  const cartTem = JSON.parse(localStorage.getItem("sizemug_carts") ?? "[]"); // [] fallback
  const filteredCarts = cartTem.filter((cart) => cart.id !== temnewItem.id);
  localStorage.setItem("sizemug_carts", JSON.stringify([temnewItem, ...filteredCarts]));

  // update cart list item
  renderCartsItem();
}

//////////////////////////////////////////////////
//////////// Hide carts list slider  /////////////
//////////////////////////////////////////////////
cancelSlider.addEventListener("click", () => {
  cartSlider.classList.remove("active");
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Outside click
document.addEventListener("click", (e) => {
  if (!e.target.closest(".cart_aside") && !e.target.closest(".cart") && !e.target.classList.contains("remove")) {
    cartSlider.classList.remove("active");
  }
});
