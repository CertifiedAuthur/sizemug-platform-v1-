document.addEventListener("DOMContentLoaded", () => {
  const dashboardMainContent = document.getElementById("dashboardMainContent");

  function createElement(el, className = "", id = "") {
    const element = document.createElement(el);
    element.id = id;
    element.className = className;

    return element;
  }

  const privacyContainer = createElement("div", "privacy-container");
  const privacyHeader = createElement("header", "privacy-container-header");
  const privacyH2 = createElement("h2");
  const privacyButton = createElement("button");
  const privacyContainerContent = createElement("div", "privacy-container-content");

  const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32"><path fill="#ff3b30" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m5.4 21L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"/></svg>`;
  privacyH2.textContent = "Sizemug Privacy Policy Updated";
  privacyButton.innerHTML = closeIcon;

  privacyButton.addEventListener("click", () => {
    privacyContainer.remove();
  });

  privacyHeader.appendChild(privacyH2);
  privacyHeader.appendChild(privacyButton);

  // const privacyContent = `We collect minimal personal data, such as your name and email, solely to enhance your experience. This information is securely stored and never shared with third parties without your consent. We use cookies to improve functionality and analyze usage, in compliance with applicable laws. You may request data deletion or updates by contacting us at <a href="malto:sizemug@gmail.com">sizemug@gmail.com</a>`;
  const privacyContent = `We collect minimal personal data, such as your name and email, solely to enhance your experience. This information is securely stored and never shared with third parties without your consent. We use cookies to improve functionality and analyze usage, in compliance with applicable laws. You may request data deletion or updates by contacting us. <a href="/privacy.html">Learn more</a>`;
  privacyContainerContent.innerHTML = privacyContent;

  privacyContainer.appendChild(privacyHeader);
  privacyContainer.appendChild(privacyContainerContent);

  // Append Privacy Container
  dashboardMainContent.prepend(privacyContainer);
});
