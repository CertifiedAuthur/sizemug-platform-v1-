const coverEditingToolsContainer = document.querySelector(".cover_editing_tools--wrapper > div");
const coverEditingContainer = document.querySelector(".cover_editing");
let coverImages = [];
let id = 1;
let activeIndex;
// Tracking editing small image
let smallImageEditing = false;
let activeSmallImageEl = null;

// Upload for cover
const coverImage = document.getElementById("upload_cover_image");
const uploadMoreBtn = document.querySelector(".upload_more_cover");

coverImage.addEventListener("change", (e) => {
  const file = e.target.files[0];

  handleCoverSelectAndDrop(file);
});

//////////////////////////////////////////////////
////////// Drag & Drop Cover Listener  ///////////
//////////////////////////////////////////////////
const coverDropArea = document.querySelector(".cover_editing--handle");
const coverImageItems = document.querySelector(".cover_image--items");

// Prevent default behavior to allow dropping files
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  coverDropArea.addEventListener(eventName, preventDefaults);
  coverImageItems.addEventListener(eventName, preventDefaults);
});
// Prevent default behavior for drag events
function preventDefaults(e) {
  // e.preventDefault();
  e.stopPropagation();
}

// dragover listener
coverDropArea.addEventListener("dragover", () => {
  // background color showing drop area will be added
  coverDropArea.classList.add("cover_drop--active");
});

// dragleave listener
coverDropArea.addEventListener("dragleave", () => {
  // background color showing drop area will be added
  coverDropArea.classList.remove("cover_drop--active");
});

// drop events
coverDropArea.addEventListener("drop", dropHandler);
function dropHandler(e) {
  e.preventDefault();

  const dt = e.dataTransfer; // dataTransfer is the image that was dragged and dropped
  const files = dt.files;

  // background color showing drop area will be added
  coverDropArea.classList.add("cover_drop--active");
  handleCoverSelectAndDrop(files[0]);
}

function handleCoverSelectAndDrop(file) {
  // upload more remove disabled attribute
  uploadMoreBtn.disabled = false;

  // background color showing drop area will be removed
  coverDropArea.classList.remove("cover_drop--active");

  if (!file?.type?.startsWith("image/")) return;

  const coverURL = URL.createObjectURL(file);
  coverImages.push({
    img: coverURL,
    id,
  });

  // remove the intial cover plaveholder
  const uploadCover = document.querySelector(".upload-cover");
  uploadCover.classList.add(HIDDEN);

  // update Cover List too
  renderCoverImages(coverImages);

  // Update the amrkup
  handleCoverMarkOnly(coverURL);

  // Increment id for next image
  id = id + 1;
}

// Only bob image path can only be passed to generate the right image
function handleCoverMarkOnly(fileBob, containerID = id) {
  activeIndex = containerID;

  const markup = `
          <div class="main_cover--image" data-itemCover="${activeIndex}">
            <img src="${fileBob}" alt="Main Cover" />

            <!-- Top editing tools -->
            <div class="editing_tools editing_top_overlay post-hidden">
              <div class="editing_tools--left">
                <div class="progress-container">
                  <div class="progress-bar"></div>
                  <div class="progress_circle"></div>
                </div>
              </div>

              <div class="editing_tools--right">
                <button class="alignment">
                  <svg xmlns="http://www.w3.org/2000/svg" class="align_icon center" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-width="2" d="M3 6h18M6 12h12m-9 6h6"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="align_icon left post-hidden" width="1em" height="1em" viewBox="0 0 48 48"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M6 14h36M6 24h24M6 34h8"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" class="align_icon right post-hidden" width="1em" height="1em" viewBox="0 0 16 16"><path fill="white" fill-rule="evenodd" d="M15 3.25a.75.75 0 0 0-.75-.75H1.75a.75.75 0 0 0 0 1.5h12.5a.75.75 0 0 0 .75-.75M15 8a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0 0 1.5h8.5A.75.75 0 0 0 15 8m-.75 4a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5z" clip-rule="evenodd"/></svg>
                </button>

                <button id="text_format--color-picker" title="text color" style="position: relative" > 
                  <input type="color" style=" position: absolute; left: 100%; top: 0; opacity: 0; width: 0; height: 0;" />
                  <img src="/images/postImages/color-wheel.png" alt="Color Wheel">
                </button>

                <button class="text" data-mode="none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 256"><path fill="#ffff" d="M208 56v32a8 8 0 0 1-16 0V64h-56v128h24a8 8 0 0 1 0 16H96a8 8 0 0 1 0-16h24V64H64v24a8 8 0 0 1-16 0V56a8 8 0 0 1 8-8h144a8 8 0 0 1 8 8"/></svg>
                </button>
              </div>
            </div>

            <!-- Bottom editing tools -->
            <div class="editing_tools editing_bottom_overlay post-hidden">
              <button class="active" data-fType="Inter">Tx</button>
              <button data-fType="Roboto">Tx</button>
              <button data-fType="Baskervville SC">Tx</button>
              <button data-fType="Ga Maamli">Tx</button>
              <button data-fType="Open Sans">Tx</button>
              <button data-fType="Montserrat">Tx</button>
              <button data-fType="Anton SC">Tx</button>
              <button data-fType="Poppins">Tx</button>
              <button data-fType="Bodoni Moda SC">Tx</button>
              <button data-fType="Roboto Mono">Tx</button>
              <button data-fType="Bona Nova SC">Tx</button>
              <button data-fType="Playwrite GB S">Tx</button>
            </div>

            <div class="added_text post-hidden">
            </div>

            <div class="tag_selected--overflow post-hidden">
              <div class="tag_selected--items">
                <!-- Lists of Users -->
              </div>
            </div>

            <div class="editable_container--wrapper post-hidden">
                <div data-postText="${containerID}" id="post_text" contenteditable="true"></div>
            </div>

            <div class="tag_editable_container--wrapper post-hidden">
                <div id="post_tag" contenteditable="true">@</div>
            </div>

            <div class="tag_container--overflow post-hidden">
              <div class="tag_container--items">
                <!----- User Tag List ------>
              </div>
            </div>

            <div class="done_tag post-hidden"></div>
          </div>
      `;

  // insert the markup into your document
  coverEditingContainer.insertAdjacentHTML("afterbegin", markup);

  // Redo and Undo
  // Initialize history and undo stack for this new element
  historyMap[containerID] = [];
  undoStackMap[containerID] = [];

  const editable = coverEditingContainer.querySelector(`[data-postText="${containerID}"]`);

  // Save input history on input event
  editable.addEventListener("input", function () {
    historyMap[containerID].push(editable.innerHTML);
    undoStackMap[containerID] = []; // Clear the redo stack when new input happens
  });

  // Track which contenteditable div is focused
  editable.addEventListener("focus", function () {
    focusedInput = containerID;
  });
}

// User Tag List
let tags = [
  {
    id: 1,
    name: "Bako Musa",
    image: "/user--1.avif",
  },

  {
    id: 2,
    name: "Sizemug",
    image: "/user--2.avif",
  },

  {
    id: 3,
    name: "Musa Baaqi",
    image: "/user--3.avif",
  },

  {
    id: 4,
    name: "Musa Abdullah",
    image: "/user--4.avif",
  },

  {
    id: 5,
    name: "Adro Kishi",
    image: "/user--5.avif",
  },

  {
    id: 6,
    name: "Kishi Bello",
    image: "/user--6.avif",
  },

  {
    id: 7,
    name: "Musa Abdullah",
    image: "/user--7.avif",
  },
];
function renderTagUserList(data) {
  const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
  const taggedContainer = activeImageContainer.querySelector(".tag_container--items");

  // Empty the container
  taggedContainer.innerHTML = "";

  data.map((tag) => {
    const markup = `
        <button class="tag_container--item" data-tag="${tag.id}">
          <img src="/images/postImages${tag.image}" alt="Profile" />
          <h3>${tag.name}</h3>
        </button>
    `;

    taggedContainer.insertAdjacentHTML("afterbegin", markup);
  });
}

