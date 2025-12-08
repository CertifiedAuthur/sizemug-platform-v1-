// const creatorPostItems = document.getElementById("creatorPostItems");

// function renderStatisticPostSkeleton() {
//   Array.from({ length: 20 }, (_, i) => i + 1).forEach(() => {
//     const markup = `<div class="creator_post_item"></div>`;

//     creatorPostItems.insertAdjacentHTML("beforeend", markup);
//   });
// }

// async function renderStatisticPost() {
//   renderStatisticPostSkeleton();

//   const creatorPosts = await generateUsersWithTasks(20);

//   creatorPostItems.innerHTML = "";
//   creatorPosts.forEach((item) => {
//     const { taskVideoThumbnail, username } = item;

//     const markup = `
//         <div class="creator_post_item skeleton_loading">
//           <div class="image">
//             <img src="${taskVideoThumbnail}" alt="${username}" />
//           </div>

//           <!-- Overlay -->
//           <div class="creator_post_item--overlay">
//             <div>
//               <button class="info">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12ZM13 11V12V18V19H11V18V12V11H13ZM11 7V8H13V7V6V5H11V6V7Z" fill="white" /></svg>
//               </button>
//             </div>

//             <div>
//               <a href="/post.html" class="edit-post">Edit Post</a>
//             </div>

//             <div>
//               <!-- Eye -->
//               <button>
//                 <span>
//                   <!-- prettier-ignore -->
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="white" stroke-width="2"/><path d="M20.188 10.9343C20.5762 11.4056 20.7703 11.6412 20.7703 12C20.7703 12.3588 20.5762 12.5944 20.188 13.0657C18.7679 14.7899 15.6357 18 12 18C8.36427 18 5.23206 14.7899 3.81197 13.0657C3.42381 12.5944 3.22973 12.3588 3.22973 12C3.22973 11.6412 3.42381 11.4056 3.81197 10.9343C5.23206 9.21014 8.36427 6 12 6C15.6357 6 18.7679 9.21014 20.188 10.9343Z" stroke="white" stroke-width="2"/></svg>
//                 </span>
//                 <span>289K</span>
//               </button>

//               <!-- Heart -->
//               <button>
//                 <span>
//                   <!-- prettier-ignore -->
//                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.45067 13.9082L11.4033 20.4395C11.6428 20.6644 11.7625 20.7769 11.9037 20.8046C11.9673 20.8171 12.0327 20.8171 12.0963 20.8046C12.2375 20.7769 12.3572 20.6644 12.5967 20.4395L19.5493 13.9082C21.5055 12.0706 21.743 9.0466 20.0978 6.92607L19.7885 6.52734C17.8203 3.99058 13.8696 4.41601 12.4867 7.31365C12.2913 7.72296 11.7087 7.72296 11.5133 7.31365C10.1304 4.41601 6.17972 3.99058 4.21154 6.52735L3.90219 6.92607C2.25695 9.0466 2.4945 12.0706 4.45067 13.9082Z" stroke="white" stroke-width="2"/></svg>
//                 </span>
//                 <span>100K</span>
//               </button>
//             </div>
//           </div>
//         </div>
//     `;

//     creatorPostItems.insertAdjacentHTML("beforeend", markup);
//   });
// }

// renderStatisticPost();

/**
 *
 *
 *
 *
 *
 *
 *
 * HANDLE CREATOR POST DROPDOWN :)
 *
 *
 *
 *
 *
 *
 */
const creatorStatDropdowns = document.querySelectorAll(".creator_stat_dropdowns");
const statULs = document.querySelectorAll(".creator_stat_dropdown>ul");

creatorStatDropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (button) {
      const statButtons = document.querySelectorAll(".creator_stat_dropdown button");

      statButtons.forEach((btn) => btn.setAttribute("aria-expanded", false));
      button.setAttribute("aria-expanded", true);
    }
  });
});

statULs.forEach((ul) => {
  ul.addEventListener("click", (e) => {
    const listItem = e.target.closest("li");

    if (listItem) {
      const { category } = listItem.dataset;
      const domContent = listItem.closest(".creator_stat_dropdown")?.querySelector(".dom-content");
      const button = listItem.closest(".creator_stat_dropdown")?.querySelector("button");

      domContent.textContent = category.split("-").join(" ");
      button.setAttribute("aria-expanded", false);
    }
  });
});
