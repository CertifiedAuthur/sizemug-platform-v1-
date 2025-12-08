const starredContainerData = [
  {
    id: 3,
    name: "Alice Johnson",
    photo: "https://randomuser.me/api/portraits/med/men/35.jpg",
    verified: true,
    starredContent: [
      {
        type: "text",
        text: "They told him he played a wrong note. That's hardly relaxing.",
      },

      {
        type: "document",
        filename: "project_notes.pdf",
        thumbnail: "/images/pdf_image--2.png",
      },
    ],
  },

  {
    id: 4,
    name: "Michael Smith",
    photo: "https://randomuser.me/api/portraits/med/men/20.jpg",
    verified: true,
    starredContent: [
      {
        type: "text",
        text: "Hello, how have you been? Sidney Bechet shot somebody because they told him he played a wrong note. That's hardly relaxing.",
      },
    ],
  },

  {
    id: 5,
    name: "Emily Davis",
    photo: "https://randomuser.me/api/portraits/med/men/5.jpg",
    verified: false,
    starredContent: [
      {
        type: "document",
        thumbnail: "/images/pdf_image--2.png",
        filename: "meeting_minutes.pdf",
      },
    ],
  },

  {
    id: 6,
    name: "David Wilson",
    photo: "https://randomuser.me/api/portraits/med/women/27.jpg",
    verified: true,
    starredContent: [
      {
        type: "video",
        filename: "team_presentation.mp4",
        thumbnail: "https://images.unsplash.com/photo-1562577308-c8b2614b9b9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRlYW18ZW58MHx8MHx8fDA%3D",
      },

      {
        type: "text",
        text: "The sun set behind the hills, painting the sky in shades of orange and pink.",
      },

      {
        type: "text",
        text: "She flipped through the pages of the old journal, uncovering secrets from decades ago.",
      },

      {
        type: "text",
        text: "Innovation thrives when curiosity meets determination.",
      },
    ],
  },

  {
    id: 7,
    name: "Sophia Martinez",
    photo: "https://randomuser.me/api/portraits/med/men/22.jpg",
    verified: false,
    starredContent: [
      {
        type: "image",
        filename: "team.png",
        thumbnail: "https://plus.unsplash.com/premium_photo-1677529496297-fd0174d65941?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D",
      },
    ],
  },
];

const showStarredInfoContainer = document.querySelectorAll(".show_starred_info_container");
showStarredInfoContainer.forEach((button) => {
  button.addEventListener("click", function () {
    const { trackerId } = button.dataset;

    if ((currentMaxOpenedChat === 3 && [2, 3].includes(+trackerId)) || (currentMaxOpenedChat === 4 && [1, 2, 3, 4].includes(+trackerId))) {
     return showStarredContainerModal();
    }

    const isExpanded = JSON.parse(this.getAttribute("aria-expanded")) === true;

    if (isExpanded) {
      this.setAttribute("aria-expanded", false);
    } else {
      this.setAttribute("aria-expanded", true);
    }
  });

  // Outside click :)
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".starred_container")) {
      button.setAttribute("aria-expanded", false);
    }
  });
});

// Outside click :)
const starredContainerModal = document.getElementById("starredContainerModal");
starredContainerModal.addEventListener("click", function (e) {
  if (e.target.id === "starredContainerModal") {
    starredContainerModal.classList.add(HIDDEN);
  }
});

function showStarredContainerModal() {
  starredContainerModal.classList.remove(HIDDEN);
}

const StarredDropdownContainers = document.querySelectorAll(".StarredDropdownContainer");

