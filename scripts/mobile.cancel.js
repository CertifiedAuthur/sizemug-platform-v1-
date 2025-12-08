// Mobile Cancel Event
const modalMobileCancel = document.querySelectorAll(".modal_mobile_cancel");
modalMobileCancel.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    e.target.closest(".overlay").classList.add(HIDDEN);
  })
);
