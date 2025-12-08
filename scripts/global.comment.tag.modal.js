// Tags List
const commentTags = document.getElementById("comment_tags--list");
const commentUserModalTags = document.querySelector("#comment_user_tags #tags");

async function getSuggestionTags(length) {
  const response = await fetch(`https://randomuser.me/api/?results=${length}`);
  const data = await response.json();

  return data.results.map((tag) => {
    return {
      name: `${tag.name.last} ${tag.name.first}`,
      photo: tag.picture.medium,
    };
  });
}

function updateCommentTagModal() {
  const randomNumber = getRandomNumber(1, 15);

  getSuggestionTags(randomNumber).then((comments) => {
    const dataLength = comments.length;
    const sliced4 = comments.slice(0, 4);

    //   Update tag list
    commentUserModalTags.innerHTML = "";
    sliced4.forEach((s) => {
      const markup = `<img src="${s.photo}" alt="" class="people-tags" />`;
      commentUserModalTags.insertAdjacentHTML("beforeend", markup);
    });

    // Append the additional container
    if (dataLength >= 5) {
      commentUserModalTags.insertAdjacentHTML("beforeend", `<div class="tags--more people-tags">+${dataLength - 4}</div>`);
    }

    //  Update Comment Tag List Modal
    commentTags.innerHTML = "";
    comments.forEach((comment) => {
      const html = `
        <li>
            <img src="${comment.photo}" alt="User Photo" />
            <h2>${comment.name}</h2>
        </li>
        `;
      commentTags.insertAdjacentHTML("beforeend", html);
    });
  });
}

const commentTagModal = document.getElementById("commentTagModal");
const commentTagsBtn = document.querySelector(".comment_user_tags #tags");

commentTagsBtn.addEventListener("click", showGlobalCommentTagModal);

// Hide Modal
commentTagModal.addEventListener("click", (e) => {
  if (e.target.id === "commentTagModal") {
    hideGlobalCommentTagModal();
  }
});

const hideCommentTagModal = document.getElementById("hideCommentTagModal");
hideCommentTagModal.addEventListener("click", hideGlobalCommentTagModal);

function showGlobalCommentTagModal() {
  commentTagModal.classList.remove(HIDDEN);
}

function hideGlobalCommentTagModal() {
  commentTagModal.classList.add(HIDDEN);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// Reposted :)
const commentModalReposted = document.getElementById("commentModalReposted");

function updateRepostedTag() {
  const randomNumber = getRandomNumber(1, 10);

  getSuggestionTags(randomNumber).then((comments) => {
    const dataLength = comments.length;
    const sliced4 = comments.slice(0, 4);

    //   Update tag list
    commentModalReposted.innerHTML = "";
    sliced4.forEach((s) => {
      const markup = `<img src="${s.photo}" alt="" class="people-tags" />`;
      commentModalReposted.insertAdjacentHTML("beforeend", markup);
    });

    // Append the additional container
    if (dataLength >= 5) {
      commentModalReposted.insertAdjacentHTML("beforeend", `<div class="tags--more people-tags">+${dataLength - 4}</div>`);
    }
  });
}

commentModalReposted.addEventListener("click", showRepostedModal);
