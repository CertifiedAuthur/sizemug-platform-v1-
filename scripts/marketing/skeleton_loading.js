const skeletonData = Array.from({ length: 30 }, (_, i) => i + 1);

function renderSkeleton() {
  const container = document.querySelector(".marketing_loading--lists");
  container.innerHTML = "";

  skeletonData.forEach((data) => {
    const html = `
            <div class="marketing_loading--list">
                <div class="spacer skeleton---loading"></div>

                <div class="bottom">
                  <div class="skeleton---loading"></div>
                  <div class="skeleton---loading"></div>
                  <div class="skeleton---loading"></div>
                </div>
              </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  });

  const marketingLoading = document.querySelector(".marketing_loading");
  setTimeout(() => {
    marketingLoading.remove(); // remove from DOM
    document.querySelector(".landing_content").classList.remove(HIDDEN);
  }, 3000);
}

renderSkeleton();

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
