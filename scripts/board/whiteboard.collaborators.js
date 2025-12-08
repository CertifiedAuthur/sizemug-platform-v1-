"use strict";

const showCollaborators = document.querySelector("button.show_collaborators");
const collaboratorsContainer = document.querySelector(".sticky_collaborators");

const mobileShowCollaborators = document.querySelector("button.mobile_show_collaborators");
const mobileCollaboratorsContainer = document.querySelector(".top_sticky_collaborator--mobile .sticky_collaborators");

const boardCollaborators = collaboratorsContainer.querySelector(".sticky_collaborators>ul");

const showCollaboratorsChildren = [...showCollaborators.children];
showCollaboratorsChildren.forEach((btn) => {
  btn.style.border = `2px solid ${getRandomGeneratedColor()}`;
});

showCollaborators.addEventListener("click", () => {
  handleCollaborationContainers(collaboratorsContainer, showCollaborators);
});
mobileShowCollaborators.addEventListener("click", () => {
  handleCollaborationContainers(mobileCollaboratorsContainer, mobileShowCollaborators);
});

function handleCollaborationContainers(container, openContainerButton) {
  if (container.classList.contains(HIDDEN)) {
    // if boardContainer is opened, do not close it
    if (boardContainer.classList.contains(HIDDEN)) {
      hideAllSubContainers(); // hide all top sub container
    }

    openContainerButton.classList.add("active");
    container.classList.remove(HIDDEN);
  } else {
    // if boardContainer is opened, do not close it
    if (boardContainer.classList.contains(HIDDEN)) {
      hideAllSubContainers(); // hide all top sub container
    }

    openContainerButton.classList.remove("active");
    container.classList.add(HIDDEN);
  }
}

const users = [
  {
    name: "Victor M. Nott",
    image: "https://images.unsplash.com/photo-1440589473619-3cde28941638?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },
  {
    name: "Hester J. Salmons",
    image: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: false,
  },
  {
    name: "Tracy R. Scott",
    image: "https://plus.unsplash.com/premium_photo-1695908426422-ed52fdff2a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmluZSUyMGZlbWFsZSUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },

  {
    name: "Rosemary R. Brock",
    image: "https://images.unsplash.com/photo-1473707669572-40d832255b5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: false,
  },

  {
    name: "Tony H. Smith",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: false,
  },

  {
    name: "Lynn B. Blankenship",
    image: "https://plus.unsplash.com/premium_photo-1669704098858-8cd103f4ac2e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZpbmUlMjBmZW1hbGUlMjBwcm9maWxlfGVufDB8fDB8fHww",
    verified: true,
  },
  {
    name: "Jessica J. Spiller",
    image: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluZSUyMG1hbGUlMjBwcm9maWxlJTIwd2l0aCUyMGJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D",
    verified: false,
  },
  {
    name: "Kathleen J. Dennis",
    image: "https://images.unsplash.com/photo-1441786485319-5e0f0c092803?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmluZSUyMG1hbGUlMjBwcm9maWxlJTIwd2l0aCUyMGJyZWFzdHxlbnwwfHwwfHx8MA%3D%3D",
    verified: true,
  },
  {
    name: "Constance W. Fredette",
    image: "https://images.unsplash.com/photo-1541752171745-4176eee47556?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZpbmUlMjBtYWxlJTIwcHJvZmlsZSUyMHdpdGglMjBicmVhc3R8ZW58MHx8MHx8fDA%3D",
    verified: true,
  },
];

const displayCollaborators = function () {
  boardCollaborators.innerHTML = "";

  users.forEach((user) => {
    const markup = `
      <li>
        <a href="/profile.html">
          <img src="${user.image}" alt="${user.name}" />
          <h4>${user.name}</h4>
          ${
            user.verified
              ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="#3897F0"></path><path d="M5.52727 16L4.14545 13.5619L1.52727 12.9524L1.78182 10.1333L0 8L1.78182 5.86667L1.52727 3.04762L4.14545 2.4381L5.52727 0L8 1.10476L10.4727 0L11.8545 2.4381L14.4727 3.04762L14.2182 5.86667L16 8L14.2182 10.1333L14.4727 12.9524L11.8545 13.5619L10.4727 16L8 14.8952L5.52727 16ZM7.23636 10.7048L11.3455 6.4L10.3273 5.29524L7.23636 8.53333L5.67273 6.93333L4.65455 8L7.23636 10.7048Z" fill="url(#paint0_linear_5303_85055)"></path><defs><linearGradient id="paint0_linear_5303_85055" x1="8" y1="0" x2="8" y2="16" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"></stop><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"></stop></linearGradient></defs></svg>`
              : ""
          }
        </a>
        <button data-state="follow">Follow</button>
      </li>
    `;

    boardCollaborators.insertAdjacentHTML("afterbegin", markup);
  });
};
displayCollaborators();

boardCollaborators.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const isFollow = button.dataset.state === "follow";

    if (isFollow) {
      button.dataset.state = "unfollow";
      button.textContent = "Unfollow";
    } else {
      button.dataset.state = "follow";
      button.textContent = "Follow";
    }
  }
});
