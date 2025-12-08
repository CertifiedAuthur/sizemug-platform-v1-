const showLogoutModal = document.getElementById("logout--btn");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogoutModal");
const logoutBtn = document.getElementById("logoutAction");

// show logout modal
showLogoutModal.addEventListener("click", () => {
  $("#header_modal_list").addClass("hide-list"); // hide the profile option modal
  if (location.pathname === "/advanced-editor.html") {
    document.getElementById("header_modal_list").style.display = "none";
  }
  logoutModal.classList.remove(HIDDEN ?? getClassName()); // show logout modal
});

// proceed logout
logoutBtn.addEventListener("click", () => {
  localStorage.setItem("sizemug_status", "");
  location.href = "/"; // back to landing page
});

// cancel logout
cancelLogout.addEventListener("click", () => {
  logoutModal.classList.add(HIDDEN ?? getClassName()); // hide logout modal
});

logoutModal.addEventListener("click", (e) => {
  if (e.target.id === "logoutModal") {
    logoutModal.classList.add(HIDDEN ?? getClassName()); // hide logout modal
  }
});

function getClassName() {
  const pathname = location.pathname;

  if (pathname === "/collaboration-page.html") {
    return "hidden-page";
  } else if (pathname === "/collaborations.html") {
    return "collaboration-hidden";
  }
}

getClassName();