// Tagged Selected
function renderTagSelected(data) {
  const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
  const tagContainer = activeImageContainer.querySelector(".tag_selected--items");

  // Empty the container
  tagContainer.innerHTML = "";

  data.map((select) => {
    const markup = `
          <div class="tag_selected--item" data-tag="${select.id}">
            <img src="/images/postImages${select.image}" alt="Profile" />
            <h3>${select.name}</h3>

            <button class="select--remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#BABABB" fill-rule="evenodd" d="M17.707 7.707a1 1 0 0 0-1.414-1.414L12 10.586L7.707 6.293a1 1 0 0 0-1.414 1.414L10.586 12l-4.293 4.293a1 1 0 1 0 1.414 1.414L12 13.414l4.293 4.293a1 1 0 1 0 1.414-1.414L13.414 12z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        `;

    tagContainer.insertAdjacentHTML("afterbegin", markup);
  });
}

/*
 * ------------------------------------
 * Upload more images
 * ------------------------------------
 */
const historyMap = {};
const undoStackMap = {};
let focusedInput = null; // Keep track of the currently focused input

// Images list
function renderCoverImages(images, imageId) {
  // empty the container first
  coverImageItems.innerHTML = "";

  images.forEach((img) => {
    const markup = `
          <div class="cover_image--item" data-item="${img.id}">
              <img src="${img.img}" alt="Cover Images" />

              <button class="remove_cover">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#222222" d="m13.06 12l4.42-4.42a.75.75 0 1 0-1.06-1.06L12 10.94L7.58 6.52a.75.75 0 0 0-1.06 1.06L10.94 12l-4.42 4.42a.75.75 0 0 0 0 1.06a.75.75 0 0 0 1.06 0L12 13.06l4.42 4.42a.75.75 0 0 0 1.06 0a.75.75 0 0 0 0-1.06Z"/></svg>
              </button>
          </div>
      `;

    // insert each image into the container
    coverImageItems.insertAdjacentHTML("afterbegin", markup);
  });

  // insert the upload more container
  coverImageItems.insertAdjacentHTML("beforeend", uploadMarkup);

  // set the upload more disabled attribute button to false, for next cover selection
  const uploadMoreBtn = coverImageItems.querySelector(".upload_more_cover");
  uploadMoreBtn.disabled = false;
}

// upload more markup
const uploadMarkup = `
        <div class="upload_new_cover">
            <h3>Add new Cover</h3>

            <button class="upload_more_cover" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="#222222" fill-rule="evenodd" d="M8 1.75a.75.75 0 0 1 .75.75v4.75h4.75a.75.75 0 0 1 0 1.5H8.75v4.75a.75.75 0 0 1-1.5 0V8.75H2.5a.75.75 0 0 1 0-1.5h4.75V2.5A.75.75 0 0 1 8 1.75" clip-rule="evenodd"/></svg>
            </button>

            <input type="file" id="cover-upload" accept="image/*" multiple style="display: none" />
        </div>
`;

coverImageItems.addEventListener("click", (e) => {
  const target = e.target;

  // Set smallImageEditing to false
  smallImageEditing = false;

  // Trigger more image cover dialog
  if (target.closest(".upload_more_cover")) {
    const coverUploadMoreInput = coverImageItems.querySelector("#cover-upload");
    coverUploadMoreInput.click();

    // Upload More change
    const moreCoverUpload = coverImageItems.querySelector("#cover-upload");

    moreCoverUpload.addEventListener("change", (e) => {
      const files = [...e.target.files];

      handleImageListSelectAndDrop(files);
    });

    return;
  }

  // Remove a image
  if (target.closest(".remove_cover")) {
    const removeCoverBtn = target.closest(".remove_cover");
    const coverItem = removeCoverBtn.closest(".cover_image--item");
    const { item } = coverItem.dataset;

    coverImages = coverImages.filter((img) => img.id !== +item);

    renderCoverImages(coverImages, img.id);

    return;
  }

  // Target the image list item itself
  if (target.closest(".cover_image--item")) {
    const { item } = target.closest(".cover_image--item").dataset;
    const coverUpdate = coverEditingContainer.querySelector(`[data-itemcover="${item}"]`);
    const allCoverImages = coverEditingContainer.querySelectorAll(".main_cover--image");

    // hidden all the images first
    allCoverImages.forEach((img) => img.classList.add(HIDDEN));

    // update activeIndex
    activeIndex = Number(item);

    if (!coverUpdate) {
      const addText = coverUpdate?.querySelector(".added_text");
      const tagContainer = coverUpdate?.querySelector(".done_tag");
      const obj = coverImages.find((obj) => obj.id === Number(item));

      // Pass in the bob url and the corresponding id
      handleCoverMarkOnly(obj.img, obj.id);

      // Show
      addText?.classList.remove(HIDDEN);
      tagContainer?.classList.remove(HIDDEN);

      return;
    }

    coverUpdate.classList.remove(HIDDEN);
  }
});

//////////////////////////////////////////////////
////////// Drag & Drop Image List Listener  ///////////
//////////////////////////////////////////////////
// dragover
coverImageItems.addEventListener("dragover", () => {
  // background color showing drop area will be added
  document.querySelector(".upload_new_cover").classList.add("cover_drop--active");
});

// dragleave
coverImageItems.addEventListener("dragleave", () => {
  // background color showing drop area will be removed
  document.querySelector(".upload_new_cover").classList.remove("cover_drop--active");
});

// drop
coverImageItems.addEventListener("drop", (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;

  // background color showing drop area will be removed
  document.querySelector(".upload_new_cover").classList.remove("cover_drop--active");

  handleImageListSelectAndDrop(files);
});
function handleImageListSelectAndDrop(files) {
  // show editing tools
  // coverEditingToolsContainer.style.display = "block";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith("image/")) continue;

    const fileURL = URL.createObjectURL(file);

    coverImages.push({
      img: fileURL,
      id,
    });

    // Increment id for next image
    id = id + 1;
  }

  renderCoverImages(coverImages);
}

/////////////////////////////////////////////
////// Progress Bar Increase Font Size //////
/////////////////////////////////////////////
let isDragging = false;
let dragText = null;

coverEditingContainer.addEventListener("mousedown", function (e) {
  if (e.target.classList.contains("progress_circle")) {
    isDragging = true;
  }

  if (e.target.closest(".added_text")) {
    dragText = e.target.closest(".added_text");
  }
});

coverEditingContainer.addEventListener("mouseup", function (e) {
  if (e.target.classList.contains("progress_circle")) {
    isDragging = false;
  }

  if (dragText) {
    dragText = null;
  }
});

coverEditingContainer.addEventListener("mousemove", (e) => {
  const target = e.target;

  // Progress bar
  if (target.classList.contains("progress_circle")) {
    const progressBar = target.closest(".progress-container").querySelector(".progress-bar");

    if (isDragging) {
      const rect = progressBar.getBoundingClientRect();
      let offsetX = e.clientX - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      const progressPercent = (offsetX / rect.width) * 100;
      target.style.left = `${progressPercent}%`;

      // manipulating the font-size
      const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);

      if (!smallImageEditing) {
        activeImageContainer.querySelector("#post_text").style.fontSize = `${progressPercent}px`;
        activeImageContainer.querySelector(".added_text").style.fontSize = `${progressPercent}px`;
      } else {
        activeImageContainer.querySelector(".small_image--editable").style.fontSize = `${progressPercent}px`;
      }
    }
  }
});

