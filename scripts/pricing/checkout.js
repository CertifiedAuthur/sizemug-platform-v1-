const plansContainerList = document.getElementById("plansContainerList");
const choosePaymentOption = document.getElementById("choosePaymentOption");

let planChoosen = "";

plansContainerList.addEventListener("click", (e) => {
  const getStartedBtn = e.target.closest(".get_started");

  if (getStartedBtn) {
    const { plan } = getStartedBtn.dataset;

    planChoosen = plan;
    choosePaymentOption.classList.remove(HIDDEN);
  }
});

choosePaymentOption.addEventListener("click", (e) => {
  if (e.target.id === "choosePaymentOption") choosePaymentOption.classList.add(HIDDEN);
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Select Payment Gateway: COIN || WALLET
// const choosePaymentOption = document.querySelector(".choose_payment--option");
let gateWay;

choosePaymentOption.addEventListener("click", function (e) {
  const option = e.target.closest(".payment_option");

  // Select payment option
  if (option) {
    const optionCheckBtn = option.querySelector("button");
    const lists = option.closest("ul").querySelectorAll("li"); // select all li nodes

    // setting li option back to it's default
    lists.forEach((li) => {
      li.querySelector("button").classList.remove("active");
      li.querySelector("svg").classList.add(HIDDEN);
    });

    if (!optionCheckBtn.classList.contains("active")) {
      optionCheckBtn.classList.add("active");
      optionCheckBtn.querySelector("svg").classList.remove(HIDDEN);
      gateWay = option.dataset.type;
    } else {
      optionCheckBtn.classList.remove("active");
    }
  }

  // Back
  const back = e.target.closest(".back");
  if (back) {
    // hid the choose gate way modal
    this.classList.add(HIDDEN);
  }

  // Next
  const next = e.target.closest(".next");
  if (next) {
    // if there is no gateway yet?, do nothing
    if (!gateWay) return;

    // hid the choose gate way modal
    this.classList.add(HIDDEN);

    const container = document.querySelector(`.payment_with_${gateWay}`);
    const shippingItemsEl = container.querySelector(".shipping_items");
    if (gateWay === "coin") {
      container.classList.remove(HIDDEN);
      renderPlanSubscribing(shippingItemsEl);
    }

    if (gateWay === "wallet") {
      container.classList.remove(HIDDEN);
      renderPlanSubscribing(shippingItemsEl);
    }
  }
});

function renderPlanSubscribing(shippingItemsEl) {
  const choosenPlan = pricingList.find((price) => price.type === planChoosen);

  const markup = `
          <div class="shipping_item">
            <div>
              <h1>${choosenPlan.type}</h1>
              <span>$${choosenPlan.monthlyPrice}</span>
            </div>

            <ul>
              ${choosenPlan.plans.map((p) => `<li>- ${p}</li>`).join("")}
            </ul>

            <button class="remove_shipping">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 72 72"><path fill="#ffff" d="M59 41H13V31h46"/><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M13 31h46v10H13z"/></svg>
            </button>
          </div>
  `;

  shippingItemsEl.insertAdjacentHTML("beforeend", markup);
}

//////////////////////////////////////////
//////////////////////////////////////////
// Toggle Balance Show
const toggleBalanceState = document.querySelectorAll(".toggle_balance_state");

toggleBalanceState.forEach((toggle) => {
  toggle.addEventListener("click", function () {
    const { type } = toggle.dataset;
    const container = document.querySelectorAll(`.total_balance--${type}`);
    const showIcon = toggle.querySelector("svg:first-child");
    const hidIcon = toggle.querySelector("svg:last-child");
    const buttonMode = JSON.parse(toggle.ariaHidden);

    container.forEach((c) => {
      const amount = c.querySelector(".amount");
      const asterics = c.querySelector(".asterics");

      if (!buttonMode) {
        amount.classList.add(HIDDEN);
        asterics.classList.remove(HIDDEN);
        showIcon.classList.add(HIDDEN);
        hidIcon.classList.remove(HIDDEN);
        toggle.ariaHidden = "true";
      } else {
        amount.classList.remove(HIDDEN);
        asterics.classList.add(HIDDEN);
        showIcon.classList.remove(HIDDEN);
        hidIcon.classList.add(HIDDEN);
        toggle.ariaHidden = "false";
      }
    });

    // update show state
    show = !show;
  });
});

//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Render shipping Items
// function renderShippingItem(container) {
//   container.innerHTML = ""; // clear container

//   allShippingItems.forEach((item) => {
//     const html = `
//           <div class="shipping_item">
//             <div>
//               <p>${item.templateName}</p>
//               <span>$${item.price}</span>
//             </div>

//             <div>
//               <p>
//                 Deployment Support
//                 <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#484f56" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 14a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0Zm-1-7a1 1 0 1 1 1-1a1 1 0 0 1-1 1"/></svg>
//               </p>
//               <span>$20</span>
//             </div>

//             <div>
//               <p>
//                 Domain Support
//                 <!-- prettier-ignore -->
//                 <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#484f56" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 14a1 1 0 0 1-2 0v-5a1 1 0 0 1 2 0Zm-1-7a1 1 0 1 1 1-1a1 1 0 0 1-1 1"/></svg>
//               </p>
//               <span>$70</span>
//             </div>

//             <button class="remove_shipping">
//               <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 72 72"><path fill="#ffff" d="M59 41H13V31h46"/><path fill="none" stroke="#ffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="M13 31h46v10H13z"/></svg>
//             </button>
//           </div>
//     `;

//     container.insertAdjacentHTML("beforeend", html);
//   });

//   /////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////
//   /////////////////////////////////////////////////////////
//   // Attach Remove Event
//   const removeShoppings = container.querySelectorAll(".remove_shipping");
//   removeShoppings.forEach((ship) => {
//     ship.addEventListener("click", (e) => {
//       const container = e.target.closest(".shipping_item");
//       const parentContainer = e.target.closest(".calculation_shipping").querySelector("div:first-child");
//       parentContainer.removeChild(container);
//     });
//   });
// }

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Pay
const paymentWithWallet = document.querySelector(".payment_with_wallet");
const paymentWithCoin = document.querySelector(".payment_with_coin");
const paymentSuccessFul = document.querySelector(".payment_successful");
const paymentFailed = document.querySelector(".payment_failed");
const fundModal = document.querySelector(".fund_wallet");

// Payment with Wallet
paymentWithWallet.addEventListener("click", function (event) {
  handlePaymentWith.call(this, event, paymentWithWallet);
});

// Payment with Coin
paymentWithCoin.addEventListener("click", function (event) {
  handlePaymentWith.call(this, event, paymentWithCoin);
});

function handlePaymentWith(e) {
  const back = e.target.closest(".back");

  // Back
  if (back) {
    this.classList.add(HIDDEN);
    choosePaymentOption.classList.remove(HIDDEN);
  }

  // Pay
  const pay = e.target.closest(".pay");
  if (pay) {
    this.classList.add(HIDDEN);
    paymentSuccessFul.classList.remove(HIDDEN);

    //     console.log(allShippingItems);

    //     // update localstorage
    //     const existingTemplates = JSON.parse(localStorage.getItem("sizemug_user_templates")) ?? [];
    //     localStorage.setItem("sizemug_user_templates", JSON.stringify([...existingTemplates, ...allShippingItems]));

    //     const lsCarts = JSON.parse(localStorage.getItem("sizemug_carts")) || [];
    //     const newData = lsCarts.filter((cartItem) => {
    //       return !allShippingItems.some((item) => item.id === cartItem.id);
    //     });

    //     localStorage.setItem("sizemug_carts", JSON.stringify(newData));

    //     // Empty user cart
    //     renderCartsItem(); // update cart list
    //     allShippingItems = [];
  }

  // Fund Wallet
  const fundEvent = e.target.closest(".sum_up p:first-child");
  if (fundEvent) {
    const paymentModal = document.querySelector(`.payment_with_${gateWay}`);
    fundModal.classList.remove(HIDDEN);
    paymentModal.classList.add(HIDDEN);
  }

  // Failed
  const failedEvent = e.target.closest(".sum_up p:last-child");
  if (failedEvent) {
    this.classList.add(HIDDEN);
    paymentFailed.classList.remove(HIDDEN);
  }
}

// Continue from Success/Fail Payment
const continueSuccessOrFailed = document.querySelectorAll(".action_btns .continue");

continueSuccessOrFailed.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    this.closest(".overlay").classList.add(HIDDEN);
    //     renderTemplatesList();
  })
);
