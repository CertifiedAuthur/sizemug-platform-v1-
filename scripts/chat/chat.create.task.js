class ChatCreateTask {
  constructor() {
    this.createTaskWithUserButton = document.getElementById("createTaskWithUserButton");
    this.addNewTaskWithThisUserModal = document.getElementById("addNewTaskWithThisUserModal");

    this.init();
  }

  init() {
    this.createTaskWithUserButton?.addEventListener("click", () => {
      this.showCreateTaskWithUser();
    });

    this.addNewTaskWithThisUserModal?.addEventListener("click", (e) => {
      if (e.target.id === "addNewTaskWithThisUserModal") {
        this.hideCreateTaskWithUser();
      }
    });
  }

  showCreateTaskWithUser() {
    this.addNewTaskWithThisUserModal.classList.remove(HIDDEN);
  }

  hideCreateTaskWithUser() {
    this.addNewTaskWithThisUserModal.classList.add(HIDDEN);
  }
}

window.ChatCreateTask = new ChatCreateTask();
