const favouriteBtn = document.getElementById("favourite--btn");
favouriteBtn.addEventListener("click", function (e) {
  const svg = this.querySelector("svg");

  if (svg.classList.contains("active")) {
    svg.classList.remove("active");
  } else {
    svg.classList.add("active");
  }
});
