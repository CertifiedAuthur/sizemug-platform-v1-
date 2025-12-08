function renderFakeNotification() {
  const dummyData = Array.from({ length: 20 }, (_, i) => i + 1);

  dummyData.forEach((d) => {
    const html = `
           <li>
                  <div id="profile" class="skeleton---loading"></div>

                  <div id="holder">
                    <div class="skeleton---loading"></div>
                    <div class="skeleton---loading"></div>
                  </div>
                </li>
    `;
    document.getElementById("fake_notification_lists").insertAdjacentHTML("beforeend", html);
  });
}

renderFakeNotification();
