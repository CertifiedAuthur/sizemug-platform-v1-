const voiceCaptionBtn = document.getElementById("voice_caption--tool");
const voiceCaptionContainer = document.getElementById("voice_caption--container");
const closeVoiceModalBtn = document.getElementById("close_voice_capturing");
const startVoiceCapturingBtn = document.getElementById("start_voice_capturing");
const stopVoiceCapturingBtn = document.getElementById("stop_voice_capturing");
const continueVoiceCapturingBtn = document.getElementById("continue_voice_capturing");
const copyVoiceCapturingBtn = document.getElementById("copy_voice_capturing");

voiceCaptionBtn.addEventListener("click", () => {
  const containerState = JSON.parse(voiceCaptionContainer.ariaHidden);

  if (containerState) {
    openVoiceCapturingModal();
  } else {
    closeVoiceCapturingModal();
  }
});

function openVoiceCapturingModal() {
  voiceCaptionContainer.classList.remove(HIDDEN);
  voiceCaptionContainer.ariaHidden = false;
}

function closeVoiceCapturingModal() {
  voiceCaptionContainer.classList.add(HIDDEN);
  voiceCaptionContainer.ariaHidden = true;
}

document.addEventListener("DOMContentLoaded", function () {
  const autoFillTextContainerEl = document.getElementById("auto_write_caption");
  let isPaused = false;

  if (annyang) {
    // Variable to store the transcription
    let transcription = "";

    let focusedEditor = null;

    paperEditors.forEach((editor) => {
      editor.container.addEventListener("focusin", function () {
        focusedEditor = editor;
      });
    });

    // Add a command that captures everything said
    annyang.addCallback("result", function (phrases) {
      const newText = phrases[0].trim(); // Capture the latest phrase and trim it
      transcription += newText + " "; // Update the transcription
      autoFillTextContainerEl.textContent = transcription;

      // Insert the new text into the focused editor
      if (focusedEditor) {
        const quill = focusedEditor; // Assuming focusedEditor is a Quill editor instance
        const selection = quill.getSelection(); // Get current selection

        // Check if there's an active selection or cursor position
        if (selection) {
          const cursorPosition = selection.index; // Get the cursor position

          // Insert the new text at the cursor position
          quill.insertText(cursorPosition, newText, Quill.sources.USER);

          // Move the cursor to the end of the newly inserted text
          quill.setSelection(cursorPosition + newText.length, Quill.sources.SILENT);
        } else {
          // If there is no selection, you can just append to the end
          const currentText = quill.getText(); // Get the current text from the editor
          quill.insertText(currentText.length, newText, Quill.sources.USER);
        }
      }
    });

    // Start event
    startVoiceCapturingBtn.onclick = () => {
      annyang.start({ autoRestart: false, continuous: true });

      isPaused = false;
      autoFillTextContainerEl.textContent = "";
      startVoiceCapturingBtn.classList.add(HIDDEN);
      stopVoiceCapturingBtn.classList.remove(HIDDEN);
      copyVoiceCapturingBtn.classList.add(HIDDEN);
      continueVoiceCapturingBtn.classList.add(HIDDEN);
    };

    // Stop event
    stopVoiceCapturingBtn.onclick = () => {
      isPaused = true;
      annyang.pause();

      startVoiceCapturingBtn.classList.remove(HIDDEN);
      stopVoiceCapturingBtn.classList.add(HIDDEN);
      copyVoiceCapturingBtn.classList.remove(HIDDEN);
      continueVoiceCapturingBtn.classList.remove(HIDDEN);
    };

    // Continue event
    continueVoiceCapturingBtn.onclick = () => {
      isPaused = false;
      annyang.resume();
      startVoiceCapturingBtn.classList.add(HIDDEN);
      stopVoiceCapturingBtn.classList.remove(HIDDEN);
      copyVoiceCapturingBtn.classList.add(HIDDEN);
      continueVoiceCapturingBtn.classList.add(HIDDEN);
    };

    // Copy event
    copyVoiceCapturingBtn.onclick = () => {
      navigator.clipboard.writeText(transcription).then(
        function () {
          console.log("Text Copied :)");
        },
        function (err) {
          console.error("Could not copy text: ", err);
        }
      );
    };

    // Close Event
    closeVoiceModalBtn.onclick = () => {
      isPaused = false;

      annyang.abort();
      startVoiceCapturingBtn.classList.remove(HIDDEN);
      stopVoiceCapturingBtn.classList.add(HIDDEN);
      copyVoiceCapturingBtn.classList.add(HIDDEN);
      continueVoiceCapturingBtn.classList.add(HIDDEN);
      autoFillTextContainerEl.textContent = "";
    };
  } else {
    console.log("Speech recognition is not supported in this browser.");
  }
});
