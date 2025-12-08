//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Fund Wallet before proceeding
const fundWalletItem = document.querySelectorAll(".fund_wallet_option li");
const allListButton = document.querySelectorAll(".fund_wallet_option li button");
const allListSvg = document.querySelectorAll(".fund_wallet_option li button svg");
let choosen = false;

fundWalletItem.forEach((item) => {
  item.addEventListener("click", (e) => {
    const button = item.querySelector("button");
    const svg = button.querySelector("svg");

    allListButton.forEach((btn) => btn.classList.remove("active"));
    allListSvg.forEach((svg) => svg.classList.add(HIDDEN));

    if (!button.classList.contains("active")) {
      choosen = true;
      button.classList.add("active");
      svg.classList.remove(HIDDEN);
    }
  });
});

/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
// Fund Wallet/Coin Money
const nextFundBtn = document.querySelector(".fund_wallet .action_btns .next");
const backFundBtn = document.querySelector(".fund_wallet .action_btns .back");
const bar2 = document.querySelector(`.steps_bar > div:nth-child(2)`);
const bar3 = document.querySelector(`.steps_bar > div:nth-child(3)`);
const bar1Container = document.querySelector(`.fund_wallet_step--1`);
const bar2Container = document.querySelector(`.fund_wallet_step--2`);
const bar3Container = document.querySelector(`.fund_wallet_step--3`);
let tabState = 1;

nextFundBtn.addEventListener("click", handleNextFund);
backFundBtn.addEventListener("click", handleBackFund);

function handleNextFund() {
  if (tabState === 1) {
    // increment the state value
    tabState = tabState + 1;
    bar2.classList.add("active");
    bar1Container.classList.add(HIDDEN);
    bar2Container.classList.remove(HIDDEN);
    return;
  }

  if (tabState === 2) {
    // increment the state value
    tabState = tabState + 1;
    bar3.classList.add("active");
    nextFundBtn.textContent = "Pay";
    bar2Container.classList.add(HIDDEN);
    bar3Container.classList.remove(HIDDEN);
    return;
  }

  if (tabState === 3) {
    const paymentModal = document.querySelector(`.payment_with_${gateWay}`);

    // Reset Elements
    bar3.classList.remove("active");
    bar2.classList.remove("active");
    paymentModal.classList.remove(HIDDEN);
    fundModal.classList.add(HIDDEN);

    document.querySelector(".fill_in_amount").classList.remove(HIDDEN);
    document.querySelector(".fund_wallet_option").classList.add(HIDDEN);
    document.querySelector("#paymentForm").classList.add(HIDDEN);
    tabState = 1; // reset tabState
    return;
  }
}

function handleBackFund() {
  if (tabState === 2) {
    // decrement the state value
    tabState = tabState - 1;
    bar2.classList.remove("active");
    bar1Container.classList.remove(HIDDEN);
    bar2Container.classList.add(HIDDEN);
    return;
  }

  if (tabState === 3) {
    // decrement the state value
    tabState = tabState - 1;
    bar3.classList.remove("active");
    bar2Container.classList.remove(HIDDEN);
    bar3Container.classList.add(HIDDEN);
    nextFundBtn.textContent = "Next";
    return;
  }

  if (tabState === 1) {
    const paymentModal = document.querySelector(`.payment_with_${gateWay}`);
    fundModal.classList.add(HIDDEN);
    paymentModal.classList.remove(HIDDEN);
    return;
  }
}
