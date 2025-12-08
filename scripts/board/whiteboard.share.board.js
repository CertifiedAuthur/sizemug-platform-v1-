class ShareBoard {
  constructor() {
    this.shareBoard = document.getElementById("share_board");
    this.followingShareModal = document.getElementById("followingShareMdal");
    this.hideShareButton = followingShareModal.querySelector(".cancel-modal");
    this.showAddStoryModal = document.querySelector(".showAddStoryModal");

    this.bindEvents();
  }

  bindEvents() {
    //
    this.shareBoard.addEventListener("click", () => {
      this.followingShareModal.classList.remove(HIDDEN);
    });

    //
    this.hideShareButton.addEventListener("click", () => this.hideShareModal());

    this.showAddStoryModal.addEventListener("click", () => {
      this.hideShareModal();
      showStoryModal();
    });
  }

  hideShareModal() {
    this.followingShareModal.classList.add(HIDDEN);
  }
}
