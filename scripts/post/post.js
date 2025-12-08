"use strict";
const HIDDEN = "post-hidden";

/**
 * -------------------
 * OVERLAY
 * -------------------
 */
const overlays = document.querySelectorAll(".overlay");

overlays.forEach((overlay) => {
  overlay.addEventListener("click", function (e) {
    if (e.target.classList.contains("overlay")) {
      overlay.classList.add(HIDDEN);
    }
  });
});

const postTabContainer = document.querySelector(".create_post_section--tabs");
const tabButtons = postTabContainer.querySelectorAll("button");
let currentPostTab = 1;

postTabContainer.addEventListener("click", function (event) {
  const target = event.target;
  const button = target.closest("button");

  if (button) {
    const { tab } = button.dataset;

    currentPostTab = tab;
    handlePostTab(tab);
  }
});

function handlePostTab(tab) {
  const ACTIVE = "tab-post-active";

  const button = document.querySelector(`[data-tab="${tab}"]`);

  // button handler
  const firstSvgImage = button.querySelector("svg:first-child");
  const lastSvgImage = button.querySelector("svg:nth-child(2)");

  tabButtons.forEach((btn) => {
    btn.classList.remove(ACTIVE);
    const firstSvgImage = btn.querySelector("svg:first-child");
    const lastSvgImage = btn.querySelector("svg:nth-child(2)");

    firstSvgImage.classList.remove(HIDDEN);
    lastSvgImage.classList.add(HIDDEN);
  });

  button.classList.add(ACTIVE); // add active class to the target button
  firstSvgImage.classList.add(HIDDEN); // hid the gray svg
  lastSvgImage.classList.remove(HIDDEN); // show the purple svg

  // tab section
  // const { tab } = button.dataset;
  const allSections = document.querySelectorAll(".create_post_tab");
  const section = document.querySelector(`.create_post_tab--${tab}`);

  allSections.forEach((section) => section.classList.add(HIDDEN));
  section.classList.remove(HIDDEN);
}

// HASHTAG SELECTING
const element = document.querySelector(".js-choice");
const choices = new Choices(element, {
  allowHTML: true,
});

/**
 * -------------------
 * SELECT FEED
 * -------------------
 */
const allFeed = document.querySelectorAll(".feed_lists .feed");

allFeed.forEach((feed) => {
  feed.addEventListener("click", function (e) {
    const ACTIVE = "feed-active";

    if (feed.classList.contains(ACTIVE)) {
      feed.classList.remove(ACTIVE);
    } else {
      feed.classList.add(ACTIVE);
    }
  });
});

/**
 * -------------------
 * EDITOR
 * -------------------
 */
function formatDoc(command, value = null) {
  if (value) {
    document.execCommand(command, false, value);
  } else {
    document.execCommand(command);
  }
}

/**
 * ------------------------
 * LINK HANDLERS FOR EDITOR
 * ------------------------
 */
const linkBtn = document.querySelector("#create_link--btn");
const modalLinkContainer = document.querySelector(".modal__link");
const newPostEditor = document.getElementById("post_description_editor");

linkBtn.addEventListener("click", function () {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Save the selected range
  const range = selection.getRangeAt(0);
  window.selectedRange = range;

  // Show the modal
  modalLinkContainer.classList.remove(HIDDEN);
});

const linkOkButton = modalLinkContainer.querySelector("button");
linkOkButton.addEventListener("click", function (event) {
  event.preventDefault();

  const text = modalLinkContainer.querySelector('[name="text"]').value;
  const url = modalLinkContainer.querySelector('[name="url"]').value;

  if (!url || !text) return;

  // Hide the modal
  modalLinkContainer.classList.add(HIDDEN);

  // Get the selected range
  const range = window.selectedRange;
  if (!range) return;

  // Create the link element
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text; // range.toString();

  // Replace the selected text with the link
  range.deleteContents();
  range.insertNode(link);

  // Clear the selection
  window.getSelection().removeAllRanges();
});

// Mouseenter and Mouseleave editor
newPostEditor.addEventListener("mouseenter", function () {
  const anchorElements = newPostEditor.querySelectorAll("a");

  anchorElements.forEach((anchor) => {
    anchor.addEventListener("mouseenter", function () {
      newPostEditor.setAttribute("contenteditable", "false");
      anchor.target = "_blank";
    });

    anchor.addEventListener("mouseleave", function () {
      newPostEditor.setAttribute("contenteditable", "true");
    });
  });
});

// Bold state
const boldEls = document.querySelectorAll(".bold");
const italicEls = document.querySelectorAll(".italic");
const ulEls = document.querySelectorAll(".ul-list");
const olEls = document.querySelectorAll(".ol-list");
const ACTIVE = "post_edit_btn--active";

function isActiveEditing(type) {
  return document.queryCommandState(type);
}

const postEditorBtns = document.querySelector(".post_editor_tools");
postEditorBtns.addEventListener("click", function () {
  if (isActiveEditing("bold") === true) {
    boldEls.forEach((s) => s.classList.add(ACTIVE));
  } else {
    boldEls.forEach((s) => s.classList.remove(ACTIVE));
  }

  if (isActiveEditing("italic")) {
    italicEls.forEach((s) => s.classList.add(ACTIVE));
  } else {
    italicEls.forEach((s) => s.classList.remove(ACTIVE));
  }

  if (isActiveEditing("insertUnorderedList")) {
    ulEls.forEach((s) => s.classList.add(ACTIVE));
  } else {
    ulEls.forEach((s) => s.classList.remove(ACTIVE));
  }

  if (isActiveEditing("insertOrderedList")) {
    olEls.forEach((s) => s.classList.add(ACTIVE));
  } else {
    olEls.forEach((s) => s.classList.remove(ACTIVE));
  }
});

/**
 * ------------------------
 * DISCARD MODAL
 * ------------------------
 */
const discardBtn = document.querySelector(".btn.discard");
const discardContainer = document.querySelector(".discard_modal_wrapper");
const mobileCancelButton = document.querySelector(".mobile_cancel--btn");
const discardToolBtn = document.querySelector(".original_deleted .deleted");

[discardToolBtn, discardBtn].forEach((btn) => {
  btn.addEventListener("click", () => {
    discardContainer.classList.remove(HIDDEN);
  });
});

mobileCancelButton.addEventListener("click", function () {
  discardContainer.classList.add(HIDDEN);
});

// Move to next tab
const nextBtn = document.querySelector(".btn.next");
const backBtn = document.querySelector(".btn.back");
const draftBtn = document.querySelector(".btn.draft");
const createAdBtn = document.querySelector(".btn.create-ad");

nextBtn.addEventListener("click", () => {
  if (Number(currentPostTab) === 1) {
    currentPostTab = 2;
    handlePostTab(currentPostTab);
  } else if (Number(currentPostTab) === 2) {
    currentPostTab = 3;
    nextBtn.classList.add(HIDDEN);
    draftBtn.classList.remove(HIDDEN);
    createAdBtn.classList.remove(HIDDEN);
    handlePostTab(currentPostTab);
  } else {
    console.log("Preview");
  }
});

// Move to previous tab
backBtn.addEventListener("click", () => {
  if (Number(currentPostTab) === 3) {
    currentPostTab = 2;
    nextBtn.classList.remove(HIDDEN);
    draftBtn.classList.add(HIDDEN);
    createAdBtn.classList.add(HIDDEN);
    handlePostTab(currentPostTab);
  } else if (Number(currentPostTab) === 2) {
    currentPostTab = 1;
    handlePostTab(currentPostTab);
  } else {
    // console.log("Preview");
  }
});
