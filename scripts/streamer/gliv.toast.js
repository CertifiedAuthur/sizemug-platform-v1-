const toastTemplates = [
  {
    type: "coins",
    icon: "./icons/sg-coin.svg",
    title: "Emmy Watson",
    description: (amount) => `Sent <span>${amount}</span> Coins to the host`,
  },
  {
    type: "rocket",
    icon: "./icons/sg-rocket.svg",
    title: "Emmy Watson",
    description: (amount) => `Boosted the LIVE <span>x${amount}</span>`,
  },
  {
    type: "fire",
    icon: "./icons/sg-fire.svg",
    title: "Emmy Watson",
    description: (amount) => `Set the chat <span>ablaze</span> x${amount}`,
  },
];

function spawnLiveStreamToast(tpl) {
  const amount = Math.ceil(Math.random() * 50) + 10;

  const markup = `
    <div class="live_stream_toast_item ${tpl.type}">
      <img src="${tpl.icon}" alt="" />
      <div class="toast_item_info">
        <h4>${tpl.title}</h4>
        <p class="toast_item_description">
          ${tpl.description(amount)}
        </p>
      </div>
    </div>
  `;

  const container = document.getElementById("liveStreamToast");
  container.insertAdjacentHTML("beforeend", markup);
  const toastEl = container.lastElementChild;

  requestAnimationFrame(() => toastEl.classList.add("show"));
  toastEl.addEventListener("animationend", () => toastEl.remove());
}

// run once immediately:
// if (location.pathname !== "/live.html") {
spawnLiveStreamToast(toastTemplates[0]);
// }

const addOnScreenBoost = document.getElementById("addOnScreenBoost");
const addOnScreenSuperBoost = document.getElementById("addOnScreenSuperBoost");

addOnScreenBoost?.addEventListener("click", () => {
  boostModalInstance?.hide();
  spawnLiveStreamToast(toastTemplates[1]);
});

addOnScreenSuperBoost?.addEventListener("click", () => {
  boostModalInstance?.hide();
  spawnLiveStreamToast(toastTemplates[2]);
});
