const closeChristmasContainer = document.getElementById("closeChristmasContainer");

closeChristmasContainer.addEventListener("click", () => {
  closeChristmasContainer.closest(".christmas_header").remove();
});
