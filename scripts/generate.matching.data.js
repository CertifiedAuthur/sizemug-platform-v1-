let usersData;

const getRandomInterests = () => {
  const numInterests = Math.floor(Math.random() * sizemugGlobalInterests.length) + 1;

  const shuffledInterests = sizemugGlobalInterests.sort(() => 0.5 - Math.random());
  return shuffledInterests.slice(0, numInterests);
};

class MatchingModal {
  constructor() {
    this.matchingModal = document.getElementById("matching_modal");
  }

  // Matching User Lists
  generateMatchingRandomUsers = async (numUsers = 30, saveToUser = true) => {
    const response = await fetch(`https://randomuser.me/api/?results=${numUsers}`);
    const data = await response.json();

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (response.ok) {
      const users = data.results.map((user, i) => ({
        id: i,
        name: `${user.name.first} ${user.name.last}`,
        online: Math.random() > 0.5,
        newUser: Math.random() > 0.5,
        photo: user.picture.medium,
        largePhoto: user.picture.large,
        interests: getRandomInterests(),
        followers: Math.random() > 0.5,
        range: getRandomNumber(0, 60),
      }));

      if (saveToUser) {
        usersData = users;
      }

      return users;
    }
  };

  // Render Skeleton Loading
  renderMatchingModalSkeleton(container) {
    container.innerHTML = "";

    Array.from({ length: 20 }, (_, i) => i + 1).map((item) => {
      const html = `
        <div style="max-height: 260px">
          <li class="matching_list" role="button">
            <div class="skeleton_image"></div>

            <div class="skeleton_content">
              <div>
                <h2></h2>
                &bull;
                <a href="#"></a>
              </div>

              <div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </li>
        </div>
    `;

      container.insertAdjacentHTML("afterbegin", html);
    });
  }
}

window.matchingModal = new MatchingModal();
