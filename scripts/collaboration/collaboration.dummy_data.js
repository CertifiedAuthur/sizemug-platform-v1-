// Helper function to return a random subject
function getRandomSubject() {
  const subjects = ["Marketing", "Finance", "Engineering", "Design", "Sales", "HR"];

  return subjects[Math.floor(Math.random() * subjects.length)];
}

// Helper function to return a predefined array of collaborator images
function getCollaborators() {
  const collab = [
    "https://media.istockphoto.com/id/1285124274/photo/middle-age-man-portrait.webp?b=1&s=170667a&w=0&k=20&c=KhPF9mKKw1wKQvzo15nqBakjHjmcf86tGCW3Je9DOGQ=",
    "https://media.istockphoto.com/id/1316604492/photo/profile-portrait-of-middle-aged-man-over-grey-background.webp?b=1&s=170667a&w=0&k=20&c=p0AmdKNsA-5QzZ9CE8Omo0TtDNKoimr_jfZsOd5tXQo=",
    "https://media.istockphoto.com/id/1476170969/photo/portrait-of-young-man-ready-for-job-business-concept.webp?b=1&s=170667a&w=0&k=20&c=FycdXoKn5StpYCKJ7PdkyJo9G5wfNgmSLBWk3dI35Zw=",
    "https://media.istockphoto.com/id/1427004664/photo/close-up-studio-portrait-of-a-caucasian-young-man-in-a-beige-longsleeve-on-a-beige-background.webp?b=1&s=170667a&w=0&k=20&c=zkHgh8clFmwovfx8GbFD472UbvtI-g0kPJaOHp0suwY=",
  ];

  // Get a random number of collaborators between 1 and 7
  const numberOfCollaborators = Math.floor(Math.random() * 7) + 1;

  // Randomly select collaborators
  const selectedCollaborators = [];
  for (let i = 0; i < numberOfCollaborators; i++) {
    selectedCollaborators.push(collab[Math.floor(Math.random() * collab.length)]);
  }

  return selectedCollaborators;
}

async function getRandomCollaborators(count = 30) {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}`);
    const data = await response.json();

    const users = [];
    for (let user of data.results) {
      users.push({
        name: `${user.name.first} ${user.name.last}`,
        description: "Lorem ipsum dolor sit amet consectetur...",
        profile_image: user.picture.medium,
        subject: getRandomSubject(),
        location: `${user.location.city}, ${user.location.state}`,
        collaborators: getCollaborators(),
      });

      // Add a small delay to prevent UI lag
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return users;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
// Rendering the collaborators
let collaborationAllDummyData;
let collaborationRequestedDummyData;
let collaborationRecommendedDummyData;
let collaborationSharedDummyData;
let collaborationSavedDummyData;

const containerAll = document.querySelector(".tab-all");
const containerRequested = document.querySelector(".tab-requested");
const containerRecommended = document.querySelector(".tab-recommended");
const containerShared = document.querySelector(".tab-shared");
const containerSaved = document.querySelector(".tab-saved");

// Skeleton Loading
const dummyLoading = Array.from({ length: 50 }, (_, i) => i + 1);
function renderDataLoading(container) {
  const fragment = document.createDocumentFragment();
  dummyLoading.forEach(() => {
    const div = document.createElement("div");
    div.className = "container_loading";
    fragment.appendChild(div);
  });
  container.appendChild(fragment);
}

(async () => {
  renderDataLoading(containerAll);
  renderDataLoading(containerRequested);
  renderDataLoading(containerRecommended);
  renderDataLoading(containerShared);
  renderDataLoading(containerSaved);

  collaborationAllDummyData = await getRandomCollaborators(10);
  renderCollaboratorsAll(collaborationAllDummyData, containerAll);

  collaborationRequestedDummyData = await getRandomCollaborators(10);
  renderCollaboratorsRequested(collaborationRequestedDummyData, containerRequested);

  collaborationRecommendedDummyData = await getRandomCollaborators(10);
  renderCollaboratorsRecommended(collaborationRecommendedDummyData, containerRecommended);

  collaborationSharedDummyData = await getRandomCollaborators(10);
  renderCollaboratorsShared(collaborationSharedDummyData, containerShared);

  collaborationSavedDummyData = await getRandomCollaborators(10);

  renderCollaboratorsSaved(collaborationSavedDummyData, containerSaved);
})();

////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
// Events
containerAll.addEventListener("click", (e) => {
  const sharedCollabBtn = e.target.closest(".shared_collab--btn");

  // Share
  if (sharedCollabBtn) {
    return showGlobalFollowingModal();
  }

  // Bookmark
  const bookmark = e.target.closest(".bookmark");
  if (bookmark) {
    if (bookmark.classList.contains("active")) {
      bookmark.classList.remove("active");
    } else {
      bookmark.classList.add("active");
    }

    return;
  }
});
