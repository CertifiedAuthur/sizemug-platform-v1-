function renderImageUploadMarkUp(hide = true, active = true) {
  return `
      <div class="description_image description_task_add_image ${hide ? HIDDEN : ""} ${active ? "active" : ""}" style="height: 100%" id="addNewTaskImages">
        <div class="add_task_image">
            <img src="icons/upload.svg" alt="" />
            <input type="file" style="display: none" class="new_task_image" id="new_task_image" accept="image/*" multiple />
            <p>
              <label for="new_task_image">Click to upload</label>
              or drag and drop SVG, PNG, JPG OR GIF (max. 800x400px)
            </p>
        </div>

        <div class="options">
          <button class="trash" id="taskImageItemTrash">
              <img src="icons/trash.svg" alt="" />
          </button>
          <button class="addMore ${HIDDEN}" id="taskImageItemMore">
              <img src="icons/add.svg" alt="" />
          </button>
        </div>
      </div>

`;
  // document.querySelectorAll("new_task_image").forEach((input) => {
  //   input.addEventListener("change", (e) => {
  //     const files = e.target.files;
  //     if (files.length > 0) {
  //       const file = files[0];
  //       if (file.size > 1024 * 1024 * 5) { // 5MB limit
  //         alert("File size exceeds 5MB limit.");
  //         return;
  //       }
  //       const reader = new FileReader();
  //       reader.onload = function (event) {
  //         const imgElement = document.createElement("img");
  //         imgElement.src = event.target.result;
  //         imgElement.classList.add("task_image_item");
  //         document.getElementById("addNewTaskImages").insertAdjacentElement("beforebegin", imgElement);
  //
}