function renderStarredContent(data, StarredDropdownContainerEl) {
  StarredDropdownContainerEl.innerHTML = "";

  data.forEach((d) => {
    const { id, name, photo, verified, starredContent } = d;

    const markup = `
          <div class="starred_user_item" data-starred-user="${id}" data-current-slide="0">
            ${starredContent
              .map((content) => {
                return `
                <div class="starred_user_item_slider_1 slide_item" role="button" data-starred-id="${id}">
                  <div class="picture_status">
                    <img src="${photo}" />
                    <span></span>
                  </div>

                  <div class="content">
                    <h2>
                      <span>${name}</span>
                     ${
                       verified &&
                       `<span>
                        <svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"></path><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"></path><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>
                      </span>`
                     }
                    </h2>

                   ${
                     content.type === "text"
                       ? `<p>${content.text}</p>`
                       : `
                          <div class="starred_document_container">
                            <div class="preview">
                              <img src="${content.thumbnail}" />
                              ${
                                content.type === "video"
                                  ? `
                                    <span role="button">
                                      <!-- prettier-ignore -->
                                      <svg class="play_icon" width="1em" height="1em" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6684_117593)"><g filter="url(#filter0_dd_6684_117593)"><path d="M28.544 12.4724C29.1844 12.8129 29.7201 13.3213 30.0936 13.943C30.4672 14.5648 30.6645 15.2764 30.6645 16.0017C30.6645 16.727 30.4672 17.4387 30.0936 18.0604C29.7201 18.6821 29.1844 19.1905 28.544 19.531L11.4614 28.8204C8.7107 30.3177 5.33203 28.371 5.33203 25.2924V6.71238C5.33203 3.63238 8.7107 1.68705 11.4614 3.18171L28.544 12.4724Z" fill="white"/></g></g><defs><filter id="filter0_dd_6684_117593" x="-6.66797" y="2.66797" width="49.332" height="50.668" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="2" operator="erode" in="SourceAlpha" result="effect1_dropShadow_6684_117593"/><feOffset dy="4"/><feGaussianBlur stdDeviation="3"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.03 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_6684_117593"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect2_dropShadow_6684_117593"/><feOffset dy="12"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"/><feBlend mode="normal" in2="effect1_dropShadow_6684_117593" result="effect2_dropShadow_6684_117593"/><feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_6684_117593" result="shape"/></filter><clipPath id="clip0_6684_117593"><rect width="32" height="32" fill="white"/></clipPath></defs></svg>
                                    </span>
                              `
                                  : ""
                              }
                            </div>

                            <div class="details">
                              <h3>${content.filename}</h3>
                              <span>452KB</span>
                            </div>
                          </div>
                   `
                   }
                  </div>

                  <div class="starred_slider_item_action">
                    <button>
                      <!-- prettier-ignore -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#fda629" d="m8.85 16.825l3.15-1.9l3.15 1.925l-.825-3.6l2.775-2.4l-3.65-.325l-1.45-3.4l-1.45 3.375l-3.65.325l2.775 2.425zm3.15-.723l-3.63 2.192q-.16.079-.297.064q-.136-.016-.265-.094q-.13-.08-.196-.226t-.012-.319l.966-4.11l-3.195-2.77q-.135-.11-.178-.263t.019-.293t.165-.23q.104-.087.28-.118l4.216-.368l1.644-3.892q.068-.165.196-.238T12 5.364t.288.073t.195.238l1.644 3.892l4.215.368q.177.03.281.119q.104.088.166.229q.061.14.018.293t-.178.263l-3.195 2.77l.966 4.11q.056.171-.011.318t-.197.226q-.128.08-.265.095q-.136.015-.296-.064zm0-3.852"></path></svg>
                    </button>
                    ${
                      starredContent.length > 1
                        ? `<button class="slider_next">
                      <!-- prettier-ignore -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#222222" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/></svg>
                    </button>`
                        : ""
                    }
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
    `;

    StarredDropdownContainerEl.insertAdjacentHTML("beforeend", markup);
  });

  // Execute Rendering :)
  executeStarredContainerEvent(StarredDropdownContainerEl);
}

StarredDropdownContainers.forEach((StarredDropdownContainer, i) => {
  renderStarredContent(starredContainerData, StarredDropdownContainer);
});

StarredDropdownContainers.forEach((StarredDropdownContainer) => {
  StarredDropdownContainer.addEventListener("click", (e) => {
    const starredUserEl = e.target.closest(".starred_user_item");

    if (starredUserEl) {
      const { starredUser } = starredUserEl.dataset;
      const information = starredContainerData.find((user) => user.id === +starredUser);
      const starredDropdownContainer = starredUserEl.closest(".starred_dropdown_container");

      const starredUserImage = starredDropdownContainer.querySelector(".starred_user_image");
      const starredUserName = starredDropdownContainer.querySelector(".starred_user_name");
      const starredUserVerified = starredDropdownContainer.querySelector(".starred_user_verified");
      const starredUserCounts = starredDropdownContainer.querySelector(".starred_counts");

      starredUserImage.src = information.photo;
      starredUserName.textContent = information.name;
      starredUserCounts.textContent = information.starredContent.length;

      if (!information.verified) {
        starredUserVerified.classList.add(HIDDEN);
      } else {
        starredUserVerified.classList.remove(HIDDEN);
      }
    }
  });
});

// Change settings
const starredItemOptions = document.querySelectorAll(".starredItemOptions");

starredItemOptions.forEach((option) => {
  option.addEventListener("click", function (e) {
    const listItem = e.target.closest("li");
    const allListItem = this.querySelectorAll("li");

    if (listItem) {
      allListItem.forEach((list) => list.classList.remove("active"));
      listItem.classList.add("active");
    }
  });
});

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

function executeStarredContainerEvent(container) {
  const starredUserItems = container.querySelectorAll(".starred_user_item");

  starredUserItems.forEach((item) => {
    // Ensure the current slide is initialized.
    if (!item.dataset.currentSlide) {
      item.dataset.currentSlide = 0;
    }

    const slideItems = item.querySelectorAll(".slide_item");

    const goToSlide = function (slide) {
      slideItems.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };

    goToSlide(0);

    item.addEventListener("click", function (e) {
      // Next Slide Event :)
      const slideNext = e.target.closest(".slider_next");
      if (slideNext) {
        const { currentSlide } = item.dataset;

        const totalSlide = slideItems.length;
        const newCount = +currentSlide + 1;

        if (newCount >= totalSlide) {
          item.dataset.currentSlide = 0;
          goToSlide(0);
          return;
        }

        item.dataset.currentSlide = newCount;
        goToSlide(newCount);
        return;
      }

      // e.stopPropagation();
    });
  });
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * Expand Starred Option
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

const starredOptionButtons = document.querySelectorAll(".starred_option_button");

starredOptionButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const starredDropdownContainer = button.closest(".starred_dropdown_container ");
    const isExpanded = JSON.parse(starredDropdownContainer.getAttribute("aria-expanded")) === true;

    if (isExpanded) {
      starredDropdownContainer.setAttribute("aria-expanded", false);
    } else {
      starredDropdownContainer.setAttribute("aria-expanded", true);
    }
  });

  // Outside click :)
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".starred_dropdown_container")) {
      button.closest(".starred_dropdown_container ").setAttribute("aria-expanded", false);
    }
  });
});
