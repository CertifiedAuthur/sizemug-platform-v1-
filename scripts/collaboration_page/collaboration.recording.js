// "use strict";

///////////////////////////////////////////////////////////////////
////////////////////  VOICE RECORDING /////////////////////////////
///////////////////////////////////////////////////////////////////
// Show Voice Recording Modal
const showRecordModalBtn = document.getElementById("show_recording_modal");
const recordingListContainer = document.querySelector(".collaboration_tool--recording");
const recordingContainer = document.querySelector(".voice_note-overlay");
const addRecording = recordingContainer.querySelector(".bottom_content .add_recording");
const cancelRecording = recordingContainer.querySelector(".bottom_content .cancel");
// const HIDDEN = "hidden-page";

showRecordModalBtn.addEventListener("click", () => {
  recordingContainer.classList.remove(HIDDEN);
  recordingListContainer.classList.add(HIDDEN);
});

cancelRecording.addEventListener("click", () => {
  recordingContainer.classList.add(HIDDEN);
});

// Start Recording
const startRecordingBtn = document.querySelector(".voice_note #start_recording");
const waveformContainer = document.getElementById("waveformContainer");
const timer = document.querySelector(".timer");
const recordedItem = document.querySelector(".voice_listbox");

let audioContext;
let analyser;
let microphone;
let audioWorkletNode;
let isRecording = false;
let startTime;
let timerInterval;
let mediaRecorder;
let audioChunks = [];
// if this variable is empty new Audio object will be creating when user want to play the recorded audio. if this recording want to be play once again, it won't be created anymore
let voiceAudio;
let audioVoiceUrl;
let currentRecordTime;

// Event
startRecordingBtn.addEventListener("click", function () {
  const playIcon = this.querySelector(".globe");
  const pauseIcon = this.querySelector(".rectangle-pause");
  const buttonSpan = this.querySelector("span");

  if (!this.classList.contains("active")) {
    this.classList.add("active");
    pauseIcon.classList.remove(HIDDEN);
    playIcon.classList.add(HIDDEN);
    waveformContainer.classList.remove(HIDDEN);
    recordedItem.classList.add(HIDDEN);
    buttonSpan.textContent = "Stop Recording";
    audioVoiceUrl = "";

    startRecording();
  } else {
    this.classList.remove("active");
    pauseIcon.classList.add(HIDDEN);
    playIcon.classList.remove(HIDDEN);
    waveformContainer.classList.add(HIDDEN);
    recordedItem.classList.remove(HIDDEN);
    buttonSpan.textContent = "Start Recording";

    stopRecording();
  }
});

// Inline AudioWorkletProcessor
const volumeProcessor = `
class VolumeProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = [];
    this._bufferSize = 1024;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      this._buffer.push(...input[0]);
      if (this._buffer.length >= this._bufferSize) {
        const rms = this.calculateRMS(this._buffer);
        this.port.postMessage(rms);
        this._buffer.splice(0);
      }
    }
    return true;
  }

  calculateRMS(buffer) {
    let sum = 0;
    buffer.forEach((value) => {
      sum += value * value;
    });
    return Math.sqrt(sum / buffer.length);
  }
}

registerProcessor('volume-processor', VolumeProcessor);
`;

// start recording
async function startRecording() {
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);

      try {
        const blob = new Blob([volumeProcessor], {
          type: "application/javascript",
        });
        await audioContext.audioWorklet.addModule(URL.createObjectURL(blob));
        audioWorkletNode = new AudioWorkletNode(audioContext, "volume-processor");
      } catch (error) {
        console.error("Failed to load audio worklet module:", error);
        alert("Error loading audio worklet module. Please try again.");
        return;
      }

      mediaRecorder = new MediaRecorder(stream);
      audioChunks = []; // Reset the audio chunks array

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        audioVoiceUrl = URL.createObjectURL(audioBlob);
      };

      analyser.smoothingTimeConstant = 0.3;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(audioWorkletNode);
      audioWorkletNode.connect(audioContext.destination);

      audioWorkletNode.port.onmessage = (event) => {
        const volume = event.data;
        addVolumeBar(volume);
      };

      mediaRecorder.start();
      waveformContainer.innerHTML = ""; // clear previous bar before starting new one
      addRecording.classList.add(HIDDEN);

      isRecording = true;
      startTime = Date.now();
      updateTimer();
    }
  } catch (error) {
    handleMicrophoneError(error);
  }
}

