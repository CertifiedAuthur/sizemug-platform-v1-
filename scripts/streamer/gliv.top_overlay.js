class GlivTopOverlay {
  constructor() {
    this.topGiftedScrollingContainer = document.getElementById("topGiftedScrollingContainer");
    this.topGiftedExpandButton = document.getElementById("topGiftedExpandButton");

    this.vipGiftedScrollingContainer = document.getElementById("vipGiftedScrollingContainer");
    this.vipGiftedExpandButton = document.getElementById("vipGiftedExpandButton");

    this.init();

    this.renderUsers();
  }

  init() {
    this.topGiftedExpandButton.addEventListener("click", () => {
      // Scroll Right smoothly
      this.topGiftedScrollingContainer.scrollBy({
        left: 40,
        behavior: "smooth",
      });
    });

    this.vipGiftedExpandButton.addEventListener("click", () => {
      // Scroll Right smoothly
      this.vipGiftedScrollingContainer.scrollBy({
        left: 40,
        behavior: "smooth",
      });
    });
  }

  renderUsers() {
    apiGetUsers(20).then((users) => {
      this.topGiftedScrollingContainer.innerHTML = "";
      this.topGiftedScrollingContainer.innerHTML = users
        .map(
          (user, i) => `
            <div class="gifted_item">
              <img src="${user.photo}" alt="${user.name}" />
              <span>${i + 1}</span>
            </div>
          `
        )
        .join("");
    });

    apiGetUsers(20).then((users) => {
      this.vipGiftedScrollingContainer.innerHTML = "";
      this.vipGiftedScrollingContainer.innerHTML = users
        .map(
          (user, i) => `
              <div class="gifted_item">
                <img src="${user.photo}" alt="${user.name}" />
                <span>${i + 1}</span>
              </div>
            `
        )
        .join("");
    });
  }
}

new GlivTopOverlay();
