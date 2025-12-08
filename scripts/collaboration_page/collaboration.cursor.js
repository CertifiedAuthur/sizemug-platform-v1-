const collaborationEditorContainer = document.getElementById("collaboration_collaboration");
const collaborationMain = document.getElementById("collaboration_collaboration");

let activeCursor = "pointer"; // Pointer | Hand

collaborationEditorContainer.addEventListener("mouseenter", () => {
  if (activeCursor) {
    const customCursor = document.getElementById(`${activeCursor}Cursor`);
    if (customCursor) {
      customCursor.style.display = "block"; // Show custom cursor
    }
  }
});

collaborationEditorContainer.addEventListener("mouseleave", () => {
  if (activeCursor) {
    const customCursor = document.getElementById(`${activeCursor}Cursor`);
    if (customCursor) {
      customCursor.style.display = "none"; // Hide when leaving collaborationEditorContainer
    }
  }
});

collaborationEditorContainer.addEventListener("mousemove", (event) => {
  const { clientX, clientY } = event;
  const rect = collaborationEditorContainer.getBoundingClientRect();

  if (activeCursor) {
    const customCursor = document.getElementById(`${activeCursor}Cursor`);
    if (customCursor) {
      // Position cursor relative to the collaborationEditorContainer
      customCursor.style.left = `${clientX - rect.left}px`;
      customCursor.style.top = `${clientY - rect.top}px`;
    }
  }
});

//////////////////////////////////////
/// FIGMA LIKE EDITING WHITE SPACE ///
//////////////////////////////////////
const mugSwitchContainer = document.querySelector(".sizemug_switch_logo");

mugSwitchContainer.addEventListener("click", function (event) {
  const btns = mugSwitchContainer.querySelectorAll(".btn");
  const sizemugBtn = document.querySelector(".sizemug_switch_logo .top");
  const cursorBtn = document.querySelector(".sizemug_switch_logo .bottom");

  // remove active on all
  btns.forEach((btn) => btn.classList.remove("collaboration_mug--active"));
  const sizemugImage = sizemugBtn.querySelector("img");

  if (event.target.closest(".top")) {
    activeCursor = "pointer";

    sizemugBtn.classList.add("collaboration_mug--active");
  }

  if (event.target.closest(".bottom")) {
    activeCursor = "hand";
    cursorBtn.classList.add("collaboration_mug--active");
  }
});

////////////////////////////////////////
///////// CURSOR MOVING AROUND /////////
////////////////////////////////////////
// collaborationMain.addEventListener("mousemove", handleCursorMove);
// collaborationMain.addEventListener("mouseleave", handleCursorLeave);

// const offsetX = 15;
// const offsetY = 15;

// function handleCursorMove(event) {
//   if (event.target.closest(".whiteboard_play_recording")) {
//     event.target.closest(".whiteboard_play_recording").style.cursor = "pointer";
//     hideCursors();
//     return;
//   }

//   if (activeCursor) {
//     const cursor = document.getElementById(`active_cursor--${activeCursor}`);
//     cursor.classList.remove(HIDDEN);

//     const collabRect = collaborationMain.getBoundingClientRect();

//     // Calculate the position of the cursor relative to the collaboration area
//     const cursorX = event.clientX - collabRect.left + offsetX;
//     const cursorY = event.clientY - collabRect.top + offsetY;

//     cursor.style.left = `${cursorX}px`;
//     cursor.style.top = `${cursorY}px`;
//   }
// }

// function handleCursorLeave() {
//   hideCursors();
// }

// function hideCursors() {
//   const cursors = document.querySelectorAll(".collaboration_cursor");
//   cursors.forEach((cursor) => cursor.classList.add(HIDDEN));
// }

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
// Playing Whiteboard Voice
let voicePlaying;
collaborationMain.addEventListener("click", function (e) {
  const recording = e.target.closest(".play_button");

  if (recording) {
    // const recording = recording.querySelector(".play_button");
    const { voice, mode } = recording.dataset;
    const record = voiceRecords.find((record) => record.id === +voice);

    const playingEl = recording.querySelector("#play");
    const pauseEl = recording.querySelector("#pause");

    if (mode === "idle") {
      voicePlaying = new Audio(record.url);
      voicePlaying.play();
      recording.setAttribute("data-mode", "playing");
      playingEl.classList.add(HIDDEN);
      pauseEl.classList.remove(HIDDEN);

      voicePlaying.addEventListener("ended", () => {
        playingEl.classList.remove(HIDDEN);
        pauseEl.classList.add(HIDDEN);
        voicePlaying.setAttribute("data-mode", "idle");
      });
      return;
    }

    if (mode === "playing") {
      voicePlaying.pause();
      recording.setAttribute("data-mode", "pause");
      playingEl.classList.remove(HIDDEN);
      pauseEl.classList.add(HIDDEN);
      return;
    }

    if (mode === "pause") {
      voicePlaying.play();
      recording.setAttribute("data-mode", "playing");
      playingEl.classList.add(HIDDEN);
      pauseEl.classList.remove(HIDDEN);
      return;
    }
  }
});

collaborationMain.addEventListener("mouseenter", (e) => {
  const whiteboard_play_recording = e.target.closest(".whiteboard_play_recording");

  if (whiteboard_play_recording) {
    console.log(whiteboard_play_recording);
    collaborationMain.querySelectorAll(".text-box").forEach((editor) => editor.setAttribute("contenteditable", false));
  }
});