// stop recording
function stopRecording() {
  if (isRecording) {
    mediaRecorder.stop();
    microphone.disconnect();
    analyser.disconnect();
    audioWorkletNode.disconnect();
    audioContext.close();
    isRecording = false;

    clearInterval(timerInterval);
    addRecording.classList.remove(HIDDEN);
    voiceAudio = "";

    timer.textContent = "00:00:00";
  }
}

function handleMicrophoneError(error) {
  if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
    alert("Microphone access was denied. Please allow microphone access to record.");
  } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
    alert("No microphone was found. Please connect a microphone to record.");
  } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
    alert("Microphone is already in use or not accessible. Please try again.");
  } else if (error.name === "AbortError") {
    alert("Microphone request was aborted. Please try again.");
  } else {
    console.error("Error accessing microphone: ", error);
  }
}

function getRMS(array) {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const value = array[i] / 128.0 - 1.0;
    sum += value * value;
  }
  return Math.sqrt(sum / array.length);
}

function addVolumeBar(volume) {
  const maxHeight = 200; // Maximum height of the bar in pixels
  const height = Math.min(volume * 500, maxHeight); // Scale the volume to fit the bar height
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = `${height}px`;
  bar.style.bottom = "50%"; // Start from the middle
  bar.style.transformOrigin = "bottom"; // Grow from the middle
  waveformContainer.appendChild(bar);

  // Animate the bar moving to the left
  Array.from(waveformContainer.children).forEach((child, index) => {
    const rightPosition = parseFloat(child.style.right) || 0;
    child.style.right = `${rightPosition + 4}px`; // Move left
  });

  // Remove old bars to keep the container clean
  if (waveformContainer.children.length > 200) {
    waveformContainer.removeChild(waveformContainer.firstChild);
  }
}

