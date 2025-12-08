const recommendedCollaboration = document.getElementById(
  "recommended_collaboration"
);

async function getRecommedCollab() {
  const response = await fetch(`https://randomuser.me/api/?results=15`);
  const data = await response.json();

  const recommend = data.results.map((user) => {
    return {
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.medium,
    };
  });

  return renderRecommendReq(recommend);
}
renderRecommendAndPopularSkeletion();
getRecommedCollab();

function renderRecommendReq(recommends) {
  // Before inserting remove the skeletons
  recommendedCollaboration
    .querySelectorAll(".activity_row--skeleton")
    .forEach((el) => el.remove());

  recommends.forEach((recommend) => {
    const html = `
        <div class="activity_row--item active">
                <img src="${recommend.avatar}" alt="${recommend.name}" />
                <h4>${recommend.name}</h4>
        </div>
    `;

    recommendedCollaboration.insertAdjacentHTML("afterbegin", html);
  });
}

function renderRecommendAndPopularSkeletion() {
  const skeleton = Array.from({ length: 16 }, (_, i) => i + 1);
  const popularLiveLists = document.getElementById("popular_live--lists");

  skeleton.forEach((skel) => {
    const html = `
        <div class="activity_row--skeleton skeleton_loading"></div>
    `;

    recommendedCollaboration.insertAdjacentHTML("afterbegin", html);
    popularLiveLists.insertAdjacentHTML("afterbegin", html);
  });
}
