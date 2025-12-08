const profileVisitContainer = document.getElementById("profileVisitContainer");
const commentTagModal = document.getElementById("commentTagModal");

commentTagModal.addEventListener("click", (e) => {
  if (e.target.id === "commentTagModal") {
    commentTagModal.classList.add(HIDDEN);
  }
});

hideCommentTagModal.addEventListener("click", () => {
  commentTagModal.classList.add(HIDDEN);
});

profileVisitContainer.addEventListener("click", () => {
  commentTagModal.classList.remove(HIDDEN);
  updateCommentTagModal();
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
 *
 *
 *
 *
 *
 *
 */

async function getSuggestionTags(length) {
  const response = await fetch(`https://randomuser.me/api/?results=${length}`);
  const data = await response.json();

  return data.results.map((tag) => {
    return {
      name: `${tag.name.last} ${tag.name.first}`,
      photo: tag.picture.medium,
      verified: Math.floor(Math.random() * 10 + 1) > 4,
      hours: Math.floor(Math.random() * 10) + 1,
    };
  });
}

function updateCommentTagModal() {
  const profileVisitLists = document.getElementById("profileVisitLists");

  profileVisitLists.innerHTML = "";
  Array.from({ length: 15 }, (_, i) => i + 1).map((item) => {
    const markup = `<li class="loading skeleton_loading"></li>`;
    profileVisitLists.insertAdjacentHTML("beforeend", markup);
  });

  getSuggestionTags(14).then((comments) => {
    profileVisitLists.innerHTML = "";

    comments.forEach((comment) => {
      console.log(comment);
      const html = `
              <li>
                  <img src="${comment.photo}" alt="User Photo" />
                  <h2>${comment.name}</h2>
                   ${
                     comment.verified
                       ? `<svg width="16" height="16" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="#3897F0"></path><path d="M6.90909 20.5L5.18182 17.4524L1.90909 16.6905L2.22727 13.1667L0 10.5L2.22727 7.83333L1.90909 4.30952L5.18182 3.54762L6.90909 0.5L10 1.88095L13.0909 0.5L14.8182 3.54762L18.0909 4.30952L17.7727 7.83333L20 10.5L17.7727 13.1667L18.0909 16.6905L14.8182 17.4524L13.0909 20.5L10 19.119L6.90909 20.5ZM9.04545 13.881L14.1818 8.5L12.9091 7.11905L9.04545 11.1667L7.09091 9.16667L5.81818 10.5L9.04545 13.881Z" fill="url(#paint0_linear_6684_116275)"></path><defs><linearGradient id="paint0_linear_6684_116275" x1="10" y1="0.5" x2="10" y2="20.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
                       : ""
                   }

                   <span class="hours">${comment.hours} hrs ago</span>
              </li>
              `;

      profileVisitLists.insertAdjacentHTML("beforeend", html);
    });
  });
}
