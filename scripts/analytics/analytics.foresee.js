function renderForeseeSkeleton(container) {
  container.innerHTML = "";
  Array.from({ length: 15 }, (_, i) => i + 1).map(() => {
    const markup = `<li class="skeleton skeleton_loading"></li>`;
    container.insertAdjacentHTML("beforeend", markup);
  });
}

/**
 *
 *
 * Foresee Tasks
 *
 *
 */
const foreseeTasksUL = document.querySelector("#foresee--tasks>ul");
renderForeseeSkeleton(foreseeTasksUL);

function renderForeseeData(data) {
  foreseeTasksUL.innerHTML = "";

  data.forEach((d) => {
    const markup = `
        <li role="button">
                <img src="${d.photo}" alt="${d.name}" />
                <h5>${d.name}</h5>
                ${
                  d.online
                    ? `<svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"></path><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"></path><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
                    : ""
                }

                <button>Follow</button>
        </li>
    `;

    foreseeTasksUL.insertAdjacentHTML("beforeend", markup);
  });
}

window.matchingModal.generateMatchingRandomUsers(6).then((data) => {
  renderForeseeData(data);
});

/**
 *
 *
 * Foresee marketplace
 *
 *
 */
const foreseeMarketplaceUL = document.querySelector("#foresee--marketplace>ul");
renderForeseeSkeleton(foreseeMarketplaceUL);

function renderForeseeMarkplaceData(data) {
  foreseeMarketplaceUL.innerHTML = "";

  data.forEach((d) => {
    const count = Math.floor(Math.random() * 20 + 1);

    const markup = `
        <li role="button">
                <div>
                        <img src="./images/Marketing/template--11.png" alt="" />
                        <h4>Omnichart - Customizable UX Flow Chart</h4>
                </div>
                <div class="marketplace_action">
                        <button class="buy">Buy</button>
                        <button class="view">View</button>
                        <span>${count}</span>
                </div>
        </li>
    `;

    foreseeMarketplaceUL.insertAdjacentHTML("beforeend", markup);
  });
}

window.matchingModal.generateMatchingRandomUsers(6).then((data) => {
  renderForeseeMarkplaceData(data);
});

/**
 *
 *
 * Foresee marketplace
 *
 *
 */
const foreseeCollaborationUL = document.querySelector("#foresee--collaborations>ul");
renderForeseeSkeleton(foreseeCollaborationUL);

function renderForeseeCollaboData(data) {
  foreseeCollaborationUL.innerHTML = "";

  data.forEach((d) => {
    const markup = `
        <li role="button">
                <img src="${d.photo}" alt="${d.name}" />
                <h5>${d.name}</h5>
                 ${
                   d.online
                     ? `<svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"></path><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"></path><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
                     : ""
                 }
                <button>Collaborate</button>
        </li>
    `;

    foreseeCollaborationUL.insertAdjacentHTML("beforeend", markup);
  });
}

window.matchingModal.generateMatchingRandomUsers(6).then((data) => {
  renderForeseeCollaboData(data);
});
