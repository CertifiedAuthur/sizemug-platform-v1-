class RechargeCoin {
  constructor({ triggerSelector, modalSelector }) {
    this.triggerSelector = document.querySelector(triggerSelector);
    this.modalSelector = document.querySelector(modalSelector);
    this.successRechargeModal = document.getElementById("successRechargeModal");
    this.closeSuccessfullRechargeModal = document.getElementById("closeSuccessfullRechargeModal");

    this.init();
  }

  init() {
    this.bindEvents();

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const addCoinSelectionAmount = document.getElementById("addCoinSelectionAmount");
    const addCoinPayment = document.getElementById("addCoinPayment");
    const addCoinPaymentDetails = document.getElementById("addCoinPaymentDetails");
    const stepLine1 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(1)");
    const stepLine2 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(2)");
    const stepLine3 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(3)");

    // cancel coin option payment
    const cancelCoinOptionPayment = document.getElementById("cancelCoinOptionPayment");
    cancelCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);
    });

    // back to coin option payment
    const backToCoinOptionPayment = document.getElementById("backToCoinOptionPayment");
    backToCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.removeAttribute("data-active");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
    });

    const backToCoinPayment = document.getElementById("backToCoinPayment");
    backToCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.remove(HIDDEN);
    });

    // next to coin option payment
    const nextToCoinOptionPayment = document.getElementById("nextToCoinOptionPayment");
    nextToCoinOptionPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    const nextToCoinPayment = document.getElementById("nextToCoinPayment");
    nextToCoinPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.setAttribute("data-active", "");
      addCoinPaymentDetails.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    // pay final coin payment
    const payFinalCoinPayment = document.getElementById("payFinalCoinPayment");
    payFinalCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.removeAttribute("data-active");
      stepLine3.removeAttribute("data-active");
      addCoinSelectionAmount.classList.remove(HIDDEN);

      // Create-or-reuse a single canvas/instance
      let canvas = document.getElementById("burstConfettiCanvas");
      if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "burstConfettiCanvas";
        document.body.appendChild(canvas);
      }

      // If there's an existing instance still running, stop it (to prevent overlap)
      if (canvas._burstInstance && canvas._burstInstance.running) {
        canvas._burstInstance.stop();
      }

      if (!canvas._burstInstance) {
        canvas._burstInstance = new BurstConfetti(canvas);
      }
      const burst = canvas._burstInstance;

      burst.burst({
        count: 180,
        spread: 360,
        speed: { min: 700, max: 1000 },
        gravity: 900,
        decay: 0.98,
        colors: ["#ff8a65", "#ffd54f", "#81c784", "#4fc3f7", "#b39ddb"],
        shape: "rect", // "rect"
        size: { min: 8, max: 14 },
        duration: 4000,
      });

      //
      this.successRechargeModal.classList.remove(HIDDEN);

      // Clean up when done by polling, then destroy the instance + remove canvas
      const cleanup = setInterval(() => {
        if (!burst.running) {
          clearInterval(cleanup);
          burst.destroy(); // removes resize listener & clears canvas
          delete canvas._burstInstance;
          canvas.remove();
        }
      }, 150);
    });

    const paymentOpts = document.querySelectorAll("button.payment_opt__select");
    paymentOpts.forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.classList.contains("selected")) {
          paymentOpts.forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        }
      });
    });
  }

  bindEvents() {
    // Open modal when clicking the trigger button
    this.triggerSelector.addEventListener("click", () => {
      this.modalSelector.classList.remove(HIDDEN);
    });

    // Close modal when clicking outside the modal
    this.modalSelector.addEventListener("click", (e) => {
      // Stop event propagation to prevent closing the coin balance modal when clicking inside the recharge modal
      e.stopPropagation();

      if (e.target.id === "addCoinModalContainer") {
        this.modalSelector.classList.add(HIDDEN);
      }
    });

    //
    this.closeSuccessfullRechargeModal.addEventListener("click", () => {
      this.successRechargeModal.classList.add(HIDDEN);
    });

    //
    this.successRechargeModal.addEventListener("click", (e) => {
      if (e.target.id === "successRechargeModal") {
        this.successRechargeModal.classList.add(HIDDEN);
      }
    });
  }
}

new RechargeCoin({ triggerSelector: "#showRechargeCoinModal", modalSelector: "#addCoinModalContainer" });
