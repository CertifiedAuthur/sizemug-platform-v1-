"use strict";
const fontSizeSelectAll = document.querySelectorAll("#fontSizeSelect");

fontSizeSelectAll.forEach((select) => {
  select.addEventListener("change", () => {
    const fontSize = select.value;
    formatDoc("fontSize", fontSize);
  });
});
