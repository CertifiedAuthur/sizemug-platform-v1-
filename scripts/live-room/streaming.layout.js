const container = document.getElementById("streamShowMediaContainer");

function updateGridAttribute() {
  const items = container.querySelectorAll(".stream__show_media_each");
  const count = items.length;

  // remove all our “layout flags”
  container.removeAttribute("data-multi");
  container.removeAttribute("data-many5");

  // 2+ items → multi-column
  if (count >= 2) {
    container.setAttribute("data-multi", "");
  }

  // 5+ items → fixed-height scrollable
  if (count >= 5) {
    container.setAttribute("data-many5", "");
  }
}

function addNewLayout(item) {
  const markup = `
    <div class="stream__show_media_each items">
      <span class="raise_hand material-symbols-outlined">back_hand</span>
      <span class="mic material-symbols-outlined" x-data="{ mute : true }"
            :data-muted="mute" x-text="mute ? 'mic' : 'mic_off'"
            x-on:click="mute = !mute">
      </span>
      <div class="name_tag">Jame</div>
      <span class="stream_menu material-symbols-outlined">more_vert</span>
      <div class="poor_conn">
        <b>Poor connection</b>
        <p>The video will resume automatically when the connection improves</p>
      </div>
      <img src="${item}" alt="stream showing" />
    </div>
  `;

  container.insertAdjacentHTML("beforeend", markup);
  updateGridAttribute();
}
// on page load
updateGridAttribute();

const popularLiveList = document.getElementById("popularLiveList");
popularLiveList.addEventListener("click", (e) => {
  const li = e.target.closest("li");

  if (li) {
    const { item } = li.dataset;
    addNewLayout(item);
  }
});

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
const liveRoomInviteModal = document.getElementById("liveRoomInviteModal");
const streamDuration = document.getElementById("streamDuration");
const rejectLiveInvite = document.getElementById("rejectLiveInvite");
const acceptLiveInvite = document.getElementById("acceptLiveInvite");

let currentCount = 10;
let inviteInterval;

function hideInviteToLiveModal() {
  currentCount = 10;
  clearInterval(inviteInterval);
  liveRoomInviteModal.classList.add(HIDDEN);
}

function showInviteToLiveModal() {
  liveRoomInviteModal.classList.remove(HIDDEN);

  inviteInterval = setInterval(() => {
    if (currentCount > 0) {
      currentCount = currentCount - 1;
      document.getElementById("inviteCount").textContent = currentCount;
      return;
    }

    hideInviteToLiveModal();
  }, 1000);
}

streamDuration.addEventListener("click", showInviteToLiveModal);
rejectLiveInvite.addEventListener("click", hideInviteToLiveModal);
acceptLiveInvite.addEventListener("click", hideInviteToLiveModal);

liveRoomInviteModal.addEventListener("click", (e) => {
  if (e.target.id === "liveRoomInviteModal") {
    hideInviteToLiveModal();
  }
});
