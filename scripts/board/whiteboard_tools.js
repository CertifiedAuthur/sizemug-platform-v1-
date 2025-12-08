"use strict";

// Tooltips
tippy.delegate(document.body, {
  target: ".bar_tooltips", // matches dynamically added items
  placement: "top",
  zIndex: 999999999,
});

tippy.delegate(document.getElementById("topContainerOverlay"), {
  target: ".top_tool_item",
  placement: "bottom",
  zIndex: 999999999,
});

const whiteboardContainer = document.querySelector(".whiteboard-container");
const whiteBoard = document.getElementById("whiteboard");

const POPPER_HIDDEN = "popper-hidden";
