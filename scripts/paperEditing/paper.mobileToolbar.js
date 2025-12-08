document.addEventListener("DOMContentLoaded", () => {
  const mobileToolbarOptionBtn = document.getElementById("mobile_toolbar_option--btn");
  const mobileToolbarOptionItems = document.querySelectorAll("#mobile_toolbar_option--btn~ul li");

  // mobileToolbarOptionBtn - This variable was declared in paperEditing/toolbar.js file
  mobileToolbarOptionBtn.addEventListener("click", function () {
    const attriStatus = this.getAttribute("aria-selected");

    if (attriStatus === "false") {
      this.setAttribute("aria-selected", true);
    } else {
      this.setAttribute("aria-selected", false);
    }
  });

  mobileToolbarOptionItems.forEach((button) => {
    button.addEventListener("click", () => {
      mobileToolbarOptionBtn.setAttribute("aria-selected", false);
    });
  });

  // Bold
  const mobileToolbarBoldBtn = document.getElementById("mobile_toolbar_bold--btn");
  mobileToolbarBoldBtn.addEventListener("click", () => handleOnBold(focusedEditor));

  // Italic
  const mobileToolbarItalicBtn = document.getElementById("mobile_toolbar_italic--btn");
  mobileToolbarItalicBtn.addEventListener("click", () => handleOnItalic(focusedEditor));

  // Underline
  const mobileToolbarUnderlineBtn = document.getElementById("mobile_toolbar_underline--btn");
  mobileToolbarUnderlineBtn.addEventListener("click", () => handleTextUnderline(focusedEditor));

  // Center Alignment
  const mobileToolbarCenterAlignmentBtn = document.getElementById("mobile_toolbar_alignCenter--btn");
  mobileToolbarCenterAlignmentBtn.addEventListener("click", () => handleAlignment("center", focusedEditor));

  // Left Alignment
  const mobileToolbarLeftAlignmentBtn = document.getElementById("mobile_toolbar_alignLeft--btn");
  mobileToolbarLeftAlignmentBtn.addEventListener("click", () => handleAlignment("left", focusedEditor));

  // Bullet List
  const mobileToolbarBulletListBtn = document.getElementById("mobile_toolbar_bulletList--btn");
  mobileToolbarBulletListBtn.addEventListener("click", () => handleList("bullet", focusedEditor));

  // Quotation
  const mobileToolbarQuotationBtn = document.getElementById("mobile_toolbar_quotation--btn");
  mobileToolbarQuotationBtn.addEventListener("click", handleBlockQuote);

  // Add Link
  const mobileToolbarLinkBtn = document.getElementById("mobile_toolbar_link--btn");
  mobileToolbarLinkBtn.addEventListener("click", openAddLinkModal);

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#mobile_toolbar_option--btn")) {
      mobileToolbarOptionBtn.setAttribute("aria-selected", false);
    }
  });
});
