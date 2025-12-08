document.addEventListener("input", (e) => {
  if (e.target.id === "tooltipInterest") {
    const filterValue = e.target.value.toLowerCase();
    /**
     * A NodeList of all <li> elements within elements with the class "interest-more-container".
     *
     * @type {NodeListOf<HTMLLIElement>}
     */
    const listItems = document.querySelectorAll(".interest-more-container li");

    listItems.forEach((item) => {
      if (item.textContent.toLowerCase().includes(filterValue)) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
});
