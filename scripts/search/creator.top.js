const creatorsAndAccountCreator = document.getElementById("creatorsAndAccount--creator");
const creatorsAndAccountAccount = document.getElementById("creatorsAndAccount--account");

function renderSkeletonTop(container) {
  container.innerHTML = "";

  Array.from({ length: 4 }).forEach(() => {
    const markup = `
           <li class="skeleton_loading" style="width: 100%; height: 6rem; margin-top: 10px; margin-bottom: 10px; border-radius: 10px"></li>
        `;

    container.insertAdjacentHTML("beforeend", markup);
  });
}

function renderContentTop(container) {
  renderSkeletonTop(creatorsAndAccountCreator);
  renderSkeletonTop(creatorsAndAccountAccount);

  window.matchingModal.generateMatchingRandomUsers(4).then((data) => {
    container.innerHTML = "";

    data.forEach((d) => {
      const { name, largePhoto, online } = d;

      const markup = `
                  <li class="accounts_page-list-item">
                      <a
                        href="/profile.html"
                        class="accounts_page-list-item-content"
                        title="Creator"
                      >
                        <img src="${largePhoto}" alt="${name}" />
                        <span>${name}</span>
                        ${
                          !online
                            ? ""
                            : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
                        }
                      </a>
                      <a href="#" class="accounts_page-list-item-follow"
                        >Follow</a
                      >
                    </li>`;
      container.insertAdjacentHTML("beforeend", markup);
    });
  });
}

renderContentTop(creatorsAndAccountCreator);
renderContentTop(creatorsAndAccountAccount);