function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  target.style.transform = "translate(" + x + "px, " + y + "px)";
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// Initialize Interact.js for .added_text elements
interact(".added_text").draggable({
  inertia: true,
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true,
    }),
  ],
  listeners: {
    move(event) {
      const target = event.target;
      const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
      const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

      // Translate the element
      target.style.transform = `translate(${x}px, ${y}px)`;

      // Update the position attributes
      target.setAttribute("data-x", x);
      target.setAttribute("data-y", y);
    },
  },
});

/////////////////////////
/////////////////////////
// Listening for single click events
let alignment = "center";
let tagged = [];
let audioVoiceUrl;
let overlayAudio;
let overlayAudioPlaying = false;
let textColor = "#ffffff";

coverEditingContainer.addEventListener("click", (e) => {
  const target = e.target;

  // If there is active image container proceed then :)
  if (activeIndex) {
    const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
    const textEditing = activeImageContainer.querySelector("#post_text");
    const movableTextContainer = activeImageContainer.querySelector(".added_text");
    const editableContainer = activeImageContainer.querySelector(".editable_container--wrapper");
    const topEditingToolsContainer = activeImageContainer.querySelector(".editing_top_overlay");
    const bottomEditingToolsContainer = activeImageContainer.querySelector(".editing_bottom_overlay");
    const addTextBtn = document.querySelector(".list button.text");
    const tagOverflowBottomContainer = activeImageContainer.querySelector(".tag_container--overflow");
    const tagSelectContainer = activeImageContainer.querySelector(".tag_selected--overflow");
    const editableTagWrapper = activeImageContainer.querySelector(".tag_editable_container--wrapper");
    const bottomOverlay = activeImageContainer.querySelector(".editing_bottom_overlay");
    const topOverlay = activeImageContainer.querySelector(".editing_top_overlay");

    /////////////////////////
    // Alignment
    if (target.closest(".alignment")) {
      const alignBtns = target.closest(".alignment").querySelectorAll(".align_icon");
      alignBtns.forEach((btn) => btn.classList.add(HIDDEN));

      if (alignment === "center") {
        if (!smallImageEditing) {
          textEditing.style.alignSelf = "flex-end";
          movableTextContainer.style.right = "0%";
          movableTextContainer.style.transform = "translate(0%, -50%)";
        } else {
          activeImageContainer.querySelector(".small_image--editable").style.textAlign = "right";
        }

        alignment = "right";
      } else if (alignment === "right") {
        if (!smallImageEditing) {
          textEditing.style.alignSelf = "flex-start";
          movableTextContainer.style.left = "0%";
          movableTextContainer.style.right = "50%";
          movableTextContainer.style.transform = "translate(0%, -50%)";
        } else {
          activeImageContainer.querySelector(".small_image--editable").style.textAlign = "left";
        }
        alignment = "left";
      } else {
        if (!smallImageEditing) {
          textEditing.style.alignSelf = "center";
          movableTextContainer.style.left = "50%";
          movableTextContainer.style.right = "0%";
          movableTextContainer.style.transform = "translate(-50%, -50%)";
        } else {
          activeImageContainer.querySelector(".small_image--editable").style.textAlign = "center";
        }
        alignment = "center";
      }

      // Update alignment icon
      target.closest(".alignment").querySelector(`.${alignment}`).classList.remove(HIDDEN);
    }

    /////////////////////////
    // Text Color
    const textColorBtn = target.closest("#text_format--color-picker");
    if (textColorBtn) {
      const colorPicker = textColorBtn.querySelector("input");
      // Show the color picker container
      colorPicker.click();

      // Attach a change event on the color picker to change editing text color
      colorPicker.addEventListener("input", function () {
        if (!smallImageEditing) {
          textColor = this.value;
        } else {
          activeImageContainer.querySelector(".small_image--editable").style.color = this.value;
        }
      });
    }

    /////////////////////////
    // Font styling
    const fontStyle = target.closest(".text");
    if (fontStyle) {
      const { mode } = fontStyle.dataset;

      /**
       * There is 3 mode (deep | opacity | none)
       * DEEP -> text with background color
       * OPACITY -> text with background color but has opcity of 50%
       * NONE -> text without background (default)
       **/

      if (mode === "none") {
        fontStyle.setAttribute("data-mode", "deep");
        movableTextContainer.style.background = textColor;
        textEditing.style.background = textColor;
        movableTextContainer.style.color = "#000000";
        textEditing.style.color = "#000000";
      }

      if (mode === "deep") {
        fontStyle.setAttribute("data-mode", "opacity");

        const opacityColor = generateHexColorOpacity(textColor, 0.5);
        const contrastColor = generateTextColor(opacityColor);

        movableTextContainer.style.background = opacityColor;
        textEditing.style.background = opacityColor;
        movableTextContainer.style.color = contrastColor;
        textEditing.style.color = contrastColor;
      }

      if (mode === "opacity") {
        fontStyle.setAttribute("data-mode", "none");
        movableTextContainer.style.background = "none";
        textEditing.style.background = "none";
      }
    }

    /////////////////////////
    // Font Family
    const bottomEditing = target.closest(".editing_bottom_overlay") ?? "";
    if (bottomEditing) {
      const allButtons = bottomEditing.querySelectorAll("button");

      if (target.tagName.toLowerCase() === "button") {
        const { ftype: fontFamily } = target.dataset;

        if (!smallImageEditing) {
          allButtons.forEach((btn) => btn.classList.remove("active"));
          target.classList.add("active");
          textEditing.style.fontFamily = fontFamily;
          movableTextContainer.style.fontFamily = fontFamily;
        } else {
          activeImageContainer.querySelector(".small_image--editable").style.fontFamily = fontFamily;
        }
      }
    }

    /////////////////////////
    // Exit Text Editing
    if (target.classList.contains("editable_container--wrapper")) {
      // update the value
      movableTextContainer.textContent = textEditing.textContent;
      // remove active state from add text button
      addTextBtn.classList.remove("active--text");
      movableTextContainer.classList.remove(HIDDEN);

      // Hid top and bottom editing tools & Hid editing container & unfocuse contenteditable
      topEditingToolsContainer.classList.add(HIDDEN);
      bottomEditingToolsContainer.classList.add(HIDDEN);
      editableContainer.classList.add(HIDDEN);
      textEditing.blur();
    }

    /////////////////////////
    // Tag Item
    const tagItem = target.closest(".tag_container--item") ?? "";

    if (tagItem) {
      const { tag: tagId } = tagItem.dataset;

      // find tag user out of tags
      const user = tags.find((tag) => tag.id === +tagId);
      const filtered = tags.filter((tag) => tag.id !== +tagId);

      // updated tagged array
      tags = filtered;

      // update Dom
      renderTagUserList(tags);

      // updated tagged array
      tagged.push(user);

      renderTagSelected(tagged);
    }

    /////////////////////////
    // Selected
    const selectedItem = target.closest(".select--remove") ?? "";
    if (selectedItem) {
      const { tag: tagId } = target.closest(".tag_selected--item").dataset;

      const user = tagged.find((tag) => tag.id === +tagId); // find user to be removed
      const filtered = tagged.filter((tag) => tag.id !== +tagId); // filter out all tagged users except the one to be remove

      // push the user find to tags array
      tags.push(user);

      // update tagged array with the filtered one
      tagged = filtered;

      // update Dom of selected user
      renderTagSelected(tagged);

      // update Dom of tag user lists
      renderTagUserList(tags);
    }

    /////////////////////////
    // Exit Tag Editing
    if (target.classList.contains("tag_editable_container--wrapper")) {
      // display editableText
      movableTextContainer.classList.remove(HIDDEN);

      // hid tag contains
      tagOverflowBottomContainer.classList.add(HIDDEN);
      tagSelectContainer.classList.add(HIDDEN);
      editableTagWrapper.classList.add(HIDDEN);

      // Handle: if tagged length is single / Multiple (2-up)

      if (tagged.length > 1) {
        // multiple tags
        handleMultipleSelectedTag(tagged);
      } else {
        // single tag
        handleSingleSelectedTag(tagged[0]);
      }
    }

    // Click on Small overlay image
    // const smallImageEditableContainer = target.closest(".small_image--editable");
    const smallImageContainer = target.closest(".small_image--position");
    if (smallImageContainer) {
      // const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
      const smallEditable = smallImageContainer.querySelector(".small_image--editable");
      const resizeBtns = smallImageContainer.querySelectorAll(".resize");
      const moveBtn = smallImageContainer.querySelector(".move_image");
      const removeBtn = smallImageContainer.querySelector(".remove_image--btn");

      resizeBtns.forEach((resize) => resize.classList.remove(HIDDEN));
      smallEditable.setAttribute("contenteditable", "true");
      smallEditable.focus();

      // Show top and bottom overlay for both editing Large text input and small image writing editing
      topOverlay.classList.remove(HIDDEN);
      bottomOverlay.classList.remove(HIDDEN);
      moveBtn.classList.remove(HIDDEN);
      removeBtn.classList.remove(HIDDEN);
      document.querySelector(".cover_editing_tools .list .text").classList.add("active--text");
    }

    // Exit
    const currentCoverImage = target.alt === "Main Cover";
    if (currentCoverImage) {
      const allSmallPostionImage = document.querySelectorAll(".small_image--position");

      allSmallPostionImage.forEach((image) => {
        const allResizeBtn = image.querySelectorAll(".resize");
        const moveBtn = image.querySelector(".move_image");
        const removeBtn = image.querySelector(".remove_image--btn");
        const img = image.querySelector("img");

        allResizeBtn.forEach((btn) => btn.classList.add(HIDDEN));
        moveBtn.classList.add(HIDDEN);
        removeBtn.classList.add(HIDDEN);
        img.classList.remove("active");
      });

      topOverlay.classList.add(HIDDEN);
      bottomOverlay.classList.add(HIDDEN);
      // FInally set editing to false
      smallImageEditing = false;
    }

    // Remove Music Overlay
    const music = target.closest(".close-music");
    if (music) {
      activeImageContainer.removeChild(music.closest(".recording_box"));
    }

    // Play Music
    const playPause = target.closest(".play_pause");
    if (playPause) {
      const recordingBox = playPause.closest(".recording_box");

      if (!overlayAudio) {
        const { musicIndex } = recordingBox.dataset;

        const music = addSoundData.slice(+musicIndex, +musicIndex + 1)[0];

        overlayAudio = new Audio(music.musicPath);
      }

      const playIcon = playPause.querySelector(".play_icon");
      const pauseIcon = playPause.querySelector(".pause_icon");
      if (!overlayAudioPlaying) {
        overlayAudio.play();
        playIcon.classList.add(HIDDEN);
        pauseIcon.classList.remove(HIDDEN);
        overlayAudioPlaying = !overlayAudioPlaying;
      } else {
        overlayAudio.pause();
        playIcon.classList.remove(HIDDEN);
        pauseIcon.classList.add(HIDDEN);
        overlayAudioPlaying = !overlayAudioPlaying;
      }

      // Listening for audio playing ended :)
      overlayAudio.addEventListener("ended", () => {
        overlayAudioPlaying = false;
        playIcon.classList.remove(HIDDEN);
        pauseIcon.classList.add(HIDDEN);
      });
    }
  }
});

