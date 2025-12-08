const modal = document.getElementById("xoGameModal");
const openBtn = document.getElementById("openXOGameModalBtn");
const xoGameModalStart = document.getElementById("xoGameModalStart");
const closeBtn = document.getElementById("closeXOGameModal");
const board = document.getElementById("xoBoard");
const nextGameBtn = document.getElementById("nextGameBtn");
const xoChallengeSelectModal = document.getElementById(
  "xoChallengeSelectModal"
);
const startXoChallengeBtn = document.getElementById("startXoChallengeBtn");
const startXoChallengeSelectModalBtn = document.getElementById(
  "startXoChallengeSelectModal"
);
const xoShareCollaborationModal = document.getElementById(
  "xoShareCollaborationModal"
);
const xoHeaderLeft = document.getElementById("xoHeaderLeft");
const xoHeaderRight = document.getElementById("xoHeaderRight");
const closeXo = document.getElementById("closeXo");
const activeCollaborators = document.querySelector(".active_collaborators");
const sendCoinModal = document.getElementById("sendCoinModal");

const activeCollaboratorsContainer = document.querySelector(
  ".active_collaborators_container"
);
let currentPlayer = "X";
let boardState = Array(9).fill("");

openBtn.addEventListener("click", () => {
  xoGameModalStart.classList.toggle("xo-hidden");
});

startXoChallengeBtn.addEventListener("click", () => {
  xoGameModalStart.classList.add("xo-hidden");
  xoChallengeSelectModal.classList.remove("xo-hidden");
  //   boardState = Array(9).fill("");
  //   document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  //   currentPlayer = "X";
});
xoGameModalStart.addEventListener("click", (e) => {
  if (e.target === xoGameModalStart) {
    xoGameModalStart.classList.add("xo-hidden");
  }
});

// Close xoChallengeSelectModal when clicking outside content
xoChallengeSelectModal.addEventListener("click", (e) => {
  if (e.target === xoChallengeSelectModal) {
    xoChallengeSelectModal.classList.add("xo-hidden");
  }
});
xoChallengeSelectModal.addEventListener("click", (e) => {
  //
  if (e.target.id === "xoChallengeSelectModal") {
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

closeXo.addEventListener("click", () => {
  modal.classList.add("xo-hidden");
});
startXoChallengeSelectModalBtn.addEventListener("click", () => {
  xoChallengeSelectModal.classList.add("xo-hidden");

  modal.classList.remove("xo-hidden");

  boardState = Array(9).fill("");
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  currentPlayer = "X";
});
// closeBtn.addEventListener("click", () => {
//   modal.classList.remove("xo-hidden");
// });

xoHeaderLeft.addEventListener("click", () => {
  if (activeCollaborators) {
    xoHeaderLeft.innerHTML = activeCollaborators.innerHTML;
  }
});
activeCollaboratorsContainer.addEventListener("click", (e) => {
  const shareController = document.querySelector(
    ".share_collaboration--controller"
  );
  shareController.classList.toggle("xo-hidden");
  console.log("Clicked on active collaborators container");
});

xoHeaderRight.addEventListener("click", () => {
  if (sendCoinModal) {
    sendCoinModal.classList.toggle("xo-hidden");
  }
});

board.addEventListener("click", (e) => {
  if (e.target.classList.contains("cell")) {
    const index = e.target.dataset.index;
    if (boardState[index] === "") {
      boardState[index] = currentPlayer;
      e.target.textContent = currentPlayer;
      if (checkWinner()) {
        alert(`${currentPlayer} wins!`);
        disableBoard();
      } else if (boardState.every((cell) => cell !== "")) {
        alert("Draw!");
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
      }
    }
  }
});

nextGameBtn.addEventListener("click", () => {
  boardState = Array(9).fill("");
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  currentPlayer = "X";
});

function checkWinner() {
  const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];
  return winCombos.some((combo) =>
    combo.every((i) => boardState[i] === currentPlayer)
  );
}

function disableBoard() {
  document
    .querySelectorAll(".cell")
    .forEach((cell) => (cell.style.pointerEvents = "none"));
}
