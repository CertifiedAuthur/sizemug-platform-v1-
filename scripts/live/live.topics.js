const generalEntertainmentTopics = ["Sports", "Funny", "Technology", "Music", "Food & Cooking", "Travel", "Fitness & Health", "Fashion & Beauty", "Gaming", "Movies & TV", "Books & Literature", "DIY & Crafts"];

const selectedDropdownListsUL = document.querySelector("#selectedDropdownLists>ul");

generalEntertainmentTopics.forEach((topic) => {
  const markup = `       
        <li class="user-list" data-topic="${topic}">
           <span>${topic}</span>
        </li>
   `;

  selectedDropdownListsUL.insertAdjacentHTML("beforeend", markup);
});

selectedDropdownListsUL.addEventListener("click", (e) => {
  const list = e.target.closest("li");

  if (list) {
    const { topic } = list.dataset;

    document.querySelector("#selectedUser span").textContent = topic;
    document.getElementById("selectedDropdownLists").classList.add(HIDDEN);
  }
});