// Function to generate a background color, with opacity
function generateHexColorOpacity(hex, opacity = 0.5) {
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Ensure it's a valid 6-character hex
  if (hex.length !== 6) {
    throw new Error("Invalid hex color");
  }

  // Convert opacity from 0-1 to 0-255, then to hex
  let alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");

  // Return the hex color with opacity
  return `#${hex}${alpha}`;
}

// Function to generate a contrasts color of the generated background color
function generateTextColor(hex) {
  // Remove the hash if present
  hex = hex.replace(/^#/, "");

  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (perceived brightness)
  // Formula: 0.299*R + 0.587*G + 0.114*B
  let luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // If luminance is higher than 186 (on a scale of 0-255), it's a light color, so use dark text
  // Otherwise, use light text
  return luminance > 186 ? "#000000" : "#FFFFFF";
}

function handleMultipleSelectedTag(tags) {
  const extractSixTags = tags.slice(0, 6);

  const markup = `
      <div class="tags_multiple_selected">
        ${extractSixTags.map((tag) => `<img src="/images/postImages${tag.image}" alt="${tag.name}" />`)}
        <div class="more_tags ${tags.length < 7 && HIDDEN}">+${tags.length - 6}</div>
      </div>
  `;

  // handler
  handleInsertInDoneTag(markup);
}

function handleSingleSelectedTag(tag) {
  const markup = `
    <div class="tags_single_selected">
      <img src="/images/postImages${tag.image}" alt="${tag.name}" />
      <h3>${tag.name}</h3>
    </div>
  `;

  // handler
  handleInsertInDoneTag(markup);
}

function handleInsertInDoneTag(markup) {
  const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
  const doneTag = activeImageContainer.querySelector(".done_tag");

  // show tags container
  doneTag.classList.remove(HIDDEN);
  // clear the tags container first
  doneTag.innerHTML = "";

  // update the container with the new version of array
  doneTag.insertAdjacentHTML("afterbegin", markup);
}

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
// Editing Tools Buttons functionalities
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
const toolButtonsContainer = document.querySelector(".cover_editing_tools .list");
const soundOverlay = document.querySelector(".sound_overlay");
let initialSmallImageWidth = 120; // px
let initialSmallImageHeight = 120; // px

// Variables to track rotation
let isRotating = false;
let initialAngle = 0;

// Variables to track translation
let initialTranslation = { x: 0, y: 0 };

// Variable to track the current rotation degree
let currentRotation = 0;

// Variable to track if an action is being performed
let isDraggingOrRotating = false;

toolButtonsContainer.addEventListener("click", function (e) {
  const target = e.target;

  if (target.closest("button")) {
    const allButton = toolButtonsContainer.querySelectorAll("button");
    allButton.forEach((btn) => btn.classList.remove("active--text"));

    if (activeIndex) {
      const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
      const bottomOverlay = activeImageContainer.querySelector(".editing_bottom_overlay");
      const topOverlay = activeImageContainer.querySelector(".editing_top_overlay");
      const editableTextWrapper = activeImageContainer.querySelector(".editable_container--wrapper");
      const editableTagWrapper = activeImageContainer.querySelector(".tag_editable_container--wrapper");
      const movableTextContainer = activeImageContainer.querySelector(".added_text");
      const tagOverflowBottomContainer = activeImageContainer.querySelector(".tag_container--overflow");
      const tagSelectContainer = activeImageContainer.querySelector(".tag_selected--overflow");
      const editableTagEl = activeImageContainer.querySelector("#post_tag");
      const editableTextEl = activeImageContainer.querySelector("#post_text");
      const doneTagsContainer = activeImageContainer.querySelector(".done_tag");
      // const smallImages = activeImageContainer.querySelectorAll(".small_image--position");

      if (target.closest(".list")) {
        // display editableText
        movableTextContainer.classList.remove(HIDDEN);

        // hid tag contains
        tagOverflowBottomContainer.classList.add(HIDDEN);
        tagSelectContainer.classList.add(HIDDEN);
        editableTagWrapper.classList.add(HIDDEN);

        // Handle: if tagged length is single / Multiple (2-up)
        if (tagged.length) {
          if (tagged.length > 1) {
            // multiple tags
            handleMultipleSelectedTag(tagged);
          } else {
            // single tag
            handleSingleSelectedTag(tagged[0]);
          }
        }
      }

      // Add Text Button
      if (target.closest(".text")) {
        // Show top and bottom overlay for both editing Large text input and small image writing editing
        topOverlay.classList.remove(HIDDEN);
        bottomOverlay.classList.remove(HIDDEN);
        target.closest(".text").classList.add("active--text");

        // if smallImageEditing is false
        if (!smallImageEditing) {
          editableTextWrapper.classList.remove(HIDDEN);
          editableTextEl.focus(); // apply focus

          // Cursor Controller
          handleCursorBackToFrontOfText(editableTextEl);

          // hid the movable text
          movableTextContainer.classList.add(HIDDEN);

          // hid container for tag
          editableTagWrapper.classList.add(HIDDEN);
          tagOverflowBottomContainer.classList.add(HIDDEN);
          tagSelectContainer.classList.add(HIDDEN);

          // Hid all small Images
          // smallImages.forEach((image) => image.classList.add(HIDDEN));
        } else {
          const smallImageEditable = activeSmallImageEl.querySelector(".small_image--editable");
          smallImageEditable.setAttribute("contenteditable", "true");
          smallImageEditable.focus();
        }
      }

      // Add Tags Button
      const tagElement = target.closest(".tag") ?? "";
      if (tagElement && !smallImageEditing) {
        tagOverflowBottomContainer.classList.remove(HIDDEN);
        tagSelectContainer.classList.remove(HIDDEN);

        doneTagsContainer.classList.add(HIDDEN);

        if (editableTextEl) {
          tagElement.classList.add("active--text");
          editableTagWrapper.classList.remove(HIDDEN);
          editableTagEl.focus(); // add focus

          // Cursor Controller
          handleCursorBackToFrontOfText(editableTagEl);

          // Update Editing Text
          movableTextContainer.classList.remove(HIDDEN);
          movableTextContainer.textContent = editableTextEl.textContent;

          // Hide editing tools
          bottomOverlay.classList.add(HIDDEN);
          topOverlay.classList.add(HIDDEN);
          editableTextWrapper.classList.add(HIDDEN);
          editableTextEl.blur(); // remove focus

          // Tag User Lists
          renderTagUserList(tags);
        }
      }

      // Small Image
      if (target.closest(".image")) {
        // Hid Tag components
        tagOverflowBottomContainer.classList.add(HIDDEN);
        tagSelectContainer.classList.add(HIDDEN);
        editableTagWrapper.classList.add(HIDDEN);

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.style.display = "none";
        activeImageContainer.appendChild(fileInput);

        // Trigger click on the input element
        fileInput.click();

        // Handle dialog event change
        fileInput.onchange = function (e) {
          const file = e.target.files[0];

          // Create Elements
          const imageWrapperPosition = document.createElement("div");
          const imageWrapper = document.createElement("div");
          const img = document.createElement("img");
          const resizeTL = document.createElement("button");
          const resizeTR = document.createElement("button");
          const resizeBL = document.createElement("button");
          const resizeBR = document.createElement("button");
          const moveBtn = document.createElement("button");
          const removeBtn = document.createElement("button");

          // Adding class name
          imageWrapperPosition.className = "small_image--position";
          imageWrapper.classList.add("small_image--wrapper");
          img.classList.add("small_image", "active");
          resizeTL.classList.add("resize", "image_resize--tl", HIDDEN);
          resizeTR.classList.add("resize", "image_resize--tr", HIDDEN);
          resizeBL.classList.add("resize", "image_resize--bl", HIDDEN);
          resizeBR.classList.add("resize", "image_resize--br", HIDDEN);
          moveBtn.classList.add("move_image");
          removeBtn.classList.add("remove_image--btn");

          // Generate image Bob URL
          const bobURL = URL.createObjectURL(file);

          // pass the url into image "src" attribute and give it an 'alt' too :)
          img.src = bobURL;
          img.alt = "Small Images";

          // Append the svg resize icon into each button
          const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#8837e9" d="M18.5 20q-.252 0-.385-.161q-.134-.162-.146-.477q-.046-2.671-1.128-5.027t-2.89-4.155q-1.809-1.8-4.232-2.913T4.573 6.011Q4.411 6 4.206 5.885Q4 5.771 4 5.5t.197-.385t.353-.11q2.942.047 5.541 1.227t4.561 3.141t3.122 4.554t1.201 5.458q.006.31-.109.462q-.114.153-.366.153"/></svg>`;
          resizeTL.innerHTML = iconSVG;
          resizeTR.innerHTML = iconSVG;
          resizeBL.innerHTML = iconSVG;
          resizeBR.innerHTML = iconSVG;
          resizeTL.style.cursor = "resize";
          moveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" d="m14 5l-2-2m0 0l-2 2m2-2v18m0 0l2-2m-2 2l-2-2m9-5l2-2m0 0l-2-2m2 2H3m0 0l2 2m-2-2l2-2"/></svg>`;
          removeBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#363853" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>`;

          // Styling Element
          imageWrapperPosition.style.width = `${initialSmallImageWidth}px`;
          imageWrapperPosition.style.height = `${initialSmallImageHeight}px`;
          imageWrapperPosition.style.position = "absolute";
          imageWrapperPosition.style.left = "50%";
          imageWrapperPosition.style.top = "50%";
          imageWrapperPosition.style.transform = "translate(-50%, -50%)";
          imageWrapperPosition.style.transformOrigin = "center center";

          // Create Contenteditable
          const contentEditable = document.createElement("div");
          contentEditable.setAttribute("contenteditable", "false");
          contentEditable.className = "small_image--editable";

          // append the resize buttons and the img into the wrapper
          imageWrapper.appendChild(resizeBR);
          imageWrapper.appendChild(resizeBL);
          imageWrapper.appendChild(resizeTR);
          imageWrapper.appendChild(resizeTL);
          imageWrapper.appendChild(moveBtn);
          imageWrapper.appendChild(removeBtn);
          imageWrapper.appendChild(img);
          imageWrapperPosition.appendChild(imageWrapper);
          imageWrapperPosition.appendChild(contentEditable);
          activeImageContainer.appendChild(imageWrapperPosition);

          // set smallImageEditing to true if there is change
          smallImageEditing = true;
          activeSmallImageEl = imageWrapperPosition;

          // Remove Small Image
          removeBtn.addEventListener("click", (e) => {
            const smallImageContainer = e.target.closest(".small_image--position");
            activeImageContainer.removeChild(smallImageContainer);
            // set smallImageEditing variable to false
            smallImageEditing = false;

            // Show top and bottom overlay for both editing Large text input and small image writing editing
            topOverlay.classList.add(HIDDEN);
            bottomOverlay.classList.add(HIDDEN);
            document.querySelector(".cover_editing_tools .list .text").classList.add("active--text");
          });

          ////////////////////////////////////////////////////
          ////////////////////////////////////////////////////
          ////////////////////////////////////////////////////
          ///// Rotating Image Functionality
          ////////////////////////////////////////////////////
          ////////////////////////////////////////////////////

          // Function to calculate angle
          function calculateAngle(x1, y1, x2, y2) {
            return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
          }

          const resizeBtns = imageWrapperPosition.querySelectorAll(".resize");
          resizeBtns.forEach((btn) => {
            btn.addEventListener("mousedown", function (event) {
              if (isDraggingOrRotating) return;
              isDraggingOrRotating = true;

              event.stopPropagation();
              isRotating = true;
              const rect = imageWrapperPosition.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;
              initialAngle = calculateAngle(centerX, centerY, event.clientX, event.clientY);

              // Store the initial translation
              const transform = window.getComputedStyle(imageWrapperPosition).transform;
              if (transform !== "none") {
                const matrix = new DOMMatrix(transform);
                initialTranslation = { x: matrix.m41, y: matrix.m42 };
              }

              function rotate(event) {
                if (!isRotating) return;
                const currentAngle = calculateAngle(centerX, centerY, event.clientX, event.clientY);
                const rotationDelta = currentAngle - initialAngle;

                // Combine translation with rotation
                const x = parseFloat(imageWrapperPosition.getAttribute("data-x")) || 0;
                const y = parseFloat(imageWrapperPosition.getAttribute("data-y")) || 0;
                currentRotation += rotationDelta; // accumulate the rotation
                initialAngle = currentAngle; // update the initial angle
                imageWrapperPosition.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;
              }

              function stopRotation() {
                isRotating = false;
                isDraggingOrRotating = false;
                document.removeEventListener("mousemove", rotate);
                document.removeEventListener("mouseup", stopRotation);
              }

              document.addEventListener("mousemove", rotate);
              document.addEventListener("mouseup", stopRotation, {
                once: true,
              });
            });
          });

          // Initialize Interact.js for .small_image--position
          // Draggable
          interact(".move_image").draggable({
            inertia: true,
            modifiers: [
              interact.modifiers.restrictRect({
                restriction: "parent",
                endOnly: true,
              }),
            ],
            listeners: {
              start(event) {
                if (isDraggingOrRotating) {
                  event.preventDefault();
                  return;
                }
                isDraggingOrRotating = true;
              },
              move(event) {
                const target = event.target.closest(".small_image--position");
                const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

                // Translate the element
                target.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation}deg)`;

                // Update the position attributes
                target.setAttribute("data-x", x);
                target.setAttribute("data-y", y);
              },
              end(event) {
                isDraggingOrRotating = false;
              },
            },
          });

          ///////////////////////////////////
          ///////////////////////////////////
          ///////////////////////////////////
          ////////// Resize Handler //////////
          ///////////////////////////////////
          ///////////////////////////////////
          // Top Right
          interact(".image_resize--tr").resizable({
            listeners: {
              move(event) {
                const target = imageWrapperPosition;

                let width = parseFloat(target.style.width) + event.dx; // Increase width when dragging right
                let height = parseFloat(target.style.height) - event.dy; // Decrease height when dragging up

                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
              },
            },
          });

          // Top Left
          interact(".image_resize--tl").resizable({
            listeners: {
              move(event) {
                const target = imageWrapperPosition;

                // Calculate new dimensions
                let width = parseFloat(target.style.width) - event.dx;
                let height = parseFloat(target.style.height) - event.dy;

                // Apply new dimensions to the target element
                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
              },
            },
          });

          // Bottom Left
          interact(".image_resize--br").resizable({
            edges: { bottom: true, right: true },

            listeners: {
              move(event) {
                const target = imageWrapperPosition;

                let width = parseFloat(target.style.width) + event.dx; // Increase width when dragging right
                let height = parseFloat(target.style.height) + event.dy; // Decrease height when dragging up

                target.style.width = `${width}px`;
                target.style.height = `${height}px`;
              },
            },
          });

          // Bottom Right
          interact(".image_resize--bl").resizable({
            edges: { bottom: true, left: true },
            listeners: {
              move(event) {
                const target = imageWrapperPosition;

                let width = parseFloat(target.style.width) - event.dx; // Decrease width when dragging to the right
                let height = parseFloat(target.style.height) + event.dy; // Increase height when dragging down

                target.style.width = `${width}px`;
                target.style.height = `${height}px`;

                // Adjust the left position to ensure the element resizes from the left edge
                target.style.left = `${parseFloat(target.style.left) + event.dx}px`;
              },
            },
          });
        };

        // Hide the contents on the containers
        topOverlay.classList.add(HIDDEN);
        bottomOverlay.classList.add(HIDDEN);
        movableTextContainer.textContent = editableTextEl.textContent;
        movableTextContainer.classList.remove(HIDDEN);
        editableTextWrapper.classList.add(HIDDEN);
        editableTextEl.blur(); // remove focus
      }

      // Add Sound
      if (target.closest(".sound") && !smallImageEditing) {
        soundOverlay.classList.remove(HIDDEN);
      }

      // Start Recording
      if (target.closest(".recording") && !smallImageEditing) {
        recordingContainer.classList.remove(HIDDEN);
      }
    }
  }
});

// This ensures that the cursor is placed after '@' when the tag button is clicked
function handleCursorBackToFrontOfText(el) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(el);
  range.collapse(false);

  selection.removeAllRanges();
  selection.addRange(range);
}

// Set editing back to it's original form and deleting it
const initialImage = document.querySelector(".original_deleted .original");
initialImage.addEventListener("click", () => {
  if (activeIndex) {
    const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);
    const textEditing = activeImageContainer.querySelector("#post_text");
    const editableContainer = activeImageContainer.querySelector(".editable_container--wrapper");
    const movableTextContainer = activeImageContainer.querySelector(".added_text");

    const topEditingToolsContainer = activeImageContainer.querySelector(".editing_top_overlay");
    const bottomEditingToolsContainer = activeImageContainer.querySelector(".editing_bottom_overlay");
    const tagOverflowBottomContainer = activeImageContainer.querySelector(".tag_container--overflow");
    const doneTag = activeImageContainer.querySelector(".done_tag");
    const tagSelectContainer = activeImageContainer.querySelector(".tag_selected--overflow");
    const editableTagWrapper = activeImageContainer.querySelector(".tag_editable_container--wrapper");

    const fontButtons = activeImageContainer.querySelector(".editing_bottom_overlay").querySelectorAll("button");
    const allSmallImages = activeImageContainer.querySelectorAll(".small_image--position");

    // set editing text to empty, hid it's container and clear it's updating container on save
    textEditing.innerHTML = "";
    movableTextContainer.innerHTML = "";
    editableContainer.classList.add(HIDDEN);

    // Text Editing Tools
    topEditingToolsContainer.classList.add(HIDDEN);
    bottomEditingToolsContainer.classList.add(HIDDEN);

    // Tag default
    tagOverflowBottomContainer.querySelector(".tag_container--items").innerHTML = "";
    tagOverflowBottomContainer.classList.add(HIDDEN);
    tagSelectContainer.classList.add(HIDDEN);
    editableTagWrapper.querySelector("#post_tag").textContent = "@";
    editableTagWrapper.classList.add(HIDDEN);
    doneTag.innerHTML = "";

    tagged = [];

    // Font Family Default
    fontButtons.forEach((btn) => () => {
      // remove active state from all other buttons except the first one
      btn.classList.remove("active");
      fontButtons[0].classList.add("active");
    });

    // Remove the node element from the active container
    allSmallImages.forEach((image) => {
      activeImageContainer.removeChild(image);
    });
  }
});

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

/**
 * Add Sound / Audio
 */
const listMusicBox = document.querySelectorAll('.sound_middle_list ul[role="listbox"]');
const soundListPopularContainer = document.querySelector(".sound_list--modal .popular_container");
const soundListRecommendedContainer = document.querySelector(".sound_list--modal .recommended_container");
let currentPlayingPath = "";
let addSoundAudio;
let selectedMusic = "";

const addSoundData = [
  {
    id: 0,
    name: "Long Life",
    author: "Desmond Okechuku",
    musicPath: "/music/sec.mp3",
  },

  {
    id: 1,
    name: "Die For Me",
    author: "Musa Bako",
    musicPath: "/music/cool_down.mp3",
  },

  {
    id: 2,
    name: "Salam Alaikum",
    author: "Baaki Abdullah",
    musicPath: "/music/Salam-Alaikum.mp3",
  },

  {
    id: 3,
    name: "Long Life",
    author: "Haneefah Abdullah",
    musicPath: "/music/running_chinese.mp3",
  },
];

// Sound Popular
function renderAvailablePopularSounds() {
  addSoundData.forEach((sound) => {
    const markup = `
        <li role="button" data-music-selected="${sound.musicPath}">
          <span class="check post-hidden" role="checkbox">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#FFFFFF" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
          </span>

          <div class="music_icon--box">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#D5D5D5" d="M18.671 3.208A2 2 0 0 1 21 5.18V17a4 4 0 1 1-2-3.465V9.18L9 10.847V18q0 .09-.015.174A3.5 3.5 0 1 1 7 15.337v-8.49a2 2 0 0 1 1.671-1.973zM9 8.82l10-1.667V5.18L9 6.847z"/></g></svg>
          </div>

          <div class="desc">
            <h3>${sound.name}</h3>

            <div>
              <h5>${sound.author}</h5>
              <span>00:57</span>
            </div>
          </div>

          <div class="button-play-pause-container" data-audioPath="${sound.musicPath}" data-mode="idle">
            <svg class="progress-ring" width="50" height="50">
              <circle class="progress-ring__circle--bg" stroke="#f2f4f7" stroke-width="4" fill="transparent" r="20" cx="25" cy="25" style="fill: aqua;" />
              <circle class="progress-ring__circle" stroke="#8837E9" stroke-width="4" fill="transparent" r="20" cx="25" cy="25" style="stroke-dashoffset: 125.664; stroke-dasharray: 125.664, 125.664;"/>
            </svg>

            <button role="button">
              <svg xmlns="http://www.w3.org/2000/svg" class="play" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#222222" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235"/></g></svg>
              <svg xmlns="http://www.w3.org/2000/svg" class="pause post-hidden" width="1.5em" height="1.5em" viewBox="0 0 24 24"><rect width="4" height="14" x="6" y="5" fill="#222222" rx="1"/><rect width="4" height="14" x="14" y="5" fill="#222222" rx="1"/></svg>
            </button>
          </div>
        </li>
    `;

    soundListPopularContainer.insertAdjacentHTML("beforeend", markup);
  });
}
renderAvailablePopularSounds();

// Sound Recommended
function renderAvailableRecommendedSounds() {
  addSoundData.forEach((sound) => {
    const markup = `
              <li role="button" data-music-selected="${sound.musicPath}">
                <span class="check post-hidden" role="checkbox">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#FFFFFF" d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z"/></svg>
                </span>

                <div class="music_icon--box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#D5D5D5" d="M18.671 3.208A2 2 0 0 1 21 5.18V17a4 4 0 1 1-2-3.465V9.18L9 10.847V18q0 .09-.015.174A3.5 3.5 0 1 1 7 15.337v-8.49a2 2 0 0 1 1.671-1.973zM9 8.82l10-1.667V5.18L9 6.847z"/></g></svg>
                  <div class="start_wrapper">
                     <svg xmlns="http://www.w3.org/2000/svg" width="0.8em" height="0.8em" class="start" viewBox="0 0 24 24"><path fill="#ffffff" d="M14.59 7.41L18.17 11H6v2h12.17l-3.59 3.59L16 18l6-6l-6-6zM2 6v12h2V6z"/></svg>
                    </div>
                </div>

                <div class="desc">
                  <h3>${sound.name}</h3>

                  <div>
                    <h5>${sound.author}</h5>
                    <span>20:27</span>
                  </div>
                </div>

                <div class="button-play-pause-container" data-audiopath="${sound.musicPath}" data-mode="idle">
                  <svg class="progress-ring" width="50" height="50">
                    <circle class="progress-ring__circle--bg" stroke="#f2f4f7" stroke-width="4" fill="transparent" r="20" cx="25" cy="25" style="fill: aqua;" />
                    <circle class="progress-ring__circle" stroke="#8837E9" stroke-width="4" fill="transparent" r="20" cx="25" cy="25" style="stroke-dashoffset: 125.664; stroke-dasharray: 125.664, 125.664;" />
                  </svg>

                  <button role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" class="play" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="#222222" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235"/></g></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" class="pause post-hidden" width="1.5em" height="1.5em" viewBox="0 0 24 24"><rect width="4" height="14" x="6" y="5" fill="#222222" rx="1"/><rect width="4" height="14" x="14" y="5" fill="#222222" rx="1"/></svg>
                  </button>
                </div>
              </li>
    `;

    soundListRecommendedContainer.insertAdjacentHTML("beforeend", markup);
  });
}
renderAvailableRecommendedSounds();

// Handle List Check
listMusicBox.forEach((container) =>
  container.addEventListener("click", function (e) {
    const listItem = e.target.closest("li");
    const listItems = container.querySelectorAll("li");

    // Handle List Check
    if (listItem && !e.target.closest(".button-play-pause-container")) {
      const checkBox = listItem.querySelector(".check");

      if (checkBox) {
        if (!checkBox.classList.contains(HIDDEN)) {
          checkBox.classList.add(HIDDEN);
          selectedMusic = "";
        } else {
          listItems.forEach((item) => {
            item.querySelector(".check").classList.add(HIDDEN);
          });
          checkBox.classList.remove(HIDDEN);

          const { musicSelected } = listItem.dataset;

          selectedMusic = musicSelected;
        }
      }
    }

    // Handle Play Music
    const target = e.target.closest(".button-play-pause-container");
    if (target) {
      const { mode, audiopath } = target.dataset;
      const playSVG = target.querySelector(".play");
      const pauseSVG = target.querySelector(".pause");

      // IDLE MODE
      if (mode === "idle") {
        // Reset all other buttons and sounds
        resetAllSounds();

        addSoundAudio = new Audio(audiopath);
        currentPlayingPath = audiopath;

        addSoundAudio.addEventListener("loadedmetadata", () => {
          // The below conditional statement is compulsory for getting accurate audio duration for a blob type
          if (addSoundAudio.duration === Infinity) {
            addSoundAudio.currentTime = 1e101;
            addSoundAudio.ontimeupdate = () => {
              addSoundAudio.ontimeupdate = null;
              addSoundAudio.currentTime = 0;
            };
          }
        });

        addSoundAudio.addEventListener("timeupdate", () => {
          const progress = (addSoundAudio.currentTime / addSoundAudio.duration) * 100;
          setProgress(progress, target.querySelector(".progress-ring__circle"));
          document.querySelector(".sound_list_testing_progress").style.width = `${progress}%`;
        });

        addSoundAudio.addEventListener("ended", () => {
          playSVG.classList.remove(HIDDEN);
          pauseSVG.classList.add(HIDDEN);
          target.setAttribute("data-mode", "idle");
        });

        addSoundAudio.play();
        playSVG.classList.add(HIDDEN);
        pauseSVG.classList.remove(HIDDEN);

        target.setAttribute("data-mode", "playing");
        return;
      }

      // PLAYING MODE
      if (mode === "playing") {
        addSoundAudio.pause();
        playSVG.classList.remove(HIDDEN);
        pauseSVG.classList.add(HIDDEN);
        target.setAttribute("data-mode", "pause");
        return;
      }

      // PAUSE MODE
      if (mode === "pause") {
        addSoundAudio.play();
        playSVG.classList.add(HIDDEN);
        pauseSVG.classList.remove(HIDDEN);
        target.setAttribute("data-mode", "playing");
        return;
      }
    }
  })
);

// Mute / Unmute Sound
const muteSound = document.getElementById("sound_mute");
const unmuteSound = document.getElementById("sound_unmute");
const muteButtons = document.querySelectorAll(".mute_button");

muteSound.addEventListener("click", function () {
  if (addSoundAudio) {
    muteButtons.forEach((btn) => btn.classList.remove("active"));
    addSoundAudio.muted = true;
    this.classList.add("active");
  }
});

unmuteSound.addEventListener("click", function () {
  if (addSoundAudio) {
    muteButtons.forEach((btn) => btn.classList.remove("active"));
    addSoundAudio.muted = false;
    this.classList.add("active");
  }
});

// Add Chosen Post Sound
const addChosenSound = document.getElementById("add_chosen--sound");
addChosenSound.addEventListener("click", () => {
  if (!selectedMusic) return;

  const musicIndex = addSoundData.findIndex((sound) => sound.musicPath === selectedMusic);

  handleAddSoundOrRecordingToPost(musicIndex);

  // Hide The Select music Container
  soundOverlay.classList.add(HIDDEN);
});

// Add Sound to Post
function handleAddSoundOrRecordingToPost(musicIndex) {
  overlayAudio = "";
  const activeImageContainer = coverEditingContainer.querySelector(`[data-itemcover="${activeIndex}"]`);

  // Post Page
  const recordingBox = `
      <div class="recording_box" data-music-index="${musicIndex}">
        <div>
          <button class="play_pause">
            <svg xmlns="http://www.w3.org/2000/svg" class="play_icon" width="1.6em" height="1.6em" viewBox="0 0 24 24"><path fill="#ffff" fill-rule="evenodd" d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18M10.783 7.99l5.644 3.136a1 1 0 0 1 0 1.748l-5.644 3.136A1.2 1.2 0 0 1 9 14.96V9.04a1.2 1.2 0 0 1 1.783-1.05" clip-rule="evenodd"/></svg>

            <svg xmlns="http://www.w3.org/2000/svg" class="pause_icon post-hidden" width="1.6em" height="1.6em" viewBox="0 0 24 24"><rect width="4" height="14" x="6" y="5" fill="#ffffff" rx="1"/><rect width="4" height="14" x="14" y="5" fill="#ffffff" rx="1"/></svg>
          </button>

          <div class="content">
            <h3>Recording</h3>
            <span>Wade Warren</span>
          </div>
        </div>

        <button class="close-music">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#FF7979" d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59L7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12L5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/></svg>
        </button>
      </div>
    `;

  const existing = activeImageContainer.querySelector(".recording_box");
  // If there is existing recording box
  if (existing) activeImageContainer.removeChild(existing);

  // Insert new One
  activeImageContainer.insertAdjacentHTML("beforeend", recordingBox);
}

// Function to reset all play/pause buttons and progress animations
function resetAllSounds() {
  const playPauseBtnAll = document.querySelectorAll(".sound_middle_list .button-play-pause-container");

  playPauseBtnAll.forEach((btn) => {
    const playSVG = btn.querySelector(".play");
    const pauseSVG = btn.querySelector(".pause");
    const progressCircle = btn.querySelector(".progress-ring__circle");

    // Set mode back to idle
    btn.setAttribute("data-mode", "idle");

    // Show play button and hide pause button
    playSVG.classList.remove(HIDDEN);
    pauseSVG.classList.add(HIDDEN);

    // Reset the progress bar
    setProgress(0, progressCircle);
  });

  // Pause the current audio if it's playing
  if (addSoundAudio) {
    addSoundAudio.pause();
    addSoundAudio.currentTime = 0;
  }
}

// Hide Sound List Overlay
const hidSoundListModal = document.querySelector(".sound_list--modal .times");
const cancelSoundListModal = document.querySelector(".sound_list--modal .cancel");

[hidSoundListModal, cancelSoundListModal].forEach((btn) => {
  btn.addEventListener("click", () => {
    soundOverlay.classList.add(HIDDEN);
  });
});

// Mobile Editing Tools Event
const mobileTools = document.querySelector(".mobile_editing_tools");

mobileTools.addEventListener("click", function (e) {
  const target = e.target;

  const textBtn = target.closest(".text") ?? "";
  const addSoundBtn = target.closest(".add_sound") ?? "";
  const tagBtn = target.closest(".tag") ?? "";
  const addImageBtn = target.closest(".add_image") ?? "";
  const voiceRecordingBtn = target.closest(".voice_recording") ?? "";

  if (textBtn) {
    console.log("Text :))");
  }

  if (tagBtn) {
    console.log("Tag :))");
  }

  if (addImageBtn) {
    console.log("Image :))");
  }

  if (addSoundBtn) {
    soundOverlay.classList.remove(HIDDEN);
  }

  if (voiceRecordingBtn) {
    console.log("Voice Recording :))");
  }
});

const mobileAddSoundBtn = document.querySelector("form .search_icon");
const soundContainerTabButton = document.querySelector(".top_container > .tab_buttons");
const soundContainerTabSearch = document.querySelector(".top_container--mobile-search");

let activeSearch = false;
mobileAddSoundBtn.addEventListener("click", function () {
  if (innerWidth < 667) {
    if (!activeSearch) {
      soundContainerTabButton.classList.add(HIDDEN);
      soundContainerTabSearch.classList.remove(HIDDEN);
      activeSearch = true;
    } else {
      soundContainerTabButton.classList.remove(HIDDEN);
      soundContainerTabSearch.classList.add(HIDDEN);
      activeSearch = false;
    }
  }
});

/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
/////////////////////////////
// Sound Tab Switch
const tabButtonContainer = document.querySelector(".tab_buttons");

tabButtonContainer.addEventListener("click", function (e) {
  const target = e.target;
  const allButton = tabButtonContainer.querySelectorAll("button");

  if (target.tagName.toLowerCase() === "button") {
    // remove active class from all buttons first
    allButton.forEach((btn) => btn.classList.remove("active"));

    // add active class to the target element
    target.classList.add("active");

    // show/ hid right container
    if (soundListPopularContainer.classList.contains(HIDDEN)) {
      soundListPopularContainer.classList.remove(HIDDEN);
      soundListRecommendedContainer.classList.add(HIDDEN);
    } else {
      soundListPopularContainer.classList.add(HIDDEN);
      soundListRecommendedContainer.classList.remove(HIDDEN);
    }
  }
});
