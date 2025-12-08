const lovesLikeModal = document.getElementById("lovesLikeModal");
const hideLovesLikesModal = document.getElementById("hideLovesLikesModal");

function handleLovesLikesDisplayModal() {
  const commentLovesAndLikesBtns = document.querySelectorAll("#commentLovesAndLikesBtn");

  commentLovesAndLikesBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      return lovesLikeModal.classList.remove(HIDDEN);
    });
  });
}

// Hide Loves & Likes Modal
hideLovesLikesModal.addEventListener("click", function () {
  lovesLikeModal.classList.add(HIDDEN);
});

lovesLikeModal.addEventListener("click", function (e) {
  if (e.target.id === "lovesLikeModal") {
    this.classList.add(HIDDEN);
  }
});

const loveLikeTab = document.getElementById("loveLikeTab");
loveLikeTab.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  const { tab } = button.dataset;

  if (tab) {
    const container = document.getElementById(`${tab}Container`);

    loveLikeTab.querySelectorAll("button").forEach((btn) => {
      btn.classList.remove("active");
    });

    lovesLikeModal.querySelectorAll(".panel-item").forEach((panel) => {
      panel.classList.add(HIDDEN);
    });

    button.classList.add("active");
    container.classList.remove(HIDDEN);
  }
});
