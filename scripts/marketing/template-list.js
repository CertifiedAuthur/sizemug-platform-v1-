//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
// Main Template List
const templateItemContainer = mainTemplateLists.querySelector(".template_items");

function renderTemplatesList() {
  const userTemplates = JSON.parse(localStorage.getItem("sizemug_user_templates")) || [];
  templateItemContainer.innerHTML = ""; // clear any existing content

  if (!userTemplates.length) {
    const html = `
        <div class="" id="template_empty">
          <img src="/icons/templates_empty.svg" alt="Empty Cart" />
          <h3>No Lists Created</h3>
          <p>You haven’t created any lists yet. Organize your items, tasks, or posts by creating your first list.</p>
          <button id="create_list">Create a List <img src="/icons/start_collab.svg" alt="Start Collab" /></button>
        </div>
    `;
    templateItemContainer.insertAdjacentHTML("afterbegin", html);

    return;
  }

  userTemplates.forEach((list, index) => {
    const html = `
      <div class="template_item" data-template="${list.id}">
        <div class="top">
          <img src="${list.template}" alt="" />

          <div class="template_item--overlay">
            <button class="edit">Edit</button>
            <button class="preview">Preview</button>
          </div>
        </div>

        <div class="bottom">
          <div>
            <h2>${list.templateName}</h2>
            <span>Just now</span>
          </div>

          <div style="position: relative" class="option_wrapper">
            <button class="template_option" id="button--${index}">
              <!-- prettier-ignore -->
              <svg xmlns="http://www.w3.org/2000/svg" class="ellipsis" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#33363F" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="close marketing-hidden" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#33363F" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/></svg>
            </button>

            <ul class="template_option--list marketing-hidden" id="template_dropdown--${index}" aria-expanded="false">
              <li class="preview" role="button">
                <!-- prettier-ignore -->
                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none" stroke="#363853" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#363853"><path d="M21.544 11.045c.304.426.456.64.456.955c0 .316-.152.529-.456.955C20.178 14.871 16.689 19 12 19c-4.69 0-8.178-4.13-9.544-6.045C2.152 12.529 2 12.315 2 12c0-.316.152-.529.456-.955C3.822 9.129 7.311 5 12 5c4.69 0 8.178 4.13 9.544 6.045"/><path d="M15 12a3 3 0 1 0-6 0a3 3 0 0 0 6 0"/></g></svg>
                <span>Preview</span>
              </li>

              <li class="export_option" role="button">
                <!-- prettier-ignore -->
                <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><g fill="none"><path fill="#363853" d="m12 5l-.707-.707l.707-.707l.707.707zm1 9a1 1 0 1 1-2 0zM6.293 9.293l5-5l1.414 1.414l-5 5zm6.414-5l5 5l-1.414 1.414l-5-5zM13 5v9h-2V5z"/><path stroke="#363853" stroke-width="2" d="M5 16v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1"/></g></svg>
                <span>Export</span>
                <ul class="export_list">
                  <li role="button">
                    <a href="">Download PDF</a>
                  </li>
                  <li role="button">
                    <a href="">Get HTML & Images</a>
                  </li>
                </ul>
              </li>

              <li class="send" role="button">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" fill-opacity="1" stroke="#363853" d="m16.205 5.265l-6.49 2.164c-1.634.544-2.45.816-2.776 1.129a2 2 0 0 0 0 2.884c.325.313 1.142.585 2.775 1.13c.33.11.494.164.64.241a2 2 0 0 1 .833.833c.077.146.132.31.242.64c.544 1.633.816 2.45 1.129 2.775a2 2 0 0 0 2.884 0c.313-.325.585-1.142 1.13-2.775l2.163-6.491c.552-1.656.828-2.484.391-2.921c-.437-.437-1.265-.161-2.92.39Z" /></svg>
                <span>Send</span>
              </li>

              <li role="button" class="discard">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 24 24"><path fill="none" stroke="#363853" stroke-linecap="round" d="M9.5 14.5v-3m5 3v-3M3 6.5h18v0c-1.404 0-2.107 0-2.611.337a2 2 0 0 0-.552.552C17.5 7.893 17.5 8.596 17.5 10v5.5c0 1.886 0 2.828-.586 3.414c-.586.586-1.528.586-3.414.586h-3c-1.886 0-2.828 0-3.414-.586C6.5 18.328 6.5 17.386 6.5 15.5V10c0-1.404 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C5.107 6.5 4.404 6.5 3 6.5zm6.5-3s.5-1 2.5-1s2.5 1 2.5 1" /></svg>
                <span>Delete</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    templateItemContainer.insertAdjacentHTML("afterbegin", html);

    // Set up Popper for this dropdown
    const buttonEl = document.getElementById(`button--${index}`);
    const dropdownEl = document.getElementById(`template_dropdown--${index}`);

    const popperInstance = Popper.createPopper(buttonEl, dropdownEl, {
      placement: "bottom-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    });

    // Add click event listener to toggle dropdown
    buttonEl.addEventListener("click", () => {
      const ellipsisIcon = buttonEl.querySelector(".ellipsis");
      const closeIcon = buttonEl.querySelector(".close");
      const dropdownStatus = JSON.parse(dropdownEl.ariaExpanded);

      if (!dropdownStatus) {
        hideTemplateOption();

        dropdownEl.classList.remove(HIDDEN);
        ellipsisIcon.classList.add(HIDDEN);
        closeIcon.classList.remove(HIDDEN);

        popperInstance.update();
        dropdownEl.ariaExpanded = true;
      } else {
        hideTemplateOption();
      }
    });
  });
}
renderTemplatesList();

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// Template
// const discardModal = document.querySelector(".discard_modal_wrapper");
let templateDeleteId;

templateItemContainer.addEventListener("click", (e) => {
  const target = e.target;
  const previewParent = target.closest(".template_item");
  const currentUserTemplates = JSON.parse(localStorage.getItem("sizemug_user_templates")) || [];

  if (!previewParent) return;

  const { template: templateId } = previewParent.dataset;

  // Preview template
  if (target.closest(".preview")) {
    const presentItem = currentUserTemplates.find((t) => t.id === +templateId);

    displayTemplateOverlay(presentItem);
    hideTemplateOption();

    return;
  }

  // Show Follow Modal
  if (target.closest(".send")) {
    hideTemplateOption();
    showGlobalFollowingModal();

    return;
  }

  // Show Discard Modal
  if (target.closest(".discard")) {
    hideTemplateOption();
    showGlobalDiscardModal();
    return;
  }
});

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// const deleteAction = document.getElementById("delete_template");

// deleteAction.addEventListener("click", (e) => {
//   const { type } = discardModal.dataset;

//   if (type) {
//     // delete
//     if (type === "template") {
//       if (templateDeleteId) {
//         const lsTemplates = JSON.parse(localStorage.getItem("sizemug_user_templates")) || [];
//         const updatedTemplates = lsTemplates.filter((tem) => tem.id !== +templateDeleteId);

//         // update localstorage back
//         localStorage.setItem("sizemug_user_templates", JSON.stringify(updatedTemplates));
//         templateDeleteId = ""; // empty the id variable
//         discardModal.setAttribute("data-type", ""); // empty the modal dataset

//         renderTemplatesList(); // update DOM (template list items)
//         discardModal.classList.add(HIDDEN); // hide the modal
//       }
//     }
//   }
// });
/////////////////////////////
/////////////////////////////
/////////////////////////////
////////// Order By /////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
const buttonToSort = document.querySelector(".action_to_sort");
const selectSortContainer = document.querySelector(".sorting_options");

buttonToSort.addEventListener("click", (e) => {
  selectSortContainer.classList.toggle(HIDDEN);
});

const orderByOptions = document.querySelector(".sorting_options");
const listOptions = orderByOptions.querySelectorAll("li");
let orderOptionOpen = false;

orderByOptions.addEventListener("click", (e) => {
  const li = e.target;

  listOptions.forEach((li) => li.classList.remove("active"));
  li.classList.add("active");
  buttonToSort.textContent = li.textContent; // Update Value
  orderByOptions.classList.add(HIDDEN);
});

// Outside click
document.addEventListener("click", function (e) {
  // For dropdown options
  if (!e.target.closest(".option_wrapper")) {
    hideTemplateOption();
  }

  // For order dropdown
  if (!e.target.closest(".sorting_options--wrapper") && !orderByOptions.classList.contains(HIDDEN)) {
    orderByOptions.classList.add(HIDDEN);
  }
});

function hideTemplateOption() {
  // Hide all dropdown options
  const allOptionContainer = templateItemContainer.querySelectorAll("ul");
  allOptionContainer.forEach((option) => {
    option.classList.add(HIDDEN);
    option.ariaExpanded = false;
  });

  // All Option icons
  const allOptionEllipsis = templateItemContainer.querySelectorAll(".ellipsis");
  const allOptionClose = templateItemContainer.querySelectorAll(".close");
  allOptionEllipsis.forEach((ellipsis) => ellipsis.classList.remove(HIDDEN));
  allOptionClose.forEach((close) => close.classList.add(HIDDEN));
}
