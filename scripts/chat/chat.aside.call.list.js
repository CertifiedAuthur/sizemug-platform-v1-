const names = ["Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", "Eve Adams"];
const randomName = () => names[Math.floor(Math.random() * names.length)];
const categoryTypes = ["Recent", "Yesterday", "Last Week"];
const callItemsList = document.getElementById("callItemsList");

// Call list with random names
const callList = [
  // Recent
  {
    category: "Recent",
    name: randomName(),
    type: "Outgoing",
    time: "9:20 AM",
    date: "2025-01-18",
    profileImage: "profile1.jpg",
    callType: "audio",
  },
  {
    category: "Recent",
    name: randomName(),
    type: "Incoming",
    time: "9:20 AM",
    date: "2025-01-18",
    profileImage: "profile1.jpg",
    callType: "audio",
  },
  {
    category: "Recent",
    name: randomName(),
    type: "Incoming",
    time: "9:20 AM",
    date: "2025-01-18",
    profileImage: "profile1.jpg",
    callType: "video",
  },

  {
    category: "Recent",
    name: randomName(),
    type: "Missed",
    time: "9:20 AM",
    date: "2025-01-18",
    profileImage: "profile1.jpg",
    callType: "video",
  },

  // Yesterday
  {
    category: "Yesterday",
    name: randomName(),
    type: "Outgoing",
    time: "9:20 AM",
    date: "2025-01-17",
    profileImage: "profile2.jpg",
    callType: "audio",
  },
  {
    category: "Yesterday",
    name: randomName(),
    type: "Incoming",
    time: "9:20 AM",
    date: "2025-01-17",
    profileImage: "profile3.jpg",
    callType: "audio",
  },

  {
    category: "Yesterday",
    name: randomName(),
    type: "Missed",
    time: "9:20 AM",
    date: "2025-01-17",
    profileImage: "profile3.jpg",
    callType: "audio",
  },

  // Last Week
  {
    category: "Last Week",
    name: randomName(),
    type: "Outgoing",
    time: "9:20 AM",
    date: "2025-01-12",
    profileImage: "profile4.jpg",
    callType: "audio",
  },
  {
    category: "Last Week",
    name: randomName(),
    type: "Incoming",
    time: "9:20 AM",
    date: "2025-01-11",
    profileImage: "profile5.jpg",
    callType: "audio",
  },
  {
    category: "Last Week",
    name: randomName(),
    type: "Missed",
    time: "9:20 AM",
    date: "2025-01-11",
    profileImage: "profile5.jpg",
    callType: "audio",
  },
];