function updateTimer() {
  timerInterval = setInterval(() => {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor((elapsedTime / 1000) % 60);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

    timer.textContent = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    currentRecordTime = timer.textContent;
  }, 1000);
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
const playRecordedAudio = document.querySelector(".button_play_pause_voice_recording > button"); //prettier-ignore
let voice_playing = false;
let progress;

playRecordedAudio.addEventListener("click", function (e) {
  if (audioVoiceUrl) {
    if (!voiceAudio) {
      voiceAudio = new Audio(audioVoiceUrl);
      voiceAudio.preload = "auto"; // Set preload to auto

      // Wait for metadata to load
      voiceAudio.addEventListener("loadedmetadata", () => {
        // The below conditional statement is compulsory for getting accurate audio duration for a blob type
        if (voiceAudio.duration === Infinity) {
          voiceAudio.currentTime = 1e101;
          voiceAudio.ontimeupdate = () => {
            voiceAudio.ontimeupdate = null;
            voiceAudio.currentTime = 0;
          };
        }
      });

      voiceAudio.addEventListener("timeupdate", () => {
        const progress = (voiceAudio.currentTime / voiceAudio.duration) * 100;
        setProgress(progress, recordedItem.querySelector(".voice_progress-ring__circle"));
      });
    }

    const playSVG = this.querySelector(".voice_play");
    const pauseSVG = this.querySelector(".voice_pause");

    if (!voice_playing) {
      voiceAudio.play();
      playSVG.classList.add(HIDDEN);
      pauseSVG.classList.remove(HIDDEN);
      voice_playing = !voice_playing;
    } else {
      voiceAudio.pause();
      playSVG.classList.remove(HIDDEN);
      pauseSVG.classList.add(HIDDEN);
      voice_playing = !voice_playing;
    }

    voiceAudio.addEventListener("ended", () => {
      playSVG.classList.remove(HIDDEN);
      pauseSVG.classList.add(HIDDEN);
      voice_playing = false;
    });
  }
});

// function that handle music circle rotating
function setProgress(percent, circle) {
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

// REMOVE RECORDING
const removeRecordButton = document.getElementById("remove_record");

removeRecordButton.addEventListener("click", function () {
  audioVoiceUrl = "";
  waveformContainer.innerHTML = "";
  waveformContainer.classList.remove(HIDDEN);
  recordedItem.classList.add(HIDDEN);
});

// ADD RECORDING
let voiceRecords = [];
const recordedIcons = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" id="play" viewBox="0 0 32 32"><path fill="none" d="M11 23a1 1 0 0 1-1-1V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788l-12 6A1 1 0 0 1 11 23"/><path fill="white" d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2m7.447 14.895l-12 6A1 1 0 0 1 10 22V10a1 1 0 0 1 1.447-.894l12 6a1 1 0 0 1 0 1.788"/></svg>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" id="pause" class="hidden-page" viewBox="0 0 256 256"><path fill="white" d="M216 48v160a16 16 0 0 1-16 16h-40a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h40a16 16 0 0 1 16 16M96 32H56a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h40a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16"/></svg>
`;
addRecording.addEventListener("click", function (e) {
  const containerCollaborationRect = containerCollaboration.getBoundingClientRect();

  // Calculate the middle x and y positions
  const middleX = containerCollaborationRect.width / 2;
  const middleY = containerCollaborationRect.height / 2;

  // Update the Recording List
  const voiceId = voiceRecords.length + 1;

  voiceRecords.push({
    id: voiceId,
    url: audioVoiceUrl,
    time: currentRecordTime,
  });

  // Wrapper
  const recordingWrapper = document.createElement("div");
  recordingWrapper.className = "recording_wrapper";
  recordingWrapper.style.top = middleY + "px";
  recordingWrapper.style.left = middleX + "px";

  // Nested Wrapper
  const nestedWrapper = document.createElement("div");
  nestedWrapper.className = "nested_wrapper";

  // Remove Button
  const removeButton = document.createElement("button");
  removeButton.className = "remove_recording";
  removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="none" stroke="red" stroke-linecap="round" stroke-width="2" d="M6 18L18 6m0 12L6 6"/></svg>`;

  removeButton.addEventListener("click", () => {
    voiceRecords = voiceRecords.filter((voice) => voice.id !== voiceId);
    recordingWrapper.remove();
  });

  const playButton = document.createElement("button");
  playButton.className = "play_button";
  playButton.innerHTML = recordedIcons;
  playButton.setAttribute("data-voice", voiceId);
  playButton.setAttribute("data-mode", "idle");

  nestedWrapper.appendChild(playButton);
  nestedWrapper.appendChild(removeButton);
  recordingWrapper.appendChild(nestedWrapper);
  containerCollaboration.appendChild(recordingWrapper);

  appendRecordingToUI(voiceRecords);

  // Update Voice Container
  audioVoiceUrl = "";
  waveformContainer.innerHTML = "";
  waveformContainer.classList.remove(HIDDEN);
  recordedItem.classList.add(HIDDEN);
  recordingContainer.classList.add(HIDDEN);
  addRecording.classList.add(HIDDEN);
});

