class TaskWithUserModal {
  constructor() {
    this.modal = document.getElementById("taskWithUserModalContainer");
    this.chatFooterBottomTasksLists = document.querySelectorAll(".chatTasksLists");
    this.modalPopper = null;

    this.init();
  }

  init() {
    this.chatFooterBottomTasksLists.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleOpenUserTask(e));
    });

    this.bindGlobalClick();
  }

  handleOpenUserTask(e) {
    const btn = e.currentTarget;
    const position = +btn.dataset.trackerId;

    this.modal.classList.remove("modal");

    if ((currentMaxOpenedChat === 3 && [2, 3].includes(position)) || (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(position))) {
      this.showTaskWithUserModal(btn, false);
      this.modal.classList.add("modal");
      return;
    }

    this.showTaskWithUserModal(btn);
  }

  bindGlobalClick() {
    document.addEventListener("click", (e) => this.handleOutsideClick(e));
  }

  handleOutsideClick(e) {
    if (!e.target.closest(".chatTasksListsContainer") && !e.target.closest(".chatTasksLists")) {
      this.modal.classList.add(HIDDEN);
    }
  }

  showTaskWithUserModal(referenceBtn, position = true) {
    this.modal.classList.remove(HIDDEN);

    if (this.modalPopper) {
      this.modalPopper.destroy();
      this.modalPopper = null;
    }

    if (position) {
      // Create new popper for modal
      this.modalPopper = Popper.createPopper(referenceBtn, this.modal, {
        placement: "bottom-start",
        modifiers: [
          { name: "offset", options: { offset: [0, 8] } },
          { name: "preventOverflow", options: { boundary: "viewport" } },
        ],
      });
    }
  }
}

new TaskWithUserModal();