function handleCompexCallRendering(callList) {
  // Group calls by category (Recent, Yesterday, Last Week)
  const groupedCalls = callList.reduce((acc, call) => {
    if (!acc[call.category]) {
      acc[call.category] = [];
    }
    acc[call.category].push(call);
    return acc;
  }, {});

  Object.keys(groupedCalls).forEach((key, i) => {
    const html = `
        <div class="call_category">
                <h2>${key}</h2>
                <ul id="call_category_00${i + 1}"></ul>
        </div>
        `;
    callItemsList.insertAdjacentHTML("beforeend", html);

    const callCategoryList = document.getElementById(`call_category_00${i + 1}`);
    callCategoryList.innerHTML = "";

    for (const category of groupedCalls[key]) {
      const { name, callType, type } = category;

      const iconsColor = type === "Incoming" ? "#12b76a" : type === "Outgoing" ? "#999999" : "#FF3B30";

      const markup = `
                <li>
                    <div class="caller_call_type">
                      <div>
                        <img src="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGltYWdlfGVufDB8fDB8fHww" alt="" />
                      </div>

                      <div>
                        ${
                          callType === "video"
                            ? `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5H15C16.1 6.5 17 7.4 17 8.5V16.5C17 17.6 16.1 18.5 15 18.5H4C2.9 18.5 2 17.6 2 16.5V8.5C2 7.4 2.9 6.5 4 6.5Z" fill="${iconsColor}"/><path d="M22 18L17 15V10L22 7V18Z" fill="${iconsColor}"/></svg>`
                            : `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.67962 2.63617L4.60868 0.707107C4.99921 0.316582 5.63237 0.316583 6.0229 0.707108L9.66131 4.34552C10.0518 4.73605 10.0518 5.36921 9.66131 5.75974L7.21113 8.20992C6.8336 8.58745 6.74 9.16422 6.97878 9.64177C8.3591 12.4024 10.5976 14.6409 13.3582 16.0212C13.8358 16.26 14.4125 16.1664 14.7901 15.7889L17.2403 13.3387C17.6308 12.9482 18.264 12.9482 18.6545 13.3387L22.2929 16.9771C22.6834 17.3676 22.6834 18.0008 22.2929 18.3913L20.3638 20.3204C18.2525 22.4317 14.9099 22.6693 12.5212 20.8777L9.20752 18.3925C7.46399 17.0848 5.91517 15.536 4.60752 13.7925L2.12226 10.4788C0.330722 8.09009 0.568272 4.74752 2.67962 2.63617Z" fill="${iconsColor}"/></svg>`
                        }
                      </div>
                    </div>

                    <div class="call_info">
                      <div>
                        <span class="name">${name}</span>
                        <span class="badge">
                          <!-- prettier-ignore -->
                          <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.52727 16.5L4.14545 14.0619L1.52727 13.4524L1.78182 10.6333L0 8.5L1.78182 6.36667L1.52727 3.54762L4.14545 2.9381L5.52727 0.5L8 1.60476L10.4727 0.5L11.8545 2.9381L14.4727 3.54762L14.2182 6.36667L16 8.5L14.2182 10.6333L14.4727 13.4524L11.8545 14.0619L10.4727 16.5L8 15.3952L5.52727 16.5ZM7.23636 11.2048L11.3455 6.9L10.3273 5.79524L7.23636 9.03333L5.67273 7.43333L4.65455 8.5L7.23636 11.2048Z" fill="#3897F0"/><path d="M5.52727 16.5L4.14545 14.0619L1.52727 13.4524L1.78182 10.6333L0 8.5L1.78182 6.36667L1.52727 3.54762L4.14545 2.9381L5.52727 0.5L8 1.60476L10.4727 0.5L11.8545 2.9381L14.4727 3.54762L14.2182 6.36667L16 8.5L14.2182 10.6333L14.4727 13.4524L11.8545 14.0619L10.4727 16.5L8 15.3952L5.52727 16.5ZM7.23636 11.2048L11.3455 6.9L10.3273 5.79524L7.23636 9.03333L5.67273 7.43333L4.65455 8.5L7.23636 11.2048Z" fill="url(#paint0_linear_5919_107630)"/><defs><linearGradient id="paint0_linear_5919_107630" x1="8" y1="0.5" x2="8" y2="16.5" gradientUnits="userSpaceOnUse"><stop offset="0.245" stop-color="#3897F0"/><stop offset="1" stop-color="#8837E9" stop-opacity="0.8"/></linearGradient></defs></svg>
                        </span>
                      </div>

                      <div>
                        <span class="status">${type}</span>
                        <span class="called_time">9:20 AM</span>
                      </div>
                    </div>

                    <div class="call_item_call_to_action">
                      <button class="start_voice_call">
                        <!-- call -->
                        <!-- prettier-ignore -->
                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.67962 2.63617L4.60868 0.707107C4.99921 0.316582 5.63237 0.316583 6.0229 0.707108L9.66131 4.34552C10.0518 4.73605 10.0518 5.36921 9.66131 5.75974L7.21113 8.20992C6.8336 8.58745 6.74 9.16422 6.97878 9.64177C8.3591 12.4024 10.5976 14.6409 13.3582 16.0212C13.8358 16.26 14.4125 16.1664 14.7901 15.7889L17.2403 13.3387C17.6308 12.9482 18.264 12.9482 18.6545 13.3387L22.2929 16.9771C22.6834 17.3676 22.6834 18.0008 22.2929 18.3913L20.3638 20.3204C18.2525 22.4317 14.9099 22.6693 12.5212 20.8777L9.20752 18.3925C7.46399 17.0848 5.91517 15.536 4.60752 13.7925L2.12226 10.4788C0.330722 8.09009 0.568272 4.74752 2.67962 2.63617Z" fill="#8837e9"/></svg>
                      </button>
                      <button class="start_video_call">
                        <!-- prettier-ignore -->
                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6.5H15C16.1 6.5 17 7.4 17 8.5V16.5C17 17.6 16.1 18.5 15 18.5H4C2.9 18.5 2 17.6 2 16.5V8.5C2 7.4 2.9 6.5 4 6.5Z" fill="#8837E9"/><path d="M22 18L17 15V10L22 7V18Z" fill="#8837E9"/></svg>
                      </button>
                    </div>
                </li>
                <hr />
        `;
      callCategoryList.insertAdjacentHTML("beforeend", markup);
    }
  });
}
handleCompexCallRendering(callList);

callItemsList.addEventListener("click", (e) => {
  // Video Call
  const startVideoCall = e.target.closest(".start_video_call");
  if (startVideoCall) {
    showVideoSingleCall();
    return;
  }

  // Voice Call
  const startVoiceCall = e.target.closest(".start_voice_call");
  if (startVoiceCall) {
    showSingleCallModal();
    return;
  }
});

/**
 *
 *
 *
 *
 *
 *
 *
 */

const filterChatCalls = document.getElementById("filterChatCalls");

filterChatCalls.addEventListener("click", (e) => {
  const button = e.target.closest("button");

  if (button) {
    const allButtons = filterChatCalls.querySelectorAll("button");

    allButtons.forEach((btn) => btn.setAttribute("aria-selected", false));
    button.setAttribute("aria-selected", true);

    const { tab } = button.dataset;

    callItemsList.innerHTML = "";

    let filteredCallLists;

    if (tab === "missed") {
      filteredCallLists = callList.filter((call) => call.type === "Missed");
    } else if (tab === "incoming") {
      filteredCallLists = callList.filter((call) => call.type === "Incoming");
    } else if (tab === "outgoing") {
      filteredCallLists = callList.filter((call) => call.type === "Outgoing");
    } else {
      filteredCallLists = callList;
    }

    handleCompexCallRendering(filteredCallLists);
  }
});
