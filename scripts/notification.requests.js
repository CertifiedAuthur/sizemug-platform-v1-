async function getUserRequests(length = 30) {
  const response = await fetch(`https://randomuser.me/api/?results=${length}`);
  const data = await response.json();
  const modes = ["new", "old"];

  return data.results.map((user) => {
    const randomIndex = Math.floor(Math.random() * 2);
    const mode = modes[randomIndex];

    const randomType = Math.floor(Math.random() * 4 + 1);
    const type = randomType <= 2 ? "follow" : "collab";

    return {
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.medium,
      mode: mode,
      type,
    };
  });
}

const notificationsRequest = document.getElementById("notifications_request");
function renderUserRequests(requests) {
  requests.forEach((req) => {
    const html = `
             <li>
                 ${req.mode === "new" ? '<div class="dot_new_notification"></div>' : ""}
                  <div class="dot_new_notification--image">
                    <img src="${req.avatar}" alt="${req.name}" />

                    <div class="dot_new_notification--position">
                    ${req.type === "collab" ? `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><path stroke="#1C64F2" stroke-width="2" d="M9 6a3 3 0 1 0 6 0a3 3 0 0 0-6 0Zm-4.562 7.902a3 3 0 1 0 3 5.195a3 3 0 0 0-3-5.196Zm15.124 0a2.999 2.999 0 1 1-2.998 5.194a2.999 2.999 0 0 1 2.998-5.194Z"/><path fill="#1C64F2" fill-rule="evenodd" d="M9.07 6.643a3 3 0 0 1 .42-2.286a9 9 0 0 0-6.23 10.79a3 3 0 0 1 1.77-1.506a7 7 0 0 1 4.04-6.998m5.86 0a7 7 0 0 1 4.04 6.998a3 3 0 0 1 1.77 1.507a9 9 0 0 0-6.23-10.79a3 3 0 0 1 .42 2.285m3.3 12.852a3 3 0 0 1-2.19-.779a7 7 0 0 1-8.08 0a3 3 0 0 1-2.19.78a9 9 0 0 0 12.46 0" clip-rule="evenodd"/></g></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none"><circle cx="10" cy="8" r="5" fill="#1C64F2"/><path stroke="#1C64F2" stroke-linecap="round" stroke-width="2" d="M19 10v6m3-3h-6"/><path fill="#1C64F2" d="M17.142 20.383c.462-.105.739-.585.534-1.012c-.552-1.15-1.459-2.162-2.634-2.924C13.595 15.509 11.823 15 10 15s-3.595.508-5.042 1.447c-1.175.762-2.082 1.773-2.634 2.924c-.205.427.072.907.534 1.012a32.333 32.333 0 0 0 14.284 0"/></g></svg>`}
                    </div>
                  </div>
                  <div class="app_notification_m_content">
                    <ul class="notification_">
                      <li class="notification_sender">
                        <span class="sender__ ellipsis">${req.name}</span>
                        <span class="dot__separator"><small class="dot__separator_sm ind-gray"></small> </span>
                        <span class="send__time">2 day ago</span>
                      </li>
                      <li class="notification_message ellipsis">${req.type === "collab" ? "tihiv requested a collaboration with you" : "tihiv just followed you"}</li>
                    </ul>
                  </div>

                  <div class="follow_btn_wrapper">
                   ${
                     req.type === "collab"
                       ? `
                        <div class="notification_req_accept_cancel"">
                          <button class="notification_req_cancel">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                              <path fill="#B42318" fill-rule="evenodd" d="M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0m-9 1.414l-3.293 3.293l-1.414-1.414L10.586 12L7.293 8.707l1.414-1.414L12 10.586l3.293-3.293l1.414 1.414L13.414 12l3.293 3.293l-1.414 1.414z" clip-rule="evenodd" />
                            </svg>
                          </button>
                          <button class="notification_req_accept">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                              <path fill="#36B37E" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd" />
                            </svg>
                          </button>
                        </div>
                        `
                       : `<button class="notification_follow_back">Follow back</button>`
                   }
                  </div>
                </li>
    `;

    notificationsRequest.insertAdjacentHTML("afterbegin", html);
  });
}

function requestSkeletonLoading(container) {
  const data = Array.from({ length: 40 }, (_, i) => i + 1);

  data.forEach((ske) => {
    const html = `
    <div style="padding:0 1rem; width: 100%" class="skeleton_container">
        <div class="aside_item skeleton_loading" style="padding: 1.6rem 0"></div>
    </div>
    `;
    container.insertAdjacentHTML("afterbegin", html);
  });
}

// Event on Request
notificationsRequest.addEventListener("click", (e) => {
  const target = e.target;

  // Follow event & Accept event
  if (target.closest(".notification_follow_back") || target.closest(".notification_req_accept_cancel")) {
    const li = target.closest("li");
    li.remove();
  }

  const emptyList = notificationsRequest.querySelectorAll("li");
  const notificationEmpty = document.querySelector(".no_request_notifications");
  if (!emptyList.length) {
    notificationEmpty.style.display = "flex";
  }
});

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
// Notifications Data Fetching
async function getNotifications() {
  const response1 = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=17");
  const response2 = await fetch(`https://randomuser.me/api/?results=17`);
  const posts = await response1.json();
  const users = await response2.json();

  const target = ["thiv", "You", "Ameer"];
  const types = ["shared", "commented", "liked", "you_coin", "coin_you", "you_gift", "gift_you", "you_note", "note_you", "live", "birthday", "completed", "overdue", "due_in", "you_assign_task", "shared_task_with_you", "you_shared_task_with"]; // prettier-ignore

  return users.results.map((d, i) => {
    return {
      username: `${d.name.last} ${d.name.first}`,
      action: posts[i].title,
      target_user: target[Math.floor(Math.random() * 2 + 1)],
      time_ago: timeAgo(d.registered.date),
      type: types[i],
      profile: d.picture.medium,
      coverImage: d.picture.large,
    };
  });
}

const notificationsList = document.getElementById("notifications_list");
async function renderNotificationLists(data) {
  if (data) {
    notificationsList.innerHTML = "";
    data.forEach((d, i) => {
      const { action, profile, coverImage, time_ago, type, username } = d;
      let baseIcon;
      let content;
      let usedCoverImage = coverImage;

      switch (type) {
        case "shared":
          baseIcon = profile;
          content = "Ameer shared a post with you";
          break;
        case "commented":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"  > <path fill="#31C6FE" fill-rule="evenodd" d="M3 10.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C6.04 4 7.16 4 9.4 4h5.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C21 7.04 21 8.16 21 10.4v1.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C17.96 18 16.84 18 14.6 18H7.414a1 1 0 0 0-.707.293l-2 2c-.63.63-1.707.184-1.707-.707V13zM9 8a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2zm0 4a1 1 0 1 0 0 2h3a1 1 0 1 0 0-2z" clip-rule="evenodd" /></svg>`;
          content = "Ameer commented on your post";
          break;
        case "liked":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 24 24" > <path fill="#F3627E" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"/> </svg>`;
          content = "tihiv liked your post";
          break;
        case "you_coin":
          baseIcon = profile;
          content = `You sent <span class="middle_coin">200</span> coins to tihiv`;
          usedCoverImage = ` <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"> <path fill="#ffff" d="M12 11q3.75 0 6.375-1.175T21 7t-2.625-2.825T12 3T5.625 4.175T3 7t2.625 2.825T12 11m0 2.5q1.025 0 2.563-.213t2.962-.687t2.45-1.237T21 9.5V12q0 1.1-1.025 1.863t-2.45 1.237t-2.962.688T12 16t-2.562-.213t-2.963-.687t-2.45-1.237T3 12V9.5q0 1.1 1.025 1.863t2.45 1.237t2.963.688T12 13.5m0 5q1.025 0 2.563-.213t2.962-.687t2.45-1.237T21 14.5V17q0 1.1-1.025 1.863t-2.45 1.237t-2.962.688T12 21t-2.562-.213t-2.963-.687t-2.45-1.237T3 17v-2.5q0 1.1 1.025 1.863t2.45 1.237t2.963.688T12 18.5" /></svg>`;
          break;
        case "coin_you":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" > <path fill="#FFA800" d="M12 11q3.75 0 6.375-1.175T21 7t-2.625-2.825T12 3T5.625 4.175T3 7t2.625 2.825T12 11m0 2.5q1.025 0 2.563-.213t2.962-.687t2.45-1.237T21 9.5V12q0 1.1-1.025 1.863t-2.45 1.237t-2.962.688T12 16t-2.562-.213t-2.963-.687t-2.45-1.237T3 12V9.5q0 1.1 1.025 1.863t2.45 1.237t2.963.688T12 13.5m0 5q1.025 0 2.563-.213t2.962-.687t2.45-1.237T21 14.5V17q0 1.1-1.025 1.863t-2.45 1.237t-2.962.688T12 21t-2.562-.213t-2.963-.687t-2.45-1.237T3 17v-2.5q0 1.1 1.025 1.863t2.45 1.237t2.963.688T12 18.5"/></svg>`;
          content = `tihiv sent you <span class="middle_coin">200</span> coins`;
          break;
        case "you_gift":
          baseIcon = profile;
          content = "You sent a gift to tihiv";
          usedCoverImage = `<svg xmlns="http://www.w3.org/2000/svg" class="sent_gift" width="1.7em" height="1.7em" viewBox="0 0 24 24"><path fill="#ffffff" fill-rule="evenodd" d="M11 8H5c-.943 0-1.414 0-1.707.293C3 8.586 3 9.057 3 10v1c0 .943 0 1.414.293 1.707C3.586 13 4.057 13 5 13h6zm-5 7v4c0 .943 0 1.414.293 1.707C6.586 21 7.057 21 8 21h3v-6zm7 6h3c.943 0 1.414 0 1.707-.293C18 20.414 18 19.943 18 19v-4h-5zm5-8h1c.943 0 1.414 0 1.707-.293C21 12.414 21 11.943 21 11v-1c0-.943 0-1.414-.293-1.707C20.414 8 19.943 8 19 8h-6v5z" clip-rule="evenodd" /><path fill="#ffffff" d="M19 4.632V4.45a1.766 1.766 0 0 0-2.325-1.675A9.714 9.714 0 0 0 12.88 5.12L12 6v1h3.675a2 2 0 0 0 .633-.103l1.395-.465A1.897 1.897 0 0 0 19 4.632m-14 0V4.45a1.766 1.766 0 0 1 2.325-1.675A9.713 9.713 0 0 1 11.12 5.12L12 6v1H8.325a2 2 0 0 1-.633-.103l-1.395-.465A1.897 1.897 0 0 1 5 4.632" /></svg>`;
          break;
        case "gift_you":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" > <path fill="#FF2D6C" fill-rule="evenodd" d="M11 8H5c-.943 0-1.414 0-1.707.293C3 8.586 3 9.057 3 10v1c0 .943 0 1.414.293 1.707C3.586 13 4.057 13 5 13h6zm-5 7v4c0 .943 0 1.414.293 1.707C6.586 21 7.057 21 8 21h3v-6zm7 6h3c.943 0 1.414 0 1.707-.293C18 20.414 18 19.943 18 19v-4h-5zm5-8h1c.943 0 1.414 0 1.707-.293C21 12.414 21 11.943 21 11v-1c0-.943 0-1.414-.293-1.707C20.414 8 19.943 8 19 8h-6v5z"                          clip-rule="evenodd" /> <path fill="#FF2D6C" d="M19 4.632V4.45a1.766 1.766 0 0 0-2.325-1.675A9.714 9.714 0 0 0 12.88 5.12L12 6v1h3.675a2 2 0 0 0 .633-.103l1.395-.465A1.897 1.897 0 0 0 19 4.632m-14 0V4.45a1.766 1.766 0 0 1 2.325-1.675A9.713 9.713 0 0 1 11.12 5.12L12 6v1H8.325a2 2 0 0 1-.633-.103l-1.395-.465A1.897 1.897 0 0 1 5 4.632" /> </svg> `;
          content = "tihiv sent you a gift";
          break;
        case "you_note":
          baseIcon = profile;
          content = "You sent a note to tihiv";
          usedCoverImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"> <path fill="#ffffff" fill-rule="evenodd" d="M7.05 6H9a2 2 0 0 1 0 4H7v1h2a2 2 0 0 1 0 4H7v1h2a2 2 0 0 1 0 4H7.292c.077.157.173.293.294.414C8.172 21 9.114 21 11 21h5c1.886 0 2.828 0 3.414-.586C20 19.828 20 18.886 20 17V8c0-1.886 0-2.828-.586-3.414C18.828 4 17.886 4 16 4h-5c-1.886 0-2.828 0-3.414.586c-.327.326-.471.764-.535 1.414M16 11a1 1 0 0 1-1-1V8a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1M5 7a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2zm0 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm0 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" clip-rule="evenodd" /></svg>`;
          break;
        case "note_you":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" > <path fill="#FDA629" fill-rule="evenodd" d="M7.05 6H9a2 2 0 0 1 0 4H7v1h2a2 2 0 0 1 0 4H7v1h2a2 2 0 0 1 0 4H7.292c.077.157.173.293.294.414C8.172 21 9.114 21 11 21h5c1.886 0 2.828 0 3.414-.586C20 19.828 20 18.886 20 17V8c0-1.886 0-2.828-.586-3.414C18.828 4 17.886 4 16 4h-5c-1.886 0-2.828 0-3.414.586c-.327.326-.471.764-.535 1.414M16 11a1 1 0 0 1-1-1V8a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1M5 7a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2zm0 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2zm0 5a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2z" clip-rule="evenodd" /> </svg>`;
          content = "tihiv sent you a note";
          break;
        case "live":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path fill="white" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>`;
          content = "tihiv started a LIVE!";
          break;
        case "birthday":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 2048 2048" > <path fill="#F43F5E" d="M1920 1920v128H0v-128h128v-576q0-66 25-124t68-101t102-69t125-26h448V672q0-9 7-15t18-10t22-5t17-2q6 0 17 1t21 5t18 10t8 16v352h448q66 0 124 25t101 69t69 102t26 124v576zM448 1152q-37 0-70 13t-58 36t-42 54t-21 68q37 41 86 63t105 22q66 0 114-26t91-76q11-12 22-19t29-7q17 0 28 7t23 19q42 49 90 75t115 27q66 0 114-26t91-76q11-12 22-19t29-7q17 0 28 7t23 19q42 49 90 75t115 27q55 0 104-22t87-63q-4-36-20-67t-42-55t-59-36t-70-13zm-192 768h1408v-435q-48 24-93 37t-99 14q-72 0-137-24t-119-73q-54 48-119 72t-137 25q-72 0-137-24t-119-73q-54 48-119 72t-137 25q-54 0-99-13t-93-38zM960 512q-26 0-45-19t-19-45q0-12 8-31t18-40t21-40t17-30q6 11 16 30t21 40t19 40t8 31q0 26-19 45t-45 19" /> </svg>`;
          content = "tihiv Birthday is Today!";
          break;
        case "completed":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"> <path fill="#25E138" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z" clip-rule="evenodd" /> </svg>`;
          content = "Your tasks is completed";
          break;
        case "overdue":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 100 100"> <path fill="#FF0000" d="M42 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3v5.295C23.364 15.785 6.5 34.209 6.5 56.5C6.5 80.483 26.017 100 50 100s43.5-19.517 43.5-43.5a43.22 43.22 0 0 0-6.72-23.182l4.238-3.431l1.888 2.332a2 2 0 0 0 2.813.297l3.11-2.518a2 2 0 0 0 .294-2.812L89.055 14.75a2 2 0 0 0-2.813-.297l-3.11 2.518a2 2 0 0 0-.294 2.812l1.889 2.332l-4.22 3.414C73.77 18.891 64.883 14.435 55 13.297V8h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm8 20c20.2 0 36.5 16.3 36.5 36.5S70.2 93 50 93S13.5 76.7 13.5 56.5S29.8 20 50 20m.002 7.443L50 56.5l23.234 17.447a29.056 29.056 0 0 0 2.758-30.433a29.056 29.056 0 0 0-25.99-16.07" color="#FF0000" /></svg>`;
          content = "Your tasks is overdue";
          break;
        case "due_in":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 100 100"> <path fill="#8837E9" d="M42 0a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3v5.295C23.364 15.785 6.5 34.209 6.5 56.5C6.5 80.483 26.017 100 50 100s43.5-19.517 43.5-43.5a43.22 43.22 0 0 0-6.72-23.182l4.238-3.431l1.888 2.332a2 2 0 0 0 2.813.297l3.11-2.518a2 2 0 0 0 .294-2.812L89.055 14.75a2 2 0 0 0-2.813-.297l-3.11 2.518a2 2 0 0 0-.294 2.812l1.889 2.332l-4.22 3.414C73.77 18.891 64.883 14.435 55 13.297V8h3a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm8 20c20.2 0 36.5 16.3 36.5 36.5S70.2 93 50 93S13.5 76.7 13.5 56.5S29.8 20 50 20m.002 7.443L50 56.5l23.234 17.447a29.056 29.056 0 0 0 2.758-30.433a29.056 29.056 0 0 0-25.99-16.07" color="#8837E9" /></svg>`;
          content = "Your tasks is due in 5 minutes";
          break;
        case "you_assign_task":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 36 36"> <path fill="#8837E9" d="M29.29 4.95h-7.2a4.31 4.31 0 0 0-8.17 0H7a1.75 1.75 0 0 0-2 1.69v25.62a1.7 1.7 0 0 0 1.71 1.69h22.58A1.7 1.7 0 0 0 31 32.26V6.64a1.7 1.7 0 0 0-1.71-1.69m-18 3a1 1 0 0 1 1-1h3.44v-.63a2.31 2.31 0 0 1 4.63 0V7h3.44a1 1 0 0 1 1 1v1.8H11.25Zm14.52 9.23l-9.12 9.12l-5.24-5.24a1.4 1.4 0 0 1 2-2l3.26 3.26l7.14-7.14a1.4 1.4 0 1 1 2 2Z" class="clr-i-solid clr-i-solid-path-1" /> <path fill="none" d="M0 0h36v36H0z" /></svg>`;
          content = "You assigned a new task";
          break;
        case "shared_task_with_you":
          baseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="0.7em" height="0.7em" viewBox="0 0 36 36"> <path fill="#8837E9" d="M29.29 4.95h-7.2a4.31 4.31 0 0 0-8.17 0H7a1.75 1.75 0 0 0-2 1.69v25.62a1.7 1.7 0 0 0 1.71 1.69h22.58A1.7 1.7 0 0 0 31 32.26V6.64a1.7 1.7 0 0 0-1.71-1.69m-18 3a1 1 0 0 1 1-1h3.44v-.63a2.31 2.31 0 0 1 4.63 0V7h3.44a1 1 0 0 1 1 1v1.8H11.25Zm14.52 9.23l-9.12 9.12l-5.24-5.24a1.4 1.4 0 0 1 2-2l3.26 3.26l7.14-7.14a1.4 1.4 0 1 1 2 2Z" class="clr-i-solid clr-i-solid-path-1" /> <path fill="none" d="M0 0h36v36H0z" /></svg>`;
          content = "tihiv shared a task with you";
          break;
        case "you_shared_task_with":
          baseIcon = profile;
          content = "You shared a task with tihiv";
          usedCoverImage = `<svg xmlns="http://www.w3.org/2000/svg" class="task--note" width="1.7em" height="1.7em" viewBox="0 0 36 36"><path fill="#ffff" d="M29.29 4.95h-7.2a4.31 4.31 0 0 0-8.17 0H7a1.75 1.75 0 0 0-2 1.69v25.62a1.7 1.7 0 0 0 1.71 1.69h22.58A1.7 1.7 0 0 0 31 32.26V6.64a1.7 1.7 0 0 0-1.71-1.69m-18 3a1 1 0 0 1 1-1h3.44v-.63a2.31 2.31 0 0 1 4.63 0V7h3.44a1 1 0 0 1 1 1v1.8H11.25Zm14.52 9.23l-9.12 9.12l-5.24-5.24a1.4 1.4 0 0 1 2-2l3.26 3.26l7.14-7.14a1.4 1.4 0 1 1 2 2Z" class="clr-i-solid clr-i-solid-path-1" /><path fill="none" d="M0 0h36v36H0z" /></svg>`;
          break;
        default:
          console.log("Can't find respective data :)");
      }

      const html = `
                <li class="${i + 1 <= 5 ? "active" : ""}">
                  <div class="dot_new_notification ${i + 1 <= 5 ? "" : HIDDEN}"></div>
                  <div class="dot_new_notification--image ${type === "live" ? "dot_new_notification--live--parent" : ""}">
                  ${
                    type === "live"
                      ? `
                      <div class="live_notification"><img src="${profile}" alt="${username}" /></div>
                    <div class="dot_new_notification--live">
                      <!-- prettier-ignore -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" viewBox="0 0 24 24"><path fill="white" d="M6.343 4.938a1 1 0 0 1 0 1.415a8.003 8.003 0 0 0 0 11.317a1 1 0 1 1-1.414 1.414c-3.907-3.906-3.907-10.24 0-14.146a1 1 0 0 1 1.414 0m12.732 0c3.906 3.907 3.906 10.24 0 14.146a1 1 0 0 1-1.415-1.414a8.003 8.003 0 0 0 0-11.317a1 1 0 0 1 1.415-1.415M9.31 7.812a1 1 0 0 1 0 1.414a3.92 3.92 0 0 0 0 5.544a1 1 0 1 1-1.415 1.414a5.92 5.92 0 0 1 0-8.372a1 1 0 0 1 1.415 0m6.958 0a5.92 5.92 0 0 1 0 8.372a1 1 0 0 1-1.414-1.414a3.92 3.92 0 0 0 0-5.544a1 1 0 0 1 1.414-1.414m-4.186 2.77a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3"/></svg>
                    </div>
                      `
                      : `<div class="image_holder">
                    ${usedCoverImage.startsWith("https://") ? `<img src="${usedCoverImage}" alt="avater" />` : usedCoverImage}
                    </div>
                    <div class="dot_new_notification--position">${baseIcon.startsWith("https://") ? `<img src="${baseIcon}" alt="" />` : `${baseIcon}`}</div>
                 `
                  } 
                 </div>
                  <div class="app_notification_m_content">
                    <ul class="notification_">
                      <li class="notification_sender">
                        <span class="sender__ ellipsis">${username}</span>
                        <span class="dot__separator"
                          ><small class="dot__separator_sm ind-gray"></small>
                        </span>
                        <span class="send__time">${time_ago}</span>
                      </li>
                      <li class="notification_message ellipsis">${content}</li>
                    </ul>
                  </div>
                </li>
    `;
      notificationsList.insertAdjacentHTML("beforeend", html);
    });

    // After you completed inserting list item, at last item
    const sizemugItem = ` <li>
                  <div class="dot_new_notification--image">
                    <img
                      src="/images/sizemug.png"
                      alt="sizemug"
                      id="you_share_task"
                    />
                  </div>
                  <div class="app_notification_m_content">
                    <ul class="notification_">
                      <li class="notification_sender">
                        <span class="sender__ ellipsis">Sizemug</span>
                        <span class="dot__separator"
                          ><small class="dot__separator_sm ind-gray"></small>
                        </span>
                        <span class="send__time">1 month ago</span>
                      </li>
                      <li class="notification_message ellipsis">
                        Welcome to Sizemug, Emmanuel
                      </li>
                    </ul>
                  </div>
                </li>`;
    notificationsList.insertAdjacentHTML("beforeend", sizemugItem);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // skeleton loading
  requestSkeletonLoading(notificationsRequest);
  requestSkeletonLoading(notificationsList);
  requestSkeletonLoading(userMessageItems);

  function handleClearContainerSkeleton(container) {
    container.querySelectorAll(".skeleton_container").forEach((skeContainer) => {
      skeContainer.remove();
    });
  }

  setTimeout(() => {
    getUserRequests(4).then((res) => {
      handleClearContainerSkeleton(notificationsRequest);

      renderUserRequests(res);
    });

    getNotifications().then((res) => {
      handleClearContainerSkeleton(notificationsList);
      renderNotificationLists(res);
    });

    getUserMessages().then((res) => {
      handleClearContainerSkeleton(userMessageItems);
      renderUserMessages(res);
    });
  }, 6000);
});
