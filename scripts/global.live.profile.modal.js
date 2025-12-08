const viewLiveUserProfile = document.querySelectorAll(".view_live_user_profile");
const liveRoomProfileModal = document.getElementById("liveRoomProfileModal");

viewLiveUserProfile.forEach((profile) => {
  profile.addEventListener("click", () => {
    liveRoomProfileModal.classList.remove(HIDDEN);
  });
});

liveRoomProfileModal.addEventListener("click", (e) => {
  if (e.target.id === "liveRoomProfileModal") {
    liveRoomProfileModal.classList.add(HIDDEN);
  }
});
