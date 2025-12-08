class LiveChatSpinChallenge {
  constructor() {
    this.playSpinChallenge = document.getElementById("playSpinChallenge");
    this.spinChallengeModal = document.getElementById("spinChallengeModal");
    this.spinTypeButtons = document.querySelectorAll(".spin_grid_items button");
    this.spinContainer = document.getElementById("spinContainer");
    this.showLeaderboard = document.getElementById("showLeaderboard");
    this.spinSliderContainer = document.getElementById("spinSliderContainer");
    this.leaderBoardContainer = document.getElementById("leaderBoardContainer");
    this.backToSpinningContainer = document.getElementById("backToSpinningContainer");
    this.basicBoostSpinButton = document.getElementById("basicBoostSpinButton");
    this.power30BoostSpinButton = document.getElementById("power30BoostSpinButton");
    this.power60BoostSpinButton = document.getElementById("power60BoostSpinButton");
    this.spinBoostDialog = document.getElementById("spinBoostDialog");
    this.cancelSpinChallengeModal = document.getElementById("cancelSpinChallengeModal");
    this.nextSpinChallengeModal = document.getElementById("nextSpinChallengeModal");
    this.spinChallengeSelectModal = document.getElementById("spinChallengeSelectModal");
    this.cancelSpinChallengeSelectModal = document.getElementById("cancelSpinChallengeSelectModal");
    this.startSpinChallengeSelectModal = document.getElementById("startSpinChallengeSelectModal");
    this.toggleGamerView = document.getElementById("toggleGamerView");
    this.awardCupIconHeart = document.getElementById("awardCupIconHeart");
    this.closeSpinWheelModal = document.getElementById("closeSpinWheelModal");
    this.questionOptionSliders = document.querySelectorAll(".questionOptionSlider");

    this.sendCoinCount = 0;
    this.startedGaming = false;

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.awardCupIconHeart.addEventListener("click", () => {
      this.awardCupIconHeart.classList.toggle("active");
    });

    this.playSpinChallenge.addEventListener("click", () => {
      if (this.startedGaming) {
        this.spinContainer.classList.add("active");
        return;
      }

      this.spinChallengeModal.classList.remove(HIDDEN);
    });

    this.closeSpinWheelModal.addEventListener("click", () => {
      this.spinContainer.classList.remove("active");
    });

    this.spinChallengeModal.addEventListener("click", (e) => {
      if (e.target.id === "spinChallengeModal") {
        return this.spinChallengeModal.classList.add(HIDDEN);
      }
    });

    // Show Spinning Container
    // this.spinTypeButtons.forEach((btn) => {
    //   btn.addEventListener("click", () => {
    //     this.spinChallengeModal.classList.add(HIDDEN);
    //     this.spinContainer.classList.add("active");
    //   });
    // });

    //
    this.showLeaderboard.addEventListener("click", (e) => {
      this.spinSliderContainer.classList.add(HIDDEN);
      this.leaderBoardContainer.classList.remove(HIDDEN);
    });

    //
    this.backToSpinningContainer.addEventListener("click", (e) => {
      this.leaderBoardContainer.classList.add(HIDDEN);
      this.spinSliderContainer.classList.remove(HIDDEN);
    });

    //
    this.cancelSpinChallengeModal.addEventListener("click", () => {
      this.spinChallengeModal.classList.add(HIDDEN);
    });

    //
    this.nextSpinChallengeModal.addEventListener("click", () => {
      this.spinChallengeModal.classList.add(HIDDEN);
      this.spinChallengeSelectModal.classList.remove(HIDDEN);
    });

    //
    this.questionOptionSliders.forEach((slider) => {
      slider.addEventListener("click", (e) => {
        if (e.target.classList.contains("questionOptionSlider")) {
          const target = e.target;

          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Calculate percentages
          const xPercent = (x / rect.width) * 100;
          const yPercent = (y / rect.height) * 100;

          console.log(`Click position: ${xPercent.toFixed(2)}% horizontal, ${yPercent.toFixed(2)}% vertical`);
          target.closest(".option").setAttribute("aria-selected", "true");
          target.closest(".option").querySelector(".answeringOptionSlider").style.width = `${xPercent}%`;
        }
      });
    });

    //
    this.spinChallengeSelectModal.addEventListener("click", (e) => {
      //
      if (e.target.id === "spinChallengeSelectModal") {
        return this.spinChallengeSelectModal.classList.add(HIDDEN);
      }

      //
      const button = e.target.closest(".select_user");
      if (button) {
        const mode = button.dataset.mode;

        console.log(mode);

        if (mode === "invite") {
          button.textContent = "Invited";
          button.setAttribute("data-mode", "challenge");
        } else {
          button.textContent = "Challenge";
          button.setAttribute("data-mode", "invite");
        }
      }
    });

    this.cancelSpinChallengeSelectModal.addEventListener("click", () => {
      this.spinChallengeSelectModal.classList.add(HIDDEN);
    });

    this.startSpinChallengeSelectModal.addEventListener("click", () => {
      // if (this.startedGaming) {
      //   return;
      // }

      this.spinChallengeSelectModal.classList.add(HIDDEN);
      this.spinContainer.classList.add("active");

      this.startedGaming = true;
    });

    this.toggleGamerView.addEventListener("click", () => {
      document.getElementById("playerQuoteContainer").classList.toggle(HIDDEN);
      document.getElementById("ownerQuoteContainer").classList.toggle(HIDDEN);
    });

    this.basicBoostSpinButton.addEventListener("click", (e) => {
      const messageSender = new ChatMessageSender();

      this.sendCoinCount = this.sendCoinCount + 1;

      messageSender.sendMessage({
        content: 100,
        currentOpenedUser,
        currentChattingInfo,
        taggedData: {},
        liveChatGameInfo: {
          type: "boost",
          amount: 100,
          count: this.sendCoinCount,
        },
      });

      this.boostConfettiFn();

      this.spinBoostDialog.style.display = "none";
    });

    this.power30BoostSpinButton.addEventListener("click", (e) => {
      const messageSender = new ChatMessageSender();

      this.sendCoinCount = this.sendCoinCount + 1;

      messageSender.sendMessage({
        content: 300,
        currentOpenedUser,
        currentChattingInfo,
        taggedData: {},
        liveChatGameInfo: {
          type: "boost",
          amount: 300,
          count: this.sendCoinCount,
        },
      });

      this.boostConfettiFn();

      this.spinBoostDialog.style.display = "none";
    });

    this.power60BoostSpinButton.addEventListener("click", (e) => {
      const messageSender = new ChatMessageSender();

      this.sendCoinCount = this.sendCoinCount + 1;

      messageSender.sendMessage({
        content: 500,
        currentOpenedUser,
        currentChattingInfo,
        taggedData: {},
        liveChatGameInfo: {
          type: "boost",
          amount: 500,
          count: this.sendCoinCount,
        },
      });

      this.boostConfettiFn();

      this.spinBoostDialog.style.display = "none";
    });
  }

  //
  boostConfettiFn() {
    const canvas = document.getElementById("boostSpinChallengeCanvas");
    canvas.style.display = "block";

    const party = new Confetti(canvas, { count: 40, emojis: ["🪙"] });

    console.log(party);
    party.start();

    const checkDone = setInterval(() => {
      if (!party._running) {
        clearInterval(checkDone);
        this.fadeOutAndHide(canvas, 600);
      }
    }, 9000);
  }

  fadeOutAndHide(el, duration = 500) {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.display = "none";
      el.style.transition = "";
      el.style.opacity = 1;
    }, duration);
  }
}

