document.addEventListener("DOMContentLoaded", () => {
  const copyInviteCode = document.getElementById("copyInviteCode");
  const desktopHideCopyCode = document.getElementById("HIIUGSJ");
  const inviteCodeModal = document.getElementById("inviteCodeModal");
  const showInviteCopyBtn = document.getElementById("showInviteCopyBtn");
  const inviteUserWithCode = document.getElementById("invite_User_With_Code");
  const inviteFriendModal = document.getElementById("inviteFriend");
  const closeInviteModal = document.getElementById("closeInviteModal");
  const inviteCode = document.getElementById("inviteCode");
  const invitedUsersList = document.getElementById("invitedUsersList");
  const InvitePositionedContainer = document.getElementById("InvitePositionedContainer");
  const toolMessageBtn = document.getElementById("toolMessageBtn");
  const getSizemugPro = document.getElementById("getSizemugPro");
  const tooltipMessage = document.getElementById("tooltipMessage");

  const spinnerEl = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#8837e9" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity="0.5" /><path fill="#8837e9" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate" /></path></svg>`;

  function fadeOutAndHide(el, duration = 500) {
    el.style.transition = `opacity ${duration}ms ease`;
    el.style.opacity = 0;
    setTimeout(() => {
      el.style.display = "none";
      el.style.transition = "";
      el.style.opacity = 1;
    }, duration);
  }

  getSizemugPro.addEventListener("click", () => {
    tooltipMessage.classList.remove(HIDDEN);

    const canvas = document.getElementById("inviteModalConfettiCanvas");
    canvas.style.display = "block";

    const party = new Confetti(canvas, { count: 40, emojis: ["🎉"] });
    party.start();

    // No need for setTimeout to stop now, as it will stop automatically
    // when all particles have fallen
    const checkDone = setInterval(() => {
      if (!party._running) {
        clearInterval(checkDone);
        fadeOutAndHide(canvas, 600);
      }
    }, 9000);
  });

  //
  copyInviteCode.addEventListener("click", function () {
    navigator.clipboard.writeText(inviteCode.textContent.trim()).then(() => {
      this.textContent = "Copied";
      this.setAttribute("disabled", "true");

      setTimeout(() => {
        this.textContent = "Copy Code";
        this.removeAttribute("disabled");
      }, 1000);
    });
  });

  inviteUserWithCode.addEventListener("click", showInviteFriendModal);
  closeInviteModal.addEventListener("click", hideInviteFriendModal);

  showInviteCopyBtn.addEventListener("click", showCopyInviteCodeModal);
  desktopHideCopyCode.addEventListener("click", hideCopyInviteCodeModal);

  // Self click close :)
  inviteFriendModal.addEventListener("click", (e) => {
    if (e.target.id === "inviteFriend") return inviteFriendModal.classList.add(HIDDEN);
  });
  inviteFriend.addEventListener("click", (e) => {
    if (e.target.id === "inviteFriend") return hideInviteFriendModal();
  });

  toolMessageBtn.addEventListener("click", () => {
    InvitePositionedContainer.classList.add(HIDDEN);
  });

  async function showInviteFriendModal() {
    inviteFriendModal.classList.remove(HIDDEN);
    $("#header_modal_list").addClass("hide-list"); // hide the profile option modal

    const data = await getCurrentUser();

    if (data.user) {
      const { referralLists } = data.user;
      if (referralLists.length) {
        updateRefferalsData(referralLists);

        if (referralLists.length < 4) {
          updateRefferalDummy(referralLists);
        }
      }

      if (referralLists && referralLists.length === 4) {
        showFlashMessage("Congratulations 🎉");
        InvitePositionedContainer.classList.remove(HIDDEN);
      }
    } else {
      updateRefferalDummy([]);
    }
  }

  function updateRefferalsData(refferals) {
    invitedUsersList.innerHTML = ""; // clear container

    refferals.forEach((refferal) => {
      const { fullName, image } = refferal;

      const markup = `
          <div class="user_item">
            <img src="${image}" alt="${fullName}" />
            <span>${fullName}</span>
          </div> 
      `;

      invitedUsersList.insertAdjacentHTML("beforeend", markup);
    });
  }

  function updateRefferalDummy(refferals) {
    const count = 4 - refferals.length;
    const position = Math.sign(count);

    if (position) {
      const placeHolderInvitedFriends = generateInvite(count);

      placeHolderInvitedFriends.forEach(() => {
        const markup = `
              <div class="static_placeholder">
                <div class="AYUDNMXS">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.875 6L12.875 18" stroke="#8837E9" stroke-width="2" stroke-linecap="round"/><path d="M18.875 12L6.875 12" stroke="#8837E9" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <span>Invite Two</span>
              </div>
          `;

        invitedUsersList.insertAdjacentHTML("beforeend", markup);
      });
    }
  }

  function hideInviteFriendModal() {
    inviteFriendModal.classList.add(HIDDEN);
  }

  function hideCopyInviteCodeModal() {
    inviteCodeModal.classList.add(HIDDEN);
  }

  async function showCopyInviteCodeModal() {
    // Hide invite friends modal on mobile
    if (window.innerWidth < 667) {
      inviteFriendModal.classList.add(HIDDEN);
    }

    inviteCodeModal.classList.remove(HIDDEN); // show modal
    inviteCode.innerHTML = spinnerEl;

    const userData = await getCurrentUser();

    const { referralCode } = userData.user;
    inviteCode.innerHTML = referralCode;
  }
});

function generateInvite(l) {
  return Array.from({ length: l }, (_, i) => i + 1);
}

async function getCurrentUser() {
  const userToken = JSON.parse(localStorage.getItem("sizemugUserToken")) ?? "";

  // if there is token found
  if (userToken) {
    //http://localhost:9393 - local
    const response = await fetch("https://sizemug-backend-server.vercel.app/api/getUser", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      showFlashMessage("Do log in first", "", "error", 2000);

      setTimeout(() => {
        location.href = "/";
      }, 2000);
      return;
    }

    return data;
  } else {
    showFlashMessage("You are not logged in", "", "error", 2000);

    setTimeout(() => {
      location.href = "/";
    }, 2000);
  }
}
