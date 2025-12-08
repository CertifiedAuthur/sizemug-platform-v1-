class StreamerScreen {
  constructor() {
    this.adultWarningGoBack = document.getElementById("adultWarningGoBack");
    this.adultWarningEnterScreen = document.getElementById("adultWarningEnterScreen");
    this.adultWarningModal = document.getElementById("adultWarningModal");

    this.bindEvent();
  }

  bindEvent() {
    // Go Back
    this.adultWarningGoBack.addEventListener("click", () => {
      window.location.href = "/live.html";
    });

    // Enter Screen
    this.adultWarningEnterScreen.addEventListener("click", () => {
      this.adultWarningModal.remove();
    });
  }
}

new StreamerScreen();
