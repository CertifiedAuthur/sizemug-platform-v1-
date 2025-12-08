document.addEventListener("alpine:init", () => {
  Alpine.data("search_init", () => ({
    open: false,
    search: "",
    search_category: "top",
    filter_menu: "",
    search_input: {
      ["x-model"]: this.search_input,
    },
    show_input: {
      ["x-text"]: this.search_input,
    },
  }));
});

/* filter menu */
const filter_menu = document.querySelectorAll(".filter_categories-item menu");
const filter_menu_seleted = document.querySelector(".filter_categories-item span");
filter_menu.forEach((el, key) => {});

function InputRange(data) {
  if (typeof data !== "object") {
    return false;
  }
  const rangevalue = document.querySelector(data?.rangeValue);
  const rangeInputvalue = document.querySelectorAll(data?.rangeInputvalue);

  // Set the range gap
  let rangeGap = data?.rangeGap;

  // Add event listeners to range input elements
  for (let i = 0; i < rangeInputvalue.length; i++) {
    rangeInputvalue[i].addEventListener("input", (e) => {
      let minVal = parseInt(rangeInputvalue[0].value);
      let maxVal = parseInt(rangeInputvalue[1].value);
      let diff = maxVal - minVal;

      // Check if the range gap is exceeded
      if (diff < rangeGap) {
        // Check if the input is the min range input
        if (e.target.className === "min-range") {
          rangeInputvalue[0].value = maxVal - rangeGap;
        } else {
          rangeInputvalue[1].value = minVal + rangeGap;
        }
      } else {
        // Update range inputs and range progress
        rangevalue.style.left = `${(minVal / rangeInputvalue[0].max) * 100}%`;
        rangevalue.style.right = `${100 - (maxVal / rangeInputvalue[1].max) * 100}%`;
      }
    });
  }
}
