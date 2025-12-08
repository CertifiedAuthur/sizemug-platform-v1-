/**
 * Generates an array of user suggestions with random data.
 *
 * @param {number} numSessions - The number of user suggestions to generate.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user suggestion objects.
 * @property {string} name - The full name of the user.
 * @property {string} avatar - The URL of the user's avatar image.
 * @property {string} description - A brief description of the user.
 * @property {Array<string>} interests - A list of user interests.
 */
async function generateSuggestions(numSessions = 20) {
  // Fetch random user data for name, avatar, and description
  const response = await fetch(
    `https://randomuser.me/api/?results=${numSessions}`
  );
  const data = await response.json();

  // Sample interests (you can add more interests as needed)
  const userDescriptions = [
    "A dedicated veterinarian who spends her days caring for animals.",
    "A passionate developer with a love for open-source projects.",
    "An avid gamer who streams competitive tournaments online.",
    "An artist creating beautiful digital art and sharing techniques.",
    "A music producer sharing live sessions and tutorials online.",
  ];

  // Combine fetched data into items array
  const items = Array.from({ length: numSessions }).map((_, index) => {
    const numInterests = Math.floor(Math.random() * (20 - 3 + 1)) + 3;
    const userInterests = sizemugGlobalInterests
      .sort(() => 0.5 - Math.random())
      .slice(0, numInterests);

    return {
      name: `${data.results[index].name.first} ${data.results[index].name.last}`,
      avatar: data.results[index].picture.thumbnail,
      description: userDescriptions[index % userDescriptions.length],
      interests: userInterests,
      verified: Math.floor(Math.random() * 10) > 5,
    };
  });

  return items;
}

const participantDropdown = document.getElementById("participantDropdown");

async function renderParticipant() {
  const data = await generateSuggestions(20);

  participantDropdown.innerHTML = "";

  data.forEach((d) => {
    const { name, avatar, verified } = d;

    const makup = `
                <li>
                  <a href="/profile.html">
                    <img src="${avatar}" alt="${name}" />
                    <h4>${name}</h4>
                        ${
                          !verified
                            ? ""
                            : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
                        }
                  </a>

                  <button>Follow</button>
                </li>

        `;

    participantDropdown.insertAdjacentHTML("beforeend", makup);
  });
}

renderParticipant();