new LiveChatSpinChallenge();

new PopperModal({
  triggerSelector: "#boostSpinChallenge",
  modalSelector: "#spinBoostDialog",
  placement: "right-start",
  offset: [0, 12],
});

/**
 *
 *
 *
 *
 *
 */
const segments = [
  {
    color: "#7B4EFF",
    label: "Pop-culture",
    imageUrl: "https://i.pravatar.cc/100?u=micah",
    username: "Micah",
  },
  {
    color: "#FE3A30",
    label: "Random",
    imageUrl: "https://i.pravatar.cc/100?u=vincent",
    username: "Vincent",
  },
  {
    color: "#7D26CD",
    label: "Music",
    imageUrl: "https://i.pravatar.cc/100?u=mike",
    username: "Mike",
  },
  {
    color: "#FFA500",
    label: "Historic",
    imageUrl: "https://i.pravatar.cc/100?u=ashley",
    username: "Ashley",
  },
  {
    color: "#00CFFF",
    label: "Movies",
    imageUrl: "https://i.pravatar.cc/100?u=mary",
    username: "Mary",
  },
  {
    color: "#5856d6",
    label: "Movies",
    imageUrl: "https://i.pravatar.cc/100?u=musa",
    username: "Musa",
  },
  {
    color: "#345677",
    label: "Movies",
    imageUrl: "https://i.pravatar.cc/100?u=jane",
    username: "Jane",
  },
];

function createWheelSegments() {
  const spinnerWheel = document.getElementById("spinnerWheel");
  const angle = 360 / segments.length;
  spinnerWheel.innerHTML = "";

  segments.forEach((seg, i) => {
    const markup = `
      <div class="segment" style="--i:${i + 1}; --clr:${seg.color}; --angle:${angle}deg;">
        <div class="segment-content">
          <h3>${seg.label}</h3>
          <img src="${seg.imageUrl}" alt="${seg.username}" />
          <span>${seg.username}</span>
        </div>
      </div>
    `;
    spinnerWheel.insertAdjacentHTML("beforeend", markup);
  });
}

createWheelSegments();

// new WheelSpinner({
//   canvasId: "wheel",
//   spinButtonId: "spin",
//   segments,
//   onResult: (label) => {
//     document.querySelectorAll(".option").forEach((el) => el.classList.toggle("active", el.dataset.val === label));
//   },
// });

const spinBtn = document.getElementById("spinBtn");
const wheel = document.querySelector(".wheel");
let deg = 0;

spinBtn.addEventListener("click", () => {
  const min = 1024;
  const max = 9999;
  const rotation = Math.floor(Math.random() * (max - min)) + min;
  deg += rotation;

  wheel.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
  wheel.style.transform = `rotate(${deg}deg)`;
});
