const tabItemRowContainer = document.querySelector(".tabs--contents");

tabItemRowContainer.addEventListener("click", (e) => {
  const target = e.target;

  if (target.closest(".collaboration_page--btn")) {
    return (location.href = "/collaboration-page.html");
  }

  // Bookmark Event
  if (target.closest(".bookmark")) {
    const bookmarkBtn = target.closest(".bookmark");

    if (bookmarkBtn.classList.contains("bookmark--active")) {
      bookmarkBtn.classList.remove("bookmark--active");
    } else {
      bookmarkBtn.classList.add("bookmark--active");
    }
  }
});
