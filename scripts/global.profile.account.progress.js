/********** This file contains logic for managing both creator-profile.html and account-profile.html **********/

const profileDetails = [
  {
    label: "Add your profile picture",
    value: "image",
  },

  {
    label: "Add your name",
    value: "fullName",
  },

  {
    label: "Add your bio",
    value: "bio",
  },

  {
    label: "Add your interests",
    value: "interests",
  },

  {
    label: "Add your occupation",
    value: "occupation",
  },

  {
    label: "Add your education",
    value: "education",
  },

  {
    label: "Add your email",
    value: "email",
  },

  {
    label: "Add your username",
    value: "username",
  },

  {
    label: "Add your website link",
    value: "website_link",
  },

  {
    label: "Add your Phone number",
    value: "phone_number",
  },

  {
    label: "Add your location",
    value: "location",
  },
];

function renderProfileDetails() {
  const progressBarItems = document.getElementById("progressBarItems");
  const progressBarModalItems = document.getElementById("progressBarModalItems");

  if (progressBarItems === null) return;

  progressBarItems.innerHTML = "";

  // There won't be progress modal on profile.html & creator-profile.html
  if (progressBarModalItems) {
    progressBarModalItems.innerHTML = "";
  }

  const user = getDummyUser();

  profileDetails.forEach((detail) => {
    if (location.pathname === "/account-profile.html" && (detail.value === "email" || detail.value === "website_link" || detail.value === "phone_number")) return;

    const markup = `
            <div role="button" class="progress-item ${detail.value === "interests" ? "progress_circular_item--interests" : "progress_circular_item"} ${user[detail.value] ? "active" : ""}">
              <span>
                <!-- add -->
                <!-- prettier-ignore -->
                <svg width="24" height="24" class="progress-add" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 6L12 18" stroke="#8837E9" stroke-width="2" stroke-linecap="round"/><path d="M18 12L6 12" stroke="#8837E9" stroke-width="2" stroke-linecap="round"/></svg>
                <svg width="16" height="16" class="progress-completed" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM8.76822 12.6402L13.7682 6.64018L12.2318 5.35982L7.9328 10.5186L5.70711 8.29289L4.29289 9.70711L7.29289 12.7071L8.0672 13.4814L8.76822 12.6402Z" fill="#4EE033" /></svg>
              </span>
      
              <span>${detail.label}</span>
            </div>
          `;

    progressBarItems.insertAdjacentHTML("beforeend", markup);
    progressBarModalItems?.insertAdjacentHTML("beforeend", markup);
  });
}

// Progress function
function updateProgressBar() {
  const user = getDummyUser();

  let percentage;

  // Calculate the completion percentage
  if (location.pathname === "/creator-account-profile.html") {
    // (-1) minus birthyear prop
    percentage = Object.keys(user).filter((prop) => prop !== "birthyear").length / profileDetails.length;
  } else {
    // (-3) minus website_link/email/phone_number prop
    percentage = Object.keys(user).filter((prop) => prop !== "birthyear" && prop !== "website_link" && prop !== "email" && prop !== "phone_number").length / (profileDetails.length - 3);
  }

  // if complete progress is 100% completed hide the container
  if (percentage === 1) {
    document.getElementById("progressContainer").classList.add(HIDDEN);
  }

  if (document.getElementById("circularProgress") === null) return;

  // Create progress bar
  const bar = new ProgressBar.Circle("#circularProgress", {
    color: "#4EE033",
    strokeWidth: 8,
    trailWidth: 8,
    trailColor: "#ffffff",
    easing: "easeInOut",
    duration: 1400,
    text: {
      autoStyleContainer: false,
    },
    svgStyle: { width: "8rem", height: "8rem" }, // Ensure SVG fits the parent container
    step: function (state, circle) {
      const value = Math.round(circle.value() * 100);
      circle.setText(`
              <div class="label">Account</div>
              <div class="percentage">${value}%</div>
          `);
    },
  });

  // Animate to a value between 0.0 and 1.0
  bar.animate(percentage); // 10%
}
updateProgressBar();
renderProfileDetails();