const personRecordingList = document.querySelector(".recordings_list_wrapper");
function appendRecordingToUI(records) {
  personRecordingList.innerHTML = "";

  const markup = `
        <div class="person person--1">
          <div class="details">
            <img src="./icons/Avatar.svg" alt="Musa Abdulkabir" />
            <h2>Musa Abdulkabir</h2>
          </div>

          <div class="person_recordings">
            ${records
              .map((record) => {
                return `<div class="person_recording" data-voice="${record.id}">
                <div class="recording--icon">
                  <!-- prettier-ignore -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#D5D5D5" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3"/><path fill="#D5D5D5" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92z"/></svg>
                </div>

                <div>
                  <h3>Recording</h3>
                  <p>${record.time}</p>
                </div>

                <div class="button_play_pause_voice_recording" data-mode="idle">
                      <svg class="voice_progress-ring" width="50" height="50">
                        <circle class="voice_progress-ring__circle--bg" stroke="#f3f3f3" stroke-width="4" fill="transparent" r="20" cx="25" cy="25"></circle>
                        <circle class="voice_progress-ring__circle" stroke="#8837E9" stroke-width="4" fill="transparent" r="20" cx="25" cy="25" style="stroke-dashoffset: 125.664; stroke-dasharray: 125.664, 125.664"></circle>
                      </svg>

                      <button>
                        <!-- prettier-ignore -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="voice_play" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path><path fill="#222222" d="M5.669 4.76a1.47 1.47 0 0 1 2.04-1.177c1.062.454 3.442 1.533 6.462 3.276c3.021 1.744 5.146 3.267 6.069 3.958c.788.591.79 1.763.001 2.356c-.914.687-3.013 2.19-6.07 3.956c-3.06 1.766-5.412 2.832-6.464 3.28c-.906.387-1.92-.2-2.038-1.177c-.138-1.142-.396-3.735-.396-7.237c0-3.5.257-6.092.396-7.235"></path></g></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" class="voice_pause hidden-page" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                          <rect width="4" height="14" x="6" y="5" fill="#222222" rx="1"></rect>
                          <rect width="4" height="14" x="14" y="5" fill="#222222" rx="1"></rect>
                        </svg>
                      </button>
                    </div>
              </div>`;
              })
              .join("")}
          </div>
        </div>
    `;

  personRecordingList.insertAdjacentHTML("afterbegin", markup);
}

let playingAudio;
let playingRecord = false;

personRecordingList.addEventListener("click", function (e) {
  const playVoice = e.target.closest(".button_play_pause_voice_recording");

  if (playVoice) {
    // check if it is playing / pause / idle
    const { mode } = playVoice.dataset;
    const playIcon = playVoice.querySelector(".voice_play");
    const pauseIcon = playVoice.querySelector(".voice_pause");

    // This gives the wrapper container a purple border
    document.querySelectorAll(".person").forEach((person) => person.classList.remove("active"));
    playVoice.closest(".person").classList.add("active");

    // IDLE MODE
    if (mode === "idle") {
      const { voice } = playVoice.closest(".person_recording").dataset;
      const toBePlayVoice = voiceRecords.find((record) => record.id === +voice);

      playingAudio = new Audio(toBePlayVoice.url);
      playingAudio.preload = "auto"; // Set preload to auto

      // Wait for metadata to load
      playingAudio.addEventListener("loadedmetadata", () => {
        // The below conditional statement is compulsory for getting accurate audio duration for a blob type
        if (playingAudio.duration === Infinity) {
          playingAudio.currentTime = 1e101;
          playingAudio.ontimeupdate = () => {
            playingAudio.ontimeupdate = null;
            playingAudio.currentTime = 0;
          };
        }
      });

      playingAudio.addEventListener("timeupdate", () => {
        const progress = (playingAudio.currentTime / playingAudio.duration) * 100;
        setProgress(progress, playVoice.querySelector(".voice_progress-ring__circle"));
      });

      playingAudio.play();
      playIcon.classList.add(HIDDEN);
      pauseIcon.classList.remove(HIDDEN);

      playingAudio.addEventListener("ended", () => {
        playIcon.classList.remove(HIDDEN);
        pauseIcon.classList.add(HIDDEN);
        playVoice.setAttribute("data-mode", "idle");
      });

      playVoice.setAttribute("data-mode", "playing");
      return;
    }

    // PLAYING MODE
    if (mode === "playing") {
      playingAudio.pause();
      playIcon.classList.remove(HIDDEN);
      pauseIcon.classList.add(HIDDEN);
      playVoice.setAttribute("data-mode", "pause");
      return;
    }

    if (mode === "pause") {
      playingAudio.play();
      playIcon.classList.add(HIDDEN);
      pauseIcon.classList.remove(HIDDEN);
      playVoice.setAttribute("data-mode", "playing");
      return;
    }

    // Clear any existing audio
    // if (playingAudio) {
    //   clearAudio();
    // }
  }
});

function clearAudio() {
  playingAudio.pause();
  playingAudio.currentTime = 0;
}