function updateEventsForImage() {
  document.querySelectorAll(".new_task_image").forEach((input) => {
    input.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.size > 1024 * 1024 * 5) {
          // 5MB limit
          alert("File size exceeds 5MB limit.");
          return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
          const taskDescriptionContainer = input.closest(".task_description_container");
          if (!taskDescriptionContainer) {
            console.error("Task description container not found.");
            return;
          }
          const taskId = taskDescriptionContainer.dataset.currentTaskId;
          if (!taskId) {
            console.error("Task ID not found in the container.");
            return;
          }
          // Get the task from local storage and update the task image
          const tasksApp = taskApp.getLocalStorage();
          const task = tasksApp.find((task) => task.id === +taskId);
          if (!task) {
            console.error(`Task with ID ${taskId} not found.`);
            return;
          }
          // Update the task image in the local storage
          if (!task.taskImages) {
            task.taskImages = [];
          }
          task.taskImages.push(event.target.result);
          // Save the updated task back to local storage
          tasksApp.map((t, index) => {
            if (t.id === +taskId) {
              return (tasksApp[index] = task);
            }
            return t;
          });
          console.log("Updated task:", task);
          console.log("Updated tasksApp:", tasksApp);

          taskApp.setLocalStorage(tasksApp);
          // Call the function to update the task description on click
          // to ensure the task description is updated with the new image

          // Ensure taskId is a number
          updateTaskDescriptionOnClick(+taskId);
        };
        reader.readAsDataURL(file);
      }
    });
  });
}
function updateTaskDescriptionOnClick(taskId) {
  const existingTasks = getLocalStorage() || [];
  const currentTask = existingTasks.find((task) => task.id === taskId);
  const statuses = ["pending", "ongoing", "stuck", "completed"];

  const descTitle = currentTask.description.slice(0, 80) + "...";

  const markup = `
              <div class="task_description_status">
                ${statuses
                  .map((status) => {
                    const statusBool = currentTask.status === status;

                    return `
                         <button class="task_description_status--btn task_description_status--${status} ${statusBool ? "active" : ""}" data-status="${status}">
                                <img src="/icons/checkbox_unactive.svg" />
                                <img src="/icons/checkbox_active.svg" />
                                <span>${status[0].toUpperCase()}${status.slice(1)}</span>
                        </button>
                        `;
                  })
                  .join("")}
                </div>

                <div class="task_description_content">
                  <div class="task_description_inline">
                    <span>${currentTask.fomarttedDate ?? "Jan 19, 2023"}</span>

                    <div class="task_description_inline--left">
                      <button>
                        <div class="images overlap_images description_overlap_images" id="collaborators_list">
                          ${currentTask.collaborators
                            .map((collab, i) => {
                              if (i < 3) {
                                return `<img src="${collab.picture}" alt="${collab.username}" class="image" />`;
                              }
                            })
                            .join("")}
                            ${currentTask.collaborators.length > 3 ? `<div class="image counter">+${currentTask.collaborators.length - 3}</div>` : ""}
                        </div>
                      </button>

                      <button class="description_add_collaborators">
                        <img src="icons/task_plus.svg" alt="" />
                      </button>

                      <button class="description_task_merge">
                        <img src="icons/task_merge.svg" alt="" />
                      </button>

                      <button class="share--btn shared_from--btn">
                        <img src="icons/share.svg" alt="" />
                        <span>Shared from </span>
                        <img src="https://media.istockphoto.com/id/1355724998/photo/child-girl-cute-blonde-hair-baby-at-home-toddler-looking-at-camera-portrait-3-years-old-kid.webp?b=1&s=612x612&w=0&k=20&c=wy7oZQ9U6cVEic_ZSN24_rIY_trOIR7etrhD0Y0bLLw=" alt="" />
                      </button>

                      <button class="share--btn show_share--modal">Share</button>
                      <button class="add_calender">Add to Calender</button>
                    </div>
                  </div>

                  <div class="task_description_main_content">
                    <!-- header -->
                    <div class="header task_drag">
                      <h1 title="Task title" class="task_description_header for_unfocus">${currentTask.title}</h1>

                      <div class="form for_unfocus homepage-hidden">
                        <!-- Title Editor -->
                        <div class="description_editor description_editor--header homepage-hidden" id="description_editor--header">
                          <div class="select_size">
                            <select id="fontSizeSelect">
                              <option value="1">8pt</option>
                              <option value="2">10pt</option>
                              <option value="3">12pt</option>
                              <option value="4">14pt</option>
                              <option value="5">18pt</option>
                              <option value="6">24pt</option>
                              <option value="7">36pt</option>
                            </select>
                          </div>

                          <button class="btn" id="changeTextCase">
                            <!-- prettier-ignore -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="black"><path d="M232 164c0 15.46-14.33 28-32 28s-32-12.54-32-28s14.33-28 32-28s32 12.54 32 28M34.82 152h90.36L80 56Z" opacity="0.2"/><path d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144L80 74.79L112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68c13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25a8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36m0 88c-13.23 0-24-9-24-20s10.77-20 24-20s24 9 24 20s-10.77 20-24 20"/></g></svg>
                          </button>

                          <button class="btn bold" onclick="formatDoc('bold')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#444444" d="M8.9 1c2.4 0 4.2.3 5.4 1c1.3.7 1.9 1.9 1.9 3.6c0 1-.3 1.9-.7 2.6a3 3 0 0 1-2 1.3a4.8 4.8 0 0 1 1.6.7c.4.3.8.8 1.1 1.3a5 5 0 0 1 .4 2.3a4.6 4.6 0 0 1-1.7 3.8A7.6 7.6 0 0 1 10 19H3.3V1zm.4 7.1c1.1 0 1.9-.1 2.3-.5c.5-.3.7-.9.7-1.5c0-.7-.3-1.2-.8-1.5s-1.3-.5-2.4-.5h-2v4zm-2.2 3V16h2.5c1.1 0 2-.3 2.4-.7c.5-.5.7-1 .7-1.8a2 2 0 0 0-.7-1.6c-.5-.4-1.3-.6-2.5-.6H7z"/></svg>
                          </button>

                          <button class="btn italic" onclick="formatDoc('italic')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/></svg>
                          </button>

                          <button class="btn link" id="description-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"/></svg>
                          </button>

                          <button class="btn ul-list" onclick="formatDoc('insertUnorderedList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8 4h13v2H8zM4.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 6.9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3M8 11h13v2H8zm0 7h13v2H8z"/></svg>
                          </button>

                          <button class="btn ol-list" onclick="formatDoc('insertOrderedList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#444444" d="M8 4h13v2H8zM5 3v3h1v1H3V6h1V4H3V3zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2zM8 11h13v2H8zm0 7h13v2H8z"/></svg>
                          </button>
                        </div>

                        <!-- Title Input -->
                        <div class="task_description_header_editor editableHeaderDiv" contenteditable="true" id="editableDiv"></div>

                        <!-- Title Options -->
                        <div class="options">
                          <button class="move_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="m12 3l.625-.78l-.625-.5l-.625.5zm-1 6a1 1 0 1 0 2 0zm5.625-3.58l-4-3.2l-1.25 1.56l4 3.2zm-5.25-3.2l-4 3.2l1.25 1.56l4-3.2zM11 3v6h2V3zm10 9l.78.625l.5-.625l-.5-.625zm-6-1a1 1 0 1 0 0 2zm3.58 5.625l3.2-4l-1.56-1.25l-3.2 4zm3.2-5.25l-3.2-4l-1.56 1.25l3.2 4zM21 11h-6v2h6zm-9 10l.625.78l-.625.5l-.625-.5zm-1-6a1 1 0 1 1 2 0zm5.625 3.58l-4 3.2l-1.25-1.56l4-3.2zm-5.25 3.2l-4-3.2l1.25-1.56l4 3.2zM11 21v-6h2v6zm-8-9l-.78.625l-.5-.625l.5-.625zm6-1a1 1 0 1 1 0 2zm-3.58 5.625l-3.2-4l1.56-1.25l3.2 4zm-3.2-5.25l3.2-4l1.56 1.25l-3.2 4zM3 11h6v2H3z"/></svg>
                          </button>
                          <button class="btn_edit_title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Mobile Header Content -->
                    <div class="mobile_decribe">
                      <button class="add_calender">Add to Calender</button>
                      <button class="share--btn show_share--modal">Share</button>
                      <div class="overlap_images">
                        <img src="https://media.istockphoto.com/id/1355724998/photo/child-girl-cute-blonde-hair-baby-at-home-toddler-looking-at-camera-portrait-3-years-old-kid.webp?b=1&s=612x612&w=0&k=20&c=wy7oZQ9U6cVEic_ZSN24_rIY_trOIR7etrhD0Y0bLLw=" alt="" class="image" />
                        <img src="https://cdn.pixabay.com/photo/2015/08/23/20/48/girl-903401_640.jpg" alt="" class="image" />
                        <img src="https://cdn.pixabay.com/photo/2018/03/06/22/57/portrait-3204843_640.jpg" alt="" class="image" />
                        <img src="https://cdn.pixabay.com/photo/2021/03/14/10/13/girl-6093779_640.jpg" alt="" class="image" />
                      </div>

                      <button class="share--btn shared_from--btn">
                        <img src="icons/share.svg" alt="" />
                        <span>Shared from </span>
                        <img src="https://media.istockphoto.com/id/1355724998/photo/child-girl-cute-blonde-hair-baby-at-home-toddler-looking-at-camera-portrait-3-years-old-kid.webp?b=1&s=612x612&w=0&k=20&c=wy7oZQ9U6cVEic_ZSN24_rIY_trOIR7etrhD0Y0bLLw=" alt="" />
                      </button>
                    </div>

                    <!-- description -->
                    <div class="description task_drag">
                      <p title="${descTitle}" class="task_description_describing for_unfocus">${currentTask.description}</p>

                      <div class="form for_unfocus homepage-hidden">
                        <!-- Description Editor -->
                        <div class="description_editor description_editor--description homepage-hidden" id="description_editor--description">
                          <div class="select_size">
                            <select id="fontSizeSelect">
                              <option value="1">8pt</option>
                              <option value="2">10pt</option>
                              <option value="3">12pt</option>
                              <option value="4">14pt</option>
                              <option value="5">18pt</option>
                              <option value="6">24pt</option>
                              <option value="7">36pt</option>
                            </select>
                          </div>

                          <button class="btn" id="changeTextCase">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><g fill="black"><path d="M232 164c0 15.46-14.33 28-32 28s-32-12.54-32-28s14.33-28 32-28s32 12.54 32 28M34.82 152h90.36L80 56Z" opacity="0.2"/><path d="M87.24 52.59a8 8 0 0 0-14.48 0l-64 136a8 8 0 1 0 14.48 6.81L39.9 160h80.2l16.66 35.4a8 8 0 1 0 14.48-6.81ZM47.43 144L80 74.79L112.57 144ZM200 96c-12.76 0-22.73 3.47-29.63 10.32a8 8 0 0 0 11.26 11.36c3.8-3.77 10-5.68 18.37-5.68c13.23 0 24 9 24 20v3.22a42.76 42.76 0 0 0-24-7.22c-22.06 0-40 16.15-40 36s17.94 36 40 36a42.73 42.73 0 0 0 24-7.25a8 8 0 0 0 16-.75v-60c0-19.85-17.94-36-40-36m0 88c-13.23 0-24-9-24-20s10.77-20 24-20s24 9 24 20s-10.77 20-24 20"/></g></svg>
                          </button>

                          <button class="btn bold" onclick="formatDoc('bold')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20"><path fill="#444444" d="M8.9 1c2.4 0 4.2.3 5.4 1c1.3.7 1.9 1.9 1.9 3.6c0 1-.3 1.9-.7 2.6a3 3 0 0 1-2 1.3a4.8 4.8 0 0 1 1.6.7c.4.3.8.8 1.1 1.3a5 5 0 0 1 .4 2.3a4.6 4.6 0 0 1-1.7 3.8A7.6 7.6 0 0 1 10 19H3.3V1zm.4 7.1c1.1 0 1.9-.1 2.3-.5c.5-.3.7-.9.7-1.5c0-.7-.3-1.2-.8-1.5s-1.3-.5-2.4-.5h-2v4zm-2.2 3V16h2.5c1.1 0 2-.3 2.4-.7c.5-.5.7-1 .7-1.8a2 2 0 0 0-.7-1.6c-.5-.4-1.3-.6-2.5-.6H7z"/></svg>
                          </button>

                          <button class="btn italic" onclick="formatDoc('italic')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#444444" d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/></svg>
                          </button>

                          <button class="btn link" id="description-content-link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#444444" d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"/></svg>
                          </button>

                          <button class="btn ul-list" onclick="formatDoc('insertUnorderedList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#444444" d="M8 4h13v2H8zM4.5 6.5a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 7a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3m0 6.9a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3M8 11h13v2H8zm0 7h13v2H8z"/></svg>
                          </button>

                          <button class="btn ol-list" onclick="formatDoc('insertOrderedList')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#444444" d="M8 4h13v2H8zM5 3v3h1v1H3V6h1V4H3V3zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2zM8 11h13v2H8zm0 7h13v2H8z"/></svg>
                          </button>
                        </div>

                        <!-- Description -->
                        <div class="task_description_editor editableDescriptionDiv" id="editableDiv" contenteditable="true"></div>

                        <div class="options">
                          <button class="move_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="m12 3l.625-.78l-.625-.5l-.625.5zm-1 6a1 1 0 1 0 2 0zm5.625-3.58l-4-3.2l-1.25 1.56l4 3.2zm-5.25-3.2l-4 3.2l1.25 1.56l4-3.2zM11 3v6h2V3zm10 9l.78.625l.5-.625l-.5-.625zm-6-1a1 1 0 1 0 0 2zm3.58 5.625l3.2-4l-1.56-1.25l-3.2 4zm3.2-5.25l-3.2-4l-1.56 1.25l3.2 4zM21 11h-6v2h6zm-9 10l.625.78l-.625.5l-.625-.5zm-1-6a1 1 0 1 1 2 0zm5.625 3.58l-4 3.2l-1.25-1.56l4-3.2zm-5.25 3.2l-4-3.2l1.25-1.56l4 3.2zM11 21v-6h2v6zm-8-9l-.78.625l-.5-.625l.5-.625zm6-1a1 1 0 1 1 0 2zm-3.58 5.625l-3.2-4l1.56-1.25l3.2 4zm-3.2-5.25l3.2-4l1.56 1.25l-3.2 4zM3 11h6v2H3z"/></svg>
                          </button>
                          <button class="btn_edit_description">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"/></svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Hash Tags -->
                    <div class="task_hashtags task_drag">
                      <ul class="hashTags for_unfocus">
                      ${currentTask.hashtags
                        .map((tag, i) => {
                          return `
                              <li title="Hash Tag" class="hashtag_item hashtag_item--${i + 1}">
                                <div class="hashtag_content">#${tag.value}</div>

                                <div class="form homepage-hidden">
                                  <div class="task_description_hashtag_editable" contenteditable="true"></div>

                                  <div class="options">
                                    <button class="move_btn">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="#000000" d="m12 3l.625-.78l-.625-.5l-.625.5zm-1 6a1 1 0 1 0 2 0zm5.625-3.58l-4-3.2l-1.25 1.56l4 3.2zm-5.25-3.2l-4 3.2l1.25 1.56l4-3.2zM11 3v6h2V3zm10 9l.78.625l.5-.625l-.5-.625zm-6-1a1 1 0 1 0 0 2zm3.58 5.625l3.2-4l-1.56-1.25l-3.2 4zm3.2-5.25l-3.2-4l-1.56 1.25l3.2 4zM21 11h-6v2h6zm-9 10l.625.78l-.625.5l-.625-.5zm-1-6a1 1 0 1 1 2 0zm5.625 3.58l-4 3.2l-1.25-1.56l4-3.2zm-5.25 3.2l-4-3.2l1.25-1.56l4 3.2zM11 21v-6h2v6zm-8-9l-.78.625l-.5-.625l.5-.625zm6-1a1 1 0 1 1 0 2zm-3.58 5.625l-3.2-4l1.56-1.25l3.2 4zm-3.2-5.25l3.2-4l1.56 1.25l-3.2 4zM3 11h6v2H3z"/></svg>
                                    </button>
                                    <button class="trash">
                                      <img src="icons/trash.svg" alt="" />
                                    </button>
                                    <button class="add_hashtag add_hashtag_item">
                                      <img src="icons/add.svg" alt="" />
                                    </button>
                                  </div>
                                </div>
                              </li>
                        `;
                        })
                        .join("")}
                        <!-- Hash Tag Items -->
                      </ul>

                      <div class="new_hashtag for_unfocus homepage-hidden" id="new_hashtag">
                        <div class="hashtag_new_editable" contenteditable="true"></div>

                        <div class="options">
                          <button class="move_btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000000" d="m12 3l.625-.78l-.625-.5l-.625.5zm-1 6a1 1 0 1 0 2 0zm5.625-3.58l-4-3.2l-1.25 1.56l4 3.2zm-5.25-3.2l-4 3.2l1.25 1.56l4-3.2zM11 3v6h2V3zm10 9l.78.625l.5-.625l-.5-.625zm-6-1a1 1 0 1 0 0 2zm3.58 5.625l3.2-4l-1.56-1.25l-3.2 4zm3.2-5.25l-3.2-4l-1.56 1.25l3.2 4zM21 11h-6v2h6zm-9 10l.625.78l-.625.5l-.625-.5zm-1-6a1 1 0 1 1 2 0zm5.625 3.58l-4 3.2l-1.25-1.56l4-3.2zm-5.25 3.2l-4-3.2l1.25-1.56l4 3.2zM11 21v-6h2v6zm-8-9l-.78.625l-.5-.625l.5-.625zm6-1a1 1 0 1 1 0 2zm-3.58 5.625l-3.2-4l1.56-1.25l3.2 4zm-3.2-5.25l3.2-4l1.56 1.25l-3.2 4zM3 11h6v2H3z"/></svg>
                          </button>
                          <button class="trash">
                            <img src="icons/trash.svg" alt="" />
                          </button>
                          <button class="add_hashtag add_hashtag_new">
                            <img src="icons/add.svg" alt="" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Images -->
                    <div class="task_description_images_wrapper task_drag" id="taskDescriptionImagesWrapper">
                      <div class="task_description_images" id="taskDescriptionImages">
                        ${currentTask.taskImages
                          .map((image, i) => {
                            return `
                              <div class="description_image description_drag_image" id="description_image" data-dropimage="${i + 1}">
                                <img src="${image}" alt="" id="description_image--item"/>

                                <div class="options">
                                  <button class="trash" id="taskImageItemTrash">
                                    <img src="icons/trash.svg" alt="" />
                                  </button>
                                  <button class="addMore" id="taskImageItemMore">
                                    <img src="icons/add.svg" alt="" />
                                  </button>
                                </div>
                              </div>
                          `;
                          })
                          .join("")}

                        ${
                          currentTask.taskImages.length < 4
                            ? Array.from({
                                length: 4 - currentTask.taskImages.length,
                              })
                                .map(() => renderImageUploadMarkUp(false, false))
                                .join("")
                            : ""
                        }
                      </div>
                    </div>

                    <!-- Bottom Container -->
                    <div class="task_description_bottom_container task_drag"></div>
                  </div>
                </div>
  `;

  taskDescriptionContainer.innerHTML = "";
  taskDescriptionContainer.innerHTML = markup;
  taskDescriptionContainer.setAttribute("data-current-task-id", taskId); // update the task id of currently opened task
  taskDescriptionImages.insertAdjacentHTML("beforeend", renderImageUploadMarkUp());
  updateEventsForImage();
  // Attaching events
  const newHashtag = document.getElementById("new_hashtag");
  const newTagAddBtn = newHashtag.querySelector(".add_hashtag_new");
  const editable = newHashtag.querySelector(".hashtag_new_editable");
  const hashTagParent = editable.closest(".task_hashtags");

  newTagAddBtn.addEventListener("click", () => {
    const plainTextContent = editable.textContent.replace(/\s+/g, " ").trim();

    if (!plainTextContent) return;

    addTag(editable, hashTagParent);
    editable.focus();
  });

  /**
   *
   *
   *
   *
   * Image Drag and Drop Element
   *
   *
   *
   *
   */

  (() => {
    const parentContainer = document.getElementById("taskDescriptionImages"); // The parent element wrapping all drag image containers

    // Ensure the parentContainer exists
    if (!parentContainer) return;
    const dragImageContainers = parentContainer.querySelectorAll(".description_drag_image");

    dragImageContainers.forEach((container) => {
      // Drag Start
      container.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", null);
        event.currentTarget.classList.add("image_drag--active");
      });

      // Drag Over
      container.addEventListener("dragover", (event) => {
        event.preventDefault();
      });

      // Drop Event
      container.addEventListener("drop", (event) => {
        event.preventDefault();
        const dropTarget = event.target.closest(".description_drag_image");
        const draggedElement = document.querySelector(".image_drag--active");

        if (dropTarget && draggedElement !== null) {
          const dropIndex = Array.from(dropTarget.parentNode.children).indexOf(dropTarget);
          const draggedIndex = Array.from(draggedElement.parentNode.children).indexOf(draggedElement);
          if (draggedIndex < dropIndex) {
            dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextSibling);
          } else {
            dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
          }
        }

        const dragOverElements = document.querySelectorAll(".task_drag--over-top, .task_drag--over-bottom"); // prettier-ignore

        dragOverElements.forEach((elem) => {
          elem.classList.remove("task_drag--over-top", "task_drag--over-bottom");
        });

        draggedElement?.classList.remove("image_drag--active");
      });
    });
  })();

  /**
   *
   *
   *
   * Re-order Header ///// Description ///// Hashtag item
   *
   *
   *
   */

  (() => {
    const dragElements = document.querySelectorAll(".task_drag");

    // Variables to track dragging state
    let isDragging = false;
    let offsetX, offsetY;
    let moveBtn;
    let dragContainer;

    // Add event listeners to each drag element
    dragElements.forEach((dragElement) => {
      // Event listener for mousedown
      dragElement.addEventListener("mousedown", (event) => {
        moveBtn = event.target.closest(".move_btn");
        if (!moveBtn) return;

        dragContainer = moveBtn.closest(".task_drag");

        dragContainer.setAttribute("draggable", "true");
        isDragging = true;

        offsetX = event.clientX - dragElement.offsetLeft;
        offsetY = event.clientY - dragElement.offsetTop;

        dragElement.classList.add("task_drag--active"); // opacity 0.5
        moveBtn.classList.add("btn_edit_active"); // add active style to move button
      });

      // Event listener for drag over
      dragElement.addEventListener("dragover", (event) => {
        event.preventDefault();

        if (moveBtn) {
          event.target.closest(".task_drag").classList.add("task_drag--over");
        }
      });

      // Event listener for drag leave
      dragElement.addEventListener("dragleave", function (event) {
        event.target?.closest(".task_drag").classList.remove("task_drag--over");
      });

      // Event listener for drop
      dragElement.addEventListener("drop", (event) => {
        const dropTarget = event.target.closest(".task_drag");

        dragElement.classList.remove("task_drag--active");

        if (dropTarget && moveBtn) {
          dropTarget.parentNode.insertBefore(dragContainer, dropTarget);
          dragContainer.classList.remove("task_drag--active");
          dropTarget.classList.remove("task_drag--over");
          dragContainer.setAttribute("draggable", "false");
          moveBtn.classList.remove("btn_edit_active");
        } else {
          event.preventDefault();
          moveBtn?.classList.remove("btn_edit_active");
          dragContainer?.classList.remove("task_drag--active");
        }

        dragElements.forEach((drag) => {
          drag.classList.remove("task_drag--active");
        });
      });
    });

    // This allows drop event on document
    document.addEventListener("dragover", (event) => {
      event.preventDefault(); // Necessary to allow a drop
    });

    // for removing active styling on dragged element when drop at the wrong place
    document.addEventListener("drop", (event) => {
      event.preventDefault(); // Necessary to allow a drop

      dragElements.forEach((drag) => {
        drag.classList.remove("task_drag--active");
        moveBtn?.classList.remove("btn_edit_active");
      });
    });

    // Event listener for mousemove
    document.addEventListener("mousemove", (event) => {
      if (isDragging) {
        dragContainer.style.left = event.clientX - offsetX + "px";
        dragContainer.style.top = event.clientY - offsetY + "px";
      }
    });

    // Event listener for mouseup
    document.addEventListener("mouseup", () => {
      isDragging = false;
      const draggedElement = document.querySelector(".task_drag--active");
      if (draggedElement) {
        draggedElement.classList.remove("task_drag--active");
        moveBtn?.classList.remove("btn_edit_active");
      }

      dragElements.forEach((drag) => {
        drag.classList.remove("task_drag--active");
      });
    });
  })();

  // // DESCRIPTION SCROLLABLE CONTAINER
  (() => {
    const container = document.querySelector(".task_description_container");
    const threshold = 40; // Distance from the top or bottom edge to start scrolling
    const scrollSpeed = 2; // Adjust the scroll speed
    let isDragging = false;
    let scrollDirection = 0;

    container.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("task_drag")) {
        isDragging = true;
      }
    });

    container.addEventListener("dragend", () => {
      isDragging = false;
      scrollDirection = 0;
    });

    container.addEventListener("dragover", (e) => {
      if (!isDragging) return;
      const { clientY } = e;
      const { top, bottom, height } = container.getBoundingClientRect();
      const distanceFromTop = clientY - top;
      const distanceFromBottom = bottom - clientY;
      if (distanceFromTop < threshold) {
        scrollDirection = -scrollSpeed; // Scroll up
      } else if (distanceFromBottom < threshold || isOverlappingItem(e)) {
        scrollDirection = scrollSpeed; // Scroll down
      } else {
        scrollDirection = 0;
      }
    });

    function isOverlappingItem(event) {
      const draggedItem = event.target;
      const dragItems = Array.from(container.querySelectorAll(".task_drag"));
      const mouseY = event.clientY;
      return dragItems.some((item) => {
        if (item === draggedItem) return false; // Skip self
        const { top, bottom } = item.getBoundingClientRect();
        return mouseY > top && mouseY < bottom;
      });
    }

    function smoothScroll() {
      if (scrollDirection !== 0) {
        container.scrollTop += scrollDirection;
        requestAnimationFrame(smoothScroll);
      } else {
        requestAnimationFrame(smoothScroll); // Continue checking even when not scrolling
      }
    }

    requestAnimationFrame(smoothScroll);
  })();
}

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
// Back to Task Lists
const backToTaskDescriptionBtn = document.getElementById("backToTaskDescriptionBtn");

backToTaskDescriptionBtn.addEventListener("click", () => {
  //  Show Task Descriptions
  taskCloseDescription();
  document.querySelector(".main_tasks").classList.remove(HIDDEN);

  // Update Landing mansory layout again (to avoid distortion)
  if (dashboardMainMasonryInstance) {
    dashboardMainMasonryInstance.layout();
  }
});
