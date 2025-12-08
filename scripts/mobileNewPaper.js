document.addEventListener("DOMContentLoaded", function () {
  const newPaperModal = document.getElementById("new_paper_modal");
  const closeNewPaperModalBtn = document.getElementById("close_template_modal--mobile");
  const floatingAddNewPaperBtn = document.getElementById("floating_add_new_paper");
  const paperNavigateInBlank = document.getElementById("paper_navigate_in_blank");

  closeNewPaperModalBtn.addEventListener("click", closeNewPaperModalFn);
  floatingAddNewPaperBtn.addEventListener("click", openNewPaperModalFn);

  function closeNewPaperModalFn() {
    addClass(newPaperModal);
  }

  function openNewPaperModalFn() {
    removeClass(newPaperModal);
  }

  // Generate dummy templates
  Array.from({ length: 18 }, (_, i) => i + 1).map((item) => {
    const markup = `
              <div class="grid_list_template">
                <img src="/images/suggestion_new_paper.png" alt="Employee Onboarding" />
                <div>
                  <span>Template name</span>
                </div>
              </div>`;

    document.getElementById("grid_list_templates").insertAdjacentHTML("beforeend", markup);
  });

  //   Blank Button Event
  paperNavigateInBlank.addEventListener("click", () => {
    localStorage.setItem("new-paper-match", false);
    location.href = "/paper-editing.html";
    return;
  });
});
