class TopStickyContainer {
  constructor(container = document.getElementById("topContainerOverlay")) {
    this.container = container;

    this.boardsInstance = null;
    this.emojiInstance = null;
    this.collaboratorsInstance = null;
    this.settingsInstance = null;
    this.notificationsInstance = null;
    this.commentsInstance = null;

    // Show Top Container :)
    this.container.classList.remove(HIDDEN);

    this.init();
  }

  init() {
    // Find the button and the emoji container
    const emojiButton = document.querySelector("button.send_emoji.reactions--intro");
    const emojiContainer = document.querySelector(".send_emoji_container_wrapper");

    if (emojiButton && emojiContainer) {
      this.emojiInstance = new EmojiPopper(emojiButton, emojiContainer, () => this.hideAllPoppers("emoji"));
    }

    // Find the button and the collaborators container
    const collaboratorsButton = document.querySelector(".show_collaborators");
    const collaboratorsContainer = document.querySelector(".sticky_collaborators");
    if (collaboratorsButton && collaboratorsContainer) {
      this.collaboratorsInstance = new CollaboratorsPopper(collaboratorsButton, collaboratorsContainer, () => this.hideAllPoppers("collaborators"));
    }

    // Find the mobile button and the mobile collaborators container
    const mobileCollaboratorsButton = document.querySelector(".mobile_show_collaborators");
    const mobileCollaboratorsContainer = document.querySelector(".top_sticky_collaborator--mobile .sticky_collaborators");
    if (mobileCollaboratorsButton && mobileCollaboratorsContainer) {
      this.collaboratorsInstance = new CollaboratorsPopper(mobileCollaboratorsButton, mobileCollaboratorsContainer, () => this.hideAllPoppers("collaborators"));
    }

    // Find the settings button and container
    const settingsButton = document.querySelector(".settings--intro");
    const settingsContainer = document.querySelector("#top_container--settings");
    if (settingsButton && settingsContainer) {
      this.settingsInstance = new SettingsPopper(settingsButton, settingsContainer, () => this.hideAllPoppers("settings"));
    }

    // Find the notifications button and container
    const notificationsButton = document.querySelector(".notificaions--intro");
    const notificationsContainer = document.querySelector("#top_container--notifications");
    if (notificationsButton && notificationsContainer) {
      this.notificationsInstance = new NotificationsPopper(notificationsButton, notificationsContainer, () => this.hideAllPoppers("notifications"));
    }

    // Find the comments button and container
    const showBoardComments = document.getElementById("showBoardComments");
    const boardCommentModal = document.getElementById("boardCommentModal");
    if (showBoardComments && boardCommentModal) {
      this.commentsInstance = new CommentsPopper(showBoardComments, boardCommentModal, () => this.hideAllPoppers("comments"));
    }

    // BoardsContainer
    new BoardsContainer(() => this.hideAllPoppers("boards"));

    // Share Modal
    new ShareBoard();
  }

  showPopper(popperName) {
    this.hideAllPoppers(popperName);
    const instance = this[`${popperName}Instance`];
    if (instance) {
      instance.show();
    }
  }

  hidePopper(popperName) {
    const instance = this[`${popperName}Instance`];
    if (instance) {
      instance.hide();
    }
  }

  togglePopper(popperName) {
    const instance = this[`${popperName}Instance`];
    if (instance) {
      if (instance.isOpen) {
        instance.hide();
      } else {
        this.hideAllPoppers(popperName);
        instance.show();
      }
    }
  }

  hideAllPoppers(exceptPopperName = null) {
    const poppers = ["emoji", "collaborators", "settings", "notifications", "comments", "boards"];
    for (const name of poppers) {
      if (name !== exceptPopperName) {
        this.hidePopper(name);
      }
    }
  }
}

window.TopStickyContainer = new TopStickyContainer();
