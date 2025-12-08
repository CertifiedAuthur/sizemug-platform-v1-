document.querySelectorAll(".custom-select-wrapper").forEach((wrapper) => {
  const trigger = wrapper.querySelector(".custom-select-trigger");
  const options = wrapper.querySelector(".custom-options");
  const input = wrapper.querySelector("input[type='hidden']");
  const selected = wrapper.querySelector(".selected-value");

  // Toggle dropdown
  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".custom-options").forEach((opt) => {
      if (opt !== options) opt.classList.add("hidden");
    });
    options.classList.toggle("hidden");
  });

  // Select option
  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerHTML = option.innerHTML;
      input.value = option.getAttribute("data-value");
      options.classList.add("hidden");
    });
  });
});

// Click outside closes all dropdowns
document.addEventListener("click", () => {
  document
    .querySelectorAll(".custom-options")
    .forEach((opt) => opt.classList.add("hidden"));
});
